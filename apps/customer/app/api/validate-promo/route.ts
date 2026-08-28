export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db, schema } from "@taj-saas/db";
import { eq, and } from "drizzle-orm";
import { resolveTenantFromRequestHost } from "@lib/tenant-authorization";
import { rateLimiter } from "@lib/server/rate-limiter";

export interface ValidatePromoRequest {
  code: string;
  subtotal: number;
  items?: Array<{
    slug: string;
    category?: string;
    totalPrice: number;
  }>;
}

export interface ValidatePromoResponse {
  valid: boolean;
  message: string;
  discountAmount: number;
  promoCode: string;
  description?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const host = request.headers.get("host") || "";
    const tenant = await resolveTenantFromRequestHost(host, { expectedApp: "customer" });

    const forwardedFor = request.headers.get("x-forwarded-for") || "";
    const clientIp = forwardedFor.split(",")[0]?.trim() || "127.0.0.1";

    const rateResult = await rateLimiter.check(clientIp, "validate_promo");
    if (!rateResult.allowed) {
      return NextResponse.json<ValidatePromoResponse>(
        {
          valid: false,
          message: "Terlalu banyak percobaan kode promo. Silakan tunggu beberapa saat.",
          discountAmount: 0,
          promoCode: "",
        },
        { status: 429 }
      );
    }

    const body: ValidatePromoRequest = await request.json();
    const { code, subtotal, items = [] } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json<ValidatePromoResponse>({
        valid: false,
        message: "Kode promo tidak valid.",
        discountAmount: 0,
        promoCode: "",
      });
    }

    const cleanCode = code.trim().toUpperCase().slice(0, 30);

    const [promo] = await db
      .select()
      .from(schema.promos)
      .where(
        and(
          eq(schema.promos.tenantId, tenant.id),
          eq(schema.promos.code, cleanCode),
          eq(schema.promos.isActive, true)
        )
      )
      .limit(1);

    if (!promo) {
      return NextResponse.json<ValidatePromoResponse>({
        valid: false,
        message: `Kode promo "${cleanCode}" tidak ditemukan atau sudah tidak aktif.`,
        discountAmount: 0,
        promoCode: cleanCode,
      });
    }

    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return NextResponse.json<ValidatePromoResponse>({
        valid: false,
        message: `Kode promo "${cleanCode}" sudah kedaluwarsa.`,
        discountAmount: 0,
        promoCode: cleanCode,
      });
    }

    const minOrder = Number(promo.minOrder || 0);
    if (subtotal < minOrder) {
      return NextResponse.json<ValidatePromoResponse>({
        valid: false,
        message: `Minimal belanja untuk kode "${cleanCode}" adalah Rp ${minOrder.toLocaleString("id-ID")}.`,
        discountAmount: 0,
        promoCode: cleanCode,
      });
    }

    let discountAmount = 0;
    const promoVal = Number(promo.value) || 0;

    if (promo.targetCategory === "all") {
      discountAmount =
        promo.type === "fixed" ? promoVal : Math.round((subtotal * promoVal) / 100);
    } else {
      const categoryTotal = items
        .filter((i) => (i.category || "").toLowerCase() === promo.targetCategory.toLowerCase())
        .reduce((sum, i) => sum + i.totalPrice, 0);

      if (categoryTotal === 0) {
        return NextResponse.json<ValidatePromoResponse>({
          valid: false,
          message: `Kode promo ini hanya berlaku untuk kategori "${promo.targetCategory}".`,
          discountAmount: 0,
          promoCode: cleanCode,
        });
      }

      discountAmount =
        promo.type === "fixed"
          ? Math.min(promoVal, categoryTotal)
          : Math.round((categoryTotal * promoVal) / 100);
    }

    discountAmount = Math.min(discountAmount, subtotal);

    return NextResponse.json<ValidatePromoResponse>({
      valid: true,
      message: `Kode promo "${cleanCode}" berhasil diterapkan! Hemat Rp ${discountAmount.toLocaleString("id-ID")}`,
      discountAmount,
      promoCode: cleanCode,
      description:
        promo.type === "fixed"
          ? `Potongan langsung Rp ${promoVal.toLocaleString("id-ID")}`
          : `Diskon ${promoVal}%`,
    });
  } catch (err: unknown) {
    console.error("[validate-promo] Unexpected error:", err);
    return NextResponse.json<ValidatePromoResponse>(
      {
        valid: false,
        message: "Terjadi kesalahan sistem saat memvalidasi promo.",
        discountAmount: 0,
        promoCode: "",
      },
      { status: 500 }
    );
  }
}
