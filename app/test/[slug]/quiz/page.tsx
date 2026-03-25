import Link from "next/link";
import { notFound } from "next/navigation";
import { TestRunner } from "@/components/test-runner";
import {
  parseExamDifficultyMode,
  SESSION_QUESTION_CAP,
  SESSION_QUESTION_CAP_FULL_120,
  sessionCapForFullMockExam,
} from "@/lib/exam-modes";
import { getExamConfig, isExamSlug } from "@/lib/exam-registry";
import { parseCategoryFocusParam } from "@/lib/quiz-url";
import { parseFullMockPreset } from "@/lib/full-mock-preset";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    mode?: string;
    focus?: string;
    session?: string;
    cap?: string;
    preset?: string;
  }>;
};

export async function generateMetadata({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const mode = parseExamDifficultyMode(sp.mode);
  if (!isExamSlug(slug) || !mode) return { title: "모의 테스트" };
  const c = getExamConfig(slug);
  const fullMock =
    (slug === "info-processing" ||
      slug === "industrial-safety-industrial" ||
      slug === "industrial-safety" ||
      slug === "construction-safety-industrial" ||
      slug === "electrical-engineer" ||
      slug === "electrical-craftsman" ||
      slug === "construction-safety-engineer") &&
    parseFullMockPreset(sp.preset) === "full-mock";
  const maxQ = fullMock
    ? sessionCapForFullMockExam(slug)
    : SESSION_QUESTION_CAP;
  return {
    title: "모의 테스트",
    description: `${c?.title ?? ""} · 최대 ${maxQ}문항`,
  };
}

export default async function QuizPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const mode = parseExamDifficultyMode(sp.mode);
  if (!isExamSlug(slug) || !mode) notFound();
  const config = getExamConfig(slug);
  if (!config) notFound();
  const categoryFilter = parseCategoryFocusParam(sp.focus);
  /** 난이도 화면에서 들어올 때만 전달 — 이어풀기 초기화 후 매번 새 랜덤 순서 */
  const sessionFresh = sp.session === "new";
  const focusKey = categoryFilter?.slice().sort().join(",") ?? "";
  const preset =
    slug === "info-processing" ||
    slug === "industrial-safety-industrial" ||
    slug === "industrial-safety" ||
    slug === "construction-safety-industrial" ||
    slug === "electrical-engineer" ||
    slug === "electrical-craftsman" ||
    slug === "construction-safety-engineer"
      ? parseFullMockPreset(sp.preset)
      : null;
  const capParsed = sp.cap != null ? parseInt(String(sp.cap), 10) : NaN;
  const sessionCap =
    preset !== null
      ? undefined
      : Number.isFinite(capParsed) &&
          capParsed > 0 &&
          capParsed <= SESSION_QUESTION_CAP_FULL_120
        ? capParsed
        : undefined;

  return (
    <div className="flex min-h-full flex-col">
      <div className="border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link
            href={`/test/${slug}`}
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← 난이도 선택
          </Link>
          <span className="max-w-[45%] truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {config.title}
          </span>
        </div>
      </div>
      <TestRunner
        key={`${slug}|${mode}|${sessionFresh ? "new" : "cont"}|${focusKey}|${preset ?? ""}|${sessionCap ?? ""}`}
        examSlug={slug}
        difficultyMode={mode}
        categoryFilter={categoryFilter}
        sessionFresh={sessionFresh}
        sessionCap={sessionCap}
        examPreset={preset}
        sessionLabel={
          preset === "full-mock"
            ? slug === "industrial-safety" || slug === "construction-safety-engineer"
              ? "실전 모의 (6과목·과목당 20문항)"
              : slug === "electrical-craftsman"
                ? "실전 모의 (3과목·과목당 20문항)"
                : "실전 모의 (5과목·과목당 20문항)"
            : undefined
        }
      />
    </div>
  );
}
