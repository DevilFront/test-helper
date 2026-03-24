/**
 * JSON에 넣은 `[창작 모의 · 시험명]` 머리줄 — UI에서는 시험명만 보이게 제거
 */
export function stripCreativeMockPrefix(text: string): string {
  return text
    .replace(/^\[[^\]]*창작 모의[^\]]*\]\s*/u, "")
    .trimStart();
}
