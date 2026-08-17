import { describe, it, expect } from "vitest";
import { checkRateLimit, rateLimiter } from "../lib/server/rate-limiter";

describe("Unified Sliding Window Rate Limiter", () => {
  it("allows requests under the limit threshold", async () => {
    const testIp = `test-ip-${Date.now()}-1`;
    const res1 = await checkRateLimit(testIp, 3, 60);
    expect(res1.allowed).toBe(true);
    expect(res1.remaining).toBe(2);

    const res2 = await checkRateLimit(testIp, 3, 60);
    expect(res2.allowed).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = await checkRateLimit(testIp, 3, 60);
    expect(res3.allowed).toBe(true);
    expect(res3.remaining).toBe(0);
  });

  it("blocks requests once the limit is exceeded", async () => {
    const testIp = `test-ip-${Date.now()}-2`;
    // Consume 2 allowed requests
    await checkRateLimit(testIp, 2, 60);
    await checkRateLimit(testIp, 2, 60);

    // 3rd request must be blocked
    const blockedRes = await checkRateLimit(testIp, 2, 60);
    expect(blockedRes.allowed).toBe(false);
    expect(blockedRes.remaining).toBe(0);
    expect(blockedRes.resetAt).toBeGreaterThan(Date.now());
  });

  it("uses preset helper accurately", async () => {
    const testIp = `test-ip-${Date.now()}-3`;
    const res = await rateLimiter.check(testIp, "order_creation");
    expect(res.allowed).toBe(true);
    expect(res.remaining).toBe(9); // limit 10
  });
});
