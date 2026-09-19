"use server";

import { uploadToR2 } from "@lib/storage/r2";
import { requireTenantPermission, AuthorizationError } from "@lib/tenant-authorization";

export async function uploadImageAction(
  formData: FormData,
  folder: string = "menu"
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const { tenant } = await requireTenantPermission("menu:manage", { expectedApp: "owner" });
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "Tidak ada file yang dipilih" };
    }

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "Ukuran file maksimal 5 MB." };
    }

    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File yang dipilih harus berupa gambar." };
    }

    const targetFolder = (formData.get("folder") as string) || folder || "menu";
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
    const key = `${targetFolder}/${tenant.slug}_${Date.now()}_${cleanName}`;

    const url = await uploadToR2(key, buffer, file.type || "image/png");
    return { success: true, url };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Gagal mengunggah gambar";
    return { success: false, error: message };
  }
}
