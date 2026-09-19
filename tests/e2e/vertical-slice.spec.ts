import { test, expect } from "@playwright/test";

test.describe("AgentSpace 2.0 E2E Vertical Slice", () => {
  test("should render the AgentSpace platform dashboard", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("AgentSpace Platform Workspace");
    await expect(page.getByRole("button", { name: "Repositories" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Publish Version" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Run Workspace" })).toBeVisible();
  });

  test("should switch tabs to Run Workspace and execute async job", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Run Workspace" }).click();
    await expect(page.getByText("Async Agent Execution Workspace")).toBeVisible();
    await page.getByRole("button", { name: "Enqueue Async Run Job" }).click();
    await expect(page.getByText("COMPLETED")).toBeVisible({ timeout: 10000 });
  });
});
