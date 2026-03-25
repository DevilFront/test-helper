import type { ExamQuestion } from "./types";

/**
 * 전기기능사 필기 reference5.pdf 등 — 3과목 × 20문항 = 60문항.
 * JSON은 과목별 `category` 5종(각 12문항)이므로, 실전 모의는 과목당 20문항이 되도록
 * 카테고리를 1→2→3과목에 **한 번씩만** 나누어 조합한다(문항 중복 없음).
 */
export const ELECTRICAL_CRAFTSMAN_WRITTEN_SUBJECTS = [
  {
    id: "1",
    label: "전기이론",
    shortLabel: "1과목",
    categoryKeys: ["electro-magnetics", "circuits-control"] as const,
  },
  {
    id: "2",
    label: "전기기기",
    shortLabel: "2과목",
    categoryKeys: ["power-engineering", "electrical-machines"] as const,
  },
  {
    id: "3",
    label: "전기설비",
    shortLabel: "3과목",
    categoryKeys: ["electrical-installation"] as const,
  },
] as const;

const PER_SUBJECT = 20;
export const ELECTRICAL_CRAFTSMAN_FULL_MOCK_TOTAL =
  ELECTRICAL_CRAFTSMAN_WRITTEN_SUBJECTS.length * PER_SUBJECT;

export type ElectricalCraftsmanSubjectMeta = {
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

function byCategory(pool: ExamQuestion[], cat: string): ExamQuestion[] {
  return pool.filter((q) => q.category === cat);
}

/**
 * 풀 60문항(카테고리별 12문항)을 20+20+20으로 분할한다.
 * - 1과목: 전기자기 12 + 회로이론 8
 * - 2과목: 회로이론 4 + 전력 12 + 전기기기 4
 * - 3과목: 전기기기 8 + 전기설비 12
 */
export function buildElectricalCraftsmanFullMockRound(
  pool: ExamQuestion[],
): ExamQuestion[] {
  const em = shuffle(byCategory(pool, "electro-magnetics"));
  const cc = shuffle(byCategory(pool, "circuits-control"));
  const pe = shuffle(byCategory(pool, "power-engineering"));
  const mach = shuffle(byCategory(pool, "electrical-machines"));
  const ei = shuffle(byCategory(pool, "electrical-installation"));
  if (
    em.length !== 12 ||
    cc.length !== 12 ||
    pe.length !== 12 ||
    mach.length !== 12 ||
    ei.length !== 12
  ) {
    const out: ExamQuestion[] = [];
    for (const sub of ELECTRICAL_CRAFTSMAN_WRITTEN_SUBJECTS) {
      const set = new Set<string>([...sub.categoryKeys]);
      const subPool = shuffle(pool.filter((q) => set.has(q.category)));
      const take = Math.min(PER_SUBJECT, subPool.length);
      out.push(...subPool.slice(0, take));
    }
    return out;
  }
  const s1 = shuffle([...em, ...cc.slice(0, 8)]);
  const s2 = shuffle([...cc.slice(8), ...pe, ...mach.slice(0, 4)]);
  const s3 = shuffle([...mach.slice(4), ...ei]);
  return [...s1, ...s2, ...s3];
}

export function getElectricalCraftsmanSubjectForCategory(
  category: string,
): ElectricalCraftsmanSubjectMeta | null {
  const map: Record<string, ElectricalCraftsmanSubjectMeta> = {
    "electro-magnetics": {
      id: "1",
      shortLabel: "1과목",
      label: "전기이론",
    },
    "circuits-control": {
      id: "1",
      shortLabel: "1과목",
      label: "전기이론",
    },
    "power-engineering": {
      id: "2",
      shortLabel: "2과목",
      label: "전기기기",
    },
    "electrical-machines": {
      id: "2",
      shortLabel: "2과목",
      label: "전기기기",
    },
    "electrical-installation": {
      id: "3",
      shortLabel: "3과목",
      label: "전기설비",
    },
  };
  return map[category] ?? null;
}

export function getElectricalCraftsmanSubjectAtStep(
  round: ExamQuestion[],
  stepIndex: number,
): {
  meta: ElectricalCraftsmanSubjectMeta;
  indexInSubject: number;
  subjectSize: number;
  subjectOrdinal: number;
} | null {
  if (stepIndex < 0 || stepIndex >= round.length) return null;
  const subjectOrdinal = Math.floor(stepIndex / PER_SUBJECT);
  const sub = ELECTRICAL_CRAFTSMAN_WRITTEN_SUBJECTS[subjectOrdinal];
  if (!sub) {
    const q = round[stepIndex];
    const meta = getElectricalCraftsmanSubjectForCategory(q.category);
    if (!meta) return null;
    return {
      meta,
      indexInSubject: stepIndex,
      subjectSize: round.length,
      subjectOrdinal: 0,
    };
  }
  const start = subjectOrdinal * PER_SUBJECT;
  const end = Math.min(start + PER_SUBJECT, round.length);
  const subjectSize = end - start;
  return {
    meta: {
      id: sub.id,
      shortLabel: sub.shortLabel,
      label: sub.label,
    },
    indexInSubject: stepIndex - start,
    subjectSize,
    subjectOrdinal,
  };
}
