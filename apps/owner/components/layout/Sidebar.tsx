"use client";

import { navItems, type PageId } from "@/types/nav";
import { useTenant } from "@taj-saas/shared";
import { authClient } from "../../../../lib/auth-client";
import { useRouter } from "next/navigation";

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ activePage, onNavigate, collapsed, onToggle }: SidebarProps) {
  const { tenant } = useTenant();
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "OW";

  const userName = session?.user?.name || "Owner";

  async function handleLogout() {
    await authClient.signOut();
    router.push("/api/auth/signin"); // fallback redirect
  }

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          background: "var(--color-bg-card)",
          borderRight: "1px solid var(--color-border)",
          width: collapsed ? "72px" : "260px",
        }}
        className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-all duration-300 ease-in-out
          ${collapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"}
        `}
      >
        {/* Logo */}
        <div
          style={{ borderBottom: "1px solid var(--color-border)", height: "64px" }}
          className={`flex items-center px-4 gap-3 flex-shrink-0 ${collapsed ? "lg:justify-center" : ""}`}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-md flex-shrink-0">
            {tenant?.name?.[0] || "T"}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p style={{ color: "var(--color-text-primary)" }} className="text-sm font-bold truncate leading-tight">
                {tenant?.name || "Taj SaaS"}
              </p>
              <p style={{ color: "var(--color-text-muted)" }} className="text-xs truncate">
                Owner Dashboard
              </p>
            </div>
          )}
          <button
            onClick={onToggle}
            style={{ color: "var(--color-text-muted)" }}
            className="hidden lg:flex p-1.5 rounded-md hover:bg-white/5 transition-colors"
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
          <div className="mx-3 mt-3 mb-1 p-3 rounded-xl" style={{ background: "rgba(229, 62, 62, 0.08)", border: "1px solid rgba(229, 62, 62, 0.15)" }}>
            <div className="flex items-center gap-2">
              <span className="text-lg">🥞</span>
              <div className="min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>
                  {tenant?.name || "Martabak Terbul"}
                </p>
                <p className="text-xs capitalize" style={{ color: "var(--color-primary)" }}>
                  {tenant?.packageType || "startup"} Plan
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                  collapsed ? "lg:justify-center lg:px-2" : ""
                }`}
                style={{
                  background: isActive ? "rgba(229, 62, 62, 0.12)" : "transparent",
                  color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
                }}
                title={collapsed ? item.label : undefined}
              >
                <span className="flex-shrink-0 text-base">{item.emoji}</span>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                        style={{
                          background: item.badgeVariant === "danger" ? "rgba(239, 68, 68, 0.15)" :
                            item.badgeVariant === "warning" ? "rgba(245, 158, 11, 0.15)" :
                            "rgba(59, 130, 246, 0.15)",
                          color: item.badgeVariant === "danger" ? "#ef4444" :
                            item.badgeVariant === "warning" ? "#f59e0b" : "#3b82f6",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && item.badge && (
                  <span className="absolute right-1.5 top-1.5 w-2 h-2 bg-red-500 rounded-full hidden lg:block" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom User / Logout */}
        {!collapsed && (
          <div className="px-3 py-3 flex-shrink-0 flex flex-col gap-2" style={{ borderTop: "1px solid var(--color-border)" }}>
            <div
              className="flex items-center gap-3 p-2.5 rounded-xl transition-colors hover:bg-white/5"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>
                  {userName}
                </p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  Owner
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-xs font-semibold py-2 px-3 rounded-lg text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/10 transition-colors text-left flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Keluar
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
