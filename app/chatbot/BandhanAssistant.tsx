"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
  useLocalParticipant,
  useVoiceAssistant,
} from "@livekit/components-react";
import {
  Bot,
  MessageSquare,
  Mic,
  MicOff,
  PhoneOff,
  Send,
  X,
} from "lucide-react";
import { getBandhanWebCallToken } from "./getBandhanWebCallToken";
import { useBandhanChatTranscriptions } from "./useBandhanChatTranscriptions";

const LIVEKIT_URL = "wss://livekit-vyom.indusnettechnologies.com";
const BANDHAN_ASSISTANT_ID = "fa598b51-25a5-406e-8e69-7c7ae17d687f";
const BANDHAN = {
  gold: "#6366f1",
  navy: "#0b1120",
  lightGold: "rgba(99,102,241,0.12)",
};

type AssistantMode = "voice" | "chat";

function MessageBubble({
  role,
  text,
}: {
  role: "user" | "agent";
  text: string;
}) {
  const isUser = role === "user";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 10,
      }}
    >
      <div
        style={{
          maxWidth: "85%",
          padding: "10px 14px",
          borderRadius: 14,
          fontSize: 13.5,
          lineHeight: 1.5,
          wordWrap: "break-word",
          backgroundColor: isUser ? BANDHAN.navy : "#fff",
          color: isUser ? "#fff" : "#334155",
          border: isUser ? "none" : "1px solid #e2e8f0",
          boxShadow: isUser
            ? "0 2px 8px rgba(0,45,94,0.18)"
            : "0 1px 2px rgba(0,0,0,0.05)",
          borderBottomRightRadius: isUser ? 2 : 14,
          borderBottomLeftRadius: isUser ? 14 : 2,
        }}
      >
        {text}
      </div>
    </div>
  );
}

function StandbyCard({
  connecting,
  onClose,
  onConnect,
}: {
  connecting: boolean;
  onClose: () => void;
  onConnect: (mode: AssistantMode) => void;
}) {
  return (
    <div
      style={{
        width: 320,
        backgroundColor: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 12px 48px rgba(0,45,94,0.18)",
        border: `1px solid ${BANDHAN.lightGold}`,
      }}
    >
      <div
        style={{
          background: `linear-gradient(135deg, ${BANDHAN.navy} 0%, #1e1b4b 100%)`,
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Bot size={18} color={BANDHAN.gold} />
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>
            Bandhan Assistant
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Bandhan Assistant"
          style={{
            background: "none",
            border: 0,
            cursor: "pointer",
            lineHeight: 0,
          }}
        >
          <X size={16} color="#94a3b8" />
        </button>
      </div>

      <div style={{ padding: 24, textAlign: "center" }}>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 14,
            background: BANDHAN.lightGold,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <Bot size={28} color={BANDHAN.navy} />
        </div>
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            margin: "0 0 6px",
            color: BANDHAN.navy,
          }}
        >
          How can I help you today?
        </h3>
        <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 22px" }}>
          Choose how you&apos;d like to connect with Bandhan Assistant.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            type="button"
            onClick={() => onConnect("voice")}
            disabled={connecting}
            style={{
              background: `linear-gradient(135deg, ${BANDHAN.navy} 0%, #1e1b4b 100%)`,
              color: "#fff",
              border: 0,
              borderRadius: 10,
              padding: 12,
              fontWeight: 600,
              fontSize: 14,
              cursor: connecting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: connecting ? 0.65 : 1,
            }}
          >
            <Mic size={16} /> Voice Consultation
          </button>
          <button
            type="button"
            onClick={() => onConnect("chat")}
            disabled={connecting}
            style={{
              backgroundColor: "#fff",
              color: BANDHAN.navy,
              border: `1.5px solid ${BANDHAN.gold}`,
              borderRadius: 10,
              padding: 12,
              fontWeight: 600,
              fontSize: 14,
              cursor: connecting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: connecting ? 0.65 : 1,
            }}
          >
            <MessageSquare size={16} /> Chat Only
          </button>
        </div>
      </div>
    </div>
  );
}

function AssistantOverlay({
  isChatOnly,
  onDisconnect,
}: {
  isChatOnly: boolean;
  onDisconnect: () => void;
}) {
  const { state } = useVoiceAssistant();
  const { localParticipant } = useLocalParticipant();
  const liveMessages = useBandhanChatTranscriptions();
  const [isMicMuted, setIsMicMuted] = useState(isChatOnly);
  const [showChat, setShowChat] = useState(isChatOnly);
  const [inputText, setInputText] = useState("");
  const [typedMessages, setTypedMessages] = useState<
    Array<{ role: "user"; text: string; timestamp: number }>
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localParticipant) {
      void localParticipant.setMicrophoneEnabled(!isChatOnly);
    }
  }, [isChatOnly, localParticipant]);

  const messages = useMemo(() => {
    const transcribed = liveMessages.map((message) => ({
      role: message.sender === "user" ? ("user" as const) : ("agent" as const),
      text: message.text,
      timestamp: message.timestamp,
    }));
    return [...typedMessages, ...transcribed].sort(
      (a, b) => a.timestamp - b.timestamp,
    );
  }, [liveMessages, typedMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendText = async (event?: React.FormEvent) => {
    event?.preventDefault();
    if (!inputText.trim() || !localParticipant) return;

    const text = inputText.trim();
    setInputText("");
    setTypedMessages((previous) => [
      ...previous,
      { role: "user", text, timestamp: Date.now() },
    ]);

    try {
      await localParticipant.sendText(text, { topic: "lk.chat" });
    } catch (error) {
      console.error("Bandhan Assistant text send failed:", error);
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 100,
        }}
      >
        <div
          style={{
            width: showChat ? 360 : 400,
            height: showChat ? 520 : 420,
            backgroundColor: "#fff",
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 16px 56px rgba(0,45,94,0.22)",
            border: `1px solid ${BANDHAN.lightGold}`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${BANDHAN.navy} 0%, #1e1b4b 100%)`,
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: "#10b981",
                  borderRadius: "50%",
                }}
              />
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>
                Bandhan Assistant
              </span>
            </div>
            <button
              type="button"
              onClick={onDisconnect}
              aria-label="Close Bandhan Assistant"
              style={{
                background: "none",
                border: 0,
                cursor: "pointer",
                lineHeight: 0,
              }}
            >
              <X size={16} color="#fff" />
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#f8fafc",
            }}
          >
            {messages.length === 0 ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                  fontSize: 13,
                  textAlign: "center",
                  gap: 12,
                }}
              >
                {!showChat && (
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      border: `3px solid ${BANDHAN.gold}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Mic size={24} color={BANDHAN.navy} />
                  </div>
                )}
                <p>
                  {showChat
                    ? "No messages yet. Type below to start."
                    : "Listening for your voice..."}
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <MessageBubble
                  key={`${message.timestamp}-${index}`}
                  role={message.role}
                  text={message.text}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {showChat && (
            <form
              onSubmit={handleSendText}
              style={{
                padding: "10px 12px",
                borderTop: "1px solid #e2e8f0",
                display: "flex",
                gap: 8,
              }}
            >
              <input
                type="text"
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  outline: "none",
                  fontSize: 13,
                  color: "#334155",
                }}
              />
              <button
                type="submit"
                aria-label="Send message"
                style={{
                  background: `linear-gradient(135deg, ${BANDHAN.navy} 0%, #1e1b4b 100%)`,
                  color: "#fff",
                  border: 0,
                  borderRadius: 10,
                  padding: "0 14px",
                  cursor: "pointer",
                }}
              >
                <Send size={16} />
              </button>
            </form>
          )}

          {!showChat && (
            <div
              style={{
                padding: "10px 16px",
                borderTop: "1px solid #e2e8f0",
                backgroundColor: "#fff",
                textAlign: "center",
              }}
            >
              <span
                style={{ fontSize: 11, fontWeight: 700, color: BANDHAN.navy }}
              >
                {state === "speaking"
                  ? "Pratikshya Speaking"
                  : state === "listening"
                    ? "Listening..."
                    : "Connected"}
              </span>
            </div>
          )}

          <div
            style={{
              padding: "10px 12px",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              gap: 8,
              backgroundColor: "#fff",
            }}
          >
            {!isChatOnly && (
              <button
                type="button"
                onClick={() => {
                  if (!localParticipant) return;
                  const nextMuted = !isMicMuted;
                  void localParticipant.setMicrophoneEnabled(!nextMuted);
                  setIsMicMuted(nextMuted);
                }}
                style={{
                  flex: 1,
                  padding: 9,
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  cursor: "pointer",
                  color: "#334155",
                }}
              >
                {isMicMuted ? <MicOff size={14} /> : <Mic size={14} />}
                {isMicMuted ? "Unmute" : "Mute"}
              </button>
            )}

            {!isChatOnly && (
              <button
                type="button"
                onClick={() => setShowChat((previous) => !previous)}
                style={{
                  flex: 1,
                  padding: 9,
                  borderRadius: 8,
                  border: `1px solid ${BANDHAN.gold}`,
                  backgroundColor: BANDHAN.lightGold,
                  color: BANDHAN.navy,
                  fontSize: 12,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  cursor: "pointer",
                }}
              >
                <MessageSquare size={14} />
                {showChat ? "Voice View" : "Chat"}
              </button>
            )}

            <button
              type="button"
              onClick={onDisconnect}
              style={{
                flex: 1,
                padding: 9,
                borderRadius: 8,
                border: 0,
                backgroundColor: "#ef4444",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                cursor: "pointer",
              }}
            >
              <PhoneOff size={14} /> End
            </button>
          </div>
        </div>
      </div>

      {!isChatOnly && <RoomAudioRenderer />}
      <StartAudio label="Click to allow audio playback" />
    </>
  );
}

export interface BandhanAssistantProps {
  className?: string;
}

export function BandhanAssistant({ className }: BandhanAssistantProps) {
  const [token, setToken] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [mode, setMode] = useState<AssistantMode>("voice");

  const handleConnect = useCallback(async (selectedMode: AssistantMode) => {
    setMode(selectedMode);
    setConnecting(true);

    try {
      const response = await getBandhanWebCallToken({
        assistant_id: BANDHAN_ASSISTANT_ID,
        ...(selectedMode === "chat" ? { text_only: true } : {}),
      });
      const nextToken = response.token || response.data?.token;
      if (!nextToken?.trim()) throw new Error("Received empty token");
      setToken(nextToken);
    } catch (error) {
      console.error("Bandhan Assistant connection failed:", error);
    } finally {
      setConnecting(false);
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    setToken("");
    setIsCardOpen(false);
  }, []);

  return (
    <LiveKitRoom
      video={false}
      audio={mode === "voice"}
      token={token}
      connect={Boolean(token)}
      serverUrl={LIVEKIT_URL}
      data-lk-theme="default"
      className={className}
      style={{ height: "100%" }}
      onError={(error) => {
        console.error("Bandhan Assistant LiveKit error:", error);
        setToken("");
      }}
      onDisconnected={handleDisconnect}
    >
      {token ? (
        <AssistantOverlay
          isChatOnly={mode === "chat"}
          onDisconnect={handleDisconnect}
        />
      ) : (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 16,
          }}
        >
          {isCardOpen && (
            <StandbyCard
              connecting={connecting}
              onClose={() => setIsCardOpen(false)}
              onConnect={handleConnect}
            />
          )}
          {!isCardOpen && (
            <button
              type="button"
              onClick={() => setIsCardOpen(true)}
              disabled={connecting}
              aria-label="Open Bandhan Assistant"
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: "4px solid rgba(255,255,255,0.2)",
                background: `linear-gradient(135deg, ${BANDHAN.gold} 0%, #4f46e5 100%)`,
                boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Bot size={32} color="#ffffff" />
            </button>
          )}
        </div>
      )}
    </LiveKitRoom>
  );
}

export default BandhanAssistant;
