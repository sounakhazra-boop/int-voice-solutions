"use client";
import React, { useState } from "react";

export default function UnrecognizableIframe() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-[85vh] bg-[#020617] overflow-hidden rounded-2xl border border-slate-800/80 shadow-2xl flex items-center justify-center">
      {/* 
        Heavy Obstruction Layer 1: Animated Scanlines, Dots & Matrix Grid overlays. 
        This disrupts pattern recognition by rendering visual noise on top of the iframe.
      */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-45 mix-blend-overlay bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[size:100%_4px,_3px_100%]"></div>

      {/* Mesh/Grain Noise */}
      <div className="absolute inset-0 z-25 pointer-events-none opacity-[0.18] bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:16px_16px]"></div>

      {/* Abstract geometric distortion block overlays to visual obscure massive parts */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 z-30 pointer-events-none bg-blue-900/30 blur-2xl rounded-full animate-pulse mix-blend-screen"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 z-30 pointer-events-none bg-purple-900/20 blur-3xl rounded-full animate-pulse mix-blend-color-dodge"></div>

      {/* Loading indicator that remains as an abstract overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-40 bg-slate-950 flex flex-col items-center justify-center text-sm font-semibold text-blue-400 gap-3">
          <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Obscuring Frame Stream...</span>
        </div>
      )}

      {/* 
        The Completely Distorted & Unrecognizable Frame Stream 
        Utilizes: 
        - perspective + 3D rotate to skew page beyond recognizable angles
        - Heavy Blur (blur-3xl / 20px+) to ensure no text, icons, or visual hierarchy is readable.
        - Invert and hue-rotation to make colors & contrast totally scrambled.
        - Scaling & shifting to prevent structural shape mapping.
      */}
      <div
        className="w-full h-full transition-opacity duration-1000 origin-center"
        style={{
          opacity: isLoaded ? 0.35 : 0,
          transform:
            "perspective(1200px) rotateX(65deg) rotateY(-25deg) rotateZ(35deg) scale(2.4) translateZ(-150px)",
          filter:
            "blur(18px) grayscale(0.2) contrast(3) invert(0.9) hue-rotate(180deg) saturate(2.5)",
        }}
      >
        <iframe
          src="https://agui.indusnettechnologies.com/landing"
          className="w-[150%] h-[150%] border-0 -translate-x-[15%] -translate-y-[15%] pointer-events-none"
          title="Obscured Site View"
          onLoad={() => setIsLoaded(true)}
          sandbox="allow-scripts" // Block top-level navigation just in case
        />
      </div>

      {/* Futuristic Status Label */}
      <div className="absolute bottom-4 left-4 z-30 bg-slate-900/90 border border-slate-700/50 px-3 py-1.5 rounded-md text-[10px] font-mono tracking-widest text-slate-400 flex items-center gap-2 shadow-lg">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
        <span>STREAM FEED DISTORTED_SECURE_ENCRYPTED</span>
      </div>
    </div>
  );
}
