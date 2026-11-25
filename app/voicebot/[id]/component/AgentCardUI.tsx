import React, { useRef, useEffect } from "react";
import {
  Bot,
  X,
  Mic,
  MicOff,
  PhoneOff,
  Loader2,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
// import { VisualizerSection } from '../Visualizer';
import { VisualizerSection } from "./Visualizer";
// import { ChatList } from '../Chatlist';
import { ChatList } from "./Chatlist";
// import type { ChatMessage } from '../Chatlist';
import type { ChatMessage } from "../hook/useChatTranscriptions";

interface AgentCardUIProps {
  state: "standby" | "connecting" | "active";
  appearance?: "default" | "minimal";
  onClose: () => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onToggleMic?: () => void;
  isMicMuted?: boolean;
  isAgentSpeaking?: boolean;
  visualizerState?: "speaking" | "listening" | "connected" | "disconnected";
  trackRef?: any;
  statusText?: string;
  showChat?: boolean;
  onToggleChat?: () => void;
  messages?: ChatMessage[];
}

export const AgentCardUI: React.FC<AgentCardUIProps> = ({
  state,
  appearance = "default",
  onClose,
  onConnect,
  onDisconnect,
  onToggleMic,
  isMicMuted = false,
  isAgentSpeaking = false,
  visualizerState = "connected",
  trackRef,
  statusText,
  showChat = false,
  onToggleChat,
  messages = [],
}) => {
  // Scroll to bottom of chat
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isMinimal = appearance === "minimal";
  useEffect(() => {
    if (showChat && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, showChat]);

  return (
    <div
      className={`pointer-events-auto flex flex-col items-center gap-4 transition-all duration-300 ${
        isMinimal
          ? `rounded-2xl bg-white p-5 text-stone-950 shadow-[0_12px_32px_rgba(28,25,23,0.14)] ${showChat ? "h-[min(650px,80vh)] w-[90vw] md:w-[420px]" : "h-auto w-[300px]"}`
          : `rounded-[32px] border border-indigo-500/30 bg-[#0b1120]/95 p-5 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(99,102,241,0.15)] ${showChat ? "h-[650px] w-[90vw] md:w-[420px]" : "h-auto w-[300px]"}`
      }`}
    >
      {/* Header / Controls */}
      <div
        className={`flex w-full items-center justify-between ${
          isMinimal ? "pb-1" : "border-b border-white/5 pb-3"
        }`}
      >
        <div className="flex items-center gap-2">
          {state === "active" ? (
            <div
              className={`h-2 w-2 rounded-full ${
                isMinimal ? "bg-stone-500" : "animate-pulse bg-green-500"
              }`}
            />
          ) : (
            <div
              className={`h-2 w-2 rounded-full ${
                isMinimal ? "bg-stone-400" : "bg-yellow-500"
              }`}
            />
          )}
          <span
            className={`text-xs font-semibold tracking-wide ${
              isMinimal ? "text-stone-600" : "text-indigo-300"
            }`}
          >
            {state === "active" ? "VYOM ACTIVE" : "VYOM STANDBY"}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close voice assistant"
          className={`p-1 transition-colors ${
            isMinimal
              ? "text-stone-500 hover:text-stone-950"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <X size={16} />
        </button>
      </div>

      {/* Agent Visual / Animation (Compact only) */}
      {!showChat && (
        <div className="relative w-24 h-24 flex items-center justify-center my-2">
          {/* The Face / Icon */}
          <div
            className={`relative z-10 flex h-20 w-20 items-center justify-center ${
              isMinimal
                ? "text-stone-700"
                : `rounded-2xl bg-gradient-to-b from-indigo-500 to-purple-600 shadow-lg ${
                    isAgentSpeaking ? "animate-mouth-move" : ""
                  }`
            }`}
          >
            <Bot
              size={isMinimal ? 36 : 40}
              className={isMinimal ? "" : "text-white"}
            />
          </div>
        </div>
      )}

      {/* CHAT AREA (Expanded only) */}
      {showChat && (
        <div
          className={`relative flex min-h-0 w-full flex-1 flex-col overflow-hidden ${
            isMinimal
              ? "rounded-lg bg-stone-50"
              : "rounded-xl border border-white/5 bg-navy-950/70"
          }`}
        >
          <ChatList messages={messages} appearance={appearance} />
        </div>
      )}

      {/* Status Text & Waveform / Connect Button */}
      <div
        className={`flex w-full flex-col items-center justify-center gap-2 ${
          showChat
            ? isMinimal
              ? "min-h-[60px] pt-2"
              : "min-h-[60px] border-t border-white/5 pt-2"
            : "min-h-[64px]"
        }`}
      >
        {state === "active" ? (
          <>
            {!showChat && (
              <span
                className={`w-full break-words px-2 text-center text-sm font-medium ${
                  isMinimal ? "text-stone-700" : "text-slate-200"
                }`}
              >
                {statusText ||
                  (isAgentSpeaking ? "Speaking..." : "Listening...")}
              </span>
            )}
            <div className="h-8 w-full flex items-center justify-center">
              <VisualizerSection
                state={visualizerState}
                trackRef={trackRef}
                appearance={appearance}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 w-full">
            <span
              className={`px-4 text-center text-xs leading-tight ${
                isMinimal ? "text-stone-600" : "text-slate-400"
              }`}
            >
              Start a voice session to manage your account.
            </span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="w-full">
        {state === "active" ? (
          <div className="flex items-center gap-3 w-full">
            {/* Mute Button */}
            <button
              onClick={onToggleMic}
              className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors ${
                isMinimal
                  ? isMicMuted
                    ? "text-stone-950 underline underline-offset-4"
                    : "text-stone-600 hover:text-stone-950"
                  : `rounded-2xl transition-all duration-300 ${
                      isMicMuted
                        ? "scale-[1.02] bg-white text-[#0B1426] shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        : "border border-white/5 bg-white/5 text-slate-200 hover:border-white/10 hover:bg-white/10"
                    }`
              }`}
            >
              {isMicMuted ? <MicOff size={18} /> : <Mic size={18} />}
              <span>{isMicMuted ? "Unmute" : "Mute"}</span>
            </button>

            {/* Disconnect Button */}
            <button
              onClick={onDisconnect}
              className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors ${
                isMinimal
                  ? "bg-stone-950 text-white hover:bg-stone-800"
                  : "rounded-2xl border border-red-400/20 bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-[0_4px_16px_rgba(239,68,68,0.3)] transition-all duration-300 hover:scale-[1.02] hover:from-red-400 hover:to-rose-500 active:scale-95"
              }`}
            >
              <PhoneOff size={18} />
              <span>End</span>
            </button>

            {/* Chat Toggle */}
            {onToggleChat && (
              <button
                onClick={onToggleChat}
                className={`
                                    w-12 h-12 flex-none items-center justify-center rounded-2xl transition-all duration-300
                                    ${
                                      isMinimal
                                        ? showChat
                                          ? "flex text-stone-950"
                                          : "flex text-stone-500 hover:text-stone-950"
                                        : `flex ${
                                            showChat
                                              ? "bg-brand-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                                              : "border border-white/5 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                                          }`
                                    }
                                `}
              >
                {showChat ? (
                  <ChevronDown size={22} />
                ) : (
                  <MessageSquare size={20} />
                )}
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={onConnect}
            disabled={state === "connecting"}
            className={`flex w-full items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-70 ${
              isMinimal
                ? "rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                : "rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 font-bold text-white shadow-lg shadow-indigo-950/40 transition-all hover:scale-[1.02] hover:from-indigo-400 hover:to-purple-500 active:scale-95"
            }`}
          >
            {state === "connecting" ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Mic size={18} />
                <span>Start Conversation</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
