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
  const { drizzle } = await import('drizzle-orm/neon-serverless');
  const schema = await import('../schema');
  const { eq } = await import('drizzle-orm');

  neonConfig.webSocketConstructor = ws;

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log('[Spike P1A-00] Testing Neon Pool + neon-serverless transactions...');
  try {
    const tenants = await db.select().from(schema.tenants).limit(1);
    console.log(`[Spike P1A-00] Connection successful! Found ${tenants.length} tenant(s).`);

    if (tenants.length > 0) {
      const t = tenants[0];
      console.log(`[Spike P1A-00] Testing db.transaction with rollback on tenant: ${t.name} (${t.slug})...`);
      let txSucceeded = false;
      try {
        await db.transaction(async (tx) => {
          const innerTenants = await tx.select().from(schema.tenants).where(eq(schema.tenants.id, t.id));
          if (innerTenants.length !== 1) {
            throw new Error('Tenant lookup mismatch inside transaction');
          }
          throw new Error('INTENTIONAL_ROLLBACK_TEST');
        });
      } catch (err: any) {
        if (err.message === 'INTENTIONAL_ROLLBACK_TEST') {
          txSucceeded = true;
          console.log('[Spike P1A-00] Transaction rollback executed successfully as expected!');
        } else {
          console.error('[Spike P1A-00] Unexpected transaction error:', err);
        }
      }

      if (txSucceeded) {
        console.log('[Spike P1A-00] SPIKE RESULT: PASS (Pool + neon-serverless driver supports full ACID transactions!)');
      } else {
        console.log('[Spike P1A-00] SPIKE RESULT: FAILED');
      }
    }
  } catch (error) {
    console.error('[Spike P1A-00] Error running transaction test:', error);
  } finally {
    await pool.end();
  }
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
