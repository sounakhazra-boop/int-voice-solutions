// src/components/ui/UseCaseItem.tsx
import React from "react";

interface UseCaseItemProps {
  label: string;
  icon: React.ReactNode;
}

export const UseCaseItem: React.FC<UseCaseItemProps> = ({ label, icon }) => {
  return (
    <div className="group flex min-w-[122px] flex-1 flex-col items-center justify-start gap-2 border-l border-gray-200 px-3 py-1 text-center first:border-l-0">
      <div className="h-10 w-10 text-indigo-700 transition-transform group-hover:-translate-y-0.5">
        {icon}
      </div>
      <span className="text-xs font-semibold leading-tight text-gray-900">
        {label}
      </span>
    </div>
  );
};
