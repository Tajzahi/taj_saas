import fs from 'fs';
import path from 'path';

const envPath = path.resolve(__dirname, '../../../.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  for (const line of envConfig.split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let val = match[2] || '';
      if (val.startsWith('"') && val.endsWith('"')) val = val.substring(1, val.length - 1);
      process.env[match[1]] = val;
    }
  }
}

import { db, schema } from '../index';
import { eq } from 'drizzle-orm';

async function main() {
  const { auth } = await import('../../../lib/auth');
  try {
    const [tenant] = await db.select().from(schema.tenants).limit(1);
    if (!tenant) {
      console.error('No tenant found in DB');
      process.exit(1);
    }
    console.log('Tenant:', tenant.name, tenant.id);

    const branches = await db.select().from(schema.branches).where(eq(schema.branches.tenantId, tenant.id));
    console.log('Branches found:', branches.map(b => ({ id: b.id, name: b.name })));

    const branchDemak = branches.find(b => b.name.toLowerCase().includes('demak'));
    const branchRungkut = branches.find(b => b.name.toLowerCase().includes('rungkut'));

    if (!branchDemak || !branchRungkut) {
      console.error('Could not find both Demak and Rungkut branches:', { branchDemak, branchRungkut });
      process.exit(1);
    }

    const staffMembers = [
      {
        name: 'Siti Kasir Demak',
        email: 'kasir.demak@a6nyuss.com',
        password: 'PasswordDemak123!',
        branchId: branchDemak.id,
        role: 'kasir',
      },
      {
        name: 'Budi Kasir Rungkut',
        email: 'kasir.rungkut@a6nyuss.com',
        password: 'PasswordRungkut123!',
        branchId: branchRungkut.id,
        role: 'kasir',
      }
    ];

    for (const staff of staffMembers) {
      // Clean up existing user if already present
      const existingUsers = await db.select().from(schema.user).where(eq(schema.user.email, staff.email));
      if (existingUsers.length > 0) {
        console.log(`Deleting existing user: ${staff.email}`);
        await db.delete(schema.user).where(eq(schema.user.id, existingUsers[0].id));
      }

      console.log(`Creating user via Better Auth: ${staff.email}...`);
      const signUpRes = await auth.api.signUpEmail({
        body: {
          name: staff.name,
          email: staff.email,
          password: staff.password,
        }
      });

      if (!signUpRes || !signUpRes.user) {
        throw new Error(`Failed to sign up ${staff.email}`);
      }

      const userId = signUpRes.user.id;
      console.log(`User created ID: ${userId}, creating profile with branchId: ${staff.branchId}`);

      // Upsert profile
      await db.insert(schema.profiles).values({
        id: userId,
        tenantId: tenant.id,
        branchId: staff.branchId,
        email: staff.email,
        role: staff.role,
        shift: 'Pagi',
      }).onConflictDoUpdate({
        target: schema.profiles.id,
        set: {
          tenantId: tenant.id,
          branchId: staff.branchId,
          role: staff.role,
        }
      });

      console.log(`Staff ${staff.name} (${staff.email}) successfully provisioned!`);
    }

    console.log('ALL STAFF PROVISIONING COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (err: any) {
    console.error('Error provisioning staff:', err?.message || err);
    process.exit(1);
  }
}

main();
