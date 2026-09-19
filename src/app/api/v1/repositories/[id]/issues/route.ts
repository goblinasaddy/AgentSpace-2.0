import { NextRequest } from "next/server";
import { requireAuth, getAuthUser } from "@/infrastructure/auth/guard";
import { assertRepoAccess } from "@/infrastructure/auth/authorization";
import { createIssue, listIssues, closeIssue } from "@/modules/issues/service";
import { successResponse, errorResponse } from "@/infrastructure/api/response";
import { IssueStatus } from "@prisma/client";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: repoId } = await params;
    const authUser = getAuthUser(req);

    await assertRepoAccess(authUser?.userId || null, repoId);

    const statusParam = req.nextUrl.searchParams.get("status") as IssueStatus | null;
    const issues = await listIssues(repoId, statusParam || undefined);

    return successResponse(issues);
  } catch (err: any) {
    const status = err.message?.includes("Access denied") ? 403 : 500;
    return errorResponse("FETCH_ISSUES_FAILED", err.message, [], status);
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = requireAuth(req);
    const { id: repoId } = await params;

    await assertRepoAccess(authUser.userId, repoId);

    const body = await req.json();
    const issue = await createIssue(authUser.userId, {
      repositoryId: repoId,
      title: body.title,
      body: body.body,
    });

    return successResponse(issue, {}, 201);
  } catch (err: any) {
    return errorResponse("CREATE_ISSUE_FAILED", err.message, [], 400);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = requireAuth(req);
    const body = await req.json();

    if (body.action === "close" && body.issueId) {
      const closed = await closeIssue(authUser.userId, body.issueId);
      return successResponse(closed);
    }

    return errorResponse("BAD_REQUEST", "Invalid issue update action", [], 400);
  } catch (err: any) {
    const status = err.message?.includes("Unauthorized") ? 403 : 400;
    return errorResponse("UPDATE_ISSUE_FAILED", err.message, [], status);
  }
}
