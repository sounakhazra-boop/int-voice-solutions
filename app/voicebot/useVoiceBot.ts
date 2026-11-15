"use client";

import { useCallback, useState } from "react";
import { getVoiceBotToken } from "./getVoiceBotToken";

interface UseVoiceBotOptions {
  assistantId: string;
  tokenEndpoint: string;
  textOnly?: boolean;
}

export function useVoiceBot({
  assistantId,
  tokenEndpoint,
  textOnly,
}: UseVoiceBotOptions) {
  const [token, setToken] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);

    try {
      const response = await getVoiceBotToken(tokenEndpoint, {
        assistantId,
        textOnly,
      });
      const nextToken = response.token || response.data?.token;

      if (!nextToken?.trim()) {
        throw new Error("The voice bot server returned an empty token");
      }

      setToken(nextToken);
    } catch (reason) {
      const message =
        reason instanceof Error ? reason.message : "Unable to connect";
      setError(message);
      throw new Error(message);
    } finally {
      setConnecting(false);
    }
  }, [assistantId, textOnly, tokenEndpoint]);

  const disconnect = useCallback(() => {
    setToken("");
    setError(null);
  }, []);

  return {
    token,
    connecting,
    error,
    connected: Boolean(token),
    connect,
    disconnect,
  };
}
