type Props = {
  text: string;
};

export function ExamRevisionBanner({ text }: Props) {
  return (
    <div
      className="rounded-xl border border-amber-200/90 bg-amber-50/90 px-4 py-3 text-left text-xs leading-relaxed text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100"
      role="status"
    >
      {text}
    </div>
  );
}
