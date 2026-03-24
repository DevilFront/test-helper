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

/** 한 세션 최대 문항 수 */
export const SESSION_QUESTION_CAP = 15;
