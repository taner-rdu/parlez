import { defineConfig } from "@playwright/test";

export default defineConfig({
  reporter: [
    ['junit', { outputFile: 'test-results/integration.xml' }],
    ['list']
  ],
  use: {
    baseURL: "http://localhost:8000",
  },
});

