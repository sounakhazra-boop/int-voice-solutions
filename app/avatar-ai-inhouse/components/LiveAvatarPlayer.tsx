"use client";

import { FormEvent, useState } from "react";
import { useLiveAvatar } from "../hooks/useLiveAvatar";

export interface LiveAvatarPlayerProps {
  /** Proxy path or Modal server URL, e.g. /api/avatar */
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
  const [videoFit, setVideoFit] = useState<"contain" | "cover">("contain");
  const [videoResolution, setVideoResolution] = useState<{
    width: number;
    height: number;
  } | null>(null);

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
    iceTransportPolicy: "relay",
  });

  const isConnected = connectionState === "connected";
  const isConnecting = connectionState === "connecting";

  const handleVideoMetrics = (video: HTMLVideoElement) => {
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      setVideoResolution({
        width: video.videoWidth,
        height: video.videoHeight,
      });
    }
  };

  const handleDisconnect = () => {
    setVideoResolution(null);
    disconnect();
  };

  const handleTextSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || !isConnected) return;
    const msg = textInput;
    setTextInput("");
    await sendText(msg, "chat", true);
  };

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#1E3A5F]/60 bg-[#0A1628] text-[#F8FAFC] shadow-[0_24px_60px_rgba(4,10,22,0.65)]">
      {/* Top Studio Bar */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E3A5F]/50 bg-[#0F1F38] px-5 py-3.5">
        <div className="flex items-center gap-4">
          {/* INT. Brand Wordmark */}
          <div className="flex items-baseline gap-2.5">
            <span className="text-lg font-extrabold tracking-tight text-white">
              INT<span className="text-[#F04E30]">.</span>
            </span>
            <span className="hidden h-4 w-px bg-[#1E3A5F] sm:inline-block" />
            <span className="hidden text-sm font-medium text-[#94A3B8] sm:inline-block">
              Live Avatar Studio
            </span>
          </div>

          {/* Connection Status Pill */}
          <div className="flex items-center gap-2 rounded-full border border-[#1E3A5F]/80 bg-[#0A1628] px-3 py-1 text-xs font-medium">
            <span
              className={`h-2 w-2 rounded-full ${
                isConnected
                  ? "bg-emerald-400"
                  : isConnecting
                    ? "animate-pulse bg-amber-400"
                    : "bg-[#64748B]"
              }`}
            />
            <span className="capitalize text-[#E2E8F0]">{connectionState}</span>
          </div>

          {videoResolution && isConnected && (
            <span className="hidden rounded-md bg-[#112240] px-2 py-0.5 text-xs text-[#94A3B8] md:inline-block">
              {videoResolution.width} × {videoResolution.height}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {sessionId && (
            <span
              title={`Session ID: ${sessionId}`}
              className="hidden rounded-md border border-[#1E3A5F]/60 bg-[#0A1628] px-2.5 py-1 text-xs text-[#94A3B8] sm:inline-block"
            >
              Session {sessionId.slice(0, 8)}
            </span>
          )}

          {!isConnected ? (
            <button
              type="button"
              onClick={connect}
              disabled={isConnecting}
              className="rounded-lg bg-[#1D63ED] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#1554D1] focus:outline-none focus:ring-2 focus:ring-[#1D63ED]/60 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isConnecting ? "Connecting..." : "Connect"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDisconnect}
              className="rounded-lg border border-[#F04E30]/40 bg-[#F04E30]/15 px-4 py-1.5 text-sm font-semibold text-[#FF8A75] transition hover:bg-[#F04E30] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#F04E30]/50"
            >
              Disconnect
            </button>
          )}
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div
          role="alert"
          className="border-b border-[#F04E30]/30 bg-[#F04E30]/10 px-5 py-2.5 text-xs font-medium text-[#FFB4A6]"
        >
          {error}
        </div>
      )}

      {/* Adaptive Variable-Resolution Video Stage */}
      <div className="relative flex min-h-[320px] max-h-[65vh] w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,_#112240_0%,_#060D1A_75%)]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onLoadedMetadata={(e) => handleVideoMetrics(e.currentTarget)}
          onResize={(e) => handleVideoMetrics(e.currentTarget)}
          className={
            videoFit === "contain"
              ? "max-h-[65vh] w-auto max-w-full object-contain"
              : "h-full max-h-[65vh] w-full object-cover"
          }
        />
        <audio ref={audioRef} autoPlay />

        {/* Idle / Connecting Overlay */}
        {!isConnected && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full border border-[#1E3A5F] bg-[#112240] ${
                isConnecting ? "animate-pulse border-[#1D63ED]" : ""
              }`}
            >
              <span className="text-lg font-extrabold tracking-tight text-white">
                INT<span className="text-[#F04E30]">.</span>
              </span>
            </div>
            <p className="text-sm font-medium text-[#CBD5E1]">
              {isConnecting
                ? "Establishing live WebRTC stream..."
                : "Ready to start your live avatar session"}
            </p>
            <p className="max-w-xs text-xs text-[#64748B]">
              {isConnecting
                ? "Waking GPU container and negotiating media tracks."
                : "Click Connect above to open the video and audio stream."}
            </p>
          </div>
        )}

        {/* Fit / Fill Toggle (for variable aspect ratios) */}
        {isConnected && (
          <button
            type="button"
            onClick={() =>
              setVideoFit((prev) => (prev === "contain" ? "cover" : "contain"))
            }
            className="absolute right-3 top-3 rounded-lg border border-white/10 bg-[#0A1628]/75 px-2.5 py-1 text-xs font-medium text-[#CBD5E1] backdrop-blur-md transition hover:border-[#1D63ED]/60 hover:text-white"
          >
            {videoFit === "contain" ? "Fill stage" : "Fit video"}
          </button>
        )}

        {/* Live Voice / Speaking Indicator */}
        {isConnected && (isVoiceActive || isAvatarSpeaking) && (
          <div className="absolute bottom-3.5 left-3.5 flex items-center gap-2 rounded-full border border-white/10 bg-[#0A1628]/80 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md">
            <span
              className={`h-2 w-2 rounded-full ${
                isAvatarSpeaking ? "bg-[#1D63ED]" : "animate-pulse bg-[#F04E30]"
              }`}
            />
            <span>
              {isAvatarSpeaking
                ? "Avatar speaking"
                : "Listening to your microphone..."}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Interaction Console */}
      <div className="flex flex-col gap-3 border-t border-[#1E3A5F]/50 bg-[#0F1F38] p-4 sm:p-5">
        {/* Live Captions Strip */}
        <div className="min-h-[44px] rounded-xl border border-[#1E3A5F]/60 bg-[#0A1628] px-3.5 py-2.5 text-sm leading-relaxed">
          {liveTranscript ? (
            <span className="text-[#F8FAFC]">{liveTranscript}</span>
          ) : lastSentText ? (
            <span className="text-[#94A3B8]">
              Last sent: &ldquo;{lastSentText}&rdquo;
            </span>
          ) : (
            <span className="text-[#64748B]">
              Start live voice chat or type a message below.
            </span>
          )}
        </div>

        {/* Voice Controls + Text Input */}
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!isConnected}
              onClick={isVoiceActive ? stopVoiceChat : startVoiceChat}
              className={`flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none ${
                isVoiceActive
                  ? "bg-[#F04E30] text-white hover:bg-[#D93F22] focus:ring-[#F04E30]/50"
                  : "bg-[#1D63ED] text-white hover:bg-[#1554D1] focus:ring-[#1D63ED]/50"
              }`}
            >
              {isVoiceActive ? "Stop voice" : "Start live voice"}
            </button>

            <button
              type="button"
              disabled={!isConnected}
              onClick={interrupt}
              className="rounded-xl border border-[#1E3A5F] bg-[#112240] px-4 py-2.5 text-sm font-medium text-[#E2E8F0] transition hover:border-[#3B82F6]/60 hover:bg-[#162C52] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Interrupt
            </button>
          </div>

          <form onSubmit={handleTextSubmit} className="flex flex-1 gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={!isConnected}
              placeholder="Type a message..."
              className="flex-1 rounded-xl border border-[#1E3A5F] bg-[#0A1628] px-3.5 py-2.5 text-sm text-[#F8FAFC] placeholder-[#64748B] transition focus:border-[#1D63ED] focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
            />
            <button
              type="submit"
              disabled={!isConnected || !textInput.trim()}
              className="rounded-xl bg-[#1D63ED] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1554D1] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
