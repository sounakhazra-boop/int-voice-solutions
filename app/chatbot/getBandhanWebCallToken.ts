const PROXY_URL = "https://internal-vyom-api.indusnettechnologies.com";

export interface BandhanWebCallTokenRequest {
  assistant_id: string;
  text_only?: boolean;
}

export interface BandhanWebCallTokenResponse {
  token?: string;
  data?: { token?: string };
  [key: string]: unknown;
}

export async function getBandhanWebCallToken(
  payload: BandhanWebCallTokenRequest,
): Promise<BandhanWebCallTokenResponse> {
  const response = await fetch(`${PROXY_URL}/api/voicekit/web-call-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error(
      `Server returned ${response.status}: ${response.statusText}`,
    );
  }

  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text) as BandhanWebCallTokenResponse;
  } catch {
    return { token: text };
  }
}
