import { describe, it, expect } from "vitest";
import { CreateIssueSchema } from "../../src/modules/issues/service";
import { CreatePullRequestSchema } from "../../src/modules/pulls/service";

describe("Phase 2 Ecosystem Domain Logic Tests", () => {
  it("should validate issue creation inputs", () => {
    const input = {
      repositoryId: "repo_123",
      title: "Add support for streaming token outputs",
      body: "Agents should stream output chunks back to the client.",
    };

    const validated = CreateIssueSchema.parse(input);
    expect(validated.title).toBe("Add support for streaming token outputs");
    expect(validated.repositoryId).toBe("repo_123");
  });

  it("should reject invalid short issue titles", () => {
    const invalidInput = {
      repositoryId: "repo_123",
      title: "Hi",
      body: "Short title test",
    };

    expect(() => CreateIssueSchema.parse(invalidInput)).toThrow();
  });

  it("should validate pull request creation inputs", () => {
    const input = {
      repositoryId: "repo_456",
      sourceRepoId: "fork_789",
      title: "feat: add Gemini 2.5 Flash streaming adapter",
      description: "Implements real-time token streaming for low-latency runs.",
    };

    const validated = CreatePullRequestSchema.parse(input);
    expect(validated.title).toBe("feat: add Gemini 2.5 Flash streaming adapter");
    expect(validated.sourceRepoId).toBe("fork_789");
  });
});
