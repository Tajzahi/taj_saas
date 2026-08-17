import { NextResponse } from "next/server";
import { db, schema } from "@taj-saas/db";
import { and, eq } from "drizzle-orm";
import crypto from "crypto";
import { resolveTenantFromRequestHost } from "@lib/tenant-authorization";
import { rateLimiter } from "@lib/server/rate-limiter";

function validateImageMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true;
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return true;
  }
  // WebP: RIFF ... WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return true;
  }
  return false;
}

export async function POST(request: Request) {
  try {
    const host = request.headers.get("host") || "";
    const tenant = await resolveTenantFromRequestHost(host, { expectedApp: "customer" });

    const forwardedFor = request.headers.get("x-forwarded-for") || "";
    const clientIp = forwardedFor.split(",")[0]?.trim() || "127.0.0.1";

    const rateResult = await rateLimiter.check(clientIp, "upload_proof");
    if (!rateResult.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak unggahan file. Silakan tunggu beberapa saat." },
        { status: 429 }
      );
    }

    const { fileBase64, fileName, fileType, orderCode, customerToken } = await request.json();

    if (!fileBase64 || !fileName || !fileType || !orderCode) {
      return NextResponse.json({ error: "Data unggahan tidak lengkap." }, { status: 400 });
    }

    // Clean base64 string
    const base64Data = fileBase64.includes(",") ? fileBase64.split(",")[1] : fileBase64;
    const fileBuffer = Buffer.from(base64Data, "base64");

    // Size limit: 5MB
    if (fileBuffer.length > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran file maksimal 5MB." }, { status: 400 });
    }

    // Validate magic bytes (SEC-006)
    if (!validateImageMagicBytes(fileBuffer)) {
      return NextResponse.json(
        { error: "Format gambar tidak valid. Hanya file JPG, PNG, atau WebP yang diizinkan." },
        { status: 400 }
      );
    }

    // Verify order exists and belongs to tenant
    const [order] = await db
      .select()
      .from(schema.orders)
      .where(and(eq(schema.orders.orderCode, orderCode), eq(schema.orders.tenantId, tenant.id)))
      .limit(1);

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    // Validate customer token ownership if order is token-protected (SEC-001)
    if (order.customerTokenHash) {
      const providedToken =
        customerToken ||
        request.headers.get("x-customer-token") ||
        "";

      const providedTokenHash = crypto.createHash("sha256").update(providedToken).digest("hex");
      if (providedTokenHash !== order.customerTokenHash) {
        return NextResponse.json({ error: "Akses tidak diizinkan untuk pesanan ini." }, { status: 403 });
      }
    }

    // Atomic transaction for file insert and order update
    const proofUrl = await db.transaction(async (tx) => {
      const [newFile] = await tx
        .insert(schema.files)
        .values({
          tenantId: tenant.id,
          orderId: order.id,
          fileName: fileName.slice(0, 100).replace(/[^a-zA-Z0-9._-]/g, "_"),
          fileType: fileType.slice(0, 50),
          content: base64Data,
        })
        .returning();

      const generatedUrl = `/api/files/${newFile.id}`;

      await tx
        .update(schema.orders)
        .set({
          paymentProofUrl: generatedUrl,
          paymentStatus: "waiting_verification",
          updatedAt: new Date(),
        })
        .where(eq(schema.orders.id, order.id));

      await tx.insert(schema.outboxEvents).values({
        tenantId: tenant.id,
        aggregateType: "order",
        aggregateId: order.id,
        eventType: "order.payment_proof_uploaded",
        payload: {
          orderId: order.id,
          orderCode: order.orderCode,
          proofUrl: generatedUrl,
        },
        status: "pending",
      });

      return generatedUrl;
    });

    // Trigger non-blocking outbox dispatch
    try {
      fetch(`${new URL(request.url).origin}/api/internal/outbox/dispatch`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CRON_SECRET || ""}`,
        },
      }).catch(() => {});
    } catch {
      // Sweeper will recover
    }

    return NextResponse.json({
      success: true,
      proofUrl,
      message: "Bukti pembayaran berhasil diunggah dan sedang diverifikasi.",
    });
  } catch (err: unknown) {
    console.error("[upload-proof] Error:", err);
    return NextResponse.json({ error: "Gagal mengunggah bukti pembayaran." }, { status: 500 });
  }
}
