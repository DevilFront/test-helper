import Link from "next/link";
import { notFound } from "next/navigation";
import { getExamOfficialInfo } from "@/lib/exam-official-info";
import { getExamConfig, isExamSlug } from "@/lib/exam-registry";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  if (!isExamSlug(slug)) return { title: "시험 안내" };
  const info = getExamOfficialInfo(slug);
  return {
    title: info ? `${info.shortTitle} · 시험 안내` : "시험 안내",
    description: info?.intro.slice(0, 120),
  };
}

export default async function ExamInfoPage({ params }: Props) {
  const { slug } = await params;
  if (!isExamSlug(slug)) notFound();
  const info = getExamOfficialInfo(slug);
  const config = getExamConfig(slug);
  if (!info || !config) notFound();

  return (
    <div className="flex min-h-full flex-col">
      <div className="border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-2">
          <Link
            href={`/test/${slug}`}
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← 난이도 선택
          </Link>
          <span className="max-w-[55%] truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            시험 안내
          </span>
        </div>
      </div>

      <article className="mx-auto w-full max-w-lg flex-1 px-4 py-8">
        <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          {config.title}
        </p>
        <h1 className="mt-2 text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {info.title}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {info.examPhaseLabel}
        </p>

        <p className="mt-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {info.intro}
        </p>

        <section className="mt-8">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            공식 안내·공고
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {info.noticeLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
                >
                  {link.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            링크는 사이트 구조 변경 시 바뀔 수 있습니다. 검색으로 &quot;
            {info.shortTitle}&quot; 최신 공고를 확인하세요.
          </p>
        </section>

        <section className="mt-8 space-y-5">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            과목·비율 안내
          </h2>
          {info.subjectRatioSections.map((block) => (
            <div key={block.heading}>
              <h3 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {block.heading}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {block.body}
              </p>
            </div>
          ))}
        </section>

        <p className="mt-10 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs leading-relaxed text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
          {info.disclaimer}
        </p>

        <Link
          href={`/test/${slug}`}
          className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          모의고사로 돌아가기
        </Link>
      </article>
    </div>
  );
}
