"use client";

import { useEffect, useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import type { TextStreamReader } from "livekit-client";
import type { ChatBotMessage } from "./types";

export function useChatBotMessages(): ChatBotMessage[] {
  const room = useRoomContext();
  const [messages, setMessages] = useState<ChatBotMessage[]>([]);

  useEffect(() => {
    const handler = async (
      reader: TextStreamReader,
      participantInfo: { identity: string },
    ) => {
      const id = reader.info.id;
      const role =
        participantInfo.identity === room.localParticipant.identity
          ? "user"
          : "assistant";
      let text = "";

      for await (const chunk of reader) {
        text += chunk;
        if (!text.trim()) continue;

        setMessages((current) => {
          const nextMessage: ChatBotMessage = {
            id,
            role,
            text,
            timestamp: Date.now(),
          };
          const index = current.findIndex((message) => message.id === id);
          if (index === -1) return [...current, nextMessage];
          const next = [...current];
          next[index] = nextMessage;
          return next;
        });
      }
    };

    room.registerTextStreamHandler("lk.transcription", handler);
    return () => room.unregisterTextStreamHandler("lk.transcription");
  }, [room]);

  return messages;
}
