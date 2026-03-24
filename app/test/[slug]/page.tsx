import Link from "next/link";
import { notFound } from "next/navigation";
import { ExamRevisionBanner } from "@/components/exam-revision-banner";
import {
  EXAM_DIFFICULTY_MODES,
  MODE_LABELS,
  SESSION_QUESTION_CAP,
} from "@/lib/exam-modes";
import {
  getExamConfig,
  getExamPhaseLabel,
  isExamSlug,
} from "@/lib/exam-registry";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (!isExamSlug(slug)) return { title: "모의 테스트" };
  const c = getExamConfig(slug);
  return {
    title: "모의 테스트",
    description: `${c?.title ?? ""} · 난이도 선택 후 최대 ${SESSION_QUESTION_CAP}문항`,
  };
}

export default async function TestMenuPage({ params }: Props) {
  const { slug } = await params;
  if (!isExamSlug(slug)) notFound();
  const config = getExamConfig(slug);
  if (!config) notFound();

  return (
    <div className="flex min-h-full flex-col">
      <div className="border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← 돌아가기
          </Link>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {config.title}
          </span>
        </div>
      </div>
      <div className="mx-auto w-full max-w-lg flex-1 px-4 py-8">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            난이도 선택
          </h1>
          <span className="rounded-full bg-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {getExamPhaseLabel(config.phase)}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          한 세션 최대 {SESSION_QUESTION_CAP}문항이 무작위로 출제됩니다.
        </p>
        {config.revisionNote && (
          <div className="mt-4">
            <ExamRevisionBanner text={config.revisionNote} />
          </div>
        )}
        <p className="mt-4 text-sm">
          <Link
            href={`/exam/${slug}/info`}
            className="font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
          >
            시험 공고·과목 비율 안내 ↗
          </Link>
        </p>
        <ul className="mt-6 flex flex-col gap-3">
          {EXAM_DIFFICULTY_MODES.map((mode) => {
            const m = MODE_LABELS[mode];
            return (
              <li key={mode}>
                <Link
                  href={`/test/${slug}/quiz?mode=${mode}&session=new`}
                  className="flex flex-col rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20"
                >
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {m.title}
                  </span>
                  <span className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {m.description}
                  </span>
                  <span className="mt-3 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    시작 →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
