'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CallLogs } from './CallLogs';
import type { CallStatus, CallViewMode } from './types';

function CallsPageContent({
  authEmail,
  baseUrl,
}: {
  authEmail?: string;
  baseUrl?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawView = searchParams.get('view');
  const view: CallViewMode = rawView === 'mine' ? 'mine' : 'all';
  const rawStatus = searchParams.get('status');
  const status: CallStatus =
    rawStatus === 'completed' ||
    rawStatus === 'initiated' ||
    rawStatus === 'queued' ||
    rawStatus === 'failed'
      ? rawStatus
      : 'all';

  return (
    <CallLogs
      baseUrl={baseUrl}
      authEmail={authEmail || searchParams.get('authEmail') || undefined}
      view={view}
      status={status}
      onClose={() => router.push('/')}
    />
  );
}

export default function CallsPage({
  authEmail,
  baseUrl,
}: {
  authEmail?: string;
  baseUrl?: string;
}) {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-zinc-500">Loading call logs…</div>}>
      <CallsPageContent authEmail={authEmail} baseUrl={baseUrl} />
    </Suspense>
  );
}
