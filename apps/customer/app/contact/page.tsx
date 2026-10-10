export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import ContactClient from "./ContactClient";

import { resolveSeoTenant } from "@/lib/seo/tenant-host";

export async function generateMetadata(): Promise<Metadata> {
  const context = await resolveSeoTenant();
  const isA6 = context?.tenant?.slug === "martabak-terang-bulan-a6-nyusss";
  const storeName = context?.tenant?.name || "Martabak & Terang Bulan A6 Nyuss";

  return {
    title: isA6 ? "Lokasi Cabang & Kontak Resmi (Demak & Tidar Surabaya)" : `Lokasi Cabang & Kontak Resmi | ${storeName}`,
    description: isA6
      ? "Kunjungi atau hubungi Martabak & Terang Bulan A6 Nyuss di Cabang Demak (Krembangan) dan Cabang Tidar (Sawahan), Surabaya. Cek peta lokasi Google Maps dan WhatsApp resmi."
      : `Kunjungi gerai resmi atau hubungi ${storeName}. Temukan alamat cabang terdekat, peta Google Maps, dan kontak WhatsApp resmi.`,
    alternates: {
      canonical: "/contact",
    },
  };
}

export default function ContactPage() {
  return <ContactClient />;
}
