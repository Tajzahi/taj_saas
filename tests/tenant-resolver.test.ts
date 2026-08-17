import { describe, it, expect } from "vitest";
import { normalizeRequestHost } from "../lib/tenant-authorization";

describe("Port-Aware Zero-Trust Request Host Resolver", () => {
  it("resolves localhost standard ports accurately", () => {
    const cust = normalizeRequestHost("localhost:3000");
    expect(cust.appType).toBe("customer");
    expect(cust.port).toBe("3000");
    expect(cust.lookupType).toBe("slug");

    const admin = normalizeRequestHost("localhost:3001");
    expect(admin.appType).toBe("admin");
    expect(admin.port).toBe("3001");

    const owner = normalizeRequestHost("localhost:3002");
    expect(owner.appType).toBe("owner");
    expect(owner.port).toBe("3002");
  });

  it("resolves local multi-tenant subdomains", () => {
    const custSub = normalizeRequestHost("martabak-surabaya.localhost:3000");
    expect(custSub.appType).toBe("customer");
    expect(custSub.lookupType).toBe("slug");
    expect(custSub.lookupValue).toBe("martabak-surabaya");

    const adminSub = normalizeRequestHost("admin.martabak-surabaya.localhost:3000");
    expect(adminSub.appType).toBe("admin");
    expect(adminSub.lookupType).toBe("slug");
    expect(adminSub.lookupValue).toBe("martabak-surabaya");

    const ownerSub = normalizeRequestHost("owner.martabak-surabaya.localhost:3000");
    expect(ownerSub.appType).toBe("owner");
    expect(ownerSub.lookupType).toBe("slug");
    expect(ownerSub.lookupValue).toBe("martabak-surabaya");
  });

  it("resolves production custom domains & subdomains", () => {
    const prodRoot = normalizeRequestHost("martabakpakde.com");
    expect(prodRoot.appType).toBe("customer");
    expect(prodRoot.lookupType).toBe("domain");
    expect(prodRoot.lookupValue).toBe("martabakpakde.com");

    const prodAdmin = normalizeRequestHost("admin.martabakpakde.com");
    expect(prodAdmin.appType).toBe("admin");
    expect(prodAdmin.lookupType).toBe("domain");
    expect(prodAdmin.lookupValue).toBe("martabakpakde.com");

    const prodOwner = normalizeRequestHost("owner.martabakpakde.com");
    expect(prodOwner.appType).toBe("owner");
    expect(prodOwner.lookupType).toBe("domain");
    expect(prodOwner.lookupValue).toBe("martabakpakde.com");
  });

  it("sanitizes host with trailing dot or port", () => {
    const res = normalizeRequestHost("admin.martabakpakde.com.:443");
    expect(res.appType).toBe("admin");
    expect(res.lookupValue).toBe("martabakpakde.com");
  });
});
