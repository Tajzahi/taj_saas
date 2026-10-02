export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import PromoClient from "./PromoClient";

export const metadata: Metadata = {
  title: "Promo & Diskon Spesial Martabak Surabaya",
  description:
    "Cek promo hemat, diskon spesial, dan penawaran menarik Martabak Telur & Terang Bulan A6 Nyuss Surabaya. Pesan sekarang sebelum kehabisan!",
  alternates: {
    canonical: "https://a6nyusss.com/promo",
  },
};

export default function PromoPage() {
  return <PromoClient />;
}
