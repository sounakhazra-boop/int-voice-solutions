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
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-white px-6 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-900 text-sm font-bold text-white">
            INT.
          </div>
          <span className="text-lg font-bold text-slate-800">
            INT Voice Solutions
          </span>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#"
            className="text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            Home
          </a>
          <a
            href="#"
            className="flex items-center gap-1 text-sm font-medium text-blue-600"
          >
            Solutions <ChevronDown className="h-4 w-4" />
          </a>
          <a
            href="#"
            className="text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            Use Cases
          </a>
          <a
            href="#"
            className="text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            Demos
          </a>
          <a
            href="#"
            className="text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            Resources
          </a>
        </nav>
        <button className="hidden items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100 md:flex">
          <PlayCircle className="h-4 w-4" />
          Request a Demo
        </button>
      </header>

      {/* Breadcrumb Bar */}
      <div className="flex w-full items-center bg-white px-8 py-3 text-xs text-slate-500">
        <span>Home</span>
        <span className="mx-2">&gt;</span>
        <span>Solutions</span>
        <span className="mx-2">&gt;</span>
        <span className="font-semibold text-slate-800">VYOM</span>
      </div>

      {/* Hero Section */}
      <section className="bg-[#0B1736] px-8 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            {/* Hero Left Content */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold tracking-wider text-blue-400">
                  FLAGSHIP VOICE AI PLATFORM
                </span>
                <span className="rounded bg-blue-600 px-2 py-0.5 text-xs font-semibold">
                  FLAGSHIP
                </span>
              </div>

              <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
                Every Conversation.
                <br />
                Automated.
                <br />
                Intelligent. Scalable.
              </h1>

              <p className="max-w-lg text-lg text-slate-300">
                Transform customer engagement with an AI-powered voice platform
                that automates outbound and inbound conversations, qualifies
                leads, engages customers, and drives business outcomes at scale.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button className="flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600">
                  Request a VYOM Demo <ArrowRight className="h-4 w-4" />
                </button>
                <button className="flex items-center gap-2 rounded-full border border-slate-500 bg-transparent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800">
                  Explore Capabilities
                </button>
              </div>
            </div>

            {/* Hero Right Visual */}
            <div className="relative rounded-2xl border border-slate-700 bg-[#12224A] p-6 shadow-2xl">
              <div className="mb-16 flex items-center gap-2 text-slate-300">
                <Activity className="h-5 w-5 text-blue-400" />
                <span className="text-sm font-medium">
                  VYOM Enterprise Voice AI acoustic waveform infrastructure
                </span>
              </div>

              {/* Decorative waveform area */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="h-32 w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxwYXRoIGQ9Ik0wLDUwIFExMCwyMCAyMCw1MCBUMDAsNTAgVDYwLDUwIFQ4MCw1MCBUMTAwLDUwIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==')] bg-cover bg-center"></div>
              </div>

              <div className="relative mt-8 rounded-xl border border-slate-700 bg-[#0A132D] p-4">
                <div className="mb-4 flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>VYOM Campaign Orchestrator</span>
                  <span>Illustrative View</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-[#1A2C5B] p-3 text-center">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                      Outbound
                    </div>
                    <div className="mt-1 font-semibold text-white">Active</div>
                  </div>
                  <div className="rounded-lg bg-[#1A2C5B] p-3 text-center">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                      CRM Sync
                    </div>
                    <div className="mt-1 font-semibold text-blue-400">
                      Webhook
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#1A2C5B] p-3 text-center">
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
      <div className="my-12">
        <UseCaseSelector initiatedBy="me@co.com" initiatedByName="Me" />
      </div>
      <AgentDirectory
        category="vyom"
        title="Choose a call agent"
        description="Open an agent to start its dedicated call experience."
      />
      {/* <RobotFAB assistantId={assistantId} /> */}
      <Script src="/widget/bandhan-widget.js" strategy="lazyOnload" />

      {/* floating bot button — bottom right */}

      {/* Overview Section */}
      <section className="bg-white px-8 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="text-sm font-bold uppercase tracking-widest text-blue-600">
                OVERVIEW • VYOM
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900">
                Voice AI That Works at Enterprise Scale
              </h2>
              <div className="space-y-4 text-lg text-slate-600">
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
              <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
                <div className="mb-6 flex items-start gap-4 border-b border-slate-200 pb-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      VYOM Highlights
                    </h3>
                    <p className="text-sm text-slate-500">
                      Key architectural value drivers
                    </p>
                  </div>
                </div>
                <ul className="mb-8 space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                    <span className="text-slate-700">
                      Structured outbound campaign orchestration & pacing
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                    <span className="text-slate-700">
                      Bidirectional CRM & lead management synchronization
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                    <span className="text-slate-700">
                      Real-time call outcome tagging & qualification scoring
                    </span>
                  </li>
                </ul>
                <div className="flex items-center justify-between pt-2 text-sm font-semibold text-blue-600">
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
      <section className="bg-slate-50 px-8 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <div className="text-sm font-bold uppercase tracking-widest text-blue-600">
              THE BUSINESS CHALLENGE
            </div>
            <h2 className="mt-2 text-4xl font-extrabold text-slate-900">
              Traditional Calling Cannot Scale with
              <br />
              Modern Business Demands
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
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Info className="h-5 w-5" />
                </div>
                <h3 className="mb-3 text-lg font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Capabilities Section */}
      <section className="bg-white px-8 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <div className="text-sm font-bold uppercase tracking-widest text-blue-600">
              CAPABILITIES
            </div>
            <h2 className="mt-2 text-4xl font-extrabold text-slate-900">
              Core Platform Capabilities
            </h2>
            <p className="mt-3 text-lg text-slate-600">
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
                border: "border-blue-400",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`rounded-2xl border ${feature.border || "border-slate-200"} bg-white p-8 shadow-sm transition-shadow hover:shadow-md`}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-3 text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="bg-slate-50 px-8 py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between bg-[#132043] px-6 py-4 text-white">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-500/20 text-blue-400">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold">
                      VYOM Campaign Analytics Console
                    </h2>
                    <span className="rounded border border-blue-400/30 bg-blue-500/20 px-2 py-0.5 text-xs font-semibold text-blue-300">
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
                <button className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold">
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
                  <strong className="text-slate-900">
                    Q4 Enterprise Lead Qualification
                  </strong>{" "}
                  (Outbound AI Campaign)
                </div>
                <div className="text-slate-400">Demo Data Only</div>
              </div>

              {/* Stats Row */}
              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5">
                  <div className="flex items-center justify-between text-blue-600">
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
                  <div className="flex items-center justify-between text-blue-600">
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
                        color: "bg-blue-500",
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
                    <Activity className="h-4 w-4 text-blue-500" />
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
                            className="w-1/2 rounded-t-sm bg-blue-400 hover:bg-blue-500"
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
                      <div className="h-3 w-3 rounded-sm bg-blue-400"></div>{" "}
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
