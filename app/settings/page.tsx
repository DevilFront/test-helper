"use client";

import Link from "next/link";
import { useState } from "react";
import {
  applyFontSize,
  applyTheme,
  persistFont,
  persistTheme,
  persistTimerEnabled,
  readFont,
  readTheme,
  readTimerEnabled,
  type FontPreference,
  type ThemePreference,
} from "@/lib/preferences";

export default function SettingsPage() {
  const [theme, setTheme] = useState<ThemePreference>(
    () => readTheme() ?? "system",
  );
  const [font, setFont] = useState<FontPreference>(() => readFont() ?? "md");
  const [timer, setTimer] = useState(() => readTimerEnabled());

  function onThemeChange(next: ThemePreference) {
    setTheme(next);
    applyTheme(next);
    persistTheme(next);
  }

  function onFontChange(next: FontPreference) {
    setFont(next);
    applyFontSize(next);
    persistFont(next);
  }

  function onTimerChange(next: boolean) {
    setTimer(next);
    persistTimerEnabled(next);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cert-timer-pref"));
    }
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-5 py-10">
      <Link
        href="/"
        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
      >
        ← 홈
      </Link>
      <h1 className="mt-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">
        설정
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        이 기기 브라우저에만 저장됩니다.
      </p>

      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          화면 테마
        </h2>
        <div className="flex flex-col gap-2">
          {(
            [
              ["light", "라이트"],
              ["dark", "다크"],
              ["system", "시스템 설정 따름"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <input
                type="radio"
                name="theme"
                checked={theme === value}
                onChange={() => onThemeChange(value)}
                className="text-emerald-600"
              />
              <span className="text-sm text-zinc-800 dark:text-zinc-200">
                {label}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          풀이 타이머
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          모의·복습 화면 상단에 경과 시간을 표시합니다.
        </p>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
          <input
            type="checkbox"
            checked={timer}
            onChange={(e) => onTimerChange(e.target.checked)}
            className="rounded border-zinc-300 text-emerald-600"
          />
          <span className="text-sm text-zinc-800 dark:text-zinc-200">
            타이머 표시
          </span>
        </label>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          글자 크기
        </h2>
        <div className="flex flex-col gap-2">
          {(
            [
              ["sm", "작게"],
              ["md", "보통"],
              ["lg", "크게"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <input
                type="radio"
                name="font"
                checked={font === value}
                onChange={() => onFontChange(value)}
                className="text-emerald-600"
              />
              <span className="text-sm text-zinc-800 dark:text-zinc-200">
                {label}
              </span>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
