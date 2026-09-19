import { getTemplates } from "@/modules/creation/templates";
import { successResponse, errorResponse } from "@/infrastructure/api/response";

export async function GET() {
  try {
    const templates = getTemplates();
    return successResponse(templates);
  } catch (err: any) {
    return errorResponse("FETCH_TEMPLATES_FAILED", err.message || "Failed to fetch starter templates", [], 500);
  }
}
