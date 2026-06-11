"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import type { PageId } from "@/types/nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Map pathname to PageId
  let activePage: PageId = "cockpit";
  if (pathname === "/cabang") activePage = "cabang";
  else if (pathname === "/menu") activePage = "menu";
  else if (pathname === "/persediaan") activePage = "persediaan";
  else if (pathname === "/keuangan") activePage = "keuangan";
  else if (pathname === "/produksi") activePage = "produksi";
  else if (pathname === "/penjualan") activePage = "penjualan";
  else if (pathname === "/sdm") activePage = "sdm";
  else if (pathname === "/persetujuan") activePage = "persetujuan";
  else if (pathname === "/ai") activePage = "ai";
  else if (pathname === "/pengaturan") activePage = "pengaturan";

  // Mobile: auto collapse sidebar on small screens
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  function handleNavigate(page: PageId) {
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
    if (page === "cockpit") {
      router.push("/");
    } else {
      router.push(`/${page}`);
    }
  }

  const sidebarWidth = sidebarCollapsed ? 72 : 260;

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Topbar */}
      <Topbar
        activePage={activePage}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Main Content */}
      <main
        className="transition-all duration-300 pt-16 min-h-screen"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <div className="p-4 md:p-6 max-w-[1600px]">{children}</div>
      </main>
    </div>
  );
}
