// app/api/heygen/avatars/route.ts
// Lists HeyGen library avatars for the Video Studio card.
// These IDs are NOT the same as LIVEAVATAR_AVATAR_ID.
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.HEYGEN_API_KEY;
  // Feature flag: blank key = feature disabled, card hides itself.
  if (!apiKey) return NextResponse.json({ enabled: false }, { status: 503 });

  try {
    const res = await fetch("https://api.heygen.com/v2/avatars", {
      headers: { "X-Api-Key": apiKey },
      cache: "no-store",
    });
    const raw = await res.text();
    let data: any;
    try {
      data = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        {
          error: `HeyGen returned non-JSON (HTTP ${res.status})`,
          details: raw,
        },
        { status: 502 },
      );
    }
    if (!res.ok) {
      return NextResponse.json(
        {
          error:
            data?.message || data?.error || `HeyGen error (HTTP ${res.status})`,
          details: data,
        },
        { status: res.status },
      );
    }

    const list: any[] = data?.data?.avatars ?? [];
    const avatars = list
      .filter((a) => a?.avatar_id && a?.default_voice_id)
      .slice(0, 24)
      .map((a) => ({
        avatar_id: a.avatar_id,
        name: a.avatar_name ?? a.avatar_id,
        preview: a.preview_image_url ?? null,
        voice_id: a.default_voice_id,
      }));

    return NextResponse.json({ enabled: true, avatars });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not reach HeyGen.",
      },
      { status: 502 },
    );
  }
}
