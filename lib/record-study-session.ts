import {
  computeCategoryStats,
  getWeakCategories,
} from "@/lib/result-analytics";
import { applyStudySession } from "@/lib/habits-storage";
import { appendStudyHistory } from "@/lib/study-history";
import { isExamSlug } from "@/lib/exam-registry";
import type { TestResultPayload } from "@/lib/types";

function fingerprint(payload: TestResultPayload): string {
  const slug = payload.examSlug ?? "";
  const ids = payload.questions.map((q) => q.id).join(",");
  const ans = payload.selectedAnswers.join(",");
  return `${slug}|${ids}|${ans}`;
}

/**
 * 결과 화면에서 1회만 기록. 새로고침 시 중복 집계 방지.
 * @returns 기록했으면 true
 */
export function tryRecordStudySession(payload: TestResultPayload): boolean {
  if (typeof window === "undefined") return false;
  const examSlug = payload.examSlug ?? "info-processing";
  if (!isExamSlug(examSlug)) return false;

  const fp = fingerprint(payload);
  const markKey = `cert-study-recorded:${fp}`;
  try {
    if (sessionStorage.getItem(markKey)) return false;
    sessionStorage.setItem(markKey, "1");
  } catch {
    return false;
  }

  const { questions, selectedAnswers } = payload;
  const n = questions.length;
  let correct = 0;
  for (let i = 0; i < n; i++) {
    if (selectedAnswers[i] === questions[i].answer) correct += 1;
  }

  const stats = computeCategoryStats(questions, selectedAnswers);
  const weak = getWeakCategories(stats);

  applyStudySession(n);
  appendStudyHistory({
    at: Date.now(),
    examSlug,
    questions: n,
    correct,
    difficultyMode: payload.difficultyMode ?? "mixed",
    weakCategoryKeys: weak.map((w) => w.category),
  });

  window.dispatchEvent(new Event("cert-habits-updated"));
  return true;
}
