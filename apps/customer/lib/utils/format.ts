/**
 * Formats a numeric value into Indonesian Rupiah (IDR) currency format.
 * Example: 15000 -> "Rp 15.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("IDR", "Rp")
    .trim();
}

/**
 * Generates a unique, user-friendly order code.
 * Example format: A6-YYMMDD-HHMMSS-XXXX (where XXXX is a random uppercase string)
 */
export function generateOrderCode(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return `A6-${year}${month}${date}-${randomChars}`;
}
