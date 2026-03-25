import type { ExamDifficultyMode } from "./exam-modes";
import type { ExamSlug } from "./exam-registry";
import type { ExamQuestion } from "./types";

export const IN_PROGRESS_STORAGE_KEY = "cert-in-progress-v1";

export type InProgressPayload = {
  version: 1;
  sessionKey: string;
  examSlug: ExamSlug;
  difficultyMode: ExamDifficultyMode;
  /** 현재 세션 문항 id 순서 */
  questionIds: number[];
  step: number;
  answers: (number | null)[];
  savedAt: number;
  elapsedSec: number;
};

export type SessionKeyOptions = {
  /** 기본 15 — 100문항 실전 등 */
  sessionCap?: number;
  /** 예: full-mock */
  examPreset?: string;
};

export function buildSessionKey(
  examSlug: ExamSlug,
  difficultyMode: ExamDifficultyMode,
  poolOverride: ExamQuestion[] | null | undefined,
  categoryFilter: string[] | null | undefined,
  options?: SessionKeyOptions,
): string {
  const poolPart =
    poolOverride && poolOverride.length > 0
      ? poolOverride
          .map((q) => q.id)
          .slice()
          .sort((a, b) => a - b)
          .join(",")
      : "";
  const focusPart =
    categoryFilter && categoryFilter.length > 0
      ? [...categoryFilter].sort().join("|")
      : "";
  const capPart =
    options?.sessionCap != null ? String(options.sessionCap) : "";
  const presetPart = options?.examPreset ?? "";
  return `${examSlug}|${difficultyMode}|${poolPart}|${focusPart}|cap=${capPart}|p=${presetPart}`;
}

export function loadInProgress(): InProgressPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(IN_PROGRESS_STORAGE_KEY);
    if (!raw) return null;
    const p: unknown = JSON.parse(raw);
    if (!p || typeof p !== "object") return null;
    const o = p as Record<string, unknown>;
    if (o.version !== 1) return null;
    if (typeof o.sessionKey !== "string") return null;
    if (typeof o.examSlug !== "string") return null;
    if (typeof o.difficultyMode !== "string") return null;
    if (!Array.isArray(o.questionIds)) return null;
    if (typeof o.step !== "number") return null;
    if (!Array.isArray(o.answers)) return null;
    return o as InProgressPayload;
  } catch {
    return null;
  }
}

export function saveInProgress(payload: InProgressPayload): void {
  try {
    sessionStorage.setItem(
      IN_PROGRESS_STORAGE_KEY,
      JSON.stringify(payload),
    );
  } catch {
    /* ignore */
  }
}

export function clearInProgress(): void {
  try {
    sessionStorage.removeItem(IN_PROGRESS_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
