// hooks/useHeyGenVideo.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
// import type { GenerateInput, VideoPhase } from "@/types/heygen";
import {
  GenerateInput,
  getHeyGenErrorMessage,
  VideoPhase,
} from "./heygen-types";

const POLL_MS = 4000;
const MAX_POLLS = 150; // ~10 minutes

export function useHeyGenVideo() {
  const [phase, setPhase] = useState<VideoPhase>("idle");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const poll = useCallback(function pollVideo(videoId: string, count = 0) {
    timerRef.current = setTimeout(async () => {
      if (!aliveRef.current) return;
      try {
        const res = await fetch(`/api/heygen/video/${videoId}`);
        const body = await res.json();
        if (!res.ok) {
          throw new Error(
            getHeyGenErrorMessage(
              body?.error,
              `Status check failed (${res.status})`,
            ),
          );
        }

        const status = String(body.status).toLowerCase();

        if (status === "completed" && body.video_url) {
          setVideoUrl(body.video_url);
          setPhase("done");
          return;
        }
        if (status === "failed") {
          setError(
            getHeyGenErrorMessage(
              body.error,
              "HeyGen failed to render this video.",
            ),
          );
          setPhase("failed");
          return;
        }
        if (count >= MAX_POLLS) {
          setError("Timed out waiting for the video. Try a shorter script.");
          setPhase("failed");
          return;
        }
        pollVideo(videoId, count + 1);
      } catch (e) {
        if (!aliveRef.current) return;
        setError(e instanceof Error ? e.message : "Status check failed.");
        setPhase("failed");
      }
    }, POLL_MS);
  }, []);

  const generate = useCallback(
    async (input: GenerateInput) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPhase("starting");
      setError(null);
      setVideoUrl(null);

      try {
        const res = await fetch("/api/heygen/video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const body = await res.json();
        if (!res.ok || !body.video_id) {
          throw new Error(
            getHeyGenErrorMessage(
              body?.error,
              `Could not start video (${res.status})`,
            ),
          );
        }
        if (!aliveRef.current) return;
        setPhase("rendering");
        poll(body.video_id);
      } catch (e) {
        if (!aliveRef.current) return;
        setError(e instanceof Error ? e.message : "Could not start video.");
        setPhase("failed");
      }
    },
    [poll],
  );

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("idle");
    setVideoUrl(null);
    setError(null);
  }, []);

  const busy = phase === "starting" || phase === "rendering";

  return { phase, videoUrl, error, busy, generate, reset };
}
