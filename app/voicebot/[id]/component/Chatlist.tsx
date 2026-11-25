import React, { useEffect, useRef, useState } from "react";
// import { FlashcardBlock } from './Flashcard';
// import { FlashcardBlock } from './Flashcard';
// import { Flashcard } from '@/app/agui/components/flashcard/Flashcard';
import { FlashcardBlock } from "./Flashcard";

// 1. UPDATE THE INTERFACE HERE
export interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  // New fields for handling Flashcards
  type: "text" | "flashcard";
  text?: string; // Text is now optional (flashcards might not have text)
  cardData?: {
    // Data for the flashcard
    title: string;
    value: string;
  };
  isInterim?: boolean;
  timestamp?: number;
}

interface ChatListProps {
  messages: ChatMessage[];
  appearance?: "default" | "minimal";
}

// --------------------------------------------------------------------------
// Helper: Typewriter Component
// --------------------------------------------------------------------------
const TypewriterText: React.FC<{ text: string; speed?: number }> = ({
  text,
  speed = 10,
}) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayedText}</span>;
};

// --------------------------------------------------------------------------
// Main ChatList Component
// --------------------------------------------------------------------------
export const ChatList: React.FC<ChatListProps> = ({
  messages,
  appearance = "default",
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const isMinimal = appearance === "minimal";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="flex-1 w-full overflow-y-auto px-4 custom-scrollbar font-sans"
      style={{
        // Remove the fade masks so the scroll behavior is consistent with the design.
        maskImage: "none",
        WebkitMaskImage: "none",
      }}
    >
      <div
        className={`mx-auto flex w-full max-w-[95%] flex-col ${
          isMinimal ? "gap-5 py-6" : "gap-6 pt-20 pb-32"
        }`}
      >
        {messages.length === 0 && (
          <div
            className={`flex min-h-[50vh] flex-col items-center justify-center space-y-4 ${
              isMinimal ? "text-stone-500" : "opacity-30"
            }`}
          >
            <div className="w-12 h-1 bg-zinc-300 rounded-full" />
            <p
              className={`text-sm font-medium ${
                isMinimal
                  ? ""
                  : "font-mono uppercase tracking-widest text-zinc-500"
              }`}
            >
              System Ready
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          const isInterim = msg.isInterim;

          // --- FLASHCARD RENDER ---
          // Now TypeScript knows 'type' and 'cardData' exist because we updated the interface above
          if (msg.type === "flashcard" && msg.cardData) {
            return (
              <div
                key={msg.id}
                className="flex w-full justify-start pl-4 animate-in fade-in slide-in-from-bottom-2"
              >
                {/* Render the Flashcard Component Inline */}
                <FlashcardBlock data={msg.cardData} />
              </div>
            );
          }

          // --- TEXT RENDER (Standard) ---
          // We only render this block if there is actual text to show
          if (!msg.text) return null;

          return (
            <div
              key={msg.id}
              className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  relative max-w-[78%] px-5 py-4 text-base leading-relaxed transition-all duration-300
                  ${isInterim ? "opacity-80 scale-[0.99]" : "opacity-100 scale-100 animate-fade-in-up"}
                  ${
                    isMinimal
                      ? isUser
                        ? "max-w-[70%] rounded-2xl rounded-tr-sm bg-stone-900 text-white"
                        : "rounded-2xl rounded-tl-sm bg-white text-stone-900"
                      : `rounded-3xl shadow-[0_12px_35px_rgba(0,0,0,0.22)] border ${
                          isUser
                            ? "max-w-[70%] rounded-tr-[28px] border-transparent bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                            : "rounded-tl-[28px] border-white/10 bg-white text-slate-900"
                        }`
                  }
                `}
                style={{ wordBreak: "break-word" }}
              >
                {!isUser && (
                  <div
                    className={`mb-2 flex items-center gap-2 text-[10px] font-semibold tracking-wide ${
                      isMinimal
                        ? "text-stone-500"
                        : "tracking-widest text-brand-600"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isMinimal ? "bg-stone-400" : "bg-brand-500"
                      }`}
                    />
                    INT. AI
                  </div>
                )}

                <div className={isUser ? "font-semibold" : "font-normal"}>
                  {!isUser && !isInterim && msg.text ? (
                    <TypewriterText text={msg.text} speed={15} />
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};
