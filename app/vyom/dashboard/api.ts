import { CALLS_API_URL } from "../call/api";
import type {
  CallsByDayPoint,
  DashboardCampaign,
  DashboardFilters,
  DashboardOverview,
  DashboardProject,
} from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function unwrapResponse(value: unknown): unknown {
  if (!isRecord(value)) return value;
  if (value.success === false) {
    throw new Error(
      typeof value.message === "string"
        ? value.message
        : "The dashboard API returned an unsuccessful response.",
    );
  }
  return "data" in value ? value.data : value;
}

async function request(path: string): Promise<unknown> {
  const response = await fetch(`${CALLS_API_URL.replace(/\/+$/, "")}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Dashboard request failed (HTTP ${response.status}).`);
  }

  return unwrapResponse(await response.json());
}

function withFilters(path: string, filters: DashboardFilters): string {
  const params = new URLSearchParams();
  if (filters.projectId) params.set("projectId", filters.projectId);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

function requireCount(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error(`The dashboard API returned an invalid ${key} count.`);
  }
  return value;
}

export async function fetchDashboardProjects(): Promise<DashboardProject[]> {
  const data = await request("/api/dashboard/projects");
  if (!Array.isArray(data)) {
    throw new Error("The dashboard API returned an invalid project list.");
  }

  return data.map((item) => {
    if (
      !isRecord(item) ||
      typeof item.id !== "string" ||
      typeof item.name !== "string" ||
      typeof item.createdAt !== "string"
    ) {
      throw new Error("The dashboard API returned an invalid project.");
    }

    return {
      id: item.id,
      name: item.name,
      createdAt: item.createdAt,
    };
  });
}

export async function fetchDashboardOverview(
  filters: DashboardFilters,
): Promise<DashboardOverview> {
  const data = await request(withFilters("/api/dashboard/overview", filters));
  if (!isRecord(data)) {
    throw new Error("The dashboard API returned an invalid overview.");
  }

  return {
    totalCalls: requireCount(data, "totalCalls"),
    callsCompleted: requireCount(data, "callsCompleted"),
    callsFailed: requireCount(data, "callsFailed"),
    callsQueued: requireCount(data, "callsQueued"),
    callsInitiated: requireCount(data, "callsInitiated"),
    callsInProgress: requireCount(data, "callsInProgress"),
  };
}

export async function fetchCallsByDay(
  filters: DashboardFilters,
): Promise<CallsByDayPoint[]> {
  const data = await request(
    withFilters("/api/dashboard/calls-by-day", filters),
  );
  if (!isRecord(data) || !Array.isArray(data.points)) {
    throw new Error("The dashboard API returned invalid daily call data.");
  }

  return data.points.map((point) => {
    if (
      !isRecord(point) ||
      typeof point.date !== "string" ||
      typeof point.calls !== "number" ||
      !Number.isFinite(point.calls) ||
      point.calls < 0
    ) {
      throw new Error(
        "The dashboard API returned an invalid daily call point.",
      );
    }

    return { date: point.date, calls: point.calls };
  });
}

export async function fetchDashboardCampaigns(
  filters: DashboardFilters,
): Promise<DashboardCampaign[]> {
  const data = await request(withFilters("/api/dashboard/campaigns", filters));
  if (!Array.isArray(data)) {
    throw new Error("The dashboard API returned an invalid campaign list.");
  }

  return data.map((item) => {
    if (
      !isRecord(item) ||
      typeof item.projectId !== "string" ||
      typeof item.projectName !== "string" ||
      typeof item.campaignName !== "string" ||
      (typeof item.lastCampaignRun !== "string" &&
        item.lastCampaignRun !== null)
    ) {
      throw new Error("The dashboard API returned an invalid campaign group.");
    }

    return {
      projectId: item.projectId,
      projectName: item.projectName,
      campaignName: item.campaignName,
      lastCampaignRun: item.lastCampaignRun,
      totalCalls: requireCount(item, "totalCalls"),
      callsCompleted: requireCount(item, "callsCompleted"),
      callsFailed: requireCount(item, "callsFailed"),
    };
  });
}
