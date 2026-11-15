"use client";

import { useState } from "react";
// import { useHeyGenAvatar } from "@/hook/useHeyGenAvatar";
import { useHeyGenAvatar } from "./useHeyGenAvatar";
// import HeyGenVideo from "@/components/HeyGenVideo"; // Uncomment if needed in your tree

export default function AvatarAI() {
  const {
    videoRef,
    isReady,
    isLoading,
    isMuted,
    lines,
    connectionError,
    startSession,
    stopSession,
    sendText,
    toggleMic,
  } = useHeyGenAvatar({ manualReply: true });

  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      sendText(text);
      setText("");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-200 font-sans selection:bg-indigo-500/30 flex flex-col">
      {/* Header */}
      <header className="w-full px-8 py-6 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          <h1 className="text-lg font-medium tracking-tight text-white">
            Avatar AI
          </h1>
        </div>

        {/* System Status Indicator */}
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-slate-400">
          <span className="relative flex h-2 w-2">
            {isReady ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-600"></span>
            )}
          </span>
          {isLoading ? "Connecting" : isReady ? "System Active" : "Standby"}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-4 md:px-8 pb-12 gap-8">
        {/* Theater / Video Container */}
        <div className="relative w-full aspect-video bg-black/50 rounded-2xl md:rounded-[2rem] overflow-hidden ring-1 ring-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] group transition-all duration-700">
          {/* Subtle background glow when inactive */}
          {!isReady && (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-[#09090b] to-black opacity-80" />
          )}

          {/* Video Element */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              !isReady ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Disconnect overlay (visible on hover when active) */}
          {isReady && (
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={stopSession}
                className="px-4 py-2 bg-black/60 backdrop-blur-md text-slate-200 text-sm font-medium rounded-full ring-1 ring-white/10 hover:bg-red-500/20 hover:text-red-400 hover:ring-red-500/50 transition-all"
              >
                Disconnect
              </button>
            </div>
          )}

          {/* Inactive / Loading State Overlay */}
          {!isReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-10">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4 text-slate-400">
                  <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                  <p className="font-mono text-xs uppercase tracking-widest">
                    Establishing WebRTC Link...
                  </p>
                </div>
              ) : connectionError ? (
                <div className="w-full max-w-xl px-6 text-center">
                  <p className="text-sm font-medium text-red-300">
                    {connectionError.message}
                  </p>
                  {connectionError.details && (
                    <pre className="mt-3 max-h-32 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-red-950/40 p-3 text-left text-xs text-red-200 ring-1 ring-red-400/20">
                      {connectionError.details}
                    </pre>
                  )}
                  <button
                    onClick={() => startSession()}
                    className="mt-5 px-6 py-3 bg-white text-black text-sm font-medium rounded-full hover:bg-slate-200 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startSession()}
                  className="px-8 py-4 bg-white text-black text-sm font-medium rounded-full hover:scale-105 hover:bg-slate-200 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                  Connect Avatar
                </button>
              )}
            </div>
          )}
        </div>

        {/* Command Dock */}
        <div
          className={`w-full max-w-3xl flex flex-col gap-6 transition-all duration-500 ${isReady ? "opacity-100 translate-y-0" : "opacity-40 pointer-events-none translate-y-4"}`}
        >
          {/* Input Bar */}
          <div className="flex items-center gap-2 p-1.5 bg-white/5 backdrop-blur-xl rounded-full ring-1 ring-white/10 shadow-2xl">
            <button
              onClick={toggleMic}
              className={`p-3 rounded-full transition-colors ${
                isMuted
                  ? "bg-slate-800 text-slate-400 hover:text-white"
                  : "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30"
              }`}
              title={isMuted ? "Unmute microphone" : "Mute microphone"}
            >
              {isMuted ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h2.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              )}
            </button>

            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-transparent px-4 text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />

            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className="px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
            >
              Send
            </button>
          </div>

          {/* Transcript / Log */}
          <div className="w-full flex flex-col gap-1 px-4">
            {lines.length === 0 ? (
              <p className="text-center text-xs font-mono text-slate-600 uppercase tracking-widest mt-4">
                Conversation history will appear here
              </p>
            ) : (
              <div className="max-h-40 overflow-y-auto pr-4 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-slate-800">
                {/* @ts-ignore */}
                {lines.map((line, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${line.who === "you" ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                      {line.who === "you" ? "You" : "Avatar"}
                    </span>
                    <div
                      className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                        line.who === "you"
                          ? "bg-indigo-600/20 text-indigo-100 rounded-tr-sm"
                          : "bg-white/5 text-slate-200 rounded-tl-sm ring-1 ring-white/5"
                      }`}
                    >
                      {line.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
