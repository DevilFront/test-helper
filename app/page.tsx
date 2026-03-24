import Link from "next/link";
import { HabitsWidget } from "@/components/habits-widget";

export const metadata = {
  title: "자격증 도우미",
  description:
    "자격증별 모의고사로 실력을 점검하세요. 빠른 진단, 약점 분석, 실전 대비.",
};

const certifications = [
  {
    slug: "info-processing",
    name: "정보처리기사",
    description: "필기 모의 · 난이도 선택 · 최대 15문항",
    href: "/test/info-processing",
    available: true,
  },
  {
    slug: "electrical-engineer",
    name: "전기기사",
    description: "필기 모의 · 난이도 선택 · 최대 15문항",
    href: "/test/electrical-engineer",
    available: true,
  },
  {
    slug: "electrical-craftsman",
    name: "전기기능사",
    description: "필기 모의 · 난이도 선택 · 최대 15문항",
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
    description: "필기 모의 · 난이도 선택 · 최대 15문항",
    href: "/test/industrial-safety-industrial",
    available: true,
  },
  {
    slug: "industrial-safety",
    name: "산업안전기사",
    description: "필기 모의 · 난이도 선택 · 최대 15문항",
    href: "/test/industrial-safety",
    available: true,
  },
  {
    slug: "construction-safety-industrial",
    name: "건설안전 산업기사",
    description: "필기 모의 · 난이도 선택 · 최대 15문항",
    href: "/test/construction-safety-industrial",
    available: true,
  },
  {
    slug: "construction-safety-engineer",
    name: "건설안전기사",
    description: "필기 모의 · 난이도 선택 · 최대 15문항",
    href: "/test/construction-safety-engineer",
    available: true,
  },
] as const;

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-14 sm:px-6 sm:py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold leading-snug tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            자격증 도우미
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            실제 시험에 가까운 모의로 합격 가능성을 가볍게 점검해 보세요
          </p>
        </div>

        <div className="mt-8 w-full">
          <HabitsWidget />
        </div>

        <p
          className="mt-6 w-full rounded-xl border border-amber-200/90 bg-amber-50/90 px-4 py-3 text-left text-xs leading-relaxed text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100"
          role="status"
        >
          <strong className="font-semibold">개정 안내:</strong> 실제 시험 과목·출제
          비율은 시행·개정에 따라 달라질 수 있습니다. 응시 전 큐넷 등{" "}
          <strong>최신 공고</strong>를 확인하세요.
        </p>

        <div className="mt-10">
          <h2 className="text-center text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            자격증 선택
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {certifications.map((c) =>
              c.available ? (
                <li key={c.slug}>
                  <Link
                    href={c.href}
                    className="flex flex-col rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-left shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20"
                  >
                    <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                      {c.name}
                    </span>
                    <span className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {c.description}
                    </span>
                    <span className="mt-3 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                      모의 시작 →
                    </span>
                  </Link>
                </li>
              ) : (
                <li
                  key={c.slug}
                  className="rounded-2xl border border-dashed border-zinc-200 px-5 py-4 dark:border-zinc-800"
                >
                  <span className="text-base font-medium text-zinc-400 dark:text-zinc-500">
                    {c.name}
                  </span>
                  <p className="mt-1 text-sm text-zinc-400">준비 중</p>
                </li>
              ),
            )}
          </ul>
        </div>

        <ul
          className="mt-12 space-y-3 text-left text-[15px] text-zinc-700 dark:text-zinc-300"
          aria-label="서비스 안내"
        >
          {["빠른 진단", "약점 분석", "실전 대비"].map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 rounded-xl border border-zinc-200/90 bg-white/80 px-4 py-3.5 dark:border-zinc-800 dark:bg-zinc-950/80"
            >
              <span
                className="flex h-2 w-2 shrink-0 rounded-full bg-emerald-500"
                aria-hidden
              />
              <span className="font-medium">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-center gap-3 text-center text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
          <p>회원가입 없음 · 결과는 이 기기에만 저장됩니다</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link
              href="/progress"
              className="font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
            >
              학습 현황
            </Link>
            <Link
              href="/learn"
              className="font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
            >
              학습 로드맵
            </Link>
            <Link
              href="/bookmarks"
              className="font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
            >
              북마크
            </Link>
            <Link
              href="/settings"
              className="font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
            >
              화면·글자·타이머
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
