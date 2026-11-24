"use client";

import { useCallback, useEffect, useRef, useState } from "react";
// import { Fmp4Player } from '@/lib/live/fmp4-player';
import { Fmp4Player } from "../lib/live";
// import { LiveSocketClient } from '@/lib/live/live-socket';
import { LiveSocketClient } from "../lib/live";

export interface PresetAvatarConfig {
  avatarType: "preset";
  avatarData: string;
  voiceName: string;
  systemInstruction?: string;
  welcomeMessage?: string;
}

export interface NormalizedTranscriptItem {
  id: string;
  speaker: "user" | "model";
  text: string;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function float32ToInt16(float32: Float32Array): Int16Array {
  const int16 = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return int16;
}

function normalizeTranscript(
  raw: readonly unknown[],
): NormalizedTranscriptItem[] {
  return raw
    .map((entry, idx) => {
      if (!entry || typeof entry !== "object") return null;
      const rec = entry as Record<string, unknown>;
      const text = String(rec.text ?? rec.content ?? "").trim();
      if (!text) return null;
      const rawRole = String(rec.role ?? rec.sender ?? "model").toLowerCase();
      const speaker: "user" | "model" =
        rawRole === "user" || rawRole === "human" ? "user" : "model";
      return {
        id: String(rec.id ?? idx),
        speaker,
        text,
      };
    })
    .filter((item): item is NormalizedTranscriptItem => item !== null);
}

export function useLiveAvatar(config: PresetAvatarConfig) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const socketRef = useRef<LiveSocketClient | null>(null);
  const playerRef = useRef<Fmp4Player | null>(null);

  // Mic refs
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Vision (camera/screen) refs
  const visionStreamRef = useRef<MediaStream | null>(null);
  const visionIntervalRef = useRef<number | null>(null);

  const [status, setStatus] = useState<string>("Disconnected");
  const [hasVideo, setHasVideo] = useState<boolean>(false);
  const [isMicOn, setIsMicOn] = useState<boolean>(false);
  const [visionMode, setVisionMode] = useState<"none" | "camera" | "screen">(
    "none",
  );
  const [transcript, setTranscript] = useState<NormalizedTranscriptItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const stopMic = useCallback(() => {
    if (audioCtxRef.current) {
      void audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    setIsMicOn(false);
  }, []);

  const stopVision = useCallback(() => {
    if (visionIntervalRef.current !== null) {
      window.clearInterval(visionIntervalRef.current);
      visionIntervalRef.current = null;
    }
    if (visionStreamRef.current) {
      visionStreamRef.current.getTracks().forEach((t) => t.stop());
      visionStreamRef.current = null;
    }
    setVisionMode("none");
  }, []);

  const cleanupAll = useCallback(() => {
    stopMic();
    stopVision();
    playerRef.current?.destroy();
    playerRef.current = null;
    socketRef.current?.cleanup();
    socketRef.current = null;
    setHasVideo(false);
  }, [stopMic, stopVision]);

  const connect = useCallback(() => {
    cleanupAll();
    setError(null);

    const wsUrl =
      process.env.NEXT_PUBLIC_LIVE_WS_URL ?? "ws://localhost:8080/ws";

    const player = new Fmp4Player({
      onFirstChunk: () => setHasVideo(true),
    });
    if (videoRef.current) {
      player.attach(videoRef.current);
    }
    playerRef.current = player;

    const client = new LiveSocketClient();
    socketRef.current = client;

    client.connect({
      url: wsUrl,
      endpoint: "/ws",
      initialPayload: config,
      onBinaryFrame: (data: ArrayBuffer) => {
        player.appendChunk(new Uint8Array(data));
      },
      onMediaConfig: (msg: Record<string, unknown>) => {
        const codecs =
          typeof msg.codecs === "string"
            ? msg.codecs
            : typeof msg.codec === "string"
              ? msg.codec
              : null;
        if (codecs) {
          player.setCodec(codecs);
        }
      },
      onInterrupted: () => {
        player.flushAndAbort();
      },
      onBeforeTerminate: () => {
        stopMic();
        stopVision();
      },
      onStateChange: () => {
        setStatus(client.status);
        setTranscript(normalizeTranscript(client.transcript));
      },
      onWarning: (msg: string) => {
        setError(msg);
      },
      onDisconnected: () => {
        setStatus("Disconnected");
        setHasVideo(false);
        stopMic();
        stopVision();
      },
    });
  }, [cleanupAll, config, stopMic, stopVision]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.terminate();
    } else {
      cleanupAll();
    }
  }, [cleanupAll]);

  const toggleMic = useCallback(async () => {
    if (isMicOn) {
      stopMic();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      micStreamRef.current = stream;

      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (event) => {
        const input = event.inputBuffer.getChannelData(0);
        const pcm16 = float32ToInt16(input);
        const base64 = arrayBufferToBase64(pcm16.buffer as ArrayBuffer);
        socketRef.current?.sendAudioChunk(base64);
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);
      setIsMicOn(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Microphone permission denied",
      );
      stopMic();
    }
  }, [isMicOn, stopMic]);

  const startVision = useCallback(
    async (mode: "camera" | "screen") => {
      if (visionMode === mode) {
        stopVision();
        return;
      }
      stopVision();

      try {
        const stream =
          mode === "camera"
            ? await navigator.mediaDevices.getUserMedia({ video: true })
            : await navigator.mediaDevices.getDisplayMedia({ video: true });

        visionStreamRef.current = stream;
        setVisionMode(mode);

        // Stop automatically if user clicks browser's "Stop sharing" bar
        stream.getVideoTracks()[0]?.addEventListener("ended", () => {
          stopVision();
        });

        const hiddenVideo = document.createElement("video");
        hiddenVideo.srcObject = stream;
        hiddenVideo.muted = true;
        await hiddenVideo.play();

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        visionIntervalRef.current = window.setInterval(() => {
          if (!ctx || hiddenVideo.videoWidth === 0) return;
          canvas.width = 640;
          canvas.height = Math.round(
            (hiddenVideo.videoHeight / hiddenVideo.videoWidth) * 640,
          );
          ctx.drawImage(hiddenVideo, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          const base64Jpeg = dataUrl.split(",")[1];
          if (base64Jpeg) {
            socketRef.current?.sendVideoFrame(base64Jpeg);
          }
        }, 1000);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : `Failed to start ${mode}`,
        );
        stopVision();
      }
    },
    [stopVision, visionMode],
  );

  const sendText = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    socketRef.current?.sendText(trimmed);
  }, []);

  // Auto-connect on mount and clean up on unmount
  useEffect(() => {
    connect();
    return () => cleanupAll();
  }, [connect, cleanupAll]);

  return {
    videoRef,
    status,
    isConnected: status === "Connected",
    hasVideo,
    isMicOn,
    isCameraOn: visionMode === "camera",
    isScreenOn: visionMode === "screen",
    transcript,
    error,
    connect,
    disconnect,
    toggleMic,
    toggleCamera: () => startVision("camera"),
    toggleScreen: () => startVision("screen"),
    sendText,
  };
}
