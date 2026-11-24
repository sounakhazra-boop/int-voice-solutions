// import { console } from "inspector";
import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.SPATIALREAL_API_KEY;
  console.log(apiKey);
  if (!apiKey) {
    return NextResponse.json(
      { error: "SPATIALREAL_API_KEY is not configured" },
      { status: 500 },
    );
  }
  try {
    const res = await fetch(
      "https://api.spatialreal.com/v1/auth/session-token",
      {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expire_at: Math.floor(Date.now() / 1000) + 3600,
        }),
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: "Failed to mint SpatialReal session token", details: errText },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json({ sessionToken: data.session_token });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Unexpected error minting session token" },
      { status: 500 },
    );
  }
}
