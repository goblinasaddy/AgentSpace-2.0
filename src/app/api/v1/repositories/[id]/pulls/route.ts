import { NextRequest } from "next/server";
import { requireAuth, getAuthUser } from "@/infrastructure/auth/guard";
import { assertRepoAccess } from "@/infrastructure/auth/authorization";
import { createPullRequest, listPullRequests, mergePullRequest } from "@/modules/pulls/service";
import { successResponse, errorResponse } from "@/infrastructure/api/response";
import { PullRequestStatus } from "@prisma/client";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: repoId } = await params;
    const authUser = getAuthUser(req);

    await assertRepoAccess(authUser?.userId || null, repoId);

    const statusParam = req.nextUrl.searchParams.get("status") as PullRequestStatus | null;
    const pulls = await listPullRequests(repoId, statusParam || undefined);

    return successResponse(pulls);
  } catch (err: any) {
    const status = err.message?.includes("Access denied") ? 403 : 500;
    return errorResponse("FETCH_PULLS_FAILED", err.message, [], status);
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = requireAuth(req);
    const { id: repoId } = await params;

    await assertRepoAccess(authUser.userId, repoId);

    const body = await req.json();
    const pr = await createPullRequest(authUser.userId, {
      repositoryId: repoId,
      sourceRepoId: body.sourceRepoId,
      title: body.title,
      description: body.description,
    });

    return successResponse(pr, {}, 201);
  } catch (err: any) {
    return errorResponse("CREATE_PR_FAILED", err.message, [], 400);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = requireAuth(req);
    const body = await req.json();

    if (body.action === "merge" && body.pullRequestId) {
      const merged = await mergePullRequest(authUser.userId, body.pullRequestId);
      return successResponse(merged);
    }

    return errorResponse("BAD_REQUEST", "Invalid pull request update action", [], 400);
  } catch (err: any) {
    const status = err.message?.includes("Unauthorized") ? 403 : 400;
    return errorResponse("UPDATE_PR_FAILED", err.message, [], status);
  }
}
