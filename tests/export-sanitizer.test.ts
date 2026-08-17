import { describe, it, expect } from "vitest";
import { sanitizeCsvCell, buildCsvString } from "../apps/owner/utils/export";

describe("CSV Formula Injection Sanitizer (SEC-015)", () => {
  it("prefixes dangerous formula characters with single quote and wraps in double quotes", () => {
    expect(sanitizeCsvCell("=1+1")).toBe('"\'=1+1"');
    expect(sanitizeCsvCell("+cmd|'/c calc'!A1")).toBe('"\' +cmd|\'/c calc\'!A1"'.replace(" ", ""));
    expect(sanitizeCsvCell("-2+3")).toBe('"\' -2+3"'.replace(" ", ""));
    expect(sanitizeCsvCell("@SUM(A1:A10)")).toBe('"\' @SUM(A1:A10)"'.replace(" ", ""));
    expect(sanitizeCsvCell("\tTabInjection")).toBe('"\' \tTabInjection"'.replace(" ", ""));
    expect(sanitizeCsvCell("\rReturnInjection")).toBe('"\' \rReturnInjection"'.replace(" ", ""));
  });

  it("leaves harmless strings and numbers safely wrapped", () => {
    expect(sanitizeCsvCell("Martabak Manis")).toBe('"Martabak Manis"');
    expect(sanitizeCsvCell("12345")).toBe('"12345"');
    expect(sanitizeCsvCell(0)).toBe('"0"');
    expect(sanitizeCsvCell(null)).toBe('""');
  });

  it("prepends UTF-8 BOM byte marker to generated CSV content", () => {
    const data = [{ name: "Martabak Coklat", price: 25000 }];
    const csv = buildCsvString(data);

    expect(csv.startsWith("\uFEFF")).toBe(true);
    expect(csv).toContain('"name","price"');
    expect(csv).toContain('"Martabak Coklat","25000"');
  });
});
