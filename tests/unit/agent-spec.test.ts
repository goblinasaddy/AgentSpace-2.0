import { describe, it, expect } from "vitest";
import { parseAgentSpec } from "../../src/modules/agents/spec.schema";

describe("Agent Specification Parser", () => {
  it("should successfully parse a valid YAML Agent Specification", () => {
    const yamlSpec = `
apiVersion: agentspace/v1
kind: Agent
metadata:
  name: research-assistant
  version: 1.0.0
  description: A research agent for summarizing technical documents.
  categories:
    - research
  tags:
    - text-summarization
spec:
  type: input-output
  runtime:
    provider: gemini
    model: gemini-2.5-flash
    systemPrompt: You are an expert technical researcher.
  input:
    schema:
      type: object
      properties:
        query:
          type: string
  output:
    schema:
      type: object
      properties:
        summary:
          type: string
  capabilities:
    - text_generation
  permissions:
    network: false
    filesystem: false
`;

    const result = parseAgentSpec(yamlSpec);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.metadata.name).toBe("research-assistant");
      expect(result.data.metadata.version).toBe("1.0.0");
      expect(result.data.spec.runtime.provider).toBe("gemini");
      expect(result.data.spec.runtime.model).toBe("gemini-2.5-flash");
    }
  });

  it("should reject an invalid semver version string", () => {
    const invalidSpec = `
metadata:
  name: test-agent
  version: invalid-version
  description: Invalid version agent
spec:
  runtime:
    provider: gemini
    model: gemini-2.5-flash
`;

    const result = parseAgentSpec(invalidSpec);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Must be a valid semver string");
    }
  });
});
