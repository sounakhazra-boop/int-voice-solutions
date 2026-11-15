import type { VoiceConfig } from "./api";

export const VOICE_DATA: Record<string, { id: string; name: string }[]> = {
  "11labs": [
    { id: "cgSgspJ2msm6clMCkdW9", name: "Jessica" },
    { id: "ZncGbt9ecxkwpmaX6V9z", name: "Alex" },
    { id: "JigslbTSI6z9hOVIWIRA", name: "Olivia" },
    { id: "k8ThSUZ5Vij4z9jQQSvZ", name: "Simran" },
    { id: "iPmVSMDLX3FRQaONHDW2", name: "Kavita" },
    { id: "pGYsZruQzo8cpdFVZyJc", name: "Smriti" },
  ],
  cartesia: [
    { id: "a167e0f3-df7e-4277-976b-be2f952fa275", name: "Tessa" },
    { id: "e8e5fffb-252c-436d-b842-8879b84445b6", name: "Cathy" },
    { id: "f8f5f1b2-f02d-4d8e-a40d-fd850a487b3d", name: "Kiara" },
    { id: "f786b574-daa5-4673-aa0c-cbe3e8534c02", name: "Katie" },
    { id: "3b554273-4299-48b9-9aaf-eefd438e3941", name: "Simi" },
    { id: "7ea5e9c2-b719-4dc3-b870-5ba5f14d31d8", name: "Janvi" },
    { id: "f6141af3-5f94-418c-80ed-a45d450e7e2e", name: "Priya" },
    { id: "95d51f79-c397-46f9-b49a-23763d3eaa2d", name: "Arushi" },
    { id: "28ca2041-5dda-42df-8123-f58ea9c3da00", name: "Palak" },
  ],
  sarvam: [
    { id: "pooja", name: "Pooja" },
    { id: "shruti", name: "Shruti" },
    { id: "simran", name: "Simran" },
    { id: "ishita", name: "Ishita" },
    { id: "shreya", name: "Shreya" },
    { id: "kavya", name: "Kavya" },
    { id: "priya", name: "Priya" },
    { id: "ritu", name: "Ritu" },
    { id: "rupali", name: "Rupali" },
  ],
};

export const PROVIDERS: Record<string, { id: string; label: string }[]> = {
  vapi: [
    { id: "11labs", label: "11 Labs" },
    { id: "cartesia", label: "Cartesia" },
  ],
  livekit: [
    { id: "11labs", label: "11 Labs" },
    { id: "cartesia", label: "Cartesia" },
    { id: "sarvam", label: "Sarvam" },
  ],
};

export const TRUNKS = {
  exotel: { id: "exotel_ff2a62f4", label: "Exotel (India)" },
  twilio: { id: "ST_XVeiYzF3244P", label: "Twilio (US)" },
} as const;

export const DEFAULT_VOICE_CONFIG: VoiceConfig = {
  callService: "livekit",
  voiceProvider: "sarvam",
  payloadProvider: "sarvam",
  voiceId: "simran",
  trunkType: "exotel",
  trunkId: TRUNKS.exotel.id,
};

export function voiceName(provider: string, voiceId: string) {
  return (
    VOICE_DATA[provider]?.find((voice) => voice.id === voiceId)?.name ||
    "Default"
  );
}
