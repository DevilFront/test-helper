export type QuestionOption = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  question: string;
  options: QuestionOption[];
  correctOptionId: string;
};

export type QuestionBank = {
  title: string;
  description: string;
  questions: Question[];
};

/**
 * 문항 출처 표기 (JSON 생략 시 앱에서 기본값 적용)
 * - creative_mock: 창작 모의
 * - concept_reference: 공개된 개념·범위 참고
 * - mixed: 창작과 참고 혼합
 */
export type SourceLevel = "creative_mock" | "concept_reference" | "mixed";

/** 발문 형식 — `docs/question-bank-quality-design.md` */
export type StemKind =
  | "definition"
  | "which_best"
  | "scenario"
  | "code_or_sql"
  | "table_diagram"
  | "not"
  | "combo";

export type CognitiveLevel =
  | "remember"
  | "understand"
  | "apply"
  | "analyze";

export type ContextType = "none" | "plain" | "code" | "table";

export type ReviewStatus = "draft" | "reviewed" | "published";

/** 정보처리기사 스타일 JSON 문항 (data/*-questions.json) — v1 필수, v2 선택 */
export type ExamQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  category: string;
  difficulty: string;
  sourceLevel?: SourceLevel;
  /** 상황·배경 (핵심 질문 위) */
  leadIn?: string;
  /** 표·코드·의사코드 등 (질문 위, 회색 블록) */
  contextBlock?: string;
  contextType?: ContextType;
  stemKind?: StemKind;
  cognitiveLevel?: CognitiveLevel;
  itemVersion?: number;
  reviewStatus?: ReviewStatus;
  reviewedAt?: string;
  tags?: string[];
};

export type TestResultPayload = {
  version: 1;
  questions: ExamQuestion[];
  /** 선택한 보기 인덱스 (0–3), 길이는 questions와 동일 */
  selectedAnswers: number[];
  /** 시험 식별 (결과 화면·저장소 구분) */
  examSlug?: string;
  examTitle?: string;
  /** easy | medium | hard | mixed */
  difficultyMode?: string;
};
