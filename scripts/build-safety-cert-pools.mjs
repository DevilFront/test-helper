/**
 * 산업안전 산업기사 / 건설안전 산업기사·기사 창작 모의 풀 생성
 * 실행: node scripts/build-safety-cert-pools.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const INDUSTRIAL_CATS = [
  "safety-law",
  "safety-management",
  "risk-assessment",
  "industrial-health",
  "chemical-safety",
  "machinery-safety",
  "electrical-safety",
  "fire-explosion",
  "confined-space",
  "ppe",
  "psm",
  "ergonomics",
];

/** 건설안전 필기 범위(참고) — 창작 모의용 과목 키 */
const CONSTRUCTION_CATS = [
  "construction-law",
  "construction-mgmt",
  "construction-risk",
  "construction-scaffold",
  "construction-excavation",
  "construction-electrical",
  "construction-machinery",
  "construction-demolition",
  "construction-fire",
  "construction-health",
  "construction-confined",
  "construction-ppe",
];

const DIFF_CYCLE = ["easy", "easy", "medium", "medium", "hard"];

function wrongOpts(seed) {
  const pools = [
    [
      "법령·지침을 확인하지 않고 관행만 따르는 방식",
      "위험 요인을 기록하지 않고 구두로만 전달하는 방식",
      "개인의 선호만으로 보호구를 생략하는 방식",
    ],
    [
      "관계 법령·지침을 확인하지 않고 관행만 따르는 방식",
      "위험 요인을 문서화하지 않고 구두로만 전달하는 방식",
      "개인의 편의만으로 보호구를 생략하는 방식",
    ],
    [
      "관련 법령·지침을 확인하지 않고 관행만 따르는 방식",
      "위험 요인을 기록하지 않고 구두로만 전달하는 방식",
      "개인의 선호만으로 보호구를 생략하는 방식",
    ],
  ];
  return pools[seed % pools.length];
}

function rotateOptions(correct, wrongs, rot) {
  const base = [correct, ...wrongs];
  const n = base.length;
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push(base[(i + rot) % n]);
  }
  const answer = (n - rot) % n;
  return { options: out, answer };
}

function mk(cat, slot, label, topicLine, correctLead, examTag, rotKey) {
  const w = wrongOpts(rotKey + slot);
  const correct = `${correctLead} (창작 모의: ${examTag}·${label} 관점)`;
  const rot = rotKey % 4;
  const { options, answer } = rotateOptions(correct, w, rot);
  const explanation = `${topicLine} 창작 모의 문항이며, 실제 시험은 시행 공고·최신 법령·교재를 기준으로 합니다. ${label} 영역에서는 절차·기록·교육·보호구·위험성평가 등을 종합적으로 점검하는 것이 일반적입니다.`;
  return {
    category: cat,
    difficulty: DIFF_CYCLE[slot],
    question: `[창작 모의 · ${examTag}] ${topicLine} 다음 중 ${label} 관점에서 가장 적절한 것은?`,
    options,
    answer,
    explanation,
  };
}

function buildIndustrialIndustrial() {
  const rows = [];
  let id = 1;
  const tag = "산업안전 산업기사";
  const labels = {
    "safety-law": "산업안전보건법·관련 법령",
    "safety-management": "안전보건관리체계",
    "risk-assessment": "위험성평가",
    "industrial-health": "산업보건",
    "chemical-safety": "유해화학물질·MSDS",
    "machinery-safety": "기계·설비 안전",
    "electrical-safety": "전기 안전",
    "fire-explosion": "화기·화재·폭발",
    "confined-space": "밀폐공간",
    ppe: "보호구",
    psm: "PSM·중대재해 예방",
    ergonomics: "인간공학·근골격계",
  };
  const topics = {
    "safety-law": [
      "사업주의 안전·보건 확보 의무와 교육·보건조치의 관계를 고려할 때,",
      "산업재해 발생 시 신고·조사·재발방지 조치의 취지를 고려할 때,",
      "근로자·관계수급인의 안전·보건 확보에 관한 협의·조정을 고려할 때,",
      "안전·보건 관계 법령 위반에 따른 행정·형사 책임의 일반적 취지를 고려할 때,",
      "유해·위험 작업에 대한 작업허가·통제 절차의 목적을 고려할 때,",
    ],
    "safety-management": [
      "안전보건관리책임자 선임·권한과 경영층의 지원을 고려할 때,",
      "안전·보건 목표·실행계획 수립과 성과 점검을 고려할 때,",
      "도급·수급·재도급 구조에서의 안전·보건 조치 분담을 고려할 때,",
      "안전·보건 교육 계획·실시·기록 관리를 고려할 때,",
      "현장 순회점검·지적사항 조치·재점검 절차를 고려할 때,",
    ],
    "risk-assessment": [
      "위험성평가 3단계 절차와 빈도·강도 개념을 고려할 때,",
      "유해·위험 요인 식별 후 감소대책 수립·이행을 고려할 때,",
      "위험성평가 결과의 문서화·근로자 의견 수렴을 고려할 때,",
      "작업 변경·공정 변경 시 재평가 필요성을 고려할 때,",
      "중대재해처벌 등과 연계한 관리의무 이행을 고려할 때,",
    ],
    "industrial-health": [
      "작업환경 측정·관리와 건강진단·사후관리를 고려할 때,",
      "유해인자 노출 저감·국소배기·보호구 병행을 고려할 때,",
      "소음·진동·고온 등 물리적 요인 관리를 고려할 때,",
      "근골격계 유해요인 예방·작업환경 개선을 고려할 때,",
      "건강장해 발생 시 작업 전환·보건조치를 고려할 때,",
    ],
    "chemical-safety": [
      "MSDS·라벨·보관·취급 절차의 일관성을 고려할 때,",
      "화학물질 취급시설 방폭·환기·누출 대비를 고려할 때,",
      "호흡·피부 보호구 선정과 교육을 고려할 때,",
      "사고·유출 시 비상대응·폐기 절차를 고려할 때,",
      "신규 물질 도입 시 위험성 검토를 고려할 때,",
    ],
    "machinery-safety": [
      "방호장치·인터록·비상정지 등 기계 방호를 고려할 때,",
      "점검·정비 시 에너지 차단·잠금·태그 절차를 고려할 때,",
      "이동식 크레인·양중 작업의 신호·감시 체계를 고려할 때,",
      "전단·톱니 등 회전체 접촉 예방을 고려할 때,",
      "설비 이설·개조 시 재위험성평가를 고려할 때,",
    ],
    "electrical-safety": [
      "활선·접지·누전차단기 등 감전 예방을 고려할 때,",
      "전기작업 허가·숙련자 배치·절연 보호를 고려할 때,",
      "아크플래시·폭발 위험이 있는 장소의 통제를 고려할 때,",
      "임시전기·배전반 주변 정리정돈·표지를 고려할 때,",
      "정전·복전 절차와 협력사 간 역할을 고려할 때,",
    ],
    "fire-explosion": [
      "가연물·산화제 보관 분리·온도 관리를 고려할 때,",
      "화기작업 허가·가스측정·소화기 비치를 고려할 때,",
      "분진·가연성 가스의 점화원 관리를 고려할 때,",
      "소방시설 점검·피난·통로 확보를 고려할 때,",
      "폭발위험장소의 전기기기 선정·배선을 고려할 때,",
    ],
    "confined-space": [
      "산소·유해가스 농도 측정·환기를 고려할 때,",
      "출입허가·감시자·구조장비 비치를 고려할 때,",
      "밀폐공간 내 화기·용접 통제를 고려할 때,",
      "비상탈출·통신 수단 확보를 고려할 때,",
      "작업 중 조건 변화 시 즉시 중단·재평가를 고려할 때,",
    ],
    ppe: [
      "작업별 위험에 맞는 보호구 선정·착용 교육을 고려할 때,",
      "보호구 점검·폐기·교체 주기 관리를 고려할 때,",
      "호흡용 보호구 적합성·필터 종류를 고려할 때,",
      "작업자 체형·착용 불편에 대한 개선을 고려할 때,",
      "보호구 미착용 시 조치·기록을 고려할 때,",
    ],
    psm: [
      "공정안전자료·위험성 분석 갱신을 고려할 때,",
      "변경관리(MOC) 절차와 승인을 고려할 때,",
      "사고 조사·재발방지 대책 이행을 고려할 때,",
      "협력업체 안전·보건 조치 연계를 고려할 때,",
      "중대재해 예방을 위한 경영책임·실행력을 고려할 때,",
    ],
    ergonomics: [
      "반복·부담 작업의 개선·작업 높이 조정을 고려할 때,",
      "인력 취급 하중·보조장비 도입을 고려할 때,",
      "작업 자세·휴식·순환배치를 고려할 때,",
      "작업대·조명·바닥 미끄럼 방지를 고려할 때,",
      "근골격계 증상 조기 발견·보건조치를 고려할 때,",
    ],
  };

  for (let c = 0; c < INDUSTRIAL_CATS.length; c++) {
    const cat = INDUSTRIAL_CATS[c];
    const label = labels[cat];
    const lines = topics[cat];
    for (let slot = 0; slot < 5; slot++) {
      const topicLine = lines[slot];
      const correctLead = "법령·지침을 확인하고 위험을 줄이기 위한 절차·기록·교육을 이행한다";
      const qid = id;
      id += 1;
      rows.push({
        id: qid,
        ...mk(cat, slot, label, topicLine, correctLead, tag, qid),
        sourceLevel: "creative_mock",
      });
    }
  }
  return rows;
}

function buildConstructionIndustrial() {
  const examTag = "건설안전 산업기사";
  const rows = [];
  let id = 1;
  const labels = {
    "construction-law": "건설·산업안전 관련 법령",
    "construction-mgmt": "건설현장 안전보건관리",
    "construction-risk": "위험성평가(건설)",
    "construction-scaffold": "비계·거푸집·가설구조",
    "construction-excavation": "굴착·가시설·비탈면",
    "construction-electrical": "건설현장 전기·감전 예방",
    "construction-machinery": "건설기계·양중",
    "construction-demolition": "해체공사",
    "construction-fire": "화재·소방(건설)",
    "construction-health": "건설 보건",
    "construction-confined": "밀폐·동바리·지하 등 특수작업",
    "construction-ppe": "보호구(건설)",
  };
  const topics = {
    "construction-law": [
      "건설공사 안전·보건에 관한 법령 취지와 사업주·관계자의 의무를 고려할 때,",
      "도급·하도급 구조에서의 안전·보건 조치 분담을 고려할 때,",
      "작업중지·시정명령 등 행정조치와의 관계를 고려할 때,",
      "산업재해 신고·조사·재발방지와의 연계를 고려할 때,",
      "안전관리비·교육·기록의 실효성을 고려할 때,",
    ],
    "construction-mgmt": [
      "안전관리계획·보건관리계획 수립·이행을 고려할 때,",
      "합동·순회 점검과 조치·재점검을 고려할 때,",
      "TBM·작업허가·위험공법 관리를 고려할 때,",
      "신규·전입 근로자 안전보건 교육을 고려할 때,",
      "협력사·다수 업체 혼재 현장의 통제를 고려할 때,",
    ],
    "construction-risk": [
      "공정별 유해·위험 요인 식별과 감소대책을 고려할 때,",
      "작업 변경·기상·야간 작업 시 재평가를 고려할 때,",
      "위험성평가 결과의 현장 공유·서명을 고려할 때,",
      "중량물·고소 작업 등 특수 위험 통제를 고려할 때,",
      "사고 사례·유사 공정 벤치마킹을 고려할 때,",
    ],
    "construction-scaffold": [
      "비계 조립·해체 순서와 연결·고정을 고려할 때,",
      "발판·난간·통로의 하중·간격을 고려할 때,",
      "거푸집·동바리의 설계·검토·점검을 고려할 때,",
      "악천후·진동에 따른 재점검을 고려할 때,",
      "작업 발판 주변 낙하물·비계 출입 통제를 고려할 때,",
    ],
    "construction-excavation": [
      "굴착면 안정·비탈면 배수·가시설을 고려할 때,",
      "인접 구조물·지하매설물 조사·침하 대응을 고려할 때,",
      "질식·붕괴 위험이 있는 굴착의 환기·감시를 고려할 때,",
      "토류판·스트럿 등 지보재 설치·점검을 고려할 때,",
      "복토·정지 작업의 순서·신호 체계를 고려할 때,",
    ],
    "construction-electrical": [
      "가설전기·분전반·누전차단기 설치·점검을 고려할 때,",
      "활선 근접·감전 위험 구역 통제를 고려할 때,",
      "용접·절단 시 화재·화상 동반 위험을 고려할 때,",
      "습윤·금속 구조물 환경에서의 절연·접지를 고려할 때,",
      "정전·복전 시 협력사 간 확인 절차를 고려할 때,",
    ],
    "construction-machinery": [
      "크레인·지게차 등 기계의 안전장치·하중표를 고려할 때,",
      "양중 계획·신호수·반경 통제를 고려할 때,",
      "기계 점검·정비 시 에너지 차단·잠금을 고려할 때,",
      "경사지·연약지반에서의 이동·세우기를 고려할 때,",
      "불법 개조·무면허 조작 방지를 고려할 때,",
    ],
    "construction-demolition": [
      "해체 순서·붕괴선·낙하 영역 통제를 고려할 때,",
      "석면·유해 분진 노출 저감을 고려할 때,",
      "인접 건물·도로에 대한 보호·감시를 고려할 때,",
      "철근·콘크리트 파쇄 시 비산·낙하를 고려할 때,",
      "비상대피·통신·소화기 비치를 고려할 때,",
    ],
    "construction-fire": [
      "용접·화기작업 허가·소화기·감시자를 고려할 때,",
      "가연자재·도장재 보관·환기를 고려할 때,",
      "임시 난방·가스 사용의 환기·누출 점검을 고려할 때,",
      "피난로·소화전·비상구 표지를 고려할 때,",
      "현장 화재 대응 훈련·연락망을 고려할 때,",
    ],
    "construction-health": [
      "고온·한랭·먼지·소음 등 작업환경 관리를 고려할 때,",
      "휴게·수분·그늘 시설을 고려할 때,",
      "유해 분진·흄에 대한 국소배기·보호구를 고려할 때,",
      "건강진단·작업 배치 전환을 고려할 때,",
      "감염·위생·세척 시설을 고려할 때,",
    ],
    "construction-confined": [
      "밀폐공간·지하 연결부의 가스측정·환기를 고려할 때,",
      "동바리·거푸집 내부 작업의 붕괴·낙하를 고려할 때,",
      "출입허가·감시·구조대기를 고려할 때,",
      "좁은 공간에서의 운반·자세·통로를 고려할 때,",
      "조건 악화 시 즉시 철수·재평가를 고려할 때,",
    ],
    "construction-ppe": [
      "추락·낙하물에 대한 안전모·안전화를 고려할 때,",
      "분진·스패터에 대한 보안경·보호복을 고려할 때,",
      "안전대·라이프라인·추락방망 설치와 연계를 고려할 때,",
      "보호구 착용 점검·미착용 시 조치를 고려할 때,",
      "작업별 보호구 선정표·교육을 고려할 때,",
    ],
  };

  for (let c = 0; c < CONSTRUCTION_CATS.length; c++) {
    const cat = CONSTRUCTION_CATS[c];
    const label = labels[cat];
    const lines = topics[cat];
    for (let slot = 0; slot < 5; slot++) {
      const topicLine = lines[slot];
      const correctLead =
        "건설현장 안전·보건 절차를 확인하고 위험을 줄이기 위한 조치·기록·교육을 이행한다";
      const qid = id;
      id += 1;
      rows.push({
        id: qid,
        ...mk(cat, slot, label, topicLine, correctLead, examTag, qid),
        sourceLevel: "creative_mock",
      });
    }
  }
  return rows;
}

function buildConstructionEngineer() {
  const examTag = "건설안전기사";
  const rows = [];
  let id = 1;
  const labels = {
    "construction-law": "건설·산업안전 관련 법령",
    "construction-mgmt": "건설현장 안전보건관리",
    "construction-risk": "위험성평가(건설)",
    "construction-scaffold": "비계·거푸집·가설구조",
    "construction-excavation": "굴착·가시설·비탈면",
    "construction-electrical": "건설현장 전기·감전 예방",
    "construction-machinery": "건설기계·양중",
    "construction-demolition": "해체공사",
    "construction-fire": "화재·소방(건설)",
    "construction-health": "건설 보건",
    "construction-confined": "밀폐·동바리·지하 등 특수작업",
    "construction-ppe": "보호구(건설)",
  };
  const topics = {
    "construction-law": [
      "건설공사 안전·보건 관련 법령의 적용 범위와 책임 구조를 종합적으로 고려할 때,",
      "도급·연속도급·하도급에서 안전·보건 조치의 실효 확보를 고려할 때,",
      "행정조치·시정명령·작업중지와의 연계를 고려할 때,",
      "산업재해 조사·재발방지 대책 수립·이행을 고려할 때,",
      "안전관리비 집행·교육·기록의 감사 가능성을 고려할 때,",
    ],
    "construction-mgmt": [
      "안전·보건 관리계획의 목표·지표·점검 주기를 고려할 때,",
      "합동 점검에서 지적사항의 조치·이행 확인·보고를 고려할 때,",
      "위험공법·작업허가·TBM의 연계와 기록을 고려할 때,",
      "전입·전배 근로자에 대한 보충 교육을 고려할 때,",
      "다층 하도급·동시 작업의 충돌 방지를 고려할 때,",
    ],
    "construction-risk": [
      "공정·공법 변경에 따른 위험성평가 갱신을 고려할 때,",
      "야간·휴일·악천후 작업의 추가 위험을 고려할 때,",
      "위험성평가 결과의 계층적 통제(제거·대체·관리)를 고려할 때,",
      "중량물·고소·전기 작업 등 특수 위험의 통제를 고려할 때,",
      "유사 사고 사례에 따른 조치 반영을 고려할 때,",
    ],
    "construction-scaffold": [
      "비계·거푸집의 구조 검토·조립도·하중 경로를 고려할 때,",
      "발판·난간·토우의 규격·간격·고정을 고려할 때,",
      "동바리·슬래브 거푸집의 좌굴·전도 방지를 고려할 때,",
      "강풍·지진·진동 후 안전 확인을 고려할 때,",
      "낙하물 방지망·출입 통제·작업 동선을 고려할 때,",
    ],
    "construction-excavation": [
      "지반 조사·지보 설계와 시공의 일치를 고려할 때,",
      "인접 건물·옹벽·지하시설물에 대한 변형·침하 모니터링을 고려할 때,",
      "가스·산소 결핍 등 밀폐·준밀폐 굴착의 환기를 고려할 때,",
      "지보재·앵커·스트럿의 순서·체결 토크를 고려할 때,",
      "굴착·복토 시 신호·통신·대피 경로를 고려할 때,",
    ],
    "construction-electrical": [
      "가설 배전·누전차단기·접지·등전위 본딩을 고려할 때,",
      "한전 측 정전·복전 협의와 현장 확인을 고려할 때,",
      "아크플래시·감전 위험 구역의 출입 통제를 고려할 때,",
      "습기·금속·좁은 공간에서의 절연·거리 확보를 고려할 때,",
      "용접기·케이블·플러그의 정비·점검을 고려할 때,",
    ],
    "construction-machinery": [
      "양중 계획서·하중·반경·지반 지지력을 고려할 때,",
      "신호 체계·유도자·비상정지·아웃리거를 고려할 때,",
      "LOTO 등 에너지 차단·잠금·태그를 고려할 때,",
      "경사·연약지반에서의 아웃리거·패드·깔판을 고려할 때,",
      "기사·신호수 자격·음주·점검일지를 고려할 때,",
    ],
    "construction-demolition": [
      "해체 순서·잔류 구조 안정·붕괴선 설정을 고려할 때,",
      "석면·유해 분진의 포집·보호구·폐기를 고려할 때,",
      "인접 도로·보행자·가설울타리·방호망을 고려할 때,",
      "절단·파쇄 시 비산·소음·진동을 고려할 때,",
      "비상 대피·소방·구조 연락 체계를 고려할 때,",
    ],
    "construction-fire": [
      "화기작업 허가·가스측정·소화전·감시자 배치를 고려할 때,",
      "가연성 도료·용제·자재의 보관·취급량을 고려할 때,",
      "임시 배관·가스 누출 점검·환기를 고려할 때,",
      "피난·소화·경보·유도등의 가시성을 고려할 때,",
      "현장 합동 화재 대응 훈련·역할 분담을 고려할 때,",
    ],
    "construction-health": [
      "WBGT·한랭·분진·소음 등 측정·관리 기준을 고려할 때,",
      "휴게실·냉·온·수분 공급·작업 순환을 고려할 때,",
      "국소배기·제진·호흡 보호의 병행을 고려할 때,",
      "직무 스트레스·근골격계 유해요인을 고려할 때,",
      "감염·위생·세척·폐기물 분리를 고려할 때,",
    ],
    "construction-confined": [
      "산소·유해가스·폭발 한계 측정과 환기 설계를 고려할 때,",
      "동바리·터널·맨홀 등 붕괴·침수·가스 위험을 고려할 때,",
      "감시자·통신·구조 장비·구출 절차를 고려할 때,",
      "협소 공간 인원 제한·작업 시간·체크인을 고려할 때,",
      "조건 변화 시 작업 중지·재평가·철수를 고려할 때,",
    ],
    "construction-ppe": [
      "추락·낙하·밟힘에 대한 안전모·안전화·심마대를 고려할 때,",
      "용접·분진·화학에 대한 보안경·보호복·호흡 보호를 고려할 때,",
      "안전대·라이프라인·앵커의 설치·검사를 고려할 때,",
      "보호구 지급·착용 점검·미착용 시 조치를 고려할 때,",
      "작업별 보호구 선정 근거·교육 기록을 고려할 때,",
    ],
  };

  for (let c = 0; c < CONSTRUCTION_CATS.length; c++) {
    const cat = CONSTRUCTION_CATS[c];
    const label = labels[cat];
    const lines = topics[cat];
    for (let slot = 0; slot < 5; slot++) {
      const topicLine = lines[slot];
      const correctLead =
        "건설현장 안전·보건 관련 법령·지침을 확인하고 위험을 줄이기 위한 기술적·관리적 조치·기록·교육을 이행한다";
      const qid = id;
      id += 1;
      rows.push({
        id: qid,
        ...mk(cat, slot, label, topicLine, correctLead, examTag, qid + 400),
        sourceLevel: "creative_mock",
      });
    }
  }
  return rows;
}

function writeJson(rel, data) {
  const fp = path.join(root, rel);
  fs.writeFileSync(fp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log("OK", rel, data.length);
}

writeJson(
  "data/industrial-safety-industrial-questions.json",
  buildIndustrialIndustrial(),
);
writeJson(
  "data/construction-safety-industrial-questions.json",
  buildConstructionIndustrial(),
);
writeJson(
  "data/construction-safety-engineer-questions.json",
  buildConstructionEngineer(),
);
