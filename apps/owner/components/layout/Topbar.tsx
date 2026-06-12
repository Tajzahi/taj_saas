"use client";

import { useState } from "react";
import { pageTitles, type PageId } from "@/types/nav";
import { authClient } from "../../../../lib/auth-client";
import { useRouter } from "next/navigation";

interface TopbarProps {
  activePage: PageId;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export function Topbar({ activePage, onToggleSidebar, sidebarCollapsed }: TopbarProps) {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const pageInfo = pageTitles[activePage];
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const userInitials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "OW";

  const userName = session?.user?.name || "Owner";
  const userEmail = session?.user?.email || "owner@tajsaas.id";

  async function handleLogout() {
    await authClient.signOut();
    router.push("/api/auth/signin");
  }

  return (
    <header
      style={{
        background: "rgba(15, 15, 20, 0.95)",
        borderBottom: "1px solid var(--color-border)",
        backdropFilter: "blur(12px)",
        height: "64px",
        left: 0,
        transition: "left 0.3s ease",
      }}
      className={`fixed top-0 right-0 z-20 flex items-center px-4 gap-4`}
    >
      {/* Mobile hamburger */}
      <button
        onClick={onToggleSidebar}
        style={{ color: "var(--color-text-secondary)" }}
        className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Page Info */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold leading-tight" style={{ color: "var(--color-text-primary)" }}>
          {pageInfo?.title || "Owner Cockpit"}
        </h1>
        <p className="text-xs hidden sm:block" style={{ color: "var(--color-text-muted)" }}>
          {pageInfo?.subtitle || ""}
        </p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5">

        {/* AI Chat Button */}
        <button 
          onClick={() => router.push("/ai")}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          style={{ background: "linear-gradient(135deg, #e53e3e, #f97316)" }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-1" />
          </svg>
          AI Insights
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            style={{ color: "var(--color-text-secondary)" }}
            className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          {showNotif && (
            <div
              className="absolute right-0 top-12 w-80 rounded-xl shadow-2xl z-50"
              style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
            >
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--color-border)" }}>
                <h4 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Notifikasi</h4>
                <span className="text-xs cursor-pointer font-medium" style={{ color: "var(--color-primary)" }}>Tandai dibaca</span>
              </div>
              <div className="divide-y max-h-72 overflow-y-auto" style={{ borderColor: "var(--color-border)" }}>
                {[
                  { icon: "🚨", title: "Stok Minyak Goreng Habis", desc: "Cabang Depok · 10 menit lalu", unread: true },
                  { icon: "✅", title: "4 PO Menunggu Approval", desc: "Head Office · 25 menit lalu", unread: true },
                  { icon: "📊", title: "Laporan Harian Siap", desc: "Semua Cabang · 1 jam lalu", unread: false },
                  { icon: "🤖", title: "AI: Insight baru tersedia", desc: "BSD · 2 jam lalu", unread: false },
                ].map((n, i) => (
                  <div key={i}
                    className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-white/5"
                    style={{ background: n.unread ? "rgba(229, 62, 62, 0.04)" : "transparent" }}
                  >
                    <span className="text-xl flex-shrink-0">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${n.unread ? "font-semibold" : "font-medium"}`} style={{ color: "var(--color-text-primary)" }}>{n.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{n.desc}</p>
                    </div>
                    {n.unread && <div className="w-2 h-2 bg-red-500 rounded-full mt-1 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #e53e3e, #f97316)" }}>
              {userInitials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold leading-tight" style={{ color: "var(--color-text-primary)" }}>{userName}</p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Owner</p>
            </div>
          </button>
          {showProfile && (
            <div className="absolute right-0 top-12 w-52 rounded-xl shadow-2xl z-50"
              style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
              <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--color-border)" }}>
                <p className="text-sm font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>{userName}</p>
                <p className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>{userEmail}</p>
              </div>
              {[
                { label: "Profil Saya", icon: "👤", route: "/pengaturan" },
                { label: "Pengaturan", icon: "⚙️", route: "/pengaturan" },
              ].map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => { setShowProfile(false); router.push(item.route); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-white/5 text-left cursor-pointer"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <div style={{ borderTop: "1px solid var(--color-border)" }}>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left cursor-pointer"
                  style={{ color: "var(--color-danger)" }}
                >
                  <span>🚪</span>
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
