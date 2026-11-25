import type { CallLog, CallStatus, CallViewMode } from './types';

export const CALLS_API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export function getSiteFlag(hostname?: string): 'vyom' | 'vilok' {
  if (typeof window === 'undefined') {
    return hostname?.includes('vilok') ? 'vilok' : 'vyom';
  }
  return window.location.hostname.includes('vilok') ? 'vilok' : 'vyom';
}

export async function fetchCallLogs({
  baseUrl = CALLS_API_URL,
  viewMode = 'all',
  authEmail,
  status = 'all',
  hostname,
}: {
  baseUrl?: string;
  viewMode?: CallViewMode;
  authEmail?: string;
  status?: CallStatus;
  hostname?: string;
}): Promise<CallLog[]> {
  const params = new URLSearchParams({
    siteFlag: getSiteFlag(hostname),
  });

  if (viewMode === 'mine' && authEmail) {
    params.set('initiatedByEmail', authEmail);
  }
  if (status !== 'all') {
    params.set('status', status);
  }

  const response = await fetch(
    `${baseUrl.replace(/\/$/, '')}/api/prompts/calls?${params.toString()}`,
    { cache: 'no-store' },
  );
  if (!response.ok) {
    throw new Error(`Failed to load call logs (HTTP ${response.status})`);
  }

  const json = await response.json();
  return Array.isArray(json.data) ? json.data : [];
}
