import React from "react";
import content from "../../data/landing.json";
import { UseCaseItem } from "../UseCaseItem";
import { IconMap } from "./IconMap";

export const UseCasesSection: React.FC = () => {
  const industries = content.useCases.industries;

  return (
    <section className="border-t border-slate-100 bg-white px-6 py-12 sm:px-8 sm:py-16 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:gap-5 sm:p-5 lg:flex-row lg:items-stretch lg:gap-6">
        <div className="flex w-full shrink-0 items-center justify-between rounded-xl border border-brand-100 bg-brand-50/70 px-5 py-4 transition-colors hover:bg-brand-50 sm:px-6 sm:py-5 lg:w-72">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-600">
              Voice AI in action
            </p>
            <h2 className="text-lg font-bold leading-tight text-ink-900">
              {content.useCases.sectionTitle}
            </h2>
          </div>
          <svg
            className="h-5 w-5 shrink-0 text-brand-500"
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
