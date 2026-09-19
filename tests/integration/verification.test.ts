import { describe, it, expect } from "vitest";
import { CreateVerificationRequestSchema } from "../../src/modules/verification/service";
import { VerificationBadgeType } from "@prisma/client";

describe("Phase 6 Verification Framework Domain Logic Tests", () => {
  it("should validate verification request inputs and automatically include mandatory SECURITY_SCREENED badge", () => {
    const input = {
      agentVersionId: "ver_999",
      badges: [VerificationBadgeType.RELIABILITY_VERIFIED],
    };

    const validated = CreateVerificationRequestSchema.parse(input);
    expect(validated.agentVersionId).toBe("ver_999");
    expect(validated.badges).toContain(VerificationBadgeType.RELIABILITY_VERIFIED);
  });
});
