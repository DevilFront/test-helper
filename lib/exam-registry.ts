import industrialSafetyRaw from "@/data/industrial-safety-engineer-questions.json";
import infoProcessingRaw from "@/data/info-processing-engineer-questions.json";
import type { ExamQuestion } from "./types";

export const EXAM_SLUGS = [
  "info-processing",
  "industrial-safety",
] as const;

export type ExamSlug = (typeof EXAM_SLUGS)[number];

export function isExamSlug(s: string): s is ExamSlug {
  return (EXAM_SLUGS as readonly string[]).includes(s);
}

export function getExamConfig(slug: string): {
  pool: ExamQuestion[];
  title: string;
} | null {
  switch (slug) {
    case "info-processing":
      return {
        pool: infoProcessingRaw as ExamQuestion[],
        title: "정보처리기사 모의",
      };
    case "industrial-safety":
      return {
        pool: industrialSafetyRaw as ExamQuestion[],
        title: "산업안전기사 모의",
      };
    default:
      return null;
  }
}

/** id 순서대로 풀에서 찾기. 없는 id는 건너뜀 */
export function getQuestionsByIds(
  pool: ExamQuestion[],
  ids: number[],
): ExamQuestion[] {
  const map = new Map(pool.map((q) => [q.id, q]));
  return ids
    .map((id) => map.get(id))
    .filter((q): q is ExamQuestion => q !== undefined);
}

export function listUniqueCategories(pool: ExamQuestion[]): string[] {
  return [...new Set(pool.map((q) => q.category))].sort((a, b) =>
    a.localeCompare(b, "ko"),
  );
}
