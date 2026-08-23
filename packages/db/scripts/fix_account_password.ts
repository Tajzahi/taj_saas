import { db, schema } from '../index';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = crypto.scryptSync(password, salt, 64);
  return `${salt}:${key.toString('hex')}`;
}

async function main() {
  const users = await db.select().from(schema.user).where(eq(schema.user.email, 'a6nyusss@gmail.com'));
  if (users.length === 0) {
    console.log('No user found');
    process.exit(1);
  }
  const user = users[0];

  // Delete existing accounts if any
  await db.delete(schema.account).where(eq(schema.account.userId, user.id));

  // Insert credential account
  const hashedPassword = hashPassword('Password123!');
  const [acc] = await db.insert(schema.account).values({
    id: `acc_${Date.now()}`,
    accountId: user.email,
    providerId: 'credential',
    userId: user.id,
    password: hashedPassword,
  }).returning();

  console.log('ACCOUNT_CREATED:', acc.id, 'for user:', user.email);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
