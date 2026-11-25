'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchCallLogs } from '../api';
import type { CallLog, CallStatus, CallViewMode } from '../types';

export function useCallLogs({
  baseUrl,
  authEmail,
  viewMode,
  status,
}: {
  baseUrl?: string;
  authEmail?: string;
  viewMode: CallViewMode;
  status: CallStatus;
}) {
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setLogs(await fetchCallLogs({ baseUrl, authEmail, viewMode, status }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Failed to load call logs.');
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authEmail, viewMode, status]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { logs, loading, error, refresh };
}
