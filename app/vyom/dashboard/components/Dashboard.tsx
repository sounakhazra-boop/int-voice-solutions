"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  CalendarDays,
  ChevronDown,
  Clock3,
  RefreshCw,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import {
  fetchCallsByDay,
  fetchDashboardCampaigns,
  fetchDashboardOverview,
  fetchDashboardProjects,
} from "../api";
import type {
  CallsByDayPoint,
  DashboardCampaign,
  DashboardData,
  DashboardFilters,
  DashboardOverview,
  DashboardProject,
} from "../types";

const EMPTY_FILTERS: DashboardFilters = { projectId: "", from: "", to: "" };

const STATUS_COLORS = {
  completed: "#568675",
  failed: "#bd6d6c",
  queued: "#c4964e",
  initiated: "#7589a7",
  inProgress: "#6d9a9b",
};
type StatusKey = keyof typeof STATUS_COLORS;
type StatusItem = { key: StatusKey; label: string; value: number };

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatShortDate(value: string): string {
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDateTime(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong while loading dashboard data.";
}

function validateDateRange(filters: DashboardFilters): string | null {
  if (Boolean(filters.from) !== Boolean(filters.to)) {
    return "Choose both dates, or leave both blank for the most recent seven days.";
  }
  if (!filters.from || !filters.to) return null;

  const from = Date.parse(`${filters.from}T00:00:00Z`);
  const to = Date.parse(`${filters.to}T00:00:00Z`);
  if (Number.isNaN(from) || Number.isNaN(to)) {
    return "Enter valid start and end dates.";
  }
  if (from > to) return "The start date must be on or before the end date.";
  if (Math.floor((to - from) / 86_400_000) + 1 > 366) {
    return "Choose a date range of 366 days or less.";
  }
  return null;
}

function dateRangeLabel(filters: DashboardFilters): string {
  if (filters.from && filters.to) {
    return `${formatShortDate(filters.from)} – ${formatShortDate(filters.to)}`;
  }
  if (filters.from) return `From ${formatShortDate(filters.from)}`;
  if (filters.to) return `Through ${formatShortDate(filters.to)}`;
  return "Most recent 7 days";
}

function Metric({
  label,
  value,
  detail,
  statusColor,
}: {
  label: string;
  value: number;
  detail: string;
  statusColor?: string;
}) {
  return (
    <div className="min-w-0 bg-white p-4 sm:p-5">
      <p className="flex items-center gap-2 text-sm font-medium text-stone-600">
        {statusColor && (
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: statusColor }}
          />
        )}
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-stone-950 sm:text-[2rem]">
        {formatCount(value)}
      </p>
      <p className="mt-1.5 text-xs text-stone-500">{detail}</p>
    </div>
  );
}

function CallActivityChart({
  points,
  range,
}: {
  points: CallsByDayPoint[];
  range: string;
}) {
  return (
    <section className="rounded-xl border border-stone-300 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-stone-950">
            Call volume
          </h2>
          <p className="mt-1 text-sm text-stone-500">{range}</p>
        </div>
        <span className="text-xs text-stone-500">By call creation date</span>
      </div>

      <div
        className="mt-5 h-64 min-w-0"
        role="img"
        aria-label={`Daily call counts for ${range}`}
      >
        {points.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-stone-500">
            No daily call data for this range.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={points}
              margin={{ top: 8, right: 4, bottom: 0, left: -18 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="#e7e5e4"
                strokeDasharray="3 4"
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatShortDate}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#78716c", fontSize: 12 }}
                minTickGap={18}
                dy={8}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#78716c", fontSize: 12 }}
                width={36}
              />
              <Tooltip
                cursor={{ fill: "#f5f5f4" }}
                labelFormatter={(label) =>
                  typeof label === "string" ? formatShortDate(label) : label
                }
                formatter={(value) => [
                  `${formatCount(Number(value))} calls`,
                  "",
                ]}
                contentStyle={{
                  border: "1px solid #d6d3d1",
                  borderRadius: "10px",
                  boxShadow: "0 8px 20px rgba(28, 25, 23, 0.1)",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="calls"
                fill="#565d80"
                radius={[6, 6, 0, 0]}
                maxBarSize={44}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}

function StatusDistribution({ overview }: { overview: DashboardOverview }) {
  const statuses: StatusItem[] = [
    { key: "completed", label: "Completed", value: overview.callsCompleted },
    { key: "failed", label: "Failed", value: overview.callsFailed },
    { key: "queued", label: "Queued", value: overview.callsQueued },
    { key: "initiated", label: "Initiated", value: overview.callsInitiated },
    {
      key: "inProgress",
      label: "In progress",
      value: overview.callsInProgress,
    },
  ];
  const chartData = statuses.filter((status) => status.value > 0);
  const pieData: Array<StatusItem | { key: "empty"; label: string; value: 1 }> =
    chartData.length > 0
      ? chartData
      : [{ key: "empty", label: "No calls", value: 1 }];

  return (
    <section className="rounded-xl border border-stone-300 bg-white p-5 sm:p-6">
      <div>
        <h2 className="text-base font-semibold text-stone-950">
          Status breakdown
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Outcomes in the selected period
        </p>
      </div>
      <div className="relative mx-auto mt-3 h-48 w-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="label"
              innerRadius="72%"
              outerRadius="92%"
              paddingAngle={chartData.length > 1 ? 2 : 0}
              stroke="none"
            >
              {pieData.map((status) => (
                <Cell
                  key={status.key}
                  fill={
                    status.key === "empty"
                      ? "#e7e5e4"
                      : STATUS_COLORS[status.key]
                  }
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCount(Number(value))}
              contentStyle={{
                border: "1px solid #d6d3d1",
                borderRadius: "10px",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-stone-500">Total calls</span>
          <span className="mt-1 text-2xl font-semibold tabular-nums text-stone-950">
            {formatCount(overview.totalCalls)}
          </span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
        {statuses.map((status) => (
          <div
            key={status.key}
            className="flex min-w-0 items-center justify-between gap-2 border-t border-stone-200 pt-2"
          >
            <span className="flex min-w-0 items-center gap-2 text-xs text-stone-600">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{
                  backgroundColor:
                    STATUS_COLORS[status.key as keyof typeof STATUS_COLORS],
                }}
              />
              <span className="truncate">{status.label}</span>
            </span>
            <span className="text-sm font-semibold tabular-nums text-stone-900">
              {formatCount(status.value)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function CampaignTable({ campaigns }: { campaigns: DashboardCampaign[] }) {
  return (
    <section className="rounded-xl border border-stone-300 bg-white">
      <div className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-stone-950">
            Campaign groups
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Derived from call activity · grouped by company and project
          </p>
        </div>
        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
          {campaigns.length} {campaigns.length === 1 ? "group" : "groups"}
        </span>
      </div>

      {campaigns.length === 0 ? (
        <div className="border-t border-stone-200 px-5 py-12 text-center sm:px-6">
          <p className="text-sm font-medium text-stone-800">
            No call groups found
          </p>
          <p className="mt-1 text-sm text-stone-500">
            Try changing the selected project or date range.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border-t border-stone-200">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-stone-50 text-[11px] font-semibold uppercase tracking-wide text-stone-500">
              <tr>
                <th scope="col" className="px-5 py-3 sm:px-6">
                  Company
                </th>
                <th scope="col" className="px-4 py-3">
                  Project
                </th>
                <th scope="col" className="px-4 py-3">
                  Last call
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Calls
                </th>
                <th scope="col" className="px-4 py-3 text-right">
                  Completed
                </th>
                <th scope="col" className="px-5 py-3 text-right sm:px-6">
                  Failed
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {campaigns.map((campaign, index) => (
                <tr
                  key={`${campaign.projectId}-${campaign.campaignName}-${index}`}
                  className="text-stone-700 transition-colors hover:bg-stone-50/80"
                >
                  <td className="px-5 py-4 font-medium text-stone-950 sm:px-6">
                    {campaign.campaignName}
                  </td>
                  <td className="px-4 py-4">{campaign.projectName}</td>
                  <td className="px-4 py-4 text-stone-600">
                    {formatDateTime(campaign.lastCampaignRun)}
                  </td>
                  <td className="px-4 py-4 text-right tabular-nums">
                    {formatCount(campaign.totalCalls)}
                  </td>
                  <td className="px-4 py-4 text-right tabular-nums">
                    <span className="font-medium text-[#477561]">
                      {formatCount(campaign.callsCompleted)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums sm:px-6">
                    <span className="font-medium text-[#a95555]">
                      {formatCount(campaign.callsFailed)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function Dashboard() {
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [draftFilters, setDraftFilters] =
    useState<DashboardFilters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<DashboardFilters>(EMPTY_FILTERS);
  const [data, setData] = useState<DashboardData | null>(null);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [projectRefreshVersion, setProjectRefreshVersion] = useState(0);

  const filterError = useMemo(
    () => validateDateRange(draftFilters),
    [draftFilters],
  );
  const rangeLabel = dateRangeLabel(appliedFilters);

  useEffect(() => {
    let active = true;
    fetchDashboardProjects()
      .then((result) => {
        if (active) setProjects(result);
      })
      .catch((cause: unknown) => {
        if (active) setProjectsError(getErrorMessage(cause));
      })
      .finally(() => {
        if (active) setIsLoadingProjects(false);
      });
    return () => {
      active = false;
    };
  }, [projectRefreshVersion]);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetchDashboardOverview(appliedFilters),
      fetchCallsByDay(appliedFilters),
      fetchDashboardCampaigns(appliedFilters),
    ])
      .then(([overview, callsByDay, campaigns]) => {
        if (active) setData({ overview, callsByDay, campaigns });
      })
      .catch((cause: unknown) => {
        if (active) setError(getErrorMessage(cause));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [appliedFilters, refreshVersion]);

  const updateDraftFilter = useCallback(
    (key: keyof DashboardFilters, value: string) => {
      setDraftFilters((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const applyFilters = () => {
    if (filterError) return;
    setIsLoading(true);
    setError(null);
    if (
      draftFilters.projectId === appliedFilters.projectId &&
      draftFilters.from === appliedFilters.from &&
      draftFilters.to === appliedFilters.to
    ) {
      setRefreshVersion((version) => version + 1);
      return;
    }
    setAppliedFilters({ ...draftFilters });
  };

  const resetFilters = () => {
    setDraftFilters(EMPTY_FILTERS);
    setIsLoading(true);
    setError(null);
    if (
      appliedFilters.projectId === "" &&
      appliedFilters.from === "" &&
      appliedFilters.to === ""
    ) {
      setRefreshVersion((version) => version + 1);
      return;
    }
    setAppliedFilters(EMPTY_FILTERS);
  };

  const retry = () => {
    setIsLoading(true);
    setError(null);
    setRefreshVersion((version) => version + 1);
    if (projectsError) {
      setIsLoadingProjects(true);
      setProjectsError(null);
      setProjectRefreshVersion((version) => version + 1);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-950">
      <header className="border-b border-stone-300 bg-white">
        <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link
            href="/vyom"
            className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-950 text-xs font-bold tracking-tight text-white">
              INT.
            </span>
            <span className="flex items-center gap-3">
              <span className="text-sm font-semibold tracking-tight text-stone-950">
                INT Voice Solutions
              </span>
              <span className="hidden h-5 w-px bg-stone-300 sm:block" />
              <span className="hidden text-xs font-semibold tracking-[0.12em] text-stone-500 sm:block">
                VYOM
              </span>
            </span>
          </Link>
          <nav
            aria-label="VYOM navigation"
            className="flex items-center gap-1 text-sm"
          >
            <Link
              href="/vyom"
              className="rounded-md px-3 py-2 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              VYOM
            </Link>
            <span
              aria-current="page"
              className="rounded-md border-b-2 border-stone-950 px-3 py-2 font-semibold text-stone-950"
            >
              Dashboard
            </span>
            <Link
              href="/vyom/call"
              className="rounded-md px-3 py-2 text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              Call logs
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-7 px-5 py-7 sm:px-8 sm:py-9">
        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.03em] text-stone-950 sm:text-4xl">
                Dashboard
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">
                Call volume and outcomes, organized around your projects.
              </p>
            </div>
            <p className="flex items-center gap-2 text-xs text-stone-500">
              <Clock3 aria-hidden="true" className="h-4 w-4" />
              Data reflects call creation time
            </p>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              applyFilters();
            }}
            className="grid gap-3 rounded-xl border border-stone-300 bg-white p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-[minmax(200px,1.25fr)_minmax(150px,1fr)_minmax(150px,1fr)_auto] lg:items-end"
          >
            <label className="flex min-w-0 flex-col gap-1.5 text-xs font-medium text-stone-600">
              Project
              <span className="relative">
                <select
                  value={draftFilters.projectId}
                  onChange={(event) =>
                    updateDraftFilter("projectId", event.target.value)
                  }
                  disabled={isLoadingProjects || Boolean(projectsError)}
                  className="h-11 w-full appearance-none rounded-lg border border-stone-300 bg-stone-50 pl-3 pr-9 text-sm text-stone-900 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 disabled:bg-stone-100 disabled:text-stone-500"
                >
                  <option value="">
                    {isLoadingProjects ? "Loading projects…" : "All projects"}
                  </option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500"
                />
              </span>
            </label>

            <label className="flex min-w-0 flex-col gap-1.5 text-xs font-medium text-stone-600">
              From date
              <span className="relative">
                <CalendarDays
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500"
                />
                <input
                  type="date"
                  value={draftFilters.from}
                  onChange={(event) =>
                    updateDraftFilter("from", event.target.value)
                  }
                  className="h-11 w-full rounded-lg border border-stone-300 bg-stone-50 pl-9 pr-3 text-sm text-stone-900 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20"
                />
              </span>
            </label>

            <label className="flex min-w-0 flex-col gap-1.5 text-xs font-medium text-stone-600">
              To date
              <span className="relative">
                <CalendarDays
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500"
                />
                <input
                  type="date"
                  value={draftFilters.to}
                  onChange={(event) =>
                    updateDraftFilter("to", event.target.value)
                  }
                  className="h-11 w-full rounded-lg border border-stone-300 bg-stone-50 pl-9 pr-3 text-sm text-stone-900 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20"
                />
              </span>
            </label>

            <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
              <button
                type="submit"
                disabled={Boolean(filterError) || isLoading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
              >
                <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
                Reset
              </button>
              <button
                type="button"
                onClick={retry}
                disabled={isLoading || isLoadingProjects}
                aria-label="Refresh dashboard"
                title="Refresh dashboard"
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-stone-300 bg-white text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </form>
        </section>

        {(filterError || projectsError) && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          >
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{filterError || projectsError}</span>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          >
            <span>
              {data ? `${error} Showing the last successful results.` : error}
            </span>
            <button
              type="button"
              onClick={retry}
              className="font-semibold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-700"
            >
              Retry
            </button>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 text-sm text-stone-600">
          <p>
            <span className="font-medium text-stone-900">
              {projects.find(
                (project) => project.id === appliedFilters.projectId,
              )?.name || "All projects"}
            </span>
            <span className="mx-2 text-stone-400">·</span>
            {rangeLabel}
          </p>
        </div>

        {data ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-stone-700">
                Call summary
              </h2>
              <span className="text-xs text-stone-500">
                {isLoading ? "Updating…" : "Tracked outcomes"}
              </span>
            </div>
            <section
              aria-label="Call summary"
              className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-stone-300 bg-stone-200 sm:grid-cols-4"
            >
              <Metric
                label="Total calls"
                value={data.overview.totalCalls}
                detail="In selected period"
              />
              <Metric
                label="Completed"
                value={data.overview.callsCompleted}
                detail="Status: completed"
                statusColor={STATUS_COLORS.completed}
              />
              <Metric
                label="Failed"
                value={data.overview.callsFailed}
                detail="Status: failed"
                statusColor={STATUS_COLORS.failed}
              />
              <Metric
                label="Queued"
                value={data.overview.callsQueued}
                detail="Waiting to start"
                statusColor={STATUS_COLORS.queued}
              />
            </section>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.9fr)]">
              <CallActivityChart points={data.callsByDay} range={rangeLabel} />
              <StatusDistribution overview={data.overview} />
            </div>

            <CampaignTable campaigns={data.campaigns} />
          </>
        ) : isLoading ? (
          <div
            aria-label="Loading dashboard data"
            className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.9fr)]"
          >
            <div className="h-[23rem] animate-pulse rounded-xl bg-stone-200" />
            <div className="h-[23rem] animate-pulse rounded-xl bg-stone-200" />
            <div className="h-72 animate-pulse rounded-xl bg-stone-200 lg:col-span-2" />
          </div>
        ) : (
          <div className="rounded-xl border border-stone-300 bg-white px-6 py-14 text-center">
            <Activity className="mx-auto h-6 w-6 text-stone-500" />
            <h2 className="mt-3 text-base font-semibold text-stone-950">
              Dashboard data is unavailable
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Check the API connection and try again.
            </p>
            <button
              type="button"
              onClick={retry}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        )}

        {data && isLoading && (
          <p className="sr-only" role="status">
            Refreshing dashboard data
          </p>
        )}
      </main>
    </div>
  );
}
