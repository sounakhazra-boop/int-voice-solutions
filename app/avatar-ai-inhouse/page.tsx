"use client";
import { LiveAvatarPlayer } from "./components/LiveAvatarPlayer";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-6">
      {/* <LiveAvatarPlayer
        apiBaseUrl={process.env.NEXT_PUBLIC_AVATAR_API_URL ?? ""}
        avatarId="sun_wav2lip_avatar"
        language="en-IN"
        pauseDelayMs={850}
      /> */}
      <LiveAvatarPlayer
        apiBaseUrl={process.env.NEXT_PUBLIC_AVATAR_API_URL ?? "/api/avatar"}
        avatarId={process.env.NEXT_PUBLIC_AVATAR_ID ?? "sun_wav2lip_avatar"}
        language="en-IN"
        pauseDelayMs={400}
      />
    </main>
  );
}
