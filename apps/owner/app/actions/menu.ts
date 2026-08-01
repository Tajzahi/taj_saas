"use server";

import { db, schema } from "@taj-saas/db";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getTenantId } from "./_tenantHelper";

export async function getMenuItemsAction() {
  try {
    const tenantId = await getTenantId();
    const items = await db.select().from(schema.menuItems).where(eq(schema.menuItems.tenantId, tenantId));
    return { success: true, data: items };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function getCategoriesAction() {
  try {
    const tenantId = await getTenantId();
    const categories = await db.select().from(schema.categories).where(eq(schema.categories.tenantId, tenantId));
    return { success: true, data: categories };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function createMenuItemAction(data: {
  categoryId?: string;
  name: string;
  price: number;
  description?: string;
}) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error("Tenant not found");
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const [inserted] = await db.insert(schema.menuItems).values({
      tenantId,
      categoryId: data.categoryId || null,
      name: data.name,
      slug,
      price: data.price.toString(),
      description: data.description || "",
      isAvailable: true,
      isBestSeller: false,
      isNew: true,
    }).returning();
    revalidatePath("/menu");
    return { success: true, data: inserted };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function updateMenuItemAction(id: string, data: {
  categoryId?: string;
  name: string;
  price: number;
  description?: string;
  isAvailable?: boolean;
}) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error("Tenant not found");
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const [updated] = await db.update(schema.menuItems).set({
      categoryId: data.categoryId || null,
      name: data.name,
      slug,
      price: data.price.toString(),
      description: data.description || "",
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
    }).where(and(eq(schema.menuItems.id, id), eq(schema.menuItems.tenantId, tenantId))).returning();
    revalidatePath("/menu");
    return { success: true, data: updated };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function deleteMenuItemAction(id: string) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error("Tenant not found");
    await db.delete(schema.menuItems).where(and(eq(schema.menuItems.id, id), eq(schema.menuItems.tenantId, tenantId)));
    revalidatePath("/menu");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}
