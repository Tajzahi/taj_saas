"use client";

import React from "react";
import { Plus, Trash2, Layers, CheckSquare, Square } from "lucide-react";

export interface VariantOption {
  id?: string;
  name: string;
  priceModifier: number;
}

export interface VariantGroup {
  label: string;
  required: boolean;
  options: VariantOption[];
}

interface VariantBuilderProps {
  variants: VariantGroup[];
  onChange: (variants: VariantGroup[]) => void;
}

export default function VariantBuilder({ variants, onChange }: VariantBuilderProps) {
  const handleAddGroup = () => {
    const newGroup: VariantGroup = {
      label: "",
      required: false,
      options: [
        { id: `opt-${Date.now()}-1`, name: "Opsi 1", priceModifier: 0 },
      ],
    };
    onChange([...variants, newGroup]);
  };

  const handleRemoveGroup = (groupIndex: number) => {
    onChange(variants.filter((_, idx) => idx !== groupIndex));
  };

  const handleGroupLabelChange = (groupIndex: number, label: string) => {
    const updated = variants.map((grp, idx) =>
      idx === groupIndex ? { ...grp, label } : grp
    );
    onChange(updated);
  };

  const handleGroupRequiredToggle = (groupIndex: number) => {
    const updated = variants.map((grp, idx) =>
      idx === groupIndex ? { ...grp, required: !grp.required } : grp
    );
    onChange(updated);
  };

  const handleAddOption = (groupIndex: number) => {
    const updated = variants.map((grp, idx) => {
      if (idx !== groupIndex) return grp;
      const newOption: VariantOption = {
        id: `opt-${Date.now()}-${grp.options.length + 1}`,
        name: "",
        priceModifier: 0,
      };
      return { ...grp, options: [...grp.options, newOption] };
    });
    onChange(updated);
  };

  const handleRemoveOption = (groupIndex: number, optionIndex: number) => {
    const updated = variants.map((grp, idx) => {
      if (idx !== groupIndex) return grp;
      return {
        ...grp,
        options: grp.options.filter((_, oIdx) => oIdx !== optionIndex),
      };
    });
    onChange(updated);
  };

  const handleOptionChange = (
    groupIndex: number,
    optionIndex: number,
    field: "name" | "priceModifier",
    val: any
  ) => {
    const updated = variants.map((grp, idx) => {
      if (idx !== groupIndex) return grp;
      const newOptions = grp.options.map((opt, oIdx) => {
        if (oIdx !== optionIndex) return opt;
        return {
          ...opt,
          [field]: field === "priceModifier" ? Math.max(0, Number(val) || 0) : val,
        };
      });
      return { ...grp, options: newOptions };
    });
    onChange(updated);
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-orange-500" />
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Pilihan Varian & Topping Tambahan (Opsional)
          </label>
        </div>
        <button
          type="button"
          onClick={handleAddGroup}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/50 px-2.5 py-1 rounded-lg hover:bg-orange-100 transition-colors"
        >
          <Plus className="w-3 h-3" /> Tambah Grup Topping
        </button>
      </div>

      {variants.length === 0 ? (
        <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center bg-slate-50/50 dark:bg-slate-900/50">
          <p className="text-xs text-slate-400">
            Belum ada topping / varian untuk menu ini. Klik tombol <strong className="text-slate-600 dark:text-slate-300">+ Tambah Grup Topping</strong> di atas jika ingin menambahkan topping ekstra atau pilihan varian porsi/telur.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {variants.map((grp, gIdx) => (
            <div
              key={gIdx}
              className="border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-850/60 rounded-xl p-3 space-y-2.5"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={grp.label}
                  onChange={(e) => handleGroupLabelChange(gIdx, e.target.value)}
                  placeholder="Nama Grup (misal: Extra Topping, Pilihan Telur)..."
                  className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold focus:outline-none focus:border-orange-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleGroupRequiredToggle(gIdx)}
                  className={`inline-flex items-center gap-1 text-[11px] px-2 py-1.5 rounded-lg border transition-all ${
                    grp.required
                      ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:border-red-900 font-bold"
                      : "bg-white text-slate-500 border-slate-200 dark:bg-slate-900 dark:border-slate-700"
                  }`}
                  title="Wajib dipilih oleh pelanggan"
                >
                  {grp.required ? <CheckSquare className="w-3.5 h-3.5 text-red-500" /> : <Square className="w-3.5 h-3.5 text-slate-400" />}
                  <span className="text-[10px]">{grp.required ? "Wajib Pilih" : "Opsional"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveGroup(gIdx)}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                  title="Hapus Grup Topping Ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Options List */}
              <div className="space-y-1.5 pl-2 border-l-2 border-orange-300 dark:border-orange-800">
                {grp.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={opt.name}
                      onChange={(e) =>
                        handleOptionChange(gIdx, oIdx, "name", e.target.value)
                      }
                      placeholder="Nama Topping (misal: Extra Keju Mozzarella)..."
                      className="flex-1 text-xs px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                      required
                    />
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-0.5 w-32">
                      <span className="text-[10px] text-slate-400 font-mono">+Rp</span>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={opt.priceModifier}
                        onChange={(e) =>
                          handleOptionChange(gIdx, oIdx, "priceModifier", e.target.value)
                        }
                        placeholder="0"
                        className="w-full text-xs font-semibold text-right bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none"
                      />
                    </div>
                    {grp.options.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(gIdx, oIdx)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => handleAddOption(gIdx)}
                  className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold hover:underline mt-1 inline-flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Tambah Pilihan / Opsi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
