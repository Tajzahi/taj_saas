import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../schema.ts';
import { eq, and } from 'drizzle-orm';
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

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

async function main() {
  const tenant = await db.query.tenants.findFirst({ where: eq(schema.tenants.slug, 'taj-saas') });
  console.log('Tenant:', tenant);

  if (tenant) {
    const orders = await db
      .select()
      .from(schema.orders)
      .where(and(eq(schema.orders.tenantId, tenant.id), eq(schema.orders.status, 'completed')));
    
    console.log('Total Completed Orders in DB:', orders.length);
    const sum = orders.reduce((s, o) => s + Number(o.totalPrice), 0);
    console.log('Total Revenue Sum in DB:', sum);
  }
}

main().catch(console.error);
