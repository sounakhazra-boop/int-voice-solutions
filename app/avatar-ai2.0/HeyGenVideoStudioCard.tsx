// components/HeyGenVideoStudioCard.tsx
// Drop this next to your existing AI Avatar card in Voice Solution.
// Logic lives in the hooks, UI pieces live in components/video-studio/.
"use client";

import { useState } from "react";
// import { useHeyGenAvatars } from "@/hooks/useHeyGenAvatars";
// import { useHeyGenVideo } from "@/hooks/useHeyGenVideo";
// import AvatarSelect from "./video-studio/AvatarSelect";
// import ScriptInput from "./video-studio/ScriptInput";
// import VideoResult from "./video-studio/VideoResult";
import { useHeyGenAvatars } from "./useHeyGenAvatars";
import { useHeyGenVideo } from "./useHeyGenVideo";
import AvatarSelect from "./AvatarSelect";
import ScriptInput from "./ScriptInput";
import VideoResult from "./VideoResult";

export default function HeyGenVideoStudioCard() {
  const {
    enabled,
    avatars,
    avatarId,
    setAvatarId,
    selected,
    error: avatarError,
  } = useHeyGenAvatars();
  const {
    phase,
    videoUrl,
    error: videoError,
    busy,
    generate,
  } = useHeyGenVideo();
  const [script, setScript] = useState("");

  // Loading, or feature flag off (no HEYGEN_API_KEY): render nothing.
  if (!enabled) return null;

  const canSubmit = !busy && !!selected && script.trim().length > 0;

  const onGenerate = () => {
    if (!selected) return;
    generate({
      script,
      avatar_id: selected.avatar_id,
      voice_id: selected.voice_id,
    });
  };

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
      <header>
        <h3 className="text-lg font-semibold">AI Video Studio</h3>
        <p className="text-sm text-neutral-500">
          Type a script, pick an avatar, get a talking-head video.
        </p>
      </header>

      <AvatarSelect
        avatars={avatars}
        value={avatarId}
        onChange={setAvatarId}
        disabled={busy}
      />

      <ScriptInput value={script} onChange={setScript} disabled={busy} />

      <button
        onClick={onGenerate}
        disabled={!canSubmit}
        className="self-start rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
      >
        {phase === "starting"
          ? "Starting..."
          : phase === "rendering"
            ? "Rendering video..."
            : "Generate video"}
      </button>

      <VideoResult
        phase={phase}
        videoUrl={videoUrl}
        error={videoError ?? avatarError}
      />
    </section>
  );
}
