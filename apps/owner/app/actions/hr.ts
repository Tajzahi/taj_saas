"use server";

import { db, schema } from "@taj-saas/db";
import { eq, and, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireTenantPermission, writeAuditEvent, AuthorizationError } from "@lib/tenant-authorization";

export async function getProfilesAction() {
  try {
    const { tenant } = await requireTenantPermission("hr:manage", { expectedApp: "owner" });

    const profilesWithUsers = await db
      .select({
        id: schema.profiles.id,
        email: schema.profiles.email,
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
}) {
  try {
    const { tenant, user } = await requireTenantPermission("hr:manage", { expectedApp: "owner" });

    const normalizedEmail = data.email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      return { success: false, error: "Format email tidak valid." };
    }

    const allowedRoles = ["owner", "manager", "kasir"];
    const role = allowedRoles.includes(data.role) ? data.role : "kasir";

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, normalizedEmail))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: "Email sudah terdaftar dalam sistem." };
    }

    const userId = "u-" + Math.random().toString(36).substring(2, 15);

    // 1. Insert user
    await db.insert(schema.user).values({
      id: userId,
      name: data.name.trim(),
      email: normalizedEmail,
      emailVerified: true,
    });

    // 2. Insert profile
    const [profile] = await db
      .insert(schema.profiles)
      .values({
        id: userId,
        tenantId: tenant.id,
        email: normalizedEmail,
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
      details: { email: normalizedEmail, role, name: data.name },
    });

    revalidatePath("/sdm");
    return {
      success: true,
      data: { ...profile, name: data.name },
      message: "Karyawan berhasil ditambahkan. Minta karyawan menggunakan fitur 'Lupa Password' untuk membuat password pertama kali.",
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

    const allowedRoles = ["owner", "manager", "kasir"];
    const newRole = allowedRoles.includes(data.role) ? data.role : targetProfile.role;

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

    // 2. Update profile role and salary
    const [profile] = await db
      .update(schema.profiles)
      .set({
        role: newRole,
        salary: String(Math.max(0, Number(data.salary) || 0)),
      })
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

    const { auth } = await import("@/../../lib/auth");

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
