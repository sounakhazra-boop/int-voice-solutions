import type { VoiceBotTokenRequest, VoiceBotTokenResponse } from "./types";

export async function getVoiceBotToken(
  endpoint: string,
  request: VoiceBotTokenRequest,
): Promise<VoiceBotTokenResponse> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      assistant_id: request.assistantId,
      ...(request.textOnly === undefined
        ? {}
        : { text_only: request.textOnly }),
    }),
  });

  if (!response.ok) {
    throw new Error(`Voice bot server returned ${response.status}`);
  }

  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text) as VoiceBotTokenResponse;
  } catch {
    return { token: text };
  }
}
