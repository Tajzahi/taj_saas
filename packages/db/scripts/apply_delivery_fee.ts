import { neon } from '@neondatabase/serverless';
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
if (!databaseUrl) {
  console.error("DATABASE_URL not found!");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function main() {
  console.log("Checking and applying deliveryFee column to orders table on Neon DB...");
  try {
    await sql`ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "deliveryFee" numeric DEFAULT 0;`;
    console.log("SUCCESS: Column deliveryFee added/verified on Neon DB!");

    const cols = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'orders';`;
    console.log("Current columns on 'orders' table:", cols.map((c: any) => c.column_name).join(', '));
  } catch (err) {
    console.error("Migration script error:", err);
  }
}

main().catch(console.error);
