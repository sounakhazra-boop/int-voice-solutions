export type CallViewMode = 'all' | 'mine';
export type CallStatus = 'all' | 'completed' | 'initiated' | 'queued' | 'failed';
export type CallPlatform = 'vapi' | 'livekit';

export interface TranscriptEntry {
  speaker: 'assistant' | 'user';
  text: string;
  timestamp: string;
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
