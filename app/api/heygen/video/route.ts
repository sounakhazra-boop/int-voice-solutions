// app/api/heygen/video/route.ts
// Starts a video render. Returns { video_id }.
import { NextResponse } from "next/server";

const MAX_SCRIPT_CHARS = 600; // keeps demo credits from getting burned

export async function POST(req: Request) {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) return NextResponse.json({ enabled: false }, { status: 503 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const script = String(body?.script ?? "").trim();
  const avatar_id = String(body?.avatar_id ?? "");
  const voice_id = String(body?.voice_id ?? "");

  if (!script || !avatar_id || !voice_id) {
    return NextResponse.json(
      { error: "script, avatar_id and voice_id are required." },
      { status: 400 },
    );
  }
  if (script.length > MAX_SCRIPT_CHARS) {
    return NextResponse.json(
      { error: `Script too long (max ${MAX_SCRIPT_CHARS} characters).` },
      { status: 400 },
    );
  }

  try {
    const res = await fetch("https://api.heygen.com/v2/video/generate", {
      method: "POST",
      headers: { "X-Api-Key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        video_inputs: [
          {
            character: { type: "avatar", avatar_id },
            voice: { type: "text", input_text: script, voice_id },
          },
        ],
        dimension: { width: 1280, height: 720 },
      }),
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

    const video_id = data?.data?.video_id;
    if (!res.ok || !video_id) {
      return NextResponse.json(
        {
          error:
            data?.message ||
            data?.error?.message ||
            `HeyGen error (HTTP ${res.status})`,
          details: data,
        },
        { status: res.ok ? 502 : res.status },
      );
    }
    return NextResponse.json({ video_id });
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
