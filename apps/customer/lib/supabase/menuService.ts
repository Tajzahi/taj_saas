"use server";

import { db, schema } from "@taj-saas/db";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { MenuItem, MenuCategory } from "@/data/menu";

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
}

async function getTenantBySlug(slug: string) {
  const result = await db.select().from(schema.tenants).where(eq(schema.tenants.slug, slug)).limit(1);
  return result[0] || null;
}

export async function getStoreSettings(): Promise<DbStoreSettings> {
  const headersList = await headers();
  const slug = headersList.get('x-tenant-slug') || 'a6-nyuss';
  
  const tenant = await getTenantBySlug(slug);
  if (!tenant) {
    // Return a default mock if database fails or tenant is not yet seeded
    return {
      id: "default-id",
      store_name: 'Martabak Terbul A6 Nyuss (Fallback)',
      is_open: true,
      whatsapp_number: '6287811123482',
      flat_delivery_fee: 10000,
      minimum_order_amount: 0,
      store_address: 'Jl. Demak No.253, Dupak, Kec. Krembangan, Surabaya',
      google_maps_url: null,
      opening_hours: 'Setiap Hari: 17:00 – 01:00'
    };
  }

  const branding = (tenant.branding || {}) as any;

  return {
    id: tenant.id,
    store_name: tenant.name,
    is_open: tenant.isActive ?? true,
    whatsapp_number: branding.whatsappNumber || '6287811123482',
    flat_delivery_fee: Number(branding.flatDeliveryFee || 10000),
    minimum_order_amount: Number(branding.minimumOrderAmount || 0),
    store_address: branding.storeAddress || 'Jl. Demak No.253, Dupak, Kec. Krembangan, Surabaya, Jawa Timur 60179',
    google_maps_url: branding.googleMapsUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.9787806389904!2d112.72062749999999!3d-7.243253699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f96790ef97d9%3A0x4e9b27e564abc301!2sMartabak%20%26%20Terang%20Bulan%20A6%20Nyuss!5e0!3m2!1sid!2sid!4v1780307482136!5m2!1sid!2sid',
    opening_hours: branding.openingHours || 'Setiap Hari: 17:00 – 01:00'
  };
}

export async function getCategories(): Promise<{ id: MenuCategory; label: string; icon: string }[]> {
  const headersList = await headers();
  const slug = headersList.get('x-tenant-slug') || 'a6-nyuss';
  
  const tenant = await getTenantBySlug(slug);
  if (!tenant) return [];

  const dbCategories = await db.select()
    .from(schema.categories)
    .where(eq(schema.categories.tenantId, tenant.id))
    .orderBy(schema.categories.sortOrder);

  // Map to the frontend type structure
  return dbCategories.map(c => ({
    id: c.slug as MenuCategory,
    label: c.name,
    icon: c.slug.includes('terang') ? 'Utensils' : 'Coffee' // fallback simple icon
  }));
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const headersList = await headers();
  const slug = headersList.get('x-tenant-slug') || 'a6-nyuss';
  
  const tenant = await getTenantBySlug(slug);
  if (!tenant) return [];

  const dbItems = await db.select()
    .from(schema.menuItems)
    .where(eq(schema.menuItems.tenantId, tenant.id));

  // Get categories to map category ID to slug
  const dbCategories = await db.select()
    .from(schema.categories)
    .where(eq(schema.categories.tenantId, tenant.id));

  const categoryMap = new Map(dbCategories.map(c => [c.id, c.slug]));

  return dbItems.map(item => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description || '',
    price: Number(item.price),
    image: item.imageUrl || `/assets/menu/placeholder.jpg`, // fallback
    category: (item.categoryId ? categoryMap.get(item.categoryId) : 'minuman') as MenuCategory,
    isAvailable: item.isAvailable,
    badge: item.isBestSeller ? 'terlaris' : item.isNew ? 'baru' : undefined
  }));
}
