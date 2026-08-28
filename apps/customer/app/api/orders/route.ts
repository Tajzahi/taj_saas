export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db, schema } from "@taj-saas/db";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";
import { resolveTenantFromRequestHost, AuthorizationError } from "@lib/tenant-authorization";
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
  notes?: string;
  paymentMethod: "cod" | "qris" | "transfer";
  idempotencyKey?: string;
  customerToken?: string;
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
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
      notes,
      paymentMethod,
      idempotencyKey,
      customerToken: clientCustomerToken,
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

    // 4. Server-Side Canonical Pricing Verification
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

    // 5. Customer Token Resolution (Client-provided or generated)
    const effectiveCustomerToken =
      clientCustomerToken ||
      request.headers.get("x-customer-token") ||
      crypto.randomBytes(32).toString("hex");

    const customerTokenHash = crypto.createHash("sha256").update(effectiveCustomerToken).digest("hex");
    const storedPaymentMethod = paymentMethod === "qris" ? "transfer" : paymentMethod;

    // 6. Comprehensive Canonical Fingerprint & Idempotency Check (R2-004)
    const effectiveIdempotencyKey = idempotencyKey?.trim() || `IDEM-${crypto.randomUUID()}`;
    const payloadCanonicalString = JSON.stringify({
      tenantId: tenant.id,
      branchId: branch?.id || null,
      customerName: customerName.trim(),
      phone: cleanPhone,
      orderType,
      deliveryAddress: deliveryAddress?.trim() || null,
      deliveryLat: customerLat ?? null,
      deliveryLng: customerLng ?? null,
      paymentMethod: storedPaymentMethod,
      promoCode: promoCode?.trim() || null,
      notes: notes?.trim() || null,
      items: itemsBreakdown.map((i) => ({
        id: i.menuItemId,
        slug: i.slug,
        qty: i.quantity,
        price: i.unitPrice,
        variant: i.variantName || null,
      })),
      subtotal,
      deliveryFee,
      discountAmount,
      taxAmount,
      serviceChargeAmount,
      total: totalPrice,
      idemKey: effectiveIdempotencyKey,
    });
    const idempotencyRequestHash = crypto.createHash("sha256").update(payloadCanonicalString).digest("hex");

    // Helper for safe idempotent replay
    const formatReplayResponse = (order: typeof schema.orders.$inferSelect) => {
      // Replay verification: verify customer token & fingerprint hash
      if (
        order.idempotencyRequestHash &&
        !timingSafeEqualHex(order.idempotencyRequestHash, idempotencyRequestHash)
      ) {
        return NextResponse.json(
          { error: "Idempotency key sudah digunakan untuk payload pemesanan yang berbeda." },
          { status: 409 }
        );
      }

      if (
        order.customerTokenHash &&
        !timingSafeEqualHex(order.customerTokenHash, customerTokenHash)
      ) {
        return NextResponse.json(
          { error: "Otorisasi token tidak cocok dengan pesanan idempotency yang sudah ada." },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        isIdempotentReplay: true,
        orderCode: order.orderCode,
        subtotal: Number(order.subtotal),
        deliveryFee: Number(order.deliveryFee || 0),
        discountAmount: Number(order.discountAmount || 0),
        taxAmount: Number(order.taxAmount || 0),
        serviceChargeAmount: Number(order.serviceChargeAmount || 0),
        total: Number(order.totalPrice),
        status: order.status,
      });
    };

    // Check if order with this idempotency key already exists
    const existingOrders = await db
      .select()
      .from(schema.orders)
      .where(
        and(
          eq(schema.orders.tenantId, tenant.id),
          eq(schema.orders.idempotencyKey, effectiveIdempotencyKey)
        )
      )
      .limit(1);

    if (existingOrders.length > 0) {
      return formatReplayResponse(existingOrders[0]);
    }

    const orderCode = generateOrderCode();

    // 7. Atomic Transaction with 23505 Duplicate Key Catch (R2-004)
    let newOrder;
    try {
      newOrder = await db.transaction(async (tx) => {
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
            notes: (notes || itemsBreakdown.map((i) => i.note).filter(Boolean).join(" | ")).trim().slice(0, 500) || null,
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

        // Transactional Outbox Event
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
    } catch (insertErr: any) {
      // Catch concurrent unique constraint violation on idempotency_key (PostgreSQL error 23505)
      if (insertErr?.code === "23505" || insertErr?.message?.includes("unique")) {
        const [replayed] = await db
          .select()
          .from(schema.orders)
          .where(
            and(
              eq(schema.orders.tenantId, tenant.id),
              eq(schema.orders.idempotencyKey, effectiveIdempotencyKey)
            )
          )
          .limit(1);

        if (replayed) {
          return formatReplayResponse(replayed);
        }
      }
      throw insertErr;
    }

    // 8. Trigger non-blocking outbox dispatch
    try {
      fetch(`${new URL(request.url).origin}/api/internal/outbox/dispatch`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CRON_SECRET || ""}`,
        },
      }).catch(() => {});
    } catch {
      // Handled by scheduled sweeper
    }

    const response = NextResponse.json(
      {
        success: true,
        orderCode,
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
    response.cookies.set(`cust_tok_${orderCode}`, effectiveCustomerToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[orders/route] Unexpected error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan sistem saat membuat pesanan." }, { status: 500 });
  }
}
