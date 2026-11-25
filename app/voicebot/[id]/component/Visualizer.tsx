import React from "react";
import { AudioVisualizer } from "./AudioVisualizer";
import type { TrackReferenceOrPlaceholder } from "@livekit/components-core";

interface VisualizerSectionProps {
  state: "speaking" | "listening" | "connected" | "disconnected";
  trackRef?: TrackReferenceOrPlaceholder;
  appearance?: "default" | "minimal";
}

export const VisualizerSection: React.FC<VisualizerSectionProps> = ({
  state,
  trackRef,
  appearance = "default",
}) => {
  const isAgent = state === "speaking";
  const isMinimal = appearance === "minimal";
  const themeColor = isMinimal ? "#78716c" : isAgent ? "#6366f1" : "#06b6d4";

  return (
    <div className="w-[300px] flex flex-col items-center justify-center relative">
      {/* 1. Visualizer Area (The Wave) */}
      <div className="relative w-full h-[48px] flex items-center justify-center">
        {/* Background Glow (Subtle) */}
        {!isMinimal && (
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[20px] w-[60%] -translate-x-1/2 -translate-y-1/2 opacity-40 blur-[25px] transition-colors duration-500"
            style={{ backgroundColor: themeColor }}
          />
        )}

        {/* The Canvas */}
        <div className="w-full h-full animate-fade-in z-10">
          <AudioVisualizer trackRef={trackRef} color={themeColor} />
        </div>
      </div>

      {/* 2. Status Text (Perfectly Centered) */}
      <div className="absolute -bottom-4 left-0 right-0 flex items-center justify-center">
        <span
          className={`whitespace-nowrap text-center text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors duration-500 ${
            isMinimal ? "" : "tracking-[0.2em] font-bold"
          }`}
          style={{
            color: themeColor,
            ...(isMinimal ? {} : { textShadow: `0 0 10px ${themeColor}40` }),
          }}
        >
          {isAgent ? "INT. AI Speaking" : "Listening"}
        </span>
      </div>
    </div>
  );
};
