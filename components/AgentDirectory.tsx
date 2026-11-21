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
      className={`w-full bg-navy-950 px-6 py-16 text-white sm:px-8 lg:px-16 lg:py-20 ${className}`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 sm:mb-12 max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Vyom agent directory
          </p>
          <h2
            id={`${category}-agents-heading`}
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            {description ??
              `Choose from ${categoryAgents.length} specialized ${categoryLabels[
                category
              ].toLowerCase()}.`}
          </p>
        </div>

        {categoryAgents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryAgents.map((agent) => (
              <Link
                key={`${agent.agent_type}-${agent.assistant_id}`}
                href={`/${category}/${encodeURIComponent(agent.assistant_id)}`}
                title={agent.hover_tooltip}
                className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300/40 hover:bg-white/[0.08] hover:shadow-xl hover:shadow-indigo-950/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                        {agent.agent_type.replaceAll("_", " ")}
                      </p>
                      <h3 className="mt-2 text-lg font-bold tracking-tight text-white group-hover:text-cyan-200 transition-colors">
                        {agent.assistant_info?.name ?? agent.hover_tooltip}
                      </h3>
                    </div>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-colors group-hover:bg-brand-500/20 group-hover:text-cyan-300">
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 17L17 7M17 7H7M17 7V17"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-300">
                    {agent.assistant_info?.description ?? agent.page_title}
                  </p>
                </div>
                <div className="mt-6 border-t border-white/5 pt-4 text-xs font-medium text-slate-400 transition-colors group-hover:text-cyan-200">
                  {agent.brand_name}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-white/15 px-6 py-10 text-sm text-slate-400">
            No agents are available in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
