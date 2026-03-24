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

/** 정보처리기사 스타일 JSON 문항 (data/info-processing-engineer-questions.json) */
export type ExamQuestion = {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  category: string;
  difficulty: string;
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
