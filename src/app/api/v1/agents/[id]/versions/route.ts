import { NextRequest } from "next/server";
import { publishAgentVersion } from "@/modules/versions/service";
import { requireAuth, getAuthUser } from "@/infrastructure/auth/guard";
import { assertAgentAccess } from "@/infrastructure/auth/authorization";
import { prisma } from "@/infrastructure/database/client";
import { successResponse, errorResponse } from "@/infrastructure/api/response";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: agentId } = await params;
    const authUser = requireAuth(req);

    const body = await req.json();
    const version = await publishAgentVersion(authUser.userId, {
      agentId,
      rawSpec: body.rawSpec,
      releaseNotes: body.releaseNotes,
    });

    return successResponse(version, {}, 201);
  } catch (err: any) {
    const status = err.message.includes("Authentication required") ? 401 : err.name === "ForbiddenError" ? 403 : 400;
    return errorResponse("PUBLISH_VERSION_FAILED", err.message || "Failed to publish agent version", [], status);
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: agentId } = await params;
    const authUser = getAuthUser(req);
    await assertAgentAccess(authUser?.userId || null, agentId);

    const versions = await prisma.agentVersion.findMany({
      where: { agentId },
      orderBy: { publishedAt: "desc" },
      include: {
        publishedBy: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
      },
    });

    return successResponse(versions);
  } catch (err: any) {
    const status = err.name === "ForbiddenError" ? 403 : 500;
    return errorResponse("FETCH_VERSIONS_FAILED", err.message || "Failed to fetch agent versions", [], status);
  }
}
