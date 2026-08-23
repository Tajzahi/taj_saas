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

export async function createCategoryAction(name: string) {
  try {
    const { tenant, user } = await requireTenantPermission("menu:manage", { expectedApp: "owner" });

    const trimmedName = name.trim();
    if (!trimmedName) {
      return { success: false, error: "Nama kategori tidak boleh kosong." };
    }

    const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    
    const existing = await db
      .select()
      .from(schema.categories)
      .where(and(eq(schema.categories.tenantId, tenant.id), eq(schema.categories.slug, slug)));

    if (existing.length > 0) {
      return { success: true, data: existing[0] };
    }

    const [inserted] = await db
      .insert(schema.categories)
      .values({
        tenantId: tenant.id,
        name: trimmedName,
        slug,
      })
      .returning();

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "create_category",
      entityType: "categories",
      entityId: inserted.id,
      details: { name: trimmedName },
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

export async function deleteCategoryAction(id: string) {
  try {
    const { tenant, user } = await requireTenantPermission("menu:manage", { expectedApp: "owner" });

    await db
      .delete(schema.categories)
      .where(and(eq(schema.categories.id, id), eq(schema.categories.tenantId, tenant.id)));

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "delete_category",
      entityType: "categories",
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

export async function createMenuItemAction(data: {
  categoryId?: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  variants?: any[];
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
        imageUrl: data.imageUrl || null,
        variants: data.variants || null,
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
    if ((error as any)?.code === "23505") {
      return { success: false, error: "Nama menu ini sudah dipakai oleh item lain di gerai ini." };
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
    imageUrl?: string;
    variants?: any[];
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
        imageUrl: data.imageUrl !== undefined ? data.imageUrl : undefined,
        variants: data.variants !== undefined ? data.variants : undefined,
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
    if ((error as any)?.code === "23505") {
      return { success: false, error: "Nama menu ini sudah dipakai oleh item lain di gerai ini." };
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

export async function getInventoryIngredientsAction() {
  try {
    const { tenant } = await requireTenantPermission("menu:read", { expectedApp: "owner" });
    const items = await db
      .select({
        id: schema.inventory.id,
        name: schema.inventory.name,
        unit: schema.inventory.unit,
        cost: schema.inventory.cost,
      })
      .from(schema.inventory)
      .where(eq(schema.inventory.tenantId, tenant.id));
    return { success: true, data: items };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message, data: [] };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}

export async function getRecipeAction(menuItemId: string) {
  try {
    const { tenant } = await requireTenantPermission("menu:read", { expectedApp: "owner" });

    const [recipe] = await db
      .select()
      .from(schema.recipes)
      .where(and(eq(schema.recipes.menuItemId, menuItemId), eq(schema.recipes.tenantId, tenant.id)));

    if (!recipe) {
      return { success: true, data: [] };
    }

    const ingredients = await db
      .select()
      .from(schema.recipeIngredients)
      .where(eq(schema.recipeIngredients.recipeId, recipe.id));

    return {
      success: true,
      data: ingredients.map(i => ({
        id: i.id,
        ingredientName: i.ingredientName,
        quantity: Number(i.quantity) || 0,
        unit: i.unit,
        costPerUnit: Number(i.costPerUnit) || 0,
      })),
    };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message, data: [] };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}

export async function saveRecipeAction(
  menuItemId: string,
  ingredients: { ingredientName: string; quantity: number; unit: string; costPerUnit: number }[]
) {
  try {
    const { tenant, user } = await requireTenantPermission("menu:manage", { expectedApp: "owner" });

    const [menuItem] = await db
      .select()
      .from(schema.menuItems)
      .where(and(eq(schema.menuItems.id, menuItemId), eq(schema.menuItems.tenantId, tenant.id)));

    if (!menuItem) {
      return { success: false, error: "Menu tidak ditemukan." };
    }

    let [recipe] = await db
      .select()
      .from(schema.recipes)
      .where(and(eq(schema.recipes.menuItemId, menuItemId), eq(schema.recipes.tenantId, tenant.id)));

    if (!recipe) {
      [recipe] = await db
        .insert(schema.recipes)
        .values({
          tenantId: tenant.id,
          menuItemId,
          name: menuItem.name,
        })
        .returning();
    }

    await db
      .delete(schema.recipeIngredients)
      .where(eq(schema.recipeIngredients.recipeId, recipe.id));

    let totalHppCost = 0;
    if (ingredients.length > 0) {
      const rowsToInsert = ingredients.map(ing => {
        const qty = Math.max(0, Number(ing.quantity) || 0);
        const cost = Math.max(0, Number(ing.costPerUnit) || 0);
        totalHppCost += qty * cost;
        return {
          recipeId: recipe.id,
          ingredientName: ing.ingredientName.trim(),
          quantity: String(qty),
          unit: ing.unit.trim() || "pcs",
          costPerUnit: String(cost),
        };
      });

      await db.insert(schema.recipeIngredients).values(rowsToInsert);
    }

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "update_menu_recipe",
      entityType: "recipes",
      entityId: recipe.id,
      details: { menuItemName: menuItem.name, ingredientCount: ingredients.length, totalHppCost },
    });

    revalidatePath("/menu");
    return { success: true, totalHppCost };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}
