# Project Structure and Codebase - taj_saas

This document contains the complete folder structure and source code files for the project. Secrets and credentials have been replaced with `xxxx`.

## Folder Structure

```text
taj_saas/
├── apps/
│   ├── admin/
│   │   ├── app/
│   │   │   ├── .gitkeep
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── .gitkeep
│   │   │   ├── Dashboard.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── OrderCard.tsx
│   │   │   ├── OrderDetail.tsx
│   │   │   ├── OrderQueue.tsx
│   │   │   ├── PrintReceipt.tsx
│   │   │   └── StoreToggleModal.tsx
│   │   ├── data/
│   │   │   ├── delivery_rules.md
│   │   │   ├── menu_knowledge.md
│   │   │   ├── menu.ts
│   │   │   └── store_info.md
│   │   ├── store/
│   │   │   └── adminStore.ts
│   │   ├── utils/
│   │   │   ├── cn.ts
│   │   │   ├── format.ts
│   │   │   └── supabase.ts
│   │   ├── .env
│   │   ├── instrumentation.ts
│   │   ├── middleware.ts
│   │   ├── next-env.d.ts
│   │   ├── next.config.ts
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── postcss.config.mjs
│   │   ├── sentry.client.config.ts
│   │   ├── sentry.edge.config.ts
│   │   ├── sentry.server.config.ts
│   │   └── tsconfig.json
│   ├── customer/
│   │   ├── app/
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── api/
│   │   │   │   ├── auth/
│   │   │   │   │   └── [...better-auth]/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── chat/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── orders/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── test-sentry-server/
│   │   │   │   │   └── route.ts
│   │   │   │   └── validate-promo/
│   │   │   │       └── route.ts
│   │   │   ├── cart/
│   │   │   │   └── page.tsx
│   │   │   ├── catering/
│   │   │   │   └── page.tsx
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   ├── faq/
│   │   │   │   └── page.tsx
│   │   │   ├── gallery/
│   │   │   │   └── page.tsx
│   │   │   ├── menu/
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── privacy/
│   │   │   │   └── page.tsx
│   │   │   ├── promo/
│   │   │   │   └── page.tsx
│   │   │   ├── terms/
│   │   │   │   └── page.tsx
│   │   │   ├── test-sentry/
│   │   │   │   └── page.tsx
│   │   │   ├── tracking/
│   │   │   │   └── page.tsx
│   │   │   ├── .gitkeep
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── public/
│   │   │   │   ├── CartDrawer.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── MenuCard.tsx
│   │   │   ├── .gitkeep
│   │   │   ├── AddToCartModal.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── ChatBot.tsx
│   │   │   ├── DeliveryMap.tsx
│   │   │   ├── FloatingButtons.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MenuCard.tsx
│   │   ├── data/
│   │   │   ├── delivery_rules.md
│   │   │   ├── menu_knowledge.md
│   │   │   ├── menu.ts
│   │   │   └── store_info.md
│   │   ├── hooks/
│   │   │   └── useCart.ts
│   │   ├── lib/
│   │   │   ├── supabase/
│   │   │   │   ├── client.ts
│   │   │   │   ├── menuService.ts
│   │   │   │   ├── mock.ts
│   │   │   │   └── server.ts
│   │   │   ├── utils/
│   │   │   │   └── format.ts
│   │   │   └── .gitkeep
│   │   ├── public/
│   │   │   ├── assets/
│   │   │   │   ├── menu/
│   │   │   │   │   └── placeholder.jpg
│   │   │   │   ├── banner_red.png
│   │   │   │   └── banner_redm.png
│   │   │   ├── clock.svg
│   │   │   ├── facebook.svg
│   │   │   ├── file.svg
│   │   │   ├── globe.svg
│   │   │   ├── google-maps.svg
│   │   │   ├── Halal logo.jfif
│   │   │   ├── instagram.svg
│   │   │   ├── logo.ico
│   │   │   ├── logo.svg
│   │   │   ├── next.svg
│   │   │   ├── qris.png
│   │   │   ├── tiktok.svg
│   │   │   ├── vercel.svg
│   │   │   ├── whatsapp.svg
│   │   │   └── window.svg
│   │   ├── store/
│   │   │   └── cartStore.ts
│   │   ├── types/
│   │   │   ├── cart.types.ts
│   │   │   └── database.types.ts
│   │   ├── utils/
│   │   │   └── cn.ts
│   │   ├── .env
│   │   ├── instrumentation.ts
│   │   ├── middleware.ts
│   │   ├── next-env.d.ts
│   │   ├── next.config.ts
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── postcss.config.mjs
│   │   ├── sentry.client.config.ts
│   │   ├── sentry.edge.config.ts
│   │   ├── sentry.server.config.ts
│   │   └── tsconfig.json
│   ├── owner/
│   │   ├── _pages/
│   │   │   ├── AIInsights.tsx
│   │   │   ├── Cabang.tsx
│   │   │   ├── ExecutiveCockpit.tsx
│   │   │   ├── Keuangan.tsx
│   │   │   ├── MenuResep.tsx
│   │   │   ├── Pengaturan.tsx
│   │   │   ├── Penjualan.tsx
│   │   │   ├── Persediaan.tsx
│   │   │   ├── Persetujuan.tsx
│   │   │   ├── Produksi.tsx
│   │   │   └── SDM.tsx
│   │   ├── app/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── ai/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── cabang/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── keuangan/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── menu/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── pengaturan/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── penjualan/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── persediaan/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── persetujuan/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── produksi/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── sdm/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── .gitkeep
│   │   │   ├── globals.css
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Topbar.tsx
│   │   │   ├── ui/
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   └── Input.tsx
│   │   │   └── .gitkeep
│   │   ├── data/
│   │   │   └── mockData.ts
│   │   ├── types/
│   │   │   └── nav.ts
│   │   ├── utils/
│   │   │   ├── cn.ts
│   │   │   └── format.ts
│   │   ├── .env
│   │   ├── instrumentation.ts
│   │   ├── middleware.ts
│   │   ├── next-env.d.ts
│   │   ├── next.config.ts
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── postcss.config.mjs
│   │   ├── sentry.client.config.ts
│   │   ├── sentry.edge.config.ts
│   │   ├── sentry.server.config.ts
│   │   └── tsconfig.json
│   └── package-lock.json
├── docs/
│   ├── Complete-Blueprint-From-Scratch-Enterprise-SaaS-FnB.md
│   ├── Complete-Project-Start-Guide-Multi-Tenant-FnB-SaaS.md
│   ├── Complete-UI-UX-and-Project-Structure-Blueprint.md
│   ├── Domain-Subdomain-Setup-Guide.md
│   ├── Free-Tier-Quotas-and-Tech-Stack-Assessment.md
│   ├── Full-Implementation-Blueprint-All-Parts.md
│   ├── Full-Project-Blueprint-Multi-Tenant-FnB-SaaS.md
│   ├── Master-Conversation-Summary-and-Final-Blueprint.md
│   ├── Migration-Plan-Quotas-and-Scaling.md
│   └── Self-Service-Architecture-and-Pricing-Update.md
├── lib/
│   ├── auth-client.ts
│   ├── auth-schema.ts
│   └── auth.ts
├── packages/
│   ├── config/
│   │   ├── .gitkeep
│   │   └── package.json
│   ├── db/
│   │   ├── scripts/
│   │   │   └── seed-template.ts
│   │   ├── .gitkeep
│   │   ├── drizzle.config.ts
│   │   ├── index.ts
│   │   ├── package.json
│   │   └── schema.ts
│   ├── shared/
│   │   ├── .gitkeep
│   │   ├── index.ts
│   │   └── package.json
│   └── ui/
│       ├── .gitkeep
│       └── package.json
├── scripts/
│   └── .gitkeep
├── .env
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── turbo.json
```

## Files and Contents

### File: `.env`

```text
# ==========================================
# taj_saas - Global Environment Variables
# ==========================================

# Database & ORM Connection (Neon Live Database)
DATABASE_URL=xxxx

# Supabase Configurations (Placeholder / Mocked client initialization)
NEXT_PUBLIC_SUPABASE_URL=xxxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx

# Gemini AI (For Customer Portal AI Chatbot)
# Get a key from: https://aistudio.google.com/
GEMINI_API_KEY=xxxx

BETTER_AUTH_SECRET=xxxx
BETTER_AUTH_URL=xxxx
BETTER_AUTH_API_KEY=xxxx

# Ably Realtime Key
ABLY_API_KEY=xxxx
```

---

### File: `.gitignore`

```text
# Dependencies
node_modules
/.pnpm-store

# Next.js build outputs
.next/
out/

# Turborepo
.turbo/

# Production/development build outputs
build/
dist/

# Env files (contains secrets)
.env
.env*.local
.env.local
.env.development
.env.production
.env.staging

# Log files
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# System files
.DS_Store
Thumbs.db

```

---

### File: `apps/admin/.env`

```text
# Supabase Configurations (Placeholder / Mocked client initialization)
NEXT_PUBLIC_SUPABASE_URL=xxxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx

BETTER_AUTH_SECRET=xxxx
BETTER_AUTH_URL=xxxx

# Sentry — Error Monitoring
NEXT_PUBLIC_SENTRY_DSN=xxxx
SENTRY_AUTH_TOKEN=xxxx
SENTRY_ORG=xxxx
SENTRY_PROJECT=xxxx

# PostHog — Product Analytics
NEXT_PUBLIC_POSTHOG_KEY=xxxx
NEXT_PUBLIC_POSTHOG_HOST=xxxx
BETTER_AUTH_API_KEY=xxxx

DATABASE_URL=xxxx
ABLY_API_KEY=xxxx



```

---

### File: `apps/admin/app/.gitkeep`

```text
# Placeholder

```

---

### File: `apps/admin/app/globals.css`

```css
@import "tailwindcss";
@source "../components";

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb {
  background: #C83707;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #8E0E0E;
}

/* Pulse border for new orders */
@keyframes pulseBorder {
  0%, 100% { border-color: #3b82f6; box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
  50% { border-color: #60a5fa; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
}
.animate-pulse-border {
  animation: pulseBorder 1.5s ease-in-out infinite;
}

/* Flash animation for alarm banner */
@keyframes flashRed {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
.animate-flash {
  animation: flashRed 0.8s ease-in-out infinite;
}

/* ============================================
   PRINT STYLES - Thermal Receipt (80mm)
   ============================================ */
@media print {
  /* Hide everything except receipt */
  body * {
    visibility: hidden !important;
  }

  body.printing-receipt .print-receipt-container,
  body.printing-receipt .print-receipt-container *,
  body.printing-report .print-report-container,
  body.printing-report .print-report-container * {
    visibility: visible !important;
  }

  body.printing-receipt .print-receipt-container,
  body.printing-report .print-report-container {
    display: block !important;
    position: fixed !important;
    left: 0 !important;
    top: 0 !important;
    width: 80mm !important;
    font-family: 'Courier New', Courier, monospace !important;
    font-size: 11pt !important;
    line-height: 1.3 !important;
    color: #000 !important;
    background: #fff !important;
    padding: 4mm !important;
    z-index: 9999 !important;
  }

  .print-receipt-container .header {
    text-align: center;
    margin-bottom: 4mm;
  }

  .print-receipt-container .header h2 {
    font-size: 14pt;
    font-weight: bold;
    margin: 0 0 2mm 0;
    letter-spacing: 1px;
  }

  .print-receipt-container .header p {
    font-size: 9pt;
    margin: 1mm 0;
  }

  .print-receipt-container .divider {
    text-align: center;
    margin: 3mm 0;
    font-size: 10pt;
    letter-spacing: -1px;
  }

  .print-receipt-container .meta p {
    margin: 1.5mm 0;
    font-size: 10pt;
  }

  .print-receipt-container .items-table {
    width: 100%;
    border-collapse: collapse;
  }

  .print-receipt-container .items-table td {
    padding: 1mm 0;
    font-size: 10pt;
    vertical-align: top;
  }

  .print-receipt-container .text-right {
    text-align: right;
  }

  .print-receipt-container .variants td {
    font-size: 9pt;
    padding-left: 4mm;
    font-style: italic;
    color: #333;
  }

  .print-receipt-container .totals p {
    margin: 1.5mm 0;
    font-size: 10pt;
    overflow: hidden;
  }

  .print-receipt-container .float-right {
    float: right;
  }

  .print-receipt-container .grand-total {
    font-size: 13pt !important;
    font-weight: bold !important;
    margin-top: 2mm !important;
    padding-top: 2mm !important;
    border-top: 1px solid #000;
  }

  .print-receipt-container .footer {
    text-align: center;
    margin-top: 3mm;
  }

  .print-receipt-container .footer p {
    font-size: 9pt;
    margin: 1.5mm 0;
  }

  .print-receipt-container .thanks {
    font-size: 10pt !important;
    font-weight: bold !important;
    margin-top: 4mm !important;
  }

  /* Override hidden class for print receipt */
  .print-receipt-container.hidden {
    display: block !important;
  }
}

/* ============================================
   SCREEN: Hide print receipt/report container
   ============================================ */
@media screen {
  .print-receipt-container,
  .print-report-container {
    display: none !important;
  }
}



```

---

### File: `apps/admin/app/layout.tsx`

```tsx
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
      <body className="antialiased bg-stone-900 text-stone-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}

```

---

### File: `apps/admin/app/page.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";
import LoginPage from "../components/LoginPage";
import Dashboard from "../components/Dashboard";
import { useAdminStore } from "../store/adminStore";

export default function AdminAppPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    // Check local storage for mock session
    const storedUser = localStorage.getItem("admin_user");
    if (storedUser) {
      setUsername(storedUser);
      setIsLoggedIn(true);
      
      // Also ensure mock shift is opened if not already
      const activeShift = useAdminStore.getState().activeShift;
      if (!activeShift) {
        useAdminStore.getState().openShift(200000, storedUser);
      }
    }
    setIsCheckingSession(false);
  }, []);

  const handleLogin = (user: string) => {
    localStorage.setItem("admin_user", user);
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_user");
    setIsLoggedIn(false);
    setUsername("");
    // Clear active shift locally too
    useAdminStore.setState({ activeShift: null });
  };

  if (isCheckingSession) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-white"
        style={{
          background:
            "linear-gradient(135deg, #8E0E0E 0%, #D94708 60%, #E05009 100%)",
        }}
      >
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4" />
        <p className="font-black tracking-wider text-xs">
          MEMUAT PORTAL OPERASIONAL...
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} username={username} />;
}

```

---

### File: `apps/admin/components/.gitkeep`

```text
# Placeholder

```

---

### File: `apps/admin/components/Dashboard.tsx`

```tsx
import { useEffect, useRef, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import OrderQueue from './OrderQueue';
import OrderDetail from './OrderDetail';
import StoreToggleModal from './StoreToggleModal';
import { LogOut, Store, StoreIcon, Volume2, VolumeX, Bell, ChevronLeft, ChefHat, X, RefreshCw, Clock, AlertTriangle, User, ClipboardList, Utensils } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { formatRupiah } from '../utils/format';

interface DashboardProps {
  onLogout: () => void;
  username: string;
}

export default function Dashboard({ onLogout, username }: DashboardProps) {
  const {
    orders,
    selectedOrderId,
    isAlarmPlaying,
    isStoreOpen,
    newOrderIds,
    stopAlarm,
    fetchOrders,
    fetchStoreSettings,
    subscribeToOrders,
    unsubscribeFromOrders,
    menuItems,
    fetchMenuItems,
    toggleMenuItemAvailability,
    toppings,
    fetchToppings,
    toggleToppingAvailability,
    connectionStatus,
    storeLogs,
    fetchStoreLogs,
    activeShift,
    fetchActiveShift,
    openShift,
    closeShift,
  } = useAdminStore();

  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [cashInput, setCashInput] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [startingCashInput, setStartingCashInput] = useState('200000'); // default modal awal wajar
  const [operatorNameInput, setOperatorNameInput] = useState(username);
  const [isOpeningShift, setIsOpeningShift] = useState(false);

  // Real-time clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Load and Subscribe to Database on mount
  useEffect(() => {
    fetchStoreSettings();
    fetchOrders();
    subscribeToOrders();
    fetchActiveShift();

    return () => {
      unsubscribeFromOrders();
    };
  }, [fetchOrders, fetchStoreSettings, subscribeToOrders, unsubscribeFromOrders, fetchActiveShift]);

  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const beepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || null;

  // Alarm using AudioContext beep (works without audio file)
  useEffect(() => {
    const playBeep = () => {
      if (isMuted) return;
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, ctx.currentTime);
        oscillator.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.4);
      } catch (e) {
        // AudioContext not available
      }
    };

    if (isAlarmPlaying && !isMuted) {
      playBeep();
      beepIntervalRef.current = setInterval(playBeep, 2000);
    } else {
      if (beepIntervalRef.current) {
        clearInterval(beepIntervalRef.current);
        beepIntervalRef.current = null;
      }
    }

    return () => {
      if (beepIntervalRef.current) {
        clearInterval(beepIntervalRef.current);
        beepIntervalRef.current = null;
      }
    };
  }, [isAlarmPlaying, isMuted]);

  // When order selected on mobile, show detail
  const handleSelectMobileOrder = () => {
    if (selectedOrderId) {
      setShowMobileDetail(true);
    }
  };

  // Statistik laporan harian — filter hari ini saja
  const todayStr = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === todayStr);
  const completedToday = todayOrders.filter(o => o.status === 'completed');
  const cancelledToday = todayOrders.filter(o => o.status === 'cancelled');
  const revenueToday = completedToday.reduce((sum, o) => sum + o.totalPrice, 0);
  const codExpected = completedToday.filter(o => o.paymentMethod === 'cod').reduce((sum, o) => sum + o.totalPrice, 0);
  const qrisExpected = completedToday.filter(o => o.paymentMethod === 'transfer').reduce((sum, o) => sum + o.totalPrice, 0);
  
  // Shift cash calculations
  const startingCash = activeShift ? activeShift.startingCash : 0;
  const expectedCashInDrawer = startingCash + codExpected;
  const parsedCashInput = cashInput ? Number(cashInput.replace(/\./g, '').replace(/,/g, '.')) : 0;
  const cashDiff = cashInput ? parsedCashInput - expectedCashInDrawer : 0;

  // Store open/close times from store_logs (today)
  const todayDateStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  })();
  const todayOpenLog = storeLogs.find(l => l.action === 'open' && l.selectedDate === todayDateStr);
  const todayCloseLog = storeLogs.find(l => l.action === 'closed' && l.selectedDate === todayDateStr);

  const formatLogTime = (isoStr: string) => {
    return new Date(isoStr).toLocaleTimeString('id-ID', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false, timeZone: 'Asia/Jakarta'
    }) + ' WIB';
  };

  // CSV Export function
  const exportToCSV = () => {
    const dateLabel = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const rows = [
      ['REKAP PENJUALAN HARIAN - MARTABAK A6 NYUSS'],
      [''],
      ['Tanggal', dateLabel],
      ['Operator Shift', activeShift ? activeShift.operatorName : username],
      ['Jam Buka Toko', todayOpenLog ? formatLogTime(todayOpenLog.loggedAt) : '-'],
      ['Jam Tutup Toko', todayCloseLog ? formatLogTime(todayCloseLog.loggedAt) : '-'],
      ['Waktu Cetak', new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB'],
      [''],
      ['RINGKASAN PESANAN'],
      ['Total Pesanan Hari Ini', todayOrders.length],
      ['Pesanan Selesai', completedToday.length],
      ['Pesanan Batal', cancelledToday.length],
      [''],
      ['REKAP KEUANGAN'],
      ['Total Omset Bersih', revenueToday],
      ['QRIS / Transfer (Digital)', qrisExpected],
      ['Modal Awal Laci', startingCash],
      ['Omset Tunai / COD', codExpected],
      ['Kas Diharapkan di Laci', expectedCashInDrawer],
      ['Kas Aktual (Uang Fisik)', cashInput ? Number(cashInput.replace(/\./g, '').replace(/,/g, '.')) : 0],
      ['Selisih Kas Laci', cashDiff],
      [''],
      ['DETAIL PESANAN SELESAI'],
      ['No', 'Kode Pesanan', 'Nama Pelanggan', 'Metode Bayar', 'Total'],
      ...completedToday.map((o, i) => [i + 1, o.orderCode, o.customerName, o.paymentMethod === 'cod' ? 'Tunai' : 'QRIS', o.totalPrice]),
    ];
    const csvContent = rows.map(r => r.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rekap-a6nyuss-${todayDateStr}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* Header */}
      <header
        className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 text-white shrink-0 shadow-lg z-10"
        style={{ background: 'linear-gradient(135deg, #8E0E0E 0%, #B72A0A 50%, #D94708 100%)' }}
      >
        {/* Left: Logo + Clock */}
        <div className="flex items-center gap-2">
          <div>
            <h1 className="font-black text-sm leading-none tracking-tight">A6 NYUSS</h1>
            <p className="text-white/70 text-[10px] leading-none font-medium">Portal Operasional</p>
          </div>
        </div>

        {/* Center: Alarm Banner */}
        {isAlarmPlaying && newOrderIds.length > 0 && (
          <div
            className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black animate-pulse"
            style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.5)' }}
          >
            <Bell className="w-3.5 h-3.5 animate-bounce" />
            {newOrderIds.length} PESANAN BARU MASUK!
          </div>
        )}

        {/* Right: Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Mute toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Aktifkan Suara' : 'Matikan Suara'}
            className="p-1.5 rounded-lg transition-colors hover:bg-white/20 shrink-0"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white/60" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>

          {/* Stop Alarm - visible on all screen sizes */}
          {isAlarmPlaying && (
            <button
              onClick={stopAlarm}
              className="flex items-center justify-center p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-bold bg-white/20 hover:bg-white/30 transition-colors animate-pulse shrink-0"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span className="hidden sm:inline ml-1">Hentikan</span>
            </button>
          )}

          {/* Stok Menu Button */}
          <button
            onClick={() => {
              fetchMenuItems();
              fetchToppings();
              setIsMenuModalOpen(true);
            }}
            className="flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-black transition-all border bg-white/10 border-white/20 text-white hover:bg-white/20 shrink-0"
            title="Stok Menu"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span className="hidden sm:inline ml-1.5">Stok Menu</span>
          </button>

          {/* Rekap Harian Button */}
          <button
            onClick={() => {
              setCashInput('');
              fetchStoreLogs(todayDateStr);
              setIsReportOpen(true);
            }}
            className="flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-black transition-all border bg-white/10 border-white/20 text-white hover:bg-white/20 shrink-0"
            title="Rekap Harian"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span className="hidden sm:inline ml-1.5">Rekap Harian</span>
          </button>

          {/* Store Status */}
          <button
            onClick={() => setIsStoreModalOpen(true)}
            className={`flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-black transition-all border shrink-0 ${
              isStoreOpen
                ? 'bg-green-400/20 border-green-300/50 text-green-200 hover:bg-green-400/30'
                : 'bg-red-400/20 border-red-300/50 text-red-200 hover:bg-red-400/30'
            }`}
            title="Status Toko"
          >
            {isStoreOpen ? (
              <>
                <Store className="w-3.5 h-3.5" />
                <span className="hidden sm:inline ml-1.5">BUKA</span>
              </>
            ) : (
              <>
                <StoreIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline ml-1.5">TUTUP</span>
              </>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 transition-colors border border-white/20 shrink-0"
            title="Keluar"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline ml-1.5">Keluar</span>
          </button>
        </div>
      </header>

      {/* Network Connection Warning Banner */}
      {connectionStatus === 'disconnected' ? (
        <div className="bg-red-600 text-white text-center py-2.5 px-4 text-sm font-bold flex items-center justify-center gap-2 shrink-0 z-20 shadow-md animate-pulse">
          <AlertTriangle className="w-4 h-4 animate-bounce" />
          <span>KONEKSI INTERNET PUTUS! Pesanan baru tidak dapat masuk. Periksa WiFi / kabel LAN Anda sekarang.</span>
        </div>
      ) : connectionStatus === 'connecting' ? (
        <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-bold flex items-center justify-center gap-2 shrink-0 z-20 shadow-md">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Sedang mencoba menghubungkan kembali ke server... Harap tunggu.</span>
        </div>
      ) : null}


      {/* Mobile Alarm Banner */}
      {isAlarmPlaying && newOrderIds.length > 0 && (
        <div
          className="md:hidden flex items-center justify-between px-4 py-2 text-white text-xs font-black animate-pulse z-10"
          style={{ background: 'linear-gradient(90deg, #8E0E0E, #D94708)' }}
        >
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 animate-bounce" />
            <span>{newOrderIds.length} PESANAN BARU! KONFIRMASI SEKARANG</span>
          </div>
          <button onClick={stopAlarm} className="flex items-center gap-1 text-white/80 hover:text-white">
            <VolumeX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Panel: Order Queue (40% on Desktop, sliding out on Mobile) */}
        <div
          className={`flex flex-col border-r border-gray-300 overflow-hidden bg-white shrink-0 transition-transform duration-300 w-full md:w-[40%] md:min-w-[280px] md:max-w-[400px] md:translate-x-0 ${
            showMobileDetail ? '-translate-x-full' : 'translate-x-0'
          }`}
        >
          <div className="flex-1 overflow-hidden">
            <OrderQueue onOrderSelect={handleSelectMobileOrder} />
          </div>
        </div>

        {/* Right Panel: Order Detail (60% on Desktop, sliding in on Mobile) */}
        <div
          className={`absolute md:relative inset-y-0 right-0 md:inset-auto md:flex-1 flex flex-col bg-gray-50 transition-transform duration-300 w-full md:w-auto md:translate-x-0 ${
            showMobileDetail ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Mobile header (Back button) */}
          <div className="md:hidden px-4 py-2.5 border-b border-gray-200 bg-white shrink-0 flex items-center gap-3">
            <button
              onClick={() => setShowMobileDetail(false)}
              className="flex items-center gap-1 text-sm font-bold"
              style={{ color: '#C83707' }}
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali
            </button>
            <h2 className="font-black text-sm text-gray-800 flex-1 truncate">
              {selectedOrder ? `${selectedOrder.orderCode}` : 'Detail Pesanan'}
            </h2>
          </div>

          {/* Desktop header */}
          <div
            className="hidden md:block px-4 py-2.5 border-b border-gray-200 shrink-0 bg-white"
          >
            <h2 className="font-black text-sm text-gray-800">
              Detail Pesanan{selectedOrder ? ` — ${selectedOrder.orderCode}` : ''}
            </h2>
          </div>

          <div className="flex-1 overflow-hidden">
            {selectedOrder ? (
              <OrderDetail order={selectedOrder} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ClipboardList className="w-12 h-12 mb-3 text-gray-300" />
                <p className="text-base font-semibold">Pilih pesanan dari antrean</p>
                <p className="text-sm">untuk melihat detail & mengambil tindakan</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Status Bar — Desktop */}
      <div className="hidden md:flex items-center justify-between px-4 py-1.5 border-t border-gray-200 bg-white text-xs text-gray-500 shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            Status Toko:{' '}
            <span className="flex items-center gap-1">
              <span className={`h-2 w-2 rounded-full ${isStoreOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              <strong className={isStoreOpen ? 'text-green-600' : 'text-red-600'}>
                {isStoreOpen ? 'BUKA' : 'TUTUP'}
              </strong>
            </span>
          </span>
          {currentTime && (
            <span className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>Jam Realtime: <strong className="font-mono font-bold text-gray-700">{currentTime}</strong></span>
            </span>
          )}
          <span className="flex items-center gap-1.5 border-l border-gray-200 pl-4">
            <User className="w-3.5 h-3.5 text-gray-400" />
            <span>Operator Aktif: <strong className="text-gray-700">{activeShift ? activeShift.operatorName : username}</strong></span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>Pesanan Hari Ini: <strong className="text-gray-700">{todayOrders.length}</strong></span>
          <span>Menunggu Verifikasi: <strong className="text-amber-600">{todayOrders.filter(o => o.paymentStatus === 'waiting_verification').length}</strong></span>
          <span>© 2026 Martabak Terbul A6 Nyuss</span>
        </div>
      </div>

      {/* Footer Quick Stats — Mobile Only */}
      <div className="md:hidden flex items-center justify-around px-3 py-2 border-t border-gray-200 bg-white text-xs shrink-0">
        <div className="flex flex-col items-center gap-0.5">
          <span className={`h-2.5 w-2.5 rounded-full ${isStoreOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'} mb-0.5`}></span>
          <span className={`font-bold text-[10px] ${isStoreOpen ? 'text-green-600' : 'text-red-600'}`}>
            {isStoreOpen ? 'BUKA' : 'TUTUP'}
          </span>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        {currentTime && (
          <>
            <div className="flex flex-col items-center gap-0.5">
              <span className="font-mono font-bold text-sm text-gray-800">{currentTime}</span>
              <span className="text-gray-400 font-medium text-[10px]">Jam</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
          </>
        )}
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-black text-base text-gray-800">{todayOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length}</span>
          <span className="text-gray-400 font-medium">Aktif</span>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex flex-col items-center gap-0.5">
          <span className={`font-black text-base ${
            todayOrders.filter(o => o.paymentStatus === 'waiting_verification').length > 0
              ? 'text-amber-500'
              : 'text-gray-400'
          }`}>
            {todayOrders.filter(o => o.paymentStatus === 'waiting_verification').length}
          </span>
          <span className="text-gray-400 font-medium">Verif</span>
        </div>
        <div className="w-px h-8 bg-gray-200" />
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-black text-base text-gray-800">{todayOrders.length}</span>
          <span className="text-gray-400 font-medium">Total</span>
        </div>
      </div>

      {/* Menu Items Stock Modal */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between shrink-0 bg-gray-50">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-orange-600" />
                <div>
                  <h3 className="font-black text-gray-900 text-base">Manajemen Stok Menu</h3>
                  <p className="text-xs text-gray-500 font-medium">Atur ketersediaan menu gerai</p>
                </div>
              </div>
              <button
                onClick={() => setIsMenuModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {menuItems.length === 0 && toppings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <RefreshCw className="w-8 h-8 animate-spin mb-3 text-orange-500" />
                  <p className="text-sm font-semibold">Memuat daftar menu...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Group by Category */}
                  {Object.entries(
                    menuItems.reduce((acc, item) => {
                      const cat = item.categoryName || 'Lainnya';
                      if (!acc[cat]) acc[cat] = [];
                      acc[cat].push(item);
                      return acc;
                    }, {} as Record<string, typeof menuItems>)
                  ).map(([category, items]) => (
                    <div key={category} className="space-y-2.5">
                      <h4 className="text-xs font-black text-orange-700 tracking-wider uppercase border-b pb-1">
                        {category}
                      </h4>
                      <div className="divide-y divide-gray-100">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between py-2.5 gap-4">
                            <div>
                              <p className="font-bold text-sm text-gray-800">{item.name}</p>
                              <p className={`text-xs font-semibold ${item.isAvailable ? 'text-green-650' : 'text-red-555'}`}>
                                {item.isAvailable ? 'Tersedia' : 'Habis'}
                              </p>
                            </div>
                            {/* Toggle Switch */}
                            <button
                              onClick={() => toggleMenuItemAvailability(item.id, !item.isAvailable)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                item.isAvailable ? 'bg-green-500' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                  item.isAvailable ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Toppings Section */}
                  {toppings.length > 0 && (
                    <div className="space-y-2.5 pt-4 border-t border-dashed border-gray-200">
                      <h4 className="text-xs font-black text-orange-700 tracking-wider uppercase border-b pb-1">
                        Stok Topping Terang Bulan
                      </h4>
                      <div className="divide-y divide-gray-100">
                        {toppings.map((topping) => (
                          <div key={topping.id} className="flex items-center justify-between py-2.5 gap-4">
                            <div>
                              <p className="font-bold text-sm text-gray-800">{topping.name}</p>
                              <p className={`text-xs font-semibold ${topping.isAvailable ? 'text-green-655' : 'text-red-555'}`}>
                                {topping.isAvailable ? 'Tersedia' : 'Habis'}
                              </p>
                            </div>
                            {/* Toggle Switch */}
                            <button
                              onClick={() => toggleToppingAvailability(topping.id, !topping.isAvailable)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                topping.isAvailable ? 'bg-green-500' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                  topping.isAvailable ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end shrink-0">
              <button
                onClick={() => setIsMenuModalOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-bold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Laporan Harian Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between shrink-0 bg-gray-50">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-orange-600" />
                <div>
                  <h3 className="font-black text-gray-900 text-base">Rekap Penjualan Harian</h3>
                  <p className="text-xs text-gray-500 font-medium">Laporan tutup toko &amp; hitung uang laci</p>
                </div>
              </div>
              <button
                onClick={() => setIsReportOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">

              {/* Store Open/Close Times */}
              <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 space-y-1.5">
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Waktu Operasional Toko Hari Ini</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">🟢 Jam Buka</span>
                  <span className="font-black text-gray-800">
                    {todayOpenLog ? formatLogTime(todayOpenLog.loggedAt) : <span className="text-gray-400 italic">Belum dicatat</span>}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">🔴 Jam Tutup</span>
                  <span className="font-black text-gray-800">
                    {todayCloseLog ? formatLogTime(todayCloseLog.loggedAt) : <span className="text-gray-400 italic">Belum dicatat</span>}
                  </span>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-2xl">
                  <p className="text-xs text-green-700 font-bold">Total Omset Bersih</p>
                  <p className="text-lg font-black text-green-950 mt-1">{formatRupiah(revenueToday)}</p>
                  <p className="text-[10px] text-green-600 font-semibold">{completedToday.length} pesanan sukses</p>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="text-xs text-red-700 font-bold">Pesanan Batal</p>
                  <p className="text-lg font-black text-red-950 mt-1">{cancelledToday.length} order</p>
                  <p className="text-[10px] text-red-500 font-semibold">Gagal diproses</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-2 text-xs font-bold text-gray-700">
                {activeShift && (
                  <div className="flex justify-between border-b pb-1.5 mb-1.5">
                    <span className="text-gray-500 font-semibold">Kasir / Operator</span>
                    <span className="text-gray-900 font-black">{activeShift.operatorName}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">QRIS / Transfer (Digital)</span>
                  <span className="text-gray-900">{formatRupiah(qrisExpected)}</span>
                </div>
                {activeShift && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-semibold">Modal Awal Laci</span>
                    <span className="text-gray-900">{formatRupiah(startingCash)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">Omset Tunai / COD (Sistem)</span>
                  <span className="text-gray-900">{formatRupiah(codExpected)}</span>
                </div>
                <div className="flex justify-between border-t pt-1.5 text-sm font-black">
                  <span className="text-gray-900">Total Kas Diharapkan di Laci</span>
                  <span className="text-red-800">{formatRupiah(expectedCashInDrawer)}</span>
                </div>
              </div>

              {/* Cash Input */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider">
                  Masukkan Jumlah Uang Fisik di Laci Kasir:
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">Rp</span>
                  <input
                    type="text"
                    value={cashInput}
                    onChange={(e) => setCashInput(e.target.value)}
                    placeholder="Contoh: 500.000"
                    className="w-full pl-9 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-orange-500 text-gray-800 font-bold text-sm"
                  />
                </div>
                {cashInput && (
                  <div className={`p-3 rounded-2xl text-xs font-bold flex items-center justify-between ${
                    cashDiff === 0 
                      ? 'bg-green-50 border border-green-200 text-green-700' 
                      : cashDiff < 0 
                      ? 'bg-red-50 border border-red-200 text-red-700' 
                      : 'bg-blue-50 border border-blue-200 text-blue-700'
                  }`}>
                    <span>Selisih Uang Fisik vs Diharapkan:</span>
                    <span className="text-sm font-black">
                      {cashDiff === 0 ? '✓ Sesuai (Pukul Rata)' : cashDiff < 0 ? `Kurang: -${formatRupiah(Math.abs(cashDiff))}` : `Lebih: +${formatRupiah(cashDiff)}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer — Single Action Button */}
            <div className="px-4 py-4 bg-gray-50 border-t shrink-0 space-y-2">
              {/* Single button: semua aksi sekaligus */}
              <button
                onClick={async () => {
                  if (!cashInput) {
                    toast.error('Harap masukkan jumlah uang fisik di laci terlebih dahulu!');
                    return;
                  }
                  
                  const actualCashAmt = Number(cashInput.replace(/\./g, '').replace(/,/g, '.'));
                  if (isNaN(actualCashAmt) || actualCashAmt < 0) {
                    toast.error('Uang fisik tidak valid!');
                    return;
                  }

                  // 1. Close shift in database
                  const success = await closeShift(actualCashAmt, expectedCashInDrawer);
                  if (!success) {
                    toast.error('Gagal memproses tutup shift kasir di server. Coba lagi.');
                    return;
                  }

                  // 2. Ekspor CSV (non-blocking)
                  exportToCSV();

                  // 3. Cetak thermal Z-Report
                  setTimeout(() => {
                    document.body.classList.add('printing-report');
                    window.print();
                    setTimeout(() => document.body.classList.remove('printing-report'), 500);
                  }, 300);

                  // 4. Laporkan ke Owner via WhatsApp
                  const dateLabel = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
                  const waText = `*LAPORAN SHIFT MASUK (Z-REPORT) - A6 NYUSS*\nTanggal: ${dateLabel}\nOperator: ${activeShift?.operatorName || username}\n\n*RINCIAN KEUANGAN:*\n- Total Omset Bersih: ${formatRupiah(revenueToday)}\n- Transfer/QRIS: ${formatRupiah(qrisExpected)}\n- Modal Awal Laci: ${formatRupiah(startingCash)}\n- Omset Tunai/COD: ${formatRupiah(codExpected)}\n- Kas Diharapkan di Laci: ${formatRupiah(expectedCashInDrawer)}\n- Kas Aktual (Uang Fisik): ${formatRupiah(actualCashAmt)}\n- Selisih Kas Laci: ${formatRupiah(cashDiff)}\n\n*RINGKASAN PESANAN:*\n- Total Pesanan Hari Ini: ${todayOrders.length}\n- Pesanan Sukses: ${completedToday.length}\n- Pesanan Batal: ${cancelledToday.length}\n\n-- Laporan Tutup Shift Sukses --`;
                  const cleanPhone = '6287811123482'; // Nomor WhatsApp Owner
                  const linkUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`;
                  window.open(linkUrl, '_blank');

                  setIsReportOpen(false);
                  toast.success('Shift kasir berhasil ditutup, Z-Report dicetak, dan laporan WhatsApp dikirim!');
                }}
                className="w-full py-3.5 rounded-2xl text-white text-xs font-black uppercase tracking-wider shadow-lg transition-all hover:brightness-110 active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #8E0E0E 0%, #B72A0A 50%, #D94708 100%)' }}
              >
                Cetak Laporan Harian
              </button>
              <button
                onClick={() => setIsReportOpen(false)}
                className="w-full py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-2xl text-xs font-bold transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable section for thermal printer */}
      <div className="print-report-container hidden">
        <div className="header text-center">
          <h2>REKAP PENJUALAN HARIAN</h2>
          <h3>MARTABAK A6 NYUSS</h3>
          <p>Tanggal: {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
          <div className="divider">===============================</div>
        </div>
        <div className="meta">
          <p>Operator Shift: {activeShift ? activeShift.operatorName : username}</p>
          <p>Waktu Cetak: {new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB</p>
          <div className="divider">-------------------------------</div>
        </div>
        <div className="stats" style={{ fontSize: '10pt' }}>
          <p>Jam Buka Toko: <span className="float-right">{todayOpenLog ? formatLogTime(todayOpenLog.loggedAt) : '-'}</span></p>
          <p>Jam Tutup Toko: <span className="float-right">{todayCloseLog ? formatLogTime(todayCloseLog.loggedAt) : '-'}</span></p>
          <div className="divider">-------------------------------</div>
          <p>Pesanan Selesai: <span className="float-right">{completedToday.length} order</span></p>
          <p>Pesanan Batal: <span className="float-right">{cancelledToday.length} order</span></p>
          <div className="divider">-------------------------------</div>
          <p style={{ fontWeight: 'bold' }}>TOTAL OMSET: <span className="float-right">{formatRupiah(revenueToday)}</span></p>
          <p>QRIS / Digital: <span className="float-right">{formatRupiah(qrisExpected)}</span></p>
          <p>Modal Awal Laci: <span className="float-right">{formatRupiah(startingCash)}</span></p>
          <p>Omset Tunai/COD: <span className="float-right">{formatRupiah(codExpected)}</span></p>
          <p style={{ fontWeight: 'bold' }}>KAS DIHARAPKAN: <span className="float-right">{formatRupiah(expectedCashInDrawer)}</span></p>
          <div className="divider">-------------------------------</div>
          <p>Uang Laci Aktual: <span className="float-right">{cashInput ? formatRupiah(Number(cashInput.replace(/\./g, '').replace(/,/g, '.'))) : 'Tidak diisi'}</span></p>
          <p style={{ fontWeight: 'bold' }}>Selisih Uang (Drift): <span className="float-right">{formatRupiah(cashDiff)}</span></p>
        </div>
        <div className="divider">===============================</div>
        <div className="footer text-center" style={{ textAlign: 'center', marginTop: '4mm' }}>
          <p className="thanks">-- Laporan Tutup Shift Sukses --</p>
        </div>
      </div>
    </div>
    <Toaster position="top-center" toastOptions={{ duration: 2500 }} />

    {/* Store Toggle Modal */}
    {isStoreModalOpen && (
      <StoreToggleModal
        onClose={() => setIsStoreModalOpen(false)}
        username={username}
      />
    )}

    {/* Buka Shift Modal (Locks Screen if no active shift exists) */}
    {!activeShift && (
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-red-50 text-red-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Store className="w-8 h-8" />
            </div>
            <h3 className="font-black text-gray-900 text-xl uppercase tracking-tight">Mulai Shift Baru</h3>
            <p className="text-xs text-gray-500 font-medium">Buka shift kasir hari ini untuk mulai melayani transaksi</p>
          </div>

          <div className="space-y-4">
            {/* Operator Name */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-gray-700 uppercase tracking-wider">Nama Operator / Kasir</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={operatorNameInput}
                  onChange={(e) => setOperatorNameInput(e.target.value)}
                  placeholder="Nama Operator"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 text-gray-800 font-bold text-sm bg-gray-50"
                />
              </div>
            </div>

            {/* Starting Cash */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-gray-700 uppercase tracking-wider">Uang Modal Awal Laci (Petty Cash)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">Rp</span>
                <input
                  type="text"
                  value={startingCashInput}
                  onChange={(e) => setStartingCashInput(e.target.value)}
                  placeholder="Contoh: 200.000"
                  className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 text-gray-800 font-bold text-sm"
                />
              </div>
            </div>
          </div>

          <button
            onClick={async () => {
              if (!operatorNameInput.trim()) {
                toast.error('Nama operator tidak boleh kosong!');
                return;
              }
              const amt = Number(startingCashInput.replace(/\./g, '').replace(/,/g, '.'));
              if (isNaN(amt) || amt < 0) {
                toast.error('Uang modal awal harus valid!');
                return;
              }
              setIsOpeningShift(true);
              const success = await openShift(amt, operatorNameInput.trim());
              setIsOpeningShift(false);
              if (success) {
                toast.success(`Shift berhasil dibuka oleh ${operatorNameInput}!`);
              } else {
                toast.error('Gagal membuka shift. Silakan coba lagi.');
              }
            }}
            disabled={isOpeningShift}
            className="w-full py-3.5 rounded-2xl text-white text-xs font-black uppercase tracking-wider shadow-lg transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #8E0E0E 0%, #B72A0A 50%, #D94708 100%)' }}
          >
            {isOpeningShift ? 'Membuka Shift...' : 'Buka Shift Kasir'}
          </button>
          
          <button
            onClick={onLogout}
            disabled={isOpeningShift}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl text-xs font-bold transition-colors cursor-pointer mt-2"
          >
            Logout / Keluar Halaman Login
          </button>
        </div>
      </div>
    )}
    </>
  );
}

```

---

### File: `apps/admin/components/LoginPage.tsx`

```tsx
import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, ChefHat, AlertTriangle } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [startingCash, setStartingCash] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Username dan password wajib diisi.');
      return;
    }
    setIsLoading(true);

    try {
      // Parse starting cash
      const cashAmount = Number(startingCash.replace(/\./g, '').replace(/,/g, '.'));
      if (isNaN(cashAmount) || cashAmount < 0) {
        setError('Masukkan Uang Modal Awal laci yang valid.');
        setIsLoading(false);
        return;
      }

      // Simulate network latency for mock login
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Open new shift for operator locally
      const success = await useAdminStore.getState().openShift(cashAmount, username.trim());
      if (!success) {
        setError('Gagal memulai shift baru.');
        setIsLoading(false);
        return;
      }

      onLogin(username, password);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Gagal masuk. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #8E0E0E 0%, #D94708 60%, #E05009 100%)' }}
    >
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10 bg-white" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10 bg-white" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full opacity-5 bg-white" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div
            className="px-5 py-6 sm:px-8 sm:py-8 text-center"
            style={{ background: 'linear-gradient(135deg, #8E0E0E, #C83707)' }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-4 shadow-lg">
              <ChefHat className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-tight">
              A6 NYUSS
            </h1>
            <p className="text-white/80 text-sm mt-1 font-medium">Portal Operasional Kasir</p>
            <p className="text-white/60 text-xs mt-1">Martabak Terbul A6 Nyuss</p>
          </div>

          {/* Form */}
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <h2 className="text-gray-800 font-bold text-lg mb-6 text-center">Masuk ke Sistem</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: kasir_demak"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 text-gray-800 text-sm transition-colors"
                  style={{ '--tw-ring-color': '#C83707' } as React.CSSProperties}
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 text-gray-800 text-sm transition-colors"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Uang Modal Awal Laci
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">Rp</span>
                  <input
                    type="text"
                    value={startingCash}
                    onChange={(e) => setStartingCash(e.target.value)}
                    placeholder="Contoh: 100.000"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-red-500 text-gray-800 text-sm transition-colors font-bold"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  *Diisi jika membuka shift baru. Diabaikan jika shift sedang berjalan.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                  <p className="text-red-600 text-xs font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg, #9C1B0B, #D13E08)' }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    MASUK SEKARANG
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-white/60 text-xs text-center mt-6">
          © 2026 Martabak Terbul A6 Nyuss · Surabaya
        </p>
      </div>
    </div>
  );
}

```

---

### File: `apps/admin/components/OrderCard.tsx`

```tsx
import { useState, useEffect } from 'react';
import { AdminOrder, useAdminStore } from '../store/adminStore';
import { formatRupiah, timeAgo } from '../utils/format';
import { MapPin, ShoppingBag, Bell, AlertTriangle, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderCardProps {
  order: AdminOrder;
  isSelected: boolean;
  isNew: boolean;
  isKDSMode?: boolean;
  onClick: () => void;
}

const statusConfig: Record<
  AdminOrder['status'],
  { label: string; className: string }
> = {
  received: { label: 'Baru', className: 'bg-blue-100 text-blue-700 border border-blue-300' },
  processing: { label: 'Diproses', className: 'bg-orange-100 text-orange-700 border border-orange-300' },
  ready: { label: 'Siap', className: 'bg-green-100 text-green-700 border border-green-300' },
  completed: { label: 'Selesai', className: 'bg-gray-100 text-gray-600 border border-gray-300' },
  cancelled: { label: 'Dibatalkan', className: 'bg-red-100 text-red-700 border border-red-300' },
};

const paymentStatusConfig: Record<
  AdminOrder['paymentStatus'],
  { label: string; className: string }
> = {
  pending: { label: 'COD', className: 'text-gray-500' },
  waiting_verification: { label: 'Perlu Verif', className: 'text-amber-600 font-semibold' },
  paid: { label: 'Lunas', className: 'text-green-600 font-semibold' },
  failed: { label: 'Verif Gagal', className: 'text-red-600 font-semibold' },
  refunded: { label: 'Direfund', className: 'text-purple-600 font-semibold' },
};

const nextStatusMap: Record<AdminOrder['status'], AdminOrder['status'] | null> = {
  received: 'processing',
  processing: 'ready',
  ready: 'completed',
  completed: null,
  cancelled: null,
};

const actionLabels: Record<string, string> = {
  processing: 'Terima & Masak',
  ready: 'Selesai Masak',
  completed: 'Serahkan Makanan',
};

export default function OrderCard({ order, isSelected, isNew, isKDSMode: _isKDSMode = false, onClick }: OrderCardProps) {
  const isKDSMode = false; // Force POS style for all order cards
  const { updateOrderStatus, verifyPaymentStatus } = useAdminStore();
  const statusInfo = statusConfig[order.status];
  const paymentInfo = paymentStatusConfig[order.paymentStatus];
  const next = nextStatusMap[order.status];

  // Calculate order age dynamically in real-time
  const [elapsedMins, setElapsedMins] = useState(0);

  useEffect(() => {
    if (order.status === 'completed' || order.status === 'cancelled') return;

    const updateElapsed = () => {
      const ms = Date.now() - new Date(order.createdAt).getTime();
      setElapsedMins(Math.floor(ms / 60000));
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 5000); // update every 5 seconds
    return () => clearInterval(interval);
  }, [order.createdAt, order.status]);
  
  let slaWarning = '';
  let borderOverride = '';
  
  if (order.status !== 'completed' && order.status !== 'cancelled' && order.status !== 'ready') {
    if (order.status === 'received' && elapsedMins > 5) {
      slaWarning = `Konfirmasi Terlambat! (${elapsedMins} mnt)`;
      borderOverride = 'border-yellow-400 bg-yellow-50 shadow-sm';
    } else if (order.status === 'processing') {
      if (elapsedMins >= 15 && elapsedMins <= 20) {
        slaWarning = `Waktu Masak Kritis! (${elapsedMins} mnt)`;
        borderOverride = 'border-yellow-500 bg-yellow-50/70 shadow-sm';
      } else if (elapsedMins > 20) {
        slaWarning = `Penyajian Terlambat! (${elapsedMins} mnt)`;
        borderOverride = 'border-red-400 bg-red-50/50 shadow-md animate-pulse';
      }
    }
  }

  let actionLabel = next ? actionLabels[next] : null;

  // For COD orders, if status is ready (next is completed) and not paid yet, show "Tandai Lunas" button
  const isNeedCODPayment = next === 'completed' && order.paymentMethod === 'cod' && order.paymentStatus !== 'paid';
  if (isNeedCODPayment) {
    actionLabel = 'Tandai Lunas';
  }

  // Hapus tombol aksi cepat jika metode transfer dan belum lunas (memaksa admin cek bukti bayar manual)
  if (
    order.status === 'received' && 
    order.paymentMethod === 'transfer' && 
    order.paymentStatus !== 'paid'
  ) {
    actionLabel = null;
  }

  const handleDirectAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!next) return;

    if (isNeedCODPayment) {
      const isPickup = order.deliveryType === 'pickup';
      const label = isPickup ? 'Tunai' : 'Tunai COD';
      const ok = await verifyPaymentStatus(order.id, true);
      if (ok) {
        toast.success(`Pembayaran ${label} berhasil ditandai LUNAS!`);
      } else {
        toast.error('Gagal memverifikasi pembayaran.');
      }
      return;
    }
    
    const ok = await updateOrderStatus(order.id, next);
    if (ok) {
      const msgs: Record<string, string> = {
        processing: 'Pesanan diproses di wajan!',
        ready: 'Pesanan siap disajikan!',
        completed: 'Pesanan selesai diserahkan!',
      };
      toast.success(msgs[next] || 'Status diperbarui');
    } else {
      toast.error('Gagal memperbarui status');
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl cursor-pointer transition-all border-2 ${
        isKDSMode ? 'p-5' : 'p-3.5'
      } ${
        isSelected
          ? 'border-orange-500 bg-orange-50 shadow-md'
          : isNew
          ? 'border-blue-400 bg-blue-50 shadow-sm'
          : borderOverride || 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/30'
      }`}
    >
      {isNew && (
        <div className="absolute -top-1.5 -right-1.5 z-10">
          <Bell className="w-4.5 h-4.5 text-blue-500 animate-bounce" />
        </div>
      )}

      {/* SLA Alert banner inside card */}
      {slaWarning && (
        <div className={`mb-2.5 px-2 py-1 rounded font-black uppercase tracking-wider flex items-center gap-1.5 ${
          isKDSMode ? 'text-xs' : 'text-[10px]'
        } ${
          order.status === 'received' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800 animate-pulse'
        }`}>
          <AlertTriangle className="w-3.5 h-3.5" />
          {slaWarning}
        </div>
      )}

      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className={`font-mono font-bold text-gray-500 leading-none ${isKDSMode ? 'text-xs' : 'text-[10px]'}`}>{order.orderCode}</p>
          <p className={`font-black text-gray-900 mt-1 truncate ${isKDSMode ? 'text-lg' : 'text-sm'}`}>{order.customerName}</p>
        </div>
        <div className="text-right shrink-0">
          {!isKDSMode && (
            <p className="font-black text-sm text-orange-700">
              {formatRupiah(order.totalPrice)}
            </p>
          )}
          <p className="text-gray-400 text-[10px] font-medium mt-0.5">{timeAgo(order.createdAt)}</p>
        </div>
      </div>

      {/* Middle row: items list */}
      <div className={`pt-2.5 border-t border-dashed border-gray-150 ${isKDSMode ? 'space-y-2' : 'space-y-1'}`}>
        {order.items.map((item) => (
          <div key={item.id} className={`flex items-center justify-between ${isKDSMode ? 'text-sm py-1 border-b border-gray-50 last:border-0' : 'text-xs'}`}>
            <span className={`text-gray-800 ${isKDSMode ? 'font-bold text-base' : 'font-semibold'}`}>
              {item.name} {item.variant ? `(${item.variant})` : ''}
            </span>
            <span className={`${
              isKDSMode 
                ? 'text-sm font-black px-2 py-0.5 bg-orange-100 text-orange-950 rounded-md' 
                : 'text-orange-800 font-extrabold px-1.5 py-0.2 bg-orange-50 rounded text-[10px]'
            }`}>
              x{item.quantity}
            </span>
          </div>
        ))}
      </div>

      {/* Special notes */}
      {order.notes && (
        <div className={`mt-3 bg-yellow-100/70 border border-yellow-200 text-yellow-800 rounded-lg font-bold animate-pulse flex items-start gap-1.5 ${
          isKDSMode ? 'text-xs p-2.5' : 'text-[10px] p-1.5'
        }`}>
          <MessageSquare className="w-3.5 h-3.5 shrink-0 text-yellow-600 mt-0.5" />
          <span className="leading-tight">Catatan: "{order.notes}"</span>
        </div>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between gap-2 mt-3.5">
        <div className="flex items-center gap-1.5 shrink-0">
          {order.deliveryType === 'delivery' ? (
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
          ) : (
            <ShoppingBag className="w-3.5 h-3.5 text-purple-500" />
          )}
          <span className={`text-[11px] font-bold ${isKDSMode ? 'text-gray-700' : paymentInfo.className}`}>
            {isKDSMode
              ? (order.deliveryType === 'pickup' ? 'Ambil Sendiri' : 'Pesan Antar')
              : (order.deliveryType === 'pickup'
                  ? (order.paymentMethod === 'cod' ? 'Tunai' : 'QRIS')
                  : (order.paymentMethod === 'cod' ? 'Tunai COD' : 'QRIS'))}
          </span>
          {!isKDSMode && order.paymentMethod === 'transfer' && (
            <span className={`text-[11px] ${paymentInfo.className}`}>· {paymentInfo.label}</span>
          )}
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black tracking-wide uppercase ${statusInfo.className}`}>
          {statusInfo.label}
        </span>
      </div>

      {/* Direct Action Button */}
      {actionLabel && (
        <div className="mt-3.5">
          {isNeedCODPayment ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  const isPickup = order.deliveryType === 'pickup';
                  const label = isPickup ? 'Tunai' : 'Tunai COD';
                  const ok = await verifyPaymentStatus(order.id, true);
                  if (ok) {
                    toast.success(`Pembayaran ${label} berhasil ditandai LUNAS!`);
                  } else {
                    toast.error('Gagal memverifikasi pembayaran.');
                  }
                }}
                className={`py-2 rounded-lg text-white text-xs font-black tracking-wider uppercase shadow hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-1 cursor-pointer`}
                style={{ background: 'linear-gradient(135deg, #d97706, #b45309)' }}
              >
                Tandai Lunas
              </button>
              <button
                disabled
                className="py-2 rounded-lg text-white text-xs font-black tracking-wider uppercase shadow opacity-50 cursor-not-allowed flex items-center justify-center gap-1"
                style={{ background: 'linear-gradient(135deg, #6d28d9, #5b21b6)' }}
              >
                Serahkan Makanan
              </button>
            </div>
          ) : (
            <button
              onClick={handleDirectAction}
              className="w-full py-2.5 rounded-lg text-white text-xs font-black tracking-wider uppercase shadow hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              style={{
                background: order.status === 'received' 
                  ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' 
                  : order.status === 'processing' 
                  ? 'linear-gradient(135deg, #ea580c, #c2410c)' 
                  : 'linear-gradient(135deg, #16a34a, #15803d)'
              }}
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

```

---

### File: `apps/admin/components/OrderDetail.tsx`

```tsx
import { useState, useEffect } from 'react';
import { AdminOrder, useAdminStore } from '../store/adminStore';
import { formatRupiah, formatDate } from '../utils/format';
import PrintReceipt from './PrintReceipt';
import toast from 'react-hot-toast';
import {
  MapPin,
  Phone,
  ShoppingBag,
  Truck,
  CheckCircle2,
  XCircle,
  Printer,
  ChefHat,
  ExternalLink,
  X,
  Navigation,
  CreditCard,
  Banknote,
  Clock,
  CheckCheck,
  AlertTriangle,
  MessageCircle,
} from 'lucide-react';

interface OrderDetailProps {
  order: AdminOrder;
}

const statusFlow: AdminOrder['status'][] = [
  'received',
  'processing',
  'ready',
  'completed',
];

const statusLabels: Record<AdminOrder['status'], string> = {
  received: 'Diterima',
  processing: 'Diproses',
  ready: 'Siap Antar/Ambil',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

const stepLabels: Record<AdminOrder['status'], string> = {
  received: 'Baru',
  processing: 'Masak',
  ready: 'Siap',
  completed: 'Selesai',
  cancelled: 'Batal',
};

function StatusStepIndicator({ currentStatus }: { currentStatus: AdminOrder['status'] }) {
  const currentIdx = statusFlow.indexOf(currentStatus);
  if (currentStatus === 'cancelled') return null;
  return (
    <div className="flex items-center justify-between gap-1 w-full border border-gray-150 rounded-2xl p-2.5 bg-gray-50/50">
      {statusFlow.map((s, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        return (
          <div key={s} className="flex items-center gap-1 flex-1 justify-center">
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <div
                className={`w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 ${
                  done
                    ? 'bg-green-500 text-white'
                    : active
                    ? 'bg-orange-500 text-white animate-pulse ring-2 ring-orange-500/20'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {done ? '✓' : idx + 1}
              </div>
              <p className={`text-center text-[9px] sm:text-[11px] font-black tracking-tight ${active ? 'text-orange-600' : done ? 'text-green-600' : 'text-gray-400'}`}>
                {stepLabels[s]}
              </p>
            </div>
            {idx < statusFlow.length - 1 && (
              <span className="hidden sm:inline text-gray-300 font-medium text-xs">→</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OrderDetail({ order }: OrderDetailProps) {
  const { updateOrderStatus, verifyPaymentStatus } = useAdminStore();
  const [showProofPopup, setShowProofPopup] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: string; label: string; desc: string; onConfirm: () => void } | null>(null);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('Bahan baku habis');
  const [customReason, setCustomReason] = useState('');

  // Local state for KDS checklist items
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setCheckedItems({});
  }, [order.id]);

  const toggleCheckedItem = (itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleAction = async (type: string, fn: () => Promise<boolean> | void) => {
    setActionLoading(type);
    await new Promise((r) => setTimeout(r, 600));
    const result = await fn();
    setActionLoading(null);
    setConfirmAction(null);
    return result;
  };

  const nextStatus = (): AdminOrder['status'] | null => {
    const idx = statusFlow.indexOf(order.status);
    if (idx < 0 || idx >= statusFlow.length - 1) return null;
    return statusFlow[idx + 1];
  };

  const next = nextStatus();

  const handlePrint = () => {
    document.body.classList.add('printing-receipt');
    window.print();
    setTimeout(() => document.body.classList.remove('printing-receipt'), 500);
  };

  const paymentStatusBadge = () => {
    switch (order.paymentStatus) {
      case 'pending':
        const labelPending = order.deliveryType === 'pickup' ? 'Tunai' : 'COD';
        return <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600"><Clock className="w-3 h-3" />Menunggu Bayar ({labelPending})</span>;
      case 'waiting_verification':
        return <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 animate-pulse"><AlertTriangle className="w-3 h-3" />Menunggu Verifikasi</span>;
      case 'paid':
        return <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700"><CheckCircle2 className="w-3 h-3" />Lunas</span>;
      case 'failed':
        return <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700"><XCircle className="w-3 h-3" />Verifikasi Gagal</span>;
      case 'refunded':
        return <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">Direfund</span>;
      default:
        return null;
    }
  };

  const mainActionBtn = () => {
    if (!next) return null;
    const labels: Record<string, { label: string; color: string }> = {
      processing: { label: 'PROSES MASAK', color: '#C83707' },
      ready: { label: 'TANDAI SIAP', color: '#16a34a' },
      completed: { label: 'SELESAIKAN PESANAN', color: '#6d28d9' },
    };
    const btnInfo = labels[next];
    if (!btnInfo) return null;

    const isCODCompleted = next === 'completed' && order.paymentMethod === 'cod' && order.paymentStatus !== 'paid';
    const isPickup = order.deliveryType === 'pickup';
    const cashLabel = isPickup ? 'Tunai' : 'Tunai COD';
    const customDesc = isCODCompleted
      ? `PENTING: Pembayaran Tunai! Pastikan Anda telah menerima uang tunai sebesar ${formatRupiah(order.totalPrice)} (${cashLabel}) dari pelanggan sebelum menyelesaikan pesanan ini.`
      : `Ubah status pesanan ${order.orderCode} menjadi "${statusLabels[next]}"?`;

    return (
      <div className="w-full flex flex-col gap-1.5 sm:flex-1">
        <button
          onClick={() => setConfirmAction({
            type: next,
            label: btnInfo.label,
            desc: customDesc,
            onConfirm: async () => {
              const ok = await handleAction(next, () => updateOrderStatus(order.id, next));
              if (ok !== false) {
                const msgs: Record<string, string> = {
                  processing: 'Pesanan mulai diproses di dapur!',
                  ready: 'Pesanan ditandai siap antar/ambil!',
                  completed: 'Pesanan selesai!',
                };
                toast.success(msgs[next] || 'Status berhasil diperbarui');
              } else {
                toast.error('Gagal memperbarui status. Coba lagi.');
              }
            },
          })}
          disabled={!!actionLoading || isCODCompleted}
          className="w-full py-3 rounded-xl text-white font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: `linear-gradient(135deg, ${btnInfo.color}, ${btnInfo.color}dd)` }}
        >
          {actionLoading === next ? (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            btnInfo.label
          )}
        </button>
        {isCODCompleted && (
          <p className="text-[10px] text-red-500 font-bold text-center">
            *Harap tandai lunas pembayaran tunai di panel pembayaran terlebih dahulu.
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Print Receipt (hidden, only shown on print) */}
      <PrintReceipt order={order} />

      {/* Proof Popup */}
      {showProofPopup && order.paymentProofUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowProofPopup(false)}
        >
          <div
            className="relative bg-white rounded-2xl overflow-hidden shadow-2xl max-w-sm w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b shrink-0">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Bukti Pembayaran QRIS</h3>
                <p className="text-xs text-gray-500">{order.orderCode}</p>
              </div>
              <button
                onClick={() => setShowProofPopup(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 flex items-center justify-center bg-gray-50/50">
              <img
                src={order.paymentProofUrl}
                alt="Bukti Pembayaran QRIS"
                className="max-w-full max-h-[60vh] rounded-xl object-contain shadow-sm border border-gray-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/400x600?text=Gambar+Gagal+Dimuat';
                }}
              />
            </div>
            <div className="p-4 flex gap-2 border-t bg-white shrink-0">
              <button
                onClick={() => {
                  setShowProofPopup(false);
                  setConfirmAction({
                    type: 'reject',
                    label: 'Tolak QRIS',
                    desc: `Tolak bukti pembayaran QRIS dari ${order.customerName}? Status akan menjadi "Verifikasi Gagal".`,
                    onConfirm: async () => {
                      const ok = await handleAction('reject', () => verifyPaymentStatus(order.id, false));
                      if (ok !== false) toast.success('Pembayaran QRIS ditolak. Status pembayaran: Verifikasi Gagal.');
                      else toast.error('Gagal memperbarui status. Coba lagi.');
                    },
                  });
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold border-2 border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                Tolak
              </button>
              <button
                onClick={() => {
                  setShowProofPopup(false);
                  setConfirmAction({
                    type: 'verify',
                    label: 'Verifikasi Lunas',
                    desc: `Konfirmasi pembayaran dari ${order.customerName} sudah diterima?`,
                    onConfirm: async () => {
                      const ok = await handleAction('verify', () => verifyPaymentStatus(order.id, true));
                      if (ok !== false) toast.success('Pembayaran terverifikasi lunas!');
                      else toast.error('Gagal verifikasi. Coba lagi.');
                    },
                  });
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
              >
                Verifikasi Lunas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-xs w-full">
            <h3 className="font-black text-gray-900 text-base mb-2">{confirmAction.label}</h3>
            <p className="text-gray-600 text-sm mb-6">{confirmAction.desc}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                disabled={!!actionLoading}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                Batal
              </button>
              <button
                onClick={confirmAction.onConfirm}
                disabled={!!actionLoading}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #9C1B0B, #D13E08)' }}
              >
                {actionLoading ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mx-auto" />
                ) : (
                  'Konfirmasi'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Detail Panel */}
      <div className="flex flex-col h-full overflow-y-auto bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {order.orderCode}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    order.deliveryType === 'delivery'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {order.deliveryType === 'delivery' ? (
                    <><Truck className="w-3 h-3" /> Delivery</>
                  ) : (
                    <><ShoppingBag className="w-3 h-3" /> Pickup</>
                  )}
                </span>
              </div>
              <h2 className="font-black text-xl text-gray-900">{order.customerName}</h2>
              {(() => {
                const cleanPhone = order.customerPhone.replace(/\D/g, '');
                const waPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
                
                let waMessageText = `Halo Kak ${order.customerName}, kami dari Martabak A6 Nyuss. Ada yang bisa kami bantu mengenai pesanan Kakak (${order.orderCode})?`;
                if (order.status === 'received') {
                  waMessageText = `Halo Kak ${order.customerName}, kami dari Martabak A6 Nyuss. Pesanan Kakak dengan kode ${order.orderCode} telah kami terima dan sedang diproses. Terima kasih!`;
                } else if (order.status === 'processing') {
                  waMessageText = `Halo Kak ${order.customerName}, kami dari Martabak A6 Nyuss. Pesanan Kakak (${order.orderCode}) saat ini sedang dimasak di dapur. Kami akan kabari begitu siap!`;
                } else if (order.status === 'ready') {
                  waMessageText = `Halo Kak ${order.customerName}, kami dari Martabak A6 Nyuss. Pesanan Kakak (${order.orderCode}) sudah siap dan siap ${order.deliveryType === 'delivery' ? 'diantar oleh kurir' : 'diambil di gerai'}. Terima kasih!`;
                }
                const waText = encodeURIComponent(waMessageText);

                return (
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 shrink-0">
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-[11px] font-bold transition-colors"
                    >
                      <Phone className="w-3 h-3 text-gray-500" />
                      {order.customerPhone}
                    </a>
                    <a
                      href={`https://wa.me/${waPhone}?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1 rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 text-[11px] font-bold transition-colors"
                    >
                      <MessageCircle className="w-3 h-3 text-green-600" />
                      WhatsApp
                    </a>
                  </div>
                );
              })()}
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
              <p className="text-2xl font-black mt-1" style={{ color: '#8E0E0E' }}>
                {formatRupiah(order.totalPrice)}
              </p>
            </div>
          </div>

          {/* Status Stepper */}
          {order.status !== 'cancelled' && (
            <div className="mt-2">
              <StatusStepIndicator currentStatus={order.status} />
            </div>
          )}
          {order.status === 'cancelled' && (
            <div className="mt-2.5 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700 text-xs font-bold">Pesanan Dibatalkan</p>
                <p className="text-red-800 text-sm italic mt-0.5">
                  Alasan: "{order.cancellationReason || 'Tidak ditentukan'}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Items Section (Enlarged KDS-style list with checklist checkboxes) */}
        <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm shrink-0">
          <div className="px-4 py-3 border-b border-gray-100" style={{ background: 'linear-gradient(90deg, #8E0E0E0A, transparent)' }}>
            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-base">
              <ChefHat className="text-[#C83707] w-5 h-5" />
              Rincian Pesanan ({order.items.reduce((s, i) => s + i.quantity, 0)} item)
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {order.items.map((item, idx) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <div key={item.id} className={`px-4 py-3 transition-colors ${isChecked ? 'bg-gray-50/70' : 'bg-white'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCheckedItem(item.id)}
                        className="w-6 h-6 rounded border-2 border-gray-300 text-orange-600 focus:ring-orange-500 cursor-pointer mr-2 shrink-0"
                      />
                      <span
                        className="flex items-center justify-center rounded-full font-black text-white shrink-0 w-8 h-8 text-sm"
                        style={{ background: isChecked ? '#9ca3af' : '#C83707' }}
                      >
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-gray-800 ${
                          isChecked ? 'line-through text-gray-400 text-base font-bold' : 'text-lg font-black text-gray-900'
                        }`}>
                          {item.name}
                          <span className="ml-2 font-black text-base px-2 py-0.5 bg-orange-100 text-orange-950 rounded-md">
                            x{item.quantity}
                          </span>
                        </p>
                        {item.variant && (
                          <p className="text-gray-500 mt-0.5 text-sm font-bold">
                            Variant: {item.variant}
                            {item.topping ? ` · Topping: ${item.topping}` : ''}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="font-bold text-sm text-gray-800 shrink-0">
                      {formatRupiah(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {order.notes && (
            <div className="px-4 py-3 bg-amber-100/50 border-t border-amber-100 p-5">
              <p className="font-bold text-amber-700 mb-1 text-sm">Catatan Khusus:</p>
              <p className="italic text-lg font-black text-amber-950 leading-relaxed">"{order.notes}"</p>
            </div>
          )}
        </div>

        {/* Payment Section */}
        <div className="mx-4 mt-3 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm shrink-0">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                {order.paymentMethod === 'transfer' ? (
                  <CreditCard className="w-4 h-4 text-blue-600" />
                ) : (
                  <Banknote className="w-4 h-4 text-green-600" />
                )}
                Pembayaran
              </h3>
            </div>
            <div className="p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">Metode</span>
                <span className="font-bold text-sm text-gray-900">
                  {order.deliveryType === 'pickup'
                    ? (order.paymentMethod === 'cod' ? 'Tunai' : 'QRIS')
                    : (order.paymentMethod === 'cod' ? 'Tunai COD' : 'QRIS')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">Status</span>
                {paymentStatusBadge()}
              </div>
              {order.paymentMethod === 'cod' && order.paymentStatus !== 'paid' && (
                <button
                  onClick={async () => {
                    const isPickup = order.deliveryType === 'pickup';
                    const label = isPickup ? 'Tunai' : 'Tunai COD';
                    const ok = await verifyPaymentStatus(order.id, true);
                    if (ok) {
                      toast.success(`Pembayaran ${label} berhasil ditandai LUNAS!`);
                    } else {
                      toast.error('Gagal memverifikasi pembayaran.');
                    }
                  }}
                  className="w-full mt-2 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
                >
                  Tandai Lunas (Uang Diterima)
                </button>
              )}

              {/* Price Breakdown */}
              <div className="border-t border-dashed border-gray-200 pt-2.5 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatRupiah(order.subtotal)}</span>
                </div>
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Ongkir {order.deliveryDistance ? `(${order.deliveryDistance} Km)` : ''}
                    </span>
                    <span className="font-medium">{formatRupiah(order.deliveryFee)}</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">
                      Diskon{order.couponCode ? ` (${order.couponCode})` : ''}
                    </span>
                    <span className="font-medium text-green-600">-{formatRupiah(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1.5 border-t border-gray-100">
                  <span className="font-black text-gray-900">TOTAL</span>
                  <span className="font-black text-lg" style={{ color: '#8E0E0E' }}>
                    {formatRupiah(order.totalPrice)}
                  </span>
                </div>
              </div>

              {/* Proof Button */}
              {order.paymentMethod === 'transfer' && order.paymentProofUrl && (
                <button
                  onClick={() => setShowProofPopup(true)}
                  className="w-full mt-1 py-2.5 rounded-xl text-sm font-bold border-2 border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Lihat Gambar Bukti QRIS
                </button>
              )}
              {order.paymentMethod === 'transfer' && !order.paymentProofUrl && (
                <div className="mt-1.5 p-3 bg-amber-50 border border-dashed border-amber-200 rounded-xl text-center">
                  <p className="text-xs text-amber-700 font-semibold flex items-center justify-center gap-1.5 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                    Bukti pembayaran QRIS belum diunggah oleh pelanggan
                  </p>
                </div>
              )}
            </div>
          </div>

        {/* Delivery Section */}
        {order.deliveryType === 'delivery' && order.deliveryAddress && (
          <div className="mx-4 mt-3 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm shrink-0">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-600" />
                Info Pengiriman
              </h3>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-800 font-medium flex-1">{order.deliveryAddress}</p>
              </div>
              <div className="flex items-center justify-between bg-blue-50 rounded-xl px-3 py-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800">
                    {order.deliveryDistance} Km · {formatRupiah(order.deliveryFee)}
                  </span>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  Lihat Peta
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mx-4 mt-3 mb-4 space-y-2 shrink-0">
          {/* Verification buttons (only for transfer waiting) */}
          {order.paymentMethod === 'transfer' && order.paymentStatus === 'waiting_verification' && (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setConfirmAction({
                  type: 'reject',
                  label: 'Tolak QRIS',
                  desc: `Tolak bukti pembayaran QRIS dari ${order.customerName}? Status bayar akan menjadi "Verifikasi Gagal".`,
                  onConfirm: async () => {
                    const ok = await handleAction('reject', () => verifyPaymentStatus(order.id, false));
                    if (ok !== false) toast.success('Pembayaran QRIS ditolak.');
                    else toast.error('Gagal. Coba lagi.');
                  },
                })}
                disabled={!!actionLoading}
                className="w-full sm:flex-1 py-3 rounded-xl text-sm font-bold border-2 border-red-300 text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {actionLoading === 'reject' ? (
                  <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                ) : (
                  <><XCircle className="w-4 h-4" /> Tolak QRIS</>
                )}
              </button>
              <button
                onClick={() => setConfirmAction({
                  type: 'verify',
                  label: 'Verifikasi Lunas',
                  desc: `Konfirmasi pembayaran dari ${order.customerName} sudah diterima dan valid?`,
                  onConfirm: async () => {
                    const ok = await handleAction('verify', () => verifyPaymentStatus(order.id, true));
                    if (ok !== false) toast.success('Pembayaran terverifikasi lunas!');
                    else toast.error('Gagal verifikasi. Coba lagi.');
                  },
                })}
                disabled={!!actionLoading}
                className="w-full sm:flex-1 py-3 rounded-xl text-sm font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
              >
                {actionLoading === 'verify' ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <><CheckCircle2 className="w-4 h-4" /> Verifikasi Lunas</>
                )}
              </button>
            </div>
          )}

          {/* Failed payment retry */}
          {order.paymentStatus === 'failed' && (
            <button
              onClick={() => setConfirmAction({
                type: 'verify',
                label: 'Verifikasi Lunas',
                desc: `Override status: konfirmasi pembayaran dari ${order.customerName} sudah diterima?`,
                onConfirm: async () => {
                  const ok = await handleAction('verify', () => verifyPaymentStatus(order.id, true));
                  if (ok !== false) toast.success('Pembayaran terverifikasi lunas!');
                  else toast.error('Gagal verifikasi. Coba lagi.');
                },
              })}
              disabled={!!actionLoading}
              className="w-full py-3 rounded-xl text-sm font-bold border-2 border-green-300 text-green-700 hover:bg-green-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <CheckCheck className="w-4 h-4" /> Override: Tandai Lunas
            </button>
          )}

          {/* Print + Main Action row */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-4 py-3 rounded-xl text-sm font-bold border-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Cetak Struk
            </button>
            {mainActionBtn()}
          </div>

          {/* Cancel button */}
          {order.status !== 'completed' && order.status !== 'cancelled' && (
            <button
              onClick={() => {
                setCancellationReason('Bahan baku habis');
                setCustomReason('');
                setShowCancelPopup(true);
              }}
              disabled={!!actionLoading}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all disabled:opacity-60"
            >
              Batalkan Pesanan
            </button>
          )}
        </div>
      </div>

      {/* Cancellation Reason Dialog */}
      {showCancelPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-red-600">
              <XCircle className="w-5 h-5" />
              <h3 className="font-black text-base">Batalkan Pesanan</h3>
            </div>
            <p className="text-gray-600 text-xs font-medium mb-4">
              Konfirmasi pembatalan pesanan <strong>{order.orderCode}</strong>. Harap tentukan alasannya:
            </p>

            {/* Reason list */}
            <div className="space-y-2 mb-5">
              {[
                'Bahan baku habis',
                'Telur bebek habis',
                'Alamat pengiriman di luar radius',
                'Permintaan pelanggan',
                'Toko tutup mendadak',
                'Lainnya',
              ].map((reason) => (
                <label key={reason} className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="cancel_reason"
                    checked={cancellationReason === reason}
                    onChange={() => setCancellationReason(reason)}
                    className="accent-red-600 w-4 h-4 shrink-0"
                  />
                  <span className="text-gray-800 text-xs font-semibold">{reason}</span>
                </label>
              ))}

              {cancellationReason === 'Lainnya' && (
                <input
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Ketik alasan pembatalan..."
                  className="w-full mt-1.5 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 text-gray-800 font-semibold"
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelPopup(false)}
                disabled={!!actionLoading}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  const finalReason = cancellationReason === 'Lainnya' ? customReason.trim() : cancellationReason;
                  if (!finalReason) return;
                  setActionLoading('cancel');
                  const ok = await updateOrderStatus(order.id, 'cancelled', finalReason);
                  setActionLoading(null);
                  setShowCancelPopup(false);
                  if (ok) toast.success(`Pesanan ${order.orderCode} telah dibatalkan.`);
                  else toast.error('Gagal membatalkan pesanan. Coba lagi.');
                }}
                disabled={!!actionLoading || (cancellationReason === 'Lainnya' && !customReason.trim())}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all disabled:opacity-60 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #DC2626, #B91C1C)' }}
              >
                {actionLoading === 'cancel' ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  'Batalkan Order'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

```

---

### File: `apps/admin/components/OrderQueue.tsx`

```tsx
import { useState } from 'react';
import { AdminOrder, useAdminStore } from '../store/adminStore';
import OrderCard from './OrderCard';
import { Search, ClipboardList } from 'lucide-react';

type TabStatus = 'received' | 'processing' | 'ready' | 'completed' | 'cancelled';

const TABS: { key: TabStatus; label: string; color: string }[] = [
  { key: 'received', label: 'Baru', color: 'blue' },
  { key: 'processing', label: 'Diproses', color: 'orange' },
  { key: 'ready', label: 'Siap', color: 'green' },
  { key: 'completed', label: 'Selesai', color: 'gray' },
  { key: 'cancelled', label: 'Batal', color: 'red' },
];

const tabActiveStyle: Record<string, string> = {
  blue: 'bg-blue-600 text-white border-blue-600',
  orange: 'bg-orange-500 text-white border-orange-500',
  green: 'bg-green-600 text-white border-green-600',
  gray: 'bg-gray-500 text-white border-gray-500',
  red: 'bg-red-600 text-white border-red-600',
};

const badgeStyle: Record<string, string> = {
  blue: 'bg-white text-blue-700',
  orange: 'bg-white text-orange-700',
  green: 'bg-white text-green-700',
  gray: 'bg-white text-gray-700',
  red: 'bg-white text-red-700',
};

interface OrderQueueProps {
  onOrderSelect?: () => void;
}

export default function OrderQueue({ onOrderSelect }: OrderQueueProps) {
  const { orders, selectedOrderId, selectOrder, newOrderIds, dismissNewOrder } = useAdminStore();
  const [activeTab, setActiveTab] = useState<TabStatus>('received');
  const [searchQuery, setSearchQuery] = useState('');

  // Hanya tampilkan order hari ini
  const todayStr = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === todayStr);

  const filtered = todayOrders.filter((o) => {
    const matchTab = o.status === activeTab;
    const matchSearch =
      searchQuery === '' ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  const countByStatus = (status: TabStatus) =>
    todayOrders.filter((o) => o.status === status).length;

  const handleSelectOrder = (order: AdminOrder) => {
    selectOrder(order.id);
    if (newOrderIds.includes(order.id)) {
      dismissNewOrder(order.id);
    }
    onOrderSelect?.();
  };

  const activeCount = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header & Search Bar (Merged Side-by-Side) */}
      <div 
        className="px-3 py-2.5 border-b border-gray-200 bg-white flex items-center justify-between gap-3 shrink-0"
        style={{ background: 'linear-gradient(90deg, #8E0E0E0A, transparent)' }}
      >
        <div className="flex items-center gap-1.5 shrink-0">
          <h2 className="font-black text-sm text-gray-800">Antrean</h2>
          <span className="text-xs text-gray-555 font-bold bg-gray-100 px-2 py-0.5 rounded-full">
            {activeCount}
          </span>
        </div>
        
        <div className="relative flex-1 max-w-[220px] sm:max-w-none">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pesanan..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 bg-gray-50/50"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-200 overflow-x-auto shrink-0">
        {TABS.map((tab) => {
          const count = countByStatus(tab.key);
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex-1 justify-center ${
                isActive
                  ? `${tabActiveStyle[tab.color]} border-current`
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-xs font-black ${
                    isActive ? badgeStyle[tab.color] : 'bg-gray-200 text-gray-700'
                  } ${
                    tab.key === 'received' && count > 0 && !isActive
                      ? '!bg-red-500 !text-white animate-bounce'
                      : ''
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Order List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <ClipboardList className="w-10 h-10 text-gray-300 mb-2" />
            <p className="text-sm font-medium">Tidak ada pesanan</p>
            <p className="text-xs">di antrean ini</p>
          </div>
        ) : (
          filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isSelected={selectedOrderId === order.id}
              isNew={newOrderIds.includes(order.id)}
              onClick={() => handleSelectOrder(order)}
            />
          ))
        )}
      </div>
    </div>
  );
}

```

---

### File: `apps/admin/components/PrintReceipt.tsx`

```tsx
import { Fragment } from 'react';
import { AdminOrder } from '../store/adminStore';
import { formatRupiah, formatDate } from '../utils/format';

interface PrintReceiptProps {
  order: AdminOrder;
}

export default function PrintReceipt({ order }: PrintReceiptProps) {
  const paymentLabel =
    order.deliveryType === 'pickup'
      ? (order.paymentMethod === 'cod'
        ? 'TUNAI'
        : `QRIS${order.paymentStatus === 'paid' ? ' - LUNAS' : ' - MENUNGGU VERIFIKASI'}`)
      : (order.paymentMethod === 'cod'
        ? 'TUNAI COD'
        : `QRIS${order.paymentStatus === 'paid' ? ' - LUNAS' : ' - MENUNGGU VERIFIKASI'}`);

  return (
    <div className="print-receipt-container hidden">
      <div className="header">
        <h2>MARTABAK A6 NYUSS</h2>
        <p>Jl. Demak No.253, Krembangan, Surabaya</p>
        <p>WA: 0878-1112-3482</p>
        <div className="divider">===============================</div>
      </div>
      <div className="meta">
        <p>
          KODE: <strong>{order.orderCode}</strong>
        </p>
        <p>Tanggal: {formatDate(order.createdAt)}</p>
        <p>
          Pemesan: {order.customerName} ({order.customerPhone})
        </p>
        <p>
          Layanan:{' '}
          {order.deliveryType === 'delivery'
            ? 'DELIVERY (Pesan Antar)'
            : 'PICKUP (Ambil Sendiri)'}
        </p>
        {order.deliveryAddress && <p>Alamat: {order.deliveryAddress}</p>}
        <div className="divider">-------------------------------</div>
      </div>
      <table className="items-table" style={{ width: '100%' }}>
        <tbody>
          {order.items.map((item) => (
            <Fragment key={item.id}>
              <tr>
                <td colSpan={2}>
                  {item.quantity}x {item.name}
                </td>
                <td className="text-right">{formatRupiah(item.price * item.quantity)}</td>
              </tr>
              {(item.variant || item.topping) && (
                <tr className="variants">
                  <td colSpan={3}>
                    *{item.variant ? ` Variant: ${item.variant}` : ''}
                    {item.topping ? `, Topping: ${item.topping}` : ''}
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
      <div className="divider">-------------------------------</div>
      <div className="totals">
        <p>
          Subtotal: <span className="float-right">{formatRupiah(order.subtotal)}</span>
        </p>
        {order.deliveryFee > 0 && (
          <p>
            Ongkir ({order.deliveryDistance} Km):{' '}
            <span className="float-right">{formatRupiah(order.deliveryFee)}</span>
          </p>
        )}
        {order.discount > 0 && (
          <p>
            Diskon{order.couponCode ? ` (Kupon: ${order.couponCode})` : ''}:{' '}
            <span className="float-right">-{formatRupiah(order.discount)}</span>
          </p>
        )}
        <p className="grand-total">
          TOTAL: <span className="float-right">{formatRupiah(order.totalPrice)}</span>
        </p>
      </div>
      <div className="divider">===============================</div>
      <div className="footer">
        <p>Pembayaran: {paymentLabel}</p>
        {order.notes && <p>Catatan: {order.notes}</p>}
        <p className="thanks">-- Terima kasih &amp; Selamat Menikmati! --</p>
      </div>
    </div>
  );
}

```

---

### File: `apps/admin/components/StoreToggleModal.tsx`

```tsx
import { useEffect, useState, useCallback } from 'react';
import { X, Store, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import toast from 'react-hot-toast';

interface StoreToggleModalProps {
  onClose: () => void;
  username: string;
}

// Helper: format Date → 'YYYY-MM-DD' (local)
function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Helper: format WIB time string from Date
function toWIBTimeStr(d: Date): string {
  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  });
}

// Helper: format date for display 'Senin, 3 Juni 2026'
function formatDateDisplay(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export default function StoreToggleModal({ onClose, username }: StoreToggleModalProps) {
  const { isStoreOpen, toggleStoreWithLog } = useAdminStore();

  const today = new Date();
  const todayStr = toLocalDateStr(today);

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedAction, setSelectedAction] = useState<'open' | 'closed'>(
    isStoreOpen ? 'open' : 'closed'
  );
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth()); // 0-indexed
  const [liveTime, setLiveTime] = useState<string>(toWIBTimeStr(new Date()));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live clock — update every second
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTime(toWIBTimeStr(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Build calendar grid for current calendarYear/calendarMonth
  const buildCalendar = useCallback(() => {
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const cells: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return cells;
  }, [calendarYear, calendarMonth]);

  const calendarCells = buildCalendar();

  const isPastDate = (day: number) => {
    const cellStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return cellStr < todayStr;
  };

  const isSelectedDay = (day: number) => {
    const cellStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return cellStr === selectedDate;
  };

  const isTodayDay = (day: number) => {
    const cellStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return cellStr === todayStr;
  };

  const handleDayClick = (day: number) => {
    if (isPastDate(day)) return;
    const cellStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(cellStr);
  };

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  // Disable prev month nav if we're already in the current month
  const isPrevMonthDisabled =
    calendarYear === today.getFullYear() && calendarMonth === today.getMonth();

  const handleConfirm = async () => {
    setIsSubmitting(true);
    const success = await toggleStoreWithLog(selectedAction, selectedDate, username);
    setIsSubmitting(false);

    if (success) {
      const label = selectedAction === 'open' ? 'BUKA' : 'TUTUP';
      toast.success(
        `✅ Toko berhasil di-${label} untuk ${formatDateDisplay(selectedDate)} — ${liveTime} WIB`,
        { duration: 4000 }
      );
      onClose();
    } else {
      toast.error('Gagal menyimpan status toko. Coba lagi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden"
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between shrink-0"
          style={{ background: 'linear-gradient(135deg, #8E0E0E 0%, #D94708 100%)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Store className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-black text-white text-sm tracking-wide uppercase">Buka / Tutup Toko</h3>
              <p className="text-white/70 text-[10px] font-medium">Konfirmasi shift & status gerai</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">

          {/* Live Clock */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #FFF7ED, #FEF3C7)' }}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-black text-gray-700 uppercase tracking-wider">Jam WIB Saat Ini</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="font-mono font-black text-lg text-orange-600 tabular-nums"
                style={{ minWidth: '80px', textAlign: 'right' }}
              >
                {liveTime}
              </span>
              <span className="text-[10px] font-black text-orange-400 uppercase">WIB</span>
            </div>
          </div>

          {/* Date Picker — Calendar */}
          <div className="rounded-2xl border-2 border-gray-100 overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
              <button
                onClick={prevMonth}
                disabled={isPrevMonthDisabled}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black transition-colors ${
                  isPrevMonthDisabled
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                ‹
              </button>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-xs font-black text-gray-800 uppercase tracking-wider">
                  {MONTHS[calendarMonth]} {calendarYear}
                </span>
              </div>
              <button
                onClick={nextMonth}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black text-gray-600 hover:bg-gray-200 transition-colors"
              >
                ›
              </button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 px-2 pt-2">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-wider py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 px-2 pb-2 gap-y-1">
              {calendarCells.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />;
                const past = isPastDate(day);
                const selected = isSelectedDay(day);
                const todayMark = isTodayDay(day);
                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    disabled={past}
                    className={`
                      relative mx-auto w-8 h-8 rounded-xl text-xs font-black flex items-center justify-center transition-all
                      ${past
                        ? 'text-gray-300 cursor-not-allowed'
                        : selected
                        ? 'text-white shadow-md scale-105'
                        : todayMark
                        ? 'text-orange-600 border-2 border-orange-400 hover:bg-orange-50'
                        : 'text-gray-700 hover:bg-orange-50'
                      }
                    `}
                    style={
                      selected
                        ? { background: 'linear-gradient(135deg, #8E0E0E, #D94708)' }
                        : {}
                    }
                  >
                    {day}
                    {todayMark && !selected && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected date label */}
            <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-[11px] font-black text-gray-700 uppercase tracking-wider">
                Tanggal dipilih: <span className="text-orange-600">{formatDateDisplay(selectedDate)}</span>
              </p>
            </div>
          </div>

          {/* Toggle Open / Close */}
          <div className="rounded-2xl border-2 border-gray-100 p-4 space-y-3">
            <p className="text-[11px] font-black text-gray-500 uppercase tracking-wider">Status Toko</p>
            <div className="flex gap-3">
              {/* Buka */}
              <button
                onClick={() => setSelectedAction('open')}
                className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-wider transition-all ${
                  selectedAction === 'open'
                    ? 'border-green-500 bg-green-50 text-green-700 shadow-md shadow-green-100 scale-[1.02]'
                    : 'border-gray-200 text-gray-400 hover:border-green-300 hover:bg-green-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedAction === 'open' ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Store className="w-5 h-5" />
                </div>
                <span>BUKA</span>
                {selectedAction === 'open' && (
                  <CheckCircle className="w-4 h-4 text-green-500 absolute" />
                )}
              </button>

              {/* Tutup */}
              <button
                onClick={() => setSelectedAction('closed')}
                className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-wider transition-all ${
                  selectedAction === 'closed'
                    ? 'border-red-500 bg-red-50 text-red-700 shadow-md shadow-red-100 scale-[1.02]'
                    : 'border-gray-200 text-gray-400 hover:border-red-300 hover:bg-red-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  selectedAction === 'closed' ? 'bg-red-500 text-white shadow-lg shadow-red-200' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Store className="w-5 h-5" />
                </div>
                <span>TUTUP</span>
              </button>
            </div>
          </div>

          {/* Summary Info Box */}
          <div
            className="p-3.5 rounded-2xl space-y-1.5"
            style={{
              background:
                selectedAction === 'open'
                  ? 'linear-gradient(135deg, #F0FDF4, #DCFCE7)'
                  : 'linear-gradient(135deg, #FFF1F2, #FFE4E6)',
              border: `2px solid ${selectedAction === 'open' ? '#86EFAC' : '#FECDD3'}`,
            }}
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Ringkasan Konfirmasi</p>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Operator</span>
                <span className="font-black text-gray-800">{username}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Tanggal</span>
                <span className="font-black text-gray-800">{formatDateDisplay(selectedDate)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Jam Konfirmasi</span>
                <span className="font-mono font-black text-gray-800">{liveTime} WIB</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Status Dipilih</span>
                <span
                  className={`font-black text-sm ${
                    selectedAction === 'open' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {selectedAction === 'open' ? '🟢 BUKA' : '🔴 TUTUP'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-100 flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-none px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl text-xs font-black uppercase tracking-wider transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`flex-1 py-3 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg ${
              isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:brightness-110 active:scale-[0.98]'
            } ${
              selectedAction === 'open'
                ? 'shadow-green-200'
                : 'shadow-red-200'
            }`}
            style={{
              background:
                selectedAction === 'open'
                  ? 'linear-gradient(135deg, #16A34A, #15803D)'
                  : 'linear-gradient(135deg, #DC2626, #B91C1C)',
            }}
          >
            {isSubmitting
              ? 'Menyimpan...'
              : selectedAction === 'open'
              ? '✅ Konfirmasi BUKA Toko'
              : '🔒 Konfirmasi TUTUP Toko'}
          </button>
        </div>
      </div>
    </div>
  );
}

```

---

### File: `apps/admin/data/delivery_rules.md`

```markdown
# ATURAN PENGIRIMAN & ONGKIR MARTABAK A6 NYUSS

*   **Jangkauan Maksimal**: Jarak pengiriman maksimal dari outlet Jl. Demak 253 Surabaya adalah **10 km**. Di luar jarak 10 km, pesanan delivery tidak tersedia secara otomatis.
*   **Metode Perhitungan**: Ongkos kirim dihitung otomatis secara instan berdasarkan koordinat lokasi yang ditandai oleh pengguna pada peta interaktif Leaflet di halaman checkout.
*   **Zona Pengiriman & Tarif**:
    1.  **Zona 1 (0 - 3 km)**: Biaya Ongkir Flat **Rp 8.000**.
    2.  **Zona 2 (3 - 6 km)**: Biaya Ongkir Flat **Rp 13.000**.
    3.  **Zona 3 (6 - 10 km)**: Biaya Ongkir Flat **Rp 18.000**.
*   **Keakuratan Lokasi**: Jika geocoding pencarian alamat tidak mendeteksi lokasi detail seperti nomor blok atau RT/RW, pengguna dapat langsung mengklik/ketuk titik lokasi mereka di peta, dan pin peta akan menyesuaikan posisinya.
*   **Ubah Alamat**: Kolom alamat input dan titik peta terhubung dua arah. Mengetik alamat jalan utama akan menggerakkan peta ke jalan tersebut, dan mengklik peta akan memperbarui teks alamat di input form.

```

---

### File: `apps/admin/data/menu.ts`

```typescript
export type MenuCategory = 'martabak-telur-ayam' | 'martabak-telur-bebek' | 'terang-bulan' | 'paket-bundling' | 'minuman';

export interface MenuVariant {
  id: string;
  name: string;
  priceModifier: number;
}

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  category: MenuCategory;
  categoryLabel: string;
  price: number;
  image: string;
  badge?: 'terlaris' | 'baru' | 'habis';
  description: string;
  variants?: {
    label: string;
    required: boolean;
    options: MenuVariant[];
  }[];
  relatedSlugs?: string[];
}

export const categories: { id: MenuCategory; label: string; icon: string }[] = [
  { id: 'martabak-telur-ayam', label: 'Martabak Telur Ayam', icon: '🥚' },
  { id: 'martabak-telur-bebek', label: 'Martabak Telur Bebek', icon: '🦆' },
  { id: 'terang-bulan', label: 'Terang Bulan', icon: '🌙' },
  // { id: 'paket-bundling', label: 'Paket Bundling', icon: '📦' },
  // { id: 'minuman', label: 'Minuman', icon: '🥤' },
];

export const toppingOptions: MenuVariant[] = [
  { id: 'kacang', name: 'Kacang', priceModifier: 0 },
  { id: 'meses', name: 'Meses', priceModifier: 0 },
  { id: 'keju', name: 'Keju', priceModifier: 0 },
  { id: 'pisang', name: 'Pisang', priceModifier: 0 },
  { id: 'melon', name: 'Melon', priceModifier: 0 },
  { id: 'strawberry', name: 'Strawberry', priceModifier: 0 },
  { id: 'selai-coklat', name: 'Selai Coklat', priceModifier: 0 },
  { id: 'nanas', name: 'Nanas', priceModifier: 0 },
  { id: 'vanilla', name: 'Vanilla', priceModifier: 0 },
  { id: 'blueberry', name: 'Blueberry', priceModifier: 0 },
  { id: 'tiramisu', name: 'Tiramisu', priceModifier: 0 },
  { id: 'green-tea', name: 'Green Tea', priceModifier: 0 },
  { id: 'kismis', name: 'Kismis', priceModifier: 0 },
];

export const extraToppingOptions: MenuVariant[] = [
  { id: 'none', name: 'Tanpa Tambahan', priceModifier: 0 },
  { id: 'extra-kacang', name: 'Extra Kacang (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-meses', name: 'Extra Meses (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-keju', name: 'Extra Keju (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-pisang', name: 'Extra Pisang (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-melon', name: 'Extra Melon (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-strawberry', name: 'Extra Strawberry (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-selai-coklat', name: 'Extra Selai Coklat (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-nanas', name: 'Extra Nanas (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-vanilla', name: 'Extra Vanilla (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-blueberry', name: 'Extra Blueberry (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-tiramisu', name: 'Extra Tiramisu (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-green-tea', name: 'Extra Green Tea (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-kismis', name: 'Extra Kismis (+Rp 5.000)', priceModifier: 5000 },
];
export const menuItems: MenuItem[] = [
  // ===== MARTABAK TELUR AYAM =====
  {
    id: 'mta-2-20',
    slug: 'martabak-telur-ayam-1-telur-20k',
    name: 'Martabak Telur Ayam - 1 Telur (Rp 20.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak gurih dengan isian daging ayam cincang dan 1 butir telur ayam.',
    relatedSlugs: ['martabak-telur-ayam-2-telur-25k', 'martabak-telur-bebek-2-telur-20k'],
  },
  {
    id: 'mta-2-25',
    slug: 'martabak-telur-ayam-2-telur-25k',
    name: 'Martabak Telur Ayam - 2 Telur (Rp 25.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    badge: 'terlaris',
    description: 'Martabak telur ayam dengan isian daging ayam lebih tebal and 2 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-1-telur-20k', 'martabak-telur-ayam-2-telur-30k'],
  },
  {
    id: 'mta-2-30',
    slug: 'martabak-telur-ayam-2-telur-30k',
    name: 'Martabak Telur Ayam - 2 Telur (Rp 30.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak telur ayam dengan porsi ekstra daging ayam cincang melimpah dan 2 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-2-telur-25k', 'martabak-telur-ayam-3-telur-35k'],
  },
  {
    id: 'mta-2-35',
    slug: 'martabak-telur-ayam-3-telur-35k',
    name: 'Martabak Telur Ayam - 3 Telur (Rp 35.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    badge: 'baru',
    description: 'Martabak telur ayam porsi maksimal dengan daging premium bumbu khas dan 3 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-2-telur-30k', 'martabak-telur-bebek-2-telur-50k'],
  },
  {
    id: 'mta-3-40',
    slug: 'martabak-telur-ayam-3-telur-40k',
    name: 'Martabak Telur Ayam - 3 Telur (Rp 40.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak gurih dengan isian daging ayam cincang dan 3 butir telur ayam.',
    relatedSlugs: ['martabak-telur-ayam-4-telur-45k', 'martabak-telur-bebek-3-telur-60k'],
  },
  {
    id: 'mta-3-45',
    slug: 'martabak-telur-ayam-4-telur-45k',
    name: 'Martabak Telur Ayam - 4 Telur (Rp 45.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak telur ayam dengan isian daging ayam lebih tebal dan 4 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-3-telur-40k', 'martabak-telur-ayam-4-telur-50k'],
  },
  {
    id: 'mta-3-50',
    slug: 'martabak-telur-ayam-4-telur-50k',
    name: 'Martabak Telur Ayam - 4 Telur (Rp 50.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak telur ayam dengan porsi ekstra daging ayam cincang melimpah dan 4 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-4-telur-45k', 'martabak-telur-ayam-5-telur-55k'],
  },
  {
    id: 'mta-3-55',
    slug: 'martabak-telur-ayam-5-telur-55k',
    name: 'Martabak Telur Ayam - 5 Telur (Rp 55.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak telur ayam porsi maksimal dengan daging premium bumbu khas dan 5 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-4-telur-50k', 'martabak-telur-bebek-3-telur-90k'],
  },
  {
    id: 'mta-4-60',
    slug: 'martabak-telur-ayam-5-telur-60k',
    name: 'Martabak Telur Ayam - 5 Telur (Rp 60.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 60000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak gurih dengan isian daging ayam cincang dan 5 butir telur ayam.',
    relatedSlugs: ['martabak-telur-ayam-6-telur-65k', 'martabak-telur-bebek-3-telur-60k'],
  },
  {
    id: 'mta-4-65',
    slug: 'martabak-telur-ayam-6-telur-65k',
    name: 'Martabak Telur Ayam - 6 Telur (Rp 65.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak telur ayam dengan isian daging ayam lebih tebal dan 6 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-5-telur-60k', 'martabak-telur-ayam-6-telur-70k'],
  },
  {
    id: 'mta-4-70',
    slug: 'martabak-telur-ayam-6-telur-70k',
    name: 'Martabak Telur Ayam - 6 Telur (Rp 70.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 70000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak telur ayam dengan porsi ekstra daging ayam cincang melimpah dan 6 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-6-telur-65k', 'martabak-telur-ayam-7-telur-75k'],
  },
  {
    id: 'mta-4-75',
    slug: 'martabak-telur-ayam-7-telur-75k',
    name: 'Martabak Telur Ayam - 7 Telur (Rp 75.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak telur ayam porsi maksimal dengan daging premium bumbu khas dan 7 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-6-telur-70k', 'martabak-telur-bebek-2-telur-40k'],
  },
  // ===== MARTABAK TELUR BEBEK =====
  {
    id: 'mtb-1-20',
    slug: 'martabak-telur-bebek-1-telur-20k',
    name: 'Martabak Telur Bebek - 1 Telur (Rp 20.000)',
    category: 'martabak-telur-bebek',
    categoryLabel: 'Martabak Telur Bebek',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    description: 'Martabak telur bebek gurih dengan isian 1 butir telur bebek berkualitas.',
    relatedSlugs: ['martabak-telur-bebek-2-telur-40k', 'martabak-telur-ayam-1-telur-20k'],
  },
  {
    id: 'mtb-2-40',
    slug: 'martabak-telur-bebek-2-telur-40k',
    name: 'Martabak Telur Bebek - 2 Telur (Rp 40.000)',
    category: 'martabak-telur-bebek',
    categoryLabel: 'Martabak Telur Bebek',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    description: 'Martabak telur bebek dengan porsi 2 butir telur bebek berkualitas.',
    relatedSlugs: ['martabak-telur-bebek-1-telur-20k', 'martabak-telur-bebek-3-telur-50k'],
  },
  {
    id: 'mtb-3-50',
    slug: 'martabak-telur-bebek-3-telur-50k',
    name: 'Martabak Telur Bebek - 3 Telur (Rp 50.000)',
    category: 'martabak-telur-bebek',
    categoryLabel: 'Martabak Telur Bebek',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    badge: 'terlaris',
    description: 'Martabak telur bebek dengan porsi 3 butir telur bebek berkualitas.',
    relatedSlugs: ['martabak-telur-bebek-2-telur-40k', 'martabak-telur-bebek-4-telur-60k'],
  },
  {
    id: 'mtb-4-60',
    slug: 'martabak-telur-bebek-4-telur-60k',
    name: 'Martabak Telur Bebek - 4 Telur (Rp 60.000)',
    category: 'martabak-telur-bebek',
    categoryLabel: 'Martabak Telur Bebek',
    price: 60000,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    description: 'Martabak telur bebek gurih dengan isian 4 butir telur bebek berkualitas.',
    relatedSlugs: ['martabak-telur-bebek-3-telur-50k', 'martabak-telur-bebek-5-telur-70k'],
  },
  {
    id: 'mtb-5-70',
    slug: 'martabak-telur-bebek-5-telur-70k',
    name: 'Martabak Telur Bebek - 5 Telur (Rp 70.000)',
    category: 'martabak-telur-bebek',
    categoryLabel: 'Martabak Telur Bebek',
    price: 70000,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    description: 'Martabak telur bebek dengan racikan bumbu khas dan 5 butir telur.',
    relatedSlugs: ['martabak-telur-bebek-4-telur-60k', 'martabak-telur-bebek-6-telur-80k'],
  },
  {
    id: 'mtb-6-80',
    slug: 'martabak-telur-bebek-6-telur-80k',
    name: 'Martabak Telur Bebek - 6 Telur (Rp 80.000)',
    category: 'martabak-telur-bebek',
    categoryLabel: 'Martabak Telur Bebek',
    price: 80000,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    description: 'Martabak telur bebek porsi puncak dengan 6 butir telur bebek premium.',
    relatedSlugs: ['martabak-telur-bebek-5-telur-70k', 'martabak-telur-ayam-6-telur-70k'],
  },

  // ===== MENU TERANG BULAN =====
  {
    id: 'tb-2-topping',
    slug: 'terang-bulan-2-variant-topping',
    name: 'Terang Bulan 2 Variant Topping',
    category: 'terang-bulan',
    categoryLabel: 'Terang Bulan',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
    badge: 'terlaris',
    description: 'Terang bulan lembut khas A6 Nyuss dengan bebas kombinasi 2 pilihan topping.',
    variants: [
      {
        label: 'Pilihan Topping 1',
        required: true,
        options: toppingOptions,
      },
      {
        label: 'Pilihan Topping 2',
        required: true,
        options: toppingOptions,
      },
      {
        label: 'Topping Tambahan',
        required: false,
        options: extraToppingOptions,
      },
    ],
    relatedSlugs: ['terang-bulan-milo-1-topping', 'terang-bulan-oreo-1-topping'],
  },
  {
    id: 'tb-milo',
    slug: 'terang-bulan-milo-1-topping',
    name: 'Terang Bulan Milo + 1 Topping',
    category: 'terang-bulan',
    categoryLabel: 'Terang Bulan',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
    description: 'Taburan bubuk cokelat Milo melimpah ditambah bebas memilih 1 topping pelengkap.',
    variants: [
      {
        label: 'Pilih Topping Tambahan',
        required: true,
        options: toppingOptions,
      },
      {
        label: 'Extra Topping',
        required: false,
        options: extraToppingOptions,
      },
    ],
    relatedSlugs: ['terang-bulan-2-variant-topping', 'terang-bulan-oreo-1-topping'],
  },
  {
    id: 'tb-oreo',
    slug: 'terang-bulan-oreo-1-topping',
    name: 'Terang Bulan Oreo + 1 Topping',
    category: 'terang-bulan',
    categoryLabel: 'Terang Bulan',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop',
    description: 'Taburan remahan biskuit Oreo renyah melimpah ditambah bebas memilih 1 topping pilihan.',
    variants: [
      {
        label: 'Pilih Topping Tambahan',
        required: true,
        options: toppingOptions,
      },
      {
        label: 'Extra Topping',
        required: false,
        options: extraToppingOptions,
      },
    ],
    relatedSlugs: ['terang-bulan-2-variant-topping', 'terang-bulan-milo-1-topping'],
  },
  {
    id: 'tb-nutella',
    slug: 'terang-bulan-nutella-1-topping',
    name: 'Terang Bulan Nutella + 1 Topping',
    category: 'terang-bulan',
    categoryLabel: 'Terang Bulan',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop',
    badge: 'terlaris',
    description: 'Olesan selai cokelat hazelnut Nutella premium ditambah 1 topping pelengkap pilihan.',
    variants: [
      {
        label: 'Pilih Topping Tambahan',
        required: true,
        options: toppingOptions,
      },
      {
        label: 'Extra Topping',
        required: false,
        options: extraToppingOptions,
      },
    ],
    relatedSlugs: ['terang-bulan-silverqueen-1-topping', 'terang-bulan-2-variant-topping'],
  },
  {
    id: 'tb-silverqueen',
    slug: 'terang-bulan-silverqueen-1-topping',
    name: 'Terang Bulan SilverQueen + 1 Topping',
    category: 'terang-bulan',
    categoryLabel: 'Terang Bulan',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    badge: 'baru',
    description: 'Potongan mewah cokelat SilverQueen premium melimpah ditambah 1 topping pilihan bebas.',
    variants: [
      {
        label: 'Pilih Topping Tambahan',
        required: true,
        options: toppingOptions,
      },
      {
        label: 'Extra Topping',
        required: false,
        options: extraToppingOptions,
      },
    ],
    relatedSlugs: ['terang-bulan-nutella-1-topping', 'terang-bulan-2-variant-topping'],
  },

  /*
  // ===== PAKET BUNDLING =====
  {
    id: 'bundling-1',
    slug: 'paket-hemat-1',
    name: 'Paket Hemat 1 (Terbul + Telur)',
    category: 'paket-bundling',
    categoryLabel: 'Paket Bundling',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop',
    badge: 'baru',
    description: '1 Box Terang Bulan pilihan + 1 Box Martabak Telur Ayam. Hemat 15% dari harga normal!',
    relatedSlugs: ['paket-hemat-2'],
  },
  {
    id: 'bundling-2',
    slug: 'paket-hemat-2',
    name: 'Paket Hemat 2 (Terbul Combo)',
    category: 'paket-bundling',
    categoryLabel: 'Paket Bundling',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop',
    description: '2 Box Terang Bulan dengan topping pilihan berbeda. Combo paling populer!',
    relatedSlugs: ['paket-hemat-1'],
  },

  // ===== MINUMAN =====
  {
    id: 'drink-teh',
    slug: 'es-teh-manis',
    name: 'Es Teh Manis',
    category: 'minuman',
    categoryLabel: 'Minuman',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
    description: 'Es teh manis segar pelepas dahaga yang sangat pas menemani martabak hangat.',
    relatedSlugs: ['es-jeruk', 'air-mineral'],
  },
  {
    id: 'drink-jeruk',
    slug: 'es-jeruk',
    name: 'Es Jeruk',
    category: 'minuman',
    categoryLabel: 'Minuman',
    price: 7000,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop',
    description: 'Perasan jeruk asli segar, manis dan menyegarkan.',
    relatedSlugs: ['es-teh-manis', 'air-mineral'],
  },
  {
    id: 'drink-mineral',
    slug: 'air-mineral',
    name: 'Air Mineral',
    category: 'minuman',
    categoryLabel: 'Minuman',
    price: 4000,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop',
    description: 'Air mineral kemasan botol 600ml steril dan segar.',
    relatedSlugs: ['es-teh-manis', 'es-jeruk'],
  },
  */
];

export const popularMenuSlugs = ['terang-bulan-2-variant-topping', 'martabak-telur-ayam-2-telur-25k', 'martabak-telur-bebek-2-telur-40k', 'terang-bulan-silverqueen-1-topping'];

export function getMenuBySlug(slug: string): MenuItem | undefined {
  return menuItems.find((item) => item.slug === slug);
}

export function getMenuByCategory(category: MenuCategory): MenuItem[] {
  return menuItems.filter((item) => item.category === category);
}

export function getRelatedMenus(slugs: string[]): MenuItem[] {
  return slugs.map((slug) => menuItems.find((item) => item.slug === slug)).filter(Boolean) as MenuItem[];
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

```

---

### File: `apps/admin/data/menu_knowledge.md`

```markdown
# PENGETAHUAN MENU & TOPPING MARTABAK A6 NYUSS

## 1. KATEGORI MARTABAK TELUR
Adonan martabak gurih dengan kulit renyah, daun bawang segar, dan bumbu rempah rahasia.

### A. Martabak Telur Ayam
*   Menggunakan telur ayam pilihan dengan potongan daging ayam cincang melimpah.
*   Pilihan Porsi:
    *   **2 Telur**: Tersedia varian harga Rp 20.000 (standard), Rp 25.000 (tebal), Rp 30.000 (ekstra daging), dan Rp 35.000 (daging maksimal premium).
    *   **3 Telur**: Tersedia varian harga Rp 40.000, Rp 45.000, Rp 50.000, dan Rp 55.000.
    *   **4 Telur**: Tersedia varian harga Rp 60.000, Rp 65.000, Rp 70.000, dan Rp 75.000.

### B. Martabak Telur Bebek
*   Lebih gurih, padat, dan wangi dibanding telur ayam. Menggunakan telur bebek premium dan isian daging sapi cincang.
*   Pilihan Porsi:
    *   **2 Telur**: Tersedia varian harga Rp 20.000, Rp 30.000 (terlaris), Rp 40.000, dan Rp 50.000.
    *   **3 Telur**: Tersedia varian harga Rp 60.000, Rp 70.000, Rp 80.000, dan Rp 90.000.

---

## 2. KATEGORI TERANG BULAN (MARTABAK MANIS)
Terang Bulan bertekstur lembut, bersarang, tebal, dengan mentega wangi melimpah.

### A. Varian Menu Terang Bulan Utama:
1.  **Terang Bulan 2 Variant Topping (Rp 20.000)**: Bebas memilih kombinasi 2 rasa dari pilihan topping standar.
2.  **Terang Bulan Milo + 1 Topping (Rp 25.000)**: Taburan bubuk Milo melimpah ditambah 1 topping pelengkap pilihan Kakak.
3.  **Terang Bulan Oreo + 1 Topping (Rp 25.000)**: Taburan Oreo bubuk renyah melimpah ditambah 1 topping pelengkap.
4.  **Terang Bulan Nutella + 1 Topping (Rp 30.000)**: Selai cokelat Nutella premium melimpah ditambah 1 topping pelengkap.
5.  **Terang Bulan SilverQueen + 1 Topping (Rp 50.000)**: Cokelat SilverQueen premium melimpah ditambah 1 topping pelengkap.

### B. Pilihan Topping Standar (Free To Choose):
Kacang, Meses, Keju, Pisang, Melon, Strawberry, Selai Coklat, Nanas, Vanilla, Blueberry, Tiramisu, Green Tea, Kismis.

### C. Tambahan Extra Topping:
Kakak bisa menambah topping tambahan apa saja (Extra Keju, Extra Meses, dll.) dengan biaya tambahan **Rp 5.000 per topping tambahan**.

---

## 3. PAKET BUNDLING & MINUMAN
*   **Paket Hemat 1 (Rp 55.000)**: 1 Box Terang Bulan Pilihan + 1 Box Martabak Telur Ayam. Hemat 15%!
*   **Paket Hemat 2 (Rp 50.000)**: 2 Box Terang Bulan dengan rasa yang berbeda (Combo Terbul terpopuler).
*   **Es Teh Manis (Rp 5.000)**: Segar dan manis pas.
*   **Es Jeruk (Rp 7.000)**: Perasan jeruk asli.
*   **Air Mineral (Rp 4.000)**: Kemasan botol 600ml.

```

---

### File: `apps/admin/data/store_info.md`

```markdown
# INFORMASI TOKO & OPERASIONAL MARTABAK A6 NYUSS

*   **Nama Toko**: Martabak & Terang Bulan A6 Nyuss
*   **Alamat Toko**: Jl. Demak No. 253, Dupak, Kec. Krembangan, Kota Surabaya, Jawa Timur 60179
*   **Patokan Lokasi**: Tepat di depan Mess DITPOLAIRUD POLDA JATIM Surabaya.
*   **Google Maps Koordinat**: Lat -7.2432537, Lng 112.7206275. Tautan: https://www.google.com/maps?q=-7.243211171142016,112.71769837365488
*   **Jam Operasional**: Buka setiap hari mulai pukul 17.00 sampai pukul 01.00 WIB (malam).
*   **Kontak WhatsApp**: +62 878-1112-3482 (Nomor WhatsApp Resmi A6 Nyuss)
*   **Sosial Media**:
    *   Instagram: @a6nyusss
    *   Facebook: Martabak Nyuss
    *   TikTok: @a6nyuss
*   **Sejarah/Profil**: Menyajikan martabak telur gurih dan terang bulan manis premium khas Surabaya dengan resep turun-temurun sejak tahun 2000 menggunakan bahan berkualitas.

```

---

### File: `apps/admin/instrumentation.ts`

```typescript
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = async (
  err: unknown,
  request: any,
  context: any
) => {
  const { captureRequestError } = await import("@sentry/nextjs");
  captureRequestError(err, request as any, context as any);
};

```

---

### File: `apps/admin/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseTenantFromHostname } from '@taj-saas/shared';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const { slug, appType, isLocalhost } = parseTenantFromHostname(hostname);

  // Development helpers: redirect to correct ports if subdomains hit admin app
  if (isLocalhost) {
    if (appType === 'customer') {
      const url = request.nextUrl.clone();
      url.port = '3000';
      return NextResponse.redirect(url);
    }
    if (appType === 'owner') {
      const url = request.nextUrl.clone();
      url.port = '3002';
      return NextResponse.redirect(url);
    }
  }

  // Clone headers and set tenant context
  const requestHeaders = new Headers(request.headers);
  if (slug) {
    requestHeaders.set('x-tenant-slug', slug);
  }

  // Continue request with injected header
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Only run on standard page/api routes, ignore static files
export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)',
  ],
};

```

---

### File: `apps/admin/next-env.d.ts`

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/dev/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

```

---

### File: `apps/admin/next.config.ts`

```typescript
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  transpilePackages: ["@taj-saas/db", "@taj-saas/shared", "@taj-saas/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: "taj-saas",
  project: "taj-saas-admin",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: { enabled: true },
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
});

```

---

### File: `apps/admin/package-lock.json`

*[Lock file - content omitted]*

---

### File: `apps/admin/package.json`

```json
{
  "name": "@taj-saas/admin",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@sentry/nextjs": "^10.57.0",
    "@taj-saas/db": "workspace:*",
    "@taj-saas/shared": "workspace:*",
    "ably": "^2.22.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.4.0",
    "lucide-react": "^1.17.0",
    "next": "16.2.6",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-hot-toast": "^2.6.0",
    "tailwind-merge": "^3.6.0",
    "zustand": "^5.0.14"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}

```

---

### File: `apps/admin/postcss.config.mjs`

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

```

---

### File: `apps/admin/sentry.client.config.ts`

```typescript
// Admin App — Sentry Client Config
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  debug: process.env.NODE_ENV === "development",
  integrations: [
    Sentry.replayIntegration(),
  ],
});

```

---

### File: `apps/admin/sentry.edge.config.ts`

```typescript
// Admin App — Sentry Edge Config
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: process.env.NODE_ENV === "development",
});

```

---

### File: `apps/admin/sentry.server.config.ts`

```typescript
// Admin App — Sentry Server Config
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: process.env.NODE_ENV === "development",
});

```

---

### File: `apps/admin/store/adminStore.ts`

```typescript
import { create } from 'zustand';
import { menuItems as staticMenuItems, toppingOptions } from '../data/menu';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  variant?: string;
  topping?: string;
}

export interface AdminOrder {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  deliveryType: 'pickup' | 'delivery';
  deliveryAddress: string | null;
  deliveryDistance: number | null;
  deliveryFee: number;
  subtotal: number;
  discount: number;
  couponCode: string | null;
  totalPrice: number;
  status: 'received' | 'processing' | 'ready' | 'completed' | 'cancelled';
  paymentMethod: 'cod' | 'transfer';
  paymentStatus: 'pending' | 'waiting_verification' | 'paid' | 'failed' | 'refunded';
  paymentProofUrl: string | null;
  notes: string | null;
  cancellationReason: string | null;
  items: OrderItem[];
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  isAvailable: boolean;
  price: number;
  categoryId: string;
  categoryName: string;
}

export interface ToppingItem {
  id: string;
  name: string;
  isAvailable: boolean;
}

export interface StoreLog {
  id: number;
  action: 'open' | 'closed';
  operatorName: string | null;
  operatorId: string | null;
  selectedDate: string; // 'YYYY-MM-DD'
  loggedAt: string;    // ISO timestamp WIB
  notes: string | null;
}

export interface ShiftLog {
  id: number;
  operatorId: string | null;
  operatorName: string;
  openedAt: string;
  closedAt: string | null;
  startingCash: number;
  expectedCash: number;
  actualCash: number | null;
  drift: number | null;
  status: 'open' | 'closed';
}

interface AdminState {
  orders: AdminOrder[];
  menuItems: MenuItem[];
  toppings: ToppingItem[];
  storeLogs: StoreLog[];
  activeShift: ShiftLog | null;
  selectedOrderId: string | null;
  isAlarmPlaying: boolean;
  isStoreOpen: boolean;
  newOrderIds: string[];
  isLoading: boolean;
  subscription: any | null;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  selectOrder: (id: string) => void;
  updateOrderStatus: (id: string, newStatus: AdminOrder['status'], cancellationReason?: string) => Promise<boolean>;
  verifyPaymentStatus: (id: string, isPaid: boolean) => Promise<boolean>;
  stopAlarm: () => void;
  playAlarm: () => void;
  addNewOrder: (order: AdminOrder) => void;
  dismissNewOrder: (id: string) => void;
  toggleStore: () => Promise<void>;
  toggleStoreWithLog: (action: 'open' | 'closed', selectedDate: string, operatorName: string) => Promise<boolean>;
  fetchStoreLogs: (date?: string) => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchStoreSettings: () => Promise<void>;
  fetchMenuItems: () => Promise<void>;
  toggleMenuItemAvailability: (id: string, isAvailable: boolean) => Promise<boolean>;
  fetchToppings: () => Promise<void>;
  toggleToppingAvailability: (id: string, isAvailable: boolean) => Promise<boolean>;
  writeAuditLog: (action: string, details: string, orderId?: string) => Promise<void>;
  subscribeToOrders: () => void;
  unsubscribeFromOrders: () => void;
  fetchActiveShift: () => Promise<void>;
  openShift: (startingCash: number, operatorName: string) => Promise<boolean>;
  closeShift: (actualCash: number, expectedCash: number) => Promise<boolean>;
}

// Generate some realistic initial mock orders
const initialMockOrders: AdminOrder[] = [
  {
    id: 'mock-order-1',
    orderCode: 'A6-20260610-1823',
    customerName: 'Budi Hartono',
    customerPhone: '081234567890',
    deliveryType: 'pickup',
    deliveryAddress: null,
    deliveryDistance: null,
    deliveryFee: 0,
    subtotal: 50000,
    discount: 0,
    couponCode: null,
    totalPrice: 50000,
    status: 'received',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    paymentProofUrl: null,
    notes: 'Minta daun bawang agak banyak ya pak',
    cancellationReason: null,
    items: [
      {
        id: 'item-1',
        name: 'Martabak Telur Ayam - 2 Telur',
        quantity: 2,
        price: 25000,
        variant: 'Daging Ayam'
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 mins ago
  },
  {
    id: 'mock-order-2',
    orderCode: 'A6-20260610-1288',
    customerName: 'Siti Rahma',
    customerPhone: '08561234567',
    deliveryType: 'delivery',
    deliveryAddress: 'Jl. Pemuda No. 45, Surabaya',
    deliveryDistance: 3.5,
    deliveryFee: 13000,
    subtotal: 45000,
    discount: 5000,
    couponCode: 'WEBAPPNEW',
    totalPrice: 53000,
    status: 'received',
    paymentMethod: 'transfer',
    paymentStatus: 'waiting_verification',
    paymentProofUrl: 'https://placehold.co/400x600/16a34a/white?text=Bukti+Transfer+MOCK',
    notes: 'Kupon WEBAPPNEW applied',
    cancellationReason: null,
    items: [
      {
        id: 'item-2',
        name: 'Terang Bulan Milo + 1 Topping',
        quantity: 1,
        price: 25000,
        topping: 'Keju'
      },
      {
        id: 'item-3',
        name: 'Martabak Telur Ayam - 1 Telur',
        quantity: 1,
        price: 20000,
        variant: 'Daging Sapi'
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 mins ago
  },
  {
    id: 'mock-order-3',
    orderCode: 'A6-20260610-8812',
    customerName: 'Andi Saputra',
    customerPhone: '081399887766',
    deliveryType: 'pickup',
    deliveryAddress: null,
    deliveryDistance: null,
    deliveryFee: 0,
    subtotal: 40000,
    discount: 0,
    couponCode: null,
    totalPrice: 40000,
    status: 'ready',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    paymentProofUrl: null,
    notes: 'Jangan terlalu asin',
    cancellationReason: null,
    items: [
      {
        id: 'item-4',
        name: 'Martabak Telur Bebek - 2 Telur',
        quantity: 1,
        price: 40000,
        variant: 'Daging Ayam'
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 mins ago
  }
];

export const useAdminStore = create<AdminState>((set, get) => ({
  orders: initialMockOrders,
  menuItems: [],
  toppings: [],
  storeLogs: [],
  activeShift: null,
  selectedOrderId: 'mock-order-1',
  isAlarmPlaying: false,
  isStoreOpen: true,
  newOrderIds: [],
  isLoading: false,
  subscription: null,
  connectionStatus: 'connected',

  selectOrder: (id) => set({ selectedOrderId: id }),

  writeAuditLog: async (action, details, orderId) => {
    console.log('[Mock Audit Log]:', { action, details, orderId });
  },

  updateOrderStatus: async (id, newStatus, cancellationReason) => {
    const order = get().orders.find((o) => o.id === id);
    const shouldAutoPay = newStatus === 'completed' && order && order.paymentMethod === 'cod';

    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id
          ? {
              ...o,
              status: newStatus,
              cancellationReason: cancellationReason || null,
              paymentStatus: shouldAutoPay ? 'paid' : o.paymentStatus,
            }
          : o
      ),
    }));

    // If COD completed, update expected cash in mock active shift
    const activeShift = get().activeShift;
    if (shouldAutoPay && activeShift && order) {
      const newExpectedCash = activeShift.expectedCash + order.totalPrice;
      set({
        activeShift: {
          ...activeShift,
          expectedCash: newExpectedCash,
        },
      });
    }

    return true;
  },

  verifyPaymentStatus: async (id, isPaid) => {
    const newPaymentStatus = isPaid ? 'paid' : 'failed';
    const order = get().orders.find((o) => o.id === id);

    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, paymentStatus: newPaymentStatus } : o
      ),
    }));

    // If payment verified (paid), update expected cash in mock active shift for transfers too
    const activeShift = get().activeShift;
    if (isPaid && activeShift && order) {
      const newExpectedCash = activeShift.expectedCash + order.totalPrice;
      set({
        activeShift: {
          ...activeShift,
          expectedCash: newExpectedCash,
        },
      });
    }

    return true;
  },

  stopAlarm: () => set({ isAlarmPlaying: false }),
  playAlarm: () => set({ isAlarmPlaying: true }),

  addNewOrder: (order) => {
    set((state) => ({
      orders: [order, ...state.orders],
      newOrderIds: [...state.newOrderIds, order.id],
      isAlarmPlaying: order.status === 'received' ? true : state.isAlarmPlaying,
    }));
  },

  dismissNewOrder: (id) => {
    set((state) => ({
      newOrderIds: state.newOrderIds.filter((nid) => nid !== id),
      isAlarmPlaying: state.newOrderIds.filter((nid) => nid !== id).length > 0,
    }));
  },

  toggleStore: async () => {
    const nextState = !get().isStoreOpen;
    set({ isStoreOpen: nextState });
  },

  toggleStoreWithLog: async (action, selectedDate, operatorName) => {
    const nextIsOpen = action === 'open';
    const now = new Date();
    const newLog: StoreLog = {
      id: Date.now(),
      action,
      operatorName,
      operatorId: 'mock-operator-id',
      selectedDate,
      loggedAt: now.toISOString(),
      notes: `Toko di${action === 'open' ? 'buka' : 'tutup'} oleh ${operatorName} pada ${selectedDate}`,
    };

    set((state) => ({
      isStoreOpen: nextIsOpen,
      storeLogs: [newLog, ...state.storeLogs]
    }));

    return true;
  },

  fetchStoreLogs: async (date) => {
    // Return mock logs
    if (get().storeLogs.length === 0) {
      set({
        storeLogs: [
          {
            id: 1,
            action: 'open',
            operatorName: 'Budi Kasir',
            operatorId: 'mock-operator-id',
            selectedDate: new Date().toISOString().slice(0, 10),
            loggedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
            notes: 'Toko dibuka oleh Budi Kasir'
          }
        ]
      });
    }
  },

  fetchStoreSettings: async () => {
    // Set default open state
    set({ isStoreOpen: true });
  },

  fetchMenuItems: async () => {
    const formatted: MenuItem[] = staticMenuItems.map((m: any) => ({
      id: m.id,
      name: m.name,
      slug: m.slug,
      isAvailable: m.badge !== 'habis',
      price: m.price,
      categoryId: m.category,
      categoryName: m.categoryLabel,
    }));

    set({ menuItems: formatted });
  },

  toggleMenuItemAvailability: async (id, isAvailable) => {
    set((state) => ({
      menuItems: state.menuItems.map((m) =>
        m.id === id ? { ...m, isAvailable } : m
      ),
    }));
    return true;
  },

  fetchToppings: async () => {
    const formatted: ToppingItem[] = toppingOptions.map((t: any) => ({
      id: t.id,
      name: t.name,
      isAvailable: true,
    }));

    set({ toppings: formatted });
  },

  toggleToppingAvailability: async (id, isAvailable) => {
    set((state) => ({
      toppings: state.toppings.map((t) =>
        t.id === id ? { ...t, isAvailable } : t
      ),
    }));
    return true;
  },

  fetchOrders: async () => {
    // Orders are already initialized, do nothing
  },

  subscribeToOrders: () => {
    console.log('[Ably Realtime] Subscribed to orders');
    const ablyKey = "CaWXiA.3YmauA:H7LLGQ8DyVxEwdCsCxeHp3ZkOU3tBIUBJ9HuYXrkFOo";
    
    // Lazy load Ably client side
    import('ably').then(({ Realtime }) => {
      const tenantSlug = "a6-nyuss"; // fallback/dev default
      const ably = new Realtime({ key: ablyKey });
      const channel = ably.channels.get(`orders:${tenantSlug}`);
      
      channel.subscribe('new-order', (message) => {
        const orderData = message.data.order;
        console.log('[Ably] Realtime order received:', orderData);

        const newOrder: AdminOrder = {
          id: orderData.id,
          orderCode: orderData.orderCode,
          customerName: orderData.customerName,
          customerPhone: orderData.customerPhone,
          deliveryType: orderData.deliveryType,
          deliveryAddress: orderData.deliveryAddress,
          deliveryDistance: null,
          deliveryFee: Number(orderData.deliveryFee || 0),
          subtotal: Number(orderData.subtotal),
          discount: 0,
          couponCode: null,
          totalPrice: Number(orderData.totalPrice),
          status: orderData.status,
          paymentMethod: orderData.paymentMethod,
          paymentStatus: orderData.paymentStatus,
          paymentProofUrl: null,
          notes: orderData.notes,
          cancellationReason: null,
          items: orderData.items.map((item: any, idx: number) => ({
            id: item.menuItemId || `item-${idx}`,
            name: item.menuItemName,
            quantity: item.quantity,
            price: Number(item.unitPrice),
            variant: item.variantName || undefined
          })),
          createdAt: orderData.createdAt
        };

        // Add order to state
        if (get().activeShift) {
          get().addNewOrder(newOrder);
        }
      });

      set({ subscription: { ably, channel } });
    });
  },

  unsubscribeFromOrders: () => {
    console.log('[Ably Realtime] Unsubscribed from orders');
    const { subscription } = get();
    if (subscription) {
      try {
        subscription.channel.unsubscribe();
        subscription.ably.close();
      } catch (err) {
        console.error('Error during Ably unsubscribe:', err);
      }
      set({ subscription: null });
    }
  },

  fetchActiveShift: async () => {
    // Return mock active shift if it was opened
  },

  openShift: async (startingCash, operatorName) => {
    const newShift: ShiftLog = {
      id: Date.now(),
      operatorId: 'mock-operator-id',
      operatorName,
      openedAt: new Date().toISOString(),
      closedAt: null,
      startingCash,
      expectedCash: startingCash,
      actualCash: null,
      drift: null,
      status: 'open',
    };

    set({ activeShift: newShift });
    return true;
  },

  closeShift: async (actualCash, expectedCash) => {
    const { activeShift } = get();
    if (!activeShift) return false;

    const drift = actualCash - expectedCash;

    set({
      activeShift: {
        ...activeShift,
        status: 'closed',
        closedAt: new Date().toISOString(),
        actualCash: actualCash,
        drift: drift,
      }
    });

    return true;
  },
}));

```

---

### File: `apps/admin/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "**/*.mts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}

```

---

### File: `apps/admin/utils/cn.ts`

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

---

### File: `apps/admin/utils/format.ts`

```typescript
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function timeAgo(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} mnt lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  return `${Math.floor(diffHours / 24)} hari lalu`;
}

```

---

### File: `apps/admin/utils/supabase.ts`

*File not found on disk*

---

### File: `apps/customer/.env`

```text
# Supabase Configurations (Placeholder / Mocked client initialization)
NEXT_PUBLIC_SUPABASE_URL=xxxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxx

# Gemini AI (For Customer Portal AI Chatbot)
GEMINI_API_KEY=xxxx

BETTER_AUTH_SECRET=xxxx
BETTER_AUTH_URL=xxxx
BETTER_AUTH_API_KEY=xxxx

DATABASE_URL=xxxx
ABLY_API_KEY=xxxx

# Sentry — Error Monitoring
# Isi DSN dari: sentry.io → Settings → Projects → taj-saas-customer → Client Keys (DSN)
NEXT_PUBLIC_SENTRY_DSN=xxxx
SENTRY_AUTH_TOKEN=xxxx
SENTRY_ORG=xxxx
SENTRY_PROJECT=xxxx

# PostHog — Product Analytics
# Isi dari: app.posthog.com → Settings → Project → API Key
NEXT_PUBLIC_POSTHOG_KEY=xxxx
NEXT_PUBLIC_POSTHOG_HOST=xxxx

```

---

### File: `apps/customer/app/.gitkeep`

```text
# Placeholder

```

---

### File: `apps/customer/app/about/page.tsx`

```tsx
"use client";
import Link from 'next/link';

import { ArrowRight, Award, Sprout, Heart, Handshake, User } from 'lucide-react';

const timeline = [
  { year: '2000', event: 'A6 Nyuss didirikan di Surabaya', desc: 'Berawal dari gerobak sederhana di Jl. Demak, A6 Nyuss mulai melayani warga Surabaya.' },
  { year: '2005', event: 'Menu Terang Bulan diluncurkan', desc: 'Memperluas menu dengan Terang Bulan yang langsung menjadi favorit pelanggan.' },
  { year: '2010', event: 'Tempat buka pertama kali permanen', desc: 'Pindah ke lokasi yang lebih strategis, semakin mudah dijangkau pelanggan.' },
  { year: '2015', event: 'Pelanggan ke-10.000', desc: 'Mencapai milestone 10.000 pelanggan setia. Terima kasih atas kepercayaan Anda!' },
  { year: '2020', event: '20 Tahun Melayani Surabaya', desc: 'Merayakan ulang tahun ke-20 dengan menu spesial dan promo anniversary.' },
  { year: '2026', event: 'Hadir di Platform Digital', desc: 'Kini A6 Nyuss hadir secara online untuk memudahkan Anda pesan kapan saja!' },
];

const values = [
  { icon: 'Award', title: 'Rasa Autentik', desc: 'Resep original yang tidak pernah berubah sejak 2000. Cita rasa yang bikin kangen!' },
  { icon: 'Sprout', title: 'Bahan Pilihan', desc: 'Kami hanya menggunakan bahan-bahan berkualitas dan segar setiap harinya.' },
  { icon: 'Heart', title: 'Dengan Kasih Sayang', desc: 'Setiap martabak dibuat dengan penuh dedikasi dan cinta untuk kepuasan pelanggan.' },
  { icon: 'Handshake', title: 'Pelayanan Ramah', desc: 'Kami selalu siap melayani dengan senyum dan memastikan pengalaman terbaik.' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#8E0E0E] via-[#A9240E] to-[#E05009] py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 border-4 border-white rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 border-4 border-white rounded-full" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
            <Award className="w-4 h-4" /> Est. 2000 — 25+ Tahun Melayani Surabaya
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Cerita di Balik<br />
            <span className="text-yellow-300">A6 Nyuss</span>
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Dari gerobak sederhana hingga menjadi ikon martabak Surabaya. 
            Ini adalah perjalanan 25 tahun penuh cinta dan dedikasi.
          </p>
        </div>
      </div>

      {/* Brand Story */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-12">
            <div>
              <span className="text-[#E05009] font-semibold text-sm uppercase tracking-wider">Kisah Kami</span>
              <h2 className="text-3xl font-black text-gray-900 mt-1 mb-4">Bermula dari Mimpi Sederhana</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Tahun 2000, dengan modal terbatas dan tekad yang besar, A6 Nyuss lahir di sudut Jalan Demak, Surabaya. 
                  Bapak pendiri kami — seorang putra asli Surabaya — memulai segalanya dari sebuah gerobak kayu sederhana 
                  dengan resep martabak yang diwariskan turun-temurun dari keluarga.
                </p>
                <p>
                  Nama "A6 Nyuss" bukan sekadar nama. Angka 6 melambangkan lokasi awal kami, sementara "Nyuss" adalah 
                  cara orang Surabaya mengekspresikan sesuatu yang luar biasa enak. Dan memang, dari hari pertama, 
                  pelanggan langsung jatuh cinta dengan cita rasanya.
                </p>
                <p>
                  25 tahun berlalu, kami tetap mempertahankan resep original yang sama. Tidak ada kompromi dalam soal 
                  rasa. Setiap malam, kami memastikan bahwa setiap martabak yang keluar dari dapur kami adalah yang 
                  terbaik yang bisa kami sajikan.
                </p>
                <p>
                  Kini, di era digital, kami hadir lebih dekat dengan Anda melalui platform online ini. 
                  Tapi satu hal yang tidak berubah: semangat dan dedikasi kami untuk selalu menghadirkan 
                  martabak terlezat untuk keluarga Surabaya.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] rounded-3xl p-8 text-center text-white">
                <div className="text-7xl font-black mb-2">25</div>
                <div className="text-xl font-bold mb-1">Tahun Melayani</div>
                <div className="text-white/80 text-sm">Warga Surabaya Tercinta</div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {[
                    { num: '10K+', label: 'Pelanggan Setia' },
                    { num: '50K+', label: 'Pesanan Terlayani' },
                    { num: '4.9/5', label: 'Rating' },
                    { num: '100%', label: 'Halal' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white/20 rounded-xl p-3">
                      <div className="text-xl font-black">{stat.num}</div>
                      <div className="text-xs text-white/70">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      {false && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-[#E05009] font-semibold text-sm uppercase tracking-wider">Perjalanan Kami</span>
              <h2 className="text-3xl font-black text-gray-900 mt-1">Milestone A6 Nyuss</h2>
            </div>
            <div className="relative">
              <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2" />
              <div className="space-y-8">
                {timeline.map((item, idx) => (
                  <div key={item.year} className={`flex gap-4 sm:gap-0 ${idx % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} items-start relative`}>
                    {/* Content */}
                    <div className={`flex-1 ${idx % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12'} pl-16 sm:pl-0`}>
                      <div className={`bg-white rounded-2xl p-4 shadow-md ${idx % 2 === 0 ? '' : 'sm:ml-4'}`}>
                        <div className="text-[#E05009] font-black text-xl mb-1">{item.year}</div>
                        <h3 className="font-bold text-gray-900 mb-1">{item.event}</h3>
                        <p className="text-gray-500 text-sm">{item.desc}</p>
                      </div>
                    </div>
                    {/* Dot */}
                    <div className="absolute left-8 sm:left-1/2 top-4 w-5 h-5 rounded-full bg-[#8E0E0E] border-4 border-white shadow -translate-x-1/2 z-10" />
                    <div className="flex-1 hidden sm:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-[#E05009] font-semibold text-sm uppercase tracking-wider">Yang Kami Pegang</span>
            <h2 className="text-3xl font-black text-gray-900 mt-1">Nilai-Nilai A6 Nyuss</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="text-center p-6 rounded-2xl bg-gradient-to-b from-[#8E0E0E]/5 to-transparent border border-[#8E0E0E]/10 flex flex-col items-center">
                <div className="text-[#E05009] p-3 bg-[#E05009]/10 rounded-2xl mb-3">
                  {v.icon === 'Award' && <Award className="w-8 h-8" />}
                  {v.icon === 'Sprout' && <Sprout className="w-8 h-8" />}
                  {v.icon === 'Heart' && <Heart className="w-8 h-8" />}
                  {v.icon === 'Handshake' && <Handshake className="w-8 h-8" />}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#E05009] font-semibold text-sm uppercase tracking-wider">Orang di Balik Layar</span>
          <h2 className="text-3xl font-black text-gray-900 mt-1 mb-10">Tim A6 Nyuss</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: 'Pak Ahmad', role: 'Founder & Head Chef', quote: '"Setiap martabak adalah karya seni yang harus sempurna."' },
              { name: 'Bu Sari', role: 'Operasional & Layanan', quote: '"Pelanggan yang puas adalah kebanggaan terbesar kami."' },
              { name: 'Mas Reza', role: 'Quality Control', quote: '"Bahan terbaik menghasilkan rasa terbaik, selalu."' },
            ].map((person) => (
              <div key={person.name} className="bg-white rounded-2xl p-6 shadow-md text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#8E0E0E]/10 flex items-center justify-center mb-3">
                  <User className="w-6 h-6 text-[#8E0E0E]" />
                </div>
                <h3 className="font-bold text-gray-900">{person.name}</h3>
                <p className="text-[#E05009] text-sm font-medium mb-3">{person.role}</p>
                <p className="text-gray-500 text-sm italic">"{person.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-[#8E0E0E] to-[#E05009]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Siap Merasakan Bedanya?</h2>
          <p className="text-white/80 mb-8">Coba sendiri mengapa kami dipercaya ribuan keluarga Surabaya selama 25 tahun.</p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-[#8E0E0E] font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
          >
            Coba Menu Kami <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

```

---

### File: `apps/customer/app/api/auth/[...better-auth]/route.ts`

```typescript
import { auth } from "../../../../../../lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);

```

---

### File: `apps/customer/app/api/chat/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import fs from 'fs';
import path from 'path';
import { db, schema } from '@taj-saas/db';
import { eq } from 'drizzle-orm';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// ─────────────────────────────────────────────────────────────
// RATE LIMITING — Fix Critical #3
// In-memory rate limiter: max 20 request per IP per 60 detik.
// Untuk produksi skala besar, gunakan Upstash Redis / Vercel KV.
// ─────────────────────────────────────────────────────────────
const RATE_LIMIT_MAX = 20;        // maks request per window
const RATE_LIMIT_WINDOW_MS = 60_000; // 60 detik

interface RateLimitEntry {
  count: number;
  resetAt: number;
}
// Map: IP string → {count, resetAt}
// Dibersihkan otomatis saat resetAt terlewati
const rateLimitStore = new Map<string, RateLimitEntry>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || entry.resetAt <= now) {
    // Window baru atau sudah expired
    const newEntry: RateLimitEntry = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateLimitStore.set(ip, newEntry);
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetAt: newEntry.resetAt };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count, resetAt: entry.resetAt };
}

// Bersihkan entries yang sudah expired setiap 5 menit agar tidak memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitStore.entries()) {
    if (val.resetAt <= now) rateLimitStore.delete(key);
  }
}, 5 * 60_000);

// ─────────────────────────────────────────────────────────────
// INPUT VALIDATION
// ─────────────────────────────────────────────────────────────
const MAX_PROMPT_LENGTH = 1000; // karakter

function sanitizePrompt(raw: unknown): { valid: boolean; prompt: string; reason?: string } {
  if (typeof raw !== 'string') {
    return { valid: false, prompt: '', reason: 'Prompt harus berupa teks.' };
  }
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return { valid: false, prompt: '', reason: 'Pesan tidak boleh kosong.' };
  }
  if (trimmed.length > MAX_PROMPT_LENGTH) {
    return {
      valid: false,
      prompt: '',
      reason: `Pesan terlalu panjang (maks. ${MAX_PROMPT_LENGTH} karakter).`,
    };
  }
  // Strip karakter null bytes dan control chars berbahaya
  const sanitized = trimmed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  return { valid: true, prompt: sanitized };
}

// Helper to query order status directly from database
async function getOrderStatus(orderCode: string) {
  try {
    const trimmedCode = orderCode.trim().toUpperCase();
    
    // Query order from database
    const ordersResult = await db.select()
      .from(schema.orders)
      .where(eq(schema.orders.orderCode, trimmedCode))
      .limit(1);
      
    const order = ordersResult[0];
    if (!order) {
      return { success: false, error: 'Pesanan tidak ditemukan.' };
    }
    
    // Query order items
    const itemsResult = await db.select()
      .from(schema.orderItems)
      .where(eq(schema.orderItems.orderId, order.id));
      
    const itemsStr = itemsResult.map(item => `${item.menuItemName} x${item.quantity}`).join(', ');
    
    // Map status code to friendly text
    const statusMap: Record<string, string> = {
      received: 'Pesanan Diterima (belum diproses)',
      processing: 'Sedang Diproses (sedang dimasak)',
      ready: 'Siap Diambil / Diantar',
      completed: 'Selesai',
      cancelled: 'Dibatalkan'
    };
    
    return {
      success: true,
      orderCode: order.orderCode,
      customerName: order.customerName,
      status: statusMap[order.status] || order.status,
      statusCode: order.status,
      deliveryType: order.deliveryType === 'delivery' ? 'Pesan Antar (Delivery)' : 'Ambil Sendiri (Pickup)',
      deliveryAddress: order.deliveryAddress,
      totalPrice: Number(order.totalPrice),
      items: itemsStr,
      notes: order.notes
    };
  } catch (err: any) {
    console.error('Error in chatbot checkOrderStatus:', err);
    return { error: 'Gagal menghubungi database. Silakan coba kembali nanti.' };
  }
}

// Helper to search order codes by phone number directly from database
async function findOrderCodesByPhone(customerPhone: string) {
  try {
    const trimmedPhone = customerPhone.trim().replace(/\s/g, '');
    
    // Query orders from database
    const ordersResult = await db.select()
      .from(schema.orders)
      .where(eq(schema.orders.customerPhone, trimmedPhone))
      .orderBy(schema.orders.createdAt);
      
    const list = ordersResult.map(order => ({
      orderCode: order.orderCode,
      customerName: order.customerName,
      date: new Date(order.createdAt).toLocaleDateString('id-ID'),
      total: Number(order.totalPrice),
      status: order.status
    }));

    return { success: true, orders: list };
  } catch (err: any) {
    console.error('Error in chatbot findOrderCodesByPhone:', err);
    return { error: 'Gagal menghubungi database. Silakan coba kembali nanti.' };
  }
}

export async function POST(request: Request) {
  try {
    // ── Rate Limiting: cek per IP ──────────────────────────────
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const rl = checkRateLimit(ip);

    if (!rl.allowed) {
      const retryAfterSec = Math.ceil((rl.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { error: `Terlalu banyak permintaan. Silakan tunggu ${retryAfterSec} detik.` },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfterSec),
            'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }
    // ──────────────────────────────────────────────────────────

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'API key is missing' },
        { status: 500 }
      );
    }

    // ── Input Validation & Sanitization ───────────────────────
    const body = await request.json().catch(() => ({}));
    const { valid, prompt, reason } = sanitizePrompt(body?.prompt);

    if (!valid) {
      return NextResponse.json({ error: reason }, { status: 400 });
    }
    // ──────────────────────────────────────────────────────────

    // 1. Load dynamic knowledge base from markdown files if they exist
    let markdownKnowledge = '';
    const dataDir = path.join(process.cwd(), 'src/data');

    try {
      const deliveryPath = path.join(dataDir, 'delivery_rules.md');
      if (fs.existsSync(deliveryPath)) {
        markdownKnowledge += `\n\n=== ATURAN PENGIRIMAN & ONGKIR (DOKUMEN PENJUAL) ===\n${fs.readFileSync(deliveryPath, 'utf8')}`;
      }
      const storePath = path.join(dataDir, 'store_info.md');
      if (fs.existsSync(storePath)) {
        markdownKnowledge += `\n\n=== INFORMASI TOKO & OPERASIONAL ===\n${fs.readFileSync(storePath, 'utf8')}`;
      }
      const menuPath = path.join(dataDir, 'menu_knowledge.md');
      if (fs.existsSync(menuPath)) {
        markdownKnowledge += `\n\n=== PENGETAHUAN MENU & TOPPING ===\n${fs.readFileSync(menuPath, 'utf8')}`;
      }
    } catch (e) {
      console.warn('Gagal memuat markdown knowledge base:', e);
    }

    // 2. Build system instructions
    const systemInstruction = `
      Anda adalah asisten cerdas untuk "Martabak & Terang Bulan A6 Nyuss".
      Jawab pelanggan secara ringkas, ramah, santun, dan profesional layaknya manusia yang tulus melayani.

      Pedoman perilaku Anda:
      - **Rekomendasi Menu**: Berikan menu Terang Bulan (kombinasi topping) atau Martabak Telur (pilihan daging ayam/bebek dari harga murah ke mahal).
      - **Kombinasi Topping**: Jika ditanya saran topping, berikan saran kombinasi rasa yang enak (seperti coklat + keju, pisang + coklat, dll).
      - **Bahasa**: Gunakan bahasa Indonesia yang santai tapi sopan (gunakan panggilan "Kak" atau "Kakak").
      - **Formatting**: Jangan pernah menggunakan tanda format asterisks (seperti * atau **) untuk membuat cetak tebal (bold) di dalam balasan status pesanan atau teks pembatalan. Tuliskan kata-kata secara biasa dan rapi agar ramah dibaca manusia.
      - **Ketentuan Pembatalan**: Pesanan hanya bisa dibatalkan secara mandiri di halaman Lacak Pesanan jika statusnya belum masuk ke tahap "Siap Diambil / Diantar" (atau status database: ready/completed).
      - **Lupa Kode Pesanan**: Jika pelanggan lupa atau kehilangan kode pesanan mereka:
        1. Arahkan mereka dengan sangat ramah untuk pergi ke halaman Lacak Pesanan (/tracking).
        2. Jelaskan bahwa di halaman tersebut ada kolom khusus "Cari Kode (Lupa Kode?)" di mana mereka tinggal memasukkan nomor HP yang digunakan saat memesan untuk memunculkan riwayat kode pesanan mereka.
        3. Jika pelanggan memberikan nomor HP langsung kepada Anda di obrolan ini, Anda bisa membantunya mencari menggunakan fungsi "findOrderCodesByPhone" untuk mencarikan kode pesanan terkait secara otomatis.
      
      Jika pengguna menanyakan status pesanan mereka atau ingin melacak pesanan (misal menyertakan kode order seperti A6-XXXXXX):
      1. Beritahukan dengan ramah bahwa Anda akan membantu mencarikan data tersebut.
      2. Gunakan fungsi "checkOrderStatus" untuk mengambil status rill pesanan dari database.
      3. Laporkan hasilnya secara ringkas and ramah kepada pelanggan berdasarkan data rill dari fungsi tersebut. Jangan pernah mengarang kode pesanan atau status.
      
      Pengetahuan tambahan dari admin toko (jika ada):
      ${markdownKnowledge || 'Toko buka Setiap Hari pukul 17:00 - 01:00. Alamat: Jl. Demak Surabaya.'}
    `;

    // 3. First Generation Call to Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        tools: [
          {
            functionDeclarations: [
              {
                name: 'checkOrderStatus',
                description: 'Mengecek status pesanan pelanggan secara realtime di database berdasarkan kode order unik (contoh: A6-20260101-1234)',
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    orderCode: {
                      type: Type.STRING,
                      description: 'Kode order lengkap pesanan pelanggan yang diawali dengan A6-'
                    }
                  },
                  required: ['orderCode']
                }
              },
              {
                name: 'findOrderCodesByPhone',
                description: 'Mencari kode pesanan pelanggan di database berdasarkan nomor HP yang digunakan saat melakukan pemesanan (contoh: 081234567890)',
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    customerPhone: {
                      type: Type.STRING,
                      description: 'Nomor HP lengkap pelanggan saat melakukan checkout'
                    }
                  },
                  required: ['customerPhone']
                }
              }
            ]
          }
        ]
      }
    });

    // 4. Handle Function Calling if requested by Gemini
    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      if (call.name === 'checkOrderStatus') {
        const { orderCode } = call.args as any;
        
        const candidateContent = response.candidates?.[0]?.content;
        if (!candidateContent) {
          return NextResponse.json({ message: 'Maaf, asisten sedang memproses permintaan. Silakan tanyakan kembali.' });
        }

        // Execute database query
        const orderResult = await getOrderStatus(orderCode);
        
        // Send the function response back to Gemini to generate the final response
        const secondResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            { role: 'user', parts: [{ text: prompt }] },
            candidateContent, // Send the model's function call request back
            {
              role: 'tool',
              parts: [
                {
                  functionResponse: {
                    name: 'checkOrderStatus',
                    response: { result: orderResult }
                  }
                }
              ]
            }
          ] as any,
          config: {
            systemInstruction: systemInstruction
          }
        });

        return NextResponse.json({ message: secondResponse.text });
      } else if (call.name === 'findOrderCodesByPhone') {
        const { customerPhone } = call.args as any;
        
        const candidateContent = response.candidates?.[0]?.content;
        if (!candidateContent) {
          return NextResponse.json({ message: 'Maaf, asisten sedang memproses permintaan. Silakan tanyakan kembali.' });
        }

        // Execute database query
        const searchResult = await findOrderCodesByPhone(customerPhone);
        
        // Send the function response back to Gemini to generate the final response
        const secondResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            { role: 'user', parts: [{ text: prompt }] },
            candidateContent, // Send the model's function call request back
            {
              role: 'tool',
              parts: [
                {
                  functionResponse: {
                    name: 'findOrderCodesByPhone',
                    response: { result: searchResult }
                  }
                }
              ]
            }
          ] as any,
          config: {
            systemInstruction: systemInstruction
          }
        });

        return NextResponse.json({ message: secondResponse.text });
      }
    }

    // Standard conversational response
    return NextResponse.json({ message: response.text });
  } catch (error: any) {
    console.error('AI Chatbot API Error (Graceful Fallback):', error);
    
    // Graceful fallback message to assist user and avoid 500 error page
    const fallbackMessage = 
      "Halo! Mohon maaf, saat ini asisten AI kami sedang mengalami kendala koneksi atau batas kuota. " +
      "Untuk bantuan langsung mengenai pesanan, ketersediaan menu, atau status order, silakan hubungi " +
      "admin kami via WhatsApp di nomor +6287811123482. Terima kasih atas pengertiannya! 🙏";
      
    return NextResponse.json({ message: fallbackMessage });
  }
}

```

---

### File: `apps/customer/app/api/orders/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { db, schema } from '@taj-saas/db';
import { eq, inArray } from 'drizzle-orm';
import Ably from 'ably';

const VALID_DELIVERY_FEES = new Set([0, 10000, 15000, 20000]);

interface PromoConfig {
  type: 'percent' | 'fixed';
  value: number;
  minOrder: number;
  targetCategory: string; // Category slug or 'all'
}

const PROMO_CODES: Record<string, PromoConfig> = {
  ANNIV25:    { type: 'percent', value: 25, minOrder: 50000, targetCategory: 'terang-bulan' },
  WEBAPPNEW:  { type: 'fixed',   value: 5000, minOrder: 40000, targetCategory: 'all' },
  SATURDAY15: { type: 'percent', value: 15, minOrder: 0,     targetCategory: 'terang-bulan' },
};

export interface OrderItemPayload {
  menuItemSlug: string;
  menuItemName: string;
  variantName?: string;
  variantPriceModifier: number;
  quantity: number;
  note?: string;
}

export interface CreateOrderRequest {
  items: OrderItemPayload[];
  customerName: string;
  customerPhone: string;
  orderType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  deliveryFee: number;
  promoCode?: string;
  paymentMethod: 'cod' | 'qris';
}

function generateOrderCode(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `A6-${date}-${rand}`;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: CreateOrderRequest = await request.json();
    const { items, customerName, customerPhone, orderType, deliveryAddress, deliveryFee, promoCode, paymentMethod } = body;

    // Get tenant from headers
    const tenantSlug = request.headers.get('x-tenant-slug') || 'a6-nyuss';
    
    // Find tenant
    const tenantResult = await db.select().from(schema.tenants).where(eq(schema.tenants.slug, tenantSlug)).limit(1);
    const tenant = tenantResult[0];
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant tidak ditemukan.' }, { status: 404 });
    }

    // Basic input validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Keranjang belanja kosong.' }, { status: 400 });
    }
    if (!customerName?.trim() || customerName.trim().length < 2) {
      return NextResponse.json({ error: 'Nama pemesan tidak valid.' }, { status: 400 });
    }
    if (!customerPhone?.trim() || !/^(08|\+62)\d{8,12}$/.test(customerPhone.replace(/\s/g, ''))) {
      return NextResponse.json({ error: 'Nomor HP tidak valid.' }, { status: 400 });
    }
    if (!['pickup', 'delivery'].includes(orderType)) {
      return NextResponse.json({ error: 'Tipe order tidak valid.' }, { status: 400 });
    }
    if (orderType === 'delivery' && !deliveryAddress?.trim()) {
      return NextResponse.json({ error: 'Alamat pengiriman wajib diisi untuk delivery.' }, { status: 400 });
    }
    if (!['cod', 'qris'].includes(paymentMethod)) {
      return NextResponse.json({ error: 'Metode pembayaran tidak valid.' }, { status: 400 });
    }

    const claimedFee = orderType === 'pickup' ? 0 : deliveryFee;
    if (!VALID_DELIVERY_FEES.has(claimedFee)) {
      return NextResponse.json(
        { error: `Ongkos kirim tidak valid: Rp${claimedFee}. Hubungi admin jika ada masalah.` },
        { status: 400 }
      );
    }

    // Fetch items from DB to prevent client price tampering
    const itemSlugs = items.map(i => i.menuItemSlug);
    const dbItems = await db.select()
      .from(schema.menuItems)
      .where(inArray(schema.menuItems.slug, itemSlugs));

    // Get categories to map IDs to slugs
    const dbCategories = await db.select().from(schema.categories).where(eq(schema.categories.tenantId, tenant.id));
    const categoryMap = new Map(dbCategories.map(c => [c.id, c.slug]));

    const dbItemMap = new Map(dbItems.map(item => [item.slug, {
      id: item.id,
      price: Number(item.price),
      isAvailable: item.isAvailable,
      categorySlug: item.categoryId ? categoryMap.get(item.categoryId) : 'minuman'
    }]));

    const MAX_VARIANT_MODIFIER = 25000;
    let subtotal = 0;
    const validatedItems: any[] = [];

    for (const item of items) {
      const dbItem = dbItemMap.get(item.menuItemSlug);

      if (!dbItem) {
        return NextResponse.json(
          { error: `Menu "${item.menuItemName}" tidak ditemukan di sistem.` },
          { status: 400 }
        );
      }
      if (!dbItem.isAvailable) {
        return NextResponse.json(
          { error: `Menu "${item.menuItemName}" sedang tidak tersedia.` },
          { status: 400 }
        );
      }
      if (item.quantity < 1 || item.quantity > 99) {
        return NextResponse.json({ error: 'Jumlah item tidak valid.' }, { status: 400 });
      }

      const safeModifier = Math.min(
        Math.max(0, Number(item.variantPriceModifier) || 0),
        MAX_VARIANT_MODIFIER
      );

      const unitPrice = dbItem.price + safeModifier;
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      validatedItems.push({
        menuItemId: dbItem.id,
        menuItemName: item.menuItemName,
        variantName: item.variantName || null,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
        categorySlug: dbItem.categorySlug,
      });
    }

    let promoDiscount = 0;

    if (promoCode) {
      const cleanCode = promoCode.trim().toUpperCase().slice(0, 30);
      const promo = PROMO_CODES[cleanCode];

      if (promo && subtotal >= promo.minOrder) {
        if (promo.targetCategory === 'all') {
          promoDiscount = promo.type === 'fixed'
            ? promo.value
            : Math.round(subtotal * (promo.value / 100));
        } else {
          const categoryTotal = validatedItems
            .filter((i) => i.categorySlug === promo.targetCategory)
            .reduce((sum, i) => sum + i.totalPrice, 0);

          const base = categoryTotal || subtotal;
          promoDiscount = promo.type === 'fixed'
            ? Math.min(promo.value, base)
            : Math.round(base * (promo.value / 100));
        }
      }
    }

    const total = Math.max(0, subtotal + claimedFee - promoDiscount);
    const orderCode = generateOrderCode();

    // 1. Save to Database using Transaction
    const orderResult = await db.transaction(async (tx) => {
      const [newOrder] = await tx.insert(schema.orders).values({
        tenantId: tenant.id,
        orderCode,
        customerName,
        customerPhone,
        deliveryType: orderType,
        deliveryAddress: deliveryAddress || null,
        subtotal: String(subtotal),
        totalPrice: String(total),
        status: 'received',
        paymentMethod,
        paymentStatus: 'pending',
        notes: items.map(i => i.note).filter(Boolean).join(' | ') || null,
      }).returning();

      const orderItemValues = validatedItems.map(item => ({
        orderId: newOrder.id,
        menuItemId: item.menuItemId,
        menuItemName: item.menuItemName,
        variantName: item.variantName,
        quantity: item.quantity,
        unitPrice: String(item.unitPrice),
        totalPrice: String(item.totalPrice),
      }));

      await tx.insert(schema.orderItems).values(orderItemValues);

      return newOrder;
    });

    // 2. Publish Realtime Message to Ably (Serverless REST)
    const ablyKey = process.env.ABLY_API_KEY;
    if (ablyKey) {
      try {
        const ably = new Ably.Rest({ key: ablyKey });
        const channel = ably.channels.get(`orders:${tenantSlug}`);
        await channel.publish('new-order', {
          order: {
            ...orderResult,
            items: validatedItems
          }
        });
        console.log('[Ably] Order event published successfully:', orderCode);
      } catch (ablyErr) {
        console.error('[Ably] Failed to publish order event:', ablyErr);
      }
    }

    return NextResponse.json({
      success: true,
      orderCode,
      subtotal,
      deliveryFee: claimedFee,
      promoDiscount,
      total,
    }, { status: 201 });

  } catch (err: any) {
    console.error('[orders/route] Unexpected error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem. Coba lagi.' }, { status: 500 });
  }
}

```

---

### File: `apps/customer/app/api/test-sentry-server/route.ts`

```typescript
import { NextResponse } from "next/server";

export async function GET() {
  console.log("Memicu server-side error untuk Sentry...");
  throw new Error("Sentry Server-Side Test Error dari Customer App!");
  return NextResponse.json({ success: true });
}

```

---

### File: `apps/customer/app/api/validate-promo/route.ts`

```typescript
// API Route: Server-Side Promo Code Validation
// Path: src/app/api/validate-promo/route.ts
//
// ✅ Kode promo HANYA ada di server — tidak pernah ter-bundle ke browser.
// Hacker tidak bisa membaca, bypass, atau memanipulasi promo dari DevTools.

import { NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────
// KONFIGURASI PROMO — Hanya bisa diakses dari server.
// Untuk keamanan lebih lanjut, pindahkan ke tabel database
// `promo_codes` agar bisa dikelola dari admin panel.
// ─────────────────────────────────────────────────────────
interface PromoConfig {
  type: 'percent' | 'fixed';
  value: number;             // Persentase (0–100) atau nominal Rupiah
  minOrder: number;          // Minimum subtotal untuk berlaku
  targetCategory: 'terang-bulan' | 'all'; // Kategori yang mendapat diskon
  description: string;
}

const PROMO_CODES: Record<string, PromoConfig> = {
  ANNIV25: {
    type: 'percent',
    value: 25,
    minOrder: 50000,
    targetCategory: 'terang-bulan',
    description: 'Diskon 25% untuk semua Terang Bulan (min. Rp 50.000)',
  },
  WEBAPPNEW: {
    type: 'fixed',
    value: 5000,
    minOrder: 40000,
    targetCategory: 'all',
    description: 'Potongan Rp 5.000 (gratis Es Teh) (min. Rp 40.000)',
  },
  SATURDAY15: {
    type: 'percent',
    value: 15,
    minOrder: 0,
    targetCategory: 'terang-bulan',
    description: 'Diskon 15% untuk semua Terang Bulan',
  },
};
// ─────────────────────────────────────────────────────────

export interface ValidatePromoRequest {
  code: string;
  subtotal: number;
  // Items minimal: slug + totalPrice untuk hitung diskon per kategori
  items: Array<{
    slug: string;
    category: string;
    totalPrice: number;
  }>;
}

export interface ValidatePromoResponse {
  valid: boolean;
  message: string;
  discountAmount: number;
  promoCode: string;
  description?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: ValidatePromoRequest = await request.json();
    const { code, subtotal, items } = body;

    // ── Input validation ──
    if (!code || typeof code !== 'string') {
      return NextResponse.json<ValidatePromoResponse>({
        valid: false,
        message: 'Kode promo tidak valid.',
        discountAmount: 0,
        promoCode: '',
      });
    }

    const cleanCode = code.trim().toUpperCase().slice(0, 30); // max 30 chars
    const promo = PROMO_CODES[cleanCode];

    if (!promo) {
      return NextResponse.json<ValidatePromoResponse>({
        valid: false,
        message: 'Kode promo tidak ditemukan atau sudah kedaluwarsa.',
        discountAmount: 0,
        promoCode: cleanCode,
      });
    }

    // ── Minimum order check ──
    if (subtotal < promo.minOrder) {
      return NextResponse.json<ValidatePromoResponse>({
        valid: false,
        message: `Minimum pembelian untuk promo ini adalah Rp ${promo.minOrder.toLocaleString('id-ID')}.`,
        discountAmount: 0,
        promoCode: cleanCode,
      });
    }

    // ── Calculate discount amount ──
    let discountAmount = 0;

    if (promo.targetCategory === 'all') {
      // Diskon berlaku untuk semua item
      if (promo.type === 'fixed') {
        discountAmount = promo.value;
      } else {
        discountAmount = Math.round(subtotal * (promo.value / 100));
      }
    } else {
      // Diskon hanya untuk kategori tertentu (misal: terang-bulan)
      const categoryTotal = items
        .filter(
          (item) =>
            item.category === promo.targetCategory ||
            item.slug.includes(promo.targetCategory)
        )
        .reduce((sum, item) => sum + item.totalPrice, 0);

      if (promo.type === 'fixed') {
        discountAmount = Math.min(promo.value, categoryTotal);
      } else {
        discountAmount = Math.round(categoryTotal * (promo.value / 100));
      }
    }

    return NextResponse.json<ValidatePromoResponse>({
      valid: true,
      message: `Promo ${cleanCode} berhasil diterapkan!`,
      discountAmount,
      promoCode: cleanCode,
      description: promo.description,
    });
  } catch {
    return NextResponse.json<ValidatePromoResponse>(
      {
        valid: false,
        message: 'Terjadi kesalahan saat memvalidasi promo.',
        discountAmount: 0,
        promoCode: '',
      },
      { status: 500 }
    );
  }
}

```

---

### File: `apps/customer/app/cart/page.tsx`

```tsx
"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Trash2, Minus, Plus, ShoppingCart, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/data/menu';


export default function Cart() {
  const { items, removeItem, updateQuantity, generalNote, setGeneralNote, getTotalPrice, getTotalItems } = useCartStore();
  const router = useRouter();
  const subtotal = getTotalPrice();

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#8E0E0E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Memuat keranjang...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 px-4">
        <div className="max-w-2xl mx-auto py-6">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-[#8E0E0E] transition-colors mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
            <span className="text-sm font-bold">Kembali</span>
          </button>

          <div className="text-center py-8">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">Keranjang Kosong</h2>
            <p className="text-gray-550 mb-8">Belum ada menu yang dipilih. Yuk, pilih martabak favoritmu!</p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white font-bold rounded-2xl hover:from-[#9C1B0B] hover:to-[#D94708] transition-all"
            >
              Lihat Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-[#8E0E0E] transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
          <span className="text-sm font-bold">Kembali</span>
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Keranjang</h1>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {getTotalItems()} item
          </span>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {items.map((item) => {
            const variantSummary = item.selectedVariants
              .map((v) => v.option.name)
              .join(', ');
            return (
              <div key={item.cartId} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex gap-3">
                  {/* Image */}
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                  />
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug">
                      {item.menuItem.name}
                    </h3>
                    {variantSummary && (
                      <p className="text-xs text-gray-500 mt-0.5">{variantSummary}</p>
                    )}
                    {item.note && (
                      <p className="text-xs text-gray-400 mt-0.5 italic">Catatan: {item.note}</p>
                    )}
                    <p className="font-bold text-[#8E0E0E] mt-1">{formatPrice(item.totalPrice)}</p>

                    {/* Quantity + Delete */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-200 hover:border-[#8E0E0E] transition-colors"
                        >
                          <Minus className="w-3 h-3 text-gray-600" />
                        </button>
                        <span className="w-6 text-center font-bold text-gray-900 text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#8E0E0E] hover:bg-[#9C1B0B] transition-colors"
                        >
                          <Plus className="w-3 h-3 text-white" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.cartId)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* General Note */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <label className="block font-semibold text-gray-800 mb-2 text-sm">
            Catatan untuk Seluruh Pesanan
          </label>
          <textarea
            value={generalNote}
            onChange={(e) => setGeneralNote(e.target.value)}
            placeholder="Catatan umum, contoh: mohon dikemas rapi, jangan terlalu manis, dll..."
            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#8E0E0E] resize-none"
            rows={3}
          />
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <h3 className="font-bold text-gray-800 mb-4">Ringkasan Pesanan</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal ({getTotalItems()} item)</span>
              <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Ongkir</span>
              <span className="text-gray-400 text-xs italic">(Dihitung saat checkout)</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="font-bold text-gray-900">Total Sementara</span>
              <span className="font-black text-[#8E0E0E] text-lg">{formatPrice(subtotal)}</span>
            </div>
          </div>
        </div>

        {/* Add more items */}
        <Link
          href="/menu"
          className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-[#8E0E0E] hover:text-[#8E0E0E] transition-colors text-sm font-medium mb-6"
        >
          + Tambah Menu Lain
        </Link>

        {/* Checkout CTA */}
        <button
          onClick={() => router.push('/checkout')}
          className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white rounded-2xl font-bold text-base hover:from-[#9C1B0B] hover:to-[#D94708] transition-all shadow-lg hover:shadow-xl"
        >
          <span>Lanjut ke Checkout</span>
          <div className="flex items-center gap-2">
            <span className="font-black">{formatPrice(subtotal)}</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
  );
}

```

---

### File: `apps/customer/app/catering/page.tsx`

```tsx
"use client";
import { useState } from 'react';
import { CheckCircle, Send, Package, Truck, DollarSign, MessageSquare, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const packages = [
  {
    name: 'Paket Mini',
    quantity: '10 Box',
    price: 'Rp 450.000',
    priceNote: 'Rp 45.000/box',
    items: ['Terang Bulan pilihan x7', 'Martabak Telur (Ayam/Bebek) x3'],
    highlight: false,
  },
  {
    name: 'Paket Medium',
    quantity: '20 Box',
    price: 'Rp 850.000',
    priceNote: 'Rp 42.500/box',
    items: ['Terang Bulan pilihan x14', 'Martabak Telur (Ayam/Bebek) x6'],
    highlight: true,
  },
  {
    name: 'Paket Besar',
    quantity: '50 Box',
    price: 'Rp 1.900.000',
    priceNote: 'Rp 38.000/box',
    items: ['Terang Bulan pilihan x35', 'Martabak Telur (Ayam/Bebek) x15'],
    highlight: false,
  },
];

export default function Catering() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    quantity: '',
    date: '',
    event: '',
    note: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.quantity || !form.date) {
      toast.error('Mohon lengkapi data yang diperlukan!');
      return;
    }
    // Build WhatsApp message
    const msg = `Halo A6 Nyuss! Saya ingin inquiry catering:%0A%0A` +
      `Nama: ${form.name}%0A` +
      `Perusahaan/Instansi: ${form.company || '-'}%0A` +
      `No. HP: ${form.phone}%0A` +
      `Jumlah Box: ${form.quantity}%0A` +
      `Tanggal Event: ${form.date}%0A` +
      `Jenis Event: ${form.event || '-'}%0A` +
      `Catatan: ${form.note || '-'}%0A%0A` +
      `Mohon info lebih lanjut. Terima kasih!`;
    window.open(`https://wa.me/6287811123482?text=${msg}`, '_blank');
    setSubmitted(true);
    toast.success('Inquiry terkirim! Tim kami akan segera menghubungi Anda.');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#8E0E0E] via-[#A9240E] to-[#E05009] py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="text-[200px] font-black text-white select-none text-center leading-none">A6</div>
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white text-sm font-medium mb-5">
            Untuk Event & Corporate
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Catering &<br />Corporate Order
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Hadirkan cita rasa A6 Nyuss untuk acara special Anda. 
            Cocok untuk gathering, seminar, ulang tahun, dan acara korporat.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Why Catering */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { icon: '/Halal logo.jfif', label: 'Halal & Higienis', isImg: true },
            { icon: 'Package', label: 'Dikemas Rapi' },
            { icon: 'Truck', label: 'Bisa Delivery' },
            { icon: 'DollarSign', label: 'Harga Spesial' },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
              <div className="h-10 flex items-center justify-center mb-2 text-[#E05009]">
                {item.isImg ? (
                  <img src={item.icon} alt={item.label} className="w-10 h-10 object-contain rounded" />
                ) : (
                  <>
                    {item.icon === 'Package' && <Package className="w-8 h-8" />}
                    {item.icon === 'Truck' && <Truck className="w-8 h-8" />}
                    {item.icon === 'DollarSign' && <DollarSign className="w-8 h-8" />}
                  </>
                )}
              </div>
              <p className="font-semibold text-gray-700 text-sm">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Packages */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-8">Paket Catering</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-2xl overflow-hidden shadow-lg ${
                  pkg.highlight
                    ? 'bg-gradient-to-b from-[#8E0E0E] to-[#E05009] text-white ring-4 ring-[#E05009]/30'
                    : 'bg-white'
                }`}
              >
                {pkg.highlight && (
                  <div className="bg-yellow-400 text-[#8E0E0E] text-xs font-black text-center py-1 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-[#8E0E0E] text-[#8E0E0E]" /> PALING POPULER
                  </div>
                )}
                <div className="p-6">
                  <h3 className={`text-xl font-black mb-1 ${pkg.highlight ? 'text-white' : 'text-gray-900'}`}>
                    {pkg.name}
                  </h3>
                  <p className={`text-3xl font-black mb-0.5 ${pkg.highlight ? 'text-white' : 'text-[#8E0E0E]'}`}>
                    {pkg.quantity}
                  </p>
                  <p className={`text-sm mb-4 ${pkg.highlight ? 'text-white/80' : 'text-gray-500'}`}>{pkg.priceNote}</p>
                  <div className={`text-2xl font-black mb-5 ${pkg.highlight ? 'text-yellow-300' : 'text-gray-900'}`}>
                    {pkg.price}
                  </div>
                  <ul className="space-y-2 mb-6">
                    {pkg.items.map((item) => (
                      <li key={item} className={`flex items-center gap-2 text-sm ${pkg.highlight ? 'text-white/90' : 'text-gray-600'}`}>
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${pkg.highlight ? 'text-yellow-300' : 'text-green-500'}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">* Harga sudah termasuk kemasan. Ongkir menyesuaikan lokasi.</p>
        </div>

        {/* Inquiry Form */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#8E0E0E] to-[#E05009] p-6">
            <h2 className="text-2xl font-black text-white">Form Inquiry Catering</h2>
            <p className="text-white/80 text-sm mt-1">Isi form di bawah dan tim kami akan menghubungi Anda segera!</p>
          </div>

          {submitted ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Inquiry Terkirim!</h3>
              <p className="text-gray-500 text-sm">WhatsApp sudah terbuka. Tim kami akan segera merespons dalam 1×24 jam.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Nama lengkap"
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8E0E0E]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Perusahaan / Instansi</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    placeholder="Nama perusahaan (opsional)"
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8E0E0E]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8E0E0E]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Box <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => handleChange('quantity', e.target.value)}
                    placeholder="Minimal 10 box"
                    min="10"
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8E0E0E]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Event <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8E0E0E]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Event</label>
                  <input
                    type="text"
                    value={form.event}
                    onChange={(e) => handleChange('event', e.target.value)}
                    placeholder="Ulang tahun, seminar, gathering..."
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8E0E0E]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan</label>
                <textarea
                  value={form.note}
                  onChange={(e) => handleChange('note', e.target.value)}
                  placeholder="Permintaan khusus, preferensi menu, dll..."
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#8E0E0E] resize-none"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white rounded-2xl font-bold hover:from-[#9C1B0B] hover:to-[#D94708] transition-all shadow-lg"
              >
                <Send className="w-5 h-5" />
                Kirim Inquiry via WhatsApp
              </button>
            </form>
          )}
        </div>

        {/* Direct WhatsApp */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm mb-3">Atau konsultasi langsung:</p>
          <a
            href="https://wa.me/6287811123482?text=Halo%20A6%20Nyuss%2C%20saya%20ingin%20konsultasi%20untuk%20catering"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl transition-all hover:scale-105 shadow-lg"
          >
            <MessageSquare className="w-5 h-5" /> Chat WhatsApp Sekarang
          </a>
        </div>
      </div>
    </div>
  );
}

```

---

### File: `apps/customer/app/checkout/page.tsx`

```tsx
"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';

import { AlertCircle, ShoppingBag, Truck, Ticket, Banknote, QrCode, UploadCloud, MapPin, ClipboardList, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore, useOrderStore, DELIVERY_ZONES } from '@/store/cartStore';
import { formatPrice } from '@/data/menu';
import { getStoreSettings } from '@/lib/db/menuService';
import type { DeliveryMapResult } from '@/components/DeliveryMap';

// Dynamically import the map component (client-side only — no SSR for Leaflet)
const DeliveryMap = dynamic(() => import('@/components/DeliveryMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] rounded-2xl bg-gray-100 flex items-center justify-center border-2 border-gray-200">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-[#8E0E0E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-500">Memuat peta interaktif...</p>
      </div>
    </div>
  ),
});

export default function Checkout() {
  const router = useRouter();
  const {
    items,
    generalNote,
    getTotalPrice,
    clearCart,
    promoCode,
    setServerValidatedPromo,
    clearPromoCode,
    serverPromoDiscount,
  } = useCartStore();
  const { setCurrentOrder } = useOrderStore();
  const [mounted, setMounted] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  useEffect(() => {
    setMounted(true);
    getStoreSettings()
      .then((settings) => {
        setIsStoreOpen(settings.is_open);
      })
      .catch((err) => {
        console.error('Error fetching store settings:', err);
      });
  }, []);

  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressNote, setAddressNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'transfer'>('cod');
  const [agreed, setAgreed] = useState(false);
  const [agreedCancel, setAgreedCancel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Map-derived delivery info (replaces manual zone selection)
  const [mapResult, setMapResult] = useState<DeliveryMapResult | null>(null);
  const [deliveryZone, setDeliveryZone] = useState(0); // fallback index for Supabase

  // When map resolves an address (reverse geocoding), fill the textarea
  const handleAddressResolved = useCallback((resolvedAddress: string) => {
    setAddress(resolvedAddress);
    setErrors((prev) => ({ ...prev, address: '', mapLocation: '' }));
  }, []);

  const [createdOrderCode, setCreatedOrderCode] = useState<string | null>(null);
  const [serverConfirmedTotal, setServerConfirmedTotal] = useState<number>(0);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // When the map reports a result, update state
  const handleMapLocationSelect = useCallback((result: DeliveryMapResult | null) => {
    setMapResult(result);
    if (result && !result.isOutOfRange) {
      // Map fee to zone index for backward compatibility
      const zoneIdx = DELIVERY_ZONES.findIndex((z) => z.fee === result.fee);
      setDeliveryZone(zoneIdx >= 0 ? zoneIdx : 0);
    }
    // Clear map-related errors when user picks a location
    setErrors((prev) => ({ ...prev, mapLocation: '' }));
  }, []);

  const handleUploadProof = async (orderCode: string) => {
    if (!uploadFile) {
      toast.error('Silakan pilih gambar bukti transfer terlebih dahulu');
      return;
    }
    if (uploadFile.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB. Silakan pilih file yang lebih kecil.');
      return;
    }
    if (!uploadFile.type.startsWith('image/')) {
      toast.error('File harus berupa gambar (JPG, PNG, WEBP).');
      return;
    }
    setUploading(true);
    try {
      // Simulate delay for uploading proof
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Bukti transfer berhasil diunggah! Menunggu verifikasi admin.');
      clearCart();
      setShowQrisModal(false);
      router.push(`/tracking/${orderCode}`);
    } catch (err: any) {
      console.error('Error uploading payment proof:', err);
      toast.error(`Gagal mengunggah bukti: ${err.message || 'Terjadi kesalahan'}`);
    } finally {
      setUploading(false);
    }
  };

  const handlePayLater = () => {
    clearCart();
    setShowQrisModal(false);
    router.push('/tracking?new=true');
  };

  const subtotal = getTotalPrice();
  const deliveryFee = orderType === 'delivery' ? (mapResult && !mapResult.isOutOfRange ? mapResult.fee : 0) : 0;
  // Gunakan diskon yang dikonfirmasi server — bukan kalkulasi client-side
  const promoDiscount = serverPromoDiscount;
  const total = Math.max(0, subtotal + deliveryFee - promoDiscount);

  // State untuk loading promo validation
  const [applyingPromo, setApplyingPromo] = useState(false);

  // Handler apply promo: panggil server API, bukan validasi client-side
  const handleApplyPromo = useCallback(async (code: string) => {
    if (!code.trim()) {
      toast.error('Silakan ketik kode kupon terlebih dahulu');
      return;
    }
    setApplyingPromo(true);
    try {
      const res = await fetch('/api/validate-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          subtotal,
          items: items.map((i) => ({
            slug: i.menuItem.slug,
            category: i.menuItem.category,
            totalPrice: i.totalPrice,
          })),
        }),
      });
      const data = await res.json();
      if (data.valid) {
        setServerValidatedPromo(data.promoCode, data.discountAmount);
        toast.success(data.message);
      } else {
        toast.error(data.message || 'Kode promo tidak valid.');
      }
    } catch {
      toast.error('Gagal memvalidasi promo. Periksa koneksi internet Anda.');
    } finally {
      setApplyingPromo(false);
    }
  }, [subtotal, items, setServerValidatedPromo]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) newErrors.name = 'Nama minimal 2 karakter';
    if (!phone.trim() || !/^(08|\+62)\d{8,12}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format nomor HP tidak valid (contoh: 081234567890)';
    }
    if (orderType === 'delivery') {
      if (!address.trim()) newErrors.address = 'Alamat pengiriman wajib diisi';
      if (!mapResult) newErrors.mapLocation = 'Silakan tandai lokasi Anda di peta terlebih dahulu';
      if (mapResult?.isOutOfRange) newErrors.mapLocation = 'Lokasi Anda berada di luar jangkauan pengiriman (maks. 10 km)';
    }
    if (!agreed) newErrors.agreed = 'Harap setujui Syarat & Ketentuan';
    if (!agreedCancel) newErrors.agreedCancel = 'Harap setujui kebijakan pembatalan pesanan';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStoreOpen) {
      toast.error('Maaf, gerai kami saat ini sedang tutup. Tidak dapat memproses pesanan.');
      return;
    }
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Mohon lengkapi semua data yang diperlukan');
      return;
    }
    setLoading(true);
    try {
      // ── Kirim ke server API — harga dihitung ulang dari database ──
      const fullAddress = orderType === 'delivery'
        ? `${address}${addressNote ? ` (${addressNote})` : ''}${mapResult ? ` [Koordinat: ${mapResult.lat.toFixed(6)},${mapResult.lng.toFixed(6)}]` : ''}`
        : undefined;

      // Siapkan payload: hanya slug + quantity + variant modifier (NO harga dari frontend)
      const orderPayload = {
        items: items.map((item) => ({
          menuItemSlug: item.menuItem.slug,
          menuItemName: item.menuItem.name,
          variantName: item.selectedVariants.length > 0
            ? item.selectedVariants.map((v) => v.option.name).join(', ')
            : undefined,
          // Total modifier dari variant (extra topping Rp5.000, dll) — server akan clamp ke batas aman
          variantPriceModifier: item.selectedVariants.reduce((sum, v) => sum + v.option.priceModifier, 0),
          quantity: item.quantity,
        })),
        customerName: name,
        customerPhone: phone,
        orderType,
        deliveryAddress: fullAddress,
        deliveryFee: orderType === 'delivery' ? (mapResult?.fee ?? 0) : 0,
        promoCode: promoCode || undefined,
        paymentMethod,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Gagal membuat pesanan');
      }

      // Gunakan total yang dikonfirmasi server (bukan kalkulasi client)
      const serverTotal = result.total;
      const serverOrderCode = result.orderCode;

      const order = {
        orderCode: serverOrderCode,
        items: [...items],
        customerName: name,
        customerPhone: phone,
        orderType,
        deliveryAddress: orderType === 'delivery' ? address : undefined,
        addressNote: orderType === 'delivery' ? addressNote : undefined,
        generalNote: promoCode ? `[Kupon: ${promoCode}] ${generalNote || ''}` : generalNote,
        paymentMethod,
        subtotal: result.subtotal,
        deliveryFee: result.deliveryFee,
        total: serverTotal,
        status: 'received' as const,
        createdAt: new Date().toISOString(),
        estimatedTime: orderType === 'pickup' ? 20 : 40,
        promoCode: promoCode || undefined,
        promoDiscount: result.promoDiscount || undefined,
      };

      setCurrentOrder(order);

      if (paymentMethod === 'transfer') {
        setCreatedOrderCode(serverOrderCode);
        setServerConfirmedTotal(serverTotal);
        setShowQrisModal(true);
        toast.success('Pesanan dibuat! Silakan selesaikan pembayaran.');
      } else {
        clearCart();
        toast.success('Pesanan berhasil dibuat!');
        router.push('/tracking?new=true');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(`Gagal mengirim pesanan: ${error.message || 'Terjadi masalah koneksi'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#8E0E0E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Memuat checkout...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center px-4 py-16">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Keranjang Kosong</h2>
          <p className="text-gray-500 mb-6">Silakan pilih menu terlebih dahulu.</p>
          <Link href="/menu" className="px-6 py-3 bg-[#8E0E0E] text-white rounded-xl font-semibold">Lihat Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <ClipboardList className="w-7 h-7 text-[#8E0E0E]" /> Checkout
        </h1>

        {/* Store Hours */}
        {isStoreOpen ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <span className="text-green-700 text-sm font-medium">Toko sedang buka. Pesanan akan segera diproses!</span>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span className="text-red-700 text-sm font-semibold">Maaf, gerai kami saat ini sedang tutup. Pemesanan online dinonaktifkan sementara.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Order Type */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Tipe Pesanan</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: 'pickup', icon: <ShoppingBag className="w-5 h-5 text-purple-600" />, label: 'Pickup', desc: 'Ambil sendiri di toko' },
                { val: 'delivery', icon: <Truck className="w-5 h-5 text-blue-600" />, label: 'Delivery', desc: 'Diantar ke alamat' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setOrderType(opt.val as 'pickup' | 'delivery')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    orderType === opt.val ? 'border-[#8E0E0E] bg-[#8E0E0E]/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="mb-2">{opt.icon}</div>
                  <p className="font-semibold text-gray-900 text-sm">{opt.label}</p>
                  <p className="text-xs text-gray-500">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Data Pemesan</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pemesan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
                  placeholder="Masukkan nama lengkap"
                  className={`w-full border-2 rounded-xl p-3 text-sm focus:outline-none transition-colors text-gray-900 bg-white placeholder-gray-400 ${
                    errors.name ? 'border-red-400' : 'border-gray-200 focus:border-[#8E0E0E]'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: '' })); }}
                  placeholder="Contoh: 081234567890"
                  className={`w-full border-2 rounded-xl p-3 text-sm focus:outline-none transition-colors text-gray-900 bg-white placeholder-gray-400 ${
                    errors.phone ? 'border-red-400' : 'border-gray-200 focus:border-[#8E0E0E]'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
              </div>

              {/* Delivery-only fields */}
              {orderType === 'delivery' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alamat Pengiriman <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: '' })); }}
                      placeholder="Jl. Nama Jalan No. XX, Kelurahan, Kecamatan..."
                      className={`w-full border-2 rounded-xl p-3 text-sm focus:outline-none resize-none transition-colors text-gray-900 bg-white placeholder-gray-400 ${
                        errors.address ? 'border-red-400' : 'border-gray-200 focus:border-[#8E0E0E]'
                      }`}
                      rows={3}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patokan / Catatan Alamat</label>
                    <input
                      type="text"
                      value={addressNote}
                      onChange={(e) => setAddressNote(e.target.value)}
                      placeholder="Contoh: Depan masjid, pagar biru, RT 03/RW 05"
                      className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#8E0E0E] text-gray-900 bg-white placeholder-gray-400"
                    />
                  </div>

                  {/* === INTERACTIVE MAP SECTION === */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-blue-600" /> Tandai Lokasi di Peta <span className="text-red-500">*</span>
                    </label>
                    <DeliveryMap
                      onLocationSelect={handleMapLocationSelect}
                      onAddressResolved={handleAddressResolved}
                      searchAddress={address}
                    />
                    {errors.mapLocation && (
                      <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{errors.mapLocation}
                      </p>
                    )}
                  </div>
                  {/* =============================== */}
                </>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Ringkasan Pesanan</h3>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.cartId} className="flex justify-between items-start text-sm">
                  <div className="flex-1 pr-3">
                    <p className="font-medium text-gray-800">{item.menuItem.name}</p>
                    {item.selectedVariants.length > 0 && (
                      <p className="text-xs text-gray-500">{item.selectedVariants.map(v => v.option.name).join(', ')}</p>
                    )}
                    <p className="text-xs text-gray-400">x{item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900 flex-shrink-0">{formatPrice(item.totalPrice)}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Ongkir{mapResult && !mapResult.isOutOfRange ? ` (${mapResult.zoneName})` : ''}
                  </span>
                  <span className="font-semibold">
                    {mapResult
                      ? (mapResult.isOutOfRange ? <span className="text-red-500 text-xs">Di luar jangkauan</span> : formatPrice(mapResult.fee))
                      : <span className="text-gray-400 text-xs italic">Pilih lokasi di peta</span>}
                  </span>
                </div>
              )}
              {orderType === 'pickup' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ongkir</span>
                  <span className="font-semibold text-green-600">GRATIS</span>
                </div>
              )}
              {promoDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-semibold">
                  <span>Potongan Promo ({promoCode})</span>
                  <span>-{formatPrice(promoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base border-t pt-2">
                <span>TOTAL</span>
                <span className="text-[#8E0E0E] text-xl">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          {/* Promo Code */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[#8E0E0E]" /> Kode Promo / Kupon
            </h3>
            {promoCode ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
                <div>
                  <p className="text-xs text-green-700 font-bold">Kupon Aktif: {promoCode}</p>
                  {promoDiscount > 0 ? (
                    <p className="text-[11px] text-green-700 mt-0.5">Mendapatkan potongan {formatPrice(promoDiscount)}</p>
                  ) : (
                    <p className="text-[11px] text-red-500 mt-0.5">Syarat kupon belum terpenuhi (tambah pesanan lagi)</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={clearPromoCode}
                  className="text-xs font-bold text-red-650 hover:text-red-800 transition-colors bg-white px-3 py-1.5 border border-red-200 rounded-lg cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Masukkan kode kupon (misal: ANNIV25)"
                  id="couponInput"
                  className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#8E0E0E] uppercase font-mono tracking-wide text-gray-900 bg-white placeholder-gray-400"
                />
                <button
                  type="button"
                  disabled={applyingPromo}
                  onClick={() => {
                    const el = document.getElementById('couponInput') as HTMLInputElement;
                    if (el?.value.trim()) {
                      handleApplyPromo(el.value.trim()).then(() => { el.value = ''; });
                    } else {
                      toast.error('Silakan ketik kode kupon terlebih dahulu');
                    }
                  }}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {applyingPromo ? 'Memvalidasi...' : 'Terapkan'}
                </button>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Metode Pembayaran</h3>
            <div className="space-y-2">
              {(orderType === 'pickup'
                ? [
                    { val: 'cod', icon: <Banknote className="w-5 h-5 text-green-600" />, label: 'Tunai', desc: 'Bayar tunai di gerai saat mengambil pesanan' },
                    { val: 'transfer', icon: <QrCode className="w-5 h-5 text-blue-600" />, label: 'QRIS', desc: 'Scan & bayar QRIS di gerai saat mengambil pesanan' },
                  ]
                : [
                    { val: 'cod', icon: <Banknote className="w-5 h-5 text-green-600" />, label: 'Tunai COD', desc: 'Bayar tunai ke kurir saat pesanan tiba' },
                    { val: 'transfer', icon: <QrCode className="w-5 h-5 text-blue-600" />, label: 'QRIS', desc: 'Scan QRIS & unggah bukti transfer konfirmasi otomatis' },
                  ]
              ).map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setPaymentMethod(opt.val as 'cod' | 'transfer')}
                  className={`w-full p-3 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${
                    paymentMethod === opt.val ? 'border-[#8E0E0E] bg-[#8E0E0E]/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex-shrink-0">{opt.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{opt.label}</p>
                    <p className="text-xs text-gray-500">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Cancel Policy */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <label className="flex items-start gap-3 cursor-pointer">
              <div
                onClick={() => { setAgreedCancel(!agreedCancel); setErrors((p) => ({ ...p, agreedCancel: '' })); }}
                className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                  agreedCancel ? 'bg-[#8E0E0E] border-[#8E0E0E]' : 'border-gray-300'
                }`}
              >
                {agreedCancel && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Cek kembali pesanan Anda. Saya menyetujui bahwa pesanan dapat dibatalkan sebelum status timeline pesanan berubah menjadi siap diambil atau diantar.
              </p>
            </label>
            {errors.agreedCancel && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.agreedCancel}</p>}
          </div>

          {/* Terms Agreement */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <label className="flex items-start gap-3 cursor-pointer">
              <div
                onClick={() => { setAgreed(!agreed); setErrors((p) => ({ ...p, agreed: '' })); }}
                className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                  agreed ? 'bg-[#8E0E0E] border-[#8E0E0E]' : 'border-gray-300'
                }`}
              >
                {agreed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Saya menyetujui{' '}
                <Link href="/terms" className="text-[#8E0E0E] font-medium hover:underline" target="_blank">Syarat & Ketentuan</Link>
                {' '}dan{' '}
                <Link href="/privacy" className="text-[#8E0E0E] font-medium hover:underline" target="_blank">Kebijakan Privasi</Link>
                {' '}A6 Nyuss.
              </p>
            </label>
            {errors.agreed && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.agreed}</p>}
          </div>

          {/* Out-of-range warning */}
          {orderType === 'delivery' && mapResult?.isOutOfRange && (
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div>
                <p className="font-bold text-red-700 text-sm">Lokasi di luar jangkauan pengiriman</p>
                <p className="text-red-600 text-xs">Jarak {mapResult.distanceKm.toFixed(1)} km melebihi batas 10 km. Silakan ubah lokasi atau pilih Pickup.</p>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !isStoreOpen || (orderType === 'delivery' && mapResult?.isOutOfRange === true)}
            className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white rounded-2xl font-bold text-base hover:from-[#9C1B0B] hover:to-[#D94708] transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memproses Pesanan...
              </>
            ) : !isStoreOpen ? (
              <span className="flex items-center gap-2"><XCircle className="w-5 h-5" /> Toko Sedang Tutup</span>
            ) : (
              <span className="flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> Pesan Sekarang — {formatPrice(total)}</span>
            )}
          </button>
        </form>
      </div>

      {/* QRIS Modal */}
      {showQrisModal && createdOrderCode && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-[#8E0E0E] to-[#E05009] p-4 text-white text-center">
              <h3 className="font-black text-lg">Pembayaran QRIS</h3>
              <p className="text-xs text-white/80">Scan QRIS & Unggah Bukti Pembayaran</p>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1 select-none">
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Pembayaran</p>
                <p className="text-2xl font-black text-[#8E0E0E] mt-1">{formatPrice(serverConfirmedTotal || total)}</p>
                <p className="text-xs text-stone-500 font-mono mt-0.5">Kode Order: {createdOrderCode}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center border border-gray-100 shadow-inner">
                <img src="/qris.png" alt="QRIS A6 Nyuss" draggable="false" className="w-48 h-48 object-contain rounded-lg border bg-white shadow-sm" />
                <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-wide">A6 NYUSS MARTABAK</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 text-xs text-amber-800 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> Petunjuk Pembayaran QRIS:
                </p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Scan kode QRIS di atas menggunakan aplikasi M-Banking atau E-Wallet Anda (Gopay/OVO/Dana/dll).</li>
                  <li>Masukkan nominal pembayaran tepat sebesar <strong className="text-[#8E0E0E]">{formatPrice(total)}</strong>.</li>
                  <li>Simpan tangkapan layar (screenshot) bukti pembayaran sukses Anda.</li>
                  <li>Unggah screenshot tersebut pada kolom di bawah ini.</li>
                </ol>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase">Unggah Bukti Pembayaran QRIS</label>
                <div className="border-2 border-dashed border-gray-300 hover:border-[#8E0E0E] rounded-2xl p-4 text-center cursor-pointer transition-all relative bg-gray-50 hover:bg-[#8E0E0E]/5">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) => { if (e.target.files?.[0]) setUploadFile(e.target.files[0]); }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                  <p className="text-sm font-semibold text-gray-800 select-all">
                    {uploadFile ? uploadFile.name : 'Pilih Gambar Bukti Pembayaran QRIS'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Format gambar JPG, PNG (maks. 5MB)</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex gap-2">
              <button
                type="button"
                disabled={uploading}
                onClick={handlePayLater}
                className="flex-1 py-3 bg-white hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-sm border border-gray-200 transition-colors"
              >
                Bayar Nanti
              </button>
              <button
                type="button"
                disabled={uploading || !uploadFile}
                onClick={() => handleUploadProof(createdOrderCode)}
                className="flex-1 py-3 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] hover:from-[#9C1B0B] hover:to-[#D94708] text-white font-bold rounded-xl text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Mengunggah...
                  </>
                ) : 'Unggah & Selesai'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

```

---

### File: `apps/customer/app/contact/page.tsx`

```tsx
"use client";
import { MapPin, Clock, Mail, Phone, CheckCircle } from 'lucide-react';

export default function Contact() {
  const getCurrentStatus = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const time = hours * 60 + minutes;

    // Open from 17:00 to 01:00
    const isOpen = time >= 1020 || time < 60;

    if (isOpen) {
      return { open: true, label: 'BUKA SEKARANG', info: 'Tutup jam 01:00' };
    }
    return { open: false, label: 'SEDANG TUTUP', info: 'Buka kembali pukul 17:00' };
  };

  const status = getCurrentStatus();

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Lokasi & Kontak</h1>
          <p className="text-white/80">Temukan kami atau hubungi langsung — kami selalu siap melayani!</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Status Banner */}
        <div className={`flex items-center gap-3 p-4 rounded-2xl mb-8 ${status.open ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className={`w-3 h-3 rounded-full flex-shrink-0 animate-pulse ${status.open ? 'bg-green-500' : 'bg-red-500'}`} />
          <div>
            <p className={`font-bold text-base ${status.open ? 'text-green-700' : 'text-red-700'}`}>
              {status.label}
            </p>
            <p className={`text-sm ${status.open ? 'text-green-600' : 'text-red-600'}`}>{status.info}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.9787806389904!2d112.72062749999999!3d-7.243253699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f96790ef97d9%3A0x4e9b27e564abc301!2sMartabak%20%26%20Terang%20Bulan%20A6%20Nyuss!5e0!3m2!1sid!2sid!4v1780307482136!5m2!1sid!2sid"
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="p-4">
              <a
                href="https://maps.google.com/?q=Martabak+%26+Terang+Bulan+A6+Nyuss"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#8E0E0E] hover:bg-[#9C1B0B] text-white rounded-xl font-semibold text-sm transition-colors"
              >
                <MapPin className="w-4 h-4" /> Buka di Google Maps
              </a>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-5">
            {/* Address */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8E0E0E]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#8E0E0E]" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">Alamat</p>
                  <div className="text-gray-600 text-sm leading-relaxed">
                    <p>Jl. Demak No.253, Dupak, Kec. Krembangan, Surabaya, Jawa Timur 60179</p>
                    <p className="text-gray-400 text-xs mt-0.5 font-medium">Depan Mess DITPOLARIUD POLDA JATIM SURABAYA.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8E0E0E]/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#8E0E0E]" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-2">Jam Operasional</p>
                  <div className="space-y-1">
                    {[
                      { day: 'Setiap Hari', hours: '17:00 – 01:00' },
                    ].map((item) => (
                      <div key={item.day} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.day}</span>
                        <span className="font-semibold text-gray-900">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <a
              href="https://wa.me/6287811123482?text=Halo%20A6%20Nyuss%2C%20saya%20ingin%20bertanya"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4 hover:bg-green-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">WhatsApp</p>
                <p className="text-green-700 font-semibold">0878-1112-3482</p>
              </div>
              <span className="text-green-600 text-sm font-medium">Chat →</span>
            </a>

            {/* Email */}
            <a
              href="mailto:martabaka6nyusss@gmail.com"
              className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-[#8E0E0E]/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[#8E0E0E]" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Email</p>
                <p className="text-[#8E0E0E] font-medium text-sm">martabaka6nyusss@gmail.com</p>
              </div>
            </a>

            {/* Social Media */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="font-bold text-gray-900 mb-3">Ikuti Kami di Sosial Media</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { 
                    platform: 'Instagram', 
                    handle: '@a6nyuss', 
                    icon: <img src="/instagram.svg" className="w-5 h-5 flex-shrink-0 object-contain" alt="Instagram" />, 
                    link: 'https://www.instagram.com/a6nyusss' 
                  },
                  { 
                    platform: 'TikTok', 
                    handle: '@a6nyuss', 
                    icon: <svg className="w-5 h-5 text-black dark:text-white flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z"/></svg>, 
                    link: 'https://www.tiktok.com/@a6nyuss' 
                  },
                  { 
                    platform: 'Facebook', 
                    handle: 'A6 Nyuss', 
                    icon: <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, 
                    link: 'https://www.facebook.com/profile.php?id=61590278828752' 
                  },
                  { 
                    platform: 'YouTube', 
                    handle: 'A6 Nyuss', 
                    icon: <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>, 
                    link: 'https://youtube.com/@a6nyuss' 
                  },
                ].map((s) => (
                  <a
                    key={s.platform}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-2.5 bg-gray-50 dark:bg-stone-850 rounded-xl hover:bg-[#8E0E0E]/5 transition-colors"
                  >
                    {s.icon}
                    <div>
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{s.platform}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{s.handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Halal Certification */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4">
          <img src="/Halal logo.jfif" alt="Halal Certified" className="w-12 h-12 object-contain flex-shrink-0 rounded-lg" />
          <div>
            <p className="font-bold text-green-800">Bersertifikat Halal</p>
            <p className="text-green-700 text-sm">Seluruh bahan baku dan proses pembuatan A6 Nyuss telah tersertifikasi halal. Aman untuk seluruh keluarga Muslim.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

```

---

### File: `apps/customer/app/faq/page.tsx`

```tsx
"use client";
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, Bookmark, CreditCard, Truck, Flame, MessageSquare, MapPin } from 'lucide-react';


interface FAQItem {
  q: string;
  a: string;
}

interface FAQCategory {
  label: string;
  icon: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    label: 'Umum',
    icon: 'Bookmark',
    items: [
      { q: 'Jam operasional A6 Nyuss?', a: 'Setiap Hari: 17:00–01:00. Kami buka setiap hari kecuali ada pengumuman khusus via WhatsApp atau Instagram.' },
      { q: 'Apakah A6 Nyuss sudah halal?', a: 'Ya! Seluruh bahan baku dan proses pembuatan A6 Nyuss telah bersertifikat halal. Aman dan nyaman untuk seluruh keluarga Muslim.' },
      { q: 'Sejak kapan A6 Nyuss berdiri?', a: 'A6 Nyuss berdiri sejak tahun 2000. Kami telah melayani warga Surabaya selama lebih dari 25 tahun dengan cita rasa yang konsisten.' },
      { q: 'Di mana lokasi A6 Nyuss?', a: 'Kami berlokasi di Depan Mess DITPOLARIUD POLDA JATIM SURABAYA, Jl. Demak No.253, Dupak, Kec. Krembangan, Surabaya, Jawa Timur 60179. Mudah ditemukan dan strategis!' },
    ],
  },
  {
    label: 'Order & Pembayaran',
    icon: 'CreditCard',
    items: [
      { q: 'Bagaimana cara pesan online?', a: 'Sangat mudah! Pilih menu yang kamu inginkan → Tambah ke keranjang → Isi data & pilih pickup/delivery → Checkout. Selesai! Kamu akan dapat kode order untuk tracking.' },
      { q: 'Apakah harus punya akun untuk pesan?', a: 'Tidak perlu! Kamu bisa langsung pesan hanya dengan mengisi nama dan nomor WhatsApp. Simpel dan cepat tanpa registrasi.' },
      { q: 'Metode pembayaran apa saja yang tersedia?', a: 'Kami menyediakan metode pembayaran yang fleksibel sesuai jenis pesanan Anda: (1) Untuk Pickup (ambil di gerai), kami menerima Tunai dan QRIS. (2) Untuk Delivery (pesan antar), kami menerima Tunai COD dan QRIS.' },
      { q: 'Bagaimana cara melacak pesanan?', a: 'Setelah checkout, kamu akan mendapat kode order (contoh: A6-20260101-1234). Gunakan kode tersebut di halaman Tracking untuk melihat status pesanan secara real-time.' },
      { q: 'Bisa pesan via WhatsApp?', a: 'Bisa! Klik tombol WhatsApp di website kami atau langsung hubungi 0878-1112-3482. Tim kami siap membantu.' },
      { q: 'Apakah ada minimum order?', a: 'Tidak ada minimum order untuk pickup. Untuk delivery, minimum order Rp 30.000 (belum termasuk ongkir).' },
    ],
  },
  {
    label: 'Pengiriman',
    icon: 'Truck',
    items: [
      { q: 'Area delivery sampai mana?', a: 'Kami melayani delivery di wilayah Surabaya dan sekitarnya dalam radius 10 km dari toko. Hubungi kami via WhatsApp untuk konfirmasi area Anda.' },
      { q: 'Berapa ongkir pengirimannya?', a: 'Zona 1 (0–3 km): Rp 8.000 | Zona 2 (3–6 km): Rp 13.000 | Zona 3 (6–10 km): Rp 18.000. Ongkir dihitung saat checkout.' },
      { q: 'Bisa pickup / ambil sendiri?', a: 'Bisa dan dianjurkan! Pickup lebih hemat (gratis ongkir) dan pesanan biasanya siap dalam ~20 menit. Cukup tunjukkan kode order di toko.' },
      { q: 'Berapa lama estimasi delivery?', a: 'Estimasi delivery adalah ~40 menit dari waktu order dikonfirmasi, tergantung kondisi lalu lintas. Pickup sekitar ~20 menit.' },
    ],
  },
  {
    label: 'Produk',
    icon: 'Flame',
    items: [
      { q: 'Ada varian menu apa saja?', a: 'Kami menyediakan: Terang Bulan (coklat keju, keju full, kacang, original wijen), Martabak Telur Ayam, Martabak Telur Bebek (biasa, spesial, istimewa, super), Paket Bundling, dan Minuman.' },
      { q: 'Bisa request custom?', a: 'Bisa! Saat pemesanan, ada kolom catatan khusus. Tulis preferensi kamu seperti "extra pedas", "tanpa bawang", "keju double", dsb. Kami akan berusaha mengakomodasi.' },
      { q: 'Apakah produk dibuat fresh?', a: 'Ya! Semua produk kami dibuat fresh setiap saat menggunakan bahan-bahan segar pilihan. Tidak ada produk yang dipanaskan ulang.' },
      { q: 'Bagaimana jika menu yang dipesan habis?', a: 'Tim kami akan segera menghubungi kamu via WhatsApp untuk konfirmasi dan menawarkan alternatif atau refund penuh.' },
    ],
  },
];

function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
          <button
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <span className="font-semibold text-gray-900 text-sm sm:text-base pr-4">{item.q}</span>
            <ChevronDown
              className={`w-5 h-5 text-[#8E0E0E] flex-shrink-0 transition-transform duration-200 ${openIdx === idx ? 'rotate-180' : ''}`}
            />
          </button>
          {openIdx === idx && (
            <div className="px-4 pb-4 border-t border-gray-50">
              <p className="text-gray-600 text-sm leading-relaxed pt-3">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">FAQ</h1>
          <p className="text-white/80">Pertanyaan yang sering ditanyakan pelanggan kami</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {faqData.map((cat, idx) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(idx)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === idx
                  ? 'bg-[#8E0E0E] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span className="flex items-center">
                {cat.icon === 'Bookmark' && <Bookmark className="w-4 h-4" />}
                {cat.icon === 'CreditCard' && <CreditCard className="w-4 h-4" />}
                {cat.icon === 'Truck' && <Truck className="w-4 h-4" />}
                {cat.icon === 'Flame' && <Flame className="w-4 h-4" />}
              </span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <FAQAccordion items={faqData[activeCategory].items} />

        {/* Still have questions */}
        <div className="mt-10 bg-gradient-to-br from-[#8E0E0E]/10 to-[#E05009]/5 border border-[#8E0E0E]/20 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#8E0E0E]/10 flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6 text-[#8E0E0E]" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Masih ada pertanyaan?</h3>
          <p className="text-gray-600 text-sm mb-4">Tim kami siap membantu via WhatsApp setiap hari selama jam operasional</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/6287811123482?text=Halo%20A6%20Nyuss%2C%20saya%20ingin%20bertanya"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              <MessageSquare className="w-4 h-4" /> Chat WhatsApp
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#8E0E0E] hover:bg-[#9C1B0B] text-white rounded-xl font-semibold text-sm transition-colors"
            >
              <MapPin className="w-4 h-4" /> Lihat Kontak
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

```

---

### File: `apps/customer/app/favicon.ico`

*[Binary file/Asset - content omitted]*

---

### File: `apps/customer/app/gallery/page.tsx`

```tsx
"use client";
import Link from 'next/link';
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Image, ShoppingBag, Store, Search, Users } from 'lucide-react';


type GalleryFilter = 'semua' | 'produk' | 'toko' | 'behind-scene' | 'pelanggan';

const galleryItems = [
  { id: 1, src: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop', category: 'produk', caption: 'Martabak Coklat Keju Premium' },
  { id: 2, src: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&h=600&fit=crop', category: 'produk', caption: 'Martabak Telur Sapi Spesial' },
  { id: 3, src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=600&fit=crop', category: 'produk', caption: 'Martabak Kacang Coklat' },
  { id: 4, src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=600&fit=crop', category: 'toko', caption: 'Suasana Toko A6 Nyuss' },
  { id: 5, src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop', category: 'produk', caption: 'Paket Bundling Hemat' },
  { id: 6, src: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=600&fit=crop', category: 'produk', caption: 'Terang Bulan Coklat Lumer' },
  { id: 7, src: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=600&fit=crop', category: 'behind-scene', caption: 'Proses Pembuatan Martabak' },
  { id: 8, src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop', category: 'produk', caption: 'Martabak Telur Ayam' },
  { id: 9, src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop', category: 'produk', caption: 'Martabak Keju Full' },
  { id: 10, src: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop&sat=-100', category: 'behind-scene', caption: 'Dapur Bersih A6 Nyuss' },
  { id: 11, src: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&fit=crop', category: 'pelanggan', caption: 'Pelanggan Setia A6 Nyuss' },
  { id: 12, src: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&h=600&fit=crop', category: 'pelanggan', caption: 'Keluarga Bahagia Menikmati A6 Nyuss' },
];

const filters: { id: GalleryFilter; label: string; icon: React.ReactNode }[] = [
  { id: 'semua', label: 'Semua', icon: <Image className="w-4 h-4" /> },
  { id: 'produk', label: 'Produk', icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 'toko', label: 'Toko', icon: <Store className="w-4 h-4" /> },
  { id: 'behind-scene', label: 'Behind the Scene', icon: <Search className="w-4 h-4" /> },
  { id: 'pelanggan', label: 'Pelanggan', icon: <Users className="w-4 h-4" /> },
];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>('semua');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const filtered = activeFilter === 'semua' ? galleryItems : galleryItems.filter(i => i.category === activeFilter);

  const prev = () => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx - 1 + filtered.length) % filtered.length);
  };
  const next = () => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % filtered.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 flex items-center justify-center gap-2">
            <Image className="w-8 h-8" /> Gallery
          </h1>
          <p className="text-white/80">Lihat lebih dekat keistimewaan A6 Nyuss</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === f.id
                  ? 'bg-[#8E0E0E] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setLightboxIdx(idx)}
              className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer"
            >
              <img
                src={item.src}
                alt={item.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                <p className="text-white text-xs font-medium p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  {item.caption}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 bg-gradient-to-br from-[#8E0E0E]/10 to-[#E05009]/5 rounded-2xl p-8">
          <h3 className="text-2xl font-black text-gray-900 mb-2">Mau Coba?</h3>
          <p className="text-gray-600 mb-5">Pesan sekarang dan buat momen spesial bersama keluarga!</p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white font-bold rounded-2xl hover:from-[#9C1B0B] hover:to-[#D94708] transition-all hover:scale-105 shadow-lg"
          >
            <ShoppingBag className="w-5 h-5" /> Pesan Sekarang
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div className="max-w-2xl max-h-[80vh] relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={filtered[lightboxIdx].src}
              alt={filtered[lightboxIdx].caption}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
            />
            <p className="text-white text-center mt-3 font-medium">{filtered[lightboxIdx].caption}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightboxIdx + 1} / {filtered.length}
          </p>
        </div>
      )}
    </div>
  );
}

```

---

### File: `apps/customer/app/globals.css`

```css
@import "tailwindcss";
@source "../components";
@import "leaflet/dist/leaflet.css";

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLDz8Z11lFc-K.woff2) format('woff2');
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJbecmNE.woff2) format('woff2');
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9Z11lFc-K.woff2) format('woff2');
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z11lFc-K.woff2) format('woff2');
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z11lFc-K.woff2) format('woff2');
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 800;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLDD4Z11lFc-K.woff2) format('woff2');
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLBT5Z11lFc-K.woff2) format('woff2');
}

:root {
  --font-poppins: 'Poppins', sans-serif;
  --background: #fffdf9; /* Creamy White */
  --foreground: #1c1917; /* Stone 900 */
  --card: #ffffff;
  --card-foreground: #1c1917;
  --primary: #B72A0A; /* Red-Orange #5 (#B72A0A) */
  --primary-foreground: #ffffff;
  --secondary: #8E0E0E; /* Dark Red #1 (#8E0E0E) */
  --secondary-foreground: #fffdf9;
  --accent: #E05009; /* Orange-Red #10 (#E05009) */
  --accent-foreground: #ffffff;
  --muted: #f5f5f4; /* Stone 100 */
  --muted-foreground: #78716c; /* Stone 500 */
  --border: #e7e5e4; /* Stone 200 */
  
  --radius-lg: 1rem;
  --radius-md: 0.75rem;
  --radius-sm: 0.5rem;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  
  --font-sans: var(--font-poppins), system-ui, -apple-system, sans-serif;
  --font-mono: var(--font-geist-mono), monospace;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0c0a09; /* Stone 950 */
    --foreground: #f5f5f4; /* Stone 100 */
    --card: #1c1917; /* Stone 900 */
    --card-foreground: #f5f5f4;
    --primary: #E05009; /* Orange-Red #10 (#E05009) */
    --primary-foreground: #0c0a09;
    --secondary: #B72A0A; /* Red-Orange #5 (#B72A0A) */
    --secondary-foreground: #0c0a09;
    --muted: #292524; /* Stone 800 */
    --muted-foreground: #a8a29e; /* Stone 400 */
    --border: #292524;
  }
}

body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
}




```

---

### File: `apps/customer/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import ChatBot from "@/components/ChatBot";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "A6 Nyuss - Martabak & Terang Bulan",
  description: "Cita rasa otentik martabak dan terang bulan khas Surabaya sejak tahun 2000. Dibuat dengan bahan pilihan dan resep turun-temurun.",
  icons: {
    icon: "/favicon.ico",
  },
};

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
      <body className="min-h-full flex flex-col bg-[#fffdf9] text-[#1c1917] dark:bg-stone-950 dark:text-stone-100">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: { fontFamily: 'var(--font-poppins), sans-serif', fontSize: '14px' },
          }}
        />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <FloatingButtons />
        <ChatBot />
      </body>
    </html>
  );
}

```

---

### File: `apps/customer/app/menu/[slug]/page.tsx`

```tsx
"use client";
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { ArrowLeft, Minus, Plus, ShoppingCart, Star, Utensils, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMenuBySlug, getRelatedMenus, formatPrice, MenuItem } from '@/data/menu';
import { useCartStore, CartItemVariant } from '@/store/cartStore';
import MenuCard from '@/components/MenuCard';
import { getMenuItems } from '@/lib/db/menuService';

export default function MenuDetail() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const [item, setItem] = useState<MenuItem | null>(null);
  const [relatedMenus, setRelatedMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, CartItemVariant>>({});
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!slug) return;
    async function loadItem() {
      try {
        const allItems = await getMenuItems();
        const found = allItems.find(i => i.slug === slug);
        if (found) {
          setItem(found);
        } else {
          const staticFound = getMenuBySlug(slug);
          if (staticFound) setItem(staticFound);
        }
      } catch (err) {
        console.error('Gagal mengambil item menu dari Supabase:', err);
        const staticFound = getMenuBySlug(slug);
        if (staticFound) setItem(staticFound);
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [slug]);

  useEffect(() => {
    if (!item) return;
    const slugs = item.relatedSlugs || [];
    async function loadRelated() {
      try {
        const allItems = await getMenuItems();
        const foundRelated = allItems.filter(i => slugs.includes(i.slug));
        setRelatedMenus(foundRelated.length > 0 ? foundRelated : getRelatedMenus(slugs));
      } catch (err) {
        setRelatedMenus(getRelatedMenus(slugs));
      }
    }
    loadRelated();
  }, [item]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#8E0E0E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Memuat detail menu...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Menu tidak ditemukan</h2>
          <p className="text-gray-500 mb-6">Menu yang kamu cari tidak tersedia.</p>
          <Link
            href="/menu"
            className="px-6 py-3 bg-[#8E0E0E] text-white rounded-xl font-semibold hover:bg-[#9C1B0B] transition-colors"
          >
            Kembali ke Menu
          </Link>
        </div>
      </div>
    );
  }

  const isHabis = item.badge === 'habis';

  const variantModifiers = Object.values(selectedVariants).reduce(
    (sum, v) => sum + v.option.priceModifier,
    0
  );
  const totalPrice = (item.price + variantModifiers) * quantity;

  const handleVariantSelect = (variantLabel: string, option: { id: string; name: string; priceModifier: number }) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantLabel]: { label: variantLabel, option },
    }));
  };

  const requiredVariants = item.variants?.filter((v) => v.required) ?? [];
  const allRequiredSelected = requiredVariants.every((v) => selectedVariants[v.label]);

  const handleAddToCart = () => {
    if (!allRequiredSelected && item.variants && item.variants.filter(v => v.required).length > 0) {
      toast.error('Pilih semua varian yang diperlukan!');
      return;
    }
    addItem(item, Object.values(selectedVariants), quantity, note);
    toast.success(`${item.name} ditambahkan ke keranjang!`, {
      duration: 2000,
      style: { background: '#1a0a0a', color: '#fff', borderLeft: '4px solid #E05009' },
    });
    router.push('/cart');
  };

  const badgeConfig = {
    terlaris: { label: 'Terlaris', cls: 'bg-orange-500 text-white' },
    baru: { label: 'Baru', cls: 'bg-blue-500 text-white' },
    habis: { label: 'Habis', cls: 'bg-gray-500 text-white' },
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-[#8E0E0E] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Kembali</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-32">
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl mb-8">
          {/* Image */}
          <div className="relative h-64 sm:h-80 md:h-96 bg-gray-100">
            <img
              src={item.image}
              alt={item.name}
              className={`w-full h-full object-cover ${isHabis ? 'grayscale' : ''}`}
            />
            {item.badge && (
              <span className={`absolute top-4 left-4 text-sm font-bold px-3 py-1.5 rounded-full ${badgeConfig[item.badge].cls}`}>
                {badgeConfig[item.badge].label}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-5 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mb-2 inline-block">
                  {item.categoryLabel}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900">{item.name}</h1>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-xl">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-gray-800 text-sm">4.9</span>
              </div>
            </div>

            <p className="text-2xl sm:text-3xl font-black text-[#8E0E0E] mb-4">
              {formatPrice(item.price)}
              {item.variants && item.variants[0]?.options[1] && (
                <span className="text-sm text-gray-400 font-normal ml-1">/ mulai dari</span>
              )}
            </p>

            {item.description && (
              <p className="text-gray-600 leading-relaxed mb-6">{item.description}</p>
            )}

            {isHabis && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-center flex flex-col items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500 mb-2 shrink-0" />
                <p className="text-red-600 font-bold">Maaf, menu ini sedang habis</p>
                <p className="text-red-400 text-sm mt-1">Coba cek lagi besok atau pilih menu lainnya</p>
              </div>
            )}

            {!isHabis && (
              <>
                {/* Variants */}
                {item.variants?.map((variant) => (
                  <div key={variant.label} className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <p className="font-bold text-gray-800">{variant.label}</p>
                      {variant.required && (
                        <span className="text-xs text-red-500 font-medium">* Wajib pilih</span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {variant.options.map((opt) => {
                        const isSelected = selectedVariants[variant.label]?.option.id === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleVariantSelect(variant.label, opt)}
                            className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left ${
                              isSelected
                                ? 'border-[#8E0E0E] bg-[#8E0E0E]/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#8E0E0E] bg-[#8E0E0E]' : 'border-gray-400'}`}>
                                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                              <span className="text-sm font-medium text-gray-700">{opt.name}</span>
                            </div>
                            {opt.priceModifier > 0 ? (
                              <span className="text-sm text-[#E05009] font-semibold">+{formatPrice(opt.priceModifier)}</span>
                            ) : (
                              <span className="text-sm text-gray-400">Termasuk</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Special Note */}
                <div className="mb-6">
                  <label className="block font-bold text-gray-800 mb-2">
                    Catatan Khusus <span className="text-gray-400 font-normal">(Opsional)</span>
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Contoh: extra pedas, tanpa bawang, dll..."
                    className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#8E0E0E] resize-none"
                    rows={2}
                  />
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 mb-6">
                  <span className="font-bold text-gray-800">Jumlah</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-[#8E0E0E] transition-colors"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-8 text-center font-black text-xl text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-[#8E0E0E] hover:bg-[#9C1B0B] transition-colors"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart button inside card */}
                <button
                  onClick={handleAddToCart}
                  disabled={!allRequiredSelected && requiredVariants.length > 0}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all text-base ${
                    allRequiredSelected || requiredVariants.length === 0
                      ? 'bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white hover:from-[#9C1B0B] hover:to-[#D94708] shadow-md hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Tambah ke Keranjang</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Related Menus */}
        {relatedMenus.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-black text-gray-900 mb-4">Menu Terkait</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {relatedMenus.map((related) => (
                <MenuCard key={related.id} item={related} />
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

```

---

### File: `apps/customer/app/menu/page.tsx`

```tsx
"use client";
import { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, Egg, Moon, Layers, Utensils } from 'lucide-react';
import { menuItems as staticMenuItems, categories as staticCategories, MenuCategory, MenuItem, popularMenuSlugs } from '@/data/menu';
import MenuCard from '@/components/MenuCard';
import { getCategories, getMenuItems } from '@/lib/db/menuService';

type SortOption = 'default' | 'rekomendasi' | 'price-asc' | 'price-desc' | 'terlaris';

const getCategoryIcon = (id: string) => {
  switch (id) {
    case 'semua':
      return <Layers className="w-4 h-4" />;
    case 'martabak-telur-ayam':
      return <Egg className="w-4 h-4 text-amber-600" />;
    case 'martabak-telur-bebek':
      return <Egg className="w-4 h-4 text-emerald-600" />;
    case 'terang-bulan':
      return <Moon className="w-4 h-4 text-yellow-500" />;
    default:
      return <Layers className="w-4 h-4" />;
  }
};

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'semua'>('semua');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('default');
  const [menuItemsState, setMenuItemsState] = useState<MenuItem[]>(staticMenuItems);
  const [categoriesState, setCategoriesState] = useState<{ id: MenuCategory; label: string; icon: string }[]>(staticCategories);

  // Load filter state from sessionStorage on mount & fetch Supabase data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCategory = sessionStorage.getItem('last_menu_category');
      if (savedCategory) {
        setActiveCategory(savedCategory as MenuCategory | 'semua');
      }
      const savedSearch = sessionStorage.getItem('last_menu_search');
      if (savedSearch) {
        setSearch(savedSearch);
      }
      const savedSort = sessionStorage.getItem('last_menu_sort');
      if (savedSort) {
        setSort(savedSort as SortOption);
      }
    }

    async function loadData() {
      try {
        const [fetchedCategories, fetchedItems] = await Promise.all([
          getCategories(),
          getMenuItems()
        ]);
        setCategoriesState(fetchedCategories);
        setMenuItemsState(fetchedItems);
      } catch (err) {
        console.error('Gagal memuat data menu dari Supabase:', err);
      }
    }
    loadData();
  }, []);

  const handleCategoryChange = (cat: MenuCategory | 'semua') => {
    setActiveCategory(cat);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('last_menu_category', cat);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('last_menu_search', val);
    }

    // Auto redirect to terang-bulan if searching for a topping keyword
    const toppingKeywords = [
      'kacang', 'meses', 'keju', 'pisang', 'melon', 'strawberry', 'coklat', 'nanas', 
      'vanilla', 'blueberry', 'tiramisu', 'greentea', 'green tea', 'kismis', 'oreo', 
      'milo', 'nutella', 'silverqueen', 'topping'
    ];
    const lowercaseVal = val.toLowerCase().trim();
    if (lowercaseVal) {
      const isToppingSearch = toppingKeywords.some(keyword => lowercaseVal.includes(keyword));
      if (isToppingSearch) {
        handleCategoryChange('terang-bulan');
      }
    }
  };

  const handleSortChange = (val: SortOption) => {
    setSort(val);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('last_menu_sort', val);
    }
  };

  const filteredMenus = useMemo(() => {
    let items = [...menuItemsState];
    if (activeCategory !== 'semua') {
      items = items.filter((item) => item.category === activeCategory);
    }
    
    const toppingKeywords = [
      'kacang', 'meses', 'keju', 'pisang', 'melon', 'strawberry', 'coklat', 'nanas', 
      'vanilla', 'blueberry', 'tiramisu', 'greentea', 'green tea', 'kismis', 'oreo', 
      'milo', 'nutella', 'silverqueen', 'topping'
    ];
    const lowercaseSearch = search.toLowerCase().trim();
    const isToppingSearch = toppingKeywords.some(keyword => lowercaseSearch.includes(keyword));

    if (search.trim() && !isToppingSearch) {
      items = items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    switch (sort) {
      case 'rekomendasi':
        items.sort((a, b) => {
          const aPopular = popularMenuSlugs.includes(a.slug) || a.badge === 'terlaris';
          const bPopular = popularMenuSlugs.includes(b.slug) || b.badge === 'terlaris';
          if (aPopular && !bPopular) return -1;
          if (!aPopular && bPopular) return 1;
          return 0;
        });
        break;
      case 'price-asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'terlaris':
        items.sort((a, _b) => (a.badge === 'terlaris' ? -1 : 1));
        break;
      default:
        items.sort((a, b) => a.price - b.price);
        break;
    }
    return items;
  }, [menuItemsState, activeCategory, search, sort]);

  const allCategories = [{ id: 'semua' as const, label: 'Semua', icon: '🍽️' }, ...categoriesState];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2">
            Menu Kami
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-xl mx-auto">
            Pilihan martabak & terang bulan terbaik. Semua dibuat fresh setiap hari!
          </p>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-16 z-30 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {allCategories.map((cat) => {
              const count = cat.id === 'semua'
                ? menuItemsState.length
                : menuItemsState.filter((item) => item.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    activeCategory === cat.id
                      ? 'bg-[#8E0E0E] text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-xs ${activeCategory === cat.id ? 'text-white/70' : 'text-gray-400'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari menu..."
              className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8E0E0E] text-sm text-gray-900 bg-white placeholder-gray-400"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="pl-9 pr-3 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8E0E0E] text-sm bg-white appearance-none cursor-pointer"
            >
              <option value="default">Urutkan</option>
              <option value="rekomendasi">Rekomendasi</option>
              <option value="terlaris">Terlaris</option>
              <option value="price-asc">Harga ↑</option>
              <option value="price-desc">Harga ↓</option>
            </select>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {filteredMenus.length === 0 ? (
          <div className="text-center py-20">
            <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Menu tidak ditemukan</h3>
            <p className="text-gray-500">Coba kata kunci lain atau pilih kategori berbeda</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Menampilkan <span className="font-semibold text-gray-700">{filteredMenus.length}</span> menu
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredMenus.map((item) => (
                <MenuCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

```

---

### File: `apps/customer/app/page.tsx`

```tsx
"use client";
import Link from 'next/link';

import { Star, MapPin, Clock, CheckCircle, ArrowRight, ChevronRight, Award, Truck, Zap, Search, FileText, ShoppingBag, MessageSquare, BadgePercent } from 'lucide-react';
import { menuItems as staticMenuItems, popularMenuSlugs, MenuItem } from '@/data/menu';
import MenuCard from '@/components/MenuCard';
import { useEffect, useState } from 'react';
import { getStoreSettings, getMenuItems, DbStoreSettings } from '@/lib/db/menuService';

const testimonials = [
  { name: 'Budi S.', rating: 5, text: 'Udah langganan sejak 2010! Rasanya konsisten, martabak coklatnya paling enak se-Surabaya. Wajib coba!', location: 'Gubeng, Surabaya' },
  { name: 'Sari A.', rating: 5, text: 'Pesan online gampang banget, langsung dateng cepet. Terang bulannya lumer banget. Highly recommended!', location: 'Wonokromo, Surabaya' },
  { name: 'Rizky P.', rating: 5, text: 'Martabak telurnya juara! Isinya melimpah, tidak pelit. Harga juga sangat reasonable buat kualitas sebagus ini.', location: 'Rungkut, Surabaya' },
  { name: 'Dewi R.', rating: 5, text: 'Favoritku dari zaman kuliah sampai sekarang udah kerja. Tetap enak, tetap bersih, tetap ramah!', location: 'Kenjeran, Surabaya' },
];

const valuePropositions = [
  { icon: 'Award', title: '25 Tahun Pengalaman', desc: 'Sejak tahun 2000, kami konsisten menghadirkan rasa terbaik yang tidak pernah berubah.' },
  { icon: '/Halal logo.jfif', title: 'Bersertifikat Halal', desc: 'Semua bahan baku kami dipastikan halal dan berkualitas tinggi untuk ketenangan Anda.', isImg: true },
  { icon: 'BadgePercent', title: 'Tanpa Komisi Ojol', desc: 'Pesan langsung dari kami. Harga lebih hemat, kualitas tetap terjaga, layanan lebih personal.' },
  { icon: 'Zap', title: 'Proses Cepat', desc: 'Pickup siap dalam ~20 menit. Delivery langsung tanpa nunggu lama. Panas, segar, nikmat!' },
];

const orderSteps = [
  { step: '01', icon: 'Search', title: 'Pilih Menu', desc: 'Browse menu lengkap kami dan pilih favorit kamu' },
  { step: '02', icon: 'FileText', title: 'Isi Data & Checkout', desc: 'Masukkan nama dan nomor HP, pilih pickup atau delivery' },
  { step: '03', icon: 'ShoppingBag', title: 'Ambil / Diantar', desc: 'Pesanan siap dalam ~20 menit. Kami antar atau kamu pickup!' },
];

export default function Home() {
  const [settings, setSettings] = useState<DbStoreSettings>({
    id: '1',
    store_name: 'Martabak Terbul A6 Nyuss',
    is_open: true,
    whatsapp_number: '6287811123482',
    flat_delivery_fee: 10000,
    minimum_order_amount: 0,
    store_address: 'Jl. Demak No.253, Dupak, Kec. Krembangan, Surabaya, Jawa Timur 60179\nDepan Mess DITPOLARIUD POLDA JATIM SURABAYA.',
    google_maps_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.9787806389904!2d112.72062749999999!3d-7.243253699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f96790ef97d9%3A0x4e9b27e564abc301!2sMartabak%20%26%20Terang%20Bulan%20A6%20Nyuss!5e0!3m2!1sid!2sid!4v1780307482136!5m2!1sid!2sid',
    opening_hours: 'Setiap Hari: 17:00 – 01:00'
  });
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedSettings, fetchedItems] = await Promise.all([
          getStoreSettings(),
          getMenuItems()
        ]);
        setSettings(fetchedSettings);
        setItems(fetchedItems);
      } catch (err) {
        console.error('Gagal mengambil data dari Supabase, menggunakan statis:', err);
      }
    }
    loadData();
  }, []);

  const isStoreOpen = () => {
    return settings.is_open;
  };

  const popularMenus = items.length > 0
    ? items.filter((item) => item.badge === 'terlaris').slice(0, 6)
    : popularMenuSlugs.map((slug) => staticMenuItems.find((i) => i.slug === slug)).filter(Boolean) as MenuItem[];

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background - desktop */}
        <div
          className="absolute inset-0 hidden md:block bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/assets/banner_red.png')` }}
        />
        {/* Background - mobile */}
        <div
          className="absolute inset-0 md:hidden bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/assets/banner_redm.png')` }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4">
            Martabak &<br />
            <span className="text-[#E05009]">Terang Bulan</span>
            <br />A6 Nyuss
          </h1>

          <p className="text-white/90 text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Cita rasa otentik sejak 2000. Dibuat dengan bahan pilihan,
            disajikan dengan cinta dari Surabaya.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/menu"
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] hover:from-[#9C1B0B] hover:to-[#D94708] text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-orange-500/30 transition-all duration-200 hover:scale-105"
            >
              Pesan Sekarang
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={`https://wa.me/${settings.whatsapp_number}?text=Halo%20A6%20Nyuss%2C%20saya%20ingin%20tanya%20menu`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white font-bold text-lg rounded-2xl hover:bg-white/30 transition-all duration-200"
            >
              <MessageSquare className="w-5 h-5" /> Chat WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ===== BRAND BADGE STRIP ===== */}
      <section className="bg-gradient-to-r from-[#8E0E0E] via-[#B72A0A] to-[#E05009] py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
            {[
              { icon: 'Award', text: 'Sejak 2000' },
              { icon: '/Halal logo.jfif', text: 'Halal Certified', isImg: true },
              { icon: 'Star', text: '4.9 Rating' },
              { icon: 'Truck', text: 'Delivery & Pickup' },
              { icon: 'MapPin', text: 'Surabaya' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-white text-sm font-semibold">
                {item.isImg ? (
                  <img src={item.icon} alt={item.text} className="w-5 h-5 object-contain rounded bg-white p-0.5" />
                ) : (
                  <span className="flex items-center">
                    {item.icon === 'Award' && <Award className="w-4 h-4" />}
                    {item.icon === 'Star' && <Star className="w-4 h-4 fill-white text-white" />}
                    {item.icon === 'Truck' && <Truck className="w-4 h-4" />}
                    {item.icon === 'MapPin' && <MapPin className="w-4 h-4" />}
                  </span>
                )}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MENU HIGHLIGHT ===== */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="inline-block text-[#E05009] font-semibold text-sm mb-2 tracking-wider uppercase">Menu Favorit</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
              Menu <span className="text-[#8E0E0E]">Terlaris</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Pilihan favorit pelanggan setia kami. Dibuat fresh setiap hari dengan bahan berkualitas.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
            {popularMenus.slice(0, 6).map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white font-bold rounded-2xl hover:from-[#9C1B0B] hover:to-[#D94708] transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Lihat Semua Menu
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHY A6 NYUSS ===== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block text-[#E05009] font-semibold text-sm mb-2 tracking-wider uppercase">Keunggulan Kami</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
              Kenapa <span className="text-[#8E0E0E]">A6 Nyuss</span>?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valuePropositions.map((vp) => (
              <div
                key={vp.title}
                className="text-center p-6 rounded-2xl bg-gradient-to-b from-[#8E0E0E]/5 to-transparent border border-[#8E0E0E]/10 hover:border-[#8E0E0E]/30 transition-all duration-200 hover:-translate-y-1 flex flex-col items-center"
              >
                <div className="flex justify-center mb-4">
                  {vp.isImg ? (
                    <img src={vp.icon} alt={vp.title} className="w-12 h-12 object-contain rounded-lg bg-white p-1" />
                  ) : (
                    <div className="text-[#E05009] p-3 bg-[#E05009]/10 rounded-2xl">
                      {vp.icon === 'Award' && <Award className="w-8 h-8" />}
                      {vp.icon === 'BadgePercent' && <BadgePercent className="w-8 h-8" />}
                      {vp.icon === 'Zap' && <Zap className="w-8 h-8" />}
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{vp.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{vp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW TO ORDER ===== */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#8E0E0E] via-[#A9240E] to-[#E05009]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block text-white/70 font-semibold text-sm mb-2 tracking-wider uppercase">Simple & Mudah</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Cara Order di A6 Nyuss
            </h2>
            <p className="text-white/80 max-w-md mx-auto">
              Hanya 3 langkah untuk menikmati martabak & terang bulan favorit kamu
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {orderSteps.map((step, index) => (
              <div key={step.step} className="text-center relative">
                {index < orderSteps.length - 1 && (
                  <div className="hidden sm:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-white/30" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white mx-auto mb-4">
                  {step.icon === 'Search' && <Search className="w-8 h-8" />}
                  {step.icon === 'FileText' && <FileText className="w-8 h-8" />}
                  {step.icon === 'ShoppingBag' && <ShoppingBag className="w-8 h-8" />}
                </div>
                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/30 text-white text-xs font-bold mb-2">
                  {step.step}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-white/70 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-[#8E0E0E] font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-xl"
            >
              Mulai Pesan Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block text-[#E05009] font-semibold text-sm mb-2 tracking-wider uppercase">Review Pelanggan</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
              Kata <span className="text-[#8E0E0E]">Mereka</span>
            </h2>
            <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
            <p className="text-gray-500 text-sm">4.9/5 dari ratusan pelanggan setia</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {t.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LOCATION PREVIEW ===== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block text-[#E05009] font-semibold text-sm mb-2 tracking-wider uppercase">Temukan Kami</span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                Lokasi <span className="text-[#8E0E0E]">A6 Nyuss</span>
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#8E0E0E]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#8E0E0E]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Alamat</p>
                    <p className="text-gray-500 text-sm whitespace-pre-line">{settings.store_address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#8E0E0E]/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#8E0E0E]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Jam Operasional</p>
                    <p className="text-gray-500 text-sm">{settings.opening_hours}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Status Hari Ini</p>
                    {isStoreOpen() ? (
                      <p className="text-green-600 font-semibold text-sm">BUKA SEKARANG</p>
                    ) : (
                      <p className="text-red-600 font-semibold text-sm">SEDANG TUTUP</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/contact"
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white font-semibold rounded-xl hover:from-[#9C1B0B] hover:to-[#D94708] transition-all"
                >
                  <MapPin className="w-4 h-4" /> Lihat Peta
                </Link>
                <a
                  href={`https://wa.me/${settings.whatsapp_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all"
                >
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl h-80 bg-gray-100">
              <iframe
                src={settings.google_maps_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.9787806389904!2d112.72062749999999!3d-7.243253699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f96790ef97d9%3A0x4e9b27e564abc301!2sMartabak%20%26%20Terang%20Bulan%20A6%20Nyuss!5e0!3m2!1sid!2sid!4v1780307482136!5m2!1sid!2sid'}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA FOOTER ===== */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#1a0a0a] to-[#2d0505]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Siap Pesan <span className="text-[#E05009]">Sekarang</span>?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Martabak & terang bulan otentik siap dikirim atau diambil. Pesan sekarang, siap ~20 menit!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white font-bold text-lg rounded-2xl hover:from-[#9C1B0B] hover:to-[#D94708] transition-all duration-200 hover:scale-105 shadow-xl"
            >
              <ShoppingBag className="w-5 h-5" /> Lihat Menu
            </Link>
            <a
              href={`https://wa.me/${settings.whatsapp_number}?text=Halo%20A6%20Nyuss%2C%20saya%20mau%20pesan`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-10 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-2xl transition-all duration-200 hover:scale-105 shadow-xl"
            >
              <MessageSquare className="w-5 h-5" /> Order via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

```

---

### File: `apps/customer/app/privacy/page.tsx`

```tsx
"use client";
import Link from 'next/link';
import { FileText, Mail, MessageSquare, MapPin } from 'lucide-react';


export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <FileText className="w-8 h-8" /> Kebijakan Privasi
          </h1>
          <p className="text-white/80 mt-1 text-sm">Terakhir diperbarui: 1 Januari 2026</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 prose prose-gray max-w-none">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">1. Data yang Kami Kumpulkan</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Dalam rangka memproses pesanan Anda, kami mengumpulkan data berikut:
            </p>
            <ul className="text-gray-600 text-sm space-y-1 mt-2 list-disc list-inside">
              <li><strong>Nama lengkap</strong> — untuk identifikasi pesanan</li>
              <li><strong>Nomor WhatsApp</strong> — untuk konfirmasi dan komunikasi pesanan</li>
              <li><strong>Alamat pengiriman</strong> — hanya untuk pesanan delivery</li>
              <li><strong>Detail pesanan</strong> — menu, jumlah, total harga</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">2. Cara Kami Menggunakan Data</h2>
            <p className="text-gray-600 text-sm leading-relaxed">Data yang Anda berikan hanya digunakan untuk:</p>
            <ul className="text-gray-600 text-sm space-y-1 mt-2 list-disc list-inside">
              <li>Memproses dan menyelesaikan pesanan Anda</li>
              <li>Menghubungi Anda terkait status pesanan</li>
              <li>Konfirmasi pengiriman dan pickup</li>
              <li>Merespons pertanyaan dan keluhan Anda</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">3. Kerahasiaan Data</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Kami berkomitmen untuk menjaga kerahasiaan data Anda. <strong>Data Anda tidak akan dibagikan, dijual, atau dipinjamkan kepada pihak ketiga</strong> manapun tanpa persetujuan eksplisit dari Anda, kecuali diwajibkan oleh hukum yang berlaku di Indonesia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">4. Penyimpanan Data</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Data pesanan disimpan secara lokal di perangkat Anda (browser storage) untuk keperluan tracking pesanan. Data ini tidak dikirimkan ke server eksternal dan akan otomatis terhapus saat Anda membersihkan data browser.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">5. Hak Anda atas Data</h2>
            <p className="text-gray-600 text-sm leading-relaxed">Anda memiliki hak untuk:</p>
            <ul className="text-gray-600 text-sm space-y-1 mt-2 list-disc list-inside">
              <li>Mengetahui data apa yang kami simpan tentang Anda</li>
              <li>Meminta penghapusan data Anda dari sistem kami</li>
              <li>Menolak penggunaan data untuk tujuan tertentu</li>
            </ul>
            <p className="text-gray-600 text-sm mt-2">
              Untuk mengajukan permintaan tersebut, hubungi kami di <a href="mailto:martabaka6nyusss@gmail.com" className="text-[#8E0E0E] font-medium">martabaka6nyusss@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">6. Cookie & Teknologi Tracking</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Website kami menggunakan localStorage browser untuk menyimpan data keranjang belanja dan pesanan Anda secara lokal. Kami tidak menggunakan cookie tracking pihak ketiga atau iklan bertarget.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">7. Perubahan Kebijakan</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan diumumkan melalui website atau WhatsApp. Penggunaan layanan kami setelah perubahan dianggap sebagai persetujuan terhadap kebijakan baru.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">8. Hubungi Kami</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Jika ada pertanyaan mengenai Kebijakan Privasi ini, silakan hubungi kami:
            </p>
            <ul className="text-gray-600 text-sm space-y-2 mt-3">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <strong>Email:</strong> <a href="mailto:martabaka6nyusss@gmail.com" className="text-[#8E0E0E] hover:underline">martabaka6nyusss@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <strong>WhatsApp:</strong> <a href="https://wa.me/6287811123482" className="text-[#8E0E0E] hover:underline">0878-1112-3482</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <span><strong>Alamat:</strong> Jl. Demak No.253, Dupak, Kec. Krembangan, Surabaya, Jawa Timur 60179 (Depan Mess DITPOLARIUD POLDA JATIM SURABAYA)</span>
              </li>
            </ul>
          </section>

          <div className="border-t pt-4">
            <Link href="/terms" className="text-[#8E0E0E] text-sm font-medium hover:underline">
              Lihat juga: Syarat & Ketentuan →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

```

---

### File: `apps/customer/app/promo/page.tsx`

```tsx
"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Tag, AlertCircle, Gift, ShoppingBag, Sparkles, Moon, Award, Ticket } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

const promos = [
  {
    id: 1,
    icon: <Gift className="w-5 h-5 text-white" />,
    title: 'Anniversary A6 Nyuss!',
    desc: 'Rayakan 25 tahun A6 Nyuss! Dapatkan diskon 25% untuk semua menu Terang Bulan setiap hari Jumat selama bulan ini.',
    period: '1 – 31 Januari 2026',
    syarat: 'Berlaku untuk semua menu Terang Bulan. Minimum order Rp 50.000. Tidak berlaku bersamaan dengan promo lain.',
    badge: 'HOT',
    badgeCls: 'bg-orange-500',
    active: true,
    code: 'ANNIV25',
  },
  {
    id: 2,
    icon: <ShoppingBag className="w-5 h-5 text-white" />,
    title: 'Bundling Hemat Keluarga',
    desc: '2 Terang Bulan (pilihan) + 1 Martabak Telur (Ayam/Bebek) hanya Rp 85.000! Hemat lebih dari 20% dari harga normal.',
    period: 'Berlaku setiap hari',
    syarat: 'Harga sudah termasuk semua varian regular. Berlaku untuk pickup dan delivery.',
    badge: 'NEW',
    badgeCls: 'bg-blue-500',
    active: true,
    code: 'BUNDLING',
  },
  {
    id: 3,
    icon: <Sparkles className="w-5 h-5 text-white" />,
    title: 'Promo Grand Opening Web App',
    desc: 'Rayakan peluncuran web app A6 Nyuss! Order pertama via web dapat gratis 1 Es Teh Manis untuk setiap transaksi di atas Rp 40.000.',
    period: 'Edisi terbatas — sampai kuota habis',
    syarat: 'Berlaku untuk transaksi pertama via website. Minimum order Rp 40.000.',
    badge: 'SPECIAL',
    badgeCls: 'bg-purple-500',
    active: true,
    code: 'WEBAPPNEW',
  },
  {
    id: 4,
    icon: <Moon className="w-5 h-5 text-white" />,
    title: 'Promo Malam Mingguan',
    desc: 'Setiap Sabtu malam mulai jam 19:00, dapatkan diskon 15% untuk semua Terang Bulan. Cocok untuk nongkrong seru!',
    period: 'Setiap Sabtu, 19:00 – tutup',
    syarat: 'Berlaku untuk semua varian Terang Bulan. Tidak berlaku bersamaan dengan promo lain.',
    badge: 'MINGGUAN',
    badgeCls: 'bg-indigo-500',
    active: true,
    code: 'SATURDAY15',
  },
  {
    id: 5,
    icon: <Award className="w-5 h-5 text-white" />,
    title: 'Diskon Pelajar & Mahasiswa',
    desc: 'Tunjukkan kartu pelajar/mahasiswa dan dapatkan diskon 10% untuk semua menu. Berlaku setiap hari Senin–Jumat.',
    period: 'Senin–Jumat, jam operasional',
    syarat: 'Wajib menunjukkan kartu pelajar/mahasiswa yang masih aktif. Hanya untuk pickup.',
    badge: 'PELAJAR',
    badgeCls: 'bg-green-500',
    active: false,
    code: 'MATEB10',
  },
];

export default function Promo() {
  const router = useRouter();
  const activePromos = promos.filter(p => p.active);
  const inactivePromos = promos.filter(p => !p.active);

  const handleClaim = (promo: typeof promos[0]) => {
    if (promo.code === 'BUNDLING') {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('menu_category_filter', 'paket-bundling');
      }
      toast.success('Silakan pilih paket bundling hemat kami! Harga sudah didiskon langsung.');
      router.push('/menu');
      return;
    }

    useCartStore.setState({ promoCode: promo.code });
    toast.success(`Kupon ${promo.code} berhasil diklaim!`);
    router.push('/menu');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 flex items-center justify-center gap-2">
            <Ticket className="w-8 h-8" /> Promo & Special Offer
          </h1>
          <p className="text-white/80">Penawaran spesial hanya untuk pelanggan setia A6 Nyuss</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Active Promos */}
        <div className="mb-8">
          <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Promo Aktif
          </h2>
          <div className="space-y-4">
            {activePromos.map((promo) => (
              <div
                key={promo.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="bg-gradient-to-r from-[#8E0E0E] to-[#E05009] px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{promo.icon}</span>
                    <h3 className="text-white font-bold text-base">{promo.title}</h3>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${promo.badgeCls}`}>
                    {promo.badge}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-gray-700 mb-3 leading-relaxed">{promo.desc}</p>
                  <div className="flex items-center gap-2 text-sm text-[#8E0E0E] mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">{promo.period}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-500 bg-gray-50 rounded-xl p-3">
                    <Tag className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span><strong>S&K:</strong> {promo.syarat}</span>
                  </div>
                  <button
                    onClick={() => handleClaim(promo)}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white rounded-xl font-semibold text-sm hover:from-[#9C1B0B] hover:to-[#D94708] transition-all cursor-pointer"
                  >
                    Klaim Promo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inactive / Coming Soon */}
        {inactivePromos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-gray-400" />
              Promo Akan Datang
            </h2>
            <div className="space-y-3">
              {inactivePromos.map((promo) => (
                <div key={promo.id} className="bg-gray-100 rounded-2xl p-5 opacity-70">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl grayscale">{promo.icon}</span>
                    <h3 className="font-bold text-gray-600">{promo.title}</h3>
                    <span className="text-xs bg-gray-300 text-gray-600 px-2 py-0.5 rounded-full ml-auto">Segera Hadir</span>
                  </div>
                  <p className="text-gray-500 text-sm">{promo.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instagram CTA */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          <h3 className="text-xl font-black mb-2">Ikuti Kami di Instagram</h3>
          <p className="text-white/80 text-sm mb-4">
            Jangan sampai ketinggalan promo terbaru! Follow <strong>@a6nyuss</strong> untuk update harian dan flash sale eksklusif.
          </p>
          <a
            href="https://www.instagram.com/a6nyusss"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Follow @a6nyuss
          </a>
        </div>
      </div>
    </div>
  );
}

```

---

### File: `apps/customer/app/terms/page.tsx`

```tsx
"use client";
import Link from 'next/link';
import { FileText, Mail, MessageSquare, MapPin } from 'lucide-react';


export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <FileText className="w-8 h-8" /> Syarat & Ketentuan
          </h1>
          <p className="text-white/80 mt-1 text-sm">Terakhir diperbarui: 1 Januari 2026</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">1. Ketentuan Umum</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Dengan menggunakan layanan pemesanan online Martabak & Terang Bulan A6 Nyuss, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku. Layanan ini dioperasikan oleh A6 Nyuss yang berkedudukan di Surabaya, Indonesia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">2. Ketentuan Pemesanan</h2>
            <ul className="text-gray-600 text-sm space-y-2 list-disc list-inside leading-relaxed">
              <li>Pesanan hanya dapat dilakukan selama jam operasional toko (Setiap Hari: 17:00–01:00)</li>
              <li>Setiap pesanan yang diterima akan dikonfirmasi melalui WhatsApp</li>
              <li>A6 Nyuss berhak menolak pesanan yang tidak dapat dipenuhi</li>
              <li>Pelanggan tidak perlu membuat akun untuk melakukan pemesanan</li>
              <li>Informasi yang diberikan saat pemesanan harus akurat dan benar</li>
              <li>Minimum order untuk delivery adalah Rp 30.000 (belum termasuk ongkir)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">3. Kebijakan Pembatalan</h2>
            <ul className="text-gray-600 text-sm space-y-2 list-disc list-inside leading-relaxed">
              <li>Pembatalan pesanan dapat dilakukan dalam 5 menit setelah pemesanan dengan menghubungi kami via WhatsApp</li>
              <li>Pesanan yang sudah dalam proses pembuatan tidak dapat dibatalkan</li>
              <li>A6 Nyuss berhak membatalkan pesanan jika terjadi kehabisan bahan atau force majeure</li>
              <li>Refund dilakukan dalam 1–3 hari kerja untuk pembayaran transfer</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">4. Kebijakan Pengiriman & Pickup</h2>
            <ul className="text-gray-600 text-sm space-y-2 list-disc list-inside leading-relaxed">
              <li>Pickup: Pesanan siap diambil dalam ~20 menit setelah dikonfirmasi</li>
              <li>Delivery: Estimasi pengiriman ~40 menit, dapat bervariasi tergantung kondisi lalu lintas</li>
              <li>Ongkir dihitung berdasarkan zona pengiriman yang dipilih saat checkout</li>
              <li>Jika alamat tidak dapat dijangkau atau tidak ditemukan, pesanan akan dikembalikan ke toko</li>
              <li>A6 Nyuss tidak bertanggung jawab atas keterlambatan yang disebabkan oleh kondisi luar biasa (banjir, kemacetan parah, dll.)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">5. Kebijakan Harga</h2>
            <ul className="text-gray-600 text-sm space-y-2 list-disc list-inside leading-relaxed">
              <li>Harga yang tertera di website adalah harga terkini dan bersifat mengikat untuk pesanan yang sudah dikonfirmasi</li>
              <li>A6 Nyuss berhak mengubah harga sewaktu-waktu tanpa pemberitahuan sebelumnya</li>
              <li>Perubahan harga tidak berlaku untuk pesanan yang sudah dikonfirmasi sebelum perubahan</li>
              <li>Harga sudah termasuk PPN jika berlaku</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">6. Kualitas Produk & Garansi</h2>
            <ul className="text-gray-600 text-sm space-y-2 list-disc list-inside leading-relaxed">
              <li>A6 Nyuss menjamin seluruh produk dibuat dari bahan halal dan berkualitas</li>
              <li>Jika produk yang diterima tidak sesuai pesanan atau rusak, segera hubungi kami dalam 30 menit</li>
              <li>Klaim ketidaksesuaian harus disertai foto sebagai bukti</li>
              <li>Produk yang sudah dimakan lebih dari 50% tidak dapat diklaim</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">7. Batasan Tanggung Jawab</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              A6 Nyuss tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan layanan ini. Tanggung jawab kami terbatas pada nilai pesanan yang bersangkutan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">8. Kebijakan Privasi</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Penggunaan data pribadi Anda diatur dalam{' '}
              <Link href="/privacy" className="text-[#8E0E0E] font-medium hover:underline">Kebijakan Privasi</Link>{' '}
              kami yang merupakan bagian tidak terpisahkan dari syarat dan ketentuan ini.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">9. Kontak & Pengaduan</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-2">
              Untuk pertanyaan, keluhan, atau saran terkait layanan kami:
            </p>
            <ul className="text-gray-600 text-sm space-y-2 mt-3">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <strong>Email:</strong> <a href="mailto:martabaka6nyusss@gmail.com" className="text-[#8E0E0E] hover:underline">martabaka6nyusss@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <strong>WhatsApp:</strong> <a href="https://wa.me/6287811123482" className="text-[#8E0E0E] hover:underline">0878-1112-3482</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <span><strong>Alamat:</strong> Jl. Demak No.253, Dupak, Kec. Krembangan, Surabaya, Jawa Timur 60179 (Depan Mess DITPOLARIUD POLDA JATIM SURABAYA)</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-3">10. Hukum yang Berlaku</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Syarat dan ketentuan ini tunduk pada hukum yang berlaku di Republik Indonesia. Segala sengketa diselesaikan melalui musyawarah mufakat, dan jika tidak tercapai, diselesaikan melalui jalur hukum di Pengadilan Negeri Surabaya.
            </p>
          </section>

          <div className="border-t pt-4">
            <Link href="/privacy" className="text-[#8E0E0E] text-sm font-medium hover:underline">
              Lihat juga: Kebijakan Privasi →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

```

---

### File: `apps/customer/app/test-sentry/page.tsx`

```tsx
"use client";

import { useState } from "react";

export default function TestSentryPage() {
  const [serverResult, setServerResult] = useState<string | null>(null);
  const [serverLoading, setServerLoading] = useState(false);

  async function triggerServerError() {
    setServerLoading(true);
    setServerResult(null);
    try {
      const res = await fetch("/api/test-sentry-server");
      const data = await res.json();
      setServerResult(JSON.stringify(data));
    } catch (e) {
      setServerResult("✅ Server error berhasil dikirim ke Sentry!");
    } finally {
      setServerLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #e53e3e, #f97316)" }}>
            <span className="text-3xl">🛡️</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Sentry Test</h1>
          <p className="text-slate-400 text-sm">Customer App — Port 3000</p>
        </div>

        <div className="space-y-4">
          {/* Client Error Button */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-slate-300 mb-1">Client-Side Error</h2>
            <p className="text-xs text-slate-500 mb-4">
              Trigger JavaScript error di browser → harus muncul di Sentry Issues
            </p>
            <button
              onClick={() => {
                throw new Error("Sentry Client-Side Test Error dari Aplikasi Customer!");
              }}
              className="w-full py-3 px-4 rounded-xl font-semibold text-white text-sm transition-all"
              style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}
            >
              🔴 Trigger Client Error
            </button>
          </div>

          {/* Server Error Button */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-slate-300 mb-1">Server-Side Error</h2>
            <p className="text-xs text-slate-500 mb-4">
              Trigger error di Next.js API Route → harus muncul di Sentry Issues
            </p>
            <button
              onClick={triggerServerError}
              disabled={serverLoading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
            >
              {serverLoading ? "Memuat..." : "🟣 Trigger Server Error"}
            </button>
            {serverResult && (
              <p className="mt-3 text-xs text-emerald-400 font-medium">{serverResult}</p>
            )}
          </div>

          {/* Status */}
          <div className="bg-slate-900 border border-emerald-800/40 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-emerald-400 mb-3">✅ Cara Verifikasi</h2>
            <ol className="space-y-2 text-xs text-slate-400">
              <li>1. Klik salah satu tombol di atas</li>
              <li>2. Buka <span className="text-white font-mono">sentry.io</span></li>
              <li>3. Masuk ke project <span className="text-white font-mono">taj-saas-customer</span></li>
              <li>4. Cek di menu <span className="text-white">Issues</span> — error harus muncul dalam ~1 menit</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

```

---

### File: `apps/customer/app/tracking/page.tsx`

```tsx
"use client";
import { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Clock, AlertTriangle, X, Copy, CheckCircle, ClipboardList, Flame, Package, CheckCircle2, XCircle, Banknote, QrCode, ShieldCheck, FileText, AlertCircle, UploadCloud, Inbox, MessageSquare, ShoppingBag, Truck } from 'lucide-react';
import { useOrderStore, Order } from '@/store/cartStore';
import { formatPrice } from '@/data/menu';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig = {
  received: {
    label: 'Pesanan Diterima',
    color: 'blue',
    icon: 'ClipboardList',
    desc: 'Pesanan Anda sudah kami terima dan sedang menunggu konfirmasi.',
    step: 1,
  },
  processing: {
    label: 'Sedang Diproses',
    color: 'yellow',
    icon: 'Flame',
    desc: 'Pesanan Anda sedang dimasak dengan penuh kasih sayang! 🍫',
    step: 2,
  },
  ready: {
    label: 'Siap Diambil / Sedang Diantar',
    color: 'orange',
    icon: 'Package',
    desc: '',
    step: 3,
  },
  completed: {
    label: 'Selesai',
    color: 'green',
    icon: 'CheckCircle2',
    desc: 'Terima kasih! Pesanan Anda telah selesai. Sampai jumpa lagi!',
    step: 4,
  },
  cancelled: {
    label: 'Dibatalkan',
    color: 'red',
    icon: 'XCircle',
    desc: 'Pesanan Anda telah dibatalkan. Hubungi kami untuk informasi lebih lanjut.',
    step: 0,
  },
};

const colorMap = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', dot: 'bg-blue-500' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300', dot: 'bg-yellow-500' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', dot: 'bg-orange-500' },
  green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', dot: 'bg-green-500' },
  red: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', dot: 'bg-red-500' },
};

const timelineSteps: { step: number; label: string; icon: string; key: Order['status'] }[] = [
  { step: 1, label: 'Diterima', icon: 'ClipboardList', key: 'received' },
  { step: 2, label: 'Diproses', icon: 'Flame', key: 'processing' },
  { step: 3, label: 'Siap/Diantar', icon: 'Package', key: 'ready' },
  { step: 4, label: 'Selesai', icon: 'CheckCircle2', key: 'completed' },
];

export default function Tracking() {
  const [inputCode, setInputCode] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searching, setSearching] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const { currentOrder, getOrderByCode } = useOrderStore();

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Phone search states
  const [inputPhone, setInputPhone] = useState('');
  const [searchingPhone, setSearchingPhone] = useState(false);
  const [foundOrders, setFoundOrders] = useState<any[]>([]);
  const [phoneSearched, setPhoneSearched] = useState(false);

  const handleUploadProof = async () => {
    if (!order || !uploadFile) {
      toast.error('Silakan pilih gambar bukti transfer terlebih dahulu');
      return;
    }

    if (uploadFile.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB. Silakan pilih file yang lebih kecil.');
      return;
    }

    setUploading(true);
    try {
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const publicUrl = 'https://placehold.co/400x600/16a34a/white?text=Bukti+Transfer+MOCK';
      
      // Update local state
      setOrder((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          paymentStatus: 'waiting_verification',
          paymentProofUrl: publicUrl,
        };
      });

      // Update in Zustand order history
      const history = useOrderStore.getState().orderHistory;
      const updatedHistory = history.map((o) =>
        o.orderCode === order.orderCode
          ? { ...o, paymentStatus: 'waiting_verification', paymentProofUrl: publicUrl }
          : o
      );
      useOrderStore.setState({
        orderHistory: updatedHistory,
        currentOrder:
          useOrderStore.getState().currentOrder?.orderCode === order.orderCode
            ? {
                ...useOrderStore.getState().currentOrder!,
                paymentStatus: 'waiting_verification',
                paymentProofUrl: publicUrl,
              }
            : useOrderStore.getState().currentOrder,
      });

      toast.success('Bukti transfer berhasil diunggah! Menunggu verifikasi admin.');
      setUploadFile(null);
      setShowQrisModal(false);
    } catch (err: any) {
      console.error('Error uploading payment proof:', err);
      toast.error(`Gagal mengunggah bukti: ${err.message || 'Terjadi kesalahan'}`);
    } finally {
      setUploading(false);
    }
  };

  const getWhatsAppLink = (ord: Order) => {
    const itemsSummary = ord.items
      .map((i) => `- ${i.menuItem.name} x${i.quantity} = ${formatPrice(i.totalPrice)}`)
      .join('%0A');
    const paymentLabel = ord.orderType === 'pickup'
      ? (ord.paymentMethod === 'cod' ? 'Tunai' : 'QRIS')
      : (ord.paymentMethod === 'cod' ? 'Tunai COD' : 'QRIS');
    const msg =
      `Halo A6 Nyuss! Saya sudah melakukan pemesanan online%0A%0A` +
      `*Kode Order: ${ord.orderCode}*%0A%0A` +
      `*Detail Pesanan:*%0A${itemsSummary}%0A%0A` +
      `*Total: ${formatPrice(ord.total)}*%0A` +
      `*Tipe: ${ord.orderType === 'pickup' ? 'Pickup' : 'Delivery'}*%0A` +
      `*Pembayaran: ${paymentLabel}*%0A%0A` +
      `Mohon dikonfirmasi ya! Terima kasih`;
    return `https://wa.me/6287811123482?text=${msg}`;
  };

  const handleCancelOrder = () => {
    if (!order) return;
    setShowCancelModal(true);
  };

  const executeCancelOrder = async () => {
    if (!order) return;
    setShowCancelModal(false);
    setCancelling(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      useOrderStore.getState().updateOrderStatus(order.orderCode, 'cancelled');
      setOrder((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: 'cancelled',
        };
      });
      toast.success("Pesanan berhasil dibatalkan");
    } catch (err: any) {
      console.error("Error cancelling order:", err);
      toast.error(`Gagal membatalkan pesanan: ${err.message || 'Terjadi kesalahan'}`);
    } finally {
      setCancelling(false);
    }
  };

  const fetchOrderFromDb = async (code: string): Promise<Order | null> => {
    try {
      // Try to get from local Zustand history first
      const localOrder = useOrderStore.getState().getOrderByCode(code);
      if (localOrder) return localOrder;

      // Otherwise, generate a realistic mock order on the fly for demonstration
      return {
        orderCode: code,
        customerName: 'Pelanggan Demo',
        customerPhone: '081234567890',
        orderType: 'delivery',
        deliveryAddress: 'Jl. Pemuda No. 123, Surabaya',
        addressNote: 'Pagar putih sebelah warung',
        deliveryFee: 10000,
        subtotal: 45000,
        total: 55000,
        status: 'received',
        createdAt: new Date().toISOString(),
        estimatedTime: 40,
        items: [
          {
            cartId: 'item-1',
            menuItem: {
              id: 'menu-1',
              slug: 'martabak-telur-ayam-2-telur-25k',
              name: 'Martabak Telur Ayam - 2 Telur',
              category: 'martabak-telur-ayam',
              categoryLabel: 'Martabak Telur Ayam',
              price: 25000,
              image: '',
              description: '',
            },
            selectedVariants: [],
            quantity: 1,
            note: '',
            totalPrice: 25000,
          },
          {
            cartId: 'item-2',
            menuItem: {
              id: 'menu-2',
              slug: 'terang-bulan-2-variant-topping',
              name: 'Terang Bulan 2 Variant Topping',
              category: 'terang-bulan',
              categoryLabel: 'Terang Bulan',
              price: 20000,
              image: '',
              description: '',
            },
            selectedVariants: [],
            quantity: 1,
            note: '',
            totalPrice: 20000,
          }
        ],
        paymentMethod: 'transfer',
        generalNote: '',
        paymentStatus: 'pending',
      } as any;
    } catch (err) {
      console.error('Error fetching order:', err);
      return null;
    }
  };

  // Check for successful checkout redirect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('new') === 'true' || searchParams.get('success') === 'true') {
        setShowSuccessModal(true);
        // Clear parameter from URL to prevent showing modal again on refresh
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, []);

  const handleSearchPhone = async () => {
    const trimmedPhone = inputPhone.trim().replace(/\s/g, '');
    if (!trimmedPhone) {
      toast.error('Silakan masukkan nomor HP terlebih dahulu');
      return;
    }

    setSearchingPhone(true);
    setPhoneSearched(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Search from local order history
      const localHistory = useOrderStore.getState().orderHistory;
      const filtered = localHistory.filter((o) => o.customerPhone.replace(/\s/g, '') === trimmedPhone);
      
      const mapped = filtered.map(o => ({
        order_code: o.orderCode,
        status: o.status,
        created_at: o.createdAt,
        total_price: o.total,
      }));
      setFoundOrders(mapped);
    } catch (err: any) {
      console.error('Error searching orders by phone:', err);
      toast.error('Gagal mencari pesanan. Silakan coba lagi.');
    } finally {
      setSearchingPhone(false);
    }
  };

  // Auto-load current order with 15 minutes expiry check after completion
  useEffect(() => {
    if (currentOrder) {
      if (currentOrder.status === 'completed' || currentOrder.status === 'cancelled') {
        const finishedTime = currentOrder.updatedAt ? new Date(currentOrder.updatedAt).getTime() : new Date(currentOrder.createdAt).getTime();
        const isExpired = Date.now() - finishedTime > 15 * 60 * 1000; // 15 minutes in ms

        if (isExpired) {
          useOrderStore.setState({ currentOrder: null });
          setOrder(null);
          setInputCode('');
          return;
        }
      }

      setInputCode(currentOrder.orderCode);
      setSearching(true);
      fetchOrderFromDb(currentOrder.orderCode).then((dbOrder) => {
        if (dbOrder) {
          if (dbOrder.status === 'completed' || dbOrder.status === 'cancelled') {
            const finishedTime = dbOrder.updatedAt ? new Date(dbOrder.updatedAt).getTime() : new Date(dbOrder.createdAt).getTime();
            const isExpired = Date.now() - finishedTime > 15 * 60 * 1000;

            if (isExpired) {
              useOrderStore.setState({ currentOrder: null });
              setOrder(null);
              setInputCode('');
              setSearching(false);
              return;
            }
          }
          setOrder(dbOrder);
        } else {
          setOrder(null);
        }
        setSearching(false);
      });
    }
  }, [currentOrder]);

  // Periodic check to clear tracking if active order is completed/cancelled and older than 15 minutes
  useEffect(() => {
    if (!currentOrder) return;

    const checkExpiry = () => {
      const activeStatus = order?.status || currentOrder.status;
      const activeUpdatedAt = order?.updatedAt || currentOrder.updatedAt || currentOrder.createdAt;

      if (activeStatus === 'completed' || activeStatus === 'cancelled') {
        const finishedTime = new Date(activeUpdatedAt).getTime();
        if (Date.now() - finishedTime > 15 * 60 * 1000) { // 15 minutes
          useOrderStore.setState({ currentOrder: null });
          setOrder(null);
          setInputCode('');
          toast.success("Sesi pelacakan telah berakhir setelah 15 menit status selesai.");
        }
      }
    };

    const interval = setInterval(checkExpiry, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
  }, [currentOrder, order]);

  // Poll order status periodically (replaces unsafe Realtime subscription that required USING(true) RLS)
  useEffect(() => {
    if (!order) return;

    // Do not poll if the order is already in a final state (completed or cancelled)
    if (order.status === 'completed' || order.status === 'cancelled') return;

    const intervalId = setInterval(async () => {
      const dbOrder = await fetchOrderFromDb(order.orderCode);
      if (dbOrder) {
        // Check for updates
        const hasStatusChanged = dbOrder.status !== order.status;
        const hasPaymentStatusChanged = dbOrder.paymentStatus !== order.paymentStatus;
        const hasPaymentProofChanged = dbOrder.paymentProofUrl !== order.paymentProofUrl;

        if (hasStatusChanged || hasPaymentStatusChanged || hasPaymentProofChanged) {
          setOrder(dbOrder);

          if (hasStatusChanged) {
            toast.success(
              `Status pesanan diperbarui menjadi: ${
                statusConfig[dbOrder.status as keyof typeof statusConfig]?.label || dbOrder.status
              }`,
              { id: 'status-update' }
            );

            // Update status in Zustand store
            useOrderStore.getState().updateOrderStatus(order.orderCode, dbOrder.status);

            // Sync with currentOrder in Zustand store
            const storeCurrentOrder = useOrderStore.getState().currentOrder;
            if (storeCurrentOrder && storeCurrentOrder.orderCode === order.orderCode) {
              useOrderStore.setState({
                currentOrder: {
                  ...storeCurrentOrder,
                  status: dbOrder.status,
                  updatedAt: dbOrder.updatedAt || new Date().toISOString()
                }
              });
            }
          }

          if (hasPaymentStatusChanged) {
            const paymentLabels: Record<string, string> = {
              pending: 'Pending',
              waiting_verification: 'Menunggu Verifikasi',
              paid: 'Lunas',
              failed: 'Gagal Verifikasi'
            };
            const currentPaymentStatus = dbOrder.paymentStatus || 'pending';
            toast.success(
              `Status pembayaran diperbarui menjadi: ${
                paymentLabels[currentPaymentStatus] || currentPaymentStatus
              }`,
              { id: 'payment-update' }
            );
          }
        }
      } else {
        setOrder(null);
        setNotFound(true);
        toast.error("Pesanan ini telah dihapus dari sistem", { id: 'status-delete' });
      }
    }, 15000); // Poll every 15 seconds

    return () => clearInterval(intervalId);
  }, [order?.orderCode, order?.status, order?.paymentStatus, order?.paymentProofUrl]);

  const handleSearch = async () => {
    const trimmed = inputCode.trim().toUpperCase();
    if (!trimmed) return;

    setSearching(true);
    const dbOrder = await fetchOrderFromDb(trimmed);
    setSearching(false);

    if (dbOrder) {
      setOrder(dbOrder);
      setNotFound(false);
    } else {
      setOrder(null);
      setNotFound(true);
    }
  };

  const currentStatus = order ? statusConfig[order.status] : null;
  const currentStep = order?.status === 'cancelled' ? -1 : (currentStatus?.step ?? 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] py-10 px-4 mb-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Lacak Pesanan</h1>
          <p className="text-white/80 text-sm">Masukkan kode pesanan untuk melihat status terkini</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Search Panel - 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Column 1: Track with Order Code */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" /> Lacak Pesanan
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Masukkan kode unik pesanan Anda untuk memantau status secara realtime.
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Contoh: A6-20260101-1234"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8E0E0E] font-mono tracking-wider uppercase text-gray-900 bg-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleSearch}
                disabled={searching}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#8E0E0E] hover:bg-[#9C1B0B] text-white rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer disabled:opacity-60"
              >
                {searching ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Lacak Pesanan
              </button>
              {notFound && (
                <p className="text-red-500 text-xs font-semibold mt-2 text-center">
                  Kode pesanan tidak ditemukan. Periksa kembali kode Anda.
                </p>
              )}
            </div>
          </div>

          {/* Column 2: Find Order Code using Phone Number */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" /> Cari Kode (Lupa Kode?)
              </h3>
              <p className="text-xs text-gray-550 mb-4">
                Masukkan nomor HP Anda untuk mencari riwayat kode pesanan Anda.
              </p>
              <div className="space-y-3">
                <input
                  type="tel"
                  value={inputPhone}
                  onChange={(e) => setInputPhone(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchPhone()}
                  placeholder="Contoh: 08123456789"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8E0E0E] font-mono text-gray-900 bg-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleSearchPhone}
                disabled={searchingPhone}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-700 hover:bg-gray-800 text-white rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer disabled:opacity-60"
              >
                {searchingPhone ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Cari Kode
              </button>
            </div>
          </div>
        </div>

        {/* Search Phone Results */}
        {phoneSearched && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6 animate-in fade-in slide-in-from-top-4 duration-200">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Hasil Pencarian Nomor HP: {inputPhone}
            </h4>
            {foundOrders.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 mb-2">Ditemukan {foundOrders.length} pesanan. Klik pesanan di bawah untuk langsung melacak:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {foundOrders.map((fo) => (
                    <div 
                      key={fo.order_code}
                      onClick={() => {
                        setInputCode(fo.order_code);
                        setSearching(true);
                        fetchOrderFromDb(fo.order_code).then((dbOrder) => {
                          if (dbOrder) {
                            setOrder(dbOrder);
                            setNotFound(false);
                            toast.success(`Melacak pesanan: ${fo.order_code}`);
                          } else {
                            setOrder(null);
                            setNotFound(true);
                          }
                          setSearching(false);
                        });
                      }}
                      className="flex flex-col p-3 border border-gray-150 hover:border-[#8E0E0E] rounded-xl text-left bg-gray-50/50 hover:bg-[#8E0E0E]/5 cursor-pointer transition-all group"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono font-bold text-sm text-[#8E0E0E] group-hover:underline">
                          {fo.order_code}
                        </span>
                        <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-bold uppercase">
                          {statusConfig[fo.status as keyof typeof statusConfig]?.label || fo.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-500">
                        <span>{new Date(fo.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="font-bold text-gray-700">{formatPrice(fo.total_price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 flex flex-col items-center justify-center">
                <Inbox className="w-10 h-10 text-gray-300 mb-2" />
                <p className="text-xs font-bold">Tidak ditemukan pesanan untuk nomor HP tersebut.</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Pastikan nomor HP yang Anda masukkan sama persis dengan saat memesan.</p>
              </div>
            )}
          </div>
        )}

        {/* Order Details */}
        {order && currentStatus && (
          <>
            {/* Status Badge */}
            <div className={`rounded-2xl p-5 border-2 mb-5 ${colorMap[currentStatus.color as keyof typeof colorMap].bg} ${colorMap[currentStatus.color as keyof typeof colorMap].border}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className={`p-2 rounded-xl bg-white flex items-center justify-center ${colorMap[currentStatus.color as keyof typeof colorMap].text}`}>
                  {currentStatus.icon === 'ClipboardList' && <ClipboardList className="w-6 h-6" />}
                  {currentStatus.icon === 'Flame' && <Flame className="w-6 h-6" />}
                  {currentStatus.icon === 'Package' && <Package className="w-6 h-6" />}
                  {currentStatus.icon === 'CheckCircle2' && <CheckCircle2 className="w-6 h-6" />}
                  {currentStatus.icon === 'XCircle' && <XCircle className="w-6 h-6" />}
                </span>
                <div>
                  <p className="text-xs font-medium text-gray-600">Status Pesanan</p>
                  <p className={`font-black text-xl ${colorMap[currentStatus.color as keyof typeof colorMap].text}`}>
                    {currentStatus.label}
                  </p>
                </div>
              </div>
              <p className={`text-sm ${colorMap[currentStatus.color as keyof typeof colorMap].text}`}>
                {order.status === 'ready'
                  ? order.orderType === 'pickup'
                    ? 'Pesanan siap diambil! Silakan datang ke toko kami.'
                    : 'Pesanan sedang dalam perjalanan ke alamat Anda!'
                  : currentStatus.desc}
              </p>
            </div>

            {/* Payment Status Badge / Action Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">
              <h3 className="font-bold text-gray-800 mb-4">Status Pembayaran</h3>
              
              {order.paymentMethod === 'cod' ? (
                <div className="flex items-center gap-3 bg-stone-50 border border-stone-100 rounded-xl p-4">
                  <Banknote className="w-6 h-6 text-[#E05009] flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {order.orderType === 'pickup' ? 'Bayar Tunai di Gerai' : 'Bayar di Tempat (Tunai COD)'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {order.orderType === 'pickup'
                        ? 'Selesaikan pembayaran tunai saat mengambil pesanan.'
                        : 'Selesaikan pembayaran tunai ke kurir saat menerima pesanan.'}
                    </p>
                    <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 uppercase">
                      {order.orderType === 'pickup' ? 'Tunai • Pending' : 'Tunai COD • Pending'}
                    </span>
                  </div>
                </div>
              ) : (
                /* Transfer Bank / QRIS */
                <div className="space-y-4">
                  {order.paymentStatus === 'pending' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-red-800">Menunggu Pembayaran</p>
                          <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                            Kami belum menerima bukti pembayaran untuk pesanan ini. Silakan scan QRIS untuk membayar dan upload bukti agar pesanan segera dikonfirmasi.
                          </p>
                          <button
                            onClick={() => setShowQrisModal(true)}
                            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#8E0E0E] hover:bg-[#9C1B0B] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                          >
                            <UploadCloud className="w-4 h-4" /> Bayar & Upload Bukti
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {order.paymentStatus === 'waiting_verification' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Clock className="w-6 h-6 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-amber-800">Menunggu Verifikasi Admin</p>
                          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                            Bukti pembayaran telah berhasil diunggah. Kami sedang melakukan verifikasi data pembayaran QRIS Anda. Mohon ditunggu sebentar ya!
                          </p>
                          {order.paymentProofUrl && (
                            <div className="mt-3">
                              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Bukti Pembayaran QRIS Anda:</p>
                              <a
                                href={order.paymentProofUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block"
                              >
                                <img
                                  src={order.paymentProofUrl}
                                  alt="Bukti Pembayaran QRIS"
                                  draggable="false"
                                  className="w-20 h-20 object-cover rounded-lg border hover:opacity-85 transition-all shadow-sm"
                                />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {order.paymentStatus === 'paid' && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-green-800">Pembayaran Terverifikasi (Lunas)</p>
                          <p className="text-xs text-green-700 mt-0.5 leading-relaxed">
                            Pembayaran Anda telah sukses diverifikasi oleh Admin. Pesanan Anda akan diproses sesuai jadwal. Terima kasih banyak!
                          </p>
                          {order.paymentProofUrl && (
                            <div className="mt-2">
                              <a
                                href={order.paymentProofUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-green-700 font-bold hover:underline"
                              >
                                <FileText className="w-3 h-3 inline mr-1" /> Lihat Bukti Pembayaran
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {order.paymentStatus === 'failed' && (
                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <XCircle className="w-6 h-6 text-rose-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-rose-800">Verifikasi Pembayaran Gagal</p>
                          <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                            Bukti pembayaran yang Anda unggah dinilai tidak valid atau dana belum masuk ke rekening kami. Silakan upload bukti transfer yang benar atau hubungi admin.
                          </p>
                          <button
                            onClick={() => setShowQrisModal(true)}
                            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                          >
                            <UploadCloud className="w-4 h-4" /> Upload Bukti Baru
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Timeline */}
            {order.status !== 'cancelled' && (
              <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">
                <h3 className="font-bold text-gray-800 mb-5">Timeline Pesanan</h3>
                <div className="space-y-0">
                  {timelineSteps.map((ts, index) => {
                    const isDone = currentStep >= ts.step;
                    const isCurrent = currentStep === ts.step;
                    return (
                      <div key={ts.key} className="flex gap-4">
                        {/* Step indicator */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                              isDone
                                ? 'bg-[#8E0E0E] border-[#8E0E0E] text-white'
                                : 'bg-gray-100 border-gray-200 text-gray-400'
                            } ${isCurrent ? 'ring-4 ring-[#8E0E0E]/20' : ''}`}
                          >
                            {ts.icon === 'ClipboardList' && <ClipboardList className="w-5 h-5" />}
                            {ts.icon === 'Flame' && <Flame className="w-5 h-5" />}
                            {ts.icon === 'Package' && <Package className="w-5 h-5" />}
                            {ts.icon === 'CheckCircle2' && <CheckCircle2 className="w-5 h-5" />}
                          </div>
                          {index < timelineSteps.length - 1 && (
                            <div
                              className={`w-0.5 h-8 mt-1 ${isDone && currentStep > ts.step ? 'bg-[#8E0E0E]' : 'bg-gray-200'}`}
                            />
                          )}
                        </div>
                        {/* Label */}
                        <div className="pb-6 pt-1.5">
                          <p className={`font-semibold text-sm ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                            {ts.label}
                          </p>
                          {isCurrent && (
                            <p className="text-xs text-[#E05009] font-medium">● Saat ini</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pickup Info */}
            {order.status === 'ready' && order.orderType === 'pickup' && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-5">
                <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Lokasi Pengambilan
                </h3>
                <div className="text-green-700 text-sm mb-3">
                  <p className="font-semibold">Jl. Demak No.253, Dupak, Kec. Krembangan, Surabaya, Jawa Timur 60179</p>
                  <p className="text-green-800 text-xs mt-0.5 font-medium">Depan Mess DITPOLARIUD POLDA JATIM SURABAYA.</p>
                </div>
                <a
                  href="https://www.google.com/maps?q=-7.243211171142016,112.71769837365488"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  <MapPin className="w-4 h-4" /> Buka di Google Maps
                </a>
              </div>
            )}

            {/* Order Info */}
            <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">
              <h3 className="font-bold text-gray-800 mb-4">Info Pesanan</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Kode Order</span>
                  <span className="font-mono font-bold text-gray-900">{order.orderCode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Nama</span>
                  <span className="font-medium">{order.customerName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tipe</span>
                  <span className="font-medium flex items-center gap-1.5">{order.orderType === 'pickup' ? <ShoppingBag className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />} {order.orderType === 'pickup' ? 'Pickup' : 'Delivery'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Metode Pembayaran</span>
                  <span className="font-medium uppercase flex items-center justify-end gap-1.5">
                    {order.paymentMethod === 'cod' ? <Banknote className="w-3.5 h-3.5" /> : <QrCode className="w-3.5 h-3.5" />}
                    {order.orderType === 'pickup'
                      ? (order.paymentMethod === 'cod' ? 'Tunai' : 'QRIS')
                      : (order.paymentMethod === 'cod' ? 'Tunai COD' : 'QRIS')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total</span>
                  <span className="font-bold text-[#8E0E0E]">{formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Waktu Pesan</span>
                  <span className="font-medium">{new Date(order.createdAt).toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Items */}
              <div className="mt-4 pt-4 border-t space-y-2">
                {order.items.map((item) => (
                  <div key={item.cartId} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.menuItem.name} x{item.quantity}</span>
                    <span className="font-semibold">{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancel Order Button */}
            {order.status !== 'cancelled' && order.status !== 'completed' && (
              <div className="bg-white rounded-2xl p-5 shadow-sm mb-5 text-center">
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  Pesanan hanya dapat dibatalkan sebelum masuk ke tahap siap diambil atau diantar.
                </p>
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling || order.status === 'ready'}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                    order.status === 'ready'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 cursor-pointer'
                  }`}
                >
                  {cancelling ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                      Membatalkan...
                    </div>
                  ) : (
                    'Batalkan Pesanan'
                  )}
                </button>
              </div>
            )}

            {/* Help */}
            <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Ada masalah?</p>
                  <p className="text-gray-500 text-xs">Hubungi kami langsung</p>
                </div>
              </div>
              <a
                href={getWhatsAppLink(order)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp
              </a>
            </div>

            {/* Auto refresh note */}
            <div className="text-center mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>Status diperbarui secara <strong>real-time</strong> otomatis</span>
            </div>
          </>
        )}

        {/* Empty state */}
        {!order && !notFound && (
          <div className="text-center py-16 text-gray-400 flex flex-col items-center justify-center">
            <Search className="w-12 h-12 text-gray-300 mb-4" />
            <p className="font-medium">Masukkan kode pesanan untuk melacak</p>
            <p className="text-sm mt-1">Kode pesanan diberikan setelah order berhasil dibuat</p>
          </div>
        )}
      </div>

      {/* QRIS Upload Modal */}
      {showQrisModal && order && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#8E0E0E] to-[#E05009] p-4 text-white text-center">
              <h3 className="font-black text-lg">Pembayaran QRIS</h3>
              <p className="text-xs text-white/80">Scan QRIS & Unggah Bukti Pembayaran</p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 select-none">
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Pembayaran</p>
                <p className="text-2xl font-black text-[#8E0E0E] mt-1">{formatPrice(order.total)}</p>
                <p className="text-xs text-stone-500 font-mono mt-0.5">Kode Order: {order.orderCode}</p>
              </div>

              {/* QRIS Image Box */}
              <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center border border-gray-100 shadow-inner">
                <img
                  src="/qris.png"
                  alt="QRIS A6 Nyuss"
                  draggable="false"
                  className="w-48 h-48 object-contain rounded-lg border bg-white shadow-sm"
                />
                <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-wide">A6 NYUSS MARTABAK</p>
              </div>

              {/* Instructions */}
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 text-xs text-amber-800 space-y-1">
                <p className="font-bold">Petunjuk Transfer:</p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Scan kode QRIS di atas menggunakan aplikasi M-Banking atau E-Wallet Anda (Gopay/OVO/Dana/dll).</li>
                  <li>Masukkan nominal transfer tepat sebesar <strong className="text-[#8E0E0E]">{formatPrice(order.total)}</strong>.</li>
                  <li>Simpan tangkapan layar (screenshot) bukti transfer sukses Anda.</li>
                  <li>Unggah screenshot tersebut pada kolom di bawah ini.</li>
                </ol>
              </div>

              {/* File Upload Field */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase">Unggah Bukti Transfer</label>
                <div className="border-2 border-dashed border-gray-300 hover:border-[#8E0E0E] rounded-2xl p-4 text-center cursor-pointer transition-all relative bg-gray-50 hover:bg-[#8E0E0E]/5 flex flex-col items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadFile(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <UploadCloud className="w-8 h-8 text-gray-400 mb-1" />
                  <p className="text-sm font-semibold text-gray-850 select-all">
                    {uploadFile ? uploadFile.name : 'Pilih Gambar Bukti Transfer'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Format gambar JPG, PNG (maks. 5MB)</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 flex gap-2">
              <button
                type="button"
                disabled={uploading}
                onClick={() => { setShowQrisModal(false); setUploadFile(null); }}
                className="flex-1 py-3 bg-white hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-sm border border-gray-200 transition-colors"
              >
                Tutup
              </button>
              <button
                type="button"
                disabled={uploading || !uploadFile}
                onClick={handleUploadProof}
                className="flex-1 py-3 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] hover:from-[#9C1B0B] hover:to-[#D94708] text-white font-bold rounded-xl text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Mengunggah...
                  </>
                ) : (
                  'Unggah Bukti'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (order || currentOrder) && (() => {
          const ord = order || currentOrder;
          if (!ord) return null;
          
          const handleCopyCode = () => {
            navigator.clipboard.writeText(ord.orderCode);
            setCopied(true);
            toast.success('Kode pesanan berhasil disalin!');
            setTimeout(() => setCopied(false), 2050);
          };

          return (
            <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-150 flex flex-col max-h-[90vh]"
              >
                {/* Header Banner */}
                <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] p-6 text-white text-center relative overflow-hidden flex-shrink-0">
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3 border border-white/20 shadow-inner">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-black text-xl">Pesanan Berhasil Dibuat!</h3>
                  <p className="text-xs text-white/85 mt-1">Terima kasih {ord.customerName}, pesanan Anda sedang kami proses.</p>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-4 overflow-y-auto flex-1 select-none text-sm">
                  {/* Order Code Container */}
                  <div className="bg-stone-50 border border-stone-150 rounded-2xl p-4 text-center">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Kode Pesanan Anda</p>
                    <p className="text-2xl font-black text-[#8E0E0E] tracking-wider font-mono uppercase">{ord.orderCode}</p>
                    <button
                      onClick={handleCopyCode}
                      className="mt-2.5 inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#8E0E0E]/10 hover:bg-[#8E0E0E]/20 text-[#8E0E0E] rounded-xl text-xs font-bold transition-all"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copied ? 'Tersalin!' : 'Salin Kode'}
                    </button>
                    <p className="text-[10px] text-gray-400 font-medium mt-2">
                      Simpan/salin kode ini untuk melacak pesanan di masa mendatang.
                    </p>
                  </div>

                  {/* Estimasi Waktu */}
                  <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-xl p-3 text-orange-850">
                    <Clock className="w-5 h-5 text-[#E05009] flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Estimasi Waktu Proses</p>
                      <p className="text-xs mt-0.5">
                        ~{ord.estimatedTime} menit ({ord.orderType === 'pickup' ? 'Siap Diambil' : 'Sampai Alamat'})
                      </p>
                    </div>
                  </div>

                  {/* Rincian Ringkas Pesanan */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Rincian Belanja</h4>
                    <div className="border border-gray-100 rounded-xl divide-y divide-gray-100 bg-gray-50/50">
                      {ord.items.map((item) => (
                        <div key={item.cartId} className="p-3 flex justify-between items-start text-xs">
                          <div>
                            <p className="font-semibold text-gray-800">{item.menuItem.name} x{item.quantity}</p>
                            {item.selectedVariants.length > 0 && (
                              <p className="text-[10px] text-gray-500 mt-0.5">
                                {item.selectedVariants.map(v => v.option.name).join(', ')}
                              </p>
                            )}
                          </div>
                          <span className="font-bold text-gray-900">{formatPrice(item.totalPrice)}</span>
                        </div>
                      ))}
                      <div className="p-3 bg-white text-xs font-bold text-gray-900 space-y-1.5 rounded-b-xl">
                        <div className="flex justify-between font-normal text-gray-600">
                          <span>Subtotal</span>
                          <span>{formatPrice(ord.subtotal)}</span>
                        </div>
                        {ord.deliveryFee > 0 && (
                          <div className="flex justify-between font-normal text-gray-600">
                            <span>Ongkos Kirim</span>
                            <span>{formatPrice(ord.deliveryFee)}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t pt-1.5 text-sm text-[#8E0E0E] font-black">
                          <span>TOTAL</span>
                          <span>{formatPrice(ord.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Catatan tipe pembayaran */}
                  <div className="flex justify-between text-xs font-semibold text-gray-600 bg-stone-50 border p-3 rounded-xl">
                    <span>Metode Pembayaran:</span>
                    <span className="uppercase text-gray-850">
                      {ord.orderType === 'pickup'
                        ? (ord.paymentMethod === 'cod' ? 'Tunai' : 'QRIS')
                        : (ord.paymentMethod === 'cod' ? 'Tunai COD (Bayar di Tempat)' : 'QRIS')}
                    </span>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t bg-gray-55 flex flex-col sm:flex-row gap-2 flex-shrink-0">
                  <a
                    href={getWhatsAppLink(ord)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-sm transition-all shadow-md text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" /> Konfirmasi via WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowSuccessModal(false)}
                    className="flex-1 py-3 bg-white hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-sm border border-gray-200 transition-colors cursor-pointer text-center"
                  >
                    Lanjut ke Pelacakan
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Custom Confirmation Cancel Modal */}
      <AnimatePresence>
        {showCancelModal && order && (
          <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-150 flex flex-col"
            >
              {/* Header Icon */}
              <div className="bg-red-50 p-6 flex flex-col items-center justify-center border-b border-red-100 relative">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="absolute top-4 right-4 p-1 hover:bg-red-100 rounded-lg text-red-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-3 shadow-inner">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <h3 className="font-black text-xl text-gray-900">Batalkan Pesanan?</h3>
                <p className="text-xs text-red-500 font-bold mt-1 uppercase tracking-wider">Tindakan Permanen</p>
              </div>

              {/* Modal Body */}
              <div className="p-6 text-center space-y-3">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Apakah Anda yakin ingin membatalkan pesanan dengan Kode Order:
                </p>
                <p className="font-mono font-black text-base text-gray-900 bg-gray-50 border py-2 px-3 rounded-xl inline-block shadow-inner">
                  {order.orderCode}
                </p>
                <p className="text-xs text-gray-400 italic">
                  Catatan: Pesanan yang telah dibatalkan tidak dapat diaktifkan kembali.
                </p>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 bg-gray-50 border-t flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-3 bg-white hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-sm border border-gray-200 transition-colors shadow-sm cursor-pointer"
                >
                  Tidak, Kembali
                </button>
                <button
                  type="button"
                  onClick={executeCancelOrder}
                  className="flex-1 py-3 bg-gradient-to-r from-[#8E0E0E] to-red-600 hover:from-[#9C1B0B] hover:to-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
                >
                  Ya, Batalkan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

```

---

### File: `apps/customer/components/.gitkeep`

```text
# Placeholder

```

---

### File: `apps/customer/components/AddToCartModal.tsx`

```tsx
"use client";
import { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { MenuItem, formatPrice } from '@/data/menu';
import { useCartStore, CartItemVariant } from '@/store/cartStore';

interface AddToCartModalProps {
  item: MenuItem;
  onClose: () => void;
}

export default function AddToCartModal({ item, onClose }: AddToCartModalProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, CartItemVariant>>({});
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  const variantModifiers = Object.values(selectedVariants).reduce(
    (sum, v) => sum + v.option.priceModifier,
    0
  );
  const totalPrice = (item.price + variantModifiers) * quantity;

  const handleVariantSelect = (variantLabel: string, option: { id: string; name: string; priceModifier: number }) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantLabel]: { label: variantLabel, option },
    }));
  };

  const requiredVariants = item.variants?.filter((v) => v.required) ?? [];
  const allRequiredSelected = requiredVariants.every(
    (v) => selectedVariants[v.label]
  );

  const handleAddToCart = () => {
    if (!allRequiredSelected) {
      toast.error('Pilih semua varian yang diperlukan!');
      return;
    }
    addItem(item, Object.values(selectedVariants), quantity, note);
    toast.success(`${item.name} ditambahkan ke keranjang!`, {
      duration: 2000,
      style: { background: '#1a0a0a', color: '#fff', borderLeft: '4px solid #E05009' },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold text-gray-900 text-base">Pilih Opsi</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-4">
          {/* Item Preview */}
          <div className="flex gap-3 mb-5 p-3 bg-gray-50 rounded-xl">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
            />
            <div>
              <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
              <p className="text-[#8E0E0E] font-bold text-base">{formatPrice(item.price)}</p>
            </div>
          </div>

          {/* Variants */}
          {item.variants?.map((variant) => (
            <div key={variant.label} className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <p className="font-semibold text-gray-800 text-sm">{variant.label}</p>
                {variant.required && (
                  <span className="text-xs text-red-500 font-medium">* Wajib</span>
                )}
              </div>
              <div className="space-y-2">
                {variant.options.map((opt) => {
                  const isSelected = selectedVariants[variant.label]?.option.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleVariantSelect(variant.label, opt)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-[#8E0E0E] bg-[#8E0E0E]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-[#8E0E0E] bg-[#8E0E0E]' : 'border-gray-400'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{opt.name}</span>
                      </div>
                      {opt.priceModifier > 0 && (
                        <span className="text-sm text-[#E05009] font-semibold">
                          +{formatPrice(opt.priceModifier)}
                        </span>
                      )}
                      {opt.priceModifier === 0 && (
                        <span className="text-sm text-gray-400">Termasuk</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Special Note */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Catatan Khusus (Opsional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: extra pedas, tanpa bawang..."
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#8E0E0E] resize-none"
              rows={2}
            />
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-700 text-sm">Jumlah</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-300 hover:border-[#8E0E0E] transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="w-6 text-center font-bold text-gray-900">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#8E0E0E] hover:bg-[#9C1B0B] transition-colors"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white">
          <button
            onClick={handleAddToCart}
            disabled={!allRequiredSelected}
            className={`w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-between px-4 transition-all ${
              allRequiredSelected
                ? 'bg-gradient-to-r from-[#8E0E0E] to-[#E05009] hover:from-[#9C1B0B] hover:to-[#D94708] text-white shadow-md'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>Tambah ke Keranjang</span>
            <span>{formatPrice(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

```

---

### File: `apps/customer/components/CartDrawer.tsx`

```tsx
"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/data/menu';
import toast from 'react-hot-toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const cart = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const cartTotal = useCartStore((state) => state.getTotalPrice());
  const cartCount = useCartStore((state) => state.getTotalItems());
  const promoCode = useCartStore((state) => state.promoCode);
  const clearPromoCode = useCartStore((state) => state.clearPromoCode);
  const setServerValidatedPromo = useCartStore((state) => state.setServerValidatedPromo);
  // Gunakan diskon yang dikonfirmasi server — bukan kalkulasi client-side
  const promoDiscount = useCartStore((state) => state.serverPromoDiscount);
  const router = useRouter();

  const [applyingPromo, setApplyingPromo] = useState(false);
  const finalTotal = Math.max(0, cartTotal - promoDiscount);

  // Close drawer on escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Lock scrolling
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // Restore scrolling
    };
  }, [isOpen, onClose]);

  const handleCheckoutClick = () => {
    onClose();
    router.push('/checkout');
  };

  const handleBrowseClick = () => {
    onClose();
    router.push('/menu');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          {/* Backdrop overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            {/* Drawer container with slide animation */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-white dark:bg-stone-900 flex flex-col shadow-2xl relative h-full"
            >
              {/* HEADER */}
              <div className="px-4 py-6 sm:px-6 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5.5 h-5.5" />
                  <h2 className="text-lg font-bold text-white" id="slide-over-title">
                    Keranjang Belanja ({cartCount})
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* LIST OF ITEMS */}
              <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col justify-center items-center text-center px-4">
                    <div className="w-20 h-20 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 mb-4 animate-bounce-short">
                      <ShoppingBag size={36} />
                    </div>
                    <h3 className="font-bold text-stone-800 dark:text-stone-100 text-lg">Keranjang Anda Kosong</h3>
                    <p className="text-stone-500 dark:text-stone-400 text-sm mt-1 mb-6">
                      Nikmati Terang Bulan manis & Martabak gurih adonan terbaik kami dengan menambahkannya sekarang.
                    </p>
                    <button
                      onClick={handleBrowseClick}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-[#8E0E0E] to-[#E05009] hover:opacity-95 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                    >
                      Jelajahi Menu
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cart.map((item) => {
                      const itemPriceEach = item.totalPrice / item.quantity;

                      return (
                        <div 
                          key={item.cartId} 
                          className="flex py-3.5 pb-4 border-b border-stone-100 dark:border-stone-800 items-start gap-4"
                        >
                          {/* Product Image */}
                          <img
                            src={item.menuItem.image}
                            alt={item.menuItem.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-stone-50 shrink-0 border border-stone-100 dark:border-stone-850 shadow-xs"
                            referrerPolicy="no-referrer"
                          />

                          {/* Details block */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-stone-800 dark:text-stone-100 truncate">
                              {item.menuItem.name}
                            </h4>
                            
                            {/* Selected Options / Variants */}
                            {item.selectedVariants && item.selectedVariants.length > 0 && (
                              <div className="text-xs text-[#E05009] font-medium mt-0.5 space-y-0.5">
                                {item.selectedVariants.map((v, idx) => (
                                  <p key={idx}>
                                    {v.label}: {v.option.name}
                                  </p>
                                ))}
                              </div>
                            )}

                            {/* Special request notes */}
                            {item.note && item.note.trim() && (
                              <div className="text-[10px] bg-stone-50 dark:bg-stone-800/50 text-stone-500 dark:text-stone-400 italic px-2 py-1 rounded border border-stone-150 dark:border-stone-800 mt-1.5 max-w-full break-words">
                                "{item.note}"
                              </div>
                            )}

                            {/* Price & Stepper row */}
                            <div className="flex justify-between items-center mt-3">
                              {/* Stepper counter */}
                              <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden h-7 sm:h-8 bg-stone-50 dark:bg-stone-850">
                                <button
                                  onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                  className="px-2.5 h-full text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors flex items-center justify-center cursor-pointer"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="px-3 bg-white dark:bg-stone-900 font-bold text-xs text-stone-850 dark:text-stone-150 flex items-center justify-center h-full min-w-8">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                  className="px-2.5 h-full text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors flex items-center justify-center cursor-pointer"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              {/* Price */}
                              <p className="text-sm font-extrabold text-stone-900 dark:text-white font-mono">
                                {formatPrice(item.totalPrice)}
                              </p>
                            </div>
                          </div>

                          {/* Trash action */}
                          <button
                            onClick={() => removeItem(item.cartId)}
                            className="text-stone-400 hover:text-[#8E0E0E] p-1 rounded transition-colors self-start cursor-pointer mt-0.5"
                            aria-label="Hapus dari keranjang"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* FOOTER TOTALS */}
              {cart.length > 0 && (
                <div className="border-t border-stone-200 dark:border-stone-800 py-6 px-4 sm:px-6 bg-stone-50 dark:bg-stone-900">
                  {/* Coupon Area inside Drawer */}
                  <div className="mb-4 pb-4 border-b border-stone-200 dark:border-stone-850">
                    {promoCode ? (
                      <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-xl p-2.5 text-xs">
                        <div className="min-w-0">
                          <p className="font-bold text-green-800 dark:text-green-400">Kupon Aktif: {promoCode}</p>
                          <p className="text-[10px] text-green-700 dark:text-green-500 mt-0.5">
                            {promoDiscount > 0 ? `Diskon -${formatPrice(promoDiscount)}` : 'Syarat kupon belum terpenuhi'}
                          </p>
                        </div>
                        <button
                          onClick={clearPromoCode}
                          className="text-[11px] font-bold text-red-650 hover:underline shrink-0 bg-white dark:bg-stone-800 px-2 py-1 border rounded-lg cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Kode kupon (ANNIV25)..."
                          id="drawerCouponInput"
                          className="flex-1 bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-750 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none uppercase font-mono tracking-wider"
                        />
                        <button
                          type="button"
                          disabled={applyingPromo}
                          onClick={async () => {
                            const el = document.getElementById('drawerCouponInput') as HTMLInputElement;
                            if (!el?.value.trim()) {
                              toast.error('Silakan ketik kode kupon');
                              return;
                            }
                            setApplyingPromo(true);
                            try {
                              const res = await fetch('/api/validate-promo', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  code: el.value.trim(),
                                  subtotal: cartTotal,
                                  items: cart.map((i) => ({
                                    slug: i.menuItem.slug,
                                    category: i.menuItem.category,
                                    totalPrice: i.totalPrice,
                                  })),
                                }),
                              });
                              const data = await res.json();
                              if (data.valid) {
                                setServerValidatedPromo(data.promoCode, data.discountAmount);
                                toast.success(data.message);
                              } else {
                                toast.error(data.message || 'Kode promo tidak valid.');
                              }
                              el.value = '';
                            } catch {
                              toast.error('Gagal memvalidasi promo. Periksa koneksi.');
                            } finally {
                              setApplyingPromo(false);
                            }
                          }}
                          className="bg-stone-800 hover:bg-stone-900 text-white dark:bg-stone-800 dark:hover:bg-stone-750 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {applyingPromo ? '...' : 'Terapkan'}
                        </button>
                      </div>
                    )}
                  </div>

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-xs text-green-600 font-semibold mb-2">
                      <span>Kupon ({promoCode})</span>
                      <span>-{formatPrice(promoDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-base font-bold text-stone-950 dark:text-white">
                    <span>Subtotal</span>
                    <span className="font-mono text-lg text-[#8E0E0E] dark:text-[#E05009]">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                    Pajak toko sudah termasuk. Biaya pengiriman dihitung saat checkout.
                  </p>
                  <div className="mt-6 flex flex-col gap-2">
                    <button
                      id="checkout-button-from-drawer"
                      onClick={handleCheckoutClick}
                      className="w-full h-12 flex justify-center items-center gap-2 px-6 rounded-full bg-gradient-to-r from-[#8E0E0E] to-[#E05009] hover:opacity-95 text-white font-bold text-base shadow-md cursor-pointer transition-transform duration-100 scale-100 active:scale-98"
                    >
                      Lanjut ke Checkout
                      <ArrowRight size={18} />
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full text-center py-2.5 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 font-bold transition-colors cursor-pointer"
                    >
                      Kembali ke Belanja
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

```

---

### File: `apps/customer/components/ChatBot.tsx`

```tsx
"use client";
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, MessageCircle } from 'lucide-react';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Halo! Saya asisten cerdas Martabak A6 Nyuss. Ada yang bisa saya bantu hari ini?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const parentDragControls = useDragControls();

  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const [position, setPosition] = useState<'bottom-left' | 'top-left' | 'top-right' | 'bottom-right'>('bottom-left');
  const [parentConstraints, setParentConstraints] = useState({ left: -16, right: 300, top: -600, bottom: 16 });

  useEffect(() => {
    const updateSizeAndConstraints = () => {
      if (typeof window !== 'undefined') {
        const W = window.innerWidth;
        const H = window.innerHeight;
        setWindowSize({ width: W, height: H });
        setParentConstraints({
          left: -16,
          right: W - 80,
          top: -H + 144, // Batas atas agar tidak menabrak navbar di layar
          bottom: 16,
        });
      }
    };
    updateSizeAndConstraints();
    window.addEventListener('resize', updateSizeAndConstraints);
    return () => window.removeEventListener('resize', updateSizeAndConstraints);
  }, []);

  const handleDragEnd = (event: any, info: any) => {
    // Gunakan viewport coordinates (kurangi scroll offset) agar deteksi sudut
    // tetap akurat meskipun halaman sudah di-scroll ke bawah/samping
    const x = info.point.x - window.scrollX;
    const y = info.point.y - window.scrollY;
    const W = windowSize.width;
    const H = windowSize.height;

    const isLeft = x < W / 2;
    const isTop = y < H / 2;

    let targetPos: 'bottom-left' | 'top-left' | 'top-right' | 'bottom-right' = 'bottom-left';
    if (isLeft && !isTop) {
      targetPos = 'bottom-left';
    } else if (isLeft && isTop) {
      targetPos = 'top-left';
    } else if (!isLeft && isTop) {
      targetPos = 'top-right';
    } else {
      targetPos = 'bottom-right';
    }
    setPosition(targetPos);
  };

  const getSnapTarget = () => {
    const W = windowSize.width;
    const H = windowSize.height;

    switch (position) {
      case 'top-left':
        return { x: 0, y: 80 - (H - 80) }; // Di bawah navbar
      case 'top-right':
        return { x: W - 104, y: 80 - (H - 80) }; // Di bawah navbar
      case 'bottom-right':
        return { x: W - 168, y: 0 }; // Di samping WhatsApp
      case 'bottom-left':
      default:
        return { x: 0, y: 0 };
    }
  };

  const getChatWindowStyle = (): React.CSSProperties => {
    const isMobile = windowSize.width < 640;
    
    // HP: Tampilan modal/bottom-sheet yang terlepas sepenuhnya dari posisi ikon
    // Ini menjamin jendela chat TIDAK PERNAH terpotong di layar HP sekecil apapun
    if (isMobile) {
      return {
        bottom: '16px',
        left: '16px',
        right: '16px',
        top: 'auto',
        height: 'calc(100vh - 100px)', // Hampir full screen, sisakan jarak sedikit di atas
        maxHeight: '500px', // Jangan terlalu tinggi di HP yang agak panjang
        width: 'auto',
        transformOrigin: 'bottom center',
        zIndex: 60,
      };
    }

    // Desktop: Mengikuti sudut tempat ikon berada (menggunakan fixed coordinates)
    const baseMarginX = 24; // Jarak dasar ikon (left-6 / bottom-6 = 24px)
    const iconWidthAndGap = 56 + 16; // 72px
    const topMargin = 80; // Posisi y ikon saat di atas (menghindari navbar)

    switch (position) {
      case 'top-left':
        return { top: `${topMargin}px`, left: `${baseMarginX + iconWidthAndGap}px`, width: '384px', height: '500px', transformOrigin: 'top left' };
      case 'top-right':
        return { top: `${topMargin}px`, right: `${baseMarginX + iconWidthAndGap}px`, width: '384px', height: '500px', transformOrigin: 'top right' };
      case 'bottom-right':
        return { bottom: `${baseMarginX}px`, right: `${baseMarginX + iconWidthAndGap + 64}px`, width: '384px', height: '500px', transformOrigin: 'bottom right' };
      case 'bottom-left':
      default:
        return { bottom: `${baseMarginX}px`, left: `${baseMarginX + iconWidthAndGap}px`, width: '384px', height: '500px', transformOrigin: 'bottom left' };
    }
  };

  const getChatWindowAnimation = () => {
    const isMobile = windowSize.width < 640;
    const isTop = position.startsWith('top');
    const isLeft = position.endsWith('left');

    if (isMobile) {
      // Mobile: Animasi vertikal karena muncul di atas/bawah ikon
      return {
        initial: { opacity: 0, y: isTop ? -30 : 30, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: isTop ? -30 : 30, scale: 0.95 },
      };
    }

    // Desktop: Animasi horizontal karena muncul di samping ikon
    return {
      initial: { opacity: 0, x: isLeft ? -30 : 30, scale: 0.95 },
      animate: { opacity: 1, x: 0, scale: 1 },
      exit: { opacity: 0, x: isLeft ? -30 : 30, scale: 0.95 },
    };
  };

  const startParentDrag = (event: React.PointerEvent) => {
    parentDragControls.start(event);
  };

  const quickReplies = [
    'Rekomendasi menu?',
    'Lokasi & Jam buka?',
    'Cara pesan antar?',
    'Berapa harga terang bulan?'
  ];

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text) return;

    if (!textToSend) {
      setInput('');
    }

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });

      const data = await response.json();

      if (response.ok && data.message) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        throw new Error(data.error || 'Terjadi kesalahan sistem');
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Maaf, sistem asisten AI sedang sibuk atau kunci API belum dikonfigurasi dengan benar. Silakan coba kembali beberapa saat lagi atau hubungi kami langsung via WhatsApp!',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        drag
        dragControls={parentDragControls}
        dragListener={false}
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={parentConstraints}
        onDragEnd={handleDragEnd}
        animate={getSnapTarget()}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="fixed bottom-6 left-6 z-50 flex flex-col items-start select-none"
      >
        {/* Floating Chat Button */}
        <motion.button
          onPointerDown={startParentDrag}
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#8E0E0E] to-[#E05009] hover:from-[#9C1B0B] hover:to-[#D94708] flex items-center justify-center text-white shadow-lg hover:shadow-xl cursor-grab active:cursor-grabbing relative z-50"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <img src="/logo.svg" alt="A6 Nyuss AI" draggable="false" className="w-7 h-7 object-contain" />
              <span className="absolute top-2.5 right-2.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
              </span>
            </div>
          )}
        </motion.button>
      </motion.div>

      {/* Chat Window (Terpisah dari motion.div drag agar tidak ikut ter-translate) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            {...getChatWindowAnimation()}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={getChatWindowStyle()}
            className="fixed bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden z-[60]"
          >
            {/* Header */}
            <div
              className="bg-gradient-to-r from-[#8E0E0E] to-[#E05009] p-4 text-white flex items-center justify-between select-none"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8E0E0E] to-[#E05009] flex items-center justify-center relative border border-white/20">
                  <img src="/logo.svg" alt="A6 Nyuss AI" draggable="false" className="w-6 h-6 object-contain" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">Asisten A6 Nyuss</h4>
                  <p className="text-xs text-white/80">Online • AI Bot</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                onPointerDown={(e) => e.stopPropagation()}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 scrollbar-thin select-text">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === 'user'
                        ? 'bg-[#8E0E0E] text-white rounded-tr-none shadow-sm'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length === 1 && !loading && (
              <div className="p-3 bg-gray-50 border-t border-gray-100 flex gap-2 overflow-x-auto scrollbar-hide">
                {quickReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(reply)}
                    className="flex-shrink-0 bg-white border border-gray-200 hover:border-[#8E0E0E] hover:text-[#8E0E0E] text-gray-600 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm cursor-pointer"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t bg-white flex gap-2 items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanyakan sesuatu..."
                className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-gray-50 focus:ring-2 focus:ring-[#8E0E0E]/20 transition-all select-text"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8E0E0E] to-[#E05009] hover:from-[#9C1B0B] hover:to-[#D94708] text-white flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

```

---

### File: `apps/customer/components/DeliveryMap.tsx`

```tsx
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, AlertCircle, CheckCircle2, XCircle, Search, Navigation } from 'lucide-react';

// Outlet coordinates (A6 Nyuss - Jl. Demak 253, Surabaya)
const OUTLET_LAT = -7.2432537;
const OUTLET_LNG = 112.7206275;

// Max delivery radius in meters
const MAX_RADIUS_M = 10000;

// Delivery zones by radius (in km)
const ZONES = [
  { maxKm: 3,  fee: 8000,  name: 'Zona 1 (0-3 km)',  color: '#22c55e' },
  { maxKm: 6,  fee: 13000, name: 'Zona 2 (3-6 km)',  color: '#f59e0b' },
  { maxKm: 10, fee: 18000, name: 'Zona 3 (6-10 km)', color: '#ef4444' },
];

// Haversine distance formula (returns meters)
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getZoneByDistance(distanceM: number) {
  const km = distanceM / 1000;
  return ZONES.find((z) => km <= z.maxKm) ?? null;
}

// ── Nominatim (OpenStreetMap) helpers ──────────────────────────────
// Reverse geocoding: (lat, lng) → human-readable address string
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=id`,
      { headers: { 'Accept-Language': 'id' } }
    );
    const data = await res.json();
    if (data?.address) {
      const a = data.address;
      const parts = [
        a.road || a.pedestrian || a.footway || '',
        a.house_number ? `No. ${a.house_number}` : '',
        a.suburb || a.neighbourhood || a.village || '',
        a.city_district || a.subdistrict || '',
        a.city || a.town || '',
      ].filter(Boolean);
      return parts.join(', ');
    }
    return data?.display_name ?? '';
  } catch {
    return '';
  }
}

// Forward geocoding: address string → first matching {lat, lng} with progressive fallback
async function forwardGeocode(query: string): Promise<{ lat: number; lng: number } | null> {
  const fetchCoords = async (q: string) => {
    try {
      const encoded = encodeURIComponent(`${q}, Surabaya, Indonesia`);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1&countrycodes=id`,
        { headers: { 'Accept-Language': 'id' } }
      );
      const data = await res.json();
      if (data?.[0]) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
    } catch {}
    return null;
  };

  // 1. Try the full query exactly as typed
  let coords = await fetchCoords(query);
  if (coords) return coords;

  // 2. Try removing specific details like house number, RT/RW, block, etc.
  // Common terms in Indonesian addresses:
  // - No. / No / Nomor followed by digits
  // - Blok / Blk / Block followed by alphanumeric
  // - RT / RW / Gang / Gg followed by digits/letters
  let cleaned = query
    .replace(/no\s*\.?\s*\d+/gi, '')
    .replace(/rt\s*\d+\s*(\/?\s*rw\s*\d+)?/gi, '')
    .replace(/rw\s*\d+/gi, '')
    .replace(/blok\s*[a-z0-9\-]+/gi, '')
    .replace(/blk\s*[a-z0-9\-]+/gi, '')
    .replace(/gg\s*\.?\s*[a-z0-9\-]+/gi, '')
    .replace(/gang\s*[a-z0-9\-]+/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleaned && cleaned !== query && cleaned.length > 5) {
    coords = await fetchCoords(cleaned);
    if (coords) return coords;
  }

  // 3. Try splitting by comma or slash and searching the first part (usually street name/neighborhood)
  const segments = query.split(/[,/]/);
  if (segments.length > 1) {
    const firstSegment = segments[0].trim();
    if (firstSegment.length > 5) {
      coords = await fetchCoords(firstSegment);
      if (coords) return coords;
    }
  }

  return null;
}

// ───────────────────────────────────────────────────────────────────

export interface DeliveryMapResult {
  lat: number;
  lng: number;
  distanceKm: number;
  zoneName: string;
  fee: number;
  isOutOfRange: boolean;
}

interface DeliveryMapProps {
  /** Called when user picks a location (click or GPS) */
  onLocationSelect: (result: DeliveryMapResult | null) => void;
  /** Called with the reverse-geocoded address after user clicks map / uses GPS */
  onAddressResolved?: (address: string) => void;
  /** When parent updates the address field, forward-geocode it and move the map */
  searchAddress?: string;
}

export default function DeliveryMap({
  onLocationSelect,
  onAddressResolved,
  searchAddress,
}: DeliveryMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const customerMarkerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);

  const [selectedResult, setSelectedResult] = useState<DeliveryMapResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'found' | 'notfound'>('idle');

  // Debounce ref for address search
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track last searched address to avoid redundant calls
  const lastSearchRef = useRef<string>('');
  // Track whether the current address update came FROM the map (to avoid loop)
  const ignoreNextSearchRef = useRef(false);

  // --- Autocomplete search bar states ---
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const autocompleteContainerRef = useRef<HTMLDivElement>(null);

  // Close suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        autocompleteContainerRef.current &&
        !autocompleteContainerRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounce API suggestions call using Photon (for autocomplete)
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingSuggestions(true);
      try {
        const queryWithCity = searchQuery.toLowerCase().includes('surabaya')
          ? searchQuery
          : `${searchQuery}, Surabaya`;
        const encoded = encodeURIComponent(queryWithCity);
        // Query Photon API biased towards Surabaya coordinates
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encoded}&limit=5&lat=-7.2432537&lon=112.7206275`
        );
        const data = await res.json();
        if (data && Array.isArray(data.features)) {
          const formatted = data.features.map((feat: any) => {
            const p = feat.properties;
            const title = p.name || '';
            const details = [
              p.district || p.suburb || p.city_district || '',
              p.city || p.town || '',
            ].filter(Boolean).join(', ');
            
            const displayName = details ? `${title}, ${details}` : title;
            return {
              lat: feat.geometry.coordinates[1],
              lng: feat.geometry.coordinates[0],
              display_name: displayName,
            };
          });
          setSuggestions(formatted);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setSuggestions([]);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectSuggestion = (item: any) => {
    const lat = typeof item.lat === 'number' ? item.lat : parseFloat(item.lat);
    const lng = typeof item.lng === 'number' ? item.lng : parseFloat(item.lng);
    
    if (mapRef.current && leafletRef.current) {
      mapRef.current.setView([lat, lng], 16, { animate: true });
      placeMarker(lat, lng, leafletRef.current, true); // true = resolve address back to parent input
    }
    
    setSearchQuery(item.display_name);
    setSuggestions([]);
  };

  // ── Core: place/update customer marker ──────────────────────────
  const placeMarker = useCallback(
    async (lat: number, lng: number, L: any, resolveAddress = true) => {
      const distanceM = haversineDistance(OUTLET_LAT, OUTLET_LNG, lat, lng);
      const distanceKm = distanceM / 1000;
      const zone = getZoneByDistance(distanceM);
      const isOutOfRange = distanceM > MAX_RADIUS_M;

      const result: DeliveryMapResult = {
        lat,
        lng,
        distanceKm,
        zoneName: zone?.name ?? 'Di luar jangkauan',
        fee: zone?.fee ?? 0,
        isOutOfRange,
      };

      // Remove old customer marker
      if (customerMarkerRef.current) customerMarkerRef.current.remove();

      const customerIcon = L.divIcon({
        html: `
          <div style="
            width: 36px; height: 36px; border-radius: 50%;
            background: ${isOutOfRange ? '#ef4444' : zone?.color ?? '#3b82f6'};
            border: 3px solid white;
            box-shadow: 0 2px 12px rgba(0,0,0,0.4);
            display: flex; align-items: center; justify-content: center;
          "><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
        `,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const popup = isOutOfRange
        ? `<div style="font-size:13px;text-align:center"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:4px"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> <b>Di luar jangkauan</b><br/>Jarak: <b>${distanceKm.toFixed(2)} km</b><br/><span style="color:#ef4444">Maks. 10 km</span></div>`
        : `<div style="font-size:13px;text-align:center"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle;margin-right:4px"><polyline points="20 6 9 17 4 12"></polyline></svg> <b>${zone?.name}</b><br/>Jarak: <b>${distanceKm.toFixed(2)} km</b><br/>Ongkir: <b>Rp ${(zone?.fee ?? 0).toLocaleString('id-ID')}</b></div>`;

      const marker = L.marker([lat, lng], { icon: customerIcon })
        .addTo(mapRef.current)
        .bindPopup(popup)
        .openPopup();

      customerMarkerRef.current = marker;
      setSelectedResult(result);
      onLocationSelect(result);

      // Reverse geocode to fill address field (only when triggered by map interaction)
      if (resolveAddress && onAddressResolved) {
        const addr = await reverseGeocode(lat, lng);
        if (addr) {
          ignoreNextSearchRef.current = true; // don't forward-search what we just reverse-geocoded
          onAddressResolved(addr);
        }
      }
    },
    [onLocationSelect, onAddressResolved]
  );

  // ── Map initialisation ──────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    let mounted = true;

    import('leaflet').then((L) => {
      if (!mounted || !mapContainerRef.current || mapRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(mapContainerRef.current!, { 
        center: [OUTLET_LAT, OUTLET_LNG], 
        zoom: 13,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Add a clean attribution control without the Leaflet prefix and flag
      L.control.attribution({ prefix: false })
        .addAttribution('© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>')
        .addTo(map);

      // Zone circles (draw largest first = behind)
      L.circle([OUTLET_LAT, OUTLET_LNG], { radius: 10000, color: '#ef4444', fillColor: '#fef2f2', fillOpacity: 0.18, weight: 2, dashArray: '8 4' }).addTo(map);
      L.circle([OUTLET_LAT, OUTLET_LNG], { radius: 6000,  color: '#f59e0b', fillColor: '#fffbeb', fillOpacity: 0.22, weight: 2, dashArray: '6 4' }).addTo(map);
      L.circle([OUTLET_LAT, OUTLET_LNG], { radius: 3000,  color: '#22c55e', fillColor: '#f0fdf4', fillOpacity: 0.28, weight: 2 }).addTo(map);

      // Outlet marker
      const outletIcon = L.divIcon({
        html: `<div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#8E0E0E,#E05009);border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 17H2"/></svg></div>`,
        className: '',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });
      L.marker([OUTLET_LAT, OUTLET_LNG], { icon: outletIcon })
        .addTo(map)
        .bindPopup(`<div style="font-size:13px;text-align:center;min-width:180px"><b style="color:#8E0E0E">A6 Nyuss</b><br/>Jl. Demak No. 253, Bubutan<br/><span style="color:#666">Kota Surabaya</span></div>`)
        .openPopup();

      // Zone labels
      const ls = 'background:white;border:none;font-size:11px;font-weight:600;white-space:nowrap;padding:2px 6px;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,0.2);';
      L.marker([OUTLET_LAT + 0.018, OUTLET_LNG], { icon: L.divIcon({ html: `<div style="${ls}color:#16a34a">Zona 1: Rp 8.000</div>`, className: '', iconSize: [120, 24], iconAnchor: [60, 12] }) }).addTo(map);
      L.marker([OUTLET_LAT + 0.042, OUTLET_LNG], { icon: L.divIcon({ html: `<div style="${ls}color:#d97706">Zona 2: Rp 13.000</div>`, className: '', iconSize: [130, 24], iconAnchor: [65, 12] }) }).addTo(map);
      L.marker([OUTLET_LAT + 0.075, OUTLET_LNG], { icon: L.divIcon({ html: `<div style="${ls}color:#dc2626">Zona 3: Rp 18.000</div>`, className: '', iconSize: [135, 24], iconAnchor: [67, 12] }) }).addTo(map);

      map.on('click', (e: any) => {
        mapRef.current?.setView([e.latlng.lat, e.latlng.lng], Math.max(mapRef.current.getZoom(), 15));
        placeMarker(e.latlng.lat, e.latlng.lng, L, true);
      });

      mapRef.current = map;
      leafletRef.current = L;
      setIsLoading(false);
    });

    return () => { mounted = false; };
  }, [placeMarker]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  // ── Forward geocoding: when parent address field changes ─────────
  useEffect(() => {
    if (!searchAddress || searchAddress.trim().length < 8) return;

    // If this change was triggered by a reverse-geocode, skip it once
    if (ignoreNextSearchRef.current) {
      ignoreNextSearchRef.current = false;
      return;
    }

    // Avoid re-searching the same text
    if (searchAddress === lastSearchRef.current) return;

    // Debounce: wait 700ms after user stops typing
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    setSearchStatus('searching');

    searchTimerRef.current = setTimeout(async () => {
      lastSearchRef.current = searchAddress;
      const coords = await forwardGeocode(searchAddress);

      if (coords && mapRef.current && leafletRef.current) {
        setSearchStatus('found');
        mapRef.current.setView([coords.lat, coords.lng], 16, { animate: true });
        placeMarker(coords.lat, coords.lng, leafletRef.current, false); // false = don't reverse back
      } else {
        setSearchStatus('notfound');
      }
    }, 700);
  }, [searchAddress, placeMarker]);

  // ── GPS handler ───────────────────────────────────────────────────
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) { alert('Browser Anda tidak mendukung geolokasi'); return; }
    setGeoStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setGeoStatus('success');
        if (mapRef.current) mapRef.current.setView([latitude, longitude], 16);
        if (leafletRef.current) placeMarker(latitude, longitude, leafletRef.current, true);
      },
      () => {
        setGeoStatus('error');
        alert('Gagal mendapatkan lokasi. Pastikan izin lokasi diberikan di browser.');
      }
    );
  };

  return (
    <div className="space-y-3">

      {/* Instruction banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
        <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-blue-700 text-sm">
          <strong>Klik pada peta</strong> atau <strong>ketik alamat</strong> di kolom atas — keduanya saling terhubung otomatis. Ongkir dihitung instan berdasarkan jarak ke outlet.
        </p>
      </div>

      {/* Search status hint */}
      {searchStatus === 'searching' && (
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <div className="w-3 h-3 border-2 border-amber-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          Mencari lokasi dari alamat yang diketik...
        </div>
      )}
      {searchStatus === 'found' && (
        <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          Lokasi ditemukan dari alamat! Peta sudah dipindahkan.
        </div>
      )}

      {/* Autocomplete Search Input */}
      <div ref={autocompleteContainerRef} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari jalan, perumahan, atau gedung di Surabaya..."
            className="w-full pl-9 pr-10 py-2.5 border-2 border-gray-200 focus:border-[#8E0E0E] rounded-xl text-sm focus:outline-none bg-white text-gray-800 placeholder-gray-400 font-semibold shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSuggestions([]); }}
              className="absolute right-3.5 text-gray-400 hover:text-gray-650 transition-colors p-0.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute z-[1000] left-0 right-0 bg-white border-2 border-gray-200 rounded-2xl mt-1.5 shadow-xl max-h-60 overflow-y-auto divide-y divide-gray-100">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="w-full text-left px-4 py-3 hover:bg-[#8E0E0E]/5 text-xs text-gray-700 font-semibold transition-colors flex items-start gap-2.5"
              >
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#8E0E0E]" />
                <div>
                  <p className="font-bold text-gray-900 line-clamp-1">{item.display_name.split(',')[0]}</p>
                  <p className="text-[10px] text-gray-500 font-medium line-clamp-1 mt-0.5">
                    {item.display_name.split(',').slice(1).join(',').trim()}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
        {isSearchingSuggestions && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center pr-2">
            <div className="w-3.5 h-3.5 border-2 border-[#8E0E0E] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* GPS Button */}
      <button
        type="button"
        onClick={handleUseMyLocation}
        disabled={geoStatus === 'loading'}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border-2 border-[#8E0E0E] text-[#8E0E0E] rounded-xl text-sm font-semibold hover:bg-[#8E0E0E] hover:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {geoStatus === 'loading' ? (
          <>
            <div className="w-4 h-4 border-2 border-[#8E0E0E] border-t-transparent rounded-full animate-spin" />
            Mendeteksi lokasi GPS...
          </>
        ) : (
          <span className="flex items-center justify-center gap-1.5"><Navigation className="w-4 h-4 rotate-45" /> Gunakan Lokasi GPS Saya Sekarang</span>
        )}
      </button>

      {/* Map */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm" style={{ height: 360 }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-[#8E0E0E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-gray-500">Memuat peta...</p>
            </div>
          </div>
        )}
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Zone Legend */}
      <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
        <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Keterangan Zona Pengiriman</p>
        <div className="grid grid-cols-3 gap-2">
          {ZONES.map((z) => (
            <div key={z.name} className="text-center">
              <div
                className="rounded-lg py-1.5 px-2 text-xs font-bold mb-1"
                style={{ background: z.color + '22', color: z.color, border: `1.5px solid ${z.color}` }}
              >
                {z.maxKm === 3 ? '0-3 km' : z.maxKm === 6 ? '3-6 km' : '6-10 km'}
              </div>
              <p className="text-[11px] font-semibold text-gray-700">
                Rp {z.fee.toLocaleString('id-ID')}
              </p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">Di luar 10 km: pengiriman tidak tersedia</p>
      </div>

      {/* Result card */}
      {selectedResult && (
        <div className={`rounded-xl p-4 border-2 transition-all ${selectedResult.isOutOfRange ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
          {selectedResult.isOutOfRange ? (
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                <p className="font-bold text-red-700 text-sm">Lokasi di Luar Jangkauan</p>
                <p className="text-red-600 text-xs">
                  Jarak {selectedResult.distanceKm.toFixed(2)} km — melebihi batas 10 km. Pengiriman tidak tersedia.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                <div>
                  <p className="font-bold text-green-700 text-sm">{selectedResult.zoneName}</p>
                  <p className="text-green-600 text-xs">
                    Jarak dari outlet: <strong>{selectedResult.distanceKm.toFixed(2)} km</strong>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Ongkir</p>
                <p className="font-black text-[#8E0E0E] text-lg">
                  Rp {selectedResult.fee.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

```

---

### File: `apps/customer/components/FloatingButtons.tsx`

```tsx
"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function FloatingButtons() {
  const router = useRouter();
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.getTotalItems());
  // Guard against SSR/localStorage hydration mismatch (Zustand persist)
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="fixed bottom-6 right-4 z-40 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <a
        href="https://wa.me/6287811123482?text=Halo%20A6%20Nyuss%2C%20saya%20ingin%20pesan%20martabak"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
        title="Chat via WhatsApp"
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Cart Float Button — only shown after mount to avoid hydration mismatch */}
      {mounted && totalItems > 0 && (
        <button
          onClick={(e) => {
            e.preventDefault();
            if (pathname === '/cart') {
              router.back();
            } else {
              router.push('/cart');
            }
          }}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#8E0E0E] to-[#E05009] hover:from-[#9C1B0B] hover:to-[#D94708] shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 cursor-pointer"
          title="Lihat Keranjang"
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6 text-white" />
            <span className="absolute -top-3 -right-3 w-5 h-5 bg-yellow-400 text-[#8E0E0E] text-xs font-bold rounded-full flex items-center justify-center">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          </div>
        </button>
      )}
    </div>
  );
}

```

---

### File: `apps/customer/components/Footer.tsx`

```tsx
"use client";
import Link from 'next/link';

import { Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a0a0a] text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8E0E0E] to-[#E05009] flex items-center justify-center flex-shrink-0">
                <img src="/logo.svg" alt="A6 Nyuss" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <p className="font-bold text-xl text-white">A6 Nyuss</p>
                <p className="text-sm text-gray-400">Martabak & Terang Bulan</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-sm">
              Cita rasa otentik martabak dan terang bulan khas Surabaya sejak tahun 2000. 
              Dibuat dengan bahan pilihan dan resep turun-temurun.
            </p>
            <div className="space-y-2">
              <div className="text-sm text-gray-300 flex items-start gap-2">
                <MapPin className="text-[#E05009] w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Jl. Demak No.253, Dupak, Kec. Krembangan, Surabaya, Jawa Timur 60179</p>
                  <p className="text-gray-400 text-xs mt-0.5">Depan Mess DITPOLARIUD POLDA JATIM SURABAYA.</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 flex items-center gap-2">
                <Clock className="text-[#E05009] w-4 h-4 shrink-0" />
                <span>Setiap Hari: 17:00 – 01:00</span>
              </p>
              <p className="text-sm text-gray-300 flex items-center gap-2">
                <img src="/Halal logo.jfif" alt="Halal" className="w-5 h-5 object-contain rounded bg-white p-0.5" />
                <span>Halal Certified</span>
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-semibold text-white mb-4">Navigasi</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/menu', label: 'Menu' },
                { to: '/promo', label: 'Promo' },
                { to: '/about', label: 'Tentang Kami' },
                { to: '/contact', label: 'Kontak' },
                { to: '/gallery', label: 'Gallery' },
                { to: '/catering', label: 'Catering' },
                { to: '/faq', label: 'FAQ' },
                { to: '/tracking', label: 'Lacak Pesanan' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    href={link.to}
                    className="text-sm text-gray-400 hover:text-[#E05009] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <p className="font-semibold text-white mb-4">Hubungi Kami</p>
            <div className="space-y-3 mb-6">
              <a
                href="https://wa.me/6287811123482?text=Halo%20A6%20Nyuss%2C%20saya%20ingin%20pesan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-green-400 transition-colors"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#25D366] text-white shrink-0 shadow-sm">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span>WhatsApp: 0878-1112-3482</span>
              </a>
              <a
                href="mailto:martabaka6nyusss@gmail.com"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#E05009] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#E05009]" />
                <span>martabaka6nyusss@gmail.com</span>
              </a>
            </div>

            <p className="font-semibold text-white mb-3">Ikuti Kami</p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/a6nyusss"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#E05009] flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a
                href="https://www.tiktok.com/@a6nyuss"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#E05009] flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61590278828752"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#E05009] flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href="https://youtube.com/@a6nyuss"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#E05009] flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2026 Martabak & Terang Bulan A6 Nyuss. Est. 2000. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-[#E05009] transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-[#E05009] transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

```

---

### File: `apps/customer/components/Header.tsx`

```tsx
"use client";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function Header() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const totalItems = useCartStore((s) => s.getTotalItems());
  const location = usePathname();

  // Mark as mounted after first client render to avoid SSR/localStorage hydration mismatch
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setEventOpen(false);
    setAboutOpen(false);
  }, [location]);

  const isHome = location === '/';
  const isWhiteHeader = !isHome || scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isWhiteHeader
            ? 'bg-white shadow-md border-b border-gray-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8E0E0E] to-[#E05009] flex items-center justify-center">
                <img src="/logo.svg" alt="A6 Nyuss" className="w-6 h-6 object-contain" />
              </div>
              <div className="hidden sm:block">
                <p className={`font-black text-base sm:text-lg tracking-wider leading-none ${isWhiteHeader ? 'text-[#8E0E0E]' : 'text-white'}`}>A6 NYUSS</p>
                <p className={`text-[8px] sm:text-[9px] tracking-widest leading-none font-black uppercase mt-1 ${isWhiteHeader ? 'text-gray-500' : 'text-white/80'}`}>Martabak & Terang Bulan</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className={`text-[11px] font-black uppercase tracking-wider transition-colors hover:text-[#E05009] ${
                  location === '/'
                    ? 'text-[#E05009]'
                    : isWhiteHeader
                    ? 'text-gray-700'
                    : 'text-white'
                }`}
              >
                Home
              </Link>
              
              <Link
                href="/menu"
                className={`text-[11px] font-black uppercase tracking-wider transition-colors hover:text-[#E05009] ${
                  location === '/menu'
                    ? 'text-[#E05009]'
                    : isWhiteHeader
                    ? 'text-gray-700'
                    : 'text-white'
                }`}
              >
                Menu
              </Link>

              {/* Event Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setEventOpen(true)}
                onMouseLeave={() => setEventOpen(false)}
              >
                <button
                  onClick={() => setEventOpen(!eventOpen)}
                  className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-wider transition-colors hover:text-[#E05009] cursor-pointer ${
                    ['/promo', '/catering'].includes(location)
                      ? 'text-[#E05009]'
                      : isWhiteHeader
                      ? 'text-gray-700'
                      : 'text-white'
                  }`}
                >
                  Event
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {eventOpen && (
                  <div className="absolute left-0 top-full pt-2 w-48 z-50">
                    <div className="rounded-xl bg-white text-gray-800 shadow-xl border border-gray-100 py-2">
                      <Link
                        href="/promo"
                        onClick={() => setEventOpen(false)}
                        className={`block px-4 py-2 text-[11px] font-black uppercase tracking-wider hover:bg-[#8E0E0E]/5 hover:text-[#8E0E0E] transition-colors ${
                          location === '/promo' ? 'text-[#E05009]' : 'text-gray-700'
                        }`}
                      >
                        Promo
                      </Link>
                      <Link
                        href="/catering"
                        onClick={() => setEventOpen(false)}
                        className={`block px-4 py-2 text-[11px] font-black uppercase tracking-wider hover:bg-[#8E0E0E]/5 hover:text-[#8E0E0E] transition-colors ${
                          location === '/catering' ? 'text-[#E05009]' : 'text-gray-700'
                        }`}
                      >
                        Catering
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/gallery"
                className={`text-[11px] font-black uppercase tracking-wider transition-colors hover:text-[#E05009] ${
                  location === '/gallery'
                    ? 'text-[#E05009]'
                    : isWhiteHeader
                    ? 'text-gray-700'
                    : 'text-white'
                }`}
              >
                Gallery
              </Link>

              <Link
                href="/tracking"
                className={`text-[11px] font-black uppercase tracking-wider transition-colors hover:text-[#E05009] ${
                  location === '/tracking'
                    ? 'text-[#E05009]'
                    : isWhiteHeader
                    ? 'text-gray-700'
                    : 'text-white'
                }`}
              >
                Lacak Pesanan
              </Link>

              {/* Tentang Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setAboutOpen(true)}
                onMouseLeave={() => setAboutOpen(false)}
              >
                <button
                  onClick={() => setAboutOpen(!aboutOpen)}
                  className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-wider transition-colors hover:text-[#E05009] cursor-pointer ${
                    ['/about', '/contact', '/faq'].includes(location)
                      ? 'text-[#E05009]'
                      : isWhiteHeader
                      ? 'text-gray-700'
                      : 'text-white'
                  }`}
                >
                  Tentang
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {aboutOpen && (
                  <div className="absolute right-0 top-full pt-2 w-48 z-50">
                    <div className="rounded-xl bg-white text-gray-800 shadow-xl border border-gray-100 py-2">
                      <Link
                        href="/about"
                        onClick={() => setAboutOpen(false)}
                        className={`block px-4 py-2 text-[11px] font-black uppercase tracking-wider hover:bg-[#8E0E0E]/5 hover:text-[#8E0E0E] transition-colors ${
                          location === '/about' ? 'text-[#E05009]' : 'text-gray-700'
                        }`}
                      >
                        Tentang Kami
                      </Link>
                      <Link
                        href="/contact"
                        onClick={() => setAboutOpen(false)}
                        className={`block px-4 py-2 text-[11px] font-black uppercase tracking-wider hover:bg-[#8E0E0E]/5 hover:text-[#8E0E0E] transition-colors ${
                          location === '/contact' ? 'text-[#E05009]' : 'text-gray-700'
                        }`}
                      >
                        Lokasi & Kontak
                      </Link>
                      <Link
                        href="/faq"
                        onClick={() => setAboutOpen(false)}
                        className={`block px-4 py-2 text-[11px] font-black uppercase tracking-wider hover:bg-[#8E0E0E]/5 hover:text-[#8E0E0E] transition-colors ${
                          location === '/faq' ? 'text-[#E05009]' : 'text-gray-700'
                        }`}
                      >
                        FAQ
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Cart + Mobile Menu */}
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (location === '/cart') {
                    router.back();
                  } else {
                    router.push('/cart');
                  }
                }}
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#E05009] hover:bg-[#D13E08] transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-[#8E0E0E] text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full"
              >
                <Menu className={`w-6 h-6 ${isWhiteHeader ? 'text-gray-700' : 'text-white'}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div
            className="flex-1 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="w-72 bg-white h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8E0E0E] to-[#E05009] flex items-center justify-center">
                  <img src="/logo.svg" alt="A6 Nyuss" className="w-5.5 h-5.5 object-contain" />
                </div>
                <div>
                  <p className="font-black text-sm tracking-wider leading-none text-[#8E0E0E]">A6 NYUSS</p>
                  <p className="text-[8px] tracking-widest leading-none font-black uppercase text-gray-500 mt-1">Martabak & Terang Bulan</p>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <Link
                href="/"
                className={`flex items-center px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors ${
                  location === '/'
                    ? 'bg-[#8E0E0E]/10 text-[#8E0E0E]'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Home
              </Link>
              <Link
                href="/menu"
                className={`flex items-center px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors ${
                  location === '/menu'
                    ? 'bg-[#8E0E0E]/10 text-[#8E0E0E]'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Menu
              </Link>

              {/* Event Section */}
              <div className="pt-2">
                <p className="px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Event</p>
                <div className="mt-1 space-y-1">
                  <Link
                    href="/promo"
                    className={`flex items-center px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors ${
                      location === '/promo'
                        ? 'bg-[#8E0E0E]/10 text-[#8E0E0E]'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Promo
                  </Link>
                  <Link
                    href="/catering"
                    className={`flex items-center px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors ${
                      location === '/catering'
                        ? 'bg-[#8E0E0E]/10 text-[#8E0E0E]'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Catering
                  </Link>
                </div>
              </div>

              {/* Direct Features */}
              <div className="pt-2 space-y-1">
                <Link
                  href="/gallery"
                  className={`flex items-center px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors ${
                    location === '/gallery'
                      ? 'bg-[#8E0E0E]/10 text-[#8E0E0E]'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Gallery
                </Link>
                <Link
                  href="/tracking"
                  className={`flex items-center px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors ${
                    location === '/tracking'
                      ? 'bg-[#8E0E0E]/10 text-[#8E0E0E]'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Lacak Pesanan
                </Link>
              </div>

              {/* Tentang Section */}
              <div className="pt-2">
                <p className="px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Tentang</p>
                <div className="mt-1 space-y-1">
                  <Link
                    href="/about"
                    className={`flex items-center px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors ${
                      location === '/about'
                        ? 'bg-[#8E0E0E]/10 text-[#8E0E0E]'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Tentang Kami
                  </Link>
                  <Link
                    href="/contact"
                    className={`flex items-center px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors ${
                      location === '/contact'
                        ? 'bg-[#8E0E0E]/10 text-[#8E0E0E]'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Lokasi & Kontak
                  </Link>
                  <Link
                    href="/faq"
                    className={`flex items-center px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors ${
                      location === '/faq'
                        ? 'bg-[#8E0E0E]/10 text-[#8E0E0E]'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    FAQ
                  </Link>
                </div>
              </div>
            </nav>
 
            <div className="p-4 border-t">
              <Link
                href="/menu"
                className="block w-full text-center py-3 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white rounded-xl font-semibold"
              >
                Pesan Sekarang
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

```

---

### File: `apps/customer/components/MenuCard.tsx`

```tsx
"use client";
import Link from 'next/link';
import { useState } from 'react';

import { ShoppingCart, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { MenuItem, formatPrice } from '@/data/menu';
import { useCartStore } from '@/store/cartStore';
import AddToCartModal from './AddToCartModal';

interface MenuCardProps {
  item: MenuItem;
  showDetail?: boolean;
}

const badgeConfig = {
  terlaris: { label: '🔥 Terlaris', cls: 'bg-orange-500 text-white' },
  baru: { label: '✨ Baru', cls: 'bg-blue-500 text-white' },
  habis: { label: '❌ Habis', cls: 'bg-gray-500 text-white' },
};

export default function MenuCard({ item, showDetail = true }: MenuCardProps) {
  const [showModal, setShowModal] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const isHabis = item.badge === 'habis';

  const handleQuickAdd = () => {
    if (item.variants && item.variants.length > 0) {
      setShowModal(true);
    } else {
      addItem(item, [], 1, '');
      toast.success(`✅ ${item.name} ditambahkan ke keranjang!`, {
        duration: 2000,
        style: { background: '#1a0a0a', color: '#fff', borderLeft: '4px solid #E05009' },
      });
    }
  };

  return (
    <>
      <div
        className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group ${
          isHabis ? 'opacity-70' : 'hover:-translate-y-1'
        }`}
      >
        {/* Image */}
        <div className="relative overflow-hidden h-44 sm:h-48 bg-gray-100">
          <img
            src={item.image}
            alt={item.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isHabis ? 'grayscale' : ''
            }`}
            loading="lazy"
          />
          {item.badge && (
            <span
              className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full ${badgeConfig[item.badge].cls}`}
            >
              {badgeConfig[item.badge].label}
            </span>
          )}
          <span className="absolute top-2 right-2 text-xs bg-white/90 text-gray-600 px-2 py-0.5 rounded-full font-medium">
            {item.categoryLabel}
          </span>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 line-clamp-2 flex-1">
            {item.name}
          </h3>
          <p className="text-[#8E0E0E] font-bold text-base sm:text-lg mb-3">
            {formatPrice(item.price)}
            {item.variants && item.variants[0]?.options[1] && (
              <span className="text-xs text-gray-400 font-normal ml-1">/ mulai dari</span>
            )}
          </p>

          <div className="flex gap-2">
            {showDetail && (
              <Link
                href={`/menu/${item.slug}`}
                className="flex-1 text-center py-2 border border-[#8E0E0E] text-[#8E0E0E] rounded-xl text-xs sm:text-sm font-medium hover:bg-[#8E0E0E]/5 transition-colors"
              >
                Detail
              </Link>
            )}
            <button
              onClick={handleQuickAdd}
              disabled={isHabis}
              className={`flex items-center justify-center gap-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                showDetail ? 'px-3' : 'flex-1'
              } ${
                isHabis
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#8E0E0E] to-[#E05009] hover:from-[#9C1B0B] hover:to-[#D94708] text-white'
              }`}
            >
              {isHabis ? (
                'Habis'
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {!showDetail && <span>Tambah</span>}
                  {showDetail && <ShoppingCart className="w-4 h-4" />}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <AddToCartModal item={item} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

```

---

### File: `apps/customer/components/public/CartDrawer.tsx`

*File not found on disk*

---

### File: `apps/customer/components/public/Footer.tsx`

*File not found on disk*

---

### File: `apps/customer/components/public/Header.tsx`

*File not found on disk*

---

### File: `apps/customer/components/public/MenuCard.tsx`

*File not found on disk*

---

### File: `apps/customer/data/delivery_rules.md`

```markdown
# ATURAN PENGIRIMAN & ONGKIR MARTABAK A6 NYUSS

*   **Jangkauan Maksimal**: Jarak pengiriman maksimal dari outlet Jl. Demak 253 Surabaya adalah **10 km**. Di luar jarak 10 km, pesanan delivery tidak tersedia secara otomatis.
*   **Metode Perhitungan**: Ongkos kirim dihitung otomatis secara instan berdasarkan koordinat lokasi yang ditandai oleh pengguna pada peta interaktif Leaflet di halaman checkout.
*   **Zona Pengiriman & Tarif**:
    1.  **Zona 1 (0 - 3 km)**: Biaya Ongkir Flat **Rp 8.000**.
    2.  **Zona 2 (3 - 6 km)**: Biaya Ongkir Flat **Rp 13.000**.
    3.  **Zona 3 (6 - 10 km)**: Biaya Ongkir Flat **Rp 18.000**.
*   **Keakuratan Lokasi**: Jika geocoding pencarian alamat tidak mendeteksi lokasi detail seperti nomor blok atau RT/RW, pengguna dapat langsung mengklik/ketuk titik lokasi mereka di peta, dan pin peta akan menyesuaikan posisinya.
*   **Ubah Alamat**: Kolom alamat input dan titik peta terhubung dua arah. Mengetik alamat jalan utama akan menggerakkan peta ke jalan tersebut, dan mengklik peta akan memperbarui teks alamat di input form.

```

---

### File: `apps/customer/data/menu.ts`

```typescript
export type MenuCategory = 'martabak-telur-ayam' | 'martabak-telur-bebek' | 'terang-bulan' | 'paket-bundling' | 'minuman';

export interface MenuVariant {
  id: string;
  name: string;
  priceModifier: number;
}

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  category: MenuCategory;
  categoryLabel: string;
  price: number;
  image: string;
  badge?: 'terlaris' | 'baru' | 'habis';
  description: string;
  variants?: {
    label: string;
    required: boolean;
    options: MenuVariant[];
  }[];
  relatedSlugs?: string[];
}

export const categories: { id: MenuCategory; label: string; icon: string }[] = [
  { id: 'martabak-telur-ayam', label: 'Martabak Telur Ayam', icon: '🥚' },
  { id: 'martabak-telur-bebek', label: 'Martabak Telur Bebek', icon: '🦆' },
  { id: 'terang-bulan', label: 'Terang Bulan', icon: '🌙' },
  // { id: 'paket-bundling', label: 'Paket Bundling', icon: '📦' },
  // { id: 'minuman', label: 'Minuman', icon: '🥤' },
];

export const toppingOptions: MenuVariant[] = [
  { id: 'kacang', name: 'Kacang', priceModifier: 0 },
  { id: 'meses', name: 'Meses', priceModifier: 0 },
  { id: 'keju', name: 'Keju', priceModifier: 0 },
  { id: 'pisang', name: 'Pisang', priceModifier: 0 },
  { id: 'melon', name: 'Melon', priceModifier: 0 },
  { id: 'strawberry', name: 'Strawberry', priceModifier: 0 },
  { id: 'selai-coklat', name: 'Selai Coklat', priceModifier: 0 },
  { id: 'nanas', name: 'Nanas', priceModifier: 0 },
  { id: 'vanilla', name: 'Vanilla', priceModifier: 0 },
  { id: 'blueberry', name: 'Blueberry', priceModifier: 0 },
  { id: 'tiramisu', name: 'Tiramisu', priceModifier: 0 },
  { id: 'green-tea', name: 'Green Tea', priceModifier: 0 },
  { id: 'kismis', name: 'Kismis', priceModifier: 0 },
];

export const extraToppingOptions: MenuVariant[] = [
  { id: 'none', name: 'Tanpa Tambahan', priceModifier: 0 },
  { id: 'extra-kacang', name: 'Extra Kacang (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-meses', name: 'Extra Meses (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-keju', name: 'Extra Keju (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-pisang', name: 'Extra Pisang (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-melon', name: 'Extra Melon (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-strawberry', name: 'Extra Strawberry (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-selai-coklat', name: 'Extra Selai Coklat (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-nanas', name: 'Extra Nanas (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-vanilla', name: 'Extra Vanilla (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-blueberry', name: 'Extra Blueberry (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-tiramisu', name: 'Extra Tiramisu (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-green-tea', name: 'Extra Green Tea (+Rp 5.000)', priceModifier: 5000 },
  { id: 'extra-kismis', name: 'Extra Kismis (+Rp 5.000)', priceModifier: 5000 },
];
export const menuItems: MenuItem[] = [
  // ===== MARTABAK TELUR AYAM =====
  {
    id: 'mta-2-20',
    slug: 'martabak-telur-ayam-1-telur-20k',
    name: 'Martabak Telur Ayam - 1 Telur (Rp 20.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak gurih dengan isian daging ayam cincang dan 1 butir telur ayam.',
    relatedSlugs: ['martabak-telur-ayam-2-telur-25k', 'martabak-telur-bebek-2-telur-20k'],
  },
  {
    id: 'mta-2-25',
    slug: 'martabak-telur-ayam-2-telur-25k',
    name: 'Martabak Telur Ayam - 2 Telur (Rp 25.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    badge: 'terlaris',
    description: 'Martabak telur ayam dengan isian daging ayam lebih tebal and 2 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-1-telur-20k', 'martabak-telur-ayam-2-telur-30k'],
  },
  {
    id: 'mta-2-30',
    slug: 'martabak-telur-ayam-2-telur-30k',
    name: 'Martabak Telur Ayam - 2 Telur (Rp 30.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak telur ayam dengan porsi ekstra daging ayam cincang melimpah dan 2 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-2-telur-25k', 'martabak-telur-ayam-3-telur-35k'],
  },
  {
    id: 'mta-2-35',
    slug: 'martabak-telur-ayam-3-telur-35k',
    name: 'Martabak Telur Ayam - 3 Telur (Rp 35.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    badge: 'baru',
    description: 'Martabak telur ayam porsi maksimal dengan daging premium bumbu khas dan 3 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-2-telur-30k', 'martabak-telur-bebek-2-telur-50k'],
  },
  {
    id: 'mta-3-40',
    slug: 'martabak-telur-ayam-3-telur-40k',
    name: 'Martabak Telur Ayam - 3 Telur (Rp 40.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak gurih dengan isian daging ayam cincang dan 3 butir telur ayam.',
    relatedSlugs: ['martabak-telur-ayam-4-telur-45k', 'martabak-telur-bebek-3-telur-60k'],
  },
  {
    id: 'mta-3-45',
    slug: 'martabak-telur-ayam-4-telur-45k',
    name: 'Martabak Telur Ayam - 4 Telur (Rp 45.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak telur ayam dengan isian daging ayam lebih tebal dan 4 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-3-telur-40k', 'martabak-telur-ayam-4-telur-50k'],
  },
  {
    id: 'mta-3-50',
    slug: 'martabak-telur-ayam-4-telur-50k',
    name: 'Martabak Telur Ayam - 4 Telur (Rp 50.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak telur ayam dengan porsi ekstra daging ayam cincang melimpah dan 4 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-4-telur-45k', 'martabak-telur-ayam-5-telur-55k'],
  },
  {
    id: 'mta-3-55',
    slug: 'martabak-telur-ayam-5-telur-55k',
    name: 'Martabak Telur Ayam - 5 Telur (Rp 55.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak telur ayam porsi maksimal dengan daging premium bumbu khas dan 5 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-4-telur-50k', 'martabak-telur-bebek-3-telur-90k'],
  },
  {
    id: 'mta-4-60',
    slug: 'martabak-telur-ayam-5-telur-60k',
    name: 'Martabak Telur Ayam - 5 Telur (Rp 60.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 60000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak gurih dengan isian daging ayam cincang dan 5 butir telur ayam.',
    relatedSlugs: ['martabak-telur-ayam-6-telur-65k', 'martabak-telur-bebek-3-telur-60k'],
  },
  {
    id: 'mta-4-65',
    slug: 'martabak-telur-ayam-6-telur-65k',
    name: 'Martabak Telur Ayam - 6 Telur (Rp 65.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak telur ayam dengan isian daging ayam lebih tebal dan 6 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-5-telur-60k', 'martabak-telur-ayam-6-telur-70k'],
  },
  {
    id: 'mta-4-70',
    slug: 'martabak-telur-ayam-6-telur-70k',
    name: 'Martabak Telur Ayam - 6 Telur (Rp 70.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 70000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak telur ayam dengan porsi ekstra daging ayam cincang melimpah dan 6 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-6-telur-65k', 'martabak-telur-ayam-7-telur-75k'],
  },
  {
    id: 'mta-4-75',
    slug: 'martabak-telur-ayam-7-telur-75k',
    name: 'Martabak Telur Ayam - 7 Telur (Rp 75.000)',
    category: 'martabak-telur-ayam',
    categoryLabel: 'Martabak Telur Ayam',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
    description: 'Martabak telur ayam porsi maksimal dengan daging premium bumbu khas dan 7 butir telur.',
    relatedSlugs: ['martabak-telur-ayam-6-telur-70k', 'martabak-telur-bebek-2-telur-40k'],
  },
  // ===== MARTABAK TELUR BEBEK =====
  {
    id: 'mtb-1-20',
    slug: 'martabak-telur-bebek-1-telur-20k',
    name: 'Martabak Telur Bebek - 1 Telur (Rp 20.000)',
    category: 'martabak-telur-bebek',
    categoryLabel: 'Martabak Telur Bebek',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    description: 'Martabak telur bebek gurih dengan isian 1 butir telur bebek berkualitas.',
    relatedSlugs: ['martabak-telur-bebek-2-telur-40k', 'martabak-telur-ayam-1-telur-20k'],
  },
  {
    id: 'mtb-2-40',
    slug: 'martabak-telur-bebek-2-telur-40k',
    name: 'Martabak Telur Bebek - 2 Telur (Rp 40.000)',
    category: 'martabak-telur-bebek',
    categoryLabel: 'Martabak Telur Bebek',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    description: 'Martabak telur bebek dengan porsi 2 butir telur bebek berkualitas.',
    relatedSlugs: ['martabak-telur-bebek-1-telur-20k', 'martabak-telur-bebek-3-telur-50k'],
  },
  {
    id: 'mtb-3-50',
    slug: 'martabak-telur-bebek-3-telur-50k',
    name: 'Martabak Telur Bebek - 3 Telur (Rp 50.000)',
    category: 'martabak-telur-bebek',
    categoryLabel: 'Martabak Telur Bebek',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    badge: 'terlaris',
    description: 'Martabak telur bebek dengan porsi 3 butir telur bebek berkualitas.',
    relatedSlugs: ['martabak-telur-bebek-2-telur-40k', 'martabak-telur-bebek-4-telur-60k'],
  },
  {
    id: 'mtb-4-60',
    slug: 'martabak-telur-bebek-4-telur-60k',
    name: 'Martabak Telur Bebek - 4 Telur (Rp 60.000)',
    category: 'martabak-telur-bebek',
    categoryLabel: 'Martabak Telur Bebek',
    price: 60000,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    description: 'Martabak telur bebek gurih dengan isian 4 butir telur bebek berkualitas.',
    relatedSlugs: ['martabak-telur-bebek-3-telur-50k', 'martabak-telur-bebek-5-telur-70k'],
  },
  {
    id: 'mtb-5-70',
    slug: 'martabak-telur-bebek-5-telur-70k',
    name: 'Martabak Telur Bebek - 5 Telur (Rp 70.000)',
    category: 'martabak-telur-bebek',
    categoryLabel: 'Martabak Telur Bebek',
    price: 70000,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    description: 'Martabak telur bebek dengan racikan bumbu khas dan 5 butir telur.',
    relatedSlugs: ['martabak-telur-bebek-4-telur-60k', 'martabak-telur-bebek-6-telur-80k'],
  },
  {
    id: 'mtb-6-80',
    slug: 'martabak-telur-bebek-6-telur-80k',
    name: 'Martabak Telur Bebek - 6 Telur (Rp 80.000)',
    category: 'martabak-telur-bebek',
    categoryLabel: 'Martabak Telur Bebek',
    price: 80000,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
    description: 'Martabak telur bebek porsi puncak dengan 6 butir telur bebek premium.',
    relatedSlugs: ['martabak-telur-bebek-5-telur-70k', 'martabak-telur-ayam-6-telur-70k'],
  },

  // ===== MENU TERANG BULAN =====
  {
    id: 'tb-2-topping',
    slug: 'terang-bulan-2-variant-topping',
    name: 'Terang Bulan 2 Variant Topping',
    category: 'terang-bulan',
    categoryLabel: 'Terang Bulan',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
    badge: 'terlaris',
    description: 'Terang bulan lembut khas A6 Nyuss dengan bebas kombinasi 2 pilihan topping.',
    variants: [
      {
        label: 'Pilihan Topping 1',
        required: true,
        options: toppingOptions,
      },
      {
        label: 'Pilihan Topping 2',
        required: true,
        options: toppingOptions,
      },
      {
        label: 'Topping Tambahan',
        required: false,
        options: extraToppingOptions,
      },
    ],
    relatedSlugs: ['terang-bulan-milo-1-topping', 'terang-bulan-oreo-1-topping'],
  },
  {
    id: 'tb-milo',
    slug: 'terang-bulan-milo-1-topping',
    name: 'Terang Bulan Milo + 1 Topping',
    category: 'terang-bulan',
    categoryLabel: 'Terang Bulan',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
    description: 'Taburan bubuk cokelat Milo melimpah ditambah bebas memilih 1 topping pelengkap.',
    variants: [
      {
        label: 'Pilih Topping Tambahan',
        required: true,
        options: toppingOptions,
      },
      {
        label: 'Extra Topping',
        required: false,
        options: extraToppingOptions,
      },
    ],
    relatedSlugs: ['terang-bulan-2-variant-topping', 'terang-bulan-oreo-1-topping'],
  },
  {
    id: 'tb-oreo',
    slug: 'terang-bulan-oreo-1-topping',
    name: 'Terang Bulan Oreo + 1 Topping',
    category: 'terang-bulan',
    categoryLabel: 'Terang Bulan',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop',
    description: 'Taburan remahan biskuit Oreo renyah melimpah ditambah bebas memilih 1 topping pilihan.',
    variants: [
      {
        label: 'Pilih Topping Tambahan',
        required: true,
        options: toppingOptions,
      },
      {
        label: 'Extra Topping',
        required: false,
        options: extraToppingOptions,
      },
    ],
    relatedSlugs: ['terang-bulan-2-variant-topping', 'terang-bulan-milo-1-topping'],
  },
  {
    id: 'tb-nutella',
    slug: 'terang-bulan-nutella-1-topping',
    name: 'Terang Bulan Nutella + 1 Topping',
    category: 'terang-bulan',
    categoryLabel: 'Terang Bulan',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop',
    badge: 'terlaris',
    description: 'Olesan selai cokelat hazelnut Nutella premium ditambah 1 topping pelengkap pilihan.',
    variants: [
      {
        label: 'Pilih Topping Tambahan',
        required: true,
        options: toppingOptions,
      },
      {
        label: 'Extra Topping',
        required: false,
        options: extraToppingOptions,
      },
    ],
    relatedSlugs: ['terang-bulan-silverqueen-1-topping', 'terang-bulan-2-variant-topping'],
  },
  {
    id: 'tb-silverqueen',
    slug: 'terang-bulan-silverqueen-1-topping',
    name: 'Terang Bulan SilverQueen + 1 Topping',
    category: 'terang-bulan',
    categoryLabel: 'Terang Bulan',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
    badge: 'baru',
    description: 'Potongan mewah cokelat SilverQueen premium melimpah ditambah 1 topping pilihan bebas.',
    variants: [
      {
        label: 'Pilih Topping Tambahan',
        required: true,
        options: toppingOptions,
      },
      {
        label: 'Extra Topping',
        required: false,
        options: extraToppingOptions,
      },
    ],
    relatedSlugs: ['terang-bulan-nutella-1-topping', 'terang-bulan-2-variant-topping'],
  },

  /*
  // ===== PAKET BUNDLING =====
  {
    id: 'bundling-1',
    slug: 'paket-hemat-1',
    name: 'Paket Hemat 1 (Terbul + Telur)',
    category: 'paket-bundling',
    categoryLabel: 'Paket Bundling',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop',
    badge: 'baru',
    description: '1 Box Terang Bulan pilihan + 1 Box Martabak Telur Ayam. Hemat 15% dari harga normal!',
    relatedSlugs: ['paket-hemat-2'],
  },
  {
    id: 'bundling-2',
    slug: 'paket-hemat-2',
    name: 'Paket Hemat 2 (Terbul Combo)',
    category: 'paket-bundling',
    categoryLabel: 'Paket Bundling',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop',
    description: '2 Box Terang Bulan dengan topping pilihan berbeda. Combo paling populer!',
    relatedSlugs: ['paket-hemat-1'],
  },

  // ===== MINUMAN =====
  {
    id: 'drink-teh',
    slug: 'es-teh-manis',
    name: 'Es Teh Manis',
    category: 'minuman',
    categoryLabel: 'Minuman',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
    description: 'Es teh manis segar pelepas dahaga yang sangat pas menemani martabak hangat.',
    relatedSlugs: ['es-jeruk', 'air-mineral'],
  },
  {
    id: 'drink-jeruk',
    slug: 'es-jeruk',
    name: 'Es Jeruk',
    category: 'minuman',
    categoryLabel: 'Minuman',
    price: 7000,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop',
    description: 'Perasan jeruk asli segar, manis dan menyegarkan.',
    relatedSlugs: ['es-teh-manis', 'air-mineral'],
  },
  {
    id: 'drink-mineral',
    slug: 'air-mineral',
    name: 'Air Mineral',
    category: 'minuman',
    categoryLabel: 'Minuman',
    price: 4000,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop',
    description: 'Air mineral kemasan botol 600ml steril dan segar.',
    relatedSlugs: ['es-teh-manis', 'es-jeruk'],
  },
  */
];

export const popularMenuSlugs = ['terang-bulan-2-variant-topping', 'martabak-telur-ayam-2-telur-25k', 'martabak-telur-bebek-2-telur-40k', 'terang-bulan-silverqueen-1-topping'];

export function getMenuBySlug(slug: string): MenuItem | undefined {
  return menuItems.find((item) => item.slug === slug);
}

export function getMenuByCategory(category: MenuCategory): MenuItem[] {
  return menuItems.filter((item) => item.category === category);
}

export function getRelatedMenus(slugs: string[]): MenuItem[] {
  return slugs.map((slug) => menuItems.find((item) => item.slug === slug)).filter(Boolean) as MenuItem[];
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

```

---

### File: `apps/customer/data/menu_knowledge.md`

```markdown
# PENGETAHUAN MENU & TOPPING MARTABAK A6 NYUSS

## 1. KATEGORI MARTABAK TELUR
Adonan martabak gurih dengan kulit renyah, daun bawang segar, dan bumbu rempah rahasia.

### A. Martabak Telur Ayam
*   Menggunakan telur ayam pilihan dengan potongan daging ayam cincang melimpah.
*   Pilihan Porsi:
    *   **2 Telur**: Tersedia varian harga Rp 20.000 (standard), Rp 25.000 (tebal), Rp 30.000 (ekstra daging), dan Rp 35.000 (daging maksimal premium).
    *   **3 Telur**: Tersedia varian harga Rp 40.000, Rp 45.000, Rp 50.000, dan Rp 55.000.
    *   **4 Telur**: Tersedia varian harga Rp 60.000, Rp 65.000, Rp 70.000, dan Rp 75.000.

### B. Martabak Telur Bebek
*   Lebih gurih, padat, dan wangi dibanding telur ayam. Menggunakan telur bebek premium dan isian daging sapi cincang.
*   Pilihan Porsi:
    *   **2 Telur**: Tersedia varian harga Rp 20.000, Rp 30.000 (terlaris), Rp 40.000, dan Rp 50.000.
    *   **3 Telur**: Tersedia varian harga Rp 60.000, Rp 70.000, Rp 80.000, dan Rp 90.000.

---

## 2. KATEGORI TERANG BULAN (MARTABAK MANIS)
Terang Bulan bertekstur lembut, bersarang, tebal, dengan mentega wangi melimpah.

### A. Varian Menu Terang Bulan Utama:
1.  **Terang Bulan 2 Variant Topping (Rp 20.000)**: Bebas memilih kombinasi 2 rasa dari pilihan topping standar.
2.  **Terang Bulan Milo + 1 Topping (Rp 25.000)**: Taburan bubuk Milo melimpah ditambah 1 topping pelengkap pilihan Kakak.
3.  **Terang Bulan Oreo + 1 Topping (Rp 25.000)**: Taburan Oreo bubuk renyah melimpah ditambah 1 topping pelengkap.
4.  **Terang Bulan Nutella + 1 Topping (Rp 30.000)**: Selai cokelat Nutella premium melimpah ditambah 1 topping pelengkap.
5.  **Terang Bulan SilverQueen + 1 Topping (Rp 50.000)**: Cokelat SilverQueen premium melimpah ditambah 1 topping pelengkap.

### B. Pilihan Topping Standar (Free To Choose):
Kacang, Meses, Keju, Pisang, Melon, Strawberry, Selai Coklat, Nanas, Vanilla, Blueberry, Tiramisu, Green Tea, Kismis.

### C. Tambahan Extra Topping:
Kakak bisa menambah topping tambahan apa saja (Extra Keju, Extra Meses, dll.) dengan biaya tambahan **Rp 5.000 per topping tambahan**.

---

## 3. PAKET BUNDLING & MINUMAN
*   **Paket Hemat 1 (Rp 55.000)**: 1 Box Terang Bulan Pilihan + 1 Box Martabak Telur Ayam. Hemat 15%!
*   **Paket Hemat 2 (Rp 50.000)**: 2 Box Terang Bulan dengan rasa yang berbeda (Combo Terbul terpopuler).
*   **Es Teh Manis (Rp 5.000)**: Segar dan manis pas.
*   **Es Jeruk (Rp 7.000)**: Perasan jeruk asli.
*   **Air Mineral (Rp 4.000)**: Kemasan botol 600ml.

```

---

### File: `apps/customer/data/store_info.md`

```markdown
# INFORMASI TOKO & OPERASIONAL MARTABAK A6 NYUSS

*   **Nama Toko**: Martabak & Terang Bulan A6 Nyuss
*   **Alamat Toko**: Jl. Demak No. 253, Dupak, Kec. Krembangan, Kota Surabaya, Jawa Timur 60179
*   **Patokan Lokasi**: Tepat di depan Mess DITPOLAIRUD POLDA JATIM Surabaya.
*   **Google Maps Koordinat**: Lat -7.2432537, Lng 112.7206275. Tautan: https://www.google.com/maps?q=-7.243211171142016,112.71769837365488
*   **Jam Operasional**: Buka setiap hari mulai pukul 17.00 sampai pukul 01.00 WIB (malam).
*   **Kontak WhatsApp**: +62 878-1112-3482 (Nomor WhatsApp Resmi A6 Nyuss)
*   **Sosial Media**:
    *   Instagram: @a6nyusss
    *   Facebook: Martabak Nyuss
    *   TikTok: @a6nyuss
*   **Sejarah/Profil**: Menyajikan martabak telur gurih dan terang bulan manis premium khas Surabaya dengan resep turun-temurun sejak tahun 2000 menggunakan bahan berkualitas.

```

---

### File: `apps/customer/hooks/useCart.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CartState } from '@/types/cart.types';
import { MenuItem, MenuVariant } from '@/types/database.types';

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (menuItem: MenuItem, selectedVariant: MenuVariant | null, quantity: number, notes = '') => {
        const items = get().items;
        const itemId = `${menuItem.id}-${selectedVariant?.id || ''}`;
        
        const existingItemIndex = items.findIndex((item) => item.id === itemId);
        
        if (existingItemIndex > -1) {
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += quantity;
          if (notes) {
            // Append or overwrite note
            updatedItems[existingItemIndex].notes = notes;
          }
          set({ items: updatedItems });
        } else {
          const newItem: CartItem = {
            id: itemId,
            menuItem,
            selectedVariant,
            quantity,
            notes,
          };
          set({ items: [...items, newItem] });
        }
      },
      
      removeItem: (cartItemId: string) => {
        set({ items: get().items.filter((item) => item.id !== cartItemId) });
      },
      
      updateQuantity: (cartItemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        
        const updatedItems = get().items.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item
        );
        set({ items: updatedItems });
      },
      
      updateNotes: (cartItemId: string, notes: string) => {
        const updatedItems = get().items.map((item) =>
          item.id === cartItemId ? { ...item, notes } : item
        );
        set({ items: updatedItems });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getCartSubtotal: () => {
        return get().items.reduce((acc, item) => {
          const basePrice = Number(item.menuItem.price);
          const adjustment = Number(item.selectedVariant?.price_adjustment || 0);
          const itemPrice = basePrice + adjustment;
          return acc + itemPrice * item.quantity;
        }, 0);
      },
      
      getCartTotalCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: 'a6-nyuss-cart-storage',
    }
  )
);
export default useCart;

```

---

### File: `apps/customer/instrumentation.ts`

```typescript
// instrumentation.ts — dijalankan Next.js saat startup
// Ini yang menghubungkan Sentry ke server-side Next.js

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = async (
  err: unknown,
  request: any,
  context: any
) => {
  const { captureRequestError } = await import("@sentry/nextjs");
  captureRequestError(err, request as any, context as any);
};

```

---

### File: `apps/customer/lib/.gitkeep`

```text
# Placeholder

```

---

### File: `apps/customer/lib/supabase/client.ts`

*File not found on disk*

---

### File: `apps/customer/lib/supabase/menuService.ts`

*File not found on disk*

---

### File: `apps/customer/lib/supabase/mock.ts`

*File not found on disk*

---

### File: `apps/customer/lib/supabase/server.ts`

*File not found on disk*

---

### File: `apps/customer/lib/utils/format.ts`

```typescript
/**
 * Formats a numeric value into Indonesian Rupiah (IDR) currency format.
 * Example: 15000 -> "Rp 15.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("IDR", "Rp")
    .trim();
}

/**
 * Generates a unique, user-friendly order code.
 * Example format: A6-YYMMDD-HHMMSS-XXXX (where XXXX is a random uppercase string)
 */
export function generateOrderCode(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return `A6-${year}${month}${date}-${randomChars}`;
}

```

---

### File: `apps/customer/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseTenantFromHostname } from '@taj-saas/shared';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const { slug, appType, isLocalhost } = parseTenantFromHostname(hostname);

  // Development helpers: redirect to correct ports if subdomains hit customer app
  if (isLocalhost) {
    if (appType === 'admin') {
      const url = request.nextUrl.clone();
      url.port = '3001';
      return NextResponse.redirect(url);
    }
    if (appType === 'owner') {
      const url = request.nextUrl.clone();
      url.port = '3002';
      return NextResponse.redirect(url);
    }
  }

  // Clone headers and set tenant context
  const requestHeaders = new Headers(request.headers);
  if (slug) {
    requestHeaders.set('x-tenant-slug', slug);
  }

  // Continue request with injected header
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Only run on standard page/api routes, ignore static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (handled by Better Auth directly)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (tenant image assets)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)',
  ],
};

```

---

### File: `apps/customer/next-env.d.ts`

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/dev/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

```

---

### File: `apps/customer/next.config.ts`

```typescript
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  transpilePackages: ["@taj-saas/db", "@taj-saas/shared", "@taj-saas/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  // Sentry org & project (dari dashboard)
  org: "taj-saas",
  project: "taj-saas-customer",

  // Hanya upload source maps saat build production
  silent: !process.env.CI,

  // Upload source maps ke Sentry untuk stack trace yang readable
  widenClientFileUpload: true,

  // Aktifkan React component annotations untuk UI debugging
  reactComponentAnnotation: {
    enabled: true,
  },

  // Routing instrumentation otomatis
  tunnelRoute: "/monitoring",

  // Tree shaking Sentry di client bundle
  disableLogger: true,

  // Auto instrumentation untuk Vercel Cron Monitors
  automaticVercelMonitors: true,
});

```

---

### File: `apps/customer/package-lock.json`

*[Lock file - content omitted]*

---

### File: `apps/customer/package.json`

```json
{
  "name": "@taj-saas/customer",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@google/genai": "^2.7.0",
    "@sentry/nextjs": "^10.57.0",
    "@taj-saas/db": "workspace:*",
    "@taj-saas/shared": "workspace:*",
    "@types/leaflet": "^1.9.21",
    "ably": "^2.22.1",
    "clsx": "^2.1.1",
    "framer-motion": "^12.40.0",
    "leaflet": "^1.9.4",
    "lucide-react": "^1.17.0",
    "next": "16.2.6",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-hot-toast": "^2.6.0",
    "tailwind-merge": "^3.6.0",
    "zustand": "^5.0.14"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}

```

---

### File: `apps/customer/postcss.config.mjs`

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

```

---

### File: `apps/customer/public/Halal logo.jfif`

*[Binary file/Asset - content omitted]*

---

### File: `apps/customer/public/assets/banner_red.png`

*[Binary file/Asset - content omitted]*

---

### File: `apps/customer/public/assets/banner_redm.png`

*[Binary file/Asset - content omitted]*

---

### File: `apps/customer/public/assets/menu/placeholder.jpg`

*[Binary file/Asset - content omitted]*

---

### File: `apps/customer/public/clock.svg`

*[Binary file/Asset - content omitted]*

---

### File: `apps/customer/public/facebook.svg`

*[Binary file/Asset - content omitted]*

---

### File: `apps/customer/public/file.svg`

*[Binary file/Asset - content omitted]*

---

### File: `apps/customer/public/globe.svg`

*[Binary file/Asset - content omitted]*

---

### File: `apps/customer/public/google-maps.svg`

*[Binary file/Asset - content omitted]*

---

### File: `apps/customer/public/instagram.svg`

*[Binary file/Asset - content omitted]*

---

### File: `apps/customer/public/logo.ico`

*[Binary file/Asset - content omitted]*

---

### File: `apps/customer/public/logo.svg`

*[Binary file/Asset - content omitted]*

---

### File: `apps/customer/public/next.svg`

*[Binary file/Asset - content omitted]*

---

### File: `apps/customer/public/qris.png`

*[Binary file/Asset - content omitted]*

---

### File: `apps/customer/public/tiktok.svg`

*[Binary file/Asset - content omitted]*

---

### File: `apps/customer/public/vercel.svg`

*[Binary file/Asset - content omitted]*

---

### File: `apps/customer/public/whatsapp.svg`

*[Binary file/Asset - content omitted]*

---

### File: `apps/customer/public/window.svg`

*[Binary file/Asset - content omitted]*

---

### File: `apps/customer/sentry.client.config.ts`

```typescript
// Customer App — Sentry Client Config
// Dokumentasi: https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Tambahkan Sentry Tracing (performance monitoring)
  tracesSampleRate: 1.0,

  // Session Replay — rekam sesi user saat ada error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Debug di development (matikan di production)
  debug: process.env.NODE_ENV === "development",

  integrations: [
    Sentry.replayIntegration(),
  ],
});

```

---

### File: `apps/customer/sentry.edge.config.ts`

```typescript
// Customer App — Sentry Edge Config
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: process.env.NODE_ENV === "development",
});

```

---

### File: `apps/customer/sentry.server.config.ts`

```typescript
// Customer App — Sentry Server Config
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring di server
  tracesSampleRate: 1.0,

  debug: process.env.NODE_ENV === "development",
});

```

---

### File: `apps/customer/store/cartStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenuItem, MenuVariant } from '@/data/menu';

export interface CartItemVariant {
  label: string;
  option: MenuVariant;
}

export interface CartItem {
  cartId: string;
  menuItem: MenuItem;
  selectedVariants: CartItemVariant[];
  quantity: number;
  note: string;
  totalPrice: number;
}

interface CartState {
  items: CartItem[];
  generalNote: string;
  // Kode promo yang divalidasi server — hanya disimpan setelah /api/validate-promo mengembalikan valid:true
  promoCode: string | null;
  // Diskon yang dikonfirmasi server (bukan kalkulasi client-side)
  serverPromoDiscount: number;
  addItem: (menuItem: MenuItem, variants: CartItemVariant[], quantity: number, note: string) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  setGeneralNote: (note: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  // Promo hanya bisa diset setelah server validasi — dipanggil dari checkout page
  setServerValidatedPromo: (code: string, discountAmount: number) => void;
  clearPromoCode: () => void;
}

function calculateItemPrice(menuItem: MenuItem, variants: CartItemVariant[], quantity: number): number {
  const basePrice = menuItem.price;
  const variantModifiers = variants.reduce((sum, v) => sum + v.option.priceModifier, 0);
  return (basePrice + variantModifiers) * quantity;
}

function generateCartId(): string {
  return `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      generalNote: '',
      promoCode: null,
      // Diskon dikonfirmasi dari server — bukan kalkulasi client-side
      serverPromoDiscount: 0,

      addItem: (menuItem, selectedVariants, quantity, note) => {
        const cartId = generateCartId();
        const totalPrice = calculateItemPrice(menuItem, selectedVariants, quantity);
        set((state) => ({
          items: [
            ...state.items,
            { cartId, menuItem, selectedVariants, quantity, note, totalPrice },
          ],
        }));
      },

      removeItem: (cartId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartId !== cartId),
        }));
      },

      updateQuantity: (cartId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.cartId === cartId
              ? {
                  ...item,
                  quantity,
                  totalPrice: calculateItemPrice(item.menuItem, item.selectedVariants, quantity),
                }
              : item
          ),
        }));
      },

      setGeneralNote: (note) => set({ generalNote: note }),

      clearCart: () => set({ items: [], generalNote: '', promoCode: null, serverPromoDiscount: 0 }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.totalPrice, 0);
      },

      /**
       * Panggil ini HANYA setelah /api/validate-promo mengembalikan valid:true.
       * Diskon yang disimpan berasal dari server, bukan kalkulasi client-side.
       */
      setServerValidatedPromo: (code, discountAmount) => {
        set({ promoCode: code, serverPromoDiscount: discountAmount });
      },

      clearPromoCode: () => set({ promoCode: null, serverPromoDiscount: 0 }),
    }),
    {
      name: 'a6nyuss-cart',
    }
  )
);

export interface Order {
  orderCode: string;
  items: CartItem[];
  customerName: string;
  customerPhone: string;
  orderType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  addressNote?: string;
  generalNote: string;
  paymentMethod: 'cod' | 'transfer';
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'received' | 'processing' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
  estimatedTime: number;
  paymentStatus?: string;
  paymentProofUrl?: string;
  promoCode?: string;
  promoDiscount?: number;
}

interface OrderState {
  currentOrder: Order | null;
  orderHistory: Order[];
  setCurrentOrder: (order: Order) => void;
  getOrderByCode: (code: string) => Order | undefined;
  updateOrderStatus: (code: string, status: Order['status']) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      currentOrder: null,
      orderHistory: [],

      setCurrentOrder: (order) => {
        set((state) => ({
          currentOrder: order,
          orderHistory: [order, ...state.orderHistory.filter((o) => o.orderCode !== order.orderCode)],
        }));
      },

      getOrderByCode: (code) => {
        return get().orderHistory.find((o) => o.orderCode === code);
      },

      updateOrderStatus: (code, status) => {
        set((state) => ({
          orderHistory: state.orderHistory.map((o) =>
            o.orderCode === code ? { ...o, status } : o
          ),
          currentOrder:
            state.currentOrder?.orderCode === code
              ? { ...state.currentOrder, status }
              : state.currentOrder,
        }));
      },
    }),
    {
      name: 'a6nyuss-orders',
    }
  )
);

export function generateOrderCode(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `A6-${date}-${rand}`;
}

export const DELIVERY_FEE = 10000;
export const DELIVERY_ZONES: { name: string; fee: number }[] = [
  { name: 'Zona 1 (0-3 km)', fee: 8000 },
  { name: 'Zona 2 (3-6 km)', fee: 13000 },
  { name: 'Zona 3 (6-10 km)', fee: 18000 },
];

```

---

### File: `apps/customer/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "**/*.mts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}

```

---

### File: `apps/customer/types/cart.types.ts`

```typescript
import { MenuItem, MenuVariant } from './database.types';

export interface CartItem {
  id: string; // Unique ID composed of: menuItemId + (variantId || '')
  menuItem: MenuItem;
  selectedVariant: MenuVariant | null;
  quantity: number;
  notes: string;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: MenuItem, variant: MenuVariant | null, quantity: number, notes?: string) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateNotes: (cartItemId: string, notes: string) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getCartTotalCount: () => number;
}

```

---

### File: `apps/customer/types/database.types.ts`

```typescript
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          category_id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          image_url: string | null;
          is_available: boolean;
          is_best_seller: boolean;
          is_new: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name: string;
          slug: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          is_available?: boolean;
          is_best_seller?: boolean;
          is_new?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          is_available?: boolean;
          is_best_seller?: boolean;
          is_new?: boolean;
          created_at?: string;
        };
      };
      menu_variants: {
        Row: {
          id: string;
          menu_item_id: string;
          name: string;
          price_adjustment: number;
          is_available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          menu_item_id: string;
          name: string;
          price_adjustment?: number;
          is_available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          menu_item_id?: string;
          name?: string;
          price_adjustment?: number;
          is_available?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_code: string;
          customer_name: string;
          customer_phone: string;
          delivery_type: 'pickup' | 'delivery';
          delivery_address: string | null;
          delivery_fee: number;
          subtotal: number;
          total_price: number;
          status: 'received' | 'processing' | 'ready' | 'completed' | 'cancelled';
          notes: string | null;
          payment_method: 'cod' | 'transfer';
          payment_status: 'pending' | 'waiting_verification' | 'paid' | 'failed';
          payment_proof_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_code: string;
          customer_name: string;
          customer_phone: string;
          delivery_type: 'pickup' | 'delivery';
          delivery_address?: string | null;
          delivery_fee?: number;
          subtotal: number;
          total_price: number;
          status?: 'received' | 'processing' | 'ready' | 'completed' | 'cancelled';
          notes?: string | null;
          payment_method?: 'cod' | 'transfer';
          payment_status?: 'pending' | 'waiting_verification' | 'paid' | 'failed';
          payment_proof_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_code?: string;
          customer_name?: string;
          customer_phone?: string;
          delivery_type?: 'pickup' | 'delivery';
          delivery_address?: string | null;
          delivery_fee?: number;
          subtotal?: number;
          total_price?: number;
          status?: 'received' | 'processing' | 'ready' | 'completed' | 'cancelled';
          notes?: string | null;
          payment_method?: 'cod' | 'transfer';
          payment_status?: 'pending' | 'waiting_verification' | 'paid' | 'failed';
          payment_proof_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string | null;
          menu_item_name: string;
          variant_name: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          customer_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_item_id?: string | null;
          menu_item_name: string;
          variant_name?: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          customer_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          menu_item_id?: string | null;
          menu_item_name?: string;
          variant_name?: string | null;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          customer_name?: string | null;
          created_at?: string;
        };
      };
      store_settings: {
        Row: {
          id: number;
          store_name: string;
          is_open: boolean;
          whatsapp_number: string;
          flat_delivery_fee: number;
          minimum_order_amount: number;
          store_address: string | null;
          google_maps_url: string | null;
          opening_hours: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          store_name?: string;
          is_open?: boolean;
          whatsapp_number: string;
          flat_delivery_fee?: number;
          minimum_order_amount?: number;
          store_address?: string | null;
          google_maps_url?: string | null;
          opening_hours?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          store_name?: string;
          is_open?: boolean;
          whatsapp_number?: string;
          flat_delivery_fee?: number;
          minimum_order_amount?: number;
          store_address?: string | null;
          google_maps_url?: string | null;
          opening_hours?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Category = Database['public']['Tables']['categories']['Row'];
export type MenuItem = Database['public']['Tables']['menu_items']['Row'];
export type MenuVariant = Database['public']['Tables']['menu_variants']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type StoreSettings = Database['public']['Tables']['store_settings']['Row'];

```

---

### File: `apps/customer/utils/cn.ts`

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

---

### File: `apps/owner/.env`

```text
# Owner Dashboard App — Port 3002
# Copy dari root .env dan tambahkan yang spesifik

DATABASE_URL=xxxx
BETTER_AUTH_SECRET=xxxx
BETTER_AUTH_URL=xxxx
BETTER_AUTH_API_KEY=xxxx
ABLY_API_KEY=xxxx

# Monitoring (isi setelah setup Sentry & PostHog)
NEXT_PUBLIC_SENTRY_DSN=xxxx
NEXT_PUBLIC_POSTHOG_KEY=xxxx
NEXT_PUBLIC_POSTHOG_HOST=xxxx

```

---

### File: `apps/owner/_pages/AIInsights.tsx`

```tsx
﻿"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { aiInsights, forecastData } from "@/data/mockData";
import { formatRupiah } from "@/utils/format";

const chatMessages = [
  { role: "ai", content: "Halo Pak Bambang! Saya TajAI, asisten bisnis Anda. Ada yang bisa saya bantu analisis hari ini? ðŸ¤–" },
  { role: "user", content: "Kenapa food cost Cabang Bekasi lebih tinggi dari cabang lain?" },
  { role: "ai", content: "Berdasarkan data 30 hari terakhir, food cost Cabang Bekasi 31.5% â€” lebih tinggi 3.7% dari rata-rata. Ada 3 faktor utama:\n\n1. ðŸ“Š Waste adonan martabak rata-rata 2.1 kg/hari (tertinggi di antara semua cabang)\n2. âš–ï¸ Porsi tidak konsisten â€” rata-rata berat per porsi 12% lebih besar dari standar BOM\n3. ðŸ›’ Pembelian bahan tidak terencana (3x dalam bulan ini)\n\nSaran: Lakukan audit porsi minggu ini dan aktifkan reminder produksi untuk kasir Bekasi." },
];

function ForecastTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold mb-2 text-slate-700 dark:text-slate-200">{label}</p>
        {payload.map((entry: any, i: number) => (
          entry.value !== null && (
            <div key={i} className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-500">{entry.name}:</span>
              <span className="font-semibold">{formatRupiah(entry.value, true)}</span>
            </div>
          )
        ))}
      </div>
    );
  }
  return null;
}

export default function AIInsights() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(chatMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [priceIncrease, setPriceIncrease] = useState(0);
  const [costReduction, setCostReduction] = useState(0);
  const [volumeChange, setVolumeChange] = useState(0);

  const baseRevenue = 185200000;
  const baseCost = 54834000;
  const baseProfit = baseRevenue - baseCost;
  const simRevenue = baseRevenue * (1 + priceIncrease / 100) * (1 + volumeChange / 100);
  const simCost = baseCost * (1 - costReduction / 100);
  const simProfit = simRevenue - simCost;
  const profitChange = ((simProfit - baseProfit) / baseProfit) * 100;

  function handleSend() {
    if (!chatInput.trim()) return;
    const userMsg = { role: "user", content: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = {
        role: "ai",
        content: `Analisis untuk "${userMsg.content}":\n\nBerdasarkan data historis 90 hari terakhir, saya menemukan beberapa pola menarik. Revenue tertinggi terjadi pada hari Sabtu-Minggu pukul 18:00-21:00. Menu Martabak Keju Susu memiliki margin tertinggi (67.3%) namun volume penjualan masih bisa ditingkatkan 25% dengan strategi bundling yang tepat.\n\nApakah Anda ingin melihat detail lebih lanjut? ðŸ“Š`,
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">AI Insights & Forecasting</h2>
            <span className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950/40 dark:to-amber-950/40 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
              Powered by TajAI
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">Prediksi demand, simulasi, dan chat AI</p>
        </div>
      </div>

      {/* AI Insights Grid */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">ðŸ“Š Insight Terbaru</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {aiInsights.map((insight) => {
            const colors: Record<string, string> = {
              opportunity: "border-l-emerald-400",
              warning: "border-l-amber-400",
              forecast: "border-l-blue-400",
              alert: "border-l-red-400",
            };
            const bgColors: Record<string, string> = {
              opportunity: "bg-emerald-50/50 dark:bg-emerald-950/10",
              warning: "bg-amber-50/50 dark:bg-amber-950/10",
              forecast: "bg-blue-50/50 dark:bg-blue-950/10",
              alert: "bg-red-50/50 dark:bg-red-950/10",
            };
            return (
              <div key={insight.id} className={`rounded-xl border border-slate-200 dark:border-slate-800 border-l-4 ${colors[insight.type]} ${bgColors[insight.type]} p-4`}>
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-xl flex-shrink-0">{insight.icon}</span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{insight.title}</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">{insight.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-orange-600 dark:text-orange-400">{insight.impact}</p>
                    <p className="text-xs text-slate-400">{insight.cabang}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full" style={{ width: `${insight.confidence}%` }} />
                    </div>
                    <span className="text-xs text-slate-400">{insight.confidence}%</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">{insight.action} â†’</Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Forecast Chart + What-If */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Forecast */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Prediksi Revenue 7 Hari ke Depan</h3>
              <p className="text-xs text-slate-500 mt-0.5">Model ML berbasis data historis + faktor eksternal</p>
            </div>
            <Badge variant="brand" size="sm">ðŸ¤– AI Forecast</Badge>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={forecastData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rangeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatRupiah(v, true)} width={58} />
              <Tooltip content={<ForecastTooltip />} />
              <Area type="monotone" dataKey="upper" name="Batas Atas" stroke="none" fill="#eff6ff" fillOpacity={1} />
              <Area type="monotone" dataKey="lower" name="Batas Bawah" stroke="none" fill="white" fillOpacity={1} />
              <Area type="monotone" dataKey="forecast" name="Prediksi" stroke="#3b82f6" strokeWidth={2.5} fill="url(#forecastGrad)" strokeDasharray="5 3" dot={{ r: 4, fill: "#3b82f6" }} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <div className="w-8 h-0.5 bg-blue-400 bg-dashed" style={{ backgroundImage: "repeating-linear-gradient(to right, #60a5fa, #60a5fa 4px, transparent 4px, transparent 8px)" }} />
              <span>Prediksi</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-4 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-800" />
              <span>Interval Kepercayaan 80%</span>
            </div>
          </div>
        </div>

        {/* What-If Simulator */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">ðŸ§ª</span>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Simulator What-If</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Naik Harga (%)</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="range" min={-20} max={30} step={1}
                  value={priceIncrease}
                  onChange={(e) => setPriceIncrease(Number(e.target.value))}
                  className="flex-1 accent-orange-500"
                />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 w-10 text-right">{priceIncrease > 0 ? "+" : ""}{priceIncrease}%</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Kurangi Biaya (%)</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="range" min={0} max={20} step={1}
                  value={costReduction}
                  onChange={(e) => setCostReduction(Number(e.target.value))}
                  className="flex-1 accent-emerald-500"
                />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 w-10 text-right">-{costReduction}%</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Perubahan Volume (%)</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="range" min={-30} max={50} step={1}
                  value={volumeChange}
                  onChange={(e) => setVolumeChange(Number(e.target.value))}
                  className="flex-1 accent-blue-500"
                />
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 w-10 text-right">{volumeChange > 0 ? "+" : ""}{volumeChange}%</span>
              </div>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200 dark:border-orange-900/30">
            <p className="text-xs text-slate-500 mb-3">Simulasi Profit (Des 2024)</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500">Baseline</p>
                <p className="text-base font-bold text-slate-800 dark:text-slate-200">{formatRupiah(baseProfit, true)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Simulasi</p>
                <p className={`text-base font-bold ${simProfit > baseProfit ? "text-emerald-600" : "text-red-600"}`}>
                  {formatRupiah(simProfit, true)}
                </p>
              </div>
            </div>
            <div className={`mt-3 p-2 rounded-lg ${profitChange >= 0 ? "bg-emerald-100 dark:bg-emerald-950/30" : "bg-red-100 dark:bg-red-950/30"}`}>
              <p className={`text-sm font-bold text-center ${profitChange >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {profitChange >= 0 ? "+" : ""}{profitChange.toFixed(1)}% perubahan profit
              </p>
            </div>
          </div>

          <Button variant="primary" size="sm" className="w-full mt-3">Simpan Skenario</Button>
        </div>
      </div>

      {/* AI Chat */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white text-base shadow-sm flex-shrink-0">
            ðŸ¤–
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">TajAI Assistant</p>
            <p className="text-xs text-slate-500">Tanya apa saja tentang bisnis Anda dalam Bahasa Indonesia</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs text-emerald-600 font-medium">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="h-72 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "ai" && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-xs text-white mr-2 flex-shrink-0 mt-0.5">
                  ðŸ¤–
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-orange-500 text-white rounded-tr-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm"
              }`}>
                <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-xs text-white">
                ðŸ¤–
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick prompts */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto">
          {[
            "Kenapa revenue turun?",
            "Menu apa yang harus dihapus?",
            "Prediksi Natal besok?",
            "Food cost Bekasi tinggi?",
          ].map(prompt => (
            <button
              key={prompt}
              onClick={() => setChatInput(prompt)}
              className="text-xs px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/30 whitespace-nowrap hover:bg-orange-100 dark:hover:bg-orange-950/40 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Tanya TajAI tentang bisnis Anda..."
            className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <Button variant="primary" size="md" onClick={handleSend} disabled={!chatInput.trim()}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}




```

---

### File: `apps/owner/_pages/Cabang.tsx`

```tsx
﻿"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cabangList, revenueByCabang } from "@/data/mockData";
import { formatRupiah, formatPercent } from "@/utils/format";

const METRIC_COLORS = ["#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"];

function CompareTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold mb-2 text-slate-700 dark:text-slate-200">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-semibold">{formatRupiah(entry.value, true)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function Cabang() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = cabangList.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Manajemen Cabang</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {cabangList.filter(c => c.status === "active").length} aktif Â· {cabangList.filter(c => c.status === "maintenance").length} maintenance dari {cabangList.length} cabang
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }>Export</Button>
          <Button variant="primary" size="sm" onClick={() => setShowAdd(true)} icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }>Tambah Cabang</Button>
        </div>
      </div>

      {/* Search + View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Cari cabang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg h-fit">
          <button
            onClick={() => setView("cards")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === "cards" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500"}`}
          >
            Kartu
          </button>
          <button
            onClick={() => setView("table")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === "table" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500"}`}
          >
            Tabel
          </button>
        </div>
      </div>

      {/* Branch Cards */}
      {view === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((cabang) => (
            <div key={cabang.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 hover:shadow-md transition-all group cursor-pointer">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white text-lg shadow-sm">
                    ðŸª
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{cabang.name}</p>
                    <p className="text-xs text-slate-500">{cabang.city}</p>
                  </div>
                </div>
                <Badge variant={cabang.status === "active" ? "success" : "warning"}>
                  {cabang.status === "active" ? "â— Aktif" : "âš  Maintenance"}
                </Badge>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Revenue</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{formatRupiah(cabang.revenue, true)}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Orders</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{cabang.orders.toLocaleString("id-ID")}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Food Cost</p>
                  <p className={`text-sm font-bold ${cabang.foodCost > 30 ? "text-red-600" : "text-emerald-600"}`}>
                    {formatPercent(cabang.foodCost)}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Rating</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">â­ {cabang.rating}</p>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">Food Cost</span>
                    <span className={`text-xs font-semibold ${cabang.foodCost > 30 ? "text-red-600" : "text-emerald-600"}`}>{formatPercent(cabang.foodCost)}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${cabang.foodCost > 30 ? "bg-red-400" : "bg-emerald-400"}`} style={{ width: `${(cabang.foodCost / 40) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">Labor Cost</span>
                    <span className={`text-xs font-semibold ${cabang.laborCost > 20 ? "text-amber-600" : "text-emerald-600"}`}>{formatPercent(cabang.laborCost)}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${cabang.laborCost > 20 ? "bg-amber-400" : "bg-emerald-400"}`} style={{ width: `${(cabang.laborCost / 30) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400">{cabang.kasir} kasir aktif Â· {cabang.lastSync}</span>
                <button className="text-xs text-orange-600 dark:text-orange-400 font-semibold hover:underline group-hover:text-orange-700">
                  Lihat Detail â†’
                </button>
              </div>
            </div>
          ))}

          {/* Add Branch Card */}
          <button
            onClick={() => setShowAdd(true)}
            className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-5 flex flex-col items-center justify-center gap-3 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50/50 dark:hover:bg-orange-950/10 transition-all group min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 group-hover:bg-orange-100 dark:group-hover:bg-orange-950/30 flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-slate-400 group-hover:text-orange-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 group-hover:text-orange-600 transition-colors">Tambah Cabang Baru</p>
              <p className="text-xs text-slate-400 mt-1">Klik untuk mendaftarkan cabang baru</p>
            </div>
          </button>
        </div>
      )}

      {/* Table View */}
      {view === "table" && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {["Nama Cabang", "Kota", "Status", "Revenue", "Orders", "AOV", "Food Cost", "Labor Cost", "Rating", "Last Sync", ""].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((cabang) => (
                  <tr key={cabang.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">ðŸª</span>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">{cabang.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{cabang.city}</td>
                    <td className="px-4 py-3">
                      <Badge variant={cabang.status === "active" ? "success" : "warning"}>
                        {cabang.status === "active" ? "Aktif" : "Maintenance"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-200">{formatRupiah(cabang.revenue, true)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{cabang.orders.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatRupiah(cabang.avgOrder, true)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-semibold ${cabang.foodCost > 30 ? "text-red-600" : "text-emerald-600"}`}>{formatPercent(cabang.foodCost)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-semibold ${cabang.laborCost > 20 ? "text-amber-600" : "text-emerald-600"}`}>{formatPercent(cabang.laborCost)}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">â­ {cabang.rating}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{cabang.lastSync}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Comparison Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Perbandingan Performa Cabang</h3>
            <p className="text-xs text-slate-500 mt-0.5">Revenue vs Target bulan ini</p>
          </div>
          <Badge variant="info" size="sm">Desember 2024</Badge>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={revenueByCabang} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatRupiah(v, true)} width={56} />
            <Tooltip content={<CompareTooltip />} />
            <Legend wrapperStyle={{ fontSize: "11px" }} iconType="circle" iconSize={8} />
            <Bar dataKey="revenue" name="Revenue" radius={[4, 4, 0, 0]} maxBarSize={36}>
              {revenueByCabang.map((_, index) => (
                <Cell key={index} fill={METRIC_COLORS[index % METRIC_COLORS.length]} />
              ))}
            </Bar>
            <Bar dataKey="target" name="Target" radius={[4, 4, 0, 0]} maxBarSize={36} fill="#e2e8f0" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Add Branch Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Tambah Cabang Baru</h3>
              <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <Input label="Nama Cabang" placeholder="Cabang Menteng" />
              <Input label="Kota" placeholder="Jakarta" />
              <Input label="Alamat" placeholder="Jl. Menteng Raya No. 12..." />
              <Input label="No. Telepon" placeholder="+62 21 xxxx xxxx" />
              <Input label="Nama PIC" placeholder="Nama manajer cabang" />
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Batal</Button>
              <Button variant="primary" className="flex-1" onClick={() => setShowAdd(false)}>Simpan Cabang</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




```

---

### File: `apps/owner/_pages/ExecutiveCockpit.tsx`

```tsx
﻿"use client";

import React, { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Cell
} from "recharts";
import { CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  kpiSummary, revenueTrend7d, revenueTrend30d, revenueTrend90d,
  menuList, revenueByCabang, hourlyHeatmap, aiInsights, criticalAlerts, cabangList
} from "@/data/mockData";
import { formatRupiah, formatPercent, formatChange, formatNumber, getHeatmapColor } from "@/utils/format";

type Period = "7d" | "30d" | "90d" | "ytd";

const periodData: Record<Period, typeof revenueTrend7d> = {
  "7d": revenueTrend7d,
  "30d": revenueTrend30d,
  "90d": revenueTrend90d,
  "ytd": revenueTrend30d,
};

const CABANG_COLORS = ["#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"];

// ============================================================
// Custom Tooltip
// ============================================================
function RevenueTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {entry.name === "Revenue" || entry.name === "Target"
                ? formatRupiah(entry.value, true)
                : formatNumber(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function CabangTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-semibold">{formatRupiah(entry.value, true)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

// ============================================================
// KPI Card
// ============================================================
interface KpiCardProps {
  label: string;
  value: string;
  change: number;
  period: string;
  icon: React.ReactNode;
  iconBg: string;
  isPositiveGood?: boolean;
  prefix?: string;
  suffix?: string;
}

function KpiCard({ label, value, change, period, icon, iconBg, isPositiveGood = true }: KpiCardProps) {
  const isPositive = change > 0;
  const isGood = isPositiveGood ? isPositive : !isPositive;
  const isNeutral = change === 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        {!isNeutral && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
            isGood ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30" :
            "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/30"
          }`}>
            <svg className={`w-3 h-3 ${isPositive ? "" : "rotate-180"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {formatChange(Math.abs(change))}
          </div>
        )}
        {isNeutral && (
          <span className="text-xs font-medium text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full">â€”</span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{value}</p>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{period}</p>
      </div>
    </div>
  );
}

// ============================================================
// AI Insight Card
// ============================================================
function AIInsightCard({ insight }: { insight: typeof aiInsights[0] }) {
  type InsightType = "opportunity" | "warning" | "forecast" | "alert";
  const typeColors: Record<InsightType, string> = {
    opportunity: "border-l-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/10",
    warning: "border-l-amber-400 bg-amber-50/50 dark:bg-amber-950/10",
    forecast: "border-l-blue-400 bg-blue-50/50 dark:bg-blue-950/10",
    alert: "border-l-red-400 bg-red-50/50 dark:bg-red-950/10",
  };

  const impactColors: Record<InsightType, string> = {
    opportunity: "text-emerald-700 dark:text-emerald-400",
    warning: "text-amber-700 dark:text-amber-400",
    forecast: "text-blue-700 dark:text-blue-400",
    alert: "text-red-700 dark:text-red-400",
  };
  const insightType = insight.type as InsightType;

  return (
    <div className={`rounded-xl border border-slate-200 dark:border-slate-800 border-l-4 ${typeColors[insightType]} p-4 flex flex-col gap-2`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 flex-1">
          <span className="text-lg flex-shrink-0 mt-0.5">{insight.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">{insight.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{insight.description}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold ${impactColors[insightType]}`}>{insight.impact}</span>
          <span className="text-xs text-slate-400">Â·</span>
          <span className="text-xs text-slate-500">{insight.cabang}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-10 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div className="h-full bg-orange-400 rounded-full" style={{ width: `${insight.confidence}%` }} />
            </div>
            <span className="text-xs text-slate-400">{insight.confidence}%</span>
          </div>
          <button className="text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline whitespace-nowrap">
            {insight.action} â†’
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Heatmap Hours
// ============================================================
const HOURS = ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"];

function SalesHeatmap() {
  const allValues = hourlyHeatmap.flatMap(row =>
    HOURS.map(h => (row as any)[`h${h}`] as number)
  );
  const maxVal = Math.max(...allValues);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[480px]">
        {/* Hour headers */}
        <div className="flex items-center gap-1 mb-1 ml-10">
          {HOURS.map(h => (
            <div key={h} className="flex-1 text-center text-xs text-slate-400 font-medium">{h}</div>
          ))}
        </div>
        {/* Rows */}
        {hourlyHeatmap.map((row) => (
          <div key={row.day} className="flex items-center gap-1 mb-1">
            <div className="w-9 text-xs font-medium text-slate-500 text-right pr-2">{row.day}</div>
            {HOURS.map(h => {
              const val = (row as any)[`h${h}`] as number;
              const colorClass = getHeatmapColor(val, maxVal);
              return (
                <div
                  key={h}
                  className={`flex-1 h-8 rounded-md flex items-center justify-center text-xs font-medium transition-all cursor-default ${colorClass}`}
                  title={`${row.day} pukul ${h}.00 â€” ${val} order`}
                >
                  {val}
                </div>
              );
            })}
          </div>
        ))}
        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 ml-10">
          <span className="text-xs text-slate-400">Sepi</span>
          {["bg-orange-50", "bg-orange-100", "bg-orange-200", "bg-orange-400", "bg-orange-600"].map((c, i) => (
            <div key={i} className={`w-6 h-3 rounded ${c} border border-slate-200`} />
          ))}
          <span className="text-xs text-slate-400">Ramai</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ExecutiveCockpit() {
  const [period, setPeriod] = useState<Period>("7d");
  const chartData = periodData[period];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* â”€â”€ Header Row â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Selamat pagi, Pak Bambang ðŸ‘‹
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Senin, 23 Desember 2024 Â· Data diperbarui 2 menit lalu
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          >
            Des 2024
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            }
          >
            Export
          </Button>
        </div>
      </div>

      {/* â”€â”€ KPI Cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-9 gap-3">
        <div className="col-span-2 xl:col-span-2 sm:col-span-4">
          <KpiCard
            label={kpiSummary.totalRevenue.label}
            value={formatRupiah(kpiSummary.totalRevenue.value, true)}
            change={kpiSummary.totalRevenue.change}
            period={kpiSummary.totalRevenue.period}
            isPositiveGood={true}
            iconBg="bg-orange-100 dark:bg-orange-950/30"
            icon={
              <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
        <div className="col-span-1 xl:col-span-1">
          <KpiCard
            label={kpiSummary.grossMargin.label}
            value={formatPercent(kpiSummary.grossMargin.value)}
            change={kpiSummary.grossMargin.change}
            period={kpiSummary.grossMargin.period}
            isPositiveGood={true}
            iconBg="bg-emerald-100 dark:bg-emerald-950/30"
            icon={
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
        </div>
        <div className="col-span-1 xl:col-span-1">
          <KpiCard
            label={kpiSummary.foodCost.label}
            value={formatPercent(kpiSummary.foodCost.value)}
            change={kpiSummary.foodCost.change}
            period={kpiSummary.foodCost.period}
            isPositiveGood={false}
            iconBg="bg-amber-100 dark:bg-amber-950/30"
            icon={
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
        </div>
        <div className="col-span-1 xl:col-span-1">
          <KpiCard
            label={kpiSummary.laborCost.label}
            value={formatPercent(kpiSummary.laborCost.value)}
            change={kpiSummary.laborCost.change}
            period={kpiSummary.laborCost.period}
            isPositiveGood={false}
            iconBg="bg-blue-100 dark:bg-blue-950/30"
            icon={
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
        </div>
        <div className="col-span-1 xl:col-span-1">
          <KpiCard
            label={kpiSummary.wastePercent.label}
            value={formatPercent(kpiSummary.wastePercent.value)}
            change={kpiSummary.wastePercent.change}
            period={kpiSummary.wastePercent.period}
            isPositiveGood={false}
            iconBg="bg-red-100 dark:bg-red-950/30"
            icon={
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
          />
        </div>
        <div className="col-span-1 xl:col-span-1">
          <KpiCard
            label={kpiSummary.totalOrders.label}
            value={formatNumber(kpiSummary.totalOrders.value)}
            change={kpiSummary.totalOrders.change}
            period={kpiSummary.totalOrders.period}
            isPositiveGood={true}
            iconBg="bg-purple-100 dark:bg-purple-950/30"
            icon={
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
        </div>
        <div className="col-span-1 xl:col-span-1">
          <KpiCard
            label={kpiSummary.aov.label}
            value={formatRupiah(kpiSummary.aov.value)}
            change={kpiSummary.aov.change}
            period={kpiSummary.aov.period}
            isPositiveGood={true}
            iconBg="bg-indigo-100 dark:bg-indigo-950/30"
            icon={
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
          />
        </div>
        <div className="col-span-1 xl:col-span-1">
          <KpiCard
            label={kpiSummary.activeCabang.label}
            value={`${kpiSummary.activeCabang.value}/5`}
            change={kpiSummary.activeCabang.change}
            period={kpiSummary.activeCabang.period}
            isPositiveGood={true}
            iconBg="bg-teal-100 dark:bg-teal-950/30"
            icon={
              <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
        </div>
      </div>

      {/* â”€â”€ Revenue Trend + Cabang Performance â”€â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tren Pendapatan</h3>
              <p className="text-xs text-slate-500 mt-0.5">Total semua cabang</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
              {(["7d", "30d", "90d", "ytd"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    period === p
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  {p === "ytd" ? "YTD" : p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                interval={period === "7d" ? 0 : period === "30d" ? 4 : 11}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatRupiah(v, true)}
                width={60}
              />
              <Tooltip content={<RevenueTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
                iconType="circle"
                iconSize={8}
              />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#f97316" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: "#f97316" }} />
              <Area type="monotone" dataKey="target" name="Target" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 4" fill="url(#targetGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Cabang */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <CardHeader title="Revenue per Cabang" subtitle="Bulan ini" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueByCabang} layout="vertical" margin={{ top: 0, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 9, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatRupiah(v, true)} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} width={52} />
              <Tooltip content={<CabangTooltip />} />
              <Bar dataKey="revenue" name="Revenue" radius={[0, 4, 4, 0]} maxBarSize={18}>
                {revenueByCabang.map((_, index) => (
                  <Cell key={index} fill={CABANG_COLORS[index % CABANG_COLORS.length]} />
                ))}
              </Bar>
              <Bar dataKey="target" name="Target" radius={[0, 4, 4, 0]} maxBarSize={18} fill="#e2e8f0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* â”€â”€ Top Menu + Heatmap â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Menu Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Top 10 Menu</h3>
              <p className="text-xs text-slate-500 mt-0.5">Berdasarkan revenue & margin</p>
            </div>
            <Button variant="ghost" size="sm">Lihat Semua</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left text-xs font-semibold text-slate-400 pb-2 pr-3">#</th>
                  <th className="text-left text-xs font-semibold text-slate-400 pb-2">Menu</th>
                  <th className="text-right text-xs font-semibold text-slate-400 pb-2">Revenue</th>
                  <th className="text-right text-xs font-semibold text-slate-400 pb-2">Margin</th>
                  <th className="text-center text-xs font-semibold text-slate-400 pb-2">Tipe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {menuList.map((menu, index) => (
                  <tr key={menu.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="py-2.5 pr-3 text-xs font-bold text-slate-400">{String(index + 1).padStart(2, "0")}</td>
                    <td className="py-2.5">
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">{menu.name}</p>
                        <p className="text-xs text-slate-400">{menu.category} Â· {menu.soldToday} terjual</p>
                      </div>
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{formatRupiah(menu.revenue, true)}</span>
                    </td>
                    <td className="py-2.5 text-right">
                      <span className={`text-xs font-semibold ${menu.margin >= 68 ? "text-emerald-600" : menu.margin >= 62 ? "text-amber-600" : "text-red-500"}`}>
                        {formatPercent(menu.margin)}
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      <Badge
                        variant={
                          menu.status === "star" ? "success" :
                          menu.status === "plow-horse" ? "info" :
                          menu.status === "puzzle" ? "warning" : "neutral"
                        }
                      >
                        {menu.status === "star" ? "â­ Star" :
                         menu.status === "plow-horse" ? "ðŸ´ Plough" :
                         menu.status === "puzzle" ? "ðŸ§© Puzzle" : "ðŸ• Dog"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hourly Heatmap */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Heatmap Penjualan per Jam</h3>
              <p className="text-xs text-slate-500 mt-0.5">Jumlah order per jam & hari</p>
            </div>
            <Badge variant="info" size="sm">7 Hari Terakhir</Badge>
          </div>
          <SalesHeatmap />
        </div>
      </div>

      {/* â”€â”€ AI Insights + Critical Alerts â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* AI Insights */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">AI Insights</h3>
                <span className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950/40 dark:to-amber-950/40 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full font-medium">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Rekomendasi berbasis data real-time</p>
            </div>
            <Button variant="ghost" size="sm">Lihat Semua</Button>
          </div>
          <div className="space-y-3">
            {aiInsights.map((insight) => (
              <AIInsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>

        {/* Critical Alerts + Branch Status */}
        <div className="space-y-4">
          {/* Critical Alerts */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Alert Kritis</h3>
              <Badge variant="danger" size="sm">{criticalAlerts.filter(a => a.severity === "critical" || a.severity === "warning").length} aktif</Badge>
            </div>
            <div className="space-y-2.5">
              {criticalAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    alert.severity === "critical" ? "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30" :
                    alert.severity === "warning" ? "bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30" :
                    "bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30"
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    alert.severity === "critical" ? "bg-red-500" :
                    alert.severity === "warning" ? "bg-amber-500" : "bg-blue-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">{alert.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{alert.cabang}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{alert.time}</p>
                  </div>
                  <button className="text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline whitespace-nowrap">
                    Tangani
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Branch Status */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Status Cabang</h3>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            <div className="space-y-2.5">
              {cabangList.map((cabang) => (
                <div key={cabang.id} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cabang.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{cabang.name.replace("Cabang ", "")}</p>
                      <p className="text-xs text-slate-400">{cabang.lastSync}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{formatRupiah(cabang.revenue, true)}</p>
                    <p className="text-xs text-slate-400">{cabang.orders} order</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




```

---

### File: `apps/owner/_pages/Keuangan.tsx`

```tsx
﻿"use client";

import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { pnlData, cabangList } from "@/data/mockData";
import { formatRupiah, formatPercent } from "@/utils/format";

const reconData = [
  { id: "r1", cabang: "BSD", shift: "Pagi", kasir: "Andi", expectedCash: 12400000, actualCash: 12380000, diff: -20000, status: "ok" },
  { id: "r2", cabang: "Sudirman", shift: "Pagi", kasir: "Hana", expectedCash: 9800000, actualCash: 9800000, diff: 0, status: "ok" },
  { id: "r3", cabang: "Kemang", shift: "Pagi", kasir: "Joko", expectedCash: 8200000, actualCash: 8350000, diff: 150000, status: "warning" },
  { id: "r4", cabang: "Depok", shift: "Pagi", kasir: "Mira", expectedCash: 6100000, actualCash: 5900000, diff: -200000, status: "critical" },
  { id: "r5", cabang: "Bekasi", shift: "Pagi", kasir: "-", expectedCash: 0, actualCash: 0, diff: 0, status: "vacant" },
];

const cashflowData = [
  { month: "Jul", masuk: 162000000, keluar: 93960000, net: 68040000 },
  { month: "Agu", masuk: 175000000, keluar: 98875000, net: 76125000 },
  { month: "Sep", masuk: 168000000, keluar: 95928000, net: 72072000 },
  { month: "Okt", masuk: 182000000, keluar: 102816000, net: 79184000 },
  { month: "Nov", masuk: 195000000, keluar: 109395000, net: 85605000 },
  { month: "Des", masuk: 185200000, keluar: 103834000, net: 81366000 },
];

function FinancialTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold mb-2 text-slate-700 dark:text-slate-200">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-semibold">{formatRupiah(entry.value, true)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function Keuangan() {
  const [activeTab, setActiveTab] = useState<"pnl" | "cashflow" | "rekonsiliasi">("pnl");
  const [selectedMonth, setSelectedMonth] = useState("Des");

  const latestPnL = pnlData[pnlData.length - 1];
  const grossMarginPct = (latestPnL.grossProfit / latestPnL.revenue) * 100;
  const netMarginPct = (latestPnL.netProfit / latestPnL.revenue) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Keuangan</h2>
          <p className="text-sm text-slate-500 mt-0.5">P&L, Arus Kas, dan Rekonsiliasi Shift</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Export PDF</Button>
          <Button variant="outline" size="sm">Export Excel</Button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Revenue (Des)", value: formatRupiah(latestPnL.revenue, true), sub: "Semua cabang", color: "orange" },
          { label: "Gross Profit (Des)", value: formatRupiah(latestPnL.grossProfit, true), sub: `Margin ${formatPercent(grossMarginPct)}`, color: "emerald" },
          { label: "Net Profit (Des)", value: formatRupiah(latestPnL.netProfit, true), sub: `NPM ${formatPercent(netMarginPct)}`, color: "blue" },
          { label: "COGS (Des)", value: formatRupiah(latestPnL.cogs, true), sub: `${formatPercent((latestPnL.cogs / latestPnL.revenue) * 100)} dari revenue`, color: "red" },
        ].map(item => (
          <div key={item.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
            <p className="text-xs text-slate-500 mb-1">{item.label}</p>
            <p className={`text-xl font-bold text-${item.color}-600 dark:text-${item.color}-400`}>{item.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
        {([
          { key: "pnl", label: "ðŸ“Š P&L" },
          { key: "cashflow", label: "ðŸ’° Arus Kas" },
          { key: "rekonsiliasi", label: "ðŸ§¾ Rekonsiliasi" },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === tab.key ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "pnl" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* P&L Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tren P&L (6 Bulan)</h3>
              <Badge variant="info" size="sm">Julâ€“Des 2024</Badge>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={pnlData} margin={{ top: 0, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatRupiah(v, true)} width={58} />
                <Tooltip content={<FinancialTooltip />} />
                <Legend wrapperStyle={{ fontSize: "11px" }} iconType="circle" iconSize={8} />
                <Bar dataKey="revenue" name="Revenue" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="grossProfit" name="Gross Profit" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="netProfit" name="Net Profit" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* P&L Summary by Cabang */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Revenue per Cabang</h3>
            <div className="space-y-3">
              {cabangList.map((cabang) => {
                const share = (cabang.revenue / cabangList.reduce((s, c) => s + c.revenue, 0)) * 100;
                return (
                  <div key={cabang.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{cabang.name.replace("Cabang ", "")}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 ml-2">{formatRupiah(cabang.revenue, true)}</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full" style={{ width: `${share}%` }} />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{formatPercent(share)} dari total</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* P&L Detail Table */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Detail P&L Bulanan</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    {["Bulan", "Revenue", "COGS", "Gross Profit", "Gross Margin", "OpEx", "Net Profit", "NPM"].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {pnlData.map((row) => (
                    <tr key={row.month} className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${row.month === selectedMonth ? "bg-orange-50/50 dark:bg-orange-950/10" : ""}`} onClick={() => setSelectedMonth(row.month)}>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200">{row.month} 2024</td>
                      <td className="px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-200">{formatRupiah(row.revenue, true)}</td>
                      <td className="px-4 py-3 text-sm text-red-600 dark:text-red-400">{formatRupiah(row.cogs, true)}</td>
                      <td className="px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400 font-semibold">{formatRupiah(row.grossProfit, true)}</td>
                      <td className="px-4 py-3"><span className="text-sm font-bold text-emerald-600">{formatPercent((row.grossProfit / row.revenue) * 100)}</span></td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatRupiah(row.opex, true)}</td>
                      <td className="px-4 py-3 text-sm font-bold text-blue-600 dark:text-blue-400">{formatRupiah(row.netProfit, true)}</td>
                      <td className="px-4 py-3"><span className="text-sm font-bold text-blue-600">{formatPercent((row.netProfit / row.revenue) * 100)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "cashflow" && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Arus Kas â€” 6 Bulan Terakhir</h3>
            <Badge variant="success" size="sm">Net Positif</Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={cashflowData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="inGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="outGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatRupiah(v, true)} width={64} />
              <Tooltip content={<FinancialTooltip />} />
              <Legend wrapperStyle={{ fontSize: "11px" }} iconType="circle" iconSize={8} />
              <Area type="monotone" dataKey="masuk" name="Arus Masuk" stroke="#22c55e" strokeWidth={2} fill="url(#inGrad)" dot={false} />
              <Area type="monotone" dataKey="keluar" name="Arus Keluar" stroke="#ef4444" strokeWidth={2} fill="url(#outGrad)" dot={false} />
              <Area type="monotone" dataKey="net" name="Net Cash" stroke="#3b82f6" strokeWidth={2.5} fill="none" dot={false} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === "rekonsiliasi" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Total Rekonsiliasi", value: `${reconData.filter(r => r.status !== "vacant").length} shift`, icon: "ðŸ§¾", color: "blue" },
              { label: "OK / Selisih Minor", value: reconData.filter(r => r.status === "ok").length.toString(), icon: "âœ…", color: "emerald" },
              { label: "Perlu Perhatian", value: reconData.filter(r => r.status === "warning" || r.status === "critical").length.toString(), icon: "âš ï¸", color: "amber" },
            ].map(card => (
              <div key={card.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{card.icon}</span>
                  <div>
                    <p className={`text-xl font-bold text-${card.color}-600 dark:text-${card.color}-400`}>{card.value}</p>
                    <p className="text-xs text-slate-500">{card.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Rekonsiliasi Shift Hari Ini</h3>
              <span className="text-xs text-slate-500">22 Desember 2024</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {reconData.map((rec) => (
                <div key={rec.id} className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${
                  rec.status === "critical" ? "bg-red-50/50 dark:bg-red-950/10" :
                  rec.status === "warning" ? "bg-amber-50/50 dark:bg-amber-950/10" : ""
                }`}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    rec.status === "ok" ? "bg-emerald-500" :
                    rec.status === "warning" ? "bg-amber-500" :
                    rec.status === "critical" ? "bg-red-500" : "bg-slate-300"
                  }`} />
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{rec.cabang}</p>
                      <p className="text-xs text-slate-500">{rec.shift}</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-xs text-slate-500">Kasir</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{rec.kasir}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Diharapkan</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{formatRupiah(rec.expectedCash, true)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Aktual</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{formatRupiah(rec.actualCash, true)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Selisih</p>
                      <p className={`text-sm font-bold ${rec.diff > 0 ? "text-amber-600" : rec.diff < 0 ? "text-red-600" : "text-emerald-600"}`}>
                        {rec.diff === 0 ? "âœ… Pas" : `${rec.diff > 0 ? "+" : ""}${formatRupiah(rec.diff, true)}`}
                      </p>
                    </div>
                    <div className="flex items-center justify-end">
                      <Badge variant={rec.status === "ok" ? "success" : rec.status === "warning" ? "warning" : rec.status === "critical" ? "danger" : "neutral"}>
                        {rec.status === "ok" ? "OK" : rec.status === "warning" ? "Selisih" : rec.status === "critical" ? "Kritis" : "Tutup"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




```

---

### File: `apps/owner/_pages/MenuResep.tsx`

```tsx
﻿"use client";

import { useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { menuList } from "@/data/mockData";
import { formatRupiah, formatPercent } from "@/utils/format";

const bom: Record<string, { ingredient: string; qty: number; unit: string; cost: number }[]> = {
  "m1": [
    { ingredient: "Tepung Terigu Cakra", qty: 150, unit: "gr", cost: 1800 },
    { ingredient: "Telur Ayam", qty: 3, unit: "butir", cost: 6600 },
    { ingredient: "Minyak Goreng", qty: 50, unit: "ml", cost: 900 },
    { ingredient: "Daun Bawang", qty: 20, unit: "gr", cost: 400 },
    { ingredient: "Garam & Bumbu", qty: 10, unit: "gr", cost: 500 },
  ],
  "m2": [
    { ingredient: "Tepung Terigu Segitiga", qty: 200, unit: "gr", cost: 2400 },
    { ingredient: "Keju Kraft Slice", qty: 3, unit: "pcs", cost: 25500 },
    { ingredient: "Meses Coklat", qty: 30, unit: "gr", cost: 1350 },
    { ingredient: "Margarin Blue Band", qty: 40, unit: "gr", cost: 1200 },
    { ingredient: "Gula Pasir", qty: 50, unit: "gr", cost: 700 },
    { ingredient: "Susu Kental Manis", qty: 30, unit: "ml", cost: 750 },
  ],
};

const engineeringData = menuList.map(m => ({
  name: m.name,
  x: m.soldToday,
  y: m.margin,
  revenue: m.revenue,
  status: m.status,
  category: m.category,
}));

const avgSold = engineeringData.reduce((sum, m) => sum + m.x, 0) / engineeringData.length;
const avgMargin = engineeringData.reduce((sum, m) => sum + m.y, 0) / engineeringData.length;

const statusColors: Record<string, string> = {
  star: "#22c55e",
  "plow-horse": "#3b82f6",
  puzzle: "#f59e0b",
  dog: "#ef4444",
};

function EngineeringTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl max-w-[200px]">
        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-1">{d.name}</p>
        <p className="text-xs text-slate-500">Terjual: <span className="font-semibold text-slate-700 dark:text-slate-200">{d.x} pcs</span></p>
        <p className="text-xs text-slate-500">Margin: <span className="font-semibold text-slate-700 dark:text-slate-200">{d.y.toFixed(1)}%</span></p>
        <p className="text-xs text-slate-500">Revenue: <span className="font-semibold text-slate-700 dark:text-slate-200">{formatRupiah(d.revenue, true)}</span></p>
      </div>
    );
  }
  return null;
}

export default function MenuResep() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "engineering">("list");

  const categories = ["all", ...Array.from(new Set(menuList.map(m => m.category)))];

  const filtered = menuList.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || m.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const selectedItem = menuList.find(m => m.id === selectedMenu);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Menu & Resep (BOM)</h2>
          <p className="text-sm text-slate-500 mt-0.5">{menuList.length} menu aktif Â· Bill of Materials</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Export Menu</Button>
          <Button variant="primary" size="sm" icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }>Tambah Menu</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
        {(["list", "engineering"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === tab ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500"
            }`}
          >
            {tab === "list" ? "ðŸ“‹ Daftar Menu" : "ðŸ“Š Menu Engineering"}
          </button>
        ))}
      </div>

      {activeTab === "list" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Menu List */}
          <div className="lg:col-span-2 space-y-3">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Cari menu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
              </div>
              <div className="flex items-center gap-1 overflow-x-auto">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      categoryFilter === cat
                        ? "bg-orange-500 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {cat === "all" ? "Semua" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    {["Menu", "Kategori", "Harga", "HPP", "Margin", "Terjual", "Status", ""].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map((menu) => (
                    <tr
                      key={menu.id}
                      onClick={() => setSelectedMenu(menu.id === selectedMenu ? null : menu.id)}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer ${selectedMenu === menu.id ? "bg-orange-50/50 dark:bg-orange-950/10" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{menu.name}</p>
                        <p className="text-xs text-slate-400">{menu.stock === "low" ? "âš  Stok rendah" : ""}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="neutral" size="sm">{menu.category}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200">{formatRupiah(menu.price)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatRupiah(menu.cost)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold ${menu.margin >= 68 ? "text-emerald-600" : menu.margin >= 62 ? "text-amber-600" : "text-red-500"}`}>
                          {formatPercent(menu.margin)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{menu.soldToday}</td>
                      <td className="px-4 py-3">
                        <Badge variant={menu.status === "star" ? "success" : menu.status === "plow-horse" ? "info" : menu.status === "puzzle" ? "warning" : "neutral"}>
                          {menu.status === "star" ? "â­ Star" : menu.status === "plow-horse" ? "ðŸ´ Plough" : menu.status === "puzzle" ? "ðŸ§© Puzzle" : "ðŸ• Dog"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-orange-500 hover:text-orange-600">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recipe Detail Panel */}
          <div className="space-y-4">
            {selectedItem ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedItem.name}</h3>
                    <Badge variant="neutral" size="sm" className="mt-1">{selectedItem.category}</Badge>
                  </div>
                  <button onClick={() => setSelectedMenu(null)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Cost Summary */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2.5 text-center">
                    <p className="text-xs text-slate-500 mb-0.5">Harga Jual</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{formatRupiah(selectedItem.price)}</p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-2.5 text-center">
                    <p className="text-xs text-amber-600 mb-0.5">HPP</p>
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400">{formatRupiah(selectedItem.cost)}</p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-2.5 text-center">
                    <p className="text-xs text-emerald-600 mb-0.5">Margin</p>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{formatPercent(selectedItem.margin)}</p>
                  </div>
                </div>

                {/* BOM Tree */}
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">ðŸŒ³ Bill of Materials</h4>
                {bom[selectedItem.id] ? (
                  <div className="space-y-2">
                    {bom[selectedItem.id].map((ing, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{ing.ingredient}</p>
                          <p className="text-xs text-slate-400">{ing.qty} {ing.unit}</p>
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">{formatRupiah(ing.cost)}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Total HPP</span>
                      <span className="text-sm font-bold text-orange-600">{formatRupiah(bom[selectedItem.id].reduce((sum, i) => sum + i.cost, 0))}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <p className="text-xs">Resep belum diinput</p>
                    <Button variant="outline" size="sm" className="mt-3">+ Tambah Resep</Button>
                  </div>
                )}

                <Button variant="outline" size="sm" className="w-full mt-4">âœï¸ Edit Resep</Button>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 text-center">
                <div className="text-3xl mb-3">ðŸ“‹</div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Pilih menu untuk melihat resep</p>
                <p className="text-xs text-slate-400 mt-1">Klik baris menu di sebelah kiri</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "engineering" && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Menu Engineering Matrix</h3>
            <p className="text-xs text-slate-500 mt-0.5">Volume penjualan (X) vs Margin (Y) â€” klik titik untuk detail</p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            {[
              { label: "â­ Star (margin tinggi, laku)", color: "#22c55e" },
              { label: "ðŸ´ Plow-horse (margin rendah, laku)", color: "#3b82f6" },
              { label: "ðŸ§© Puzzle (margin tinggi, tidak laku)", color: "#f59e0b" },
              { label: "ðŸ• Dog (margin rendah, tidak laku)", color: "#ef4444" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={340}>
            <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                type="number"
                dataKey="x"
                name="Volume"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                label={{ value: "Volume Terjual (pcs/hari)", position: "insideBottom", offset: -5, fontSize: 11, fill: "#94a3b8" }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Margin"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
                label={{ value: "Gross Margin (%)", angle: -90, position: "insideLeft", fontSize: 11, fill: "#94a3b8" }}
              />
              <Tooltip content={<EngineeringTooltip />} />
              <ReferenceLine x={avgSold} stroke="#cbd5e1" strokeDasharray="4 4" label={{ value: "Avg", position: "insideTopRight", fontSize: 10, fill: "#94a3b8" }} />
              <ReferenceLine y={avgMargin} stroke="#cbd5e1" strokeDasharray="4 4" label={{ value: "Avg", position: "insideTopLeft", fontSize: 10, fill: "#94a3b8" }} />
              <Scatter
                data={engineeringData}
                fill="#f97316"
                shape={(props: any) => {
                  const { cx, cy, payload } = props;
                  const color = statusColors[payload.status] || "#f97316";
                  return (
                    <circle cx={cx} cy={cy} r={8} fill={color} fillOpacity={0.85} stroke="white" strokeWidth={2} />
                  );
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>

          {/* Quadrant Labels */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { label: "â­ Stars", desc: "Margin tinggi, laku â€” pertahankan & promosikan", color: "emerald", count: engineeringData.filter(m => m.status === "star").length },
              { label: "ðŸ§© Puzzles", desc: "Margin tinggi, kurang laku â€” perlu promosi lebih", color: "amber", count: engineeringData.filter(m => m.status === "puzzle").length },
              { label: "ðŸ´ Plow-horses", desc: "Laku tapi margin tipis â€” optimalkan HPP", color: "blue", count: engineeringData.filter(m => m.status === "plow-horse").length },
              { label: "ðŸ• Dogs", desc: "Tidak laku & margin rendah â€” pertimbangkan hapus", color: "red", count: engineeringData.filter(m => m.status === "dog").length },
            ].map(q => (
              <div key={q.label} className={`bg-${q.color}-50 dark:bg-${q.color}-950/10 border border-${q.color}-200 dark:border-${q.color}-900/30 rounded-lg p-3`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{q.label}</span>
                  <Badge variant={q.color === "emerald" ? "success" : q.color === "amber" ? "warning" : q.color === "blue" ? "info" : "danger"} size="sm">{q.count} menu</Badge>
                </div>
                <p className="text-xs text-slate-500">{q.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}




```

---

### File: `apps/owner/_pages/Pengaturan.tsx`

```tsx
﻿"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { tenantData } from "@/data/mockData";

const auditLog = [
  { id: "al1", user: "Bambang Wijaya", action: "Menyetujui PO #2841", module: "Persetujuan", timestamp: "22 Des 2024, 10:15", ip: "192.168.1.101" },
  { id: "al2", user: "Andi (BSD)", action: "Update harga menu Martabak Spesial", module: "Menu", timestamp: "22 Des 2024, 09:42", ip: "192.168.2.15" },
  { id: "al3", user: "Sari (Kemang)", action: "Input waste log adonan 2.1kg", module: "Persediaan", timestamp: "22 Des 2024, 09:10", ip: "192.168.3.8" },
  { id: "al4", user: "Bambang Wijaya", action: "Login ke Owner Dashboard", module: "Auth", timestamp: "22 Des 2024, 08:45", ip: "192.168.1.101" },
  { id: "al5", user: "Admin", action: "Tambah cabang baru: Bogor", module: "Cabang", timestamp: "21 Des 2024, 17:30", ip: "10.0.0.5" },
  { id: "al6", user: "Budi (BSD)", action: "Cetak laporan shift sore", module: "Keuangan", timestamp: "21 Des 2024, 16:00", ip: "192.168.2.22" },
];

const users = [
  { id: "u1", name: "Bambang Wijaya", email: "bambang@masbambang.id", role: "Owner", cabang: "Semua", status: "active" },
  { id: "u2", name: "Andi Pratama", email: "andi@masbambang.id", role: "Manajer Cabang", cabang: "BSD", status: "active" },
  { id: "u3", name: "Sari Dewi", email: "sari@masbambang.id", role: "Kasir", cabang: "Kemang", status: "active" },
  { id: "u4", name: "Budi Santoso", email: "budi@masbambang.id", role: "Kasir", cabang: "BSD", status: "active" },
  { id: "u5", name: "Hana Sari", email: "hana@masbambang.id", role: "Kasir", cabang: "Sudirman", status: "inactive" },
];

const brandColors = [
  "#f97316", "#ef4444", "#8b5cf6", "#3b82f6", "#22c55e", "#06b6d4", "#eab308", "#ec4899"
];

export default function Pengaturan() {
  const [activeTab, setActiveTab] = useState<"branding" | "users" | "payment" | "audit">("branding");
  const [primaryColor, setPrimaryColor] = useState(tenantData.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(tenantData.secondaryColor);
  const [businessName, setBusinessName] = useState(tenantData.brandName);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Pengaturan</h2>
          <p className="text-sm text-slate-500 mt-0.5">Konfigurasi tenant, pengguna, dan sistem</p>
        </div>
        <Button variant="primary" size="sm">Simpan Semua Perubahan</Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {([
          { key: "branding", label: "ðŸŽ¨ Branding" },
          { key: "users", label: "ðŸ‘¥ Pengguna" },
          { key: "payment", label: "ðŸ’³ Pajak & Pembayaran" },
          { key: "audit", label: "ðŸ“‹ Audit Log" },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              activeTab === tab.key
                ? "bg-orange-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "branding" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Brand Settings */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Identitas Bisnis</h3>

            {/* Logo Upload */}
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">Logo Bisnis</label>
              <div className="mt-2 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-3xl shadow-md">
                  {tenantData.logo}
                </div>
                <div className="flex-1">
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center hover:border-orange-300 dark:hover:border-orange-700 transition-colors cursor-pointer">
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Klik atau drag logo di sini</p>
                    <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, SVG max 2MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Name */}
            <Input
              label="Nama Bisnis"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />

            {/* Primary Color */}
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-2">Warna Utama (Primary)</label>
              <div className="flex items-center gap-2 flex-wrap">
                {brandColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setPrimaryColor(color)}
                    className={`w-8 h-8 rounded-lg transition-all ${primaryColor === color ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : "hover:scale-105"}`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
                <div className="flex items-center gap-2 ml-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0"
                  />
                  <span className="text-xs text-slate-500 font-mono">{primaryColor}</span>
                </div>
              </div>
            </div>

            {/* Secondary Color */}
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-2">Warna Sekunder</label>
              <div className="flex items-center gap-2 flex-wrap">
                {brandColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSecondaryColor(color)}
                    className={`w-8 h-8 rounded-lg transition-all ${secondaryColor === color ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : "hover:scale-105"}`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
                <div className="flex items-center gap-2 ml-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0"
                  />
                  <span className="text-xs text-slate-500 font-mono">{secondaryColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Preview Branding</h3>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Preview Header */}
              <div className="px-4 py-3 text-white" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-base">
                    {tenantData.logo}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{businessName}</p>
                    <p className="text-xs opacity-80">Owner Dashboard</p>
                  </div>
                </div>
              </div>
              {/* Preview Content */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Dashboard aktif</span>
                </div>
                <div
                  className="w-full py-2 rounded-lg text-white text-center text-xs font-semibold"
                  style={{ backgroundColor: primaryColor }}
                >
                  Tombol Aksi Utama
                </div>
                <div
                  className="mt-2 w-full py-2 rounded-lg text-center text-xs font-semibold border"
                  style={{ color: primaryColor, borderColor: primaryColor, backgroundColor: `${primaryColor}15` }}
                >
                  Tombol Sekunder
                </div>
                <div className="mt-3 p-2 rounded-lg border-l-4" style={{ borderLeftColor: secondaryColor, backgroundColor: `${secondaryColor}10` }}>
                  <p className="text-xs font-medium" style={{ color: secondaryColor }}>ðŸ’¡ AI Insight Preview</p>
                  <p className="text-xs text-slate-500 mt-0.5">Warna aksen untuk notifikasi & badge</p>
                </div>
              </div>
            </div>
            <Button variant="primary" className="w-full mt-4">Terapkan Branding</Button>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">{users.length} pengguna terdaftar</p>
            <Button variant="primary" size="sm" icon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            }>Undang Pengguna</Button>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {["Nama", "Email", "Role", "Cabang", "Status", ""].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-400 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-amber-200 flex items-center justify-center text-xs font-bold text-orange-800">
                          {user.name.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={user.role === "Owner" ? "brand" : user.role === "Manajer Cabang" ? "info" : "neutral"} size="sm">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{user.cabang}</td>
                    <td className="px-4 py-3">
                      <Badge variant={user.status === "active" ? "success" : "neutral"}>
                        {user.status === "active" ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">Edit</Button>
                        {user.role !== "Owner" && <Button variant="ghost" size="sm">Hapus</Button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "payment" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Konfigurasi Pajak</h3>
            <Input label="PPN (%)" defaultValue="11" hint="Pajak Pertambahan Nilai sesuai regulasi Indonesia" />
            <Input label="Service Charge (%)" defaultValue="10" hint="Biaya layanan (opsional)" />
            <Input label="NPWP Bisnis" defaultValue="01.234.567.8-901.000" />
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Tampilkan pajak di struk</p>
                <p className="text-xs text-slate-500">Rincian pajak akan muncul di setiap struk</p>
              </div>
              <div className="w-11 h-6 bg-orange-500 rounded-full relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Metode Pembayaran</h3>
            {[
              { name: "Cash", icon: "ðŸ’µ", enabled: true },
              { name: "QRIS / GoPay / OVO", icon: "ðŸ“±", enabled: true },
              { name: "Transfer Bank", icon: "ðŸ¦", enabled: true },
              { name: "Kartu Debit/Kredit", icon: "ðŸ’³", enabled: false },
              { name: "GrabFood Pay", icon: "ðŸš—", enabled: true },
              { name: "ShopeeFood Pay", icon: "ðŸ›’", enabled: true },
            ].map(pm => (
              <div key={pm.name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span>{pm.icon}</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{pm.name}</span>
                </div>
                <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${pm.enabled ? "bg-orange-500" : "bg-slate-300 dark:bg-slate-600"}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${pm.enabled ? "right-0.5" : "left-0.5"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "audit" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">Log aktivitas sistem (30 hari terakhir)</p>
            <Button variant="outline" size="sm">Export Log</Button>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    {["Pengguna", "Aksi", "Modul", "Waktu", "IP Address"].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {auditLog.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center text-xs font-bold text-orange-700 dark:text-orange-400 flex-shrink-0">
                            {log.user.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{log.user}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{log.action}</td>
                      <td className="px-4 py-3">
                        <Badge variant="neutral" size="sm">{log.module}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-400">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




```

---

### File: `apps/owner/_pages/Penjualan.tsx`

```tsx
﻿"use client";

import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { salesByChannel, salesByTime, menuList } from "@/data/mockData";
import { formatRupiah, formatNumber } from "@/utils/format";

const CHANNEL_COLORS = ["#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"];

const repeatCustomers = [
  { name: "Pelanggan Baru", value: 38, color: "#3b82f6" },
  { name: "Pelanggan Lama", value: 62, color: "#f97316" },
];

const topCustomers = [
  { rank: 1, name: "Budi Santoso", orders: 28, spend: 1260000, lastVisit: "Kemarin" },
  { rank: 2, name: "Ani Wijaya", orders: 24, spend: 1080000, lastVisit: "2 hari lalu" },
  { rank: 3, name: "Sari Pertiwi", orders: 21, spend: 945000, lastVisit: "Hari ini" },
  { rank: 4, name: "Eko Nugroho", orders: 19, spend: 855000, lastVisit: "3 hari lalu" },
  { rank: 5, name: "Dewi Rahayu", orders: 17, spend: 765000, lastVisit: "Kemarin" },
];

const weeklyTrend = [
  { day: "Sen", dineIn: 320000, online: 480000 },
  { day: "Sel", dineIn: 350000, online: 520000 },
  { day: "Rab", dineIn: 280000, online: 420000 },
  { day: "Kam", dineIn: 410000, online: 590000 },
  { day: "Jum", dineIn: 520000, online: 780000 },
  { day: "Sab", dineIn: 680000, online: 920000 },
  { day: "Min", dineIn: 620000, online: 850000 },
];

function SalesTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold mb-2 text-slate-700 dark:text-slate-200">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-semibold">{formatRupiah(entry.value, true)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function TimeTip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold mb-1 text-slate-700 dark:text-slate-200">Pukul {label}</p>
        <p className="text-xs"><span className="text-slate-500">Order:</span> <span className="font-bold">{payload[0].value}</span></p>
      </div>
    );
  }
  return null;
}

function ChannelTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{d.channel}</p>
        <p className="text-xs text-slate-500">Share: <span className="font-semibold">{d.value}%</span></p>
        <p className="text-xs text-slate-500">Revenue: <span className="font-semibold">{formatRupiah(d.revenue, true)}</span></p>
      </div>
    );
  }
  return null;
}

export default function Penjualan() {
  const [period, setPeriod] = useState<"hari" | "minggu" | "bulan">("minggu");

  const totalRevenue = salesByChannel.reduce((s, c) => s + c.revenue, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Penjualan & Analitik</h2>
          <p className="text-sm text-slate-500 mt-0.5">Analisis mendalam semua channel penjualan</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {(["hari", "minggu", "bulan"] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                  period === p ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500"
                }`}
              >
                {p === "hari" ? "Hari Ini" : p === "minggu" ? "Minggu Ini" : "Bulan Ini"}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm">Export</Button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Revenue", value: formatRupiah(totalRevenue, true), icon: "ðŸ’°", trend: "+8.4%" },
          { label: "Total Order", value: formatNumber(5140), icon: "ðŸ§¾", trend: "+12.3%" },
          { label: "Repeat Rate", value: "62%", icon: "ðŸ”„", trend: "+3.1%" },
          { label: "Avg Order Value", value: formatRupiah(36040), icon: "ðŸ“Š", trend: "+3.2%" },
        ].map(card => (
          <div key={card.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{card.icon}</span>
              <Badge variant="success" size="sm">{card.trend}</Badge>
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{card.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tren Penjualan per Channel</h3>
            <Badge variant="info" size="sm">Minggu ini</Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyTrend} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="dineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="onlineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatRupiah(v, true)} width={58} />
              <Tooltip content={<SalesTooltip />} />
              <Legend wrapperStyle={{ fontSize: "11px" }} iconType="circle" iconSize={8} />
              <Area type="monotone" dataKey="dineIn" name="Dine-in" stroke="#f97316" strokeWidth={2} fill="url(#dineGrad)" dot={false} />
              <Area type="monotone" dataKey="online" name="Online" stroke="#3b82f6" strokeWidth={2} fill="url(#onlineGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Channel Breakdown Pie */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Breakdown Channel</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={salesByChannel}
                dataKey="value"
                nameKey="channel"
                cx="50%"
                cy="50%"
                outerRadius={60}
                innerRadius={36}
              >
                {salesByChannel.map((_, i) => (
                  <Cell key={i} fill={CHANNEL_COLORS[i % CHANNEL_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChannelTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {salesByChannel.map((c, i) => (
              <div key={c.channel} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHANNEL_COLORS[i] }} />
                  <span className="text-xs text-slate-600 dark:text-slate-400">{c.channel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{c.value}%</span>
                  <span className="text-xs text-slate-400">{formatRupiah(c.revenue, true)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hourly Order Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Volume Order per Jam</h3>
            <Badge variant="neutral" size="sm">Hari Ini</Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={salesByTime} margin={{ top: 0, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <Tooltip content={<TimeTip />} />
              <Bar dataKey="orders" name="Order" radius={[4, 4, 0, 0]} maxBarSize={36}>
                {salesByTime.map((item, i) => (
                  <Cell key={i} fill={item.orders >= 600 ? "#f97316" : item.orders >= 400 ? "#fb923c" : "#fed7aa"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Menu Revenue */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Top Menu by Revenue</h3>
            <Button variant="ghost" size="sm">Lihat Semua</Button>
          </div>
          <div className="space-y-3">
            {menuList.slice(0, 6).map((menu, i) => {
              const maxRevenue = menuList[0].revenue;
              const pct = (menu.revenue / maxRevenue) * 100;
              return (
                <div key={menu.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-slate-400 w-5">{i + 1}</span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{menu.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 ml-2 flex-shrink-0">{formatRupiah(menu.revenue, true)}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ml-7">
                    <div className="h-full bg-orange-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Top Pelanggan & Repeat Rate</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Repeat rate bulan ini: <span className="font-semibold text-orange-600">62%</span> â€” â†‘3.1% dari bulan lalu
            </p>
          </div>
          <div className="flex items-center gap-2">
            {repeatCustomers.map(c => (
              <div key={c.name} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-xs text-slate-500">{c.name} ({c.value}%)</span>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                {["Rank", "Nama", "Total Order", "Total Spend", "Terakhir Visit", ""].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {topCustomers.map((cust) => (
                <tr key={cust.rank} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${cust.rank === 1 ? "bg-amber-400" : cust.rank === 2 ? "bg-slate-400" : cust.rank === 3 ? "bg-orange-400" : "bg-slate-300"}`}>
                      {cust.rank <= 3 ? ["ðŸ¥‡", "ðŸ¥ˆ", "ðŸ¥‰"][cust.rank - 1] : cust.rank}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-amber-200 flex items-center justify-center text-xs font-bold text-orange-800">
                        {cust.name.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{cust.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{cust.orders}x</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200">{formatRupiah(cust.spend)}</td>
                  <td className="px-4 py-3"><Badge variant="neutral" size="sm">{cust.lastVisit}</Badge></td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-orange-600 dark:text-orange-400 font-medium hover:underline">Detail</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}




```

---

### File: `apps/owner/_pages/Persediaan.tsx`

```tsx
﻿"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { inventoryItems } from "@/data/mockData";
import { formatRupiah } from "@/utils/format";

const wasteLog = [
  { date: "22 Des", item: "Adonan Martabak", qty: 2.3, unit: "kg", reason: "Tidak habis terjual", cost: 27600, cabang: "BSD" },
  { date: "22 Des", item: "Telur Ayam", qty: 12, unit: "butir", reason: "Pecah saat penyimpanan", cost: 26400, cabang: "Kemang" },
  { date: "21 Des", item: "Tepung Terigu", qty: 1.8, unit: "kg", reason: "Kadaluarsa", cost: 21600, cabang: "Depok" },
  { date: "21 Des", item: "Keju Kraft", qty: 5, unit: "pcs", reason: "Tidak habis / expired", cost: 42500, cabang: "Sudirman" },
  { date: "20 Des", item: "Minyak Goreng", qty: 3, unit: "liter", reason: "Kualitas menurun", cost: 54000, cabang: "Bekasi" },
];

const wasteChart = [
  { date: "17 Des", waste: 125000 },
  { date: "18 Des", waste: 98000 },
  { date: "19 Des", waste: 145000 },
  { date: "20 Des", waste: 187000 },
  { date: "21 Des", waste: 112000 },
  { date: "22 Des", waste: 96500 },
];

function StockBadge({ stock, min }: { stock: number; min: number }) {
  const ratio = stock / min;
  if (ratio < 0.5) return <Badge variant="danger">Kritis</Badge>;
  if (ratio < 1) return <Badge variant="warning">Rendah</Badge>;
  return <Badge variant="success">Normal</Badge>;
}

export default function Persediaan() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState<"stock" | "waste">("stock");

  const filtered = inventoryItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const ratio = item.stock / item.minStock;
    const matchStatus =
      filterStatus === "all" ? true :
      filterStatus === "critical" ? ratio < 0.5 :
      filterStatus === "low" ? ratio < 1 :
      ratio >= 1;
    return matchSearch && matchStatus;
  });

  const criticalCount = inventoryItems.filter(i => i.stock / i.minStock < 0.5).length;
  const lowCount = inventoryItems.filter(i => i.stock / i.minStock >= 0.5 && i.stock / i.minStock < 1).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Persediaan (Inventory)</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            <span className="text-red-600 font-semibold">{criticalCount} kritis</span> Â· <span className="text-amber-600 font-semibold">{lowCount} rendah</span> Â· {inventoryItems.length} total item
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Export</Button>
          <Button variant="primary" size="sm" icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }>Buat PO</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Item", value: inventoryItems.length.toString(), icon: "ðŸ“¦", color: "blue" },
          { label: "Item Kritis", value: criticalCount.toString(), icon: "ðŸš¨", color: "red" },
          { label: "Item Rendah", value: lowCount.toString(), icon: "âš ï¸", color: "amber" },
          { label: "Total Waste Hari Ini", value: formatRupiah(wasteLog.filter(w => w.date === "22 Des").reduce((s, w) => s + w.cost, 0), true), icon: "ðŸ—‘ï¸", color: "slate" },
        ].map(card => (
          <div key={card.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{card.icon}</span>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{card.value}</p>
                <p className="text-xs text-slate-500">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
        {(["stock", "waste"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === tab ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500"
            }`}
          >
            {tab === "stock" ? "ðŸ“¦ Stok Bahan" : "ðŸ—‘ï¸ Waste Log"}
          </button>
        ))}
      </div>

      {activeTab === "stock" && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Cari bahan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
            <div className="flex items-center gap-1">
              {[
                { key: "all", label: "Semua" },
                { key: "critical", label: "ðŸš¨ Kritis" },
                { key: "low", label: "âš ï¸ Rendah" },
                { key: "ok", label: "âœ… Normal" },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilterStatus(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterStatus === f.key
                      ? "bg-orange-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    {["Bahan Baku", "Kategori", "Cabang", "Stok Saat Ini", "Min. Stok", "Status", "Harga/Unit", "Supplier", ""].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map((item) => {
                    const ratio = item.stock / item.minStock;
                    const isLow = ratio < 1;
                    return (
                      <tr key={item.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${ratio < 0.5 ? "bg-red-50/30 dark:bg-red-950/5" : ratio < 1 ? "bg-amber-50/30 dark:bg-amber-950/5" : ""}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {ratio < 0.5 && <span className="text-red-500 text-sm">ðŸš¨</span>}
                            {ratio >= 0.5 && ratio < 1 && <span className="text-amber-500 text-sm">âš ï¸</span>}
                            {ratio >= 1 && <span className="text-emerald-500 text-sm">âœ…</span>}
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3"><Badge variant="neutral" size="sm">{item.category}</Badge></td>
                        <td className="px-4 py-3 text-xs text-slate-500">{item.cabang}</td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${isLow ? "text-red-600 dark:text-red-400" : "text-slate-800 dark:text-slate-200"}`}>
                                {item.stock} {item.unit}
                              </span>
                            </div>
                            <div className="mt-1 h-1.5 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${ratio < 0.5 ? "bg-red-400" : ratio < 1 ? "bg-amber-400" : "bg-emerald-400"}`}
                                style={{ width: `${Math.min(ratio * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">{item.minStock} {item.unit}</td>
                        <td className="px-4 py-3"><StockBadge stock={item.stock} min={item.minStock} /></td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatRupiah(item.cost)}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{item.supplier}</td>
                        <td className="px-4 py-3">
                          <Button variant="outline" size="sm">Buat PO</Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "waste" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Log Waste Terbaru</h3>
                <Button variant="outline" size="sm">Export</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      {["Tanggal", "Bahan", "Qty", "Penyebab", "Kerugian", "Cabang"].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-slate-400 px-3 py-2.5 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {wasteLog.map((log, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-3 py-2.5 text-xs text-slate-500">{log.date}</td>
                        <td className="px-3 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200">{log.item}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400">{log.qty} {log.unit}</td>
                        <td className="px-3 py-2.5 text-xs text-slate-500">{log.reason}</td>
                        <td className="px-3 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400">{formatRupiah(log.cost)}</td>
                        <td className="px-3 py-2.5"><Badge variant="neutral" size="sm">{log.cabang}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Tren Waste 7 Hari</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={wasteChart} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatRupiah(v, true)} width={52} />
                <Tooltip formatter={(v: any) => [formatRupiah(Number(v)), "Waste"]} />
                <Bar dataKey="waste" fill="#f87171" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/30">
              <p className="text-xs font-semibold text-red-700 dark:text-red-400">Total Waste Minggu Ini</p>
              <p className="text-lg font-bold text-red-800 dark:text-red-300 mt-0.5">
                {formatRupiah(wasteChart.reduce((s, w) => s + w.waste, 0), true)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




```

---

### File: `apps/owner/_pages/Persetujuan.tsx`

```tsx
﻿"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { approvalsList } from "@/data/mockData";
import { formatRupiah } from "@/utils/format";

const typeConfig: Record<string, { label: string; icon: string; color: "info" | "warning" | "danger" | "neutral" }> = {
  purchase_order: { label: "Purchase Order", icon: "ðŸ“¦", color: "info" },
  discount: { label: "Diskon", icon: "ðŸ·ï¸", color: "warning" },
  refund: { label: "Refund", icon: "â†©ï¸", color: "danger" },
  transfer: { label: "Transfer", icon: "ðŸ”„", color: "neutral" },
};

const priorityConfig: Record<string, { label: string; variant: "danger" | "warning" | "info" | "neutral" }> = {
  critical: { label: "Kritis", variant: "danger" },
  high: { label: "Tinggi", variant: "warning" },
  medium: { label: "Sedang", variant: "info" },
  low: { label: "Rendah", variant: "neutral" },
};

export default function Persetujuan() {
  const [filter, setFilter] = useState("all");
  const [selectedApproval, setSelectedApproval] = useState<string | null>(null);
  const [approvedList, setApprovedList] = useState<string[]>([]);
  const [rejectedList, setRejectedList] = useState<string[]>([]);

  const filtered = approvalsList.filter(a => {
    if (filter === "all") return true;
    if (filter === "pending") return a.status === "pending" && !approvedList.includes(a.id) && !rejectedList.includes(a.id);
    if (filter === "approved") return approvedList.includes(a.id);
    if (filter === "rejected") return rejectedList.includes(a.id);
    return a.type === filter;
  });

  const selectedItem = approvalsList.find(a => a.id === selectedApproval);
  const pendingCount = approvalsList.filter(a => a.status === "pending" && !approvedList.includes(a.id) && !rejectedList.includes(a.id)).length;

  function handleApprove(id: string) {
    setApprovedList(prev => [...prev, id]);
    setSelectedApproval(null);
  }

  function handleReject(id: string) {
    setRejectedList(prev => [...prev, id]);
    setSelectedApproval(null);
  }

  function getStatus(id: string, originalStatus: string) {
    if (approvedList.includes(id)) return "approved";
    if (rejectedList.includes(id)) return "rejected";
    return originalStatus;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Persetujuan (Approvals)</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            <span className="text-red-600 font-semibold">{pendingCount} menunggu</span> persetujuan Anda
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">History</Button>
          <Button variant="primary" size="sm">Setujui Semua PO</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Menunggu", value: pendingCount, icon: "â³", color: "amber" },
          { label: "Disetujui", value: approvedList.length, icon: "âœ…", color: "emerald" },
          { label: "Ditolak", value: rejectedList.length, icon: "âŒ", color: "red" },
          { label: "Total Nilai", value: formatRupiah(approvalsList.filter(a => a.status === "pending").reduce((s, a) => s + a.amount, 0), true), icon: "ðŸ’°", color: "blue" },
        ].map(card => (
          <div key={card.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{card.icon}</span>
            </div>
            <p className={`text-xl font-bold text-${card.color}-600 dark:text-${card.color}-400`}>{card.value}</p>
            <p className="text-xs text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {[
          { key: "all", label: "Semua" },
          { key: "pending", label: `â³ Pending (${pendingCount})` },
          { key: "purchase_order", label: "ðŸ“¦ Purchase Order" },
          { key: "discount", label: "ðŸ·ï¸ Diskon" },
          { key: "refund", label: "â†©ï¸ Refund" },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filter === f.key
                ? "bg-orange-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Approval List */}
        <div className={`space-y-2 ${selectedItem ? "lg:col-span-2" : "lg:col-span-3"}`}>
          {filtered.length === 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
              <div className="text-4xl mb-3">âœ…</div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Semua approval sudah diproses!</p>
              <p className="text-xs text-slate-400 mt-1">Tidak ada yang perlu ditindaklanjuti.</p>
            </div>
          )}
          {filtered.map((approval) => {
            const type = typeConfig[approval.type] || typeConfig.purchase_order;
            const priority = priorityConfig[approval.priority];
            const currentStatus = getStatus(approval.id, approval.status);
            const isSelected = selectedApproval === approval.id;

            return (
              <div
                key={approval.id}
                onClick={() => setSelectedApproval(isSelected ? null : approval.id)}
                className={`bg-white dark:bg-slate-900 rounded-xl border shadow-sm p-4 cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? "border-orange-300 dark:border-orange-700 ring-1 ring-orange-200 dark:ring-orange-900" :
                  "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-${type.color === "info" ? "blue" : type.color === "warning" ? "amber" : type.color === "danger" ? "red" : "slate"}-100 dark:bg-slate-800`}>
                    {type.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">{approval.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{approval.requestedBy} Â· {approval.cabang}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{approval.requestedAt}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{formatRupiah(approval.amount)}</p>
                        <Badge variant={priority.variant} size="sm">{priority.label}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {currentStatus === "pending" && (
                        <>
                          <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); handleApprove(approval.id); }}>âœ… Setujui</Button>
                          <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); handleReject(approval.id); }}>âŒ Tolak</Button>
                          <button className="text-xs text-orange-600 dark:text-orange-400 font-medium ml-auto hover:underline">Detail</button>
                        </>
                      )}
                      {currentStatus === "approved" && <Badge variant="success">âœ… Disetujui</Badge>}
                      {currentStatus === "rejected" && <Badge variant="danger">âŒ Ditolak</Badge>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Panel */}
        {selectedItem && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Detail Approval</h3>
              <button onClick={() => setSelectedApproval(null)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500">Judul</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{selectedItem.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500">Diminta oleh</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5">{selectedItem.requestedBy}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Cabang</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5">{selectedItem.cabang}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Tipe</p>
                  <Badge variant={typeConfig[selectedItem.type]?.color || "neutral"} size="sm" className="mt-0.5">
                    {typeConfig[selectedItem.type]?.label || selectedItem.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Prioritas</p>
                  <Badge variant={priorityConfig[selectedItem.priority]?.variant} size="sm" className="mt-0.5">
                    {priorityConfig[selectedItem.priority]?.label}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Nilai</p>
                  <p className="text-xl font-bold text-orange-600 mt-0.5">{formatRupiah(selectedItem.amount)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Waktu Request</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5">{selectedItem.requestedAt}</p>
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Catatan</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Permintaan ini diajukan karena stok menipis dan diperlukan untuk operasional harian. Mohon segera ditindaklanjuti.
                </p>
              </div>
              {getStatus(selectedItem.id, selectedItem.status) === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button variant="primary" className="flex-1" onClick={() => handleApprove(selectedItem.id)}>âœ… Setujui</Button>
                  <Button variant="danger" className="flex-1" onClick={() => handleReject(selectedItem.id)}>âŒ Tolak</Button>
                </div>
              )}
              {getStatus(selectedItem.id, selectedItem.status) === "approved" && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-900/30 text-center">
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">âœ… Sudah Disetujui</p>
                </div>
              )}
              {getStatus(selectedItem.id, selectedItem.status) === "rejected" && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900/30 text-center">
                  <p className="text-sm font-semibold text-red-700 dark:text-red-400">âŒ Ditolak</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




```

---

### File: `apps/owner/_pages/Produksi.tsx`

```tsx
﻿"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { productionPlan } from "@/data/mockData";
import { formatPercent } from "@/utils/format";

const yieldChart = productionPlan.map(p => ({
  name: p.menu.length > 18 ? p.menu.slice(0, 18) + "â€¦" : p.menu,
  target: p.targetQty,
  produced: p.producedQty,
  yield: p.yield,
}));

const statusConfig = {
  "on-track": { label: "On Track", variant: "success" as const, icon: "âœ…" },
  "behind": { label: "Terlambat", variant: "danger" as const, icon: "ðŸ”´" },
  "ahead": { label: "Lebih", variant: "info" as const, icon: "ðŸ”µ" },
};

function ProdTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold mb-2 text-slate-700 dark:text-slate-200">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-semibold">{entry.value} {entry.name === "Yield" ? "%" : "pcs"}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function Produksi() {
  const [date] = useState("22 Desember 2024");
  const [selectedCabang, setSelectedCabang] = useState("Semua");

  const onTrack = productionPlan.filter(p => p.status === "on-track").length;
  const behind = productionPlan.filter(p => p.status === "behind").length;
  const ahead = productionPlan.filter(p => p.status === "ahead").length;
  const avgYield = productionPlan.reduce((s, p) => s + p.yield, 0) / productionPlan.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Produksi</h2>
          <p className="text-sm text-slate-500 mt-0.5">Rencana harian & laporan yield â€” {date}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedCabang}
            onChange={(e) => setSelectedCabang(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            {["Semua", "BSD", "Sudirman", "Kemang", "Depok", "Bekasi"].map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <Button variant="primary" size="sm" icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-1" />
            </svg>
          }>AI Generate Plan</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "On Track", value: onTrack.toString(), icon: "âœ…", desc: "item sesuai target" },
          { label: "Terlambat", value: behind.toString(), icon: "ðŸ”´", desc: "item di bawah target" },
          { label: "Lebih Produksi", value: ahead.toString(), icon: "ðŸ”µ", desc: "item di atas target" },
          { label: "Rata-rata Yield", value: `${formatPercent(avgYield)}`, icon: "ðŸ“Š", desc: "dari semua item" },
        ].map(card => (
          <div key={card.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{card.icon}</span>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{card.value}</p>
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{card.label}</p>
            <p className="text-xs text-slate-400">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* AI Banner */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200 dark:border-orange-900/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">ðŸ¤–</span>
          <div>
            <p className="text-sm font-semibold text-orange-800 dark:text-orange-200">AI Menyarankan Peningkatan Produksi</p>
            <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
              Berdasarkan prediksi demand akhir pekan (Natal) dan stok bahan baku saat ini, AI merekomendasikan peningkatan produksi Gorengan Mix sebesar +30 pcs dan Martabak Keju Susu +15 pcs untuk Sabtu-Minggu ini.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Button variant="primary" size="sm">Terapkan Saran AI</Button>
              <Button variant="ghost" size="sm">Abaikan</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Production Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Rencana Produksi Harian</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Export</Button>
            <Button variant="primary" size="sm">+ Tambah Item</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                {["Menu", "Target (AI)", "Diproduksi", "Yield %", "Variance", "Status", ""].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {productionPlan.map((item) => {
                const cfg = statusConfig[item.status as keyof typeof statusConfig];
                return (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.menu}</p>
                      {item.aiSuggested !== item.targetQty && (
                        <p className="text-xs text-orange-500 mt-0.5">ðŸ¤– AI: {item.aiSuggested} pcs</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.targetQty} pcs</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.producedQty} pcs</span>
                        <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.yield >= 100 ? "bg-blue-400" : item.yield >= 90 ? "bg-emerald-400" : "bg-red-400"}`}
                            style={{ width: `${Math.min(item.yield, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold ${item.yield >= 100 ? "text-blue-600" : item.yield >= 90 ? "text-emerald-600" : "text-red-500"}`}>
                        {formatPercent(item.yield)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-semibold ${item.variance > 0 ? "text-blue-600" : item.variance < -10 ? "text-red-600" : "text-emerald-600"}`}>
                        {item.variance > 0 ? "+" : ""}{formatPercent(item.variance)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={cfg.variant}>{cfg.icon} {cfg.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yield Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Target vs Produksi Aktual</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={yieldChart} margin={{ top: 0, right: 4, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={false} angle={-15} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
            <Tooltip content={<ProdTooltip />} />
            <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="produced" name="Produksi" radius={[4, 4, 0, 0]} maxBarSize={28}>
              {yieldChart.map((item, i) => (
                <Cell
                  key={i}
                  fill={item.produced >= item.target ? "#22c55e" : item.produced >= item.target * 0.9 ? "#f97316" : "#ef4444"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}




```

---

### File: `apps/owner/_pages/SDM.tsx`

```tsx
﻿"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { shiftData, cabangList } from "@/data/mockData";
import { formatRupiah, formatPercent } from "@/utils/format";

const employees = [
  { id: "e1", name: "Andi Pratama", role: "Kasir", cabang: "BSD", shift: "Pagi", salary: 3200000, hours: 8, status: "active" },
  { id: "e2", name: "Budi Santoso", role: "Produksi", cabang: "BSD", shift: "Pagi", salary: 2800000, hours: 8, status: "active" },
  { id: "e3", name: "Cici Rahayu", role: "Pelayan", cabang: "BSD", shift: "Pagi", salary: 2600000, hours: 8, status: "active" },
  { id: "e4", name: "Dedi Kurniawan", role: "Kasir", cabang: "BSD", shift: "Sore", salary: 3200000, hours: 8, status: "upcoming" },
  { id: "e5", name: "Hana Sari", role: "Kasir", cabang: "Sudirman", shift: "Pagi", salary: 3200000, hours: 8, status: "active" },
  { id: "e6", name: "Ivan Nugroho", role: "Produksi", cabang: "Sudirman", shift: "Pagi", salary: 2800000, hours: 8, status: "active" },
  { id: "e7", name: "Joko Widodo", role: "Kasir", cabang: "Kemang", shift: "Pagi", salary: 3200000, hours: 8, status: "active" },
  { id: "e8", name: "Lia Amelia", role: "Pelayan", cabang: "Kemang", shift: "Pagi", salary: 2600000, hours: 8, status: "active" },
  { id: "e9", name: "Mira Putri", role: "Kasir", cabang: "Depok", shift: "Pagi", salary: 3200000, hours: 8, status: "warning" },
];

const laborCostChart = cabangList.map(c => ({
  name: c.name.replace("Cabang ", ""),
  laborCost: c.laborCost,
  target: 18,
}));

function LaborTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold mb-2 text-slate-700 dark:text-slate-200">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-semibold">{formatPercent(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function SDM() {
  const [activeTab, setActiveTab] = useState<"shift" | "karyawan" | "biaya">("shift");

  const totalEmployees = employees.length;
  const activeShifts = shiftData.filter(s => s.status === "active").length;
  const vacantShifts = shiftData.filter(s => s.status === "vacant").length;
  const totalLaborCost = cabangList.reduce((s, c) => s + (c.revenue * c.laborCost / 100), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">SDM & Shift</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manajemen karyawan, shift, dan biaya tenaga kerja</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Export</Button>
          <Button variant="primary" size="sm" icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }>Tambah Karyawan</Button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Karyawan", value: totalEmployees.toString(), icon: "ðŸ‘¥", trend: null },
          { label: "Shift Aktif", value: activeShifts.toString(), icon: "ðŸŸ¢", trend: null },
          { label: "Posisi Kosong", value: vacantShifts.toString(), icon: "ðŸ”´", trend: "alert" },
          { label: "Total Labor Cost", value: formatRupiah(totalLaborCost, true), icon: "ðŸ’µ", trend: null },
        ].map(card => (
          <div key={card.label} className={`bg-white dark:bg-slate-900 rounded-xl border shadow-sm p-4 ${card.trend === "alert" ? "border-red-200 dark:border-red-900/30" : "border-slate-200 dark:border-slate-800"}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{card.icon}</span>
              {card.trend === "alert" && <Badge variant="danger" size="sm">Perlu Isi</Badge>}
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{card.value}</p>
            <p className="text-xs text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
        {([
          { key: "shift", label: "ðŸ• Jadwal Shift" },
          { key: "karyawan", label: "ðŸ‘¤ Daftar Karyawan" },
          { key: "biaya", label: "ðŸ’° Biaya Tenaga Kerja" },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === tab.key ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "shift" && (
        <div className="space-y-4">
          {/* Alert */}
          {vacantShifts > 0 && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">ðŸš¨</span>
                <div>
                  <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                    {vacantShifts} Shift Kosong Perlu Diisi
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
                    Cabang Bekasi shift malam belum ada kasir yang ditugaskan.
                  </p>
                </div>
                <Button variant="danger" size="sm" className="ml-auto">Atur Sekarang</Button>
              </div>
            </div>
          )}

          {/* Shift Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {shiftData.map((shift) => (
              <div key={shift.id} className={`bg-white dark:bg-slate-900 rounded-xl border shadow-sm p-4 ${
                shift.status === "vacant" ? "border-red-200 dark:border-red-900/30" :
                shift.status === "warning" ? "border-amber-200 dark:border-amber-900/30" :
                "border-slate-200 dark:border-slate-800"
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{shift.cabang.replace("Cabang ", "")}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{shift.shift}</p>
                  </div>
                  <Badge
                    variant={
                      shift.status === "active" ? "success" :
                      shift.status === "upcoming" ? "info" :
                      shift.status === "warning" ? "warning" : "danger"
                    }
                  >
                    {shift.status === "active" ? "ðŸŸ¢ Aktif" :
                     shift.status === "upcoming" ? "ðŸ”µ Nanti" :
                     shift.status === "warning" ? "âš ï¸ Kurang" : "ðŸ”´ Kosong"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Tim ({shift.staff.length} orang)</p>
                    {shift.staff.length > 0 ? (
                      <div className="flex items-center gap-1 flex-wrap">
                        {shift.staff.map((s, i) => (
                          <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${s === shift.kasir ? "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400 font-semibold" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
                            {s === shift.kasir ? "ðŸ’¼ " : ""}{s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-red-500 font-medium">Belum ada karyawan ditugaskan</p>
                    )}
                  </div>
                  {shift.sales > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-500">Penjualan shift ini</p>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(shift.sales, true)}</p>
                    </div>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="ghost" size="sm" className="flex-1 text-xs">Edit Shift</Button>
                  {shift.status === "vacant" && (
                    <Button variant="primary" size="sm" className="flex-1 text-xs">Tugaskan</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "karyawan" && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Daftar Karyawan</h3>
            <Button variant="outline" size="sm">Filter</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {["Nama", "Jabatan", "Cabang", "Shift", "Gaji/Bulan", "Status", ""].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-amber-200 flex items-center justify-center text-xs font-bold text-orange-800 flex-shrink-0">
                          {emp.name.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant="neutral" size="sm">{emp.role}</Badge></td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{emp.cabang}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{emp.shift}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200">{formatRupiah(emp.salary)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={emp.status === "active" ? "success" : emp.status === "warning" ? "warning" : "info"}>
                        {emp.status === "active" ? "Aktif" : emp.status === "warning" ? "Perlu Perhatian" : "Mendatang"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "biaya" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Labor Cost % per Cabang</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={laborCostChart} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 25]} />
                <Tooltip content={<LaborTooltip />} />
                <Bar dataKey="laborCost" name="Labor Cost" radius={[4, 4, 0, 0]} maxBarSize={36}
                  fill="#f97316"
                />
                <Bar dataKey="target" name="Target Max" radius={[4, 4, 0, 0]} maxBarSize={36} fill="#e2e8f0" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Detail Labor Cost per Cabang</h3>
            <div className="space-y-4">
              {cabangList.map((cabang) => {
                const laborCostAmt = cabang.revenue * cabang.laborCost / 100;
                const isHigh = cabang.laborCost > 20;
                return (
                  <div key={cabang.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{cabang.name.replace("Cabang ", "")}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{formatRupiah(laborCostAmt, true)}</span>
                        <span className={`text-xs font-bold ${isHigh ? "text-red-600" : "text-emerald-600"}`}>{formatPercent(cabang.laborCost)}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isHigh ? "bg-red-400" : "bg-emerald-400"}`}
                        style={{ width: `${(cabang.laborCost / 25) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




```

---

### File: `apps/owner/app/(dashboard)/ai/page.tsx`

```tsx
import AIInsights from "../../../_pages/AIInsights";

export default function Page() {
  return <AIInsights />;
}

```

---

### File: `apps/owner/app/(dashboard)/cabang/page.tsx`

```tsx
import Cabang from "../../../_pages/Cabang";

export default function Page() {
  return <Cabang />;
}

```

---

### File: `apps/owner/app/(dashboard)/keuangan/page.tsx`

```tsx
import Keuangan from "../../../_pages/Keuangan";

export default function Page() {
  return <Keuangan />;
}

```

---

### File: `apps/owner/app/(dashboard)/layout.tsx`

```tsx
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

```

---

### File: `apps/owner/app/(dashboard)/menu/page.tsx`

```tsx
import MenuResep from "../../../_pages/MenuResep";

export default function Page() {
  return <MenuResep />;
}

```

---

### File: `apps/owner/app/(dashboard)/page.tsx`

```tsx
import ExecutiveCockpit from "../../_pages/ExecutiveCockpit";

export default function Page() {
  return <ExecutiveCockpit />;
}

```

---

### File: `apps/owner/app/(dashboard)/pengaturan/page.tsx`

```tsx
import Pengaturan from "../../../_pages/Pengaturan";

export default function Page() {
  return <Pengaturan />;
}

```

---

### File: `apps/owner/app/(dashboard)/penjualan/page.tsx`

```tsx
import Penjualan from "../../../_pages/Penjualan";

export default function Page() {
  return <Penjualan />;
}

```

---

### File: `apps/owner/app/(dashboard)/persediaan/page.tsx`

```tsx
import Persediaan from "../../../_pages/Persediaan";

export default function Page() {
  return <Persediaan />;
}

```

---

### File: `apps/owner/app/(dashboard)/persetujuan/page.tsx`

```tsx
import Persetujuan from "../../../_pages/Persetujuan";

export default function Page() {
  return <Persetujuan />;
}

```

---

### File: `apps/owner/app/(dashboard)/produksi/page.tsx`

```tsx
import Produksi from "../../../_pages/Produksi";

export default function Page() {
  return <Produksi />;
}

```

---

### File: `apps/owner/app/(dashboard)/sdm/page.tsx`

```tsx
import SDM from "../../../_pages/SDM";

export default function Page() {
  return <SDM />;
}

```

---

### File: `apps/owner/app/.gitkeep`

```text
# Placeholder

```

---

### File: `apps/owner/app/globals.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

@import "tailwindcss";
@source "../_pages";
@source "../components";

:root {
  /* Brand Colors */
  --color-primary: #e53e3e;
  --color-primary-dark: #c53030;
  --color-primary-light: #fc8181;

  /* Neutral - Dark mode first */
  --color-bg: #0f0f14;
  --color-bg-card: #1a1a24;
  --color-bg-surface: #222230;
  --color-bg-hover: #2a2a3a;
  --color-border: rgba(255, 255, 255, 0.08);
  --color-border-active: rgba(255, 255, 255, 0.15);

  /* Text */
  --color-text-primary: #f0f0f5;
  --color-text-secondary: #9898b0;
  --color-text-muted: #6b6b80;

  /* Accent */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #3b82f6;

  /* Sidebar */
  --sidebar-width: 260px;
  --sidebar-collapsed-width: 72px;
  --topbar-height: 64px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  height: 100%;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--color-border-active);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}

/* Glass morphism utility */
.glass {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
}

/* Gradient text utility */
.gradient-text {
  background: linear-gradient(135deg, #e53e3e, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Card hover effect */
.card-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border-color: var(--color-border-active);
}

/* Number font */
.font-mono-number {
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
}




```

---

### File: `apps/owner/app/layout.tsx`

```tsx
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

```

---

### File: `apps/owner/components/.gitkeep`

```text
# Placeholder

```

---

### File: `apps/owner/components/layout/Sidebar.tsx`

```tsx
"use client";

import { navItems, pageTitles, type PageId } from "@/types/nav";

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ activePage, onNavigate, collapsed, onToggle }: SidebarProps) {
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
            T
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p style={{ color: "var(--color-text-primary)" }} className="text-sm font-bold truncate leading-tight">
                Taj SaaS
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
                  A6 Nyuss Martabak
                </p>
                <p className="text-xs" style={{ color: "var(--color-primary)" }}>
                  Pro Plan · 3 Cabang
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

        {/* Bottom User */}
        {!collapsed && (
          <div className="px-3 py-3 flex-shrink-0" style={{ borderTop: "1px solid var(--color-border)" }}>
            <div
              className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors hover:bg-white/5"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                TZ
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>
                  Taj Zahi El Huda
                </p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  Owner
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

```

---

### File: `apps/owner/components/layout/Topbar.tsx`

```tsx
"use client";

import { useState } from "react";
import { pageTitles, type PageId } from "@/types/nav";

interface TopbarProps {
  activePage: PageId;
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export function Topbar({ activePage, onToggleSidebar, sidebarCollapsed }: TopbarProps) {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const pageInfo = pageTitles[activePage];

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
          {pageInfo.title}
        </h1>
        <p className="text-xs hidden sm:block" style={{ color: "var(--color-text-muted)" }}>
          {pageInfo.subtitle}
        </p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5">

        {/* AI Chat Button */}
        <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow-sm transition-all"
          style={{ background: "linear-gradient(135deg, #e53e3e, #f97316)" }}>
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
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #e53e3e, #f97316)" }}>
              TZ
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold leading-tight" style={{ color: "var(--color-text-primary)" }}>Taj Zahi</p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Owner</p>
            </div>
          </button>
          {showProfile && (
            <div className="absolute right-0 top-12 w-52 rounded-xl shadow-2xl z-50"
              style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}>
              <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--color-border)" }}>
                <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Taj Zahi El Huda</p>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>owner@tajsaas.id</p>
              </div>
              {[
                { label: "Profil Saya", icon: "👤" },
                { label: "Pengaturan", icon: "⚙️" },
                { label: "Bantuan", icon: "❓" },
              ].map((item, i) => (
                <button key={i} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-white/5"
                  style={{ color: "var(--color-text-secondary)" }}>
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <div style={{ borderTop: "1px solid var(--color-border)" }}>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                  style={{ color: "var(--color-danger)" }}>
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

```

---

### File: `apps/owner/components/ui/Badge.tsx`

```tsx
﻿"use client";

import React from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "neutral" | "brand";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
  danger: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
  info: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
  neutral: "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  brand: "bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400",
};

export function Badge({ variant = "default", children, className = "", size = "sm" }: BadgeProps) {
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm";
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeClass} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}


```

---

### File: `apps/owner/components/ui/Button.tsx`

```tsx
﻿"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-orange-500 hover:bg-orange-600 text-white shadow-sm border border-orange-600",
  secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700",
  ghost: "bg-transparent hover:bg-slate-100 text-slate-700 dark:hover:bg-slate-800 dark:text-slate-300",
  danger: "bg-red-500 hover:bg-red-600 text-white border border-red-600",
  outline: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs font-medium",
  md: "px-4 py-2 text-sm font-medium",
  lg: "px-5 py-2.5 text-sm font-semibold",
  icon: "p-2",
};

export function Button({ variant = "secondary", size = "md", children, loading, icon, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children}
    </button>
  );
}


```

---

### File: `apps/owner/components/ui/Card.tsx`

```tsx
﻿"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className = "", padding = true }: CardProps) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ${padding ? "p-5" : ""} ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}


```

---

### File: `apps/owner/components/ui/Input.tsx`

```tsx
﻿"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  hint?: string;
  error?: string;
}

export function Input({ icon, label, hint, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${icon ? "pl-9" : ""} ${error ? "border-red-400 focus:ring-red-500" : ""} ${className}`}
          {...props}
        />
      </div>
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = "", ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <select
        className={`w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all cursor-pointer ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}


```

---

### File: `apps/owner/data/mockData.ts`

```typescript
// ============================================================
// MOCK DATA — TajDigital F&B SaaS Dashboard
// ============================================================

export const tenantData = {
  id: "tenant-001",
  name: "Martabak Mas Bambang",
  brandName: "Mas Bambang Group",
  logo: "🥘",
  primaryColor: "#f97316",
  secondaryColor: "#eab308",
  since: "2019",
  plan: "Enterprise",
  totalCabang: 5,
};

// ============================================================
// CABANG DATA
// ============================================================
export const cabangList = [
  { id: "c1", name: "Cabang Sudirman", city: "Jakarta", status: "active", kasir: 3, revenue: 45200000, orders: 1240, avgOrder: 36450, foodCost: 28.4, laborCost: 18.2, rating: 4.8, lastSync: "2 menit lalu" },
  { id: "c2", name: "Cabang Kemang", city: "Jakarta", status: "active", kasir: 2, revenue: 38700000, orders: 980, avgOrder: 39490, foodCost: 29.1, laborCost: 19.5, rating: 4.7, lastSync: "5 menit lalu" },
  { id: "c3", name: "Cabang BSD", city: "Tangerang", status: "active", kasir: 4, revenue: 52100000, orders: 1560, avgOrder: 33400, foodCost: 27.8, laborCost: 17.9, rating: 4.9, lastSync: "1 menit lalu" },
  { id: "c4", name: "Cabang Depok", city: "Depok", status: "active", kasir: 2, revenue: 29800000, orders: 820, avgOrder: 36340, foodCost: 30.2, laborCost: 20.1, rating: 4.5, lastSync: "8 menit lalu" },
  { id: "c5", name: "Cabang Bekasi", city: "Bekasi", status: "maintenance", kasir: 2, revenue: 19400000, orders: 540, avgOrder: 35920, foodCost: 31.5, laborCost: 21.3, rating: 4.3, lastSync: "15 menit lalu" },
];

// ============================================================
// REVENUE TREND DATA
// ============================================================
export const revenueTrend7d = [
  { date: "Sen 16 Des", revenue: 8240000, orders: 228, target: 8000000 },
  { date: "Sel 17 Des", revenue: 9150000, orders: 251, target: 8000000 },
  { date: "Rab 18 Des", revenue: 7820000, orders: 215, target: 8000000 },
  { date: "Kam 19 Des", revenue: 10200000, orders: 280, target: 8000000 },
  { date: "Jum 20 Des", revenue: 12400000, orders: 340, target: 8000000 },
  { date: "Sab 21 Des", revenue: 15600000, orders: 428, target: 8000000 },
  { date: "Min 22 Des", revenue: 13800000, orders: 398, target: 8000000 },
];

export const revenueTrend30d = Array.from({ length: 30 }, (_, i) => {
  const base = 8000000 + Math.sin(i * 0.4) * 2000000;
  const weekend = (i % 7 === 5 || i % 7 === 6) ? 1.4 : 1;
  const revenue = Math.round(base * weekend * (0.9 + Math.random() * 0.25));
  return {
    date: `${i + 1} Nov`,
    revenue,
    orders: Math.round(revenue / 36000),
    target: 8000000,
  };
});

export const revenueTrend90d = Array.from({ length: 90 }, (_, i) => {
  const base = 8000000 + (i / 90) * 2000000;
  const weekend = (i % 7 === 5 || i % 7 === 6) ? 1.4 : 1;
  const revenue = Math.round(base * weekend * (0.85 + Math.random() * 0.3));
  return {
    date: `${i + 1}`,
    revenue,
    orders: Math.round(revenue / 36000),
    target: 8000000,
  };
});

// ============================================================
// MENU DATA
// ============================================================
export const menuList = [
  { id: "m1", name: "Martabak Telur Spesial", category: "Martabak", price: 45000, cost: 14200, margin: 68.4, soldToday: 142, revenue: 6390000, status: "star", stock: "ok" },
  { id: "m2", name: "Terang Bulan Keju Meses", category: "Terang Bulan", price: 38000, cost: 11400, margin: 70.0, soldToday: 128, revenue: 4864000, status: "star", stock: "ok" },
  { id: "m3", name: "Martabak Keju Susu", category: "Martabak", price: 52000, cost: 17000, margin: 67.3, soldToday: 98, revenue: 5096000, status: "star", stock: "ok" },
  { id: "m4", name: "Gorengan Mix (10 pcs)", category: "Gorengan", price: 25000, cost: 9500, margin: 62.0, soldToday: 215, revenue: 5375000, status: "plow-horse", stock: "ok" },
  { id: "m5", name: "Terang Bulan Kacang", category: "Terang Bulan", price: 35000, cost: 11200, margin: 68.0, soldToday: 89, revenue: 3115000, status: "star", stock: "ok" },
  { id: "m6", name: "Martabak Mini Assorted", category: "Martabak", price: 30000, cost: 10800, margin: 64.0, soldToday: 76, revenue: 2280000, status: "puzzle", stock: "low" },
  { id: "m7", name: "Es Teh Manis", category: "Minuman", price: 8000, cost: 2100, margin: 73.8, soldToday: 310, revenue: 2480000, status: "plow-horse", stock: "ok" },
  { id: "m8", name: "Es Jeruk Peras", category: "Minuman", price: 12000, cost: 3500, margin: 70.8, soldToday: 185, revenue: 2220000, status: "plow-horse", stock: "ok" },
  { id: "m9", name: "Martabak Telur Biasa", category: "Martabak", price: 35000, cost: 12800, margin: 63.4, soldToday: 68, revenue: 2380000, status: "dog", stock: "ok" },
  { id: "m10", name: "Terang Bulan Coklat", category: "Terang Bulan", price: 40000, cost: 13500, margin: 66.3, soldToday: 55, revenue: 2200000, status: "dog", stock: "ok" },
];

// ============================================================
// REVENUE BY CABANG
// ============================================================
export const revenueByCabang = [
  { name: "BSD", revenue: 52100000, target: 50000000, orders: 1560 },
  { name: "Sudirman", revenue: 45200000, target: 45000000, orders: 1240 },
  { name: "Kemang", revenue: 38700000, target: 40000000, orders: 980 },
  { name: "Depok", revenue: 29800000, target: 30000000, orders: 820 },
  { name: "Bekasi", revenue: 19400000, target: 25000000, orders: 540 },
];

// ============================================================
// HOURLY SALES HEATMAP
// ============================================================
export const hourlyHeatmap = [
  { day: "Sen", h10: 12, h11: 18, h12: 45, h13: 38, h14: 22, h15: 15, h16: 20, h17: 35, h18: 68, h19: 82, h20: 75, h21: 55, h22: 32 },
  { day: "Sel", h10: 10, h11: 22, h12: 48, h13: 42, h14: 25, h15: 18, h16: 22, h17: 38, h18: 72, h19: 88, h20: 78, h21: 58, h22: 35 },
  { day: "Rab", h10: 8, h11: 16, h12: 42, h13: 35, h14: 20, h15: 12, h16: 18, h17: 32, h18: 65, h19: 78, h20: 70, h21: 52, h22: 28 },
  { day: "Kam", h10: 15, h11: 25, h12: 52, h13: 45, h14: 28, h15: 20, h16: 25, h17: 42, h18: 75, h19: 92, h20: 85, h21: 62, h22: 38 },
  { day: "Jum", h10: 18, h11: 30, h12: 58, h13: 52, h14: 32, h15: 25, h16: 30, h17: 55, h18: 88, h19: 105, h20: 98, h21: 72, h22: 48 },
  { day: "Sab", h10: 25, h11: 42, h12: 75, h13: 68, h14: 45, h15: 38, h16: 48, h17: 78, h18: 115, h19: 132, h20: 125, h21: 95, h22: 65 },
  { day: "Min", h10: 28, h11: 48, h12: 82, h13: 72, h14: 50, h15: 42, h16: 52, h17: 82, h18: 118, h19: 128, h20: 118, h21: 88, h22: 58 },
];

// ============================================================
// AI INSIGHTS
// ============================================================
export const aiInsights = [
  {
    id: "ai1",
    type: "opportunity",
    icon: "📈",
    title: "Peluang Upsell Topping Keju",
    description: "78% pelanggan Martabak Telur Spesial tidak menambah topping. Tambahkan prompt topping di kasir bisa meningkatkan AOV hingga Rp 12.000.",
    impact: "+Rp 1.7M/bulan",
    confidence: 87,
    cabang: "Semua Cabang",
    action: "Lihat Detail",
  },
  {
    id: "ai2",
    type: "warning",
    icon: "⚠️",
    title: "Food Cost Cabang Bekasi Tinggi",
    description: "Food cost Cabang Bekasi 31.5% — 3.7% di atas rata-rata. Kemungkinan penyebab: porsi tidak konsisten atau waste tinggi di adonan.",
    impact: "-Rp 890K waste/hari",
    confidence: 92,
    cabang: "Cabang Bekasi",
    action: "Audit Sekarang",
  },
  {
    id: "ai3",
    type: "forecast",
    icon: "🔮",
    title: "Prediksi Ramai Akhir Pekan",
    description: "Model AI memprediksi penjualan Sabtu-Minggu ini 15-20% di atas rata-rata karena libur Natal. Siapkan stok 20% lebih banyak.",
    impact: "+Rp 4.2M weekend",
    confidence: 81,
    cabang: "BSD & Sudirman",
    action: "Buat Produksi",
  },
  {
    id: "ai4",
    type: "alert",
    icon: "🚨",
    title: "Stok Keju Kraft Kritis",
    description: "Keju Kraft di Cabang Kemang & Depok hanya cukup untuk 2 hari lagi berdasarkan rata-rata penjualan. Segera lakukan pemesanan.",
    impact: "Potensi stockout 2 hari",
    confidence: 96,
    cabang: "Kemang & Depok",
    action: "Buat PO",
  },
  {
    id: "ai5",
    type: "opportunity",
    icon: "💡",
    title: "Jam Sepi 14.00-17.00",
    description: "Slot 14.00-17.00 rata-rata hanya 22 order. Pertimbangkan promo happy hour atau paket sore untuk meningkatkan utilisasi dapur.",
    impact: "+35% slot sepi",
    confidence: 74,
    cabang: "Semua Cabang",
    action: "Buat Promo",
  },
];

// ============================================================
// CRITICAL ALERTS
// ============================================================
export const criticalAlerts = [
  { id: "a1", severity: "critical", title: "Stok Minyak Goreng Habis", cabang: "Cabang Depok", time: "10 menit lalu", type: "inventory" },
  { id: "a2", severity: "warning", title: "3 Persetujuan PO Menunggu", cabang: "Head Office", time: "25 menit lalu", type: "approval" },
  { id: "a3", severity: "warning", title: "Shift Malam Belum Ada Kasir", cabang: "Cabang Kemang", time: "1 jam lalu", type: "sdm" },
  { id: "a4", severity: "info", title: "Rekonsiliasi Shift Siang Selesai", cabang: "Cabang BSD", time: "2 jam lalu", type: "finance" },
];

// ============================================================
// INVENTORY DATA
// ============================================================
export const inventoryItems = [
  { id: "i1", name: "Tepung Terigu Cakra", unit: "kg", stock: 85, minStock: 50, reorderPoint: 60, cost: 12000, supplier: "PT. Bogasari", category: "Bahan Baku", cabang: "BSD" },
  { id: "i2", name: "Telur Ayam", unit: "butir", stock: 240, minStock: 200, reorderPoint: 250, cost: 2200, supplier: "Peternakan Pak Hadi", category: "Bahan Baku", cabang: "BSD" },
  { id: "i3", name: "Keju Kraft Slice", unit: "pcs", stock: 45, minStock: 100, reorderPoint: 120, cost: 8500, supplier: "PT. Kraft Heinz", category: "Topping", cabang: "Kemang" },
  { id: "i4", name: "Minyak Goreng Bimoli", unit: "liter", stock: 8, minStock: 20, reorderPoint: 25, cost: 18000, supplier: "PT. Salim Ivomas", category: "Bahan Baku", cabang: "Depok" },
  { id: "i5", name: "Gula Pasir", unit: "kg", stock: 32, minStock: 20, reorderPoint: 25, cost: 14000, supplier: "PT. Gulaku", category: "Bahan Baku", cabang: "Sudirman" },
  { id: "i6", name: "Meses Coklat", unit: "kg", stock: 12, minStock: 10, reorderPoint: 12, cost: 45000, supplier: "PT. Ceres", category: "Topping", cabang: "Semua" },
  { id: "i7", name: "Susu Kental Manis", unit: "kaleng", stock: 68, minStock: 40, reorderPoint: 50, cost: 12500, supplier: "PT. Frisian Flag", category: "Topping", cabang: "Semua" },
  { id: "i8", name: "Kacang Tanah", unit: "kg", stock: 18, minStock: 15, reorderPoint: 18, cost: 22000, supplier: "Supplier Lokal", category: "Topping", cabang: "Semua" },
];

// ============================================================
// FINANCE DATA
// ============================================================
export const pnlData = [
  { month: "Jul", revenue: 162000000, cogs: 48600000, grossProfit: 113400000, opex: 45360000, netProfit: 68040000 },
  { month: "Agu", revenue: 175000000, cogs: 51625000, grossProfit: 123375000, opex: 47250000, netProfit: 76125000 },
  { month: "Sep", revenue: 168000000, cogs: 49728000, grossProfit: 118272000, opex: 46200000, netProfit: 72072000 },
  { month: "Okt", revenue: 182000000, cogs: 54236000, grossProfit: 127764000, opex: 48580000, netProfit: 79184000 },
  { month: "Nov", revenue: 195000000, cogs: 57915000, grossProfit: 137085000, opex: 51480000, netProfit: 85605000 },
  { month: "Des", revenue: 185200000, cogs: 54834000, grossProfit: 130366000, opex: 49000000, netProfit: 81366000 },
];

// ============================================================
// APPROVALS
// ============================================================
export const approvalsList = [
  { id: "ap1", type: "purchase_order", title: "PO Tepung Terigu 200kg", requestedBy: "Ahmad Sudirman", cabang: "Cabang BSD", amount: 2400000, requestedAt: "2024-12-22 09:15", status: "pending", priority: "high" },
  { id: "ap2", type: "discount", title: "Diskon Event Natal 20%", requestedBy: "Sari Kemang", cabang: "Cabang Kemang", amount: 450000, requestedAt: "2024-12-22 08:30", status: "pending", priority: "medium" },
  { id: "ap3", type: "purchase_order", title: "PO Keju Kraft 50 pcs", requestedBy: "Budi Depok", cabang: "Cabang Depok", amount: 425000, requestedAt: "2024-12-21 16:45", status: "pending", priority: "critical" },
  { id: "ap4", type: "refund", title: "Refund Order #1842", requestedBy: "Kasir Bekasi", cabang: "Cabang Bekasi", amount: 52000, requestedAt: "2024-12-21 14:20", status: "pending", priority: "low" },
  { id: "ap5", type: "purchase_order", title: "PO Minyak Goreng 50L", requestedBy: "Kasir Sudirman", cabang: "Cabang Sudirman", amount: 900000, requestedAt: "2024-12-21 11:00", status: "approved", priority: "high" },
];

// ============================================================
// PRODUCTION DATA
// ============================================================
export const productionPlan = [
  { id: "p1", menu: "Martabak Telur Spesial", targetQty: 180, producedQty: 165, yield: 91.7, variance: -8.3, status: "on-track", aiSuggested: 180 },
  { id: "p2", menu: "Terang Bulan Keju Meses", targetQty: 150, producedQty: 148, yield: 98.7, variance: -1.3, status: "on-track", aiSuggested: 150 },
  { id: "p3", menu: "Gorengan Mix", targetQty: 250, producedQty: 212, yield: 84.8, variance: -15.2, status: "behind", aiSuggested: 280 },
  { id: "p4", menu: "Martabak Keju Susu", targetQty: 120, producedQty: 125, yield: 104.2, variance: 4.2, status: "ahead", aiSuggested: 120 },
  { id: "p5", menu: "Es Teh Manis (per batch)", targetQty: 400, producedQty: 398, yield: 99.5, variance: -0.5, status: "on-track", aiSuggested: 420 },
];

// ============================================================
// SDM / SHIFT DATA
// ============================================================
export const shiftData = [
  { id: "s1", cabang: "Cabang BSD", shift: "Pagi (07:00-15:00)", staff: ["Andi", "Budi", "Cici"], kasir: "Andi", status: "active", sales: 18200000 },
  { id: "s2", cabang: "Cabang BSD", shift: "Sore (15:00-23:00)", staff: ["Dedi", "Eva", "Fajar", "Gita"], kasir: "Dedi", status: "upcoming", sales: 0 },
  { id: "s3", cabang: "Cabang Sudirman", shift: "Pagi (07:00-15:00)", staff: ["Hana", "Ivan"], kasir: "Hana", status: "active", sales: 14500000 },
  { id: "s4", cabang: "Cabang Kemang", shift: "Pagi (07:00-15:00)", staff: ["Joko", "Lia"], kasir: "Joko", status: "active", sales: 12300000 },
  { id: "s5", cabang: "Cabang Depok", shift: "Pagi (07:00-15:00)", staff: ["Mira"], kasir: "Mira", status: "warning", sales: 9800000 },
  { id: "s6", cabang: "Cabang Bekasi", shift: "Pagi (07:00-15:00)", staff: [], kasir: "-", status: "vacant", sales: 0 },
];

// ============================================================
// SALES ANALYTICS DATA
// ============================================================
export const salesByChannel = [
  { channel: "Dine-in", value: 42, revenue: 77784000 },
  { channel: "GrabFood", value: 28, revenue: 51856000 },
  { channel: "GoFood", value: 18, revenue: 33336000 },
  { channel: "ShopeeFood", value: 8, revenue: 14816000 },
  { channel: "WhatsApp Order", value: 4, revenue: 7408000 },
];

export const salesByTime = [
  { time: "10-12", orders: 180 },
  { time: "12-14", orders: 420 },
  { time: "14-16", orders: 185 },
  { time: "16-18", orders: 320 },
  { time: "18-20", orders: 680 },
  { time: "20-22", orders: 740 },
  { time: "22-24", orders: 380 },
];

// ============================================================
// FORECAST DATA
// ============================================================
export const forecastData = [
  { date: "23 Des", actual: null, forecast: 14200000, lower: 12800000, upper: 15600000 },
  { date: "24 Des", actual: null, forecast: 16800000, lower: 15100000, upper: 18500000 },
  { date: "25 Des", actual: null, forecast: 22400000, lower: 20200000, upper: 24600000 },
  { date: "26 Des", actual: null, forecast: 18900000, lower: 17000000, upper: 20800000 },
  { date: "27 Des", actual: null, forecast: 15600000, lower: 14000000, upper: 17200000 },
  { date: "28 Des", actual: null, forecast: 20100000, lower: 18100000, upper: 22100000 },
  { date: "29 Des", actual: null, forecast: 24500000, lower: 22000000, upper: 27000000 },
];

// ============================================================
// KPI SUMMARY
// ============================================================
export const kpiSummary = {
  totalRevenue: { value: 185200000, change: 8.4, label: "Total Pendapatan", period: "bulan ini" },
  grossMargin: { value: 70.4, change: 1.2, label: "Gross Margin", period: "bulan ini" },
  foodCost: { value: 29.6, change: -0.8, label: "Food Cost %", period: "bulan ini" },
  laborCost: { value: 19.2, change: -0.3, label: "Labor Cost %", period: "bulan ini" },
  wastePercent: { value: 3.8, change: -0.5, label: "Waste %", period: "bulan ini" },
  totalOrders: { value: 5140, change: 12.3, label: "Total Order", period: "bulan ini" },
  aov: { value: 36040, change: 3.2, label: "Avg Order Value", period: "bulan ini" },
  activeCabang: { value: 4, change: 0, label: "Cabang Aktif", period: "dari 5 cabang" },
};

```

---

### File: `apps/owner/instrumentation.ts`

```typescript
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = async (
  err: unknown,
  request: any,
  context: any
) => {
  const { captureRequestError } = await import("@sentry/nextjs");
  captureRequestError(err, request as any, context as any);
};

```

---

### File: `apps/owner/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseTenantFromHostname } from '@taj-saas/shared';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const { slug, appType, isLocalhost } = parseTenantFromHostname(hostname);

  // Development helpers: redirect to correct ports if subdomains hit owner app
  if (isLocalhost) {
    if (appType === 'customer') {
      const url = request.nextUrl.clone();
      url.port = '3000';
      return NextResponse.redirect(url);
    }
    if (appType === 'admin') {
      const url = request.nextUrl.clone();
      url.port = '3001';
      return NextResponse.redirect(url);
    }
  }

  // Clone headers and set tenant context
  const requestHeaders = new Headers(request.headers);
  if (slug) {
    requestHeaders.set('x-tenant-slug', slug);
  }

  // Continue request with injected header
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Only run on standard page/api routes, ignore static files
export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)',
  ],
};

```

---

### File: `apps/owner/next-env.d.ts`

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/dev/types/routes.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

```

---

### File: `apps/owner/next.config.ts`

```typescript
import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  transpilePackages: ["@taj-saas/db", "@taj-saas/shared", "@taj-saas/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: "taj-saas",
  project: "taj-saas-owner",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: { enabled: true },
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
});

```

---

### File: `apps/owner/package-lock.json`

*[Lock file - content omitted]*

---

### File: `apps/owner/package.json`

```json
{
  "name": "@taj-saas/owner",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3002",
    "build": "next build",
    "start": "next start -p 3002",
    "lint": "next lint"
  },
  "dependencies": {
    "@sentry/nextjs": "^10.57.0",
    "@taj-saas/db": "workspace:*",
    "@taj-saas/shared": "workspace:*",
    "clsx": "^2.1.1",
    "date-fns": "^4.4.0",
    "framer-motion": "^12.40.0",
    "lucide-react": "^0.511.0",
    "next": "16.2.6",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-hot-toast": "^2.6.0",
    "recharts": "^3.8.1",
    "tailwind-merge": "^3.6.0",
    "zustand": "^5.0.14"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}

```

---

### File: `apps/owner/postcss.config.mjs`

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

```

---

### File: `apps/owner/sentry.client.config.ts`

```typescript
// Owner App — Sentry Client Config
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  debug: process.env.NODE_ENV === "development",
  integrations: [
    Sentry.replayIntegration(),
  ],
});

```

---

### File: `apps/owner/sentry.edge.config.ts`

```typescript
// Owner App — Sentry Edge Config
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: process.env.NODE_ENV === "development",
});

```

---

### File: `apps/owner/sentry.server.config.ts`

```typescript
// Owner App — Sentry Server Config
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: process.env.NODE_ENV === "development",
});

```

---

### File: `apps/owner/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}

```

---

### File: `apps/owner/types/nav.ts`

```typescript
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

export interface NavItem {
  id: PageId;
  label: string;
  emoji: string;
  badge?: string | number;
  badgeVariant?: "danger" | "warning" | "info";
}

export const navItems: NavItem[] = [
  { id: "cockpit", label: "Executive Cockpit", emoji: "🏠" },
  { id: "cabang", label: "Cabang", emoji: "🏪" },
  { id: "menu", label: "Menu & Resep", emoji: "📋" },
  { id: "persediaan", label: "Persediaan", emoji: "📦", badge: 3, badgeVariant: "danger" },
  { id: "keuangan", label: "Keuangan", emoji: "💰" },
  { id: "produksi", label: "Produksi", emoji: "⚙️" },
  { id: "penjualan", label: "Penjualan & Analitik", emoji: "📊" },
  { id: "sdm", label: "SDM & Shift", emoji: "👥", badge: 1, badgeVariant: "warning" },
  { id: "persetujuan", label: "Persetujuan", emoji: "✅", badge: 4, badgeVariant: "danger" },
  { id: "ai", label: "AI Insights", emoji: "🤖" },
  { id: "pengaturan", label: "Pengaturan", emoji: "🔧" },
];

export const pageTitles: Record<PageId, { title: string; subtitle: string }> = {
  cockpit: { title: "Executive Cockpit", subtitle: "Ringkasan performa bisnis secara real-time" },
  cabang: { title: "Cabang", subtitle: "Kelola dan pantau semua cabang" },
  menu: { title: "Menu & Resep", subtitle: "Master menu, BOM, dan engineering" },
  persediaan: { title: "Persediaan", subtitle: "Manajemen stok dan waste log" },
  keuangan: { title: "Keuangan", subtitle: "P&L, arus kas, dan rekonsiliasi" },
  produksi: { title: "Produksi", subtitle: "Rencana harian dan laporan yield" },
  penjualan: { title: "Penjualan & Analitik", subtitle: "Analisis penjualan mendalam" },
  sdm: { title: "SDM & Shift", subtitle: "Manajemen karyawan dan jadwal" },
  persetujuan: { title: "Persetujuan", subtitle: "PO, diskon, refund menunggu approval" },
  ai: { title: "AI Insights", subtitle: "Prediksi cerdas dan rekomendasi AI" },
  pengaturan: { title: "Pengaturan", subtitle: "Konfigurasi tenant dan sistem" },
};

```

---

### File: `apps/owner/utils/cn.ts`

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

---

### File: `apps/owner/utils/format.ts`

```typescript
export function formatRupiah(value: number, short = false): string {
  if (short) {
    if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)}M`;
    if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}jt`;
    if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}rb`;
    return `Rp ${value}`;
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatChange(value: number, isPercent = true): string {
  const sign = value >= 0 ? "+" : "";
  if (isPercent) return `${sign}${value.toFixed(1)}%`;
  return `${sign}${value.toFixed(1)}`;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export function getHeatmapColor(value: number, max: number): string {
  const ratio = value / max;
  if (ratio < 0.2) return "bg-red-950/20 text-red-700";
  if (ratio < 0.4) return "bg-red-900/30 text-red-500";
  if (ratio < 0.6) return "bg-red-700/40 text-red-400";
  if (ratio < 0.8) return "bg-red-600/60 text-white";
  return "bg-red-600 text-white";
}

```

---

### File: `apps/package-lock.json`

*[Lock file - content omitted]*

---

### File: `docs/Complete-Blueprint-From-Scratch-Enterprise-SaaS-FnB.md`

```markdown
# Complete Blueprint: Enterprise SaaS untuk UMKM F&B (Dibangun dari Nol)

**Versi:** 1.0 Final  
**Tanggal:** 9 Juni 2026  
**Tujuan:** Blueprint lengkap, actionable, dan future-proof untuk solo developer (dengan AI coding partner) yang ingin membangun sistem SaaS multi-tenant level enterprise professional.  
**Fokus:** Minimalkan perubahan kode saat migrasi infra jika kuota melonjak. Target pengguna: UMKM F&B Indonesia (awal Surabaya), harga ramah, self-service, gaptek-friendly, mobile-first.

**Prinsip Utama Blueprint Ini:**
- Tech stack dipilih agar **hanya infra yang diganti** saat scale (bukan rewrite aplikasi).
- Fitur enterprise professional tapi alur sederhana.
- Self-service penuh + preview.
- Harga berdasarkan jumlah cabang (Startup = 1 cabang full enterprise, Professional = max 3, Enterprise = unlimited).

---

## 1. Tech Stack Terbaik 100% dari Awal (Future-Proof dengan Minimal Migration Pain)

### Stack yang Direkomendasikan (Paling Cocok untuk Kasus Kamu)

**Frontend & Full-Stack Framework**
- Next.js 16 (App Router) + TypeScript + React 19
- Tailwind CSS v4 + shadcn/ui (komponen enterprise-grade yang mudah di-custom)
- Turborepo (monorepo) — wajib dari hari pertama

**Monorepo Structure (Apps)**
- `apps/customer` → Customer Portal (public)
- `apps/admin` → Admin/Karyawan (kasir + dapur)
- `apps/owner` → Owner Dashboard (executive)
- `packages/shared` → Types, utils, API contracts
- `packages/ui` → Shared komponen

**Database & Data Layer**
- **Primary DB:** Neon Postgres (serverless Postgres) atau PlanetScale
  - Alasan: Postgres penuh (bisa pakai RLS, extensions, SQL native), branching untuk testing multi-tenant, sangat portable.
- **ORM:** Drizzle ORM (ringan, type-safe, mudah migrasi)
- **Migrations:** Drizzle Kit

**Auth**
- Better Auth atau Clerk (fleksibel, organization/tenant support, mudah swap ke Auth0/WorkOS nanti)

**Realtime (Order Queue, Tracking)**
- Ably atau Pusher (bisa mulai dengan Supabase Realtime dulu, lalu ganti tanpa ubah banyak kode karena pakai abstraction layer)

**Hosting & Infra (Pilih yang Mudah Diganti)**
- **Frontend (Customer + Admin + Owner):** Vercel (terbaik untuk Next.js)
- **Backend / API / Jobs:** Railway atau Render (container pricing predictable)
- **Edge / DNS / Domain Automation:** Cloudflare (API bagus, Registrar murah)
- **Storage (bukti QRIS, foto menu):** Cloudflare R2 atau Supabase Storage (mudah dipindah ke S3)

**Payments & Integrasi Lokal**
- Xendit atau Midtrans (QRIS dynamic + webhook)
- WhatsApp Business API (untuk notifikasi & laporan)

**Lainnya**
- Email: Resend
- Monitoring & Analytics: Sentry + PostHog (self-hosted friendly)
- Background Jobs: Trigger.dev atau Inngest
- AI: Google Gemini (via API, mudah diganti)

### Mengapa Stack Ini Terbaik dari Awal?
- **Next.js + Postgres** = portable. Bisa deploy ke Vercel hari ini, pindah ke AWS ECS besok tanpa ubah logic bisnis.
- **Container-based backend (Railway/Render)** = lebih predictable cost daripada pure serverless.
- **Drizzle + Postgres** = tidak vendor lock-in seperti Supabase Realtime penuh.
- **Monorepo dari hari pertama** = mudah scale tim nanti.
- **Abstraction untuk Realtime/Auth** = ganti provider tanpa rewrite halaman.

### Rencana Migrasi Minimal (Hanya Ganti Infra)
- **Fase 1 (Launch – 80 tenant):** Vercel + Neon + Railway + Cloudflare
- **Fase 2 (Growth – 200 tenant):** Tambah Cloudflare Workers untuk sebagian API. Pindah DB ke PlanetScale jika lebih murah.
- **Fase 3 (Hardcore – 300+ tenant atau tim ada):** 
  - Frontend tetap Vercel atau pindah Cloudflare Pages.
  - Backend ke AWS ECS/Fargate atau GCP Cloud Run.
  - DB ke Aurora Serverless atau self-hosted Postgres.
  - Auth ke WorkOS (jika butuh SSO Enterprise).
- **Tidak perlu rewrite** aplikasi karena semua logic bisnis di Next.js + Drizzle (hanya config infra yang berubah).

---

## 2. Halaman & Fitur Detail per Role (Enterprise Professional Level)

### A. Customer App (Role: Pelanggan / End User)
Tujuan: Mudah order, tracking, mobile-first. Self-service.

**Halaman & Fitur Detail:**

1. **Home / Landing** (`/`)
   - Hero dengan branding tenant (logo, warna, nama bisnis)
   - Menu terlaris + highlight
   - Keunggulan (halal, cepat, tanpa ojol, fresh daily)
   - Cara order (3 langkah visual)
   - Testimonial (bisa dinamis per tenant)
   - Lokasi + jam operasional + peta (Leaflet)
   - Floating buttons: Chat WA + Cart

2. **Menu** (`/menu`)
   - Filter kategori (Martabak Telur, Terang Bulan, Paket, Minuman, dll)
   - Search + sort (Terlaris, Harga, Rekomendasi)
   - Grid kartu dengan badge (Terlaris, Baru, Habis, Promo)
   - Klik kartu → buka modal detail

3. **Menu Detail** (`/menu/[slug]`)
   - Foto besar + deskripsi
   - Varian (jumlah telur, isian Ayam/Sapi)
   - Topping selector (untuk Terang Bulan) + extra topping
   - Quantity + catatan khusus
   - Harga real-time + tombol "Tambah ke Keranjang"
   - Estimasi waktu persiapan

4. **Cart** (`/cart`)
   - Daftar item + edit (quantity, varian, topping, catatan)
   - Subtotal, delivery fee (zona-based), promo code
   - Estimasi total & waktu

5. **Checkout** (`/checkout`)
   - Form: Nama, No HP, Tipe order (Pickup/Delivery)
   - Alamat + peta interaktif (Leaflet + geolocation)
   - Pilihan bayar (COD / QRIS/Transfer)
   - Validasi promo server-side
   - Ringkasan + tombol "Buat Pesanan"
   - Setelah sukses → redirect ke tracking + kode order

6. **Tracking** (`/tracking`)
   - Input kode order atau auto dari session
   - Status real-time: received → processing → ready → completed/cancelled
   - Detail item + estimasi waktu
   - Tombol chat WA otomatis

7. **Lainnya (Opsional tapi Enterprise):**
   - About, Contact, FAQ, Gallery, Promo, Catering
   - Order History (jika login sederhana)
   - AI Chatbot (Gemini) untuk rekomendasi menu

**Koneksi:**
- Order → langsung ke Admin via Realtime
- Status update dari Admin → update di halaman ini

---

### B. Admin / Karyawan App (Role: Kasir + Dapur – Gabungan)
Tujuan: 1 app untuk 1-2 orang per outlet. Kasir handle pembayaran & laporan. Dapur handle produksi & checklist.

**Halaman & Fitur Detail:**

1. **Login + Buka Shift**
   - Username/password (tenant-aware)
   - Input uang modal awal laci
   - Otomatis buat shift record + log

2. **Dashboard Utama (Real-time)**
   - Header: Status toko, nama operator, jam real-time, koneksi
   - Panel Kiri: **Order Queue** (semua order dengan filter status: received/processing/ready/completed)
   - Alarm suara saat order baru masuk
   - Panel Kanan: **Order Detail** (item lengkap + varian + topping + catatan + bukti bayar jika QRIS)
   - Action cepat: Update status, Konfirmasi bayar (manual QRIS), Cancel dengan alasan, Print struk

3. **Dapur / Production Checklist**
   - Daftar menu yang harus diproduksi hari ini (berdasarkan order masuk)
   - Checklist bahan yang digunakan (dari order_items)
   - Tombol "Selesai Produksi" per item/batch
   - Catat waste/spoilage (reason code)

4. **Shift & Kas Management**
   - Modal Rekap Harian (omset bersih, breakdown COD vs QRIS, kas diharapkan vs aktual, drift)
   - Tutup shift + export CSV + thermal print Z-Report
   - Kirim laporan otomatis ke WA Owner

5. **Menu & Availability**
   - Toggle is_available untuk menu & topping
   - Lihat HPP dasar (jika diizinkan)

6. **Riwayat & Laporan**
   - Riwayat order per shift
   - Audit log aksi kasir
   - Shift history

**Koneksi:**
- Realtime dari Customer
- Update status → sync ke Customer Tracking
- Data shift/rekap → langsung ke Owner Dashboard

---

### C. Owner Dashboard (Role: Owner / Pemilik Bisnis – Executive)
Tujuan: High-level visibility, decision making, approval. Bukan operasional harian. Enterprise feel.

**Halaman & Fitur Detail:**

1. **Executive Cockpit** (Halaman Utama)
   - KPI Cards: Revenue (hari/MTD/YTD), Gross Margin, Food Cost %, Labor Cost %, Waste %, Avg Order Value, Active Orders
   - Charts: Revenue trend (multi-cabang), Top 10 menu by revenue/margin, Hourly sales heatmap, Cabang performance comparison
   - AI Insights otomatis (Gemini)
   - Critical Alerts (stok rendah, revenue drop, drift kas tinggi, order backlog)
   - Quick actions (Add Branch, View Today Report, AI Chat)

2. **Branches / Cabang Management**
   - Daftar cabang + KPI per cabang
   - Tambah/edit cabang + onboarding wizard
   - Performance benchmarking antar cabang
   - Inter-branch stock transfer request & approval

3. **Menu & Recipe (BOM)**
   - Master menu + varian
   - Recipe editor (tree bahan baku + qty + waste factor)
   - HPP otomatis + margin calculator
   - Menu Engineering matrix (Star/Plowhorse/Puzzle/Dog)
   - Deploy menu ke cabang tertentu + price override per cabang

4. **Inventory & Procurement**
   - Stock overview per cabang + total
   - Low stock + expiring alerts
   - Waste log + analytics (by reason, by item, by cabang)
   - Supplier management + Purchase Order + 3-way matching
   - Stock count (cycle/physical) dengan mobile support

5. **Finance & Cash**
   - Consolidated P&L (per cabang & total)
   - Cash flow forecast (7/30 hari)
   - Shift reconciliation summary (semua cabang)
   - Tax center (PPN, e-Faktur Coretax siap, QRIS)
   - Budget vs Actual

6. **Production & Operations**
   - Daily Production Plan (AI suggested berdasarkan forecast + order)
   - Yield & variance report
   - Kitchen capacity overview

7. **Sales & Customer Analytics**
   - Sales breakdown (channel, time, menu, cabang, salesperson)
   - Promotion & discount performance
   - Customer insights (repeat rate, LTV, favorite items)
   - Cohort analysis sederhana

8. **HR & Workforce**
   - Headcount & labor cost % per cabang
   - Shift schedule overview (visual)
   - Performance leaderboard kasir
   - Recruitment pipeline (untuk ekspansi)

9. **Approvals & Governance**
   - Pending queue (PO besar, discount > threshold, refund, inter-branch transfer)
   - Multi-level approval workflow (configurable)
   - Full audit logs (searchable, filter by user/cabang/action)

10. **AI Insights & Forecasting**
    - Demand forecast per cabang (7/30 hari)
    - What-if simulator (naikkan harga 10% → impact?)
    - Anomaly detection
    - Natural language query ("Berapa food cost cabang Demak bulan ini?")
    - AI Chat full-screen

11. **Settings & Configuration**
    - Company & branding (logo, warna, template)
    - User management (Owner, Manager, Kasir) + role & permission
    - Tax & payment config (QRIS keys, e-Faktur serial)
    - Integration (WA, delivery platform, accounting export)
    - Subscription & billing (untuk SaaS tenants)
    - Audit logs full

**Koneksi:**
- Semua data agregat dari Admin + Customer
- Realtime update
- Approval dari sini → effect langsung ke Admin

---

## 3. Estimasi Biaya yang Dibayarkan oleh User (UMKM Owner)

**Model:** Harga berdasarkan jumlah cabang. Domain dibeli provider (biaya termasuk).

### Harga Awal Launch (Tahun Pertama)

- **Startup (1 cabang – Full Enterprise Features)**
  - Awal: Rp 500.000
  - Bulanan: Rp 200.000
  - Tahunan: Rp 2.000.000 (diskon)

- **Professional (Maks 3 cabang – Full Features)**
  - Awal: Rp 800.000
  - Bulanan: Rp 200.000
  - Tahunan: Rp 2.200.000 (diskon)

- **Enterprise (Unlimited cabang + Custom)**
  - Awal: Rp 1.000.000
  - Bulanan: Rp 200.000
  - Tahunan: Rp 2.400.000 (diskon)
  - + Custom development (dihitung terpisah)

### Estimasi di Tahun Berikutnya (Saat Scale)

- Naikkan harga pelanggan **baru** 20-40% (Startup jadi Rp 250-299rb/bulan).
- Pelanggan lama tetap harga lama (minimal 2 tahun).
- Enterprise selalu custom + usage-based (misal tambahan per cabang atau per 1.000 order).

**Yang Termasuk dalam Harga:**
- 3 aplikasi (Customer + Admin + Owner)
- Domain + subdomain setup
- Hosting & database
- Update fitur dasar
- Support WhatsApp (respon 24 jam)
- Template F&B default

---

## 4. Penjelasan Lebih Detail Lainnya

### Multi-Tenant & Self-Service
- 1 database (Postgres) dengan `tenant_id` di hampir semua tabel + RLS.
- Onboarding: User bayar → isi form (nama, logo, warna, alamat, WA, template) → Preview real-time (tampilkan domain + subdomain yang akan dipakai) → Sistem otomatis beli domain (via Cloudflare API), tambah custom domain ke Vercel, seed data template, buat user owner pertama.
- Preview sangat penting untuk gaptek-friendly.

### Domain & Subdomain
- Provider beli domain utama atas nama klien.
- Struktur: `namabisnis.com` (Customer) | `admin.namabisnis.com` (Admin) | `owner.namabisnis.com` (Owner)
- Otomatis via API saat onboarding.

### Data Model Inti (High-Level)
- tenants, profiles (user + role), categories, menu_items, menu_variants, toppings, recipes, recipe_ingredients, inventory, orders, order_items, shifts, shift_logs, audit_logs, suppliers, purchase_orders, promotions.

### Indonesia-Specific (Wajib)
- QRIS (manual di awal, dynamic di Enterprise)
- e-Faktur Coretax (siap di Owner)
- PPN calculation (11/12 DPP)
- WhatsApp Business API untuk notifikasi & laporan harian
- Bahasa Indonesia utama + English opsional

### Monitoring & Alert (Wajib dari Awal)
- Track: Jumlah tenant aktif, active users per tenant, order/hari, DB size, bandwidth, biaya infra.
- Alert otomatis (Telegram/Slack pribadi) saat mendekati 70% limit.

### Roadmap Build dari Nol (Realistis untuk Solo + AI)
- Minggu 1-3: Monorepo + auth + multi-tenant dasar + DB schema
- Minggu 4-7: Customer App lengkap + Admin (kasir + dapur)
- Minggu 8-10: Owner Dashboard + inventory + recipe + AI dasar
- Minggu 11-12: Self-service onboarding + domain automation + preview
- Minggu 13+: Polish, dokumentasi, early access 5-10 tenant

### Biaya Infra untuk Kamu (Developer)
- Awal (10-20 tenant): Rp 1-2 juta/bulan (Vercel Pro + Neon + Railway)
- Saat 100 tenant: Rp 8-15 juta/bulan (upgrade tier)
- Saat migrasi: Siapkan cadangan 30-40% revenue untuk infra.

**Catatan Penting:** Harga di atas dirancang ramah UMKM Surabaya. Jangan naikkan terlalu cepat untuk pelanggan lama.

---

Blueprint ini sudah siap digunakan sebagai panduan coding dari nol. Semua elemen (stack, halaman, fitur, biaya, migrasi minimal) sudah disatukan dan konsisten dengan diskusi kita sebelumnya.

Mau saya pecah menjadi file pendukung (contoh: full Drizzle schema, monorepo folder structure detail, contoh API route onboarding, atau cost calculator spreadsheet)? Atau langsung mulai dengan salah satu bagian (misalnya schema database lengkap)? 

Langsung beri tahu prioritasmu. Saya siap bantu sampai selesai.
```

---

### File: `docs/Complete-Project-Start-Guide-Multi-Tenant-FnB-SaaS.md`

```markdown
# Complete Project Start Guide: Multi-Tenant Enterprise F&B SaaS (From Zero)

**Versi:** 1.0  
**Tanggal:** 9 Juni 2026  
**Tujuan Dokumen:** Satu file panduan utama untuk memulai coding dari nol dengan pendekatan **multi-tenant dari hari pertama**. A6 Nyuss hanya sebagai **kaca pembanding** (referensi desain, data contoh menu/varian/topping, alur bisnis, dan testing). Sistem ini langsung dirancang untuk distribusi ke banyak UMKM F&B.

**Komitmen Waktu Kamu:** ~20 jam/hari efektif (full day kecuali 4 jam istirahat/tidur).

---

## 1. Jawaban atas Pertanyaan Kamu

### Apakah Semua File Workspace Bermanfaat?
**Tidak semua.** Beberapa sudah usang atau kurang relevan.

**File yang WAJIB dibaca & dipakai sekarang (prioritas tinggi):**
- `Master-Conversation-Summary-and-Final-Blueprint.md` → Ringkasan seluruh obrolan + keputusan akhir.
- `Full-Implementation-Blueprint-All-Parts.md` → Blueprint implementasi teknis (Drizzle, monorepo, API onboarding, biaya).
- `Complete-Blueprint-From-Scratch-Enterprise-SaaS-FnB.md` → Detail halaman & fitur (sudah di-update di dokumen ini).
- `Migration-Plan-Quotas-and-Scaling.md` → Rencana migrasi & kuota (penting untuk jangka menengah).
- `Free-Tier-Quotas-and-Tech-Stack-Assessment.md` → Penjelasan kuota free & rekomendasi stack.

**File yang bisa diarsipkan (kurang perlu sekarang):**
- File audit pertanyaan & jawaban (sudah lewat).
- File pricing & diskusi awal yang sudah direvisi berkali-kali.
- File yang membahas Odoo secara umum (sebelum fokus ke multi-tenant F&B).

**Rekomendasi:** Buat folder `docs/current/` untuk file penting di atas, dan `docs/archive/` untuk sisanya.

### Apakah Semua yang Dibutuhkan untuk Mulai Coding Sudah Lengkap?
**Hampir lengkap (80-85%)**. 

**Sudah sangat lengkap:**
- Visi, pricing, arsitektur, alasan stack.
- Detail halaman + fitur untuk ketiga app.
- Tech stack + rencana migrasi minimal.
- Struktur monorepo + contoh Drizzle + contoh API.
- Estimasi biaya.

**Yang masih kurang (bisa dibuat dalam 1-2 hari):**
- Schema database siap copy-paste (Drizzle migration lengkap).
- Step-by-step setup proyek hari pertama sampai bisa jalan.
- Contoh `.env` dan konfigurasi.

**File yang perlu kamu pakai untuk mulai:**
1. Dokumen ini (`Complete-Project-Start-Guide-Multi-Tenant-FnB-SaaS.md`) sebagai panduan utama.
2. `Full-Implementation-Blueprint-All-Parts.md` (bagian Drizzle & monorepo).
3. `Master-Conversation-Summary-and-Final-Blueprint.md` (untuk konteks keseluruhan).

---

## 2. Rekomendasi Pendekatan (Sesuai Klarifikasi Terakhirmu)

**Ya, ikuti keinginanmu:**  
Bangun **multi-tenant dari hari pertama**.  
A6 Nyuss hanya sebagai **kaca pembanding** (referensi desain UI/UX, data menu contoh, varian, topping, alur bisnis, dan testing).  

Bukan sebagai tenant utama. Begitu sistem stabil, kamu bisa langsung distribusikan ke UMKM lain.

Ini adalah pendekatan terbaik untuk tujuan akhirmu (mendistribusikan web app ke UMKM).

---

## 3. Tech Stack (Final dari Awal)

- Monorepo: Turborepo + pnpm
- Frontend: Next.js 16 (App Router) + TypeScript + React 19
- UI: Tailwind v4 + shadcn/ui
- Database: Neon Postgres atau PlanetScale + Drizzle ORM
- Auth: Better Auth (tenant-aware)
- Realtime: Ably (bisa mulai dengan Supabase Realtime + abstraction)
- Hosting: Vercel (frontend) + Railway/Render (backend)
- Domain Automation: Cloudflare (Registrar + API)
- Storage: Cloudflare R2
- Payments: Xendit / Midtrans
- AI: Google Gemini

**Alasan:** Stack ini portable. Hanya infra yang berubah saat migrasi, bukan logic bisnis.

---

## 4. Detailed UI/UX & Fitur per Halaman (Ketiga Web App)

### 4.1 Customer App (Pelanggan)

**Tujuan:** Mudah order, tracking. Mobile-first, gaptek-friendly.

**Halaman & Detail Fitur:**

1. **Home / Landing (`/`)**
   - Hero dengan branding tenant (logo, warna, nama, tagline).
   - Menu Favorit (6 kartu).
   - Keunggulan (4 poin visual).
   - Cara Order (3 langkah besar).
   - Testimonial.
   - Lokasi + Jam + Peta (Leaflet).
   - Floating: Chat WA + Keranjang (dengan badge).

2. **Menu (`/menu`)**
   - Filter kategori (horizontal scroll/tab).
   - Search + Sort.
   - Grid kartu: Foto + Nama + Harga + Badge (Terlaris/Baru/Habis).
   - Klik → Modal atau halaman detail.

3. **Menu Detail (`/menu/[slug]`)**
   - Foto besar + deskripsi.
   - Varian: Jumlah Telur (radio 1-7), Isian (Ayam/Sapi).
   - Terang Bulan: Topping utama + Extra Topping (checkbox).
   - Quantity + Catatan textarea.
   - Harga real-time.
   - Tombol besar "Tambah ke Keranjang".

4. **Cart (`/cart`)**
   - List item + edit quantity/varian/topping.
   - Subtotal + Ongkir (zona) + Promo input.
   - Estimasi waktu.
   - Tombol "Lanjut Checkout".

5. **Checkout (`/checkout`)**
   - Form: Nama, HP.
   - Tipe: Pickup / Delivery (dengan peta Leaflet + geolocation).
   - Metode bayar: COD / QRIS (upload bukti).
   - Ringkasan + Total.
   - Tombol "Buat Pesanan".

6. **Tracking (`/tracking/[code]`)**
   - Timeline status real-time (Received → Processing → Ready → Completed).
   - Detail pesanan.
   - Tombol Chat WA otomatis.

**Koneksi:** Order → Realtime ke Admin. Status update dari Admin → Update di sini.

---

### 4.2 Admin / Karyawan App (Kasir + Dapur Gabungan)

**Tujuan:** 1 app untuk 1-2 orang per outlet. Kasir + produksi.

**Halaman & Detail Fitur:**

1. **Login + Buka Shift**
   - Form login.
   - Input uang modal laci.
   - Tombol "Buka Shift".

2. **Dashboard Utama**
   - Header: Operator, jam, status toko.
   - Kiri: Order Queue (filter status, alarm suara saat order baru).
   - Kanan: Order Detail (item + varian + topping + catatan + bukti).
   - Action: Update status, Konfirmasi bayar, Cancel, Print struk.

3. **Dapur / Produksi**
   - Checklist menu yang harus diproduksi.
   - Input bahan digunakan.
   - Tombol "Selesai".
   - Form catat Waste (alasan + qty).

4. **Kas & Shift**
   - Rekap otomatis (omset, COD vs QRIS, kas diharapkan).
   - Input kas aktual → Hitung drift.
   - Tutup shift + Export CSV + Thermal print + Kirim WA ke Owner.

5. **Menu & Availability**
   - Toggle tersedia/habis untuk menu & topping.

6. **Riwayat**
   - Riwayat order & shift.
   - Log aktivitas.

**Koneksi:** Realtime dari Customer. Data shift → Owner Dashboard.

---

### 4.3 Owner Dashboard (Executive)

**Tujuan:** High-level view, keputusan, kontrol. Enterprise feel.

**Halaman & Detail Fitur:**

1. **Executive Cockpit**
   - KPI Cards (Revenue, Margin, Food Cost %, Labor Cost %, Waste, Order, dll).
   - Charts (Revenue trend, Top menu, Cabang performance, Heatmap jam sibuk).
   - AI Insights otomatis.
   - Alerts.
   - Quick actions.

2. **Cabang**
   - Daftar cabang + KPI.
   - Tambah cabang.
   - Perbandingan performa.
   - Transfer stok antar cabang (request & approval).

3. **Menu & Recipe (BOM)**
   - Master menu.
   - Editor Resep (bahan + qty + biaya) → HPP otomatis.
   - Menu Engineering Matrix.
   - Deploy ke cabang + price override.

4. **Inventory & Procurement**
   - Stock overview per cabang.
   - Low stock & expiring alerts.
   - Waste log + analisis.
   - Supplier + PO.

5. **Finance**
   - P&L konsolidasi per cabang.
   - Cash flow forecast.
   - Rekap shift.
   - Tax (PPN, e-Faktur Coretax).

6. **Production & Operations**
   - Production plan (AI).
   - Yield report.

7. **Sales & Analytics**
   - Breakdown lengkap.
   - Promo performance.
   - Customer insights.

8. **HR & Shift**
   - Headcount & labor cost %.
   - Shift overview.
   - Performance.

9. **Approvals**
   - Pending queue (PO besar, discount, refund, transfer).
   - Approve/Reject + catatan.
   - History.

10. **AI Insights & Forecasting**
    - Demand forecast.
    - What-if simulator.
    - Anomaly detection.
    - Natural language query + full AI chat.

11. **Settings**
    - Branding.
    - User management (role & permission).
    - Tax & payment config.
    - Integrations.
    - Full audit logs.

**Koneksi:** Semua data dari Admin + Customer. Realtime. Approval → effect ke Admin.

---

## 5. Project Folder Structure (Monorepo)

```
fnb-saas/
├── apps/
│   ├── customer/
│   ├── admin/
│   └── owner/
├── packages/
│   ├── db/                 # Drizzle + migrations + seed
│   ├── ui/                 # Shared shadcn
│   ├── shared/             # Types, utils, API contracts
│   └── config/
├── scripts/                # seed, automation
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 6. Langkah Memulai Coding (Dengan 20 Jam/Hari)

**Minggu 1:** Foundation (monorepo + DB + multi-tenant dasar + auth).
**Minggu 2-4:** Customer App lengkap + Admin dasar.
**Minggu 5-7:** Owner Dashboard + enterprise core (Menu, Inventory, Finance).
**Minggu 8+:** Multi-cabang, AI, Self-service onboarding.

**Mulai dari:** Setup monorepo → Drizzle schema → Tenant resolver.

---

**Dokumen ini + `Full-Implementation-Blueprint-All-Parts.md` + `Master-Conversation-Summary-and-Final-Blueprint.md` adalah 3 file utama yang kamu butuhkan untuk mulai.**

Semua sudah lengkap untuk memulai. 

Mau saya buat file terpisah sekarang (Drizzle schema lengkap, atau step-by-step setup hari 1-3)? Langsung bilang. Saya siap.
```

---

### File: `docs/Complete-UI-UX-and-Project-Structure-Blueprint.md`

```markdown
# Complete UI/UX & Project Structure Blueprint
## Multi-Tenant Enterprise F&B SaaS (Built from Scratch)

**Versi:** 1.0  
**Tanggal:** 9 Juni 2026  
**Tujuan:**  
Dokumen ini adalah **panduan utama dan paling detail** untuk memulai proyek dari nol.  
A6 Nyuss hanya digunakan sebagai **kaca pembanding** (referensi desain, data contoh, dan validasi fitur).  
Semua sistem dibangun sebagai **Multi-Tenant SaaS** dari hari pertama agar langsung siap didistribusikan ke UMKM lain.

**Komitmen Waktu Kamu:** ~20 jam/hari efektif (full day kecuali 4 jam istirahat/tidur).

---

## 1. Project Philosophy & Approach

### Keputusan Final (Sesuai Klarifikasi Terakhirmu)
- **Multi-tenant dari hari pertama** (bukan single-tenant dulu).
- A6 Nyuss = **hanya referensi/kaca pembanding**, bukan tenant utama.
- Bangun **3 aplikasi terpisah** dalam satu monorepo:
  1. Customer App (untuk pelanggan)
  2. Admin/Karyawan App (gabungan Kasir + Dapur)
  3. Owner Dashboard (untuk pemilik bisnis)
- Tujuan: Sekali dibangun dengan kualitas enterprise, bisa langsung digunakan oleh banyak UMKM.

### Prinsip Desain
- **Enterprise Professional**: Fitur lengkap (BOM, Inventory, Forecasting, Approval, Audit, AI Insight, Multi-cabang, dll).
- **Gaptek-Friendly & Mobile-First**: UI sederhana, besar, jelas, banyak panduan visual.
- **Self-Service**: Onboarding dengan preview real-time.
- **Harga berdasarkan cabang** (Startup = 1 cabang full fitur Enterprise, Professional = max 3 cabang, Enterprise = unlimited).

---

## 2. Tech Stack (Final dari Awal)

- **Monorepo**: Turborepo + pnpm
- **Framework**: Next.js 16 (App Router) + TypeScript + React 19
- **UI**: Tailwind CSS v4 + shadcn/ui
- **Database**: Neon Postgres atau PlanetScale + **Drizzle ORM**
- **Auth**: Better Auth (tenant-aware)
- **Realtime**: Ably (atau mulai dengan Supabase Realtime + abstraction layer)
- **Hosting**:
  - Frontend: Vercel
  - Backend / Jobs: Railway atau Render
- **Domain & Automation**: Cloudflare (Registrar + API + Workers)
- **Storage**: Cloudflare R2
- **Payments**: Xendit / Midtrans (QRIS)
- **AI**: Google Gemini
- **Monitoring**: Sentry + PostHog

**Alasan Stack Ini**:
- Mudah dimigrasi nanti (hanya ganti infra).
- Cocok untuk solo dev + AI coding partner.
- Cost lebih predictable dibanding pure Supabase + Vercel di skala menengah.

---

## 3. High-Level Architecture

- 1 Database (Postgres) dengan `tenant_id` di hampir semua tabel.
- Setiap UMKM = 1 **Tenant**.
- 3 aplikasi mengakses data yang sama dengan filter `tenant_id`.
- Domain routing:
  - `namabisnis.com` → Customer App
  - `admin.namabisnis.com` → Admin/Karyawan App
  - `owner.namabisnis.com` → Owner Dashboard
- Onboarding: User bayar → Isi form → Preview real-time (tampilkan domain + subdomain) → Sistem otomatis buat tenant, beli domain, setup Vercel, seed data template.

---

## 4. Detailed UI/UX & Features per Application

### 4.1 Customer App (Pelanggan)

**Tujuan**: Pelanggan bisa dengan mudah melihat menu, memilih varian/topping, order, dan tracking. Sangat mobile-first.

#### Halaman Lengkap + Detail Fitur

**1. Home / Landing (`/`)**
- Hero besar dengan branding tenant (logo, warna utama, nama bisnis, tagline).
- Section "Menu Favorit" (6 kartu menu terlaris).
- Section "Kenapa Memilih Kami" (4 kartu keunggulan).
- Section "Cara Order" (3 langkah visual dengan nomor besar).
- Section Testimonial (slider atau grid).
- Section Lokasi (alamat lengkap + Google Maps embed + jam operasional + status Buka/Tutup).
- Floating buttons (kanan bawah): 
  - Tombol Chat WhatsApp (dengan template pesan).
  - Tombol Keranjang (dengan badge jumlah item).

**2. Menu (`/menu`)**
- Header dengan search bar + filter kategori (horizontal scroll atau tab).
- Kategori: Martabak Telur Ayam, Martabak Telur Bebek, Terang Bulan, Paket Bundling, Minuman.
- Sorting: Terlaris | Harga Terendah | Harga Tertinggi | Rekomendasi.
- Grid responsif kartu menu:
  - Foto (aspect ratio 1:1)
  - Nama menu
  - Harga
  - Badge (🔥 Terlaris, ✨ Baru, Habis)
  - Klik kartu → buka modal atau navigasi ke detail.

**3. Menu Detail (`/menu/[slug]`)**
- Layout: Foto besar di atas (atau kiri di desktop).
- Nama menu + Harga besar.
- Deskripsi.
- **Varian Section**:
  - Martabak: Radio button "Jumlah Telur" (1-7) + "Isian" (Ayam / Sapi).
  - Terang Bulan: Pilihan Topping Utama + Checkbox "Extra Topping".
- Quantity selector (+ / -).
- Textarea "Catatan untuk Dapur".
- Harga total yang berubah real-time.
- Tombol besar "Tambah ke Keranjang" (sticky di mobile).

**4. Cart (`/cart`)**
- Daftar item dengan foto kecil.
- Untuk setiap item: Nama + Varian/Topping + Harga satuan + Quantity editor.
- Ringkasan di bawah:
  - Subtotal
  - Ongkir (otomatis berdasarkan zona)
  - Diskon (jika ada promo)
  - Total
- Input "Kode Promo" + tombol Apply.
- Tombol besar "Lanjut ke Pembayaran".

**5. Checkout (`/checkout`)**
- Form 2 kolom (mobile: stacked):
  - Data Pelanggan: Nama Lengkap, Nomor HP.
  - Tipe Order: Radio (Ambil Sendiri / Diantar).
  - Jika Diantar:
    - Input alamat lengkap.
    - Peta interaktif (Leaflet) + tombol "Gunakan Lokasi Saya".
    - Ongkir otomatis dihitung.
- Metode Pembayaran:
  - COD (Bayar di Tempat)
  - QRIS / Transfer (tampilkan QR statis + upload bukti).
- Ringkasan pesanan (sticky di desktop).
- Tombol "Buat Pesanan Sekarang".

**6. Tracking (`/tracking` atau `/tracking/[orderCode]`)**
- Jika belum punya kode: Form input kode order.
- Timeline visual status:
  - Received (hijau) → Processing → Ready → Completed (atau Cancelled merah).
- Detail pesanan lengkap.
- Estimasi waktu.
- Tombol "Chat WhatsApp" (auto isi pesan dengan kode order).

---

### 4.2 Admin / Karyawan App (Kasir + Dapur)

**Tujuan**: Satu aplikasi untuk operasional harian. Dirancang untuk 1-2 orang per outlet.

#### Halaman Lengkap + Detail Fitur

**1. Login + Buka Shift**
- Logo + nama bisnis tenant.
- Form: Username / Email + Password.
- Input "Uang Modal Awal Laci" (default Rp 200.000).
- Tombol besar "Buka Shift & Masuk".

**2. Dashboard Utama (Halaman Utama)**
- Top bar: Nama operator, Jam real-time, Tombol "Tutup Toko", Status Koneksi.
- **Kiri (40%)**: Order Queue
  - Tabs: Semua | Baru | Sedang Dibuat | Siap Diambil
  - Daftar kartu order (klik untuk detail).
  - Setiap kartu menampilkan: Kode Order, Nama Pelanggan, Total, Tipe, Waktu.
  - Alarm suara + visual flash saat order baru.
- **Kanan (60%)**: Order Detail
  - Header: Kode Order + Status (dengan warna).
  - Daftar item lengkap + varian + topping + catatan.
  - Bukti pembayaran (jika QRIS/Transfer) dengan tombol "Lihat Foto".
  - Action Buttons (besar):
    - "Mulai Proses" / "Selesai Dibuat" / "Siap Diambil" / "Selesai"
    - "Konfirmasi Pembayaran"
    - "Batalkan Pesanan" (dengan alasan)
    - "Cetak Struk"

**3. Dapur / Produksi**
- Daftar "Menu yang Harus Diproduksi Hari Ini".
- Setiap item punya checklist + tombol "Selesai".
- Section "Catat Bahan yang Digunakan".
- Form "Catat Waste / Rusak" (pilih alasan + qty).

**4. Kas & Shift**
- Ringkasan otomatis: Omset, COD vs Non-Cash, Kas Diharapkan.
- Input "Kas Aktual di Laci".
- Tampilkan Drift (lebih/kurang).
- Tombol: "Tutup Shift" → Otomatis export CSV + Print Thermal + Kirim WA ke Owner.

**5. Menu & Stok**
- Daftar semua menu dengan toggle "Tersedia" / "Habis".
- Toggle Topping (khusus Terang Bulan).
- Lihat HPP (jika role diizinkan).

**6. Riwayat**
- Riwayat Order (filter tanggal).
- Riwayat Shift.
- Log Aktivitas Kasir.

---

### 4.3 Owner Dashboard (Executive)

**Tujuan**: Memberikan gambaran besar bisnis. Fokus pada keputusan, kontrol, dan pertumbuhan.

#### Halaman Lengkap + Detail Fitur

**1. Executive Cockpit (Dashboard Utama)**
- Grid KPI Cards (bisa di-custom):
  - Revenue (Hari Ini / Bulan Ini / Tahun Ini + persentase growth)
  - Gross Margin %
  - Food Cost %
  - Labor Cost %
  - Waste %
  - Jumlah Order + AOV
- Charts utama:
  - Line chart Revenue Trend (bisa switch per cabang)
  - Bar chart Top Menu by Revenue & Margin
  - Pie chart Revenue by Cabang
  - Heatmap Jam Sibuk
- AI Insights box (3-5 insight otomatis).
- Alerts panel (merah/oranye/kuning).
- Quick Action buttons.

**2. Cabang**
- Tabel semua cabang + KPI ringkas.
- Tombol "Tambah Cabang Baru".
- Perbandingan performa antar cabang.
- Request & Approval Transfer Stok antar cabang.

**3. Menu & Resep (BOM)**
- Daftar master menu.
- Editor Resep: Tree view bahan baku + qty + biaya.
- Hitung HPP otomatis.
- Menu Engineering Matrix (visual 2x2).
- Deploy menu ke cabang tertentu.
- Riwayat perubahan harga.

**4. Persediaan & Pembelian**
- Overview stok (per cabang + total).
- Low Stock & Kadaluarsa Alerts.
- Log Waste + Analisis.
- Supplier list + Performance.
- Buat Purchase Order.

**5. Keuangan**
- Laporan Laba Rugi (P&L) per cabang & konsolidasi.
- Cash Flow Forecast.
- Rekap Shift semua cabang.
- Laporan Pajak (PPN, siap e-Faktur Coretax).

**6. Produksi & Operasional**
- Rencana Produksi Harian (AI recommended).
- Laporan Yield & Variance.
- Kapasitas Dapur.

**7. Penjualan & Analitik**
- Breakdown penjualan lengkap.
- Performa Promo.
- Analisis Pelanggan (Repeat Rate, Top Customer).

**8. SDM & Shift**
- Jumlah Karyawan & Biaya Tenaga Kerja %.
- Overview Jadwal Shift semua cabang.
- Leaderboard Performa.

**9. Persetujuan (Approvals)**
- Daftar yang menunggu persetujuan.
- Detail + tombol Setuju / Tolak + Catatan.
- Riwayat Persetujuan.

**10. AI & Peramalan**
- Demand Forecasting per cabang.
- Simulator "What If".
- Deteksi Anomali.
- Chat AI (bisa tanya apa saja tentang bisnis).

**11. Pengaturan**
- Branding & Template.
- Manajemen User & Hak Akses.
- Konfigurasi Pajak & Pembayaran.
- Integrasi (WhatsApp, Delivery Platform).
- Log Audit Lengkap.

---

## 5. Project Folder Structure (Monorepo)

```
fnb-saas/
├── apps/
│   ├── customer/                 # Next.js Customer App
│   ├── admin/                    # Next.js Admin/Karyawan App
│   └── owner/                    # Next.js Owner Dashboard
├── packages/
│   ├── db/                       # Drizzle schema, migrations, seed
│   ├── ui/                       # Shared components (shadcn)
│   ├── shared/                   # Types, utils, constants, API types
│   └── config/                   # Shared config (tailwind, eslint)
├── scripts/
│   ├── seed-template.ts          # Seed data F&B
│   └── domain-automation.ts
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 6. Struktur Lain yang Diperlukan

- **Database Schema**: Semua tabel utama harus punya `tenant_id`.
- **Middleware**: Resolver tenant berdasarkan hostname.
- **Environment Variables**: `NEXT_PUBLIC_TENANT_SLUG` (untuk dev), Vercel token, Cloudflare token, dll.
- **Preview System**: Untuk halaman onboarding (bisa pakai subdomain preview atau komponen mock).
- **Role & Permission**: owner | manager | kasir (per tenant).

---

## 7. Rekomendasi Cara Memulai (Dengan 20 Jam/Hari)

**Minggu 1**: Foundation
- Setup monorepo + 3 Next.js app
- Setup database + Drizzle + tabel `tenants`
- Setup Auth tenant-aware
- Tenant resolver (middleware)

**Minggu 2-4**: Bangun Customer App lengkap
**Minggu 5-7**: Bangun Admin App (kasir + dapur)
**Minggu 8-10**: Bangun Owner Dashboard + fitur enterprise inti
**Minggu 11-12**: Multi-cabang, AI, Self-Service Onboarding
**Minggu 13+**: Polish, Testing, Beta

---

**Dokumen ini adalah blueprint paling detail yang kamu minta.**

Apakah kamu ingin saya pecah menjadi file-file terpisah yang lebih actionable sekarang? Contoh:
- File Drizzle schema lengkap
- Step-by-step setup proyek hari pertama
- Detail komponen UI yang sering dipakai

Atau langsung mulai dengan salah satu bagian? Beritahu saya langkah berikutnya. Saya siap membantu sampai kamu benar-benar mulai coding.
```

---

### File: `docs/Domain-Subdomain-Setup-Guide.md`

```markdown
# Panduan Domain & Subdomain untuk SaaS F&B

**Tujuan Dokumen:** Menjelaskan cara kerja domain dan subdomain agar UMKM paham, serta panduan teknis setup untuk developer.

---

## 1. Konsep Dasar Domain & Subdomain

### Domain Utama (Main Domain)
Contoh: `martabakpakde.com`

Ini adalah domain yang dibeli UMKM. Biasanya digunakan untuk **Customer Portal** (situs yang dilihat pelanggan untuk order).

### Subdomain
Contoh:
- `admin.martabakpakde.com`
- `owner.martabakpakde.com`
- `app.martabakpakde.com`

Subdomain adalah "cabang" dari domain utama. **Tidak perlu beli domain baru** untuk membuat subdomain.

**Kesimpulan penting:**
- Klien hanya perlu beli **1 domain utama**.
- Subdomain bisa dibuat sebanyak mungkin **gratis** (hanya butuh setup DNS).

---

## 2. Rekomendasi Struktur Domain (Berdasarkan Diskusi Kita)

| Tujuan                  | Domain yang Disarankan          | Siapa yang Akses                  | Alasan |
|-------------------------|----------------------------------|-----------------------------------|--------|
| **Customer Portal**     | `martabakpakde.com`             | Pelanggan                         | Branding utama, mudah diingat |
| **Admin / Kasir**       | `admin.martabakpakde.com`       | Kasir & staff operasional         | Terpisah dari customer |
| **Owner Dashboard**     | `owner.martabakpakde.com`       | Pemilik bisnis                    | Fokus pada laporan & strategi |

**Alternatif lain yang juga bagus:**
- `app.martabakpakde.com` (gabungan Admin + Owner)
- `kasir.martabakpakde.com`

Saya sarankan pakai `admin.` dan `owner.` karena lebih jelas perbedaan perannya.

---

## 3. Cara Mendapatkan Subdomain (Domainesia)

### Langkah-langkah (untuk Klien / Developer):

1. **Beli Domain Utama**
   - Beli di Domainesia, Hostinger, Namecheap, dll.
   - Contoh: `martabakpakde.com`

2. **Masuk ke Dashboard Domainesia**
   - Setelah domain aktif, masuk ke panel Domainesia.

3. **Buat Subdomain**
   - Cari menu **DNS Management** atau **Advanced DNS**.
   - Tambahkan record baru:
     - Type: **CNAME**
     - Host/Name: `admin` (atau `owner`)
     - Value/Target: `nama-proyek.vercel.app` (atau custom domain yang sudah di Vercel)
     - TTL: Default atau 3600

4. **Setup di Vercel**
   - Masuk ke project Vercel (Customer / Admin / Owner).
   - Pergi ke **Settings → Domains**.
   - Tambahkan domain:
     - `admin.martabakpakde.com`
   - Vercel akan memberikan instruksi DNS (biasanya 1 CNAME record).
   - Tunggu propagasi (bisa 5 menit – 48 jam, biasanya cepat).

**Catatan Penting:**
- Subdomain **tidak perlu dibeli lagi**. Cukup tambah record DNS di domain utama.
- Biaya subdomain = Rp0 (selama domain utama aktif).

---

## 4. Rekomendasi Teknis untuk Developer (Vercel + Supabase)

### Struktur Project yang Disarankan:

**Opsi 1 (Paling Direkomendasikan untuk Solo Dev):**
- **1 Monorepo** (menggunakan Turborepo atau Nx)
  - `apps/customer` → `martabakpakde.com`
  - `apps/admin` → `admin.martabakpakde.com`
  - `apps/owner` → `owner.martabakpakde.com`

**Opsi 2 (Sederhana, seperti sekarang):**
- 3 project terpisah di Vercel:
  - Customer Project → domain utama
  - Admin Project → subdomain admin
  - Owner Project → subdomain owner

### Multi-Tenant Handling:
Semua project tetap menggunakan **1 Supabase project** dengan RLS berbasis `tenant_id`.

---

## 5. Contoh Alur Setup untuk Klien Baru

1. Klien beli domain `namabisnis.com` di Domainesia.
2. Klien bayar paket (Basic/Professional/Enterprise).
3. Developer bantu setup:
   - Buat tenant baru di database.
   - Buat 3 project di Vercel (atau deploy ke monorepo).
   - Bantu klien tambahkan 2–3 record DNS di Domainesia.
   - Verifikasi domain.
4. Klien sudah bisa akses:
   - `namabisnis.com` (Customer)
   - `admin.namabisnis.com` (Kasir)
   - `owner.namabisnis.com` (Owner)

---

## 6. Pertanyaan Umum

**Q: Apakah subdomain berpengaruh ke SEO?**  
A: Subdomain sedikit berbeda dengan subfolder. Untuk Customer Portal, domain utama lebih baik untuk SEO. Subdomain admin/owner tidak masalah karena bukan untuk publik.

**Q: Berapa lama subdomain aktif setelah setup DNS?**  
A: Biasanya 5–30 menit. Kadang sampai 2 jam.

**Q: Bisa pakai domain gratis dulu (seperti .vercel.app)?**  
A: Bisa untuk testing, tapi untuk komersial sangat tidak disarankan. UMKM lebih percaya kalau pakai domain sendiri.

---

## Rekomendasi Akhir

- Gunakan struktur:
  - `domainutama.com` → Customer
  - `admin.domainutama.com` → Admin/Kasir
  - `owner.domainutama.com` → Owner Dashboard

- Bantu klien setup DNS di 1–2 kali pertama (bisa dijadikan value added).
- Buat dokumentasi singkat "Cara Menambahkan Subdomain" dalam bahasa Indonesia yang sangat sederhana.

Mau saya buatkan template dokumentasi untuk klien (bahasa Indonesia, sangat mudah dipahami)?
```

---

### File: `docs/Free-Tier-Quotas-and-Tech-Stack-Assessment.md`

```markdown
# Free Tier Quotas Detail + Tech Stack Assessment (From Scratch Recommendation)

**Versi:** 1.0  
**Tanggal:** 9 Juni 2026  
**Konteks:** Solo developer membangun SaaS F&B untuk UMKM Indonesia (fokus Surabaya). Multi-tenant, 3 aplikasi (Customer, Admin gabungan Kasir+Dapur, Owner), self-service, enterprise fitur tapi mudah digunakan.

---

## 1. Vercel Free Tier (Hobby) – Detail Realistis

**Status Resmi (2026):**
- **TIDAK BOLEH** digunakan untuk proyek komersial (melanggar Terms of Service Vercel).
- Hanya untuk personal projects, portfolio, atau testing.

**Batas Kuota Hobby:**
- Bandwidth: **100 GB per bulan**
- Edge Function invocations: **100.000 per hari**
- Build time: **6 jam per bulan**
- Team members: **1 orang**
- Storage (Blob): **256 MB**
- Serverless Function execution: Terbatas (cold start sering, timeout rendah)

**Berapa yang Bisa Ditampung di Hobby? (Estimasi untuk Aplikasi Kamu)**

Untuk kasus F&B UMKM (order + realtime status + tracking):

- **Tenant (Owner UMKM):** Maksimal **3–5 tenant** kecil jika semua traffic ringan.
- **Order per hari total:** Maksimal **200–400 order/hari** (jika pakai banyak Edge Function untuk realtime).
- **Realtime connection:** Sering timeout setelah ~50–80 concurrent users (pelanggan + kasir).
- **Admin/Karyawan aktif:** Maksimal 10–15 orang total.

**Kesimpulan Praktis:**
Hobby **hampir tidak berguna** untuk launch komersial, bahkan untuk 1–2 tenant pertama. Kamu akan kena limit sangat cepat dan melanggar ToS.

**Rekomendasi:**
Langsung mulai dengan **Vercel Pro** ($20 per user/bulan) sejak hari pertama launch komersial.

---

## 2. Supabase Free Tier – Detail Realistis

**Batas Kuota Free (2026):**
- Database size: **500 MB**
- File storage: **1 GB**
- Bandwidth: **2 GB per bulan**
- Compute: Shared (pauses otomatis setelah ~1 jam tidak aktif)
- Realtime: ~**200 concurrent connections** (sangat terbatas)
- Auth users: Terbatas
- Edge Functions: Sangat terbatas

**Berapa yang Bisa Ditampung di Free Tier? (Estimasi untuk Aplikasi Kamu)**

Untuk aplikasi F&B multi-tenant (menu, order, shift, realtime status, inventory dasar):

- **Tenant (Owner UMKM):** **Maksimal 3–7 tenant** kecil (1 cabang masing-masing).
- **Order per hari total:** **Maksimal 150–300 order/hari**.
- **Active Admin/Karyawan:** **Maksimal 8–12 orang** total.
- **End customer concurrent:** **Maksimal 30–50 orang** (karena realtime connection limit).
- **Database growth:** Menu + order history 1–2 bulan sudah bisa mendekati 500 MB jika banyak varian dan foto.

**Masalah Besar di Free Tier:**
- Database sering pause → pengalaman buruk untuk kasir (loading lambat).
- Realtime (order masuk otomatis ke Admin) sering putus.
- Bandwidth 2 GB sangat cepat habis jika ada beberapa tenant dengan order + tracking.

**Kesimpulan Praktis:**
Free tier Supabase **hanya cocok untuk pure development/testing** (1 tenant dummy).

**Rekomendasi:**
Langsung pakai **Supabase Pro** sejak kamu mulai punya 1–2 tenant sungguhan yang bayar.

---

## 3. Kapan Harus Upgrade Tier (Realistis untuk Bisnismu)

### Vercel
- **Hari pertama launch komersial:** Langsung ke **Pro**.
- **Upgrade ke Enterprise:** Saat biaya Pro + overage > Rp 8–10 juta/bulan **atau** butuh SLA tinggi.

### Supabase
- **Saat launch:** Langsung **Pro** ($25+/bulan).
- **Naik ke Team:** Saat salah satu kondisi ini terpenuhi:
  - Database > 400–450 MB
  - Bandwidth mendekati 40–45 GB/bulan
  - Realtime connection sering error (biasanya di 40–60 tenant aktif)
  - Total order > 3.000–4.000 per hari

**Estimasi Biaya Awal (Realistis):**
- Vercel Pro + Supabase Pro: **Rp 700.000 – Rp 1.200.000 per bulan** untuk 10–20 tenant pertama.
- Ini masih sangat masuk akal dengan harga yang kamu tetapkan (Rp 200rb/bulan per tenant).

---

## 4. Penilaian Tech Stack Saat Ini (Next.js + Supabase + Vercel)

**Stack yang sedang dibahas:**
- Frontend: Next.js 16 (App Router) + TypeScript + Tailwind + shadcn/ui
- Monorepo: Turborepo
- Backend/DB: Supabase (Postgres + Auth + Realtime + Storage)
- Hosting: Vercel
- Domain: Cloudflare

**Penilaian Jujur:**

**Sangat Cocok untuk Tahap Awal (0 – 100 tenant):**
- Sangat produktif untuk solo dev + AI coding partner.
- DX (developer experience) terbaik di kelasnya.
- Realtime built-in sangat cocok untuk order queue kasir.
- RLS (Row Level Security) cocok untuk multi-tenant.
- Biaya rendah di awal.

**Kelemahan untuk Jangka Panjang (200+ tenant / Skala Besar):**
- Vercel bisa jadi mahal karena usage-based (bandwidth + function).
- Supabase realtime pricing bisa meledak.
- Vendor lock-in sedang (meski Postgres-nya portable).
- Sulit untuk background jobs berat, WebSocket persistent, atau compliance tinggi.

**Kesimpulan:**
Stack ini **bagus sebagai starting stack**, tapi **bukan yang paling future-proof** jika kamu benar-benar ingin scale ke ratusan tenant dengan biaya terkendali.

---

## 5. Rekomendasi Tech Stack dari Awal (Lebih Cocok & Future-Proof)

Karena kamu bilang **"saya siap membuat dari awal"**, ini adalah rekomendasi stack yang lebih baik:

### Stack yang Direkomendasikan (Dari Nol)

**Frontend (Tetap Kuat):**
- Next.js 16 (App Router) + TypeScript + Tailwind v4 + shadcn/ui
- Turborepo (monorepo) — wajib dari hari pertama

**Backend & Database (Lebih Fleksibel):**
- **Database:** Neon Postgres (serverless Postgres) atau PlanetScale
  - Alasan: Lebih murah & scalable dibanding Supabase di skala menengah, branching bagus untuk multi-tenant.
- **ORM:** Drizzle ORM (lebih ringan & type-safe dibanding Prisma)
- **Auth:** Better Auth atau Clerk (lebih fleksibel daripada Supabase Auth)
- **Realtime:** Ably atau Pusher (jika Supabase realtime terlalu mahal nanti)
- **Storage:** Cloudflare R2 atau Supabase Storage (bisa diganti mudah)

**Hosting & Infra:**
- **Frontend:** Vercel (tetap terbaik untuk Next.js)
- **Backend / API:** Railway atau Render (container pricing lebih predictable)
- **Edge / DNS:** Cloudflare (tetap terbaik)

**Lainnya:**
- Payments: Xendit / Midtrans (dengan webhook)
- Email: Resend
- Monitoring: Sentry + PostHog
- Background Jobs: Trigger.dev atau Inngest

### Mengapa Stack Ini Lebih Cocok?

- Mulai dengan **Vercel + Neon + Railway** = biaya lebih predictable daripada Supabase + Vercel combo.
- Lebih mudah migrasi nanti ke AWS/GCP jika sudah besar.
- Masih sangat mudah untuk solo dev + AI.
- Realtime bisa dipilih (bisa pakai Supabase Realtime dulu, lalu ganti ke Ably kalau mahal).

**Migration Path yang Sudah Dipikirkan dari Awal:**
- Phase 1 (0-80 tenant): Vercel + Neon + Railway
- Phase 2 (80-250 tenant): Tambah Cloudflare Workers untuk beberapa logic
- Phase 3 (250+ tenant): Pindah backend ke AWS ECS / Cloud Run + Aurora

---

## 6. Rekomendasi Praktis untuk Kamu

1. **Jangan pakai free tier** untuk launch komersial (kecuali pure testing 1 tenant dummy).
2. **Langsung pakai Pro tier** sejak hari pertama kamu punya pelanggan bayar.
3. **Pilih stack yang future-proof dari awal** (Neon + Railway lebih baik daripada Supabase + Vercel murni untuk jangka menengah).
4. **Mulai dengan monorepo** sekarang (jangan buat 3 project terpisah seperti sekarang).
5. **Siapkan monitoring** sejak awal (Supabase/Vercel dashboard + PostHog) agar tahu kapan mendekati limit.

---

**Kesimpulan Langsung:**

- Free tier Vercel & Supabase **hanya untuk eksperimen**. Untuk bisnis nyata, langsung Pro.
- Stack Next.js + Supabase + Vercel **cukup bagus** untuk awal, tapi **bisa lebih baik** jika kamu mau rebuild dari nol.
- Rekomendasi stack baru di atas lebih cocok untuk perjalanan dari solo dev hingga scale menengah dengan biaya lebih terkendali.

Mau saya buatkan:
- Perbandingan biaya detail antara "Supabase + Vercel" vs "Neon + Railway" untuk 50 tenant dan 150 tenant?
- Atau langsung buatkan struktur monorepo + database schema yang sudah disesuaikan dengan stack baru?

Langsung bilang apa yang kamu butuhkan selanjutnya. Saya siap bantu buat dari awal dengan rancangan yang lebih matang.
```

---

### File: `docs/Full-Implementation-Blueprint-All-Parts.md`

```markdown
# Full Implementation Blueprint – Enterprise F&B SaaS (From Scratch)

**Versi:** 1.0  
**Tanggal:** 9 Juni 2026  
**Tujuan:** Satu dokumen lengkap yang berisi semua yang diminta:
1. Full Drizzle migration + seed data (template F&B martabak/terang bulan)
2. Struktur folder monorepo lengkap + package.json
3. Contoh API route untuk self-service onboarding + domain automation
4. Estimasi biaya infra developer lebih detail (tabel per fase)
5. Update dokumen desain utama (integrasi blueprint ini ke desain final)

Dokumen ini adalah **panduan siap pakai** untuk mulai coding dari nol dengan AI coding partner. Semua keputusan dari obrolan sebelumnya sudah diintegrasikan (multi-tenant, Startup/Professional/Enterprise pricing, domain dibeli provider, Admin gabungan kasir+dapur, stack portable untuk migrasi minimal, dll).

---

## 1. Full Drizzle Migration + Seed Data (Template F&B Martabak & Terang Bulan)

Buat file: `packages/db/drizzle/0000_initial.ts` (atau gunakan `drizzle-kit generate`)

```ts
import { pgTable, uuid, text, integer, boolean, timestamp, numeric, jsonb, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  domain: text('domain').notNull().unique(),
  adminSubdomain: text('admin_subdomain').notNull(),
  ownerSubdomain: text('owner_subdomain').notNull(),
  branding: jsonb('branding').$type<{
    logoUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    businessName: string;
  }>(),
  packageType: text('package_type').notNull().default('startup'), // startup | professional | enterprise
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // from auth.users
  tenantId: uuid('tenant_id').references(() => tenants.id),
  email: text('email').notNull(),
  role: text('role').notNull().default('kasir'), // owner | manager | kasir
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  sortOrder: integer('sort_order').default(0),
});

export const menuItems = pgTable('menu_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id),
  categoryId: uuid('category_id').references(() => categories.id),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
  isAvailable: boolean('is_available').default(true),
  isBestSeller: boolean('is_best_seller').default(false),
  isNew: boolean('is_new').default(false),
});

export const toppings = pgTable('toppings', {
  id: text('id').primaryKey(), // 'kacang', 'keju', dll
  tenantId: uuid('tenant_id').references(() => tenants.id),
  name: text('name').notNull(),
  isAvailable: boolean('is_available').default(true),
});

export const recipes = pgTable('recipes', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id),
  menuItemId: uuid('menu_item_id').references(() => menuItems.id),
  name: text('name').notNull(),
});

export const recipeIngredients = pgTable('recipe_ingredients', {
  id: uuid('id').primaryKey().defaultRandom(),
  recipeId: uuid('recipe_id').references(() => recipes.id),
  ingredientName: text('ingredient_name').notNull(),
  quantity: numeric('quantity', { precision: 10, scale: 2 }).notNull(),
  unit: text('unit').notNull(),
  costPerUnit: numeric('cost_per_unit', { precision: 10, scale: 2 }),
});

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id),
  orderCode: text('order_code').notNull().unique(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  deliveryType: text('delivery_type').notNull(), // pickup | delivery
  deliveryAddress: text('delivery_address'),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric('total_price', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('received'),
  paymentMethod: text('payment_method').default('cod'),
  paymentStatus: text('payment_status').default('pending'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id),
  menuItemId: uuid('menu_item_id'),
  menuItemName: text('menu_item_name').notNull(),
  variantName: text('variant_name'),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric('total_price', { precision: 10, scale: 2 }).notNull(),
});

export const shifts = pgTable('shifts', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id),
  operatorId: uuid('operator_id'),
  operatorName: text('operator_name').notNull(),
  openedAt: timestamp('opened_at').defaultNow(),
  closedAt: timestamp('closed_at'),
  startingCash: numeric('starting_cash', { precision: 10, scale: 2 }).notNull(),
  actualCash: numeric('actual_cash', { precision: 10, scale: 2 }),
  drift: numeric('drift', { precision: 10, scale: 2 }),
  status: text('status').notNull().default('open'),
});

// Relations (contoh)
export const tenantsRelations = relations(tenants, ({ many }) => ({
  profiles: many(profiles),
  menuItems: many(menuItems),
  orders: many(orders),
}));

// ... tambahkan relations lain sesuai kebutuhan
```

### Seed Data – Template Martabak & Terang Bulan (untuk tenant baru)

Buat script `scripts/seed-template.ts`:

```ts
import { db } from '../db';
import { tenants, categories, menuItems, toppings } from '../db/schema';

async function seedTemplate(tenantId: string) {
  // Categories
  const catMartabak = await db.insert(categories).values({ tenantId, name: 'Martabak Telur Ayam', slug: 'martabak-telur-ayam', sortOrder: 1 }).returning();
  const catTerang = await db.insert(categories).values({ tenantId, name: 'Terang Bulan', slug: 'terang-bulan', sortOrder: 2 }).returning();

  // Menu Items (contoh lengkap)
  await db.insert(menuItems).values([
    { tenantId, categoryId: catMartabak[0].id, name: 'Martabak Telur Ayam - 2 Telur', slug: 'martabak-ayam-2-telur', price: '25000', isBestSeller: true },
    { tenantId, categoryId: catMartabak[0].id, name: 'Martabak Telur Ayam - 3 Telur', slug: 'martabak-ayam-3-telur', price: '35000', isNew: true },
    // ... tambahkan sampai 12+ varian Martabak Ayam & Bebek
    { tenantId, categoryId: catTerang[0].id, name: 'Terang Bulan 2 Variant Topping', slug: 'terang-2-variant', price: '20000', isBestSeller: true },
    { tenantId, categoryId: catTerang[0].id, name: 'Terang Bulan Milo + 1 Topping', slug: 'terang-milo', price: '25000' },
    // ... lengkapi dengan semua varian dari seed sebelumnya
  ]);

  // Toppings (universal untuk Terang Bulan)
  await db.insert(toppings).values([
    { tenantId, id: 'kacang', name: 'Kacang' },
    { tenantId, id: 'keju', name: 'Keju' },
    { tenantId, id: 'meses', name: 'Meses' },
    { tenantId, id: 'pisang', name: 'Pisang' },
    // ... semua 13 topping
  ]);

  console.log('Template F&B seeded for tenant', tenantId);
}
```

Jalankan seed saat tenant baru dibuat di onboarding.

---

## 2. Struktur Folder Monorepo Lengkap + package.json

```
fnb-saas/
├── apps/
│   ├── customer/          # Next.js Customer Portal
│   ├── admin/             # Next.js Admin/Karyawan (kasir + dapur)
│   └── owner/             # Next.js Owner Dashboard
├── packages/
│   ├── db/                # Drizzle schema, migrations, seed
│   ├── ui/                # Shared shadcn components
│   ├── shared/            # Types, utils, API contracts
│   └── config/            # Tailwind, eslint, tsconfig shared
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

**Root package.json (excerpt)**

```json
{
  "name": "fnb-saas",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "seed:template": "tsx scripts/seed-template.ts"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.5.0",
    "drizzle-kit": "^0.22.0"
  }
}
```

**apps/customer/package.json** (contoh)

```json
{
  "name": "@fnb-saas/customer",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build"
  },
  "dependencies": {
    "next": "16.x",
    "@fnb-saas/shared": "workspace:*",
    "@fnb-saas/ui": "workspace:*",
    "drizzle-orm": "^0.31.0"
  }
}
```

Buat struktur serupa untuk `admin` dan `owner`. Gunakan shared types untuk tenant-aware queries.

---

## 3. Contoh API Route untuk Self-Service Onboarding + Domain Automation

**File:** `apps/customer/app/api/onboarding/route.ts` (atau shared API di monorepo)

```ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@fnb-saas/db';
import { tenants } from '@fnb-saas/db/schema';
import { createTenantInVercel, buyDomainCloudflare, setupDNS } from '@/lib/domain-automation';

export async function POST(req: NextRequest) {
  const { packageType, businessName, slug, branding } = await req.json();

  // 1. Generate domain
  const domain = `${slug}.com`; // atau generate unik
  const adminSub = `admin.${domain}`;
  const ownerSub = `owner.${domain}`;

  // 2. Beli domain via Cloudflare API (contoh)
  const domainResult = await buyDomainCloudflare(domain); // implementasi real pakai fetch ke Cloudflare API

  // 3. Buat tenant di DB
  const [newTenant] = await db.insert(tenants).values({
    name: businessName,
    slug,
    domain,
    adminSubdomain: adminSub,
    ownerSubdomain: ownerSub,
    branding,
    packageType,
  }).returning();

  // 4. Seed template F&B
  await seedTemplate(newTenant.id); // dari bagian 1

  // 5. Setup Vercel custom domains (via Vercel API)
  await createTenantInVercel({
    customerDomain: domain,
    adminDomain: adminSub,
    ownerDomain: ownerSub,
    tenantId: newTenant.id,
  });

  // 6. Setup DNS (Cloudflare)
  await setupDNS(domain, 'vercel-cname'); // arahkan ke Vercel

  // 7. Buat user owner pertama (via Clerk/Better Auth)
  // ...

  return NextResponse.json({ 
    success: true, 
    tenantId: newTenant.id,
    domains: { main: domain, admin: adminSub, owner: ownerSub }
  });
}
```

**lib/domain-automation.ts** (contoh fungsi)

```ts
export async function buyDomainCloudflare(domain: string) {
  // Gunakan Cloudflare Registrar API
  const res = await fetch('https://api.cloudflare.com/client/v4/registrar/domains', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}` },
    body: JSON.stringify({ domain }),
  });
  return res.json();
}

export async function createTenantInVercel(domains: any) {
  // Vercel API untuk menambah custom domain ke project
  // Gunakan 3 project (customer, admin, owner) atau 1 monorepo dengan hostname routing
  const vercelToken = process.env.VERCEL_TOKEN;
  // Contoh: POST ke /v9/projects/{projectId}/domains
}
```

Catatan: Simpan token di environment variable (jangan hardcode). Gunakan service role untuk automation.

---

## 4. Estimasi Biaya Infra Developer (Tabel Detail per Fase)

| Fase | Tenant Aktif | Order/Hari Total | Vercel (Pro) | Neon/PlanetScale | Railway/Render | Cloudflare + Misc | Total Estimasi / Bulan | Catatan |
|------|--------------|------------------|--------------|------------------|----------------|-------------------|------------------------|---------|
| Launch (0-3 bulan) | 5-15 | 500-1.500 | Rp 400.000 | Rp 300.000 | Rp 400.000 | Rp 150.000 | **Rp 1.25 jt** | Mulai dengan Pro tier |
| Growth (3-9 bulan) | 30-80 | 3.000-8.000 | Rp 800.000 | Rp 600.000 | Rp 700.000 | Rp 300.000 | **Rp 2.4 jt** | Upgrade ke Team jika perlu |
| Scale (9-18 bulan) | 100-200 | 10.000-25.000 | Rp 2.5 jt | Rp 1.5 jt | Rp 1.8 jt | Rp 600.000 | **Rp 6.4 jt** | Mulai migrasi hybrid |
| Hardcore (18+ bulan) | 250+ | 30.000+ | Rp 5-8 jt (atau Enterprise) | Rp 3-5 jt (Aurora) | Rp 4-7 jt (ECS) | Rp 1-2 jt | **Rp 15-25 jt+** | Full AWS/GCP atau hybrid |

**Catatan Biaya:**
- Termasuk overage bandwidth & function.
- Domain (Rp 300rb/tahun per tenant) sudah ditanggung di harga user.
- Cadangkan 30-40% revenue untuk infra + buffer migrasi.
- Saat 150+ tenant, pertimbangkan migrasi ke stack yang lebih murah per user (Railway + Neon).

---

## 5. Update Dokumen Desain Utama (Integrasi Blueprint)

Dokumen utama sebelumnya (`Final-Full-SaaS-Design-FnB-UMKM-Enterprise.md` dan `Master-Conversation-Summary-and-Final-Blueprint.md`) sudah di-update dengan konten blueprint ini.

**Perubahan & Penambahan Utama:**
- Tech stack diubah ke **Neon/PlanetScale + Railway/Render** sebagai default dari awal (lebih portable & cost-predictable daripada pure Supabase + Vercel).
- Penambahan section lengkap "Full Implementation" (migrasi Drizzle + seed, monorepo structure, contoh API onboarding).
- Estimasi biaya infra developer diperluas menjadi tabel fase + rekomendasi kapan migrasi.
- Semua halaman & fitur di Owner/Admin/Customer disesuaikan dengan "full enterprise untuk Startup tier".
- Ditambahkan bagian "Migration Path with Minimal Code Change".
- Pricing tetap sesuai final: Startup = 1 cabang full enterprise features.
- Ditambahkan panduan praktis untuk solo dev + AI coding partner.

**File yang Direferensikan & Diupdate:**
- Master blueprint sekarang menjadi sumber utama.
- Semua dokumen sebelumnya (Pricing, Migration Plan, dll) tetap valid dan menjadi lampiran.

---

**Cara Menggunakan Dokumen Ini**

1. Copy folder structure.
2. Jalankan `pnpm install` di root.
3. Buat project di Vercel, Railway, Neon, Cloudflare.
4. Jalankan migration + seed saat membuat tenant pertama.
5. Implementasi API onboarding sebagai starting point.
6. Gunakan tabel biaya untuk budgeting.

Dokumen ini adalah **panduan lengkap 100%** untuk mulai coding dari nol dengan semua konteks obrolan sebelumnya.

Jika butuh file terpisah (misalnya full `drizzle.config.ts`, contoh `.env`, atau script automation lebih lengkap), beri tahu saya bagian mana yang ingin dipecah. Saya siap lanjutkan. 

Semangat membangunnya! Kamu sudah punya blueprint yang sangat solid.
```

---

### File: `docs/Full-Project-Blueprint-Multi-Tenant-FnB-SaaS.md`

```markdown
# Full Project Blueprint: Multi-Tenant Enterprise F&B SaaS (Built from Scratch)

**Versi:** 1.0  
**Tanggal:** 9 Juni 2026  
**Tujuan Dokumen:**  
Dokumen ini adalah **panduan lengkap dan final** untuk membangun proyek dari nol dengan pendekatan multi-tenant sejak hari pertama.  
A6 Nyuss hanya digunakan sebagai **kaca pembanding / referensi data**, bukan sebagai pilot tenant utama.  
Semua sistem dirancang agar bisa langsung digunakan untuk distribusi ke UMKM lain.

**Komitmen Waktu:** 20 jam/hari efektif (full day kecuali 4 jam istirahat/tidur).

---

## 1. Project Approach & Philosophy

### Keputusan Utama (Sesuai Permintaanmu)
- **Multi-tenant dari hari pertama** (bukan single tenant dulu).
- A6 Nyuss hanya sebagai **referensi** untuk desain UI, data contoh, dan testing.
- Bangun 3 aplikasi terpisah dalam satu monorepo:
  1. **Customer App** (untuk pelanggan)
  2. **Admin/Karyawan App** (gabungan Kasir + Dapur)
  3. **Owner Dashboard** (untuk pemilik bisnis)
- Tujuan: Sekali dibangun, bisa langsung didistribusikan ke banyak UMKM.

### Prinsip Desain
- Enterprise professional (fitur lengkap, approval, audit, forecasting, dll).
- Gaptek-friendly & Mobile-first.
- Self-service onboarding dengan preview.
- Harga berdasarkan jumlah cabang (Startup = 1 cabang full fitur, Professional = max 3 cabang, Enterprise = unlimited).

---

## 2. Tech Stack Final (Dari Awal)

- **Monorepo**: Turborepo + pnpm
- **Frontend**: Next.js 16 (App Router) + TypeScript + React 19
- **UI**: Tailwind CSS v4 + shadcn/ui
- **Database**: Neon Postgres atau PlanetScale + Drizzle ORM
- **Auth**: Better Auth (atau Clerk)
- **Realtime**: Ably (bisa mulai pakai Supabase Realtime dulu dengan abstraction)
- **Hosting**:
  - Frontend: Vercel
  - Backend/Jobs: Railway atau Render
- **Domain Automation**: Cloudflare Registrar + API
- **Storage**: Cloudflare R2
- **Payments**: Xendit / Midtrans
- **AI**: Google Gemini
- **Monitoring**: Sentry + PostHog

**Alasan Stack Ini**:
- Mudah dimigrasi nanti (hanya ganti infra, bukan logic bisnis).
- Cocok untuk solo dev + AI coding partner.
- Cost predictable di awal.

---

## 3. High-Level Architecture

- **1 Database** (Postgres) dengan kolom `tenant_id` di hampir semua tabel.
- Setiap UMKM = 1 **Tenant**.
- 3 aplikasi (Customer, Admin, Owner) mengakses data yang sama dengan filtering `tenant_id`.
- Domain routing:
  - `namabisnis.com` → Customer App
  - `admin.namabisnis.com` → Admin App
  - `owner.namabisnis.com` → Owner Dashboard
- Self-service: User bayar → isi form → Preview → Sistem otomatis buat tenant + domain + seed data.

---

## 4. Detailed App Specifications (UI/UX + Fitur per Halaman)

### 4.1 Customer App (untuk Pelanggan)

**Tujuan**: Pelanggan bisa dengan mudah melihat menu, memilih varian, order, dan tracking. Mobile-first.

#### Halaman & Detail Fitur

**1. Home / Landing (`/`)**
- Hero section dengan branding tenant (logo, warna, nama bisnis).
- Menu terlaris (3-6 kartu).
- Keunggulan bisnis (4 poin: Halal, Fresh, Cepat, Tanpa Ojol).
- Cara Order (3 langkah visual).
- Testimonial (bisa statis atau dinamis).
- Lokasi + Jam Operasional + Peta (Leaflet).
- Floating Action Buttons: Chat WA + Keranjang.

**2. Menu (`/menu`)**
- Tab / Filter kategori (Martabak Telur Ayam, Martabak Telur Bebek, Terang Bulan, Paket Bundling, Minuman).
- Search bar + Sort (Terlaris, Harga Rendah-Tinggi, Rekomendasi).
- Grid kartu menu:
  - Foto
  - Nama + Harga
  - Badge (🔥 Terlaris, ✨ Baru, Habis)
  - Klik kartu membuka modal atau halaman detail.

**3. Menu Detail (`/menu/[slug]`)**
- Foto besar.
- Deskripsi lengkap.
- Pilihan Varian:
  - Untuk Martabak: Jumlah Telur (1-7), Isian (Ayam / Sapi).
  - Untuk Terang Bulan: Pilihan Topping utama + Extra Topping (checkbox).
- Quantity selector.
- Catatan khusus (textarea).
- Harga real-time.
- Tombol "Tambah ke Keranjang" (dengan validasi).

**4. Cart (`/cart`)**
- Daftar item dengan varian/topping.
- Edit quantity, hapus, atau ubah varian.
- Ringkasan: Subtotal, Ongkir (berdasarkan zona), Diskon/Promo.
- Input kode promo + validasi.
- Estimasi waktu pengiriman/pickup.
- Tombol "Lanjut ke Checkout".

**5. Checkout (`/checkout`)**
- Form data pelanggan: Nama, Nomor HP.
- Pilihan Tipe Order: Pickup / Delivery.
- Jika Delivery:
  - Input alamat.
  - Peta interaktif (Leaflet + Nominatim) untuk pilih lokasi.
  - Hitung ongkir otomatis berdasarkan zona.
- Metode Pembayaran: COD / QRIS / Transfer Bank.
- Upload bukti pembayaran (jika QRIS/Transfer).
- Ringkasan pesanan + Total.
- Tombol "Buat Pesanan" (validasi server-side harga).

**6. Order Tracking (`/tracking` atau `/tracking/[code]`)**
- Input kode order (jika tidak dari session).
- Timeline status real-time:
  - Received → Processing (sedang dibuat) → Ready → Completed / Cancelled.
- Detail pesanan.
- Estimasi waktu.
- Tombol "Chat via WhatsApp" (dengan template pesan).

**7. Halaman Pendukung**
- About, Contact, FAQ, Gallery, Promo, Catering, Privacy, Terms.

**Koneksi ke App Lain**:
- Order dibuat → Langsung muncul di Admin via Realtime.
- Status diupdate Admin → Update otomatis di halaman Tracking.

---

### 4.2 Admin / Karyawan App (Kasir + Dapur Gabungan)

**Tujuan**: Satu aplikasi untuk 1-2 orang per outlet. Kasir handle order & pembayaran. Dapur handle produksi.

#### Halaman & Detail Fitur

**1. Login + Buka Shift**
- Form login (email/password tenant-aware).
- Input "Uang Modal Awal Laci".
- Tombol "Buka Shift" (otomatis buat record shift).

**2. Dashboard Utama (Real-time)**
- Header: Nama operator, Status Toko (Buka/Tutup), Jam real-time, Koneksi.
- **Panel Kiri**: Order Queue
  - Daftar order dengan status.
  - Filter: Semua / Received / Processing / Ready.
  - Alarm suara + notifikasi saat order baru masuk.
  - Kartu ringkas: Kode order, Nama pelanggan, Total, Tipe (Pickup/Delivery).
- **Panel Kanan**: Order Detail (saat dipilih)
  - Daftar item lengkap + varian + topping + catatan.
  - Bukti pembayaran (jika ada).
  - Tombol aksi:
    - Ubah status (Received → Processing → Ready → Completed)
    - Konfirmasi Pembayaran (untuk QRIS/Transfer)
    - Batalkan dengan alasan
    - Cetak Struk
- Quick actions: Buka/Tutup Toko.

**3. Dapur / Production**
- Daftar menu yang harus diproduksi hari ini (berdasarkan order).
- Checklist per item/batch.
- Input bahan yang digunakan.
- Tombol "Selesai Produksi".
- Catat Waste / Spoilage (pilih alasan: Over production, Expired, dll).

**4. Shift & Kas Management**
- Rekap Harian (otomatis):
  - Total Omset
  - Breakdown COD vs Non-Cash
  - Kas Diharapkan (Modal Awal + Omset COD)
  - Input Kas Aktual
  - Hitung Drift (Selisih)
- Tombol: Tutup Shift + Export CSV + Print Thermal Z-Report.
- Kirim laporan otomatis ke WA Owner.

**5. Menu Management**
- Daftar menu dengan toggle "Tersedia / Habis".
- Toggle topping (khusus Terang Bulan).
- Lihat HPP dasar (jika diizinkan).

**6. Riwayat & Laporan**
- Riwayat order per shift/hari.
- Riwayat shift.
- Log aksi (audit sederhana).

**Koneksi**:
- Realtime dari Customer.
- Update status → Update di Customer Tracking.
- Data shift & rekap → Muncul di Owner Dashboard.

---

### 4.3 Owner Dashboard (Executive Level)

**Tujuan**: High-level visibility, pengambilan keputusan, kontrol, dan perencanaan. Bukan untuk operasional harian.

#### Halaman & Detail Fitur

**1. Executive Cockpit (Halaman Utama)**
- KPI Cards (real-time):
  - Revenue Hari Ini / MTD / YTD + Growth %
  - Gross Profit & Margin %
  - Food Cost %
  - Labor Cost %
  - Waste %
  - Jumlah Order + Average Order Value
  - Active Cabang + Karyawan
- Charts:
  - Revenue Trend (7/30/90 hari, bisa per cabang)
  - Top 10 Menu by Revenue & Margin
  - Revenue by Cabang (bar)
  - Hourly Sales Heatmap
- AI Insights (otomatis generate 3-5 insight).
- Critical Alerts (stok rendah, revenue drop, drift kas tinggi, dll).
- Quick Actions.

**2. Cabang (Branches)**
- Tabel daftar cabang + KPI utama.
- Tambah Cabang baru (wizard).
- Performance Comparison (revenue per m², food cost, dll).
- Inter-branch Stock Transfer (request & approval).

**3. Menu & Recipe**
- Master Menu list dengan HPP.
- Recipe / BOM Editor (drag & drop bahan baku + qty).
- Varian & Modifier management.
- Menu Engineering Matrix (visual: Star, Plowhorse, Puzzle, Dog).
- Deploy menu ke cabang tertentu + price override.
- Price history & approval jika perubahan besar.

**4. Inventory & Procurement**
- Stock Overview (per cabang + total).
- Low Stock & Expiring Alerts.
- Waste Log + Analytics.
- Supplier Management.
- Purchase Order + Goods Receipt + 3-way matching.
- Stock Count (mobile friendly).

**5. Finance**
- Consolidated P&L (per cabang & total).
- Cash Flow Forecast.
- Shift Reconciliation Summary.
- Tax Reports (PPN, e-Faktur Coretax ready).
- Budget vs Actual.

**6. Production & Operations**
- Daily Production Plan (AI recommended).
- Yield & Variance Report.
- Kitchen Capacity Overview.

**7. Sales & Analytics**
- Sales breakdown (channel, waktu, menu, cabang).
- Promotion Performance.
- Customer Insights (repeat rate, LTV, top customers).
- Cohort Analysis.

**8. HR & Workforce**
- Headcount & Labor Cost %.
- Shift Schedule Overview (semua cabang).
- Performance Leaderboard.
- Recruitment Pipeline.

**9. Approvals**
- Daftar pending approval (PO besar, discount tinggi, refund, transfer antar cabang).
- Detail + Approve / Reject + Catatan.
- History approval.

**10. AI Insights & Forecasting**
- Demand Forecasting per cabang.
- What-if Simulator.
- Anomaly Detection.
- Natural Language Query.
- Full AI Chat.

**11. Settings**
- Branding & Template per tenant.
- User Management (Owner, Manager, Kasir) + Permission.
- Tax & Payment Configuration.
- Integrations (WhatsApp, Delivery Platform, Accounting).
- Subscription & Billing (untuk SaaS).
- Full Audit Logs.

**Koneksi**:
- Semua data dari Admin + Customer.
- Realtime update.
- Approval → Effect langsung ke Admin.

---

## 5. Project Folder Structure (Monorepo)

```
fnb-saas/
├── apps/
│   ├── customer/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── ...
│   ├── admin/
│   │   ├── app/
│   │   ├── components/
│   │   └── ...
│   └── owner/
│       ├── app/
│       ├── components/
│       └── ...
├── packages/
│   ├── db/                    # Drizzle schema, migrations, seed
│   ├── ui/                    # Shared shadcn components
│   ├── shared/                # Types, utils, constants, API contracts
│   └── config/                # Shared config
├── scripts/                   # seed, migration helper, domain automation
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## 6. Struktur Lain yang Diperlukan

- **Database**: Semua tabel wajib punya `tenant_id`.
- **Environment Variables**: `TENANT_ID` (untuk development), Vercel/Cloudflare token, dll.
- **Middleware**: Tenant resolver berdasarkan hostname.
- **Preview Mode**: Untuk onboarding (bisa pakai subdomain preview atau static mock).

---

## 7. Rekomendasi Memulai Coding (Dengan Komitmen 20 Jam/Hari)

**Minggu 1-2**: Foundation
- Monorepo + 3 Next.js app kosong
- Drizzle + Neon/PlanetScale setup
- Tabel `tenants` + auth dasar
- Tenant resolver (middleware)

**Minggu 3-5**: Customer App + Admin Dasar
- Bangun halaman Customer lengkap
- Bangun Admin (Order Queue + Dapur Checklist)
- Realtime connection

**Minggu 6-8**: Owner Dashboard + Core Enterprise
- Executive Cockpit
- Menu + Recipe/BOM
- Inventory dasar
- Shift & Finance dasar

**Minggu 9-10**: Multi-cabang, AI, & Self-Service
- Cabang management
- AI Insights
- Onboarding + Domain automation (awal)

**Minggu 11+**: Polish + Beta

---

**File ini adalah panduan utama untuk mulai dari nol.**

Apakah kamu ingin saya pecah lagi menjadi file-file terpisah yang lebih actionable (contoh: `drizzle-schema.ts`, `folder-structure.md`, `step-by-step-setup.md`)? Atau langsung mulai dengan salah satu bagian (misalnya schema database lengkap)?

Silakan beri tahu langkah selanjutnya. Saya siap membantu sampai kamu benar-benar mulai coding.
```

---

### File: `docs/Master-Conversation-Summary-and-Final-Blueprint.md`

```markdown
# Master Conversation Summary & Final Blueprint
## A6 Nyuss F&B SaaS – Enterprise Professional untuk UMKM (Dibangun dari Nol)

**Versi:** 1.0 (Kompilasi Lengkap Seluruh Obrolan)  
**Tanggal:** 9 Juni 2026  
**Tujuan Dokumen:**  
Dokumen ini adalah **satu file tunggal** yang merangkum **seluruh percakapan** kita dari awal hingga akhir.  
Gunakan dokumen ini sebagai "backup otak" jika kuota obrolan habis, pindah ke chat baru, atau ingin melanjutkan tanpa kehilangan konteks.  
Semua keputusan, evolusi pemikiran, dan final blueprint sudah disatukan di sini.

---

## Ringkasan Eksekutif Proyek

**Visi Utama**  
Membangun SaaS multi-tenant level enterprise professional untuk UMKM F&B Indonesia (fokus awal martabak & terang bulan di Surabaya).  
- Mudah digunakan (gaptek-friendly, mobile-first, self-service)  
- Fitur lengkap seperti Odoo tapi **jauh lebih sederhana** untuk UMKM  
- Harga sangat ramah (Rp 200.000/bulan untuk Startup)  
- Bisa dikomersilkan ke banyak UMKM sejenis  
- Solo developer + AI coding partner, dana sendiri  
- Siap scale dari 1 cabang hingga puluhan cabang dengan migrasi infra minimal

**Tiga Aplikasi Utama**
1. **Customer App** → Portal publik untuk pelanggan order
2. **Admin/Karyawan App** → Gabungan Kasir + Dapur (1-2 orang per outlet)
3. **Owner Dashboard** → Executive level untuk pemilik bisnis

**Model Bisnis**  
Niche SaaS Template F&B Indonesia. Harga berdasarkan jumlah cabang. Provider membeli domain untuk klien.

---

## Evolusi Obrolan & Keputusan Penting

### Awal Percakapan
- Kamu ingin fitur owner dashboard ala Odoo Enterprise.
- Sudah punya Customer App dan Admin App (dibuat dalam 1 minggu pakai AI).
- Bisnis: Martabak & Terang Bulan, rencana ekspansi banyak cabang + komersialisasi ke UMKM lain.
- Tech saat itu: Next.js (Customer), Vite React (Admin), Supabase.

### Analisis Aplikasi Existing
- Customer: Sudah cukup bagus (menu, cart, checkout, tracking, WA integration).
- Admin: Fokus kasir (realtime order, shift, rekap kas, thermal print).
- Gap besar: Belum ada Owner layer, multi-tenant, inventory/BOM, self-service, domain automation.

### Pricing Evolution
- Awal: Rp500.000 sekali + Rp200.000/bulan.
- Akhir (final): 
  - **Startup**: 1 cabang + **semua fitur Enterprise** (Rp500.000 awal + Rp200.000/bulan)
  - **Professional**: Maks 3 cabang + full fitur (Rp800.000 awal + Rp200.000/bulan)
  - **Enterprise**: Unlimited + custom (Rp1.000.000 awal + Rp200.000/bulan)
- Domain dibeli provider (biaya termasuk).
- Pelanggan lama harga tetap, pelanggan baru boleh lebih mahal.

### Tech Stack & Migrasi
- Awal banyak bahas Supabase + Vercel.
- Kemudian disadari free tier hampir tidak berguna untuk komersial.
- Final recommendation: Stack yang **portable** agar migrasi hanya ganti infra, bukan rewrite kode.
- Rekomendasi akhir: Next.js + Turborepo + Neon/PlanetScale + Railway/Render + Cloudflare + Drizzle + Ably (bisa mulai dengan Supabase Realtime dulu).

### Domain & Self-Service
- Provider beli domain.
- Struktur: `domain.com` (Customer) | `admin.domain.com` | `owner.domain.com`
- Onboarding dengan preview real-time + otomatis domain + subdomain + deploy.

### Admin App
- Kamu tekankan: Saat ini hanya butuh **1 app** untuk kasir + dapur karena UMKM biasanya hanya 1-2 karyawan per outlet.
- Owner Dashboard baru benar-benar dibutuhkan untuk komersial atau saat brand sendiri sudah besar.

---

## 1. Tech Stack Terbaik dari Awal (Future-Proof)

**Stack Final yang Direkomendasikan (Minimal Migration Pain)**

**Core**
- Next.js 16 (App Router) + TypeScript + React 19
- Tailwind v4 + shadcn/ui
- Turborepo (monorepo)

**Data Layer**
- Database: Neon Postgres atau PlanetScale (serverless Postgres)
- ORM: Drizzle ORM
- Realtime: Ably atau Pusher (bisa mulai pakai Supabase Realtime dulu dengan abstraction)

**Auth**
- Better Auth atau Clerk

**Hosting**
- Frontend: Vercel
- Backend / Jobs: Railway atau Render (container)
- Domain & Edge: Cloudflare (Registrar + Workers + DNS)

**Lainnya**
- Payments: Xendit / Midtrans
- Storage: Cloudflare R2
- Email: Resend
- Monitoring: Sentry + PostHog
- AI: Google Gemini

**Alasan Stack Ini Terbaik**
- Next.js + Postgres = sangat portable.
- Bisa deploy hari ini di Vercel + Railway.
- Besok bisa pindah ke AWS ECS + Aurora tanpa mengubah logic bisnis besar-besaran.
- Cocok untuk solo dev + AI coding.
- Biaya predictable di tahap awal-menengah.

**Rencana Migrasi (Hanya Ganti Infra)**
- Fase 1 (0-80 tenant): Vercel + Neon + Railway + Cloudflare
- Fase 2 (80-250 tenant): Tambah Workers, optimasi
- Fase 3 (250+ tenant): Pindah backend ke AWS/GCP container, DB ke Aurora, Auth ke WorkOS jika perlu.

---

## 2. Halaman & Fitur Detail per Role (Enterprise Level)

### Customer App (Pelanggan)
- Home/Landing (branding tenant, menu highlight, cara order, peta)
- Menu (filter, search, sort, badge)
- Menu Detail (varian telur/isian, topping, extra, catatan)
- Cart
- Checkout (nama, HP, pickup/delivery + peta, metode bayar, promo)
- Tracking (status real-time)
- About, Contact, FAQ, Gallery, Promo, Catering (opsional)
- AI Chatbot

### Admin/Karyawan App (Kasir + Dapur Gabungan)
- Login + Buka Shift (uang modal laci)
- Dashboard Real-time (Order Queue + Order Detail + alarm)
- Update status order, verifikasi QRIS manual, cancel
- Dapur Checklist (menu yang harus diproduksi + bahan)
- Waste logging
- Rekap Harian + tutup shift + thermal print + kirim WA ke owner
- Toggle availability menu/topping
- Riwayat & audit sederhana

### Owner Dashboard (Executive)
- Executive Cockpit (KPI, chart, AI insights, alerts)
- Branches Management + benchmarking + transfer stok
- Menu & Recipe (BOM + HPP + Menu Engineering + deploy per cabang)
- Inventory, Waste, Procurement, Supplier
- Finance (P&L, cash flow, shift reconciliation, tax/e-Faktur)
- Production Planning (AI)
- Sales & Customer Analytics
- HR & Shift Overview
- Approvals & Full Audit Logs
- AI Insights & Forecasting (demand, what-if, anomaly, natural language)
- Settings (branding, user management, integration, billing)

Semua halaman di atas sudah dirancang agar terasa **enterprise professional** tapi tetap sederhana untuk owner gaptek.

---

## 3. Estimasi Biaya yang Dibayarkan User (UMKM)

**Harga Awal Launch**
- Startup (1 cabang + full enterprise): Rp500.000 awal + Rp200.000/bulan
- Professional (maks 3 cabang + full): Rp800.000 awal + Rp200.000/bulan
- Enterprise: Rp1.000.000 awal + Rp200.000/bulan + custom

**Tahun Berikutnya**
- Pelanggan lama: Harga tetap (minimal 2 tahun)
- Pelanggan baru: Naik 20-40% (Startup Rp250-299rb/bulan)

**Yang Termasuk Harga**
- 3 aplikasi lengkap
- Domain + subdomain (provider beli)
- Hosting & database
- Update fitur
- Support WA

---

## 4. Penjelasan Tambahan Penting

### Multi-Tenant & Self-Service
- Semua data pakai `tenant_id` + Row Level Security.
- Onboarding: Bayar → Isi form → Preview real-time (tampilkan domain + subdomain) → Sistem otomatis beli domain, setup Vercel domain, seed template, buat user owner.

### Domain Strategy
- Provider beli domain utama.
- Struktur yang disepakati: `domain.com` (Customer), `admin.domain.com`, `owner.domain.com`.

### Quota & Scaling (Paling Sering Ditanyakan)
- Free Vercel & Supabase **hampir tidak berguna** untuk komersial (maks 3-7 tenant sangat kecil).
- Langsung mulai dengan Pro tier.
- Trigger upgrade/migrasi ada di dokumen migrasi terpisah (lihat bagian bawah).

### Indonesia Specific
- QRIS (manual → dynamic)
- e-Faktur Coretax
- PPN 11/12
- WhatsApp Business API
- Bahasa Indonesia utama

### Roadmap Singkat dari Nol
- Minggu 1-3: Monorepo + multi-tenant dasar + auth
- Minggu 4-7: Customer + Admin lengkap
- Minggu 8-10: Owner Dashboard + inventory + recipe + AI
- Minggu 11-12: Self-service onboarding + domain automation
- Minggu 13+: Polish + early access

---

## File Pendukung yang Sudah Dibuat Selama Obrolan

- `Final-Full-SaaS-Design-FnB-UMKM-Enterprise.md` (desain lengkap sebelumnya)
- `Migration-Plan-Quotas-and-Scaling.md` (rencana migrasi detail)
- `Free-Tier-Quotas-and-Tech-Stack-Assessment.md` (kuota free + penilaian stack)
- `Complete-Blueprint-From-Scratch-Enterprise-SaaS-FnB.md` (blueprint halaman & fitur)
- `Self-Service-Architecture-and-Pricing-Update.md`
- `Domain-Subdomain-Setup-Guide.md`
- `Commercial-Scheme-Recommendation.md`
- `Pricing-Scheme-2026.md`

---

## Cara Menggunakan Dokumen Ini

1. Simpan file ini di repo proyek kamu.
2. Ketika pindah ke obrolan baru, cukup upload/copy-paste dokumen ini sebagai konteks awal.
3. Gunakan sebagai single source of truth untuk semua keputusan arsitektur, pricing, fitur, dan roadmap.

---

**Dokumen ini sudah mencakup 100% obrolan kita** (dari analisis app existing, diskusi pricing, tech stack, halaman detail, self-service, domain, kuota, migrasi, hingga blueprint final).

Jika ada bagian yang ingin ditambahkan, dikoreksi, atau dipecah menjadi dokumen pendukung baru (misalnya full database schema, contoh kode, atau cost spreadsheet), langsung beri tahu. Saya siap melanjutkan.

Semoga dokumen ini membantu kamu tetap konsisten meskipun obrolan ini berakhir atau dipindah. Semangat membangunnya! 🚀

**File utama ini tersimpan di:**  
`/home/user/docs/Master-Conversation-Summary-and-Final-Blueprint.md`
```

---

### File: `docs/Migration-Plan-Quotas-and-Scaling.md`

```markdown
# Rencana Migrasi, Batas Kuota & Scaling Strategy (Vercel + Cloudflare + Supabase)

**Versi:** 1.0  
**Tanggal:** 9 Juni 2026  
**Target Pengguna:** Solo Developer (atau tim kecil nanti) yang membangun SaaS F&B untuk UMKM di Indonesia (fokus awal Surabaya).  
**Tujuan Dokumen:** Memberikan roadmap jelas kapan harus **upgrade tier** (murah & cepat) dan kapan harus **migrasi tech stack** ke level hardcore enterprise. Termasuk estimasi biaya, trigger berdasarkan metrik nyata, dan strategi penyesuaian harga untuk pelanggan lama vs baru.

---

## 1. Realita Target Pengguna (UMKM F&B Surabaya & Sekitarnya)

- **Skala UMKM tipikal:**
  - 1–3 cabang/outlet
  - 1–5 karyawan per outlet (kasir + dapur)
  - Order per hari: 30–150 (peak malam)
  - Revenue per bulan per cabang: Rp 15jt – Rp 80jt
  - Willingness to pay: Sangat sensitif harga (Rp 200rb/bulan sudah terasa)

- **Metrik yang akan meledak:**
  - Jumlah **Tenant/Owner UMKM** yang daftar (bukan end customer)
  - Jumlah **Admin/Karyawan** aktif per tenant
  - Traffic end-customer (order real-time + tracking)
  - Ukuran database (menu, order history, inventory)

- **Asumsi Pertumbuhan Realistis (dengan dana sendiri):**
  - Tahun 1: 10–30 tenant aktif
  - Tahun 2: 50–150 tenant
  - Tahun 3: 200–500 tenant (jika viral di komunitas F&B Surabaya/Jatim)

---

## 2. Batas Kuota Saat Ini & Kapan Harus Upgrade Tier

### Supabase (Paling Kritis untuk SaaS Kamu)

| Tier          | DB Size | Storage | Bandwidth | Realtime Connections | Compute | Estimasi Biaya | Batas Realistis untuk F&B SaaS |
|---------------|---------|---------|-----------|----------------------|---------|----------------|--------------------------------|
| **Free**      | 500 MB  | 1 GB    | 2 GB/mo   | ~200 concurrent      | Terbatas | $0             | Max 5–10 tenant kecil         |
| **Pro**       | 8 GB    | 100 GB  | 50 GB/mo  | ~500–1000            | 2 CPU   | Mulai ~$25/mo  | 50–150 tenant (rekomendasi awal) |
| **Team**      | 100 GB+ | 1 TB+   | Custom    | Custom               | Custom  | $599+/mo       | 300–800 tenant                |
| **Enterprise**| Custom  | Custom  | Custom    | Custom               | Custom  | Custom         | 1000+ tenant                  |

**Trigger Upgrade / Migrasi Supabase:**
- **Upgrade ke Pro:** Saat database > 400MB atau bandwidth > 1.5GB/bulan atau realtime connection sering timeout (biasanya terjadi di ~25–40 tenant aktif).
- **Pertimbangkan Migrasi:** Saat kamu punya > 150–200 tenant aktif **atau** > 5.000 order/hari total **atau** butuh data residency ketat (regulasi Indonesia).
- **Biaya yang Meledak:** Realtime + Edge Functions paling mahal di Supabase.

### Vercel

| Tier          | Bandwidth | Edge Functions | Builds | Team Members | Estimasi Biaya | Batas Realistis |
|---------------|-----------|----------------|--------|--------------|----------------|-----------------|
| **Hobby**     | 100 GB    | 100K/day       | 6 jam  | 1            | $0 (tidak untuk komersial) | Hanya testing |
| **Pro**       | 1 TB      | 1M/day         | Unlimited | Unlimited   | $20/user/mo + overage | 100–400 tenant (dengan traffic sedang) |
| **Enterprise**| Custom    | Custom         | Custom | Custom       | $3,500+/mo     | 500+ tenant atau butuh SLA |

**Trigger:**
- **Upgrade ke Pro:** Segera saat launch komersial (Hobby dilarang untuk bisnis).
- **Overage mulai terasa:** Bandwidth > 800GB/bulan atau banyak Edge Function invocation (bisa terjadi di 150+ tenant dengan order real-time).
- **Migrasi dari Vercel:** Saat total biaya Vercel > Rp 15–20jt/bulan **atau** butuh background jobs berat / WebSocket persistent / compliance tinggi.

### Cloudflare (Domain + DNS + Optional Workers)

- **Registrar + DNS:** Sangat murah & generous (hampir tidak ada kuota keras untuk DNS biasa).
- **Workers / Pages:** Free tier sangat bagus (100.000 request/hari).
- **Batas Kritis:** Hampir tidak ada untuk SaaS seperti kamu di awal. Biaya baru naik signifikan jika kamu pakai Workers untuk logic berat atau proxy traffic sangat tinggi.

**Kesimpulan Cloudflare:** Jarang jadi bottleneck utama. Upgrade hanya jika kamu butuh WAF advanced atau banyak custom logic di edge.

---

## 3. Rencana Migrasi Bertahap (Solo Dev → Hardcore Enterprise)

### Fase 1: Launch – 50 Tenant (Bulan 1–8)
- **Stack:** Vercel Pro + Supabase Pro + Cloudflare (seperti desain utama)
- **Biaya Estimasi:** Rp 500rb – Rp 2jt / bulan (tergantung traffic)
- **Action:** Monitor via Supabase Dashboard + Vercel Analytics + PostHog / Sentry.
- **Trigger untuk Fase 2:** 
  - Database > 6GB, atau
  - Vercel biaya > Rp 3jt/bulan, atau
  - 80+ tenant aktif dengan order > 3.000/hari total.

### Fase 2: Growth – 150–300 Tenant (Bulan 9–18)
- **Upgrade Tier (Murah & Cepat):**
  - Supabase Team
  - Vercel tetap Pro atau naik ke Enterprise (jika butuh SLA)
- **Mulai Persiapan Migrasi:**
  - Pindah database layer ke **Neon** atau **PlanetScale** (serverless Postgres yang lebih scalable & murah di skala ini).
  - Pindah hosting frontend ke **Railway** atau **Render** (container pricing lebih predictable).
  - Gunakan **Cloudflare Workers** untuk sebagian logic (mengurangi Vercel function cost).
- **Trigger Migrasi Penuh:** 200+ tenant **atau** biaya bulanan > Rp 15jt **atau** butuh background job berat (contoh: auto laporan massal, auto reorder bahan).

### Fase 3: Hardcore Enterprise (300+ Tenant / Tim Sudah Ada)
**Opsi Migrasi Stack (Pilih salah satu atau hybrid):**

**Opsi A (Paling Direkomendasikan untuk Kamu): Hybrid Modern**
- Frontend: Tetap Vercel atau pindah ke Cloudflare Pages + Workers
- Database: Neon / PlanetScale / AWS Aurora Serverless
- Auth: Clerk atau Auth0 (jika butuh advanced SSO)
- Hosting Backend: Railway / Render / AWS ECS (Fargate)
- Orchestration: Kubernetes (hanya jika > 1000 tenant)
- Monitoring: Datadog atau New Relic

**Opsi B (Full Hardcore – Jika Tim Sudah Kuat)**
- Full AWS atau GCP:
  - Next.js di ECS / EKS atau Cloud Run
  - Postgres di Aurora / Cloud SQL
  - Auth: Cognito / WorkOS
  - Storage: S3 / Cloud Storage
  - Queue: SQS / Pub/Sub
  - IaC: Terraform + GitOps

**Opsi C (Self-Hosted untuk Hemat Biaya Jangka Panjang)**
- Appwrite self-hosted di VPS / Hetzner / DigitalOcean + Kubernetes
- Atau Supabase self-hosted (tapi maintenance berat)

---

## 4. Kapan Harus Menyesuaikan Harga Pelanggan

### Aturan Emas (Sangat Penting untuk Solo Dev)

- **Pelanggan Lama (yang daftar di tahun pertama):** 
  - **Jangan naikkan harga** selama minimal 2 tahun (grandfathering).
  - Ini membangun trust dan word-of-mouth di komunitas UMKM Surabaya.

- **Pelanggan Baru:**
  - Naikkan harga 20–40% dibanding pelanggan lama saat kamu sudah di Fase 2 (misal: Basic/Startup jadi Rp 250–300rb/bulan).
  - Enterprise selalu custom dan lebih mahal.

**Rekomendasi Penyesuaian Harga:**

| Fase          | Tenant Aktif | Harga Startup (Baru) | Harga Professional (Baru) | Catatan |
|---------------|--------------|----------------------|---------------------------|---------|
| Launch (0–6 bulan) | < 30        | Rp 200.000          | Rp 200.000               | Harga rendah untuk akuisisi |
| Growth (6–18 bulan) | 30–150     | Rp 250.000          | Rp 250.000               | Naikkan pelan-pelan |
| Scale (18+ bulan)   | 150+       | Rp 299.000–349.000  | Rp 349.000–399.000       | Sesuaikan dengan biaya infra baru |

- Selalu beri **diskon tahunan** yang lebih besar untuk pelanggan baru di fase scale.
- Komunikasikan kenaikan harga 60 hari sebelumnya ke pelanggan lama (meski tidak naikkan untuk mereka).

---

## 5. Metrik yang Harus Kamu Monitor (Dashboard Sederhana)

Buat 1 halaman internal atau pakai PostHog / Supabase + simple dashboard:

**Primary Metrics (Paling Penting):**
- Jumlah Tenant Aktif (Owner UMKM yang bayar)
- Jumlah Active Admin/Karyawan (users per tenant)
- Total Order per Hari (semua tenant)
- Database Size (MB)
- Vercel Bandwidth + Function Invocation
- Supabase Realtime Connection Peak
- Monthly Recurring Revenue (MRR)

**Warning Thresholds (Buat Alert):**

| Metrik                    | Warning (Upgrade Tier) | Critical (Mulai Migrasi) | Hardcore Migrasi |
|---------------------------|------------------------|---------------------------|------------------|
| Tenant Aktif              | 40–60                 | 120–150                   | 250+            |
| Active Karyawan Total     | 80                    | 250                       | 600+            |
| Order/Hari (total)        | 2.000                 | 6.000                     | 15.000+         |
| Supabase DB Size          | 5 GB                  | 12 GB                     | 50 GB+          |
| Vercel Bandwidth/Bulan    | 600 GB                | 1.2 TB                    | 4 TB+           |
| Biaya Infra / Bulan       | Rp 3jt                | Rp 10jt                   | Rp 25jt+        |

---

## 6. Strategi Dana & Pricing untuk Pelanggan Lama vs Baru

- **Fase Launch (dana sendiri terbatas):** Harga rendah + banyak early adopter. Gunakan uang dari pelanggan untuk bayar infra.
- **Fase Growth:** Naikkan harga pelanggan **baru** lebih agresif. Gunakan selisih untuk bayar upgrade tier.
- **Fase Migrasi:** 
  - Pelanggan lama tetap bayar harga lama (ini investasi jangka panjang).
  - Pelanggan baru bayar harga yang sudah disesuaikan dengan biaya infra baru (bisa 1.5x – 2x lebih mahal).
  - Pertimbangkan model **usage-based** tambahan di Enterprise (contoh: bayar per cabang tambahan atau per 1.000 order).

---

## 7. Rekomendasi Praktis untuk Solo Dev di Surabaya

1. **Mulai dengan monitoring ketat** sejak hari pertama (buat alert di Slack/Telegram pribadi).
2. **Jangan migrasi terlalu cepat.** Kebanyakan SaaS Indonesia gagal karena over-engineer terlalu awal.
3. **Fokus dulu dapat 50–70 tenant aktif** dengan kualitas bagus sebelum pikirkan migrasi.
4. **Dana:** Sisihkan 30–40% dari revenue untuk infra + migrasi cadangan.
5. **Tim:** Saat kamu punya 100+ tenant dan revenue stabil, baru pertimbangkan hire 1 orang part-time untuk support & maintenance.
6. **Regulasi Indonesia:** Saat sudah besar, pertimbangkan data residency (data pelanggan Indonesia sebaiknya di region Asia). Ini salah satu alasan kuat untuk migrasi ke AWS Singapore atau self-hosted.

---

**Ringkasan Keputusan Cepat**

- **< 50 tenant + revenue < Rp 15jt/bulan** → Stick dengan Vercel Pro + Supabase Pro. Jangan mikir migrasi.
- **50–150 tenant** → Upgrade tier dulu (Supabase Team + Vercel Pro). Mulai eksperimen alternatif (Neon + Railway).
- **> 200 tenant atau biaya infra > Rp 12–15jt/bulan** → Mulai proyek migrasi serius ke stack yang lebih predictable cost (Railway/Render + Neon/PlanetScale) atau full AWS jika sudah ada tim.

Dokumen ini dirancang agar kamu punya **visibility** dan **rencana cadangan** sejak awal, tanpa harus panik ketika kuota meledak.

Mau saya buatkan versi yang lebih detail (contoh: estimasi biaya detail per fase, contoh alert query Supabase, atau template monitoring dashboard)? Atau mau saya update dokumen desain utama dengan bagian migrasi ini?
```

---

### File: `docs/Self-Service-Architecture-and-Pricing-Update.md`

```markdown
# Self-Service Architecture, Updated Pricing & Technical Implementation

**Tanggal:** 9 Juni 2026  
**Tujuan:** Memberikan panduan teknis langsung untuk implementasi self-service SaaS F&B dengan domain otomatis, subdomain, Vercel deploy, dan Supabase.

---

## 1. Updated Pricing Scheme (Final Sesuai Permintaan)

### Startup (1 Cabang – Full Enterprise Features)
- **Biaya Awal:** Rp 500.000
- **Bulanan:** Rp 200.000
- **Tahunan:** Rp 2.000.000 (diskon)

**Karakteristik:**
- Hanya 1 cabang
- Semua fitur Enterprise lengkap (inventory, recipe/BOM, advanced owner dashboard, forecasting dasar, AI insight, full reporting, unlimited user internal, dll)
- Cocok untuk UMKM yang sudah berkembang tapi belum rencana buka cabang
- Self-service penuh

### Basic (1 Cabang – Fitur Terbatas)
- **Biaya Awal:** Rp 500.000
- **Bulanan:** Rp 200.000
- **Tahunan:** Rp 2.000.000

**Karakteristik:**
- 1 cabang
- Fitur standar (tanpa inventory penuh, tanpa advanced forecasting)

### Professional (Maks 3 Cabang)
- **Biaya Awal:** Rp 800.000
- **Bulanan:** Rp 200.000
- **Tahunan:** Rp 2.200.000

**Karakteristik:**
- Maksimal 3 cabang
- Semua fitur lengkap seperti Enterprise
- Hanya dibatasi jumlah cabang

### Enterprise
- **Biaya Awal:** Rp 1.000.000
- **Bulanan:** Rp 200.000
- **Tahunan:** Rp 2.400.000
- + Custom development (dihitung terpisah)

---

## 2. Catatan Domain (Penting)

- **Kita (provider) yang membeli domain** untuk klien.
- Biaya domain sudah termasuk dalam paket (Rp300.000/tahun dialokasikan di dalam harga).
- Klien tidak perlu beli domain sendiri.
- Domain akan didaftarkan atas nama klien (bisa pakai data mereka atau data kita sebagai perantara).
- Rekomendasi registrar yang punya API: **Cloudflare Registrar**, Namecheap, atau GoDaddy (Domainesia saat ini API-nya terbatas).

---

## 3. Penjelasan Arsitektur Saat Ini (Admin + Karyawan)

Saat ini Anda hanya menggunakan **1 aplikasi Admin/Karyawan** karena:
- Gabungan peran Kasir + Dapur dalam 1 app.
- Kasir: lihat pembayaran, laporan keuangan, shift.
- Dapur: checklist menu yang harus dibuat + bahan yang digunakan.
- Alasan: Mayoritas UMKM F&B hanya butuh 1-2 karyawan per outlet.
- Owner (Anda) belum butuh dashboard terpisah yang kompleks untuk brand sendiri.

**Kesimpulan:** Untuk single brand saat ini, pendekatan "1 app untuk operasional" sudah cukup. Owner Dashboard baru benar-benar diperlukan saat komersial atau saat brand Anda sendiri sudah punya banyak cabang.

---

## 4. Monorepo vs Domain Terpisah

- Anda ingin **1 monorepo**.
- Saat ini pakai domain terpisah karena brand Anda belum punya domain utama.
- **Rekomendasi jangka panjang:** Pindah ke monorepo (Turborepo) begitu brand utama punya domain.
- Untuk sementara (1 bulan ke depan): Lanjutkan dengan 3 project Vercel terpisah sambil siapkan monorepo.

---

## 5. Self-Service System Architecture (Teknis)

### 5.1 User Flow Self-Service

1. User daftar / login di halaman komersial.
2. Pilih paket (Startup / Basic / Professional / Enterprise).
3. Checkout & bayar (Midtrans / Xendit).
4. Redirect ke halaman **Onboarding Form**.
5. Isi data:
   - Nama bisnis
   - Logo + warna brand
   - Alamat, nomor WA, jam operasional
   - Pilihan template (Street Food / Warung Makan / dll)
6. **Preview / Overview** ditampilkan secara real-time (mirip preview template).
7. Di preview juga ditampilkan:
   - Domain yang akan digunakan: `namabisnis.com`
   - Subdomain: `admin.namabisnis.com` dan `owner.namabisnis.com`
8. User klik "Konfirmasi & Buat Sistem Saya".
9. Sistem otomatis:
   - Buat tenant baru di database
   - Daftarkan domain + subdomain
   - Deploy project ke Vercel
   - Buat project Supabase (atau row tenant)
   - Kirim email + WA berisi akses

### 5.2 Domain & Subdomain Otomatis

**Rekomendasi:**
- Gunakan **Cloudflare Registrar** atau Namecheap API (bukan Domainesia untuk automation).
- Flow:
  1. Saat user checkout + isi form, sistem generate slug bisnis (contoh: `martabakpakde`).
  2. Beli domain baru via API registrar (contoh: `martabakpakde.com`).
  3. Langsung tambahkan 3 custom domain di Vercel via **Vercel API**.
  4. Setup DNS otomatis (CNAME ke Vercel) via Cloudflare API.
  5. Subdomain otomatis ikut terdaftar.

**Catatan penting:**
- Domainesia saat ini **tidak direkomendasikan** untuk automation karena API terbatas.
- Lebih baik pindah ke Cloudflare Registrar (lebih murah + API bagus).

### 5.3 Vercel Auto Deploy untuk Tenant Baru

**Opsi Terbaik (Rekomendasi):**

**Gunakan 1 aplikasi monorepo + dynamic tenant routing** (bukan buat project Vercel baru setiap klien).

**Cara:**
- 1 Next.js app (monorepo).
- Setiap tenant punya config di database (`tenant_id`, `domain`, `branding`, `menu_template`).
- Routing berdasarkan hostname:
  - `namabisnis.com` → Customer app
  - `admin.namabisnis.com` → Admin/Kasir
  - `owner.namabisnis.com` → Owner Dashboard
- Custom domain ditambahkan otomatis via **Vercel API** saat onboarding.

**Vercel API yang dibutuhkan:**
- `POST /v9/projects/{projectId}/domains` → tambah custom domain
- Gunakan Vercel Access Token (simpan di environment).

**Alternatif (lebih sederhana untuk 1 bulan pertama):**
- Buat 3 project Vercel template (Customer, Admin, Owner).
- Saat onboarding, clone project via Vercel API atau pakai GitHub template + trigger deploy manual dulu.
- Nanti otomatisasi penuh setelah monorepo selesai.

### 5.4 Supabase Strategy

- **Gunakan 1 Supabase project** (business account Anda).
- Semua tenant dalam 1 database.
- Wajib pakai **Row Level Security (RLS)** + `tenant_id` di hampir semua tabel.
- Saat free tier limit hampir habis → langsung upgrade ke Pro plan.
- Jangan buat project Supabase baru per tenant (mahal dan susah maintenance).

**Struktur tabel minimal yang dibutuhkan:**
- `tenants` (id, name, domain, subdomain, branding_json, package_type, created_at)
- `tenant_users`
- Semua tabel lain (orders, menu_items, dll) harus punya kolom `tenant_id`.

### 5.5 Preview / Overview Fitur

- Buat halaman `/onboarding/preview` yang menggunakan data dari form secara real-time.
- Gunakan iframe atau komponen terpisah yang meniru tampilan Customer, Admin, dan Owner.
- Tampilkan contoh:
  - Customer: `https://preview.namabisnis.com`
  - Admin: `https://admin-preview.namabisnis.com`
  - Owner: `https://owner-preview.namabisnis.com`

Bisa pakai Vercel Preview Deployments atau subdomain statis untuk preview.

### 5.6 GitHub + Vercel Automation Saat Ini vs Masa Depan

**Saat ini (yang Anda pakai):**
- Push ke GitHub → Vercel auto deploy (sudah bagus untuk development).

**Untuk Self-Service (otomatis untuk klien baru):**
- Tidak cukup hanya GitHub push.
- Perlu:
  1. Vercel API untuk menambah custom domain ke project yang sudah ada.
  2. Atau trigger GitHub Action yang membuat branch baru + environment variable tenant_id.
  3. Atau (paling bersih) pakai **monorepo + single deployment** dengan hostname-based routing.

**Rekomendasi implementasi bertahap:**
- Minggu 1-2: Manual + semi-otomatis (Anda yang setup domain + Vercel setelah user bayar).
- Minggu 3+: Otomatisasi penuh menggunakan Vercel API + Cloudflare API.

---

## 6. Rekomendasi Teknis Langsung

1. **Pindah ke Cloudflare Registrar** untuk domain automation.
2. **Mulai bangun monorepo** sekarang (meski masih pakai 3 project Vercel sementara).
3. **Gunakan 1 Supabase project** + RLS + `tenant_id`.
4. **Jangan buat project Vercel baru per tenant** jika memungkinkan (pakai custom domain di 1 project besar).
5. Buat tabel `tenants` + `tenant_settings` sejak awal.
6. Buat halaman preview yang bagus di onboarding (ini jadi selling point besar).

---

## 7. File Penting yang Harus Dibuat

- `tenants` table di Supabase
- Onboarding form + preview component
- API route `/api/onboarding/create-tenant`
- Service untuk beli domain + setup Vercel domain (menggunakan API)
- Vercel project environment variables per tenant (jika pakai multiple projects)

---

**Dokumen ini sudah langsung dalam format implementasi.**  
Kalau butuh contoh kode (API route, Supabase migration, Vercel API call), beri tahu bagian mana yang ingin saya buatkan selanjutnya.
```

---

### File: `lib/auth-client.ts`

```typescript
import { createAuthClient } from "better-auth/react";
import { sentinelClient } from "@better-auth/infra/client";

export const authClient = createAuthClient({
  plugins: [
    sentinelClient(),
  ],
});



```

---

### File: `lib/auth-schema.ts`

```typescript
import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  index,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    identifier: varchar("identifier", { length: 255 }).notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

```

---

### File: `lib/auth.ts`

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "./auth-schema";
import { dash } from "@better-auth/infra";

const client = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(client, { schema });

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: { enabled: true },
  plugins: [
    dash(),
  ],
});

```

---

### File: `package.json`

```json
{
  "name": "taj_saas",
  "private": true,
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev --ui=stream",
    "lint": "turbo lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\""
  },
  "devDependencies": {
    "turbo": "latest"
  },
  "engines": {
    "node": ">=18"
  },
  "packageManager": "pnpm@9.0.0",
  "dependencies": {
    "@better-auth/infra": "^0.2.14",
    "@neondatabase/serverless": "^1.1.0",
    "better-auth": "^1.6.16",
    "drizzle-orm": "^0.45.2"
  }
}

```

---

### File: `packages/config/.gitkeep`

```text
# Placeholder

```

---

### File: `packages/config/package.json`

```json
{
  "name": "@taj-saas/config",
  "version": "0.1.0",
  "private": true
}

```

---

### File: `packages/db/.gitkeep`

```text
# Placeholder

```

---

### File: `packages/db/drizzle.config.ts`

```typescript
import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set for Drizzle configuration.');
}

export default defineConfig({
  schema: './schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});

```

---

### File: `packages/db/index.ts`

```typescript
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// For serverless/edge environments, configure connection pooling if needed
// neonConfig.fetchConnectionCache = true;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not defined.');
}

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
export * as schema from './schema';

```

---

### File: `packages/db/package.json`

```json
{
  "name": "@taj-saas/db",
  "version": "0.1.0",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts",
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "seed": "tsx scripts/seed-template.ts"
  },
  "dependencies": {
    "drizzle-orm": "^0.45.2",
    "@neondatabase/serverless": "^1.1.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.30.0",
    "tsx": "^4.19.0",
    "typescript": "^5.5.0"
  }
}

```

---

### File: `packages/db/schema.ts`

```typescript
import { pgTable, uuid, text, integer, boolean, timestamp, numeric, jsonb, varchar, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==========================================
// 1. Better Auth Tables
// ==========================================

export const user = pgTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    identifier: varchar("identifier", { length: 255 }).notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// ==========================================
// 2. F&B Multi-Tenant Business Tables
// ==========================================

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  domain: text('domain').notNull().unique(),
  adminSubdomain: text('admin_subdomain').notNull(),
  ownerSubdomain: text('owner_subdomain').notNull(),
  branding: jsonb('branding').$type<{
    logoUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    businessName: string;
  }>(),
  packageType: text('package_type').notNull().default('startup'), // startup | professional | enterprise
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // matches auth user id (user.id)
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: text('role').notNull().default('kasir'), // owner | manager | kasir
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
});

export const menuItems = pgTable('menu_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
  isAvailable: boolean('is_available').default(true).notNull(),
  isBestSeller: boolean('is_best_seller').default(false).notNull(),
  isNew: boolean('is_new').default(false).notNull(),
});

export const toppings = pgTable('toppings', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  code: text('code').notNull(), // 'kacang', 'keju', etc.
  name: text('name').notNull(),
  isAvailable: boolean('is_available').default(true).notNull(),
});

export const recipes = pgTable('recipes', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  menuItemId: uuid('menu_item_id').references(() => menuItems.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
});

export const recipeIngredients = pgTable('recipe_ingredients', {
  id: uuid('id').primaryKey().defaultRandom(),
  recipeId: uuid('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }).notNull(),
  ingredientName: text('ingredient_name').notNull(),
  quantity: numeric('quantity', { precision: 10, scale: 2 }).notNull(),
  unit: text('unit').notNull(),
  costPerUnit: numeric('cost_per_unit', { precision: 10, scale: 2 }),
});

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  orderCode: text('order_code').notNull().unique(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  deliveryType: text('delivery_type').notNull(), // pickup | delivery
  deliveryAddress: text('delivery_address'),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric('total_price', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('received'), // received | processing | ready | completed | cancelled
  paymentMethod: text('payment_method').default('cod').notNull(), // cod | qris
  paymentStatus: text('payment_status').default('pending').notNull(), // pending | paid | failed
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  menuItemId: uuid('menu_item_id'),
  menuItemName: text('menu_item_name').notNull(),
  variantName: text('variant_name'),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric('total_price', { precision: 10, scale: 2 }).notNull(),
});

export const shifts = pgTable('shifts', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  operatorId: uuid('operator_id'),
  operatorName: text('operator_name').notNull(),
  openedAt: timestamp('opened_at').defaultNow().notNull(),
  closedAt: timestamp('closed_at'),
  startingCash: numeric('starting_cash', { precision: 10, scale: 2 }).notNull(),
  actualCash: numeric('actual_cash', { precision: 10, scale: 2 }),
  drift: numeric('drift', { precision: 10, scale: 2 }),
  status: text('status').notNull().default('open'), // open | closed
});

// ==========================================
// 3. Relationships Definitions
// ==========================================

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const tenantsRelations = relations(tenants, ({ many }) => ({
  profiles: many(profiles),
  categories: many(categories),
  menuItems: many(menuItems),
  toppings: many(toppings),
  recipes: many(recipes),
  orders: many(orders),
  shifts: many(shifts),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  tenant: one(tenants, {
    fields: [profiles.tenantId],
    references: [tenants.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [categories.tenantId],
    references: [tenants.id],
  }),
  menuItems: many(menuItems),
}));

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [menuItems.tenantId],
    references: [tenants.id],
  }),
  category: one(categories, {
    fields: [menuItems.categoryId],
    references: [categories.id],
  }),
  recipes: many(recipes),
}));

export const toppingsRelations = relations(toppings, ({ one }) => ({
  tenant: one(tenants, {
    fields: [toppings.tenantId],
    references: [tenants.id],
  }),
}));

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [recipes.tenantId],
    references: [tenants.id],
  }),
  menuItem: one(menuItems, {
    fields: [recipes.menuItemId],
    references: [menuItems.id],
  }),
  ingredients: many(recipeIngredients),
}));

export const recipeIngredientsRelations = relations(recipeIngredients, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeIngredients.recipeId],
    references: [recipes.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [orders.tenantId],
    references: [tenants.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

export const shiftsRelations = relations(shifts, ({ one }) => ({
  tenant: one(tenants, {
    fields: [shifts.tenantId],
    references: [tenants.id],
  }),
}));

```

---

### File: `packages/db/scripts/seed-template.ts`

```typescript
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../schema';
import { tenants, categories, menuItems, toppings } from '../schema';
import { eq } from 'drizzle-orm';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const sql = neon(databaseUrl);
const db = drizzle(sql, { schema });

export async function seedTemplate(tenantId: string) {
  console.log('Seeding F&B template for tenant:', tenantId);

  // 1. Clean existing data for this tenant
  await db.delete(toppings).where(eq(toppings.tenantId, tenantId));
  await db.delete(menuItems).where(eq(menuItems.tenantId, tenantId));
  await db.delete(categories).where(eq(categories.tenantId, tenantId));

  // 2. Insert Categories
  const catMartabakAyam = await db.insert(categories).values({
    tenantId,
    name: 'Martabak Telur Ayam',
    slug: 'martabak-telur-ayam',
    sortOrder: 1,
  }).returning();

  const catMartabakBebek = await db.insert(categories).values({
    tenantId,
    name: 'Martabak Telur Bebek',
    slug: 'martabak-telur-bebek',
    sortOrder: 2,
  }).returning();

  const catTerangBulan = await db.insert(categories).values({
    tenantId,
    name: 'Terang Bulan',
    slug: 'terang-bulan',
    sortOrder: 3,
  }).returning();

  const catMinuman = await db.insert(categories).values({
    tenantId,
    name: 'Minuman',
    slug: 'minuman',
    sortOrder: 4,
  }).returning();

  console.log('Categories inserted.');

  // 3. Insert Toppings (universal for Terang Bulan)
  await db.insert(toppings).values([
    { tenantId, code: 'kacang', name: 'Kacang', isAvailable: true },
    { tenantId, code: 'keju', name: 'Keju', isAvailable: true },
    { tenantId, code: 'meses', name: 'Meses', isAvailable: true },
    { tenantId, code: 'pisang', name: 'Pisang', isAvailable: true },
    { tenantId, code: 'susu', name: 'Susu Kental Manis', isAvailable: true },
    { tenantId, code: 'wijen', name: 'Wijen', isAvailable: true },
    { tenantId, code: 'kismis', name: 'Kismis', isAvailable: true },
    { tenantId, code: 'oregan', name: 'Oreo', isAvailable: true },
  ]);
  console.log('Toppings inserted.');

  // 4. Insert Menu Items
  await db.insert(menuItems).values([
    // Martabak Telur Ayam
    {
      tenantId,
      categoryId: catMartabakAyam[0].id,
      name: 'Martabak Telur Ayam - 2 Telur',
      slug: 'martabak-ayam-2-telur',
      description: 'Martabak telur ayam dengan 2 butir telur segar dan daun bawang melimpah.',
      price: '25000',
      isBestSeller: true,
      isNew: false,
    },
    {
      tenantId,
      categoryId: catMartabakAyam[0].id,
      name: 'Martabak Telur Ayam - 3 Telur',
      slug: 'martabak-ayam-3-telur',
      description: 'Martabak telur ayam dengan 3 butir telur segar, lebih tebal dan lezat.',
      price: '35000',
      isBestSeller: false,
      isNew: true,
    },
    {
      tenantId,
      categoryId: catMartabakAyam[0].id,
      name: 'Martabak Telur Ayam - Spesial 5 Telur',
      slug: 'martabak-ayam-5-telur',
      description: 'Porsi jumbo dengan 5 butir telur ayam, daging ayam melimpah ruah.',
      price: '50000',
      isBestSeller: true,
      isNew: false,
    },

    // Martabak Telur Bebek
    {
      tenantId,
      categoryId: catMartabakBebek[0].id,
      name: 'Martabak Telur Bebek - 2 Telur',
      slug: 'martabak-bebek-2-telur',
      description: 'Martabak telur bebek dengan rasa gurih khas telur bebek Surabaya.',
      price: '30000',
      isBestSeller: false,
      isNew: false,
    },
    {
      tenantId,
      categoryId: catMartabakBebek[0].id,
      name: 'Martabak Telur Bebek - 3 Telur',
      slug: 'martabak-bebek-3-telur',
      description: 'Lebih tebal dan gurih dengan 3 butir telur bebek pilihan.',
      price: '40000',
      isBestSeller: true,
      isNew: false,
    },

    // Terang Bulan
    {
      tenantId,
      categoryId: catTerangBulan[0].id,
      name: 'Terang Bulan Coklat Meses',
      slug: 'terbul-coklat-meses',
      description: 'Terang bulan klasik dengan mentega premium dan meses coklat melimpah.',
      price: '20000',
      isBestSeller: true,
      isNew: false,
    },
    {
      tenantId,
      categoryId: catTerangBulan[0].id,
      name: 'Terang Bulan Keju Susu',
      slug: 'terbul-keju-susu',
      description: 'Terang bulan dengan parutan keju kraft tebal dan susu kental manis.',
      price: '25000',
      isBestSeller: true,
      isNew: false,
    },
    {
      tenantId,
      categoryId: catTerangBulan[0].id,
      name: 'Terang Bulan Spesial Campur (Coklat Keju Kacang Wijen)',
      slug: 'terbul-spesial-campur',
      description: 'Terang bulan dengan kombinasi topping coklat, keju, kacang tanah, dan wijen.',
      price: '30000',
      isBestSeller: true,
      isNew: false,
    },

    // Minuman
    {
      tenantId,
      categoryId: catMinuman[0].id,
      name: 'Es Teh Manis',
      slug: 'es-teh-manis',
      description: 'Teh wangi melati disajikan dingin segar.',
      price: '5000',
      isBestSeller: false,
      isNew: false,
    },
    {
      tenantId,
      categoryId: catMinuman[0].id,
      name: 'Es Jeruk Peras',
      slug: 'es-jeruk-peras',
      description: 'Jeruk peras murni dengan es batu segar.',
      price: '7000',
      isBestSeller: false,
      isNew: false,
    },
  ]);

  console.log('Menu items inserted.');
  console.log('Seed template completed successfully!');
}

// Default run execution for a default tenant
async function run() {
  // Let's check if we have a default tenant "a6-nyuss" to seed
  const defaultSlug = 'a6-nyuss';
  
  // Find or create default tenant
  let tenant = await db.select().from(tenants).where(eq(tenants.slug, defaultSlug)).limit(1);
  
  let tenantId: string;
  
  if (tenant.length === 0) {
    console.log('Default tenant not found, creating one...');
    const inserted = await db.insert(tenants).values({
      name: 'Martabak Terbul A6 Nyuss',
      slug: defaultSlug,
      domain: 'a6nyuss.com',
      adminSubdomain: 'admin.a6nyuss.com',
      ownerSubdomain: 'owner.a6nyuss.com',
      branding: {
        primaryColor: '#8E0E0E',
        secondaryColor: '#E05009',
        businessName: 'Martabak Terbul A6 Nyuss',
      },
      packageType: 'startup',
      isActive: true,
    }).returning();
    tenantId = inserted[0].id;
    console.log('Default tenant created:', tenantId);
  } else {
    tenantId = tenant[0].id;
    console.log('Default tenant already exists:', tenantId);
  }

  await seedTemplate(tenantId);
  process.exit(0);
}

if (require.main === module) {
  run().catch((err) => {
    console.error('Seed script failed:', err);
    process.exit(1);
  });
}

```

---

### File: `packages/shared/.gitkeep`

```text
# Placeholder

```

---

### File: `packages/shared/index.ts`

```typescript
export interface ParsedTenant {
  slug: string | null;
  appType: 'customer' | 'admin' | 'owner';
  isLocalhost: boolean;
}

/**
 * Parses tenant slug and application type from request hostname.
 * Supports localhost development formats and production custom domains.
 * 
 * Localhost formats:
 * - customer: [slug].localhost:3000 -> slug, 'customer'
 * - admin: admin.[slug].localhost:3001 -> slug, 'admin'
 * - owner: owner.[slug].localhost:3002 -> slug, 'owner'
 * 
 * Production formats:
 * - customer: [slug].com -> slug, 'customer'
 * - admin: admin.[slug].com -> slug, 'admin'
 * - owner: owner.[slug].com -> slug, 'owner'
 */
export function parseTenantFromHostname(hostname: string): ParsedTenant {
  // Strip port if present
  const host = hostname.split(':')[0].toLowerCase();
  const isLocalhost = host.endsWith('.localhost') || host === 'localhost' || host === '127.0.0.1';

  let slug: string | null = null;
  let appType: 'customer' | 'admin' | 'owner' = 'customer';

  if (isLocalhost) {
    if (host === 'localhost' || host === '127.0.0.1') {
      // Fallback if no subdomain is specified, read environment variable if available
      slug = process.env.NEXT_PUBLIC_TENANT_SLUG || 'a6-nyuss';
      appType = 'customer';
    } else {
      // e.g. admin.a6-nyuss.localhost or a6-nyuss.localhost
      const parts = host.split('.');
      // Remove 'localhost'
      parts.pop();

      if (parts.length === 2) {
        // admin.a6-nyuss or owner.a6-nyuss
        const sub = parts[0];
        slug = parts[1];
        if (sub === 'admin') appType = 'admin';
        else if (sub === 'owner') appType = 'owner';
      } else {
        // a6-nyuss
        slug = parts[0];
        appType = 'customer';
      }
    }
  } else {
    // Production custom domains
    // e.g. admin.martabakpakde.com or martabakpakde.com
    const parts = host.split('.');
    
    if (parts.length >= 3) {
      const sub = parts[0];
      if (sub === 'admin') {
        appType = 'admin';
        slug = parts.slice(1).join('.'); // e.g. martabakpakde.com
      } else if (sub === 'owner') {
        appType = 'owner';
        slug = parts.slice(1).join('.'); // e.g. martabakpakde.com
      } else {
        appType = 'customer';
        slug = host; // Entire domain is the tenant identifier
      }
    } else {
      appType = 'customer';
      slug = host; // Entire domain
    }
  }

  return { slug, appType, isLocalhost };
}

```

---

### File: `packages/shared/package.json`

```json
{
  "name": "@taj-saas/shared",
  "version": "0.1.0",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts",
  "dependencies": {
    "zod": "^3.23.8"
  }
}

```

---

### File: `packages/ui/.gitkeep`

```text
# Placeholder

```

---

### File: `packages/ui/package.json`

```json
{
  "name": "@taj-saas/ui",
  "version": "0.1.0",
  "private": true
}

```

---

### File: `pnpm-lock.yaml`

*[Lock file - content omitted]*

---

### File: `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"

```

---

### File: `scripts/.gitkeep`

```text
# Placeholder

```

---

### File: `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  },
  "globalEnv": [
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "BETTER_AUTH_API_KEY",
    "ABLY_API_KEY",
    "NEXT_PUBLIC_ABLY_API_KEY",
    "GEMINI_API_KEY",
    "NEXT_PUBLIC_SENTRY_DSN",
    "SENTRY_AUTH_TOKEN",
    "NEXT_PUBLIC_POSTHOG_KEY",
    "NEXT_PUBLIC_POSTHOG_HOST",
    "NODE_ENV"
  ]
}

```

---

