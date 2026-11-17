// hooks/useHeyGenAvatars.ts
"use client";

import { useEffect, useState } from "react";
// import type { AvatarOption } from "@/types/heygen";
import { AvatarOption, getHeyGenErrorMessage } from "./heygen-types";

export function useHeyGenAvatars() {
  // null = still loading, false = feature disabled (no HEYGEN_API_KEY)
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [avatars, setAvatars] = useState<AvatarOption[]>([]);
  const [avatarId, setAvatarId] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await fetch("/api/heygen/avatars");
        if (res.status === 503) {
          if (alive) setEnabled(false);
          return;
        }
        const body = await res.json();
        if (!alive) return;

        if (!res.ok) {
          setError(
            getHeyGenErrorMessage(body?.error, "Could not load avatars."),
          );
          setEnabled(true);
          return;
        }
        const list: AvatarOption[] = body.avatars ?? [];
        setAvatars(list);
        setAvatarId(list[0]?.avatar_id ?? "");
        setEnabled(true);
      } catch {
        if (alive) setEnabled(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const selected = avatars.find((a) => a.avatar_id === avatarId) ?? null;

  return { enabled, avatars, avatarId, setAvatarId, selected, error };
}
