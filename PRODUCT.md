# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Operations and admin teams monitoring VYOM call activity and campaign-like call groups.

## Product Purpose

INT Voice Solutions provides conversational AI experiences. VYOM supports voice use cases and lets teams review call activity and outcomes.

## Operating Context

Dashboard users select a project/use case and a call creation-date range to review volume, status counts, daily activity, and company-level call groups.

## Capabilities and Constraints

- Dashboard data comes from the documented projects, overview, calls-by-day, and campaigns endpoints.
- The maximum supported dashboard date range is 366 days; omitted dates mean the most recent seven days.
- Campaign-like groups are derived from call records and cannot be started from the dashboard.
- Cost, transferred, connected, and voicemail metrics are not stored and must not be presented as real values.
- The dashboard uses the existing `NEXT_PUBLIC_API_URL` configuration.

## Brand Commitments

The product is INT Voice Solutions. VYOM is the voice platform and dashboard context.

## Evidence on Hand

- VYOM landing page and use-case content: `app/vyom/page.tsx`, `app/vyom/UseCaseSelector.tsx`
- Dashboard and call history API contracts supplied in the task.
- Call history experience: `app/vyom/call/`

## Product Principles

- Keep dashboard figures grounded in stored call records.
- Make project and date filters explicit.
- Treat campaign-like groups as read-only aggregates, not executable campaigns.
