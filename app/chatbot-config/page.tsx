import React from "react";
import {
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  ChevronDown,
  Info,
  MessageSquare,
  BookOpen,
  Brain,
  Languages,
  Mic,
  FolderOpen,
  Zap,
  UserCheck,
} from "lucide-react";
import { BandhanChatBot } from "./BandhanChatBot";
import Script from "next/script";

export default function ChatbotLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* <BandhanChatBot /> */}
      <Script src="/widget/bandhan-widget.js" strategy="lazyOnload" />
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-white px-6 sm:px-8 lg:px-12 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-ink-900 text-sm font-bold text-white">
            INT.
          </div>
          <span className="text-lg font-bold text-ink-900">
            INT Voice Solutions
          </span>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-brand-600"
          >
            Home
          </a>
          <a
            href="#solutions"
            className="flex items-center gap-1 text-sm font-medium text-brand-600"
          >
            Solutions <ChevronDown className="h-4 w-4" />
          </a>
          <a
            href="/#use-cases"
            className="text-sm font-medium text-slate-600 hover:text-brand-600"
          >
            Use Cases
          </a>
          <a
            href="/#demos"
            className="text-sm font-medium text-slate-600 hover:text-brand-600"
          >
            Demos
          </a>
          <a
            href="/#resources"
            className="text-sm font-medium text-slate-600 hover:text-brand-600"
          >
            Resources
          </a>
        </nav>
        <button className="hidden items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-600 transition-colors hover:border-brand-300 hover:bg-brand-50 md:flex">
          <PlayCircle className="h-4 w-4" />
          Request a Demo
        </button>
      </header>

      {/* Breadcrumb Bar */}
      <div className="flex w-full items-center bg-white px-6 sm:px-8 lg:px-12 py-3.5 text-xs text-slate-500 border-b border-slate-100">
        <span>Home</span>
        <span className="mx-2">&gt;</span>
        <span>Solutions</span>
        <span className="mx-2">&gt;</span>
        <span className="font-semibold text-ink-900">Chatbot</span>
      </div>

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-navy-900 px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.2),_transparent_35%)]" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            {/* Hero Left Content */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold tracking-wider text-cyan-300">
                  TEXT & VOICE CONVERSATIONAL AGENT
                </span>
              </div>

              <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
                Conversations That
                <br />
                Move Your Business
                <br />
                Forward.
              </h1>

              <p className="max-w-lg text-lg text-blue-100/90">
                Create intelligent digital experiences with conversational AI
                that helps customers find information, resolve queries, and
                interact with your business through text and voice.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-950/40 transition-colors hover:from-indigo-400 hover:to-purple-500">
                  Request a Demo <ArrowRight className="h-4 w-4" />
                </button>
                <button className="flex items-center gap-2 rounded-full border border-brand-200/40 bg-transparent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10">
                  Experience Chatbot
                </button>
              </div>
            </div>

            {/* Hero Right Visual */}
            <div className="relative rounded-2xl border border-indigo-900/50 bg-navy-950/80 p-6 shadow-2xl">
              <div className="mb-6 flex items-center gap-3 text-slate-300">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-brand-300">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    INT Conversational Assistant
                  </div>
                  <div className="text-[11px] text-blue-100/70">
                    Knowledge-Grounded Chat & Voice
                  </div>
                </div>
              </div>

              {/* Chat simulation bubbles */}
              <div className="space-y-4">
                <div className="rounded-xl border border-indigo-950 bg-navy-900/60 p-4">
                  <p className="mb-1 text-xs font-semibold text-slate-400">
                    Bot
                  </p>
                  <p className="text-sm text-slate-200">
                    "Hello! I can answer questions directly from your product
                    docs, policies, and enterprise knowledge bases."
                  </p>
                </div>

                <div className="ml-8 rounded-xl border border-brand-500/30 bg-brand-600/40 p-4 md:ml-12">
                  <p className="mb-1 text-xs font-semibold text-brand-300">
                    User
                  </p>
                  <p className="text-sm text-slate-100">
                    "Can you connect with our website and CRM?"
                  </p>
                </div>

                <div className="mr-8 rounded-xl border border-indigo-950 bg-navy-900/60 p-4 md:mr-12">
                  <p className="mb-1 text-xs font-semibold text-slate-400">
                    Bot
                  </p>
                  <p className="text-sm text-slate-200">
                    "Yes—embed via web widget and sync leads or tickets
                    automatically via REST webhooks."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="bg-white px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            {/* Overview Left Text */}
            <div className="space-y-6">
              <div className="text-sm font-bold uppercase tracking-widest text-brand-600">
                OVERVIEW • CHATBOT
              </div>
              <h2 className="text-4xl font-extrabold leading-snug text-ink-900">
                Intelligent Conversations Across Digital Touchpoints
              </h2>
              <div className="space-y-4 text-lg text-slate-600">
                <p>
                  Chatbot enables businesses to deliver conversational
                  experiences through digital channels, allowing customers and
                  employees to interact with information and services naturally.
                </p>
                <p>
                  Powered by conversational AI and knowledge-based responses,
                  the solution helps organisations automate enquiries, improve
                  information accessibility, and provide consistent assistance
                  across digital touchpoints.
                </p>
                <p>
                  From website assistance to enterprise knowledge discovery,
                  Chatbot transforms traditional information access into
                  intuitive conversations.
                </p>
              </div>
            </div>

            {/* Overview Right Feature Box */}
            <div className="flex items-center justify-center">
              <div className="w-full rounded-2xl border border-indigo-100 bg-slate-50 p-8 shadow-sm">
                <div className="mb-6 flex items-start gap-4 border-b border-indigo-100 pb-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-ink-900">
                      Chatbot Highlights
                    </h3>
                    <p className="text-sm text-slate-500">
                      Key architectural value drivers
                    </p>
                  </div>
                </div>
                <ul className="mb-8 space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    <span className="text-slate-700">
                      Knowledge-base retrieval grounded in approved enterprise
                      documents
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    <span className="text-slate-700">
                      Seamless switching between typed chat and voice
                      interaction
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    <span className="text-slate-700">
                      Contextual escalation to live support agents when needed
                    </span>
                  </li>
                </ul>
                <div className="flex items-center justify-between pt-2 text-sm font-semibold text-brand-600">
                  <a
                    href="#"
                    className="flex items-center gap-1 hover:underline"
                  >
                    View Commercial Model &rarr;
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-1 hover:underline"
                  >
                    Schedule Walkthrough &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Challenge Section */}
      <section className="bg-slate-50 px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <div className="text-sm font-bold uppercase tracking-widest text-brand-600">
              THE BUSINESS CHALLENGE
            </div>
            <h2 className="mt-2 text-3xl font-extrabold text-ink-900 sm:text-4xl">
              Eliminate Friction Across Digital Customer Journeys
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                title: "Hard-to-Find Information",
                desc: "Visitors abandon websites when answers are buried deep inside complex menus and PDFs.",
              },
              {
                title: "Repetitive Support Enquiries",
                desc: "Live chat teams spend hours answering identical policy, pricing, and onboarding questions.",
              },
              {
                title: "Siloed Enterprise Knowledge",
                desc: "Internal documentation sits across disparate repositories, slowing down both customers and staff.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-indigo-100 bg-white p-8 shadow-sm transition-all duration-200 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-900/5"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <Info className="h-5 w-5" />
                </div>
                <h3 className="mb-3 text-lg font-bold text-ink-900">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="bg-white px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <div className="text-sm font-bold uppercase tracking-widest text-brand-600">
              CAPABILITIES
            </div>
            <h2 className="mt-2 text-3xl font-extrabold text-ink-900 sm:text-4xl">
              Chatbot Capabilities
            </h2>
            <p className="mt-3 text-base text-slate-600 sm:text-lg">
              Built for both external customer journeys and internal enterprise
              knowledge discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: MessageSquare,
                title: "Intelligent Conversations",
                desc: "Multi-turn dialogue handling with follow-up context retention.",
              },
              {
                icon: BookOpen,
                title: "Knowledge-Based Responses",
                desc: "Grounded answers sourced from curated enterprise documents and web pages.",
              },
              {
                icon: Brain,
                title: "Contextual Understanding",
                desc: "Interprets user intent accurately across varied phrasing.",
              },
              {
                icon: Languages,
                title: "Multilingual Support",
                desc: "Engage digital visitors across English and regional languages.",
              },
              {
                icon: Mic,
                title: "Voice Interaction",
                desc: "Allow users to speak queries and receive spoken or text replies.",
              },
              {
                icon: FolderOpen,
                title: "Enterprise Knowledge Access",
                desc: "Surface SOPs, product specs, and HR policies for employees securely.",
              },
              {
                icon: Zap,
                title: "Conversational Actions",
                desc: "Trigger lead capture, appointment requests, or status lookups inside chat.",
              },
              {
                icon: UserCheck,
                title: "Human Escalation",
                desc: "Hand off complex conversations to live chat agents with full transcript history.",
                border: "border-brand-500",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`rounded-2xl border ${feature.border || "border-indigo-100"} bg-white p-8 shadow-sm transition-all duration-200 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-900/5`}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-3 text-lg font-bold text-ink-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
