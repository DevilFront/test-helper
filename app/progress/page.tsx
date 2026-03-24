"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCategoryDisplayName } from "@/lib/category-labels";
import { getExamConfig } from "@/lib/exam-registry";
import { loadHabits } from "@/lib/habits-storage";
import { loadRoadmapFocus } from "@/lib/roadmap";
import { buildWeeklySummary } from "@/lib/study-history";

export default function ProgressPage() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const sync = () => setTick((t) => t + 1);
    window.addEventListener("cert-habits-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cert-habits-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const habits = loadHabits();
  const roadmap = loadRoadmapFocus();
  const goal = roadmap?.weeklyQuestionGoal ?? null;
  const summary = buildWeeklySummary();
  const acc =
    summary.totalQuestions > 0
      ? Math.round(
          (summary.totalCorrect / summary.totalQuestions) * 1000,
        ) / 10
      : 0;

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col px-5 py-10">
      <Link
        href="/"
        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
      >
        ← 홈
      </Link>

      <h1 className="mt-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">
        학습 현황
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        결과를 본 모의만 집계합니다. 이 기기 브라우저에만 저장됩니다.
      </p>

      <section
        key={tick}
        className="mt-8 space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
      >
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          연속·주간 목표
        </h2>
        <dl className="grid gap-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500 dark:text-zinc-400">연속 학습일</dt>
            <dd className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {habits.streak}일
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-zinc-500 dark:text-zinc-400">
              이번 주 푼 문항
            </dt>
            <dd className="font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {habits.weekQuestionCount}
              {goal != null ? ` / 목표 ${goal}` : ""}
            </dd>
          </div>
          {goal != null && (
            <div
              className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
              role="progressbar"
              aria-valuenow={Math.min(habits.weekQuestionCount, goal)}
              aria-valuemin={0}
              aria-valuemax={goal}
            >
              <div
                className="h-full rounded-full bg-emerald-600 dark:bg-emerald-500"
                style={{
                  width: `${goal > 0 ? Math.min(100, Math.round((habits.weekQuestionCount / goal) * 100)) : 0}%`,
                }}
              />
            </div>
          )}
        </dl>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          주간 문항 수는 월요일을 기준으로 초기화됩니다. 목표는{" "}
          <Link href="/learn" className="underline underline-offset-2">
            학습 로드맵
          </Link>
          에서 설정할 수 있습니다.
        </p>
      </section>

      <section className="mt-8 space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          이번 주 요약
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          주 시작: {summary.weekMondayYmd} (월요일 기준)
        </p>
        <ul className="space-y-2 text-sm text-zinc-800 dark:text-zinc-200">
          <li>완료한 세션: {summary.sessions}회</li>
          <li>
            푼 문항: {summary.totalQuestions}문항 · 정답률 약 {acc}%
          </li>
        </ul>

        {Object.keys(summary.byExam).length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              시험별
            </p>
            <ul className="mt-2 space-y-2">
              {Object.entries(summary.byExam).map(([slug, v]) => (
                <li
                  key={slug}
                  className="flex justify-between gap-2 text-sm text-zinc-800 dark:text-zinc-200"
                >
                  <span>{getExamConfig(slug)?.title ?? slug}</span>
                  <span className="tabular-nums text-zinc-500 dark:text-zinc-400">
                    {v.sessions}회 · {v.questions}문항
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {summary.weakCategoryHits.length > 0 ? (
          <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              이번 주 자주 나온 약점 과목 (응시별 약점 집계)
            </p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-zinc-800 dark:text-zinc-200">
              {summary.weakCategoryHits.slice(0, 5).map((row) => (
                <li key={row.key}>
                  {getCategoryDisplayName(row.key)}{" "}
                  <span className="text-zinc-500 dark:text-zinc-400">
                    ({row.count}회)
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            아직 이번 주 기록이 없습니다. 모의를 완료하면 요약이 쌓입니다.
          </p>
        )}
      </section>
    </div>
  );
}
