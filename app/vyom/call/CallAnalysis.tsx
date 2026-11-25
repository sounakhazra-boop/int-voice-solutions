"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  Clock3,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getOrAnalyzeCallAnalysis } from "./analysisApi";
import type {
  CallAnalysis,
  CallAnalysisTurn,
  CallLog,
  CallSentiment,
  TranscriptEntry,
} from "./types";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; analysis: CallAnalysis }
  | { status: "error"; message: string };

type DisplayTurn = {
  speaker: string;
  text: string;
  timestamp: string | null;
};

const SENTIMENTS: {
  key: "positive" | "neutral" | "negative";
  label: string;
  color: string;
  textClass: string;
  markClass: string;
}[] = [
  {
    key: "positive",
    label: "Positive",
    color: "#16855b",
    textClass: "bg-emerald-50 text-emerald-800",
    markClass: "bg-emerald-100 text-emerald-950",
  },
  {
    key: "neutral",
    label: "Neutral",
    color: "#b7791f",
    textClass: "bg-amber-50 text-amber-900",
    markClass: "bg-amber-100 text-amber-950",
  },
  {
    key: "negative",
    label: "Negative",
    color: "#c34747",
    textClass: "bg-rose-50 text-rose-800",
    markClass: "bg-rose-100 text-rose-950",
  },
];

const EMOTIONS = [
  { key: "excitement", label: "Excitement", color: "#14805e" },
  { key: "hesitation", label: "Hesitation", color: "#b7791f" },
  { key: "urgency", label: "Urgency", color: "#c34747" },
  { key: "doubt", label: "Doubt", color: "#5265a7" },
] as const;

function getRawTurns(transcript: CallLog["transcript"]): DisplayTurn[] {
  if (Array.isArray(transcript)) {
    return transcript.map((turn: TranscriptEntry) => ({
      speaker: turn.speaker,
      text: turn.text,
      timestamp: turn.timestamp || null,
    }));
  }
  if (typeof transcript !== "string") return [];

  return transcript
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.indexOf(":");
      return separator > 0
        ? {
            speaker: line.slice(0, separator).trim(),
            text: line.slice(separator + 1).trim(),
            timestamp: null,
          }
        : { speaker: "Transcript", text: line, timestamp: null };
    });
}

function isAgent(speaker: string) {
  return /^(assistant|ai|agent|bot)$/i.test(speaker.trim());
}

function displaySpeaker(speaker: string) {
  if (isAgent(speaker)) return "AI assistant";
  if (/^(user|customer|prospect)$/i.test(speaker.trim())) return "Customer";
  return speaker || "Speaker";
}

function isAnalyzedTurn(
  turn: CallAnalysisTurn | DisplayTurn,
): turn is CallAnalysisTurn {
  return "sentiment" in turn && Array.isArray(turn.keywords);
}

function formatTime(timestamp: string | null) {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function sentimentStyle(sentiment: CallSentiment) {
  return (
    SENTIMENTS.find((item) => item.key === sentiment)?.textClass ??
    "bg-slate-100 text-slate-700"
  );
}

function sentimentLabel(sentiment: CallSentiment) {
  return sentiment === "unknown"
    ? "Not labeled"
    : sentiment.charAt(0).toUpperCase() + sentiment.slice(1);
}

function highlightKeywords(
  text: string,
  keywords: string[],
  sentiment: CallSentiment,
) {
  const uniqueKeywords = [...new Set(keywords.filter(Boolean))].sort(
    (first, second) => second.length - first.length,
  );
  if (uniqueKeywords.length === 0) return text;

  const pattern = uniqueKeywords
    .map((keyword) => keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const keywordPattern = new RegExp(`(${pattern})`, "gi");
  const markClass =
    SENTIMENTS.find((item) => item.key === sentiment)?.markClass ??
    "bg-slate-200 text-slate-900";

  return text.split(keywordPattern).map((part, index) =>
    uniqueKeywords.some(
      (keyword) => keyword.toLocaleLowerCase() === part.toLocaleLowerCase(),
    ) ? (
      <mark
        key={`${part}-${index}`}
        className={`rounded px-0.5 font-medium ${markClass}`}
      >
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

function TranscriptLine({
  turn,
  sentiment,
  keywords,
}: {
  turn: DisplayTurn;
  sentiment: CallSentiment;
  keywords: string[];
}) {
  const agent = isAgent(turn.speaker);
  const time = formatTime(turn.timestamp);

  return (
    <article className="flex gap-3 py-4 first:pt-1">
      <div
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
          agent
            ? "bg-indigo-100 text-indigo-800"
            : "bg-slate-200 text-slate-700"
        }`}
        aria-hidden="true"
      >
        {agent ? "AI" : "C"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-xs font-semibold text-slate-800">
            {displaySpeaker(turn.speaker)}
          </span>
          {time && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
              <Clock3 className="h-3 w-3" />
              {time}
            </span>
          )}
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${sentimentStyle(sentiment)}`}
          >
            {sentimentLabel(sentiment)}
          </span>
        </div>
        <p className="whitespace-pre-wrap break-words text-[13px] leading-6 text-slate-700">
          {highlightKeywords(turn.text, keywords, sentiment)}
        </p>
      </div>
    </article>
  );
}

function EmotionTrend({ analysis }: { analysis: CallAnalysis | null }) {
  const chartData = useMemo(
    () =>
      (analysis?.turns ?? []).map((turn, index) => ({
        turn: `${index + 1}`,
        ...turn.emotions,
      })),
    [analysis],
  );
  const hasScores = chartData.some((point) =>
    EMOTIONS.some((emotion) => point[emotion.key] !== null),
  );

  return (
    <section className="border-t border-slate-200 px-4 py-4 sm:px-6">
      <div className="mb-3 flex items-center gap-2">
        <Activity className="h-4 w-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-900">
          Emotion over conversation
        </h3>
      </div>
      {analysis && hasScores ? (
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 6, right: 12, bottom: 0, left: -18 }}
            >
              <CartesianGrid stroke="#e8edf2" vertical={false} />
              <XAxis
                dataKey="turn"
                tick={{ fill: "#64748b", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                minTickGap={24}
                tickFormatter={(value) => `#${value}`}
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 50, 100]}
                tick={{ fill: "#64748b", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  fontSize: 12,
                }}
                labelFormatter={(value) => `Turn ${value}`}
                formatter={(value, name) => [
                  value === null || value === undefined ? "—" : `${value}/100`,
                  String(name),
                ]}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 6 }}
                iconType="plainline"
              />
              {EMOTIONS.map((emotion) => (
                <Line
                  key={emotion.key}
                  type="monotone"
                  dataKey={emotion.key}
                  name={emotion.label}
                  stroke={emotion.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3 }}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="py-6 text-center text-xs text-slate-500">
          {analysis
            ? "Emotion scores are not available for this transcript."
            : "Emotion trends will appear after the analysis is ready."}
        </p>
      )}
    </section>
  );
}

function SentimentDistribution({
  analysis,
}: {
  analysis: CallAnalysis | null;
}) {
  const counts = analysis?.sentimentCounts ?? {
    positive: 0,
    neutral: 0,
    negative: 0,
  };
  const total = counts.positive + counts.neutral + counts.negative;
  const chartData = SENTIMENTS.map((sentiment) => ({
    name: sentiment.label,
    value: counts[sentiment.key],
    color: sentiment.color,
  }));
  const pieData =
    total > 0
      ? chartData.filter((item) => item.value > 0)
      : [{ name: "No data", value: 1, color: "#e2e8f0" }];

  return (
    <section className="border-b border-slate-200 pb-4">
      <h3 className="text-sm font-semibold text-slate-900">
        Sentiment distribution
      </h3>
      <div className="relative mx-auto mt-2 h-36 w-36">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={47}
              outerRadius={64}
              paddingAngle={total > 0 ? 3 : 0}
              stroke="none"
            >
              {pieData.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            {total > 0 && (
              <Tooltip
                formatter={(value, name) => [String(value), String(name)]}
                contentStyle={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  fontSize: 12,
                }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tabular-nums text-slate-900">
            {total}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
            turns
          </span>
        </div>
      </div>
      <div className="mt-1 grid grid-cols-3 gap-2">
        {SENTIMENTS.map((sentiment) => (
          <div className="text-center" key={sentiment.key}>
            <span
              className="mx-auto mb-1 block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: sentiment.color }}
            />
            <p className="text-[10px] text-slate-500">{sentiment.label}</p>
            <p className="text-xs font-semibold tabular-nums text-slate-800">
              {counts[sentiment.key]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function KeyMoments({ analysis }: { analysis: CallAnalysis | null }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-slate-900">Key moments</h3>
      {!analysis ? (
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Key moments will appear after the analysis is ready.
        </p>
      ) : analysis.keyMoments.length === 0 ? (
        <p className="mt-2 text-xs leading-5 text-slate-500">
          No distinct key moments were identified in this call.
        </p>
      ) : (
        <ol className="mt-3 space-y-3">
          {analysis.keyMoments.map((moment, index) => (
            <li
              key={`${moment.title}-${index}`}
              className="border-b border-slate-200 pb-3 last:border-0 last:pb-0"
            >
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                  {moment.category}
                </span>
                {formatTime(moment.timestamp) && (
                  <span className="text-[10px] text-slate-500">
                    {formatTime(moment.timestamp)}
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold leading-5 text-slate-800">
                {moment.title}
              </p>
              <p className="mt-0.5 text-xs leading-5 text-slate-600">
                {moment.summary}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export function CallAnalysisView({ log }: { log: CallLog }) {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const fallbackTurns = useMemo(
    () => getRawTurns(log.transcript),
    [log.transcript],
  );

  useEffect(() => {
    let active = true;
    getOrAnalyzeCallAnalysis(log._id).then(
      (analysis) => {
        if (active) setLoadState({ status: "ready", analysis });
      },
      (error: unknown) => {
        if (active) {
          setLoadState({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : "Call analysis could not be loaded.",
          });
        }
      },
    );
    return () => {
      active = false;
    };
  }, [attempt, log._id]);

  const analysis = loadState.status === "ready" ? loadState.analysis : null;
  const displayTurns: CallAnalysisTurn[] | DisplayTurn[] = analysis?.turns
    .length
    ? analysis.turns
    : fallbackTurns;

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[minmax(0,1.7fr)_minmax(290px,0.8fr)] lg:overflow-hidden">
      <section className="flex min-w-0 flex-col border-b border-slate-200 lg:min-h-0 lg:border-b-0 lg:border-r">
        <div className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Conversation
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {displayTurns.length} transcript{" "}
              {displayTurns.length === 1 ? "turn" : "turns"}
            </p>
          </div>
          {loadState.status === "loading" ? (
            <span
              className="inline-flex items-center gap-1.5 text-xs text-slate-500"
              role="status"
            >
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading analysis
            </span>
          ) : loadState.status === "ready" && analysis?.analyzedAt ? (
            <span className="hidden text-[11px] text-slate-500 sm:block">
              Analyzed {formatTime(analysis.analyzedAt)}
            </span>
          ) : null}
        </div>

        <div className="max-h-[45vh] min-h-40 flex-1 overflow-y-auto px-4 py-4 sm:px-6 lg:max-h-none">
          {displayTurns.length === 0 ? (
            <div className="flex min-h-40 items-center justify-center text-sm text-slate-500">
              No transcript is available for this call.
            </div>
          ) : (
            displayTurns.map((turn, index) => {
              const analyzedTurn = isAnalyzedTurn(turn) ? turn : null;
              return (
                <TranscriptLine
                  key={`${turn.timestamp ?? "turn"}-${index}`}
                  turn={turn}
                  sentiment={analyzedTurn?.sentiment ?? "unknown"}
                  keywords={analyzedTurn?.keywords ?? []}
                />
              );
            })
          )}
        </div>
        <EmotionTrend analysis={analysis} />
      </section>

      <aside className="space-y-5 bg-slate-50/70 px-4 py-5 sm:px-6 lg:min-h-0 lg:overflow-y-auto">
        {loadState.status === "loading" && (
          <div
            className="flex gap-2.5 rounded-lg bg-white px-3 py-3 text-xs leading-5 text-slate-600"
            role="status"
          >
            <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-indigo-600" />
            <p>
              Checking for a saved analysis. A new one will be generated
              automatically if needed.
            </p>
          </div>
        )}
        {loadState.status === "error" && (
          <div
            className="rounded-lg bg-rose-50 px-3 py-3 text-xs text-rose-900"
            role="alert"
          >
            <div className="flex gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold">Analysis unavailable</p>
                <p className="mt-1 break-words leading-5">
                  {loadState.message}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setLoadState({ status: "loading" });
                    setAttempt((value) => value + 1);
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 font-semibold text-rose-900 underline decoration-rose-300 underline-offset-2 hover:decoration-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
                >
                  <RefreshCw className="h-3 w-3" />
                  Retry analysis
                </button>
              </div>
            </div>
          </div>
        )}

        <section className="border-b border-slate-200 pb-4">
          <h3 className="text-sm font-semibold text-slate-900">Call summary</h3>
          <p className="mt-2 text-xs leading-5 text-slate-600">
            {analysis?.summary ||
              log.summary ||
              (loadState.status === "loading"
                ? "The call summary is being prepared."
                : "No summary is available for this call.")}
          </p>
        </section>

        <SentimentDistribution analysis={analysis} />
        <KeyMoments analysis={analysis} />
      </aside>
    </div>
  );
}
