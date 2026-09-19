import { describe, it, expect } from "vitest";
import { DEFAULT_CATEGORIES } from "../../src/modules/marketplace/taxonomy";

describe("Phase 3 Marketplace & Taxonomy Tests", () => {
  it("should contain standard default categories", () => {
    expect(DEFAULT_CATEGORIES.length).toBeGreaterThanOrEqual(5);
    const codingCategory = DEFAULT_CATEGORIES.find((c) => c.slug === "coding");
    expect(codingCategory).toBeDefined();
    expect(codingCategory?.name).toBe("Coding & Engineering");
  });
});
