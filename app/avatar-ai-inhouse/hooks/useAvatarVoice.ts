"use client";

import { useCallback, useRef, useState } from "react";
import type { MutableRefObject } from "react";
// import { avatarApi } from "../../api/avatarApi";
import { avatarApi } from "../api/avatarApi";
// import type { SpeechRecognitionLike, TurnPhase } from "./types";
import { SpeechRecognitionLike, TurnPhase } from "../types";

interface UseAvatarVoiceOptions {
  baseUrl: string;
  sessionIdRef: MutableRefObject<string | null>;
  language: string;
  pauseDelayMs: number;
  enableBargeIn: boolean;
  bargeInThreshold: number;
  bargeInHoldMs: number;
  onError: (message: string | null) => void;
}

export function useAvatarVoice({
  baseUrl,
  sessionIdRef,
  language,
  pauseDelayMs,
  enableBargeIn,
  bargeInThreshold,
  bargeInHoldMs,
  onError,
}: UseAvatarVoiceOptions) {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [lastSentText, setLastSentText] = useState("");

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
  const turnStartTimeRef = useRef<number | null>(null);

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
        // Hard abort discards buffered audio heard from speakers
        recognitionRef.current.abort();
      } catch {
        // Already stopped
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
  }, [baseUrl, resumeRecognition, sessionIdRef]);

  const sendText = useCallback(
    async (
      text: string,
      type: "chat" | "echo" = "chat",
      shouldInterrupt = true,
    ) => {
      const cleaned = text.trim();
      const sid = sessionIdRef.current;
      if (!cleaned || !sid) return;

      turnPhaseRef.current = "thinking";
      setIsAvatarSpeaking(true);
      pauseRecognition();
      onError(null);

      // Safety fallback: unlock mic if server never reports speaking within 8s
      if (thinkingTimeoutRef.current) clearTimeout(thinkingTimeoutRef.current);
      thinkingTimeoutRef.current = setTimeout(() => {
        if (turnPhaseRef.current === "thinking") {
          resumeRecognition();
        }
      }, 8000);
      const tSend = performance.now();
      turnStartTimeRef.current = tSend;
      console.log("[Latency] 1. sendHumanMessage sent:", cleaned);

      try {
        await avatarApi.sendHumanMessage(baseUrl, {
          text: cleaned,
          type,
          interrupt: shouldInterrupt,
          sessionid: sid,
        });
        console.log(
          "[Latency] 2. sendHumanMessage HTTP ack in",
          `${(performance.now() - tSend).toFixed(0)}ms`,
        );
        setLastSentText(cleaned);
      } catch (err) {
        if (thinkingTimeoutRef.current) {
          clearTimeout(thinkingTimeoutRef.current);
          thinkingTimeoutRef.current = null;
        }
        resumeRecognition();
        onError(err instanceof Error ? err.message : "Failed to send message");
      }
    },
    [baseUrl, onError, pauseRecognition, resumeRecognition, sessionIdRef],
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
    if (bargeInRafRef.current !== null) {
      cancelAnimationFrame(bargeInRafRef.current);
    }

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

  const startVoiceChat = useCallback(async () => {
    if (!sessionIdRef.current) {
      onError("Connect WebRTC before starting voice chat.");
      return;
    }
    const SpeechRec =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      onError(
        "Web Speech API is not supported in this browser. Use Chrome or Edge.",
      );
      return;
    }

    onError(null);

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
        onError("Microphone permission denied.");
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
          if (loudSinceRef.current === null) {
            loudSinceRef.current = performance.now();
          }
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
          if (thinkingTimeoutRef.current) {
            clearTimeout(thinkingTimeoutRef.current);
            thinkingTimeoutRef.current = null;
          }
          if (unlockTimerRef.current) {
            clearTimeout(unlockTimerRef.current);
            unlockTimerRef.current = null;
          }
          if (turnPhaseRef.current !== "speaking") {
            if (turnStartTimeRef.current !== null) {
              const totalClientWaitMs =
                performance.now() - turnStartTimeRef.current;
              console.log(
                "[Latency] 3. Server reported isSpeaking=true in",
                `${totalClientWaitMs.toFixed(0)}ms from send`,
              );
              turnStartTimeRef.current = null;
            }
            turnPhaseRef.current = "speaking";
            setIsAvatarSpeaking(true);
            pauseRecognition();
          }
        } else if (
          turnPhaseRef.current === "speaking" &&
          !unlockTimerRef.current
        ) {
          // Wait 450ms for speaker echo decay before unlocking mic
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
        onError("Microphone access denied.");
        stopVoiceChat();
      }
    };

    recognition.onend = () => {
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
    onError,
    pauseDelayMs,
    pauseRecognition,
    resumeRecognition,
    sendText,
    sessionIdRef,
    stopVoiceChat,
  ]);

  return {
    isVoiceActive,
    isAvatarSpeaking,
    liveTranscript,
    lastSentText,
    startVoiceChat,
    stopVoiceChat,
    sendText,
    interrupt,
  };
}
