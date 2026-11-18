import { Suspense } from "react";
import { notFound } from "next/navigation";
import agents from "@/data/agents.json";
import AgentExperience from "@/components/AgentExperience";
import VyomCallForm from "./component/VyomCallForm";

interface VyomAgentPageProps {
  params: Promise<{ id: string }>;
}

interface CallAgent {
  brand_name: string;
  assistant_id: string;
  function: string;
  assistant_info: {
    name: string;
    usecase_id: string;
    personalized_prompt_id?: string;
    trunk_id?: string;
    tts_provider?: string;
  };
}

function getAgent(assistantId: string): CallAgent | undefined {
  return (Object.values(agents) as unknown as CallAgent[]).find(
    (agent) => agent.assistant_id === assistantId && agent.function === "call",
  );
}

function getTtsSettings(value: string | undefined) {
  if (!value) return { provider: "sarvam", voice: "simran" };

  const match = value.match(/^([^(]+?)(?:\s*\(([^)]+)\))?$/);
  return {
    provider: match?.[1]?.trim() || "sarvam",
    voice: match?.[2]?.replace(/\s+voice$/i, "").trim() || "simran",
  };
}

async function VyomAgentContent({ params }: VyomAgentPageProps) {
  const { id } = await params;
  const agentEntry = Object.entries(agents).find(
    ([, candidate]) =>
      candidate.assistant_id === id && candidate.function === "call",
  );
  const agent = getAgent(id);

  if (!agent || !agentEntry) notFound();

  const assistantInfo = agent.assistant_info;
  const { provider, voice } = getTtsSettings(assistantInfo.tts_provider);

  return (
    <>
      {/* <AgentExperience agentKey={agentEntry[0]} /> */}
      <VyomCallForm
        agentName={assistantInfo.name}
        companyName={agent.brand_name}
        usecaseId={assistantInfo.usecase_id}
        personalizedPromptId={assistantInfo.personalized_prompt_id}
        trunkId={assistantInfo.trunk_id}
        ttsProvider={provider}
        ttsVoice={voice}
      />
    </>
  );
}

export default function VyomAgentPage({ params }: VyomAgentPageProps) {
  return (
    <Suspense fallback={null}>
      <VyomAgentContent params={params} />
    </Suspense>
  );
}
