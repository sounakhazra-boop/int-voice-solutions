# Next.js Call Logs Extraction

This folder is a drop-in extraction of the `/calls` route.

## Install

```bash
npm install lucide-react
```

Add this environment variable to `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-backend.example.com
```

## Installation

Copy `extraction-call` into the Next.js project, for example:

```text
app/extraction-call
```

Create `app/calls/page.tsx`:

```tsx
export { default } from '../extraction-call/page';
```

If the file is placed directly at `app/extraction-call/page.tsx`, it can also be used from `app/calls/page.tsx` via re-export.

## Supported route parameters

- `/calls?view=all`
- `/calls?view=mine`
- `/calls?view=all&status=completed`
- `/calls?status=initiated`
- `/calls?view=mine&authEmail=user@example.com`

Valid status values are `all`, `completed`, `initiated`, `queued`, and `failed`.

## Authenticated “mine” view

For an authenticated Next.js app, pass the email from `app/calls/page.tsx`:

```tsx
import CallsPage from '../extraction-call/page';

export default function Page() {
  return <CallsPage authEmail="signed-in-user@example.com" />;
}
```
