"use server";

import { db, schema } from "@taj-saas/db";
import { eq } from "drizzle-orm";
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

  // 4. Fallback based on category or item name keywords
  const isTerangBulan =
    categorySlug?.includes('terang') ||
    name?.toLowerCase().includes('terang bulan') ||
    normalizedSlug.includes('terang-bulan');

  if (isTerangBulan) {
    const lowerName = name.toLowerCase();
    if (
      lowerName.includes('2 variant') ||
      lowerName.includes('2 topping') ||
      lowerName.includes('2 rasa') ||
      normalizedSlug.includes('2-variant') ||
      normalizedSlug.includes('2-topping')
    ) {
      return default2VariantToppings;
    }
    return default1VariantToppings;
  }

  return undefined;
}

async function getTenantBySlug(slug: string) {
  const result = await db.select().from(schema.tenants).where(eq(schema.tenants.slug, slug)).limit(1);
  return result[0] || null;
}

export async function getStoreSettings(): Promise<DbStoreSettings> {
  const headersList = await headers();
  const slug = headersList.get('x-tenant-slug') || 'taj-saas';
  
  const tenant = await getTenantBySlug(slug);
  if (!tenant) {
    // Return a default mock if database fails or tenant is not yet seeded
    return {
      id: "default-id",
      store_name: 'Taj SaaS (Fallback)',
      is_open: true,
      whatsapp_number: '6287811123482',
      flat_delivery_fee: 10000,
      minimum_order_amount: 0,
      store_address: 'Jl. Demak No.253, Dupak, Kec. Krembangan, Surabaya',
      google_maps_url: null,
      opening_hours: 'Setiap Hari: 17:00 – 01:00',
      qris_image_url: '/qris.png',
      bank_info: 'BCA 123-456-7890 a/n Martabak A6 Nyuss',
      hero_banner_url: '',
      outlet_lat: DEFAULT_OUTLET_LAT,
      outlet_lng: DEFAULT_OUTLET_LNG,
    };
  }

  const branding = tenant.branding || {};

  return {
    id: tenant.id,
    store_name: tenant.name,
    // Honour admin "buka/tutup toko" toggle (branding.storeOpen); fall back ke status SaaS.
    is_open: branding.storeOpen === undefined ? (tenant.isActive ?? true) : branding.storeOpen,
    whatsapp_number: branding.whatsappNumber || '6287811123482',
    flat_delivery_fee: Number(branding.flatDeliveryFee || 10000),
    minimum_order_amount: Number(branding.minimumOrderAmount || 0),
    store_address: branding.storeAddress || 'Jl. Demak No.253, Dupak, Kec. Krembangan, Surabaya, Jawa Timur 60179',
    google_maps_url: branding.googleMapsUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.9787806389904!2d112.72062749999999!3d-7.243253699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f96790ef97d9%3A0x4e9b27e564abc301!2sMartabak%20%26%20Terang%20Bulan%20A6%20Nyuss!5e0!3m2!1sid!2sid!4v1780307482136!5m2!1sid!2sid',
    opening_hours: branding.openingHours || 'Setiap Hari: 17:00 – 01:00',
    qris_image_url: branding.qrisImageUrl || '/qris.png',
    bank_info: branding.bankInfo || 'BCA 123-456-7890 a/n Martabak A6 Nyuss',
    hero_banner_url: branding.heroBannerUrl || '',
    outlet_lat: typeof branding.outletLat === 'number' ? branding.outletLat : DEFAULT_OUTLET_LAT,
    outlet_lng: typeof branding.outletLng === 'number' ? branding.outletLng : DEFAULT_OUTLET_LNG,
  };
}

export async function getCategories(): Promise<{ id: MenuCategory; label: string; icon: string }[]> {
  const headersList = await headers();
  const slug = headersList.get('x-tenant-slug') || 'taj-saas';
  
  const tenant = await getTenantBySlug(slug);
  if (!tenant) return staticCategories;

  const dbCategories = await db.select()
    .from(schema.categories)
    .where(eq(schema.categories.tenantId, tenant.id))
    .orderBy(schema.categories.sortOrder);

  if (!dbCategories || dbCategories.length === 0 || (dbCategories.length === 1 && dbCategories[0].slug === 'lainnya')) {
    return staticCategories;
  }

  // Map to the frontend type structure
  const mapped = dbCategories.map(c => ({
    id: c.slug as MenuCategory,
    label: c.name,
    icon: c.slug.includes('terang') ? 'Moon' : c.slug.includes('bebek') ? 'Egg' : 'Layers'
  }));

  // Ensure standard categories exist if DB only has custom ones
  const standardMissing = staticCategories.filter((sc: { id: MenuCategory; label: string; icon: string }) => !mapped.some(m => m.id === sc.id));
  return [...mapped, ...standardMissing];
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const headersList = await headers();
  const slug = headersList.get('x-tenant-slug') || 'taj-saas';
  
  const tenant = await getTenantBySlug(slug);
  if (!tenant) return staticMenuItems;

  const dbItems = await db.select()
    .from(schema.menuItems)
    .where(eq(schema.menuItems.tenantId, tenant.id));

  // If DB items are empty, use static menu items
  if (!dbItems || dbItems.length === 0) {
    return staticMenuItems;
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

  // If DB only has a small subset of test items (e.g. < 5), merge with staticMenuItems that are not yet in DB
  if (mappedDbItems.length < staticMenuItems.length) {
    const existingSlugs = new Set(mappedDbItems.map(i => i.slug));
    const supplementalItems = staticMenuItems.filter(s => !existingSlugs.has(s.slug));
    return [...mappedDbItems, ...supplementalItems];
  }

  return mappedDbItems;
}
