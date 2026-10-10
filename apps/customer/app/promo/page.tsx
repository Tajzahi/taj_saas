export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import PromoClient from "./PromoClient";

import { resolveSeoTenant } from "@/lib/seo/tenant-host";

export async function generateMetadata(): Promise<Metadata> {
  const context = await resolveSeoTenant();
  const isA6 = context?.tenant?.slug === "martabak-terang-bulan-a6-nyusss";
  const storeName = context?.tenant?.name || "Martabak & Terang Bulan A6 Nyuss";

  return {
    title: isA6 ? "Promo & Diskon Spesial Martabak Surabaya" : `Promo & Diskon Spesial | ${storeName}`,
    description: isA6
      ? "Cek promo hemat, diskon spesial, dan penawaran menarik Martabak Telur & Terang Bulan A6 Nyuss Surabaya. Pesan sekarang sebelum kehabisan!"
      : `Cek promo hemat, diskon menarik, dan penawaran spesial dari ${storeName}. Pesan menu favoritmu sekarang sebelum kehabisan!`,
    alternates: {
      canonical: "/promo",
    },
  };
}

export default function PromoPage() {
  return <PromoClient />;
}
