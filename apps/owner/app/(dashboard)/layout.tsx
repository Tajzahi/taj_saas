import React from "react";
import { redirect } from "next/navigation";
import DashboardContainer from "./DashboardContainer";
import { requireTenantSession, AuthorizationError } from "@lib/tenant-authorization";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  try {
    const { profile } = await requireTenantSession({ expectedApp: "owner" });

    if (profile.role === "kasir") {
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
