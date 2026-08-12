import { NextResponse } from 'next/server';
import { db, schema } from '@taj-saas/db';
import { eq, inArray, and } from 'drizzle-orm';
import Ably from 'ably';
import { generateOrderCode } from '@/lib/utils/format';

// Harus sinkron dengan zona ongkir client (components/DeliveryMap.tsx &
// store/cartStore.ts: 8000/13000/18000) serta nilai flat default.
const VALID_DELIVERY_FEES = new Set([0, 8000, 10000, 13000, 15000, 18000, 20000]);

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
  paymentMethod: 'cod' | 'qris' | 'transfer';
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
    if (!['cod', 'qris', 'transfer'].includes(paymentMethod)) {
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
      categorySlug: item.categoryId ? categoryMap.get(item.categoryId) : 'minuman',
      variants: item.variants as any[] | null
    }]));

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

      // C8: Hitung ulang variantPriceModifier dari DB (bukan nilai client)
      let validModifier = 0;
      if (item.variantName && dbItem.variants && Array.isArray(dbItem.variants)) {
        const allOptions = dbItem.variants.flatMap((v: any) => v.options || []);
        const selectedNames = item.variantName.split(',').map((s: string) => s.trim().toLowerCase());
        for (const opt of allOptions) {
          if (opt && (selectedNames.includes(String(opt.name).trim().toLowerCase()) || selectedNames.includes(String(opt.id).trim().toLowerCase()))) {
            validModifier += Number(opt.priceModifier) || 0;
          }
        }
      }

      const unitPrice = dbItem.price + validModifier;
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      validatedItems.push({
        menuItemId: dbItem.id,
        menuItemName: item.menuItemName,
        variantName: item.variantName || null,
        variantPriceModifier: validModifier,
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

          const discountBase = categoryTotal; 
          promoDiscount = promo.type === 'fixed'
            ? Math.min(promoValue, discountBase)
            : Math.round(discountBase * (promoValue / 100));
        }
      }
    }

    const total = Math.max(0, subtotal + claimedFee - promoDiscount);
    const orderCode = generateOrderCode();
    const storedPaymentMethod = paymentMethod === 'qris' ? 'transfer' : paymentMethod;

    // 1. Save to Database
    const [newOrder] = await db.insert(schema.orders).values({
      tenantId: tenant.id,
      orderCode,
      customerName,
      customerPhone,
      deliveryType: orderType,
      deliveryAddress: deliveryAddress || null,
      deliveryFee: String(claimedFee ?? 0),
      subtotal: String(subtotal),
      totalPrice: String(total),
      status: 'received',
      paymentMethod: storedPaymentMethod,
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
