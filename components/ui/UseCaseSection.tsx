import React from "react";
import content from "../../data/landing.json";
import { UseCaseItem } from "../UseCaseItem";
import { IconMap } from "./IconMap";

export const UseCasesSection: React.FC = () => {
  const industries = content.useCases.industries;

  return (
    <section className="border-t border-gray-100 bg-white px-4 py-5 sm:px-6 sm:py-7 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 rounded-2xl border border-indigo-50 bg-gradient-to-r from-indigo-50/80 via-white to-white p-2.5 shadow-sm sm:gap-4 sm:p-3 lg:flex-row lg:items-stretch lg:gap-5">
        <div className="flex w-full shrink-0 items-center justify-between rounded-xl bg-indigo-100/70 px-4 py-3 transition-colors hover:bg-indigo-100 sm:px-5 sm:py-4 lg:w-64">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-500">
              Voice AI in action
            </p>
            <h2 className="text-lg font-bold leading-tight text-[#1E1B4B]">
              {content.useCases.sectionTitle}
            </h2>
          </div>
          <svg
            className="h-5 w-5 shrink-0 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>

        <div
          className="use-cases-marquee"
          aria-label="Use cases across industries"
        >
          <div className="use-cases-track">
            <div className="use-cases-set">
              {industries.map((industry) => (
                <UseCaseItem
                  key={industry.id}
                  label={industry.label}
                  icon={<IconMap name={industry.id} weight="regular" />}
                />
              ))}
            </div>
            <div className="use-cases-set" aria-hidden="true">
              {industries.map((industry) => (
                <UseCaseItem
                  key={`${industry.id}-duplicate`}
                  label={industry.label}
                  icon={<IconMap name={industry.id} weight="regular" />}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
