import { describe, it, expect } from "vitest";
import { generateAutoRepo } from "../../src/modules/creation/auto-builder";
import { getTemplates } from "../../src/modules/creation/templates";
import { parseAgentSpec } from "../../src/modules/agents/spec.schema";

describe("Phase 4 Creation & Auto Repo Builder Tests", () => {
  it("should return valid starter templates", () => {
    const templates = getTemplates();
    expect(templates.length).toBeGreaterThan(0);
    const codeReviewer = templates.find((t) => t.slug === "code-reviewer");
    expect(codeReviewer).toBeDefined();

    if (codeReviewer) {
      const parsed = parseAgentSpec(codeReviewer.rawSpec);
      expect(parsed.success).toBe(true);
    }
  });

  it("should auto-generate valid repository package from user prompt", async () => {
    const result = await generateAutoRepo({
      prompt: "Build an agent that extracts key metrics from PDF reports",
    });

    expect(result.name).toBeDefined();
    expect(result.slug).toBeDefined();
    expect(result.rawSpec).toBeDefined();

    const parsedSpec = parseAgentSpec(result.rawSpec);
    expect(parsedSpec.success).toBe(true);
  });
});
