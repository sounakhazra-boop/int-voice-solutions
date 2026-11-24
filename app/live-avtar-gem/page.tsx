// import { LiveAvatarStage } from '@/components/LiveAvatarStage';
import { LiveAvatarStage } from "./component/LiveAvatarStage";

const PRESET_CONFIG = {
  avatarType: "preset" as const,
  avatarData: "Kira",
  voiceName: "Aoede", // Other female Gemini Live voices: 'Kore', 'Leda', 'Zephyr'
  systemInstruction:
    "You are Kira, a warm, professional, and concise AI assistant representing Indus Net Technologies (INT.). Assist visitors with questions about INT. services, digital engineering, AI solutions, and general inquiries in a friendly, conversational tone.",
  welcomeMessage:
    "Hello and welcome to Indus Net Technologies! I am Kira, your AI assistant. How can I help you today?",
};

export default function AvatarPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <LiveAvatarStage config={PRESET_CONFIG} />
    </main>
  );
}
