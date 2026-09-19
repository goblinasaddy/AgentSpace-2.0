import { NextRequest } from "next/server";
import { requireAuth } from "@/infrastructure/auth/guard";
import { assertRepoAccess } from "@/infrastructure/auth/authorization";
import { createAgent, getAgentById } from "@/modules/agents/service";
import { successResponse, errorResponse } from "@/infrastructure/api/response";
import { prisma } from "@/infrastructure/database/client";

export async function POST(req: NextRequest) {
  try {
    const authUser = requireAuth(req);
    const body = await req.json();

    const agent = await createAgent(authUser.userId, body);
    return successResponse(agent, {}, 201);
  } catch (err: any) {
    const status = err.message?.includes("Unauthorized") ? 403 : err.message?.includes("required") ? 400 : 500;
    return errorResponse("AGENT_CREATION_FAILED", err.message, [], status);
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const repoId = url.searchParams.get("repositoryId");
    const agentId = url.searchParams.get("id");

    if (agentId) {
      const agent = await getAgentById(agentId);
      if (!agent) {
        return errorResponse("NOT_FOUND", "Agent not found", [], 404);
      }
      return successResponse(agent);
    }

    if (repoId) {
      const agents = await prisma.agent.findMany({
        where: { repositoryId: repoId },
        include: {
          versions: {
            orderBy: { publishedAt: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return successResponse(agents);
    }

    return errorResponse("BAD_REQUEST", "Either 'id' or 'repositoryId' query parameter is required.", [], 400);
  } catch (err: any) {
    return errorResponse("SERVER_ERROR", err.message, [], 500);
  }
}
