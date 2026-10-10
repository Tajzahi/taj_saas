export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import AboutClient from "./AboutClient";

import { resolveSeoTenant } from "@/lib/seo/tenant-host";

export async function generateMetadata(): Promise<Metadata> {
  const context = await resolveSeoTenant();
  const isA6 = context?.tenant?.slug === "martabak-terang-bulan-a6-nyusss";
  const storeName = context?.tenant?.name || "Martabak & Terang Bulan A6 Nyuss";

  return {
    title: isA6 ? "Tentang Kami - Kisah Martabak & Terang Bulan A6 Nyuss" : `Tentang Kami - Kisah & Komitmen ${storeName}`,
    description: isA6
      ? "Mengenal lebih dekat Martabak & Terang Bulan A6 Nyuss Surabaya. Resep legendaris martabak telur gurih & terang bulan manis lembut dengan komitmen bahan halal & higienis."
      : `Mengenal lebih dekat profil ${storeName}. Komitmen hidangan lezat dan pelayanan terbaik dengan bahan pilihan berkualitas.`,
    alternates: {
      canonical: "/about",
    },
  };
}

export default function AboutPage() {
  return <AboutClient />;
}
