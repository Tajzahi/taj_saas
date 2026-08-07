import { NextResponse } from 'next/server';
import { db, schema } from '@taj-saas/db';
import { eq, inArray } from 'drizzle-orm';
import Ably from 'ably';

// Harus sinkron dengan zona ongkir client (components/DeliveryMap.tsx &
// store/cartStore.ts: 8000/13000/18000) serta nilai flat default.
const VALID_DELIVERY_FEES = new Set([0, 8000, 10000, 13000, 15000, 18000, 20000]);

import { and } from 'drizzle-orm';

export interface OrderItemPayload {
  menuItemSlug: string;
  menuItemName: string;
  variantName?: string;
  variantPriceModifier: number;
  quantity: number;
  note?: string;
}

export interface CreateOrderRequest {
  items: OrderItemPayload[];
  customerName: string;
  customerPhone: string;
  orderType: 'dine_in' | 'takeaway' | 'delivery';
  deliveryAddress?: string;
  deliveryFee: number;
  promoCode?: string;
  paymentMethod: 'cod' | 'qris';
}

function generateOrderCode(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `A6-${date}-${rand}`;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: CreateOrderRequest = await request.json();
    const { items, customerName, customerPhone, orderType, deliveryAddress, deliveryFee, promoCode, paymentMethod } = body;

    // Get tenant from headers
    const tenantSlug = request.headers.get('x-tenant-slug');
    if (!tenantSlug) {
      return NextResponse.json({ error: 'Request tidak valid.' }, { status: 400 });
    }
    
    // Find tenant
    const tenantResult = await db.select().from(schema.tenants).where(eq(schema.tenants.slug, tenantSlug)).limit(1);
    const tenant = tenantResult[0];
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant tidak ditemukan.' }, { status: 404 });
    }

    // Basic input validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Keranjang belanja kosong.' }, { status: 400 });
    }
    if (!customerName?.trim() || customerName.trim().length < 2) {
      return NextResponse.json({ error: 'Nama pemesan tidak valid.' }, { status: 400 });
    }
    if (!customerPhone?.trim() || !/^(08|\+62)\d{8,12}$/.test(customerPhone.replace(/\s/g, ''))) {
      return NextResponse.json({ error: 'Nomor HP tidak valid.' }, { status: 400 });
    }
    if (!['dine_in', 'takeaway', 'delivery'].includes(orderType)) {
      return NextResponse.json({ error: 'Tipe order tidak valid.' }, { status: 400 });
    }
    if (orderType === 'delivery' && !deliveryAddress?.trim()) {
      return NextResponse.json({ error: 'Alamat pengiriman wajib diisi untuk delivery.' }, { status: 400 });
    }
    if (!['cod', 'qris'].includes(paymentMethod)) {
      return NextResponse.json({ error: 'Metode pembayaran tidak valid.' }, { status: 400 });
    }

    const claimedFee = orderType === 'delivery' ? deliveryFee : 0;
    if (!VALID_DELIVERY_FEES.has(claimedFee)) {
      return NextResponse.json(
        { error: `Ongkos kirim tidak valid: Rp${claimedFee}. Hubungi admin jika ada masalah.` },
        { status: 400 }
      );
    }

    // Fetch items from DB to prevent client price tampering
    const itemSlugs = items.map(i => i.menuItemSlug);
    const dbItems = await db.select()
      .from(schema.menuItems)
      .where(inArray(schema.menuItems.slug, itemSlugs));

    // Get categories to map IDs to slugs
    const dbCategories = await db.select().from(schema.categories).where(eq(schema.categories.tenantId, tenant.id));
    const categoryMap = new Map(dbCategories.map(c => [c.id, c.slug]));

    const dbItemMap = new Map(dbItems.map(item => [item.slug, {
      id: item.id,
      price: Number(item.price),
      isAvailable: item.isAvailable,
      categorySlug: item.categoryId ? categoryMap.get(item.categoryId) : 'minuman'
    }]));

    const MAX_VARIANT_MODIFIER = 25000;
    let subtotal = 0;
    const validatedItems: any[] = [];

    for (const item of items) {
      const dbItem = dbItemMap.get(item.menuItemSlug);

      if (!dbItem) {
        return NextResponse.json(
          { error: `Menu "${item.menuItemName}" tidak ditemukan di sistem.` },
          { status: 400 }
        );
      }
      if (!dbItem.isAvailable) {
        return NextResponse.json(
          { error: `Menu "${item.menuItemName}" sedang tidak tersedia.` },
          { status: 400 }
        );
      }
      if (item.quantity < 1 || item.quantity > 99) {
        return NextResponse.json({ error: 'Jumlah item tidak valid.' }, { status: 400 });
      }

      const safeModifier = Math.min(
        Math.max(0, Number(item.variantPriceModifier) || 0),
        MAX_VARIANT_MODIFIER
      );

      const unitPrice = dbItem.price + safeModifier;
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      validatedItems.push({
        menuItemId: dbItem.id,
        menuItemName: item.menuItemName,
        variantName: item.variantName || null,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
        categorySlug: dbItem.categorySlug,
      });
    }

    let promoDiscount = 0;

    if (promoCode) {
      const cleanCode = promoCode.trim().toUpperCase().slice(0, 30);
      const promoResult = await db.select().from(schema.promos).where(
        and(
          eq(schema.promos.tenantId, tenant.id),
          eq(schema.promos.code, cleanCode),
          eq(schema.promos.isActive, true)
        )
      ).limit(1);
      
      const promo = promoResult[0];

      if (promo && subtotal >= Number(promo.minOrder)) {
        const promoValue = Number(promo.value);
        if (promo.targetCategory === 'all') {
          promoDiscount = promo.type === 'fixed'
            ? promoValue
            : Math.round(subtotal * (promoValue / 100));
        } else {
          const categoryTotal = validatedItems
            .filter((i) => i.categorySlug === promo.targetCategory)
            .reduce((sum, i) => sum + i.totalPrice, 0);

          const base = categoryTotal || subtotal; // Wait, if categoryTotal is 0, we don't give discount if targetCategory doesn't match? 
          // Actually, if categoryTotal is 0, base should be 0, not subtotal.
          const discountBase = categoryTotal; 
          promoDiscount = promo.type === 'fixed'
            ? Math.min(promoValue, discountBase)
            : Math.round(discountBase * (promoValue / 100));
        }
      }
    }

    const total = Math.max(0, subtotal + claimedFee - promoDiscount);
    const orderCode = generateOrderCode();

    // 1. Save to Database (Sequential insert, since neon-http doesn't support db.transaction)
    const [newOrder] = await db.insert(schema.orders).values({
      tenantId: tenant.id,
      orderCode,
      customerName,
      customerPhone,
      deliveryType: orderType,
      deliveryAddress: deliveryAddress || null,
      subtotal: String(subtotal),
      totalPrice: String(total),
      status: 'received',
      paymentMethod,
      paymentStatus: 'pending',
      notes: items.map(i => i.note).filter(Boolean).join(' | ') || null,
    }).returning();

    const orderItemValues = validatedItems.map(item => ({
      orderId: newOrder.id,
      menuItemId: item.menuItemId,
      menuItemName: item.menuItemName,
      variantName: item.variantName,
      quantity: item.quantity,
      unitPrice: String(item.unitPrice),
      totalPrice: String(item.totalPrice),
    }));

    await db.insert(schema.orderItems).values(orderItemValues);
    const orderResult = newOrder;

    // 2. Publish Realtime Message to Ably (Serverless REST)
    const ablyKey = process.env.ABLY_API_KEY;
    if (ablyKey) {
      try {
        const ably = new Ably.Rest({ key: ablyKey });
        const channel = ably.channels.get(`orders:${tenantSlug}`);
        await channel.publish('new-order', {
          order: {
            ...orderResult,
            items: validatedItems
          }
        });
        console.log('[Ably] Order event published successfully:', orderCode);
      } catch (ablyErr) {
        console.error('[Ably] Failed to publish order event:', ablyErr);
      }
    }

    return NextResponse.json({
      success: true,
      orderCode,
      subtotal,
      deliveryFee: claimedFee,
      promoDiscount,
      total,
    }, { status: 201 });

  } catch (err: any) {
    console.error('[orders/route] Unexpected error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem. Coba lagi.' }, { status: 500 });
  }
}
