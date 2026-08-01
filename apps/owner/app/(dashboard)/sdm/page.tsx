"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatRupiah, formatPercent } from "@/utils/format";
import { ExportDropdown } from "@/components/ui/ExportDropdown";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { getProfilesAction, createEmployeeAction, updateEmployeeAction, deleteEmployeeAction } from "@/app/actions/hr";
import { getBranchesAction } from "@/app/actions/branches";
import { useOwnerStore } from "@/store/ownerStore";



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
  const [addRole, setAddRole] = useState("kasir");
  const [addBranchId, setAddBranchId] = useState("");
  const [addSalary, setAddSalary] = useState(2500000);

  // Edit Employee Form States
  const [showEditEmployee, setShowEditEmployee] = useState(false);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("kasir");
  const [editSalary, setEditSalary] = useState(2500000);

  const handleAddEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName || !addEmail) return;
    setLoading(true);

    const res = await createEmployeeAction({
      name: addName,
      email: addEmail,
      role: addRole,
      salary: addSalary,
    });
    setLoading(false);
    if (res.success && res.data) {
      const selectedBranch = branchesList.find(c => c.id === addBranchId);
      const newEmp = {
        id: res.data.id,
        name: addName,
        email: addEmail,
        role: addRole,
        cabang: selectedBranch ? selectedBranch.name : "Pusat / Kantor",
        shift: "Pagi",
        salary: addSalary,
        hours: 8,
        status: "active",
      };
      setEmployees(prev => [...prev, newEmp]);
      setShowAddEmployee(false);
      setAddName("");
      setAddEmail("");
      setAddRole("kasir");
      setAddBranchId("");
      setAddSalary(2500000);
    } else {
      alert("Gagal menambahkan karyawan: " + res.error);
    }
  };

  const handleEditEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName || !editId) return;
    setLoading(true);

    const res = await updateEmployeeAction({
      id: editId,
      name: editName,
      role: editRole,
      salary: editSalary,
    });
    setLoading(false);
    if (res.success) {
      setEmployees(prev => prev.map(emp => emp.id === editId ? {
        ...emp,
        name: editName,
        role: editRole,
        salary: editSalary,
      } : emp));
      setShowEditEmployee(false);
    } else {
      alert("Gagal mengupdate karyawan: " + res.error);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) return;
    setLoading(true);
    const res = await deleteEmployeeAction(id);
    setLoading(false);
    if (res.success) {
      setEmployees(prev => prev.filter(e => e.id !== id));
    } else {
      alert("Gagal menghapus karyawan: " + res.error);
    }
  };

  useEffect(() => {
    getProfilesAction().then(res => {
      if (res.success && res.data) {
        const mapped = res.data.map((dbProfile: any) => {
          let cabangName = "Pusat / Utama";
          if (dbProfile.email === "dedimulyadi@gail.com" || dbProfile.name?.toLowerCase().includes("dedi")) cabangName = "Demak";
          if (dbProfile.email === "denisetiadi@gmail.com" || dbProfile.name?.toLowerCase().includes("deni")) cabangName = "Pasar Kembang";

          const salaryNum = dbProfile.salary !== undefined && dbProfile.salary !== null
            ? Number(dbProfile.salary)
            : (dbProfile.role === "manager" ? 3000000 : dbProfile.role === "owner" ? 0 : 2500000);

          return {
            id: dbProfile.id,
            name: dbProfile.name || dbProfile.email || "Karyawan",
            email: dbProfile.email,
            role: dbProfile.role || "kasir",
            cabang: cabangName,
            shift: dbProfile.role === "kasir" ? "Pagi / Operational" : "-",
            salary: salaryNum,
            hours: 8,
            status: "active",
          };
        });
        setEmployees(mapped);
      }
      setLoading(false);
    });
    getBranchesAction().then(res => {
      if (res.success && res.data) {
        setBranchesList(res.data);
      }
    });
  }, []);

  let branchName = "Semua Cabang";
  if (selectedBranchId && selectedBranchId !== "all") {
    branchName = "Cabang Terpilih";
  }

  const displayEmployees = employees;
  const totalEmployees = displayEmployees.length;

  const activeShifts = 0;
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
          {vacantShifts > 0 && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">🚨</span>
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
            <div className="col-span-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 text-center">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Belum Ada Jadwal Shift</p>
              <p className="text-xs text-slate-400 mt-1">Jadwal shift kerja kasir dan staf akan muncul di sini setelah diatur.</p>
            </div>
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
                  {["Nama", "Jabatan", "Cabang", "Shift", "Gaji/Bulan", "Status", ""].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {displayEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors animate-fade-in">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-amber-200 flex items-center justify-center text-xs font-bold text-orange-800 flex-shrink-0">
                          {emp.name.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="neutral" size="sm">
                        {emp.role === "kasir" ? "Kasir" :
                         emp.role === "manager" ? "Manajer" :
                         emp.role === "dapur" ? "Staf Dapur" :
                         emp.role === "staff" ? "Staf Umum" : "Owner"}
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
                            setEditRole(emp.role);
                            setEditSalary(Number(emp.salary) || 2500000);
                            setShowEditEmployee(true);
                          }}
                          title="Pengaturan Gaji & Staf"
                        >
                          <svg className="w-4 h-4 text-orange-500 hover:text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteEmployee(emp.id)} title="Hapus Staf">
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowAddEmployee(false)}>
          <form
            onSubmit={handleAddEmployeeSubmit}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Tambah Karyawan</h3>
              <button type="button" onClick={() => setShowAddEmployee(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
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
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-350 block mb-1">Jabatan / Role</label>
                <CustomSelect
                  value={addRole}
                  onChange={setAddRole}
                  options={[
                    { value: "owner", label: "Owner / Pemilik" },
                    { value: "manager", label: "Manajer Cabang" },
                    { value: "kasir", label: "Kasir" },
                    { value: "dapur", label: "Staf Dapur / Kitchen" },
                    { value: "staff", label: "Staf Umum / Pelayan" }
                  ]}
                />
              </div>
              <Input
                label="Gaji Pokok (Rp / Bulan)"
                type="number"
                value={addSalary}
                onChange={e => setAddSalary(Number(e.target.value))}
                placeholder="misal: 2500000"
                required
              />
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-350 block mb-1">Cabang Penugasan</label>
                <CustomSelect
                  value={addBranchId}
                  onChange={setAddBranchId}
                  placeholder="-- Pilih Cabang Penugasan --"
                  options={[
                    { value: "pusat", label: "Pusat / Kantor" },
                    ...branchesList.map(c => ({ value: c.id, label: `${c.name} ${c.city ? `(${c.city})` : ""}` }))
                  ]}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowEditEmployee(false)}>
          <form
            onSubmit={handleEditEmployeeSubmit}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Pengaturan & Edit Karyawan</h3>
              <button type="button" onClick={() => setShowEditEmployee(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <Input
                label="Nama Lengkap"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="misal: Dedi Kurniawan"
                required
              />
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-350 block mb-1">Email (Readonly)</label>
                <input
                  type="email"
                  value={editEmail}
                  disabled
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-350 block mb-1">Jabatan / Role</label>
                <CustomSelect
                  value={editRole}
                  onChange={setEditRole}
                  options={[
                    { value: "owner", label: "Owner / Pemilik" },
                    { value: "manager", label: "Manajer Cabang" },
                    { value: "kasir", label: "Kasir" },
                    { value: "dapur", label: "Staf Dapur / Kitchen" },
                    { value: "staff", label: "Staf Umum / Pelayan" }
                  ]}
                />
              </div>
              <Input
                label="Gaji Pokok (Rp / Bulan)"
                type="number"
                value={editSalary}
                onChange={e => setEditSalary(Number(e.target.value))}
                placeholder="misal: 2500000"
                required
              />
            </div>
            <div className="flex gap-3 mt-6">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowEditEmployee(false)}>Batal</Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
