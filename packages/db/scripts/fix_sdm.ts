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

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

async function main() {
  console.log('Fixing SDM profiles data...');

  // Delete dummy users
  const dummyEmails = ['kasir_demak@taj.saas', 'kasir_pasarkembang@taj.saas'];
  const dummies = await db.select().from(schema.user).where(inArray(schema.user.email, dummyEmails));
  for (const d of dummies) {
    await db.delete(schema.session).where(eq(schema.session.userId, d.id));
    await db.delete(schema.account).where(eq(schema.account.userId, d.id));
    await db.delete(schema.profiles).where(eq(schema.profiles.id, d.id));
    await db.delete(schema.user).where(eq(schema.user.id, d.id));
  }

  // Update real SDM profiles
  const sdmData = [
    { email: 'a6nyusss@gmail.com', name: 'Khoirul Anam', role: 'owner', salary: '0' },
    { email: 'tajzahielhuda@gmail.com', name: 'Zahi', role: 'manager', salary: '3000000' },
    { email: 'dedimulyadi@gail.com', name: 'Dedi', role: 'kasir', salary: '2500000' },
    { email: 'denisetiadi@gmail.com', name: 'Deni', role: 'kasir', salary: '2500000' },
  ];

  for (const sdm of sdmData) {
    await db.update(schema.user).set({ role: sdm.role, name: sdm.name }).where(eq(schema.user.email, sdm.email));
    await db.update(schema.profiles).set({ role: sdm.role, salary: sdm.salary }).where(eq(schema.profiles.email, sdm.email));
  }

  console.log('SDM profiles fixed successfully!');
}

main().catch(console.error);
