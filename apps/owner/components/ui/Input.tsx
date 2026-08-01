import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  hint?: string;
  error?: string;
}

export function Input({ icon, label, hint, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${icon ? "pl-9" : ""} ${error ? "border-red-400 focus:ring-red-500" : ""} ${className}`}
          {...props}
        />
      </div>
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

import { CustomSelect } from "./CustomSelect";

interface SelectProps {
  label?: string;
  value: string;
  onChange: (e: any) => void;
  options: { value: string; label: string }[];
  className?: string;
}

export function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <CustomSelect
        value={value}
        onChange={(val) => onChange({ target: { value: val } })}
        options={options}
      />
    </div>
  );
}
