import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin Portal | taj_saas",
  description: "Operational Kasir & Dapur Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased bg-stone-900 text-stone-100 min-h-screen min-w-[320px]">
        {children}
      </body>
    </html>
  );
}
