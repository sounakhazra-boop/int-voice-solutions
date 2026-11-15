export interface ChatBotTokenResponse {
  token?: string;
  data?: {
    token?: string;
  };
}

export interface ChatBotMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
}
