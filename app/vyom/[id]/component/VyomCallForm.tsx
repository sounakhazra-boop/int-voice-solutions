"use client";

import { FormEvent, useState } from "react";
import {
  Phone,
  PhoneCall,
  User,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { triggerCall } from "../../api";

interface VyomCallFormProps {
  agentName: string;
  companyName: string;
  usecaseId: string;
  personalizedPromptId?: string;
  trunkId?: string;
  ttsProvider?: string;
  ttsVoice?: string;
}

export default function VyomCallForm({
  agentName,
  companyName,
  usecaseId,
  personalizedPromptId,
  trunkId,
  ttsProvider = "sarvam",
  ttsVoice = "simran",
}: VyomCallFormProps) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+91 ");
  const [calling, setCalling] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<
    "idle" | "info" | "success" | "error"
  >("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setStatusType("error");
      setStatus("Please enter the recipient name.");
      return;
    }

    const cleanPhone = phoneNumber.replace(/\s+/g, "");
    if (!cleanPhone.startsWith("+") || cleanPhone.length < 8) {
      setStatusType("error");
      setStatus("Please enter a valid phone number with country code.");
      return;
    }

    setCalling(true);
    setStatusType("info");
    setStatus("Dispatching secure voice call…");

    try {
      await triggerCall({
        usecaseId,
        platform: "livekit",
        companyName,
        candidateName: name.trim(),
        phoneNumber: cleanPhone,
        trunkId,
        personalizedPromptId,
        initiatedBy: "demo@int-voice-solutions.com",
        initiatedByName: "Demo User",
        ttsProvider,
        ttsVoice,
        assistant_tts_model: ttsProvider,
        assistant_tts_config:
          ttsProvider === "sarvam"
            ? { speaker: ttsVoice, target_language_code: "en-IN" }
            : { voice_id: ttsVoice },
      });
      setStatusType("success");
      setStatus(`Call dispatched to ${name.trim()}. Keep your phone nearby.`);
    } catch (error) {
      setStatusType("error");
      setStatus(
        error instanceof Error ? error.message : "Unable to dispatch call.",
      );
    } finally {
      setCalling(false);
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-[#060913] px-6 py-16 text-slate-100">
      {/* Ambient Radial Lighting */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-indigo-600/15 blur-[100px]" />

      {/* Glassmorphic Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-800/80 bg-slate-900/70 p-8 shadow-[0_24px_80px_-15px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:p-10">
        {/* Top Subtle Accent Line */}
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

        {/* Header */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/20 to-indigo-600/10 text-blue-400 shadow-inner shadow-blue-500/10">
              <PhoneCall className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950/60 px-3 py-1 text-[11px] font-medium tracking-wide text-slate-400">
              <Sparkles className="h-3 w-3 text-blue-400" />
              Instant Callback
            </span>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            Vyom Voice Concierge
          </p>
          <h1 className="mt-2 bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
            Talk to {agentName}
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
            Enter your coordinates below and{" "}
            <span className="font-medium text-slate-200">{companyName}</span>{" "}
            will initiate an instant AI voice call to your phone.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Recipient Name
            </span>
            <div className="relative">
              <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g., Rahul Sharma"
                className="h-12 w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-blue-500/80 focus:bg-slate-950 focus:ring-4 focus:ring-blue-500/15"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Phone Number (with country code)
            </span>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                required
                type="tel"
                value={phoneNumber}
                onChange={(event) => {
                  const value = event.target.value;
                  setPhoneNumber(
                    value === "" || value === "+"
                      ? "+"
                      : value.startsWith("+")
                        ? value
                        : `+${value}`,
                  );
                }}
                placeholder="+91 9876543210"
                className="h-12 w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-11 pr-4 font-mono text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-blue-500/80 focus:bg-slate-950 focus:ring-4 focus:ring-blue-500/15"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={calling}
            className="group relative mt-2 flex h-12 w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {calling ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Connecting Line…</span>
              </>
            ) : (
              <>
                <Phone className="h-4 w-4 transition-transform group-hover:-rotate-12" />
                <span>Call Me Now</span>
              </>
            )}
          </button>

          {/* Status Feedback Banner */}
          {status && (
            <div
              role="status"
              className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-xs font-medium transition-all ${
                statusType === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : statusType === "error"
                    ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
                    : "border-blue-500/30 bg-blue-500/10 text-blue-300"
              }`}
            >
              {statusType === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              ) : statusType === "error" ? (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              ) : (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-blue-400" />
              )}
              <span>{status}</span>
            </div>
          )}
        </form>

        {/* Subtle Footer */}
        <div className="mt-7 flex items-center justify-center gap-2 border-t border-slate-800/80 pt-5 text-[11px] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
          <span>Encrypted SIP Outbound Line • Powered by Vyom AI</span>
        </div>
      </div>
    </section>
  );
}
