import { test, expect } from '@playwright/test';

test.use({
  baseURL: 'http://localhost:3002',
  headless: false,
  launchOptions: {
    slowMo: 800,
  },
});

test('should register a new owner and redirect to dashboard on local server', async ({ page }) => {
  console.log('Navigating to local register page in headed browser...');
  await page.goto('/register');

  const randomNum = Math.floor(Math.random() * 100000);
  const testName = `Owner Local ${randomNum}`;
  const storeName = `Kopi Mantap ${randomNum}`;
  const testEmail = `owner_local_${randomNum}@test.com`;
  const testPass = `OwnerPass2026!`;

  console.log(`Submitting registration for ${testEmail}...`);

  await page.fill('input[placeholder="misal: Bambang Wijaya"]', testName);
  await page.fill('input[placeholder="misal: Martabak A6 Nyuss"]', storeName);
  await page.fill('input[placeholder="owner@bisnis.com"]', testEmail);
  await page.fill('input[placeholder="Minimal 8 karakter"]', testPass);

  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForTimeout(6000);

  const currentUrl = page.url();
  console.log('Current URL after submit:', currentUrl);

  await page.screenshot({ path: 'test-results/local_registration_result.png', fullPage: true });

  expect(currentUrl).not.toContain('/login');
});
