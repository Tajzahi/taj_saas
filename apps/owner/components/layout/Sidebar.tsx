"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";
import { getTenantSettingsAction } from "@/app/actions/settings";
import { getBranchesAction } from "@/app/actions/branches";

export type PageId =
  | "cockpit"
  | "cabang"
  | "menu"
  | "persediaan"
  | "keuangan"
  | "produksi"
  | "penjualan"
  | "sdm"
  | "persetujuan"
  | "ai"
  | "pengaturan";

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeVariant?: "danger" | "warning" | "info";
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

function IconCockpit() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}
function IconCabang() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}
function IconMenu() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}
function IconInventory() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}
function IconFinance() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}
function IconProduksi() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function IconSales() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
  );
}
function IconSDM() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function IconApproval() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function IconAI() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-1" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  );
}

interface NavSubItem {
  id: PageId;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeVariant?: "danger" | "warning" | "info";
}

interface NavGroup {
  id: string;
  title: string;
  icon: string;
  items: NavSubItem[];
}

const navGroups: NavGroup[] = [
  {
    id: "manajemen",
    title: "Manajemen",
    icon: "🏛️",
    items: [
      { id: "cockpit", label: "Dashboard Utama", icon: <IconCockpit /> },
      { id: "persetujuan", label: "Persetujuan", icon: <IconApproval /> },
      { id: "cabang", label: "Cabang", icon: <IconCabang /> },
      { id: "keuangan", label: "Keuangan", icon: <IconFinance /> },
      { id: "penjualan", label: "Penjualan", icon: <IconSales /> },
    ],
  },
  {
    id: "operasional",
    title: "Operasional Restoran",
    icon: "🍳",
    items: [
      { id: "sdm", label: "SDM & Karyawan", icon: <IconSDM /> },
      { id: "menu", label: "Menu & Resep", icon: <IconMenu /> },
      { id: "persediaan", label: "Persediaan & Stok", icon: <IconInventory /> },
      { id: "produksi", label: "Dapur & Produksi", icon: <IconProduksi /> },
    ],
  },
];

const standaloneItems: NavSubItem[] = [
  { id: "pengaturan", label: "Pengaturan", icon: <IconSettings /> },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [mounted, setMounted] = React.useState(false);
  const [dbBranding, setDbBranding] = React.useState<any>(null);
  const [dbBranchCount, setDbBranchCount] = React.useState<number>(0);
  const [dbPackageType, setDbPackageType] = React.useState<string>("Enterprise");

  // Track collapsed state for dropdown categories
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
    manajemen: true,
    operasional: true,
  });

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  React.useEffect(() => {
    setMounted(true);
    getTenantSettingsAction().then(res => {
      if (res.success && res.data) {
        setDbBranding(res.data.branding);
        if (res.data.packageType) {
          const pkg = res.data.packageType;
          setDbPackageType(pkg.charAt(0).toUpperCase() + pkg.slice(1));
        }
      }
    });
    getBranchesAction().then(res => {
      if (res.success && res.data) {
        setDbBranchCount(res.data.length);
      }
    });
  }, []);

  const brandLogo = dbBranding?.logo || "🏪";
  const brandName = dbBranding?.brandName || dbBranding?.businessName || "Dashboard Owner";
  const branchCountText = dbBranchCount > 0 ? `${dbBranchCount} Cabang` : "0 Cabang";

  const user = mounted ? session?.user : null;
  const userName = user?.name || user?.email || "Owner";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  // Determine active item based on current segment
  let activePage: PageId = "cockpit";
  if (pathname === "/") {
    activePage = "cockpit";
  } else {
    const segment = pathname.split("/")[1];
    if (segment === "ai") {
      activePage = "ai";
    } else {
      activePage = segment as PageId;
    }
  }

  // Auto expand group containing active item
  React.useEffect(() => {
    navGroups.forEach(group => {
      if (group.items.some(item => item.id === activePage)) {
        setOpenGroups(prev => ({ ...prev, [group.id]: true }));
      }
    });
  }, [activePage]);

  const getPath = (id: PageId) => {
    return id === "cockpit" ? "/" : `/${id}`;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out
          ${collapsed ? "-translate-x-full lg:translate-x-0 lg:w-16" : "translate-x-0 w-64"}
        `}
      >
        {/* Logo Area */}
        <div className={`flex items-center h-16 px-4 border-b border-slate-200 dark:border-slate-800 ${collapsed ? "lg:justify-center" : "gap-3"}`}>
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {brandLogo}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate leading-tight">TajDigital</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Owner Dashboard</p>
            </div>
          )}
          <button
            onClick={onToggle}
            className="hidden lg:flex p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {collapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>

        {/* Tenant Info */}
        {!collapsed && (
          <div className="mx-3 mt-3 mb-1 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 animate-fade-in">
            <div className="flex items-center gap-2">
              <span className="text-lg">{brandLogo}</span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-orange-900 dark:text-orange-200 truncate">{brandName}</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">{dbPackageType} · {branchCountText}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-3">
          {navGroups.map((group) => {
            const isOpen = openGroups[group.id] ?? true;
            const hasActiveChild = group.items.some(item => item.id === activePage);

            return (
              <div key={group.id} className="space-y-1">
                {/* Category Header Dropdown Toggle */}
                {!collapsed ? (
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors select-none group"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{group.icon}</span>
                      <span>{group.title}</span>
                    </span>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : (
                  <div className="w-full border-t border-slate-200 dark:border-slate-800 my-2" />
                )}

                {/* Sub-Category Items */}
                {(isOpen || collapsed) && (
                  <div className="space-y-0.5 animate-fade-in">
                    {group.items.map((item) => {
                      const itemPath = getPath(item.id);
                      const isActive = activePage === item.id;

                      return (
                        <Link
                          key={item.id}
                          href={itemPath}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer group relative ${
                            isActive
                              ? "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 font-bold"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                          } ${collapsed ? "lg:justify-center lg:px-2" : "ml-1"}`}
                          title={collapsed ? `${group.title}: ${item.label}` : undefined}
                        >
                          <span className={`flex-shrink-0 ${isActive ? "text-orange-500" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`}>
                            {item.icon}
                          </span>
                          {!collapsed && (
                            <>
                              <span className="flex-1 text-left">{item.label}</span>
                              {item.badge && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                  item.badgeVariant === "danger" ? "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400" :
                                  item.badgeVariant === "warning" ? "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400" :
                                  "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                                }`}>
                                  {item.badge}
                                </span>
                              )}
                            </>
                          )}
                          {collapsed && item.badge && (
                            <span className="absolute right-1.5 top-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-950" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Standalone Item (Pengaturan - Standing Alone) */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 my-2">
            {standaloneItems.map((item) => {
              const itemPath = getPath(item.id);
              const isActive = activePage === item.id;

              return (
                <Link
                  key={item.id}
                  href={itemPath}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer group relative ${
                    isActive
                      ? "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                  } ${collapsed ? "lg:justify-center lg:px-2" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={`flex-shrink-0 ${isActive ? "text-orange-500" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="flex-1 text-left">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom User Section */}
        {!collapsed && (
          <div className="px-3 py-3 border-t border-slate-200 dark:border-slate-800">
            <Link
              href="/pengaturan"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{userName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Owner</p>
              </div>
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
