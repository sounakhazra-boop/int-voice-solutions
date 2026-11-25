"use client";
import Link from "next/link";
import {
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  PhoneOutgoing,
  PhoneIncoming,
  Target,
  Languages,
  BarChart3,
  Database,
  Activity,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import UseCaseSelector from "./UseCaseSelector";
import Script from "next/script";
import AgentDirectory from "@/components/AgentDirectory";

export default function VyomLandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fc] font-sans text-slate-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-5 shadow-sm backdrop-blur-md sm:px-8 lg:px-12">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-xs font-extrabold tracking-tight text-white">
            INT.
          </div>
          <span className="text-base font-bold tracking-tight text-ink-900 sm:text-lg">
            INT Voice Solutions
          </span>
        </div>
        <nav className="hidden items-center gap-7 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-600"
          >
            Home
          </Link>
          <a
            href="#"
            className="flex items-center gap-1 text-sm font-medium text-brand-600"
          >
            Solutions <ChevronDown className="h-4 w-4" />
          </a>
          <a
            href="#use-cases"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-600"
          >
            Use Cases
          </a>
          <a
            href="#demos"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-600"
          >
            Demos
          </a>
          <Link
            href="/vyom/call"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-600"
          >
            Call Logs
          </Link>
          <a
            href="#"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-600"
          >
            Resources
          </a>
        </nav>
        <button className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-900 transition-colors hover:border-brand-300 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 md:flex">
          <PlayCircle className="h-4 w-4" />
          Request a Demo
        </button>
      </header>

      {/* Breadcrumb Bar */}
      <div className="flex w-full items-center border-b border-slate-100 bg-white px-6 py-2.5 text-xs text-slate-500 sm:px-8 lg:px-12">
        <Link href="/" className="transition-colors hover:text-slate-900">
          Home
        </Link>
        <ChevronRight className="mx-2 h-3.5 w-3.5 text-slate-400" />
        <span>Solutions</span>
        <ChevronRight className="mx-2 h-3.5 w-3.5 text-slate-400" />
        <span className="font-semibold text-ink-900">VYOM</span>
      </div>

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-navy-900 px-6 py-12 text-white sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.2),_transparent_35%)]" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
            {/* Hero Left Content */}
            <div className="min-w-0 space-y-5 lg:py-3">
              <h1 className="max-w-3xl text-balance text-3xl font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl lg:text-[3.5rem]">
                Every Conversation.
                <br className="hidden lg:block" /> Automated.
                <br className="hidden lg:block" /> Intelligent. Scalable.
              </h1>

              <p className="max-w-xl text-[15px] leading-7 text-blue-100/90 sm:text-base">
                Transform customer engagement with an AI-powered voice platform
                that automates outbound and inbound conversations, qualifies
                leads, engages customers, and drives business outcomes at scale.
              </p>

              <div className="flex w-full flex-wrap items-center gap-3">
                <button className="flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900">
                  Request a VYOM Demo <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="#capabilities"
                  className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Explore Capabilities
                </a>
              </div>
            </div>

            {/* Hero Right Visual */}
            <div className="relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#070d1d] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                    <Activity className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">VYOM</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Enterprise voice platform
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1 text-xs font-medium text-cyan-100">
                  VOICE AI
                </span>
              </div>

              <div className="my-5 grid grid-cols-3 gap-3 border-y border-white/10 py-5 sm:gap-5">
                <div>
                  <p className="text-xs text-slate-400">Calling</p>
                  <p className="mt-1 text-[13px] font-semibold text-white">
                    Inbound & outbound
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Connected systems</p>
                  <p className="mt-1 text-[13px] font-semibold text-white">
                    CRM
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Conversations</p>
                  <p className="mt-1 text-[13px] font-semibold text-white">
                    Multilingual
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live AI Call Section */}
      <section
        id="demos"
        className="border-b border-slate-200/80 bg-[#f7f8fc] px-6 py-12 sm:px-8 sm:py-16 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              Experience VYOM Live Call Execution
            </h2>
            <p className="mt-2 text-[15px] leading-6 text-slate-600">
              Select an enterprise voice use case, customize the prompt or voice
              persona, and initiate a real-time call to test conversational
              fidelity.
            </p>
          </div>
          <UseCaseSelector initiatedBy="me@co.com" initiatedByName="Me" />
        </div>
      </section>

      <AgentDirectory
        category="vyom"
        title="Choose a call agent"
        description="Open an agent to start its dedicated call experience."
      />
      <Script src="/widget/bandhan-widget.js" strategy="lazyOnload" />

      {/* Overview Section */}
      <section className="border-t border-slate-200/80 bg-white px-6 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div className="space-y-4">
              <h2 className="max-w-xl text-2xl font-bold leading-tight tracking-tight text-ink-900 sm:text-3xl lg:text-[2.25rem]">
                Voice AI That Works at Enterprise Scale
              </h2>
              <div className="max-w-2xl space-y-3 text-[15px] leading-6 text-slate-600">
                <p>
                  VYOM is an enterprise voice AI platform designed to automate
                  business conversations through intelligent AI-powered calling.
                </p>
                <p>
                  From initiating outbound campaigns to handling inbound
                  interactions, VYOM enables businesses to engage customers
                  consistently, process conversations intelligently, and convert
                  interactions into actionable business outcomes.
                </p>
                <p>
                  By combining conversational AI, voice automation, and business
                  system integrations, VYOM helps organisations reduce manual
                  calling effort, improve engagement efficiency, and scale
                  customer interactions.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-2 lg:border-l lg:border-t-0 lg:pl-10">
              <h3 className="mb-3 text-base font-bold text-ink-900">
                Built for real business conversations
              </h3>
              <ul className="divide-y divide-slate-200">
                <li className="flex gap-3 py-3 text-[15px] leading-6 text-slate-700">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-brand-600" />
                  Structured outbound campaign orchestration & pacing
                </li>
                <li className="flex gap-3 py-3 text-[15px] leading-6 text-slate-700">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-brand-600" />
                  Bidirectional CRM & lead management synchronization
                </li>
                <li className="flex gap-3 py-3 text-[15px] leading-6 text-slate-700">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-brand-600" />
                  Real-time call outcome tagging & qualification scoring
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Business Challenge Section */}
      <section className="border-t border-slate-200/80 bg-[#f7f8fc] px-6 py-10 sm:px-8 sm:py-12 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:gap-10">
            <h2 className="max-w-sm text-xl font-bold leading-tight tracking-tight text-ink-900 sm:text-2xl">
              Traditional Calling Cannot Scale with Modern Business Demands
            </h2>
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-3">
              {[
                {
                  title: "Manual calling effort",
                  desc: "High-volume calling requires significant manual effort, limiting outreach speed when lead windows are time-sensitive.",
                },
                {
                  title: "Inconsistent engagement",
                  desc: "Customer engagement is difficult to scale consistently across fluctuating campaign volumes, shifts, and regions.",
                },
                {
                  title: "Disconnected systems",
                  desc: "Calling outcomes are often disconnected from CRM and operational systems, delaying follow-up actions.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border-t border-slate-300 pt-4"
                >
                  <h3 className="mb-2 text-base font-bold text-ink-900">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-6 text-slate-600">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section
        id="capabilities"
        className="border-t border-slate-200/80 bg-white px-6 py-12 sm:px-8 sm:py-16 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
              Core Platform Capabilities
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-6 text-slate-600">
              Built to manage end-to-end enterprise voice campaigns and inbound
              automation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-10 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: PhoneOutgoing,
                title: "AI-Powered Outbound Calling",
                desc: "Automate high-volume outbound campaigns with intelligent voice agents.",
              },
              {
                icon: PhoneIncoming,
                title: "Inbound Voice Automation",
                desc: "Handle incoming customer interactions through automated conversational agents.",
              },
              {
                icon: Target,
                title: "Lead Qualification",
                desc: "Engage prospects, capture responses, and identify qualified opportunities.",
              },
              {
                icon: Languages,
                title: "Multilingual Conversations",
                desc: "Enable customer engagement across supported regional and global languages.",
              },
              {
                icon: BarChart3,
                title: "Campaign Analytics",
                desc: "Track calling activity, outcomes, engagement, and campaign performance.",
              },
              {
                icon: Database,
                title: "CRM Connectivity",
                desc: "Connect calling workflows with lead management and customer systems.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-3 border-t border-slate-200 py-5"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <feature.icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="mb-1.5 text-base font-bold text-ink-900">
                    {feature.title}
                  </h3>
                  <p className="text-[15px] leading-6 text-slate-600">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
