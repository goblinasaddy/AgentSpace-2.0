import { NextRequest } from "next/server";
import { searchMarketplace } from "@/modules/marketplace/search";
import { successResponse, errorResponse } from "@/infrastructure/api/response";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || undefined;
    const category = searchParams.get("category") || undefined;
    const tag = searchParams.get("tag") || undefined;
    const verifiedOnly = searchParams.get("verifiedOnly") === "true";
    const sortBy = (searchParams.get("sortBy") as any) || "popular";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const results = await searchMarketplace({
      query,
      category,
      tag,
      verifiedOnly,
      sortBy,
      page,
      limit,
    });

    return successResponse(results.items, results.pagination);
  } catch (err: any) {
    return errorResponse("MARKETPLACE_SEARCH_FAILED", err.message || "Failed to perform search", [], 500);
  }
}
