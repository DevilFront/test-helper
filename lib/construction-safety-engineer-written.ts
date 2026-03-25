import type { ExamQuestion } from "./types";

/**
 * 건설안전기사 필기 6과목 × 20문항 = 120문항 (reference6.pdf 등 기출 형식 참고).
 * JSON `category`는 건설안전 풀과 동일 키 사용.
 */
export const CONSTRUCTION_SAFETY_ENGINEER_WRITTEN_SUBJECTS = [
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
    label: "산업심리 및 교육",
    shortLabel: "2과목",
    categoryKeys: ["construction-health"] as const,
  },
  {
    id: "3",
    label: "인간공학 및 시스템안전공학",
    shortLabel: "3과목",
    categoryKeys: ["construction-fire"] as const,
  },
  {
    id: "4",
    label: "건설시공학",
    shortLabel: "4과목",
    categoryKeys: [
      "construction-excavation",
      "construction-scaffold",
      "construction-machinery",
    ] as const,
  },
  {
    id: "5",
    label: "건설재료학",
    shortLabel: "5과목",
    categoryKeys: ["construction-demolition", "construction-electrical"] as const,
  },
  {
    id: "6",
    label: "건설안전기술",
    shortLabel: "6과목",
    categoryKeys: ["construction-confined", "construction-ppe"] as const,
  },
] as const;

const PER_SUBJECT = 20;
export const CONSTRUCTION_SAFETY_ENGINEER_FULL_MOCK_TOTAL =
  CONSTRUCTION_SAFETY_ENGINEER_WRITTEN_SUBJECTS.length * PER_SUBJECT;

export type ConstructionSafetyEngineerSubjectMeta = {
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

export function getConstructionSafetyEngineerSubjectForCategory(
  category: string,
): ConstructionSafetyEngineerSubjectMeta | null {
  for (const sub of CONSTRUCTION_SAFETY_ENGINEER_WRITTEN_SUBJECTS) {
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

export function getConstructionSafetyEngineerSubjectAtStep(
  round: ExamQuestion[],
  stepIndex: number,
): {
  meta: ConstructionSafetyEngineerSubjectMeta;
  indexInSubject: number;
  subjectSize: number;
  subjectOrdinal: number;
} | null {
  if (stepIndex < 0 || stepIndex >= round.length) return null;
  let i = 0;
  let subjectOrdinal = 0;
  for (const sub of CONSTRUCTION_SAFETY_ENGINEER_WRITTEN_SUBJECTS) {
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
  const meta = getConstructionSafetyEngineerSubjectForCategory(q.category);
  if (!meta) return null;
  return {
    meta,
    indexInSubject: stepIndex,
    subjectSize: round.length,
    subjectOrdinal: 0,
  };
}

export function buildConstructionSafetyEngineerFullMockRound(
  pool: ExamQuestion[],
): ExamQuestion[] {
  const out: ExamQuestion[] = [];
  for (const sub of CONSTRUCTION_SAFETY_ENGINEER_WRITTEN_SUBJECTS) {
    const set = new Set<string>([...sub.categoryKeys]);
    const subPool = pool.filter((q) => set.has(q.category));
    const shuffled = shuffle(subPool);
    const take = Math.min(PER_SUBJECT, shuffled.length);
    out.push(...shuffled.slice(0, take));
  }
  return out;
}
