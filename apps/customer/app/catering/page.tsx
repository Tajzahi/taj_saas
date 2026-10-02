export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import CateringClient from "./CateringClient";

export const metadata: Metadata = {
  title: "Paket Catering Martabak & Terang Bulan Acara Surabaya",
  description:
    "Layanan catering martabak telur dan terang bulan untuk pesta, arisan, syukuran, dan event kantor di Surabaya. Porsi melimpah rasa juara!",
  alternates: {
    canonical: "https://a6nyusss.com/catering",
  },
};

export default function CateringPage() {
  return <CateringClient />;
}
