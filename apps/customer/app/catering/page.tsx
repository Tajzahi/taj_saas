export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import CateringClient from "./CateringClient";

import { resolveSeoTenant } from "@/lib/seo/tenant-host";

export async function generateMetadata(): Promise<Metadata> {
  const context = await resolveSeoTenant();
  const isA6 = context?.tenant?.slug === "martabak-terang-bulan-a6-nyusss";
  const storeName = context?.tenant?.name || "Martabak & Terang Bulan A6 Nyuss";

  return {
    title: isA6 ? "Paket Catering Martabak & Terang Bulan Acara Surabaya" : `Layanan Paket Catering | ${storeName}`,
    description: isA6
      ? "Layanan catering martabak telur dan terang bulan untuk pesta, arisan, syukuran, dan event kantor di Surabaya. Porsi melimpah rasa juara!"
      : `Layanan pemesanan catering dan porsi besar untuk acara spesial, kantor, syukuran, dan keluarga dari ${storeName}. Rasa terjamin lezat!`,
    alternates: {
      canonical: "/catering",
    },
  };
}

export default function CateringPage() {
  return <CateringClient />;
}
