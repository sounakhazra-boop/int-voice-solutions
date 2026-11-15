"use client";

import { useEffect, useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import type { TextStreamReader } from "livekit-client";
import type { VoiceBotMessage } from "./types";

export function useVoiceBotTranscriptions(): VoiceBotMessage[] {
  const room = useRoomContext();
  const [messages, setMessages] = useState<VoiceBotMessage[]>([]);

  useEffect(() => {
    const handler = async (
      reader: TextStreamReader,
      participantInfo: { identity: string },
    ) => {
      const id = reader.info.id;
      const sender =
        participantInfo.identity === room.localParticipant.identity
          ? "user"
          : "agent";
      let text = "";

      for await (const chunk of reader) {
        text += chunk;
        if (!text.trim()) continue;

        setMessages((current) => {
          const message = {
            id,
            sender,
            text,
            timestamp: Date.now(),
          } satisfies VoiceBotMessage;
          const index = current.findIndex((item) => item.id === id);
          if (index === -1) return [...current, message];
          const next = [...current];
          next[index] = message;
          return next;
        });
      }
    };

    room.registerTextStreamHandler("lk.transcription", handler);
    return () => room.unregisterTextStreamHandler("lk.transcription");
  }, [room]);

  return messages;
}
