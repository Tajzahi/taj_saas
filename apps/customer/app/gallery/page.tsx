export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Galeri Foto Martabak Telur & Terang Bulan Lezat",
  description:
    "Kumpulan foto dan video pembuatan Martabak Telur gurih bersarang dan Terang Bulan lembut aneka topping spesial Martabak A6 Nyuss Surabaya.",
  alternates: {
    canonical: "https://a6nyusss.com/gallery",
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
