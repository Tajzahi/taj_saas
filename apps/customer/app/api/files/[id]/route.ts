import { NextResponse } from "next/server";
import { db, schema } from "@taj-saas/db";
import { and, eq } from "drizzle-orm";
import crypto from "crypto";
import { resolveTenantFromRequestHost, requireTenantSession } from "@lib/tenant-authorization";

function timingSafeEqualHex(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const host = request.headers.get("host") || "";
    const tenant = await resolveTenantFromRequestHost(host);

    const resolvedParams = await params;
    const id = resolvedParams.id;

    const [file] = await db
      .select()
      .from(schema.files)
      .where(and(eq(schema.files.id, id), eq(schema.files.tenantId, tenant.id)))
      .limit(1);

    if (!file) {
      return new NextResponse("File tidak ditemukan", { status: 404 });
    }

    // ── Authorization Check (R2-006) ──
    let isAuthorized = false;

    // 1. Check if requester has a valid staff session for this tenant
    try {
      const staffContext = await requireTenantSession();
      if (
        staffContext.tenant.id === tenant.id &&
        ["owner", "manager", "kasir"].includes(staffContext.profile.role)
      ) {
        isAuthorized = true;
      }
    } catch {
      // Not a staff member, fall through to check customer ownership
    }

    // 2. If not staff, verify customer token against linked order using constant-time comparison
    if (!isAuthorized && file.orderId) {
      const [order] = await db
        .select({
          orderCode: schema.orders.orderCode,
          customerTokenHash: schema.orders.customerTokenHash,
        })
        .from(schema.orders)
        .where(and(eq(schema.orders.id, file.orderId), eq(schema.orders.tenantId, tenant.id)))
        .limit(1);

      if (order && order.customerTokenHash) {
        const headerToken = request.headers.get("x-customer-token");
        const cookieToken = request.headers
          .get("cookie")
          ?.split(";")
          .map((c) => c.trim())
          .find((c) => c.startsWith(`cust_tok_${order.orderCode}=`))
          ?.split("=")[1];

        const providedToken = headerToken || cookieToken || "";
        if (providedToken) {
          const providedHash = crypto.createHash("sha256").update(providedToken).digest("hex");
          if (timingSafeEqualHex(providedHash, order.customerTokenHash)) {
            isAuthorized = true;
          }
        }
      }
    }

    if (!isAuthorized) {
      return new NextResponse("Akses tidak diizinkan untuk file ini", { status: 403 });
    }

    const base64Data = file.content.split(",")[1] || file.content;
    const buffer = Buffer.from(base64Data, "base64");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": file.fileType,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: unknown) {
    console.error("[files/route] Error fetching file:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
