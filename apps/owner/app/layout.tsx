import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taj SaaS — Owner Dashboard",
  description: "Dashboard pemilik restoran — analitik, manajemen cabang, menu, keuangan, dan operasional.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
