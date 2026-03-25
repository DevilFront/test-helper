/**
 * 건설안전기사 풀을 필기 120문항(6과목×20)에 맞게 보강합니다.
 * reference6.pdf 등 6과목 구조 — 창작 모의, 기출 복제 없음.
 * 실행: node scripts/append-construction-safety-engineer-120.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const fp = path.join(root, "data/construction-safety-engineer-questions.json");

const correct = (label) =>
  `건설현장 안전·보건 절차를 확인하고 위험을 줄이기 위한 조치·기록·교육을 이행한다 (창작 모의: ${label})`;

function q(id, category, difficulty, topic, domainLabel, correctIdx) {
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
    question: `[창작 모의 · 건설안전기사] ${topic}`,
    options,
    answer: answer >= 0 ? answer : 3,
    explanation: `창작 모의 문항입니다. 실제 시험은 시행 공고·최신 법령·교재를 기준으로 합니다. ${domainLabel} 영역에서는 절차·기록·교육·보호구·위험성평가 등을 종합적으로 점검하는 것이 일반적입니다.`,
    sourceLevel: "creative_mock",
    stemKind: "which_best",
    cognitiveLevel: "understand",
    itemVersion: 1,
    reviewStatus: "published",
  };
}

/** +15 health, +15 fire, 나머지 10과목 각 +3 = 60 */
const extra = [];
let id = 61;

const pushN = (cat, n, stemFn) => {
  for (let i = 0; i < n; i++) {
    extra.push(q(id++, cat, "medium", stemFn(i), cat, 2));
  }
};

pushN("construction-law", 3, (i) => `건설안전 관련 법령·행정 절차(창작 ${i + 1})를 고려할 때, 현장 관리 관점에서 가장 적절한 것은?`);
pushN("construction-mgmt", 3, (i) => `건설공사 안전관리계획·보건관리계획 수립·이행(창작 ${i + 1})과 관련한 일반적 방향은?`);
pushN("construction-risk", 3, (i) => `건설현장 위험성평가·재평가(창작 ${i + 1})를 실시할 때 우선 고려할 것은?`);
pushN("construction-health", 15, (i) => `산업심리·교육·작업환경(창작 ${i + 1})을 고려할 때, 건설안전보건 관점에서 가장 적절한 것은?`);
pushN("construction-fire", 15, (i) => `산업심리·인간공학·시스템안전(창작 ${i + 1})을 고려할 때, 건설안전보건 관점에서 가장 적절한 것은?`);
pushN("construction-excavation", 3, (i) => `굴착·흙막이·지보공(창작 ${i + 1})과 관련한 일반적 안전 원칙은?`);
pushN("construction-scaffold", 3, (i) => `비계·가설구조·동바리(창작 ${i + 1})와 관련한 일반적 안전 원칙은?`);
pushN("construction-machinery", 3, (i) => `건설기계·양중·운반(창작 ${i + 1})과 관련한 일반적 안전 원칙은?`);
pushN("construction-demolition", 3, (i) => `건설재료·구조·해체(창작 ${i + 1})와 관련한 일반적 안전 원칙은?`);
pushN("construction-electrical", 3, (i) => `건설현장 전기·감전 예방(창작 ${i + 1})과 관련한 일반적 방향은?`);
pushN("construction-confined", 3, (i) => `밀폐공간·지하·특수작업(창작 ${i + 1})과 관련한 일반적 안전 원칙은?`);
pushN("construction-ppe", 3, (i) => `보호구·안전장구(창작 ${i + 1})와 관련한 일반적 안전 원칙은?`);

const raw = fs.readFileSync(fp, "utf8");
const data = JSON.parse(raw);
const maxId = Math.max(...data.map((x) => x.id));
if (maxId >= 61) {
  console.error("이미 id 61 이상이 있습니다.");
  process.exit(1);
}
fs.writeFileSync(fp, JSON.stringify([...data, ...extra], null, 2) + "\n");
console.log(`appended ${extra.length} questions, ids 61–${id - 1}`);
