"use client";

import React, { useState, useRef, useEffect } from "react";

export interface CustomSelectOption {
  value: string;
  label: string;
  isDeletable?: boolean;
  onDelete?: (value: string) => void;
}

export interface CustomSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
  maxItems?: number;
  compact?: boolean;
  disabled?: boolean;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "-- Pilih --",
  maxItems,
  compact,
  disabled,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value);
  const effectiveMaxItems = maxItems || 2;
  const itemHeight = 32; // h-8 = 32px
  const containerPadding = 8; // p-1 = 4px top + 4px bottom
  const dropdownMaxHeight = `${effectiveMaxItems * itemHeight + containerPadding}px`;

  return (
    <div className={`relative ${compact ? "w-auto min-w-[130px]" : "w-full"}`} ref={containerRef}>
      <div
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
        className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl flex items-center justify-between transition-all ${
          disabled
            ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed opacity-60"
            : "cursor-pointer hover:border-orange-500/70 dark:hover:border-orange-500/50"
        } ${
          compact ? "px-3 py-1.5 text-xs font-semibold" : "px-3.5 py-2.5 text-sm font-medium"
        } ${
          isOpen ? "border-orange-500 ring-2 ring-orange-500/20 dark:border-orange-500" : "border-slate-200 dark:border-slate-700"
        }`}
      >
        <span className="text-slate-800 dark:text-slate-200 truncate pr-2">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {isOpen && !disabled && (
        <div
          className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-orange-500/30 dark:border-orange-500/40 rounded-xl shadow-xl z-[110] overflow-y-auto animate-slide-up p-1 min-w-[140px]"
          style={{ maxHeight: dropdownMaxHeight }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                if (opt.value !== "__add_new_role__") {
                  onChange(opt.value);
                  setIsOpen(false);
                } else {
                  onChange(opt.value);
                }
              }}
              className={`group px-3 h-8 flex items-center justify-between rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                opt.value === value
                  ? "bg-orange-500 text-white font-bold"
                  : opt.value === "__add_new_role__"
                  ? "text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 font-bold border-t border-slate-100 dark:border-slate-800 mt-0.5"
                  : "text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-600 dark:hover:text-orange-400"
              }`}
            >
              <span className="truncate pr-1">{opt.label}</span>
              {opt.isDeletable && opt.onDelete && (
                <button
                  type="button"
                  title={`Hapus Role ${opt.label}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    opt.onDelete?.(opt.value);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-all ml-1 shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
