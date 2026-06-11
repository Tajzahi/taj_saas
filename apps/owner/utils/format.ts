export function formatRupiah(value: number, short = false): string {
  if (short) {
    if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)}M`;
    if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}jt`;
    if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}rb`;
    return `Rp ${value}`;
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatChange(value: number, isPercent = true): string {
  const sign = value >= 0 ? "+" : "";
  if (isPercent) return `${sign}${value.toFixed(1)}%`;
  return `${sign}${value.toFixed(1)}`;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export function getHeatmapColor(value: number, max: number): string {
  const ratio = value / max;
  if (ratio < 0.2) return "bg-red-950/20 text-red-700";
  if (ratio < 0.4) return "bg-red-900/30 text-red-500";
  if (ratio < 0.6) return "bg-red-700/40 text-red-400";
  if (ratio < 0.8) return "bg-red-600/60 text-white";
  return "bg-red-600 text-white";
}
