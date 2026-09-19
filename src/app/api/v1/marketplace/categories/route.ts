import { getCategories } from "@/modules/marketplace/taxonomy";
import { successResponse, errorResponse } from "@/infrastructure/api/response";

export async function GET() {
  try {
    const categories = await getCategories();
    return successResponse(categories);
  } catch (err: any) {
    return errorResponse("FETCH_CATEGORIES_FAILED", err.message || "Failed to fetch categories", [], 500);
  }
}
