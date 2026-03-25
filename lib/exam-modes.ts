import type { ExamQuestion } from "./types";

export type ExamDifficultyMode = "easy" | "medium" | "hard" | "mixed";

export const EXAM_DIFFICULTY_MODES: ExamDifficultyMode[] = [
  "easy",
  "medium",
  "hard",
  "mixed",
];

export function isExamDifficultyMode(s: string): s is ExamDifficultyMode {
  return (EXAM_DIFFICULTY_MODES as readonly string[]).includes(s);
}

export function parseExamDifficultyMode(
  s: string | undefined,
): ExamDifficultyMode | null {
  if (!s) return null;
  return isExamDifficultyMode(s) ? s : null;
}

/** 모드에 맞는 문항만 사용. mixed는 전체 풀. */
export function filterPoolByMode(
  pool: ExamQuestion[],
  mode: ExamDifficultyMode,
): ExamQuestion[] {
  if (mode === "mixed") return [...pool];
  return pool.filter((q) => q.difficulty === mode);
}

export const MODE_LABELS: Record<
  ExamDifficultyMode,
  { title: string; description: string }
> = {
  easy: {
    title: "쉬운 문제",
    description: "기본 개념 위주",
  },
  medium: {
    title: "보통 난이도",
    description: "응용·비교형",
  },
  hard: {
    title: "어려운 문제",
    description: "심화·함정에 가까운 유형",
  },
  mixed: {
    title: "전체 랜덤",
    description: "난이도 무작위 혼합",
  },
};

/** 한 세션 최대 문항 수 (짧은 모의) */
export const SESSION_QUESTION_CAP = 15;

/** 정보처리기사·산업안전 산업기사 등 필기 실전 모의 (5과목×20) */
export const SESSION_QUESTION_CAP_FULL = 100;

/** 산업안전기사 필기 실전 모의 (6과목×20) */
export const SESSION_QUESTION_CAP_FULL_120 = 120;

/** 전기기능사 필기 실전 모의 (3과목×20) */
export const SESSION_QUESTION_CAP_FULL_60 = 60;

/** `preset=full-mock`일 때 시험별 세션 문항 상한 */
export function sessionCapForFullMockExam(slug: string): number {
  if (slug === "electrical-craftsman") return SESSION_QUESTION_CAP_FULL_60;
  if (slug === "industrial-safety") return SESSION_QUESTION_CAP_FULL_120;
  if (slug === "construction-safety-engineer") return SESSION_QUESTION_CAP_FULL_120;
  return SESSION_QUESTION_CAP_FULL;
}

/** 필기 실전(`preset=full-mock`)을 지원하는 시험 — 난이도별 짧은 세션(15문항)과 병행 안내할 때 사용 */
export function supportsWrittenFullMock(slug: string): boolean {
  return (
    slug === "info-processing" ||
    slug === "industrial-safety-industrial" ||
    slug === "construction-safety-industrial" ||
    slug === "industrial-safety" ||
    slug === "electrical-engineer" ||
    slug === "electrical-craftsman" ||
    slug === "construction-safety-engineer"
  );
}
