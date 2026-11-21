// src/components/ui/StatBlock.tsx
import React from "react";

interface StatBlockProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export const StatBlock: React.FC<StatBlockProps> = ({ value, label, icon }) => {
  return (
    <div className="flex min-w-0 items-center gap-3.5 sm:gap-4">
      {icon && <div className="shrink-0">{icon}</div>}
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="stat-value whitespace-nowrap text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
          {value}
        </span>
        <span className="stat-label text-xs sm:text-sm font-medium text-slate-300 leading-snug">
          {label}
        </span>
      </div>
    </div>
  );
};
