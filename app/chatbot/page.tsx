import AgentDirectory from "@/components/AgentDirectory";

export default function ChatbotLandingPage() {
  return (
    <main className="min-h-screen bg-navy-950 font-sans text-white">
      <section className="relative overflow-hidden bg-navy-900 px-6 py-20 sm:px-8 sm:py-24 lg:px-16 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.2),_transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            INT Conversational AI
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Chat experiences that move work forward.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-blue-100/90 sm:text-lg">
            Discover focused AI assistants for support, operations, finance,
            travel, and more. Each agent is designed to understand context and
            help users get to the right answer faster.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-indigo-200">
              Context-aware support
            </span>
            <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-indigo-200">
              Voice and text ready
            </span>
            <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-indigo-200">
              Built for business workflows
            </span>
          </div>
        </div>
      </section>

      <AgentDirectory
        category="chatbot"
        title="Choose a conversational agent"
        description="Open an agent to explore its dedicated chat experience."
        className="bg-navy-950"
      />
    </main>
  );
}
