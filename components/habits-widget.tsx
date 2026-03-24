"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  defaultHabitsState,
  loadHabits,
  type HabitsState,
} from "@/lib/habits-storage";
import { loadRoadmapFocus, type RoadmapFocus } from "@/lib/roadmap";

export function HabitsWidget() {
  const [tick, setTick] = useState(0);
  const [habits, setHabits] = useState<HabitsState>(() => defaultHabitsState());
  const [roadmap, setRoadmap] = useState<RoadmapFocus | null>(null);

  useEffect(() => {
    const load = () => {
      setHabits(loadHabits());
      setRoadmap(loadRoadmapFocus());
    };
    load();

    const onExternal = () => {
      load();
      setTick((t) => t + 1);
    };
    window.addEventListener("cert-habits-updated", onExternal);
    window.addEventListener("storage", onExternal);
    return () => {
      window.removeEventListener("cert-habits-updated", onExternal);
      window.removeEventListener("storage", onExternal);
    };
  }, []);

  const goal = roadmap?.weeklyQuestionGoal ?? null;
  const count = habits.weekQuestionCount;

  return (
    <div
      key={tick}
      className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 px-4 py-4 text-left dark:border-emerald-900/50 dark:bg-emerald-950/25"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
            이번 주 학습
          </p>
          <p className="mt-1 text-sm text-emerald-900 dark:text-emerald-100">
            연속{" "}
            <span className="text-lg font-bold tabular-nums">
              {habits.streak}
            </span>
            일 · 문항{" "}
            <span className="font-semibold tabular-nums">
              {count}
              {goal != null ? ` / ${goal}` : ""}
            </span>
          </p>
        </div>
        <Link
          href="/progress"
          className="shrink-0 text-xs font-medium text-emerald-800 underline-offset-2 hover:underline dark:text-emerald-300"
        >
          요약
        </Link>
      </div>
      {goal != null && (
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-emerald-200/80 dark:bg-emerald-900/60"
          role="progressbar"
          aria-valuenow={Math.min(count, goal)}
          aria-valuemin={0}
          aria-valuemax={goal}
        >
          <div
            className="h-full rounded-full bg-emerald-600 transition-[width] dark:bg-emerald-500"
            style={{
              width: `${goal > 0 ? Math.min(100, Math.round((count / goal) * 100)) : 0}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
