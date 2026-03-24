/**
 * 문항 풀 커버리지 점검 — 과목·stemKind·난이도 분포, 설계 문서 §6 빈 셀 경고
 * 실행: node scripts/check-question-coverage.mjs
 * 옵션: --fail-on-warn (경고 시 exit 1)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  EXAMS,
  STEM_ORDER,
  analyzeExam,
} from "./coverage-shared.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const FAIL_ON_WARN = process.argv.includes("--fail-on-warn");

function printMatrix(title, cats, rows) {
  const stems = new Set();
  for (const c of cats) {
    for (const sk of Object.keys(rows[c] || {})) stems.add(sk);
  }
  const stemCols = STEM_ORDER.filter((s) => stems.has(s));
  for (const s of stems) {
    if (!stemCols.includes(s)) stemCols.push(s);
  }
  console.log(`\n  [${title}] category × stemKind`);
  const header = ["category".padEnd(22), ...stemCols.map((s) => s.slice(0, 10).padStart(10))];
  console.log("  " + header.join(" "));
  for (const c of cats) {
    const parts = [c.padEnd(22)];
    for (const sk of stemCols) {
      parts.push(String(rows[c]?.[sk] ?? 0).padStart(10));
    }
    console.log("  " + parts.join(" "));
  }
}

let totalWarnings = 0;

for (const exam of EXAMS) {
  const fp = path.join(root, exam.file);
  const raw = fs.readFileSync(fp, "utf8");
  const items = JSON.parse(raw);
  if (!Array.isArray(items)) {
    console.error("Not an array:", exam.file);
    process.exit(1);
  }

  console.log(`\n=== ${exam.title} (${exam.slug}) — ${items.length}문항 ===`);
  const r = analyzeExam(exam, items);

  console.log("  난이도:", JSON.stringify(r.byDiff));
  console.log("  stemKind:", JSON.stringify(r.byStem));
  console.log("  cognitiveLevel:", JSON.stringify(r.byCog));
  console.log("  과목별:", JSON.stringify(r.byCat));

  printMatrix(exam.title, r.matrix.cats, r.matrix.rows);

  for (const w of r.warnings) {
    console.log("  ⚠ " + w);
    totalWarnings += 1;
  }
  for (const i of r.infos) {
    console.log("  ℹ " + i);
  }
  if (r.warnings.length === 0 && r.infos.length === 0) {
    console.log("  (추가 경고·안내 없음)");
  }
}

console.log("\n---");
if (totalWarnings > 0) {
  console.log(`커버리지 경고 ${totalWarnings}건`);
  if (FAIL_ON_WARN) process.exit(1);
} else {
  console.log("커버리지 검사 완료 — 경고 없음");
}
