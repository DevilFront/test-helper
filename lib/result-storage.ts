import { EXAM_SLUGS, isExamSlug } from "./exam-registry";
import {
  getResultStorageKey,
  LEGACY_INFO_PROCESSING_STORAGE_KEY,
} from "./storage-keys";
import type { TestResultPayload } from "./types";

function isPayload(x: unknown): x is TestResultPayload {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    o.version === 1 &&
    Array.isArray(o.questions) &&
    Array.isArray(o.selectedAnswers) &&
    o.questions.length === o.selectedAnswers.length &&
    o.questions.length > 0
  );
}

function tryParse(raw: string | null): TestResultPayload | null {
  if (!raw) return null;
  try {
    const p: unknown = JSON.parse(raw);
    return isPayload(p) ? p : null;
  } catch {
    return null;
  }
}

/** URL `e` 값 우선, 없으면 구버전 키·시험별 키 순으로 조회 */
export function loadTestResultFromSession(
  examSlugParam: string | null,
): TestResultPayload | null {
  if (examSlugParam && isExamSlug(examSlugParam)) {
    const direct = tryParse(
      sessionStorage.getItem(getResultStorageKey(examSlugParam)),
    );
    if (direct) return direct;
  }
  const legacy = tryParse(
    sessionStorage.getItem(LEGACY_INFO_PROCESSING_STORAGE_KEY),
  );
  if (legacy) return legacy;
  for (const slug of EXAM_SLUGS) {
    const v = tryParse(sessionStorage.getItem(getResultStorageKey(slug)));
    if (v) return v;
  }
  return null;
}
