"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getCategoryDisplayName } from "@/lib/category-labels";
import {
  EXAM_SLUGS,
  getExamConfig,
  isExamSlug,
  listUniqueCategories,
  type ExamSlug,
} from "@/lib/exam-registry";
import { loadRoadmapFocus, saveRoadmapFocus } from "@/lib/roadmap";

export default function LearnPage() {
  const [examSlug, setExamSlug] = useState<ExamSlug>("info-processing");
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set());
  const [goal, setGoal] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      const r = loadRoadmapFocus();
      if (r && isExamSlug(r.examSlug)) {
        setExamSlug(r.examSlug);
        setSelectedCats(new Set(r.categoryKeys));
        setGoal(
          r.weeklyQuestionGoal != null ? String(r.weeklyQuestionGoal) : "",
        );
        setNote(r.note);
      }
    });
  }, []);

  const persist = useCallback(() => {
    const g = goal.trim() === "" ? null : Number.parseInt(goal, 10);
    saveRoadmapFocus({
      examSlug,
      categoryKeys: [...selectedCats].sort(),
      weeklyQuestionGoal:
        g !== null && !Number.isNaN(g) && g > 0 ? g : null,
      note: note.trim(),
    });
  }, [examSlug, selectedCats, goal, note]);

  const categories = useMemo(() => {
    const cfg = getExamConfig(examSlug);
    if (!cfg) return [];
    return listUniqueCategories(cfg.pool);
  }, [examSlug]);

  const toggleCat = useCallback(
    (key: string) => {
      setSelectedCats((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        queueMicrotask(() => {
          const g = goal.trim() === "" ? null : Number.parseInt(goal, 10);
          saveRoadmapFocus({
            examSlug,
            categoryKeys: [...next].sort(),
            weeklyQuestionGoal:
              g !== null && !Number.isNaN(g) && g > 0 ? g : null,
            note: note.trim(),
          });
        });
        return next;
      });
    },
    [examSlug, goal, note],
  );

  const quizHref = useMemo(() => {
    const base = `/test/${examSlug}/quiz?mode=mixed&session=new`;
    const keys = [...selectedCats].sort();
    if (keys.length === 0) return base;
    return `${base}&focus=${encodeURIComponent(keys.join(","))}`;
  }, [examSlug, selectedCats]);

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col px-5 py-10">
      <Link
        href="/"
        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
      >
        ← 홈
      </Link>
      <h1 className="mt-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">
        학습 로드맵
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        이번 주에 집중할 과목을 고르고, 선택한 과목만 모의 풀기로 연결할 수
        있습니다. 목표는 이 기기에만 저장됩니다.
      </p>

      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          자격증
        </h2>
        <select
          value={examSlug}
          onChange={(e) => {
            const v = e.target.value;
            if (!isExamSlug(v)) return;
            setExamSlug(v);
            setSelectedCats(new Set());
            const g = goal.trim() === "" ? null : Number.parseInt(goal, 10);
            saveRoadmapFocus({
              examSlug: v,
              categoryKeys: [],
              weeklyQuestionGoal:
                g !== null && !Number.isNaN(g) && g > 0 ? g : null,
              note: note.trim(),
            });
          }}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
        >
          {EXAM_SLUGS.map((s) => {
            const c = getExamConfig(s);
            return (
              <option key={s} value={s}>
                {c?.title ?? s}
              </option>
            );
          })}
        </select>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          집중 과목 (복수 선택)
        </h2>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <input
                type="checkbox"
                checked={selectedCats.has(cat)}
                onChange={() => toggleCat(cat)}
                className="rounded border-zinc-300 text-emerald-600"
              />
              <span className="text-sm text-zinc-800 dark:text-zinc-200">
                {getCategoryDisplayName(cat)}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          주간 목표 문항 수 (선택)
        </h2>
        <input
          type="number"
          min={1}
          max={120}
          placeholder="예: 30"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          onBlur={persist}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
        />
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          메모 (선택)
        </h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={persist}
          rows={2}
          placeholder="예: 이번 주는 DB만"
          className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
        />
      </section>

      <div className="mt-10 flex flex-col gap-3">
        <Link
          href={quizHref}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          {selectedCats.size > 0
            ? "선택 과목만 모의 풀기 (mixed)"
            : "전체 mixed 모의 풀기"}
        </Link>
        <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
          난이도는 mixed로 열리며, 과목을 고르지 않으면 전체 풀에서 출제됩니다.
        </p>
      </div>
    </div>
  );
}
