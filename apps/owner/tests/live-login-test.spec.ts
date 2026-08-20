import { test, expect } from '@playwright/test';

test.use({
  baseURL: 'https://taj-owner-rm3i6swwoq-et.a.run.app',
  headless: false,
  launchOptions: {
    slowMo: 1000,
  },
});

test('should login directly to Cloud Run and log network requests', async ({ page }) => {
  page.on('request', request => console.log('>> [REQUEST]', request.method(), request.url()));
  page.on('response', response => console.log('<< [RESPONSE]', response.status(), response.url()));

  console.log('Navigating to live Cloud Run login page...');
  await page.goto('/login');

  const testEmail = 'a6nyusss@gmail.com';
  const testPass = 'A6nyusss';

  console.log(`Filling login credentials for ${testEmail}...`);

  await page.fill('input[type="email"]', testEmail);
  await page.fill('input[type="password"]', testPass);

  console.log('Clicking sign in button...');
  await page.click('button[type="submit"]');

  await page.waitForTimeout(6000);

  const currentUrl = page.url();
  console.log('Final URL after submit:', currentUrl);
});
