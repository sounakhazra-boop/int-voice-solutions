---
version: 1
slug: "app-vyom-dashboard-page-tsx"
primary_target: "app/vyom/dashboard/page.tsx"
related_targets: []
---

Scope: `/vyom/dashboard`, a new VYOM dashboard route. Mode: Operate.

Audience: Operations/admin teams monitoring calls and campaign-like call groups.
Task: Filter by project/use case and call creation date; review totals, statuses, daily call volume, and derived company/project groups.
Actions: Apply, reset, and refresh filters. Campaign groups are read-only; do not imply that campaigns can be started.
Data: Use only the dashboard API's supported values. Omit cost, transferred, connected, and voicemail metrics because they are unavailable. Keep API failures, loading, empty, and invalid-date-range states clear.
Constraints: Reuse the existing `NEXT_PUBLIC_API_URL`; honor the seven-day default and 366-day maximum; preserve call behavior and keep the existing VYOM identity.
Unresolved: None from the confirmed request.

## Direction contract

THESIS: Put operational call evidence at the center of the page and let filters answer a specific question. Refuse simulated totals and campaign controls that the backend cannot support.
OWN-WORLD: Extend VYOM's established neutral surfaces, compact typography, clear separators, and indigo reserved for primary actions. Use restrained status colors only where they encode call state.
STORY: Choose a project and time window, scan the scale and status of calls, compare daily activity, then inspect read-only company/project groups.
FIRST VIEWPORT: Keep the Dashboard title and project/date filters together at the top. Place supported count summaries below; put the daily call chart beside a status distribution; continue with a full-width campaign-like group table.
FORM: Use the user-provided dashboard screenshot as the layout reference, adapted to truthful API data and the established VYOM identity. Pinned by the request to “achive this page” with the attached image. seed: none (pinned).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
