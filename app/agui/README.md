# AGUI Extraction

This folder contains the independent immersive LiveKit agent page extracted from
`/dynamic`. Copy the folder into a Next.js application's `app/` directory and
rename it to the desired route, for example `app/dynamic/`.

Required environment variables:

```env
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-server
NEXT_PUBLIC_BACKEND_URL=https://your-backend-server
# Optional: required only for Pixabay-backed rich media
NEXT_PUBLIC_PIXABAY_API_KEY=your-pixabay-key
```

The backend must provide `GET /api/getToken` and return a LiveKit access token.
The host application must also install the dependencies used by this package:
`@livekit/components-react`, `livekit-client`, `framer-motion`, `uuid`,
`react-leaflet`, `leaflet`, `lucide-react`, `react-markdown`, `remark-gfm`,
`@react-three/fiber`, `@react-three/drei`, and `three`.

The page does not depend on the host application's login, middleware, landing
page, or auth cookies.
