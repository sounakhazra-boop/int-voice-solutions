"use client";

import { useCallback, useRef, useState } from "react";
import { avatarApi } from "../api/avatarApi";
import {
  DEFAULT_ICE_SERVERS,
  hasTurnServers,
  waitForIceGathering,
} from "../iceConfig";
import type { ConnectionState } from "../types";

interface UseAvatarWebRTCOptions {
  baseUrl: string;
  avatarId?: string;
  refAudio?: string;
  refText?: string;
  iceServers?: RTCIceServer[];
  iceTransportPolicy?: RTCIceTransportPolicy;
  onBeforeDisconnect?: () => void;
  onError: (message: string | null) => void;
}

export function useAvatarWebRTC({
  baseUrl,
  avatarId,
  refAudio,
  refText,
  iceServers = DEFAULT_ICE_SERVERS,
  iceTransportPolicy = "all",
  onBeforeDisconnect,
  onError,
}: UseAvatarWebRTCOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const connectAbortRef = useRef<AbortController | null>(null);

  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const [sessionId, setSessionId] = useState<string | null>(null);

  const disconnect = useCallback(() => {
    connectAbortRef.current?.abort();
    connectAbortRef.current = null;
    onBeforeDisconnect?.();

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    if (audioRef.current) audioRef.current.srcObject = null;

    sessionIdRef.current = null;
    setSessionId(null);
    setConnectionState("disconnected");
  }, [onBeforeDisconnect]);

  const connect = useCallback(async () => {
    if (connectionState === "connecting" || connectionState === "connected") {
      return;
    }

    onError(null);
    setConnectionState("connecting");
    const abortController = new AbortController();
    connectAbortRef.current = abortController;

    const pc = new RTCPeerConnection({
      iceTransportPolicy,
      iceServers,
    });
    pcRef.current = pc;

    // --- WebRTC Debug Logging ---
    console.log(
      "[WebRTC] ICE Servers:",
      iceServers.map((s) => ({
        urls: s.urls,
        hasUsername: Boolean(s.username),
        hasCredential: Boolean(s.credential),
      })),
    );

    pc.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        console.log(
          `[WebRTC] Candidate gathered: type=${event.candidate.type} protocol=${event.candidate.protocol} address=${event.candidate.address}:${event.candidate.port}`,
        );
      } else {
        console.log("[WebRTC] ICE gathering complete");
      }
    });

    pc.addEventListener("icecandidateerror", (event) => {
      console.error("[WebRTC] ICE Candidate Error:", {
        url: event.url,
        errorCode: event.errorCode,
        errorText: event.errorText,
        address: event.address,
        port: event.port,
      });
    });

    pc.addEventListener("iceconnectionstatechange", () => {
      console.log("[WebRTC] ICE state:", pc.iceConnectionState);
    });
    // ----------------------------

    pc.addEventListener("track", (evt) => {
      const stream = evt.streams[0];
      if (!stream) return;
      if (evt.track.kind === "video" && videoRef.current) {
        videoRef.current.srcObject = stream;
      } else if (evt.track.kind === "audio" && audioRef.current) {
        audioRef.current.srcObject = stream;
      }
    });

    pc.addEventListener("connectionstatechange", () => {
      if (pc.connectionState === "connected") {
        setConnectionState("connected");
      } else if (pc.connectionState === "failed") {
        onError(
          "WebRTC media connection failed (ICE/TURN blocked or timed out).",
        );
        setConnectionState("error");
        sessionIdRef.current = null;
        setSessionId(null);
      } else if (pc.connectionState === "closed") {
        setConnectionState("disconnected");
        sessionIdRef.current = null;
        setSessionId(null);
      }
    });

    try {
      pc.addTransceiver("video", { direction: "recvonly" });
      pc.addTransceiver("audio", { direction: "recvonly" });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await waitForIceGathering(pc, hasTurnServers(iceServers));

      const localDesc = pc.localDescription;
      if (!localDesc) {
        throw new Error("Failed to create local WebRTC description");
      }

      const answer = await avatarApi.sendOffer(
        baseUrl,
        {
          sdp: localDesc.sdp,
          type: localDesc.type,
          avatar: avatarId || undefined,
          refaudio: refAudio || undefined,
          reftext: refText || undefined,
        },
        abortController.signal,
      );
      const remoteCandidates = answer.sdp
        .split("\n")
        .filter((line) => line.startsWith("a=candidate:"));
      console.log("[WebRTC] Remote (Modal) candidates:", remoteCandidates);

      if (answer.code && answer.code !== 0) {
        throw new Error(answer.msg || "Server rejected WebRTC offer");
      }
      if (!answer.sdp) {
        throw new Error("Server returned no SDP answer");
      }

      const sid = String(answer.sessionid);
      sessionIdRef.current = sid;
      setSessionId(sid);

      await pc.setRemoteDescription(
        new RTCSessionDescription({ type: "answer", sdp: answer.sdp }),
      );
    } catch (err) {
      if (abortController.signal.aborted) return;
      onError(err instanceof Error ? err.message : "WebRTC connection failed");
      setConnectionState("error");
      pc.close();
      pcRef.current = null;
      sessionIdRef.current = null;
      setSessionId(null);
    }
  }, [
    avatarId,
    baseUrl,
    connectionState,
    iceServers,
    iceTransportPolicy,
    onError,
    refAudio,
    refText,
  ]);

  return {
    videoRef,
    audioRef,
    connectionState,
    sessionId,
    sessionIdRef,
    connect,
    disconnect,
  };
}
