import { test, expect } from "@playwright/test";

test.describe("AgentSpace 2.0 Full Ecosystem Integration E2E", () => {
  test("1. Platform Load & Orientation", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("The Home for AI Agents");
    await expect(page.getByRole("link", { name: "Explore Agents" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Build Agent" }).first()).toBeVisible();
  });

  test("2. User Authentication Modal Trigger", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Sign In / Register" }).click();
    await expect(page.getByText("Authenticate Session")).toBeVisible();
  });

  test("3. Explore Marketplace & Search Page", async ({ page }) => {
    await page.goto("/explore");
    await expect(page.locator("h1")).toContainText("Marketplace Discovery");
    await expect(page.getByRole("button", { name: "Search", exact: true })).toBeVisible();
  });

  test("4. Battle Mode Arena Page", async ({ page }) => {
    await page.goto("/battle");
    await expect(page.locator("h1")).toContainText("Battle Mode Arena");
    await expect(page.getByRole("button", { name: "Initiate Battle" })).toBeVisible();
  });

  test("5. Verification Center Page", async ({ page }) => {
    await page.goto("/verification");
    await expect(page.locator("h1")).toContainText("Verification Center & Trust Assurance");
    await expect(page.getByRole("button", { name: "Request Automated Security Screening" })).toBeVisible();
  });

  test("6. Developer Workspace Dashboard Page", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("h1")).toContainText("Developer Workspace & Dashboard");
  });
});
