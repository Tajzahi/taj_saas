/**
 * =========================================================================================
 * 🏗️ BLUEPRINT KONSTRUKSI FITUR: SERVER ACTIONS SDM & KARYAWAN (HR ACTIONS)
 * =========================================================================================
 * 
 * 📌 FUNGSI UTAMA FILE:
 * Berkas ini mengelola operasi data backend untuk Manajemen SDM & Karyawan (`/sdm`).
 * Membaca profil staf (`getProfilesAction`), mendaftarkan karyawan baru (`createEmployeeAction`),
 * mengedit role/gaji (`updateEmployeeAction`), menghapus karyawan (`deleteEmployeeAction`),
 * serta mengelola tautan undangan mandiri (`createEmployeeInvitationAction`).
 * 
 * 🔄 ALUR KERJA (WORKFLOW KONSTRUKSI):
 * 1. GET PROFILES (Baris 30-55)   : Ambil profil staf + nama user ter-join dari `schema.profiles`.
 * 2. CREATE EMPLOYEE (Baris 60-130): Insert user & profile dengan gaji & role + audit log.
 * 3. UPDATE / DELETE (135-250)     : Update atau hapus staf dengan proteksi *last owner constraint*.
 * 4. INVITATION (290-480)          : Sistem token undangan pendaftaran mandiri karyawan (TTL 48 jam).
 * 
 * 🔗 KETERIKATAN ALUR FILE LAIN:
 * - Halaman Client UI: `apps/owner/app/(dashboard)/sdm/page.tsx`
 * - Skema Database  : `packages/db/schema.ts` (`schema.profiles`, `schema.user`, `schema.employeeInvitations`)
 * =========================================================================================
 */

"use server";

import { db, schema } from "@taj-saas/db";
import { eq, and, or, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireTenantPermission, writeAuditEvent, AuthorizationError } from "@lib/tenant-authorization";
import { auth } from "@lib/auth";
import crypto from "crypto";

export async function getProfilesAction() {
  try {
    const { tenant } = await requireTenantPermission("hr:read", { expectedApp: "owner" });

    const profilesWithUsers = await db
      .select({
        id: schema.profiles.id,
        tenantId: schema.profiles.tenantId,
        branchId: schema.profiles.branchId,
        email: schema.profiles.email,
        phone: schema.profiles.phone,
        bankAccount: schema.profiles.bankAccount,
        shift: schema.profiles.shift,
        role: schema.profiles.role,
        salary: schema.profiles.salary,
        createdAt: schema.profiles.createdAt,
        name: schema.user.name,
      })
      .from(schema.profiles)
      .leftJoin(schema.user, eq(schema.profiles.id, schema.user.id))
      .where(eq(schema.profiles.tenantId, tenant.id));

    return { success: true, data: profilesWithUsers };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function createEmployeeAction(data: {
  name: string;
  email: string;
  role: string;
  salary?: number;
  branchId?: string;
  phone?: string;
  bankAccount?: string;
  shift?: string;
}) {
  try {
    const { tenant, user } = await requireTenantPermission("hr:manage", { expectedApp: "owner" });

    const normalizedEmail = data.email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      return { success: false, error: "Format email tidak valid." };
    }

    const role = data.role?.trim() || "kasir";
    const branchId = data.branchId && data.branchId !== "pusat" ? data.branchId : null;
    const shift = data.shift?.trim() || "Pagi";

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, normalizedEmail))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: "Email sudah terdaftar dalam sistem." };
    }

    // Provision account via Better Auth official API to ensure schema.account credentials exist
    const tempPassword = crypto.randomBytes(12).toString("base64url");
    const signUpResult = await auth.api.signUpEmail({
      body: {
        name: data.name.trim(),
        email: normalizedEmail,
        password: tempPassword,
      },
    });

    if (!signUpResult || !signUpResult.user) {
      return { success: false, error: "Gagal membuat akun autentikasi karyawan." };
    }

    const userId = signUpResult.user.id;

    // Insert profile linked to tenant
    const [profile] = await db
      .insert(schema.profiles)
      .values({
        id: userId,
        tenantId: tenant.id,
        branchId,
        email: normalizedEmail,
        phone: data.phone?.trim() || null,
        bankAccount: data.bankAccount?.trim() || null,
        shift,
        role,
        salary: String(Math.max(0, Number(data.salary) || 0)),
      })
      .returning();

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "create_employee",
      entityType: "profiles",
      entityId: userId,
      details: { email: normalizedEmail, role, name: data.name, branchId, phone: data.phone, bankAccount: data.bankAccount, shift },
    });

    revalidatePath("/sdm");
    return {
      success: true,
      data: { ...profile, name: data.name, tempPassword },
      message: `Karyawan berhasil ditambahkan. Password awal: ${tempPassword}`,
    };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function updateEmployeeAction(data: {
  id: string;
  name: string;
  role: string;
  salary: number;
  branchId?: string;
  phone?: string;
  bankAccount?: string;
  shift?: string;
}) {
  try {
    const { tenant, user } = await requireTenantPermission("hr:manage", { expectedApp: "owner" });

    const targetProfiles = await db
      .select()
      .from(schema.profiles)
      .where(and(eq(schema.profiles.id, data.id), eq(schema.profiles.tenantId, tenant.id)))
      .limit(1);

    const targetProfile = targetProfiles[0];
    if (!targetProfile) {
      return { success: false, error: "Karyawan tidak ditemukan pada outlet/tenant ini." };
    }

    const newRole = data.role?.trim() || targetProfile.role;
    const branchId = data.branchId && data.branchId !== "pusat" ? data.branchId : null;

    // If demoting an owner, ensure at least one other owner remains
    if (targetProfile.role === "owner" && newRole !== "owner") {
      const [ownerCount] = await db
        .select({ count: count() })
        .from(schema.profiles)
        .where(and(eq(schema.profiles.tenantId, tenant.id), eq(schema.profiles.role, "owner")));

      if (Number(ownerCount?.count || 0) <= 1) {
        return { success: false, error: "Tidak dapat mengubah role: Minimal harus ada 1 Owner aktif." };
      }
    }

    // 1. Update user name
    await db.update(schema.user).set({ name: data.name.trim() }).where(eq(schema.user.id, data.id));

    // 2. Update profile role, salary, branchId, phone, bankAccount, and shift
    const updatePayload: any = {
      role: newRole,
      branchId,
      phone: data.phone?.trim() || null,
      bankAccount: data.bankAccount?.trim() || null,
      salary: String(Math.max(0, Number(data.salary) || 0)),
    };
    if (data.shift) updatePayload.shift = data.shift.trim();

    const [profile] = await db
      .update(schema.profiles)
      .set(updatePayload)
      .where(and(eq(schema.profiles.id, data.id), eq(schema.profiles.tenantId, tenant.id)))
      .returning();

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "update_employee",
      entityType: "profiles",
      entityId: data.id,
      details: { previousRole: targetProfile.role, newRole, salary: data.salary },
    });

    revalidatePath("/sdm");
    return { success: true, data: { ...profile, name: data.name } };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function updateEmployeeShiftAction(id: string, shift: string) {
  try {
    const { tenant, user } = await requireTenantPermission("hr:manage", { expectedApp: "owner" });

    const [updatedProfile] = await db
      .update(schema.profiles)
      .set({ shift: shift.trim() })
      .where(and(eq(schema.profiles.id, id), eq(schema.profiles.tenantId, tenant.id)))
      .returning();

    if (!updatedProfile) {
      return { success: false, error: "Karyawan tidak ditemukan." };
    }

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "update_employee_shift",
      entityType: "profiles",
      entityId: id,
      details: { shift },
    });

    revalidatePath("/sdm");
    return { success: true, data: updatedProfile, message: `Jadwal shift karyawan berhasil diperbarui ke '${shift}'.` };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function deleteEmployeeAction(id: string) {
  try {
    const { tenant, user } = await requireTenantPermission("hr:manage", { expectedApp: "owner" });

    // Prevent self-deletion
    if (user.id === id) {
      return { success: false, error: "Anda tidak dapat menghapus akun Anda sendiri." };
    }

    const targetProfiles = await db
      .select()
      .from(schema.profiles)
      .where(and(eq(schema.profiles.id, id), eq(schema.profiles.tenantId, tenant.id)))
      .limit(1);

    const targetProfile = targetProfiles[0];
    if (!targetProfile) {
      return { success: false, error: "Karyawan tidak ditemukan pada outlet/tenant ini." };
    }

    // If deleting an owner, ensure at least one other owner remains
    if (targetProfile.role === "owner") {
      const [ownerCount] = await db
        .select({ count: count() })
        .from(schema.profiles)
        .where(and(eq(schema.profiles.tenantId, tenant.id), eq(schema.profiles.role, "owner")));

      if (Number(ownerCount?.count || 0) <= 1) {
        return { success: false, error: "Tidak dapat menghapus Owner terakhir dari tenant ini." };
      }
    }

    await db.delete(schema.profiles).where(and(eq(schema.profiles.id, id), eq(schema.profiles.tenantId, tenant.id)));
    await db.delete(schema.account).where(eq(schema.account.userId, id));
    await db.delete(schema.user).where(eq(schema.user.id, id));

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "delete_employee",
      entityType: "profiles",
      entityId: id,
      details: { email: targetProfile.email, role: targetProfile.role },
    });

    revalidatePath("/sdm");
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function updateStaffRoleAction(profileId: string, role: string) {
  try {
    const { tenant, user } = await requireTenantPermission("hr:manage", { expectedApp: "owner" });

    const allowedRoles = ["owner", "manager", "kasir"];
    if (!allowedRoles.includes(role)) {
      return { success: false, error: "Role tidak valid." };
    }

    const targetProfiles = await db
      .select()
      .from(schema.profiles)
      .where(and(eq(schema.profiles.id, profileId), eq(schema.profiles.tenantId, tenant.id)))
      .limit(1);

    const targetProfile = targetProfiles[0];
    if (!targetProfile) {
      return { success: false, error: "Profile tidak ditemukan pada tenant ini." };
    }

    // Check last owner constraint
    if (targetProfile.role === "owner" && role !== "owner") {
      const [ownerCount] = await db
        .select({ count: count() })
        .from(schema.profiles)
        .where(and(eq(schema.profiles.tenantId, tenant.id), eq(schema.profiles.role, "owner")));

      if (Number(ownerCount?.count || 0) <= 1) {
        return { success: false, error: "Tidak dapat mengubah role: Minimal harus ada 1 Owner aktif." };
      }
    }

    const [profile] = await db
      .update(schema.profiles)
      .set({ role })
      .where(and(eq(schema.profiles.id, profileId), eq(schema.profiles.tenantId, tenant.id)))
      .returning();

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "update_staff_role",
      entityType: "profiles",
      entityId: profileId,
      details: { previousRole: targetProfile.role, newRole: role },
    });

    revalidatePath("/sdm");
    return { success: true, data: profile };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

// ─── EMPLOYEE INVITATION WORKFLOW (SEC-003, P2) ──────────────────────────────

export async function createEmployeeInvitationAction(data: {
  email: string;
  name: string;
  role: string;
  branchId?: string;
  salary?: number;
}) {
  try {
    const { tenant, user } = await requireTenantPermission("hr:manage", { expectedApp: "owner" });

    const normalizedEmail = data.email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      return { success: false, error: "Format email tidak valid." };
    }

    const allowedRoles = ["manager", "kasir", "owner"];
    const role = allowedRoles.includes(data.role) ? data.role : "kasir";

    // Generate secure 32-byte token
    const cryptoModule = await import("crypto");
    const rawToken = cryptoModule.randomBytes(32).toString("hex");
    const tokenHash = cryptoModule.createHash("sha256").update(rawToken).digest("hex");

    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours TTL

    const [invitation] = await db
      .insert(schema.employeeInvitations)
      .values({
        tenantId: tenant.id,
        branchId: data.branchId || null,
        email: normalizedEmail,
        name: data.name.trim(),
        role,
        salary: String(Math.max(0, Number(data.salary) || 0)),
        tokenHash,
        expiresAt,
        invitedBy: user.id,
      })
      .returning();

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "create_employee_invitation",
      entityType: "employee_invitations",
      entityId: invitation.id,
      details: { email: normalizedEmail, role, name: data.name },
    });

    revalidatePath("/sdm");
    return {
      success: true,
      invitationId: invitation.id,
      rawToken,
      invitationUrl: `/accept-invite?token=${rawToken}`,
      message: "Undangan karyawan berhasil dibuat (berlaku 48 jam).",
    };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function getEmployeeInvitationsAction() {
  try {
    const { tenant } = await requireTenantPermission("hr:manage", { expectedApp: "owner" });

    const invitations = await db
      .select()
      .from(schema.employeeInvitations)
      .where(eq(schema.employeeInvitations.tenantId, tenant.id));

    return { success: true, data: invitations };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message, data: [] };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}

export async function revokeEmployeeInvitationAction(invitationId: string) {
  try {
    const { tenant, user } = await requireTenantPermission("hr:manage", { expectedApp: "owner" });

    await db
      .delete(schema.employeeInvitations)
      .where(
        and(
          eq(schema.employeeInvitations.id, invitationId),
          eq(schema.employeeInvitations.tenantId, tenant.id)
        )
      );

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "revoke_employee_invitation",
      entityType: "employee_invitations",
      entityId: invitationId,
    });

    revalidatePath("/sdm");
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function acceptEmployeeInvitationAction(token: string, password: string) {
  try {
    if (!token || !password || password.length < 8) {
      return { success: false, error: "Password minimal 8 karakter." };
    }

    const cryptoModule = await import("crypto");
    const tokenHash = cryptoModule.createHash("sha256").update(token.trim()).digest("hex");

    const [invitation] = await db
      .select()
      .from(schema.employeeInvitations)
      .where(eq(schema.employeeInvitations.tokenHash, tokenHash))
      .limit(1);

    if (!invitation) {
      return { success: false, error: "Tautan undangan tidak valid atau sudah kedaluwarsa." };
    }

    if (invitation.usedAt) {
      return { success: false, error: "Undangan ini sudah pernah digunakan sebelumnya." };
    }

    if (new Date(invitation.expiresAt) < new Date()) {
      return { success: false, error: "Tautan undangan sudah kedaluwarsa (masa berlaku 48 jam)." };
    }

    const { auth } = await import("@lib/auth");

    // 1. Sign up user via Better Auth
    const userRes = await auth.api.signUpEmail({
      body: {
        email: invitation.email,
        password,
        name: invitation.name,
      },
    });

    if (!userRes || !userRes.user) {
      return { success: false, error: "Gagal membuat akun autentikasi." };
    }

    const userId = userRes.user.id;

    // 2. Atomic profile creation & mark invitation as used
    await db.transaction(async (tx) => {
      await tx.update(schema.user).set({ role: invitation.role }).where(eq(schema.user.id, userId));

      await tx.insert(schema.profiles).values({
        id: userId,
        tenantId: invitation.tenantId,
        email: invitation.email,
        role: invitation.role,
        salary: invitation.salary || "0",
      });

      await tx
        .update(schema.employeeInvitations)
        .set({ usedAt: new Date() })
        .where(eq(schema.employeeInvitations.id, invitation.id));
    });

    return {
      success: true,
      message: "Akun berhasil dibuat! Silakan login dengan email dan password Anda.",
    };
  } catch (error: unknown) {
    console.error("[acceptEmployeeInvitationAction] Error:", error);
    const message = error instanceof Error ? error.message : "Terjadi kesalahan saat menerima undangan.";
    return { success: false, error: message };
  }
}

// ─── CUSTOM ROLE MANAGEMENT ─────────────────────────────────────────

export async function getCustomRolesAction() {
  try {
    const { tenant } = await requireTenantPermission("hr:read", { expectedApp: "owner" });

    const roles = await db
      .select()
      .from(schema.customRoles)
      .where(eq(schema.customRoles.tenantId, tenant.id));

    return { success: true, data: roles };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message, data: [] };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}

export async function createCustomRoleAction(data: { name: string; description?: string }) {
  try {
    const { tenant, user } = await requireTenantPermission("hr:manage", { expectedApp: "owner" });

    const name = data.name.trim();
    if (!name) {
      return { success: false, error: "Nama role tidak boleh kosong." };
    }

    const code = name.toLowerCase().replace(/[^a-z0-9]/g, "_");

    // Check if role code already exists for tenant
    const existing = await db
      .select()
      .from(schema.customRoles)
      .where(and(eq(schema.customRoles.tenantId, tenant.id), eq(schema.customRoles.code, code)))
      .limit(1);

    if (existing.length > 0) {
      return { success: false, error: `Role '${name}' sudah ada.` };
    }

    const [newRole] = await db
      .insert(schema.customRoles)
      .values({
        tenantId: tenant.id,
        name,
        code,
        description: data.description?.trim() || null,
      })
      .returning();

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "create_custom_role",
      entityType: "custom_roles",
      entityId: newRole.id,
      details: { name, code },
    });

    revalidatePath("/sdm");
    return { success: true, data: newRole };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function deleteCustomRoleAction(roleIdOrCode: string) {
  try {
    const { tenant, user } = await requireTenantPermission("hr:manage", { expectedApp: "owner" });

    // 1. Find target role
    const existing = await db
      .select()
      .from(schema.customRoles)
      .where(
        and(
          eq(schema.customRoles.tenantId, tenant.id),
          or(eq(schema.customRoles.id, roleIdOrCode), eq(schema.customRoles.code, roleIdOrCode))
        )
      )
      .limit(1);

    const targetRole = existing[0];
    if (!targetRole) {
      return { success: false, error: "Custom role tidak ditemukan." };
    }

    // 2. Check if any employee is currently assigned to this role
    const [usage] = await db
      .select({ count: count() })
      .from(schema.profiles)
      .where(
        and(
          eq(schema.profiles.tenantId, tenant.id),
          eq(schema.profiles.role, targetRole.code)
        )
      );

    const usageCount = Number(usage?.count || 0);
    if (usageCount > 0) {
      return {
        success: false,
        error: `Role '${targetRole.name}' sedang digunakan oleh ${usageCount} karyawan. Ubah role karyawan terlebih dahulu sebelum menghapus role ini.`,
      };
    }

    // 3. Delete custom role
    await db
      .delete(schema.customRoles)
      .where(and(eq(schema.customRoles.tenantId, tenant.id), eq(schema.customRoles.id, targetRole.id)));

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "delete_custom_role",
      entityType: "custom_roles",
      entityId: targetRole.id,
      details: { name: targetRole.name, code: targetRole.code },
    });

    revalidatePath("/sdm");
    return { success: true, message: `Role '${targetRole.name}' berhasil dihapus.` };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

// ─── SHIFT TYPES MANAGEMENT ─────────────────────────────────────────

export async function getShiftTypesAction() {
  try {
    const { tenant } = await requireTenantPermission("hr:read", { expectedApp: "owner" });

    const shifts = await db
      .select()
      .from(schema.shiftTypes)
      .where(eq(schema.shiftTypes.tenantId, tenant.id));

    return { success: true, data: shifts };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message, data: [] };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}

export async function createShiftTypeAction(data: {
  name: string;
  startTime: string;
  endTime: string;
  isOff?: boolean;
}) {
  try {
    const { tenant, user } = await requireTenantPermission("hr:manage", { expectedApp: "owner" });

    const name = data.name.trim();
    if (!name) {
      return { success: false, error: "Nama shift tidak boleh kosong." };
    }

    const [newShift] = await db
      .insert(schema.shiftTypes)
      .values({
        tenantId: tenant.id,
        name,
        startTime: data.startTime || "07:00",
        endTime: data.endTime || "15:00",
        isOff: Boolean(data.isOff),
      })
      .returning();

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "create_shift_type",
      entityType: "shift_types",
      entityId: newShift.id,
      details: { name, startTime: data.startTime, endTime: data.endTime },
    });

    revalidatePath("/sdm");
    return { success: true, data: newShift, message: `Shift '${name}' (${data.startTime} - ${data.endTime}) berhasil ditambahkan!` };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function deleteShiftTypeAction(id: string) {
  try {
    const { tenant, user } = await requireTenantPermission("hr:manage", { expectedApp: "owner" });

    await db
      .delete(schema.shiftTypes)
      .where(and(eq(schema.shiftTypes.tenantId, tenant.id), eq(schema.shiftTypes.id, id)));

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "delete_shift_type",
      entityType: "shift_types",
      entityId: id,
    });

    revalidatePath("/sdm");
    return { success: true, message: "Jenis shift berhasil dihapus." };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}
