"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import type { PersonalizedPrompt } from "./api";

interface EditPromptModalProps {
  prompt: PersonalizedPrompt;
  saving?: boolean;
  onClose: () => void;
  onSave: (text: string) => void;
}

export function EditPromptModal({
  prompt,
  saving = false,
  onClose,
  onSave,
}: EditPromptModalProps) {
  const [text, setText] = useState(prompt.personalizedSystemPrompt);

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <strong>Edit Personalized Prompt: {prompt.companyName}</strong>
          <button type="button" onClick={onClose} style={styles.iconButton}>
            <X size={18} />
          </button>
        </div>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          style={styles.textarea}
        />
        <div style={styles.actions}>
          <button
            type="button"
            onClick={onClose}
            style={styles.secondaryButton}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => onSave(text)}
            style={styles.primaryButton}
          >
            {saving ? "Saving…" : "Save Changes"}
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
    maxWidth: 680,
    padding: 24,
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 20px 70px rgba(0,0,0,.25)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    color: "#0f172a",
  },
  iconButton: {
    border: 0,
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
    padding: 4,
  },
  textarea: {
    width: "100%",
    height: 400,
    boxSizing: "border-box",
    resize: "vertical",
    padding: 16,
    border: "1px solid #dbe3ee",
    borderRadius: 12,
    background: "#f8fafc",
    color: "#0f172a",
    font: "12px ui-monospace, monospace",
    outline: "none",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 16,
  },
  secondaryButton: {
    border: "1px solid #dbe3ee",
    borderRadius: 8,
    padding: "10px 16px",
    background: "#fff",
    color: "#334155",
    cursor: "pointer",
  },
  primaryButton: {
    border: 0,
    borderRadius: 8,
    padding: "10px 16px",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
};
