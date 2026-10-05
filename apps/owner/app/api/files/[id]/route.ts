export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db, schema } from "@taj-saas/db";
import { and, eq } from "drizzle-orm";
import { requireTenantSession, AuthorizationError } from "@lib/tenant-authorization";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return new NextResponse("ID file tidak valid", { status: 400 });
    }

    // 1. Authenticate owner session & resolve tenant in owner app
    const { tenant, profile } = await requireTenantSession({ expectedApp: "owner" });

    // Verify authorized roles
    const AUTHORIZED_ROLES = ["owner", "manager"];
    if (!AUTHORIZED_ROLES.includes(profile.role)) {
      return new NextResponse("Akses ditolak: role tidak memiliki izin melihat bukti pembayaran", { status: 403 });
    }

    // 2. Fetch file by ID with tenant isolation
    const [file] = await db
      .select()
      .from(schema.files)
      .where(and(eq(schema.files.id, id), eq(schema.files.tenantId, tenant.id)))
      .limit(1);

    if (!file) {
      return new NextResponse("File tidak ditemukan", { status: 404 });
    }

    // 3. Decode base64 content
    const base64Data = file.content.split(",")[1] || file.content;
    const buffer = Buffer.from(base64Data, "base64");

    // Enforce strict content type whitelist
    const SAFE_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
    const contentType = SAFE_IMAGE_TYPES.has(file.fileType) ? file.fileType : "image/jpeg";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return new NextResponse(err.message, { status: err.status });
    }
    console.error("[Owner File API] Error serving file:", err);
    return new NextResponse("Terjadi kesalahan internal", { status: 500 });
  }
}
