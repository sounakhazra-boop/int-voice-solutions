"use client";

import React, { useState } from "react";
import { CreditCard, Cpu, Globe, Mic2, Settings, X } from "lucide-react";
import { PROVIDERS, TRUNKS, VOICE_DATA } from "./voiceConfig";
import type { VoiceConfig } from "./api";

interface ConfigureVoiceModalProps {
  config: VoiceConfig;
  onClose: () => void;
  onSave: (config: VoiceConfig) => void;
}

function Pills({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div style={styles.pills}>
      {options.map((option) => (
        <button
          type="button"
          key={option.id}
          onClick={() => onChange(option.id)}
          style={{
            ...styles.pill,
            ...(value === option.id ? styles.activePill : {}),
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function ConfigureVoiceModal({
  config,
  onClose,
  onSave,
}: ConfigureVoiceModalProps) {
  const [callService, setCallService] = useState(config.callService);
  const [voiceProvider, setVoiceProvider] = useState(config.voiceProvider);
  const [voiceId, setVoiceId] = useState(config.voiceId);
  const [trunkType, setTrunkType] = useState(config.trunkType);

  const changeService = (value: "livekit" | "vapi") => {
    const provider = PROVIDERS[value][0].id;
    setCallService(value);
    setVoiceProvider(provider);
    setVoiceId(VOICE_DATA[provider][0].id);
  };

  const changeProvider = (value: string) => {
    setVoiceProvider(value);
    setVoiceId(VOICE_DATA[value][0].id);
  };

  const save = () => {
    onSave({
      callService,
      voiceProvider,
      payloadProvider:
        callService === "livekit" && voiceProvider === "11labs"
          ? "elevenlabs"
          : voiceProvider,
      voiceId,
      trunkType,
      trunkId: TRUNKS[trunkType].id,
    });
  };

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <div style={styles.heading}>
            <Settings size={19} color="#2563eb" />
            <div>
              <strong>Agent Configuration</strong>
              <small>Adjust voice and connection settings</small>
            </div>
          </div>
          <button type="button" onClick={onClose} style={styles.closeButton}>
            <X size={18} />
          </button>
        </div>

        <div style={styles.body}>
          <section>
            <label style={styles.sectionLabel}>
              <Globe size={13} /> 1. Call Infrastructure
            </label>
            <Pills
              options={[
                { id: "vapi", label: "Vapi (US No.)" },
                { id: "livekit", label: "INT Voice Kit (INDIAN No.)" },
              ]}
              value={callService}
              onChange={(value) => changeService(value as "livekit" | "vapi")}
            />
          </section>

          {callService !== "vapi" && (
            <section>
              <label style={styles.sectionLabel}>
                <Cpu size={13} /> 2. Outbound Gateway (SIP)
              </label>
              <Pills
                options={Object.entries(TRUNKS).map(([id, value]) => ({
                  id,
                  label: value.label,
                }))}
                value={trunkType}
                onChange={(value) =>
                  setTrunkType(value as VoiceConfig["trunkType"])
                }
              />
            </section>
          )}

          <section>
            <label style={styles.sectionLabel}>
              <Mic2 size={13} /> Voice Selection
            </label>
            <div style={styles.twoColumns}>
              <div>
                <small style={styles.subLabel}>Provider</small>
                <Pills
                  options={PROVIDERS[callService]}
                  value={voiceProvider}
                  onChange={changeProvider}
                />
              </div>
              <div>
                <small style={styles.subLabel}>Voice Name</small>
                <Pills
                  options={VOICE_DATA[voiceProvider].map((voice) => ({
                    id: voice.id,
                    label: voice.name,
                  }))}
                  value={voiceId}
                  onChange={setVoiceId}
                />
              </div>
            </div>
          </section>

          <div style={styles.cost}>
            <CreditCard size={13} />{" "}
            {callService === "vapi"
              ? "VAPI: $0.30/min"
              : "INTVOICEKIT: Rs.8/min"}
          </div>
        </div>

        <div style={styles.footer}>
          <button type="button" onClick={save} style={styles.applyButton}>
            Apply Configuration
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
    zIndex: 1050,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    background: "rgba(0,0,0,.6)",
    backdropFilter: "blur(4px)",
  },
  modal: {
    width: "100%",
    maxWidth: 560,
    maxHeight: "90vh",
    overflow: "auto",
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 20px 70px rgba(0,0,0,.25)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 22,
    borderBottom: "1px solid #e2e8f0",
    background: "#eff6ff",
  },
  heading: { display: "flex", alignItems: "center", gap: 12, color: "#0f172a" },
  closeButton: {
    border: 0,
    background: "transparent",
    cursor: "pointer",
    color: "#64748b",
  },
  body: { display: "flex", flexDirection: "column", gap: 24, padding: 22 },
  sectionLabel: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    marginBottom: 10,
    color: "#2563eb",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: ".12em",
    textTransform: "uppercase",
  },
  subLabel: {
    display: "block",
    marginBottom: 6,
    color: "#64748b",
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  pills: {
    display: "flex",
    flexWrap: "wrap",
    gap: 4,
    padding: 4,
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    background: "#f8fafc",
  },
  pill: {
    flex: 1,
    minWidth: 90,
    border: 0,
    borderRadius: 8,
    padding: "9px 8px",
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 600,
  },
  activePill: {
    background: "#2563eb",
    color: "#fff",
    boxShadow: "0 2px 6px rgba(37,99,235,.25)",
  },
  twoColumns: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  cost: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 6,
    color: "#64748b",
    fontSize: 12,
  },
  footer: { padding: 22, borderTop: "1px solid #e2e8f0" },
  applyButton: {
    width: "100%",
    border: 0,
    borderRadius: 10,
    padding: 14,
    background: "#2563eb",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
};
