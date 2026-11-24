"use client";

import { useRef } from "react";
// import { useSpatialReal } from "@/hooks/useSpatialReal";
import { useSpatialReal } from "../hook/useSpiralReal";

export function SpatialRealDemo() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { state, isReady, error, transcripts, start, end } = useSpatialReal({
    appId: process.env.NEXT_PUBLIC_SPATIALREAL_APP_ID ?? "",
    agentId: process.env.NEXT_PUBLIC_SPATIALREAL_AGENT_ID ?? "",
    containerRef,
  });

  const isLive = state === "live";
  const isBusy = state === "connecting" || state === "ending";

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">INT. AI Avatar Demo</h2>
          <p className="text-xs text-zinc-400">Powered by SpatialReal</p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
              isLive
                ? "bg-emerald-500/15 text-emerald-400"
                : isBusy
                  ? "bg-amber-500/15 text-amber-400"
                  : "bg-zinc-800 text-zinc-400"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {isReady ? state : "loading avatar..."}
          </span>

          {!isLive ? (
            <button
              onClick={start}
              disabled={!isReady || isBusy}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50"
            >
              {state === "connecting" ? "Connecting..." : "Start"}
            </button>
          ) : (
            <button
              onClick={end}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
            >
              End
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Avatar Container — explicit 3:4 portrait dimensions per SpatialReal docs */}
      <div className="flex justify-center">
        <div
          ref={containerRef}
          className="w-[360px] aspect-[3/4] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
        />
      </div>

      {/* Live Captions */}
      {transcripts.length > 0 && (
        <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-sm">
          {transcripts.map((line) => (
            <p key={line.key} className="leading-relaxed">
              <span className="mr-2 font-medium text-zinc-400">
                {line.role === "user" ? "You:" : "Avatar:"}
              </span>
              <span className="text-zinc-200">{line.text}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
