"use server";

import { db, schema } from "@taj-saas/db";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireTenantPermission, writeAuditEvent, AuthorizationError } from "@lib/tenant-authorization";

export async function getMenuItemsAction() {
  try {
    const { tenant } = await requireTenantPermission("menu:read", { expectedApp: "owner" });
    const items = await db.select().from(schema.menuItems).where(eq(schema.menuItems.tenantId, tenant.id));
    return { success: true, data: items };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function getCategoriesAction() {
  try {
    const { tenant } = await requireTenantPermission("menu:read", { expectedApp: "owner" });
    const categories = await db.select().from(schema.categories).where(eq(schema.categories.tenantId, tenant.id));
    return { success: true, data: categories };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
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
    const { tenant, user } = await requireTenantPermission("menu:manage", { expectedApp: "owner" });

    const trimmedName = data.name.trim();
    if (!trimmedName) {
      return { success: false, error: "Nama menu tidak boleh kosong." };
    }

    const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const [inserted] = await db
      .insert(schema.menuItems)
      .values({
        tenantId: tenant.id,
        categoryId: data.categoryId || null,
        name: trimmedName,
        slug,
        price: String(Math.max(0, Number(data.price) || 0)),
        description: data.description || "",
        isAvailable: true,
        isBestSeller: false,
        isNew: true,
      })
      .returning();

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "create_menu_item",
      entityType: "menu_items",
      entityId: inserted.id,
      details: { name: trimmedName, price: data.price },
    });

    revalidatePath("/menu");
    return { success: true, data: inserted };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function updateMenuItemAction(
  id: string,
  data: {
    categoryId?: string;
    name: string;
    price: number;
    description?: string;
    isAvailable?: boolean;
  }
) {
  try {
    const { tenant, user } = await requireTenantPermission("menu:manage", { expectedApp: "owner" });

    const trimmedName = data.name.trim();
    const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const [updated] = await db
      .update(schema.menuItems)
      .set({
        categoryId: data.categoryId || null,
        name: trimmedName,
        slug,
        price: String(Math.max(0, Number(data.price) || 0)),
        description: data.description || "",
        isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      })
      .where(and(eq(schema.menuItems.id, id), eq(schema.menuItems.tenantId, tenant.id)))
      .returning();

    if (!updated) {
      return { success: false, error: "Menu tidak ditemukan atau tidak milik outlet ini." };
    }

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "update_menu_item",
      entityType: "menu_items",
      entityId: id,
      details: { name: trimmedName, price: data.price, isAvailable: data.isAvailable },
    });

    revalidatePath("/menu");
    return { success: true, data: updated };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function deleteMenuItemAction(id: string) {
  try {
    const { tenant, user } = await requireTenantPermission("menu:manage", { expectedApp: "owner" });

    await db
      .delete(schema.menuItems)
      .where(and(eq(schema.menuItems.id, id), eq(schema.menuItems.tenantId, tenant.id)));

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "delete_menu_item",
      entityType: "menu_items",
      entityId: id,
    });

    revalidatePath("/menu");
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}
