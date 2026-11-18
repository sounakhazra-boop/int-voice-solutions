import AgentDirectory from "@/components/AgentDirectory";

export default function VoicebotLandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 font-sans text-white">
      <section className="relative overflow-hidden px-6 py-24 md:px-12 lg:px-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.16),_transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            INT Voice Solutions
          </p>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
            Voice agents built for real conversations.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Explore specialized voice assistants that help customers, teams, and
            businesses complete tasks through natural, intelligent voice
            interactions.
          </p>
          <div className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
            {[
              ["Natural conversations", "Low-friction voice experiences"],
              ["Business-ready", "Designed around real workflows"],
              ["Always available", "Instant support across use cases"],
            ].map(([label, detail]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-5"
              >
                <p className="font-semibold">{label}</p>
                <p className="mt-2 text-sm leading-5 text-slate-400">
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AgentDirectory
        category="voicebot"
        title="Choose a voice agent"
        description="Open an agent to start its dedicated voice experience."
      />
    </main>
  );
}
