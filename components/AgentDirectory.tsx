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
  appearance?: "dark" | "light";
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
  appearance = "dark",
}: AgentDirectoryProps) {
  const categoryAgents = getAgentsForCategory(category);
  const heading = title ?? categoryLabels[category];
  const isLight = appearance === "light";
  const sectionSpacing = isLight
    ? "py-16 sm:py-20 lg:py-24"
    : "py-12 sm:py-16 lg:py-20";

  return (
    <section
      aria-labelledby={`${category}-agents-heading`}
      className={`w-full px-6 sm:px-8 lg:px-16 ${sectionSpacing} ${
        isLight ? "bg-stone-50 text-stone-950" : "bg-navy-950 text-white"
      } ${className}`}
    >
      <div className="mx-auto max-w-7xl">
        <div className={`max-w-2xl ${isLight ? "mb-10 sm:mb-12" : "mb-7"}`}>
          <h2
            id={`${category}-agents-heading`}
            className={`text-2xl tracking-tight sm:text-3xl ${
              isLight ? "font-semibold text-stone-950" : "font-bold"
            }`}
          >
            {heading}
          </h2>
          <p
            className={`mt-2 max-w-xl text-sm leading-6 sm:text-base ${
              isLight ? "text-stone-600" : "text-slate-300"
            }`}
          >
            {description ??
              `Choose from ${categoryAgents.length} specialized ${categoryLabels[
                category
              ].toLowerCase()}.`}
          </p>
        </div>

        {categoryAgents.length > 0 ? (
          <div
            className={`grid sm:grid-cols-2 lg:grid-cols-3 ${
              isLight ? "gap-x-12 gap-y-10" : "gap-3"
            }`}
          >
            {categoryAgents.map((agent) => (
              <Link
                key={`${agent.agent_type}-${agent.assistant_id}`}
                href={`/${category}/${encodeURIComponent(agent.assistant_id)}`}
                title={agent.hover_tooltip}
                className={`group flex flex-col justify-between ${
                  isLight
                    ? "min-h-36 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-4 focus-visible:ring-offset-stone-50"
                    : "min-h-44 rounded-xl border border-white/10 bg-white/[0.035] p-4 transition-colors duration-200 hover:border-cyan-200/40 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p
                        className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${
                          isLight ? "text-stone-500" : "text-cyan-200"
                        }`}
                      >
                        {agent.agent_type.replaceAll("_", " ")}
                      </p>
                      <h3
                        className={`mt-2 text-lg tracking-tight ${
                          isLight
                            ? "font-semibold text-stone-950 underline-offset-4 group-hover:underline"
                            : "font-bold text-white transition-colors group-hover:text-cyan-100"
                        }`}
                      >
                        {agent.assistant_info?.name ?? agent.hover_tooltip}
                      </h3>
                    </div>
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center ${
                        isLight
                          ? "text-stone-500"
                          : "rounded-lg bg-white/5 text-slate-400 transition-colors group-hover:bg-brand-500/20 group-hover:text-cyan-300"
                      }`}
                    >
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
                  <p
                    className={`mt-2 line-clamp-3 ${
                      isLight
                        ? "text-sm leading-6 text-stone-600"
                        : "text-[13px] leading-5 text-slate-300"
                    }`}
                  >
                    {agent.assistant_info?.description ?? agent.page_title}
                  </p>
                </div>
                <div
                  className={`text-xs tracking-wide ${
                    isLight
                      ? "mt-3 font-medium text-stone-500"
                      : "mt-4 border-t border-white/10 pt-3 font-semibold text-slate-300 transition-colors group-hover:text-cyan-100"
                  }`}
                >
                  {agent.brand_name}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p
            className={`text-base ${
              isLight
                ? "text-stone-600"
                : "rounded-2xl border border-dashed border-white/20 px-6 py-12 text-slate-300"
            }`}
          >
            No agents are available in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
