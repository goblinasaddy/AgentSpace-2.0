import { NextRequest } from "next/server";
import { authenticateUser } from "@/modules/auth/service";
import { successResponse, errorResponse } from "@/infrastructure/api/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await authenticateUser(body);
    return successResponse(user);
  } catch (err: any) {
    return errorResponse("AUTHENTICATION_FAILED", err.message || "Authentication failed", [], 401);
  }
}
