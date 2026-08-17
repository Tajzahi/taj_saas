import * as fs from 'fs';
import * as path from 'path';

// 1. Synchronously load .env
const envPath = path.resolve(__dirname, '../../../.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  for (const line of envConfig.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([\w.-]+)\s*=\s*(.*)?$/);
    if (match) {
      const key = match[1];
      let val = match[2] || '';
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    }
  }
}

async function main() {
  const { db, schema } = await import('../index');
  const { sql } = await import('drizzle-orm');

  console.log('[Preflight] Checking for duplicate (tenant_id, slug) pairs in menu_items and categories...');

  // 1. Check duplicate menu_items slugs
  const duplicateMenuItems = await db.execute(sql`
    SELECT tenant_id, slug, COUNT(*) as count
    FROM menu_items
    GROUP BY tenant_id, slug
    HAVING COUNT(*) > 1;
  `);

  console.log(`[Preflight] Duplicate menu_items found: ${duplicateMenuItems.rows.length}`);
  if (duplicateMenuItems.rows.length > 0) {
    console.warn('[Preflight] Duplicate menu_items details:', duplicateMenuItems.rows);
  }

  // 2. Check duplicate categories slugs
  const duplicateCategories = await db.execute(sql`
    SELECT tenant_id, slug, COUNT(*) as count
    FROM categories
    GROUP BY tenant_id, slug
    HAVING COUNT(*) > 1;
  `);

  console.log(`[Preflight] Duplicate categories found: ${duplicateCategories.rows.length}`);
  if (duplicateCategories.rows.length > 0) {
    console.warn('[Preflight] Duplicate categories details:', duplicateCategories.rows);
  }

  console.log('[Preflight] Preflight check completed successfully!');
}

main().then(() => process.exit(0)).catch((err) => {
  console.error('[Preflight] Error during preflight check:', err);
  process.exit(1);
});
