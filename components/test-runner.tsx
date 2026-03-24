"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  filterPoolByMode,
  MODE_LABELS,
  SESSION_QUESTION_CAP,
  type ExamDifficultyMode,
} from "@/lib/exam-modes";
import {
  getExamConfig,
  getQuestionsByIds,
  type ExamSlug,
} from "@/lib/exam-registry";
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks";
import { readTimerEnabled, TIMER_STORAGE_KEY } from "@/lib/preferences";
import {
  buildSessionKey,
  clearInProgress,
  loadInProgress,
  saveInProgress,
} from "@/lib/session-in-progress";
import { QuestionBody } from "@/components/question-body";
import { getSourceLevelLabel, resolveSourceLevel } from "@/lib/source-level";
import { getResultStorageKey } from "@/lib/storage-keys";
import type { ExamQuestion, TestResultPayload } from "@/lib/types";

function pickRandomQuestions(pool: ExamQuestion[], n: number): ExamQuestion[] {
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = copy[i];
    copy[i] = copy[j]!;
    copy[j] = t!;
  }
  return copy.slice(0, n);
}

function formatElapsed(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function QuestionBookmarkButton({
  examSlug,
  questionId,
}: {
  examSlug: ExamSlug;
  questionId: number;
}) {
  const [on, setOn] = useState(() => isBookmarked(examSlug, questionId));
  return (
    <button
      type="button"
      onClick={() => setOn(toggleBookmark(examSlug, questionId))}
      className={`shrink-0 rounded-lg border px-2.5 py-1 text-xs font-medium ${
        on
          ? "border-amber-400 bg-amber-50 text-amber-900 dark:border-amber-600 dark:bg-amber-950/50 dark:text-amber-100"
          : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-900"
      }`}
    >
      {on ? "★ 북마크됨" : "☆ 북마크"}
    </button>
  );
}

type Props = {
  examSlug: ExamSlug;
  difficultyMode: ExamDifficultyMode;
  poolOverride?: ExamQuestion[] | null;
  sessionLabel?: string;
  examTitleOverride?: string;
  /** 과목 키만 출제 (풀 필터). `poolOverride`가 있으면 무시 */
  categoryFilter?: string[] | null;
  /** `?session=new` — 난이도 화면 등에서 들어올 때 이어풀기 초기화·새 랜덤 순서 */
  sessionFresh?: boolean;
};

export function TestRunner({
  examSlug,
  difficultyMode,
  poolOverride,
  sessionLabel,
  examTitleOverride,
  categoryFilter,
  sessionFresh = false,
}: Props) {
  const router = useRouter();
  const config = getExamConfig(examSlug);
  const poolKey = useMemo(
    () => JSON.stringify(poolOverride?.map((q) => q.id) ?? []),
    [poolOverride],
  );
  const categoryFilterKey = useMemo(
    () => JSON.stringify(categoryFilter?.slice().sort() ?? []),
    [categoryFilter],
  );

  const [round, setRound] = useState<ExamQuestion[] | null>(null);
  const [emptyPool, setEmptyPool] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [sessionNonce, setSessionNonce] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [timerEnabled, setTimerEnabled] = useState(() => readTimerEnabled());

  const sessionKey = buildSessionKey(
    examSlug,
    difficultyMode,
    poolOverride,
    categoryFilter ?? undefined,
  );

  useEffect(() => {
    const sync = () => setTimerEnabled(readTimerEnabled());
    const onStorage = (e: StorageEvent) => {
      if (e.key === TIMER_STORAGE_KEY && e.newValue !== null) {
        setTimerEnabled(e.newValue === "1");
      }
    };
    window.addEventListener("cert-timer-pref", sync);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("cert-timer-pref", sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    if (!sessionFresh || typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("session") !== "new") return;
    url.searchParams.delete("session");
    const next = `${url.pathname}${url.search}${url.hash}`;
    router.replace(next, { scroll: false });
  }, [sessionFresh, router]);

  useEffect(() => {
    const cfg = getExamConfig(examSlug);
    if (!cfg) return;
    queueMicrotask(() => {
      if (sessionFresh) {
        clearInProgress();
      }
      let filtered: ExamQuestion[];
      if (poolOverride && poolOverride.length > 0) {
        filtered = [...poolOverride];
      } else {
        filtered = filterPoolByMode(cfg.pool, difficultyMode);
        if (categoryFilter && categoryFilter.length > 0) {
          const set = new Set(categoryFilter);
          filtered = filtered.filter((q) => set.has(q.category));
        }
      }
      if (filtered.length === 0) {
        setEmptyPool(true);
        setRound(null);
        setAnswers([]);
        return;
      }

      const sk = buildSessionKey(
        examSlug,
        difficultyMode,
        poolOverride,
        categoryFilter ?? undefined,
      );
      const saved = loadInProgress();
      if (
        !sessionFresh &&
        saved &&
        saved.sessionKey === sk &&
        saved.questionIds.length > 0 &&
        sessionNonce === 0
      ) {
        const restored = getQuestionsByIds(filtered, saved.questionIds);
        if (
          restored.length === saved.questionIds.length &&
          saved.answers.length === restored.length
        ) {
          setEmptyPool(false);
          setRound(restored);
          setStep(Math.min(saved.step, restored.length - 1));
          setAnswers([...saved.answers]);
          setElapsedSec(saved.elapsedSec ?? 0);
          return;
        }
      }

      const n = Math.min(SESSION_QUESTION_CAP, filtered.length);
      const picked = pickRandomQuestions(filtered, n);
      setEmptyPool(false);
      setRound(picked);
      setStep(0);
      setAnswers(Array.from({ length: n }, () => null));
      setElapsedSec(0);
    });
  }, [
    examSlug,
    difficultyMode,
    poolKey,
    poolOverride,
    categoryFilterKey,
    categoryFilter,
    sessionNonce,
    sessionFresh,
  ]);

  useEffect(() => {
    if (!timerEnabled || !round || round.length === 0) return;
    const id = window.setInterval(() => {
      setElapsedSec((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerEnabled, round, sessionNonce]);

  useEffect(() => {
    if (!round || round.length === 0) return;
    const sk = buildSessionKey(
      examSlug,
      difficultyMode,
      poolOverride,
      categoryFilter ?? undefined,
    );
    const payload = {
      version: 1 as const,
      sessionKey: sk,
      examSlug,
      difficultyMode,
      questionIds: round.map((q) => q.id),
      step,
      answers,
      savedAt: Date.now(),
      elapsedSec,
    };
    const t = window.setTimeout(() => saveInProgress(payload), 450);
    return () => window.clearTimeout(t);
  }, [
    round,
    step,
    answers,
    elapsedSec,
    examSlug,
    difficultyMode,
    poolOverride,
    categoryFilter,
    sessionKey,
  ]);

  const sessionCount = round?.length ?? 0;
  const current = round?.[step];
  const selected = answers[step];

  const progressLabel =
    round && sessionCount > 0
      ? `${step + 1} / ${sessionCount}`
      : `— / ${SESSION_QUESTION_CAP}`;
  const progressPct =
    round && sessionCount > 0
      ? ((step + 1) / sessionCount) * 100
      : 0;
  const headerTitle = config?.title ?? "";
  const modeLabel = sessionLabel ?? MODE_LABELS[difficultyMode].title;

  const setOption = useCallback(
    (optionIndex: number) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[step] = optionIndex;
        return next;
      });
    },
    [step],
  );

  const persistAndGo = useCallback(
    (questions: ExamQuestion[], selectedAnswers: number[]) => {
      if (!config) return;
      clearInProgress();
      const persistMode: ExamDifficultyMode =
        poolOverride && poolOverride.length > 0 ? "mixed" : difficultyMode;
      const payload: TestResultPayload = {
        version: 1,
        examSlug,
        examTitle: examTitleOverride ?? config.title,
        difficultyMode: persistMode,
        questions,
        selectedAnswers,
      };
      try {
        sessionStorage.setItem(
          getResultStorageKey(examSlug),
          JSON.stringify(payload),
        );
      } catch {
        // ignore
      }
      router.push(`/result?e=${encodeURIComponent(examSlug)}`);
    },
    [
      router,
      config,
      examSlug,
      difficultyMode,
      poolOverride,
      examTitleOverride,
    ],
  );

  const goNext = useCallback(() => {
    if (!round || selected === null) return;
    if (step < sessionCount - 1) setStep((s) => s + 1);
  }, [round, selected, step, sessionCount]);

  const handleFinish = useCallback(() => {
    if (!round || selected === null || sessionCount === 0) return;
    const merged = answers.map((a, i) => (i === step ? selected : a));
    if (merged.some((x) => x === null || x === undefined)) return;
    persistAndGo(round, merged as number[]);
  }, [round, selected, step, answers, persistAndGo, sessionCount]);

  const startNewSession = useCallback(() => {
    clearInProgress();
    setSessionNonce((n) => n + 1);
    setElapsedSec(0);
  }, []);

  if (emptyPool) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-4 px-4 py-16">
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          {categoryFilter && categoryFilter.length > 0
            ? "선택한 과목에 해당하는 문항이 없습니다. 로드맵 과목을 바꾸거나 다른 모드를 선택해 주세요."
            : "이 난이도에 해당하는 문항이 없습니다. 다른 모드를 선택해 주세요."}
        </p>
        <Link
          href={`/test/${examSlug}`}
          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          모드 선택으로
        </Link>
      </div>
    );
  }

  if (!config || !round || !current || sessionCount === 0) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-3 px-4 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent dark:border-emerald-400" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">문항을 준비하는 중…</p>
      </div>
    );
  }

  const isLast = step === sessionCount - 1;
  const canAdvance = selected !== null && selected !== undefined;
  const sourceLabel = getSourceLevelLabel(resolveSourceLevel(current));

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-medium text-zinc-600 dark:text-zinc-400">
            진행 {progressLabel}
          </span>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {timerEnabled && (
              <span
                className="tabular-nums text-xs font-medium text-zinc-500 dark:text-zinc-400"
                aria-live="polite"
              >
                ⏱ {formatElapsed(elapsedSec)}
              </span>
            )}
            <span className="max-w-[40%] truncate text-right text-xs text-zinc-400 dark:text-zinc-500">
              {modeLabel}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-center text-xs text-zinc-500 dark:text-zinc-400">
            {headerTitle}
          </p>
          <button
            type="button"
            onClick={startNewSession}
            className="shrink-0 text-xs font-medium text-zinc-500 underline-offset-2 hover:text-zinc-800 hover:underline dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            새로 풀기
          </button>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={sessionCount}
        >
          <div
            className="h-full rounded-full bg-emerald-600 transition-[width] duration-300 dark:bg-emerald-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </header>

      <article className="flex flex-1 flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            문제 {step + 1}
          </p>
          <QuestionBookmarkButton
            key={current.id}
            examSlug={examSlug}
            questionId={current.id}
          />
        </div>
        <div className="mt-3">
          <QuestionBody question={current} showMeta />
        </div>
        <ul className="mt-5 flex flex-col gap-2">
          {current.options.map((opt, idx) => {
            const isSelected = selected === idx;
            return (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => setOption(idx)}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm leading-snug transition-colors ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-50"
                      : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
                  }`}
                >
                  <span className="mr-2 font-semibold text-zinc-400 dark:text-zinc-500">
                    {idx + 1}.
                  </span>
                  {opt}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
          <span className="font-medium text-zinc-600 dark:text-zinc-400">
            출처: {sourceLabel}
          </span>
          {" · "}
          실제 기출·시험과 다를 수 있습니다.{" "}
          <Link
            href={`/exam/${examSlug}/info`}
            className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            시험 공고·과목 안내
          </Link>
        </p>
      </article>

      <div className="sticky bottom-0 flex flex-col gap-3 border-t border-zinc-200 bg-zinc-50/95 pt-4 pb-8 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
        {isLast ? (
          <button
            type="button"
            onClick={handleFinish}
            disabled={!canAdvance}
            className="w-full rounded-xl bg-emerald-600 py-3.5 text-base font-semibold text-white shadow-sm transition-opacity hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            결과 보기
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            disabled={!canAdvance}
            className="w-full rounded-xl bg-emerald-600 py-3.5 text-base font-semibold text-white shadow-sm transition-opacity hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            다음
          </button>
        )}
        <Link
          href={`/test/${examSlug}`}
          className="text-center text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
        >
          모드 선택으로
        </Link>
      </div>
    </div>
  );
}
