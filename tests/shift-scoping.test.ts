import { describe, it, expect } from "vitest";

describe("Shift Scoping & Operator Ownership Rules (R2-008)", () => {
  function canCloseShift(
    user: { id: string; role: "owner" | "manager" | "kasir" },
    shift: { operatorId: string | null; tenantId: string; status: string },
    userTenantId: string
  ): boolean {
    if (shift.tenantId !== userTenantId) return false;
    if (shift.status !== "open") return false;

    // Owner and Manager can close any shift in their tenant
    if (user.role === "owner" || user.role === "manager") {
      return true;
    }

    // Kasir can only close their OWN shift
    if (user.role === "kasir") {
      return Boolean(shift.operatorId && shift.operatorId === user.id);
    }

    return false;
  }

  it("should allow kasir to close their own shift", () => {
    const kasirUser = { id: "user-kasir-1", role: "kasir" as const };
    const ownShift = { operatorId: "user-kasir-1", tenantId: "tenant-1", status: "open" };

    expect(canCloseShift(kasirUser, ownShift, "tenant-1")).toBe(true);
  });

  it("should prevent kasir from closing another kasir's shift", () => {
    const kasirUser = { id: "user-kasir-1", role: "kasir" as const };
    const otherShift = { operatorId: "user-kasir-2", tenantId: "tenant-1", status: "open" };

    expect(canCloseShift(kasirUser, otherShift, "tenant-1")).toBe(false);
  });

  it("should prevent kasir from closing a shift without operatorId", () => {
    const kasirUser = { id: "user-kasir-1", role: "kasir" as const };
    const unassignedShift = { operatorId: null, tenantId: "tenant-1", status: "open" };

    expect(canCloseShift(kasirUser, unassignedShift, "tenant-1")).toBe(false);
  });

  it("should allow manager or owner to close any shift within tenant", () => {
    const manager = { id: "user-mgr-1", role: "manager" as const };
    const owner = { id: "user-owner-1", role: "owner" as const };
    const kasirShift = { operatorId: "user-kasir-1", tenantId: "tenant-1", status: "open" };

    expect(canCloseShift(manager, kasirShift, "tenant-1")).toBe(true);
    expect(canCloseShift(owner, kasirShift, "tenant-1")).toBe(true);
  });

  it("should deny shift closing across different tenants", () => {
    const owner = { id: "user-owner-1", role: "owner" as const };
    const foreignShift = { operatorId: "user-kasir-99", tenantId: "tenant-other", status: "open" };

    expect(canCloseShift(owner, foreignShift, "tenant-1")).toBe(false);
  });
});
