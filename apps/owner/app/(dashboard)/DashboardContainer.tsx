"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Handle dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Mobile: auto collapse sidebar on small screens
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Auto-collapse sidebar on mobile after navigating
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <Topbar
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        sidebarCollapsed={sidebarCollapsed}
      />

      <main
        className={`transition-all duration-300 pt-16 min-h-screen ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8 xl:p-10 max-w-[1600px] mx-auto overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
