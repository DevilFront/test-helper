/**
 * 산업안전기사 풀을 필기 120문항(6과목×20)에 맞게 보강합니다.
 * reference3.pdf 과목 구조(안전관리론·인간공학·기계·전기·화학·건설)를 반영한 창작 모의입니다.
 * 실행: node scripts/append-industrial-safety-engineer-120.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const fp = path.join(root, "data/industrial-safety-engineer-questions.json");

function q(
  id,
  category,
  difficulty,
  stemKind,
  cognitiveLevel,
  topic,
  domainLabel,
  correctIdx,
  options,
  leadIn,
) {
  const ans = options[correctIdx];
  return {
    id,
    category,
    difficulty,
    ...(leadIn ? { leadIn } : {}),
    question: `[창작 모의 · 산업안전기사] ${topic}`,
    options,
    answer: correctIdx,
    explanation: `창작 모의 문항입니다. 실제 시험은 시행 공고·최신 법령·교재를 따릅니다. ${domainLabel} 영역에서는 절차·기록·교육·보호구·위험성평가 등을 종합적으로 점검하는 것이 일반적입니다. 정답은 「${ans}」에 가깝습니다.`,
    sourceLevel: "creative_mock",
    stemKind,
    cognitiveLevel,
    itemVersion: 1,
    reviewStatus: "published",
    tags: [domainLabel],
  };
}

const wrong = [
  "관행만 따르고 법령·지침 확인을 생략한다",
  "위험요인을 문서화하지 않고 구두로만 전달한다",
  "개인 편의로 보호구를 생략한다",
  "재해 원인 분석 없이 동일 작업을 즉시 재개한다",
];

const correct = (label) =>
  `법령·지침을 확인하고 위험을 줄이기 위한 절차·기록·교육을 이행한다 (창작 모의: ${label})`;

const extra = [
  // S1 — law +3 (61–63)
  q(
    61,
    "safety-law",
    "medium",
    "scenario",
    "apply",
    "도급·수급 구조에서 원수급인의 안전·보건 확보에 관한 협의가 지연될 때, 사업주·관계수급인의 역할을 고려할 때 가장 적절한 것은?",
    "산업안전보건법·도급",
    2,
    [
      wrong[0],
      wrong[1],
      correct("산업안전기사·도급·협의"),
      wrong[1],
    ],
    "중간 사업장에서 하도급이 다단계로 이루어지고, 협의체 회의가 불규칙하다.",
  ),
  q(
    62,
    "safety-law",
    "medium",
    "which_best",
    "understand",
    "중대재해 발생 시 사업주의 안전·보건 확보 의무와 관련해, 일반적으로 강조되는 관리 방향은?",
    "산업안전보건법·책임",
    2,
    [
      wrong[0],
      wrong[2],
      correct("산업안전기사·중대재해·책임"),
      wrong[3],
    ],
  ),
  q(
    63,
    "safety-law",
    "easy",
    "definition",
    "remember",
    "산업안전보건법령상 안전보건교육의 취지에 가장 가까운 것은?",
    "산업안전보건법·교육",
    2,
    [
      "생산성 지표만 향상시키기 위함",
      "장비 구매 세금 공제를 위함",
      correct("산업안전기사·교육·재해예방"),
      "근로자 취미 활동 지원을 위함",
    ],
  ),
  // risk +1 (64)
  q(
    64,
    "risk-assessment",
    "medium",
    "scenario",
    "apply",
    "작업장에서 유해·위험 요인을 식별한 뒤, 허용 가능성과 심각도를 평가하여 대책을 우선순위화하는 절차는?",
    "위험성평가",
    2,
    [
      wrong[0],
      wrong[1],
      correct("산업안전기사·위험성평가·우선순위"),
      "근로자 개인의 사생활을 평가하는 것",
    ],
    "연간 위험성평가 결과가 개선계획에 반영되지 않고 있다.",
  ),
  // erg +4 (65–68)
  q(
    65,
    "ergonomics",
    "medium",
    "scenario",
    "apply",
    "반복적인 상지 작업으로 인한 근골격계 부담을 줄이기 위해 작업대 높이·도구 무게·순환배치를 조정하는 접근은?",
    "인간공학·근골격계",
    2,
    [
      wrong[2],
      wrong[1],
      correct("산업안전기사·인간공학·작업개선"),
      wrong[0],
    ],
    "조립 라인에서 동일 자세가 3시간 이상 지속된다.",
  ),
  q(
    66,
    "ergonomics",
    "easy",
    "definition",
    "understand",
    "시스템 설계 시 인간의 한계(인지·신체)를 고려하는 공학적 접근을 총칭하는 것은?",
    "인간공학",
    2,
    [
      "생산량만 극대화하는 설계",
      "기계를 인간에게 맞추지 않는 설계",
      correct("산업안전기사·인간공학·시스템안전"),
      "품질검사만 생략하는 설계",
    ],
  ),
  q(
    67,
    "ergonomics",
    "hard",
    "which_best",
    "analyze",
    "작업장에서 소음·진동·조명 등 물리적 환경을 측정·개선할 때, 인간공학적 관점에서 우선적으로 고려할 것은?",
    "작업환경",
    2,
    [
      wrong[0],
      wrong[1],
      correct("산업안전기사·환경측정·개선"),
      "비용만 최소화하는 것",
    ],
  ),
  q(
    68,
    "ergonomics",
    "medium",
    "scenario",
    "apply",
    "디스플레이 작업에서 시선 이동·눈의 피로를 줄이기 위한 배치·휴식 설계 원칙에 가장 가까운 것은?",
    "VDT·인간공학",
    2,
    [
      "휴식 없이 연속 근무",
      wrong[1],
      correct("산업안전기사·VDT·인간공학"),
      wrong[2],
    ],
  ),
  // psm +3 (69–71)
  q(
    69,
    "psm",
    "medium",
    "scenario",
    "apply",
    "화학공정에서 공정 변경·원료 변경이 있을 때, 사전에 위험을 검토하고 승인하는 절차를 강제하는 취지는?",
    "공정안전관리·변경관리",
    2,
    [
      wrong[0],
      wrong[1],
      correct("산업안전기사·PSM·변경관리"),
      "생산만 우선하는 것",
    ],
  ),
  q(
    70,
    "psm",
    "medium",
    "which_best",
    "understand",
    "HAZOP 등 가이드워드를 이용한 공정 위험 분석의 목적에 가장 가까운 것은?",
    "HAZOP·공정위험",
    2,
    [
      "생산량 예측만",
      wrong[1],
      correct("산업안전기사·HAZOP·공정위험"),
      "근로자 개인의 사생활을 평가하는 것",
    ],
  ),
  q(
    71,
    "psm",
    "hard",
    "which_best",
    "analyze",
    "시스템 수명주기 초기 단계에서 적용하기에 적합한 위험 분석 기법의 일반적 취지는?",
    "시스템안전공학",
    2,
    [
      wrong[0],
      wrong[1],
      correct("산업안전기사·시스템안전·위험분석"),
      "사후 보고만 작성하는 것",
    ],
  ),
  // machinery +14 (72–85)
  ...Array.from({ length: 14 }, (_, i) => {
    const id = 72 + i;
    const n = i + 1;
    return q(
      id,
      "machinery-safety",
      i % 3 === 0 ? "hard" : i % 2 === 0 ? "medium" : "easy",
      i % 4 === 0 ? "scenario" : "which_best",
      i % 3 === 0 ? "apply" : "understand",
      `기계·설비 안전(창작 모의 ${n}) — 회전체·협착·끼임·절삭·프레스·크레인 등에서 위험요인을 줄이기 위한 방호·조작·점검·교육에 관한 일반적 관리 방향으로 가장 적절한 것은?`,
      "기계위험방지",
      2,
      [
        wrong[0],
        wrong[1],
        correct(`산업안전기사·기계안전·${n}`),
        wrong[2],
      ],
      n % 2 === 0
        ? "가공기계 주변에서 방호장치를 절단하고 속도를 높인 상태로 운전한다."
        : undefined,
    );
  }),
  // electrical +15 (86–100)
  ...Array.from({ length: 15 }, (_, i) => {
    const id = 86 + i;
    const n = i + 1;
    return q(
      id,
      "electrical-safety",
      i % 3 === 0 ? "hard" : "medium",
      i % 4 === 0 ? "scenario" : "which_best",
      i % 2 === 0 ? "apply" : "understand",
      `전기·정전·방폭·감전 방지(창작 모의 ${n}) — 검전·접지·누전차단·방폭구역·정전작업 등에서 안전 확보에 가장 가까운 것은?`,
      "전기위험방지",
      2,
      [
        wrong[0],
        wrong[1],
        correct(`산업안전기사·전기안전·${n}`),
        wrong[2],
      ],
      n % 3 === 0
        ? `가동 중인 설비의 덮개를 열고 점검하려 한다.`
        : undefined,
    );
  }),
  // chemical +5 (101–105)
  ...Array.from({ length: 5 }, (_, i) => {
    const id = 101 + i;
    const n = i + 1;
    return q(
      id,
      "chemical-safety",
      "medium",
      "scenario",
      "apply",
      `유해·위험 화학물질 취급·저장·반응(창작 모의 ${n}) — MSDS·밀폐·환기·계측·비상대응 등에서 가장 적절한 것은?`,
      "화학설비위험방지",
      2,
      [
        wrong[0],
        wrong[1],
        correct(`산업안전기사·화학안전·${n}`),
        wrong[2],
      ],
      n % 2 === 0 ? "증류·반응기 주변에서 환기가 불충분하다." : undefined,
    );
  }),
  // fire +3 (106–108)
  ...Array.from({ length: 3 }, (_, i) => {
    const id = 106 + i;
    const n = i + 1;
    return q(
      id,
      "fire-explosion",
      "medium",
      "which_best",
      "apply",
      `화재·폭발·분진·증기(창작 모의 ${n}) — 폭발위험 구역·방폭·화염방지·인화성 물질 관리에서 가장 적절한 것은?`,
      "화재·폭발방지",
      2,
      [
        wrong[0],
        wrong[1],
        correct(`산업안전기사·화재폭발·${n}`),
        wrong[2],
      ],
    );
  }),
  // confined +5 (109–113)
  ...Array.from({ length: 5 }, (_, i) => {
    const id = 109 + i;
    const n = i + 1;
    return q(
      id,
      "confined-space",
      "medium",
      "scenario",
      "apply",
      `밀폐공간·굴착·건설·비계(창작 모의 ${n}) — 산소·유해가스·감시·통신·구조계획에서 가장 적절한 것은?`,
      "건설안전·밀폐공간",
      2,
      [
        wrong[0],
        wrong[1],
        correct(`산업안전기사·건설안전·밀폐·${n}`),
        wrong[2],
      ],
      n % 2 === 0 ? "밀폐 탱크 내부 작업 전 농도 측정이 없다." : undefined,
    );
  }),
  // ppe +7 (114–120)
  ...Array.from({ length: 7 }, (_, i) => {
    const id = 114 + i;
    const n = i + 1;
    return q(
      id,
      "ppe",
      "easy",
      i % 2 === 0 ? "definition" : "scenario",
      "understand",
      `보호구(PPE)·안전장구(창작 모의 ${n}) — 작업별 위험에 맞는 지급·착용·점검·교체에서 가장 적절한 것은?`,
      "보호구·건설안전",
      2,
      [
        wrong[0],
        wrong[1],
        correct(`산업안전기사·PPE·${n}`),
        wrong[2],
      ],
    );
  }),
];

const raw = fs.readFileSync(fp, "utf8");
const arr = JSON.parse(raw);
if (!Array.isArray(arr)) throw new Error("expected array");
for (const item of extra) {
  if (arr.some((x) => x.id === item.id)) {
    throw new Error(`duplicate id ${item.id}`);
  }
}
const next = [...arr, ...extra];
fs.writeFileSync(fp, JSON.stringify(next, null, 2) + "\n", "utf8");
console.log(`Wrote ${next.length} items (${extra.length} appended).`);
