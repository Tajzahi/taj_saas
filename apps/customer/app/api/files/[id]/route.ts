import { NextResponse } from "next/server";
import { db, schema } from "@taj-saas/db";
import { and, eq } from "drizzle-orm";
import { resolveTenantFromRequestHost } from "@lib/tenant-authorization";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const host = request.headers.get("host") || "";
    const tenant = await resolveTenantFromRequestHost(host, { expectedApp: "customer" });

    const resolvedParams = await params;
    const id = resolvedParams.id;

    const fileResult = await db
      .select()
      .from(schema.files)
      .where(and(eq(schema.files.id, id), eq(schema.files.tenantId, tenant.id)))
      .limit(1);

    const file = fileResult[0];
    if (!file) {
      return new NextResponse("File tidak ditemukan", { status: 404 });
    }

    const base64Data = file.content.split(",")[1] || file.content;
    const buffer = Buffer.from(base64Data, "base64");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": file.fileType,
        "Cache-Control": "private, max-age=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: unknown) {
    console.error("[files/route] Error fetching file:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
