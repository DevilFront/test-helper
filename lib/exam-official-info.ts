import type { ExamSlug } from "./exam-registry";

export type ExamOfficialInfo = {
  title: string;
  shortTitle: string;
  /** 필기/실기 등 */
  examPhaseLabel: string;
  intro: string;
  noticeLinks: { label: string; href: string }[];
  /** 과목 비율·구성 안내 (정성 서술) */
  subjectRatioSections: { heading: string; body: string }[];
  disclaimer: string;
};

export function getExamOfficialInfo(slug: ExamSlug): ExamOfficialInfo | null {
  switch (slug) {
    case "info-processing":
      return {
        shortTitle: "정보처리기사",
        title: "정보처리기사 시험 안내",
        examPhaseLabel: "필기(참고)",
        intro:
          "아래 비율·과목명은 일반적인 안내이며, 실제 출제 과목·문항 수·배점은 시행(회차)마다 공고에 따라 달라질 수 있습니다. 응시 전 반드시 최신 공고를 확인하세요.",
        noticeLinks: [
          {
            label: "큐넷(한국산업인력공단)",
            href: "https://www.q-net.or.kr/",
          },
          {
            label: "시험일정·자격 검색",
            href: "https://www.q-net.or.kr/cst005.do?id=cst005",
          },
        ],
        subjectRatioSections: [
          {
            heading: "필기 시험 구성(참고)",
            body:
              "통상 필기는 여러 과목 영역으로 구성되며, 데이터베이스·운영체제·네트워크·소프트웨어 공학·정보시스템·보안 등의 범위가 포함될 수 있습니다. 정확한 과목명·문항 수·출제 비율은 해당 시행의 시험 공고와 출제 기준을 따릅니다.",
          },
          {
            heading: "이 앱의 모의고사와의 관계",
            body:
              "본 서비스 문항은 학습용 창작·참고 문항이며 기출문항이 아닙니다. 난이도·형식은 실전에 가깝게 두었을 뿐, 실제 시험과 동일하지 않습니다.",
          },
        ],
        disclaimer:
          "공고 URL·시험 체계는 개정·사이트 개편 등으로 바뀔 수 있습니다. 합격·응시 요건은 항상 공식 공고와 큐넷 안내를 기준으로 하세요.",
      };
    case "electrical-engineer":
      return {
        shortTitle: "전기기사",
        title: "전기기사 시험 안내",
        examPhaseLabel: "필기(참고)",
        intro:
          "전기기사 필기는 전기자기학·전력공학·전기기기·회로이론 및 제어공학·전기설비 등의 범위로 알려져 있으나, 과목명·문항 수·출제 비율은 시행(회차)마다 공고와 출제 기준에 따라 달라질 수 있습니다.",
        noticeLinks: [
          {
            label: "큐넷(한국산업인력공단)",
            href: "https://www.q-net.or.kr/",
          },
          {
            label: "시험일정·자격 검색",
            href: "https://www.q-net.or.kr/cst005.do?id=cst005",
          },
        ],
        subjectRatioSections: [
          {
            heading: "필기 시험 구성(참고)",
            body:
              "통상 전기자기학, 전력공학, 전기기기, 회로이론 및 제어공학, 전기설비 등의 영역이 필기 출제 범위에 포함될 수 있습니다. 정확한 과목·비율은 해당 시행의 시험 공고를 따릅니다.",
          },
          {
            heading: "이 앱의 모의고사와의 관계",
            body:
              "본 서비스 문항은 학습용 창작·참고 문항이며 기출문항이 아닙니다. 법령·기준·개정은 공식 자료와 교재로 확인하세요.",
          },
        ],
        disclaimer:
          "자격 제도·시험 과목은 개정될 수 있습니다. 응시·합격 기준은 공식 공고를 기준으로 하세요.",
      };
    case "electrical-craftsman":
      return {
        shortTitle: "전기기능사",
        title: "전기기능사 시험 안내",
        examPhaseLabel: "필기(참고)",
        intro:
          "전기기능사 필기는 전기자기학·전력공학·전기기기·회로이론 및 제어공학·전기설비 등의 범위로 알려져 있으나, 과목명·문항 수·출제 비율은 시행(회차)마다 공고와 출제 기준에 따라 달라질 수 있습니다. 전기기사와 난이도·과목 구성이 다를 수 있습니다.",
        noticeLinks: [
          {
            label: "큐넷(한국산업인력공단)",
            href: "https://www.q-net.or.kr/",
          },
          {
            label: "시험일정·자격 검색",
            href: "https://www.q-net.or.kr/cst005.do?id=cst005",
          },
        ],
        subjectRatioSections: [
          {
            heading: "필기 시험 구성(참고)",
            body:
              "통상 전기자기학, 전력공학, 전기기기, 회로이론 및 제어공학, 전기설비 등의 영역이 필기 출제 범위에 포함될 수 있습니다. 정확한 과목·비율은 해당 시행의 시험 공고를 따릅니다.",
          },
          {
            heading: "이 앱의 모의고사와의 관계",
            body:
              "본 서비스 문항은 학습용 창작·참고 문항이며 기출문항이 아닙니다. 법령·기준·개정은 공식 자료와 교재로 확인하세요.",
          },
        ],
        disclaimer:
          "자격 제도·시험 과목은 개정될 수 있습니다. 응시·합격 기준은 공식 공고를 기준으로 하세요.",
      };
    case "sqld":
      return {
        shortTitle: "SQLD",
        title: "SQL 개발자(SQLD) 시험 안내",
        examPhaseLabel: "필기(참고)",
        intro:
          "SQL 개발자(SQLD)는 한국데이터산업진흥원 등에서 시행하는 데이터 자격 검정으로, 과목명·문항 수·배점은 시행(회차)마다 공고에 따라 달라질 수 있습니다. 응시 전 최신 공고를 확인하세요.",
        noticeLinks: [
          {
            label: "데이터자격증(한국데이터산업진흥원)",
            href: "https://www.dataq.or.kr/",
          },
        ],
        subjectRatioSections: [
          {
            heading: "필기 시험 구성(참고)",
            body:
              "통상 데이터 모델링, SQL 기본·활용, SQL 응용·최적화, 트랜잭션·권한 등 데이터베이스·SQL 영역이 출제 범위에 포함될 수 있습니다. 정확한 과목·비율은 해당 시행 공고를 따릅니다.",
          },
          {
            heading: "이 앱의 모의고사와의 관계",
            body:
              "본 서비스 문항은 학습용 창작·참고 문항이며 기출문항이 아닙니다. DBMS·문법 세부는 제품·버전에 따라 다를 수 있으니 공식 교재와 병행하세요.",
          },
        ],
        disclaimer:
          "시험 공고·자격 체계는 개정·사이트 개편 등으로 바뀔 수 있습니다. 합격·응시 요건은 항상 공식 공고를 기준으로 하세요.",
      };
    case "industrial-safety":
      return {
        shortTitle: "산업안전기사",
        title: "산업안전기사 시험 안내",
        examPhaseLabel: "필기(참고)",
        intro:
          "산업안전 관련 법령·관리·보건·기계·전기 등 필기 범위는 시행별 공고와 출제 기준에 따릅니다. 아래는 이해를 돕는 개괄이며, 비율·과목명은 최신 공고로 확인해야 합니다.",
        noticeLinks: [
          {
            label: "큐넷(한국산업인력공단)",
            href: "https://www.q-net.or.kr/",
          },
          {
            label: "시험일정·자격 검색",
            href: "https://www.q-net.or.kr/cst005.do?id=cst005",
          },
        ],
        subjectRatioSections: [
          {
            heading: "필기 영역(참고)",
            body:
              "통상 산업안전보건법·안전보건관리·위험성평가·산업보건·기계·전기·화학·PSM 등 안전·보건 분야가 출제 범위에 포함될 수 있습니다. 세부 과목·문항 배분은 시행 공고를 따릅니다.",
          },
          {
            heading: "이 앱의 모의고사와의 관계",
            body:
              "문항은 학습용이며 실제 기출이 아닙니다. 법령 개정·출제 경향은 공식 자료와 교재로 보완하세요.",
          },
        ],
        disclaimer:
          "자격 제도·시험 과목은 개정될 수 있습니다. 응시·합격 기준은 공식 공고를 기준으로 하세요.",
      };
    case "industrial-safety-industrial":
      return {
        shortTitle: "산업안전 산업기사",
        title: "산업안전 산업기사 시험 안내",
        examPhaseLabel: "필기(참고)",
        intro:
          "산업안전 산업기사 필기는 법령·안전보건관리·위험성평가·보건·기계·전기 등 안전·보건 분야를 다룹니다. 과목명·비율·문항 수는 시행 공고를 따릅니다.",
        noticeLinks: [
          {
            label: "큐넷(한국산업인력공단)",
            href: "https://www.q-net.or.kr/",
          },
          {
            label: "시험일정·자격 검색",
            href: "https://www.q-net.or.kr/cst005.do?id=cst005",
          },
        ],
        subjectRatioSections: [
          {
            heading: "필기 영역(참고)",
            body:
              "통상 산업안전보건법·안전보건관리·위험성평가·산업보건·기계·전기·화학·PSM 등이 출제 범위에 포함될 수 있습니다. 기사·산업기사 간 과목 구성·난이도는 공고와 출제 기준을 확인하세요.",
          },
          {
            heading: "이 앱의 모의고사와의 관계",
            body:
              "문항은 학습용 창작 모의이며 기출이 아닙니다. 최신 공고·교재와 병행하세요.",
          },
        ],
        disclaimer:
          "자격 제도·시험 과목은 개정될 수 있습니다. 응시·합격 기준은 공식 공고를 기준으로 하세요.",
      };
    case "construction-safety-industrial":
      return {
        shortTitle: "건설안전 산업기사",
        title: "건설안전 산업기사 시험 안내",
        examPhaseLabel: "필기(참고)",
        intro:
          "건설안전 산업기사 필기는 건설·산업안전 관련 법령, 현장 안전보건관리, 위험성평가, 비계·굴착·전기·기계·해체·화재·보건 등 건설 현장 안전·보건을 다룹니다. 과목·비율은 시행 공고를 따릅니다.",
        noticeLinks: [
          {
            label: "큐넷(한국산업인력공단)",
            href: "https://www.q-net.or.kr/",
          },
          {
            label: "시험일정·자격 검색",
            href: "https://www.q-net.or.kr/cst005.do?id=cst005",
          },
        ],
        subjectRatioSections: [
          {
            heading: "필기 영역(참고)",
            body:
              "통상 건설공사 안전·보건에 관한 법령, 현장 안전관리계획·위험성평가, 비계·굴착·전기·건설기계·해체·화재·보건·보호구 등이 출제 범위에 포함될 수 있습니다.",
          },
          {
            heading: "이 앱의 모의고사와의 관계",
            body:
              "문항은 학습용 창작 모의이며 기출이 아닙니다. 공식 출제 기준·교재를 함께 확인하세요.",
          },
        ],
        disclaimer:
          "자격 제도·시험 과목은 개정될 수 있습니다. 응시·합격 기준은 공식 공고를 기준으로 하세요.",
      };
    case "construction-safety-engineer":
      return {
        shortTitle: "건설안전기사",
        title: "건설안전기사 시험 안내",
        examPhaseLabel: "필기(참고)",
        intro:
          "건설안전기사 필기는 건설 현장의 안전·보건 확보를 위한 법령·관리·기술적 판단을 다룹니다. 과목·비율·문항 수는 시행 공고를 따릅니다.",
        noticeLinks: [
          {
            label: "큐넷(한국산업인력공단)",
            href: "https://www.q-net.or.kr/",
          },
          {
            label: "시험일정·자격 검색",
            href: "https://www.q-net.or.kr/cst005.do?id=cst005",
          },
        ],
        subjectRatioSections: [
          {
            heading: "필기 영역(참고)",
            body:
              "통상 건설·산업안전 관련 법령, 안전보건관리체계, 위험성평가, 비계·굴착·전기·건설기계·해체·화재·보건·보호구 등이 출제 범위에 포함될 수 있습니다. 산업기사·기사 간 과목 구성은 공고를 확인하세요.",
          },
          {
            heading: "이 앱의 모의고사와의 관계",
            body:
              "문항은 학습용 창작 모의이며 기출이 아닙니다. 최신 공고·교재와 병행하세요.",
          },
        ],
        disclaimer:
          "자격 제도·시험 과목은 개정될 수 있습니다. 응시·합격 기준은 공식 공고를 기준으로 하세요.",
      };
    default:
      return null;
  }
}
