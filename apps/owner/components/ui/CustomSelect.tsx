"use client";

import React, { useState, useRef, useEffect } from "react";

export interface CustomSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
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
  const dropdownMaxHeight = maxItems ? `${maxItems * 36 + 12}px` : undefined;

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
          className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-orange-500/30 dark:border-orange-500/40 rounded-xl shadow-xl z-[110] overflow-y-auto animate-slide-up p-1.5 min-w-[140px]"
          style={dropdownMaxHeight ? { maxHeight: dropdownMaxHeight } : { maxHeight: "240px" }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                opt.value === value
                  ? "bg-orange-500 text-white font-bold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-600 dark:hover:text-orange-400"
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
