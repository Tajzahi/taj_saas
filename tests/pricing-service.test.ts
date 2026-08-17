import { describe, it, expect } from "vitest";
import { computeBpsAmount, calculateHaversineDistanceKm } from "../lib/server/pricing-service";

describe("Canonical Pricing Service Arithmetic & Helpers", () => {
  it("calculates BPS tax and service charges accurately without float drift", () => {
    // 10% tax = 1000 bps
    expect(computeBpsAmount(100000, 1000)).toBe(10000);
    // 5% service charge = 500 bps
    expect(computeBpsAmount(100000, 500)).toBe(5000);
    // 11% PPN = 1100 bps on Rp 27.500
    expect(computeBpsAmount(27500, 1100)).toBe(3025);
    // 0 rate
    expect(computeBpsAmount(50000, 0)).toBe(0);
  });

  it("calculates Haversine distance between geographical coordinates in km", () => {
    // Distance between Monas Jakarta (-6.1754, 106.8272) and Bundaran HI (-6.1950, 106.8230) ~ 2.2 km
    const dist = calculateHaversineDistanceKm(-6.1754, 106.8272, -6.195, 106.823);
    expect(dist).toBeGreaterThan(2.0);
    expect(dist).toBeLessThan(2.5);

    // Identical coordinates should be 0 km
    const samePoint = calculateHaversineDistanceKm(-7.2575, 112.7521, -7.2575, 112.7521);
    expect(samePoint).toBe(0);
  });
});
