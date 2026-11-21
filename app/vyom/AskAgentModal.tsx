"use client";

/**
 * AskAgentModal.tsx — the floating robot button + agent-select + LiveKit call modal.
 *
 * This is the robot icon (bottom-right) + the popup it opens.
 * Extracted from HeroSection.tsx → AskVyomModal + the FAB button.
 *
 * Install:
 *   npm install livekit-client @livekit/components-react framer-motion lucide-react
 *
 * Env vars:
 *   NEXT_PUBLIC_LIVEKIT_URL = wss://livekit-vyom.indusnettechnologies.com
 *
 * Usage:
 *   <AskAgentModal />
 */

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VoiceAssistantControlBar,
} from "@livekit/components-react";
import { Bot, X, Mic, MicOff } from "lucide-react";
import {
  fetchAssistants,
  getWebCallToken,
  LIVEKIT_URL,
  type Assistant,
} from "./api";

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------
type Step = "select" | "connecting" | "active";

// ---------------------------------------------------------------------------
// AskAgentModal — the full popup card
// ---------------------------------------------------------------------------
interface AskAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAssistantId?: string;
  initialAssistantName?: string;
}

const AskAgentModal: React.FC<AskAgentModalProps> = ({
  isOpen,
  onClose,
  initialAssistantId,
  initialAssistantName,
}) => {
  const [step, setStep] = useState<Step>("select");
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [selectedId, setSelectedId] = useState(initialAssistantId || "");
  const [selectedName, setSelectedName] = useState(initialAssistantName || "");
  const [liveKitToken, setLiveKitToken] = useState("");
  const [error, setError] = useState("");

  // Load assistant list when modal opens
  useEffect(() => {
    if (!isOpen) return;
    if (initialAssistantId) {
      return;
    }

    fetchAssistants()
      .then((list) => {
        setAssistants(list);
        const initialAssistant = list.find(
          (assistant) => assistant.assistant_id === initialAssistantId,
        );

        if (initialAssistant) {
          setSelectedId(initialAssistant.assistant_id);
          setSelectedName(initialAssistant.assistant_name);
        }
      })
      .catch((error: unknown) => {
        setError(
          error instanceof Error ? error.message : "Failed to load agents",
        );
      })
      .finally(() => setLoadingAgents(false));
  }, [initialAssistantId, initialAssistantName, isOpen]);

  const handleStartCall = async () => {
    if (!selectedId) return;
    setStep("connecting");
    setError("");
    try {
      const token = await getWebCallToken(selectedId);
      setLiveKitToken(token);
      setStep("active");
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Token generation failed",
      );
      setStep("select");
    }
  };

  const handleDisconnect = () => {
    setLiveKitToken("");
    setStep("select");
    setSelectedId(initialAssistantId || "");
    setSelectedName(initialAssistantName || "");
  };

  const handleClose = () => {
    handleDisconnect();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="agent-modal"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ type: "spring", damping: 26, stiffness: 320 }}
        style={styles.card}
      >
        {/* Header */}
        <div style={styles.cardHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={styles.iconBox}>
              <Bot size={16} color="#6366f1" />
            </div>
            <div>
              <p style={styles.cardTitle}>Ask AI Agent</p>
              {step === "active" && (
                <p style={styles.liveText}>
                  <span style={styles.liveDot} /> Live · {selectedName}
                </p>
              )}
              {step === "select" && (
                <p style={styles.subText}>Select an agent to start</p>
              )}
              {step === "connecting" && (
                <p style={{ ...styles.subText, color: "#6366f1" }}>
                  Connecting…
                </p>
              )}
            </div>
          </div>
          <button onClick={handleClose} style={styles.closeBtn}>
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 16 }}>
          {error && <p style={styles.errorText}>{error}</p>}

          <AnimatePresence mode="wait">
            {/* ── SELECT STEP ── */}
            {step === "select" && (
              <motion.div
                key="select"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
              >
                <p style={styles.label}>Choose AI Agent</p>

                <select
                  value={selectedId}
                  onChange={(e) => {
                    setSelectedId(e.target.value);
                    setSelectedName(
                      assistants.find((a) => a.assistant_id === e.target.value)
                        ?.assistant_name || "",
                    );
                  }}
                  disabled={loadingAgents || Boolean(initialAssistantId)}
                  style={styles.select}
                >
                  <option value={initialAssistantId || ""}>
                    {initialAssistantId
                      ? selectedName
                      : loadingAgents
                        ? "Loading agents…"
                        : "Select an agent…"}
                  </option>
                  {!initialAssistantId &&
                    assistants.map((a) => (
                      <option key={a.assistant_id} value={a.assistant_id}>
                        {a.assistant_name} [{a.assistant_tts_model}]
                      </option>
                    ))}
                </select>

                {/* Selected agent preview */}
                {selectedId && (
                  <div style={styles.selectedPreview}>
                    <div style={styles.agentAvatar}>
                      <Bot size={16} color="#6366f1" />
                    </div>
                    <div>
                      <p style={styles.agentName}>{selectedName}</p>
                      <p style={styles.subText}>Ready to connect</p>
                    </div>
                    <div style={styles.greenDot} />
                  </div>
                )}

                <button
                  onClick={handleStartCall}
                  disabled={!selectedId || loadingAgents}
                  style={{
                    ...styles.primaryBtn,
                    opacity: !selectedId || loadingAgents ? 0.5 : 1,
                    cursor:
                      !selectedId || loadingAgents ? "not-allowed" : "pointer",
                  }}
                >
                  <Mic size={16} /> Start Voice Call
                </button>
              </motion.div>
            )}

            {/* ── CONNECTING STEP ── */}
            {step === "connecting" && (
              <motion.div
                key="connecting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={styles.centeredCol}
              >
                <div style={styles.spinnerWrap}>
                  <div style={styles.spinnerOuter} />
                  <Bot
                    size={20}
                    color="#6366f1"
                    style={{ position: "absolute" }}
                  />
                </div>
                <p style={styles.cardTitle}>Connecting to {selectedName}…</p>
                <p style={styles.subText}>Setting up your voice session</p>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </motion.div>
            )}

            {/* ── ACTIVE STEP ── */}
            {step === "active" && liveKitToken && (
              <motion.div
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {/* Agent visual */}
                <div style={styles.centeredCol}>
                  <div style={styles.agentActiveIcon}>
                    <div style={styles.agentPulse} />
                    <Bot
                      size={32}
                      color="#6366f1"
                      style={{ position: "relative", zIndex: 1 }}
                    />
                  </div>
                  <p style={styles.cardTitle}>{selectedName}</p>
                  <p style={styles.liveText}>
                    <span style={styles.liveDot} /> Call Active
                  </p>
                </div>

                {/* LiveKit room */}
                <div style={styles.liveKitBox}>
                  <LiveKitRoom
                    video={false}
                    audio={true}
                    token={liveKitToken}
                    serverUrl={LIVEKIT_URL}
                    connect={true}
                    onDisconnected={handleDisconnect}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <RoomAudioRenderer />
                    <div style={{ width: "100%", maxWidth: 220 }}>
                      <VoiceAssistantControlBar />
                    </div>
                  </LiveKitRoom>
                </div>

                {/* End call */}
                <button onClick={handleDisconnect} style={styles.endBtn}>
                  <MicOff size={16} /> End Call
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ---------------------------------------------------------------------------
// RobotFAB — the floating bot button (bottom-right)
// ---------------------------------------------------------------------------
interface RobotFABProps {
  assistantId?: string;
  assistantName?: string;
}

export const RobotFAB: React.FC<RobotFABProps> = ({
  assistantId,
  assistantName,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Modal */}
      <AskAgentModal
        isOpen={open}
        onClose={() => setOpen(false)}
        initialAssistantId={assistantId}
        initialAssistantName={assistantName}
      />

      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          title="Ask AI Agent"
          style={styles.fab}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.transform =
              "scale(1.1)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.transform =
              "scale(1)")
          }
        >
          <Bot size={28} color="#1e3a5f" />
          <div style={styles.fabPing} />
        </button>
      )}
    </>
  );
};

export default RobotFAB;

// ---------------------------------------------------------------------------
// Inline styles
// ---------------------------------------------------------------------------
const styles: Record<string, React.CSSProperties> = {
  card: {
    position: "fixed",
    bottom: 96,
    right: 32,
    zIndex: 60,
    width: 360,
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    overflow: "hidden",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#fff",
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0 },
  liveText: {
    fontSize: 10,
    color: "#22c55e",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 4,
    margin: 0,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    backgroundColor: "#22c55e",
    display: "inline-block",
    animation: "pulse 1.5s infinite",
  },
  subText: { fontSize: 10, color: "#94a3b8", margin: 0 },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#94a3b8",
    padding: 4,
    lineHeight: 0,
  },
  errorText: { fontSize: 12, color: "#ef4444", marginBottom: 8 },
  label: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#94a3b8",
    marginBottom: 6,
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    fontSize: 14,
    color: "#0f172a",
    backgroundColor: "#f8fafc",
    marginBottom: 12,
    outline: "none",
  },
  selectedPreview: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    marginBottom: 12,
  },
  agentAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    backgroundColor: "#dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  agentName: { fontSize: 14, fontWeight: 600, color: "#0f172a", margin: 0 },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "#22c55e",
    marginLeft: "auto",
    flexShrink: 0,
  },
  primaryBtn: {
    width: "100%",
    padding: "10px 0",
    borderRadius: 8,
    backgroundColor: "#6366f1",
    color: "#fff",
    border: "none",
    fontSize: 14,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  centeredCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    padding: "24px 0",
  },
  spinnerWrap: {
    position: "relative",
    width: 56,
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerOuter: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: "4px solid #c7d2fe",
    borderTopColor: "#6366f1",
    animation: "spin 1s linear infinite",
  },
  agentActiveIcon: {
    position: "relative",
    width: 64,
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  agentPulse: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    backgroundColor: "#eff6ff",
    animation: "pulse 2s infinite",
  },
  liveKitBox: {
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: 12,
  },
  endBtn: {
    width: "100%",
    padding: "10px 0",
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#ef4444",
    border: "1px solid #fecaca",
    fontSize: 14,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
  },
  fab: {
    position: "fixed",
    bottom: 24,
    right: 32,
    zIndex: 60,
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #fbaf17 0%, #e59e15 100%)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 20px rgba(251,175,23,0.5)",
    transition: "transform 0.2s",
  },
  fabPing: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    backgroundColor: "#fbaf17",
    opacity: 0.4,
    animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
  },
};
