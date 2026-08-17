import { NextResponse } from "next/server";
import { db, schema } from "@taj-saas/db";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";
import { resolveTenantFromRequestHost } from "@lib/tenant-authorization";
import { rateLimiter } from "@lib/server/rate-limiter";

function maskName(name: string): string {
  if (!name) return "";
  const parts = name.trim().split(" ");
  return parts
    .map((p) => (p.length > 2 ? `${p[0]}${"*".repeat(p.length - 2)}${p[p.length - 1]}` : p))
    .join(" ");
}

function maskPhone(phone: string): string {
  if (!phone || phone.length < 8) return phone;
  return `${phone.slice(0, 4)}****${phone.slice(-4)}`;
}

// Get order tracking details with customer token authorization
export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
): Promise<NextResponse> {
  try {
    const { code } = await params;
    const cleanCode = (code || "").trim().toUpperCase();

    const host = request.headers.get("host") || "";
    const tenant = await resolveTenantFromRequestHost(host, { expectedApp: "customer" });

    // Rate Limiting
    const forwardedFor = request.headers.get("x-forwarded-for") || "";
    const clientIp = forwardedFor.split(",")[0]?.trim() || "127.0.0.1";

    const rateResult = await rateLimiter.check(clientIp, "order_tracking");
    if (!rateResult.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan pelacakan. Silakan tunggu beberapa saat." },
        { status: 429 }
      );
    }

    const [order] = await db
      .select()
      .from(schema.orders)
      .where(and(eq(schema.orders.orderCode, cleanCode), eq(schema.orders.tenantId, tenant.id)))
      .limit(1);

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    // Check customer token ownership
    const cookieToken = request.headers.get("cookie")?.split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`cust_tok_${cleanCode}=`))
      ?.split("=")[1];

    const headerToken = request.headers.get("x-customer-token");
    const providedToken = headerToken || cookieToken || "";

    const isAuthorized =
      !order.customerTokenHash ||
      (providedToken &&
        crypto.createHash("sha256").update(providedToken).digest("hex") === order.customerTokenHash);

    // Fetch order items
    const dbItems = await db
      .select()
      .from(schema.orderItems)
      .where(eq(schema.orderItems.orderId, order.id));

    const items = dbItems.map((item) => ({
      cartId: item.id,
      menuItem: {
        id: item.menuItemId || "",
        name: item.menuItemName,
        price: Number(item.unitPrice),
      },
      variantName: item.variantName || null,
      quantity: item.quantity,
      note: item.note || "",
      totalPrice: Number(item.totalPrice),
    }));

    if (isAuthorized) {
      // Return full detailed order object
      return NextResponse.json({
        isAuthorized: true,
        orderCode: order.orderCode,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        orderType: order.deliveryType,
        deliveryAddress: order.deliveryAddress || undefined,
        subtotal: Number(order.subtotal),
        deliveryFee: Number(order.deliveryFee ?? 0),
        discountAmount: Number(order.discountAmount ?? 0),
        taxAmount: Number(order.taxAmount ?? 0),
        serviceChargeAmount: Number(order.serviceChargeAmount ?? 0),
        total: Number(order.totalPrice),
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        paymentProofUrl: order.paymentProofUrl || undefined,
        notes: order.notes || undefined,
        createdAt: order.createdAt.toISOString(),
        items,
      });
    }

    // Masked public status (SEC-001)
    return NextResponse.json({
      isAuthorized: false,
      orderCode: order.orderCode,
      customerName: maskName(order.customerName),
      customerPhone: maskPhone(order.customerPhone),
      orderType: order.deliveryType,
      total: Number(order.totalPrice),
      status: order.status,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt.toISOString(),
      items: items.map((i) => ({
        menuItem: { name: i.menuItem.name, price: i.menuItem.price },
        quantity: i.quantity,
        totalPrice: i.totalPrice,
      })),
    });
  } catch (err: unknown) {
    console.error("[GET /api/orders/[code]] Error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan sistem saat melacak pesanan." }, { status: 500 });
  }
}

// Request cancellation or refund for customer order (SEC-011)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
): Promise<NextResponse> {
  try {
    const { code } = await params;
    const cleanCode = (code || "").trim().toUpperCase();

    const host = request.headers.get("host") || "";
    const tenant = await resolveTenantFromRequestHost(host, { expectedApp: "customer" });

    const forwardedFor = request.headers.get("x-forwarded-for") || "";
    const clientIp = forwardedFor.split(",")[0]?.trim() || "127.0.0.1";

    const rateResult = await rateLimiter.check(clientIp, "order_cancellation");
    if (!rateResult.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan pembatalan. Silakan tunggu beberapa saat." },
        { status: 429 }
      );
    }

    const { reason, bankName, accountNumber, accountHolder, customerToken } = await request.json();

    const [order] = await db
      .select()
      .from(schema.orders)
      .where(and(eq(schema.orders.orderCode, cleanCode), eq(schema.orders.tenantId, tenant.id)))
      .limit(1);

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    // Verify token authorization
    if (order.customerTokenHash) {
      const providedToken =
        customerToken ||
        request.headers.get("x-customer-token") ||
        request.headers.get("cookie")?.split(";")
          .map((c) => c.trim())
          .find((c) => c.startsWith(`cust_tok_${cleanCode}=`))
          ?.split("=")[1] ||
        "";

      const providedHash = crypto.createHash("sha256").update(providedToken).digest("hex");
      if (providedHash !== order.customerTokenHash) {
        return NextResponse.json({ error: "Otorisasi token pesanan tidak valid." }, { status: 403 });
      }
    }

    if (order.status === "cancelled" || order.status === "completed") {
      return NextResponse.json({ error: `Pesanan sudah berstatus '${order.status}'.` }, { status: 400 });
    }

    // Direct cancel condition: Unpaid received order
    if (order.status === "received" && order.paymentStatus === "pending") {
      await db.transaction(async (tx) => {
        await tx
          .update(schema.orders)
          .set({ status: "cancelled", updatedAt: new Date() })
          .where(eq(schema.orders.id, order.id));

        await tx.insert(schema.outboxEvents).values({
          tenantId: tenant.id,
          aggregateType: "order",
          aggregateId: order.id,
          eventType: "order.cancelled_by_customer",
          payload: { orderId: order.id, orderCode: order.orderCode, reason: reason || "Customer request" },
          status: "pending",
        });
      });

      return NextResponse.json({
        success: true,
        directCancel: true,
        message: "Pesanan Anda berhasil dibatalkan.",
      });
    }

    // Paid or in-kitchen order: Create cancellation request for staff review (SEC-011)
    const [cancellationReq] = await db
      .insert(schema.orderCancellationRequests)
      .values({
        tenantId: tenant.id,
        orderId: order.id,
        reason: (reason || "Pembatalan oleh pelanggan").trim().slice(0, 500),
        bankName: bankName ? bankName.trim().slice(0, 50) : null,
        accountNumber: accountNumber ? accountNumber.trim().slice(0, 50) : null,
        accountHolder: accountHolder ? accountHolder.trim().slice(0, 100) : null,
        status: "pending",
      })
      .returning();

    await db.insert(schema.outboxEvents).values({
      tenantId: tenant.id,
      aggregateType: "order",
      aggregateId: order.id,
      eventType: "order.cancellation_requested",
      payload: {
        orderId: order.id,
        orderCode: order.orderCode,
        cancellationRequestId: cancellationReq.id,
        reason,
      },
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      directCancel: false,
      cancellationRequestId: cancellationReq.id,
      message: "Pengajuan pembatalan & pengembalian dana telah diterima dan akan direview oleh staf restoran.",
    });
  } catch (err: unknown) {
    console.error("[POST /api/orders/[code]/cancel] Error:", err);
    return NextResponse.json({ error: "Gagal memproses pembatalan pesanan." }, { status: 500 });
  }
}
