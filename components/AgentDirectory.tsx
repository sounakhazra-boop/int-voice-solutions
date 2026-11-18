import Link from "next/link";
import agents from "@/data/agents.json";

export type AgentCategory = "voicebot" | "chatbot" | "vyom";

interface AgentRecord {
  agent_type: string;
  function: string;
  page_title: string;
  brand_name: string;
  assistant_id: string;
  hover_tooltip: string;
  assistant_info?: {
    name?: string;
    description?: string;
  };
}

interface AgentDirectoryProps {
  category: AgentCategory;
  title?: string;
  description?: string;
  className?: string;
}

const categoryFunctions: Record<AgentCategory, readonly string[]> = {
  voicebot: ["voice"],
  chatbot: ["chat", "chat-and-voice"],
  vyom: ["call"],
};

const categoryLabels: Record<AgentCategory, string> = {
  voicebot: "Voice agents",
  chatbot: "Chat agents",
  vyom: "Call agents",
};

function getAgentsForCategory(category: AgentCategory): AgentRecord[] {
  const supportedFunctions = categoryFunctions[category];

  return Object.values(agents as Record<string, AgentRecord>).filter((agent) =>
    supportedFunctions.includes(agent.function),
  );
}

export default function AgentDirectory({
  category,
  title,
  description,
  className = "",
}: AgentDirectoryProps) {
  const categoryAgents = getAgentsForCategory(category);
  const heading = title ?? categoryLabels[category];

  return (
    <section
      aria-labelledby={`${category}-agents-heading`}
      className={`w-full bg-slate-950 px-6 py-12 text-white md:px-10 ${className}`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Vyom agent directory
          </p>
          <h2
            id={`${category}-agents-heading`}
            className="text-3xl font-semibold tracking-tight md:text-4xl"
          >
            {heading}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {description ??
              `Choose from ${categoryAgents.length} specialized ${categoryLabels[
                category
              ].toLowerCase()}.`}
          </p>
        </div>

        {categoryAgents.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryAgents.map((agent) => (
              <Link
                key={`${agent.agent_type}-${agent.assistant_id}`}
                href={`/${category}/${encodeURIComponent(agent.assistant_id)}`}
                title={agent.hover_tooltip}
                className="group rounded-2xl border border-white/10 bg-white/[0.06] p-5 transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-300">
                      {agent.agent_type.replaceAll("_", " ")}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-white">
                      {agent.assistant_info?.name ?? agent.hover_tooltip}
                    </h3>
                  </div>
                  <span
                    aria-hidden="true"
                    className="text-xl text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-300"
                  >
                    →
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-5 text-slate-300">
                  {agent.assistant_info?.description ?? agent.page_title}
                </p>
                <p className="mt-5 text-xs font-medium text-slate-400 transition group-hover:text-cyan-200">
                  {agent.brand_name}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-white/15 px-5 py-8 text-sm text-slate-400">
            No agents are available in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
