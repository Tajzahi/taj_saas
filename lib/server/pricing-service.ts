import { db, schema } from "@taj-saas/db";
import { eq, and, inArray } from "drizzle-orm";

export interface PricingOrderItemInput {
  menuItemId?: string;
  menuItemSlug?: string;
  menuItemName?: string;
  variantName?: string;
  quantity: number;
  note?: string;
}

export interface PricingCalculationRequest {
  tenantId: string;
  branchId?: string;
  items: PricingOrderItemInput[];
  deliveryType: "dine_in" | "takeaway" | "pickup" | "delivery";
  promoCode?: string;
  customerLat?: number;
  customerLng?: number;
}

export interface PricingItemBreakdown {
  menuItemId: string;
  menuItemName: string;
  slug: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  variantName?: string | null;
  categorySlug?: string;
  note?: string;
}

export interface PricingCalculationResult {
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  taxAmount: number;
  serviceChargeAmount: number;
  totalPrice: number;
  appliedPromo?: {
    code: string;
    type: string;
    value: number;
    discount: number;
  } | null;
  branch?: {
    id: string;
    name: string;
    distanceKm?: number;
  } | null;
  itemsBreakdown: PricingItemBreakdown[];
  pricingSnapshot: Record<string, unknown>;
}

// ─── BPS ARITHMETIC & HAVERSINE HELPERS ────────────────────────────────────

export function computeBpsAmount(amount: number, rateBps: number): number {
  if (rateBps <= 0 || amount <= 0) return 0;
  return Math.round((amount * rateBps) / 10000);
}

export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

// ─── PRICING SERVICE ENGINE ─────────────────────────────────────────────────

export async function calculateOrderPricing(
  req: PricingCalculationRequest
): Promise<PricingCalculationResult> {
  const { tenantId, branchId, items, deliveryType, promoCode, customerLat, customerLng } = req;

  // 1. Fetch Tenant settings & branding
  const [tenant] = await db
    .select()
    .from(schema.tenants)
    .where(eq(schema.tenants.id, tenantId))
    .limit(1);

  if (!tenant) {
    throw new Error("Tenant tidak ditemukan.");
  }

  const branding = (tenant.branding || {}) as Record<string, unknown>;
  const taxRateBps = Number(branding.taxRateBps ?? 0); // 1000 = 10%
  const serviceChargeRateBps = Number(branding.serviceChargeRateBps ?? 0); // 500 = 5%

  // 2. Resolve Active Branch
  const branches = await db
    .select()
    .from(schema.branches)
    .where(and(eq(schema.branches.tenantId, tenantId), eq(schema.branches.status, "active")));

  let selectedBranch = branches.find((b) => b.id === branchId);

  if (!selectedBranch && customerLat !== undefined && customerLng !== undefined) {
    // Recommend nearest online branch
    const onlineBranches = branches.filter((b) => b.acceptsOnlineOrders);
    let minDistance = Infinity;
    for (const b of onlineBranches) {
      if (b.outletLat && b.outletLng) {
        const d = calculateHaversineDistanceKm(
          Number(b.outletLat),
          Number(b.outletLng),
          customerLat,
          customerLng
        );
        if (d < minDistance) {
          minDistance = d;
          selectedBranch = b;
        }
      }
    }
  }

  if (!selectedBranch) {
    selectedBranch = branches.find((b) => b.isPrimary) || branches[0];
  }

  // 3. Fetch canonical menu items from database (Never trust client prices)
  const itemIdsOrSlugs = items.map((i) => i.menuItemId || i.menuItemSlug).filter(Boolean) as string[];

  if (itemIdsOrSlugs.length === 0) {
    throw new Error("Daftar item pesanan kosong.");
  }

  const dbMenuItems = await db
    .select({
      id: schema.menuItems.id,
      slug: schema.menuItems.slug,
      name: schema.menuItems.name,
      price: schema.menuItems.price,
      isAvailable: schema.menuItems.isAvailable,
      categoryId: schema.menuItems.categoryId,
      variants: schema.menuItems.variants,
    })
    .from(schema.menuItems)
    .where(
      and(
        eq(schema.menuItems.tenantId, tenantId),
        inArray(schema.menuItems.id, itemIdsOrSlugs)
      )
    );

  // Map database categories
  const categories = await db
    .select({ id: schema.categories.id, slug: schema.categories.slug })
    .from(schema.categories)
    .where(eq(schema.categories.tenantId, tenantId));
  const categoryMap = new Map(categories.map((c) => [c.id, c.slug]));

  const itemMapById = new Map(dbMenuItems.map((item) => [item.id, item]));
  const itemMapBySlug = new Map(dbMenuItems.map((item) => [item.slug, item]));

  const itemsBreakdown: PricingItemBreakdown[] = [];
  let subtotal = 0;

  for (const item of items) {
    const dbItem = (item.menuItemId ? itemMapById.get(item.menuItemId) : null) ||
      (item.menuItemSlug ? itemMapBySlug.get(item.menuItemSlug) : null);

    if (!dbItem) {
      throw new Error(`Menu item '${item.menuItemName || item.menuItemId || item.menuItemSlug}' tidak ditemukan.`);
    }

    if (!dbItem.isAvailable) {
      throw new Error(`Menu '${dbItem.name}' saat ini sedang tidak tersedia.`);
    }

    let unitPrice = Number(dbItem.price);

    // Validate variant price modifiers from DB configuration
    if (item.variantName && dbItem.variants && Array.isArray(dbItem.variants)) {
      const matchedVariant = dbItem.variants.find(
        (v: any) => v.name?.toLowerCase() === item.variantName?.toLowerCase()
      );
      if (matchedVariant?.priceModifier) {
        unitPrice += Math.max(0, Number(matchedVariant.priceModifier));
      }
    }

    const qty = Math.max(1, Math.min(99, item.quantity));
    const itemTotal = unitPrice * qty;
    subtotal += itemTotal;

    const categorySlug = dbItem.categoryId ? categoryMap.get(dbItem.categoryId) : undefined;

    itemsBreakdown.push({
      menuItemId: dbItem.id,
      menuItemName: dbItem.name,
      slug: dbItem.slug,
      unitPrice,
      quantity: qty,
      totalPrice: itemTotal,
      variantName: item.variantName || null,
      categorySlug,
      note: item.note || undefined,
    });
  }

  // 4. Promo code calculation
  let discountAmount = 0;
  let appliedPromo: PricingCalculationResult["appliedPromo"] = null;

  if (promoCode && promoCode.trim().length > 0) {
    const cleanCode = promoCode.trim().toUpperCase().slice(0, 30);
    const [promo] = await db
      .select()
      .from(schema.promos)
      .where(
        and(
          eq(schema.promos.tenantId, tenantId),
          eq(schema.promos.code, cleanCode),
          eq(schema.promos.isActive, true)
        )
      )
      .limit(1);

    if (promo) {
      const isNotExpired = !promo.expiresAt || new Date(promo.expiresAt) > new Date();
      const meetsMinOrder = subtotal >= Number(promo.minOrder || 0);

      if (isNotExpired && meetsMinOrder) {
        const promoVal = Number(promo.value) || 0;

        if (promo.targetCategory === "all") {
          discountAmount =
            promo.type === "fixed" ? promoVal : Math.round((subtotal * promoVal) / 100);
        } else {
          const categorySubtotal = itemsBreakdown
            .filter((i) => i.categorySlug === promo.targetCategory)
            .reduce((sum, i) => sum + i.totalPrice, 0);

          discountAmount =
            promo.type === "fixed"
              ? Math.min(promoVal, categorySubtotal)
              : Math.round((categorySubtotal * promoVal) / 100);
        }

        discountAmount = Math.min(discountAmount, subtotal);
        appliedPromo = {
          code: promo.code,
          type: promo.type,
          value: promoVal,
          discount: discountAmount,
        };
      }
    }
  }

  // 5. Server-Authoritative Delivery Fee Calculation (SEC-005, Point 7)
  let deliveryFee = 0;
  let distanceKm: number | undefined = undefined;

  if (deliveryType === "delivery") {
    if (
      selectedBranch &&
      selectedBranch.outletLat &&
      selectedBranch.outletLng &&
      customerLat !== undefined &&
      customerLng !== undefined
    ) {
      const bLat = Number(selectedBranch.outletLat);
      const bLng = Number(selectedBranch.outletLng);
      distanceKm = calculateHaversineDistanceKm(bLat, bLng, customerLat, customerLng);

      const zones = selectedBranch.deliveryZones || [];
      if (zones.length > 0) {
        const matchingZone = zones.find((z) => distanceKm! <= z.maxDistanceKm);
        if (matchingZone) {
          deliveryFee = matchingZone.baseFee + Math.round(distanceKm! * matchingZone.perKmFee);
        } else {
          const maxZone = zones[zones.length - 1];
          if (maxZone && distanceKm! > maxZone.maxDistanceKm + 5) {
            throw new Error(`Lokasi pengiriman (${distanceKm} km) berada di luar jangkauan layanan cabang.`);
          }
          deliveryFee = maxZone ? maxZone.baseFee + Math.round(distanceKm! * maxZone.perKmFee) : 15000;
        }
      } else {
        // Flat delivery configured on tenant
        deliveryFee = Number(branding.flatDeliveryFee || 10000);
      }
    } else {
      // Fallback to tenant configured flat delivery fee (never trust client)
      deliveryFee = Number(branding.flatDeliveryFee || 10000);
    }
  }

  // 6. Tax & Service Charge (BPS arithmetic)
  const taxableBase = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxRateBps > 0 ? computeBpsAmount(taxableBase, taxRateBps) : 0;
  const serviceChargeAmount =
    serviceChargeRateBps > 0 ? computeBpsAmount(taxableBase, serviceChargeRateBps) : 0;

  const totalPrice = Math.max(0, taxableBase + deliveryFee + taxAmount + serviceChargeAmount);

  const pricingSnapshot = {
    subtotal,
    discountAmount,
    deliveryFee,
    taxAmount,
    taxRateBps,
    serviceChargeAmount,
    serviceChargeRateBps,
    totalPrice,
    calculatedAt: new Date().toISOString(),
    appliedPromo,
    distanceKm,
    branchId: selectedBranch?.id || null,
  };

  return {
    subtotal,
    discountAmount,
    deliveryFee,
    taxAmount,
    serviceChargeAmount,
    totalPrice,
    appliedPromo,
    branch: selectedBranch
      ? {
          id: selectedBranch.id,
          name: selectedBranch.name,
          distanceKm,
        }
      : null,
    itemsBreakdown,
    pricingSnapshot,
  };
}
