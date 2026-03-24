import type { CognitiveLevel, ExamQuestion, StemKind } from "./types";

export function getStemKindLabel(kind: StemKind): string {
  const m: Record<StemKind, string> = {
    definition: "정의·용어",
    which_best: "선택형",
    scenario: "상황형",
    code_or_sql: "코드·SQL",
    table_diagram: "표·도식",
    not: "부정형(옳지 않은)",
    combo: "복합 판단",
  };
  return m[kind];
}

export function getCognitiveLevelLabel(level: CognitiveLevel): string {
  const m: Record<CognitiveLevel, string> = {
    remember: "암기·인출",
    understand: "이해·비교",
    apply: "적용",
    analyze: "분석·판별",
  };
  return m[level];
}

/** JSON에 없을 때 보조 추론 (렌더용, 저장값 우선) */
export function inferStemKind(q: ExamQuestion): StemKind {
  const t = q.question ?? "";
  if (/옳지 않은|않은 것은|틀린 것은|부적절한 것은|아닌 것은/.test(t)) {
    return "not";
  }
  if (
    /SELECT|INSERT|DELETE|UPDATE|CREATE\s+TABLE|JOIN|FROM\s|WHERE\s|SQL|다음\s*코드|다음\s*테이블|다음\s*쿼리/i.test(
      t,
    )
  ) {
    return "code_or_sql";
  }
  if (/가장 적절|가장 알맞|가장 옳은|가장 가까운/.test(t)) return "which_best";
  if (t.length >= 140) return "scenario";
  if (t.length <= 55) return "definition";
  return "which_best";
}

export function inferCognitiveLevel(
  q: ExamQuestion,
  stem: StemKind,
): CognitiveLevel {
  if (stem === "not" || stem === "code_or_sql") return "analyze";
  const d = q.difficulty ?? "medium";
  if (d === "easy") return stem === "definition" ? "remember" : "understand";
  if (d === "hard") return "apply";
  return "understand";
}

export function resolveStemKind(q: ExamQuestion): StemKind {
  return q.stemKind ?? inferStemKind(q);
}

export function resolveCognitiveLevel(q: ExamQuestion): CognitiveLevel {
  return q.cognitiveLevel ?? inferCognitiveLevel(q, resolveStemKind(q));
}
