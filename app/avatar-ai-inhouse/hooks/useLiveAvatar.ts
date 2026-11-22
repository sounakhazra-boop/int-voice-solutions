"use client";

import { useEffect, useState } from "react";
import { useAvatarWebRTC } from "./useAvatarWebRTC";
import { useAvatarVoice } from "./useAvatarVoice";
// import type { ConnectionState, UseLiveAvatarOptions } from "./live-avatar/types";
import { ConnectionState, UseLiveAvatarOptions } from "../types";

export type { ConnectionState, UseLiveAvatarOptions };

export function useLiveAvatar(options: UseLiveAvatarOptions) {
  const {
    baseUrl,
    avatarId,
    refAudio,
    refText,
    language = "en-US",
    pauseDelayMs = 850,
    enableBargeIn = false,
    bargeInThreshold = 0.08,
    bargeInHoldMs = 220,
    iceServers,
    iceTransportPolicy = "all",
  } = options;

  const [error, setError] = useState<string | null>(null);

  const webrtc = useAvatarWebRTC({
    baseUrl,
    avatarId,
    refAudio,
    refText,
    iceServers,
    iceTransportPolicy,
    onError: setError,
  });

  const voice = useAvatarVoice({
    baseUrl,
    sessionIdRef: webrtc.sessionIdRef,
    language,
    pauseDelayMs,
    enableBargeIn,
    bargeInThreshold,
    bargeInHoldMs,
    onError: setError,
  });

  const disconnect = () => {
    voice.stopVoiceChat();
    webrtc.disconnect();
  };

  useEffect(() => {
    return () => {
      voice.stopVoiceChat();
      webrtc.disconnect();
    };
  }, [voice.stopVoiceChat, webrtc.disconnect]);

  return {
    videoRef: webrtc.videoRef,
    audioRef: webrtc.audioRef,
    connectionState: webrtc.connectionState,
    sessionId: webrtc.sessionId,
    error,
    isVoiceActive: voice.isVoiceActive,
    isAvatarSpeaking: voice.isAvatarSpeaking,
    liveTranscript: voice.liveTranscript,
    lastSentText: voice.lastSentText,
    connect: webrtc.connect,
    disconnect,
    startVoiceChat: voice.startVoiceChat,
    stopVoiceChat: voice.stopVoiceChat,
    sendText: voice.sendText,
    interrupt: voice.interrupt,
  };
}
