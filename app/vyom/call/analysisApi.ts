import { CALLS_API_URL } from "./api";
import type {
  CallAnalysis,
  CallAnalysisKeyMoment,
  CallAnalysisTurn,
  CallEmotionScores,
  CallSentiment,
} from "./types";

type JsonRecord = Record<string, unknown>;

const inFlightAnalysisRequests = new Map<string, Promise<CallAnalysis>>();

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asOptionalString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function normalizeSentiment(value: unknown): CallSentiment {
  if (value === "positive" || value === "neutral" || value === "negative") {
    return value;
  }
  return "unknown";
}

function asScore(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.min(100, value))
    : null;
}

function parseEmotionScores(value: unknown): CallEmotionScores {
  const scores = isRecord(value) ? value : {};
  return {
    excitement: asScore(scores.excitement),
    hesitation: asScore(scores.hesitation),
    urgency: asScore(scores.urgency),
    doubt: asScore(scores.doubt),
  };
}

function parseTurn(value: unknown): CallAnalysisTurn {
  if (!isRecord(value) || typeof value.text !== "string") {
    throw new Error("The call analysis contains an invalid transcript turn.");
  }

  const emotions =
    value.emotionScores ?? value.emotion_scores ?? value.emotions;
  return {
    speaker: typeof value.speaker === "string" ? value.speaker : "Unknown",
    text: value.text,
    timestamp: asOptionalString(value.timestamp),
    sentiment: normalizeSentiment(value.sentiment),
    keywords: Array.isArray(value.keywords)
      ? value.keywords.filter(
          (keyword): keyword is string => typeof keyword === "string",
        )
      : [],
    emotions: parseEmotionScores(emotions),
  };
}

function parseKeyMoment(value: unknown): CallAnalysisKeyMoment {
  if (
    !isRecord(value) ||
    typeof value.title !== "string" ||
    typeof value.summary !== "string" ||
    typeof value.category !== "string"
  ) {
    throw new Error("The call analysis contains an invalid key moment.");
  }

  return {
    title: value.title,
    summary: value.summary,
    category: value.category,
    turnIndex:
      typeof value.turnIndex === "number" && Number.isInteger(value.turnIndex)
        ? value.turnIndex
        : 0,
    timestamp: asOptionalString(value.timestamp),
  };
}

function countForSentiment(
  turns: CallAnalysisTurn[],
  sentiment: CallSentiment,
) {
  return turns.filter((turn) => turn.sentiment === sentiment).length;
}

function parseCallAnalysis(payload: unknown): CallAnalysis {
  const result =
    isRecord(payload) && "data" in payload ? payload.data : payload;
  if (!isRecord(result) || !isRecord(result.analysis)) {
    throw new Error("The server returned an invalid call analysis response.");
  }

  const source = result.analysis;
  if (!Array.isArray(source.turns) || typeof source.summary !== "string") {
    throw new Error("The server returned an incomplete call analysis.");
  }

  const turns = source.turns.map(parseTurn);
  const counts = isRecord(source.sentimentCounts) ? source.sentimentCounts : {};
  const count = (key: "positive" | "neutral" | "negative") => {
    const value = counts[key];
    return typeof value === "number" && Number.isFinite(value)
      ? Math.max(0, Math.floor(value))
      : countForSentiment(turns, key);
  };

  return {
    summary: source.summary,
    sentimentCounts: {
      positive: count("positive"),
      neutral: count("neutral"),
      negative: count("negative"),
    },
    turns,
    keyMoments: Array.isArray(source.keyMoments)
      ? source.keyMoments.map(parseKeyMoment)
      : [],
    analyzedAt: asOptionalString(source.analyzedAt),
  };
}

async function getErrorMessage(response: Response): Promise<string> {
  const body = await response.text();
  if (body) {
    try {
      const payload: unknown = JSON.parse(body);
      if (isRecord(payload)) {
        if (typeof payload.message === "string") return payload.message;
        if (typeof payload.error === "string") return payload.error;
        if (
          isRecord(payload.error) &&
          typeof payload.error.message === "string"
        ) {
          return payload.error.message;
        }
      }
    } catch {
      return body;
    }
    return body;
  }
  return `Call analysis failed (HTTP ${response.status}).`;
}

async function fetchSavedAnalysis(
  callId: string,
): Promise<CallAnalysis | null> {
  const response = await fetch(
    `${CALLS_API_URL.replace(/\/$/, "")}/api/prompts/calls/${encodeURIComponent(callId)}/analysis`,
    { cache: "no-store" },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(await getErrorMessage(response));
  return parseCallAnalysis(await response.json());
}

async function createCallAnalysis(callId: string): Promise<CallAnalysis> {
  const response = await fetch(
    `${CALLS_API_URL.replace(/\/$/, "")}/api/prompts/calls/${encodeURIComponent(callId)}/analysis`,
    { method: "POST" },
  );
  if (!response.ok) throw new Error(await getErrorMessage(response));
  return parseCallAnalysis(await response.json());
}

export function getOrAnalyzeCallAnalysis(
  callId: string,
): Promise<CallAnalysis> {
  const activeRequest = inFlightAnalysisRequests.get(callId);
  if (activeRequest) return activeRequest;

  const request = (async () => {
    const savedAnalysis = await fetchSavedAnalysis(callId);
    return savedAnalysis ?? createCallAnalysis(callId);
  })();

  inFlightAnalysisRequests.set(callId, request);
  void request.then(
    () => {
      if (inFlightAnalysisRequests.get(callId) === request) {
        inFlightAnalysisRequests.delete(callId);
      }
    },
    () => {
      if (inFlightAnalysisRequests.get(callId) === request) {
        inFlightAnalysisRequests.delete(callId);
      }
    },
  );
  return request;
}
