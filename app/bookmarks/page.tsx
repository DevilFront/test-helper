"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { getCategoryDisplayName } from "@/lib/category-labels";
import {
  EXAM_SLUGS,
  getExamConfig,
  getQuestionsByIds,
  type ExamSlug,
} from "@/lib/exam-registry";
import { listBookmarkIds, toggleBookmark } from "@/lib/bookmarks";
import { saveRetryPool } from "@/lib/retry-pool";

export default function BookmarksPage() {
  const router = useRouter();
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  const startBookmarkQuiz = useCallback(
    (slug: ExamSlug) => {
      const cfg = getExamConfig(slug);
      if (!cfg) return;
      const ids = listBookmarkIds(slug);
      if (ids.length === 0) return;
      const qs = getQuestionsByIds(cfg.pool, ids);
      if (qs.length === 0) return;
      saveRetryPool({
        examSlug: slug,
        kind: "bookmark",
        questions: qs,
        label: "북마크 복습",
      });
      router.push(`/test/${slug}/retry`);
    },
    [router],
  );

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col px-5 py-10">
      <Link
        href="/"
        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
      >
        ← 홈
      </Link>
      <h1 className="mt-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">
        북마크
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        저장한 문항은 이 기기에만 보관됩니다.
      </p>

      <div className="mt-8 flex flex-col gap-8" key={tick}>
        {EXAM_SLUGS.map((slug) => {
          const cfg = getExamConfig(slug);
          if (!cfg) return null;
          const ids = listBookmarkIds(slug);
          const idSet = new Set(ids);
          const questions = cfg.pool.filter((q) => idSet.has(q.id));

          return (
            <section key={slug}>
              <div className="flex flex-wrap items-end justify-between gap-2">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {cfg.title}
                </h2>
                {ids.length > 0 && (
                  <button
                    type="button"
                    onClick={() => startBookmarkQuiz(slug)}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    북마크로 모의 풀기
                  </button>
                )}
              </div>
              {questions.length === 0 ? (
                <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                  북마크한 문항이 없습니다.
                </p>
              ) : (
                <ul className="mt-3 flex flex-col gap-3">
                  {questions.map((q) => (
                    <li
                      key={q.id}
                      className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs text-zinc-400">
                          {getCategoryDisplayName(q.category)}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            toggleBookmark(slug, q.id);
                            refresh();
                          }}
                          className="shrink-0 text-xs font-medium text-rose-600 hover:underline dark:text-rose-400"
                        >
                          삭제
                        </button>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
                        {q.question}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
