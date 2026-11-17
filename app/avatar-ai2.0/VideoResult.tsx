// components/video-studio/VideoResult.tsx
// import type { VideoPhase } from "@/types/heygen";
import { VideoPhase } from "./heygen-types";

type Props = {
  phase: VideoPhase;
  videoUrl: string | null;
  error: string | null;
};

export default function VideoResult({ phase, videoUrl, error }: Props) {
  return (
    <>
      {phase === "rendering" && (
        <p className="text-sm text-neutral-500">
          Rendering usually takes a minute or two. Keep this tab open.
        </p>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {videoUrl && (
        <video src={videoUrl} controls className="w-full rounded-lg" />
      )}
    </>
  );
}
