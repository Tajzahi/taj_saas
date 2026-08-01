import React from "react";
import DashboardContainer from "./DashboardContainer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardContainer>
      {children}
    </DashboardContainer>
  );
}
