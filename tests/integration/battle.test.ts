import { describe, it, expect } from "vitest";
import { CreateBattleSchema } from "../../src/modules/battles/service";

describe("Phase 5 Battle Mode Domain Logic Tests", () => {
  it("should validate battle creation inputs", () => {
    const input = {
      challenge: "Analyze the security vulnerabilities of a JWT authentication function.",
      agentVersionIds: ["ver_111", "ver_222"],
    };

    const validated = CreateBattleSchema.parse(input);
    expect(validated.challenge).toContain("security vulnerabilities");
    expect(validated.agentVersionIds.length).toBe(2);
  });

  it("should reject battle creation with fewer than 2 participants", () => {
    const invalidInput = {
      challenge: "Single agent test challenge",
      agentVersionIds: ["ver_111"],
    };

    expect(() => CreateBattleSchema.parse(invalidInput)).toThrow();
  });
});
