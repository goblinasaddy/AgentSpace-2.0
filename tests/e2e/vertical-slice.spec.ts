import { test, expect } from "@playwright/test";

test.describe("AgentSpace 2.0 E2E Vertical Slice", () => {
  test("should render the AgentSpace platform dashboard", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("AgentSpace 2.0 Ecosystem Platform");
    await expect(page.getByRole("button", { name: "Repositories & Agents" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Publish Version" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Async Run Workspace" })).toBeVisible();
  });

  test("should switch tabs to Async Run Workspace", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Async Run Workspace" }).click();
    await expect(page.getByText("Async Agent Execution & Polling Workspace")).toBeVisible();
    await expect(page.getByRole("button", { name: "Enqueue Async Run Job" })).toBeVisible();
  });
});
