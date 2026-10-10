export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import FaqClient from "./FaqClient";

import { resolveSeoTenant } from "@/lib/seo/tenant-host";

export async function generateMetadata(): Promise<Metadata> {
  const context = await resolveSeoTenant();
  const isA6 = context?.tenant?.slug === "martabak-terang-bulan-a6-nyusss";
  const storeName = context?.tenant?.name || "Martabak & Terang Bulan A6 Nyuss";

  return {
    title: isA6 ? "Pertanyaan Umum (FAQ) - Cara Pesan & Info Menu" : `Pertanyaan Umum (FAQ) | ${storeName}`,
    description: isA6
      ? "Pertanyaan yang sering diajukan seputar pemesanan online martabak & terang bulan, jam buka, area pengiriman Surabaya, dan sertifikasi halal Martabak A6 Nyuss."
      : `Pertanyaan yang sering diajukan seputar pemesanan online, menu, metode pembayaran, jam buka, dan area pengiriman dari ${storeName}.`,
    alternates: {
      canonical: "/faq",
    },
  };
}

export default function FaqPage() {
  return <FaqClient />;
}
