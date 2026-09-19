import { prisma } from "@/infrastructure/database/client";
import { RunStatus } from "@prisma/client";
import { executionQueue } from "@/infrastructure/queue/execution.queue";
import "@/workers/runtime.worker"; // Register worker listener

export interface EnqueueExecutionInput {
  agentVersionId: string;
  userId: string;
  input: any;
}

export async function enqueueExecutionJob(params: EnqueueExecutionInput) {
  const agentVersion = await prisma.agentVersion.findUnique({
    where: { id: params.agentVersionId },
  });

  if (!agentVersion) {
    throw new Error("Agent version not found.");
  }

  const config = agentVersion.configuration as any;
  const providerName = (config?.spec?.runtime?.provider || "gemini").toLowerCase();
  const modelName = config?.spec?.runtime?.model || "gemini-2.5-flash";

  // Create initial QUEUED Run record
  const run = await prisma.run.create({
    data: {
      agentVersionId: agentVersion.id,
      userId: params.userId,
      input: params.input,
      modelProvider: providerName,
      modelName: modelName,
      status: RunStatus.QUEUED,
    },
  });

  // Enqueue job to worker queue
  await executionQueue.addJob({ runId: run.id });

  return run;
}
