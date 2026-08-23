import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../schema.ts';
import { eq, inArray } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

try {
  const envPath = path.resolve(__dirname, '../../../.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    for (const line of envConfig.split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || '';
        if (val.startsWith('"') && val.endsWith('"')) val = val.substring(1, val.length - 1);
        process.env[key] = val;
      }
    }
  }
} catch (e) {}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) process.exit(1);

// 🛡️ SAFETY GUARD: Prevent accidental bulk deletion in production without explicit flag
if (process.env.NODE_ENV === "production" && !process.env.ALLOW_DESTRUCTIVE_DB_RESET) {
  console.error(
    "⛔ BLOCKED: clean_orders.ts cannot be executed in production without ALLOW_DESTRUCTIVE_DB_RESET=true"
  );
  process.exit(1);
}

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

async function main() {
  console.log('Cleaning database sales transactions as requested by user...');

  const tenant = await db.query.tenants.findFirst({ where: eq(schema.tenants.slug, 'taj-saas') });
  if (tenant) {
    const existingOrders = await db.select({ id: schema.orders.id }).from(schema.orders).where(eq(schema.orders.tenantId, tenant.id));
    const orderIds = existingOrders.map(o => o.id);

    if (orderIds.length > 0) {
      const CHUNK = 100;
      for (let i = 0; i < orderIds.length; i += CHUNK) {
        const chunkIds = orderIds.slice(i, i + CHUNK);
        await db.delete(schema.orderItems).where(inArray(schema.orderItems.orderId, chunkIds));
      }
    }

    await db.delete(schema.orders).where(eq(schema.orders.tenantId, tenant.id));
    await db.delete(schema.shiftLogs).where(eq(schema.shiftLogs.tenantId, tenant.id));
    await db.delete(schema.shifts).where(eq(schema.shifts.tenantId, tenant.id));
  }

  console.log('Sales transactions successfully cleared from database!');
}

main().catch(console.error);
