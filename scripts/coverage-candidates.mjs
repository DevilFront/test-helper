/**
 * 커버리지 갭별 후보 문항 선정 — gap-plan / apply-rewrites 공통
 */
import { computeStemGaps, countMap } from "./coverage-shared.mjs";

export function stemOf(q) {
  return q.stemKind ?? "unknown";
}

/** 상황형 후보: 아직 scenario 아닌 것 중 지문이 긴 순 (leadIn 분리 여지) */
export function pickScenarioCandidates(items, shortfall) {
  if (shortfall <= 0) return [];
  const pool = items.filter((q) => {
    const sk = stemOf(q);
    return sk !== "scenario" && sk !== "not";
  });
  pool.sort(
    (a, b) => (b.question?.length ?? 0) - (a.question?.length ?? 0),
  );
  return pool.slice(0, shortfall).map((q) => ({
    id: q.id,
    category: q.category,
    stemKind: stemOf(q),
    questionLength: q.question?.length ?? 0,
    hasLeadIn: Boolean(q.leadIn),
    hint: "leadIn에 맥락·question에 단일 판단 요구로 분리, stemKind=scenario, cognitiveLevel 조정",
  }));
}

export const SQLISH =
  /SELECT|INSERT|DELETE|UPDATE|JOIN|WHERE|FROM\s|SQL|쿼리|테이블|정규화|인덱스|트랜잭션/i;
export const CODE_CATS = new Set([
  "database",
  "data-structures",
  "software-engineering",
]);

/** 코드/SQL 후보: DB·자료구조·SW공학 과목 우선, 질문에 SQL·DB 용어가 있는 순 */
export function pickCodeOrSqlCandidates(items, shortfall) {
  if (shortfall <= 0) return [];
  const pool = items.filter((q) => stemOf(q) !== "code_or_sql");
  pool.sort((a, b) => {
    const ak = CODE_CATS.has(a.category) ? 2 : 0;
    const bk = CODE_CATS.has(b.category) ? 2 : 0;
    const as = SQLISH.test(a.question ?? "") ? 1 : 0;
    const bs = SQLISH.test(b.question ?? "") ? 1 : 0;
    return (
      bk + bs - (ak + as) ||
      (b.question?.length ?? 0) - (a.question?.length ?? 0)
    );
  });
  return pool.slice(0, shortfall).map((q) => ({
    id: q.id,
    category: q.category,
    stemKind: stemOf(q),
    hint: "contextBlock에 SQL/의사코드, question은 결과·오류·의미 질문. stemKind=code_or_sql, contextType=code",
  }));
}

const NEG_FRIENDLY = /가장|적절|옳은|맞는|다음 중|보기/;

/** 부정형 후보: which_best/definition 중 부정 발문으로 바꾸기 쉬운 순 (자동 수정 비권장) */
export function pickNotCandidates(items, shortfall) {
  if (shortfall <= 0) return [];
  const pool = items.filter((q) => {
    const sk = stemOf(q);
    return sk !== "not" && (sk === "which_best" || sk === "definition");
  });
  pool.sort((a, b) => {
    const aw = NEG_FRIENDLY.test(a.question ?? "") ? 1 : 0;
    const bw = NEG_FRIENDLY.test(b.question ?? "") ? 1 : 0;
    return bw - aw;
  });
  return pool.slice(0, shortfall).map((q) => ({
    id: q.id,
    category: q.category,
    stemKind: stemOf(q),
    hint: '발문을 "옳지 않은 것은?" 등으로 바꾸고 오답·해설·answer 인덱스 재검증. stemKind=not',
  }));
}

export function getGapsForExam(examSlug, items) {
  const byStem = countMap(items, (q) => q.stemKind ?? "unknown");
  return computeStemGaps(examSlug, byStem, items.length);
}

/**
 * 상황형용: 지문을 leadIn / question 으로 나눌 수 있을 때만 반환 (실패 시 null)
 */
export function trySplitLeadIn(question) {
  const t = (question ?? "").trim();
  /** 한국어 모의는 한 문장이 70자 미만인 경우가 많아 하한을 낮춘다. */
  if (t.length < 52) return null;

  const paras = t.split(/\n\n+/);
  if (paras.length >= 2 && paras[0].length >= 35 && paras[1].length >= 15) {
    return {
      leadIn: paras[0].trim(),
      question: paras.slice(1).join("\n\n").trim(),
    };
  }

  const reSentence =
    /^([\s\S]{45,}?[.!?．！？])\s+([\s\S]{15,})$/;
  let m = t.match(reSentence);
  if (m) {
    return { leadIn: m[1].trim(), question: m[2].trim() };
  }

  const commaIdx = t.indexOf(", ");
  if (commaIdx >= 40 && commaIdx < t.length - 25) {
    const a = t.slice(0, commaIdx).trim();
    const b = t.slice(commaIdx + 2).trim();
    if (a.length >= 35 && b.length >= 20) {
      return { leadIn: a, question: b };
    }
  }

  m = t.match(
    /^(.{45,}?(?:에서|할 때|인 경우|된 경우|경우|때)\s*)([\s\S]{20,})$/,
  );
  if (m && m[1].length >= 40) {
    return { leadIn: m[1].trim(), question: m[2].trim() };
  }

  const nextIdx = t.search(/다음\s+(중|보기|질문)/);
  if (nextIdx >= 45 && nextIdx < t.length - 12) {
    return {
      leadIn: t.slice(0, nextIdx).trim(),
      question: t.slice(nextIdx).trim(),
    };
  }

  const bestIdx = t.search(/가장\s+(적절|옳은|알맞은)/);
  if (bestIdx >= 38 && bestIdx < t.length - 8) {
    return {
      leadIn: t.slice(0, bestIdx).trim(),
      question: t.slice(bestIdx).trim(),
    };
  }

  const genIdx = t.search(/(?:일반적으로|주로)\s+/);
  if (genIdx >= 35 && genIdx < t.length - 12) {
    return {
      leadIn: t.slice(0, genIdx).trim(),
      question: t.slice(genIdx).trim(),
    };
  }

  return null;
}
