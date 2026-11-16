"use client";

import { useCallback, useState } from "react";
import { fetchChatBotToken } from "./api";

export interface UseChatBotOptions {
  assistantId?: string;
  tokenEndpoint?: string;
}

export function useChatBot({
  assistantId = process.env.NEXT_PUBLIC_BANDHAN_ASSISTANT_ID || "",
  tokenEndpoint = process.env.NEXT_PUBLIC_VOICEKIT_PROXY_URL
    ? `${process.env.NEXT_PUBLIC_VOICEKIT_PROXY_URL}/api/voicekit/web-call-token`
    : "/api/voicekit/web-call-token",
}: UseChatBotOptions = {}) {
  const [token, setToken] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    if (!assistantId)
      throw new Error("NEXT_PUBLIC_BANDHAN_ASSISTANT_ID is not configured");

    setConnecting(true);
    setError(null);
    try {
      const nextToken = await fetchChatBotToken(tokenEndpoint, assistantId);
      setToken(nextToken);
    } catch (reason) {
      const message =
        reason instanceof Error ? reason.message : "Unable to connect";
      setError(message);
      throw new Error(message);
    } finally {
      setConnecting(false);
    }
  }, [assistantId, tokenEndpoint]);

  const disconnect = useCallback(() => {
    setToken("");
    setError(null);
  }, []);

  return {
    token,
    connecting,
    connected: Boolean(token),
    error,
    connect,
    disconnect,
  };
}
