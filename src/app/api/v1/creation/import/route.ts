import { NextRequest } from "next/server";
import { importRepository } from "@/modules/creation/auto-builder";
import { requireAuth } from "@/infrastructure/auth/guard";
import { successResponse, errorResponse } from "@/infrastructure/api/response";

export async function POST(req: NextRequest) {
  try {
    const authUser = requireAuth(req);
    const body = await req.json();
    const result = await importRepository(authUser.userId, body);
    return successResponse(result, {}, 201);
  } catch (err: any) {
    const status = err.message.includes("Authentication required") ? 401 : 400;
    return errorResponse("IMPORT_REPOSITORY_FAILED", err.message || "Failed to import repository", [], status);
  }
}
