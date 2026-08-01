import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../schema.ts';
import { eq, inArray } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

// Load env variables
try {
  const envPath = path.resolve(__dirname, '../../../.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    for (const line of envConfig.split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || '';
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        } else if (val.startsWith("'") && val.endsWith("'")) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    }
  }
} catch (e) {
  console.warn('Failed to load root .env file:', e);
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

async function main() {
  console.log('Seeding valid Better Auth users...');
  
  const { auth } = await import('../../../lib/auth.ts');

  const sdmUsers = [
    { name: 'Khoirul Anam', email: 'a6nyusss@gmail.com', role: 'owner' },
    { name: 'Zahi', email: 'tajzahielhuda@gmail.com', role: 'manager' },
    { name: 'Dedi', email: 'dedimulyadi@gail.com', role: 'kasir' },
    { name: 'Deni', email: 'denisetiadi@gmail.com', role: 'kasir' },
  ];

  // Clean old user rows by email to re-hash cleanly with Better Auth
  const emails = sdmUsers.map(u => u.email);
  const existingUsers = await db.select().from(schema.user).where(inArray(schema.user.email, emails));
  for (const u of existingUsers) {
    await db.delete(schema.session).where(eq(schema.session.userId, u.id));
    await db.delete(schema.account).where(eq(schema.account.userId, u.id));
    await db.delete(schema.profiles).where(eq(schema.profiles.email, u.email));
    await db.delete(schema.user).where(eq(schema.user.id, u.id));
  }

  for (const u of sdmUsers) {
    try {
      console.log(`Registering user via Better Auth: ${u.email}`);
      const res = await auth.api.signUpEmail({
        body: {
          email: u.email,
          password: 'password123',
          name: u.name,
        }
      });
      console.log(`User ${u.email} registered successfully with ID:`, res?.user?.id);
    } catch (err: any) {
      console.error(`Error registering ${u.email}:`, err.message || err);
    }
  }

  // Update roles in user & profile table
  const tenant = await db.query.tenants.findFirst({ where: eq(schema.tenants.slug, 'taj-saas') });
  if (tenant) {
    for (const u of sdmUsers) {
      await db.update(schema.user).set({ role: u.role }).where(eq(schema.user.email, u.email));
      const [usr] = await db.select().from(schema.user).where(eq(schema.user.email, u.email)).limit(1);
      if (usr) {
        await db.insert(schema.profiles).values({
          id: usr.id,
          tenantId: tenant.id,
          email: u.email,
          role: u.role,
        }).onConflictDoNothing();
      }
    }
  }

  console.log('ALL SDM USERS SUCCESSFULLY CREATED WITH PASSWORD: password123!');
}

main().catch(console.error);
