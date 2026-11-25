export interface DashboardFilters {
  projectId: string;
  from: string;
  to: string;
}

export interface DashboardProject {
  id: string;
  name: string;
  createdAt: string;
}

export interface DashboardOverview {
  totalCalls: number;
  callsCompleted: number;
  callsFailed: number;
  callsQueued: number;
  callsInitiated: number;
  callsInProgress: number;
}

export interface CallsByDayPoint {
  date: string;
  calls: number;
}

export interface DashboardCampaign {
  projectId: string;
  projectName: string;
  campaignName: string;
  lastCampaignRun: string | null;
  totalCalls: number;
  callsCompleted: number;
  callsFailed: number;
}

export interface DashboardData {
  overview: DashboardOverview;
  callsByDay: CallsByDayPoint[];
  campaigns: DashboardCampaign[];
}
