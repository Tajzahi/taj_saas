import { auth } from '../../../lib/auth';
import { db, schema } from '../index';
import { eq } from 'drizzle-orm';

async function main() {
  try {
    const tenants = await db.select().from(schema.tenants).limit(1);
    if (tenants.length === 0) {
      console.log('No tenant found');
      process.exit(1);
    }
    const tenant = tenants[0];

    // Delete existing kasir if any to allow fresh sign up
    const existing = await db.select().from(schema.user).where(eq(schema.user.email, 'kasir.siti@a6nyuss.com'));
    if (existing.length > 0) {
      await db.delete(schema.user).where(eq(schema.user.id, existing[0].id));
    }

    const res = await auth.api.signUpEmail({
      body: {
        email: 'kasir.siti@a6nyuss.com',
        password: 'Password123!',
        name: 'Kasir Siti',
      }
    });

    console.log('KASIR_SIGNUP_RESULT:', res);

    if (res && res.user) {
      await db.insert(schema.profiles).values({
        id: res.user.id,
        tenantId: tenant.id,
        role: 'kasir',
        phone: '081234567891',
      });
      console.log('KASIR_PROFILE_CREATED:', res.user.id);
    }

    process.exit(0);
  } catch (err: any) {
    console.error('ERROR_CREATING_KASIR:', err?.message || err);
    process.exit(1);
  }
}

main();
