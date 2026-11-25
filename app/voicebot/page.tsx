import AgentDirectory from "@/components/AgentDirectory";
import { ArrowRight } from "lucide-react";

export default function VoicebotLandingPage() {
  return (
    <main className="min-h-screen bg-stone-50 font-sans text-stone-950">
      <section className="px-6 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
          <div>
            <h1 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              Voice agents built for real conversations.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">
              Explore specialized voice assistants that help customers, teams,
              and businesses complete tasks through natural, intelligent voice
              interactions.
            </p>
            <a
              href="#voicebot-agents-heading"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-700 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50"
            >
              Explore voice agents
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>

          <dl className="space-y-7 lg:pl-8">
            {[
              ["Natural conversations", "Low-friction voice experiences"],
              ["Business-ready", "Designed around real workflows"],
              ["Always available", "Instant support across use cases"],
            ].map(([label, detail]) => (
              <div
                key={label}
                className="grid gap-1.5 sm:grid-cols-[11rem_1fr] sm:gap-6"
              >
                <dt className="text-sm font-semibold text-stone-900">
                  {label}
                </dt>
                <dd className="text-sm leading-6 text-stone-600">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <AgentDirectory
        category="voicebot"
        title="Choose a voice agent"
        description="Open an agent to start its dedicated voice experience."
        appearance="light"
      />
    </main>
  );
}
