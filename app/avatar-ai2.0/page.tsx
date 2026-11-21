import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import HeyGenVideoStudioCard from "./HeyGenVideoStudioCard";

export default function AvatarAi2Page() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 backdrop-blur-md shadow-xs sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-bold text-ink-900">
            Avatar AI Studio 2.0
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-3 py-1 text-xs font-medium text-brand-700">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Gen Generative Video</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Interactive Video Studio
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
            Generate synthetic digital human video experiences with customizable
            avatars and neural speech synthesis.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
          <HeyGenVideoStudioCard />
        </div>
      </main>
    </div>
  );
}
