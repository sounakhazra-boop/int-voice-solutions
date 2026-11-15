/**
 * api.ts — all fetch calls for the "/" route functionality.
 *
 * Install: npm install  (no extra deps — pure fetch)
 *
 * Env vars:
 *   NEXT_PUBLIC_API_URL     — prompts/calls API
 *   NEXT_PUBLIC_BACKEND_URL — assistant/token API
 *   NEXT_PUBLIC_LIVEKIT_URL — LiveKit WS
 */

export const BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// LiveKit assistant list and token API (for the "Ask Vyom" robot modal)
const ASSISTANT_API =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://api-livekit-vyom.indusnettechnologies.com";

export const LIVEKIT_URL: string =
  process.env.NEXT_PUBLIC_LIVEKIT_URL ||
  "wss://livekit-vyom.indusnettechnologies.com";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface ApiUseCase {
  id: string;
  usecase: string;
  description: string;
  demoConversation: string;
  vapiAssistantId: string;
  livekitAssistantId: string;
  createdAt: string;
  personalizedPrompts?: PersonalizedPrompt[];
}

export interface PersonalizedPrompt {
  _id: string;
  companyName: string;
  personalizedSystemPrompt: string;
  startMessage?: string;
  createdAt?: string;
}

export interface Assistant {
  assistant_id: string;
  assistant_name: string;
  assistant_tts_model: string;
}

// ---------------------------------------------------------------------------
// 1. Fetch all use cases (search supported)
//    GET /api/prompts/all?siteFlag=vyom&search=<query>
// ---------------------------------------------------------------------------
export async function fetchUseCases(search?: string): Promise<ApiUseCase[]> {
  let url = `${BASE_URL}/api/prompts/all?siteFlag=vyom`;
  if (search?.trim()) url += `&search=${encodeURIComponent(search.trim())}`;
  const res = await fetch(url);
  const json = await res.json();
  return Array.isArray(json.data) ? json.data : [];
}

// ---------------------------------------------------------------------------
// 2. Trigger an outbound AI call
//    POST /api/prompts/call
// ---------------------------------------------------------------------------
export interface CallPayload {
  usecaseId: string;
  platform: "livekit" | "vapi";
  companyName: string;
  candidateName: string;
  phoneNumber: string;
  trunkId?: string;
  personalizedPromptId?: string;
  initiatedBy: string;
  initiatedByName: string;
  ttsProvider: string;
  ttsVoice: string;
  assistant_tts_model?: string;
  assistant_tts_config?: Record<string, string>;
  provider?: string;
  voiceId?: string;
}

export async function triggerCall(payload: CallPayload): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/prompts/call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
}

export async function fetchPersonalizedPrompts(
  usecaseId: string,
): Promise<PersonalizedPrompt[]> {
  const res = await fetch(`${BASE_URL}/api/prompts/${usecaseId}/personalized`);
  const json = await res.json();
  return Array.isArray(json.data) ? json.data : [];
}

export async function updatePersonalizedPrompt(
  id: string,
  personalizedSystemPrompt: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/prompts/personalized/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ personalizedSystemPrompt }),
  });
  if (!res.ok) throw new Error(await res.text());
}

export interface VoiceConfig {
  callService: "livekit" | "vapi";
  voiceProvider: string;
  payloadProvider: string;
  voiceId: string;
  trunkType: "exotel" | "twilio";
  trunkId: string;
}

export async function updateVoiceConfig(
  usecaseId: string,
  config: VoiceConfig,
): Promise<void> {
  const payload: Record<string, unknown> = {
    usecaseId,
    platform: config.callService,
  };

  if (config.callService === "livekit") {
    payload.assistant_tts_model =
      config.payloadProvider || config.voiceProvider;
    payload.assistant_tts_config =
      config.voiceProvider === "sarvam"
        ? { speaker: config.voiceId, target_language_code: "en-IN" }
        : { voice_id: config.voiceId };
  } else {
    payload.provider = config.voiceProvider;
    payload.voiceId = config.voiceId;
  }

  const res = await fetch(`${BASE_URL}/api/prompts/tts`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
}

// ---------------------------------------------------------------------------
// 3. Fetch assistants list (for the robot / "Ask Vyom" modal)
//    GET https://api-livekit-vyom.../assistant/list
// ---------------------------------------------------------------------------
export async function fetchAssistants(): Promise<Assistant[]> {
  const res = await fetch(
    `${ASSISTANT_API}/assistant/list?page=1&limit=20&sort_by=assistant_created_at&sort_order=desc`,
    { credentials: "include" },
  );
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `Failed to load agents (${res.status})`);
  }
  return json.data.assistants || [];
}

// ---------------------------------------------------------------------------
// 4. Get LiveKit web-call token (for the robot modal voice call)
//    POST https://api-livekit-vyom.../web_call/get_token
// ---------------------------------------------------------------------------
export async function getWebCallToken(assistantId: string): Promise<string> {
  const res = await fetch(`${ASSISTANT_API}/web_call/get_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ assistant_id: assistantId }),
  });
  const json = await res.json();
  console.log("getWebCallToken response:", json);
  if (!res.ok || !json.data?.token)
    throw new Error(json.message || "Token generation failed");
  return json.data.token;
}
