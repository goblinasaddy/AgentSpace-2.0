import { NextRequest } from "next/server";
import { submitVote } from "@/modules/battles/service";
import { requireAuth } from "@/infrastructure/auth/guard";
import { successResponse, errorResponse } from "@/infrastructure/api/response";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authUser = requireAuth(req);

    const body = await req.json();
    if (!body.preferredVersionId) {
      return errorResponse("VALIDATION_ERROR", "preferredVersionId is required", [], 400);
    }

    const vote = await submitVote(authUser.userId, id, body.preferredVersionId, body.comment);
    return successResponse(vote);
  } catch (err: any) {
    const status = err.message.includes("Authentication required") ? 401 : 400;
    return errorResponse("SUBMIT_VOTE_FAILED", err.message || "Failed to submit battle vote", [], status);
  }
}
