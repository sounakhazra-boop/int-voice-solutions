import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.LIVEAVATAR_API_KEY;
  const avatarId = process.env.LIVEAVATAR_AVATAR_ID;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "LIVEAVATAR_API_KEY is not configured in the environment variables.",
      },
      { status: 500 },
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

    let data: any;
    try {
      data = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        {
          error: `LiveAvatar returned an invalid non-JSON response (HTTP ${res.status})`,
          details: raw || "The response body was empty.",
        },
        { status: 502 },
      );
    }

    const session_token = data?.data?.session_token;
    if (!res.ok || !session_token) {
      // Extract exact error message sent by LiveAvatar
      const exactErrorMessage =
        data?.message ||
        data?.error ||
        data?.msg ||
        (typeof data?.data === "string" ? data.data : undefined) ||
        data?.data?.message ||
        data?.data?.error;

      return NextResponse.json(
        {
          error: exactErrorMessage || `LiveAvatar error (HTTP ${res.status})`,
          code: data?.code,
          details: data,
        },
        { status: res.ok ? 502 : res.status },
      );
    }

    return NextResponse.json({ session_token });
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
