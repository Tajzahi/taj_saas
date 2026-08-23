import { db, schema } from '../index';
import { eq } from 'drizzle-orm';

async function main() {
  const branches = await db.select().from(schema.branches);
  if (branches.length > 0) {
    await db.update(schema.orders).set({ branchId: branches[0].id });
  }
  const orders = await db.select().from(schema.orders);
  console.log('ACTIVE_ORDERS:', JSON.stringify(orders.map(o => ({
    code: o.orderCode,
    name: o.customerName,
    branchId: o.branchId,
    status: o.status,
    total: o.totalPrice,
  })), null, 2));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
