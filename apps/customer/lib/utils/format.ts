import crypto from 'crypto';

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
 * Generates a unique, anti-collision order code.
 * Format: A6-YYYYMMDD-XXXXXX
 */
export function generateOrderCode(): string {
  const rand = crypto.randomBytes(4).toString('base64').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `A6-${date}-${rand}`;
}

