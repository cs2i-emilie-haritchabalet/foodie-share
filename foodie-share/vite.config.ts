import { defineConfig } from "vitest/config";
import preact from "@preact/preset-vite";

export default defineConfig({
  plugins: [preact()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./test/vitest/setup.ts",
    include: ["test/**/*.test.ts", "test/**/*.test.tsx"]
  },
  base: '/foodie-share/',
});