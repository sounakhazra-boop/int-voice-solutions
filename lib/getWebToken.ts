// Server-side proxy for the VoiceKit web-call token. The tenant API key never
// reaches the browser; the proxy injects it upstream.

const PROXY_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");

export interface WebCallTokenRequest {
  assistant_id: string;
  text_only?: boolean;
}

export interface WebCallTokenResponse {
  token?: string;
  data?: { token?: string };
  [key: string]: unknown;
}

export async function getWebCallToken(
  payload: WebCallTokenRequest,
): Promise<WebCallTokenResponse> {
  const res = await fetch(`${PROXY_URL}/api/voicekit/web-call-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    mode: "cors",
  });

  if (!res.ok) {
    throw new Error(`Server returned ${res.status}: ${res.statusText}`);
  }

  const text = await res.text();
  if (!text) return {};

  try {
    return JSON.parse(text) as WebCallTokenResponse;
  } catch {
    // Some upstream variants return the token as a raw string body.
    return { token: text };
  }
}
