import constructionSafetyEngineerRaw from "@/data/construction-safety-engineer-questions.json";
import constructionSafetyIndustrialRaw from "@/data/construction-safety-industrial-questions.json";
import electricalCraftsmanRaw from "@/data/electrical-craftsman-questions.json";
import electricalEngineerRaw from "@/data/electrical-engineer-questions.json";
import industrialSafetyIndustrialRaw from "@/data/industrial-safety-industrial-questions.json";
import industrialSafetyRaw from "@/data/industrial-safety-engineer-questions.json";
import infoProcessingRaw from "@/data/info-processing-engineer-questions.json";
import type { ExamQuestion } from "./types";

export const EXAM_SLUGS = [
  "info-processing",
  "electrical-engineer",
  "electrical-craftsman",
  "industrial-safety-industrial",
  "industrial-safety",
  "construction-safety-industrial",
  "construction-safety-engineer",
] as const;

export type ExamSlug = (typeof EXAM_SLUGS)[number];

/** 필기 / 실기 — 라우트는 `/test/[slug]` 단일, 메타·UI에만 사용 */
export type ExamPhase = "written" | "practical";

export type ExamConfig = {
  pool: ExamQuestion[];
  title: string;
  phase: ExamPhase;
  /** 개정·출제 안내 배너용 (선택) */
  revisionNote?: string;
};

export function isExamSlug(s: string): s is ExamSlug {
  return (EXAM_SLUGS as readonly string[]).includes(s);
}

export function getExamConfig(slug: string): ExamConfig | null {
  switch (slug) {
    case "info-processing":
      return {
        pool: infoProcessingRaw as ExamQuestion[],
        title: "정보처리기사 모의",
        phase: "written",
        revisionNote:
          "문항 풀은 필기 형식을 참고한 창작 모의입니다. 과목·비율은 시행 공고·개정에 따라 달라질 수 있습니다.",
      };
    case "electrical-engineer":
      return {
        pool: electricalEngineerRaw as ExamQuestion[],
        title: "전기기사 모의",
        phase: "written",
        revisionNote:
          "문항 풀은 전기기사 필기 범위를 참고한 창작 모의입니다. 과목명·비율·출제 기준은 시행 공고·개정에 따라 달라질 수 있습니다.",
      };
    case "electrical-craftsman":
      return {
        pool: electricalCraftsmanRaw as ExamQuestion[],
        title: "전기기능사 모의",
        phase: "written",
        revisionNote:
          "문항 풀은 전기기능사 필기 범위를 참고한 창작 모의입니다. 과목명·비율·출제 기준은 시행 공고·개정에 따라 달라질 수 있습니다.",
      };
    case "industrial-safety-industrial":
      return {
        pool: industrialSafetyIndustrialRaw as ExamQuestion[],
        title: "산업안전 산업기사 모의",
        phase: "written",
        revisionNote:
          "문항 풀은 산업안전 산업기사 필기 범위를 참고한 창작 모의입니다. 법령 개정·출제 기준은 공식 공고를 확인하세요.",
      };
    case "industrial-safety":
      return {
        pool: industrialSafetyRaw as ExamQuestion[],
        title: "산업안전기사 모의",
        phase: "written",
        revisionNote:
          "문항 풀은 필기 범위를 참고한 창작 모의입니다. 법령 개정·출제 기준은 공식 공고를 확인하세요.",
      };
    case "construction-safety-industrial":
      return {
        pool: constructionSafetyIndustrialRaw as ExamQuestion[],
        title: "건설안전 산업기사 모의",
        phase: "written",
        revisionNote:
          "문항 풀은 건설안전 산업기사 필기 범위를 참고한 창작 모의입니다. 법령 개정·출제 기준은 공식 공고를 확인하세요.",
      };
    case "construction-safety-engineer":
      return {
        pool: constructionSafetyEngineerRaw as ExamQuestion[],
        title: "건설안전기사 모의",
        phase: "written",
        revisionNote:
          "문항 풀은 건설안전기사 필기 범위를 참고한 창작 모의입니다. 법령 개정·출제 기준은 공식 공고를 확인하세요.",
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

export function getExamPhaseLabel(phase: ExamPhase): string {
  return phase === "written" ? "필기 모의" : "실기 모의";
}
