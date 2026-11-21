export interface OfferRequest {
  sdp: string;
  type: RTCSdpType;
  avatar?: string;
  refaudio?: string;
  reftext?: string;
}

export interface OfferResponse {
  sdp: string;
  type: RTCSdpType;
  sessionid: number | string;
  code?: number;
  msg?: string;
}

export interface HumanMessageRequest {
  text: string;
  type: "chat" | "echo";
  interrupt: boolean;
  sessionid: string;
}

export interface ApiBaseResponse<T = unknown> {
  code?: number;
  msg?: string;
  data?: T;
}

async function postJson<TResponse, TBody>(
  baseUrl: string,
  path: string,
  body: TBody,
  signal?: AbortSignal,
): Promise<TResponse> {
  const url = `${baseUrl.replace(/\/+$/, "")}${path}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Request to ${path} failed with HTTP ${response.status}`);
  }

  return (await response.json()) as TResponse;
}

export const avatarApi = {
  sendOffer(baseUrl: string, payload: OfferRequest, signal?: AbortSignal) {
    return postJson<OfferResponse, OfferRequest>(
      baseUrl,
      "/offer",
      payload,
      signal,
    );
  },

  sendHumanMessage(
    baseUrl: string,
    payload: HumanMessageRequest,
    signal?: AbortSignal,
  ) {
    return postJson<ApiBaseResponse, HumanMessageRequest>(
      baseUrl,
      "/human",
      payload,
      signal,
    );
  },

  interruptTalk(baseUrl: string, sessionId: string, signal?: AbortSignal) {
    return postJson<ApiBaseResponse, { sessionid: string }>(
      baseUrl,
      "/interrupt_talk",
      { sessionid: sessionId },
      signal,
    );
  },

  isSpeaking(baseUrl: string, sessionId: string, signal?: AbortSignal) {
    return postJson<ApiBaseResponse<boolean>, { sessionid: string }>(
      baseUrl,
      "/is_speaking",
      { sessionid: sessionId },
      signal,
    );
  },
};
