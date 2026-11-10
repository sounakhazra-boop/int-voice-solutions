// src/components/ui/StatBlock.tsx
import React from "react";

interface StatBlockProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export const StatBlock: React.FC<StatBlockProps> = ({ value, label, icon }) => {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {icon && <div className="shrink-0">{icon}</div>}
      <div className="flex min-w-0 flex-col">
        <span className="stat-value whitespace-nowrap">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
};
