import { useEffect, useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import type { TextStreamReader } from "livekit-client";

export interface BandhanChatMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: number;
}

export function useBandhanChatTranscriptions(): BandhanChatMessage[] {
  const room = useRoomContext();
  const [messages, setMessages] = useState<BandhanChatMessage[]>([]);

  useEffect(() => {
    if (!room) return;

    const handler = async (
      reader: TextStreamReader,
      participantInfo: { identity: string },
    ) => {
      const messageId = reader.info.id;
      const isAgent =
        participantInfo.identity !== room.localParticipant.identity;
      let text = "";

      for await (const chunk of reader) {
        text += chunk;
        setMessages((previous) => {
          if (!text.trim()) return previous;

          const message: BandhanChatMessage = {
            id: messageId,
            sender: isAgent ? "agent" : "user",
            text,
            timestamp: Date.now(),
          };
          const index = previous.findIndex((item) => item.id === messageId);
          if (index === -1) return [...previous, message];

          const next = [...previous];
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
