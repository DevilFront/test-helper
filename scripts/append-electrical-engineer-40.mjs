/**
 * 전기기사 풀을 필기 100문항(5과목×20)에 맞게 과목당 8문항씩 보강합니다.
 * 실행: node scripts/append-electrical-engineer-40.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const target = path.join(root, "data/electrical-engineer-questions.json");

const base = (id, category, tag, q, opts, ans, exp, diff = "medium", stem = "which_best", cog = "understand") => ({
  id,
  sourceLevel: "creative_mock",
  itemVersion: 1,
  reviewStatus: "published",
  question: q,
  options: opts,
  answer: ans,
  explanation: exp,
  category,
  difficulty: diff,
  stemKind: stem,
  cognitiveLevel: cog,
  tags: [tag],
});

const extra = [
  // electro-magnetics 61–68
  base(61, "electro-magnetics", "전기자기학", "전기 쌍극자 모멘트의 방향은 일반적으로 어디를 향하는가?", ["음극에서 양극", "양극에서 음극", "자계 방향", "전류 방향"], 0, "쌍극자 모멘트는 음에서 양으로 정의된다.", "medium", "definition", "remember"),
  base(62, "electro-magnetics", "전기자기학", "정전계에서 도체 표면의 전계는 표면에 대해?", ["수직", "접선", "임의", "0이 아님만"], 0, "도체 표면은 등전위이며 전계는 표면에 수직이다.", "easy", "definition", "remember"),
  base(63, "electro-magnetics", "전기자기학", "자기 회로의 옴의 법칙에 해당하는 식 형태는?", ["NI = ΦR", "V = IR만", "P = VI만", "Q = CV만"], 0, "자기회로에서 자기압 = 자속×자기저항 형태로 쓴다.", "medium", "which_best", "understand"),
  base(64, "electro-magnetics", "전기자기학", "전류가 흐르는 직선 도체 주변 자계의 방향 판별에 쓰는 법칙은?", ["오른손 법칙", "렌츠 법칙만", "가우스만", "쿨롱만"], 0, "직선 도선의 자계는 오른손 나사 법칙으로 판별한다.", "easy", "definition", "remember"),
  base(65, "electro-magnetics", "전기자기학", "변위 전류 밀도와 관련된 필드는?", ["전기장(전속)의 시간변화", "자계의 공간적 크기만", "온도", "질량"], 0, "맥스웰 방정식에서 변위전류는 전기장의 변화와 연결된다.", "hard", "which_best", "understand"),
  base(66, "electro-magnetics", "전기자기학", "강자성체의 히스테리시스 곡선에서 잔류 자속이 나타나는 이유는?", ["도메인의 이력", "저항만", "주파수만", "색상"], 0, "자화의 이력 효과로 잔류 자속이 남는다.", "medium", "which_best", "understand"),
  base(67, "electro-magnetics", "전기자기학", "평면파에서 전계와 자계의 관계로 알려진 것은?", ["진행 방향에 수직", "항상 평행", "항상 동상", "무관"], 0, "진공에서 평면 전자기파는 E⊥B⊥k 관계이다.", "medium", "which_best", "understand"),
  base(68, "electro-magnetics", "전기자기학", "구 대칭 전하 분포에 가우스 법칙을 쓸 때 이점은?", ["대칭으로 E를 단순화", "전류 계산", "토크 계산", "역률 계산"], 0, "구대칭이면 구면에서 E가 일정해 적분이 쉬워진다.", "medium", "which_best", "apply"),

  // power-engineering 69–76
  base(69, "power-engineering", "전력공학", "동기발전기의 여자(여기) 조절이 주로 바꾸는 것은?", ["유기 기전력·전압", "회전자 저항만", "축 길이만", "냉각수 온도만"], 0, "여자전류로 자속·기전력을 조절한다.", "easy", "definition", "remember"),
  base(70, "power-engineering", "전력공학", "3상 전력에서 역률이 낮으면 일반적으로 문제가 되는 것은?", ["무효전력·손실 증가", "직류 성분", "색온도", "절연 두께"], 0, "역률 저하는 무효와 손실을 키운다.", "medium", "which_best", "understand"),
  base(71, "power-engineering", "전력공학", "송전선의 전압을 높이는 주된 이유는?", ["전류를 줄여 손실 감소", "절연 악화", "주파수 상승", "케이블 색상"], 0, "P=VIcosθ에서 고압은 송전전류를 줄여 I²R 손실을 줄인다.", "medium", "which_best", "understand"),
  base(72, "power-engineering", "전력공학", "단락용량(SCR)이 클수록 일반적으로 시스템은?", ["더 단단(전압 안정)", "더 약함", "주파수 불안", "직류화"], 0, "단락용량이 크면 전압 변동에 강하다.", "hard", "which_best", "analyze"),
  base(73, "power-engineering", "전력공학", "배전선로의 순시 전압강하에 큰 영향을 주는 것은?", ["부하 전류·역률", "케이블 색", "표지판", "습도만"], 0, "전압강하는 부하전류와 임피던스에 비례한다.", "medium", "which_best", "apply"),
  base(74, "power-engineering", "전력공학", "동기조상기(동조조상기)의 주된 용도는?", ["무효전력·전압 지원", "유효만 증가", "직류 변환만", "통신"], 0, "계통 무효를 공급·흡수해 전압을 지원한다.", "medium", "which_best", "understand"),
  base(75, "power-engineering", "전력공학", "Y-Δ 변압기 연결에서 일반적으로 얻는 이점은?", ["3차 고조파 순환 억제 등", "직류 출력", "속도 상승", "절연 제거"], 0, "Δ측이 순환 경로를 제공해 고조파 처리에 유리할 수 있다.", "hard", "which_best", "understand"),
  base(76, "power-engineering", "전력공학", "전력계통의 주파수 편차가 크면 우선 점검할 대상은?", ["발전·부하 균형", "케이블 색상", "조명 밝기만", "벽지"], 0, "유효전력 불균형이 주파수 편차를 만든다.", "medium", "scenario", "apply"),

  // electrical-machines 77–84
  base(77, "electrical-machines", "전기기기", "유도전동기의 슬립이 0이 되면 일반적으로?", ["동기속도에서 회생 불가한 일반 구동", "토크 최대", "항상 기동", "역제동만"], 0, "동기속도에서 전류가 0에 가까워져 일반 유도기는 구동 토크가 0이다.", "hard", "which_best", "analyze"),
  base(78, "electrical-machines", "전기기기", "동기전동기의 달기(달림) 특성과 가까운 설명은?", ["전압·주파수에 동기 유지", "항상 슬립 고정", "직류만", "변압기와 동일"], 0, "동기기는 회전자가 회전자계와 동기한다.", "medium", "which_best", "understand"),
  base(79, "electrical-machines", "전기기기", "직류전동기에서 전기자 전류를 늘리면 일반적으로?", ["토크 증가(자속 일정 가정)", "속도만 고정", "절연 제거", "주파수 변화"], 0, "T ∝ ΦIa로 자속 일정이면 토크는 전기자전류에 비례한다.", "medium", "which_best", "apply"),
  base(80, "electrical-machines", "전기기기", "변압기 무부하 시험에서 주로 구하는 것은?", ["무부하손·여자전류 성분", "단락전류 크기", "2차 단락만", "케이블 굵기"], 0, "무부하시험은 철손·여자전류를 본다.", "medium", "which_best", "understand"),
  base(81, "electrical-machines", "전기기기", "유도전동기 V/f 제어의 목적은?", ["자속·토크 특성 유지", "색상 조절", "접지 제거", "통신"], 0, "전압과 주파수를 비례해 자속을 일정 영역에 둔다.", "medium", "which_best", "understand"),
  base(82, "electrical-machines", "전기기기", "직류 발전기의 외부 특성 곡선이란?", ["부하전류 vs 단자전압", "속도 vs 시간만", "온도 vs 습도", "색 vs 밝기"], 0, "외부특성은 부하전류에 따른 단자전압 변화이다.", "easy", "definition", "remember"),
  base(83, "electrical-machines", "전기기기", "3상 유도전동기 단자에 가변 저항을 두는 방식은 주로?", ["왜곡전동기의 속도·토크 조절", "동기 속도 상승", "직류 변환", "절연 시험"], 0, "외부 저항은 슬립·토크 특성을 바꾼다(왜곡권선 등).", "hard", "which_best", "analyze"),
  base(84, "electrical-machines", "전기기기", "변압기 효율이 최대가 되는 조건(일반 설명)은?", ["철손≈동손", "철손=0", "동손=0만", "부하=0"], 0, "최대효율은 고정손과 가변손이 비슷할 때 근접한다.", "medium", "which_best", "understand"),

  // circuits-control 85–92
  base(85, "circuits-control", "회로·제어", "RLC 직렬 공진에서 임피던스가 최소인 경우는?", ["X_L = X_C", "R=0만", "L=0", "C=∞"], 0, "공진에서 허수부가 상쇄되어 Z≈R이 된다.", "medium", "which_best", "understand"),
  base(86, "circuits-control", "회로·제어", "연산증폭기 이상적 모델에서 입력 단자의 특성은?", ["전류 0·전위동일(가상 단락)", "전류 무한", "저항 0", "전압 무한"], 0, "이상적 OPAMP는 입력전류 0, 차동입력 0으로 본다.", "medium", "definition", "remember"),
  base(87, "circuits-control", "회로·제어", "1차 시스템의 시간정수가 크면?", ["응답이 더 느림", "더 빠름", "발산", "주파수 상승"], 0, "시간정수 τ가 크면 수렴이 느리다.", "easy", "which_best", "understand"),
  base(88, "circuits-control", "회로·제어", "폐루프 시스템에서 안정도를 판단할 때 자주 쓰는 것은?", ["극·영점·보드 선도", "색상표", "온도만", "길이만"], 0, "루트로커스·보드·나이퀴스트 등이 대표적이다.", "medium", "which_best", "understand"),
  base(89, "circuits-control", "회로·제어", "라플라스 변환의 초기값 정리에 해당하는 것은?", ["sF(s)의 극한 형태", "적분만", "미분만", "푸리에만"], 0, "초기값 정리는 lim s→∞ sF(s) 형태로 초기값과 연결한다.", "hard", "which_best", "analyze"),
  base(90, "circuits-control", "회로·제어", "PID 제어에서 적분항의 주된 역할은?", ["정상상태 오차 감소", "고주파 노이즈 증폭", "출력 제한 제거", "시간 지연 제거"], 0, "적분은 누적 오차를 줄여 정착오차를 개선한다.", "medium", "which_best", "understand"),
  base(91, "circuits-control", "회로·제어", "상태방정식 ẋ = Ax + Bu에서 행렬 A의 고유값이 의미하는 것은?", ["시스템 극(모드)", "입력 크기만", "출력 색", "전원 주파수"], 0, "A의 고유값은 자연응답 모드(극)와 연결된다.", "hard", "which_best", "analyze"),
  base(92, "circuits-control", "회로·제어", "이산 시스템에서 단위 지연 z^{-1}은 시간영역에서?", ["한 샘플 지연", "미분", "적분", "증폭"], 0, "z^{-1}은 한 스텝 지연 연산자이다.", "medium", "definition", "remember"),

  // electrical-installation 93–100
  base(93, "electrical-installation", "전기설비", "TN-S 시스템에서 중성선과 보호도체의 관계는?", ["분리(PE 별도)", "항상 동일선", "접지 없음", "직류만"], 0, "TN-S는 N과 PE를 분리해 인입 이후 별도 보호도체를 둔다.", "medium", "which_best", "understand"),
  base(94, "electrical-installation", "전기설비", "누전차단기(ELCB/RCD)의 주된 감지 대상은?", ["누설·차동전류", "과전압만", "역률만", "색상"], 0, "차동전류(누설)를 감지해 차단한다.", "easy", "definition", "remember"),
  base(95, "electrical-installation", "전기설비", "케이블 허용전류 선정 시 반드시 함께 보는 것은?", ["주변온도·취열·병렬", "색상만", "벽지 두께만", "조명 밝기"], 0, "온도·취열·설치방식에 따라 허용전류가 달라진다.", "medium", "scenario", "apply"),
  base(96, "electrical-installation", "전기설비", "분전반에서 배선용 차단기의 정격선택 시 고려할 것은?", ["부하전류·기동·협조", "색만", "길이만", "습도만"], 0, "정격전류·차단능력·기동전류·선택적 협조를 본다.", "medium", "which_best", "apply"),
  base(97, "electrical-installation", "전기설비", "접지설비의 목적으로 가장 가까운 것은?", ["고장 시 접촉전압 제한·연속성", "전압 상승", "통신 증폭", "역률 개선"], 0, "보호접지는 고장전류 경로와 접촉전압 한계에 기여한다.", "medium", "which_best", "understand"),
  base(98, "electrical-installation", "전기설비", "옥외 조명용 배선에서 방수·진입구 밀폐가 중요한 이유는?", ["침수·누설 방지", "색상 유지", "소음", "통신"], 0, "옥외는 습기·침수에 취약해 밀폐가 중요하다.", "easy", "which_best", "understand"),
  base(99, "electrical-installation", "전기설비", "비상전원 자동투입(ATS)의 목적은?", ["상용 정전 시 예비전원 전환", "역률만", "조명 밝기", "통신만"], 0, "정전 시 발전기·UPS 등으로 부하를 전환한다.", "medium", "definition", "remember"),
  base(100, "electrical-installation", "전기설비", "전기설비 기술기준 준수의 실무적 의미는?", ["안전·검사·유지보수 근거", "가격만", "디자인만", "통신만"], 0, "법·기준은 설계·시공·검사의 최소 안전 기준이다.", "easy", "definition", "remember"),
];

const existing = JSON.parse(fs.readFileSync(target, "utf8"));
if (existing.length !== 60) {
  console.error("Expected 60 existing items, got", existing.length);
  process.exit(1);
}
if (existing[existing.length - 1].id !== 60) {
  console.error("Last id should be 60");
  process.exit(1);
}
fs.writeFileSync(target, JSON.stringify([...existing, ...extra], null, 2) + "\n");
console.log("Wrote", existing.length + extra.length, "items. Max id", extra[extra.length - 1].id);
