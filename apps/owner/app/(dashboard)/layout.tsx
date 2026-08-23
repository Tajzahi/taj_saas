import React from "react";
import { redirect } from "next/navigation";
import DashboardContainer from "./DashboardContainer";
import { requireTenantSession, AuthorizationError } from "@lib/tenant-authorization";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  try {
    const { profile } = await requireTenantSession({ expectedApp: "owner" });
    const OWNER_APP_ALLOWED_ROLES = ["owner", "manager"];
    if (!OWNER_APP_ALLOWED_ROLES.includes(profile.role)) {
      redirect("/unauthorized");
    }
  } catch (err: unknown) {
    if (err instanceof AuthorizationError && err.code === "UNAUTHORIZED") {
      redirect("/login");
    }
    if (err instanceof AuthorizationError && err.code === "FORBIDDEN") {
      redirect("/unauthorized");
    }
    // If NEXT_REDIRECT was thrown, let it pass through
    if (err && typeof err === "object" && "digest" in err) {
      throw err;
    }
    redirect("/login");
  }

  return (
    <DashboardContainer>
      {children}
    </DashboardContainer>
  );
}
