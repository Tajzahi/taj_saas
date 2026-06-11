// API Route: Server-Side Promo Code Validation
// Path: src/app/api/validate-promo/route.ts
//
// ✅ Kode promo HANYA ada di server — tidak pernah ter-bundle ke browser.
// Hacker tidak bisa membaca, bypass, atau memanipulasi promo dari DevTools.

import { NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────
// KONFIGURASI PROMO — Hanya bisa diakses dari server.
// Untuk keamanan lebih lanjut, pindahkan ke tabel database
// `promo_codes` agar bisa dikelola dari admin panel.
// ─────────────────────────────────────────────────────────
interface PromoConfig {
  type: 'percent' | 'fixed';
  value: number;             // Persentase (0–100) atau nominal Rupiah
  minOrder: number;          // Minimum subtotal untuk berlaku
  targetCategory: 'terang-bulan' | 'all'; // Kategori yang mendapat diskon
  description: string;
}

const PROMO_CODES: Record<string, PromoConfig> = {
  ANNIV25: {
    type: 'percent',
    value: 25,
    minOrder: 50000,
    targetCategory: 'terang-bulan',
    description: 'Diskon 25% untuk semua Terang Bulan (min. Rp 50.000)',
  },
  WEBAPPNEW: {
    type: 'fixed',
    value: 5000,
    minOrder: 40000,
    targetCategory: 'all',
    description: 'Potongan Rp 5.000 (gratis Es Teh) (min. Rp 40.000)',
  },
  SATURDAY15: {
    type: 'percent',
    value: 15,
    minOrder: 0,
    targetCategory: 'terang-bulan',
    description: 'Diskon 15% untuk semua Terang Bulan',
  },
};
// ─────────────────────────────────────────────────────────

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
    const promo = PROMO_CODES[cleanCode];

    if (!promo) {
      return NextResponse.json<ValidatePromoResponse>({
        valid: false,
        message: 'Kode promo tidak ditemukan atau sudah kedaluwarsa.',
        discountAmount: 0,
        promoCode: cleanCode,
      });
    }

    // ── Minimum order check ──
    if (subtotal < promo.minOrder) {
      return NextResponse.json<ValidatePromoResponse>({
        valid: false,
        message: `Minimum pembelian untuk promo ini adalah Rp ${promo.minOrder.toLocaleString('id-ID')}.`,
        discountAmount: 0,
        promoCode: cleanCode,
      });
    }

    // ── Calculate discount amount ──
    let discountAmount = 0;

    if (promo.targetCategory === 'all') {
      // Diskon berlaku untuk semua item
      if (promo.type === 'fixed') {
        discountAmount = promo.value;
      } else {
        discountAmount = Math.round(subtotal * (promo.value / 100));
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
        discountAmount = Math.min(promo.value, categoryTotal);
      } else {
        discountAmount = Math.round(categoryTotal * (promo.value / 100));
      }
    }

    return NextResponse.json<ValidatePromoResponse>({
      valid: true,
      message: `Promo ${cleanCode} berhasil diterapkan!`,
      discountAmount,
      promoCode: cleanCode,
      description: promo.description,
    });
  } catch {
    return NextResponse.json<ValidatePromoResponse>(
      {
        valid: false,
        message: 'Terjadi kesalahan saat memvalidasi promo.',
        discountAmount: 0,
        promoCode: '',
      },
      { status: 500 }
    );
  }
}
