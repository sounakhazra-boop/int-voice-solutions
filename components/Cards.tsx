"use client";

import React from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogViewport,
} from "./ui/dialog";

export interface InitiativeCardProps {
  id: string;
  title: string;
  description: string;
  tag?: string;
  iconType: "purple" | "blue" | "gray";
  icon: React.ReactNode;
  url?: string | null;
  inhouseUrl?: string | null;
  /** Supports both spellings to match existing props and updated JSON */
  referanceUrl?: string | null;
  referenceUrl?: string | null;
  referanceImage?: string | null;
  referenceImage?: string | null;
  demoType?: string;
  demoLinks?: { label: string; url: string }[];
}

const iconStyles: Record<
  InitiativeCardProps["iconType"],
  { container: string; arrowHover: string; borderHover: string }
> = {
  purple: {
    container:
      "bg-purple-50 text-purple-600 ring-1 ring-inset ring-purple-500/15 group-hover:bg-purple-600 group-hover:text-white group-hover:ring-purple-600",
    arrowHover:
      "group-hover:text-purple-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
    borderHover: "hover:border-purple-200/90 hover:shadow-purple-500/5",
  },
  blue: {
    container:
      "bg-indigo-50/80 text-indigo-600 ring-1 ring-inset ring-indigo-500/15 group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-600",
    arrowHover:
      "group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
    borderHover: "hover:border-indigo-200/90 hover:shadow-indigo-500/5",
  },
  gray: {
    container:
      "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-400/20 group-hover:bg-slate-800 group-hover:text-white group-hover:ring-slate-800",
    arrowHover:
      "group-hover:text-slate-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
    borderHover: "hover:border-slate-300 hover:shadow-slate-500/5",
  },
};

export const InitiativeCard: React.FC<InitiativeCardProps> = ({
  title,
  description,
  tag,
  iconType = "blue",
  icon,
  url,
  inhouseUrl,
  referanceUrl,
  referenceUrl,
  referanceImage,
  referenceImage,
  demoType,
  demoLinks,
}) => {
  const normalizedUrl = url?.trim() || null;
  const normalizedInhouseUrl = inhouseUrl?.trim() || null;
  const normalizedRefUrl = (referanceUrl ?? referenceUrl)?.trim() || null;
  const normalizedRefImage = (referanceImage ?? referenceImage)?.trim() || null;
  const normalizedDemoLinks =
    demoLinks?.filter((link) => link.label.trim() && link.url.trim()) ?? [];

  const hasFooterMetadata =
    Boolean(normalizedRefImage) ||
    Boolean(normalizedRefUrl) ||
    normalizedDemoLinks.length > 0;

  const theme = iconStyles[iconType] ?? iconStyles.blue;

  const primaryBodyContent = (
    <div className="flex w-full items-start gap-4 p-5 text-left">
      {/* Icon Container */}
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${theme.container}`}
      >
        {icon}
      </div>

      {/* Text Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className=" truncate text-base font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-indigo-950"
            title={title}
          >
            {title}
          </h3>
          {tag && (
            <span className="inline-flex shrink-0 items-center rounded-full bg-purple-100/90 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-purple-700 ring-1 ring-inset ring-purple-600/20">
              {tag}
            </span>
          )}
          {!normalizedUrl && (
            <span className="inline-flex shrink-0 items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
              Soon
            </span>
          )}
        </div>

        <p
          className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500"
          title={description}
        >
          {description}
        </p>
      </div>

      {/* Directional Action Indicator */}
      <div
        className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-300 transition-all duration-200 ${theme.arrowHover}`}
      >
        {normalizedUrl ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </div>
  );

  return (
    <div
      className={`flex h-full flex-col justify-between rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-200 hover:shadow-md ${theme.borderHover}`}
    >
      {/* Top Primary Clickable Area */}
      {normalizedUrl ? (
        <a
          href={normalizedUrl}
          target="_blank"
          rel="noreferrer"
          data-inhouse-url={normalizedInhouseUrl ?? undefined}
          className="group flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-t-2xl"
        >
          {primaryBodyContent}
        </a>
      ) : (
        <Dialog>
          <DialogTrigger className="group w-full flex-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-t-2xl">
            {primaryBodyContent}
          </DialogTrigger>
          <DialogPortal>
            <DialogBackdrop />
            <DialogViewport>
              <DialogPopup className="max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  {icon}
                </div>
                <DialogTitle className="text-lg font-semibold text-slate-900">
                  {title} — Coming Soon
                </DialogTitle>
                <DialogDescription className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  This initiative is currently being prepared for deployment.
                  Please check back soon.
                </DialogDescription>
                <div className="mt-5 flex justify-end">
                  <DialogClose className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800">
                    Got it
                  </DialogClose>
                </div>
              </DialogPopup>
            </DialogViewport>
          </DialogPortal>
        </Dialog>
      )}

      {/* Unified Footer for Reference & Demo Links */}
      {hasFooterMetadata && (
        <div className="flex flex-col gap-3 rounded-b-2xl border-t border-slate-100 bg-slate-50/60 px-5 py-3">
          {/* Reference Row (Image + Reference Link) */}
          {(normalizedRefImage || normalizedRefUrl) && (
            <div className="flex items-center justify-between gap-3">
              {normalizedRefImage ? (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-slate-400">
                    Ref:
                  </span>
                  <img
                    src={normalizedRefImage}
                    alt={`${title} reference`}
                    className="h-5 max-w-[90px] rounded object-contain"
                    loading="lazy"
                  />
                </div>
              ) : (
                <span className="text-[11px] font-medium text-slate-400">
                  Reference Resource
                </span>
              )}

              {normalizedRefUrl && (
                <a
                  href={normalizedRefUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-800"
                >
                  <span>View reference</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              )}
            </div>
          )}

          {/* Demo Links Section */}
          {/* {normalizedDemoLinks.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-slate-400">
                  Live Demos
                </span>
                {demoType && (
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-600 ring-1 ring-inset ring-indigo-500/10">
                    {demoType}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {normalizedDemoLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    title={link.label}
                    className="inline-flex max-w-full items-center gap-1 rounded-lg border border-slate-200/90 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-2xs transition-all hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-700"
                  >
                    <span className="truncate">{link.label}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 shrink-0 text-slate-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};
