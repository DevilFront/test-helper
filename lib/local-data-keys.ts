/** 백업·복원 대상 (localStorage만, sessionStorage 제외) */
export const LOCAL_DATA_KEYS = [
  "cert-pref-theme",
  "cert-pref-font",
  "cert-pref-timer",
  "cert-habits-v1",
  "cert-study-history-v1",
  "cert-roadmap-focus-v1",
  "cert-bookmarks-v1",
] as const;

export type LocalDataKey = (typeof LOCAL_DATA_KEYS)[number];

export function isLocalDataKey(s: string): s is LocalDataKey {
  return (LOCAL_DATA_KEYS as readonly string[]).includes(s);
}
