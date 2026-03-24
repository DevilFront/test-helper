"use client";

import Link from "next/link";
import { useCallback, useRef, useState, type ChangeEvent } from "react";
import {
  exportBackupJsonString,
  importBackupPayload,
  parseBackupJson,
} from "@/lib/data-backup";
import { initPreferencesFromStorage } from "@/lib/preferences";

export default function DataSettingsPage() {
  const [message, setMessage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const downloadBackup = useCallback(() => {
    const json = exportBackupJsonString();
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cert-helper-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.rel = "noopener";
    a.click();
    URL.revokeObjectURL(url);
    setMessage("백업 파일을 내려받았습니다.");
  }, []);

  const onFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const raw = typeof reader.result === "string" ? reader.result : "";
        const parsed = parseBackupJson(raw);
        if (parsed === null) {
          setMessage("JSON 형식이 아닙니다.");
          return;
        }
        const result = importBackupPayload(parsed);
        if (!result.ok) {
          setMessage(result.error);
          return;
        }
        queueMicrotask(() => {
          initPreferencesFromStorage();
          window.dispatchEvent(new Event("cert-habits-updated"));
        });
        setMessage(`복원했습니다. (${result.appliedKeys}개 항목 적용)`);
      };
      reader.readAsText(file, "utf-8");
    },
    [],
  );

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col px-5 py-10">
      <Link
        href="/settings"
        className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
      >
        ← 설정
      </Link>
      <h1 className="mt-6 text-xl font-bold text-zinc-900 dark:text-zinc-50">
        데이터 백업·복원
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        설정·습관·이력·북마크·로드맵 등 이 브라우저{" "}
        <strong className="font-medium text-zinc-800 dark:text-zinc-200">
          localStorage
        </strong>
        에 있는 항목을 파일로 옮깁니다. 계정 로그인 없이 다른 기기로 이어갈 때
        사용할 수 있습니다.
      </p>

      <section className="mt-8 space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          내보내기
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          JSON 파일로 저장합니다. 안전한 곳에 보관하세요.
        </p>
        <button
          type="button"
          onClick={downloadBackup}
          className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          백업 파일 받기
        </button>
      </section>

      <section className="mt-6 space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          가져오기
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          같은 앱에서 받은 백업 파일만 선택하세요. 기존 동일 항목은 덮어씁니다.
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={onFileChange}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full rounded-xl border border-zinc-300 bg-white py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
        >
          백업 파일 선택
        </button>
      </section>

      <p className="mt-6 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        진행 중인 모의·결과·복습 세션(
        <code className="rounded bg-zinc-200/80 px-1 dark:bg-zinc-800">sessionStorage</code>
        )은 탭 단위라 백업에 포함되지 않습니다. 서버 로그인·클라우드 동기화는 추후
        도입 시 별도 안내 예정이며, 저장소의{" "}
        <code className="rounded bg-zinc-200/80 px-1 dark:bg-zinc-800">
          docs/phase6-future-auth.md
        </code>
        를 참고할 수 있습니다.
      </p>

      {message && (
        <p
          className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200"
          role="status"
        >
          {message}
        </p>
      )}
    </div>
  );
}
