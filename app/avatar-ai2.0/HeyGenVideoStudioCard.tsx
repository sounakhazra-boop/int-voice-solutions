// components/HeyGenVideoStudioCard.tsx
// Drop this next to your existing AI Avatar card in Voice Solution.
// Logic lives in the hooks, UI pieces live in components/video-studio/.
"use client";

import { useState } from "react";
import { Sparkles, Video } from "lucide-react";
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

  if (!enabled) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 shadow-xs">
          <Video className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-slate-900">
          HeyGen Video Studio Key Required
        </h3>
        <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
          Set{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-brand-600">
            HEYGEN_API_KEY
          </code>{" "}
          in your environment variables to enable generative digital avatar
          synthesis.
        </p>
      </div>
    );
  }

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
    <section className="flex flex-col gap-5">
      <header>
        <h3 className="text-lg font-bold tracking-tight text-ink-900">
          AI Video Studio
        </h3>
        <p className="text-sm text-slate-500">
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
        className="self-start rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-brand-700 disabled:opacity-50 transition-colors"
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
