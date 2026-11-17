type KeyState = {
  key: string;
  blockedUntil: number;
};

type KeyManagerGlobal = typeof globalThis & {
  __liveAvatarKeyStates?: KeyState[];
  __liveAvatarKeySource?: string;
  __liveAvatarNextKeyIndex?: number;
};

const globalState = globalThis as KeyManagerGlobal;
const configuredKeys =
  process.env.LIVEAVATAR_API_KEYS ?? process.env.LIVEAVATAR_API_KEY ?? "";

const existingKeyStates = globalState.__liveAvatarKeyStates;
const keyStates =
  existingKeyStates && globalState.__liveAvatarKeySource === configuredKeys
    ? existingKeyStates
    : configuredKeys
        .split(",")
        .map((key) => key.trim())
        .filter((key) => key.length > 0)
        .map((key) => ({ key, blockedUntil: 0 }));

if (keyStates !== existingKeyStates) {
  globalState.__liveAvatarKeyStates = keyStates;
  globalState.__liveAvatarKeySource = configuredKeys;
  globalState.__liveAvatarNextKeyIndex = 0;
}

export function getWorkingKey(): string | null {
  if (keyStates.length === 0) {
    return null;
  }

  const now = Date.now();
  const startIndex = globalState.__liveAvatarNextKeyIndex ?? 0;

  for (let offset = 0; offset < keyStates.length; offset += 1) {
    const index = (startIndex + offset) % keyStates.length;
    const keyState = keyStates[index];

    if (keyState.blockedUntil <= now) {
      globalState.__liveAvatarNextKeyIndex = (index + 1) % keyStates.length;
      return keyState.key;
    }
  }

  return null;
}

export function getKeyCount(): number {
  return keyStates.length;
}

export function blockKey(failedKey: string, durationSeconds: number): void {
  const keyState = keyStates.find((state) => state.key === failedKey);

  if (keyState) {
    keyState.blockedUntil = Date.now() + durationSeconds * 1000;
  }
}
