import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
// import ChatBot from "@/components/ChatBot";
import ToastProvider from "@/components/ToastProvider";
import { getStoreSettings } from "@/lib/db/menuService";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getStoreSettings();
    const storeName = settings?.store_name || "Online Store & Order System";
    return {
      title: {
        default: storeName,
        template: `%s | ${storeName}`,
      },
      description: `Pesan menu favorit pilihan Anda secara praktis, cepat, dan aman di ${storeName}.`,
      icons: settings?.favicon_url ? {
        icon: settings.favicon_url,
        shortcut: settings.favicon_url,
        apple: settings.favicon_url,
      } : undefined,
    };
  } catch {
    return {
      title: "Online Store & Order System",
      description: "Pesan menu favorit pilihan Anda secara praktis, cepat, dan aman melalui website pemesanan resmi.",
    };
  }
}

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
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <FloatingButtons />
        {/* Fitur AI Chatbot sementara dinonaktifkan: aktifkan kembali dengan menghapus komentar di bawah ini */}
        {/* <ChatBot /> */}
      </body>
    </html>
  );
}
