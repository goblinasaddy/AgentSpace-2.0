import { NextRequest } from "next/server";
import { requireAuth, getAuthUser } from "@/infrastructure/auth/guard";
import { assertRepoAccess } from "@/infrastructure/auth/authorization";
import { starRepository, unstarRepository, getStarCount, hasUserStarred } from "@/modules/repositories/stars";
import { successResponse, errorResponse } from "@/infrastructure/api/response";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: repoId } = await params;
    const authUser = getAuthUser(req);

    await assertRepoAccess(authUser?.userId || null, repoId);

    const count = await getStarCount(repoId);
    const starred = authUser ? await hasUserStarred(authUser.userId, repoId) : false;

    return successResponse({ count, starred });
  } catch (err: any) {
    return errorResponse("STAR_INFO_FAILED", err.message, [], 500);
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = requireAuth(req);
    const { id: repoId } = await params;

    await assertRepoAccess(authUser.userId, repoId);

    const star = await starRepository(authUser.userId, repoId);
    return successResponse(star, {}, 201);
  } catch (err: any) {
    return errorResponse("STAR_FAILED", err.message, [], 400);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = requireAuth(req);
    const { id: repoId } = await params;

    await assertRepoAccess(authUser.userId, repoId);

    const unstarred = await unstarRepository(authUser.userId, repoId);
    return successResponse({ unstarred });
  } catch (err: any) {
    return errorResponse("UNSTAR_FAILED", err.message, [], 400);
  }
}
