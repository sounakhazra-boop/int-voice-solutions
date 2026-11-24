"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
// import {
//   type PresetAvatarConfig,
//   useLiveAvatar,
// } from '@/hooks/useLiveAvatar';
import { PresetAvatarConfig, useLiveAvatar } from "../hook/useLiveAvatar";

interface LiveAvatarStageProps {
  config: PresetAvatarConfig;
}

export function LiveAvatarStage({ config }: LiveAvatarStageProps) {
  const {
    videoRef,
    status,
    isConnected,
    hasVideo,
    isMicOn,
    isCameraOn,
    isScreenOn,
    transcript,
    error,
    connect,
    disconnect,
    toggleMic,
    toggleCamera,
    toggleScreen,
    sendText,
  } = useLiveAvatar(config);

  const [message, setMessage] = useState("");
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || !isConnected) return;
    sendText(message);
    setMessage("");
  };

  return (
    <div className="mx-auto grid h-[calc(100vh-2rem)] max-h-[760px] w-full max-w-5xl grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Left Card: Avatar Video + Controls */}
      <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isConnected
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                  : "bg-amber-400"
              }`}
            />
            <span className="text-sm font-semibold text-slate-900">
              {status}
            </span>
          </div>
          <span className="font-mono text-xs text-slate-500">
            {config.voiceName} Voice
          </span>
        </div>

        {/* Video Stage — fills remaining height without overflowing */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-slate-200/80">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`h-full w-full object-contain transition-opacity duration-300 ${
              hasVideo ? "opacity-100" : "opacity-0"
            }`}
          />

          {!hasVideo && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2.5 text-slate-700">
              <div className="h-7 w-7 animate-spin rounded-full border-4 border-slate-300 border-t-blue-500" />
              <p className="text-xs font-medium">
                {isConnected
                  ? "Waiting for Avatar stream..."
                  : "Connecting to Avatar..."}
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="shrink-0 bg-red-50 px-4 py-1.5 text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Compact Text Input + Action Bar */}
        <div className="flex shrink-0 flex-col gap-2.5 border-t border-slate-100 p-3">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!isConnected}
              placeholder="Type a message to Gemini..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-4 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:bg-white disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!isConnected || !message.trim()}
              aria-label="Send message"
              className="absolute right-1.5 rounded-full p-1.5 text-slate-600 transition hover:bg-slate-200/70 disabled:opacity-40"
            >
              ➤
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleCamera}
                disabled={!isConnected}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition disabled:opacity-40 ${
                  isCameraOn
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {isCameraOn ? "Stop Camera" : "Camera"}
              </button>

              <button
                type="button"
                onClick={toggleScreen}
                disabled={!isConnected}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition disabled:opacity-40 ${
                  isScreenOn
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {isScreenOn ? "Stop Screen" : "Screen"}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {isConnected ? (
                <button
                  type="button"
                  onClick={disconnect}
                  className="rounded-full bg-red-50 px-3.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                >
                  End Session
                </button>
              ) : (
                <button
                  type="button"
                  onClick={connect}
                  className="rounded-full bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  Reconnect
                </button>
              )}

              <button
                type="button"
                onClick={toggleMic}
                disabled={!isConnected}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition disabled:opacity-40 ${
                  isMicOn
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                }`}
              >
                {isMicOn ? "Mute Mic" : "Click to Speak"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Card: Live Transcript — matches left card height */}
      <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="shrink-0 border-b border-slate-100 px-4 py-2.5">
          <h2 className="text-sm font-semibold text-slate-900">
            Live Transcript
          </h2>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3.5">
          {transcript.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
              <span className="text-2xl">💬</span>
              <p className="text-xs font-medium">No messages yet</p>
            </div>
          ) : (
            transcript.map((entry) => (
              <div
                key={entry.id}
                className={`flex flex-col ${
                  entry.speaker === "user" ? "items-end" : "items-start"
                }`}
              >
                <span className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  {entry.speaker === "user" ? "You" : config.avatarData}
                </span>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-1.5 text-xs leading-relaxed ${
                    entry.speaker === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {entry.text}
                </div>
              </div>
            ))
          )}
          <div ref={transcriptEndRef} />
        </div>
      </div>
    </div>
  );
}
