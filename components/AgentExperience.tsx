"use client";

import React, { useState } from "react";
import agentsData from "@/data/agents.json";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Award,
  Bell,
  Bot,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  Globe,
  HelpCircle,
  Home,
  IndianRupee,
  Info,
  Landmark,
  Layers,
  LayoutDashboard,
  Lock,
  MapPin,
  MessageCircle,
  MessageSquare,
  Mic,
  Package,
  Phone,
  PhoneCall,
  PieChart,
  Play,
  PlusCircle,
  Receipt,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  TrendingUp,
  Truck,
  User,
  Users,
  Video,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";

interface AgentExperienceProps {
  agentKey: string;
}

/* -------------------------------------------------------------------------- */
/*                     GENERIC ICON RESOLVER (FALLBACK SAFE)                  */
/* -------------------------------------------------------------------------- */
const ICON_MAP: Record<string, LucideIcon> = {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Award,
  Bell,
  Bot,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileText,
  Globe,
  HelpCircle,
  Home,
  IndianRupee,
  Landmark,
  Layers,
  LayoutDashboard,
  Lock,
  MapPin,
  MessageCircle,
  MessageSquare,
  Mic,
  Package,
  Phone,
  PhoneCall,
  PieChart,
  Play,
  PlusCircle,
  Receipt,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  TrendingUp,
  Truck,
  User,
  Users,
  Video,
  Wallet,
  Zap,
};

function DynamicIcon({
  name,
  className = "w-4 h-4",
}: {
  name?: string;
  className?: string;
}) {
  if (!name) return <Sparkles className={className} />;
  const Icon = ICON_MAP[name] || Sparkles;
  return <Icon className={className} />;
}

/* -------------------------------------------------------------------------- */
/*                     GENERIC VALUE & OBJECT RENDERERS                       */
/* -------------------------------------------------------------------------- */
function formatKeyLabel(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function isPrimitive(val: unknown): val is string | number | boolean {
  return (
    typeof val === "string" ||
    typeof val === "number" ||
    typeof val === "boolean"
  );
}

/* -------------------------------------------------------------------------- */
/*                         MAIN GENERIC COMPONENT                             */
/* -------------------------------------------------------------------------- */
export default function AgentExperience({ agentKey }: AgentExperienceProps) {
  const agents = agentsData as Record<string, any>;
  const agent = agents[agentKey];
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  if (!agent) return null;

  const assistantInfo = agent.assistant_info || {};
  const ui = agent.ui || {};
  const legacySections: any[] = agent.page_content?.sections || [];
  const summary =
    agent.page_content?.summary || assistantInfo.description || "";

  // Extract universal blocks if using the `ui` structure
  const header = ui.header || {};
  const hero = ui.hero || ui.landing || {};
  const alertBanners: any[] = ui.alert_banners || [];
  const metrics: any[] =
    ui.metrics ||
    ui.partner_metrics ||
    ui.kpi_snapshot ||
    ui.global_stats ||
    [];
  const quickActions: any[] =
    ui.quick_actions || ui.quick_links || ui.quick_actions_sidebar || [];

  // Any remaining array or object keys inside `ui` are rendered dynamically as generic sections
  const HANDLED_UI_KEYS = new Set([
    "header",
    "utility_bar",
    "top_bar",
    "sidebar",
    "hero",
    "landing",
    "alert_banners",
    "metrics",
    "partner_metrics",
    "kpi_snapshot",
    "global_stats",
    "quick_actions",
    "quick_links",
    "quick_actions_sidebar",
  ]);

  const dynamicUiSections = Object.entries(ui).filter(
    ([key, value]) =>
      !HANDLED_UI_KEYS.has(key) && value !== undefined && value !== null,
  );

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(prompt);
    setTimeout(() => setCopiedPrompt(null), 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28">
      {/* 1. OPTIONAL TOP UTILITY BAR */}
      {(ui.utility_bar || ui.top_bar) && (
        <div className="bg-slate-900 text-slate-300 text-xs border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 truncate">
              {ui.utility_bar?.skip_link && (
                <span>{ui.utility_bar.skip_link}</span>
              )}
              {ui.top_bar?.whatsapp_support && (
                <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                  <Phone className="w-3.5 h-3.5" />
                  {ui.top_bar.whatsapp_support}
                </span>
              )}
              {ui.top_bar?.complaints && <span>{ui.top_bar.complaints}</span>}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {ui.utility_bar?.helpline && (
                <span className="font-mono text-slate-200">
                  Helpline: {ui.utility_bar.helpline}
                </span>
              )}
              {Array.isArray(ui.utility_bar?.font_controls) && (
                <div className="flex items-center gap-1">
                  {ui.utility_bar.font_controls.map((ctrl: string) => (
                    <span
                      key={ctrl}
                      className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200"
                    >
                      {ctrl}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. GENERIC STICKY HEADER */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
              <DynamicIcon
                name={header.logo_icon || assistantInfo.avatar_icon}
                className="w-5 h-5"
              />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-base sm:text-lg truncate">
                  {header.brand ||
                    header.company ||
                    agent.brand_name ||
                    agent.page_title}
                </h1>
                {(header.badge || header.portal) && (
                  <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    {header.badge || header.portal}
                  </span>
                )}
              </div>
              {(header.subtitle || header.tagline || agent.route) && (
                <p className="text-xs text-slate-500 truncate">
                  {header.subtitle || header.tagline || agent.page_title}
                </p>
              )}
            </div>
          </div>

          {/* Navigation Links (if present) */}
          {Array.isArray(header.nav_links || header.nav_sections) && (
            <nav className="hidden lg:flex items-center gap-1">
              {(header.nav_links || header.nav_sections)
                .slice(0, 6)
                .map((item: any, idx: number) => {
                  const label = typeof item === "string" ? item : item.label;
                  const active = typeof item === "object" && item.active;
                  return (
                    <span
                      key={idx}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? "bg-slate-900 text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {label}
                    </span>
                  );
                })}
            </nav>
          )}

          {/* Right User / Weather / Status Pill */}
          <div className="flex items-center gap-3 shrink-0">
            {header.weather && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-medium text-slate-700">
                <DynamicIcon
                  name={header.weather.icon || "Globe"}
                  className="w-4 h-4"
                />
                <span>{header.weather.temperature}</span>
                <span className="text-slate-400">•</span>
                <span>{header.weather.condition}</span>
              </div>
            )}

            {header.notifications?.unread && (
              <div className="relative p-2 rounded-lg bg-slate-100 text-slate-700">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {header.notifications.count ||
                    header.notifications.alert_count ||
                    1}
                </span>
              </div>
            )}

            {(header.user || header.member || header.customer) && (
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                  {header.user?.initials ||
                    (
                      header.user?.name ||
                      header.member?.name ||
                      header.customer ||
                      "U"
                    )
                      .slice(0, 2)
                      .toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-slate-900 leading-none">
                    {header.user?.name ||
                      header.member?.name ||
                      header.customer}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {header.user?.role ||
                      header.user?.account_summary ||
                      header.member?.member_id ||
                      header.customer_id ||
                      "Verified Session"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
        {/* 3. CRITICAL ALERT BANNERS */}
        {alertBanners.length > 0 && (
          <div className="space-y-3">
            {alertBanners.map((alert: any, idx: number) => (
              <div
                key={alert.id || idx}
                className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-600 text-white">
                        {alert.severity || alert.type || "ALERT"}
                      </span>
                      {alert.invoice_id && (
                        <span className="text-sm font-bold text-rose-950">
                          {alert.invoice_id}
                        </span>
                      )}
                      {alert.amount && (
                        <span className="text-sm font-semibold text-rose-800">
                          • {alert.amount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-rose-900 mt-1">
                      {alert.message ||
                        `${alert.type} — Issued ${alert.issue_date || ""} (${
                          alert.days_overdue
                            ? `${alert.days_overdue} days overdue`
                            : ""
                        })`}
                    </p>
                  </div>
                </div>
                {alert.cta && (
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shrink-0 transition-colors"
                  >
                    {typeof alert.cta === "string"
                      ? alert.cta
                      : alert.cta.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 4. UNIFIED HERO & AI ASSISTANT BANNER */}
        <section className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-sm border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Page / Hero Overview */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {hero.badge ||
                    hero.eyebrow ||
                    assistantInfo.status_text ||
                    `${agent.function?.toUpperCase()} AGENT`}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {hero.headline ||
                  hero.service_tagline ||
                  header.user?.greeting ||
                  agent.page_title}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                {hero.description ||
                  hero.subheadline ||
                  hero.tagline ||
                  summary}
              </p>

              {/* Hero Highlights / Trust Badges */}
              {Array.isArray(hero.highlights) && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {hero.highlights.map((item: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-xs text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {(hero.trust_indicator ||
                hero.trust_badge ||
                hero.venue_name ||
                hero.depot_status) && (
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    {hero.trust_indicator ||
                      hero.trust_badge ||
                      hero.venue_name ||
                      hero.depot_status}
                  </span>
                </div>
              )}
            </div>

            {/* Right Column: Assistant Profile & Starter Prompts */}
            <div className="lg:col-span-5 rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                    <DynamicIcon
                      name={assistantInfo.avatar_icon || "Bot"}
                      className="w-6 h-6"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm sm:text-base">
                      {assistantInfo.name || agent.hover_tooltip}
                    </h3>
                    <p className="text-xs text-slate-300">
                      {assistantInfo.role || "AI Virtual Specialist"}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium">
                  {agent.function}
                </span>
              </div>

              {/* Starter Prompts (if available) */}
              {Array.isArray(assistantInfo.suggested_prompts) &&
                assistantInfo.suggested_prompts.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                      Try asking the assistant (Click to copy)
                    </p>
                    <div className="space-y-1.5">
                      {assistantInfo.suggested_prompts.map(
                        (prompt: string, idx: number) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleCopyPrompt(prompt)}
                            className="w-full text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 flex items-center justify-between gap-2 transition-colors group"
                          >
                            <span className="truncate">
                              &ldquo;{prompt}&rdquo;
                            </span>
                            {copiedPrompt === prompt ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-white shrink-0" />
                            )}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </section>

        {/* 5. GENERIC KPI / METRICS GRID */}
        {metrics.length > 0 && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {metrics.map((metric: any, idx: number) => (
              <div
                key={metric.id || idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-start justify-between gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-slate-900">
                    {metric.value}
                  </p>
                  {(metric.subtext || metric.trend || metric.change) && (
                    <p className="text-xs font-medium text-slate-600">
                      {metric.subtext || metric.trend || metric.change}
                    </p>
                  )}
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 shadow-xs">
                  <DynamicIcon
                    name={metric.icon || "TrendingUp"}
                    className="w-5 h-5"
                  />
                </div>
              </div>
            ))}
          </section>
        )}

        {/* 6. GENERIC QUICK ACTIONS BAR */}
        {quickActions.length > 0 && (
          <section className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
              {quickActions.map((action: any, idx: number) => {
                const label =
                  typeof action === "string" ? action : action.label;
                const desc =
                  typeof action === "object" ? action.description : undefined;
                const icon =
                  typeof action === "object" ? action.icon : "Sparkles";
                return (
                  <button
                    key={action.id || idx}
                    type="button"
                    className="flex flex-col items-start p-4 rounded-xl border border-slate-200/80 hover:border-slate-400 hover:bg-slate-50/80 transition-all text-left group shadow-2xs hover:shadow-xs"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-700 flex items-center justify-center mb-2.5 transition-colors shadow-2xs">
                      <DynamicIcon name={icon} className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-900">
                      {label}
                    </span>
                    {desc && (
                      <span className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {desc}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* 7. DYNAMIC UI SECTIONS (Auto-renders arrays of objects, primitives, or forms) */}
        {dynamicUiSections.map(([sectionKey, sectionValue]) => {
          // A. Array of items (Cards, Tables, Slides, Policies, Invoices, Transactions)
          if (Array.isArray(sectionValue) && sectionValue.length > 0) {
            // Array of strings (e.g., features, evaluation_metrics, available_slots)
            if (sectionValue.every(isPrimitive)) {
              return (
                <section
                  key={sectionKey}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs"
                >
                  <h3 className="text-base font-bold text-slate-900 mb-4">
                    {formatKeyLabel(sectionKey)}
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {sectionValue.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                        {String(item)}
                      </span>
                    ))}
                  </div>
                </section>
              );
            }

            // Interactive Tabbed Selector if items have `pan_masked` or `selected`
            if (sectionKey === "pan_selector") {
              const selectedPan =
                sectionValue[activeTabIndex] || sectionValue[0];
              return (
                <section
                  key={sectionKey}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-base font-bold text-slate-900">
                      Portfolio Account Selector
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {sectionValue.map((tab: any, idx: number) => (
                        <button
                          key={tab.id || idx}
                          type="button"
                          onClick={() => setActiveTabIndex(idx)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                            idx === activeTabIndex
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {selectedPan && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                      {Object.entries(selectedPan)
                        .filter(([k]) => !["id", "label", "active"].includes(k))
                        .map(([k, v]) => (
                          <div
                            key={k}
                            className="p-4 rounded-xl bg-slate-50 border border-slate-200"
                          >
                            <p className="text-xs text-slate-500">
                              {formatKeyLabel(k)}
                            </p>
                            <p className="text-base font-bold text-slate-900 mt-1">
                              {String(v)}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                </section>
              );
            }

            // General Array of Objects -> Render Responsive Card Grid
            return (
              <section
                key={sectionKey}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    {formatKeyLabel(sectionKey)}
                  </h3>
                  <span className="text-xs font-medium text-slate-500">
                    {sectionValue.length} items
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sectionValue.map(
                    (item: Record<string, any>, idx: number) => {
                      const primaryTitle =
                        item.title ||
                        item.name ||
                        item.label ||
                        item.headline ||
                        item.product ||
                        item.crop ||
                        item.dish ||
                        item.program ||
                        item.route ||
                        item.metric ||
                        item.id ||
                        item.case_id ||
                        item.order_id ||
                        `Item #${idx + 1}`;

                      const badgeText =
                        item.status ||
                        item.badge ||
                        item.priority ||
                        item.difficulty ||
                        item.tag ||
                        item.category ||
                        item.rate ||
                        item.amount ||
                        item.price ||
                        item.price_range ||
                        item.starting_fare;

                      const IGNORED_KEYS = new Set([
                        "id",
                        "title",
                        "name",
                        "label",
                        "headline",
                        "product",
                        "crop",
                        "dish",
                        "program",
                        "route",
                        "metric",
                        "status",
                        "badge",
                        "priority",
                        "difficulty",
                        "tag",
                        "category",
                        "rate",
                        "amount",
                        "price",
                        "price_range",
                        "starting_fare",
                        "icon",
                        "status_badge",
                        "status_color",
                        "theme_color",
                        "download_url",
                        "is_debit",
                        "is_bill",
                        "selected",
                        "active",
                      ]);

                      const detailEntries = Object.entries(item).filter(
                        ([k, v]) =>
                          !IGNORED_KEYS.has(k) &&
                          v !== undefined &&
                          v !== null &&
                          v !== "",
                      );

                      return (
                        <div
                          key={item.id || item.case_id || idx}
                          className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between gap-3"
                        >
                          <div className="space-y-2.5">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                {item.icon && (
                                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                                    <DynamicIcon
                                      name={item.icon}
                                      className="w-4 h-4"
                                    />
                                  </div>
                                )}
                                <h4 className="font-semibold text-slate-900 text-sm">
                                  {primaryTitle}
                                </h4>
                              </div>
                              {badgeText && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200/80 text-slate-800 shrink-0">
                                  {badgeText}
                                </span>
                              )}
                            </div>

                            {/* Render remaining key-value details cleanly */}
                            <div className="space-y-1.5 text-xs text-slate-600">
                              {detailEntries.map(([k, v]) => {
                                if (Array.isArray(v)) {
                                  return (
                                    <div key={k} className="pt-1">
                                      <span className="text-[11px] font-medium text-slate-400 block mb-1">
                                        {formatKeyLabel(k)}
                                      </span>
                                      <div className="flex flex-wrap gap-1.5">
                                        {v.map((subItem, sIdx) => (
                                          <span
                                            key={sIdx}
                                            className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] text-slate-700"
                                          >
                                            {typeof subItem === "string"
                                              ? subItem
                                              : subItem.label ||
                                                JSON.stringify(subItem)}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                }

                                if (
                                  k === "description" ||
                                  k === "sub" ||
                                  k === "subtitle" ||
                                  k === "highlight" ||
                                  k === "key_benefit" ||
                                  k === "tagline" ||
                                  k === "focus"
                                ) {
                                  return (
                                    <p
                                      key={k}
                                      className="text-xs text-slate-600 leading-relaxed"
                                    >
                                      {String(v)}
                                    </p>
                                  );
                                }

                                return (
                                  <div
                                    key={k}
                                    className="flex items-center justify-between gap-2 py-0.5 border-b border-slate-100 last:border-0"
                                  >
                                    <span className="text-slate-500">
                                      {formatKeyLabel(k)}
                                    </span>
                                    <span className="font-medium text-slate-800 text-right">
                                      {isPrimitive(v)
                                        ? String(v)
                                        : JSON.stringify(v)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </section>
            );
          }

          // B. Single Structured Object (e.g. login_card, callback_form, card_showcase, main_card, standby_card)
          if (
            typeof sectionValue === "object" &&
            !Array.isArray(sectionValue)
          ) {
            const obj = sectionValue as Record<string, any>;
            return (
              <section
                key={sectionKey}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"
              >
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">
                    {obj.title ||
                      obj.headline ||
                      obj.header ||
                      formatKeyLabel(sectionKey)}
                  </h3>
                  {(obj.subtitle ||
                    obj.description ||
                    obj.subtext ||
                    obj.prompt_hint) && (
                    <p className="text-xs text-slate-500 mt-1">
                      {obj.subtitle ||
                        obj.description ||
                        obj.subtext ||
                        obj.prompt_hint}
                    </p>
                  )}
                </div>

                {/* Form Fields or Login Steps */}
                {/* {Array.isArray(obj.fields || obj.steps) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                    {(obj.fields || obj.steps).map((field: any, fIdx: number) => (
                      <div key={fIdx} className="space-y-1.5">
                        <label className="block text-xs font-medium text-slate-700">
                          {field.label || `Step ${field.step}`}
                        </label>
                        <input
                          type={field.type || 'text'}
                          placeholder={field.placeholder || field.label}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    ))}
                  </div>
                )} */}

                {/* Other key-value properties on the object */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(obj)
                    .filter(
                      ([k]) =>
                        ![
                          "title",
                          "headline",
                          "header",
                          "subtitle",
                          "description",
                          "subtext",
                          "prompt_hint",
                          "fields",
                          "steps",
                          "cta",
                          "trigger_button",
                        ].includes(k),
                    )
                    .map(([k, v]) => (
                      <div
                        key={k}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80"
                      >
                        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                          {formatKeyLabel(k)}
                        </p>
                        <div className="text-xs font-semibold text-slate-800 mt-1">
                          {Array.isArray(v)
                            ? v
                                .map((item) =>
                                  typeof item === "string"
                                    ? item
                                    : item.label || JSON.stringify(item),
                                )
                                .join(" • ")
                            : isPrimitive(v)
                              ? String(v)
                              : JSON.stringify(v)}
                        </div>
                      </div>
                    ))}
                </div>

                {(obj.cta || obj.trigger_button) && (
                  <div className="pt-2">
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                    >
                      {typeof obj.cta === "string"
                        ? obj.cta
                        : obj.cta?.label ||
                          obj.trigger_button?.label ||
                          "Continue"}
                    </button>
                  </div>
                )}
              </section>
            );
          }

          return null;
        })}

        {/* 8. FALLBACK RENDERER FOR ORIGINAL `page_content.sections` SCHEMA */}
        {dynamicUiSections.length === 0 && legacySections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {legacySections.map((section: any, sIdx: number) => (
              <section
                key={sIdx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"
              >
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2.5">
                  {section.title}
                </h3>
                <div className="space-y-3">
                  {Array.isArray(section.items) &&
                    section.items.map((item: any, iIdx: number) => {
                      const title =
                        item.label ||
                        item.title ||
                        item.headline ||
                        item.name ||
                        item.type ||
                        item.id;
                      const val =
                        item.value ??
                        item.amount ??
                        item.description ??
                        item.sub ??
                        item.tagline ??
                        item.product;

                      return (
                        <div
                          key={iIdx}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col gap-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            {title && (
                              <span className="text-xs font-semibold text-slate-800">
                                {title}
                              </span>
                            )}
                            {(item.status ||
                              item.trend ||
                              item.date ||
                              item.valid_until) && (
                              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                                {item.status ||
                                  item.trend ||
                                  item.date ||
                                  item.valid_until}
                              </span>
                            )}
                          </div>
                          {val !== undefined && (
                            <div className="text-xs text-slate-600">
                              {isPrimitive(val)
                                ? String(val)
                                : Array.isArray(val)
                                  ? val
                                      .map((v) =>
                                        isPrimitive(v)
                                          ? String(v)
                                          : v.type ||
                                            v.label ||
                                            JSON.stringify(v),
                                      )
                                      .join(" • ")
                                  : typeof val === "object" && val !== null
                                    ? Object.entries(val)
                                        .map(
                                          ([k, v]) =>
                                            `${formatKeyLabel(k)}: ${v}`,
                                        )
                                        .join(" | ")
                                    : ""}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
