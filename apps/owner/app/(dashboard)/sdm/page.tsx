/**
 * =========================================================================================
 * 🏗️ BLUEPRINT KONSTRUKSI FITUR: HALAMAN SDM & KARYAWAN (PAGE CLIENT UI)
 * =========================================================================================
 * 
 * 📌 FUNGSI UTAMA FILE:
 * Antarmuka Client UI untuk mengelola Sumber Daya Manusia (HR & Staff Management System) (`/sdm`).
 * Mendaftarkan karyawan baru, mengatur peran (*Owner, Manager, Kasir, Kitchen, Staff*),
 * menetapkan gaji pokok bulanan & cabang penugasan, serta memantau biaya *Labor Cost %*.
 * 
 * 🔄 ALUR KERJA (WORKFLOW KONSTRUKSI):
 * 1. FETCH DATA (Baris 140-180)    : Mengambil profil karyawan (`getProfilesAction`) & cabang (`getBranchesAction`).
 * 2. TAB SWITCHING (Baris 240-270) : Toggle antara Jadwal Shift, Daftar Karyawan, dan Grafik Labor Cost %.
 * 3. FORM HANDLERS (Baris 60-140)  : Eksekusi tambah/edit/hapus karyawan dengan feedback `toast` & input bersih.
 * 
 * 🔗 KETERIKATAN ALUR FILE LAIN:
 * - Server Actions : `apps/owner/app/actions/hr.ts`, `apps/owner/app/actions/branches.ts`
 * - State Store    : `apps/owner/store/ownerStore.ts` (`selectedBranchId`)
 * =========================================================================================
 */

"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatRupiah, formatPercent } from "@/utils/format";
import { ExportDropdown } from "@/components/ui/ExportDropdown";
import { CustomSelect, CustomSelectOption } from "@/components/ui/CustomSelect";
import {
  getProfilesAction,
  createEmployeeAction,
  updateEmployeeAction,
  deleteEmployeeAction,
  getCustomRolesAction,
  createCustomRoleAction,
  deleteCustomRoleAction,
  updateEmployeeShiftAction,
  getShiftTypesAction,
  createShiftTypeAction,
  deleteShiftTypeAction
} from "@/app/actions/hr";
import { getBranchesAction } from "@/app/actions/branches";
import { useOwnerStore } from "@/store/ownerStore";
import toast from "react-hot-toast";



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
  const [employees, setEmployees] = useState<any[]>([]);
  const [branchesList, setBranchesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedBranchId } = useOwnerStore();

  // Add Employee Form States
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addBankAccount, setAddBankAccount] = useState("");
  const [addRole, setAddRole] = useState("kasir");
  const [addBranchId, setAddBranchId] = useState("");
  const [addSalary, setAddSalary] = useState<number | string>(0);

  // Edit Employee Form States
  const [showEditEmployee, setShowEditEmployee] = useState(false);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editBankAccount, setEditBankAccount] = useState("");
  const [editRole, setEditRole] = useState("kasir");
  const [editBranchId, setEditBranchId] = useState("");
  const [editSalary, setEditSalary] = useState<number | string>(0);

  // Master Shift Types States (Synced with DB)
  const [shiftTypesList, setShiftTypesList] = useState<any[]>([]);
  const [showManageShiftsModal, setShowManageShiftsModal] = useState(false);
  const [newShiftName, setNewShiftName] = useState("");
  const [newShiftStart, setNewShiftStart] = useState("07:00");
  const [newShiftEnd, setNewShiftEnd] = useState("15:00");
  const [creatingShiftType, setCreatingShiftType] = useState(false);

  const handleCreateShiftTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShiftName.trim()) {
      toast.error("Nama shift wajib diisi.");
      return;
    }
    setCreatingShiftType(true);
    const res = await createShiftTypeAction({
      name: newShiftName,
      startTime: newShiftStart,
      endTime: newShiftEnd,
      isOff: newShiftName.toLowerCase().includes("off") || newShiftName.toLowerCase().includes("libur"),
    });
    setCreatingShiftType(false);
    if (res.success && res.data) {
      setShiftTypesList(prev => [...prev, res.data]);
      setNewShiftName("");
      setNewShiftStart("07:00");
      setNewShiftEnd("15:00");
      toast.success(res.message || "Jenis shift baru berhasil disimpan ke DB!");
    } else {
      toast.error("Gagal menambahkan shift: " + res.error);
    }
  };

  // Shift Modal States
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [shiftEmpId, setShiftEmpId] = useState("");
  const [shiftValue, setShiftValue] = useState("Pagi");
  const [updatingShift, setUpdatingShift] = useState(false);

  const handleUpdateShiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shiftEmpId) {
      toast.error("Pilih karyawan terlebih dahulu.");
      return;
    }
    setUpdatingShift(true);
    const res = await updateEmployeeShiftAction(shiftEmpId, shiftValue);
    setUpdatingShift(false);
    if (res.success) {
      setEmployees(prev => prev.map(emp => emp.id === shiftEmpId ? { ...emp, shift: shiftValue } : emp));
      setShowShiftModal(false);
      toast.success(res.message || "Jadwal shift berhasil diperbarui!");
    } else {
      toast.error("Gagal memperbarui shift: " + res.error);
    }
  };

  const handleAddEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName || !addEmail) {
      toast.error("Nama dan Email wajib diisi.");
      return;
    }
    setLoading(true);

    const res = await createEmployeeAction({
      name: addName,
      email: addEmail,
      role: addRole,
      salary: Number(addSalary) || 0,
      branchId: addBranchId,
      phone: addPhone,
      bankAccount: addBankAccount,
    });
    setLoading(false);
    if (res.success && res.data) {
      const selectedBranch = branchesList.find(c => c.id === addBranchId);
      const newEmp = {
        id: res.data.id,
        name: addName,
        email: addEmail,
        phone: addPhone || "-",
        bankAccount: addBankAccount || "-",
        role: addRole,
        branchId: addBranchId,
        cabang: selectedBranch ? `${selectedBranch.name}${selectedBranch.city ? ` (${selectedBranch.city})` : ""}` : (branchesList[0]?.name || "-"),
        shift: "Pagi",
        salary: Number(addSalary) || 0,
        hours: 8,
        status: "active",
      };
      setEmployees(prev => [...prev, newEmp]);
      setShowAddEmployee(false);
      setAddName("");
      setAddEmail("");
      setAddPhone("");
      setAddBankAccount("");
      setAddRole("owner");
      setAddBranchId("");
      setAddSalary(0);
      toast.success("Karyawan baru berhasil ditambahkan!");
    } else {
      toast.error("Gagal menambahkan karyawan: " + res.error);
    }
  };

  const handleEditEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName || !editId) {
      toast.error("Nama wajib diisi.");
      return;
    }
    setLoading(true);

    const res = await updateEmployeeAction({
      id: editId,
      name: editName,
      role: editRole,
      salary: Number(editSalary) || 0,
      branchId: editBranchId,
      phone: editPhone,
      bankAccount: editBankAccount,
    });
    setLoading(false);
    if (res.success) {
      const selectedBranch = branchesList.find(c => c.id === editBranchId);
      setEmployees(prev => prev.map(emp => emp.id === editId ? {
        ...emp,
        name: editName,
        phone: editPhone || "-",
        bankAccount: editBankAccount || "-",
        role: editRole,
        branchId: editBranchId,
        cabang: selectedBranch ? `${selectedBranch.name}${selectedBranch.city ? ` (${selectedBranch.city})` : ""}` : (branchesList[0]?.name || "-"),
        salary: Number(editSalary) || 0,
      } : emp));
      setShowEditEmployee(false);
      toast.success("Data karyawan berhasil diperbarui!");
    } else {
      toast.error("Gagal mengupdate karyawan: " + res.error);
    }
  };

  const handleDeleteEmployee = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus karyawan ${name}?`)) return;
    setLoading(true);
    const res = await deleteEmployeeAction(id);
    setLoading(false);
    if (res.success) {
      setEmployees(prev => prev.filter(e => e.id !== id));
      toast.success(`Karyawan ${name} berhasil dihapus.`);
    } else {
      toast.error("Gagal menghapus karyawan: " + res.error);
    }
  };

  // Custom Role States
  const [customRolesList, setCustomRolesList] = useState<any[]>([]);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [targetFormForRole, setTargetFormForRole] = useState<"add" | "edit">("add");
  const [creatingRole, setCreatingRole] = useState(false);

  const defaultRoles = [
    { value: "owner", label: "Owner / Pemilik" }
  ];

  const handleDeleteCustomRole = async (roleCode: string) => {
    const roleObj = customRolesList.find(r => r.code === roleCode);
    const roleName = roleObj ? roleObj.name : roleCode;

    if (!confirm(`Apakah Anda yakin ingin menghapus role kustom '${roleName}'?`)) return;

    setLoading(true);
    const res = await deleteCustomRoleAction(roleCode);
    setLoading(false);
    if (res.success) {
      setCustomRolesList(prev => prev.filter(r => r.code !== roleCode));
      if (addRole === roleCode) setAddRole("owner");
      if (editRole === roleCode) setEditRole("owner");
      toast.success(res.message || `Role '${roleName}' berhasil dihapus.`);
    } else {
      toast.error(res.error || "Gagal menghapus role.");
    }
  };

  const roleOptions: CustomSelectOption[] = [
    ...defaultRoles,
    ...customRolesList.map(r => ({
      value: r.code,
      label: r.name,
      isDeletable: true,
      onDelete: (val: string) => handleDeleteCustomRole(val),
    })),
    { value: "__add_new_role__", label: "➕ Tambah Role Baru..." }
  ];

  const handleRoleSelectChange = (val: string, formType: "add" | "edit") => {
    if (val === "__add_new_role__") {
      setTargetFormForRole(formType);
      setShowAddRoleModal(true);
    } else {
      if (formType === "add") setAddRole(val);
      else setEditRole(val);
    }
  };

  const handleCreateRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      toast.error("Nama role wajib diisi.");
      return;
    }
    setCreatingRole(true);
    const res = await createCustomRoleAction({ name: newRoleName, description: newRoleDesc });
    setCreatingRole(false);
    if (res.success && res.data) {
      setCustomRolesList(prev => [...prev, res.data]);
      if (targetFormForRole === "add") {
        setAddRole(res.data.code);
      } else {
        setEditRole(res.data.code);
      }
      setShowAddRoleModal(false);
      setNewRoleName("");
      setNewRoleDesc("");
      toast.success(`Role '${res.data.name}' berhasil ditambahkan ke database!`);
    } else {
      toast.error("Gagal menambahkan role: " + res.error);
    }
  };

  const getRoleLabel = (roleCode: string) => {
    if (roleCode === "owner") return "Owner / Pemilik";
    const foundCustom = customRolesList.find(r => r.code === roleCode || r.value === roleCode);
    if (foundCustom) return foundCustom.name || foundCustom.label;
    return roleCode.charAt(0).toUpperCase() + roleCode.slice(1);
  };

  const handleDeleteShiftType = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus jenis shift '${name}'?`)) return;
    const res = await deleteShiftTypeAction(id);
    if (res.success) {
      setShiftTypesList(prev => prev.filter(s => s.id !== id));
      toast.success(`Jenis shift '${name}' berhasil dihapus.`);
    } else {
      toast.error("Gagal menghapus jenis shift: " + res.error);
    }
  };

  useEffect(() => {
    Promise.all([
      getProfilesAction(),
      getBranchesAction(),
      getCustomRolesAction(),
      getShiftTypesAction()
    ]).then(([profilesRes, branchesRes, rolesRes, shiftsRes]) => {
      let currentBranches: any[] = [];
      if (branchesRes.success && branchesRes.data) {
        setBranchesList(branchesRes.data);
        currentBranches = branchesRes.data;
      }
      if (rolesRes.success && rolesRes.data) {
        setCustomRolesList(rolesRes.data);
      }
      if (shiftsRes.success && shiftsRes.data) {
        setShiftTypesList(shiftsRes.data);
      }
      if (profilesRes.success && profilesRes.data) {
        const mapped = profilesRes.data.map((dbProfile: any) => {
          let cabangName = currentBranches[0] ? `${currentBranches[0].name}${currentBranches[0].city ? ` (${currentBranches[0].city})` : ""}` : "-";
          if (dbProfile.branchId) {
            const foundB = currentBranches.find((b: any) => b.id === dbProfile.branchId);
            if (foundB) cabangName = `${foundB.name}${foundB.city ? ` (${foundB.city})` : ""}`;
          }

          const salaryNum = dbProfile.salary !== undefined && dbProfile.salary !== null
            ? (parseFloat(dbProfile.salary) || 0)
            : 0;

          return {
            id: dbProfile.id,
            name: dbProfile.name || dbProfile.email || "Karyawan",
            email: dbProfile.email,
            phone: dbProfile.phone || "-",
            bankAccount: dbProfile.bankAccount || "-",
            role: dbProfile.role || "kasir",
            branchId: dbProfile.branchId || null,
            cabang: cabangName,
            shift: dbProfile.shift || "Pagi",
            salary: salaryNum,
            hours: 8,
            status: "active",
          };
        });
        setEmployees(mapped);
      }
      setLoading(false);
    });
  }, []);

  let branchName = "Semua Cabang";
  if (selectedBranchId && selectedBranchId !== "all") {
    branchName = "Cabang Terpilih";
  }

  const displayEmployees = employees;
  const totalEmployees = displayEmployees.length;

  const activeShifts = displayEmployees.filter(e => !(e.shift || "").toLowerCase().includes("off") && !(e.shift || "").toLowerCase().includes("libur")).length;
  const vacantShifts = 0;
  const totalLaborCost = displayEmployees.reduce((sum, emp) => sum + (Number(emp.salary) || 0), 0);

  const laborCostChart: any[] = [];
  const filteredCabangList: any[] = [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">SDM & Shift {selectedBranchId && selectedBranchId !== "all" && `- ${branchName}`}</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manajemen karyawan, shift, dan biaya tenaga kerja</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportDropdown 
            data={displayEmployees}
            columns={["Nama", "Role", "Cabang", "Status"]}
            filename="data_karyawan"
            title="Data Karyawan"
            pdfDataMapper={(item) => [item.name, item.role, item.cabang, item.status]}
          />
          <Button variant="primary" size="sm" onClick={() => setShowAddEmployee(true)} icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }>Tambah Karyawan</Button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Karyawan", value: totalEmployees.toString(), icon: "👥", trend: null },
          { label: "Shift Aktif", value: activeShifts.toString(), icon: "🟢", trend: null },
          { label: "Posisi Kosong", value: vacantShifts.toString(), icon: "🔴", trend: "alert" },
          { label: "Total Labor Cost", value: formatRupiah(totalLaborCost, true), icon: "💵", trend: null },
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
        {[
          { key: "shift", label: "🕐 Jadwal Shift" },
          { key: "karyawan", label: "👤 Daftar Karyawan" },
          { key: "biaya", label: "💰 Biaya Tenaga Kerja" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === tab.key ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full border-2 border-orange-200 dark:border-orange-950" />
            <div className="absolute inset-0 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
          </div>
        </div>
      )}

      {!loading && activeTab === "shift" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center text-lg font-bold">
                🕐
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">Matriks Penjadwalan Shift Karyawan</h3>
                <p className="text-xs text-slate-500">Kelola shift Pagi, Siang, Malam, dan Hari Libur untuk seluruh staf</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowManageShiftsModal(true)}
              >
                ⚙️ Kelola Jam Shift
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (displayEmployees.length > 0) setShiftEmpId(displayEmployees[0].id);
                  setShiftValue(shiftTypesList[0]?.name || "Shift Pagi");
                  setShowShiftModal(true);
                }}
                icon={
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                Atur Shift Staf
              </Button>
            </div>
          </div>

          {/* Shift Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {shiftTypesList.map((shiftCard) => {
              const assigned = displayEmployees.filter(e => (e.shift || "").toLowerCase().includes(shiftCard.name.toLowerCase()));
              const isOff = shiftCard.isOff || shiftCard.name.toLowerCase().includes("libur") || shiftCard.name.toLowerCase().includes("off");
              const icon = isOff
                ? "🏖️"
                : shiftCard.name.toLowerCase().includes("pagi")
                ? "☀️"
                : shiftCard.name.toLowerCase().includes("siang")
                ? "🌤️"
                : shiftCard.name.toLowerCase().includes("malam")
                ? "🌙"
                : "⏰";
              const timeDisplay = isOff ? "Jadwal Rutin" : `${shiftCard.startTime} - ${shiftCard.endTime}`;
              const color = isOff
                ? "border-slate-200 bg-slate-50/50 dark:bg-slate-900/50 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                : shiftCard.name.toLowerCase().includes("pagi")
                ? "border-amber-200 bg-amber-50/50 dark:bg-amber-950/10 dark:border-amber-900/30 text-amber-700 dark:text-amber-300"
                : shiftCard.name.toLowerCase().includes("siang")
                ? "border-blue-200 bg-blue-50/50 dark:bg-blue-950/10 dark:border-blue-900/30 text-blue-700 dark:text-blue-300"
                : shiftCard.name.toLowerCase().includes("malam")
                ? "border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/10 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                : "border-orange-200 bg-orange-50/50 dark:bg-orange-950/10 dark:border-orange-900/30 text-orange-700 dark:text-orange-300";

              return (
                <div key={shiftCard.id || shiftCard.name} className={`rounded-xl border p-4 flex flex-col justify-between ${color}`}>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{icon}</span>
                        <div>
                          <h4 className="text-sm font-bold">{shiftCard.name}</h4>
                          <span className="text-[11px] opacity-75 font-mono">{timeDisplay}</span>
                        </div>
                      </div>
                      <Badge variant="neutral" size="sm">{assigned.length} Staf</Badge>
                    </div>

                    <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
                      {assigned.length === 0 ? (
                        <p className="text-xs italic opacity-60 py-3 text-center">Belum ada staf ditugaskan</p>
                      ) : (
                        assigned.map(emp => (
                          <div key={emp.id} className="bg-white dark:bg-slate-900 rounded-lg p-2.5 border border-slate-200/60 dark:border-slate-800 shadow-xs flex items-center justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{emp.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] text-slate-500 font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{getRoleLabel(emp.role)}</span>
                                <span className="text-[10px] text-slate-400 truncate">{emp.cabang}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setShiftEmpId(emp.id);
                                setShiftValue(emp.shift || shiftCard.name);
                                setShowShiftModal(true);
                              }}
                              className="p-1 rounded text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all shrink-0 text-xs font-semibold"
                              title="Ubah Shift Karyawan ini"
                            >
                              ✏️
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!loading && activeTab === "karyawan" && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Daftar Karyawan</h3>
            <Button variant="outline" size="sm">Filter</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {["Nama & Email", "Kontak & Rekening", "Jabatan", "Cabang", "Shift", "Gaji/Bulan", "Status", ""].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {displayEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors animate-fade-in">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-amber-200 flex items-center justify-center text-xs font-bold text-orange-800 flex-shrink-0">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">{emp.name}</span>
                          <span className="text-xs text-slate-400 font-mono block">{emp.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-0.5 text-xs">
                        <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                          <span className="text-slate-400">📱</span>
                          {emp.phone && emp.phone !== "-" ? (
                            <a
                              href={`https://wa.me/${emp.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-orange-600 dark:text-orange-400 hover:underline font-mono"
                              title="Chat WhatsApp"
                            >
                              {emp.phone}
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">Belum diset</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <span className="text-slate-400">💳</span>
                          <span className="font-mono">{emp.bankAccount && emp.bankAccount !== "-" ? emp.bankAccount : <span className="text-slate-400 italic">Belum diset</span>}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="neutral" size="sm">
                        {getRoleLabel(emp.role)}
                      </Badge>
                    </td>
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditId(emp.id);
                            setEditName(emp.name);
                            setEditEmail(emp.email);
                            setEditPhone(emp.phone && emp.phone !== "-" ? emp.phone : "");
                            setEditBankAccount(emp.bankAccount && emp.bankAccount !== "-" ? emp.bankAccount : "");
                            setEditRole(emp.role);
                            setEditBranchId(emp.branchId || "pusat");
                            setEditSalary(Number(emp.salary) || 0);
                            setShowEditEmployee(true);
                          }}
                          title="Pengaturan Gaji & Staf"
                        >
                          <svg className="w-4 h-4 text-orange-500 hover:text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteEmployee(emp.id, emp.name)} title="Hapus Staf">
                          <svg className="w-4 h-4 text-red-500 hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

      {!loading && activeTab === "biaya" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Labor Cost % per Cabang</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={laborCostChart} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} domain={[0, 25]} />
                <Tooltip content={<LaborTooltip />} />
                <Bar dataKey="laborCost" name="Labor Cost" radius={[4, 4, 0, 0]} maxBarSize={36} fill="#f97316" />
                <Bar dataKey="target" name="Target Max" radius={[4, 4, 0, 0]} maxBarSize={36} fill="#e2e8f0" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Detail Labor Cost per Cabang</h3>
            {filteredCabangList.length > 0 ? (
              <div className="space-y-4">
                {filteredCabangList.map((cabang) => {
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
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                Belum ada data biaya tenaga kerja cabang terdaftar
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in" onClick={() => setShowAddEmployee(false)}>
          <form
            onSubmit={handleAddEmployeeSubmit}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center text-lg font-bold shadow-xs">
                  👤
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">Tambah Karyawan Baru</h3>
                  <p className="text-xs text-slate-500">Isi data staf dan tentukan cabang penugasan</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowAddEmployee(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Nama Lengkap"
                value={addName}
                onChange={e => setAddName(e.target.value)}
                placeholder="misal: Dedi Kurniawan"
                required
              />
              <Input
                label="Email"
                type="email"
                value={addEmail}
                onChange={e => setAddEmail(e.target.value)}
                placeholder="misal: dedi@a6nyuss.com"
                required
              />
              <Input
                label="No. WhatsApp / Telepon"
                type="tel"
                value={addPhone}
                onChange={e => setAddPhone(e.target.value)}
                placeholder="misal: 081234567890"
              />
              <Input
                label="No. Rekening & Bank"
                value={addBankAccount}
                onChange={e => setAddBankAccount(e.target.value)}
                placeholder="misal: BCA - 1234567890 a/n Dedi"
              />
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Jabatan / Role</label>
                <CustomSelect
                  value={addRole}
                  onChange={(val) => handleRoleSelectChange(val, "add")}
                  options={roleOptions}
                  maxItems={4}
                />
              </div>
              <Input
                label="Gaji Pokok (Rp / Bulan)"
                type="number"
                value={addSalary}
                onChange={e => setAddSalary(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="misal: 2500000"
                required
              />
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Cabang Penugasan</label>
                <CustomSelect
                  value={addBranchId}
                  onChange={setAddBranchId}
                  placeholder="-- Pilih Cabang Penugasan --"
                  maxItems={2}
                  options={branchesList.map(c => ({ value: c.id, label: `${c.name} ${c.city ? `(${c.city})` : ""}` }))}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddEmployee(false)}>Batal</Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
                {loading ? "Menyimpan..." : "Tambah Karyawan"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditEmployee && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in" onClick={() => setShowEditEmployee(false)}>
          <form
            onSubmit={handleEditEmployeeSubmit}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center text-lg font-bold shadow-xs">
                  ✏️
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">Pengaturan & Edit Karyawan</h3>
                  <p className="text-xs text-slate-500">Perbarui data role, gaji, dan cabang penugasan</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowEditEmployee(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Nama Lengkap"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="misal: Dedi Kurniawan"
                required
              />
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Email (Readonly)</label>
                <input
                  type="email"
                  value={editEmail}
                  disabled
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/80 text-sm text-slate-500 cursor-not-allowed font-medium"
                />
              </div>
              <Input
                label="No. WhatsApp / Telepon"
                type="tel"
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                placeholder="misal: 081234567890"
              />
              <Input
                label="No. Rekening & Bank"
                value={editBankAccount}
                onChange={e => setEditBankAccount(e.target.value)}
                placeholder="misal: BCA - 1234567890 a/n Dedi"
              />
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Jabatan / Role</label>
                <CustomSelect
                  value={editRole}
                  onChange={(val) => handleRoleSelectChange(val, "edit")}
                  options={roleOptions}
                  maxItems={4}
                />
              </div>
              <Input
                label="Gaji Pokok (Rp / Bulan)"
                type="number"
                value={editSalary}
                onChange={e => setEditSalary(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="misal: 2500000"
                required
              />
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Cabang Penugasan</label>
                <CustomSelect
                  value={editBranchId}
                  onChange={setEditBranchId}
                  placeholder="-- Pilih Cabang Penugasan --"
                  maxItems={2}
                  options={branchesList.map(c => ({ value: c.id, label: `${c.name} ${c.city ? `(${c.city})` : ""}` }))}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowEditEmployee(false)}>Batal</Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Centered Modern Add Custom Role Modal */}
      {showAddRoleModal && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowAddRoleModal(false)}
        >
          <form
            onSubmit={handleCreateRoleSubmit}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg sm:max-w-xl max-h-[95vh] overflow-y-auto p-5 sm:p-7 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center text-lg font-bold shadow-xs">
                  🛡️
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">Tambah Role Staf Baru</h3>
                  <p className="text-xs text-slate-500">Kustomisasi jabatan karyawan terhubung ke DB</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setShowAddRoleModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 pb-4">
              <Input
                label="Nama Role / Jabatan"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Contoh: Barista, Supervisor, Kurir, Head Chef"
                required
              />
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-350 block mb-1">
                  Keterangan / Tugas (Opsional)
                </label>
                <textarea
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Keterangan singkat wewenang atau deskripsi kerja..."
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none h-20"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddRoleModal(false)}>Batal</Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={creatingRole}>
                {creatingRole ? "Menyimpan..." : "Simpan Role"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Shift Edit Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in" onClick={() => setShowShiftModal(false)}>
          <form
            onSubmit={handleUpdateShiftSubmit}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto p-5 sm:p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center text-lg font-bold shadow-xs">
                  🕐
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Penjadwalan Shift Staf</h3>
                  <p className="text-xs text-slate-500">Tentukan jam tugas & jenis shift karyawan</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowShiftModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Pilih Karyawan</label>
                <CustomSelect
                  value={shiftEmpId}
                  onChange={setShiftEmpId}
                  options={displayEmployees.map(e => ({ value: e.id, label: `${e.name} (${getRoleLabel(e.role)})` }))}
                  placeholder="-- Pilih Karyawan --"
                  maxItems={2}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Pilih Jenis Shift</label>
                <CustomSelect
                  value={shiftValue}
                  onChange={(val) => {
                    if (val === "__manage_shifts__") {
                      setShowManageShiftsModal(true);
                    } else {
                      setShiftValue(val);
                    }
                  }}
                  options={[
                    ...shiftTypesList.map(st => ({
                      value: st.name,
                      label: st.isOff ? `🏖️ ${st.name}` : `⏰ ${st.name} (${st.startTime} - ${st.endTime})`
                    })),
                    { value: "__manage_shifts__", label: "⚙️ Kelola Master Shift..." }
                  ]}
                  maxItems={2}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowShiftModal(false)}>Batal</Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={updatingShift}>
                {updatingShift ? "Menyimpan..." : "Simpan Shift"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Manage Master Shift Types Modal */}
      {showManageShiftsModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in" onClick={() => setShowManageShiftsModal(false)}>
          <form
            onSubmit={handleCreateShiftTypeSubmit}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg max-h-[90vh] sm:max-h-none overflow-y-auto sm:overflow-visible p-5 sm:p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center text-lg font-bold shadow-xs">
                  ⚙️
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Pengaturan Master Jam Shift</h3>
                  <p className="text-xs text-slate-500">Atur jam masuk, jam keluar, dan nama shift (Tersinkron DB)</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowManageShiftsModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* List Existing Shift Types */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">Daftar Shift Tersimpan:</label>
              <div className="space-y-2 max-h-32 sm:max-h-36 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                {shiftTypesList.length === 0 ? (
                  <p className="text-xs italic text-slate-400 text-center py-2">Belum ada jenis shift tersimpan</p>
                ) : (
                  shiftTypesList.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{s.name}</span>
                        <span className="text-slate-500 ml-2 font-mono">{s.isOff ? "(Hari Libur)" : `${s.startTime} - ${s.endTime}`}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteShiftType(s.id, s.name)}
                        className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-all"
                        title="Hapus Shift Ini"
                      >
                        🗑️
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Form Create New Shift Type */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3.5 space-y-3">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">➕ Tambah Jenis Shift Baru:</p>
              <Input
                label="Nama Shift"
                value={newShiftName}
                onChange={e => setNewShiftName(e.target.value)}
                placeholder="misal: Shift Middle, Shift Event, Shift Pagi"
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Jam Masuk Kerja</label>
                  <input
                    type="time"
                    value={newShiftStart}
                    onChange={e => setNewShiftStart(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Jam Keluar Kerja</label>
                  <input
                    type="time"
                    value={newShiftEnd}
                    onChange={e => setNewShiftEnd(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowManageShiftsModal(false)}>Batal</Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={creatingShiftType}>
                {creatingShiftType ? "Menyimpan..." : "Simpan Shift"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
