import { useState, useRef, useEffect, useCallback } from "react";
import {
  AgentEventsEnum,
  LiveAvatarSession,
  SessionDisconnectReason,
  SessionEvent,
  VoiceChatEvent,
} from "@heygen/liveavatar-web-sdk";

type Line = { who: "you" | "avatar"; text: string };
type ConnectionError = {
  message: string;
  details?: string;
};

type Options = {
  manualReply?: boolean;
};

function formatErrorDetails(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function getRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : undefined;
}

function getString(value: unknown, key: string): string | undefined {
  const record = getRecord(value);
  return typeof record?.[key] === "string" ? record[key] : undefined;
}

function isNoCreditsError(error: unknown): boolean {
  return error instanceof Error && /no credits available/i.test(error.message);
}

export function useHeyGenAvatar({ manualReply = true }: Options = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sessionRef = useRef<LiveAvatarSession | null>(null);
  const startingRef = useRef(false);
  const startSessionRef = useRef<() => Promise<void>>(() => Promise.resolve());
  const retryingRef = useRef(false);
  const retryAttemptsRef = useRef(0);
  const keyCountRef = useRef(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSentRef = useRef({ text: "", time: 0 });

  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [lines, setLines] = useState<Line[]>([]);
  const [connectionError, setConnectionError] =
    useState<ConnectionError | null>(null);

  const addLine = useCallback((who: Line["who"], text: string) => {
    if (!text?.trim()) return;
    const clean = text.trim();
    setLines((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.who === who && last.text === clean) return prev;
      return [...prev, { who, text: clean }];
    });
  }, []);

  const startSession = useCallback(async () => {
    if (startingRef.current || sessionRef.current) return;
    const isRetry = retryingRef.current;
    retryingRef.current = false;
    if (!isRetry) {
      retryAttemptsRef.current = 0;
      keyCountRef.current = 1;
    }

    startingRef.current = true;
    setIsLoading(true);
    setIsMuted(true);
    setLines([]);
    setConnectionError(null);

    try {
      const res = await fetch("/api/heygen-token", { method: "POST" });
      const rawBody = await res.text();
      let body: {
        session_token?: string;
        error?: string;
        details?: unknown;
      } = {};

      try {
        body = JSON.parse(rawBody) as typeof body;
      } catch {
        throw new Error(
          `The token server returned an invalid response (HTTP ${res.status}): ${rawBody || "empty response"}`,
        );
      }

      const session_token = body?.session_token;
      const configuredKeyCount = Number(
        res.headers.get("X-LiveAvatar-Key-Count"),
      );
      if (Number.isInteger(configuredKeyCount) && configuredKeyCount > 0) {
        keyCountRef.current = configuredKeyCount;
      }

      if (!res.ok || !session_token) {
        const exactMessage =
          body?.error ||
          getString(body.details, "message") ||
          getString(body.details, "error") ||
          `Token request failed with status ${res.status}`;

        const details =
          typeof body.details === "string"
            ? body.details
            : body.details
              ? JSON.stringify(body.details, null, 2)
              : undefined;

        const customErr = new Error(exactMessage);
        throw Object.assign(customErr, { details });
      }

      const session = new LiveAvatarSession(session_token, {
        voiceChat: { defaultMuted: true },
      });
      sessionRef.current = session;
      const voiceChat = session.voiceChat;

      // ---- mic state logging ----
      voiceChat.on(VoiceChatEvent.STATE_CHANGED, (state) =>
        console.info("[VoiceChat] state", state, "muted:", voiceChat.isMuted),
      );
      voiceChat.on(VoiceChatEvent.MUTED, () =>
        console.info("[VoiceChat] muted"),
      );
      voiceChat.on(VoiceChatEvent.UNMUTED, () =>
        console.info("[VoiceChat] unmuted"),
      );

      // ---- video + audio ----
      session.on(SessionEvent.SESSION_STREAM_READY, () => {
        const video = videoRef.current;
        if (video) {
          session.attach(video);
          video.muted = false;
          video.volume = 1;
          video
            .play()
            .catch((e) =>
              console.warn("[Video] autoplay blocked, click the page once:", e),
            );
        }
        setIsReady(true);
        setIsMuted(voiceChat.isMuted);
        setIsLoading(false);
        console.info("[Session] stream ready");
      });

      let latestTranscript = "";

      session.on(SessionEvent.SESSION_DISCONNECTED, (reason) => {
        console.info("[Session] disconnected", reason);
        const reasonRecord = getRecord(reason);

        // Stop video/audio stream cleanly
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }

        // Only display an error if the session explicitly failed to start
        if (reason === SessionDisconnectReason.SESSION_START_FAILED) {
          setConnectionError({
            message: "Avatar session start failed on the server.",
          });
        } else if (
          reason &&
          reason !== SessionDisconnectReason.CLIENT_INITIATED &&
          reason !== SessionDisconnectReason.SERVER_INITIATED
        ) {
          const reasonMsg =
            getString(reasonRecord, "message") ||
            getString(reasonRecord, "error") ||
            getString(reasonRecord, "reason");

          if (reasonMsg) {
            setConnectionError({
              message: reasonMsg,
              details: JSON.stringify(reason, null, 2),
            });
          } else {
            setConnectionError(null);
          }
        } else {
          // Normal stop, idle timeout, or server-initiated closure: return cleanly to landing state
          setConnectionError(null);
        }

        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        latestTranscript = "";
        sessionRef.current = null;
        setIsReady(false);
        setIsMuted(true);
        setIsLoading(false);
      });

      // ---- speech: debounce & overwrite instead of appending ----
      session.on(AgentEventsEnum.USER_TRANSCRIPTION, (data) => {
        const text = data.text.trim();
        if (!text) return;

        if (!manualReply) {
          addLine("you", text);
          return;
        }

        latestTranscript = text;

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
          const msg = latestTranscript.trim();
          latestTranscript = "";
          if (!msg || !sessionRef.current) return;

          const lettersOnly = msg.replace(/[^a-zA-Z0-9]/g, "");

          if (lettersOnly.length <= 1) {
            console.log("[Skipped background noise]:", msg);
            return;
          }

          const lowerMsg = msg.toLowerCase();
          const hallucinations = [
            "thank you.",
            "thank you",
            "okay",
            "okay.",
            "[silence]",
            "[noise]",
          ];
          if (hallucinations.includes(lowerMsg)) {
            console.log("[Skipped STT hallucination]:", msg);
            return;
          }
          const now = Date.now();
          const last = lastSentRef.current;

          if (msg.toLowerCase() === last.text && now - last.time < 4000) {
            console.log("[Skipped duplicate]:", msg);
            return;
          }

          lastSentRef.current = { text: msg.toLowerCase(), time: now };

          addLine("you", msg);
          console.log("SENDING TO AVATAR:", msg);
          // sessionRef.current.message(msg);
        }, 1500);
      });

      Object.values(AgentEventsEnum).forEach((evt) => {
        if (evt === AgentEventsEnum.USER_TRANSCRIPTION) return;

        session.on(
          evt as never,
          ((data: unknown) => {
            const eventName = String(evt).toLowerCase();
            const dataRecord = getRecord(data);

            // Catch server stop events (e.g. idle timeout, max duration reached)
            if (evt === AgentEventsEnum.SESSION_STOPPED) {
              console.info("[Avatar session stopped by server]:", data);
              if (videoRef.current) {
                videoRef.current.srcObject = null;
              }
              setConnectionError(null);
              return;
            }

            // Catch agent errors
            if (evt === AgentEventsEnum.ELEVENLABS_AGENT_EVENT) {
              if (
                getString(dataRecord, "elevenlabs_event_type") === "error" ||
                getString(dataRecord, "elevenlabs_event_type") ===
                  "agent_error" ||
                getRecord(dataRecord?.data)?.is_error
              ) {
                console.error("[Avatar Agent Error]:", data);
                const agentData = getRecord(dataRecord?.data);
                const agentErrMsg =
                  getString(agentData, "message") ||
                  getString(agentData, "error") ||
                  getString(agentData, "description") ||
                  "Error encountered in the avatar voice agent.";
                setConnectionError({
                  message: agentErrMsg,
                  details: JSON.stringify(data, null, 2),
                });
                return;
              }
            }

            // Filter out interim lip-sync chunks so text doesn't print word-by-word
            if (
              eventName.includes("chunk") ||
              eventName.includes("interim") ||
              eventName.includes("partial")
            ) {
              return;
            }

            console.log("[EVENT]", evt, data);

            // Only log the final finalized avatar speech
            if (
              eventName.startsWith("avatar") &&
              typeof dataRecord?.text === "string"
            ) {
              addLine("avatar", dataRecord.text);
            }
          }) as never,
        );
      });

      await session.start();
      console.info("[Session] started");
    } catch (error: unknown) {
      console.error("[Session] failed to start", error);
      sessionRef.current = null;
      const errorRecord = getRecord(error);

      const exactMessage =
        getString(errorRecord, "message") ||
        (typeof error === "string" ? error : "Avatar connection failed.");

      if (
        isNoCreditsError(error) &&
        retryAttemptsRef.current + 1 < keyCountRef.current
      ) {
        retryAttemptsRef.current += 1;
        retryingRef.current = true;
        setConnectionError(null);
        setIsLoading(true);
        setTimeout(() => {
          void startSessionRef.current();
        }, 0);
        return;
      }

      retryAttemptsRef.current = 0;
      let detailsText: string | undefined = undefined;
      if (errorRecord?.details) {
        detailsText =
          typeof errorRecord.details === "string"
            ? errorRecord.details
            : JSON.stringify(errorRecord.details, null, 2);
      } else if (errorRecord?.errorCode || errorRecord?.code) {
        detailsText = `Code: ${String(errorRecord.errorCode || errorRecord.code)}${errorRecord.status ? ` | Status: ${String(errorRecord.status)}` : ""}`;
      } else if (errorRecord?.stack && errorRecord.stack !== exactMessage) {
        detailsText = formatErrorDetails(error);
      }

      setConnectionError({
        message: exactMessage,
        details: detailsText !== exactMessage ? detailsText : undefined,
      });
      setIsLoading(false);
    } finally {
      startingRef.current = false;
    }
  }, [addLine, manualReply]);

  useEffect(() => {
    startSessionRef.current = startSession;
  }, [startSession]);

  const toggleMic = useCallback(async () => {
    const vc = sessionRef.current?.voiceChat;
    if (!vc) return;
    try {
      if (vc.isMuted) await vc.unmute();
      else await vc.mute();
      setIsMuted(vc.isMuted);
    } catch (error) {
      console.error("[VoiceChat] toggle failed", error);
    }
  }, []);

  const sendText = useCallback(
    (text: string) => {
      if (!sessionRef.current || !text.trim()) return;
      const cleanText = text.trim();

      addLine("you", cleanText);

      // Log it in the global ref so the STT listener ignores the incoming SDK echo
      lastSentRef.current = { text: cleanText.toLowerCase(), time: Date.now() };

      sessionRef.current.message(cleanText);
    },
    [addLine],
  );

  const stopSession = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const session = sessionRef.current;
    sessionRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsReady(false);
    setIsMuted(true);
    setConnectionError(null);
    try {
      await session?.stop();
    } catch (error) {
      console.error("[Session] stop failed", error);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      const session = sessionRef.current;
      sessionRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      session?.stop().catch(() => {});
    };
  }, []);

  return {
    videoRef,
    isReady,
    isLoading,
    isMuted,
    lines,
    connectionError,
    startSession,
    stopSession,
    toggleMic,
    sendText,
  };
}
