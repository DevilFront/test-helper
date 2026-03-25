# 문항 풀 우선순위 (후보 시험)

> 검색·수요·트렌드를 참고한 **후보 목록**이다. 구현 여부는 `lib/exam-registry.ts`·`data/*-questions.json`과 동기화해 갱신한다.  
> **납품은 “표에 있는 시험을 한꺼번에 전면 커버”가 아니라**, 시험 → 과목 → **섹션(단원·법령 축 등)** 단위로 쪼개서 깊이를 쌓는 전제를 둔다.

## 현실적 범위: 시험 하나도 섹션 단위로 쌓는다

- **모든 자격증을 한 번에 넓게 깎는 것은 비현실적**이다. 우선순위표는 “무엇을 **다음 후보**로 둘지”일 뿐, 각 항목은 **과목·섹션별로 순차 납품**이 기본이다.
- 예: **산업안전 산업기사**의 한 과목만 해도 **섹션이 나뉜다** (예: 산업안전·보건법령 축, 산업안전 일반 축 등). 데이터·UI 모두 **섹션(또는 `category` 등 동일 역할의 태그)**을 전제로 설계하는 것이 맞다.
- **섹션 하나**를 “짧게 채우기”보다, **한 시간 이상 몰입할 만한 묶음**으로 기획할 수 있다.
  - **요점 정리**: 그 섹션의 암기·판단 포인트만 압축.
  - **문항 생산**: AI·참고는 **기출·교재 원문 복제가 아니라**, 공개 공고·출제 경향·개념 정리를 바탕으로 **창작 모의**를 만든다 (세부는 `docs/question-bank-quality-design.md`).
  - **테마별 세트**: 한 섹션 안에서도 주제 단위로 묶어 풀기 쉽게.
  - **실전 감각**: 발문 길이·선지 난이도·함정 유형이 **실제 CBT에 가깝게** — 그래야 사용자가 “한 세트 더” 하게 된다.
  - **즉시 파악**: 문제 본문·선지·정답 표시가 **한눈에** 들어오게 (가독성·구조).
  - **오답**: 정답 해설만이 아니라 **오답노트 형식** — “왜 이 선지가 틀렸는지”를 짧고 반복 학습에 맞게.

이 문서의 표는 **후보 풀**이고, 실제 로드맵·스프린트에서는 **“이번에 다룰 섹션 N개”**처럼 잘라서 올린다.

## 우선순위표

| 우선순위 | 한글 (표시용) | 제안 slug | 비고 | 상태 |
|----------|---------------|-----------|------|------|
| 높음 | 전기기사 모의 | `electrical-engineer` | 인프라·전력 수요와 검색 많음 | 반영됨 |
| 높음 | 전기기능사 모의 | `electrical-craftsman` | 기사와 구분; `electrician` 대신 slug는 `electrical-craftsman` 권장 | 반영됨 |
| 높음 | SQLD 모의 | `sqld` | 짧고 검색·브랜드 그대로 인식 | 반영됨 |
| 높음 | ADsP 모의 | `adsp` | 동일 | 예정 |
| 높음 | 한국사능력검정 모의 | `korean-history` | 공직·검정 연계 관심 | 예정 |
| 중간 | 재경관리사 모의 | `certified-management-accountant` (또는 `cma`) | ESG·재무 맥락; 약어보다 재경관리사 풀네임이 익숙할 수 있음 | 예정 |
| 중간 | 빅데이터분석기사 모의 | `big-data-analyst` | ADsP·데이터 축 확장 | 예정 |
| 중간 | 산업안전 산업기사 등 | `industrial-safety-industrial` 등 | 이미 동일 패턴으로 존재 | 기존 |

## 네이밍 메모

- **국가기술자격(기사/산업기사/기능사)**: `{분야}-{등급}` 형태 (`electrical-engineer`, `electrical-craftsman`).
- **민간·검정(SQLD, ADsP)**: 공식 약어 그대로 `sqld`, `adsp`가 검색·인지에 유리.
- **JSON 파일명**: `{slug}-questions.json` (예: `data/electrical-craftsman-questions.json`).

## 관련 문서

- 문항 품질·창작 원칙: `docs/question-bank-quality-design.md`
- 제품 로드맵: `docs/product-roadmap.md`
</think>
<think>
I made a typo in the related doc link - "exam-priority-roadmap" vs "question-briority" - fix to question-bank-quality-design.md
</think>


<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
StrReplace