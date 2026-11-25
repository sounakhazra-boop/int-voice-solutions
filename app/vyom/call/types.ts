export type CallViewMode = "all" | "mine";
export type CallStatus =
  "all" | "completed" | "initiated" | "queued" | "failed";
export type CallPlatform = "vapi" | "livekit";

export interface TranscriptEntry {
  speaker: "assistant" | "user";
  text: string;
  timestamp: string;
}

export type CallSentiment = "positive" | "neutral" | "negative" | "unknown";

export interface CallEmotionScores {
  excitement: number | null;
  hesitation: number | null;
  urgency: number | null;
  doubt: number | null;
}

export interface CallAnalysisTurn {
  speaker: string;
  text: string;
  timestamp: string | null;
  sentiment: CallSentiment;
  keywords: string[];
  emotions: CallEmotionScores;
}

export interface CallAnalysisKeyMoment {
  title: string;
  summary: string;
  category: string;
  turnIndex: number;
  timestamp: string | null;
}

export interface CallAnalysis {
  summary: string;
  sentimentCounts: {
    positive: number;
    neutral: number;
    negative: number;
  };
  turns: CallAnalysisTurn[];
  keyMoments: CallAnalysisKeyMoment[];
  analyzedAt: string | null;
}

export interface CallLog {
  _id: string;
  callId: string;
  platform: CallPlatform;
  assistantId: string;
  customerNumber: string;
  status: string;
  userId?: string;
  trunkId?: string;
  createdAt: string;
  updatedAt: string;
  durationSeconds?: number;
  endedAt?: string;
  startedAt?: string;
  recordingUrl?: string;
  summary?: string;
  transcript?: TranscriptEntry[] | string;
  endedReason?: string;
  candidateName?: string;
  companyName?: string;
  usecase?: string;
  initiatedByEmail?: string;
  initiatedByName?: string;
  ttsProvider?: string;
  ttsVoice?: string;
}
