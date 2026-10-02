import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import ToastProvider from "@/components/ToastProvider";

import { Suspense } from "react";
import Script from "next/script";
import { getStoreSettings } from "@/lib/db/menuService";

export const metadata: Metadata = {
  metadataBase: new URL("https://a6nyusss.com"),
  title: {
    default: "Martabak & Terang Bulan A6 Nyuss Surabaya | Cabang Demak & Tidar",
    template: "%s | Martabak & Terang Bulan A6 Nyuss Surabaya",
  },
  description:
    "Pusat martabak telur daging sapi gurih dan terang bulan manis legendaris di Surabaya. Nikmati kelezatan Martabak & Terang Bulan A6 Nyuss (a6nyuss, a6 nyus, a6nyusss, a6) Cabang Demak & Tidar. Pesan online resmi cepat & praktis!",
  keywords: [
    // Branded & Typos
    "martabak a6nyusss",
    "martabak a6nyuss",
    "martabak a6nyus",
    "a6nyusss",
    "a6nyuss",
    "a6nyus",
    "a6 nyusss",
    "a6 nyuss",
    "a6 nyus",
    "martabak a6",
    "a6",
    "terang bulan a6 nyusss",
    "terang bulan a6 nyuss",
    "terang bulan a6 nyus",
    "terang bulan a6",
    "martabak dan terang bulan a6 nyuss",
    // Cabang Tidar
    "martabak tidar surabaya",
    "martabak tidar",
    "terang bulan tidar surabaya",
    "martabak sawahan surabaya",
    "kuliner tidar surabaya",
    "kuliner sawahan surabaya",
    // Cabang Demak
    "martabak demak surabaya",
    "martabak jalan demak",
    "terang bulan demak surabaya",
    "martabak krembangan surabaya",
    "kuliner krembangan surabaya",
    // Surabaya General & High-Intent
    "martabak surabaya",
    "martabak enak di surabaya",
    "martabak terdekat di surabaya",
    "terang bulan surabaya",
    "terang bulan enak surabaya",
    "martabak manis surabaya",
    "martabak telur surabaya",
    "martabak daging sapi surabaya",
    "kuliner malam surabaya",
    "pesan martabak online surabaya",
    "delivery martabak surabaya",
  ],
  authors: [{ name: "Martabak dan Terang Bulan A6 Nyuss", url: "https://a6nyusss.com" }],
  creator: "Martabak dan Terang Bulan A6 Nyuss",
  publisher: "Martabak dan Terang Bulan A6 Nyuss",
  formatDetection: {
    telephone: true,
    address: true,
  },
  alternates: {
    canonical: "https://a6nyusss.com",
  },
  openGraph: {
    title: "Martabak & Terang Bulan A6 Nyuss Surabaya | Cabang Demak & Tidar",
    description:
      "Pusat martabak telur daging sapi & terang bulan manis istimewa di Surabaya. Pesan online langsung dari gerai resmi Cabang Demak & Tidar.",
    url: "https://a6nyusss.com",
    siteName: "Martabak & Terang Bulan A6 Nyuss",
    images: [
      {
        url: "/assets/banner_red.png",
        width: 1200,
        height: 630,
        alt: "Martabak dan Terang Bulan A6 Nyuss Surabaya",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Martabak & Terang Bulan A6 Nyuss Surabaya",
    description:
      "Pesan Martabak Telur & Terang Bulan A6 Nyuss Cabang Demak & Tidar Surabaya secara online.",
    images: ["/assets/banner_red.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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

  const gaId = settings?.google_analytics_id || process.env.NEXT_PUBLIC_GA_ID || "G-50XR0NBF8S";

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
        {/* Google Analytics (gtag.js) in <head> for Google Search Console verification */}
        {gaId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              id="google-analytics"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-[#fffdf9] text-[#1c1917] dark:bg-stone-950 dark:text-stone-100 min-w-[320px]">
        {/* Schema.org Structured Data (Multi-Location Restaurant & Organization) */}
        <Script
          id="schema-org-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://a6nyusss.com/#organization",
                  "name": "Martabak dan Terang Bulan A6 Nyuss",
                  "alternateName": [
                    "A6 Nyuss",
                    "a6nyusss",
                    "a6nyuss",
                    "a6nyus",
                    "a6 nyusss",
                    "a6 nyuss",
                    "a6 nyus",
                    "Martabak A6",
                    "a6",
                  ],
                  "url": "https://a6nyusss.com",
                  "logo": "https://a6nyusss.com/logo.png",
                  "email": "martabaka6nyusss@gmail.com",
                  "sameAs": [
                    "https://maps.app.goo.gl/x96PqX7NpC8SWVzR7",
                    "https://maps.app.goo.gl/2tti83qFw8aDaWibA",
                    "https://instagram.com/a6nyuss",
                    "https://tiktok.com/@a6nyuss",
                    "https://www.facebook.com/profile.php?id=61590278828752",
                  ],
                },
                {
                  "@type": "FastFoodRestaurant",
                  "@id": "https://a6nyusss.com/#cabang-demak",
                  "name": "Martabak & Terang Bulan A6 Nyuss - Cabang Demak",
                  "parentOrganization": { "@id": "https://a6nyusss.com/#organization" },
                  "image": "https://a6nyusss.com/assets/banner_red.png",
                  "telephone": "+6287811123482",
                  "priceRange": "Rp 20.000 - Rp 50.000",
                  "servesCuisine": ["Martabak", "Terang Bulan", "Indonesian Street Food"],
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Jl. Demak No.253, Dupak (Depan Mess DITPOLARIUD)",
                    "addressLocality": "Kec. Krembangan, Kota Surabaya",
                    "addressRegion": "Jawa Timur",
                    "postalCode": "60179",
                    "addressCountry": "ID",
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": -7.2432537,
                    "longitude": 112.7206275,
                  },
                  "hasMap": "https://maps.app.goo.gl/x96PqX7NpC8SWVzR7",
                  "openingHoursSpecification": [
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ],
                      "opens": "16:00",
                      "closes": "23:00",
                    },
                  ],
                  "hasMenu": "https://a6nyusss.com/menu",
                },
                {
                  "@type": "FastFoodRestaurant",
                  "@id": "https://a6nyusss.com/#cabang-tidar",
                  "name": "Martabak & Terang Bulan A6 Nyuss - Cabang Tidar",
                  "parentOrganization": { "@id": "https://a6nyusss.com/#organization" },
                  "image": "https://a6nyusss.com/assets/banner_red.png",
                  "telephone": "+6282230306801",
                  "priceRange": "Rp 20.000 - Rp 50.000",
                  "servesCuisine": ["Martabak", "Terang Bulan", "Indonesian Street Food"],
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Jl. Tidar No.81, Sawahan",
                    "addressLocality": "Kec. Sawahan, Kota Surabaya",
                    "addressRegion": "Jawa Timur",
                    "postalCode": "60251",
                    "addressCountry": "ID",
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": -7.257158467336688,
                    "longitude": 112.72766308228695,
                  },
                  "hasMap": "https://maps.app.goo.gl/2tti83qFw8aDaWibA",
                  "openingHoursSpecification": [
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ],
                      "opens": "16:00",
                      "closes": "23:00",
                    },
                  ],
                  "hasMenu": "https://a6nyusss.com/menu",
                },
              ],
            }),
          }}
        />
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
