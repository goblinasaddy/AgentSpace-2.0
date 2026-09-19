import { NextRequest } from "next/server";
import { enqueueExecutionJob } from "@/modules/runtime/executor";
import { requireAuth, getAuthUser } from "@/infrastructure/auth/guard";
import { assertAgentAccess } from "@/infrastructure/auth/authorization";
import { rateLimit } from "@/infrastructure/security/ratelimit";
import { prisma } from "@/infrastructure/database/client";
import { successResponse, errorResponse } from "@/infrastructure/api/response";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: agentId } = await params;
    const authUser = requireAuth(req);

    // Rate Limiting Protection (10 runs / min per user)
    const rateLimitCheck = await rateLimit(`runs:${authUser.userId}`, 10, 60);
    if (!rateLimitCheck.success) {
      return errorResponse("RATE_LIMIT_EXCEEDED", "Rate limit exceeded for agent runs. Try again shortly.", [], 429);
    }

    await assertAgentAccess(authUser.userId, agentId);

    const body = await req.json();

    let versionId = body.agentVersionId;
    if (!versionId) {
      const latestVersion = await prisma.agentVersion.findFirst({
        where: { agentId },
        orderBy: { publishedAt: "desc" },
      });

      if (!latestVersion) {
        return errorResponse("NO_PUBLISHED_VERSION", "Agent has no published versions to execute.", [], 400);
      }
      versionId = latestVersion.id;
    }

    // Async execution architecture: returns 202 Accepted + runId
    const run = await enqueueExecutionJob({
      agentVersionId: versionId,
      userId: authUser.userId,
      input: body.input,
    });

    return successResponse(run, { message: "Execution job enqueued." }, 202);
  } catch (err: any) {
    const status = err.message.includes("Authentication required") ? 401 : err.name === "ForbiddenError" ? 403 : 500;
    return errorResponse("EXECUTION_FAILED", err.message || "Failed to execute agent run", [], status);
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: agentId } = await params;
    const authUser = getAuthUser(req);
    await assertAgentAccess(authUser?.userId || null, agentId);

    const runs = await prisma.run.findMany({
      where: {
        agentVersion: {
          agentId,
        },
      },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        agentVersion: {
          select: { id: true, version: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return successResponse(runs);
  } catch (err: any) {
    const status = err.name === "ForbiddenError" ? 403 : 500;
    return errorResponse("FETCH_RUNS_FAILED", err.message || "Failed to fetch agent runs", [], status);
  }
}
