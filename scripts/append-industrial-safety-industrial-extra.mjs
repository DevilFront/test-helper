/**
 * 산업안전 산업기사 풀을 필기 100문항(과목당 20)에 맞게 보강합니다.
 * 실행: node scripts/append-industrial-safety-industrial-extra.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const fp = path.join(root, "data/industrial-safety-industrial-questions.json");

function q(
  id,
  category,
  difficulty,
  cognitiveLevel,
  topic,
  domainLabel,
  correctIdx = 2,
) {
  const wrong = [
    "관계 법령·지침을 확인하지 않고 관행만 따르는 방식",
    "위험 요인을 문서화하지 않고 구두로만 전달하는 방식",
    "개인의 편의만으로 보호구를 생략하는 방식",
  ];
  const correct = `법령·지침을 확인하고 위험을 줄이기 위한 절차·기록·교육을 이행한다 (창작 모의: 산업안전 산업기사·${domainLabel})`;
  const options = [
    ...wrong.slice(0, correctIdx),
    correct,
    ...wrong.slice(correctIdx),
  ];
  let answer = options.indexOf(correct);
  if (answer < 0) answer = 0;
  return {
    id,
    category,
    difficulty,
    question: `[창작 모의 · 산업안전 산업기사] ${topic}을(를) 고려할 때, 다음 중 ${domainLabel} 관점에서 가장 적절한 것은?`,
    options,
    answer,
    explanation: `${topic}을(를) 고려할 때, 창작 모의 문항이며, 실제 시험은 시행 공고·최신 법령·교재를 기준으로 합니다. ${domainLabel} 영역에서는 절차·기록·교육·보호구·위험성평가 등을 종합적으로 점검하는 것이 일반적입니다.`,
    sourceLevel: "creative_mock",
    stemKind: "which_best",
    cognitiveLevel,
    itemVersion: 1,
    reviewStatus: "published",
  };
}

/** id 61–100: 과목별 풀 보강 분배 */
const extra = [
  // S1 — law 5
  q(61, "safety-law", "easy", "understand", "안전보건관리책임자 지정·역할", "산업안전보건법·관련 법령", 2),
  q(62, "safety-law", "medium", "understand", "중대재해처벌 등 강화된 책임체계의 일반적 취지", "산업안전보건법·관련 법령", 1),
  q(63, "safety-law", "medium", "apply", "도급·하도급 시 안전보건 조치 협의", "산업안전보건법·관련 법령", 3),
  q(64, "safety-law", "easy", "understand", "안전보건교육 이수·기록 보전", "산업안전보건법·관련 법령", 2),
  q(65, "safety-law", "hard", "apply", "유해·위험 기계·기구 방호조치·안전인증", "산업안전보건법·관련 법령", 0),
  // S1 — management 5
  q(66, "safety-management", "easy", "understand", "안전보건 경영방침·목표 설정", "안전보건관리체계", 2),
  q(67, "safety-management", "medium", "understand", "위험성평가 계획·실시·검토 주기", "안전보건관리체계", 1),
  q(68, "safety-management", "medium", "apply", "작업환경측정 결과의 활용·개선", "안전보건관리체계", 3),
  q(69, "safety-management", "easy", "understand", "안전보건 협의체·근로자 참여", "안전보건관리체계", 2),
  q(70, "safety-management", "hard", "apply", "재해조사·근본원인 분석·재발방지", "안전보건관리체계", 0),
  // S2 — psm 2, health 2, ergonomics 1
  q(71, "psm", "medium", "understand", "PSM 요소 중 변경관리(MOC) 절차", "공정안전관리(PSM)", 2),
  q(72, "psm", "hard", "apply", "가동전 안전점검(Pre-startup review) 취지", "공정안전관리(PSM)", 1),
  q(73, "industrial-health", "medium", "understand", "유해화학물질 취급·MSDS 활용", "산업보건", 3),
  q(74, "industrial-health", "easy", "understand", "작업환경 개선·국소배기 등 보건조치", "산업보건", 2),
  q(75, "ergonomics", "medium", "apply", "반복·고령 작업자에 대한 작업 재배치", "인간공학·근골격계", 0),
  // S3 — machinery 15
  q(76, "machinery-safety", "easy", "understand", "회전체·전동기 끼임 방지용 방호덮개", "기계·설비 안전", 2),
  q(77, "machinery-safety", "easy", "understand", "비상정지·인터록 장치", "기계·설비 안전", 1),
  q(78, "machinery-safety", "medium", "apply", "컨베이어·롤러 정비 시 에너지 차단(LOTO)", "기계·설비 안전", 3),
  q(79, "machinery-safety", "medium", "understand", "프레스·전단기 안전장치·두 손 조작", "기계·설비 안전", 2),
  q(80, "machinery-safety", "hard", "apply", "이동식 크레인·호이스트 작업 반경·신호체계", "기계·설비 안전", 0),
  q(81, "machinery-safety", "medium", "understand", "밀폐 공간 인접 기계 설비의 환기·가스측정", "기계·설비 안전", 2),
  q(82, "machinery-safety", "easy", "understand", "날카로운 절삭·파편 방지 보호구", "기계·설비 안전", 1),
  q(83, "machinery-safety", "hard", "apply", "로봇·자동화 설비 교육구역·펜스", "기계·설비 안전", 3),
  q(84, "machinery-safety", "medium", "understand", "벨트·체인 구동부 덮개·간격", "기계·설비 안전", 2),
  q(85, "machinery-safety", "medium", "apply", "금형 교체·세팅 시 안전 블록·서포트", "기계·설비 안전", 0),
  q(86, "machinery-safety", "easy", "understand", "그라인더·톱날 파손·이상 진동 점검", "기계·설비 안전", 2),
  q(87, "machinery-safety", "hard", "apply", "압축공기 분무·고압 호스 튀김 방지", "기계·설비 안전", 1),
  q(88, "machinery-safety", "medium", "understand", "승강기·리프트 정기검사·하중표시", "기계·설비 안전", 3),
  q(89, "machinery-safety", "medium", "apply", "컨베이어 통로·크로스워크 분리", "기계·설비 안전", 2),
  q(90, "machinery-safety", "easy", "understand", "휴대용 전동공구 절연·접지 확인", "기계·설비 안전", 0),
  // S4 — electrical 2, chemical 2, fire 1
  q(91, "electrical-safety", "medium", "apply", "정전작업 허가·검전·접지", "전기·감전 방지", 2),
  q(92, "electrical-safety", "hard", "apply", "아크플래시·단락 시 보호구·거리 확보", "전기·감전 방지", 1),
  q(93, "chemical-safety", "medium", "understand", "화학물질 저장·분리·환기", "화학·유해물질", 3),
  q(94, "chemical-safety", "hard", "apply", "반응성·불안정 물질 취급·온도관리", "화학·유해물질", 0),
  q(95, "fire-explosion", "medium", "apply", "분진·증기 폭발위험 구역 전기기기·방폭", "화재·폭발 방지", 2),
  // S5 — confined 2, ppe 2, risk 1
  q(96, "confined-space", "hard", "apply", "밀폐공간 작업 감시인·통신·구조계획", "밀폐공간", 1),
  q(97, "confined-space", "medium", "understand", "산소·유해가스 농도 측정·환기", "밀폐공간", 2),
  q(98, "ppe", "easy", "understand", "작업별 보호구 지급·착용 점검", "보호구", 3),
  q(99, "ppe", "medium", "apply", "호흡보호구 선택·필터 교체 주기", "보호구", 0),
  q(100, "risk-assessment", "medium", "apply", "위험성평가 3단계(위험요인·허용가능성·감소대책)", "위험성평가", 2),
];

const raw = fs.readFileSync(fp, "utf8");
const arr = JSON.parse(raw);
if (!Array.isArray(arr)) throw new Error("expected array");
const maxId = Math.max(...arr.map((x) => x.id));
if (maxId !== 60) {
  console.warn(`expected last id 60, got ${maxId} — appending anyway`);
}
for (const item of extra) {
  if (arr.some((x) => x.id === item.id)) {
    throw new Error(`duplicate id ${item.id}`);
  }
}
const next = [...arr, ...extra];
fs.writeFileSync(fp, JSON.stringify(next, null, 2) + "\n", "utf8");
console.log(`Wrote ${next.length} items (${extra.length} appended).`);
