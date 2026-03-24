"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TestRunner } from "@/components/test-runner";
import { getExamConfig, isExamSlug } from "@/lib/exam-registry";
import {
  loadRetryPool,
  type RetryPoolPayload,
} from "@/lib/retry-pool";

export default function RetryQuizPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [payload, setPayload] = useState<RetryPoolPayload | null | undefined>(
    undefined,
  );

  useEffect(() => {
    queueMicrotask(() => {
      const p = loadRetryPool();
      if (!p || !isExamSlug(slug) || p.examSlug !== slug) {
        setPayload(null);
        return;
      }
      if (p.questions.length === 0) {
        setPayload(null);
        return;
      }
      setPayload(p);
    });
  }, [slug]);

  if (payload === undefined) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-4 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent dark:border-emerald-400" />
      </div>
    );
  }

  if (payload === null) {
    return (
      <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center gap-4 px-4 py-16">
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          복습 세션 정보가 없거나 만료되었습니다.
        </p>
        <Link
          href={isExamSlug(slug) ? `/test/${slug}` : "/"}
          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          모드 선택으로
        </Link>
      </div>
    );
  }

  const cfg = getExamConfig(payload.examSlug);
  const titleSuffix = cfg ? `${cfg.title} · ${payload.label}` : payload.label;

  return (
    <div className="flex min-h-full flex-col">
      <div className="border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => router.push(`/test/${payload.examSlug}`)}
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← 난이도 선택
          </button>
          <span className="max-w-[50%] truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {titleSuffix}
          </span>
        </div>
      </div>
      <TestRunner
        examSlug={payload.examSlug}
        difficultyMode="mixed"
        poolOverride={payload.questions}
        sessionLabel={payload.label}
        examTitleOverride={titleSuffix}
      />
    </div>
  );
}
