import type { ChatBotTokenResponse } from "./types";

export async function fetchChatBotToken(
  tokenEndpoint: string,
  assistantId: string,
): Promise<string> {
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      assistant_id: assistantId,
      text_only: true,
    }),
  });

  const json = (await response.json().catch(() => null)) as
    ChatBotTokenResponse | { message?: string } | null;
  const token =
    json && "token" in json
      ? json.token
      : json && "data" in json
        ? json.data?.token
        : undefined;

  if (!response.ok || !token?.trim()) {
    const message = json && "message" in json ? json.message : undefined;
    throw new Error(
      message || `Chat bot token request failed (${response.status})`,
    );
  }

  return token;
}
