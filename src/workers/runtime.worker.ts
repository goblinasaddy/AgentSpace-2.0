import { prisma } from "@/infrastructure/database/client";
import { GeminiProvider } from "@/infrastructure/ai/gemini.provider";
import { ModelProvider } from "@/infrastructure/ai/provider.interface";
import { RunStatus } from "@prisma/client";
import { assertValidRunStateTransition } from "@/modules/runtime/state-machine";
import { sanitizeErrorMessage, sanitizePayload } from "@/infrastructure/security/sanitizer";
import { executionQueue, ExecutionJobData } from "@/infrastructure/queue/execution.queue";

const providers: Record<string, ModelProvider> = {
  gemini: new GeminiProvider(),
};

export async function processExecutionJob(job: ExecutionJobData) {
  const run = await prisma.run.findUnique({
    where: { id: job.runId },
    include: {
      agentVersion: {
        include: {
          agent: {
            include: { repository: true },
          },
        },
      },
    },
  });

  if (!run) return;

  // Enforce State Machine: QUEUED -> RUNNING
  assertValidRunStateTransition(run.status, RunStatus.RUNNING);

  await prisma.run.update({
    where: { id: run.id },
    data: { status: RunStatus.RUNNING },
  });

  const config = run.agentVersion.configuration as any;
  const providerName = (config?.spec?.runtime?.provider || "gemini").toLowerCase();
  const modelName = config?.spec?.runtime?.model || "gemini-2.5-flash";
  const systemPrompt = config?.spec?.runtime?.systemPrompt;

  const provider = providers[providerName];
  if (!provider) {
    const errorMsg = sanitizeErrorMessage(`Unsupported model provider: '${providerName}'. Available: ${Object.keys(providers).join(", ")}`);
    return prisma.run.update({
      where: { id: run.id },
      data: {
        status: RunStatus.FAILED,
        errorCode: "UNSUPPORTED_PROVIDER",
        errorMessage: errorMsg,
      },
    });
  }

  // Execution Isolation & Sandbox Boundary: Timeout limit (30 seconds)
  const TIMEOUT_MS = 30000;
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Execution Timed Out: Execution exceeded maximum allowed duration of 30 seconds.")), TIMEOUT_MS);
  });

  try {
    const executionPromise = provider.execute({
      model: modelName,
      systemPrompt,
      input: run.input,
      schema: run.agentVersion.outputSchema as any,
    });

    const result = await Promise.race([executionPromise, timeoutPromise]);

    const sanitizedOutput = sanitizePayload(result.json || { result: result.text });

    const updatedRun = await prisma.run.update({
      where: { id: run.id },
      data: {
        status: RunStatus.COMPLETED,
        output: sanitizedOutput,
        latencyMs: result.latencyMs,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        estimatedCost: calculateEstimatedCost(providerName, modelName, result.inputTokens || 0, result.outputTokens || 0),
      },
    });

    await prisma.contributionEvent.create({
      data: {
        userId: run.userId,
        repositoryId: run.agentVersion.agent.repositoryId,
        eventType: "RUN_EXECUTED",
        metadata: { runId: updatedRun.id, agentVersionId: run.agentVersion.id },
      },
    });

    return updatedRun;
  } catch (err: any) {
    const isTimeout = err.message && err.message.includes("Timed Out");
    const targetStatus = isTimeout ? RunStatus.TIMED_OUT : RunStatus.FAILED;

    return prisma.run.update({
      where: { id: run.id },
      data: {
        status: targetStatus,
        errorCode: isTimeout ? "EXECUTION_TIMEOUT" : "RUNTIME_EXECUTION_ERROR",
        errorMessage: sanitizeErrorMessage(err.message || String(err)),
      },
    });
  }
}

function calculateEstimatedCost(provider: string, model: string, inputTokens: number, outputTokens: number): number {
  if (provider === "gemini") {
    return (inputTokens / 1_000_000) * 0.075 + (outputTokens / 1_000_000) * 0.30;
  }
  return 0.0;
}

// Subscribe worker listener
executionQueue.on("job", (job: ExecutionJobData) => {
  processExecutionJob(job).catch((err) => {
    console.error("Worker processing error:", err);
  });
});
