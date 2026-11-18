import { Suspense } from "react";
import { notFound } from "next/navigation";
import agents from "@/data/agents.json";
import AgentExperience from "@/components/AgentExperience";
import Assistant from "@/app/voicebot/[id]/component/Assistant";

interface ChatbotPageProps {
  params: Promise<{ id: string }>;
}

async function ChatbotContent({ params }: ChatbotPageProps) {
  const { id } = await params;
  const agentEntry = Object.entries(agents).find(
    ([, candidate]) =>
      candidate.assistant_id === id &&
      (candidate.function === "chat" ||
        candidate.function === "chat-and-voice"),
  );

  if (!agentEntry) notFound();

  const [agentKey, agent] = agentEntry;

  return (
    <>
      <AgentExperience agentKey={agentKey} />
      <Assistant
        assistantId={id}
        label={agent.hover_tooltip}
        textOnly={agent.function === "chat"}
      />
    </>
  );
}

export default function ChatbotPage({ params }: ChatbotPageProps) {
  return (
    <Suspense fallback={null}>
      <ChatbotContent params={params} />
    </Suspense>
  );
}
