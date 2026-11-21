"use client";
import React from "react";
import {
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  PhoneOutgoing,
  PhoneIncoming,
  Target,
  Languages,
  BarChart3,
  Database,
  Phone,
  Users,
  CheckCircle,
  Activity,
  ChevronDown,
  ChevronRight,
  Info,
} from "lucide-react";
import UseCaseSelector from "./UseCaseSelector";
import RobotFAB from "./AskAgentModal";
import Script from "next/script";
import AgentDirectory from "@/components/AgentDirectory";

interface VyomLandingPageProps {
  assistantId?: string;
}

export default function VyomLandingPage({ assistantId }: VyomLandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 backdrop-blur-md shadow-xs sm:px-8 lg:px-12">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-sm font-bold text-white shadow-xs">
            INT.
          </div>
          <span className="text-lg font-bold tracking-tight text-ink-900">
            INT Voice Solutions
          </span>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="/"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-600"
          >
            Home
          </a>
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
          <a
            href="#"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-600"
          >
            Resources
          </a>
        </nav>
        <button className="hidden items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-600 shadow-xs transition-colors hover:border-brand-300 hover:bg-brand-50 md:flex">
          <PlayCircle className="h-4 w-4" />
          Request a Demo
        </button>
      </header>

      {/* Breadcrumb Bar */}
      <div className="flex w-full items-center border-b border-slate-100 bg-white px-6 py-3.5 text-xs text-slate-500 sm:px-8 lg:px-12">
        <a href="/" className="hover:text-slate-900 transition-colors">
          Home
        </a>
        <ChevronRight className="mx-2 h-3.5 w-3.5 text-slate-400" />
        <span>Solutions</span>
        <ChevronRight className="mx-2 h-3.5 w-3.5 text-slate-400" />
        <span className="font-semibold text-ink-900">VYOM</span>
      </div>

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-navy-900 px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.2),_transparent_35%)]" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            {/* Hero Left Content */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 sm:text-sm">
                  FLAGSHIP VOICE AI PLATFORM
                </span>
                <span className="rounded-md bg-brand-500/90 px-2 py-0.5 text-xs font-semibold text-white shadow-xs">
                  FLAGSHIP
                </span>
              </div>

              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Every Conversation.
                <br />
                Automated.
                <br />
                Intelligent. Scalable.
              </h1>

              <p className="max-w-lg text-base leading-relaxed text-blue-100/90 sm:text-lg">
                Transform customer engagement with an AI-powered voice platform
                that automates outbound and inbound conversations, qualifies
                leads, engages customers, and drives business outcomes at scale.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-950/40 transition-colors hover:from-indigo-400 hover:to-purple-500">
                  Request a VYOM Demo <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="#capabilities"
                  className="flex items-center gap-2 rounded-full border border-brand-200/40 bg-transparent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Explore Capabilities
                </a>
              </div>
            </div>

            {/* Hero Right Visual */}
            <div className="relative rounded-2xl border border-indigo-900/50 bg-navy-950/80 p-6 shadow-2xl">
              <div className="mb-16 flex items-center gap-2 text-slate-300">
                <Activity className="h-5 w-5 text-cyan-300" />
                <span className="text-sm font-medium">
                  VYOM Enterprise Voice AI acoustic waveform infrastructure
                </span>
              </div>

              {/* Decorative waveform area */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="h-32 w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxwYXRoIGQ9Ik0wLDUwIFExMCwyMCAyMCw1MCBUMDAsNTAgVDYwLDUwIFQ4MCw1MCBUMTAwLDUwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')] bg-cover bg-center"></div>
              </div>

              <div className="relative mt-8 rounded-xl border border-indigo-900/50 bg-navy-900/80 p-4">
                <div className="mb-4 flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>VYOM Campaign Orchestrator</span>
                  <span>Illustrative View</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-navy-800/80 p-3 text-center">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                      Outbound
                    </div>
                    <div className="mt-1 font-semibold text-white">Active</div>
                  </div>
                  <div className="rounded-lg bg-navy-800/80 p-3 text-center">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                      CRM Sync
                    </div>
                    <div className="mt-1 font-semibold text-cyan-300">
                      Webhook
                    </div>
                  </div>
                  <div className="rounded-lg bg-navy-800/80 p-3 text-center">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                      Languages
                    </div>
                    <div className="mt-1 font-semibold text-white">
                      Multilingual
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live AI Call Sandbox / Demo Section */}
      <section
        id="demos"
        className="border-b border-slate-200/80 bg-slate-50/70 px-6 py-16 sm:px-8 sm:py-20 lg:px-12"
      >
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-brand-600 sm:text-sm">
              INTERACTIVE DEMO SANDBOX
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl lg:text-4xl">
              Experience VYOM Live Call Execution
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Select an enterprise voice use case, customize the prompt or voice
              persona, and initiate a real-time call to test conversational
              fidelity.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <UseCaseSelector initiatedBy="me@co.com" initiatedByName="Me" />
          </div>
        </div>
      </section>

      <AgentDirectory
        category="vyom"
        title="Choose a call agent"
        description="Open an agent to start its dedicated call experience."
      />
      {/* <RobotFAB assistantId={assistantId} /> */}
      <Script src="/widget/bandhan-widget.js" strategy="lazyOnload" />

      {/* floating bot button — bottom right */}

      {/* Overview Section */}
      <section className="border-t border-slate-200/80 bg-white px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6">
              <div className="text-xs font-bold uppercase tracking-widest text-brand-600 sm:text-sm">
                OVERVIEW • VYOM
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl lg:text-4xl">
                Voice AI That Works at Enterprise Scale
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-slate-600 sm:text-lg">
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

            <div className="flex items-center justify-center">
              <div className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6 shadow-xs sm:p-8">
                <div className="mb-6 flex items-start gap-4 border-b border-slate-200/70 pb-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 shadow-xs">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ink-900 sm:text-xl">
                      VYOM Highlights
                    </h3>
                    <p className="text-xs text-slate-500 sm:text-sm">
                      Key architectural value drivers
                    </p>
                  </div>
                </div>
                <ul className="mb-8 space-y-3.5">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    <span className="text-sm leading-relaxed text-slate-700 sm:text-base">
                      Structured outbound campaign orchestration & pacing
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    <span className="text-sm leading-relaxed text-slate-700 sm:text-base">
                      Bidirectional CRM & lead management synchronization
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                    <span className="text-sm leading-relaxed text-slate-700 sm:text-base">
                      Real-time call outcome tagging & qualification scoring
                    </span>
                  </li>
                </ul>
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/60 pt-4 text-sm font-semibold text-brand-600">
                  <a
                    href="#"
                    className="group flex items-center gap-1.5 transition-colors hover:text-brand-700"
                  >
                    <span>View Commercial Model</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                  <a
                    href="#"
                    className="group flex items-center gap-1.5 transition-colors hover:text-brand-700"
                  >
                    <span>Schedule Walkthrough</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Challenge Section */}
      <section className="border-t border-slate-200/80 bg-slate-50/60 px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 sm:mb-12">
            <div className="text-xs font-bold uppercase tracking-widest text-brand-600 sm:text-sm">
              THE BUSINESS CHALLENGE
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl lg:text-4xl">
              Traditional Calling Cannot Scale with Modern Business Demands
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                title: "Manual Calling Effort",
                desc: "High-volume calling requires significant manual effort, limiting outreach speed when lead windows are time-sensitive.",
              },
              {
                title: "Inconsistent Engagement Scale",
                desc: "Customer engagement is difficult to scale consistently across fluctuating campaign volumes, shifts, and regions.",
              },
              {
                title: "Disconnected Business Systems",
                desc: "Calling outcomes are often disconnected from CRM and operational systems, delaying follow-up actions.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 shadow-xs">
                  <Info className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-base font-bold text-ink-900 sm:text-lg">
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
      <section
        id="capabilities"
        className="border-t border-slate-200/80 bg-white px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 sm:mb-12">
            <div className="text-xs font-bold uppercase tracking-widest text-brand-600 sm:text-sm">
              CAPABILITIES
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl lg:text-4xl">
              Core Platform Capabilities
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Built to manage end-to-end enterprise voice campaigns and inbound
              automation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                border: "border-brand-300 ring-1 ring-brand-200",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`rounded-2xl border ${feature.border || "border-slate-200/80"} bg-white p-6 sm:p-7 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md`}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 shadow-xs">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-base font-bold text-ink-900 sm:text-lg">
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

      {/* Dashboard Preview Section */}
      <section className="border-t border-slate-200/80 bg-slate-50/60 px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between bg-navy-900 px-6 py-4 text-white">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-brand-500/20 text-brand-300">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold">
                      VYOM Campaign Analytics Console
                    </h2>
                    <span className="rounded border border-brand-300/30 bg-brand-500/20 px-2 py-0.5 text-xs font-semibold text-brand-200">
                      ILLUSTRATIVE DASHBOARD PREVIEW
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">
                    Simulated demo dataset illustrating campaign pacing,
                    qualification, and CRM sync metrics.
                  </p>
                </div>
              </div>
              <div className="hidden gap-3 md:flex">
                <button className="rounded-full bg-brand-500 px-4 py-1.5 text-sm font-semibold text-white">
                  Q4 Enterprise
                </button>
                <button className="rounded-full border border-slate-500 bg-transparent px-4 py-1.5 text-sm font-semibold hover:bg-slate-800">
                  Policy &
                </button>
              </div>
            </div>

            {/* Dashboard Body */}
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4 text-sm">
                <div className="text-slate-600">
                  Active View:{" "}
                  <strong className="text-ink-900">
                    Q4 Enterprise Lead Qualification
                  </strong>{" "}
                  (Outbound AI Campaign)
                </div>
                <div className="text-slate-400">Demo Data Only</div>
              </div>

              {/* Stats Row */}
              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5">
                  <div className="flex items-center justify-between text-brand-600">
                    <span className="text-sm font-medium text-slate-500">
                      Total Calls
                    </span>
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="mt-2 text-3xl font-bold text-slate-900">
                    14,820
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Scheduled & dialled
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5">
                  <div className="flex items-center justify-between text-brand-600">
                    <span className="text-sm font-medium text-slate-500">
                      Connected Calls
                    </span>
                    <Activity className="h-5 w-5" />
                  </div>
                  <div className="mt-2 text-3xl font-bold text-slate-900">
                    10,460
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Engaged conversations
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5">
                  <div className="flex items-center justify-between text-indigo-600">
                    <span className="text-sm font-medium text-slate-500">
                      Qualified Outcomes
                    </span>
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="mt-2 text-3xl font-bold text-slate-900">
                    2,615
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Synced to CRM pipeline
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5">
                  <div className="flex items-center justify-between text-emerald-600">
                    <span className="text-sm font-medium text-slate-500">
                      Campaign Completion
                    </span>
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div className="mt-2 text-3xl font-bold text-slate-900">
                    88%
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Target dial window progress
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Distribution Chart (Progress Bars) */}
                <div className="rounded-xl border border-slate-100 p-6">
                  <h3 className="font-bold text-slate-900">
                    Call Outcome Distribution
                  </h3>
                  <p className="mb-6 text-xs text-slate-500">
                    Disposition breakdown across connected sessions
                  </p>

                  <div className="space-y-5">
                    {[
                      {
                        label: "Qualified Lead (CRM Synced)",
                        count: "2,615",
                        pct: "25%",
                        color: "bg-indigo-500",
                        w: "w-[25%]",
                      },
                      {
                        label: "Callback Scheduled",
                        count: "3,138",
                        pct: "30%",
                        color: "bg-brand-500",
                        w: "w-[30%]",
                      },
                      {
                        label: "Information Shared",
                        count: "2,824",
                        pct: "27%",
                        color: "bg-cyan-400",
                        w: "w-[27%]",
                      },
                      {
                        label: "Not Interested / Closed",
                        count: "1,883",
                        pct: "18%",
                        color: "bg-slate-400",
                        w: "w-[18%]",
                      },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="mb-1 flex justify-between text-sm font-medium text-slate-700">
                          <span>{item.label}</span>
                          <span className="text-slate-500">
                            {item.count}{" "}
                            <span className="text-xs">({item.pct})</span>
                          </span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${item.color} ${item.w}`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Trend (Bar Chart Mockup) */}
                <div className="rounded-xl border border-slate-100 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        Calling Performance Trend
                      </h3>
                      <p className="text-xs text-slate-500">
                        Daily connected vs. qualified volume (Illustrative)
                      </p>
                    </div>
                    <Activity className="h-4 w-4 text-brand-500" />
                  </div>

                  <div className="mt-8 flex h-48 items-end justify-between gap-2 px-2">
                    {[
                      { day: "Mon", connected: 60, qualified: 20 },
                      { day: "Tue", connected: 75, qualified: 25 },
                      { day: "Wed", connected: 85, qualified: 30 },
                      { day: "Thu", connected: 90, qualified: 35 },
                      { day: "Fri", connected: 95, qualified: 40 },
                      { day: "Sat", connected: 55, qualified: 15 },
                    ].map((data, i) => (
                      <div
                        key={i}
                        className="flex w-full flex-col items-center justify-end gap-1"
                      >
                        <div className="flex w-full items-end justify-center gap-1">
                          <div
                            className="w-1/2 rounded-t-sm bg-brand-400 hover:bg-brand-500"
                            style={{ height: `${data.connected}%` }}
                          ></div>
                          <div
                            className="w-1/2 rounded-t-sm bg-indigo-500 hover:bg-indigo-600"
                            style={{ height: `${data.qualified}%` }}
                          ></div>
                        </div>
                        <span className="mt-2 text-xs font-medium text-slate-500">
                          {data.day}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded-sm bg-brand-400"></div>{" "}
                      Connected Calls
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded-sm bg-indigo-500"></div>{" "}
                      Qualified / Confirmed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
