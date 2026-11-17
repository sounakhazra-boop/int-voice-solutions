import { NextResponse } from "next/server";

import { blockKey, getKeyCount, getWorkingKey } from "@/lib/keyManager";

type LiveAvatarData = {
  session_token?: unknown;
  message?: unknown;
  error?: unknown;
};

type LiveAvatarResponse = {
  data?: LiveAvatarData | string;
  message?: unknown;
  error?: unknown;
  msg?: unknown;
  code?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getErrorMessage(data: LiveAvatarResponse): string | undefined {
  const nestedData =
    typeof data.data === "object" && data.data !== null ? data.data : undefined;
  const candidates = [
    data.message,
    data.error,
    data.msg,
    typeof data.data === "string" ? data.data : undefined,
    nestedData?.message,
    nestedData?.error,
  ];

  return candidates.find(
    (candidate): candidate is string => typeof candidate === "string",
  );
}

export async function POST() {
  const avatarId = process.env.LIVEAVATAR_AVATAR_ID;

  for (let attempt = 0; attempt < getKeyCount(); attempt += 1) {
    const apiKey = getWorkingKey();

    console.log(apiKey);

    if (!apiKey) {
      return NextResponse.json(
        { error: "All LiveAvatar API keys are currently exhausted." },
        { status: 503 },
      );
    }

    try {
      const res = await fetch("https://api.liveavatar.com/v1/sessions/token", {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "FULL",
          avatar_id: avatarId,
          avatar_persona: {
            voice_id: process.env.LIVEAVATAR_VOICE_ID,
            context_id: process.env.LIVEAVATAR_CONTEXT_ID,
            language: "en",
          },
        }),
      });

      const raw = await res.text();
      console.log("LiveAvatar status:", res.status, raw.slice(0, 300));

      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        if (res.status >= 500) {
          blockKey(apiKey, 60);
          continue;
        }

        return NextResponse.json(
          {
            error: `LiveAvatar returned an invalid non-JSON response (HTTP ${res.status})`,
            details: raw || "The response body was empty.",
          },
          { status: 502 },
        );
      }

      const data: LiveAvatarResponse = isRecord(parsed) ? parsed : {};
      const sessionToken = isRecord(data.data)
        ? data.data.session_token
        : undefined;

      if (
        res.ok &&
        typeof sessionToken === "string" &&
        sessionToken.length > 0
      ) {
        return NextResponse.json(
          { session_token: sessionToken },
          {
            headers: {
              "X-LiveAvatar-Key-Count": String(getKeyCount()),
            },
          },
        );
      }

      if (res.status === 401 || res.status === 403) {
        blockKey(apiKey, 86400);
        continue;
      }

      if (res.status === 429 || res.status >= 500) {
        blockKey(apiKey, 60);
        continue;
      }

      return NextResponse.json(
        {
          error:
            getErrorMessage(data) || `LiveAvatar error (HTTP ${res.status})`,
          code: data.code,
          details: data,
        },
        { status: res.ok ? 502 : res.status },
      );
    } catch (error) {
      console.error("Error fetching LiveAvatar token:", error);
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Could not reach LiveAvatar while creating the session token.",
          details: error instanceof Error ? error.stack : String(error),
        },
        { status: 502 },
      );
    }
  }

  return NextResponse.json(
    { error: "All LiveAvatar API keys are currently exhausted." },
    { status: 503 },
  );
}
