'use client';

import React, { createContext, useContext, useState } from 'react';
import type { Tenant } from './tenant';

interface TenantContextProps {
  tenant: Tenant | null;
  loading: boolean;
}

const TenantContext = createContext<TenantContextProps | undefined>(undefined);

export function TenantProvider({
  children,
  initialTenant,
}: {
  children: React.ReactNode;
  initialTenant: Tenant | null;
}) {
  const [tenant] = useState<Tenant | null>(initialTenant);
  const [loading] = useState(false);

  return (
    <TenantContext.Provider value={{ tenant, loading }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
