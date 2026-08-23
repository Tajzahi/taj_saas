"use client";

import { authClient } from "@lib/auth-client";
import LoginPage from "../components/LoginPage";
import Dashboard from "../components/Dashboard";

interface AdminClientPageProps {
  tenantId: string | null;
  tenantSlug: string | null;
  initialSession: any;
  tenantName?: string | null;
  tenantBranding?: any;
}

const ALLOWED_ADMIN_ROLES = ['owner', 'manager', 'kasir', 'kitchen', 'staf'];

export default function AdminClientPage({
  tenantId,
  tenantSlug,
  initialSession,
  tenantName,
  tenantBranding,
}: AdminClientPageProps) {
  // Use React hook to query the session reactively on the client
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
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

  const handleLogout = async () => {
    try {
      await authClient.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const userRole = (session?.user as any)?.role;
  if (!session || !ALLOWED_ADMIN_ROLES.includes(userRole || 'kasir')) {
    return (
      <LoginPage
        onLogin={() => {}}
        tenantSlug={tenantSlug}
        businessName={tenantBranding?.brandName || tenantName || "Portal Operasional"}
        storeTagline={tenantBranding?.receiptHeader || "Portal Operasional Kasir & Dapur"}
        storeCity={tenantBranding?.storeCity || "Indonesia"}
        logoUrl={tenantBranding?.logoUrl || tenantBranding?.logo || null}
      />
    );
  }

  return (
    <Dashboard
      onLogout={handleLogout}
      username={session.user.name || session.user.email}
    />
  );
}
