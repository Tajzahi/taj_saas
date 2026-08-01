import type { Metadata } from "next";
import ToastProvider from "@/components/ToastProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Owner Dashboard - A6 Nyuss",
  description: "Dashboard analitik dan manajemen operasional untuk pemilik gerai F&B A6 Nyuss.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen min-w-[320px]">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
