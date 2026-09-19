import { NextRequest } from "next/server";
import { verifyToken, TokenPayload } from "@/modules/auth/jwt";

export function getAuthUser(req: NextRequest): TokenPayload | null {
  // 1. Check Authorization header: Bearer <token>
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    const payload = verifyToken(token);
    if (payload) return payload;
  }

  // 2. Check Cookie: agentspace_session
  const sessionCookie = req.cookies.get("agentspace_session");
  if (sessionCookie && sessionCookie.value) {
    const payload = verifyToken(sessionCookie.value);
    if (payload) return payload;
  }

  return null;
}

export function requireAuth(req: NextRequest): TokenPayload {
  const user = getAuthUser(req);
  if (!user) {
    throw new Error("Authentication required. Please provide a valid Bearer token or session cookie.");
  }
  return user;
}
