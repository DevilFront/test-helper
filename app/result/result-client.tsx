"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getCategoryDisplayName } from "@/lib/category-labels";
import {
  isExamDifficultyMode,
  MODE_LABELS,
} from "@/lib/exam-modes";
import { getExamConfig, type ExamSlug } from "@/lib/exam-registry";
import {
  buildWeakCategoryPool,
  saveRetryPool,
} from "@/lib/retry-pool";
import {
  buildStudyFeedback,
  computeCategoryStats,
  getLevelClassification,
  getScorePercent,
  getWeakCategories,
} from "@/lib/result-analytics";
import { QuestionBody } from "@/components/question-body";
import { ResultShareButton } from "@/components/result-share-button";
import { tryRecordStudySession } from "@/lib/record-study-session";
import { getSourceLevelLabel, resolveSourceLevel } from "@/lib/source-level";
import { loadTestResultFromSession } from "@/lib/result-storage";
import { scoreToPassProbability } from "@/lib/scoring";
import type { TestResultPayload } from "@/lib/types";

const levelStyles = {
  high: {
    badge:
      "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
    ring: "ring-emerald-500/30",
  },
  mid: {
    badge:
      "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
    ring: "ring-amber-500/30",
  },
  low: {
    badge: "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200",
    ring: "ring-rose-500/30",
  },
} as const;

type Props = {
  examSlugParam: string | null;
};

export function ResultClient({ examSlugParam }: Props) {
  const router = useRouter();
  const [data, setData] = useState<TestResultPayload | null | undefined>(
    undefined,
  );

  useEffect(() => {
    queueMicrotask(() => {
      setData(loadTestResultFromSession(examSlugParam));
    });
  }, [examSlugParam]);

  useEffect(() => {
    if (!data) return;
    queueMicrotask(() => {
      tryRecordStudySession(data);
    });
  }, [data]);

  const analysis = useMemo(() => {
    if (!data) return null;
    const { questions, selectedAnswers } = data;
    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
      if (selectedAnswers[i] === questions[i].answer) correct += 1;
    }
    const total = questions.length;
    const scorePercent = getScorePercent(correct, total);
    const probability = scoreToPassProbability(correct, total);
    const categoryStats = computeCategoryStats(questions, selectedAnswers);
    const weak = getWeakCategories(categoryStats);
    const level = getLevelClassification(scorePercent);
    const feedback = buildStudyFeedback(weak);
    const examTitle =
      data.examTitle ??
      (data.examSlug
        ? getExamConfig(data.examSlug)?.title
        : undefined) ??
      "모의고사";
    const examSlug = data.examSlug ?? "info-processing";
    const modeLabel =
      data.difficultyMode && isExamDifficultyMode(data.difficultyMode)
        ? MODE_LABELS[data.difficultyMode].title
        : null;
    const wrongQuestions = questions.filter(
      (q, i) => selectedAnswers[i] !== q.answer,
    );
    const weakCategoryPool = buildWeakCategoryPool(
      questions,
      weak.map((w) => w.category),
    );
    return {
      correct,
      total,
      scorePercent,
      probability,
      categoryStats,
      weak,
      level,
      feedback,
      questions,
      selectedAnswers,
      examTitle,
      examSlug,
      modeLabel,
      wrongQuestions,
      weakCategoryPool,
    };
  }, [data]);

  if (data === undefined) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-4 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent dark:border-emerald-400" />
      </div>
    );
  }

  if (data === null || !analysis) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-4 py-16">
        <p className="text-center text-zinc-600 dark:text-zinc-400">
          결과 정보가 없습니다. 테스트를 완료해 주세요.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          시험 선택으로 가기
        </Link>
      </div>
    );
  }

  const {
    correct,
    total,
    scorePercent,
    probability,
    categoryStats,
    weak,
    level,
    feedback,
    questions,
    selectedAnswers,
    examTitle,
    examSlug,
    modeLabel,
    wrongQuestions,
    weakCategoryPool,
  } = analysis;

  const ls = levelStyles[level.band];
  const retestMode =
    data.difficultyMode && isExamDifficultyMode(data.difficultyMode)
      ? data.difficultyMode
      : "mixed";
    const retestHref = `/test/${examSlug}/quiz?mode=${encodeURIComponent(retestMode)}&session=new`;

  function goWrongRetry() {
    if (wrongQuestions.length === 0) return;
    saveRetryPool({
      examSlug: examSlug as ExamSlug,
      kind: "wrong",
      questions: wrongQuestions,
      label: "오답 복습",
    });
    router.push(`/test/${examSlug}/retry`);
  }

  function goWeakRetry() {
    if (weakCategoryPool.length === 0) return;
    saveRetryPool({
      examSlug: examSlug as ExamSlug,
      kind: "weak",
      questions: weakCategoryPool,
      label: `약점: ${weak.map((w) => w.displayName).join(", ")}`,
    });
    router.push(`/test/${examSlug}/retry`);
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col gap-8 px-4 py-8 pb-16">
      <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
        {examTitle}
        {modeLabel ? ` · ${modeLabel}` : ""}
      </p>

      <section
        className={`rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm ring-2 ${ls.ring} dark:border-zinc-800 dark:bg-zinc-950`}
      >
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          예상 합격 확률
        </p>
        <p className="mt-1 text-5xl font-bold tabular-nums tracking-tight text-emerald-600 dark:text-emerald-400">
          {probability}
          <span className="text-3xl font-semibold">%</span>
        </p>
        <div className="mt-5 flex flex-col items-center gap-2 border-t border-zinc-100 pt-5 dark:border-zinc-800">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">수준 판정</p>
          <span
            className={`inline-flex rounded-full px-4 py-1.5 text-sm font-semibold ${ls.badge}`}
          >
            {level.level}
          </span>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            전체 정답률 {scorePercent}% 기준 (정답 {correct}/{total})
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          학습 피드백
        </p>
        <p className="mt-2 text-base leading-relaxed text-zinc-800 dark:text-zinc-200">
          {feedback}
        </p>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          과목별 정답률
        </h2>
        <ul className="mt-3 flex flex-col gap-3">
          {categoryStats.map((row) => {
            const isWeak = weak.some((w) => w.category === row.category);
            return (
              <li
                key={row.category}
                className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-medium text-zinc-600 dark:text-zinc-300">
                    {row.displayName}
                    {isWeak && (
                      <span className="ml-2 text-xs font-normal text-rose-600 dark:text-rose-400">
                        (약점)
                      </span>
                    )}
                  </span>
                  <span className="tabular-nums text-zinc-900 dark:text-zinc-50">
                    {row.accuracy}%
                    <span className="ml-1 text-xs text-zinc-400">
                      ({row.correct}/{row.total})
                    </span>
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div
                    className={`h-full rounded-full transition-[width] ${
                      row.accuracy >= 80
                        ? "bg-emerald-500"
                        : row.accuracy >= 60
                          ? "bg-amber-500"
                          : "bg-rose-500"
                    }`}
                    style={{ width: `${row.accuracy}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {weak.length > 0 && (
        <section className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 dark:border-rose-900/50 dark:bg-rose-950/30">
          <h2 className="text-sm font-semibold text-rose-900 dark:text-rose-200">
            보완이 필요한 영역
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-rose-700 dark:text-rose-300">
            {weak.map((w) => w.displayName).join(", ")}
          </p>
        </section>
      )}

      {(wrongQuestions.length > 0 || weakCategoryPool.length > 0) && (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <h2 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
            복습 세션
          </h2>
          <p className="mt-1 text-xs text-emerald-800/90 dark:text-emerald-300/90">
            최대 15문항씩 무작위로 출제됩니다. 이 탭을 닫으면 세션 정보가 사라질 수
            있습니다.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {wrongQuestions.length > 0 && (
              <button
                type="button"
                onClick={goWrongRetry}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                오답만 다시 풀기 ({wrongQuestions.length}문항)
              </button>
            )}
            {weakCategoryPool.length > 0 && (
              <button
                type="button"
                onClick={goWeakRetry}
                className="inline-flex items-center justify-center rounded-xl border border-emerald-600 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-200 dark:hover:bg-emerald-900/50"
              >
                약점 과목만 모의 ({weakCategoryPool.length}문항)
              </button>
            )}
          </div>
        </section>
      )}

      <p className="text-center text-xs text-zinc-500 dark:text-zinc-500">
        본 결과는 참고용이며, 실제 시험·합격 여부와 다를 수 있습니다.
      </p>

      <details className="group rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <summary className="cursor-pointer list-none px-4 py-4 text-sm font-semibold text-zinc-900 marker:content-none dark:text-zinc-50 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between">
            문항별 해설
            <span className="text-zinc-400 transition group-open:rotate-180">
              ▼
            </span>
          </span>
        </summary>
        <ol className="flex flex-col gap-4 border-t border-zinc-100 px-4 pb-4 pt-2 dark:border-zinc-800">
          {questions.map((q, i) => {
            const picked = selectedAnswers[i];
            const isRight = picked === q.answer;
            const labels = ["①", "②", "③", "④"];
            return (
              <li
                key={`${q.id}-${i}`}
                className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-4 text-left text-sm dark:border-zinc-800 dark:bg-zinc-900/40"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {i + 1}.
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      isRight
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                        : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
                    }`}
                  >
                    {isRight ? "정답" : "오답"}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {getCategoryDisplayName(q.category)}
                  </span>
                  <span className="rounded-full bg-zinc-200/80 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {getSourceLevelLabel(resolveSourceLevel(q))}
                  </span>
                </div>
                <div className="mt-2">
                  <QuestionBody question={q} showMeta />
                </div>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  내 답: {picked !== undefined ? labels[picked] : "—"}{" "}
                  {picked !== undefined ? q.options[picked] : ""}
                </p>
                {!isRight && (
                  <p className="mt-1 text-emerald-700 dark:text-emerald-400">
                    정답: {labels[q.answer]} {q.options[q.answer]}
                  </p>
                )}
                <p className="mt-3 border-t border-zinc-200/80 pt-3 text-zinc-600 leading-relaxed dark:border-zinc-700 dark:text-zinc-400">
                  {q.explanation}
                </p>
              </li>
            );
          })}
        </ol>
      </details>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <ResultShareButton
          data={{
            examTitle,
            scorePercent,
            correct,
            total,
            weakDisplayNames: weak.map((w) => w.displayName),
          }}
        />
        <Link
          href={retestHref}
          className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
        >
          다시 테스트
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
