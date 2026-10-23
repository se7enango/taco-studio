/**
 * 사이트의 모든 문구와 약속은 이 파일 하나에서 관리합니다.
 * 페이지, 메타데이터, JSON-LD, 문의 알림이 모두 여기서 값을 읽으므로
 * "당일 vs 24시간", "14일 vs 평균 14일" 같은 불일치가 다시 생기지 않습니다.
 *
 * `// OWNER-CONFIRM` 표시가 붙은 문장은 기존 사이트의 주장을 풀어 쓴 것입니다.
 * 출시 전에 사실인지 확인하고, 사실이 아니면 삭제해 주세요.
 */

import type { InquirySource, InquiryType } from "@/lib/contact/schema";

/* -------------------------------------------------------------------------- */
/* 기본 정보                                                                    */
/* -------------------------------------------------------------------------- */

export const SITE = {
  name: "Taco Studio",
  domain: "taco-studio.ai",
  url: "https://taco-studio.ai",
  tagline: "폐쇄망 온프레미스 AI 구축 · 맞춤 소프트웨어·AI 개발",
  /** 회신 약속. 당일 회신을 보장할 수 있다면 이 값 하나만 바꾸면 됩니다. */
  replyPromise: "영업일 기준 24시간 이내", // OWNER-CONFIRM
  deliveryAvg: "평균 14일",
  /** 공개 문의 이메일. 값을 넣으면 문의 섹션·오류 안내·JSON-LD에 표시됩니다. */
  contactEmail: undefined as string | undefined,
  /** 사업자 정보. 입력된 항목만 푸터에 표시됩니다. */
  business: {
    상호: undefined,
    대표자: undefined,
    사업자등록번호: undefined,
    주소: undefined,
  } as Record<"상호" | "대표자" | "사업자등록번호" | "주소", string | undefined>,
  /** 검색 엔진 소유 확인 코드. 값이 있을 때만 메타 태그를 출력합니다. */
  verification: {
    google: undefined as string | undefined,
    naver: undefined as string | undefined,
  },
  copyrightYear: 2026,
} as const;

export const HEADLINE = ["우리는 소프트웨어와 인공지능을", "정직하게 그리고 확실하게 만듭니다."] as const;

export const META = {
  title: "폐쇄망 온프레미스 AI 구축 · 맞춤 소프트웨어 개발 | Taco Studio",
  description: `인터넷이 차단된 사내망에서만 동작하는 로컬 LLM과 사내 문서 검색 포털을 ${SITE.deliveryAvg} 만에 구축합니다. 맞춤 소프트웨어·AI 개발은 전담 엔지니어가 직접 맡습니다. 고정 견적 계약, ${SITE.replyPromise} 엔지니어 회신.`,
  ogDescription: `사내망 안에서만 동작하는 로컬 LLM과 사내 문서 검색 포털을 ${SITE.deliveryAvg} 만에 구축합니다. 고정 견적, 엔지니어 직접 회신.`,
  keywords: [
    "온프레미스 AI",
    "폐쇄망 AI",
    "망분리 AI",
    "폐쇄망 LLM",
    "로컬 LLM 구축",
    "사내 AI 구축",
    "사내 문서 검색",
    "RAG 구축",
    "사내 챗봇",
    "AI 외주 개발",
    "소프트웨어 외주 개발",
    "FDE",
    "Taco Studio",
  ],
};

/* -------------------------------------------------------------------------- */
/* 내비게이션 · CTA                                                             */
/* -------------------------------------------------------------------------- */

export const NAV = [
  { href: "#services", label: "서비스" },
  { href: "#process", label: "진행 과정" },
  { href: "#security", label: "보안" },
  { href: "#faq", label: "자주 묻는 질문" },
] as const;

/** 각 CTA의 위치. 문의 알림에 '진입 경로'로 함께 전달됩니다. */
export const CTA_SOURCES: Record<InquirySource, string> = {
  header: "상단 메뉴",
  hero: "첫 화면",
  barriers: "세 가지 장벽",
  "service-onprem": "서비스 A 카드",
  "service-custom": "서비스 B 카드",
  "services-undecided": "서비스 하단",
  process: "진행 과정",
  faq: "자주 묻는 질문",
  link: "공유 링크(?type=)",
  direct: "직접 접근",
};

/* -------------------------------------------------------------------------- */
/* 섹션 콘텐츠                                                                  */
/* -------------------------------------------------------------------------- */

export const HERO = {
  label: SITE.tagline,
  summary: `외부 인터넷과 분리된 사내망에 로컬 LLM과 사내 문서 검색 포털을 ${SITE.deliveryAvg} 만에 구축합니다. 맞춤 소프트웨어·AI 개발은 고객 현장에 들어가는 전담 엔지니어가 직접 맡습니다.`,
  primaryCta: "상담 요청하기",
  secondaryCta: "서비스 살펴보기",
  reassurance: `${SITE.replyPromise}에 실무 엔지니어가 직접 회신합니다.`,
};

export const ABOUT = {
  eyebrow: "What we do",
  title: "사내망 안에서 돌아가는 AI를 만들고, 필요한 소프트웨어를 직접 개발합니다.",
  lead: "보안 규정 때문에 외부 AI를 쓸 수 없는 조직, 장비는 갖췄지만 현업에 정착시킬 엔지니어가 없는 조직, 만들고 싶은 것은 분명한데 맡길 개발팀이 없는 조직. Taco Studio는 이런 조직의 현장으로 직접 들어갑니다. 설치로 끝내지 않고, 직원들이 바로 쓸 수 있는 상태로 만들어 넘겨 드립니다.",
  stats: [
    { prefix: "", value: "100%", term: "폐쇄망 자립 구동", description: "외부 인터넷 연결 없이 사내망 안에서만 동작합니다" },
    { prefix: "평균", value: "14일", term: "턴키 구축 기간", description: "정확한 일정은 사전 점검 후 견적서에 적어 드립니다" },
    { prefix: "", value: "고정 견적", term: "온프레미스 구축 계약 방식", description: "확정된 범위 안에서는 금액이 바뀌지 않습니다" },
    { prefix: "", value: "24시간", term: "엔지니어 직접 회신", description: "영업일 기준이며, 영업 담당자를 거치지 않습니다" }, // OWNER-CONFIRM
  ],
};

export const BARRIERS = {
  eyebrow: "01 / Barriers",
  title: "우리가 해결하는 세 가지 장벽",
  items: [
    {
      code: "01 / Privacy trap",
      label: "데이터 보안",
      title: "기밀 자료는 외부 AI에 넣을 수 없습니다",
      problem:
        "ChatGPT 같은 클라우드 AI는 편리하지만, 설계 도면·회계 자료·인사 평가·미공개 소스코드처럼 사외 반출이 금지된 자료는 보안 규정상 입력할 수 없는 경우가 대부분입니다.",
      solution:
        "인터넷이 전혀 닿지 않는 사내망 안에서 100% 자립 구동되는 로컬 LLM 환경을 구축합니다. 질문도, 문서도, 답변도 사내망 밖으로 나가지 않습니다.",
    },
    {
      code: "02 / Hardware waste",
      label: "장비 활용",
      title: "장비를 들여도 현업에서 쓰지 못합니다",
      problem: "다룰 엔지니어가 없는 조직에서는 수천만 원대 GPU 서버도 서버실에 머물 뿐입니다.",
      solution:
        "하드웨어 설치에서 끝내지 않습니다. 직원 누구나 브라우저만 열면 사내 문서를 찾고 보고서 초안을 쓸 수 있는 웹 포털까지 완성해 인계합니다.",
    },
    {
      code: "03 / Talent gap",
      label: "인력 확보",
      title: "AI 엔지니어 채용은 느리고 비쌉니다",
      problem: "AI 팀을 직접 꾸리려면 채용에만 수개월이 걸리고, 그 뒤로는 고정 인건비가 계속 나갑니다.",
      solution:
        "Taco Studio의 FDE(Forward Deployed Engineer, 현장 투입형 엔지니어)가 필요한 기간에 필요한 범위만큼 프로젝트 단위로 합류해 직접 설계하고 구현합니다.",
    },
  ],
  cta: "우리 조직에도 해당되는지 궁금하시다면, 상황만 간단히 남겨 주세요",
};

export type ServiceCard = {
  id: Exclude<InquiryType, "undecided">;
  code: string;
  title: string;
  summary: string;
  fitTitle: string;
  fit: string[];
  scopeTitle: string;
  scope: string[];
  terms: { term: string; value: string }[];
  cta: string;
};

export const SERVICES = {
  eyebrow: "02 / Services",
  title: "필요에 따라 두 가지 방식으로 일합니다",
  lead: "어느 쪽이든 실무 엔지니어가 상담부터 구현까지 직접 맡습니다.",
  cards: [
    {
      id: "onprem",
      code: "A / On-premise AI",
      title: "폐쇄망 온프레미스 AI 구축",
      summary: "외부 인터넷 없이 사내망 안에서만 돌아가는 AI 환경을, 장비 선정부터 사내 포털까지 한 번에 납품합니다.",
      fitTitle: "이런 조직에 맞습니다",
      fit: [
        "망분리나 보안 규정 때문에 외부 AI 서비스를 쓸 수 없는 조직",
        "사규·업무 매뉴얼·보고서 같은 사내 문서를 AI로 찾고 활용하고 싶은 조직",
        "GPU 서버를 이미 들였거나 도입을 검토 중인 조직",
      ],
      scopeTitle: "포함 범위",
      scope: [
        "사용 인원과 업무에 맞는 서버 사양 제안과 구매 지원",
        "현장 OS·로컬 LLM 설치와 최적화",
        "사내 문서 검색(RAG) 웹 포털 구축",
        "컴파일된 바이너리 형태로 설치 — 장비 안에 소스코드를 남기지 않습니다",
        "사용 방법 안내와 운영 담당자 인계", // OWNER-CONFIRM
      ],
      terms: [
        { term: "기간", value: SITE.deliveryAvg },
        { term: "계약", value: "고정 견적 · 턴키 납품" },
        { term: "소스코드", value: "미포함 (컴파일된 바이너리로 설치)" },
        { term: "장비", value: "고객사 구매 · 사양 제안과 구매 지원" }, // OWNER-CONFIRM
      ],
      cta: "온프레미스 AI 구축 상담 요청",
    },
    {
      id: "custom",
      code: "B / Forward deployed engineering",
      title: "맞춤 소프트웨어·AI 개발",
      summary: "만들고 싶은 것은 분명한데 맡길 개발팀이 없을 때, 전담 엔지니어가 요구사항 정리부터 배포까지 직접 구현합니다.",
      fitTitle: "이런 조직에 맞습니다",
      fit: [
        "흩어진 사내 데이터를 모으고 정리할 파이프라인이 필요한 조직",
        "사내 AI 챗봇이나 업무 자동화 에이전트를 만들고 싶은 조직",
        "새 웹 서비스나 앱을 처음부터 개발해야 하는 조직",
      ],
      scopeTitle: "진행 방식",
      scope: [
        "요구사항 명세를 함께 작성하며 시작",
        "스프린트 단위 개발, 스프린트마다 동작하는 결과물 공유",
        "배포까지 전담 FDE가 직접 구현",
        "소스코드를 포함한 개발 산출물 100% 인계", // OWNER-CONFIRM
      ],
      terms: [
        { term: "기간", value: "범위에 따라 협의 (스프린트 단위)" },
        { term: "계약", value: "스프린트 기반 납품" },
        { term: "소스코드", value: "포함 (산출물 100% 인계)" }, // OWNER-CONFIRM
        { term: "장비", value: "고객사 기존 환경 또는 협의한 환경" },
      ],
      cta: "맞춤 개발 상담 요청",
    },
  ] satisfies ServiceCard[],
  undecided: "어느 쪽인지 정하지 않으셔도 됩니다. 상황을 알려 주시면 맞는 방식을 함께 정합니다.",
  undecidedCta: "상담 요청",
};

export type ProcessStep = {
  title: string;
  body?: string;
  tracks?: { onprem: string; custom: string };
  badge?: string;
};

export const PROCESS = {
  eyebrow: "03 / Process",
  title: "문의부터 인계까지, 이렇게 진행됩니다",
  lead: "어느 방식이든 아래 순서로 진행합니다. 계약 금액은 3단계에서 확정됩니다.",
  trackLabels: { onprem: "A 온프레미스", custom: "B 맞춤 개발" },
  steps: [
    {
      title: "상담 요청",
      body: "아래 양식으로 검토 중인 과제를 알려 주세요. 기밀 정보는 적지 않으셔도 됩니다.",
    },
    {
      title: "엔지니어 회신과 사전 점검",
      body: `${SITE.replyPromise}에 실무 엔지니어가 직접 회신합니다. 이어서 보안 정책, 망 구성, 사용 인원, 대상 문서나 개발 요구사항을 함께 확인합니다. 상세 자료가 필요하면 그 전에 NDA를 먼저 체결합니다.`,
    },
    {
      title: "범위 확정과 견적",
      body: "작업 범위, 산출물, 일정을 문서로 정리해 견적을 드립니다.",
      tracks: {
        onprem: "온프레미스 AI 구축은 고정 견적으로 계약하며, 확정된 범위 안에서는 금액이 바뀌지 않습니다.",
        custom: "맞춤 개발은 범위를 스프린트 단위로 나눠 일정과 견적을 제안합니다.",
      },
    },
    {
      title: "구축·개발",
      badge: SITE.deliveryAvg,
      tracks: {
        onprem: "엔지니어가 현장에 들어가 서버 OS와 로컬 LLM을 설치하고, 사내 문서를 연결한 검색 포털을 구축합니다.",
        custom: "스프린트가 끝날 때마다 동작하는 결과물을 보여 드리고, 받은 의견을 다음 스프린트에 반영합니다.",
      },
    },
    {
      title: "인계",
      tracks: {
        onprem: "실제 업무 질문으로 동작을 함께 확인한 뒤, 사용 방법을 안내하고 운영 문서를 넘겨 드립니다.", // OWNER-CONFIRM
        custom: "배포까지 마무리하고, 소스코드를 포함한 개발 산출물을 100% 인계합니다.",
      },
    },
  ] satisfies ProcessStep[],
  // OWNER-CONFIRM: '평균 14일'이 포함하는 기간
  note: "평균 14일은 현장 구축을 시작한 날부터 포털을 인계하는 날까지의 기간입니다. 장비 조달과 사내 승인 절차에 걸리는 기간은 고객사 일정에 맞춰 따로 잡으며, 연동할 시스템과 문서 규모에 따라 달라질 수 있습니다. 확정 일정은 견적서에 적어 드립니다.",
  cta: "상담 요청으로 시작하기",
};

export const SECURITY = {
  eyebrow: "04 / Security",
  title: "보안 검토를 위한 설명",
  lead: "보안성 검토에서 자주 확인하시는 항목을 기준으로 정리했습니다.",
  items: [
    {
      term: "외부 통신",
      description:
        "구축한 시스템은 외부 인터넷이나 클라우드 AI API를 호출하지 않습니다. 모델 추론, 문서 검색, 답변 생성이 모두 사내 서버 안에서 끝납니다.",
    },
    {
      term: "데이터 위치",
      description:
        "원본 문서와 검색용 색인을 비롯해 시스템이 다루는 데이터는 모두 고객사 장비 안에만 남습니다. Taco Studio로 전송되는 데이터는 없습니다.",
    },
    {
      term: "반입 방식",
      description: "인터넷 연결 없이 설치하므로, 모델 파일과 설치 패키지는 고객사의 반입 승인 절차에 따라 들여옵니다.", // OWNER-CONFIRM
    },
    {
      term: "원격 접속",
      description:
        "외부망 연결이 없는 구성이므로 원격 접속을 전제로 하지 않습니다. 인계 후 점검이 필요하면 고객사가 허용한 방식으로만 진행합니다.", // OWNER-CONFIRM
    },
    {
      term: "기밀 유지",
      description:
        "요청하시면 상세 자료를 받기 전에 NDA를 먼저 체결합니다. 고객사의 보안 서약이나 출입 절차가 있으면 그에 맞춰 진행합니다.",
    },
    {
      term: "검토 자료",
      description: "시스템 구성과 데이터 흐름을 설명하는 자료가 필요하시면 사전 점검 단계에서 함께 준비합니다.", // OWNER-CONFIRM
    },
  ],
  diagram: {
    boundary: "사내망",
    nodes: [
      { label: "직원 PC 브라우저" },
      { label: "사내 AI 웹 포털" },
      { label: "로컬 LLM · 문서 색인", sub: "GPU 서버" },
    ],
    external: "인터넷 · 외부 클라우드 AI",
    externalLink: "연결 없음",
    caption: "모든 처리는 사내망 경계 안에서 끝납니다.",
  },
};

export const COMMITMENTS = {
  eyebrow: "05 / Commitment",
  title: "‘정직하게’와 ‘확실하게’는 이런 뜻입니다",
  lead: "듣기 좋은 약속보다 지킬 수 있는 약속을 드립니다.",
  columns: [
    {
      heading: "정직하게",
      items: [
        "온프레미스 AI 구축은 범위를 먼저 확정하고 고정 견적으로 계약합니다. 확정된 범위 안에서는 금액을 바꾸지 않습니다.",
        "일정이나 비용이 달라질 수 있는 요인은 계약 전에 먼저 말씀드립니다.", // OWNER-CONFIRM
        "영업 담당자가 아니라 실제로 일할 엔지니어가 처음부터 직접 상담합니다.",
        "로컬 AI로 할 수 있는 일과 어려운 일을 먼저 구분해 말씀드립니다.", // OWNER-CONFIRM
      ],
    },
    {
      heading: "확실하게",
      items: [
        "구축한 시스템은 외부 인터넷 연결 없이 사내망 안에서만 동작합니다.",
        `온프레미스 AI는 설치부터 포털 인계까지 ${SITE.deliveryAvg} 안에 마칩니다.`,
        "맞춤 개발 산출물은 소스코드를 포함해 100% 인계합니다.",
        "상세 자료를 받기 전에 NDA를 먼저 체결할 수 있습니다.",
      ],
    },
  ],
};

export type FaqItem = { question: string; answer: string; defaultOpen?: boolean };

export const FAQ = {
  eyebrow: "06 / FAQ",
  title: "도입 전에 많이 물어보시는 것들",
  groups: [
    {
      heading: "비용 · 일정 · 계약",
      items: [
        {
          question: "비용은 어떻게 정해지나요?",
          answer:
            "사용 인원, 연결할 문서 규모, 장비 구성에 따라 달라지기 때문에 정해진 가격표를 두지 않습니다. 사전 점검으로 범위를 확정한 뒤 견적을 드립니다. 온프레미스 AI 구축은 고정 견적으로 계약하므로 확정된 범위 안에서는 금액이 바뀌지 않고, 맞춤 개발은 범위를 스프린트 단위로 나눠 일정과 견적을 제안합니다. 장비 구매 비용은 구축 비용과 별도입니다. 예산 범위를 먼저 알려 주시면 그 안에서 가능한 구성을 제안해 드립니다.", // OWNER-CONFIRM
          defaultOpen: true,
        },
        {
          question: "‘평균 14일’은 언제부터 언제까지인가요?",
          answer:
            "현장 구축을 시작한 날부터 포털을 인계하는 날까지입니다. 장비 조달, 계약, 사내 보안성 검토 기간은 포함하지 않습니다. 연동할 시스템이 많거나 문서 정리가 먼저 필요하면 더 걸릴 수 있으며, 확정 일정은 사전 점검 후 견적서에 적어 드립니다.", // OWNER-CONFIRM
        },
        {
          question: "GPU 서버가 없어도 시작할 수 있나요? 이미 있는 장비를 쓸 수도 있나요?",
          answer:
            "장비가 없어도 시작할 수 있습니다. 장비는 고객사에서 구매하시고, 저희는 사용 인원과 업무에 맞는 사양을 제안하고 구매 과정을 지원합니다. 이미 보유한 서버가 있다면 사전 점검에서 활용할 수 있는지 먼저 확인합니다.", // OWNER-CONFIRM
        },
        {
          question: "소스코드도 넘겨받을 수 있나요?",
          answer:
            "서비스에 따라 다릅니다. 온프레미스 AI 구축은 컴파일된 바이너리 형태로 장비에 설치되어 소스코드가 포함되지 않으며, 운영에 필요한 사용 방법과 문서는 인계합니다. 소스코드까지 소유하셔야 하는 과제라면 맞춤 개발로 진행하며, 이때는 소스코드를 포함한 개발 산출물을 100% 인계합니다. 구체적인 인계 항목은 계약서에 명시합니다.",
        },
        {
          question: "납품 후 유지보수는 어떻게 되나요?",
          answer:
            "새 문서 반영, 모델 교체, 장애 대응처럼 구축 이후에 필요한 지원은 범위와 방식을 계약 단계에서 함께 정합니다.", // OWNER-CONFIRM
        },
        {
          question: "상담만 받고 진행하지 않아도 되나요?",
          answer:
            "됩니다. 상담은 현재 상황을 듣고 Taco Studio가 도울 수 있는 일인지 확인하는 단계입니다. 진행 여부는 귀사에서 정하시면 되고, 저희 방식이 맞지 않는다고 판단되면 먼저 말씀드립니다.", // OWNER-CONFIRM
        },
      ],
    },
    {
      heading: "보안 · 기술",
      items: [
        {
          question: "ChatGPT 같은 클라우드 AI만큼 성능이 나오나요?",
          answer:
            "업무에 따라 다릅니다. 사내 장비에서 돌아가는 모델이 모든 작업에서 최신 클라우드 모델과 같은 결과를 내지는 않습니다. 그래서 사전 점검 단계에서 실제 업무 예시를 놓고 무엇이 가능하고 무엇이 어려운지 먼저 말씀드립니다.",
        },
        {
          question: "어떤 AI 모델을 쓰나요?",
          answer:
            "외부 연결 없이 사내 장비에서 구동할 수 있는 공개 모델 가운데, 장비 사양과 한국어 성능, 상업적 이용이 가능한 라이선스인지를 기준으로 사전 점검 단계에서 함께 정합니다.", // OWNER-CONFIRM
        },
        {
          question: "한글(HWP)·PDF·엑셀 문서도 검색할 수 있나요?",
          answer:
            "사전 점검 때 실제로 연결할 문서의 형식과 분량을 샘플로 확인하고 처리 방식을 정합니다. 바로 처리하기 어려운 형식이 있다면 계약 전에 미리 말씀드립니다.", // OWNER-CONFIRM
        },
        {
          question: "부서마다 볼 수 있는 문서를 나눌 수 있나요?",
          answer:
            "열람 권한을 나눠야 하는지는 사전 점검에서 확인하고, 필요한 범위를 견적에 반영합니다. 인사 평가처럼 권한 관리가 특히 민감한 문서는 처음부터 검색 대상에서 빼 두시기를 권합니다.", // OWNER-CONFIRM
        },
        {
          question: "사내에 개발자가 없어도 쓸 수 있나요?",
          answer:
            "네. 직원은 별도 프로그램 설치 없이 사내 브라우저로 포털에 접속해 질문하고 문서를 찾으면 됩니다. 장비 관리를 맡을 담당자에게는 인계할 때 운영 방법을 따로 안내해 드립니다.",
        },
        {
          question: "자료를 보여 드리기 전에 NDA부터 맺을 수 있나요?",
          answer:
            "네. 상담 요청 양식에서 ‘상담 전에 NDA를 먼저 체결하고 싶습니다’를 선택하시면 회신 메일에서 체결 절차부터 안내해 드립니다. 그 전까지는 과제 개요만 알려 주셔도 충분합니다.",
        },
      ],
    },
  ] satisfies { heading: string; items: FaqItem[] }[],
  closing: "찾는 답이 없다면 엔지니어에게 직접 물어보세요.",
  cta: "상담 요청",
};

/* -------------------------------------------------------------------------- */
/* 문의                                                                        */
/* -------------------------------------------------------------------------- */

export const INQUIRY_TYPE_LABELS: Record<InquiryType, { title: string; description: string }> = {
  onprem: { title: "폐쇄망 온프레미스 AI 구축", description: "로컬 LLM·사내 문서 검색 포털" },
  custom: { title: "맞춤 소프트웨어·AI 개발", description: "데이터 파이프라인·AI 챗봇·업무 자동화·웹/앱" },
  undecided: { title: "아직 정하지 않았습니다", description: "상황을 듣고 맞는 방식을 함께 정합니다" },
};

export const CONTACT = {
  eyebrow: "07 / Contact",
  title: "엔지니어가 직접 읽고 답합니다",
  lead: `영업 담당자를 거치지 않습니다. 실제로 구축하고 개발할 엔지니어가 남겨 주신 내용을 검토해 ${SITE.replyPromise}에 회신드립니다. 아직 정해진 것이 없어도 괜찮습니다.`,
  stepsTitle: "문의 후 진행 순서",
  steps: [
    "담당 엔지니어가 남겨 주신 내용을 검토합니다.",
    `${SITE.replyPromise}에 이메일로 먼저 회신드립니다. 통화나 미팅은 원하실 때만 잡습니다.`, // OWNER-CONFIRM
    "상세 자료가 필요하면 NDA를 먼저 체결한 뒤, 환경과 범위를 함께 확인합니다.",
  ],
  reassuranceTitle: "안심하고 남겨 주세요",
  reassurance: [
    "기밀 정보는 적지 않으셔도 됩니다. 구체적인 자료는 NDA 체결 후에 받습니다.",
    "연락처를 비워 두시면 이메일로만 연락드립니다.",
    "상담 후 진행하지 않기로 하셔도 괜찮습니다.",
  ],
  emailAlternative: "양식 대신 이메일로 보내셔도 됩니다:",
};

export const FORM = {
  intro: "회사명, 성함, 이메일만 적으시면 됩니다. 나머지는 선택입니다.",
  typeLegend: "문의 분야",
  fields: {
    company: { label: "회사·기관명", placeholder: "예: 주식회사 OO" },
    name: { label: "성함", placeholder: "홍길동" },
    title: { label: "부서·직함 (선택)", placeholder: "예: 정보보안팀 팀장" },
    email: { label: "회사 이메일", placeholder: "name@company.co.kr", hint: "회신은 이 주소로 드립니다." },
    phone: { label: "연락처 (선택)", placeholder: "010-0000-0000", hint: "비워 두시면 이메일로만 연락드립니다." },
    message: {
      label: "문의 내용 (선택)",
      hint: "기밀 정보는 적지 않으셔도 됩니다. 사용 인원, 현재 망 구성, 원하시는 일정 정도면 충분합니다.",
    },
    nda: { label: "상담 전에 NDA(비밀유지계약)를 먼저 체결하고 싶습니다." },
    consent: { label: "[필수] 개인정보 수집·이용에 동의합니다.", toggle: "내용 보기" },
  },
  messagePlaceholders: {
    onprem:
      "예) 직원 약 200명, 업무망과 인터넷망이 분리된 환경입니다. 사내 규정집과 업무 매뉴얼을 검색하는 사내 AI 포털을 검토 중이며, GPU 서버는 아직 없습니다.",
    custom:
      "예) 엑셀로 처리하는 견적 업무를 자동화하는 사내 웹 도구가 필요합니다. 기존 ERP 데이터와 연동해야 하고, 3개월 안에 쓰기 시작하는 것이 목표입니다.",
    undecided:
      "예) 사내에 AI를 도입하고 싶은데 어디서부터 시작해야 할지 모르겠습니다. 현재 상황을 설명드리고 의견을 듣고 싶습니다.",
  } satisfies Record<InquiryType, string>,
  submit: "상담 요청 보내기",
  submitting: "보내는 중…",
  submitNote: `${SITE.replyPromise}에 실무 엔지니어가 이메일로 직접 회신합니다.`,
  errorSummary: (count: number) => `입력 내용을 확인해 주세요. ${count}개 항목을 고쳐야 합니다.`,
  failed: "전송하지 못했습니다. 입력하신 내용은 그대로 남아 있으니 잠시 후 다시 시도해 주세요.",
  network: "인터넷 연결이 불안정해 보내지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요. 입력하신 내용은 그대로 남아 있습니다.",
  fallbackEmail: (email: string) => `계속 문제가 생기면 ${email}로 보내 주세요.`,
  noscript: "문의 양식을 사용하려면 JavaScript가 필요합니다.",
  success: {
    title: "상담 요청을 받았습니다",
    body: (name: string, email: string) =>
      `${name}님, 남겨 주신 내용을 담당 엔지니어가 검토한 뒤 ${SITE.replyPromise}에 ${email}로 회신드리겠습니다.`,
    steps: (nda: boolean) => [
      "엔지니어가 남겨 주신 내용을 먼저 검토합니다.",
      "이메일로 회신드리고, 원하시면 통화나 미팅 일정을 잡습니다.",
      nda
        ? "요청하신 대로 회신 메일에서 NDA 체결 절차부터 안내해 드립니다."
        : "상세 자료가 필요하면 NDA를 먼저 체결한 뒤 받습니다.",
    ],
    spam: "회신 메일이 보이지 않으면 스팸함도 확인해 주세요.",
    reference: "접수 번호",
    again: "다른 문의 남기기",
  },
};

/* -------------------------------------------------------------------------- */
/* 개인정보                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * 개인정보 처리 안내. 값이 비어 있는 항목은 화면에 표시되지 않습니다.
 * officer / contact / effectiveDate는 개인정보보호법상 공개해야 하는 항목이므로 출시 전에 채워 주세요.
 */
export const PRIVACY = {
  required: "회사·기관명, 성함, 회사 이메일",
  optional: "부서·직함, 연락처, 문의 내용, NDA 체결 희망 여부",
  purpose: "상담 요청 확인과 회신, 상담 진행",
  retention: "상담 종료 후 1년. 삭제를 요청하시면 지체 없이 파기합니다.", // OWNER-CONFIRM
  // OWNER-CONFIRM: 실제로 사용하는 알림 서비스와 국가
  processors:
    "접수 내용은 담당자 알림을 위해 업무용 메신저(Slack 또는 Discord, 미국)로 전달될 수 있으며, 이 웹사이트는 Vercel(미국)에서 운영됩니다. 문의 접수 시 네트워크로 전송되며, 위 보유 기간 동안 보관됩니다.",
  refusal: "동의를 거부하실 수 있으며, 이 경우 상담 요청을 접수할 수 없습니다.",
  officer: undefined as string | undefined,
  contact: undefined as string | undefined,
  effectiveDate: undefined as string | undefined,
};

export const FOOTER = {
  confidentiality: "요청하시면 상담 전에 NDA를 먼저 체결합니다. 상담 중 받은 자료는 외부에 공개하지 않습니다.", // OWNER-CONFIRM
  privacyTitle: "개인정보처리방침",
};
