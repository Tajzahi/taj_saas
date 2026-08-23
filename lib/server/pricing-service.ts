import { db, schema } from "@taj-saas/db";
import { eq, and, inArray, or, SQL } from "drizzle-orm";

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

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
  const rawTaxRate = typeof branding.taxRateBps === 'number' ? branding.taxRateBps : (typeof branding.taxRate === 'number' ? Math.round(branding.taxRate * 100) : 0);
  const taxRateBps = Math.max(0, Number(rawTaxRate || 0)); // e.g. 10% = 1000 bps
  const rawServiceChargeRate = typeof branding.serviceChargeRateBps === 'number' ? branding.serviceChargeRateBps : (typeof branding.serviceChargeRate === 'number' ? Math.round(branding.serviceChargeRate * 100) : 0);
  const serviceChargeRateBps = Math.max(0, Number(rawServiceChargeRate || 0)); // e.g. 5% = 500 bps

  // 2. Resolve Active Branch
  const branches = await db
    .select()
    .from(schema.branches)
    .where(and(eq(schema.branches.tenantId, tenantId), eq(schema.branches.status, "active")));

  let selectedBranch = branches.find((b) => b.id === branchId);

  if (selectedBranch && deliveryType === "delivery" && !selectedBranch.acceptsOnlineOrders) {
    throw new Error(`Cabang '${selectedBranch.name}' saat ini tidak melayani pemesanan online / delivery.`);
  }

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

  // 3. Fetch canonical menu items from database (R2-001: Separate UUID from Slugs)
  if (!items || items.length === 0) {
    throw new Error("Daftar item pesanan kosong.");
  }

  const itemIds: string[] = [];
  const itemSlugs: string[] = [];

  for (const i of items) {
    if (i.menuItemId && UUID_REGEX.test(i.menuItemId)) {
      itemIds.push(i.menuItemId);
    } else if (i.menuItemId) {
      itemSlugs.push(i.menuItemId);
    }
    if (i.menuItemSlug) {
      itemSlugs.push(i.menuItemSlug);
    }
  }

  const distinctIds = Array.from(new Set(itemIds));
  const distinctSlugs = Array.from(new Set(itemSlugs));

  const queryOrConditions: SQL[] = [];
  if (distinctIds.length > 0) {
    queryOrConditions.push(inArray(schema.menuItems.id, distinctIds));
  }
  if (distinctSlugs.length > 0) {
    queryOrConditions.push(inArray(schema.menuItems.slug, distinctSlugs));
  }

  const dbMenuItems = queryOrConditions.length > 0
    ? await db
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
            or(...queryOrConditions)
          )
        )
    : [];

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
    const dbItem =
      (item.menuItemId ? itemMapById.get(item.menuItemId) || itemMapBySlug.get(item.menuItemId) : null) ||
      (item.menuItemSlug ? itemMapBySlug.get(item.menuItemSlug) : null);

    if (!dbItem) {
      throw new Error(`Menu item '${item.menuItemName || item.menuItemSlug || item.menuItemId}' tidak ditemukan di katalog gerai ini.`);
    }

    if (!dbItem.isAvailable) {
      throw new Error(`Menu '${dbItem.name}' saat ini sedang tidak tersedia.`);
    }

    let unitPrice = Number(dbItem.price);

    // R2-002: Comprehensive Variant Modifier Resolution
    if (item.variantName) {
      if (dbItem.variants && Array.isArray(dbItem.variants)) {
        const selectedNames = item.variantName.split(",").map((s) => s.trim().toLowerCase());

        for (const variantGroup of dbItem.variants as any[]) {
          // Case A: Nested structure with options array [{ name, priceModifier }]
          if (Array.isArray(variantGroup.options)) {
            for (const opt of variantGroup.options) {
              if (opt?.name && selectedNames.includes(opt.name.toLowerCase())) {
                unitPrice += Math.max(0, Number(opt.priceModifier || 0));
              }
            }
          }
          // Case B: Flat variant object [{ name, priceModifier }]
          else if (variantGroup?.name && selectedNames.includes(variantGroup.name.toLowerCase())) {
            unitPrice += Math.max(0, Number(variantGroup.priceModifier || 0));
          }
        }
      } else {
        // Fallback: parse price modifiers directly from text like "(+Rp 5.000)"
        const modifierMatches = item.variantName.matchAll(/\(\+Rp\s*([\d\.]+)\)/gi);
        for (const match of modifierMatches) {
          const modAmount = Number(match[1].replace(/\./g, ''));
          if (!isNaN(modAmount) && modAmount > 0) {
            unitPrice += modAmount;
          }
        }
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

  // 5. Server-Authoritative Delivery Fee Calculation (R2-003: Strict distance and coordinates enforcement)
  let deliveryFee = 0;
  let distanceKm: number | undefined = undefined;

  if (deliveryType === "delivery") {
    if (customerLat === undefined || customerLng === undefined) {
      throw new Error("Koordinat lokasi pengiriman (lat/lng) wajib disertakan untuk pesanan delivery.");
    }

    if (!selectedBranch || !selectedBranch.outletLat || !selectedBranch.outletLng) {
      throw new Error("Cabang belum memiliki koordinat lokasi gerai yang valid untuk kalkulasi pengiriman.");
    }

    const bLat = Number(selectedBranch.outletLat);
    const bLng = Number(selectedBranch.outletLng);
    distanceKm = calculateHaversineDistanceKm(bLat, bLng, customerLat, customerLng);

    const zones = selectedBranch.deliveryZones || [];
    if (zones.length > 0) {
      const maxAllowedDistance = Math.max(...zones.map((z) => z.maxDistanceKm));
      if (distanceKm > maxAllowedDistance) {
        throw new Error(
          `Lokasi pengiriman (${distanceKm} km) melebihi jangkauan maksimal layanan cabang (${maxAllowedDistance} km).`
        );
      }

      const matchingZone = zones.find((z) => distanceKm! <= z.maxDistanceKm);
      if (matchingZone) {
        deliveryFee = matchingZone.baseFee + Math.round(distanceKm * matchingZone.perKmFee);
      } else {
        throw new Error(`Tidak ditemukan zona pengiriman yang sesuai untuk jarak ${distanceKm} km.`);
      }
    } else {
      // Flat delivery configured on tenant (Strict radius max 10 km)
      if (distanceKm > 10) {
        throw new Error(`Lokasi pengiriman (${distanceKm} km) melebihi radius maksimal toko (10 km).`);
      }
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
