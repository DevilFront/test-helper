import type { ExamSlug } from "./exam-registry";
import type { ExamQuestion } from "./types";

export const RETRY_POOL_STORAGE_KEY = "cert-retry-pool-v1";

export type RetryPoolPayload = {
  examSlug: ExamSlug;
  kind: "wrong" | "weak" | "bookmark";
  questions: ExamQuestion[];
  label: string;
};

export function saveRetryPool(payload: RetryPoolPayload): void {
  try {
    sessionStorage.setItem(RETRY_POOL_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

export function loadRetryPool(): RetryPoolPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(RETRY_POOL_STORAGE_KEY);
    if (!raw) return null;
    const p: unknown = JSON.parse(raw);
    if (!p || typeof p !== "object") return null;
    const o = p as Record<string, unknown>;
    if (
      typeof o.examSlug !== "string" ||
      (o.kind !== "wrong" &&
        o.kind !== "weak" &&
        o.kind !== "bookmark") ||
      !Array.isArray(o.questions) ||
      typeof o.label !== "string"
    ) {
      return null;
    }
    return o as RetryPoolPayload;
  } catch {
    return null;
  }
}

export function buildWeakCategoryPool(
  pool: ExamQuestion[],
  categories: string[],
): ExamQuestion[] {
  if (categories.length === 0) return [];
  const set = new Set(categories);
  return pool.filter((q) => set.has(q.category));
}
