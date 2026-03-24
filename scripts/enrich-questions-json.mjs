/**
 * 문항 JSON에 stemKind, cognitiveLevel, itemVersion, reviewStatus 보강
 * 실행: node scripts/enrich-questions-json.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const FILES = [
  "data/info-processing-engineer-questions.json",
  "data/electrical-engineer-questions.json",
  "data/industrial-safety-engineer-questions.json",
  "data/industrial-safety-industrial-questions.json",
  "data/construction-safety-industrial-questions.json",
  "data/construction-safety-engineer-questions.json",
];

function inferStemKind(q) {
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

function inferCognitiveLevel(q, stemKind) {
  if (stemKind === "not" || stemKind === "code_or_sql") return "analyze";
  const d = q.difficulty ?? "medium";
  if (d === "easy") return stemKind === "definition" ? "remember" : "understand";
  if (d === "hard") return "apply";
  return "understand";
}

function enrich(arr) {
  for (const q of arr) {
    const sk = q.stemKind ?? inferStemKind(q);
    q.stemKind = sk;
    if (q.cognitiveLevel == null) {
      q.cognitiveLevel = inferCognitiveLevel(q, sk);
    }
    if (q.itemVersion == null) q.itemVersion = 1;
    if (q.reviewStatus == null) q.reviewStatus = "published";
  }
}

for (const rel of FILES) {
  const fp = path.join(root, rel);
  const raw = fs.readFileSync(fp, "utf8");
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) {
    console.error("Not an array:", rel);
    process.exit(1);
  }
  enrich(data);
  fs.writeFileSync(fp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log("OK", rel, data.length, "items");
}
