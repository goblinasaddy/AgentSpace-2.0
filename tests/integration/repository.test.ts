import { describe, it, expect } from "vitest";
import { RegisterUserSchema } from "../../src/modules/auth/service";
import { CreateRepositorySchema } from "../../src/modules/repositories/service";
import { CreateAgentSchema } from "../../src/modules/agents/service";
import { parseAgentSpec } from "../../src/modules/agents/spec.schema";

describe("Domain Validation & Serialization Tests", () => {
  it("should validate correct user registration input", () => {
    const input = {
      username: "lead_dev",
      email: "lead@agentspace.ai",
      password: "securepassword123",
      displayName: "Lead Engineer",
    };
    const validated = RegisterUserSchema.parse(input);
    expect(validated.username).toBe("lead_dev");
    expect(validated.email).toBe("lead@agentspace.ai");
  });

  it("should reject invalid repository slugs", () => {
    const invalidInput = {
      name: "My Agent",
      slug: "invalid slug with spaces!",
    };
    expect(() => CreateRepositorySchema.parse(invalidInput)).toThrow();
  });

  it("should validate agent creation input", () => {
    const input = {
      repositoryId: "cl123456",
      name: "Research Bot",
      type: "INPUT_OUTPUT",
    };
    const validated = CreateAgentSchema.parse(input);
    expect(validated.name).toBe("Research Bot");
  });

  it("should validate complex Agent Specification for publishing", () => {
    const yamlSpec = `
apiVersion: agentspace/v1
kind: Agent
metadata:
  name: code-analyzer
  version: 2.1.0
  description: Analyzes TypeScript codebases for architectural bugs.
spec:
  type: input-output
  runtime:
    provider: gemini
    model: gemini-2.5-flash
    systemPrompt: You are a senior static analysis engine.
  input:
    schema:
      type: object
      properties:
        code:
          type: string
  output:
    schema:
      type: object
      properties:
        issues:
          type: array
`;
    const parsed = parseAgentSpec(yamlSpec);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.metadata.version).toBe("2.1.0");
      expect(parsed.data.spec.runtime.provider).toBe("gemini");
    }
  });
});
