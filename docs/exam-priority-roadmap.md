# 문항 풀 우선순위 (후보 시험)

> 검색·수요·트렌드를 참고한 **후보 목록**이다. 구현 여부는 `lib/exam-registry.ts`·`data/*-questions.json`과 동기화해 갱신한다.

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