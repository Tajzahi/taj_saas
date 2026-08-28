"use server";

import { db, schema } from "@taj-saas/db";
import { eq, desc, and } from "drizzle-orm";
import { headers } from "next/headers";
import { MenuItem, MenuCategory, menuItems as staticMenuItems, categories as staticCategories, toppingOptions, extraToppingOptions } from "@/data/menu";

const DEFAULT_OUTLET_LAT = -7.2432537;
const DEFAULT_OUTLET_LNG = 112.7206275;

export interface DbStoreSettings {
  id: string; // uuid
  store_name: string;
  is_open: boolean;
  whatsapp_number: string;
  flat_delivery_fee: number;
  minimum_order_amount: number;
  store_address: string | null;
  google_maps_url: string | null;
  opening_hours: string | null;
  qris_image_url: string;
  bank_info: string;
  hero_banner_url: string;
  outlet_lat?: number;
  outlet_lng?: number;
  gallery?: { id: string; src: string; category: string; caption?: string }[];
  hero_title?: string;
  hero_subtitle?: string;
  hero_badge_text?: string;
  logo_url?: string;
  favicon_url?: string;
  value_props?: { icon: string; title: string; desc: string; isImg?: boolean }[];
  timeline?: { year: string; event: string; desc: string }[];
  values?: { title: string; desc: string; icon?: string }[];
  order_steps?: { step: string; title: string; desc: string; icon?: string }[];
  testimonials?: { id: string; name: string; rating: number; text: string; location?: string }[];
  about_title?: string;
  about_story?: string;
  about_highlights?: string[];
  faqs?: { id: string; question: string; answer: string; category?: string }[];
  catering_packages?: { id: string; name: string; minPortion: number; pricePerPortion: number; description: string }[];
  max_delivery_radius_km?: number;
  delivery_zones?: { name: string; maxKm: number; fee: number }[];
  social_links?: { instagram?: string; facebook?: string; tiktok?: string; youtube?: string };
}

// Fallback topping variant structures for Terang Bulan items
const default2VariantToppings = [
  { label: 'Pilihan Topping 1', required: true, options: toppingOptions },
  { label: 'Pilihan Topping 2', required: true, options: toppingOptions },
  { label: 'Topping Tambahan', required: false, options: extraToppingOptions },
];

const default1VariantToppings = [
  { label: 'Pilih Topping Tambahan', required: true, options: toppingOptions },
  { label: 'Extra Topping', required: false, options: extraToppingOptions },
];

function resolveMenuItemVariants(
  dbTableVariants: any[] | undefined,
  jsonbVariants: any[] | undefined,
  slug: string,
  name: string,
  categorySlug: string
) {
  // 1. Check DB menu_variants table
  if (dbTableVariants && dbTableVariants.length > 0) return dbTableVariants;

  // 2. Check JSONB variants column on menu_items table
  if (jsonbVariants && jsonbVariants.length > 0) return jsonbVariants;

  // 3. Match static menu items by exact or normalized slug
  const normalizedSlug = slug.toLowerCase();
  const staticMatch = staticMenuItems.find(
    s => s.slug === slug || normalizedSlug.includes(s.slug) || s.slug.includes(normalizedSlug)
  );
  if (staticMatch && staticMatch.variants && staticMatch.variants.length > 0) {
    return staticMatch.variants;
  }

  return undefined;
}

async function getTenantBySlug(slug: string) {
  try {
    let result = await db.select().from(schema.tenants).where(eq(schema.tenants.slug, slug)).limit(1);
    if (result.length === 0) {
      result = await db
        .select()
        .from(schema.tenants)
        .where(eq(schema.tenants.isActive, true))
        .orderBy(desc(schema.tenants.createdAt))
        .limit(1);
    }
    return result[0] || null;
  } catch (err) {
    console.error("[menuService] Error fetching tenant by slug:", err);
    return null;
  }
}

async function getTenantSlugFromHeaders(): Promise<string> {
  try {
    const headersList = await headers();
    return headersList.get('x-tenant-slug') || 'taj-saas';
  } catch {
    return 'taj-saas';
  }
}

export async function getStoreSettings(): Promise<DbStoreSettings> {
  const slug = await getTenantSlugFromHeaders();
  
  const tenant = await getTenantBySlug(slug);
  if (!tenant) {
    // Return a neutral default mock if database fails or tenant is not yet seeded
    return {
      id: "default-id",
      store_name: '',
      is_open: true,
      whatsapp_number: '',
      flat_delivery_fee: 10000,
      minimum_order_amount: 0,
      store_address: '',
      google_maps_url: null,
      opening_hours: '',
      qris_image_url: '/qris.png',
      bank_info: '',
      hero_banner_url: '',
      outlet_lat: DEFAULT_OUTLET_LAT,
      outlet_lng: DEFAULT_OUTLET_LNG,
    };
  }

  const branding = (tenant.branding as any) || {};

  return {
    id: tenant.id,
    store_name: tenant.name,
    // Honour admin "buka/tutup toko" toggle (branding.storeOpen); fall back ke status SaaS.
    is_open: branding.storeOpen === undefined ? (tenant.isActive ?? true) : branding.storeOpen,
    whatsapp_number: branding.whatsappNumber || '',
    flat_delivery_fee: Number(branding.flatDeliveryFee || 10000),
    minimum_order_amount: Number(branding.minimumOrderAmount || 0),
    store_address: branding.storeAddress || '',
    google_maps_url: branding.googleMapsUrl || '',
    opening_hours: branding.openingHours || '',
    qris_image_url: branding.qrisImageUrl || '/qris.png',
    bank_info: branding.bankInfo || '',
    hero_banner_url: branding.heroBannerUrl || '',
    logo_url: branding.logoUrl || branding.logo || undefined,
    favicon_url: branding.faviconUrl || branding.logoUrl || undefined,
    outlet_lat: typeof branding.outletLat === 'number' ? branding.outletLat : DEFAULT_OUTLET_LAT,
    outlet_lng: typeof branding.outletLng === 'number' ? branding.outletLng : DEFAULT_OUTLET_LNG,
    gallery: branding.gallery && Array.isArray(branding.gallery) ? branding.gallery : undefined,
    hero_title: branding.heroTitle || undefined,
    hero_subtitle: branding.heroSubtitle || undefined,
    hero_badge_text: branding.heroBadgeText || undefined,
    value_props: branding.valueProps && Array.isArray(branding.valueProps) ? branding.valueProps : undefined,
    timeline: branding.timeline && Array.isArray(branding.timeline) ? branding.timeline : undefined,
    values: branding.values && Array.isArray(branding.values) ? branding.values : undefined,
    order_steps: branding.orderSteps && Array.isArray(branding.orderSteps) ? branding.orderSteps : undefined,
    testimonials: branding.testimonials && Array.isArray(branding.testimonials) ? branding.testimonials : undefined,
    about_title: branding.aboutTitle || undefined,
    about_story: branding.aboutStory || undefined,
    about_highlights: branding.aboutHighlights && Array.isArray(branding.aboutHighlights) ? branding.aboutHighlights : undefined,
    faqs: branding.faqs && Array.isArray(branding.faqs) ? branding.faqs : undefined,
    catering_packages: branding.cateringPackages && Array.isArray(branding.cateringPackages) ? branding.cateringPackages : undefined,
    max_delivery_radius_km: typeof branding.maxDeliveryRadiusKm === 'number' ? branding.maxDeliveryRadiusKm : 10,
    delivery_zones: branding.deliveryZones && Array.isArray(branding.deliveryZones) ? branding.deliveryZones : undefined,
    social_links: {
      instagram: branding.socialInstagram || '',
      facebook: branding.socialFacebook || '',
      tiktok: branding.socialTiktok || '',
      youtube: branding.socialYoutube || '',
    },
  };
}

export async function getStorePromos(): Promise<any[]> {
  try {
    const slug = await getTenantSlugFromHeaders();
    const tenant = await getTenantBySlug(slug);
    if (!tenant) return [];

    const activePromos = await db
      .select()
      .from(schema.promos)
      .where(and(eq(schema.promos.tenantId, tenant.id), eq(schema.promos.isActive, true)))
      .orderBy(desc(schema.promos.createdAt));

    return activePromos;
  } catch (err) {
    console.error("Error fetching store promos:", err);
    return [];
  }
}

export async function getCategories(): Promise<{ id: MenuCategory; label: string; icon: string }[]> {
  try {
    const slug = await getTenantSlugFromHeaders();
    
    const tenant = await getTenantBySlug(slug);
    if (!tenant) return staticCategories;

    const dbCategories = await db.select()
      .from(schema.categories)
      .where(eq(schema.categories.tenantId, tenant.id))
      .orderBy(schema.categories.sortOrder);

    if (!dbCategories || dbCategories.length === 0) {
      return [{ id: 'semua' as any, label: 'Semua Menu', icon: 'Layers' }];
    }

    // Map to the frontend type structure
    const mapped = dbCategories.map(c => ({
      id: c.slug as MenuCategory,
      label: c.name,
      icon: c.slug.includes('kopi') || c.slug.includes('coffee') || c.slug.includes('espresso') ? 'Layers' : c.slug.includes('terang') ? 'Moon' : c.slug.includes('bebek') ? 'Egg' : 'Layers'
    }));

    return mapped;
  } catch (err) {
    console.error("[menuService] Error fetching categories:", err);
    return staticCategories;
  }
}

export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const slug = await getTenantSlugFromHeaders();
    
    const tenant = await getTenantBySlug(slug);
    if (!tenant) return [];

    const dbItems = await db.select()
      .from(schema.menuItems)
      .where(eq(schema.menuItems.tenantId, tenant.id));

    if (!dbItems || dbItems.length === 0) {
      return [];
    }

    // Fetch dbVariants for this tenant if populated
    const dbVariants = await db.select()
      .from(schema.menuVariants)
      .where(eq(schema.menuVariants.tenantId, tenant.id));
    
    const variantsMap = new Map<string, { label: string; required: boolean; options: any[] }[]>();
    for (const v of dbVariants) {
      const existing = variantsMap.get(v.menuItemId) || [];
      existing.push({
        label: v.label,
        required: v.required,
        options: v.options as any[],
      });
      variantsMap.set(v.menuItemId, existing);
    }

    // Get categories to map category ID to slug
    const dbCategories = await db.select()
      .from(schema.categories)
      .where(eq(schema.categories.tenantId, tenant.id));

    const categoryMap = new Map(dbCategories.map(c => [c.id, c.slug]));
    const categoryLabelMap = new Map(dbCategories.map(c => [c.id, c.name]));
    const staticMap = new Map(staticMenuItems.map(s => [s.slug, s]));

    const mappedDbItems: MenuItem[] = dbItems.map(item => {
      let categorySlug = item.categoryId ? categoryMap.get(item.categoryId) : undefined;
      let categoryLabel = item.categoryId ? categoryLabelMap.get(item.categoryId) : undefined;
      const staticItem = staticMap.get(item.slug);

      // Smart inference if category in DB is missing or 'lainnya'
      if (!categorySlug || categorySlug === 'lainnya') {
        if (staticItem) {
          categorySlug = staticItem.category;
          categoryLabel = staticItem.categoryLabel;
        } else {
          const lowerName = item.name.toLowerCase();
          const lowerSlug = item.slug.toLowerCase();
          if (lowerSlug.includes('bebek') || lowerName.includes('bebek')) {
            categorySlug = 'martabak-telur-bebek';
            categoryLabel = 'Martabak Telur Bebek';
          } else if (lowerSlug.includes('ayam') || lowerName.includes('ayam')) {
            categorySlug = 'martabak-telur-ayam';
            categoryLabel = 'Martabak Telur Ayam';
          } else if (lowerSlug.includes('terang') || lowerName.includes('terang bulan')) {
            categorySlug = 'terang-bulan';
            categoryLabel = 'Terang Bulan';
          } else {
            categorySlug = 'lainnya';
            categoryLabel = 'Lainnya';
          }
        }
      }

      const dbItemTableVariants = variantsMap.get(item.id);

      const variants = resolveMenuItemVariants(
        dbItemTableVariants,
        item.variants as any[],
        item.slug,
        item.name,
        categorySlug
      );

      const badge: MenuItem['badge'] = item.isBestSeller ? 'terlaris' : item.isNew ? 'baru' : undefined;

      return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description || staticItem?.description || '',
        price: Number(item.price),
        image: item.imageUrl || staticItem?.image || `/assets/menu/placeholder.jpg`,
        category: categorySlug as MenuCategory,
        categoryLabel: categoryLabel || 'Menu Spesial',
        isAvailable: item.isAvailable,
        badge,
        variants,
        relatedSlugs: staticItem?.relatedSlugs,
      };
    });

    return mappedDbItems;
  } catch (err) {
    console.error("[menuService] Error fetching menu items:", err);
    return [];
  }
}
