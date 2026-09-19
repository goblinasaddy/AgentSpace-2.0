import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    exclude: ["**/node_modules/**", "**/tests/e2e/**"],
    env: {
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/agentspace_dev?schema=public",
      AUTH_SECRET: "your-super-secret-auth-key-change-in-production-min-32-chars",
      NODE_ENV: "test",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
