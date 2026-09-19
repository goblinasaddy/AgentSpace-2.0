import { describe, it, expect } from "vitest";
import { signToken, verifyToken } from "../../src/modules/auth/jwt";

describe("Phase 7.2 Independent JWT Authentication Security Tests", () => {
  it("should sign and verify valid JWT token", () => {
    const token = signToken({ userId: "user_123", username: "alice" });
    expect(token).toBeDefined();

    const payload = verifyToken(token);
    expect(payload).not.toBeNull();
    expect(payload?.userId).toBe("user_123");
    expect(payload?.username).toBe("alice");
  });

  it("should reject forged JWT token signatures", () => {
    const validToken = signToken({ userId: "user_123", username: "alice" });
    const parts = validToken.split(".");
    // Tamper with payload
    const forgedToken = `${parts[0]}.${parts[1]}tampered.${parts[2]}`;
    expect(verifyToken(forgedToken)).toBeNull();
  });

  it("should reject malformed token strings", () => {
    expect(verifyToken("invalid.token")).toBeNull();
    expect(verifyToken("not-a-jwt")).toBeNull();
    expect(verifyToken("")).toBeNull();
  });

  it("should reject expired tokens", () => {
    // Generate token with negative expiration (-10 seconds)
    const expiredToken = signToken({ userId: "user_123", username: "alice" }, -10);
    expect(verifyToken(expiredToken)).toBeNull();
  });
});
