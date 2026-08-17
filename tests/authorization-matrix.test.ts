import { describe, it, expect } from "vitest";
import { ROLE_PERMISSIONS, Permission } from "../lib/tenant-authorization";

describe("Tenant Authorization & Role Permissions Matrix", () => {
  it("enforces complete owner privileges", () => {
    const ownerPerms = ROLE_PERMISSIONS.owner;
    expect(ownerPerms).toContain<Permission>("hr:manage");
    expect(ownerPerms).toContain<Permission>("finance:read");
    expect(ownerPerms).toContain<Permission>("settings:manage");
    expect(ownerPerms).toContain<Permission>("branches:manage");
    expect(ownerPerms).toContain<Permission>("cancellations:review");
  });

  it("restricts manager from hr and branches management", () => {
    const managerPerms = ROLE_PERMISSIONS.manager;
    expect(managerPerms).toContain<Permission>("inventory:manage");
    expect(managerPerms).toContain<Permission>("approvals:manage");
    expect(managerPerms).toContain<Permission>("cancellations:review");

    expect(managerPerms).not.toContain<Permission>("hr:manage");
    expect(managerPerms).not.toContain<Permission>("branches:manage");
    expect(managerPerms).not.toContain<Permission>("finance:read");
  });

  it("restricts kasir to frontline operations only", () => {
    const kasirPerms = ROLE_PERMISSIONS.kasir;
    expect(kasirPerms).toContain<Permission>("orders:read");
    expect(kasirPerms).toContain<Permission>("orders:create-pos");
    expect(kasirPerms).toContain<Permission>("orders:verify-payment");
    expect(kasirPerms).toContain<Permission>("shifts:manage-own");

    expect(kasirPerms).not.toContain<Permission>("hr:manage");
    expect(kasirPerms).not.toContain<Permission>("finance:read");
    expect(kasirPerms).not.toContain<Permission>("inventory:manage");
    expect(kasirPerms).not.toContain<Permission>("cancellations:review");
    expect(kasirPerms).not.toContain<Permission>("shifts:manage-all");
  });
});
