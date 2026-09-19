import { NextRequest } from "next/server";
import { registerUser } from "@/modules/auth/service";
import { successResponse, errorResponse } from "@/infrastructure/api/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await registerUser(body);
    return successResponse(user, {}, 201);
  } catch (err: any) {
    return errorResponse("REGISTRATION_FAILED", err.message || "Registration failed", [], 400);
  }
}
