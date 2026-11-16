"use client";

import React, { useEffect, useState } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
  useLocalParticipant,
  useVoiceAssistant,
} from "@livekit/components-react";
import { useVoiceBot } from "./useVoiceBot";
import { useVoiceBotTranscriptions } from "./useVoiceBotTranscriptions";

export interface VoiceBotProps {
  assistantId: string;
  tokenEndpoint: string;
  livekitUrl: string;
  title?: string;
  textOnly?: boolean;
}

function ConnectedVoiceBot({
  title,
  onDisconnect,
}: {
  title: string;
  onDisconnect: () => void;
}) {
  const { state } = useVoiceAssistant();
  const { localParticipant } = useLocalParticipant();
  const messages = useVoiceBotTranscriptions();
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    localParticipant?.setMicrophoneEnabled(true).catch(console.error);
  }, [localParticipant]);

  const toggleMute = () => {
    const nextMuted = !muted;
    localParticipant?.setMicrophoneEnabled(!nextMuted).catch(console.error);
    setMuted(nextMuted);
  };

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <strong>{title}</strong>
        <button type="button" onClick={onDisconnect} style={styles.iconButton}>
          ×
        </button>
      </div>

      <div style={styles.status}>
        <span style={styles.statusDot} />
        {state === "speaking"
          ? "Speaking…"
          : state === "listening"
            ? "Listening…"
            : "Connected"}
      </div>

      <div style={styles.messages}>
        {messages.length === 0 ? (
          <span style={styles.empty}>Start speaking to begin</span>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              style={{
                ...styles.message,
                alignSelf:
                  message.sender === "user" ? "flex-end" : "flex-start",
                background: message.sender === "user" ? "#2563eb" : "#f1f5f9",
                color: message.sender === "user" ? "#fff" : "#0f172a",
              }}
            >
              {message.text}
            </div>
          ))
        )}
      </div>

      <div style={styles.controls}>
        <button type="button" onClick={toggleMute} style={styles.controlButton}>
          {muted ? "Unmute" : "Mute"}
        </button>
        <button
          type="button"
          onClick={onDisconnect}
          style={styles.disconnectButton}
        >
          End call
        </button>
      </div>

      <RoomAudioRenderer />
      <StartAudio label="Enable audio" />
    </div>
  );
}

export function VoiceBot({
  assistantId,
  tokenEndpoint,
  livekitUrl,
  title = "Voice assistant",
  textOnly,
}: VoiceBotProps) {
  const bot = useVoiceBot({ assistantId, tokenEndpoint, textOnly });
  const [open, setOpen] = useState(false);

  const connect = async () => {
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
      audio
      video={false}
      onError={(reason) => {
        console.error("Voice bot connection failed:", reason);
        disconnect();
      }}
      onDisconnected={disconnect}
    >
      {open && bot.connected ? (
        <ConnectedVoiceBot title={title} onDisconnect={disconnect} />
      ) : (
        // <div style={styles.launcher}>
        //   {open && bot.error && <div style={styles.error}>{bot.error}</div>}
        //   <button type="button" onClick={connect} disabled={bot.connecting} style={styles.launchButton}>
        //     {bot.connecting ? 'Connecting…' : 'Talk to assistant'}
        //   </button>
        // </div>
        <div style={styles.launcher}>
          {open && bot.error && <div style={styles.error}>{bot.error}</div>}
          <button
            type="button"
            onClick={connect}
            disabled={bot.connecting}
            style={{
              ...styles.launchButton,
              padding: bot.connecting ? "10px 20px" : "0", // Remove padding when showing just the image
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            {bot.connecting ? (
              "Connecting…"
            ) : (
              <img
                src="https://images.unsplash.com/photo-1517672651691-24622a91b550?w=150&h=150&fit=crop&crop=faces"
                alt="Pratiksha"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #F7A600", // Matches the theme's orange accent
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
                  transition: "transform 0.2s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
            )}
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
    background: "#2563eb",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  panel: {
    position: "fixed",
    right: 24,
    bottom: 24,
    zIndex: 1000,
    width: 340,
    minHeight: 360,
    display: "flex",
    flexDirection: "column",
    borderRadius: 16,
    overflow: "hidden",
    background: "#fff",
    color: "#0f172a",
    boxShadow: "0 20px 60px rgba(15, 23, 42, .25)",
    fontFamily: "system-ui, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 18px",
    background: "#0f172a",
    color: "#fff",
  },
  iconButton: {
    border: 0,
    background: "transparent",
    color: "#fff",
    fontSize: 24,
    cursor: "pointer",
  },
  status: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 18px",
    color: "#475569",
    fontSize: 13,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#22c55e",
  },
  messages: {
    flex: 1,
    minHeight: 200,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: 16,
    overflowY: "auto",
    background: "#f8fafc",
  },
  empty: {
    margin: "auto",
    color: "#94a3b8",
    fontSize: 13,
  },
  message: {
    maxWidth: "80%",
    padding: "9px 12px",
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 1.4,
  },
  controls: {
    display: "flex",
    gap: 8,
    padding: 16,
  },
  controlButton: {
    flex: 1,
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    padding: 10,
    background: "#fff",
    cursor: "pointer",
  },
  disconnectButton: {
    flex: 1,
    border: 0,
    borderRadius: 8,
    padding: 10,
    background: "#dc2626",
    color: "#fff",
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
