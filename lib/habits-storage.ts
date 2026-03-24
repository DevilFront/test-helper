import { getMondayYmd, toYmd, ymdAddDays } from "./date-ymd";

const KEY = "cert-habits-v1";

export type HabitsState = {
  version: 1;
  /** 연속 학습일 (하루 1회 이상 응시 시 유지) */
  streak: number;
  /** 마지막으로 응시한 날 (YYYY-MM-DD) */
  lastStudyDate: string | null;
  /** 집계 중인 주의 월요일 */
  weekMondayYmd: string;
  /** 그 주에 푼 문항 수 */
  weekQuestionCount: number;
};

/** SSR·hydration 첫 페인트와 동일한 기본값 (서버/클라이언트 공통) */
export function defaultHabitsState(): HabitsState {
  const now = new Date();
  return {
    version: 1,
    streak: 0,
    lastStudyDate: null,
    weekMondayYmd: getMondayYmd(now),
    weekQuestionCount: 0,
  };
}

export function loadHabits(): HabitsState {
  if (typeof window === "undefined") return defaultHabitsState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultHabitsState();
    const p: unknown = JSON.parse(raw);
    if (!p || typeof p !== "object") return defaultHabitsState();
    const o = p as Record<string, unknown>;
    if (o.version !== 1) return defaultHabitsState();
    const base = defaultHabitsState();
    return {
      version: 1,
      streak: typeof o.streak === "number" ? o.streak : base.streak,
      lastStudyDate:
        typeof o.lastStudyDate === "string" || o.lastStudyDate === null
          ? (o.lastStudyDate as string | null)
          : base.lastStudyDate,
      weekMondayYmd:
        typeof o.weekMondayYmd === "string"
          ? o.weekMondayYmd
          : base.weekMondayYmd,
      weekQuestionCount:
        typeof o.weekQuestionCount === "number"
          ? o.weekQuestionCount
          : base.weekQuestionCount,
    };
  } catch {
    return defaultHabitsState();
  }
}

function save(s: HabitsState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

/** 응시 1회 기준으로 연속일·주간 문항 수 갱신 */
export function applyStudySession(questionCount: number): HabitsState {
  const s = loadHabits();
  const today = toYmd(new Date());
  const monday = getMondayYmd(new Date());

  if (s.weekMondayYmd !== monday) {
    s.weekMondayYmd = monday;
    s.weekQuestionCount = 0;
  }
  s.weekQuestionCount += questionCount;

  if (s.lastStudyDate !== today) {
    const yesterday = ymdAddDays(today, -1);
    if (!s.lastStudyDate) {
      s.streak = 1;
    } else if (s.lastStudyDate === yesterday) {
      s.streak += 1;
    } else {
      s.streak = 1;
    }
    s.lastStudyDate = today;
  }

  save(s);
  return s;
}
