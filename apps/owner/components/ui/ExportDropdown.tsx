import React, { useState, useRef, useEffect } from "react";
import { Button } from "./Button";
import { exportToExcel, exportToPDF } from "@/utils/export";

interface ExportDropdownProps {
  data: any[];
  columns: string[];
  filename: string;
  title?: string;
  pdfDataMapper: (item: any) => any[];
  label?: string;
}

export function ExportDropdown({ data, columns, filename, title, pdfDataMapper, label = "Export" }: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExportExcel = () => {
    exportToExcel(data, filename);
    setIsOpen(false);
  };

  const handleExportPDF = () => {
    const pdfData = data.map(pdfDataMapper);
    exportToPDF(columns, pdfData, filename, title);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(!isOpen)}
        icon={
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        }
      >
        {label}
      </Button>

      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 origin-top-left sm:origin-top-right mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-900 ring-1 ring-black ring-opacity-5 z-50 border border-slate-200 dark:border-slate-800 animate-slide-up">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              onClick={handleExportExcel}
              className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center gap-2"
              role="menuitem"
            >
              <span className="text-emerald-600">📊</span> Excel (.xlsx)
            </button>
            <button
              onClick={handleExportPDF}
              className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center gap-2"
              role="menuitem"
            >
              <span className="text-red-500">📄</span> PDF (.pdf)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
