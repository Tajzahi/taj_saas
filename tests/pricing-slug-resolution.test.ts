import { describe, it, expect } from "vitest";
import {
  computeBpsAmount,
  calculateHaversineDistanceKm,
} from "../lib/server/pricing-service";

describe("Pricing Service Core Math & Distance (R2-001, R2-003)", () => {
  it("should calculate Haversine distance correctly between Jakarta coordinates", () => {
    // Monas: -6.175392, 106.827153
    // Bundaran HI: -6.195000, 106.823000
    const distance = calculateHaversineDistanceKm(-6.175392, 106.827153, -6.195, 106.823);
    expect(distance).toBeGreaterThan(2.0);
    expect(distance).toBeLessThan(3.0);
  });

  it("should calculate exact BPS rates for tax and service charges", () => {
    const subtotal = 100000;
    const taxBps = 1000; // 10%
    const serviceBps = 500; // 5%

    const taxAmount = computeBpsAmount(subtotal, taxBps);
    const serviceAmount = computeBpsAmount(subtotal, serviceBps);

    expect(taxAmount).toBe(10000);
    expect(serviceAmount).toBe(5000);
  });

  it("should separate valid UUIDs from slug strings correctly", () => {
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    const validUuid = "123e4567-e89b-12d3-a456-426614174000";
    const slug = "martabak-manis-keju-spesial";
    const shortCode = "M-01";

    expect(UUID_REGEX.test(validUuid)).toBe(true);
    expect(UUID_REGEX.test(slug)).toBe(false);
    expect(UUID_REGEX.test(shortCode)).toBe(false);
  });

  it("should parse variant option modifiers from string lists", () => {
    const dbVariants = [
      {
        name: "Topping",
        options: [
          { id: "1", name: "Keju", priceModifier: 5000 },
          { id: "2", name: "Coklat", priceModifier: 4000 },
          { id: "3", name: "Kacang", priceModifier: 3000 },
        ],
      },
      {
        name: "Porsi",
        options: [
          { id: "4", name: "Jumbo", priceModifier: 10000 },
        ],
      },
    ];

    const selectedVariantsStr = "Keju, Jumbo";
    const selectedNames = selectedVariantsStr.split(",").map((s) => s.trim().toLowerCase());

    let totalModifier = 0;
    for (const group of dbVariants) {
      if (Array.isArray(group.options)) {
        for (const opt of group.options) {
          if (opt.name && selectedNames.includes(opt.name.toLowerCase())) {
            totalModifier += opt.priceModifier;
          }
        }
      }
    }

    expect(totalModifier).toBe(15000);
  });
});
