import { NextRequest } from "next/server";
import { requireAuth } from "@/infrastructure/auth/guard";
import { assertRepoAccess } from "@/infrastructure/auth/authorization";
import { forkRepository } from "@/modules/repositories/fork";
import { successResponse, errorResponse } from "@/infrastructure/api/response";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = requireAuth(req);
    const { id: repoId } = await params;

    await assertRepoAccess(authUser.userId, repoId);

    const body = await req.json().catch(() => ({}));
    const forkedRepo = await forkRepository(authUser.userId, repoId, body.customSlug);

    return successResponse(forkedRepo, {}, 201);
  } catch (err: any) {
    const status = err.message?.includes("already have a repository") ? 409 : err.message?.includes("not found") ? 404 : 400;
    return errorResponse("FORK_FAILED", err.message, [], status);
  }
}
