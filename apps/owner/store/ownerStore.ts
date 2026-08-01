import { create } from "zustand";

interface OwnerState {
  selectedBranchId: string | null;
  dateRange: "today" | "week" | "month" | "custom";
  customStartDate: string | null;
  customEndDate: string | null;
  tenant: any | null;
  
  setSelectedBranchId: (id: string | null) => void;
  setDateRange: (range: "today" | "week" | "month" | "custom") => void;
  setCustomDateRange: (start: string | null, end: string | null) => void;
  setTenant: (tenant: any) => void;
}

export const useOwnerStore = create<OwnerState>((set) => ({
  selectedBranchId: null,
  dateRange: "today",
  customStartDate: null,
  customEndDate: null,
  tenant: null,
  
  setSelectedBranchId: (id) => set({ selectedBranchId: id }),
  setDateRange: (range) => set({ dateRange: range }),
  setCustomDateRange: (start, end) => set({ customStartDate: start, customEndDate: end }),
  setTenant: (tenant) => set({ tenant }),
}));
