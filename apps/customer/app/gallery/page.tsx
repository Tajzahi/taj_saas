export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";

import { resolveSeoTenant } from "@/lib/seo/tenant-host";

export async function generateMetadata(): Promise<Metadata> {
  const context = await resolveSeoTenant();
  const isA6 = context?.tenant?.slug === "martabak-terang-bulan-a6-nyusss";
  const storeName = context?.tenant?.name || "Martabak & Terang Bulan A6 Nyuss";

  return {
    title: isA6 ? "Galeri Foto Martabak Telur & Terang Bulan Lezat" : `Galeri Foto Hidangan Lezat | ${storeName}`,
    description: isA6
      ? "Kumpulan foto dan video pembuatan Martabak Telur gurih bersarang dan Terang Bulan lembut aneka topping spesial Martabak A6 Nyuss Surabaya."
      : `Kumpulan galeri foto sajian lezat, aneka menu favorit, dan suasana gerai dari ${storeName}.`,
    alternates: {
      canonical: "/gallery",
    },
  };
}

export default function GalleryPage() {
  return <GalleryClient />;
}
