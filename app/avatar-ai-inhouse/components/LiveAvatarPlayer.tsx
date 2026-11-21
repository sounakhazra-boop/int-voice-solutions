"use client";

import { FormEvent, useState } from "react";
import { useLiveAvatar } from "../hooks/useLiveAvatar";

export interface LiveAvatarPlayerProps {
  /** Your Modal server URL, e.g. https://only4myrealme--musetalk-webrtc-server-serve.modal.run */
  apiBaseUrl: string;
  avatarId?: string;
  language?: string;
  pauseDelayMs?: number;
}

export function LiveAvatarPlayer({
  apiBaseUrl,
  avatarId = "sun_wav2lip_avatar",
  language = "en-US",
  pauseDelayMs = 850,
}: LiveAvatarPlayerProps) {
  const [textInput, setTextInput] = useState("");

  const {
    videoRef,
    audioRef,
    connectionState,
    sessionId,
    error,
    isVoiceActive,
    isAvatarSpeaking,
    liveTranscript,
    lastSentText,
    connect,
    disconnect,
    startVoiceChat,
    stopVoiceChat,
    sendText,
    interrupt,
  } = useLiveAvatar({
    baseUrl: apiBaseUrl,
    avatarId,
    language,
    pauseDelayMs,
  });

  const isConnected = connectionState === "connected";
  const isConnecting = connectionState === "connecting";

  const handleTextSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || !isConnected) return;
    const msg = textInput;
    setTextInput("");
    await sendText(msg, "chat", true);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-100 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isConnected
                ? "bg-emerald-400"
                : isConnecting
                  ? "animate-pulse bg-amber-400"
                  : "bg-rose-500"
            }`}
          />
          <span className="text-sm font-semibold capitalize">
            {connectionState}
          </span>
          {sessionId && (
            <span className="rounded-md bg-zinc-900 px-2 py-0.5 text-xs text-zinc-400">
              SID: {sessionId}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isConnected ? (
            <button
              type="button"
              onClick={connect}
              disabled={isConnecting}
              className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              {isConnecting ? "Connecting..." : "Connect"}
            </button>
          ) : (
            <button
              type="button"
              onClick={disconnect}
              className="rounded-lg bg-rose-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-rose-500"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="rounded-lg border border-rose-500/40 bg-rose-950/50 px-3 py-2 text-xs text-rose-200">
          {error}
        </div>
      )}

      {/* Video Stage */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
        <audio ref={audioRef} autoPlay />

        {!isConnected && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-500">
            {isConnecting
              ? "Establishing WebRTC stream..."
              : "Click Connect to start avatar"}
          </div>
        )}

        {/* Live Status Pill */}
        {isConnected && (isVoiceActive || isAvatarSpeaking) && (
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs backdrop-blur-md">
            <span
              className={`h-2 w-2 rounded-full ${
                isAvatarSpeaking ? "bg-indigo-400" : "animate-pulse bg-rose-500"
              }`}
            />
            <span>
              {isAvatarSpeaking
                ? "Avatar speaking (speak to interrupt)"
                : "Listening..."}
            </span>
          </div>
        )}
      </div>

      {/* Live Captions */}
      <div className="min-h-[44px] rounded-xl border border-zinc-800 bg-zinc-900/70 px-3.5 py-2.5 text-sm">
        {liveTranscript ? (
          <span className="text-zinc-100">{liveTranscript}</span>
        ) : lastSentText ? (
          <span className="text-zinc-400">
            Last sent: &ldquo;{lastSentText}&rdquo;
          </span>
        ) : (
          <span className="text-zinc-500">
            Start Live Voice or type a message below...
          </span>
        )}
      </div>

      {/* Voice + Interrupt Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={!isConnected}
          onClick={isVoiceActive ? stopVoiceChat : startVoiceChat}
          className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-40 ${
            isVoiceActive
              ? "bg-rose-600 text-white hover:bg-rose-500"
              : "bg-emerald-600 text-white hover:bg-emerald-500"
          }`}
        >
          {isVoiceActive ? "Stop Voice Chat" : "Start Live Voice Chat"}
        </button>

        <button
          type="button"
          disabled={!isConnected}
          onClick={interrupt}
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800 disabled:opacity-40"
        >
          Interrupt
        </button>
      </div>

      {/* Text Fallback */}
      <form onSubmit={handleTextSubmit} className="flex gap-2">
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          disabled={!isConnected}
          placeholder="Type a message to Gemini..."
          className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none disabled:opacity-40"
        />
        <button
          type="submit"
          disabled={!isConnected || !textInput.trim()}
          className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
