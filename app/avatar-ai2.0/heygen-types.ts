// types/heygen.ts
export type AvatarOption = {
  avatar_id: string;
  name: string;
  preview: string | null;
  voice_id: string;
};

export type VideoPhase = "idle" | "starting" | "rendering" | "done" | "failed";

export type GenerateInput = {
  script: string;
  avatar_id: string;
  voice_id: string;
};

export function getHeyGenErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (typeof error === "string" && error.trim()) return error;

  if (error && typeof error === "object") {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }

  return fallback;
}

// Keep in sync with MAX_SCRIPT_CHARS in app/api/heygen/video/route.ts
export const MAX_SCRIPT_CHARS = 600;
