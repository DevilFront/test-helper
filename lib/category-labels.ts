/** Exam JSON `category` 키 → 한글 표기 */
export const CATEGORY_LABELS: Record<string, string> = {
  database: "데이터베이스",
  os: "운영체제",
  network: "네트워크",
  "software-engineering": "소프트웨어 공학",
  "data-structures": "자료구조·알고리즘",
  security: "정보 보안",
  "computer-architecture": "컴퓨터 구조",
  "project-management": "프로젝트 관리",
  "safety-law": "산업안전보건법",
  "safety-management": "안전보건관리",
  "risk-assessment": "위험성평가",
  "industrial-health": "산업보건",
  "chemical-safety": "화학물질·MSDS",
  "machinery-safety": "기계·설비 안전",
  "electrical-safety": "전기 안전",
  "fire-explosion": "화기·화재·폭발",
  "confined-space": "밀폐공간",
  ppe: "보호구",
  psm: "PSM·중대재해 예방",
  ergonomics: "인간공학·근골격계",
};

export function getCategoryDisplayName(key: string): string {
  return CATEGORY_LABELS[key] ?? key;
}
