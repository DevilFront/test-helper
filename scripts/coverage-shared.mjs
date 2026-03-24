/**
 * check-coverage / coverage-gap-plan 공통 — 임계값·시험 목록·분석
 */
export const EXPECTED_CATEGORIES = {
  "info-processing": [
    "database",
    "os",
    "network",
    "software-engineering",
    "data-structures",
    "security",
    "computer-architecture",
    "project-management",
  ],
  "electrical-engineer": [
    "electro-magnetics",
    "power-engineering",
    "electrical-machines",
    "circuits-control",
    "electrical-installation",
  ],
  "electrical-craftsman": [
    "electro-magnetics",
    "power-engineering",
    "electrical-machines",
    "circuits-control",
    "electrical-installation",
  ],
  "industrial-safety": [
    "safety-law",
    "safety-management",
    "risk-assessment",
    "industrial-health",
    "chemical-safety",
    "machinery-safety",
    "electrical-safety",
    "fire-explosion",
    "confined-space",
    "ppe",
    "psm",
    "ergonomics",
  ],
  "industrial-safety-industrial": [
    "safety-law",
    "safety-management",
    "risk-assessment",
    "industrial-health",
    "chemical-safety",
    "machinery-safety",
    "electrical-safety",
    "fire-explosion",
    "confined-space",
    "ppe",
    "psm",
    "ergonomics",
  ],
  "construction-safety-industrial": [
    "construction-law",
    "construction-mgmt",
    "construction-risk",
    "construction-scaffold",
    "construction-excavation",
    "construction-electrical",
    "construction-machinery",
    "construction-demolition",
    "construction-fire",
    "construction-health",
    "construction-confined",
    "construction-ppe",
  ],
  "construction-safety-engineer": [
    "construction-law",
    "construction-mgmt",
    "construction-risk",
    "construction-scaffold",
    "construction-excavation",
    "construction-electrical",
    "construction-machinery",
    "construction-demolition",
    "construction-fire",
    "construction-health",
    "construction-confined",
    "construction-ppe",
  ],
};

export const EXAMS = [
  {
    slug: "info-processing",
    title: "정보처리기사",
    file: "data/info-processing-engineer-questions.json",
  },
  {
    slug: "electrical-engineer",
    title: "전기기사",
    file: "data/electrical-engineer-questions.json",
  },
  {
    slug: "electrical-craftsman",
    title: "전기기능사",
    file: "data/electrical-craftsman-questions.json",
  },
  {
    slug: "industrial-safety-industrial",
    title: "산업안전 산업기사",
    file: "data/industrial-safety-industrial-questions.json",
  },
  {
    slug: "industrial-safety",
    title: "산업안전기사",
    file: "data/industrial-safety-engineer-questions.json",
  },
  {
    slug: "construction-safety-industrial",
    title: "건설안전 산업기사",
    file: "data/construction-safety-industrial-questions.json",
  },
  {
    slug: "construction-safety-engineer",
    title: "건설안전기사",
    file: "data/construction-safety-engineer-questions.json",
  },
];

export const STEM_ORDER = [
  "definition",
  "which_best",
  "scenario",
  "code_or_sql",
  "table_diagram",
  "not",
  "combo",
  "unknown",
];

/** check-coverage와 동일: 상황형 최소 개수 */
export function scenarioMinimum(n) {
  return Math.max(3, Math.floor(n * 0.05));
}

export function countMap(items, keyFn) {
  const m = {};
  for (const q of items) {
    const k = keyFn(q);
    m[k] = (m[k] || 0) + 1;
  }
  return m;
}

export function pct(part, total) {
  if (total === 0) return "0.0";
  return ((100 * part) / total).toFixed(1);
}

export function matrixCategoryStem(items) {
  const cats = [...new Set(items.map((q) => q.category))].sort();
  const rows = {};
  for (const c of cats) rows[c] = {};
  for (const q of items) {
    const sk = q.stemKind ?? "unknown";
    const c = q.category;
    if (!rows[c]) rows[c] = {};
    rows[c][sk] = (rows[c][sk] || 0) + 1;
  }
  return { cats, rows };
}

export function analyzeExam(exam, items) {
  const warnings = [];
  const infos = [];
  const n = items.length;
  const expected = new Set(EXPECTED_CATEGORIES[exam.slug] ?? []);
  const byCat = countMap(items, (q) => q.category);
  const byStem = countMap(items, (q) => q.stemKind ?? "unknown");
  const byDiff = countMap(items, (q) => q.difficulty ?? "unknown");
  const byCog = countMap(items, (q) => q.cognitiveLevel ?? "unknown");

  for (const cat of expected) {
    if ((byCat[cat] ?? 0) === 0) {
      warnings.push(`기대 과목에 문항 없음: "${cat}"`);
    }
  }
  for (const cat of Object.keys(byCat)) {
    if (!expected.has(cat)) {
      warnings.push(`알 수 없는 category 키: "${cat}" (기대 목록에 없음)`);
    }
  }

  const scenMin = scenarioMinimum(n);
  if ((byStem.scenario ?? 0) < scenMin) {
    warnings.push(
      `상황형(scenario) 부족: ${byStem.scenario ?? 0}개 (권장 최소 ${scenMin}개, 약 전체 5%+)`,
    );
  }

  if ((byStem.not ?? 0) === 0) {
    warnings.push('부정형(not, "옳지 않은" 등) 문항이 없음 — 실전형 균형을 위해 추가 권장');
  }

  if (exam.slug === "info-processing" && (byStem.code_or_sql ?? 0) < 3) {
    warnings.push(
      `SQL·코드형(code_or_sql) 부족: ${byStem.code_or_sql ?? 0}개 (정보처리 풀은 3개 이상 권장)`,
    );
  }

  const defRatio = (byStem.definition ?? 0) / n;
  if (n >= 20 && defRatio > 0.72) {
    infos.push(
      `정의형(definition) 비중이 큼: ${pct(byStem.definition ?? 0, n)}% — 시나리오·적용형 리라이트 검토`,
    );
  }

  for (const cat of expected) {
    const c = byCat[cat] ?? 0;
    if (c === 1) {
      infos.push(`과목 "${cat}" 문항이 1개뿐 — 분산·추가 검토`);
    }
  }

  const { cats, rows } = matrixCategoryStem(items);
  for (const c of cats) {
    const row = rows[c] || {};
    let emptyStemKinds = 0;
    for (const sk of ["scenario", "not", "code_or_sql"]) {
      if ((row[sk] ?? 0) === 0) emptyStemKinds += 1;
    }
    if (emptyStemKinds === 3 && (byCat[c] ?? 0) >= 4) {
      infos.push(
        `과목 "${c}": scenario·not·code_or_sql 가 모두 0 — 해당 과목 내 유형 다양화 검토`,
      );
    }
  }

  return {
    warnings,
    infos,
    n,
    byCat,
    byStem,
    byDiff,
    byCog,
    matrix: { cats, rows },
  };
}

/**
 * check-coverage와 동일한 기준으로 숫자 갭만 계산 (후보 선정용)
 */
export function computeStemGaps(examSlug, byStem, n) {
  const gaps = [];
  const scenMin = scenarioMinimum(n);
  const sc = byStem.scenario ?? 0;
  if (sc < scenMin) {
    gaps.push({
      kind: "scenario",
      current: sc,
      target: scenMin,
      shortfall: scenMin - sc,
    });
  }
  if ((byStem.not ?? 0) === 0) {
    gaps.push({
      kind: "not",
      current: 0,
      target: 1,
      shortfall: 1,
    });
  }
  if (examSlug === "info-processing" && (byStem.code_or_sql ?? 0) < 3) {
    const cur = byStem.code_or_sql ?? 0;
    gaps.push({
      kind: "code_or_sql",
      current: cur,
      target: 3,
      shortfall: 3 - cur,
    });
  }
  return gaps;
}
