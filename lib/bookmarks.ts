import type { ExamSlug } from "./exam-registry";

const KEY = "cert-bookmarks-v1";

type Store = Partial<Record<ExamSlug, number[]>>;

function loadStore(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const p: unknown = JSON.parse(raw);
    return typeof p === "object" && p !== null ? (p as Store) : {};
  } catch {
    return {};
  }
}

function saveStore(s: Store): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export function isBookmarked(slug: ExamSlug, questionId: number): boolean {
  const s = loadStore();
  return (s[slug] ?? []).includes(questionId);
}

/** @returns 새 북마크 여부 */
export function toggleBookmark(slug: ExamSlug, questionId: number): boolean {
  const s = loadStore();
  const arr = [...(s[slug] ?? [])];
  const i = arr.indexOf(questionId);
  if (i >= 0) {
    arr.splice(i, 1);
    saveStore({ ...s, [slug]: arr });
    return false;
  }
  arr.push(questionId);
  saveStore({ ...s, [slug]: arr });
  return true;
}

export function listBookmarkIds(slug: ExamSlug): number[] {
  return loadStore()[slug] ?? [];
}
