import { test, expect } from "@playwright/test";

test.describe("AgentSpace 2.0 E2E Vertical Slice", () => {
  test("should render the AgentSpace platform dashboard", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("The Home for AI Agents");
    await expect(page.getByRole("link", { name: "Explore Agents" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Trust & Verification" }).first()).toBeVisible();
  });

  test("should navigate to Explore marketplace", async ({ page }) => {
    await page.goto("/explore");
    await expect(page.locator("h1")).toContainText("Marketplace Discovery");
    await expect(page.getByRole("button", { name: "Search", exact: true })).toBeVisible();
  });

  test("should navigate to Verification center", async ({ page }) => {
    await page.goto("/verification");
    await expect(page.locator("h1")).toContainText("Verification Center & Trust Assurance");
  });
});
