import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3002';
const TEST_EMAIL = process.env.TEST_OWNER_EMAIL || '';
const TEST_PASSWORD = process.env.TEST_OWNER_PASSWORD || '';

test.describe('Owner Dashboard E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    if (!TEST_EMAIL || !TEST_PASSWORD) {
      throw new Error('TEST_OWNER_EMAIL and TEST_OWNER_PASSWORD env vars are required');
    }
    // 1. Login sebagai Owner sebelum setiap test
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    // Ensure we reach the dashboard
    try {
      await expect(page).toHaveURL(`${BASE_URL}/`, { timeout: 15000 });
    } catch (e) {
      await page.screenshot({ path: 'test-results/login-failure.png' });
      throw e;
    }
  });

  test('Harus me-render Executive Cockpit dengan Recharts', async ({ page }) => {
    // Cek keberadaan KPI Cards
    await expect(page.locator('text=Total Pendapatan')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Total Order')).toBeVisible();
    
    // Cek chart tren pendapatan dimuat
    const chart = page.locator('.recharts-responsive-container');
    await expect(chart.first()).toBeVisible();
  });

  test('Harus memicu modal Tambah Cabang baru dan menyimpan ke database', async ({ page }) => {
    await page.goto(`${BASE_URL}/cabang`);
    
    // Buka modal
    await page.click('text=Tambah Cabang');
    await expect(page.getByRole('heading', { name: 'Tambah Cabang Baru' })).toBeVisible();
    
    // Isi formulir
    await page.fill('input[placeholder="Cabang Menteng"]', 'Cabang Test E2E');
    await page.fill('input[placeholder="Jakarta"]', 'Bandung');
    await page.fill('input[placeholder="Jl. Menteng Raya No. 12..."]', 'Jl. Dago No. 15');
    await page.fill('input[placeholder="+62 21 xxxx xxxx"]', '+62812345678');
    
    // Submit form
    await page.click('button:has-text("Simpan Cabang")');
    
    // Verifikasi cabang baru terdaftar di UI
    await expect(page.locator('text=Cabang Test E2E')).toBeVisible();
  });

  test('Harus dapat melakukan toggle status Dark Mode', async ({ page }) => {
    // Periksa apakah root HTML awalnya tidak memiliki class dark
    const htmlElement = page.locator('html');
    await expect(htmlElement).not.toHaveClass(/dark/);
    
    // Klik tombol toggle dark mode di Topbar
    await page.click('button[title="Dark Mode"], button[title="Light Mode"]');
    
    // Cek class dark tersemat
    await expect(htmlElement).toHaveClass(/dark/);
  });
});
