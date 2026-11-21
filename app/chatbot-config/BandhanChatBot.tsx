"use client";

import React, { useEffect, useRef, useState } from "react";
import { LiveKitRoom, useLocalParticipant } from "@livekit/components-react";
import { useChatBot } from "./useChatBot";
import { useChatBotMessages } from "./useChatBotMessages";
import type { ChatBotMessage } from "./types";

export interface BandhanChatBotProps {
  assistantId?: string;
  tokenEndpoint?: string;
  livekitUrl?: string;
  title?: string;
}

function ChatPanel({
  title,
  onDisconnect,
}: {
  title: string;
  onDisconnect: () => void;
}) {
  const { localParticipant } = useLocalParticipant();
  const receivedMessages = useChatBotMessages();
  const [input, setInput] = useState("");
  const [typedMessages, setTypedMessages] = useState<ChatBotMessage[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = [...typedMessages, ...receivedMessages].sort(
    (a, b) => a.timestamp - b.timestamp,
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const text = input.trim();
    if (!text || !localParticipant) return;

    setInput("");
    setTypedMessages((current) => [
      ...current,
      {
        id: `local-${Date.now()}`,
        role: "user",
        text,
        timestamp: Date.now(),
      },
    ]);

    try {
      await localParticipant.sendText(text, { topic: "lk.chat" });
    } catch (reason) {
      console.error("Failed to send chat message:", reason);
    }
  };

  return (
    <div style={styles.panel}>
      <header style={styles.header}>
        <div style={styles.headerTitle}>
          <span style={styles.onlineDot} />
          <strong>{title}</strong>
        </div>
        <button type="button" onClick={onDisconnect} style={styles.closeButton}>
          ×
        </button>
      </header>

      <div style={styles.messages}>
        {messages.length === 0 ? (
          <div style={styles.empty}>No messages yet. Type below to start.</div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              style={{
                ...styles.bubble,
                alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                background: message.role === "user" ? "#6366f1" : "#fff",
                color: message.role === "user" ? "#fff" : "#1e293b",
              }}
            >
              {message.text}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} style={styles.inputRow}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type your message…"
          style={styles.input}
        />
        <button
          type="submit"
          style={styles.sendButton}
          aria-label="Send message"
        >
          Send
        </button>
      </form>

      <button type="button" onClick={onDisconnect} style={styles.endButton}>
        End chat
      </button>
    </div>
  );
}

export function BandhanChatBot({
  assistantId,
  tokenEndpoint,
  livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || "",
  title = "Bandhan Assistant",
}: BandhanChatBotProps) {
  const bot = useChatBot({ assistantId, tokenEndpoint });
  const [open, setOpen] = useState(false);

  const start = async () => {
    setOpen(true);
    try {
      await bot.connect();
    } catch {
      setOpen(false);
    }
  };

  const disconnect = () => {
    bot.disconnect();
    setOpen(false);
  };

  return (
    <LiveKitRoom
      token={bot.token}
      serverUrl={livekitUrl}
      connect={Boolean(bot.token)}
      audio={false}
      video={false}
      onError={(reason) => {
        console.error("Bandhan chat connection failed:", reason);
        disconnect();
      }}
      onDisconnected={disconnect}
    >
      {open && bot.connected ? (
        <ChatPanel title={title} onDisconnect={disconnect} />
      ) : (
        <div style={styles.launcher}>
          {bot.error && <div style={styles.error}>{bot.error}</div>}
          <button
            type="button"
            onClick={start}
            disabled={bot.connecting}
            style={styles.launchButton}
          >
            {bot.connecting ? "Connecting…" : "Chat with assistant"}
          </button>
        </div>
      )}
    </LiveKitRoom>
  );
}

const styles: Record<string, React.CSSProperties> = {
  launcher: {
    position: "fixed",
    right: 24,
    bottom: 24,
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
  },
  launchButton: {
    border: 0,
    borderRadius: 999,
    padding: "14px 20px",
    background: "#0066b3",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  panel: {
    position: "fixed",
    right: 24,
    bottom: 24,
    zIndex: 1000,
    width: 360,
    height: 520,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: 18,
    background: "#fff",
    boxShadow: "0 16px 56px rgba(11,17,32,0.22)",
    border: "1px solid #c7d2fe",
    fontFamily: "system-ui, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px",
    background: "linear-gradient(135deg, #0b1120, #1e1b4b)",
    color: "#fff",
  },
  headerTitle: { display: "flex", alignItems: "center", gap: 8, fontSize: 13 },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#10b981",
  },
  closeButton: {
    border: 0,
    background: "transparent",
    color: "#fff",
    fontSize: 24,
    lineHeight: 1,
    cursor: "pointer",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    background: "#f8fafc",
  },
  empty: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
    fontSize: 13,
    textAlign: "center",
  },
  bubble: {
    maxWidth: "80%",
    padding: "10px 13px",
    borderRadius: 12,
    fontSize: 13,
    lineHeight: 1.5,
    boxShadow: "0 1px 3px rgba(15,23,42,.08)",
  },
  inputRow: {
    display: "flex",
    gap: 8,
    padding: "10px 12px",
    borderTop: "1px solid #e2e8f0",
    background: "#fff",
  },
  input: {
    flex: 1,
    minWidth: 0,
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    outline: "none",
    fontSize: 13,
  },
  sendButton: {
    border: 0,
    borderRadius: 10,
    padding: "0 14px",
    background: "#6366f1",
    color: "#fff",
    cursor: "pointer",
  },
  endButton: {
    margin: "0 12px 12px",
    padding: 9,
    border: 0,
    borderRadius: 8,
    background: "#ef4444",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    maxWidth: 280,
    padding: 10,
    borderRadius: 8,
    background: "#fee2e2",
    color: "#991b1b",
    fontSize: 12,
  },
};
