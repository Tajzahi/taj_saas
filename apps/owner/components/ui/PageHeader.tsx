import React from "react";

interface PageHeaderProps {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
