/**
 * 홈 `자격증 선택` 카드 — 실전 문항 수·과목 구성은 시험별 `preset=full-mock`·`lib/*-written.ts`와 맞출 것.
 */
export const HOME_CERTIFICATIONS = [
  {
    slug: "info-processing",
    name: "정보처리기사",
    description: "필기 모의 · 과목별 학습 · 100문항 실전(창작 풀)",
    href: "/test/info-processing",
    available: true,
  },
  {
    slug: "electrical-engineer",
    name: "전기기사",
    description: "필기 모의 · 과목별 학습 · 100문항 실전(창작 풀)",
    href: "/test/electrical-engineer",
    available: true,
  },
  {
    slug: "electrical-craftsman",
    name: "전기기능사",
    description: "필기 모의 · 과목별 학습 · 60문항 실전(창작 풀)",
    href: "/test/electrical-craftsman",
    available: true,
  },
  {
    slug: "sqld",
    name: "SQLD",
    description: "필기 모의 · 난이도 선택 · 최대 15문항",
    href: "/test/sqld",
    available: true,
  },
  {
    slug: "industrial-safety-industrial",
    name: "산업안전 산업기사",
    description: "필기 모의 · 과목별 학습 · 100문항 실전(창작 풀)",
    href: "/test/industrial-safety-industrial",
    available: true,
  },
  {
    slug: "industrial-safety",
    name: "산업안전기사",
    description: "필기 모의 · 과목별 학습 · 120문항 실전(창작 풀)",
    href: "/test/industrial-safety",
    available: true,
  },
  {
    slug: "construction-safety-industrial",
    name: "건설안전 산업기사",
    description: "필기 모의 · 과목별 학습 · 100문항 실전(창작 풀)",
    href: "/test/construction-safety-industrial",
    available: true,
  },
  {
    slug: "construction-safety-engineer",
    name: "건설안전기사",
    description: "필기 모의 · 과목별 학습 · 120문항 실전(창작 풀)",
    href: "/test/construction-safety-engineer",
    available: true,
  },
] as const;
