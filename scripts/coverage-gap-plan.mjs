/**
 * 커버리지 갭 → 후보 문항 ID·작업 힌트 (JSON)
 *
 * 왜 자동으로 JSON 문항을 덮어쓰지 않나?
 * - 상황형·부정형·SQL형은 문장 품질·정답 일관성이 핵심이라 무작정 라벨만 바꾸거나
 *   템플릿 문장을 넣으면 오답/해설과 충돌하기 쉽다.
 * - 이 스크립트는 check-coverage와 동일한 임계값으로 "몇 개 부족한지"와
 *   "어떤 id를 먼저 손대면 좋은지"만 산출한다.
 * - 기계적 수정은 `scripts/apply-coverage-rewrites.mjs` (dry-run 기본) 참고.
 *
 * 실행: node scripts/coverage-gap-plan.mjs
 * 옵션:
 *   --out <path>   기본: reports/coverage-gap-plan.json
 *   --stdout       파일 대신 JSON만 표준출력
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  EXAMS,
  computeStemGaps,
  countMap,
  analyzeExam,
} from "./coverage-shared.mjs";
import {
  pickScenarioCandidates,
  pickCodeOrSqlCandidates,
  pickNotCandidates,
} from "./coverage-candidates.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const args = process.argv.slice(2);
let outPath = path.join(root, "reports", "coverage-gap-plan.json");
let stdoutOnly = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--out" && args[i + 1]) {
    outPath = path.isAbsolute(args[i + 1]) ? args[i + 1] : path.join(root, args[i + 1]);
    i++;
  }
  if (args[i] === "--stdout") stdoutOnly = true;
}

function planForExam(exam, items) {
  const byStem = countMap(items, (q) => q.stemKind ?? "unknown");
  const gaps = computeStemGaps(exam.slug, byStem, items.length);
  const actions = [];

  for (const g of gaps) {
    if (g.shortfall <= 0) continue;
    let candidates = [];
    if (g.kind === "scenario") {
      candidates = pickScenarioCandidates(items, g.shortfall);
      actions.push({
        gap: g,
        strategy:
          "짧은 정의문을 상황 서술로 확장하거나, 긴 지문을 leadIn / question 으로 분리",
        candidates,
      });
    } else if (g.kind === "code_or_sql") {
      candidates = pickCodeOrSqlCandidates(items, g.shortfall);
      actions.push({
        gap: g,
        strategy: "DB·쿼리·알고리즘 표현을 contextBlock으로 제시하고 선지·해설 정합성 확인",
        candidates,
      });
    } else if (g.kind === "not") {
      candidates = pickNotCandidates(items, g.shortfall);
      actions.push({
        gap: g,
        strategy: "긍정형을 부정형으로 바꿀 때 정답이 바뀌는지 반드시 확인",
        candidates,
      });
    }
  }

  const r = analyzeExam(exam, items);
  return {
    examSlug: exam.slug,
    title: exam.title,
    dataFile: exam.file,
    totalQuestions: items.length,
    stemKindCounts: r.byStem,
    stemGaps: gaps,
    actions,
  };
}

const report = {
  generatedAt: new Date().toISOString(),
  note:
    "후보는 휴리스틱이며, 실제 수정은 사람 검수 또는 LLM 초안+검수를 권장합니다. 부분 자동화: npm run apply-coverage-rewrites (dry-run 기본)",
  exams: [],
};

for (const exam of EXAMS) {
  const fp = path.join(root, exam.file);
  const raw = fs.readFileSync(fp, "utf8");
  const items = JSON.parse(raw);
  if (!Array.isArray(items)) {
    console.error("Not an array:", exam.file);
    process.exit(1);
  }
  report.exams.push(planForExam(exam, items));
}

const json = `${JSON.stringify(report, null, 2)}\n`;

if (stdoutOnly) {
  process.stdout.write(json);
} else {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, json, "utf8");
  console.log(`작성: ${outPath}`);
}

for (const ex of report.exams) {
  console.log(`\n=== ${ex.title} ===`);
  if (ex.actions.length === 0) {
    console.log("  (숫자 갭 없음 — check-coverage 경고와 함께 보려면 enrich/데이터 동기화 확인)");
  }
  for (const a of ex.actions) {
    const { kind, shortfall, current, target } = a.gap;
    console.log(
      `  [${kind}] ${current} → 목표 ${target}, 부족 ${shortfall}개`,
    );
    console.log(`      전략: ${a.strategy}`);
    for (const c of a.candidates) {
      console.log(`      · id ${c.id} (${c.category}) ${c.hint}`);
    }
  }
}
