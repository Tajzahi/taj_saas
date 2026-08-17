import { NextResponse } from "next/server";
import { db, schema } from "@taj-saas/db";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";
import { resolveTenantFromRequestHost } from "@lib/tenant-authorization";
import { rateLimiter } from "@lib/server/rate-limiter";
import { calculateOrderPricing, PricingOrderItemInput } from "@lib/server/pricing-service";
import { generateOrderCode } from "@/lib/utils/format";

export interface CreateOrderRequest {
  items: PricingOrderItemInput[];
  customerName: string;
  customerPhone: string;
  orderType: "dine_in" | "takeaway" | "pickup" | "delivery";
  branchId?: string;
  deliveryAddress?: string;
  customerLat?: number;
  customerLng?: number;
  promoCode?: string;
  paymentMethod: "cod" | "qris" | "transfer";
  idempotencyKey?: string;
  claimedDeliveryFee?: number;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // 1. Zero-trust tenant resolution
    const host = request.headers.get("host") || "";
    const tenant = await resolveTenantFromRequestHost(host, { expectedApp: "customer" });

    // 2. Distributed Rate Limiting
    const forwardedFor = request.headers.get("x-forwarded-for") || "";
    const clientIp = forwardedFor.split(",")[0]?.trim() || "127.0.0.1";

    const rateResult = await rateLimiter.check(clientIp, "order_creation");
    if (!rateResult.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan pemesanan. Silakan tunggu beberapa saat." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rateResult.resetAt - Date.now()) / 1000)),
          },
        }
      );
    }

    const body: CreateOrderRequest = await request.json();
    const {
      items,
      customerName,
      customerPhone,
      orderType,
      branchId,
      deliveryAddress,
      customerLat,
      customerLng,
      promoCode,
      paymentMethod,
      idempotencyKey,
      claimedDeliveryFee,
    } = body;

    // 3. Basic input validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Keranjang belanja kosong." }, { status: 400 });
    }
    if (!customerName?.trim() || customerName.trim().length < 2) {
      return NextResponse.json({ error: "Nama pemesan tidak valid." }, { status: 400 });
    }
    const cleanPhone = (customerPhone || "").replace(/[\s-]/g, "");
    if (!cleanPhone || !/^(08|\+62)\d{8,12}$/.test(cleanPhone)) {
      return NextResponse.json({ error: "Nomor HP tidak valid. Gunakan format 08xx atau +62xx." }, { status: 400 });
    }
    if (!["dine_in", "takeaway", "pickup", "delivery"].includes(orderType)) {
      return NextResponse.json({ error: "Tipe pemesanan tidak valid." }, { status: 400 });
    }
    if (orderType === "delivery" && !deliveryAddress?.trim()) {
      return NextResponse.json({ error: "Alamat pengiriman wajib diisi untuk delivery." }, { status: 400 });
    }
    if (!["cod", "qris", "transfer"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Metode pembayaran tidak valid." }, { status: 400 });
    }

    // 4. Server-Side Pricing Verification
    let pricingResult;
    try {
      pricingResult = await calculateOrderPricing({
        tenantId: tenant.id,
        branchId,
        items,
        deliveryType: orderType,
        promoCode,
        customerLat,
        customerLng,
        claimedDeliveryFee,
      });
    } catch (pricingErr: unknown) {
      const msg = pricingErr instanceof Error ? pricingErr.message : "Gagal menghitung harga pesanan";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const {
      subtotal,
      discountAmount,
      deliveryFee,
      taxAmount,
      serviceChargeAmount,
      totalPrice,
      itemsBreakdown,
      pricingSnapshot,
      branch,
    } = pricingResult;

    // 5. Idempotency Fingerprint Check (SEC-009)
    const effectiveIdempotencyKey = idempotencyKey?.trim() || `IDEM-${crypto.randomUUID()}`;
    const payloadCanonicalString = JSON.stringify({
      tenantId: tenant.id,
      branchId: branch?.id || null,
      phone: cleanPhone,
      items: itemsBreakdown.map((i) => ({ id: i.menuItemId, qty: i.quantity, price: i.unitPrice })),
      total: totalPrice,
      idemKey: effectiveIdempotencyKey,
    });
    const idempotencyRequestHash = crypto.createHash("sha256").update(payloadCanonicalString).digest("hex");

    // Check if order with this idempotency key already exists
    const existingOrderResult = await db
      .select()
      .from(schema.orders)
      .where(
        and(
          eq(schema.orders.tenantId, tenant.id),
          eq(schema.orders.idempotencyKey, effectiveIdempotencyKey)
        )
      )
      .limit(1);

    if (existingOrderResult.length > 0) {
      const existingOrder = existingOrderResult[0];
      return NextResponse.json({
        success: true,
        isIdempotentReplay: true,
        orderCode: existingOrder.orderCode,
        subtotal: Number(existingOrder.subtotal),
        deliveryFee: Number(existingOrder.deliveryFee || 0),
        discountAmount: Number(existingOrder.discountAmount || 0),
        taxAmount: Number(existingOrder.taxAmount || 0),
        serviceChargeAmount: Number(existingOrder.serviceChargeAmount || 0),
        total: Number(existingOrder.totalPrice),
        status: existingOrder.status,
      });
    }

    // 6. Generate Customer Token (SEC-001)
    const customerToken = crypto.randomBytes(32).toString("hex");
    const customerTokenHash = crypto.createHash("sha256").update(customerToken).digest("hex");

    const orderCode = generateOrderCode();
    const storedPaymentMethod = paymentMethod === "qris" ? "transfer" : paymentMethod;

    // 7. Atomic Multi-Statement Transaction
    const newOrder = await db.transaction(async (tx) => {
      const [insertedOrder] = await tx
        .insert(schema.orders)
        .values({
          tenantId: tenant.id,
          branchId: branch?.id || null,
          orderCode,
          customerName: customerName.trim(),
          customerPhone: cleanPhone,
          customerTokenHash,
          idempotencyKey: effectiveIdempotencyKey,
          idempotencyRequestHash,
          deliveryType: orderType,
          deliveryAddress: deliveryAddress?.trim() || null,
          deliveryDistance: branch?.distanceKm ? String(branch.distanceKm) : null,
          deliveryLat: customerLat ? String(customerLat) : null,
          deliveryLng: customerLng ? String(customerLng) : null,
          deliveryFee: deliveryFee ?? 0,
          subtotal: String(subtotal),
          discountAmount: String(discountAmount),
          taxAmount: String(taxAmount),
          serviceChargeAmount: String(serviceChargeAmount),
          totalPrice: String(totalPrice),
          status: "received",
          paymentMethod: storedPaymentMethod,
          paymentStatus: "pending",
          pricingSnapshot,
          notes: itemsBreakdown.map((i) => i.note).filter(Boolean).join(" | ") || null,
        })
        .returning();

      const orderItemValues = itemsBreakdown.map((item) => ({
        orderId: insertedOrder.id,
        menuItemId: item.menuItemId,
        menuItemName: item.menuItemName,
        variantName: item.variantName || null,
        quantity: item.quantity,
        unitPrice: String(item.unitPrice),
        totalPrice: String(item.totalPrice),
        note: item.note || null,
      }));

      await tx.insert(schema.orderItems).values(orderItemValues);

      // Insert transactional Outbox Event (SEC-008)
      await tx.insert(schema.outboxEvents).values({
        tenantId: tenant.id,
        aggregateType: "order",
        aggregateId: insertedOrder.id,
        eventType: "order.created",
        payload: {
          orderId: insertedOrder.id,
          orderCode: insertedOrder.orderCode,
          branchId: branch?.id || null,
          deliveryType: orderType,
          totalPrice,
          paymentMethod: storedPaymentMethod,
        },
        status: "pending",
      });

      return insertedOrder;
    });

    // 8. Trigger asynchronous outbox dispatch (non-blocking)
    try {
      fetch(`${new URL(request.url).origin}/api/internal/outbox/dispatch`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CRON_SECRET || ""}`,
        },
      }).catch(() => {});
    } catch {
      // Background dispatch failure is safely recovered by scheduled sweeper
    }

    const response = NextResponse.json(
      {
        success: true,
        orderCode,
        customerToken,
        subtotal,
        deliveryFee,
        discountAmount,
        taxAmount,
        serviceChargeAmount,
        total: totalPrice,
        status: newOrder.status,
      },
      { status: 201 }
    );

    // Set secure HttpOnly cookie for order ownership
    response.cookies.set(`cust_tok_${orderCode}`, customerToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    console.error("[orders/route] Unexpected error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan sistem saat membuat pesanan." }, { status: 500 });
  }
}
