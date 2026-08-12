import { NextResponse } from 'next/server';
import { db, schema } from '@taj-saas/db';
import { eq } from 'drizzle-orm';
import Ably from 'ably';

// Get order details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
): Promise<NextResponse> {
  try {
    const { code } = await params;
    const tenantSlug = request.headers.get('x-tenant-slug');
    if (!tenantSlug) {
      return NextResponse.json({ error: 'Request tidak valid.' }, { status: 400 });
    }

    // Find tenant
    const tenantResult = await db
      .select()
      .from(schema.tenants)
      .where(eq(schema.tenants.slug, tenantSlug))
      .limit(1);

    const tenant = tenantResult[0];
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant tidak ditemukan.' }, { status: 404 });
    }

    // Find order
    const orderResult = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.orderCode, code))
      .limit(1);

    const order = orderResult[0];
    if (!order || order.tenantId !== tenant.id) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }

    // Find order items
    const dbItems = await db
      .select()
      .from(schema.orderItems)
      .where(eq(schema.orderItems.orderId, order.id));

    // Map to frontend structure
    const items = dbItems.map((item) => ({
      cartId: item.id,
      menuItem: {
        id: item.menuItemId || '',
        slug: '', // dynamic tracking page doesn't strictly need the menu item slug
        name: item.menuItemName,
        category: 'martabak-telur-ayam', // fallback
        categoryLabel: 'Martabak', // fallback
        price: Number(item.unitPrice),
        image: '/assets/menu/placeholder.jpg', // fallback
        description: '',
      },
      selectedVariants: item.variantName
        ? [{ label: 'Varian', option: { id: '', name: item.variantName, priceModifier: 0 } }]
        : [],
      quantity: item.quantity,
      note: '',
      totalPrice: Number(item.totalPrice),
    }));

    return NextResponse.json({
      orderCode: order.orderCode,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      orderType: order.deliveryType,
      deliveryAddress: order.deliveryAddress || undefined,
      subtotal: Number(order.subtotal),
      deliveryFee: Number(order.deliveryFee ?? 0),
      total: Number(order.totalPrice),
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      paymentProofUrl: order.paymentProofUrl || undefined,
      notes: order.notes || undefined,
      createdAt: order.createdAt.toISOString(),
      items,
    });
  } catch (err: any) {
    console.error('[GET /api/orders/[code]] Unexpected error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem.' }, { status: 500 });
  }
}

// Upload/Update payment proof or status
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
): Promise<NextResponse> {
  try {
    const { code } = await params;
    const body = await request.json();
    const { paymentProofUrl, status } = body;

    const tenantSlug = request.headers.get('x-tenant-slug');
    if (!tenantSlug) {
      return NextResponse.json({ error: 'Request tidak valid.' }, { status: 400 });
    }

    // Find tenant
    const tenantResult = await db
      .select()
      .from(schema.tenants)
      .where(eq(schema.tenants.slug, tenantSlug))
      .limit(1);

    const tenant = tenantResult[0];
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant tidak ditemukan.' }, { status: 404 });
    }

    // Find order
    const orderResult = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.orderCode, code))
      .limit(1);

    const order = orderResult[0];
    if (!order || order.tenantId !== tenant.id) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }

    const updateData: any = {};
    if (paymentProofUrl) {
      updateData.paymentStatus = 'waiting_verification';
      updateData.paymentProofUrl = paymentProofUrl;
    }
    if (status) {
      if (status === 'cancelled') {
        if (order.status !== 'received') {
          return NextResponse.json({ error: 'Pesanan tidak dapat dibatalkan karena sudah diproses.' }, { status: 400 });
        }
        updateData.status = 'cancelled';
      } else {
        return NextResponse.json({ error: 'Status update tidak diizinkan.' }, { status: 400 });
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Data update tidak boleh kosong.' }, { status: 400 });
    }

    // Update order in database
    const [updatedOrder] = await db
      .update(schema.orders)
      .set(updateData)
      .where(eq(schema.orders.id, order.id))
      .returning();

    // Publish event to Ably to notify the cashier
    const ablyKey = process.env.ABLY_API_KEY;
    if (ablyKey) {
      try {
        const ably = new Ably.Rest({ key: ablyKey });
        const channel = ably.channels.get(`orders:${tenantSlug}`);
        
        const eventName = status === 'cancelled' ? 'order-cancelled' : 'order-updated';
        await channel.publish(eventName, {
          orderCode: code,
          status: updatedOrder.status,
          paymentStatus: updatedOrder.paymentStatus,
          paymentProofUrl: updatedOrder.paymentProofUrl || undefined,
        });
        console.log(`[Ably] Order event ${eventName} published successfully:`, code);
      } catch (ablyErr) {
        console.error('[Ably] Failed to publish order update event:', ablyErr);
      }
    }

    return NextResponse.json({
      success: true,
      orderCode: updatedOrder.orderCode,
      status: updatedOrder.status,
      paymentStatus: updatedOrder.paymentStatus,
      paymentProofUrl: updatedOrder.paymentProofUrl || undefined,
    });
  } catch (err: any) {
    console.error('[PUT /api/orders/[code]] Unexpected error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem.' }, { status: 500 });
  }
}
