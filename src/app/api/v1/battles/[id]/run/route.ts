import { NextRequest } from "next/server";
import { executeBattle } from "@/modules/battles/service";
import { requireAuth } from "@/infrastructure/auth/guard";
import { successResponse, errorResponse } from "@/infrastructure/api/response";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const authUser = requireAuth(req);

    const battle = await executeBattle(authUser.userId, id);
    return successResponse(battle);
  } catch (err: any) {
    const status = err.message.includes("Authentication required") ? 401 : 500;
    return errorResponse("EXECUTE_BATTLE_FAILED", err.message || "Failed to execute battle session", [], status);
  }
}
