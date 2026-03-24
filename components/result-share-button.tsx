"use client";

import { useCallback, useState } from "react";
import {
  type ResultShareCardData,
  renderResultSharePng,
} from "@/lib/render-result-share-image";

type Props = {
  data: ResultShareCardData;
};

export function ResultShareButton({ data }: Props) {
  const [busy, setBusy] = useState(false);

  const onClick = useCallback(async () => {
    setBusy(true);
    try {
      const blob = await renderResultSharePng(data);
      if (!blob) return;
      const file = new File([blob], "cert-mock-summary.png", {
        type: "image/png",
      });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: "모의 결과 요약",
            text: "자격증 도우미 모의 결과 (요약 이미지)",
          });
          return;
        } catch (e) {
          if ((e as Error).name === "AbortError") return;
        }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cert-mock-summary.png";
      a.rel = "noopener";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }, [data]);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
    >
      {busy ? "만드는 중…" : "요약 이미지 저장 · 공유"}
    </button>
  );
}
