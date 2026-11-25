"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
  useLocalParticipant,
  useVoiceAssistant,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { Bot } from "lucide-react";
// import { AgentCardUI } from '@/components/livekit_bank/banking/AgentCardUI';
import { AgentCardUI } from "./AgentCardUI";
// import { useChatTranscriptions } from '@/hooks/useChatTranscriptions';
import { useChatTranscriptions } from "../hook/useChatTranscriptions";
// import { useAssistant } from '@/hooks/useAssistant';
import { useAssistant } from "../hook/useAssisstant";

const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL || "";

type VisualizerState = "speaking" | "listening" | "connected" | "disconnected";

export interface AssistantProps {
  assistantId: string;
  label?: string;
  textOnly?: boolean;
  appearance?: "default" | "minimal";
}

function mapAgentToVisualizerState(state: string): VisualizerState {
  if (state === "connecting") return "connected";
  if (
    state === "speaking" ||
    state === "listening" ||
    state === "connected" ||
    state === "disconnected"
  ) {
    return state;
  }
  return "connected";
}

interface AssistantSessionProps {
  onDisconnect: () => void;
  appearance: "default" | "minimal";
}

const AssistantSession: React.FC<AssistantSessionProps> = ({
  onDisconnect,
  appearance,
}) => {
  const { state, audioTrack: agentTrack } = useVoiceAssistant();
  const { localParticipant, microphoneTrack } = useLocalParticipant();
  const messages = useChatTranscriptions();
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (localParticipant) {
      void localParticipant.setMicrophoneEnabled(true);
    }
  }, [localParticipant]);

  const userTrackRef = useMemo(() => {
    if (!localParticipant) return undefined;
    return {
      participant: localParticipant,
      source: Track.Source.Microphone,
      publication: microphoneTrack,
    };
  }, [localParticipant, microphoneTrack]);

  const agentTrackRef = useMemo(() => {
    if (!agentTrack?.participant || !agentTrack.publication) return undefined;
    return {
      participant: agentTrack.participant,
      source: Track.Source.Unknown,
      publication: agentTrack.publication,
    };
  }, [agentTrack]);

  const isAgentSpeaking = state === "speaking";
  const activeTrack = isAgentSpeaking
    ? agentTrackRef
    : !isMicMuted
      ? userTrackRef
      : undefined;

  const toggleMic = useCallback(() => {
    if (!localParticipant) return;
    const nextMuted = !isMicMuted;
    void localParticipant.setMicrophoneEnabled(!nextMuted);
    setIsMicMuted(nextMuted);
  }, [isMicMuted, localParticipant]);

  return (
    <>
      <div
        className={`fixed bottom-24 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-4 transition-all duration-300 md:bottom-6 md:right-6 ${
          showChat ? "h-[80vh] w-full md:h-auto md:w-auto" : ""
        }`}
      >
        <AgentCardUI
          appearance={appearance}
          state="active"
          onClose={onDisconnect}
          onDisconnect={onDisconnect}
          onToggleMic={toggleMic}
          isMicMuted={isMicMuted}
          isAgentSpeaking={isAgentSpeaking}
          visualizerState={mapAgentToVisualizerState(String(state))}
          trackRef={activeTrack}
          showChat={showChat}
          onToggleChat={() => setShowChat((visible) => !visible)}
          messages={messages}
        />
      </div>
      <RoomAudioRenderer />
      <StartAudio label="Click to allow audio playback" />
    </>
  );
};

export const Assistant: React.FC<AssistantProps> = ({
  assistantId,
  label = "Ask Vyom",
  textOnly = false,
  appearance = "default",
}) => {
  const { token, connecting, connect, disconnect } = useAssistant({
    assistantId,
    textOnly,
  });
  const [isCardOpen, setIsCardOpen] = useState(false);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setIsCardOpen(false);
  }, [disconnect]);

  const handleConnect = useCallback(async () => {
    try {
      await connect();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown connection error";
      console.error("Connection failed:", error);
      alert(`Failed to connect: ${message}`);
    }
  }, [connect]);

  return (
    <LiveKitRoom
      video={false}
      audio
      token={token}
      connect={Boolean(token)}
      serverUrl={LIVEKIT_URL}
      data-lk-theme="default"
      style={{ height: 0 }}
      onError={(error) => {
        console.error("LiveKit Error:", error);
        alert(`LiveKit error: ${error.message}`);
        handleDisconnect();
      }}
      onDisconnected={handleDisconnect}
    >
      {token ? (
        <AssistantSession
          appearance={appearance}
          onDisconnect={handleDisconnect}
        />
      ) : (
        <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-4 md:bottom-6 md:right-6">
          {isCardOpen && (
            <AgentCardUI
              appearance={appearance}
              state={connecting ? "connecting" : "standby"}
              onClose={() => setIsCardOpen(false)}
              onConnect={handleConnect}
            />
          )}

          {!isCardOpen && (
            <button
              type="button"
              onClick={() => setIsCardOpen(true)}
              disabled={connecting}
              className={`group relative flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 focus-visible:ring-offset-2 ${
                appearance === "minimal"
                  ? "h-14 w-14 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                  : "h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-[0_4px_20px_rgba(99,102,241,0.4)] transition-transform hover:scale-110 active:scale-95 disabled:scale-100 disabled:opacity-80"
              }`}
            >
              <span
                className={`pointer-events-none absolute right-full mr-4 whitespace-nowrap px-3 py-1.5 text-xs font-semibold opacity-0 transition-opacity group-hover:opacity-100 ${
                  appearance === "minimal"
                    ? "text-stone-700"
                    : "rounded-lg border border-indigo-500/20 bg-navy-900 text-indigo-200"
                }`}
              >
                {label}
              </span>
              <Bot
                size={appearance === "minimal" ? 24 : 32}
                className="relative z-10"
              />
            </button>
          )}
        </div>
      )}
    </LiveKitRoom>
  );
};

export default Assistant;
