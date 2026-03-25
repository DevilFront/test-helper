import type { ExamQuestion } from "./types";

/**
 * reference4.pdf(2020-08-22 기출 등) 필기 5과목 구조.
 * JSON `category`는 `EXPECTED_CATEGORIES.construction-safety-industrial`와 동일 키 사용.
 * 12개 키를 5과목에 중복 없이 배분(과목당 20문항 풀 보강 기준).
 */
export const CONSTRUCTION_SAFETY_INDUSTRIAL_WRITTEN_SUBJECTS = [
  {
    id: "1",
    label: "산업안전관리론",
    shortLabel: "1과목",
    categoryKeys: [
      "construction-law",
      "construction-mgmt",
      "construction-risk",
    ] as const,
  },
  {
    id: "2",
    label: "인간공학 및 시스템안전공학",
    shortLabel: "2과목",
    categoryKeys: ["construction-health", "construction-fire"] as const,
  },
  {
    id: "3",
    label: "건설시공학",
    shortLabel: "3과목",
    categoryKeys: [
      "construction-excavation",
      "construction-scaffold",
      "construction-machinery",
    ] as const,
  },
  {
    id: "4",
    label: "건설재료학",
    shortLabel: "4과목",
    categoryKeys: ["construction-demolition", "construction-electrical"] as const,
  },
  {
    id: "5",
    label: "건설안전기술",
    shortLabel: "5과목",
    categoryKeys: ["construction-confined", "construction-ppe"] as const,
  },
] as const;

const PER_SUBJECT = 20;
export const CONSTRUCTION_SAFETY_INDUSTRIAL_FULL_MOCK_TOTAL =
  CONSTRUCTION_SAFETY_INDUSTRIAL_WRITTEN_SUBJECTS.length * PER_SUBJECT;

export type ConstructionSafetyIndustrialSubjectMeta = {
  id: string;
  shortLabel: string;
  label: string;
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = t!;
  }
  return copy;
}

export function getConstructionSafetyIndustrialSubjectForCategory(
  category: string,
): ConstructionSafetyIndustrialSubjectMeta | null {
  for (const sub of CONSTRUCTION_SAFETY_INDUSTRIAL_WRITTEN_SUBJECTS) {
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

export function getConstructionSafetyIndustrialSubjectAtStep(
  round: ExamQuestion[],
  stepIndex: number,
): {
  meta: ConstructionSafetyIndustrialSubjectMeta;
  indexInSubject: number;
  subjectSize: number;
  subjectOrdinal: number;
} | null {
  if (stepIndex < 0 || stepIndex >= round.length) return null;
  let i = 0;
  let subjectOrdinal = 0;
  for (const sub of CONSTRUCTION_SAFETY_INDUSTRIAL_WRITTEN_SUBJECTS) {
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
  const meta = getConstructionSafetyIndustrialSubjectForCategory(q.category);
  if (!meta) return null;
  return {
    meta,
    indexInSubject: stepIndex,
    subjectSize: round.length,
    subjectOrdinal: 0,
  };
}

export function buildConstructionSafetyIndustrialFullMockRound(
  pool: ExamQuestion[],
): ExamQuestion[] {
  const out: ExamQuestion[] = [];
  for (const sub of CONSTRUCTION_SAFETY_INDUSTRIAL_WRITTEN_SUBJECTS) {
    const set = new Set<string>([...sub.categoryKeys]);
    const subPool = pool.filter((q) => set.has(q.category));
    const shuffled = shuffle(subPool);
    const take = Math.min(PER_SUBJECT, shuffled.length);
    out.push(...shuffled.slice(0, take));
  }
  return out;
}
