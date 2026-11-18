import AgentDirectory from "@/components/AgentDirectory";

export default function ChatbotLandingPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <section className="bg-[#0B1736] px-6 py-24 text-white md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300">
            INT Conversational AI
          </p>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl">
            Chat experiences that move work forward.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Discover focused AI assistants for support, operations, finance,
            travel, and more. Each agent is designed to understand context and
            help users get to the right answer faster.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="rounded-full border border-blue-300/30 bg-blue-400/10 px-4 py-2">
              Context-aware support
            </span>
            <span className="rounded-full border border-blue-300/30 bg-blue-400/10 px-4 py-2">
              Voice and text ready
            </span>
            <span className="rounded-full border border-blue-300/30 bg-blue-400/10 px-4 py-2">
              Built for business workflows
            </span>
          </div>
        </div>
      </section>

      <AgentDirectory
        category="chatbot"
        title="Choose a conversational agent"
        description="Open an agent to explore its dedicated chat experience."
        className="bg-slate-950"
      />
    </main>
  );
}
