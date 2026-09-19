import { NextRequest } from "next/server";
import { generateAutoRepo } from "@/modules/creation/auto-builder";
import { successResponse, errorResponse } from "@/infrastructure/api/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.prompt) {
      return errorResponse("VALIDATION_ERROR", "Prompt is required for Auto Repo Builder", [], 400);
    }

    const result = await generateAutoRepo({ prompt: body.prompt });
    return successResponse(result);
  } catch (err: any) {
    return errorResponse("AUTO_BUILD_FAILED", err.message || "Failed to auto-build repository", [], 500);
  }
}
