import { NextRequest } from "next/server";
import { getBattleDetails } from "@/modules/battles/service";
import { successResponse, errorResponse } from "@/infrastructure/api/response";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const battle = await getBattleDetails(id);

    if (!battle) {
      return errorResponse("NOT_FOUND", "Battle session not found", [], 404);
    }

    return successResponse(battle);
  } catch (err: any) {
    return errorResponse("FETCH_BATTLE_FAILED", err.message || "Failed to fetch battle details", [], 500);
  }
}
