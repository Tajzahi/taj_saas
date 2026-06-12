"use server";

import { db, schema } from "@taj-saas/db";
import { revalidatePath } from "next/cache";

export async function createBranchAction(formData: {
  tenantId: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  picName: string;
}) {
  if (!formData.tenantId || !formData.name || !formData.city) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    await db.insert(schema.branches).values({
      tenantId: formData.tenantId,
      name: formData.name,
      city: formData.city,
      address: formData.address,
      phone: formData.phone,
      picName: formData.picName,
      status: "active",
    });

    revalidatePath("/cabang");
    return { success: true };
  } catch (err: any) {
    console.error("Error creating branch:", err);
    return { success: false, error: err.message };
  }
}
