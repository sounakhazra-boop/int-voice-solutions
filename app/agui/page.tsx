"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LiveKitRoom } from "@livekit/components-react";
import { AgentInterface } from "./components/agent/AgentInterface";
import { ThreeBackground } from "./_components/ThreeBackground";
import { useLiveKitConnection } from "./hooks/useLiveKitConnection";

const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL || "";

export default function AGUIExtractionPage() {
  const { token, isConnecting, error, connect, disconnect } =
    useLiveKitConnection();

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#FAFAFA] px-6 text-zinc-900">
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
          <h3 className="text-xl font-semibold text-red-500">
            Connection Failed
          </h3>
          <p className="mt-2 text-zinc-600">{error.message}</p>
          <button
            onClick={() => connect()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#FAFAFA] font-sans text-zinc-900 selection:bg-brand-50 selection:text-ink-900">
      {/* Back to Home Link */}
      <div className="absolute top-4 left-4 z-20">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-xs backdrop-blur-md transition-colors hover:bg-white hover:text-brand-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
      </div>

      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-[20%] left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(199,210,254,0.3)_0%,rgba(255,255,255,0)_70%)] blur-3xl opacity-60" />
        <div className="absolute top-[40%] -right-[10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(238,242,255,0.4)_0%,rgba(255,255,255,0)_70%)] blur-3xl opacity-50" />
        <ThreeBackground />
      </div>

      <main className="relative z-10 flex h-[100dvh] w-full items-center justify-center p-3 md:p-6 lg:p-8">
        {!token && isConnecting ? (
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-brand-200 opacity-75" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-brand-500">
                <svg
                  className="h-6 w-6 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                Initializing Agent
              </h1>
              <p className="mt-2 text-zinc-500">
                Connecting to secure session...
              </p>
            </div>
          </div>
        ) : !token ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Session ended
            </h1>
            <p className="text-zinc-500">
              Start a new secure session whenever you are ready.
            </p>
            <button
              onClick={() => connect()}
              className="rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 transition-colors"
            >
              Start again
            </button>
          </div>
        ) : (
          <div className="h-full w-full overflow-hidden rounded-3xl">
            <LiveKitRoom
              token={token}
              serverUrl={LIVEKIT_URL}
              connect
              video={false}
              audio={{
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              }}
              data-lk-theme="default"
              style={{ height: "100%" }}
              onDisconnected={disconnect}
              onError={(roomError) =>
                console.error("LiveKit Room Error:", roomError)
              }
            >
              <AgentInterface onDisconnect={disconnect} />
            </LiveKitRoom>
          </div>
        )}
      </main>
    </div>
  );
}
