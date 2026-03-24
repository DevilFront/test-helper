import { isExamSlug, type ExamSlug } from "./exam-registry";

const KEY = "cert-roadmap-focus-v1";

export type RoadmapFocus = {
  version: 1;
  examSlug: ExamSlug;
  /** 과목 category 키 */
  categoryKeys: string[];
  /** 주간 목표 문항 수 (선택) */
  weeklyQuestionGoal: number | null;
  /** 메모 한 줄 (선택) */
  note: string;
};

export function loadRoadmapFocus(): RoadmapFocus | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p: unknown = JSON.parse(raw);
    if (!p || typeof p !== "object") return null;
    const o = p as Record<string, unknown>;
    if (o.version !== 1) return null;
    if (typeof o.examSlug !== "string" || !isExamSlug(o.examSlug))
      return null;
    if (!Array.isArray(o.categoryKeys)) return null;
    return {
      version: 1,
      examSlug: o.examSlug,
      categoryKeys: o.categoryKeys.filter((x) => typeof x === "string"),
      weeklyQuestionGoal:
        typeof o.weeklyQuestionGoal === "number" ? o.weeklyQuestionGoal : null,
      note: typeof o.note === "string" ? o.note : "",
    };
  } catch {
    return null;
  }
}

export function saveRoadmapFocus(data: Omit<RoadmapFocus, "version">): void {
  const payload: RoadmapFocus = { version: 1, ...data };
  try {
    localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}
