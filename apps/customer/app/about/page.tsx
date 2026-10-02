export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "Tentang Kami - Kisah Martabak & Terang Bulan A6 Nyuss",
  description:
    "Mengenal lebih dekat Martabak & Terang Bulan A6 Nyuss Surabaya. Resep legendaris martabak telur gurih & terang bulan manis lembut dengan komitmen bahan halal & higienis.",
  alternates: {
    canonical: "https://a6nyusss.com/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
