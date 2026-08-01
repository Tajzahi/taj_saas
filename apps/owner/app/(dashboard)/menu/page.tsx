"use client";

import React, { useState, useEffect } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatRupiah, formatPercent } from "@/utils/format";
import { ExportDropdown } from "@/components/ui/ExportDropdown";
import { getMenuItemsAction, getCategoriesAction, createMenuItemAction, updateMenuItemAction } from "@/app/actions/menu";
import { getMenuEngineeringAction } from "@/app/actions/analytics";

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

const statusColors: Record<string, string> = {
  star: "#22c55e",
  "plow-horse": "#3b82f6",
  puzzle: "#f59e0b",
  dog: "#ef4444",
};

const statusLabels: Record<string, string> = {
  star: "STAR",
  "plow-horse": "POPULER",
  puzzle: "PREMIUM",
  dog: "EVALUASI",
};

function EngineeringTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl max-w-[200px]">
        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-1">{d.name}</p>
        <p className="text-xs text-slate-500">Terjual: <span className="font-semibold text-slate-700 dark:text-slate-200">{d.x} pcs</span></p>
        <p className="text-xs text-slate-500">Margin: <span className="font-semibold text-slate-700 dark:text-slate-200">{d.y.toFixed(1)}%</span></p>
        <p className="text-xs text-slate-500">Omzet: <span className="font-semibold text-slate-700 dark:text-slate-200">{formatRupiah(d.revenue, true)}</span></p>
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
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [loading, setLoading] = useState(true);

  // Edit Menu states
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editCost, setEditCost] = useState(0);

  // Add Menu states
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [addName, setAddName] = useState("");
  const [addCategory, setAddCategory] = useState("");
  const [addPrice, setAddPrice] = useState(0);
  const [addCost, setAddCost] = useState(0);
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([getMenuItemsAction(), getCategoriesAction(), getMenuEngineeringAction()]).then(([menuRes, catRes, engRes]) => {
      let cats: any[] = [];
      if (catRes.success && catRes.data) {
        setDbCategories(catRes.data);
        cats = catRes.data;
      }
      
      const engMap = new Map<string, any>();
      if (engRes.success && engRes.data) {
        engRes.data.forEach((e: any) => engMap.set(e.name, e));
      }

      if (menuRes.success && menuRes.data) {
        const mapped = menuRes.data.map((dbMenu: any) => {
          const catObj = cats.find(c => c.id === dbMenu.categoryId);
          const categoryName = catObj ? catObj.name : "Lainnya";
          const price = Number(dbMenu.price) || 0;
          const cost = Number(dbMenu.cost) || Math.round(price * 0.35);
          const margin = price > 0 ? ((price - cost) / price) * 100 : 0;
          const eng = engMap.get(dbMenu.name);

          return {
            id: dbMenu.id,
            name: dbMenu.name,
            category: categoryName,
            price,
            cost,
            margin: Number(margin.toFixed(1)),
            soldToday: eng ? eng.totalQty : 0,
            revenue: eng ? eng.totalRevenue : 0,
            status: margin >= 60 ? "star" : "plow-horse",
          };
        });
        setMenuItems(mapped);

        const uniqCategories = ["all", ...Array.from(new Set(mapped.map((m: any) => m.category)))];
        setCategories(uniqCategories as string[]);
      }
      setLoading(false);
    });
  }, []);

  const handleOpenEdit = (item: any) => {
    setEditItem(item);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditPrice(item.price);
    setEditCost(item.cost);
    setShowEdit(true);
    setSelectedMenu(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName || !editCategory) return;
    setLoading(true);
    const catObj = dbCategories.find(c => c.name.toLowerCase() === editCategory.toLowerCase());
    const res = await updateMenuItemAction(editItem.id, {
      name: editName,
      categoryId: catObj ? catObj.id : undefined,
      price: editPrice,
    });
    setLoading(false);
    if (res.success) {
      setMenuItems(prev => prev.map(m => m.id === editItem.id ? {
        ...m,
        name: editName,
        category: editCategory,
        price: editPrice,
        cost: editCost,
        margin: editPrice > 0 ? ((editPrice - editCost) / editPrice) * 100 : 0,
      } : m));
      setShowEdit(false);
    } else {
      alert("Gagal menyimpan perubahan: " + res.error);
    }
  };

  const handleAddMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName || !addCategory) return;
    setLoading(true);
    const catObj = dbCategories.find(c => c.name.toLowerCase() === addCategory.toLowerCase());
    const res = await createMenuItemAction({
      name: addName,
      categoryId: catObj ? catObj.id : undefined,
      price: addPrice,
    });
    setLoading(false);
    if (res.success && res.data) {
      const newMenu = {
        id: res.data.id,
        name: addName,
        category: addCategory,
        price: addPrice,
        cost: addCost,
        margin: addPrice > 0 ? ((addPrice - addCost) / addPrice) * 100 : 0,
        soldToday: 0,
        revenue: 0,
        status: "star",
      };
      setMenuItems(prev => [newMenu, ...prev]);
      setShowAddMenu(false);
      setAddName("");
      setAddCategory("");
      setAddPrice(0);
      setAddCost(0);
    } else {
      alert("Gagal menambahkan menu: " + res.error);
    }
  };



  const engineeringData = menuItems.map(m => ({
    name: m.name,
    x: m.soldToday,
    y: m.margin,
    revenue: m.revenue,
    status: m.status,
    category: m.category,
  }));

  const avgSold = engineeringData.length > 0 ? engineeringData.reduce((sum, m) => sum + m.x, 0) / engineeringData.length : 0;
  const avgMargin = engineeringData.length > 0 ? engineeringData.reduce((sum, m) => sum + m.y, 0) / engineeringData.length : 0;

  const filtered = menuItems.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || m.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const selectedItem = menuItems.find(m => m.id === selectedMenu);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Menu & Resep (BOM)</h2>
          <p className="text-sm text-slate-500 mt-0.5">{menuItems.length} menu aktif · Bill of Materials</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportDropdown 
            data={filtered}
            columns={["Nama Menu", "Kategori", "Harga Base", "Harga GoFood"]}
            filename="data_menu"
            title="Daftar Menu"
            pdfDataMapper={(item) => [item.name, item.category, item.basePrice, item.gofoodPrice]}
            label="Unduh"
          />
          <Button variant="primary" size="sm" onClick={() => setShowAddMenu(true)} icon={
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
            {tab === "list" ? "📋 Daftar Menu" : "📊 Menu Engineering"}
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

      {!loading && activeTab === "list" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Menu List */}
          <div className="lg:col-span-3 space-y-3">
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      {["Menu", "Kategori", "Harga", "HPP", "Margin", "Terjual", "Status", ""].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filtered.map(menu => (
                      <tr
                        key={menu.id}
                        onClick={() => setSelectedMenu(menu.id)}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer ${selectedMenu === menu.id ? "bg-orange-50/50 dark:bg-orange-950/10" : ""}`}
                      >
                        <td className="px-4 py-3 font-semibold text-sm text-slate-800 dark:text-slate-200">{menu.name}</td>
                        <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{menu.category}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200">{formatRupiah(menu.price)}</td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatRupiah(menu.cost)}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`font-semibold ${menu.margin >= 68 ? "text-emerald-600" : menu.margin >= 62 ? "text-amber-600" : "text-red-500"}`}>
                            {formatPercent(menu.margin)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">{menu.soldToday} pcs</td>
                        <td className="px-4 py-3">
                          <Badge variant={
                            menu.status === "star" ? "success" :
                            menu.status === "plow-horse" ? "info" :
                            menu.status === "puzzle" ? "warning" : "danger"
                          }>
                            {statusLabels[menu.status] || menu.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <span className="text-orange-600 dark:text-orange-400 text-xs font-semibold">Resep</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Recipe / BOM Detail Panel */}
            <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
              {selectedItem ? (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <Badge variant="brand" className="mb-2">{selectedItem.category}</Badge>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{selectedItem.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">ID Menu: {selectedItem.id}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-xs text-slate-400">Harga Jual</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">{formatRupiah(selectedItem.price)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Modal Bahan Baku (HPP)</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">{formatRupiah(selectedItem.cost)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Profit Margin</p>
                      <p className="text-sm font-bold text-emerald-600 mt-0.5">{formatPercent(selectedItem.margin)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Kategori Menu</p>
                      <Badge variant={selectedItem.status === "star" ? "success" : "info"} className="mt-1">
                        {statusLabels[selectedItem.status] || selectedItem.status}
                      </Badge>
                    </div>
                  </div>

                  {/* BOM Ingredients */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">Resep (Bill of Materials)</h4>
                    {bom[selectedItem.id] ? (
                      <div className="space-y-2.5">
                        {bom[selectedItem.id].map((ing, i) => (
                          <div key={i} className="flex justify-between text-xs py-1 border-b border-dashed border-slate-100 dark:border-slate-850">
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-200">{ing.ingredient}</p>
                              <p className="text-[10px] text-slate-450">{ing.qty} {ing.unit}</p>
                            </div>
                            <span className="font-mono text-slate-500">{formatRupiah(ing.cost)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between pt-3 text-xs font-bold border-t border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                          <span>Total Cost Bahan</span>
                          <span>{formatRupiah(selectedItem.cost)}</span>
                        </div>
                        <div className="flex justify-center pt-4">
                          <Button variant="outline" size="sm" className="w-full" onClick={() => handleOpenEdit(selectedItem)}>
                            Ubah Menu
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center py-2">
                        <Button variant="outline" size="sm" className="w-full" onClick={() => handleOpenEdit(selectedItem)}>
                          Ubah Menu
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400 dark:text-slate-500">
                  <span className="text-3xl block mb-2">📋</span>
                  <p className="text-sm font-semibold">Pilih Menu</p>
                  <p className="text-xs mt-1">Klik pada salah satu menu di daftar untuk melihat detail resep dan HPP.</p>
                </div>
              )}
            </div>

            {/* Peta Performa Menu Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Peta Performa Menu</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50/50 dark:bg-green-950/10 border-l-4 border-l-green-500 rounded-lg text-left">
                  <p className="text-xs font-bold text-green-700 dark:text-green-400">STAR (Volume Tinggi, Margin Tinggi)</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Menu utama. Pertahankan kualitas, pastikan promosi tetap berjalan.</p>
                </div>
                <div className="p-3 bg-blue-50/50 dark:bg-blue-950/10 border-l-4 border-l-blue-500 rounded-lg text-left">
                  <p className="text-xs font-bold text-blue-700 dark:text-blue-400">POPULER (Volume Tinggi, Margin Rendah)</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Populer tapi untung tipis. Coba naikkan harga sedikit demi sedikit atau turunkan porsi cost.</p>
                </div>
                <div className="p-3 bg-amber-50/50 dark:bg-amber-950/10 border-l-4 border-l-amber-500 rounded-lg text-left">
                  <p className="text-xs font-bold text-amber-700 dark:text-amber-400">PREMIUM (Volume Rendah, Margin Tinggi)</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Untung besar tapi kurang laku. Buat promosi bundling atau taruh di tempat yang menonjol di menu.</p>
                </div>
                <div className="p-3 bg-red-50/50 dark:bg-red-950/10 border-l-4 border-l-red-500 rounded-lg text-left">
                  <p className="text-xs font-bold text-red-700 dark:text-red-400">EVALUASI (Volume Rendah, Margin Rendah)</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Kurang laku dan margin tipis. Pertimbangkan untuk menghapus menu ini dari katalog.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Engineering Tab */}
      {!loading && activeTab === "engineering" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Scatter Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Diagram Menu</h3>
              <p className="text-xs text-slate-500 mt-0.5">Hubungan volume penjualan (X) vs Profit Margin (Y)</p>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <ScatterChart margin={{ top: 25, right: 90, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="x" name="Terjual" unit=" pcs" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="number" dataKey="y" name="Margin" unit="%" domain={[50, 80]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<EngineeringTooltip />} cursor={{ strokeDasharray: "3 3" }} />
                <ReferenceLine x={avgSold} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: "Volume Rata-rata", position: "top", fill: "#94a3b8", fontSize: 10 }} />
                <ReferenceLine y={avgMargin} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: "Margin Rata-rata", position: "right", fill: "#94a3b8", fontSize: 10 }} />
                <Scatter name="Menu Engineering" data={engineeringData}>
                  {engineeringData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[entry.status] || "#cbd5e1"} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Categorization Quadrants Info */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Peta Performa Menu</h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50/50 dark:bg-green-950/10 border-l-4 border-l-green-500 rounded-lg">
                <p className="text-xs font-bold text-green-700 dark:text-green-400">STAR (Volume Tinggi, Margin Tinggi)</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Menu utama. Pertahankan kualitas, pastikan promosi tetap berjalan.</p>
              </div>
              <div className="p-3 bg-blue-50/50 dark:bg-blue-950/10 border-l-4 border-l-blue-500 rounded-lg">
                <p className="text-xs font-bold text-blue-700 dark:text-blue-400">POPULER (Volume Tinggi, Margin Rendah)</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Populer tapi untung tipis. Coba naikkan harga sedikit demi sedikit atau turunkan porsi cost.</p>
              </div>
              <div className="p-3 bg-amber-50/50 dark:bg-amber-950/10 border-l-4 border-l-amber-500 rounded-lg">
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400">PREMIUM (Volume Rendah, Margin Tinggi)</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Untung besar tapi kurang laku. Buat promosi bundling atau taruh di tempat yang menonjol di menu.</p>
              </div>
              <div className="p-3 bg-red-50/50 dark:bg-red-950/10 border-l-4 border-l-red-500 rounded-lg">
                <p className="text-xs font-bold text-red-700 dark:text-red-400">EVALUASI (Volume Rendah, Margin Rendah)</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Kurang laku dan margin tipis. Pertimbangkan untuk menghapus menu ini dari katalog.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Menu Modal */}
      {showEdit && editItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowEdit(false)}>
          <form
            onSubmit={handleSaveEdit}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Ubah Menu</h3>
              <button type="button" onClick={() => setShowEdit(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <Input
                label="Nama Menu"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                required
              />
              <Input
                label="Kategori"
                value={editCategory}
                onChange={e => setEditCategory(e.target.value)}
                required
              />
              <Input
                label="Harga Jual"
                type="number"
                value={editPrice}
                onChange={e => setEditPrice(Number(e.target.value))}
                required
              />
              <Input
                label="Modal Bahan Baku (HPP)"
                type="number"
                value={editCost}
                onChange={e => setEditCost(Number(e.target.value))}
                required
              />
            </div>
            <div className="flex gap-3 mt-6">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowEdit(false)}>Batal</Button>
              <Button type="submit" variant="primary" className="flex-1">Simpan</Button>
            </div>
          </form>
        </div>
      )}

      {/* Add Menu Modal */}
      {showAddMenu && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowAddMenu(false)}>
          <form
            onSubmit={handleAddMenuSubmit}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Tambah Menu</h3>
              <button type="button" onClick={() => setShowAddMenu(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <Input
                label="Nama Menu"
                value={addName}
                onChange={e => setAddName(e.target.value)}
                placeholder="misal: Martabak Manis Keju"
                required
              />
              <Input
                label="Kategori"
                value={addCategory}
                onChange={e => setAddCategory(e.target.value)}
                placeholder="misal: Terang Bulan"
                required
              />
              <Input
                label="Harga Jual"
                type="number"
                value={addPrice}
                onChange={e => setAddPrice(Number(e.target.value))}
                placeholder="0"
                required
              />
              <Input
                label="Modal Bahan Baku (HPP)"
                type="number"
                value={addCost}
                onChange={e => setAddCost(Number(e.target.value))}
                placeholder="0"
                required
              />
            </div>
            <div className="flex gap-3 mt-6">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddMenu(false)}>Batal</Button>
              <Button type="submit" variant="primary" className="flex-1">Tambah</Button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Detail Modal */}
      {selectedItem && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedMenu(null)}>
          <div 
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md p-6 animate-slide-up relative"
            onClick={e => e.stopPropagation()}
          >
            <button 
              type="button" 
              onClick={() => setSelectedMenu(null)} 
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-5">
              <div>
                <Badge variant="brand" className="mb-2">{selectedItem.category}</Badge>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{selectedItem.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">ID Menu: {selectedItem.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-xs text-slate-400">Harga Jual</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">{formatRupiah(selectedItem.price)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Modal Bahan Baku (HPP)</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">{formatRupiah(selectedItem.cost)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Profit Margin</p>
                  <p className="text-sm font-bold text-emerald-600 mt-0.5">{formatPercent(selectedItem.margin)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Kategori Menu</p>
                  <Badge variant={selectedItem.status === "star" ? "success" : "info"} className="mt-1">
                    {statusLabels[selectedItem.status] || selectedItem.status}
                  </Badge>
                </div>
              </div>

              {/* BOM Ingredients */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">Resep (Bill of Materials)</h4>
                {bom[selectedItem.id] ? (
                  <div className="space-y-2.5">
                    {bom[selectedItem.id].map((ing, i) => (
                      <div key={i} className="flex justify-between text-xs py-1 border-b border-dashed border-slate-100 dark:border-slate-850">
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{ing.ingredient}</p>
                          <p className="text-[10px] text-slate-450">{ing.qty} {ing.unit}</p>
                        </div>
                        <span className="font-mono text-slate-500">{formatRupiah(ing.cost)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-3 text-xs font-bold border-t border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                      <span>Total Cost Bahan</span>
                      <span>{formatRupiah(selectedItem.cost)}</span>
                    </div>
                    <div className="flex justify-center pt-4">
                      <Button variant="outline" size="sm" className="w-full" onClick={() => handleOpenEdit(selectedItem)}>
                        Ubah Menu
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center py-2">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => handleOpenEdit(selectedItem)}>
                      Ubah Menu
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
