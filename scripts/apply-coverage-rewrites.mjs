/**
 * 커버리지 갭에 대해 후보 id에 대해 "안전한" 기계적 수정만 적용한다.
 *
 * - scenario: trySplitLeadIn() 성공 시에만 leadIn / question 분리 + stemKind
 * - code_or_sql: contextBlock이 비었을 때만 SQL 스텁 + contextType + stemKind
 * - not: 자동 수정 안 함 (정답 뒤집힘 위험) — 후보 id만 안내
 *
 * 기본은 dry-run (--apply 가 있을 때만 JSON 저장)
 *
 *   node scripts/apply-coverage-rewrites.mjs
 *   node scripts/apply-coverage-rewrites.mjs --apply
 *   node scripts/apply-coverage-rewrites.mjs --exam=info-processing
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { EXAMS } from "./coverage-shared.mjs";
import {
  pickScenarioCandidates,
  pickCodeOrSqlCandidates,
  pickNotCandidates,
  getGapsForExam,
  trySplitLeadIn,
} from "./coverage-candidates.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const APPLY = process.argv.includes("--apply");
let examFilter = "all";
for (const a of process.argv) {
  if (a.startsWith("--exam=")) examFilter = a.slice("--exam=".length);
}

const CODE_STUB = `-- [자동 삽입] 문항 내용에 맞게 수정한 뒤 이 주석을 지우세요.
SELECT 1 AS placeholder;`;

function bumpTags(q) {
  if (!Array.isArray(q.tags)) q.tags = [];
  if (!q.tags.includes("auto-coverage-rewrite")) {
    q.tags.push("auto-coverage-rewrite");
  }
}

function processExam(exam) {
  const fp = path.join(root, exam.file);
  const raw = fs.readFileSync(fp, "utf8");
  const items = JSON.parse(raw);
  if (!Array.isArray(items)) throw new Error(`Not an array: ${exam.file}`);

  const gaps = getGapsForExam(exam.slug, items);
  const log = [];
  /** 이번 실행에서 이미 바꾼 문항 — scenario·code 이중 적용 방지 */
  const touched = new Set();

  for (const g of gaps) {
    if (g.shortfall <= 0) continue;

    if (g.kind === "scenario") {
      const cands = pickScenarioCandidates(items, g.shortfall);
      for (const c of cands) {
        const q = items.find((x) => x.id === c.id);
        if (!q || touched.has(q.id)) continue;
        if (q.leadIn && String(q.leadIn).trim()) {
          log.push({
            exam: exam.slug,
            id: q.id,
            kind: "scenario",
            status: "skip",
            reason: "이미 leadIn 있음",
          });
          continue;
        }
        const split = trySplitLeadIn(q.question);
        if (!split) {
          log.push({
            exam: exam.slug,
            id: q.id,
            kind: "scenario",
            status: "skip",
            reason: "문장 분리 휴리스틱 실패 — 수동으로 leadIn/question 나누기",
          });
          continue;
        }
        const prevQ = q.question;
        q.leadIn = split.leadIn;
        q.question = split.question;
        q.stemKind = "scenario";
        if (!q.cognitiveLevel) q.cognitiveLevel = "apply";
        q.itemVersion = (q.itemVersion ?? 1) + 1;
        bumpTags(q);
        touched.add(q.id);
        log.push({
          exam: exam.slug,
          id: q.id,
          kind: "scenario",
          status: "applied",
          beforeQuestion: prevQ,
          leadIn: q.leadIn,
          afterQuestion: q.question,
        });
      }
    }

    if (g.kind === "code_or_sql") {
      const cands = pickCodeOrSqlCandidates(items, g.shortfall);
      for (const c of cands) {
        const q = items.find((x) => x.id === c.id);
        if (!q || touched.has(q.id)) continue;
        if (q.contextBlock && String(q.contextBlock).trim().length > 0) {
          log.push({
            exam: exam.slug,
            id: q.id,
            kind: "code_or_sql",
            status: "skip",
            reason: "이미 contextBlock 있음",
          });
          continue;
        }
        q.contextBlock = CODE_STUB;
        q.contextType = "code";
        q.stemKind = "code_or_sql";
        q.itemVersion = (q.itemVersion ?? 1) + 1;
        bumpTags(q);
        touched.add(q.id);
        log.push({
          exam: exam.slug,
          id: q.id,
          kind: "code_or_sql",
          status: "applied",
          note: "SQL 스텁 삽입 — 반드시 내용 맞게 교체",
        });
      }
    }

    if (g.kind === "not") {
      const cands = pickNotCandidates(items, g.shortfall);
      for (const c of cands) {
        log.push({
          exam: exam.slug,
          id: c.id,
          kind: "not",
          status: "manual",
          reason:
            "부정형은 발문·정답·오답·해설을 함께 바꿔야 해 자동 수정하지 않음",
        });
      }
    }
  }

  return { fp, items, log };
}

const exams =
  examFilter === "all"
    ? EXAMS
    : EXAMS.filter((e) => e.slug === examFilter);

if (exams.length === 0) {
  console.error(`알 수 없는 --exam=${examFilter}`);
  process.exit(1);
}

const allLog = [];
for (const exam of exams) {
  const { fp, items, log } = processExam(exam);
  allLog.push(...log);

  const applied = log.filter((x) => x.status === "applied");
  const skipped = log.filter((x) => x.status === "skip");
  const manual = log.filter((x) => x.status === "manual");

  console.log(`\n=== ${exam.title} (${exam.slug}) ===`);
  console.log(`  적용 가능 건수: ${applied.length}, 스킵: ${skipped.length}, 수동(not): ${manual.length}`);

  for (const e of log) {
    const p = `  [${e.kind}] id ${e.id} — ${e.status}`;
    if (e.reason) console.log(p + `: ${e.reason}`);
    else if (e.note) console.log(p + `: ${e.note}`);
    else console.log(p);
    if (e.status === "applied" && e.leadIn) {
      console.log(`      leadIn: ${e.leadIn.slice(0, 80)}${e.leadIn.length > 80 ? "…" : ""}`);
      console.log(`      question: ${e.afterQuestion?.slice(0, 80)}…`);
    }
  }

  if (APPLY && applied.length > 0) {
    fs.writeFileSync(fp, `${JSON.stringify(items, null, 2)}\n`, "utf8");
    console.log(`  → 저장: ${path.relative(root, fp)} (${applied.length}문항 변경)`);
  } else if (!APPLY && applied.length > 0) {
    console.log(`  (dry-run: --apply 로 저장)`);
  }
}

if (!APPLY && allLog.some((x) => x.status === "applied")) {
  console.log("\n---\n변경을 파일에 쓰려면: node scripts/apply-coverage-rewrites.mjs --apply");
}
