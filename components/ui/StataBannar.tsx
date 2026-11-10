// src/components/ui/StatsBanner.tsx
import React from "react";
import content from "../../data/landing.json";
import { StatBlock } from "../StatBlock";
import { IconMap } from "./IconMap";

export const StatsBanner: React.FC = () => {
  // Map icons to the 4 specific stats in order: Quality, Scale, Languages, Use Cases
  const statIcons = [
    "customer-service",
    "conversations-analyst",
    "vaani",
    "real-estate",
  ];

  return (
    <section className="stats-banner bg-gradient-to-br from-[#071638] via-[#0d1d46] to-[#17135a]">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[radial-gradient(ellipse_at_20%_100%,rgba(0,164,255,0.35),transparent_45%),radial-gradient(ellipse_at_70%_100%,rgba(124,58,237,0.4),transparent_48%)]" />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-7 lg:flex-row lg:gap-10">
        {/* 1. Left/Center: Stats Grid */}
        <div className="grid w-full grid-cols-2 lg:flex-1 lg:grid-cols-4">
          {content.stats.map((stat, index) => (
            <div
              key={index}
              className="flex min-w-0 items-center justify-center border-gray-700/80 px-3 py-1 first:border-l-0 sm:px-5 lg:border-l lg:px-6 lg:first:border-l-0"
            >
              <StatBlock
                value={stat.value}
                label={stat.label}
                icon={
                  <div className="h-9 w-9 shrink-0 text-cyan-300">
                    <IconMap
                      name={statIcons[index] || "lightning"}
                      weight="bold"
                    />
                  </div>
                }
              />
            </div>
          ))}
        </div>

        {/* 2. Right: Explore Demo CTA Button */}
        <div className="w-full shrink-0 lg:w-auto">
          <button className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/40 transition-all duration-200 hover:-translate-y-0.5 hover:from-indigo-400 hover:to-purple-500 lg:w-auto">
            Explore Demo
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
