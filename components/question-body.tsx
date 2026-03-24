import {
  getCognitiveLevelLabel,
  getStemKindLabel,
  resolveCognitiveLevel,
  resolveStemKind,
} from "@/lib/question-meta";
import { stripCreativeMockPrefix } from "@/lib/question-display";
import type { ExamQuestion } from "@/lib/types";

type Props = {
  question: ExamQuestion;
  /** 문제 번호 옆 등에 유형·인지 라벨 표시 */
  showMeta?: boolean;
  className?: string;
};

export function QuestionBody({
  question: q,
  showMeta = false,
  className = "",
}: Props) {
  const stem = resolveStemKind(q);
  const cog = resolveCognitiveLevel(q);
  const ctxType = q.contextType ?? (q.contextBlock ? "plain" : "none");
  const isCode = ctxType === "code" || stem === "code_or_sql";

  return (
    <div className={`space-y-3 ${className}`}>
      {showMeta && (
        <p className="flex flex-wrap gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span className="rounded bg-zinc-200/80 px-1.5 py-0.5 font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {getStemKindLabel(stem)}
          </span>
          <span className="rounded bg-zinc-200/80 px-1.5 py-0.5 font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {getCognitiveLevelLabel(cog)}
          </span>
        </p>
      )}
      {q.leadIn && (
        <p className="text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
          {stripCreativeMockPrefix(q.leadIn)}
        </p>
      )}
      {q.contextBlock && (
        <div
          className={`rounded-xl border border-zinc-200 bg-zinc-100/90 px-3 py-3 text-sm leading-relaxed text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-200 ${
            isCode
              ? "whitespace-pre-wrap font-mono text-[13px]"
              : "whitespace-pre-wrap"
          }`}
          role="region"
          aria-label="문항 부가 자료"
        >
          {q.contextBlock}
        </div>
      )}
      <p className="text-base font-medium leading-relaxed text-zinc-900 dark:text-zinc-50">
        {stripCreativeMockPrefix(q.question)}
      </p>
    </div>
  );
}
