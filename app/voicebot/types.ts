export interface VoiceBotTokenResponse {
  token?: string;
  data?: {
    token?: string;
  };
  [key: string]: unknown;
}

export interface VoiceBotTokenRequest {
  assistantId: string;
  textOnly?: boolean;
}

export interface VoiceBotMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: number;
}
