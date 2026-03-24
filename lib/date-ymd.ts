/** 로컬 날짜 YYYY-MM-DD */
export function toYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function ymdAddDays(ymd: string, delta: number): string {
  const [y, m, day] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, day);
  dt.setDate(dt.getDate() + delta);
  return toYmd(dt);
}

/** 해당 날짜가 속한 주의 월요일 (로컬) */
export function getMondayYmd(d: Date): string {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate() + diff);
  return toYmd(dt);
}
