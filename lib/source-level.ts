import type { ExamQuestion, SourceLevel } from "./types";

export const DEFAULT_SOURCE_LEVEL: SourceLevel = "creative_mock";

export function resolveSourceLevel(q: ExamQuestion): SourceLevel {
  return q.sourceLevel ?? DEFAULT_SOURCE_LEVEL;
}

export function getSourceLevelLabel(level: SourceLevel): string {
  const map: Record<SourceLevel, string> = {
    creative_mock: "창작 모의",
    concept_reference: "개념·범위 참고",
    mixed: "창작·참고 혼합",
  };
  return map[level];
}
