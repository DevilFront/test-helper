import type { ExamQuestion } from "./types";
import { parseFullMockPreset } from "./full-mock-preset";

/** 큐넷 필기 5과목 — `category` 키로 매핑 (창작 풀 설계용) */
export const INFO_PROCESSING_WRITTEN_SUBJECTS = [
  {
    id: "1",
    label: "소프트웨어설계",
    shortLabel: "1과목",
    categoryKeys: ["software-engineering"] as const,
  },
  {
    id: "2",
    label: "소프트웨어개발",
    shortLabel: "2과목",
    categoryKeys: ["data-structures"] as const,
  },
  {
    id: "3",
    label: "데이터베이스구축",
    shortLabel: "3과목",
    categoryKeys: ["database"] as const,
  },
  {
    id: "4",
    label: "프로그래밍언어·활용",
    shortLabel: "4과목",
    categoryKeys: ["os", "network", "computer-architecture"] as const,
  },
  {
    id: "5",
    label: "정보시스템구축관리",
    shortLabel: "5과목",
    categoryKeys: ["project-management", "security"] as const,
  },
] as const;

export type InfoProcessingWrittenSubjectId =
  (typeof INFO_PROCESSING_WRITTEN_SUBJECTS)[number]["id"];

const PER_SUBJECT = 20;
export const INFO_PROCESSING_FULL_MOCK_TOTAL =
  INFO_PROCESSING_WRITTEN_SUBJECTS.length * PER_SUBJECT;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = t;
  }
  return copy;
}

/** `category` → 필기 과목 (수동·PDF 반영 시 동일 키로 맞추면 UI에 표시됨) */
export type InfoProcessingSubjectMeta = {
  id: string;
  shortLabel: string;
  label: string;
};

export function getInfoProcessingSubjectForCategory(
  category: string,
): InfoProcessingSubjectMeta | null {
  for (const sub of INFO_PROCESSING_WRITTEN_SUBJECTS) {
    if ((sub.categoryKeys as readonly string[]).includes(category)) {
      return {
        id: sub.id,
        shortLabel: sub.shortLabel,
        label: sub.label,
      };
    }
  }
  return null;
}

/**
 * 실전 모의처럼 과목 블록이 연속일 때, 현재 문항의 과목·과목 내 순번.
 * 순서가 섞인 세션은 카테고리 기준으로만 메타를 채운다.
 */
export function getInfoProcessingSubjectAtStep(
  round: ExamQuestion[],
  stepIndex: number,
): {
  meta: InfoProcessingSubjectMeta;
  indexInSubject: number;
  subjectSize: number;
  subjectOrdinal: number;
} | null {
  if (stepIndex < 0 || stepIndex >= round.length) return null;
  let i = 0;
  let subjectOrdinal = 0;
  for (const sub of INFO_PROCESSING_WRITTEN_SUBJECTS) {
    const set = new Set<string>([...sub.categoryKeys]);
    const start = i;
    while (i < round.length && set.has(round[i].category)) {
      i++;
    }
    const size = i - start;
    if (size === 0) continue;
    if (stepIndex < i) {
      return {
        meta: {
          id: sub.id,
          shortLabel: sub.shortLabel,
          label: sub.label,
        },
        indexInSubject: stepIndex - start,
        subjectSize: size,
        subjectOrdinal,
      };
    }
    subjectOrdinal++;
  }
  const q = round[stepIndex];
  const meta = getInfoProcessingSubjectForCategory(q.category);
  if (!meta) return null;
  return {
    meta,
    indexInSubject: stepIndex,
    subjectSize: round.length,
    subjectOrdinal: 0,
  };
}

/** @deprecated `parseFullMockPreset` 사용 권장 */
export const parseInfoProcessingFullMockPreset = parseFullMockPreset;

/** 필기 100문항 형식: 과목당 최대 20문항씩 무작위 (풀 부족 시 가능한 만큼만) */
export function buildInfoProcessingFullMockRound(
  pool: ExamQuestion[],
): ExamQuestion[] {
  const out: ExamQuestion[] = [];
  for (const sub of INFO_PROCESSING_WRITTEN_SUBJECTS) {
    const set = new Set<string>([...sub.categoryKeys]);
    const subPool = pool.filter((q) => set.has(q.category));
    const shuffled = shuffle(subPool);
    const take = Math.min(PER_SUBJECT, shuffled.length);
    out.push(...shuffled.slice(0, take));
  }
  return out;
}
