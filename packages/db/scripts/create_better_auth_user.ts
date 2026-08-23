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

    // Create user via Better-Auth
    const res = await auth.api.signUpEmail({
      body: {
        email: 'a6nyusss@gmail.com',
        password: 'Password123!',
        name: 'Khoirul Anam',
      }
    });

    console.log('SIGNUP_RESULT:', res);

    if (res && res.user) {
      await db.update(schema.profiles).set({
        tenantId: tenant.id,
        role: 'owner',
      }).where(eq(schema.profiles.id, res.user.id));
    }

    process.exit(0);
  } catch (err: any) {
    console.error('ERROR_CREATING_USER:', err?.message || err);
    process.exit(1);
  }
}

main();
