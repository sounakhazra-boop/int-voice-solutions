import { useCallback, useState } from "react";
// import { getWebCallToken } from '@/lib/getWebCallToken';
import { getWebCallToken } from "@/lib/getWebToken";

export interface UseAssistantOptions {
  assistantId: string;
  textOnly?: boolean;
}

export interface UseAssistantResult {
  token: string;
  connecting: boolean;
  error: Error | null;
  connect: () => Promise<string>;
  disconnect: () => void;
  clearError: () => void;
}

function toError(error: unknown): Error {
  return error instanceof Error
    ? error
    : new Error("Failed to connect to assistant");
}

export function useAssistant({
  assistantId,
  textOnly = false,
}: UseAssistantOptions): UseAssistantResult {
  const [token, setToken] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(async () => {
    const normalizedAssistantId = assistantId.trim();
    if (!normalizedAssistantId) {
      const invalidIdError = new Error("An assistant ID is required");
      setError(invalidIdError);
      throw invalidIdError;
    }

    setConnecting(true);
    setError(null);

    try {
      const response = await getWebCallToken({
        assistant_id: normalizedAssistantId,
        text_only: textOnly,
      });
      const nextToken = response.token || response.data?.token;

      if (!nextToken?.trim()) {
        throw new Error("Received empty token from backend");
      }

      setToken(nextToken);
      return nextToken;
    } catch (error) {
      const normalizedError = toError(error);
      setError(normalizedError);
      throw normalizedError;
    } finally {
      setConnecting(false);
    }
  }, [assistantId, textOnly]);

  const disconnect = useCallback(() => {
    setToken("");
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    token,
    connecting,
    error,
    connect,
    disconnect,
    clearError,
  };
}
