import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import ToastProvider from "@/components/ToastProvider";

import { Suspense } from "react";
import { getStoreSettings } from "@/lib/db/menuService";

export const metadata: Metadata = {
  title: {
    default: "Online Store & Order System",
    template: "%s | Online Store",
  },
  description: "Pesan menu favorit pilihan Anda secara praktis, cepat, dan aman melalui website pemesanan resmi.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Satu kali fetch di server — di-cache 60s, tidak ada waterfall ke client
  let settings: any = null;
  let primaryColor = "#8E0E0E";
  let secondaryColor = "#E05009";

  try {
    settings = await getStoreSettings();
    if (settings?.primary_color) primaryColor = settings.primary_color;
    if (settings?.secondary_color) secondaryColor = settings.secondary_color;
  } catch (err) {
    console.error("Error loading settings in layout:", err);
  }

  // Props minimal yang dibutuhkan komponen layout
  const layoutSettings = {
    store_name: settings?.store_name || "",
    logo_url: settings?.logo_url || null,
    primary_color: primaryColor,
    secondary_color: secondaryColor,
    whatsapp_number: settings?.whatsapp_number || "",
    social_links: settings?.social_links || {},
    store_address: settings?.store_address || "",
    opening_hours: settings?.opening_hours || "",
    tagline: settings?.tagline || "",
  };

  return (
    <html
      lang="id"
      className="h-full antialiased"
    >
      <head>
        <link rel="preload" as="image" href="/assets/banner_red.png" media="(min-width: 768px)" fetchPriority="high" />
        <link rel="preload" as="image" href="/assets/banner_redm.png" media="(max-width: 767px)" fetchPriority="high" />
        <style>{`
          :root {
            --primary-color: ${primaryColor};
            --secondary-color: ${secondaryColor};
          }
        `}</style>
      </head>
      <body className="min-h-full flex flex-col bg-[#fffdf9] text-[#1c1917] dark:bg-stone-950 dark:text-stone-100 min-w-[320px]">
        <ToastProvider />
        <Suspense fallback={null}>
          <Header settings={layoutSettings} />
        </Suspense>
        <main className="flex-1">
          {children}
        </main>
        <Suspense fallback={null}>
          <Footer settings={layoutSettings} />
          <FloatingButtons whatsappNumber={layoutSettings.whatsapp_number} storeName={layoutSettings.store_name} />
        </Suspense>
      </body>
    </html>
  );
}
