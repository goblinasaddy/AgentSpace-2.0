import { describe, it, expect, vi } from "vitest";
import { GeminiProvider } from "../../src/infrastructure/ai/gemini.provider";

describe("Gemini Provider Unit Test", () => {
  it("should initialize provider with name 'gemini'", () => {
    const provider = new GeminiProvider();
    expect(provider.providerName).toBe("gemini");
  });
});
