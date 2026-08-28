import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
// import ChatBot from "@/components/ChatBot";
import ToastProvider from "@/components/ToastProvider";

import { Suspense } from "react";

export const metadata: Metadata = {
  title: {
    default: "Online Store & Order System",
    template: "%s | Online Store",
  },
  description: "Pesan menu favorit pilihan Anda secara praktis, cepat, dan aman melalui website pemesanan resmi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-[#fffdf9] text-[#1c1917] dark:bg-stone-950 dark:text-stone-100 min-w-[320px]">
        <ToastProvider />
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <main className="flex-1">
          {children}
        </main>
        <Suspense fallback={null}>
          <Footer />
          <FloatingButtons />
        </Suspense>
      </body>
    </html>
  );
}
