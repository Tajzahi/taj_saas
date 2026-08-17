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
  claimedDeliveryFee?: number;
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

  const branding = tenant.branding || {};
  const taxRateBps = Number(branding.taxRateBps ?? (branding.taxRate ? Math.round(branding.taxRate * 100) : 0));
  const serviceChargeRateBps = Number(
    branding.serviceChargeRateBps ??
      (branding.serviceChargeRate ? Math.round(branding.serviceChargeRate * 100) : 0)
  );

  // 2. Fetch active branch
  let selectedBranch: typeof schema.branches.$inferSelect | null = null;
  if (branchId) {
    const [b] = await db
      .select()
      .from(schema.branches)
      .where(and(eq(schema.branches.id, branchId), eq(schema.branches.tenantId, tenantId)))
      .limit(1);
    selectedBranch = b || null;
  }

  if (!selectedBranch) {
    // Fallback to primary branch or first active branch
    const branchList = await db
      .select()
      .from(schema.branches)
      .where(and(eq(schema.branches.tenantId, tenantId), eq(schema.branches.status, "active")))
      .limit(1);
    selectedBranch = branchList[0] || null;
  }

  // 3. Resolve and validate menu items & categories from DB
  const itemSlugs = items.map((i) => i.menuItemSlug).filter(Boolean) as string[];
  const itemIds = items.map((i) => i.menuItemId).filter(Boolean) as string[];

  const dbCategories = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.tenantId, tenantId));
  const categoryMap = new Map(dbCategories.map((c) => [c.id, c.slug]));

  const dbMenuItems = await db
    .select()
    .from(schema.menuItems)
    .where(
      and(
        eq(schema.menuItems.tenantId, tenantId),
        itemSlugs.length > 0
          ? inArray(schema.menuItems.slug, itemSlugs)
          : inArray(schema.menuItems.id, itemIds)
      )
    );

  const menuItemMap = new Map(
    dbMenuItems.map((m) => [m.slug, m])
  );
  const menuItemIdMap = new Map(
    dbMenuItems.map((m) => [m.id, m])
  );

  let subtotal = 0;
  const itemsBreakdown: PricingItemBreakdown[] = [];

  for (const item of items) {
    const dbItem = (item.menuItemSlug ? menuItemMap.get(item.menuItemSlug) : null) ||
      (item.menuItemId ? menuItemIdMap.get(item.menuItemId) : null);

    if (!dbItem) {
      throw new Error(`Menu "${item.menuItemName || item.menuItemSlug || item.menuItemId}" tidak ditemukan.`);
    }
    if (!dbItem.isAvailable) {
      throw new Error(`Menu "${dbItem.name}" sedang tidak tersedia.`);
    }

    const qty = Math.max(1, Math.min(99, Math.floor(item.quantity || 1)));
    let unitPrice = Number(dbItem.price) || 0;

    // Calculate variant options price adjustment if any
    let variantPriceModifier = 0;
    if (item.variantName && dbItem.variants && Array.isArray(dbItem.variants)) {
      const selectedNames = item.variantName.split(",").map((s) => s.trim().toLowerCase());
      const allOptions = dbItem.variants.flatMap((v: any) => v.options || []);
      for (const opt of allOptions) {
        if (
          opt &&
          (selectedNames.includes(String(opt.name).trim().toLowerCase()) ||
            selectedNames.includes(String(opt.id).trim().toLowerCase()))
        ) {
          variantPriceModifier += Number(opt.priceModifier) || 0;
        }
      }
    }

    unitPrice += variantPriceModifier;
    const itemTotal = unitPrice * qty;
    subtotal += itemTotal;

    const categorySlug = dbItem.categoryId ? categoryMap.get(dbItem.categoryId) || "lainnya" : "lainnya";

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

  // 5. Delivery fee calculation
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

      // Check deliveryZones if configured
      const zones = selectedBranch.deliveryZones || [];
      if (zones.length > 0) {
        const matchingZone = zones.find((z) => distanceKm! <= z.maxDistanceKm);
        if (matchingZone) {
          deliveryFee = matchingZone.baseFee + Math.round(distanceKm! * matchingZone.perKmFee);
        } else {
          const maxZone = zones[zones.length - 1];
          deliveryFee = maxZone ? maxZone.baseFee + Math.round(distanceKm! * maxZone.perKmFee) : 15000;
        }
      } else {
        // Flat delivery fallback
        deliveryFee = Number(branding.flatDeliveryFee || 10000);
      }
    } else {
      deliveryFee = req.claimedDeliveryFee !== undefined
        ? req.claimedDeliveryFee
        : Number(branding.flatDeliveryFee || 10000);
    }
  }

  // 6. Tax & Service Charge (BPS arithmetic)
  const taxableBase = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxRateBps > 0 ? Math.round((taxableBase * taxRateBps) / 10000) : 0;
  const serviceChargeAmount =
    serviceChargeRateBps > 0 ? Math.round((taxableBase * serviceChargeRateBps) / 10000) : 0;

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
