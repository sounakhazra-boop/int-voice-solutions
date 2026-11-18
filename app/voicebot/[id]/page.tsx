import { Suspense } from "react";
import { notFound } from "next/navigation";
import agents from "@/data/agents.json";
import AgentExperience from "@/components/AgentExperience";
import Assistant from "./component/Assistant";

interface VoicebotPageProps {
  params: Promise<{ id: string }>;
}

async function VoicebotContent({ params }: VoicebotPageProps) {
  const { id } = await params;
  const agentEntry = Object.entries(agents).find(
    ([, candidate]) =>
      candidate.assistant_id === id && candidate.function === "voice",
  );

  if (!agentEntry) notFound();

  const [agentKey, agent] = agentEntry;

  return (
    <>
      <AgentExperience agentKey={agentKey} />
      <Assistant assistantId={id} label={agent.hover_tooltip} />
    </>
  );
}

export default function VoicebotPage({ params }: VoicebotPageProps) {
  return (
    <Suspense fallback={null}>
      <VoicebotContent params={params} />
    </Suspense>
  );
}
