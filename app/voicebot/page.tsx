import Script from "next/script";
import React from "react";
import { VoiceBot } from "./VoiceBot";

export default function LandingPage() {
  return (
    <div
      className="relative h-screen w-full bg-cover bg-center overflow-hidden font-sans text-white"
      style={{
        // Using a high-quality placeholder forest/river image for the background
        backgroundImage:
          "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop')",
      }}
    >
      <Script src="/widget/bandhan-widget.js" strategy="lazyOnload" />
      <VoiceBot
        assistantId="43cedf45-e778-486a-9544-9e69dc96b469"
        tokenEndpoint="https://internal-vyom-api.indusnettechnologies.com/api/voicekit/web-call-token"
        livekitUrl="wss://livekit-vyom.indusnettechnologies.com"
        title="Pratiksha"
      />
      {/* Dark gradient overlay to ensure text is readable */}
      <div className="absolute inset-0 bg-black/20 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      {/* TOP NAVIGATION */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-4 text-sm font-medium">
        {/* Left: Back & Logo */}
        <div className="flex items-center gap-6">
          <button className="text-white hover:text-gray-300">
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
          </button>
          <div className="flex items-center gap-2">
            {/* Logo Placeholder */}
            <div className="w-10 h-10 bg-white/20 rounded flex items-center justify-center">
              <span className="text-xs">LOGO</span>
            </div>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="flex items-center gap-8 hidden md:flex">
          <a href="#" className="hover:text-gray-300 transition-colors">
            Explore
          </a>
          <a
            href="#"
            className="flex items-center gap-1 hover:text-gray-300 transition-colors"
          >
            Book Hotel
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </a>
          <a
            href="#"
            className="flex items-center gap-1 hover:text-gray-300 transition-colors"
          >
            Experience
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-4 text-xs">
            <span className="text-orange-400 font-bold">• 2H 52M 38S</span>
            <div className="flex items-center gap-1 text-gray-200">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              27°C
            </div>
          </div>

          <button className="bg-[#F7A600] text-black px-5 py-2.5 rounded font-semibold flex items-center gap-2 hover:bg-orange-500 transition-colors">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 19a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14z M12 11v6m0 0l-3-3m3 3l3-3 M8 7h8"
              ></path>
            </svg>
            Trip Planner
          </button>

          <button className="flex items-center gap-1 hover:text-gray-300">
            More
          </button>

          <div className="flex items-center gap-4 border-l border-white/30 pl-4">
            <button className="hover:text-gray-300">En</button>
            <button className="hover:text-gray-300">
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
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* LEFT SIDEBAR - Social Icons */}
      <aside className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-6 text-white/70">
        {/* Placeholder SVG paths for standard social icons */}
        <a href="#" className="hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
          </svg>
        </a>
        <a href="#" className="hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        </a>
        <a href="#" className="hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        </a>
        <a href="#" className="hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </a>
      </aside>

      {/* MAIN HERO CONTENT */}
      <main className="relative z-10 flex h-full flex-col justify-center pl-24 md:pl-32 max-w-4xl">
        <h1 className="text-6xl md:text-8xl font-bold leading-[1.1] tracking-tight">
          NATURE,
          <br />
          CULTURE,
          <br />
          DISCOVERY
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-xl font-light">
          Discover plateaus, waterfalls and living tribal traditions across
          India's green heartland.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button className="bg-[#F7A600] text-black px-8 py-3.5 rounded font-bold flex items-center gap-2 hover:bg-orange-500 transition-colors">
            Plan your trip
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
                d="M4 19l16-16m0 0H9m11 0v11"
              ></path>
            </svg>
          </button>

          <button className="bg-white text-black px-8 py-3.5 rounded font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors">
            Download brochure
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              ></path>
            </svg>
          </button>
        </div>
      </main>

      {/* BOTTOM FOOTER / PROFILES */}
      <footer className="absolute bottom-0 w-full z-20 bg-[#0a110a]/90 backdrop-blur-md border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 py-4 max-w-7xl mx-auto gap-4 md:gap-0">
          {/* Profile 1 */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-600 rounded-sm overflow-hidden border border-gray-500">
              <img
                src="https://ui-avatars.com/api/?name=Hemant+Soren&background=random"
                alt="Shri Hemant Soren"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase">SHRI HEMANT SOREN</h3>
              <p className="text-[10px] text-gray-400">
                Hon'ble Chief Minister
              </p>
            </div>
          </div>

          {/* Profile 2 */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-600 rounded-sm overflow-hidden border border-gray-500">
              <img
                src="https://ui-avatars.com/api/?name=Sudivya+Kumar&background=random"
                alt="Shri Sudivya Kumar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase">
                SHRI SUDIVYA KUMAR
              </h3>
              <p className="text-[10px] text-gray-400">
                Hon. Minister (Tourism)
              </p>
            </div>
          </div>

          {/* Profile 3 */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-600 rounded-sm overflow-hidden border border-gray-500">
              <img
                src="https://ui-avatars.com/api/?name=Prem+Ranjan&background=random"
                alt="Shri Prem Ranjan"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase">SHRI PREM RANJAN</h3>
              <p className="text-[10px] text-gray-400">
                Managing Director, JTDC
              </p>
            </div>
          </div>

          {/* Profile 4 */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-600 rounded-sm overflow-hidden border border-gray-500">
              <img
                src="https://ui-avatars.com/api/?name=Manoj+Kumar&background=random"
                alt="Shri Manoj Kumar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase">SHRI MANOJ KUMAR</h3>
              <p className="text-[10px] text-gray-400">
                Principal Secretary (Tourism)
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
