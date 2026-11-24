"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SpatialReal } from "@spatialreal/web-sdk";

export type SessionState =
  "idle" | "connecting" | "live" | "ending" | "disposed";

export interface TranscriptLine {
  key: string;
  role: "user" | "assistant";
  text: string;
}

interface UseSpatialRealOptions {
  appId: string;
  agentId: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function useSpatialReal({
  appId,
  agentId,
  containerRef,
}: UseSpatialRealOptions) {
  const [state, setState] = useState<SessionState>("idle");
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptLine[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chatRef = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !appId || !agentId) return;

    let cancelled = false;

    async function initSession() {
      try {
        const res = await fetch("/api/spatialreal/token", { method: "POST" });
        if (!res.ok) {
          throw new Error("Failed to fetch SpatialReal session token");
        }
        const { sessionToken } = await res.json();
        if (cancelled) return;

        const sr = new SpatialReal({ appId });
        const chat = await sr.createSession({
          agentId,
          credential: sessionToken,
          container: container!,
        });

        if (cancelled) {
          await chat.dispose();
          return;
        }

        chat.on("transcript", (payload: unknown) => {
          const { role, text, turnId } = payload as {
            role: "user" | "assistant";
            text: string;
            turnId?: string;
          };
          const key = `${turnId ?? "no-turn"}:${role}`;
          setTranscripts((prev) => {
            const idx = prev.findIndex((item) => item.key === key);
            if (idx !== -1) {
              const updated = [...prev];
              updated[idx] = { key, role, text };
              return updated;
            }
            return [...prev, { key, role, text }];
          });
        });

        chat.on("state", (payload: unknown) => {
          setState((payload as { current: SessionState }).current);
        });

        chat.on("error", (payload: unknown) => {
          const err = (
            payload as { error: { code?: string; message?: string } }
          ).error;
          console.error(err.code, err.message);
          setError(
            err.code
              ? `[${err.code}]${err.message}`
              : (err.message ?? "Session error"),
          );
        });

        chatRef.current = chat;
        setIsReady(true);
      } catch (err: unknown) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Could not initialize session";
          setError(message);
        }
      }
    }

    initSession();

    const handlePageHide = () => {
      chatRef.current?.dispose();
    };
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      cancelled = true;
      window.removeEventListener("pagehide", handlePageHide);
      chatRef.current?.dispose();
      chatRef.current = null;
      setIsReady(false);
    };
  }, [appId, agentId, containerRef]);

  // Must be called directly from a user click/tap handler
  const start = useCallback(async () => {
    if (!chatRef.current) return;
    setError(null);
    try {
      await chatRef.current.start();
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      console.error(e.code, e.message);
      setError(
        e.code ? `[${e.code}]${e.message}` : (e.message ?? "Failed to start"),
      );
    }
  }, []);

  const end = useCallback(async () => {
    if (!chatRef.current) return;
    try {
      await chatRef.current.end();
    } catch (err) {
      console.error("Error ending session:", err);
    }
  }, []);

  return {
    state,
    isReady,
    error,
    transcripts,
    start,
    end,
  };
}
