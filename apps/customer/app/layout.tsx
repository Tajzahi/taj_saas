import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import ChatBot from "@/components/ChatBot";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "A6 Nyuss - Martabak & Terang Bulan",
  description: "Cita rasa otentik martabak dan terang bulan khas Surabaya sejak tahun 2000. Dibuat dengan bahan pilihan dan resep turun-temurun.",
  icons: {
    icon: "/favicon.ico",
  },
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
      <body className="min-h-full flex flex-col bg-[#fffdf9] text-[#1c1917] dark:bg-stone-950 dark:text-stone-100">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: { fontFamily: 'var(--font-poppins), sans-serif', fontSize: '14px' },
          }}
        />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <FloatingButtons />
        <ChatBot />
      </body>
    </html>
  );
}
