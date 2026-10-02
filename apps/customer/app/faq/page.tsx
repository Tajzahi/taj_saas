export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import FaqClient from "./FaqClient";

export const metadata: Metadata = {
  title: "Pertanyaan Umum (FAQ) - Cara Pesan & Info Menu",
  description:
    "Pertanyaan yang sering diajukan seputar pemesanan online martabak & terang bulan, jam buka, area pengiriman Surabaya, dan sertifikasi halal Martabak A6 Nyuss.",
  alternates: {
    canonical: "https://a6nyusss.com/faq",
  },
};

export default function FaqPage() {
  return <FaqClient />;
}
