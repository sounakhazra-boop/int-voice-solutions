"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Building2,
  Clock,
  FileText,
  Loader2,
  Phone,
  PhoneCall,
  PhoneMissed,
  PhoneOff,
  Play,
  RefreshCw,
  Radio,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { CallAnalysisView } from "./CallAnalysis";
import { useCallLogs } from "./hooks/useCallLogs";
import type { CallLog, CallStatus, CallViewMode } from "./types";

const VOICE_DATA: Record<string, { id: string; name: string }[]> = {
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

function formatDate(iso: string) {
  const date = new Date(iso);
  return {
    date: date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

function formatDuration(seconds?: number) {
  if (!seconds) return "—";
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return minutes > 0 ? `${minutes}m ${remainder}s` : `${remainder}s`;
}

function calculateCost(seconds?: number, platform?: string) {
  if (!seconds || !platform) return "—";
  const minutes = seconds / 60;
  if (platform === "vapi") return `$${(minutes * 0.3).toFixed(2)}`;
  if (platform === "livekit") return `₹${(minutes * 8).toFixed(2)}`;
  return "—";
}

function displayTtsProvider(provider?: string) {
  if (!provider || provider.toLowerCase() === "unknown") return "11labs";
  return provider;
}

function displayTtsVoice(provider?: string, voiceId?: string) {
  if (!voiceId) return "default";
  const voices = VOICE_DATA[provider?.toLowerCase() || ""];
  return voices?.find((voice) => voice.id === voiceId)?.name || voiceId;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    initiated: "border-indigo-200 bg-indigo-50 text-indigo-700",
    queued: "border-amber-200 bg-amber-50 text-amber-700",
    failed: "border-rose-200 bg-rose-50 text-rose-700",
  };
  const dotStyles: Record<string, string> = {
    completed: "bg-emerald-500",
    initiated: "bg-indigo-500",
    queued: "bg-amber-500",
    failed: "bg-rose-500",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status] || "border-zinc-300 bg-zinc-100 text-zinc-600"}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${dotStyles[status] || "bg-zinc-500"}`}
      />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function PlatformBadge({ platform }: { platform: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        platform === "livekit"
          ? "border-violet-200 bg-violet-50 text-violet-700"
          : "border-indigo-200 bg-indigo-50 text-indigo-700"
      }`}
    >
      <Radio className="h-3 w-3" />
      {platform === "livekit" ? "LiveKit" : "Vapi"}
    </span>
  );
}

function ModalShell({
  title,
  log,
  onClose,
  wide = false,
  children,
}: {
  title: string;
  log: CallLog;
  onClose: () => void;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-navy-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-2xl ${
          wide ? "sm:max-w-6xl" : "sm:max-w-2xl"
        }`}
      >
        <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-7">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-50">
              {title === "Call Transcript" ? (
                <FileText className="h-4 w-4 text-indigo-600" />
              ) : (
                <Play className="h-4 w-4 text-indigo-600" />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                {title}
              </p>
              <p className="truncate text-xs text-slate-500">
                {log.candidateName || log.customerNumber}
              </p>
            </div>
            <PlatformBadge platform={log.platform} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-2 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function TranscriptPopup({
  log,
  onClose,
}: {
  log: CallLog;
  onClose: () => void;
}) {
  return (
    <ModalShell title="Call Transcript" log={log} onClose={onClose} wide>
      <CallAnalysisView key={log._id} log={log} />
    </ModalShell>
  );
}

function RecordingPopup({
  log,
  onClose,
}: {
  log: CallLog;
  onClose: () => void;
}) {
  const url = log.recordingUrl || "";
  const extension = url.split("?")[0].split(".").pop()?.toLowerCase();
  const mimeType =
    extension === "ogg"
      ? "audio/ogg"
      : extension === "wav"
        ? "audio/wav"
        : "audio/mpeg";
  const { date, time } = formatDate(log.createdAt);
  return (
    <ModalShell title="Call Recording" log={log} onClose={onClose}>
      <div className="flex flex-wrap items-center gap-6 border-b border-slate-100 px-4 py-3 text-sm text-slate-500 sm:px-8">
        <span className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          {log.customerNumber}
        </span>
        {log.durationSeconds !== undefined && (
          <>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {formatDuration(log.durationSeconds)}
            </span>
            <span className="font-semibold text-slate-900">
              {calculateCost(log.durationSeconds, log.platform)}
            </span>
          </>
        )}
        <span className="text-xs text-slate-500">
          {date} · {time}
        </span>
      </div>
      <div className="px-4 py-6 sm:px-8">
        <audio
          controls
          className="w-full rounded-xl accent-indigo-600"
          preload="metadata"
          key={url}
        >
          <source src={url} type={mimeType} />
        </audio>
      </div>
    </ModalShell>
  );
}

function CallRow({ log }: { log: CallLog }) {
  const [showTranscript, setShowTranscript] = useState(false);
  const [showRecording, setShowRecording] = useState(false);
  const { date, time } = formatDate(log.createdAt);
  const hasTranscript =
    (Array.isArray(log.transcript) && log.transcript.length > 0) ||
    (typeof log.transcript === "string" && log.transcript.trim().length > 0);

  return (
    <>
      <tr className="border-b border-slate-100 transition-colors hover:bg-slate-50/80">
        <td className="px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <User className="h-4 w-4 text-slate-500" />
            </div>
            <div className="min-w-0">
              <p className="max-w-[100px] truncate text-sm font-semibold text-slate-900 sm:max-w-none">
                {log.candidateName || "Unknown"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {log.customerNumber}
              </p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3.5 sm:px-5">
          <p className="text-sm font-medium text-slate-800">
            {log.usecase || "—"}
          </p>
          {log.companyName && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
              <Building2 className="h-3 w-3" />
              {log.companyName}
            </p>
          )}
        </td>
        <td className="px-4 py-3.5 text-sm text-slate-700 sm:px-5">
          {log.initiatedByName || log.initiatedByEmail || "unknown"}
        </td>
        <td className="px-4 py-3.5 sm:px-5">
          <PlatformBadge platform={log.platform} />
        </td>
        <td className="px-4 py-3.5 sm:px-5">
          <p className="text-sm font-medium text-slate-800">
            {displayTtsProvider(log.ttsProvider)}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {displayTtsVoice(log.ttsProvider, log.ttsVoice)}
          </p>
        </td>
        <td className="px-4 py-3.5 sm:px-5">
          <StatusBadge status={log.status} />
        </td>
        <td className="px-4 py-3.5 sm:px-5">
          <p className="flex items-center gap-2 text-sm font-medium text-slate-800">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {formatDuration(log.durationSeconds)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {calculateCost(log.durationSeconds, log.platform)}
          </p>
        </td>
        <td className="px-4 py-3.5 sm:px-5">
          <p className="text-sm font-medium text-slate-800">{date}</p>
          <p className="mt-0.5 text-xs text-slate-500">{time}</p>
        </td>
        <td className="px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => hasTranscript && setShowTranscript(true)}
              disabled={!hasTranscript}
              title={
                hasTranscript ? "View Transcript" : "No transcript available"
              }
              aria-label={
                hasTranscript ? "View transcript" : "No transcript available"
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <FileText className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => log.recordingUrl && setShowRecording(true)}
              disabled={!log.recordingUrl}
              title={
                log.recordingUrl ? "Play Recording" : "No recording available"
              }
              aria-label={
                log.recordingUrl ? "Play recording" : "No recording available"
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Play className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>
      {showTranscript && (
        <TranscriptPopup log={log} onClose={() => setShowTranscript(false)} />
      )}
      {showRecording && (
        <RecordingPopup log={log} onClose={() => setShowRecording(false)} />
      )}
    </>
  );
}

export interface CallLogsProps {
  baseUrl?: string;
  authEmail?: string;
  view?: CallViewMode;
  status?: CallStatus;
  onClose?: () => void;
}

export function CallLogs({
  baseUrl,
  authEmail,
  view = "all",
  status: initialStatus = "all",
  onClose,
}: CallLogsProps) {
  const [status, setStatus] = useState<CallStatus>(initialStatus);
  useEffect(() => setStatus(initialStatus), [initialStatus]);

  const { logs, loading, error, refresh } = useCallLogs({
    baseUrl,
    authEmail,
    viewMode: view,
    status,
  });

  const counts = useMemo(
    () => ({
      all: logs.length,
      completed: logs.filter((log) => log.status === "completed").length,
      initiated: logs.filter((log) => log.status === "initiated").length,
      queued: logs.filter((log) => log.status === "queued").length,
      failed: logs.filter((log) => log.status === "failed").length,
    }),
    [logs],
  );

  const filters: { id: CallStatus; label: string }[] = [
    { id: "all", label: "All" },
    { id: "completed", label: "Completed" },
    { id: "initiated", label: "Initiated" },
    { id: "queued", label: "Queued" },
    { id: "failed", label: "Failed" },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f6f7fb] text-slate-900">
      <header className="flex-shrink-0 border-b border-white/10 bg-navy-900">
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-7 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-cyan-200">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Call logs
                </h1>
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-slate-200">
                  {logs.length} total calls
                </span>
              </div>
              <p className="mt-1 hidden text-sm text-slate-300 sm:block">
                Call activity, outcomes, and recordings
              </p>
            </div>
          </div>
          <nav
            aria-label="VYOM navigation"
            className="flex items-center gap-1 text-xs sm:text-sm"
          >
            <Link
              href="/vyom"
              className="rounded-md px-2.5 py-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
            >
              VYOM
            </Link>
            <Link
              href="/vyom/dashboard"
              className="rounded-md px-2.5 py-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
            >
              Dashboard
            </Link>
            <span
              aria-current="page"
              className="rounded-md border-b-2 border-cyan-200 px-2.5 py-2 font-semibold text-white"
            >
              Call logs
            </span>
          </nav>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
              aria-label="Close call logs"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-4 py-5 sm:px-7 sm:py-7 lg:px-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1">
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setStatus(filter.id)}
                title={`${counts[filter.id]} ${filter.label.toLowerCase()} calls`}
                aria-pressed={status === filter.id}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  status === filter.id
                    ? "bg-navy-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="min-h-[360px] flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.03]">
          {loading && (
            <div className="flex min-h-[360px] flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="text-sm text-slate-500">Fetching call logs…</p>
            </div>
          )}
          {!loading && error && (
            <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 px-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
                <PhoneOff className="h-5 w-5 text-rose-500" />
              </div>
              <p className="text-sm text-rose-700">{error}</p>
              <button
                type="button"
                onClick={() => void refresh()}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Retry
              </button>
            </div>
          )}
          {!loading && !error && logs.length === 0 && (
            <div className="flex min-h-[360px] flex-col items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <PhoneMissed className="h-5 w-5 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500">No call logs found.</p>
            </div>
          )}
          {!loading && !error && logs.length > 0 && (
            <div className="h-full w-full overflow-auto">
              <table className="w-full min-w-[1080px]">
                <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/95">
                  <tr>
                    {[
                      "Recipient",
                      "Agent / Use Case",
                      "Demo Given By",
                      "Platform",
                      "Provider",
                      "Status",
                      "Duration & Cost",
                      "Date & Time",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3.5 text-left text-[11px] font-semibold tracking-wide text-slate-500 sm:px-5"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <CallRow key={log._id} log={log} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {!loading && logs.length > 0 && (
          <div className="flex flex-shrink-0 items-center justify-between px-1 pt-4">
            <p className="text-xs text-slate-500 sm:text-sm">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {logs.length}
              </span>{" "}
              records · sorted newest first
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
