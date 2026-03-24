import type { ExamSlug } from "./exam-registry";

/** sessionStorage key for a completed test (per 시험 slug). */
export function getResultStorageKey(slug: ExamSlug): string {
  return `cert-test-result-v1-${slug}`;
}

/** @deprecated 구버전 정보처리기사 단일 키 */
export const LEGACY_INFO_PROCESSING_STORAGE_KEY = "ipee-test-result-v1";
