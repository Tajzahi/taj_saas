import { NextResponse } from 'next/server';
import { db, schema } from '@taj-saas/db';
import { and, eq } from 'drizzle-orm';
import Ably from 'ably';

export async function POST(request: Request) {
  try {
    const { fileBase64, fileName, fileType, orderCode } = await request.json();

    if (!fileBase64 || !fileName || !fileType) {
      return NextResponse.json({ error: 'File tidak lengkap.' }, { status: 400 });
    }

    if (!fileType.startsWith('image/')) {
      return NextResponse.json({ error: 'Tipe file harus gambar.' }, { status: 400 });
    }
    if ((fileBase64.length * 3) / 4 > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Maksimal 5MB.' }, { status: 400 });
    }

    const tenantSlug = request.headers.get('x-tenant-slug') || 'taj-saas';
    const tenantResult = await db.select().from(schema.tenants).where(eq(schema.tenants.slug, tenantSlug)).limit(1);
    const tenant = tenantResult[0];

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant tidak valid.' }, { status: 400 });
    }

    // Insert file as base64 string
    const [newFile] = await db.insert(schema.files).values({
      tenantId: tenant.id,
      fileName,
      fileType,
      content: fileBase64,
    }).returning();

    // If orderCode is provided, update the order
    if (orderCode) {
      const updatedOrders = await db.update(schema.orders)
        .set({ paymentProofUrl: `/api/files/${newFile.id}`, paymentStatus: 'waiting_verification' })
        .where(and(eq(schema.orders.orderCode, orderCode), eq(schema.orders.tenantId, tenant.id)))
        .returning();
      
      const updatedOrder = updatedOrders[0];

      // Publish update to Ably so admin dashboard gets notified
      const ablyKey = process.env.ABLY_API_KEY;
      if (ablyKey && updatedOrder) {
        try {
          const ably = new Ably.Rest({ key: ablyKey });
          const channel = ably.channels.get(`orders:${tenantSlug}`);
          await channel.publish('order-updated', {
            orderCode,
            paymentProofUrl: updatedOrder.paymentProofUrl,
            paymentStatus: updatedOrder.paymentStatus
          });
        } catch (ablyErr) {
          console.error('[Ably] Failed to publish order update event:', ablyErr);
        }
      }
    }

    return NextResponse.json({ success: true, fileId: newFile.id, fileUrl: `/api/files/${newFile.id}` });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Gagal mengupload file.' }, { status: 500 });
  }
}
