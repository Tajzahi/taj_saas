// API Route: Server-Side Promo Code Validation
// Path: src/app/api/validate-promo/route.ts
//
// ✅ Kode promo HANYA ada di server — tidak pernah ter-bundle ke browser.
// Hacker tidak bisa membaca, bypass, atau memanipulasi promo dari DevTools.

import { NextResponse } from 'next/server';

import { db, schema } from '@taj-saas/db';
import { eq, and } from 'drizzle-orm';

export interface ValidatePromoRequest {
  code: string;
  subtotal: number;
  // Items minimal: slug + totalPrice untuk hitung diskon per kategori
  items: Array<{
    slug: string;
    category: string;
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
    const body: ValidatePromoRequest = await request.json();
    const { code, subtotal, items } = body;

    // ── Input validation ──
    if (!code || typeof code !== 'string') {
      return NextResponse.json<ValidatePromoResponse>({
        valid: false,
        message: 'Kode promo tidak valid.',
        discountAmount: 0,
        promoCode: '',
      });
    }

    const cleanCode = code.trim().toUpperCase().slice(0, 30); // max 30 chars
    
    // Get tenant
    const tenantSlug = request.headers.get('x-tenant-slug') || 'taj-saas';
    const tenantResult = await db.select().from(schema.tenants).where(eq(schema.tenants.slug, tenantSlug)).limit(1);
    const tenant = tenantResult[0];

    if (!tenant) {
      return NextResponse.json({ valid: false, message: 'Tenant tidak valid.', discountAmount: 0, promoCode: '' }, { status: 400 });
    }

    // Get promo from DB
    const promoResult = await db.select().from(schema.promos).where(
      and(
        eq(schema.promos.tenantId, tenant.id),
        eq(schema.promos.code, cleanCode),
        eq(schema.promos.isActive, true)
      )
    ).limit(1);
    
    const promo = promoResult[0];

    if (!promo) {
      return NextResponse.json<ValidatePromoResponse>({
        valid: false,
        message: 'Kode promo tidak ditemukan atau sudah kedaluwarsa.',
        discountAmount: 0,
        promoCode: cleanCode,
      });
    }

    // ── Minimum order check ──
    const minOrderVal = Number(promo.minOrder);
    if (subtotal < minOrderVal) {
      return NextResponse.json<ValidatePromoResponse>({
        valid: false,
        message: `Minimum pembelian untuk promo ini adalah Rp ${minOrderVal.toLocaleString('id-ID')}.`,
        discountAmount: 0,
        promoCode: cleanCode,
      });
    }

    // ── Calculate discount amount ──
    let discountAmount = 0;
    const promoValue = Number(promo.value);

    if (promo.targetCategory === 'all') {
      // Diskon berlaku untuk semua item
      if (promo.type === 'fixed') {
        discountAmount = promoValue;
      } else {
        discountAmount = Math.round(subtotal * (promoValue / 100));
      }
    } else {
      // Diskon hanya untuk kategori tertentu (misal: terang-bulan)
      const categoryTotal = items
        .filter(
          (item) =>
            item.category === promo.targetCategory ||
            item.slug.includes(promo.targetCategory)
        )
        .reduce((sum, item) => sum + item.totalPrice, 0);

      if (promo.type === 'fixed') {
        discountAmount = Math.min(promoValue, categoryTotal);
      } else {
        discountAmount = Math.round(categoryTotal * (promoValue / 100));
      }
    }

    return NextResponse.json<ValidatePromoResponse>({
      valid: true,
      message: `Promo ${cleanCode} berhasil diterapkan!`,
      discountAmount,
      promoCode: cleanCode,
      description: `Diskon ${promo.type === 'percent' ? promoValue + '%' : 'Rp ' + promoValue}`,
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json<ValidatePromoResponse & { error?: string }>(
      {
        valid: false,
        error: e?.message,
        message: e?.message || 'Terjadi kesalahan saat memvalidasi promo.',
        discountAmount: 0,
        promoCode: '',
      },
      { status: 400 }
    );
  }
}
