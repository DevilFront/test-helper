import type { ExamQuestion } from "./types";

/** 전기기사 필기 5과목 — `category` 키 1:1 (`data/electrical-engineer-questions.json`) */
export const ELECTRICAL_ENGINEER_WRITTEN_SUBJECTS = [
  {
    id: "1",
    label: "전기자기학",
    shortLabel: "1과목",
    categoryKeys: ["electro-magnetics"] as const,
  },
  {
    id: "2",
    label: "전력공학",
    shortLabel: "2과목",
    categoryKeys: ["power-engineering"] as const,
  },
  {
    id: "3",
    label: "전기기기",
    shortLabel: "3과목",
    categoryKeys: ["electrical-machines"] as const,
  },
  {
    id: "4",
    label: "회로이론 및 제어공학",
    shortLabel: "4과목",
    categoryKeys: ["circuits-control"] as const,
  },
  {
    id: "5",
    label: "전기설비",
    shortLabel: "5과목",
    categoryKeys: ["electrical-installation"] as const,
  },
] as const;

const PER_SUBJECT = 20;
export const ELECTRICAL_ENGINEER_FULL_MOCK_TOTAL =
  ELECTRICAL_ENGINEER_WRITTEN_SUBJECTS.length * PER_SUBJECT;

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

export type ElectricalEngineerSubjectMeta = {
  id: string;
  shortLabel: string;
  label: string;
};

export function getElectricalEngineerSubjectForCategory(
  category: string,
): ElectricalEngineerSubjectMeta | null {
  for (const sub of ELECTRICAL_ENGINEER_WRITTEN_SUBJECTS) {
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

export function getElectricalEngineerSubjectAtStep(
  round: ExamQuestion[],
  stepIndex: number,
): {
  meta: ElectricalEngineerSubjectMeta;
  indexInSubject: number;
  subjectSize: number;
  subjectOrdinal: number;
} | null {
  if (stepIndex < 0 || stepIndex >= round.length) return null;
  let i = 0;
  let subjectOrdinal = 0;
  for (const sub of ELECTRICAL_ENGINEER_WRITTEN_SUBJECTS) {
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
  const meta = getElectricalEngineerSubjectForCategory(q.category);
  if (!meta) return null;
  return {
    meta,
    indexInSubject: stepIndex,
    subjectSize: round.length,
    subjectOrdinal: 0,
  };
}

/** 필기 100문항: 과목당 최대 20문항씩 무작위 (풀 부족 시 가능한 만큼만) */
export function buildElectricalEngineerFullMockRound(
  pool: ExamQuestion[],
): ExamQuestion[] {
  const out: ExamQuestion[] = [];
  for (const sub of ELECTRICAL_ENGINEER_WRITTEN_SUBJECTS) {
    const set = new Set<string>([...sub.categoryKeys]);
    const subPool = pool.filter((q) => set.has(q.category));
    const shuffled = shuffle(subPool);
    const take = Math.min(PER_SUBJECT, shuffled.length);
    out.push(...shuffled.slice(0, take));
  }
  return out;
}
