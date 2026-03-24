# 자격증 도우미 — 기능 로드맵

사용자·운영 관점에서 합의한 기능을 **단계별**로 정리한다. 완료 시 체크박스를 갱신한다.

---

## Phase 1 — 로컬 우선 (계정 없음)

| 항목 | 상태 | 비고 |
|------|------|------|
| 다크/라이트·시스템 테마 + 글자 크기 | ☑ | `localStorage`, `/settings` |
| 오답만 다시 풀기 | ☑ | 결과 → 세션 풀 → `/test/[slug]/retry` |
| 약점 과목만 모의 | ☑ | 결과의 약점 `category`로 풀 필터 |
| 문항 북마크 | ☑ | `localStorage`, 시험별 문항 id |
| 문항 출처 안내 문구 | ☑ | UI 고정 문구 + 필요 시 JSON 메타 |
| 설정 화면 | ☑ | 테마·글자 크기 |

---

## Phase 2 — 학습·복습 강화

| 항목 | 상태 | 비고 |
|------|------|------|
| 풀이 타이머 | ☑ | 설정에서 켜기, 세션 상단 경과 시간 |
| 중간 저장(이어풀기) | ☑ | `sessionStorage` `cert-in-progress-v1`, 새로 풀기 |
| 북마크 목록 화면 | ☑ | `/bookmarks` |
| 난이도·과목 로드맵 UI | ☑ | `/learn`, `focus=` 쿼리로 과목 필터 모의 |

---

## Phase 3 — 동기·습관

| 항목 | 상태 | 비고 |
|------|------|------|
| 연속 출석 / 주간 목표 | ☑ | `cert-habits-v1`, 월요일 주간 리셋, 로드맵 목표와 진행률 |
| 주간 요약 리포트 | ☑ | `cert-study-history-v1`, `/progress` |

---

## Phase 4 — 신뢰·투명성

| 항목 | 상태 | 비고 |
|------|------|------|
| 문항별 `sourceLevel` JSON 필드 | ☑ | `creative_mock` 기본, 모의·결과에 표시 |
| 시험 공고 링크·과목 비율 안내 | ☑ | `/exam/[slug]/info`, 큐넷 링크 + 공고 확인 유도 |

---

## Phase 5 — 편의

| 항목 | 상태 | 비고 |
|------|------|------|
| PWA (manifest, 아이콘) | ☑ | `app/manifest.ts`, `public/icons/*.png`, `npm run icons` |
| 결과 공유 이미지 | ☑ | Canvas 요약 카드, Web Share 또는 다운로드 |

---

## Phase 6 — 계정·동기화

| 항목 | 상태 | 비고 |
|------|------|------|
| 인증 (Auth.js 등) | ☐ | `docs/phase6-future-auth.md` |
| DB (PostgreSQL 등) | ☐ | 응시 이력·오답 통계 |
| 기기 간 이어풀기 | ☐ | 로그인 후 클라우드 동기화 |
| 로컬 백업·복원 | ☑ | `/settings/data`, JSON 파일 |

---

## Phase 7 — 콘텐츠

| 항목 | 상태 | 비고 |
|------|------|------|
| 자격증 종류 추가 | ☑ | `exam-registry` + JSON 풀 — 정보처리·전기(기사/기능사)·SQLD·산업안전(산업기사/기사)·건설안전(산업기사/기사) |
| 필기/실기 구분 | ☑ | `ExamConfig.phase`, 배지·메타 |
| 개정·연도 안내 | ☑ | 홈·난이도 선택 배너, `revisionNote` |

---

## OpenAI 활용

별도 문서: `docs/openai-integration.md`

---

## 문항 품질 (전면 설계)

설계서: `docs/question-bank-quality-design.md` (유형·스키마 v2·검수·커버리지·마이그레이션)
