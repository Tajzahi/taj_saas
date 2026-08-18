import { describe, it, expect } from "vitest";
import crypto from "crypto";

function timingSafeEqualHex(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

describe("Idempotency Fingerprint & Timing-Safe Token Validation (R2-004, R2-006)", () => {
  it("should generate deterministic SHA-256 fingerprint for canonical payloads", () => {
    const payloadA = JSON.stringify({
      tenantId: "tenant-1",
      branchId: "branch-1",
      phone: "081234567890",
      total: 50000,
      items: [{ id: "item-1", qty: 2 }],
      idemKey: "IDEM-12345",
    });

    const payloadB = JSON.stringify({
      tenantId: "tenant-1",
      branchId: "branch-1",
      phone: "081234567890",
      total: 50000,
      items: [{ id: "item-1", qty: 2 }],
      idemKey: "IDEM-12345",
    });

    const hashA = crypto.createHash("sha256").update(payloadA).digest("hex");
    const hashB = crypto.createHash("sha256").update(payloadB).digest("hex");

    expect(hashA).toBe(hashB);
    expect(timingSafeEqualHex(hashA, hashB)).toBe(true);
  });

  it("should detect fingerprint mismatch when payload content differs", () => {
    const payloadA = JSON.stringify({ total: 50000, idemKey: "IDEM-1" });
    const payloadB = JSON.stringify({ total: 75000, idemKey: "IDEM-1" });

    const hashA = crypto.createHash("sha256").update(payloadA).digest("hex");
    const hashB = crypto.createHash("sha256").update(payloadB).digest("hex");

    expect(hashA).not.toBe(hashB);
    expect(timingSafeEqualHex(hashA, hashB)).toBe(false);
  });

  it("should safely reject invalid length or null hex tokens without throwing", () => {
    const validHash = crypto.createHash("sha256").update("token-secret").digest("hex");
    const shortHash = "abcd";
    const emptyString = "";

    expect(timingSafeEqualHex(validHash, shortHash)).toBe(false);
    expect(timingSafeEqualHex(validHash, emptyString)).toBe(false);
    expect(timingSafeEqualHex("", "")).toBe(false);
  });
});
