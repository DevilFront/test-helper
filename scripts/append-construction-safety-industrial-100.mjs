/**
 * 건설안전 산업기사 풀을 필기 100문항(5과목×20)에 맞게 보강합니다.
 * 실행: node scripts/append-construction-safety-industrial-100.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const fp = path.join(root, "data/construction-safety-industrial-questions.json");

const correct = (label) =>
  `건설현장 안전·보건 절차를 확인하고 위험을 줄이기 위한 조치·기록·교육을 이행한다 (창작 모의: ${label})`;

function q(id, category, difficulty, stemKind, cognitiveLevel, topic, domainLabel, correctIdx) {
  const wrong = [
    "관계 법령·지침을 확인하지 않고 관행만 따르는 방식",
    "위험 요인을 문서화하지 않고 구두로만 전달하는 방식",
    "개인의 편의만으로 보호구를 생략하는 방식",
  ];
  const opts = [...wrong.slice(0, correctIdx), correct(domainLabel), ...wrong.slice(correctIdx)];
  const options = opts.slice(0, 4);
  const answer = options.indexOf(correct(domainLabel));
  return {
    id,
    category,
    difficulty,
    question: `[창작 모의 · 건설안전 산업기사] ${topic}`,
    options,
    answer: answer >= 0 ? answer : 3,
    explanation: `창작 모의 문항입니다. 실제 시험은 시행 공고·최신 법령·교재를 따릅니다. ${domainLabel} 영역에서는 절차·기록·교육·보호구·위험성평가 등을 종합적으로 점검하는 것이 일반적입니다.`,
    sourceLevel: "creative_mock",
    stemKind,
    cognitiveLevel,
    itemVersion: 1,
    reviewStatus: "published",
    tags: [domainLabel],
  };
}

/** S1 +5, S2 +10, S3 +5, S4 +10, S5 +10 = 40 */
const extra = [
  // S1 (61–65)
  q(61, "construction-law", "medium", "scenario", "apply", "다단계 하도급 현장에서 안전·보건 협의체 운영 시 사업주·관계수급인의 협력 취지에 가장 가까운 것은?", "건설·산업안전 법령", 2),
  q(62, "construction-mgmt", "medium", "which_best", "understand", "건설공사의 유해위험방지계획서·안전관리비 집행과 관련한 일반적 관리 방향은?", "건설공사 관리", 2),
  q(63, "construction-risk", "medium", "scenario", "apply", "굴착·가설·고소 작업이 겹치는 구간에서 위험성평가 후 개선계획을 수립할 때 우선 고려할 것은?", "위험성평가", 2),
  q(64, "construction-law", "easy", "definition", "remember", "건설업 관련 법령상 안전·보건 확보의 기본 취지에 가장 가까운 것은?", "건설·산업안전 법령", 2),
  q(65, "construction-mgmt", "hard", "which_best", "analyze", "작업 변경·공정 지연 시에도 안전조치를 유지하기 위한 현장 관리 방향은?", "건설공사 관리", 2),
  // S2 (66–75)
  q(66, "construction-health", "medium", "scenario", "apply", "소음·진동·고온 환경에서의 순환근무·휴게 배치를 검토할 때 인간공학적 관점에서 우선할 것은?", "건설 보건·인간공학", 2),
  q(67, "construction-health", "easy", "definition", "understand", "근골격계 부담을 줄이기 위한 작업자세·작업대 설계의 일반적 방향은?", "건설 보건·인간공학", 2),
  q(68, "construction-fire", "medium", "scenario", "apply", "용접·절단 화기 작업 구역에서 화재 예방·소화기·감시인 배치에 관한 일반적 조치는?", "건설 현장 화재예방", 2),
  q(69, "construction-fire", "hard", "which_best", "analyze", "가연물 보관·인화성 가스 취급 시 환기·금연·화기 통제에 관한 관리 방향은?", "건설 현장 화재예방", 2),
  q(70, "construction-health", "medium", "which_best", "apply", "고소 작업 시 추락·낙하물과 연계된 보건·안전 교육의 취지에 가까운 것은?", "건설 보건·인간공학", 2),
  q(71, "construction-fire", "easy", "definition", "remember", "현장 화기 작업 허가·점검의 목적에 가장 가까운 것은?", "건설 현장 화재예방", 2),
  q(72, "construction-health", "hard", "scenario", "analyze", "야간·교대 근무 시 피로·주의력 저하와 재해 위험을 줄이기 위한 조직적 대응은?", "건설 보건·인간공학", 2),
  q(73, "construction-fire", "medium", "scenario", "apply", "임시 가설건물·창고에서의 전기·난방·가연물 혼재 시 사전 점검 항목으로 적절한 것은?", "건설 현장 화재예방", 2),
  q(74, "construction-health", "easy", "which_best", "understand", "작업환경측정 결과를 근로자 건강보호·작업배치에 반영하는 취지는?", "건설 보건·인간공학", 2),
  q(75, "construction-fire", "medium", "which_best", "apply", "분진·목재 가공 현장에서 누적 화재 위험을 줄이기 위한 청소·환기 관리는?", "건설 현장 화재예방", 2),
  // S3 (76–80)
  q(76, "construction-excavation", "medium", "scenario", "apply", "연약지반 굴착 시 흙막이·지보공·배수·침하 관측을 병행할 때의 일반적 안전 원칙은?", "건설 굴착·지보", 2),
  q(77, "construction-scaffold", "medium", "scenario", "apply", "비계 기둥·띠장·수평연결재·받침의 조립 후 사용 전 점검에서 확인할 사항은?", "건설 비계", 2),
  q(78, "construction-machinery", "hard", "which_best", "analyze", "크레인·지게차 등 건설기계 작업 시 신호체계·작업반경·지반 안정성에 관한 관리는?", "건설 기계·운반", 2),
  q(79, "construction-excavation", "easy", "definition", "understand", "굴착면 경사·흙막이 지보공의 목적에 가장 가까운 것은?", "건설 굴착·지보", 2),
  q(80, "construction-scaffold", "medium", "which_best", "apply", "작업발판·난간·발판끝 방호와 적재하중 제한의 취지는?", "건설 비계", 2),
  // S4 (81–90)
  q(81, "construction-demolition", "hard", "scenario", "apply", "철거·파쇄 작업 시 비산·붕괴·먼지·소음을 통제하기 위한 순서·차단구역 설정은?", "건설 철거", 2),
  q(82, "construction-electrical", "medium", "scenario", "apply", "가설전기·분전함·누전차단·접지를 점검할 때 건설현장 전기안전의 취지는?", "건설 전기안전", 2),
  q(83, "construction-demolition", "medium", "which_best", "understand", "구조체 남부재·2차 붕괴 위험을 줄이기 위한 사전 절차는?", "건설 철거", 2),
  q(84, "construction-electrical", "hard", "which_best", "analyze", "우천·습기 환경에서 이동형 전동공구·임시조명 사용 시 확인할 사항은?", "건설 전기안전", 2),
  q(85, "construction-demolition", "easy", "definition", "remember", "철거·파쇄 작업 시 근로자·통행자 보호를 위한 통제선·유도원 배치의 목적은?", "건설 철거", 2),
  q(86, "construction-electrical", "medium", "scenario", "apply", "정전작업·검전·통전금지 표지·잠금장치에 관한 일반적 조치는?", "건설 전기안전", 2),
  q(87, "construction-demolition", "medium", "which_best", "apply", "인접 구조물·지하매설물에 대한 사전 조사·보호조치의 취지는?", "건설 철거", 2),
  q(88, "construction-electrical", "easy", "which_best", "understand", "건설용 리프트·승강기·전기설비의 정기점검·이상 시 조치의 방향은?", "건설 전기안전", 2),
  q(89, "construction-demolition", "hard", "scenario", "analyze", "상부 철거·하부 잔존 구조에서 낙하·전도 위험을 줄이기 위한 작업 순서는?", "건설 철거", 2),
  q(90, "construction-electrical", "medium", "which_best", "apply", "방습·방진·방폭 구역에서 전기기계기구 선정·설치 시 고려할 점은?", "건설 전기안전", 2),
  // S5 (91–100)
  q(91, "construction-confined", "hard", "scenario", "apply", "맨홀·탱크·수직갱 등 밀폐공간 작업 전 산소·유해가스 측정·환기·감시인 배치는?", "건설 밀폐공간", 2),
  q(92, "construction-ppe", "easy", "definition", "remember", "작업별 보호구 지급·착용 점검·불량 교체의 목적은?", "건설 보호구", 2),
  q(93, "construction-confined", "medium", "scenario", "apply", "밀폐공간 내 구조·통신·비상 대피·구조계획을 수립할 때 우선할 것은?", "건설 밀폐공간", 2),
  q(94, "construction-ppe", "medium", "which_best", "apply", "고소·추락 위험 작업에서 안전대·라이프라인·부착점 선정의 취지는?", "건설 보호구", 2),
  q(95, "construction-confined", "medium", "which_best", "understand", "밀폐공간 작업 중 가스 농도 재측정·작업 중단 기준의 취지는?", "건설 밀폐공간", 2),
  q(96, "construction-ppe", "hard", "scenario", "analyze", "먼지·분진·화학물질 작업에서 호흡보호구·보호구 등급 선택의 방향은?", "건설 보호구", 2),
  q(97, "construction-confined", "easy", "definition", "remember", "밀폐공간 출입 허가·서명·출입자 명부의 관리 목적은?", "건설 밀폐공간", 2),
  q(98, "construction-ppe", "medium", "scenario", "apply", "충격·관통 위험이 있는 작업에서 안전모·안전화·보호구 착용을 강화하는 이유는?", "건설 보호구", 2),
  q(99, "construction-confined", "hard", "which_best", "analyze", "인접 공정의 화기·가스와 연계된 밀폐공간 작업 시 공동 안전조치는?", "건설 밀폐공간", 2),
  q(100, "construction-ppe", "easy", "which_best", "understand", "작업 종료 후 보호구 세척·보관·폐기로 위생·재사용 위험을 줄이는 관리는?", "건설 보호구", 2),
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
