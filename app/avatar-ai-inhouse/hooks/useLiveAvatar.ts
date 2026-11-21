"use client";

import { useCallback, useEffect, useRef, useState } from "react";
// import { avatarApi } from "@/services/avatarApi";
import { avatarApi } from "../api/avatarApi";

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export type ConnectionState =
  "disconnected" | "connecting" | "connected" | "error";
type TurnPhase = "listening" | "thinking" | "speaking";

export interface UseLiveAvatarOptions {
  baseUrl: string;
  avatarId?: string;
  refAudio?: string;
  refText?: string;
  language?: string;
  pauseDelayMs?: number;
  /** Enable only with headphones, or tune bargeInThreshold higher for speakers */
  enableBargeIn?: boolean;
  bargeInThreshold?: number;
  bargeInHoldMs?: number;
  iceServers?: RTCIceServer[];
}

const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  ...(process.env.NEXT_PUBLIC_TURN_URL_TCP
    ? [
        {
          urls: process.env.NEXT_PUBLIC_TURN_URL_TCP,
          username: process.env.NEXT_PUBLIC_TURN_USERNAME,
          credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL,
        },
      ]
    : []),
  ...(process.env.NEXT_PUBLIC_TURN_URL_TLS
    ? [
        {
          urls: process.env.NEXT_PUBLIC_TURN_URL_TLS,
          username: process.env.NEXT_PUBLIC_TURN_USERNAME,
          credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL,
        },
      ]
    : []),
  ...(process.env.NEXT_PUBLIC_STUN_URL
    ? [{ urls: process.env.NEXT_PUBLIC_STUN_URL }]
    : []),
];

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
    iceServers = DEFAULT_ICE_SERVERS,
  } = options;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [lastSentText, setLastSentText] = useState("");

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const isVoiceActiveRef = useRef(false);
  const turnPhaseRef = useRef<TurnPhase>("listening");

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const bargeInRafRef = useRef<number | null>(null);
  const speakingPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const thinkingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loudSinceRef = useRef<number | null>(null);
  const finalBufferRef = useRef("");
  const interimBufferRef = useRef("");
  const connectAbortRef = useRef<AbortController | null>(null);

  const pauseRecognition = useCallback(() => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    finalBufferRef.current = "";
    interimBufferRef.current = "";
    setLiveTranscript("");

    if (recognitionRef.current) {
      try {
        // Hard abort discards any buffered audio heard from speakers
        recognitionRef.current.abort();
      } catch {
        // Ignore if already stopped
      }
    }
  }, []);

  const resumeRecognition = useCallback(() => {
    if (!isVoiceActiveRef.current || !recognitionRef.current) return;
    turnPhaseRef.current = "listening";
    setIsAvatarSpeaking(false);
    finalBufferRef.current = "";
    interimBufferRef.current = "";

    try {
      recognitionRef.current.start();
    } catch {
      // Already started
    }
  }, []);

  const interrupt = useCallback(async () => {
    const sid = sessionIdRef.current;
    if (!sid) return;
    if (thinkingTimeoutRef.current) {
      clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = null;
    }
    if (unlockTimerRef.current) {
      clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = null;
    }
    try {
      await avatarApi.interruptTalk(baseUrl, sid);
    } catch (err) {
      console.warn("Interrupt request failed:", err);
    }
    if (isVoiceActiveRef.current) {
      resumeRecognition();
    } else {
      turnPhaseRef.current = "listening";
      setIsAvatarSpeaking(false);
    }
  }, [baseUrl, resumeRecognition]);

  const sendText = useCallback(
    async (
      text: string,
      type: "chat" | "echo" = "chat",
      shouldInterrupt = true,
    ) => {
      const cleaned = text.trim();
      const sid = sessionIdRef.current;
      if (!cleaned || !sid) return;

      // Immediately kill mic recognition while LLM + TTS generate audio
      turnPhaseRef.current = "thinking";
      setIsAvatarSpeaking(true);
      pauseRecognition();
      setError(null);

      // Safety fallback: if server never reports speaking within 8s, unlock mic
      if (thinkingTimeoutRef.current) clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = setTimeout(() => {
        if (turnPhaseRef.current === "thinking") {
          resumeRecognition();
        }
      }, 8000);

      try {
        await avatarApi.sendHumanMessage(baseUrl, {
          text: cleaned,
          type,
          interrupt: shouldInterrupt,
          sessionid: sid,
        });
        setLastSentText(cleaned);
      } catch (err) {
        if (thinkingTimeoutRef.current) {
          clearTimeout(thinkingTimeoutRef.current);
          thinkingTimeoutRef.current = null;
        }
        resumeRecognition();
        setError(err instanceof Error ? err.message : "Failed to send message");
      }
    },
    [baseUrl, pauseRecognition, resumeRecognition],
  );

  const stopVoiceChat = useCallback(() => {
    isVoiceActiveRef.current = false;
    setIsVoiceActive(false);
    turnPhaseRef.current = "listening";
    setIsAvatarSpeaking(false);
    loudSinceRef.current = null;
    finalBufferRef.current = "";
    interimBufferRef.current = "";
    setLiveTranscript("");

    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
    if (thinkingTimeoutRef.current) clearTimeout(thinkingTimeoutRef.current);
    if (speakingPollRef.current) clearInterval(speakingPollRef.current);
    if (bargeInRafRef.current !== null)
      cancelAnimationFrame(bargeInRafRef.current);

    pauseTimerRef.current = null;
    unlockTimerRef.current = null;
    thinkingTimeoutRef.current = null;
    speakingPollRef.current = null;
    bargeInRafRef.current = null;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore
      }
      recognitionRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
      analyserRef.current = null;
    }
  }, []);

  const disconnect = useCallback(() => {
    connectAbortRef.current?.abort();
    connectAbortRef.current = null;
    stopVoiceChat();

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    if (audioRef.current) audioRef.current.srcObject = null;

    sessionIdRef.current = null;
    setSessionId(null);
    setConnectionState("disconnected");
  }, [stopVoiceChat]);

  const connect = useCallback(async () => {
    if (connectionState === "connecting" || connectionState === "connected")
      return;

    setError(null);
    setConnectionState("connecting");
    const abortController = new AbortController();
    connectAbortRef.current = abortController;

    const pc = new RTCPeerConnection({
      iceTransportPolicy: "relay",
      iceServers,
    });
    pcRef.current = pc;

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
      } else if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
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

      await new Promise<void>((resolve) => {
        if (pc.iceGatheringState === "complete") {
          resolve();
          return;
        }
        const onGather = () => {
          if (pc.iceGatheringState === "complete") {
            pc.removeEventListener("icegatheringstatechange", onGather);
            resolve();
          }
        };
        pc.addEventListener("icegatheringstatechange", onGather);
      });

      const localDesc = pc.localDescription;
      if (!localDesc)
        throw new Error("Failed to create local WebRTC description");

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
      const message =
        err instanceof Error ? err.message : "WebRTC connection failed";
      setError(message);
      setConnectionState("error");
      pc.close();
      pcRef.current = null;
      sessionIdRef.current = null;
      setSessionId(null);
    }
  }, [avatarId, baseUrl, connectionState, iceServers, refAudio, refText]);

  const startVoiceChat = useCallback(async () => {
    if (!sessionIdRef.current) {
      setError("Connect WebRTC before starting voice chat.");
      return;
    }
    const SpeechRec =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setError(
        "Web Speech API is not supported in this browser. Use Chrome or Edge.",
      );
      return;
    }

    setError(null);

    if (enableBargeIn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        micStreamRef.current = stream;
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 1024;
        source.connect(analyser);
        audioCtxRef.current = audioCtx;
        analyserRef.current = analyser;
      } catch {
        setError("Microphone permission denied.");
        return;
      }
    }

    const monitorBargeIn = () => {
      if (!isVoiceActiveRef.current || !analyserRef.current) return;

      if (turnPhaseRef.current === "speaking") {
        const analyser = analyserRef.current;
        const buffer = new Float32Array(analyser.fftSize);
        analyser.getFloatTimeDomainData(buffer);

        let sum = 0;
        for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i];
        const rms = Math.sqrt(sum / buffer.length);

        if (rms > bargeInThreshold) {
          if (loudSinceRef.current === null)
            loudSinceRef.current = performance.now();
          if (performance.now() - loudSinceRef.current >= bargeInHoldMs) {
            loudSinceRef.current = null;
            void interrupt();
          }
        } else {
          loudSinceRef.current = null;
        }
      } else {
        loudSinceRef.current = null;
      }

      bargeInRafRef.current = requestAnimationFrame(monitorBargeIn);
    };

    const pollSpeaking = async () => {
      const sid = sessionIdRef.current;
      if (!sid || !isVoiceActiveRef.current) return;

      try {
        const res = await avatarApi.isSpeaking(baseUrl, sid);
        const speakingNow = Boolean(res.data);

        if (speakingNow) {
          // Transition from thinking/listening -> speaking
          if (thinkingTimeoutRef.current) {
            clearTimeout(thinkingTimeoutRef.current);
            thinkingTimeoutRef.current = null;
          }
          if (unlockTimerRef.current) {
            clearTimeout(unlockTimerRef.current);
            unlockTimerRef.current = null;
          }
          if (turnPhaseRef.current !== "speaking") {
            turnPhaseRef.current = "speaking";
            setIsAvatarSpeaking(true);
            pauseRecognition();
          }
        } else if (
          turnPhaseRef.current === "speaking" &&
          !unlockTimerRef.current
        ) {
          // Only unlock after avatar actually spoke AND finished (+450ms echo decay)
          unlockTimerRef.current = setTimeout(() => {
            unlockTimerRef.current = null;
            resumeRecognition();
          }, 450);
        }
      } catch {
        // Ignore transient polling errors
      }
    };

    const flushOnPause = () => {
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = null;
      }
      const combined =
        `${finalBufferRef.current} ${interimBufferRef.current}`.trim();
      finalBufferRef.current = "";
      interimBufferRef.current = "";
      setLiveTranscript("");

      if (combined && turnPhaseRef.current === "listening") {
        void sendText(combined, "chat", true);
      }
    };

    const recognition = new SpeechRec();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event) => {
      if (turnPhaseRef.current !== "listening") return;

      let latestInterim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalBufferRef.current += `${transcript} `;
        } else {
          latestInterim += transcript;
        }
      }
      interimBufferRef.current = latestInterim;
      setLiveTranscript(`${finalBufferRef.current}${latestInterim}`.trim());

      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = setTimeout(
        flushOnPause,
        Math.max(400, pauseDelayMs),
      );
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed") {
        setError("Microphone access denied.");
        stopVoiceChat();
      }
    };

    recognition.onend = () => {
      // Only auto-restart if we are actively in the listening phase
      if (isVoiceActiveRef.current && turnPhaseRef.current === "listening") {
        try {
          recognition.start();
        } catch {
          // Ignore rapid restart race
        }
      }
    };

    recognitionRef.current = recognition;
    isVoiceActiveRef.current = true;
    turnPhaseRef.current = "listening";
    setIsVoiceActive(true);
    speakingPollRef.current = setInterval(pollSpeaking, 250);
    if (enableBargeIn) {
      bargeInRafRef.current = requestAnimationFrame(monitorBargeIn);
    }

    recognition.start();
  }, [
    bargeInHoldMs,
    bargeInThreshold,
    baseUrl,
    enableBargeIn,
    interrupt,
    language,
    pauseDelayMs,
    pauseRecognition,
    resumeRecognition,
    sendText,
    stopVoiceChat,
  ]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
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
  };
}
