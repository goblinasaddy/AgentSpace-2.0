import { NextRequest } from "next/server";
import { getAuthUser } from "@/infrastructure/auth/guard";
import { successResponse, errorResponse } from "@/infrastructure/api/response";
import { prisma } from "@/infrastructure/database/client";

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return errorResponse("UNAUTHORIZED", "Authentication required", [], 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) {
      return errorResponse("NOT_FOUND", "User not found", [], 404);
    }

    return successResponse(user);
  } catch (err: any) {
    return errorResponse("SERVER_ERROR", err.message || "Failed to fetch user context", [], 500);
  }
}
