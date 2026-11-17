// app/api/heygen/video/[id]/route.ts
// Poll target. Returns { status, video_url, raw }.
// `raw` is only here for debugging; delete it once the shape is confirmed.
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) return NextResponse.json({ enabled: false }, { status: 503 });

  const { id } = await params;

  try {
    const res = await fetch(
      `https://api.heygen.com/v2/videos/${encodeURIComponent(id)}`,
      { headers: { "X-Api-Key": apiKey }, cache: "no-store" },
    );
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
          error: data?.message || `HeyGen error (HTTP ${res.status})`,
          details: data,
        },
        { status: res.status },
      );
    }

    const d = data?.data ?? {};
    return NextResponse.json({
      status: d.status ?? "unknown",
      video_url: d.video_url ?? null,
      error: d.error ?? null,
      raw: data,
    });
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
