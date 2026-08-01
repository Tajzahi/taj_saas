import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration for Owner App
 * Credentials and URLs must be set via environment variables:
 *   TEST_BASE_URL=http://localhost:3002
 *   TEST_OWNER_EMAIL=your-test-email
 *   TEST_OWNER_PASSWORD=your-test-password
 */
export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'test-results/html-report', open: 'never' }],
  ],

  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:3002',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: process.env.CI
    ? undefined
    : {
        command: 'pnpm dev',
        url: process.env.TEST_BASE_URL || 'http://localhost:3002',
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
      },
});
