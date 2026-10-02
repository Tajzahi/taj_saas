export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Lokasi Cabang & Kontak Resmi (Demak & Tidar Surabaya)",
  description:
    "Kunjungi atau hubungi Martabak & Terang Bulan A6 Nyuss di Cabang Demak (Krembangan) dan Cabang Tidar (Sawahan), Surabaya. Cek peta lokasi Google Maps dan WhatsApp resmi.",
  alternates: {
    canonical: "https://a6nyusss.com/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
