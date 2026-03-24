import { getCategoryDisplayName } from "./category-labels";
import type { ExamQuestion } from "./types";

export type CategoryStat = {
  category: string;
  displayName: string;
  correct: number;
  total: number;
  /** 0–100, 정수 */
  accuracy: number;
};

/** 전체 정답률(%) — 소수 첫째 자리에서 반올림 */
export function getScorePercent(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 1000) / 10;
}

/** 문항·응답 기준 과목별 정답 수·정답률 */
export function computeCategoryStats(
  questions: ExamQuestion[],
  selectedAnswers: number[],
): CategoryStat[] {
  const map = new Map<
    string,
    { correct: number; total: number }
  >();

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const cat = q.category;
    if (!map.has(cat)) map.set(cat, { correct: 0, total: 0 });
    const row = map.get(cat)!;
    row.total += 1;
    if (selectedAnswers[i] === q.answer) row.correct += 1;
  }

  return [...map.entries()]
    .map(([category, { correct, total }]) => {
      const accuracy =
        total === 0 ? 0 : Math.round((correct / total) * 100);
      return {
        category,
        displayName: getCategoryDisplayName(category),
        correct,
        total,
        accuracy,
      };
    })
    .sort((a, b) => a.displayName.localeCompare(b.displayName, "ko"));
}

/** 80%+ / 60~79% / 60% 미만 — 전체 정답률(%) 기준 */
export function getLevelClassification(scorePercent: number): {
  level: "합격권" | "보완 필요" | "위험";
  band: "high" | "mid" | "low";
} {
  if (scorePercent >= 80) return { level: "합격권", band: "high" };
  if (scorePercent >= 60) return { level: "보완 필요", band: "mid" };
  return { level: "위험", band: "low" };
}

/** 약점: 과목 정답률 60% 미만, 없으면 가장 낮은 정답률 과목(동률 포함) */
export function getWeakCategories(stats: CategoryStat[]): CategoryStat[] {
  if (stats.length === 0) return [];
  const below = stats.filter((s) => s.accuracy < 60);
  if (below.length > 0) {
    return [...below].sort((a, b) => a.accuracy - b.accuracy);
  }
  const minAcc = Math.min(...stats.map((s) => s.accuracy));
  if (minAcc >= 100) return [];
  return stats.filter((s) => s.accuracy === minAcc);
}

/** 한 줄 피드백 (약점 과목 기준) */
export function buildStudyFeedback(weak: CategoryStat[]): string {
  if (weak.length === 0) {
    return "전 과목에서 고른 이해도를 보였습니다. 오답 문항만 복습해 보세요.";
  }
  const names = weak.map((w) => w.displayName);
  if (names.length === 1) {
    return `${names[0]} 영역이 부족합니다. 이 부분을 집중적으로 학습하세요.`;
  }
  if (names.length === 2) {
    return `${names[0]}·${names[1]} 영역이 부족합니다. 해당 단원을 집중적으로 학습하세요.`;
  }
  return `${names.slice(0, -1).join(", ")} 및 ${names[names.length - 1]} 영역이 부족합니다. 약점 과목을 순서대로 보완하세요.`;
}
