/** 쿼리 `focus=db,network` 파싱 */
export function parseCategoryFocusParam(
  raw: string | undefined,
): string[] | null {
  if (!raw?.trim()) return null;
  const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
  return parts.length > 0 ? parts : null;
}
