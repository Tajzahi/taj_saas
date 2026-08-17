import * as fs from 'fs';
import * as path from 'path';
import ws from 'ws';

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
  const { Pool, neonConfig } = await import('@neondatabase/serverless');
  const { sql } = await import('drizzle-orm');
  const { drizzle } = await import('drizzle-orm/neon-serverless');

  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  console.log('[Migration] Reading drizzle/0005_neat_selene.sql...');
  const migrationSqlPath = path.resolve(__dirname, '../drizzle/0005_neat_selene.sql');
  const migrationRaw = fs.readFileSync(migrationSqlPath, 'utf-8');

  // Split by statement-breakpoint
  const statements = migrationRaw
    .split('--> statement-breakpoint')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`[Migration] Found ${statements.length} SQL statements to apply.`);

  let appliedCount = 0;
  for (const stmt of statements) {
    try {
      await db.execute(sql.raw(stmt));
      appliedCount++;
    } catch (err: any) {
      // If error is duplicate column / index / table already exists, continue gracefully
      if (
        err.code === '42P07' || // relation already exists
        err.code === '42701' || // column already exists
        err.code === '42710' || // constraint already exists
        err.code === '42704'    // index does not exist (for drop index)
      ) {
        console.warn(`[Migration Notice] Handled harmless conflict (${err.code}): ${err.message?.split('\n')[0]}`);
      } else {
        console.error(`[Migration Error] Failed statement:\n${stmt}\n`, err);
        throw err;
      }
    }
  }

  console.log(`[Migration] Successfully executed all statements! (${appliedCount}/${statements.length} applied)`);
  await pool.end();
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
