import { test, expect } from "@playwright/test";

test.describe("AgentSpace 2.0 Full Ecosystem Integration E2E", () => {
  test("1. Platform Load & Navigation Tabs", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("AgentSpace 2.0 Ecosystem Platform");
    await expect(page.getByRole("button", { name: "Repositories & Agents" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Publish Version" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Async Run Workspace" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Marketplace Discovery" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Battle Mode" })).toBeVisible();
  });

  test("2. User Authentication UI Interaction", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Register" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });

  test("3. Repositories Workspace & Catalog View", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Persistent Repositories Catalog")).toBeVisible();
    await expect(page.getByRole("button", { name: "Create Repository" })).toBeVisible();
  });

  test("4. Async Run Workspace Enqueue UI", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Async Run Workspace" }).click();
    await expect(page.getByText("Async Agent Execution & Polling Workspace")).toBeVisible();
    await expect(page.getByRole("button", { name: "Enqueue Async Run Job" })).toBeVisible();
  });

  test("5. Marketplace Discovery Querying", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Marketplace Discovery" }).click();
    await expect(page.getByText("Marketplace Discovery System")).toBeVisible();
    await page.getByRole("button", { name: "Search Database" }).click();
  });
});
