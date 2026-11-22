export interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

export interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: SpeechRecognitionAlternativeLike;
}

export interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

export interface SpeechRecognitionErrorEventLike {
  error: string;
}

export interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export type ConnectionState =
  "disconnected" | "connecting" | "connected" | "error";

export type TurnPhase = "listening" | "thinking" | "speaking";

export interface UseLiveAvatarOptions {
  baseUrl: string;
  avatarId?: string;
  refAudio?: string;
  refText?: string;
  language?: string;
  pauseDelayMs?: number;
  /** Enable only with headphones, or tune bargeInThreshold higher for speakers */
  enableBargeIn?: boolean;
  bargeInThreshold?: number;
  bargeInHoldMs?: number;
  iceServers?: RTCIceServer[];
  /** Defaults to "all" (STUN + direct). Set to "relay" only when forcing TURN. */
  iceTransportPolicy?: RTCIceTransportPolicy;
}
