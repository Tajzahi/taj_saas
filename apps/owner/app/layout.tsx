import type { Metadata } from "next";
import ToastProvider from "@/components/ToastProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Owner Dashboard | Taj SaaS",
  description: "Platform Manajemen Bisnis & Operasional Restoran Multi-Tenant Taj SaaS.",
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
