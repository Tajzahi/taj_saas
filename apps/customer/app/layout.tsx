import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import ToastProvider from "@/components/ToastProvider";

import { Suspense } from "react";
import Script from "next/script";
import { getStoreSettings } from "@/lib/db/menuService";

import { resolveSeoTenant } from "@/lib/seo/tenant-host";

export async function generateMetadata(): Promise<Metadata> {
  const context = await resolveSeoTenant();
  let settings: any = null;
  try {
    settings = await getStoreSettings();
  } catch {}

  const baseUrl = context?.baseUrl || "https://a6nyusss.com";
  const isA6 = context?.tenant?.slug === "martabak-terang-bulan-a6-nyusss";
  const storeName = settings?.store_name || context?.tenant?.name || "Martabak & Terang Bulan A6 Nyuss";

  const defaultTitle = isA6
    ? "Martabak & Terang Bulan A6 Nyuss Surabaya | Cabang Demak & Tidar"
    : `${storeName} | Pesan Online Resmi`;

  const description = isA6
    ? "Pusat martabak telur daging sapi gurih dan terang bulan manis legendaris di Surabaya. Nikmati kelezatan Martabak & Terang Bulan A6 Nyuss (a6nyuss, a6 nyus, a6nyusss, a6) Cabang Demak & Tidar. Pesan online resmi cepat & praktis!"
    : (settings?.hero_subtitle || `Pesan aneka menu lezat spesial dari ${storeName}. Nikmati sajian hangat dan berkualitas dengan pemesanan online resmi yang cepat dan praktis.`);

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: defaultTitle,
      template: `%s | ${storeName}`,
    },
    description,
    authors: [{ name: storeName, url: baseUrl }],
    creator: storeName,
    publisher: storeName,
    formatDetection: {
      telephone: true,
      address: true,
    },
    alternates: {
      canonical: baseUrl,
    },
    icons: {
      icon: [
        { url: settings?.logo_url || "/favicon.ico" },
        { url: "/icon.png", sizes: "192x192", type: "image/png" },
      ],
      apple: [
        { url: settings?.logo_url || "/apple-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    openGraph: {
      title: defaultTitle,
      description,
      url: baseUrl,
      siteName: storeName,
      images: [
        {
          url: settings?.hero_banner_url || "/assets/banner_red.png",
          width: 1200,
          height: 630,
          alt: storeName,
        },
      ],
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description,
      images: [settings?.hero_banner_url || "/assets/banner_red.png"],
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
}

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

  const seoContext = await resolveSeoTenant();
  const baseUrl = seoContext?.baseUrl || "https://a6nyusss.com";
  const isA6 = seoContext?.tenant?.slug === "martabak-terang-bulan-a6-nyusss";

  const branchList = (settings?.branches && settings.branches.length > 0)
    ? settings.branches
    : (settings?.store_address ? [{
        name: "Utama",
        address: settings.store_address,
        outletLat: settings.outlet_lat,
        outletLng: settings.outlet_lng,
        googleMapsUrl: settings.google_maps_url,
      }] : []);

  const branchSchemas = branchList.map((branch: any, idx: number) => {
    const branchSlug = (branch.name || `cabang-${idx}`).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
      "@type": "FastFoodRestaurant",
      "@id": `${baseUrl}/#cabang-${branchSlug}`,
      "name": `${layoutSettings.store_name} - Cabang ${branch.name}`,
      "parentOrganization": { "@id": `${baseUrl}/#organization` },
      "image": layoutSettings.logo_url || `${baseUrl}/assets/banner_red.png`,
      "telephone": branch.whatsappNumber || layoutSettings.whatsapp_number,
      "priceRange": "Rp 20.000 - Rp 50.000",
      "servesCuisine": ["Martabak", "Terang Bulan", "Indonesian Street Food"],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": branch.address || layoutSettings.store_address,
        "addressLocality": branch.city || "Kota Surabaya",
        "addressRegion": "Jawa Timur",
        "addressCountry": "ID",
      },
      ...(branch.outletLat && branch.outletLng ? {
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": Number(branch.outletLat),
          "longitude": Number(branch.outletLng),
        }
      } : {}),
      ...(branch.googleMapsUrl ? { "hasMap": branch.googleMapsUrl } : {}),
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "16:00",
          "closes": "23:00",
        },
      ],
      "hasMenu": `${baseUrl}/menu`,
    };
  });

  const schemaGraph = [
    {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": layoutSettings.store_name,
      ...(isA6 ? {
        "alternateName": [
          "A6 Nyuss", "a6nyusss", "a6nyuss", "a6nyus", "a6 nyusss", "a6 nyuss", "a6 nyus", "Martabak A6", "a6"
        ],
        "email": "martabaka6nyusss@gmail.com",
      } : {}),
      "url": baseUrl,
      "logo": layoutSettings.logo_url || `${baseUrl}/logo.png`,
      "sameAs": Object.values(layoutSettings.social_links || {}).filter(Boolean),
    },
    ...branchSchemas
  ];

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
              "@graph": schemaGraph,
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
