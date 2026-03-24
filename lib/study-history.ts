import type { ExamSlug } from "./exam-registry";
import { getMondayYmd } from "./date-ymd";

const KEY = "cert-study-history-v1";
const MAX_ENTRIES = 400;

export type StudyHistoryEntry = {
  id: string;
  at: number;
  examSlug: ExamSlug;
  questions: number;
  correct: number;
  difficultyMode: string;
  weakCategoryKeys: string[];
};

function randomId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function loadStudyHistory(): StudyHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const p: unknown = JSON.parse(raw);
    if (!Array.isArray(p)) return [];
    return p.filter(
      (x): x is StudyHistoryEntry =>
        x &&
        typeof x === "object" &&
        typeof (x as StudyHistoryEntry).at === "number" &&
        typeof (x as StudyHistoryEntry).questions === "number",
    );
  } catch {
    return [];
  }
}

function saveHistory(entries: StudyHistoryEntry[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    /* ignore */
  }
}

export function appendStudyHistory(entry: Omit<StudyHistoryEntry, "id">): void {
  const list = loadStudyHistory();
  const next: StudyHistoryEntry = { ...entry, id: randomId() };
  list.unshift(next);
  saveHistory(list);
}

/** 이번 주(월요일 시작) 이력 */
export function getThisWeekEntries(now = new Date()): StudyHistoryEntry[] {
  const monday = getMondayYmd(now);
  const mondayMs = new Date(monday + "T00:00:00").getTime();
  return loadStudyHistory().filter((e) => e.at >= mondayMs);
}

export type WeeklySummary = {
  weekMondayYmd: string;
  sessions: number;
  totalQuestions: number;
  totalCorrect: number;
  byExam: Record<string, { sessions: number; questions: number }>;
  /** 약점으로 자주 잡힌 과목 (빈도순 상위) */
  weakCategoryHits: { key: string; count: number }[];
};

export function buildWeeklySummary(now = new Date()): WeeklySummary {
  const weekMondayYmd = getMondayYmd(now);
  const entries = getThisWeekEntries(now);
  const byExam: Record<string, { sessions: number; questions: number }> = {};
  let totalQuestions = 0;
  let totalCorrect = 0;
  const weakFreq = new Map<string, number>();

  for (const e of entries) {
    totalQuestions += e.questions;
    totalCorrect += e.correct;
    if (!byExam[e.examSlug]) {
      byExam[e.examSlug] = { sessions: 0, questions: 0 };
    }
    byExam[e.examSlug].sessions += 1;
    byExam[e.examSlug].questions += e.questions;
    for (const k of e.weakCategoryKeys) {
      weakFreq.set(k, (weakFreq.get(k) ?? 0) + 1);
    }
  }

  const weakCategoryHits = [...weakFreq.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);

  return {
    weekMondayYmd,
    sessions: entries.length,
    totalQuestions,
    totalCorrect,
    byExam,
    weakCategoryHits,
  };
}
