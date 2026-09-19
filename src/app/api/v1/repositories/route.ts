import { NextRequest } from "next/server";
import { createRepository } from "@/modules/repositories/service";
import { requireAuth } from "@/infrastructure/auth/guard";
import { successResponse, errorResponse } from "@/infrastructure/api/response";
import { prisma } from "@/infrastructure/database/client";

export async function POST(req: NextRequest) {
  try {
    const authUser = requireAuth(req);
    const body = await req.json();
    const repository = await createRepository(authUser.userId, body);
    return successResponse(repository, {}, 201);
  } catch (err: any) {
    const status = err.message.includes("Authentication required") ? 401 : 400;
    return errorResponse("CREATE_REPOSITORY_FAILED", err.message || "Failed to create repository", [], status);
  }
}

export async function GET() {
  try {
    const repositories = await prisma.repository.findMany({
      where: { visibility: "PUBLIC" },
      include: {
        owner: {
          select: { id: true, username: true, displayName: true, avatarUrl: true },
        },
        agents: {
          include: {
            versions: {
              orderBy: { publishedAt: "desc" },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return successResponse(repositories);
  } catch (err: any) {
    return errorResponse("FETCH_REPOSITORIES_FAILED", err.message || "Failed to fetch repositories", [], 500);
  }
}
