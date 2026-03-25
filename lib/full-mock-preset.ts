/** URL `?preset=full-mock` (또는 fullmock) — 필기 100문항 실전 모의 */
export function parseFullMockPreset(
  raw: string | null | undefined,
): "full-mock" | null {
  if (!raw) return null;
  const n = raw.trim().toLowerCase().replace(/_/g, "-");
  if (n === "full-mock" || n === "fullmock") return "full-mock";
  return null;
}
