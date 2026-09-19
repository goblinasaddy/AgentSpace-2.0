import { NextRequest } from "next/server";
import { getAuthUser } from "@/infrastructure/auth/guard";
import { assertRunAccess } from "@/infrastructure/auth/authorization";
import { successResponse, errorResponse } from "@/infrastructure/api/response";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authUser = getAuthUser(req);
    const run = await assertRunAccess(authUser?.userId || null, id);

    return successResponse(run);
  } catch (err: any) {
    const status = err.name === "ForbiddenError" ? 403 : err.message.includes("not found") ? 404 : 500;
    return errorResponse("FETCH_RUN_FAILED", err.message || "Failed to fetch run", [], status);
  }
}
