# 참고 PDF · 텍스트 추출

실제 기출·문제집 PDF는 **원문 복제 없이** 출제 경향·단원만 참고하고, 앱 문항은 **창작 모의**로 만든다 (`docs/content-authoring-rules.md`).

## 이 폴더

- `reference1.pdf` 등: 사용자가 넣은 참고 자료
- `reference1-extracted.txt`: Python `pypdf`로 추출한 텍스트 (재생성 가능)

## reference 번호별 정의

- `reference1.pdf` — 정보처리기사 (`info-processing`)
- `reference2.pdf` — 산업안전 산업기사 (`industrial-safety-industrial`)
- `reference3.pdf` — 산업안전기사 (`industrial-safety`)
- `reference4.pdf` — 건설안전 산업기사 (`construction-safety-industrial`)
- `reference5.pdf` — 전기기능사 (`electrical-craftsman`)
- `reference6.pdf` — 건설안전기사 (`construction-safety-engineer`)
- `reference7.pdf` — 전기기사 (`electrical-engineer`)

추가 PDF는 같은 규칙으로 번호를 이어 붙이면 된다.

**예시로 미리 잡아 둔 번호(아래 큐와 동일)** — PDF 넣고 부탁할 때 그대로 쓰거나, 파일명·시험명만 바꿔도 된다.

- `reference5.pdf` — 전기기능사 (`electrical-craftsman`) — 필기 **3과목×20=60** 형식. 앱은 `data/electrical-craftsman-questions.json`·`lib/electrical-craftsman-written.ts`·`preset=full-mock`(60문항)과 맞춘다.
- `reference6.pdf` — 건설안전기사 (`construction-safety-engineer`) — `reference6-extracted.txt` (2022-04-24 등 **6과목×20=120** 형식)
- `reference7.pdf` — 전기기사 (`electrical-engineer`) — 필기 **5과목×20=100** 형식(공고). 참고 PDF(예: `전기기사20220424(학생용).pdf`). 앱은 `data/electrical-engineer-questions.json`(과목당 20·총 **100문항** 창작 풀)·`lib/electrical-engineer-written.ts`·`preset=full-mock`(100문항); 난이도별 짧은 세션은 최대 15문항.

새 시험을 앱에 **처음** 넣을 때는 `slug`를 새로 짓는다. 규칙: 영어 소문자·하이픈·`exam-registry`의 `EXAM_SLUGS`와 `data/<slug>-questions.json` 이름을 맞출 것. (예: 가상의 시험이면 `water-quality-tech` 같은 식으로 표에만 적어 두고, 구현 시 레지스트리에 추가.)

### 작업 큐 (에이전트·본인 공용)

PDF를 이 폴더에 두고, 아래 표만 채워 두면 **한 번의 요청으로** 순서대로 진행할 수 있다. (백그라운드에서 자동으로 돌아가는 건 아니고, 채팅 한 번에 “큐 전부” 또는 “reference N만”이라고 하면 된다.)

| 우선순위 | 파일             | 시험(한글명)      | 앱 `slug`                        | 필기·앱 메모                                                   | 상태      |
| -------- | ---------------- | ----------------- | -------------------------------- | -------------------------------------------------------------- | --------- |
| 1        | `reference1.pdf` | 정보처리기사      | `info-processing`                | 5×20=100 · full-mock                                           | 완료      |
| 2        | `reference2.pdf` | 산업안전 산업기사 | `industrial-safety-industrial`   | 5×20=100 · full-mock                                           | 완료      |
| 3        | `reference3.pdf` | 산업안전기사      | `industrial-safety`              | 6×20=120 · full-mock                                           | 완료      |
| 4        | `reference4.pdf` | 건설안전 산업기사 | `construction-safety-industrial` | 5×20=100 · full-mock                                           | 완료      |
| 5        | `reference5.pdf` | 전기기능사        | `electrical-craftsman`           | 3×20=60 · full-mock                                            | 완료      |
| 6        | `reference6.pdf` | 건설안전기사      | `construction-safety-engineer`   | 6×20=120 · full-mock                                           | 완료      |
| 7        | `reference7.pdf` | 전기기사          | `electrical-engineer`            | 5×20=100 · full-mock · 참고 PDF                                | 완료      |

**상태** 예시: `대기` → `진행중` → `완료`. `예시·대기`는 PDF만 넣으면 `대기`로 바꾸고 에이전트에 넘기면 된다.

**에이전트에게 보낼 때 예시 (한 번에 여러 개)**

- `docs/reference/README.md` 작업 큐에서 상태가 대기인 것만, 위에서부터 순서대로 처리해줘. 창작 모의 규칙은 content-authoring-rules 따르고, 기출 원문 복제는 하지 마.
- `reference5.pdf`만 반영해줘 (표의 `electrical-craftsman` 등 slug에 맞춰).
- `reference7.pdf`만 반영해줘 (표의 `electrical-engineer`에 맞춰).
- `reference5`~`reference7` 예시 행 전부 반영해줘 (순서대로).

## PDF → 텍스트 (권장)

프로젝트 루트에서:

```bash
python3 scripts/pdf_to_text.py docs/reference/파일명.pdf docs/reference/파일명-extracted.txt
```

의존성:

```bash
pip3 install --user pypdf
```

## 대안

- **poppler**: `brew install poppler` 후 `pdftotext -layout 입력.pdf 출력.txt`
- **스캔본**: OCR 후 위와 동일

표·도표·코드는 추출이 깨지거나 누락될 수 있어, 해당 문항은 과목별로 **직접 요약**해 주는 것이 안전하다.

## 정보처리기사 필기 — 과목과 JSON `category`

앱에서 **필기 1~5과목 배지**는 `data/*-questions.json`의 `category` 문자열로 판별한다. PDF·요강과 맞추려면 아래 키를 쓰면 된다 (`lib/info-processing-written.ts`와 동일).

| 과목                  | `category` 키                            |
| --------------------- | ---------------------------------------- |
| 1 소프트웨어설계      | `software-engineering`                   |
| 2 소프트웨어개발      | `data-structures`                        |
| 3 데이터베이스구축    | `database`                               |
| 4 프로그래밍언어·활용 | `os`, `network`, `computer-architecture` |
| 5 정보시스템구축관리  | `project-management`, `security`         |

실전 100문항 모의 URL: `preset=full-mock` (또는 `fullmock`).

- `reference3.pdf` → `reference3-extracted.txt` (pypdf, 프로젝트 루트에서 `python3 scripts/pdf_to_text.py docs/reference/reference3.pdf` 로 재생성 가능)
- 2022-04-24 기출 등에서 **문항 1~20: 1과목**, … **101~120: 6과목** 형태로 과목 헤더가 이어짐(전기·화학이 기사 필기에서 **별도 과목**).

앱 **필기 1~6과목 배지**는 `data/industrial-safety-engineer-questions.json`의 `category`와 아래 매핑을 쓴다 (`lib/industrial-safety-engineer-written.ts`와 동일).

| 과목                         | `category` 키                                        |
| ---------------------------- | ---------------------------------------------------- |
| 1 안전관리론                 | `safety-law`, `safety-management`, `risk-assessment` |
| 2 인간공학 및 시스템안전공학 | `ergonomics`, `psm`, `industrial-health`             |
| 3 기계위험방지기술           | `machinery-safety`                                   |
| 4 전기위험방지기술           | `electrical-safety`                                  |
| 5 화학설비위험방지기술       | `chemical-safety`, `fire-explosion`                  |
| 6 건설안전기술               | `confined-space`, `ppe`                              |

실전 120문항 모의 URL: `preset=full-mock` (또는 `fullmock`).

## reference4 건설안전 산업기사

- `reference4.pdf` → `reference4-extracted.txt` (동일 `pdf_to_text.py`로 재생성 가능)
- 2020-08-22 기출 등에서 **5과목 × 20문항 = 100문항** — `1과목 : 산업안전관리론` … `5과목 : 건설안전기술` (본문 중 과목 헤더 위치는 PDF 조판에 따라 추출 줄이 어긋날 수 있음)

앱 **필기 1~5과목 배지**는 `data/construction-safety-industrial-questions.json`의 `category`와 아래 매핑을 쓴다 (`lib/construction-safety-industrial-written.ts`와 동일). 12개 `category` 키를 5과목에 **중복 없이** 나눈다.

| 과목                         | `category` 키                                                                |
| ---------------------------- | ---------------------------------------------------------------------------- |
| 1 산업안전관리론             | `construction-law`, `construction-mgmt`, `construction-risk`                 |
| 2 인간공학 및 시스템안전공학 | `construction-health`, `construction-fire`                                   |
| 3 건설시공학                 | `construction-excavation`, `construction-scaffold`, `construction-machinery` |
| 4 건설재료학                 | `construction-demolition`, `construction-electrical`                         |
| 5 건설안전기술               | `construction-confined`, `construction-ppe`                                  |

실전 100문항 모의 URL: `preset=full-mock` (또는 `fullmock`).

## reference5 전기기능사

- `reference5.pdf` → `reference5-extracted.txt` (동일 `pdf_to_text.py`로 재생성 가능)
- 필기 **3과목 × 20문항 = 60문항** — 전기이론·전기기기·전기설비

앱 **필기 1~3과목 배지**와 실전 60문항 분할은 `data/electrical-craftsman-questions.json`의 `category`와 `lib/electrical-craftsman-written.ts`를 따른다. 5개 `category` 키를 3과목에 걸쳐 쓰며, 실전 모의에서는 과목당 20문항이 되도록 카테고리 간 문항을 조합한다.

| 과목       | `category` 키                                                |
| ---------- | ------------------------------------------------------------ |
| 1 전기이론 | `electro-magnetics`, `circuits-control` (12+8문항 조합)        |
| 2 전기기기 | `power-engineering`, `electrical-machines` (4+12+4문항 조합) |
| 3 전기설비 | `electrical-installation` (8+12문항 조합)                  |

실전 60문항 모의 URL: `preset=full-mock` (또는 `fullmock`).

## reference7 전기기사

- `reference7.pdf` → `reference7-extracted.txt` (동일 `pdf_to_text.py`로 재생성 가능)
- 파일명 예: `전기기사20220424(학생용).pdf` — 필기 **5과목 × 20문항 = 100문항**(시행 공고 기준; 과목명·비율은 개정·회차에 따라 달라질 수 있음)

앱 **`electrical-engineer`** 는 `data/electrical-engineer-questions.json`을 쓴다. 창작 풀은 **과목(`category`)당 20문항 × 5 = 100문항**이며, 필기 실전 모의는 `lib/electrical-engineer-written.ts`와 `preset=full-mock`으로 **과목 순서 1→5·과목당 20문항**을 맞춘다. 난이도별 짧은 연습 세션은 **최대 15문항**이다.

| 과목(참고)              | JSON `category` 키      |
| ----------------------- | ----------------------- |
| 1 전기자기학            | `electro-magnetics`     |
| 2 전력공학              | `power-engineering`     |
| 3 전기기기              | `electrical-machines`   |
| 4 회로이론 및 제어공학  | `circuits-control`      |
| 5 전기설비              | `electrical-installation` |

실전 100문항 모의 URL: `preset=full-mock` (또는 `fullmock`).
