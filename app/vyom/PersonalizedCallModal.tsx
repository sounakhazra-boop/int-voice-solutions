"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Building2,
  Mic2,
  Phone,
  X,
} from "lucide-react";
import type { PersonalizedPrompt, VoiceConfig } from "./api";
import { PROVIDERS, VOICE_DATA, voiceName } from "./voiceConfig";

interface PersonalizedCallModalProps {
  prompt: PersonalizedPrompt;
  usecaseName: string;
  currentConfig: VoiceConfig;
  calling?: boolean;
  onClose: () => void;
  onCall: (
    recipientName: string,
    phoneNumber: string,
    voice?: Partial<VoiceConfig>,
  ) => void;
}

export function PersonalizedCallModal({
  prompt,
  usecaseName,
  currentConfig,
  calling = false,
  onClose,
  onCall,
}: PersonalizedCallModalProps) {
  const [recipientName, setRecipientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+");
  const [showVoice, setShowVoice] = useState(false);
  const [provider, setProvider] = useState(currentConfig.voiceProvider);
  const [voiceId, setVoiceId] = useState(currentConfig.voiceId);
  const providers = PROVIDERS[currentConfig.callService] || PROVIDERS.livekit;
  const voiceChanged =
    provider !== currentConfig.voiceProvider ||
    voiceId !== currentConfig.voiceId;

  const changeProvider = (value: string) => {
    setProvider(value);
    setVoiceId(VOICE_DATA[value][0].id);
  };

  const submit = () => {
    if (!recipientName.trim() || phoneNumber.length < 8) return;
    onCall(
      recipientName.trim(),
      phoneNumber,
      voiceChanged ? { voiceProvider: provider, voiceId } : undefined,
    );
  };

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <Phone size={17} color="#2563eb" /> <strong>Quick Call</strong>
          </div>
          <button type="button" onClick={onClose} style={styles.close}>
            <X size={18} />
          </button>
        </div>
        <div style={styles.body}>
          <div style={styles.persona}>
            <Building2 size={18} color="#2563eb" />
            <div>
              <strong>{prompt.companyName}</strong>
              <small>{usecaseName}</small>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowVoice((value) => !value)}
            style={styles.voiceSummary}
          >
            <span style={styles.voiceInfo}>
              <span style={styles.micIcon}>
                <Mic2 size={15} color="#2563eb" />
              </span>
              <span>
                <small>ACTIVE VOICE</small>
                <strong>
                  <i /> INTVoiceKit —{" "}
                  {providers.find((item) => item.id === provider)?.label ||
                    provider}{" "}
                  · {voiceName(provider, voiceId)}
                  {voiceChanged ? " (changed)" : ""}
                </strong>
              </span>
            </span>
            {showVoice ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showVoice && (
            <div style={styles.voicePanel}>
              <label>Provider</label>
              <div style={styles.pills}>
                {providers.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => changeProvider(item.id)}
                    style={
                      provider === item.id ? styles.activePill : styles.pill
                    }
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <label>Voice Name</label>
              <div style={styles.pills}>
                {(VOICE_DATA[provider] || []).map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setVoiceId(item.id)}
                    style={
                      voiceId === item.id ? styles.activePill : styles.pill
                    }
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <label style={styles.label}>RECIPIENT NAME</label>
          <input
            value={recipientName}
            onChange={(event) => setRecipientName(event.target.value)}
            placeholder="Full Name"
            style={styles.input}
            autoFocus
          />
          <label style={styles.label}>PHONE NUMBER</label>
          <input
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
            placeholder="+"
            style={styles.input}
          />
        </div>
        <div style={styles.footer}>
          <button
            type="button"
            onClick={submit}
            disabled={
              calling || !recipientName.trim() || phoneNumber.length < 8
            }
            style={styles.callButton}
          >
            <Phone size={17} /> {calling ? "Initiating…" : "Start Call"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    background: "rgba(0,0,0,.6)",
    backdropFilter: "blur(4px)",
  },
  modal: {
    width: "100%",
    maxWidth: 480,
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: 18,
    background: "#fff",
    boxShadow: "0 20px 70px rgba(0,0,0,.25)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 24px",
    borderBottom: "1px solid #e2e8f0",
  },
  headerTitle: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#0f172a",
    fontSize: 18,
  },
  close: {
    border: 0,
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    overflow: "auto",
    padding: 24,
  },
  persona: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 14,
    border: "1px solid #bfdbfe",
    borderRadius: 12,
    background: "#f8fbff",
    color: "#0f172a",
  },
  personaSmall: {
    display: "block",
    marginTop: 3,
    color: "#64748b",
    fontSize: 12,
  },
  voiceSummary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 13,
    border: "1px solid #dbe3ee",
    borderRadius: 12,
    background: "#f8fafc",
    color: "#334155",
    cursor: "pointer",
    textAlign: "left",
  },
  voiceInfo: { display: "flex", alignItems: "center", gap: 10 },
  micIcon: {
    display: "grid",
    placeItems: "center",
    padding: 8,
    borderRadius: 9,
    background: "#dbeafe",
  },
  voiceSummarySmall: {},
  voicePanel: {
    display: "flex",
    flexDirection: "column",
    gap: 7,
    padding: 12,
    border: "1px solid #bfdbfe",
    borderRadius: 12,
    background: "#eff6ff",
  },
  label: {
    marginTop: 5,
    color: "#64748b",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: ".12em",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    height: 52,
    padding: "0 14px",
    border: "1px solid #dbe3ee",
    borderRadius: 11,
    background: "#f8fafc",
    color: "#334155",
    fontSize: 16,
    outline: "none",
  },
  pills: { display: "flex", flexWrap: "wrap", gap: 4 },
  pill: {
    flex: 1,
    minWidth: 70,
    border: "1px solid #dbe3ee",
    borderRadius: 8,
    padding: "8px 6px",
    background: "#fff",
    color: "#64748b",
    cursor: "pointer",
    fontSize: 11,
  },
  activePill: {
    flex: 1,
    minWidth: 70,
    border: "1px solid #2563eb",
    borderRadius: 8,
    padding: "8px 6px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontSize: 11,
  },
  footer: { padding: 24, borderTop: "1px solid #e2e8f0" },
  callButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 50,
    border: 0,
    borderRadius: 10,
    background: "#2563eb",
    color: "#fff",
    fontSize: 17,
    fontWeight: 700,
    cursor: "pointer",
  },
};
