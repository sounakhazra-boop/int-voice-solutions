export const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  ...(process.env.NEXT_PUBLIC_TURN_URL_TCP
    ? [
        {
          urls: process.env.NEXT_PUBLIC_TURN_URL_TCP,
          username: process.env.NEXT_PUBLIC_TURN_USERNAME,
          credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL,
        },
      ]
    : []),
  ...(process.env.NEXT_PUBLIC_TURN_URL_TLS
    ? [
        {
          urls: process.env.NEXT_PUBLIC_TURN_URL_TLS,
          username: process.env.NEXT_PUBLIC_TURN_USERNAME,
          credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL,
        },
      ]
    : []),
  ...(process.env.NEXT_PUBLIC_STUN_URL
    ? [{ urls: process.env.NEXT_PUBLIC_STUN_URL }]
    : [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun.freeswitch.org:3478" },
      ]),
];

export function hasTurnServers(iceServers: RTCIceServer[]): boolean {
  return iceServers.some((server) => {
    const urls = Array.isArray(server.urls) ? server.urls : [server.urls];
    return urls.some(
      (url) => url.startsWith("turn:") || url.startsWith("turns:"),
    );
  });
}

/**
 * Waits for ICE gathering to finish, resolving early once a usable candidate
 * arrives or when `timeoutMs` elapses so slow STUN/IPv6 probes don't stall connection.
 */
export function waitForIceGathering(
  pc: RTCPeerConnection,
  waitForRelay: boolean,
  timeoutMs = 3500,
): Promise<void> {
  return new Promise<void>((resolve) => {
    if (pc.iceGatheringState === "complete") {
      resolve();
      return;
    }

    let settled = false;
    let earlyTimer: ReturnType<typeof setTimeout> | null = null;
    const targetCandidateType = waitForRelay ? "relay" : "srflx";

    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutTimer);
      if (earlyTimer) clearTimeout(earlyTimer);
      pc.removeEventListener("icegatheringstatechange", onGather);
      pc.removeEventListener("icecandidate", onCandidate);
      resolve();
    };

    const onGather = () => {
      if (pc.iceGatheringState === "complete") finish();
    };

    const onCandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate?.type === targetCandidateType && !earlyTimer) {
        earlyTimer = setTimeout(finish, 200);
      }
    };

    const timeoutTimer = setTimeout(finish, timeoutMs);
    pc.addEventListener("icegatheringstatechange", onGather);
    pc.addEventListener("icecandidate", onCandidate);
  });
}
