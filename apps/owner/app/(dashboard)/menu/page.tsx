/**
 * =========================================================================================
 * 🏗️ BLUEPRINT KONSTRUKSI FITUR: HALAMAN MENU & RESEP (PAGE CLIENT UI)
 * =========================================================================================
 * 
 * 📌 FUNGSI UTAMA FILE:
 * Antarmuka Client UI untuk manajemen Katalog Menu, Matriks Menu Engineering, serta
 * Pengaturan Resep (Bill of Materials / BOM) real-time yang terhubung ke Stok Persediaan.
 * 
 * 🔄 ALUR KERJA (WORKFLOW KONSTRUKSI):
 * 1. TAMBAH/EDIT MENU: Mengelola nama, kategori, dan harga jual produk.
 * 2. MODAL RESEP (BOM): Pengaturan bahan baku per porsi (nama bahan, qty, satuan, cost per unit).
 * 3. HPP & MARGIN: Otomatis menghitung Total HPP & Margin Profit % secara real-time saat resep disimpan.
 * 4. NAVIGASI MODAL: Tombol 'Batal' & 'Simpan Resep' kembali ke modal/panel sebelumnya dengan mulus.
 * 
 * 🔗 KETERIKATAN ALUR FILE LAIN:
 * - Server Actions : `apps/owner/app/actions/menu.ts`
 * - Database Schema: `packages/db/schema.ts` (`menuItems`, `recipes`, `recipeIngredients`, `inventory`)
 * =========================================================================================
 */

"use client";

import React, { useState, useEffect } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatRupiah, formatPercent } from "@/utils/format";
import { ExportDropdown } from "@/components/ui/ExportDropdown";
import { 
  getMenuItemsAction, 
  getCategoriesAction, 
  createCategoryAction,
  deleteCategoryAction,
  createMenuItemAction, 
  updateMenuItemAction,
  getRecipeAction,
  saveRecipeAction,
  getInventoryIngredientsAction
} from "@/app/actions/menu";
import { getMenuEngineeringAction } from "@/app/actions/analytics";
import VariantBuilder from "./VariantBuilder";

const statusColors: Record<string, string> = {
  star: "#22c55e",
  "plow-horse": "#3b82f6",
  puzzle: "#f59e0b",
  dog: "#ef4444",
  new: "#a855f7",
};

const statusLabels: Record<string, string> = {
  star: "STAR",
  "plow-horse": "POPULER",
  puzzle: "PREMIUM",
  dog: "EVALUASI",
  new: "BARU",
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

function parseCostNumber(val: any): number {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const str = String(val).trim();
  const cleaned = str.replace(/\./g, "").replace(/,/g, ".");
  return Number(cleaned) || 0;
}

function UnitInputCustom({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const presets = [
    { value: "gr", label: "Gram" },
    { value: "kg", label: "Kilogram" },
    { value: "ml", label: "Mililiter" },
    { value: "l", label: "Liter" },
    { value: "pcs", label: "Pieces" },
    { value: "butir", label: "Butir" },
    { value: "sdm", label: "Sendok Makan" },
    { value: "sdt", label: "Sendok Teh" },
    { value: "slice", label: "Irisan" },
    { value: "pack", label: "Kemasan" },
    { value: "botol", label: "Botol" },
    { value: "kaleng", label: "Kaleng" },
    { value: "ikat", label: "Ikat" },
    { value: "porsi", label: "Porsi" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filtered = presets.filter(
    p => p.value.toLowerCase().includes((value || "").toLowerCase()) || p.label.toLowerCase().includes((value || "").toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="gr/ml"
          className="w-full text-xs px-2 py-1.5 pr-5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
          required
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setOpen(!open)}
          className="absolute right-1 text-[9px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
        >
          ▼
        </button>
      </div>

      {open && (
        <div
          onWheel={(e) => e.stopPropagation()}
          className="absolute left-full top-0 ml-1.5 z-50 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-[128px] overflow-y-auto overscroll-contain divide-y divide-slate-100 dark:divide-slate-800 animate-fade-in"
        >
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <button
                key={item.value}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(item.value);
                  setOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                <span className="font-bold text-slate-800 dark:text-slate-100">{item.value}</span>
                <span className="text-[10px] text-slate-400 font-normal">{item.label}</span>
              </button>
            ))
          ) : (
            <div className="px-2.5 py-1.5 text-[11px] text-slate-400">
              Gunakan kustom: <span className="font-semibold text-slate-700 dark:text-slate-200">"{value}"</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
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
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editVariants, setEditVariants] = useState<any[]>([]);

  // Add Menu states
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [addName, setAddName] = useState("");
  const [addCategory, setAddCategory] = useState("");
  const [addPrice, setAddPrice] = useState(0);
  const [addCost, setAddCost] = useState(0);
  const [addImageUrl, setAddImageUrl] = useState("");
  const [addVariants, setAddVariants] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  // Category Modal States
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);

  // Recipe Modal States
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [recipeMenuItem, setRecipeMenuItem] = useState<any>(null);
  const [recipeDraft, setRecipeDraft] = useState<any[]>([]);
  const [inventoryOptions, setInventoryOptions] = useState<any[]>([]);
  const [savingRecipe, setSavingRecipe] = useState(false);
  const [dbRecipeMap, setDbRecipeMap] = useState<Record<string, any[]>>({});

  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setSavingCategory(true);
    const res = await createCategoryAction(newCategoryName);
    setSavingCategory(false);

    if (res.success && res.data) {
      const updated = [...dbCategories, res.data];
      setDbCategories(updated);
      setCategories(["all", ...Array.from(new Set([...updated.map((c: any) => c.name), ...menuItems.map((m: any) => m.category)]))]);
      setNewCategoryName("");
    } else {
      alert("Gagal menambahkan kategori: " + (res.error || "Terjadi kesalahan"));
    }
  };

  const handleDeleteCategory = async (catId: string, catName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kategori "${catName}"?`)) return;
    const res = await deleteCategoryAction(catId);
    if (res.success) {
      const updated = dbCategories.filter(c => c.id !== catId);
      setDbCategories(updated);
      setCategories(["all", ...Array.from(new Set([...updated.map((c: any) => c.name), ...menuItems.map((m: any) => m.category)]))]);
    } else {
      alert("Gagal menghapus kategori: " + (res.error || "Terjadi kesalahan"));
    }
  };

  const handleOpenRecipeModal = async (item: any) => {
    setRecipeMenuItem(item);
    setShowRecipeModal(true);
    setSavingRecipe(true);

    const [recipeRes, invRes] = await Promise.all([
      getRecipeAction(item.id),
      getInventoryIngredientsAction(),
    ]);

    if (invRes.success && invRes.data) {
      setInventoryOptions(invRes.data);
    }

    if (recipeRes.success && recipeRes.data && recipeRes.data.length > 0) {
      setRecipeDraft(recipeRes.data);
    } else {
      setRecipeDraft([
        { ingredientName: "", quantity: 1, unit: "gr", costPerUnit: 0 }
      ]);
    }
    setSavingRecipe(false);
  };

  const handleAddIngredientRow = () => {
    setRecipeDraft(prev => [
      ...prev,
      { ingredientName: "", quantity: 1, unit: "gr", costPerUnit: 0 }
    ]);
  };

  const handleRemoveIngredientRow = (index: number) => {
    setRecipeDraft(prev => prev.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, field: string, value: any) => {
    setRecipeDraft(prev => {
      const next = [...prev];
      const row = { ...next[index], [field]: value };
      
      if (field === "ingredientName") {
        const foundInv = inventoryOptions.find(inv => inv.name.toLowerCase() === String(value).toLowerCase());
        if (foundInv) {
          row.unit = foundInv.unit || row.unit || "gr";
          row.costPerUnit = Number(foundInv.cost) || row.costPerUnit || 0;
        }
      }

      next[index] = row;
      return next;
    });
  };

  const handleSaveRecipeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeMenuItem) return;
    setSavingRecipe(true);

    const filteredDraft = recipeDraft.filter(r => r.ingredientName.trim() !== "");
    const res = await saveRecipeAction(recipeMenuItem.id, filteredDraft);
    setSavingRecipe(false);

    if (res.success && res.totalHppCost !== undefined) {
      const newCost = res.totalHppCost;
      const price = recipeMenuItem.price;
      const margin = price > 0 ? ((price - newCost) / price) * 100 : 0;

      setMenuItems(prev => prev.map(m => m.id === recipeMenuItem.id ? {
        ...m,
        cost: newCost,
        margin: Number(margin.toFixed(1)),
        status: margin >= 60 ? "star" : "plow-horse",
      } : m));

      setDbRecipeMap(prev => ({
        ...prev,
        [recipeMenuItem.id]: filteredDraft,
      }));

      setShowRecipeModal(false);
    } else {
      alert("Gagal menyimpan resep: " + (res.error || "Terjadi kesalahan"));
    }
  };

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
        const totalSoldSum = Array.from(engMap.values()).reduce((sum, e) => sum + (e.totalQty || 0), 0);
        const avgSold = engMap.size > 0 ? totalSoldSum / engMap.size : 0;

        const mapped = menuRes.data.map((dbMenu: any) => {
          const catObj = cats.find(c => c.id === dbMenu.categoryId);
          const categoryName = catObj ? catObj.name : "Lainnya";
          const price = Number(dbMenu.price) || 0;
          const cost = Number(dbMenu.cost) || Math.round(price * 0.35);
          const margin = price > 0 ? ((price - cost) / price) * 100 : 0;
          const eng = engMap.get(dbMenu.name);
          const soldQty = eng ? eng.totalQty : 0;

          const isHighMargin = margin >= 60;
          const isHighVolume = soldQty >= avgSold && soldQty > 0;

          let status = "new";
          if (soldQty === 0) {
            status = isHighMargin ? "puzzle" : "new";
          } else if (isHighMargin && isHighVolume) {
            status = "star";
          } else if (!isHighMargin && isHighVolume) {
            status = "plow-horse";
          } else if (isHighMargin && !isHighVolume) {
            status = "puzzle";
          } else {
            status = "dog";
          }

          return {
            id: dbMenu.id,
            name: dbMenu.name,
            category: categoryName,
            price,
            cost,
            imageUrl: dbMenu.imageUrl || "",
            margin: Number(margin.toFixed(1)),
            soldToday: soldQty,
            revenue: eng ? eng.totalRevenue : 0,
            status,
            variants: dbMenu.variants || [],
          };
        });
        setMenuItems(mapped);

        const uniqCategories = ["all", ...Array.from(new Set([...cats.map((c: any) => c.name), ...mapped.map((m: any) => m.category)]))];
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
    setEditImageUrl(item.imageUrl || "");
    setEditVariants(item.variants ? JSON.parse(JSON.stringify(item.variants)) : []);
    setShowEdit(true);
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
      imageUrl: editImageUrl,
      variants: editVariants,
    });
    setLoading(false);
    if (res.success) {
      setMenuItems(prev => prev.map(m => m.id === editItem.id ? {
        ...m,
        name: editName,
        category: editCategory,
        price: editPrice,
        cost: editCost,
        imageUrl: editImageUrl,
        margin: editPrice > 0 ? ((editPrice - editCost) / editPrice) * 100 : 0,
        variants: editVariants,
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
      imageUrl: addImageUrl,
      variants: addVariants,
    });
    setLoading(false);
    if (res.success && res.data) {
      const newMenu = {
        id: res.data.id,
        name: addName,
        category: addCategory,
        price: addPrice,
        cost: addCost,
        imageUrl: addImageUrl,
        margin: addPrice > 0 ? ((addPrice - addCost) / addPrice) * 100 : 0,
        soldToday: 0,
        revenue: 0,
        status: "star",
        variants: addVariants,
      };
      setMenuItems(prev => [newMenu, ...prev]);
      setShowAddMenu(false);
      setAddName("");
      setAddCategory("");
      setAddPrice(0);
      setAddCost(0);
      setAddImageUrl("");
      setAddVariants([]);
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
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      categoryFilter === cat
                        ? "bg-orange-500 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {cat === "all" ? "Semua" : cat}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 hover:bg-orange-100 transition-all whitespace-nowrap flex items-center gap-1"
                  title="Kelola Kategori Menu"
                >
                  + Kategori
                </button>
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
                            menu.status === "puzzle" ? "warning" :
                            menu.status === "new" ? "brand" : "danger"
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
                      <p className="text-xs text-slate-400">Status Performa</p>
                      <Badge variant={
                        selectedItem.status === "star" ? "success" :
                        selectedItem.status === "plow-horse" ? "info" :
                        selectedItem.status === "puzzle" ? "warning" :
                        selectedItem.status === "new" ? "brand" : "danger"
                      } className="mt-1">
                        {statusLabels[selectedItem.status] || selectedItem.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Toppings & Variants Display */}
                  {selectedItem.variants && selectedItem.variants.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Pilihan Varian & Topping</h4>
                      <div className="space-y-2">
                        {selectedItem.variants.map((grp: any, gIdx: number) => (
                          <div key={gIdx} className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1">
                              <span>{grp.label}</span>
                              <span className="text-[9px] text-slate-400 font-normal">{grp.required ? "Wajib" : "Opsional"}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {grp.options?.map((opt: any, oIdx: number) => (
                                <span key={oIdx} className="inline-flex items-center gap-1 text-[10px] bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                                  <span>{opt.name}</span>
                                  {opt.priceModifier > 0 && <strong className="text-orange-600 dark:text-orange-400">+{formatRupiah(opt.priceModifier)}</strong>}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* BOM Ingredients */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Resep (Bill of Materials)</h4>
                      <span className="text-[10px] text-slate-400">Terkoneksi Stok Bahan</span>
                    </div>
                    <div className="flex justify-between items-center py-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>Estimasi Biaya Bahan (HPP)</span>
                      <span className="font-bold text-slate-900 dark:text-white">{formatRupiah(selectedItem.cost || 0)}</span>
                    </div>
                    <div className="flex gap-2 pt-3">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenEdit(selectedItem)}>
                        Ubah Menu
                      </Button>
                      <Button variant="primary" size="sm" className="flex-1" onClick={() => handleOpenRecipeModal(selectedItem)}>
                        + Atur Resep (BOM)
                      </Button>
                    </div>
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
                  <p className="text-xs font-bold text-green-700 dark:text-green-400">🟢 STAR (Volume Tinggi, Margin Tinggi)</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Menu utama / unggulan. Pertahankan kualitas, pastikan stok bahan selalu siap.</p>
                </div>
                <div className="p-3 bg-blue-50/50 dark:bg-blue-950/10 border-l-4 border-l-blue-500 rounded-lg text-left">
                  <p className="text-xs font-bold text-blue-700 dark:text-blue-400">🔵 POPULER (Volume Tinggi, Margin Rendah)</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Sangat disukai tapi untung tipis. Coba tingkatkan harga sedikit atau kurangi porsi cost.</p>
                </div>
                <div className="p-3 bg-amber-50/50 dark:bg-amber-950/10 border-l-4 border-l-amber-500 rounded-lg text-left">
                  <p className="text-xs font-bold text-amber-700 dark:text-amber-400">🟡 PREMIUM (Volume Rendah / 0 Terjual, Margin Tinggi)</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Margin besar tapi penjualan kurang/belum banyak. Dorong lewat promosi paket hemat.</p>
                </div>
                <div className="p-3 bg-purple-50/50 dark:bg-purple-950/10 border-l-4 border-l-purple-500 rounded-lg text-left">
                  <p className="text-xs font-bold text-purple-700 dark:text-purple-400">🟣 BARU (0 Terjual, Margin Rendah)</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Menu baru didaftarkan & belum ada transaksi. Atur resep presisi & kenalkan ke pelanggan.</p>
                </div>
                <div className="p-3 bg-red-50/50 dark:bg-red-950/10 border-l-4 border-l-red-500 rounded-lg text-left">
                  <p className="text-xs font-bold text-red-700 dark:text-red-400">🔴 EVALUASI (Volume Rendah, Margin Rendah)</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Kurang laku dan margin tipis. Pertimbangkan untuk merevisi harga atau menghapus menu.</p>
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
                <p className="text-xs font-bold text-green-700 dark:text-green-400">🟢 STAR (Volume Tinggi, Margin Tinggi)</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Menu utama / unggulan. Pertahankan kualitas, pastikan stok bahan selalu siap.</p>
              </div>
              <div className="p-3 bg-blue-50/50 dark:bg-blue-950/10 border-l-4 border-l-blue-500 rounded-lg">
                <p className="text-xs font-bold text-blue-700 dark:text-blue-400">🔵 POPULER (Volume Tinggi, Margin Rendah)</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Sangat disukai tapi untung tipis. Coba tingkatkan harga sedikit atau kurangi porsi cost.</p>
              </div>
              <div className="p-3 bg-amber-50/50 dark:bg-amber-950/10 border-l-4 border-l-amber-500 rounded-lg">
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400">🟡 PREMIUM (Volume Rendah / 0 Terjual, Margin Tinggi)</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Margin besar tapi penjualan kurang/belum banyak. Dorong lewat promosi paket hemat.</p>
              </div>
              <div className="p-3 bg-purple-50/50 dark:bg-purple-950/10 border-l-4 border-l-purple-500 rounded-lg">
                <p className="text-xs font-bold text-purple-700 dark:text-purple-400">🟣 BARU (0 Terjual, Margin Rendah)</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Menu baru didaftarkan & belum ada transaksi. Atur resep presisi & kenalkan ke pelanggan.</p>
              </div>
              <div className="p-3 bg-red-50/50 dark:bg-red-950/10 border-l-4 border-l-red-500 rounded-lg">
                <p className="text-xs font-bold text-red-700 dark:text-red-400">🔴 EVALUASI (Volume Rendah, Margin Rendah)</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Kurang laku dan margin tipis. Pertimbangkan untuk merevisi harga atau menghapus menu.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Menu Modal */}
      {showEdit && editItem && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowEdit(false)}>
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
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">Kategori Menu</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    list="cat-options"
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value)}
                    placeholder="Ketik / pilih kategori..."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(true)}
                    className="px-2.5 py-1 text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/40 rounded-xl whitespace-nowrap hover:bg-orange-100 transition-colors"
                    title="Tambah Kategori Baru"
                  >
                    + Baru
                  </button>
                </div>
              </div>
              <Input
                label="Harga Jual"
                type="number"
                value={editPrice}
                onChange={e => setEditPrice(Number(e.target.value))}
                required
              />
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Modal Bahan Baku (HPP)</label>
                  {Boolean(dbRecipeMap[editItem.id]?.length) ? (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      ✨ Dihitung dari Resep
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">Estimasi Manual</span>
                  )}
                </div>
                <Input
                  type="number"
                  value={editCost}
                  onChange={e => setEditCost(Number(e.target.value))}
                  disabled={Boolean(dbRecipeMap[editItem.id]?.length)}
                  required
                />
                {Boolean(dbRecipeMap[editItem.id]?.length) ? (
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>HPP terkunci mengikuti rincian resep.</span>
                    <button
                      type="button"
                      onClick={() => { setShowEdit(false); handleOpenRecipeModal(editItem); }}
                      className="text-orange-600 dark:text-orange-400 font-bold hover:underline ml-1"
                    >
                      Ubah Resep ➔
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Estimasi manual. Disarankan atur resep.</span>
                    <button
                      type="button"
                      onClick={() => { setShowEdit(false); handleOpenRecipeModal(editItem); }}
                      className="text-orange-600 dark:text-orange-400 font-bold hover:underline ml-1"
                    >
                      + Atur Resep
                    </button>
                  </div>
                )}
              </div>

              {/* Foto Produk Menu */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  Foto Produk Menu (URL atau Unggah)
                </label>
                <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                    {editImageUrl ? (
                      <img src={editImageUrl} alt="Preview Menu" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">📸</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={editImageUrl}
                      onChange={e => setEditImageUrl(e.target.value)}
                      placeholder="https://... / link foto makanan"
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline">
                      📁 Pilih Gambar (PNG, JPG, WebP)
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp, image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              alert("Ukuran file maksimal 5 MB.");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') setEditImageUrl(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <p className="text-[10px] text-slate-400">Format didukung: <strong>PNG</strong>, <strong>JPG</strong>, <strong>WebP</strong> (Maks. 5 MB)</p>
                  </div>
                </div>
              </div>

              {/* Topping & Variant Builder */}
              <VariantBuilder variants={editVariants} onChange={setEditVariants} />
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
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowAddMenu(false)}>
          <form
            onSubmit={handleAddMenuSubmit}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-slide-up"
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
                placeholder="misal: Nasi Goreng Spesial / Menu Signature"
                required
              />
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">Kategori Menu</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    list="cat-options"
                    value={addCategory}
                    onChange={e => setAddCategory(e.target.value)}
                    placeholder="Ketik / pilih kategori..."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(true)}
                    className="px-2.5 py-1 text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/40 rounded-xl whitespace-nowrap hover:bg-orange-100 transition-colors"
                    title="Tambah Kategori Baru"
                  >
                    + Baru
                  </button>
                </div>
                <datalist id="cat-options">
                  {categories.filter(c => c !== "all").map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </datalist>
              </div>
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

              {/* Foto Produk Menu */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  Foto Produk Menu (URL atau Unggah)
                </label>
                <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                    {addImageUrl ? (
                      <img src={addImageUrl} alt="Preview Menu" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">📸</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={addImageUrl}
                      onChange={e => setAddImageUrl(e.target.value)}
                      placeholder="https://... / link foto makanan"
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline">
                      📁 Pilih Gambar (PNG, JPG, WebP)
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp, image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              alert("Ukuran file maksimal 5 MB.");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') setAddImageUrl(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <p className="text-[10px] text-slate-400">Format didukung: <strong>PNG</strong>, <strong>JPG</strong>, <strong>WebP</strong> (Maks. 5 MB)</p>
                  </div>
                </div>
              </div>

              {/* Topping & Variant Builder */}
              <VariantBuilder variants={addVariants} onChange={setAddVariants} />
            </div>
            <div className="flex gap-3 mt-6">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddMenu(false)}>Batal</Button>
              <Button type="submit" variant="primary" className="flex-1">Tambah</Button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Detail Modal */}
      {selectedItem && !showEdit && !showRecipeModal && !showAddMenu && (
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
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Resep (Bill of Materials)</h4>
                  <span className="text-[10px] text-slate-400">Terkoneksi Stok Bahan</span>
                </div>
                <div className="flex justify-between items-center py-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Estimasi Biaya Bahan (HPP)</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatRupiah(selectedItem.cost || 0)}</span>
                </div>
                <div className="flex gap-2 pt-3">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenEdit(selectedItem)}>
                    Ubah Menu
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1" onClick={() => handleOpenRecipeModal(selectedItem)}>
                    + Atur Resep (BOM)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Kelola Kategori Menu */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowCategoryModal(false)}>
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Kelola Kategori Menu</h3>
              <button type="button" onClick={() => setShowCategoryModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddCategorySubmit} className="flex gap-2 mb-5">
              <input
                type="text"
                placeholder="Nama Kategori Baru (misal: Minuman Dingin)..."
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                required
              />
              <Button type="submit" variant="primary" size="sm" disabled={savingCategory} className="whitespace-nowrap">
                {savingCategory ? "Memuat..." : "+ Tambah"}
              </Button>
            </form>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Daftar Kategori Terdaftar ({dbCategories.length})</label>
              {dbCategories.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">Belum ada kategori kustom. Tambahkan di atas.</p>
              ) : (
                dbCategories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{cat.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                      title="Hapus Kategori"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Pengaturan Resep (BOM) */}
      {showRecipeModal && recipeMenuItem && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>🥗</span> Pengaturan Resep (BOM)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Menu: <span className="font-semibold text-slate-700 dark:text-slate-200">{recipeMenuItem.name}</span> · Harga Jual: <span className="font-semibold text-orange-600">{formatRupiah(recipeMenuItem.price)}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRecipeModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveRecipeSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-4">
                {savingRecipe ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    Memuat data resep & persediaan...
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Daftar Bahan Baku (BOM per Porsi)</label>
                      <Button type="button" variant="ghost" size="sm" onClick={handleAddIngredientRow}>
                        + Tambah Baris Bahan
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {recipeDraft.map((row, idx) => {
                        const subtotalCost = (Number(row.quantity) || 0) * parseCostNumber(row.costPerUnit);

                        return (
                          <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                            {/* Ingredient Name (Select or Input) */}
                            <div className="flex-1 min-w-[140px]">
                              <label className="text-[10px] text-slate-400 block mb-1">Nama Bahan Baku</label>
                              <input
                                type="text"
                                list={`inv-list-${idx}`}
                                value={row.ingredientName}
                                onChange={(e) => handleIngredientChange(idx, "ingredientName", e.target.value)}
                                placeholder="Ketik / pilih bahan..."
                                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                                required
                              />
                              <datalist id={`inv-list-${idx}`}>
                                {inventoryOptions.map(inv => (
                                  <option key={inv.id} value={inv.name}>{inv.name} ({inv.unit} - {formatRupiah(inv.cost)})</option>
                                ))}
                              </datalist>
                            </div>

                            {/* Qty */}
                            <div className="w-20">
                              <label className="text-[10px] text-slate-400 block mb-1">Qty</label>
                              <input
                                type="number"
                                step="any"
                                min="0"
                                value={row.quantity}
                                onChange={(e) => handleIngredientChange(idx, "quantity", e.target.value)}
                                className="w-full text-xs px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                                required
                              />
                            </div>

                            {/* Unit */}
                            <div className="w-24">
                              <label className="text-[10px] text-slate-400 block mb-1">Satuan</label>
                              <UnitInputCustom
                                value={row.unit}
                                onChange={(val) => handleIngredientChange(idx, "unit", val)}
                              />
                            </div>

                            {/* Cost Per Unit */}
                            <div className="w-28">
                              <label className="text-[10px] text-slate-400 block mb-1">Biaya/Unit</label>
                              <input
                                type="text"
                                value={row.costPerUnit}
                                onChange={(e) => handleIngredientChange(idx, "costPerUnit", e.target.value)}
                                placeholder="10.000"
                                className="w-full text-xs px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                              />
                            </div>

                            {/* Subtotal */}
                            <div className="w-28 text-right pr-2">
                              <label className="text-[10px] text-slate-400 block mb-1">Subtotal</label>
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block py-1.5 whitespace-nowrap">{formatRupiah(subtotalCost)}</span>
                            </div>

                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveIngredientRow(idx)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors flex-shrink-0 mt-3 sm:mt-0 ml-1"
                              title="Hapus bahan"
                            >
                              🗑️
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Summary KPI Box */}
                    {(() => {
                      const totalCost = recipeDraft.reduce((sum, r) => sum + ((Number(r.quantity) || 0) * parseCostNumber(r.costPerUnit)), 0);
                      const price = recipeMenuItem.price || 0;
                      const marginPct = price > 0 ? ((price - totalCost) / price) * 100 : 0;

                      return (
                        <div className="p-4 rounded-xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 grid grid-cols-3 gap-3">
                          <div>
                            <p className="text-[10px] text-slate-500">Harga Jual</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">{formatRupiah(price)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500">Total HPP per Porsi</p>
                            <p className="text-sm font-bold text-orange-600 dark:text-orange-400 mt-0.5">{formatRupiah(totalCost)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500">Margin Keuntungan</p>
                            <p className={`text-sm font-bold mt-0.5 ${marginPct >= 60 ? "text-emerald-600" : marginPct >= 40 ? "text-amber-600" : "text-red-500"}`}>
                              {formatPercent(marginPct)}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>

              {/* Modal Footer (2 Utama: Batal & Simpan Resep) */}
              <div className="flex gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowRecipeModal(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={savingRecipe}
                >
                  {savingRecipe ? "Menyimpan..." : "Simpan Resep"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
