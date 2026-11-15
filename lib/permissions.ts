export type CardPermission = Record<string, boolean | string>;
export type CardPermissions = CardPermission[];

export const PERMISSIONS_STORAGE_KEY = "int-voice-card-permissions";
export const PERMISSIONS_EXPIRY_STORAGE_KEY =
  "int-voice-card-permissions-expires-at";

export function createCardPermissions(token: string): CardPermissions {
  return [
    { vyom: true, token },
    { voicebot: true, token },
    { chatbot: true, token },
    { agui: true, token },
    { vaani: false, token },
    { "offline-recording": false, token },
    { "voice-biometric": false, token },
    { "conversations-analyst": false, token },
    { "avatar-ai": true, token },
  ];
}
