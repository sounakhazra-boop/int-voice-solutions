/**
 * README — extraction folder
 *
 * Drop these 4 files into any React project.
 * They replicate the core "/" route functionality — no auth, no routing needed.
 *
 * Install dependencies once:
 *   npm install livekit-client @livekit/components-react framer-motion lucide-react
 *
 * Set env vars:
 *   NEXT_PUBLIC_API_URL=https://your-backend.com
 *   NEXT_PUBLIC_BACKEND_URL=https://api-livekit-vyom.indusnettechnologies.com
 *   NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit.com
 *
 * ─────────────────────────────────────────────────────────────────
 * Files
 * ─────────────────────────────────────────────────────────────────
 *
 * api.ts
 *   All fetch calls. No React — pure async functions.
 *   fetchUseCases()   → GET /api/prompts/all  (search + list)
 *   triggerCall()     → POST /api/prompts/call (outbound AI call)
 *   fetchAssistants() → GET assistant list (for robot modal)
 *   getWebCallToken() → POST get LiveKit JWT (for robot modal)
 *
 * UseCaseSelector.tsx
 *   The search bar + use-case dropdown + "Start Live AI Call" form.
 *   Usage:
 *     <UseCaseSelector
 *       initiatedBy="user@company.com"
 *       initiatedByName="John Doe"
 *     />
 *
 * AskAgentModal.tsx
 *   The floating robot button (bottom-right corner) + the popup card
 *   that lets you pick an AI agent and start a LiveKit voice call in-browser.
 *   Usage:
 *     <RobotFAB />
 *
 * hook.tsx  (kept for LiveKit voice session in AskAgentModal)
 *   useChatTranscriptions() — transcription stream inside a LiveKitRoom.
 *
 * bandhan-chatbot/
 *   Next.js-compatible Bandhan text chat bot.
 *   It uses a LiveKit text-only room, sends messages on `lk.chat`, and
 *   receives streamed responses on `lk.transcription`.
 *
 *   Install:
 *     npm install livekit-client @livekit/components-react
 *
 *   Next.js `.env.local`:
 *     NEXT_PUBLIC_BANDHAN_ASSISTANT_ID=fa598b51-25a5-406e-8e69-7c7ae17d687f
 *     NEXT_PUBLIC_VOICEKIT_PROXY_URL=https://internal-vyom-api.indusnettechnologies.com
 *     NEXT_PUBLIC_LIVEKIT_URL=wss://livekit-vyom.indusnettechnologies.com
 *
 *   Usage:
 *     'use client';
 *     import { BandhanChatBot } from './extraction/bandhan-chatbot';
 *
 *     export default function Page() {
 *       return <BandhanChatBot />;
 *     }
 *
 * ─────────────────────────────────────────────────────────────────
 * Putting it all together
 * ─────────────────────────────────────────────────────────────────
 *
 * import UseCaseSelector from './extraction/UseCaseSelector';
 * import { RobotFAB }    from './extraction/AskAgentModal';
 *
 * function App() {
 *   return (
 *     <div>
 *       <UseCaseSelector initiatedBy="me@co.com" initiatedByName="Me" />
 *       <RobotFAB />
 *     </div>
 *   );
 * }
 */
