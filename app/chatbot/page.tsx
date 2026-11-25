import AgentDirectory from "@/components/AgentDirectory";
import { ArrowRight } from "lucide-react";

export default function ChatbotLandingPage() {
  return (
    <main className="min-h-screen bg-stone-200 font-sans text-stone-950">
      <section className="px-6 py-10 sm:px-8 sm:py-12 lg:px-16 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 rounded-2xl bg-white p-7 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:p-12">
          <div>
            <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              Chat experiences that move work forward.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">
              Discover focused AI assistants for support, operations, finance,
              travel, and more. Each agent is designed to understand context and
              help users get to the right answer faster.
            </p>
            <a
              href="#chatbot-agents-heading"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Explore chat agents
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>

          <ul className="divide-y divide-stone-300 rounded-xl bg-stone-100 px-5 sm:px-7">
            {[
              "Context-aware support",
              "Voice and text ready",
              "Built for business workflows",
            ].map((benefit) => (
              <li
                key={benefit}
                className="py-5 text-base font-semibold text-stone-900 first:pt-6 last:pb-6"
              >
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <AgentDirectory
        category="chatbot"
        title="Choose a conversational agent"
        description="Open an agent to explore its dedicated chat experience."
        appearance="light"
        className="border-t border-stone-400"
      />
    </main>
  );
}
