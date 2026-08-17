import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    exclude: ["**/*.spec.ts", "node_modules/**"],
    env: {
      BETTER_AUTH_SECRET: "test-secret-at-least-32-characters-long-1234567890",
      DATABASE_URL: "postgres://mock:mock@localhost:5432/mock",
    },
    alias: {
      "server-only": path.resolve(__dirname, "tests/mocks/server-only.ts"),
      "@taj-saas/db": path.resolve(__dirname, "packages/db/index.ts"),
      "@lib": path.resolve(__dirname, "lib"),
      "@": path.resolve(__dirname, "apps/owner"),
    },
  },
});
