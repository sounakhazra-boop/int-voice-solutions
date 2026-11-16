"use client";

/**
 * UseCaseSelector.tsx — search bar + dropdown + "Start Live AI Call" form.
 *
 * Extracted from HeroSection.tsx — the core "/" route functionality.
 * No auth, no header, no footer — just the search/select/call UI.
 *
 * Install: npm install framer-motion lucide-react
 *
 * Env vars:
 *   NEXT_PUBLIC_API_URL = https://your-backend.com
 *
 * Usage:
 *   <UseCaseSelector
 *     initiatedBy="user@company.com"
 *     initiatedByName="John Doe"
 *   />
 */

import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  X,
  Plus,
  Loader2,
  Phone,
  Users,
  Settings,
  Pencil,
} from "lucide-react";
import {
  fetchUseCases,
  fetchPersonalizedPrompts,
  triggerCall,
  updatePersonalizedPrompt,
  updateVoiceConfig,
  type ApiUseCase,
  type PersonalizedPrompt,
  type VoiceConfig,
  type CallPayload,
} from "./api";
import {
  DEFAULT_VOICE_CONFIG as DEFAULT_CONFIG,
  voiceName,
} from "./voiceConfig";
import { ConfigureVoiceModal } from "./ConfigureVoiceModal";
import { EditPromptModal } from "./EditPromptModal";
import { PersonalizedCallModal } from "./PersonalizedCallModal";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface UseCaseSelectorProps {
  /** Email of the logged-in user — sent to the call API */
  initiatedBy: string;
  /** Display name of the logged-in user — sent to the call API */
  initiatedByName: string;
}

// ---------------------------------------------------------------------------
// UseCaseSelector
// ---------------------------------------------------------------------------
export const UseCaseSelector: React.FC<UseCaseSelectorProps> = ({
  initiatedBy,
  initiatedByName,
}) => {
  const [useCases, setUseCases] = useState<ApiUseCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [personalizedPrompts, setPersonalizedPrompts] = useState<
    PersonalizedPrompt[]
  >([]);
  const [loadingPersonalized, setLoadingPersonalized] = useState(false);
  const [activePersonalizedPrompt, setActivePersonalizedPrompt] =
    useState<PersonalizedPrompt | null>(null);

  // Call form
  const [companyName, setCompanyName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+");
  const [callActive, setCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState("");
  const [config, setConfig] = useState<VoiceConfig>(DEFAULT_CONFIG);
  const [showConfig, setShowConfig] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<PersonalizedPrompt | null>(
    null,
  );
  const [savingPrompt, setSavingPrompt] = useState(false);

  // ── debounce search ──
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // ── fetch use cases ──
  const load = useCallback(async (search?: string) => {
    setLoading(true);
    try {
      const list = await fetchUseCases(search);
      setUseCases(list);
      // auto-select first result when searching
      if (search && list.length > 0) {
        const titleMatch = list.find((uc) =>
          uc.usecase.toLowerCase().includes(search.toLowerCase()),
        );
        setSelectedId(titleMatch ? titleMatch.id : list[0].id);
      }
    } catch {
      setUseCases([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(debouncedSearch);
  }, [debouncedSearch, load]);

  const selectedUseCase = useCases.find((uc) => uc.id === selectedId) ?? null;

  const loadPersonalizedPrompts = useCallback(async (usecase: ApiUseCase) => {
    setLoadingPersonalized(true);
    setActivePersonalizedPrompt(null);
    try {
      const embedded = usecase.personalizedPrompts;
      setPersonalizedPrompts(
        embedded?.map((prompt) => ({
          _id: prompt._id,
          companyName: prompt.companyName,
          personalizedSystemPrompt: prompt.personalizedSystemPrompt,
          startMessage: prompt.startMessage,
          createdAt: prompt.createdAt,
        })) ?? (await fetchPersonalizedPrompts(usecase.id)),
      );
    } catch {
      setPersonalizedPrompts([]);
    } finally {
      setLoadingPersonalized(false);
    }
  }, []);

  const handleSelectUseCase = (id: string) => {
    setSelectedId(id || null);
  };

  useEffect(() => {
    if (selectedUseCase) {
      void loadPersonalizedPrompts(selectedUseCase);
    } else {
      setPersonalizedPrompts([]);
      setActivePersonalizedPrompt(null);
    }
  }, [selectedId, selectedUseCase, loadPersonalizedPrompts]);

  const buildCallPayload = (
    recipient: string,
    phone: string,
    company: string,
    personalizedPromptId?: string,
    voiceConfig: VoiceConfig = config,
  ): CallPayload => {
    const payload: CallPayload = {
      usecaseId: selectedUseCase!.id,
      platform: voiceConfig.callService,
      companyName: company,
      candidateName: recipient,
      phoneNumber: phone,
      trunkId: voiceConfig.trunkId,
      personalizedPromptId,
      initiatedBy,
      initiatedByName,
      ttsProvider: voiceConfig.voiceProvider,
      ttsVoice: voiceConfig.voiceId,
    };

    if (voiceConfig.callService === "livekit") {
      payload.assistant_tts_model =
        voiceConfig.payloadProvider || voiceConfig.voiceProvider;
      payload.assistant_tts_config =
        voiceConfig.voiceProvider === "sarvam"
          ? { speaker: voiceConfig.voiceId, target_language_code: "en-IN" }
          : { voice_id: voiceConfig.voiceId };
    } else {
      payload.provider = voiceConfig.voiceProvider;
      payload.voiceId = voiceConfig.voiceId;
    }

    return payload;
  };

  // ── trigger outbound call ──
  const handleStartCall = async () => {
    if (!phoneNumber.startsWith("+") || phoneNumber.length < 8) {
      alert("Phone number must include country code (e.g., +1234567890)");
      return;
    }
    if (!recipientName || !selectedUseCase) {
      alert("Please select a use case and enter recipient name.");
      return;
    }
    setCallActive(true);
    setCallStatus("Dispatching call…");
    try {
      await triggerCall({
        ...buildCallPayload(recipientName, phoneNumber, companyName),
      });
      setCallStatus(
        `✅ Call dispatched! AI is dialing ${recipientName} at ${phoneNumber}.`,
      );
    } catch (err) {
      setCallStatus(
        `❌ Failed: ${err instanceof Error ? err.message : "Call failed"}`,
      );
    } finally {
      setCallActive(false);
    }
  };

  const handlePersonalizedCall = async (
    recipient: string,
    phone: string,
    voiceOverride?: Partial<VoiceConfig>,
  ) => {
    if (!selectedUseCase || !activePersonalizedPrompt) return;
    setCallActive(true);
    setCallStatus("Dispatching personalized call…");
    try {
      await triggerCall({
        ...buildCallPayload(
          recipient,
          phone,
          activePersonalizedPrompt.companyName,
          activePersonalizedPrompt._id,
          { ...config, ...voiceOverride },
        ),
      });
      setCallStatus(`✅ Personalized call dispatched to ${recipient}.`);
      setActivePersonalizedPrompt(null);
    } catch (err) {
      setCallStatus(
        `❌ Failed: ${err instanceof Error ? err.message : "Call failed"}`,
      );
    } finally {
      setCallActive(false);
    }
  };

  const handleSaveConfig = async (nextConfig: VoiceConfig) => {
    setConfig(nextConfig);
    setShowConfig(false);
    if (!selectedUseCase) return;
    try {
      await updateVoiceConfig(selectedUseCase.id, nextConfig);
    } catch (err) {
      setCallStatus(
        `❌ Configuration sync failed: ${err instanceof Error ? err.message : "Update failed"}`,
      );
    }
  };

  const handleSavePrompt = async (text: string) => {
    if (!editingPrompt) return;
    setSavingPrompt(true);
    try {
      await updatePersonalizedPrompt(editingPrompt._id, text);
      setPersonalizedPrompts((current) =>
        current.map((prompt) =>
          prompt._id === editingPrompt._id
            ? { ...prompt, personalizedSystemPrompt: text }
            : prompt,
        ),
      );
      setEditingPrompt(null);
    } catch (err) {
      setCallStatus(
        `❌ Template update failed: ${err instanceof Error ? err.message : "Update failed"}`,
      );
    } finally {
      setSavingPrompt(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* ── Search bar ── */}
      <div style={styles.searchWrap}>
        <Search size={16} color="#94a3b8" style={styles.searchIcon} />
        <input
          placeholder="Search prompts by name, description, or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} style={styles.clearBtn}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Use case dropdown ── */}
      <div style={{ marginBottom: 6 }}>
        <select
          value={selectedId ?? ""}
          onChange={(e) => handleSelectUseCase(e.target.value)}
          disabled={loading}
          style={styles.select}
        >
          <option value="">
            {loading
              ? "Loading use cases…"
              : searchQuery && useCases.length === 0
                ? `No results for "${searchQuery}"`
                : "Select a use case category to get started…"}
          </option>
          {useCases.map((uc) => (
            <option key={uc.id} value={uc.id}>
              {uc.usecase}
            </option>
          ))}
        </select>
      </div>

      {/* ── Helper text + Add new ── */}
      <div style={styles.helperRow}>
        <p style={styles.helperText}>
          Each use case is pre-configured with a conversation flow, system
          prompt, and AI agent.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 32,
        }}
      >
        <button style={styles.addLink}>
          <Plus size={14} /> Add a new use case
        </button>
      </div>

      {/* ── Selected use case detail + call form ── */}
      <AnimatePresence mode="wait">
        {selectedUseCase && (
          <motion.div
            key={selectedUseCase.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {/* Title + description */}
            <div style={{ textAlign: "center" }}>
              <h2 style={styles.ucTitle}>{selectedUseCase.usecase}</h2>
              {selectedUseCase.description && (
                <div style={styles.descBox}>
                  <p style={styles.descText}>{selectedUseCase.description}</p>
                </div>
              )}
            </div>

            {/* ── Saved personalizations ── */}
            {(loadingPersonalized || personalizedPrompts.length > 0) && (
              <div style={styles.personalizedCard}>
                <h3 style={styles.personalizedTitle}>
                  <Users size={13} /> Saved Personalizations
                </h3>
                {loadingPersonalized ? (
                  <div style={styles.loadingRow}>
                    <Loader2
                      size={13}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                    Loading…
                  </div>
                ) : (
                  <div style={styles.personalizedGrid}>
                    {personalizedPrompts.map((prompt) => (
                      <div
                        key={prompt._id}
                        style={{
                          ...styles.personalizedItem,
                          borderColor:
                            activePersonalizedPrompt?._id === prompt._id
                              ? "#2563eb"
                              : "#dbe3ee",
                        }}
                      >
                        <div style={styles.personalizedHeader}>
                          <div style={{ minWidth: 0 }}>
                            <p style={styles.companyName}>
                              {prompt.companyName}
                            </p>
                            <p style={styles.templateLabel}>Template</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActivePersonalizedPrompt(prompt)}
                            style={styles.smallCallBtn}
                          >
                            <Phone size={12} /> Call
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPrompt(prompt)}
                            style={styles.smallEditBtn}
                            title="Edit prompt"
                          >
                            <Pencil size={12} />
                          </button>
                        </div>
                        <p style={styles.promptPreview}>
                          {prompt.personalizedSystemPrompt}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Call form ── */}
            <div style={styles.callCard}>
              <div style={styles.callCardHeader}>
                <div>
                  <h3 style={styles.callCardTitle}>
                    Ready to try a live call?
                  </h3>
                  <span style={styles.activeBadge}>
                    <span style={styles.badgeDot} />
                    ACTIVE:{" "}
                    {config.callService === "vapi"
                      ? "VAPI"
                      : "INTVOICEKIT"} — {config.voiceProvider.toUpperCase()} (
                    {voiceName(config.voiceProvider, config.voiceId)})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfig(true)}
                  style={styles.configButton}
                >
                  <Settings size={15} /> Voice Configuration
                </button>
              </div>

              <div style={styles.callGrid}>
                <div style={styles.fieldWrap}>
                  <label style={styles.fieldLabel}>Company Name</label>
                  <input
                    placeholder="Acme Corp"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.fieldWrap}>
                  <label style={styles.fieldLabel}>Recipient Name</label>
                  <input
                    placeholder="Full Name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div style={styles.fieldWrap}>
                  <label style={styles.fieldLabel}>Phone Number</label>
                  <input
                    placeholder="+1..."
                    value={phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || val === "+") setPhoneNumber("+");
                      else if (val.startsWith("+")) setPhoneNumber(val);
                      else setPhoneNumber("+" + val);
                    }}
                    style={styles.input}
                  />
                </div>
              </div>

              <button
                onClick={handleStartCall}
                disabled={callActive}
                style={{ ...styles.callBtn, opacity: callActive ? 0.7 : 1 }}
              >
                {callActive ? (
                  <>
                    <Loader2
                      size={18}
                      style={{ animation: "spin 1s linear infinite" }}
                    />{" "}
                    Calling…
                  </>
                ) : (
                  <>
                    <Phone size={18} /> Start Live AI Call
                  </>
                )}
              </button>

              {callStatus && <p style={styles.callStatus}>{callStatus}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {activePersonalizedPrompt && selectedUseCase && (
        <PersonalizedCallModal
          prompt={activePersonalizedPrompt}
          usecaseName={selectedUseCase.usecase}
          currentConfig={config}
          calling={callActive}
          onClose={() => setActivePersonalizedPrompt(null)}
          onCall={handlePersonalizedCall}
        />
      )}
      {editingPrompt && (
        <EditPromptModal
          prompt={editingPrompt}
          saving={savingPrompt}
          onClose={() => setEditingPrompt(null)}
          onSave={handleSavePrompt}
        />
      )}
      {showConfig && (
        <ConfigureVoiceModal
          config={config}
          onClose={() => setShowConfig(false)}
          onSave={handleSaveConfig}
        />
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default UseCaseSelector;

// ---------------------------------------------------------------------------
// Inline styles
// ---------------------------------------------------------------------------
const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    maxWidth: 672,
    margin: "0 auto",
    padding: "0 16px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  searchWrap: {
    position: "relative",
    marginBottom: 12,
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    height: 44,
    paddingLeft: 36,
    paddingRight: 36,
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 15,
    backgroundColor: "#fff",
    outline: "none",
    boxSizing: "border-box",
    color: "#0f172a",
  },
  clearBtn: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#94a3b8",
    lineHeight: 0,
    padding: 0,
  },
  select: {
    width: "100%",
    height: 56,
    padding: "0 14px",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 15,
    backgroundColor: "#fff",
    color: "#0f172a",
    outline: "none",
    boxSizing: "border-box",
    cursor: "pointer",
  },
  helperRow: { display: "flex", justifyContent: "flex-end", marginBottom: 8 },
  helperText: { fontSize: 13, color: "#94a3b8", margin: 0 },
  addLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontSize: 13,
    color: "#3b82f6",
    background: "none",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    textUnderlineOffset: 3,
  },
  ucTitle: {
    fontSize: 28,
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: 12,
  },
  descBox: {
    display: "inline-block",
    borderRadius: 12,
    border: "1px solid rgba(59,130,246,0.25)",
    backgroundColor: "rgba(59,130,246,0.05)",
    padding: "10px 20px",
    maxWidth: 560,
  },
  descText: { fontSize: 14, color: "#475569", margin: 0, lineHeight: 1.6 },
  personalizedCard: {
    padding: 20,
    borderRadius: 16,
    border: "1px solid #e2e8f0",
    backgroundColor: "rgba(248,250,252,0.8)",
  },
  personalizedTitle: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    margin: "0 0 12px",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#2563eb",
  },
  loadingRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#64748b",
    fontSize: 13,
  },
  personalizedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 8,
  },
  personalizedItem: {
    minWidth: 0,
    padding: 12,
    border: "1px solid #dbe3ee",
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    transition: "border-color 150ms ease",
  },
  personalizedHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 8,
  },
  companyName: {
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: "#1e293b",
    fontSize: 14,
    fontWeight: 700,
  },
  templateLabel: {
    margin: "2px 0 0",
    color: "#64748b",
    fontSize: 11,
    fontStyle: "italic",
  },
  smallCallBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    flexShrink: 0,
    height: 28,
    padding: "0 10px",
    border: 0,
    borderRadius: 8,
    backgroundColor: "#2563eb",
    color: "#fff",
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
  },
  smallEditBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    border: "1px solid #dbe3ee",
    borderRadius: 8,
    backgroundColor: "#fff",
    color: "#64748b",
    cursor: "pointer",
  },
  promptPreview: {
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    margin: 0,
    padding: 6,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.7)",
    color: "#64748b",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 10,
    lineHeight: 1.4,
  },
  callCard: {
    padding: 24,
    borderRadius: 16,
    border: "1px solid #e2e8f0",
    backgroundColor: "#fff",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },
  callCardHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 20,
  },
  callCardTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 20,
    marginTop: 0,
  },
  activeBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "6px 10px",
    border: "1px solid #bfdbfe",
    borderRadius: 999,
    background: "#eff6ff",
    color: "#2563eb",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: ".06em",
  },
  badgeDot: { width: 8, height: 8, borderRadius: "50%", background: "#22c55e" },
  configButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    flexShrink: 0,
    padding: "11px 14px",
    border: "1px solid #bfdbfe",
    borderRadius: 10,
    background: "#fff",
    color: "#0f172a",
    fontWeight: 700,
    cursor: "pointer",
  },
  callGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
    marginBottom: 20,
  },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 4 },
  fieldLabel: { fontSize: 13, fontWeight: 500, color: "#475569" },
  input: {
    height: 44,
    padding: "0 12px",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    fontSize: 15,
    color: "#0f172a",
    backgroundColor: "#fff",
    outline: "none",
  },
  callBtn: {
    width: "100%",
    height: 52,
    borderRadius: 10,
    border: "none",
    backgroundColor: "#3b82f6",
    color: "#fff",
    fontSize: 17,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  callStatus: {
    marginTop: 12,
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
  },
};
