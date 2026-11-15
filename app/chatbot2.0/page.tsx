// import React from 'react';
// import {
//   ArrowRight,
//   PlayCircle,
//   CheckCircle2,
//   ChevronDown,
//   Info,
//   MessageSquare,
//   BookOpen,
//   Brain,
//   Languages,
//   Mic,
//   FolderOpen,
//   Zap,
//   UserCheck
// } from 'lucide-react';
// // import { BandhanChatBot } from './BandhanChatBot';
// import Script from 'next/script';
// import BandhanAssistant from './BandhanAssistant';

// export default function ChatbotLandingPage() {
//   return (
//     <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
//        {/* <BandhanChatBot /> */}
//        {/* <Script
//           src="/widget/bandhan-widget.js"
//           strategy="lazyOnload"
//         /> */}
//         <BandhanAssistant />
//       {/* Top Navbar */}
//       <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-white px-6 shadow-sm">
//         <div className="flex items-center gap-2">
//           <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-900 text-sm font-bold text-white">
//             INT.
//           </div>
//           <span className="text-lg font-bold text-slate-800">INT Voice Solutions</span>
//         </div>
//         <nav className="hidden items-center gap-6 md:flex">
//           <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600">Home</a>
//           <a href="#" className="flex items-center gap-1 text-sm font-medium text-blue-600">
//             Solutions <ChevronDown className="h-4 w-4" />
//           </a>
//           <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600">Use Cases</a>
//           <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600">Demos</a>
//           <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600">Resources</a>
//         </nav>
//         <button className="hidden items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100 md:flex">
//           <PlayCircle className="h-4 w-4" />
//           Request a Demo
//         </button>
//       </header>

//       {/* Breadcrumb Bar */}
//       <div className="flex w-full items-center bg-white px-8 py-3 text-xs text-slate-500">
//         <span>Home</span>
//         <span className="mx-2">&gt;</span>
//         <span>Solutions</span>
//         <span className="mx-2">&gt;</span>
//         <span className="font-semibold text-slate-800">Chatbot</span>
//       </div>

//       {/* Hero Section */}
//       <section className="bg-[#0B1736] px-8 py-20 text-white">
//         <div className="mx-auto max-w-7xl">
//           <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">

//             {/* Hero Left Content */}
//             <div className="space-y-8">
//               <div className="flex items-center gap-3">
//                 <span className="text-sm font-bold tracking-wider text-blue-400">TEXT & VOICE CONVERSATIONAL AGENT</span>
//               </div>

//               <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
//                 Conversations That<br />
//                 Move Your Business<br />
//                 Forward.
//               </h1>

//               <p className="max-w-lg text-lg text-slate-300">
//                 Create intelligent digital experiences with conversational AI that helps
//                 customers find information, resolve queries, and interact with your business
//                 through text and voice.
//               </p>

//               <div className="flex flex-wrap items-center gap-4">
//                 <button className="flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-600">
//                   Request a Demo <ArrowRight className="h-4 w-4" />
//                 </button>
//                 <button className="flex items-center gap-2 rounded-full border border-slate-500 bg-transparent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800">
//                   Experience Chatbot
//                 </button>
//               </div>
//             </div>

//             {/* Hero Right Visual */}
//             <div className="relative rounded-2xl border border-slate-700 bg-[#12224A] p-6 shadow-2xl">
//               <div className="mb-6 flex items-center gap-3 text-slate-300">
//                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
//                   <MessageSquare className="h-5 w-5" />
//                 </div>
//                 <div>
//                   <div className="text-sm font-bold text-white">INT Conversational Assistant</div>
//                   <div className="text-[11px] text-slate-400">Knowledge-Grounded Chat & Voice</div>
//                 </div>
//               </div>

//               {/* Chat simulation bubbles */}
//               <div className="space-y-4">
//                 <div className="rounded-xl bg-slate-800/40 p-4 border border-slate-700/40">
//                   <p className="text-xs font-semibold text-slate-400 mb-1">Bot</p>
//                   <p className="text-sm text-slate-200">
//                     "Hello! I can answer questions directly from your product docs, policies, and enterprise knowledge bases."
//                   </p>
//                 </div>

//                 <div className="rounded-xl bg-blue-600/35 p-4 border border-blue-500/30 ml-8 md:ml-12">
//                   <p className="text-xs font-semibold text-blue-300 mb-1">User</p>
//                   <p className="text-sm text-slate-100">
//                     "Can you connect with our website and CRM?"
//                   </p>
//                 </div>

//                 <div className="rounded-xl bg-slate-800/40 p-4 border border-slate-700/40 mr-8 md:mr-12">
//                   <p className="text-xs font-semibold text-slate-400 mb-1">Bot</p>
//                   <p className="text-sm text-slate-200">
//                     "Yes—embed via web widget and sync leads or tickets automatically via REST webhooks."
//                   </p>
//                 </div>
//               </div>

//             </div>

//           </div>
//         </div>
//       </section>

//       {/* Overview Section */}
//       <section className="bg-white px-8 py-20">
//         <div className="mx-auto max-w-7xl">
//           <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">

//             {/* Overview Left Text */}
//             <div className="space-y-6">
//               <div className="text-sm font-bold uppercase tracking-widest text-blue-600">
//                 OVERVIEW • CHATBOT
//               </div>
//               <h2 className="text-4xl font-extrabold text-slate-900 leading-snug">
//                 Intelligent Conversations Across Digital Touchpoints
//               </h2>
//               <div className="space-y-4 text-lg text-slate-600">
//                 <p>
//                   Chatbot enables businesses to deliver conversational experiences through digital
//                   channels, allowing customers and employees to interact with information and services
//                   naturally.
//                 </p>
//                 <p>
//                   Powered by conversational AI and knowledge-based responses, the solution helps
//                   organisations automate enquiries, improve information accessibility, and provide consistent
//                   assistance across digital touchpoints.
//                 </p>
//                 <p>
//                   From website assistance to enterprise knowledge discovery, Chatbot transforms traditional
//                   information access into intuitive conversations.
//                 </p>
//               </div>
//             </div>

//             {/* Overview Right Feature Box */}
//             <div className="flex items-center justify-center">
//               <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
//                 <div className="mb-6 flex items-start gap-4 border-b border-slate-200 pb-6">
//                   <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
//                     <MessageSquare className="h-6 w-6" />
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold text-slate-900">Chatbot Highlights</h3>
//                     <p className="text-sm text-slate-500">Key architectural value drivers</p>
//                   </div>
//                 </div>
//                 <ul className="mb-8 space-y-4">
//                   <li className="flex items-start gap-3">
//                     <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
//                     <span className="text-slate-700">Knowledge-base retrieval grounded in approved enterprise documents</span>
//                   </li>
//                   <li className="flex items-start gap-3">
//                     <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
//                     <span className="text-slate-700">Seamless switching between typed chat and voice interaction</span>
//                   </li>
//                   <li className="flex items-start gap-3">
//                     <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
//                     <span className="text-slate-700">Contextual escalation to live support agents when needed</span>
//                   </li>
//                 </ul>
//                 <div className="flex items-center justify-between pt-2 text-sm font-semibold text-blue-600">
//                   <a href="#" className="flex items-center gap-1 hover:underline">View Commercial Model &rarr;</a>
//                   <a href="#" className="flex items-center gap-1 hover:underline">Schedule Walkthrough &rarr;</a>
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* Business Challenge Section */}
//       <section className="bg-slate-50 px-8 py-20">
//         <div className="mx-auto max-w-7xl">
//           <div className="mb-12">
//             <div className="text-sm font-bold uppercase tracking-widest text-blue-600">
//               THE BUSINESS CHALLENGE
//             </div>
//             <h2 className="mt-2 text-4xl font-extrabold text-slate-900">
//               Eliminate Friction Across Digital Customer Journeys
//             </h2>
//           </div>

//           <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//             {[
//               {
//                 title: "Hard-to-Find Information",
//                 desc: "Visitors abandon websites when answers are buried deep inside complex menus and PDFs."
//               },
//               {
//                 title: "Repetitive Support Enquiries",
//                 desc: "Live chat teams spend hours answering identical policy, pricing, and onboarding questions."
//               },
//               {
//                 title: "Siloed Enterprise Knowledge",
//                 desc: "Internal documentation sits across disparate repositories, slowing down both customers and staff."
//               }
//             ].map((item, i) => (
//               <div key={i} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
//                 <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
//                   <Info className="h-5 w-5" />
//                 </div>
//                 <h3 className="mb-3 text-lg font-bold text-slate-900">{item.title}</h3>
//                 <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Capabilities Section */}
//       <section className="bg-white px-8 py-20">
//         <div className="mx-auto max-w-7xl">
//           <div className="mb-12">
//             <div className="text-sm font-bold uppercase tracking-widest text-blue-600">
//               CAPABILITIES
//             </div>
//             <h2 className="mt-2 text-4xl font-extrabold text-slate-900">
//               Chatbot Capabilities
//             </h2>
//             <p className="mt-3 text-lg text-slate-600">
//               Built for both external customer journeys and internal enterprise knowledge discovery.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {[
//               {
//                 icon: MessageSquare,
//                 title: "Intelligent Conversations",
//                 desc: "Multi-turn dialogue handling with follow-up context retention."
//               },
//               {
//                 icon: BookOpen,
//                 title: "Knowledge-Based Responses",
//                 desc: "Grounded answers sourced from curated enterprise documents and web pages."
//               },
//               {
//                 icon: Brain,
//                 title: "Contextual Understanding",
//                 desc: "Interprets user intent accurately across varied phrasing."
//               },
//               {
//                 icon: Languages,
//                 title: "Multilingual Support",
//                 desc: "Engage digital visitors across English and regional languages."
//               },
//               {
//                 icon: Mic,
//                 title: "Voice Interaction",
//                 desc: "Allow users to speak queries and receive spoken or text replies."
//               },
//               {
//                 icon: FolderOpen,
//                 title: "Enterprise Knowledge Access",
//                 desc: "Surface SOPs, product specs, and HR policies for employees securely."
//               },
//               {
//                 icon: Zap,
//                 title: "Conversational Actions",
//                 desc: "Trigger lead capture, appointment requests, or status lookups inside chat."
//               },
//               {
//                 icon: UserCheck,
//                 title: "Human Escalation",
//                 desc: "Hand off complex conversations to live chat agents with full transcript history.",
//                 border: "border-blue-400"
//               }
//             ].map((feature, i) => (
//               <div key={i} className={`rounded-2xl border ${feature.border || 'border-slate-200'} bg-white p-8 shadow-sm transition-shadow hover:shadow-md`}>
//                 <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
//                   <feature.icon className="h-5 w-5" />
//                 </div>
//                 <h3 className="mb-3 text-lg font-bold text-slate-900">{feature.title}</h3>
//                 <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//     </div>
//   );
// }

import Script from "next/script";
import React from "react";
import BandhanAssistant from "./BandhanAssistant";

export default function BandhanBankingUI() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFDFD] to-slate-50 font-sans text-slate-800 relative overflow-x-hidden selection:bg-[#092b5a] selection:text-white">
      {/* <Script
        src="/widget/bandhan-widget.js"
        strategy="lazyOnload"
      /> */}
      <BandhanAssistant />
      {/* Top Floating Timer Badge */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#092b5a] text-white text-xs font-semibold px-5 py-1.5 rounded-b-xl flex items-center gap-2.5 shadow-lg z-50 backdrop-blur-md bg-opacity-95 border border-t-0 border-white/10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
        2h 37m 43s
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-lg shadow-sm z-40 border-b border-gray-200/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Area */}
          <div className="flex items-center gap-5">
            <button className="text-gray-500 hover:text-gray-900 lg:hidden p-1 rounded-md hover:bg-gray-100 transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="flex items-center">
                <div className="w-9 h-9 rounded-full border-[6.5px] border-[#e1251b] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <div className="w-2.5 h-2.5 bg-[#e1251b] rounded-full" />
                </div>
                <span className="ml-2.5 text-[22px] font-extrabold text-[#092b5a] leading-none tracking-tight">
                  Bandhan <br /> <span className="text-xl">Bank</span>
                </span>
              </div>
              <div className="hidden sm:block ml-3 border-l-2 pl-3 border-gray-200 h-10 flex flex-col justify-center">
                <span className="text-[9px] text-gray-500 font-bold uppercase leading-[1.1] tracking-wider block">
                  10 Years of <br /> Excellence
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-9 h-full">
            <a
              href="#"
              className="h-full flex items-center text-sm font-bold text-[#092b5a] border-b-[3px] border-[#e1251b] pt-[3px]"
            >
              Home
            </a>
            <a
              href="#"
              className="h-full flex items-center text-sm font-semibold text-gray-500 hover:text-[#092b5a] transition-colors relative group"
            >
              Personal
              <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-[#092b5a] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#"
              className="h-full flex items-center text-sm font-semibold text-gray-500 hover:text-[#092b5a] transition-colors relative group"
            >
              Business
              <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-[#092b5a] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#"
              className="h-full flex items-center text-sm font-semibold text-gray-500 hover:text-[#092b5a] transition-colors relative group"
            >
              NRI
              <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-[#092b5a] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#"
              className="h-full flex items-center text-sm font-semibold text-gray-500 hover:text-[#092b5a] transition-colors relative group"
            >
              Rewards
              <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-[#092b5a] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2.5 text-gray-500 hover:text-[#092b5a] hover:bg-blue-50 rounded-full transition-all hidden sm:block">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button className="p-2.5 text-gray-500 hover:text-[#092b5a] hover:bg-blue-50 rounded-full transition-all hidden sm:block">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            <div className="hidden md:flex items-center gap-2.5 ml-2">
              <button className="border border-gray-300 text-[#092b5a] text-sm font-bold px-4 py-2.5 rounded-lg hover:border-[#092b5a] hover:bg-slate-50 transition-all">
                Reach us
              </button>
              <button className="border border-gray-300 text-[#092b5a] text-sm font-bold px-4 py-2.5 rounded-lg hover:border-[#092b5a] hover:bg-slate-50 transition-all">
                Pay
              </button>
            </div>

            <button className="ml-2 bg-[#092b5a] text-white text-sm font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-[#071f40] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Login
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Hero Left Content */}
        <div className="max-w-xl">
          <h1 className="text-[52px] md:text-[72px] font-extrabold text-[#092b5a] leading-[1.05] tracking-tight">
            Start banking <br /> with us!
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-slate-600 font-medium">
            Open a Savings Account today.
          </p>

          <button className="mt-10 bg-[#092b5a] text-white text-base font-bold px-8 py-4 rounded-xl hover:bg-[#061b36] hover:shadow-[0_8px_30px_rgb(9,43,90,0.3)] hover:-translate-y-1 transition-all duration-300">
            Open now
          </button>

          <div className="mt-14 flex items-center gap-3.5 text-sm text-slate-500 font-semibold bg-white/60 w-max pr-6 py-2 rounded-full border border-gray-100 shadow-sm backdrop-blur-sm">
            <div className="w-7 h-7 ml-1 rounded-full border border-red-200 flex items-center justify-center text-[#e1251b] bg-red-50/80 shadow-inner">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            Fast, Secure & 100% Digital Process
          </div>
        </div>

        {/* Hero Right Graphic */}
        <div className="relative h-[480px] flex items-center justify-center perspective-1000">
          {/* Main Card Element */}
          <div className="relative w-[420px] h-[260px] bg-gradient-to-br from-[#0a2347] via-[#103360] to-[#134074] rounded-[28px] shadow-[0_20px_50px_rgba(9,43,90,0.4)] p-8 text-white overflow-hidden z-10 border border-white/10 transform transition-transform duration-700 hover:scale-[1.02] hover:rotate-1 animate-[float_6s_ease-in-out_infinite]">
            {/* Glassmorphic overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="flex justify-between items-start relative z-10">
              {/* Chip */}
              <div className="w-12 h-10 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-md flex flex-col justify-evenly overflow-hidden border border-yellow-200/50 shadow-inner px-1">
                <div className="w-full h-px bg-black/20"></div>
                <div className="w-full h-px bg-black/20"></div>
                <div className="w-full h-px bg-black/20"></div>
              </div>

              <div className="text-right">
                <span className="font-extrabold text-xl italic tracking-wide drop-shadow-md">
                  Bandhan
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-[0.2em] block text-gray-300 mt-0.5">
                  Premium
                </span>
              </div>
            </div>

            <div className="mt-8 relative z-10">
              <p className="text-[10px] text-blue-200/80 font-bold tracking-widest mb-1.5">
                SAFE CHIP
              </p>
              <div className="flex items-center gap-5 text-2xl tracking-widest font-mono font-medium drop-shadow-sm">
                <span>4520</span>
                <span className="text-sm tracking-[5px] opacity-80 pt-1">
                  ••••
                </span>
                <span className="text-sm tracking-[5px] opacity-80 pt-1">
                  ••••
                </span>
                <span>8842</span>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end z-10">
              <div>
                <p className="text-[9px] text-blue-200/80 uppercase tracking-widest mb-1">
                  Card Holder
                </p>
                <p className="text-sm font-bold tracking-widest drop-shadow-sm">
                  VALUED CUSTOMER
                </p>
              </div>

              {/* Mastercard Style Interlocking Circles */}
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#eb001b] z-20 mix-blend-multiply"></div>
                <div className="w-10 h-10 rounded-full bg-[#f79e1b] -ml-5 z-10 mix-blend-multiply"></div>
              </div>
            </div>
          </div>

          {/* Floating UI Elements with varied delays */}
          <div className="absolute top-16 right-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl w-14 h-14 flex items-center justify-center z-20 border border-white/50 animate-[float_4s_ease-in-out_infinite_0.5s]">
            <svg
              className="w-6 h-6 text-[#e1251b]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>

          <div className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl w-14 h-14 flex items-center justify-center z-20 border border-white/50 animate-[float_5s_ease-in-out_infinite_1s]">
            <svg
              className="w-6 h-6 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>

          <div className="absolute bottom-16 left-20 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl w-14 h-14 flex items-center justify-center z-20 border border-white/50 animate-[float_6s_ease-in-out_infinite_1.5s]">
            <svg
              className="w-6 h-6 text-[#092b5a]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          </div>

          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-blue-200/30 rounded-full blur-[100px] -z-10 scale-95"></div>
        </div>
      </section>

      {/* TRUSTED SECTION */}
      <section className="w-full bg-white py-28 border-t border-gray-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-[40px] md:text-[56px] font-extrabold text-[#092b5a] tracking-tight leading-tight">
            Trusted by all, banking for all
          </h2>
          <p className="mt-6 text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Bandhan Bank brings you a bouquet of services and products for your
            varied needs.
          </p>

          {/* Slider Indicators */}
          <div className="mt-12 flex justify-center items-center gap-2.5">
            <div className="w-10 h-2 rounded-full bg-[#e1251b] shadow-sm"></div>
            <div className="w-10 h-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors cursor-pointer"></div>
          </div>
        </div>
      </section>

      {/* RIGHT SIDE FLOATING MENU */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3 bg-white/95 backdrop-blur-md py-5 px-3 rounded-l-2xl shadow-[-8px_0_30px_rgba(0,0,0,0.08)] border border-gray-100 border-r-0 z-50">
        <button
          className="p-3 text-slate-400 hover:text-[#092b5a] hover:bg-blue-50 transition-all rounded-xl group"
          aria-label="Contact Support"
        >
          <svg
            className="w-6 h-6 group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </button>
        <button
          className="p-3 text-slate-400 hover:text-[#092b5a] hover:bg-blue-50 transition-all rounded-xl group"
          aria-label="Find Locations"
        >
          <svg
            className="w-6 h-6 group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
        <button
          className="p-3 text-slate-400 hover:text-[#092b5a] hover:bg-blue-50 transition-all rounded-xl group"
          aria-label="Security"
        >
          <svg
            className="w-6 h-6 group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </button>
      </div>

      {/* Global styles for floating animation to add to your globals.css if needed, 
          though standard Tailwind can handle this, custom keyframes make it smoother. 
          Adding this style tag ensures it works immediately in a single file setup. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `,
        }}
      />
    </div>
  );
}
