import AgentDirectory from "@/components/AgentDirectory";

export default function VoicebotLandingPage() {
  return (
    <main className="min-h-screen bg-navy-950 font-sans text-white">
      <section className="relative overflow-hidden bg-navy-900 px-6 py-20 sm:px-8 sm:py-24 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.2),_transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            INT Voice Solutions
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Voice agents built for real conversations.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-blue-100/90 sm:text-lg">
            Explore specialized voice assistants that help customers, teams, and
            businesses complete tasks through natural, intelligent voice
            interactions.
          </p>
          <div className="mt-10 grid max-w-4xl gap-5 sm:grid-cols-3">
            {[
              ["Natural conversations", "Low-friction voice experiences"],
              ["Business-ready", "Designed around real workflows"],
              ["Always available", "Instant support across use cases"],
            ].map(([label, detail]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-sm backdrop-blur-sm"
              >
                <p className="font-bold text-white">{label}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
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
