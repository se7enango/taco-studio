/**
 * 사이트의 모든 문구와 약속은 이 파일 하나에서 관리합니다.
 * 페이지, 메타데이터, JSON-LD, 문의 알림이 모두 여기서 값을 읽으므로
 * "당일 vs 24시간", "14일 vs 평균 14일" 같은 불일치가 다시 생기지 않습니다.
 *
 * `// OWNER-CONFIRM` 표시가 붙은 문장은 기존 사이트의 주장을 풀어 쓴 것입니다.
 * 출시 전에 사실인지 확인하고, 사실이 아니면 삭제해 주세요.
 * 같은 약속이 여러 곳에 나오므로, 표시만 보지 말고 같은 표현으로도 검색해 주세요.
 *
 * 같은 말이 페이지에 되풀이되지 않도록, 아래 표현은 정해진 자리에만 씁니다.
 * - 회신 시간(SITE.replyPromise): 첫 화면 안내문, 제출 버튼 아래 (접수 완료 화면 제외)
 * - '엔지니어가 직접': 첫 화면 안내문, 문의 섹션 제목
 * - NDA: 보안 섹션의 '기밀 유지'와 그 아래 링크, 문의 양식 체크박스
 * - 사전 점검: 진행 과정 2단계, 보안 섹션 머리말
 * - 기밀 정보 안내('기밀 정보는 빼고'): 문의 내용 입력 안내
 * - '100%': 서비스 B 조건표, FAQ 소스코드 답변
 * 문구를 더할 때 이 표현이 다른 곳에 또 들어가지 않는지 확인해 주세요.
 */

import type { InquirySource, InquiryType } from "@/lib/contact/schema";

/* -------------------------------------------------------------------------- */
/* 기본 정보                                                                    */
/* -------------------------------------------------------------------------- */

/** 회신 약속. 당일 회신을 보장할 수 있다면 여기 값만 바꾸면 사이트 전체에 반영됩니다. */
export const REPLY = { basis: "영업일 기준", value: "24시간" } as const; // OWNER-CONFIRM

/** 온프레미스 AI 구축 기간. */
export const DELIVERY = { prefix: "평균", value: "14일" } as const;

/** 맞춤 개발 산출물 인계 범위. 기존 사이트는 '산출물 100% 인계'까지만 말했습니다. */
const CUSTOM_HANDOVER = "소스코드를 포함한 개발 산출물"; // OWNER-CONFIRM

export const SITE = {
  name: "Taco Studio",
  domain: "taco-studio.ai",
  url: "https://taco-studio.ai",
  tagline: "폐쇄망 온프레미스 AI 구축, 맞춤 소프트웨어·AI 개발",
  replyPromise: `${REPLY.basis} ${REPLY.value} 이내`,
  deliveryAvg: `${DELIVERY.prefix} ${DELIVERY.value}`,
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
  description: `인터넷이 차단된 사내망에서만 동작하는 로컬 LLM과 사내 문서 검색 포털을 고정 견적으로, ${SITE.deliveryAvg} 만에 구축합니다. 맞춤 소프트웨어·AI 개발은 전담 엔지니어가 직접 맡습니다. ${SITE.replyPromise} 엔지니어 회신.`,
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

/** 각 CTA의 위치. 문의 알림에 '진입 경로'로 함께 전달됩니다. 키는 schema.ts의 INQUIRY_SOURCES와 같아야 합니다. */
export const CTA_SOURCES: Record<InquirySource, string> = {
  header: "상단 메뉴",
  hero: "첫 화면",
  preview: "화면 예시",
  "service-onprem": "서비스 A 카드",
  "service-custom": "서비스 B 카드",
  "services-undecided": "서비스 하단",
  process: "진행 과정",
  security: "보안 섹션(NDA 먼저)",
  faq: "자주 묻는 질문",
  link: "공유 링크(?type=)",
  direct: "직접 접근",
};

/* -------------------------------------------------------------------------- */
/* 섹션 콘텐츠 (화면 순서: 첫 화면 → 화면 예시 → 서비스 → 진행 과정 → 보안 → FAQ → 문의) */
/* -------------------------------------------------------------------------- */

export const HERO = {
  label: SITE.tagline,
  summary: `외부 인터넷과 분리된 사내망에 로컬 LLM과 사내 문서 검색 포털을 ${SITE.deliveryAvg} 만에, 고정 견적으로 구축합니다. 맞춤 소프트웨어·AI 개발은 전담 엔지니어가 고객 현장에 들어가 맡습니다.`,
  primaryCta: "상담 요청하기",
  secondaryCta: "화면 예시 보기",
  reassurance: `${SITE.replyPromise}에 엔지니어가 직접 회신합니다.`,
};

export type PreviewSource = { title: string; section: string };

/**
 * 첫 화면 바로 아래의 '화면 예시'. 납품하는 사내 AI 포털이 어떤 모습인지 보여 주는 설명용 화면입니다.
 * - '화면 예시' 표시(mock.badge, caption)는 빼지 않습니다.
 * - 성능·정확도·속도 수치, 고객사 이름, 실제 문서처럼 보이는 내용(조항 번호, 금액 등)은 넣지 않습니다.
 */
export const PREVIEW = {
  eyebrow: "구축 결과물",
  title: "직원은 브라우저에서 묻고, 답은 사내 문서에서 찾습니다",
  // OWNER-CONFIRM: 기존 FAQ '사내에 개발자가 없어도 쓸 수 있나요?' 답변과 기존 '보고서 초안' 문구를 옮긴 것
  lead: "따로 프로그램을 설치하지 않고 직원 PC에서 바로 접속합니다. 문서 검색뿐 아니라 보고서 초안 작성에도 쓸 수 있습니다. 사내에 개발자가 없어도 됩니다.",
  mock: {
    app: "사내 AI 포털",
    badge: "화면 예시",
    question: "해외 출장 숙박비는 어떻게 정산하나요?",
    answer:
      "출장 여비 규정에 따르면 해외 출장 숙박비는 직급별 한도 안에서 실비로 정산합니다. 한도를 넘는 금액은 출장 전에 따로 승인을 받아야 합니다.",
    sourcesTitle: "찾은 문서",
    // OWNER-CONFIRM: 실제 포털이 답변과 함께 찾은 문서를 보여 주지 않는다면 빈 배열([])로 두세요. 화면에서 이 블록이 사라집니다.
    sources: [
      { title: "출장 여비 규정", section: "숙박비 정산" },
      { title: "해외 출장 정산 안내", section: "한도 초과 승인" },
    ] as PreviewSource[],
    input: "사내 문서에 대해 물어보세요",
  },
  caption: "화면 예시입니다. 질문과 답변, 문서 이름은 설명을 위해 만든 것이며 실제 화면과 다를 수 있습니다.",
  facts: [
    // OWNER-CONFIRM: '평균 14일'이 포함하는 기간 (PROCESS.note와 함께 수정)
    { term: "구축 기간", value: SITE.deliveryAvg, description: "현장 구축 시작부터 포털 인계까지" },
    { term: "계약", value: "고정 견적", description: "확정한 범위 안에서는 금액이 바뀌지 않습니다" },
    { term: "동작 환경", value: "사내망 안에서만", description: "인터넷이나 클라우드 AI를 호출하지 않습니다" },
  ],
  // 되는 일과 어려운 일을 먼저 구분해 드린다는 약속(OWNER-CONFIRM)은 FAQ '성능' 답변에만 둡니다.
  note: "사내 장비에서 돌아가는 모델이 모든 작업에서 최신 클라우드 AI만큼 결과를 내지는 않습니다.",
  cta: "우리 회사 문서로도 되는지 물어보기",
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

/*
 * 예전 '세 가지 장벽' 섹션의 내용은 카드로 옮겼습니다.
 * - 기밀 자료를 외부 AI에 넣을 수 없음 → A '이런 조직에 맞습니다' 첫 줄
 * - 장비를 들여도 현업에서 쓰지 못함 → A 셋째 줄
 * - AI 엔지니어 채용이 느리고 비쌈 → B '이런 조직에 맞습니다' 첫 줄, '진행 방식' 셋째 줄
 */
export const SERVICES = {
  eyebrow: "서비스",
  title: "두 가지 방식으로 일합니다",
  lead: "사내망에서 쓸 AI 포털이 필요하면 A, 새로 만들 소프트웨어나 AI 기능이 있다면 B입니다.",
  cards: [
    {
      id: "onprem",
      code: "A · 턴키 납품",
      title: "폐쇄망 온프레미스 AI 구축",
      summary: "사내망 안에서만 동작하는 AI 환경을 장비 선정부터 사내 포털까지 한 번에 납품합니다.",
      fitTitle: "이런 조직에 맞습니다",
      fit: [
        "망분리나 보안 규정 때문에 ChatGPT 같은 외부 AI에 사내 자료를 넣을 수 없는 조직",
        "사규, 업무 매뉴얼, 보고서 같은 사내 문서를 AI로 찾아 쓰고 싶은 조직",
        "GPU 서버를 들였거나 검토 중이지만, 현업에 정착시킬 엔지니어가 없는 조직",
      ],
      scopeTitle: "포함 범위",
      scope: [
        "사용 인원과 업무에 맞는 서버 사양 제안과 구매 지원",
        "서버 OS와 로컬 LLM 설치, 최적화",
        "사내 문서 검색(RAG) 웹 포털 구축",
        "실제 업무 질문으로 동작을 확인한 뒤 운영 담당자에게 인계", // OWNER-CONFIRM
      ],
      terms: [
        { term: "기간", value: SITE.deliveryAvg },
        { term: "계약", value: "고정 견적" },
        { term: "소스코드", value: "미포함 (컴파일된 바이너리로 설치)" },
        { term: "장비", value: "고객사 구매, 보유 서버 활용 검토" }, // OWNER-CONFIRM
      ],
      cta: "온프레미스 AI 구축 문의",
    },
    {
      id: "custom",
      code: "B · 현장 투입형 개발",
      title: "맞춤 소프트웨어·AI 개발",
      summary: "만들 것은 분명한데 맡길 개발팀이 없을 때, 전담 엔지니어가 요구사항 정리부터 배포까지 맡습니다.",
      fitTitle: "이런 조직에 맞습니다",
      fit: [
        "AI·개발 인력을 새로 뽑기엔 채용 기간과 고정 인건비가 부담되는 조직",
        "흩어진 사내 데이터를 모아 정리할 파이프라인이 필요한 조직",
        "사내 AI 챗봇이나 업무 자동화 에이전트를 만들고 싶은 조직",
        "새 웹 서비스나 앱을 처음부터 개발해야 하는 조직",
      ],
      scopeTitle: "진행 방식",
      scope: [
        "요구사항 명세를 함께 작성하며 시작",
        "스프린트마다 동작하는 결과물을 보여 드리고, 의견을 다음 스프린트에 반영",
        "전담 FDE(현장 투입형 엔지니어)가 필요한 기간에 합류해 배포까지 직접 구현",
      ],
      terms: [
        { term: "기간", value: "범위에 따라 협의" },
        { term: "계약", value: "스프린트 단위 납품" },
        { term: "소스코드", value: "포함 (산출물 100% 인계)" }, // OWNER-CONFIRM: CUSTOM_HANDOVER와 함께 수정
        { term: "환경", value: "고객사 기존 인프라 또는 별도 협의" },
      ],
      cta: "맞춤 개발 문의",
    },
  ] satisfies ServiceCard[],
  undecided: "어느 쪽이 맞을지 아직 모르겠다면 지금 상황만 알려 주세요.",
  undecidedCta: "정하지 않고 문의하기",
};

export type ProcessStep = {
  title: string;
  body?: string;
  tracks?: { onprem: string; custom: string };
  /** 온프레미스 트랙 옆에만 붙는 기간 표시 */
  onpremBadge?: string;
};

export const PROCESS = {
  eyebrow: "진행 과정",
  title: "문의부터 인계까지, 이렇게 진행됩니다",
  lead: "두 서비스 모두 같은 순서로 진행하며, 견적은 3단계에서 드립니다.",
  /** 화면에는 trackCodes(A·B)만 보이고, 화면 낭독기는 trackLabels를 읽습니다. */
  trackCodes: { onprem: "A", custom: "B" },
  trackLabels: { onprem: "온프레미스 AI 구축", custom: "맞춤 개발" },
  steps: [
    {
      title: "문의",
      body: "검토 중인 과제를 간단히 알려 주세요.",
    },
    {
      title: "회신과 사전 점검",
      body: "보안 정책, 망 구성, 사용 인원, 대상 문서나 개발 요구사항을 함께 확인합니다.",
    },
    {
      title: "범위 확정과 견적",
      // OWNER-CONFIRM: 둘째 문장은 기존 '일정이나 비용이 달라질 수 있는 요인은 계약 전에 먼저 말씀드립니다'
      body: "범위, 산출물, 일정을 문서로 정리해 견적을 드립니다. 비용이 달라질 수 있는 요인도 이때 함께 알려 드립니다.",
    },
    {
      title: "구축·개발",
      onpremBadge: SITE.deliveryAvg,
      tracks: {
        onprem: "현장에서 설치하고 포털을 구축합니다.",
        custom: "스프린트마다 결과물을 공유합니다.",
      },
    },
    {
      title: "인계",
      tracks: {
        onprem: "동작을 함께 확인하고 운영 문서를 넘겨 드립니다.", // OWNER-CONFIRM
        custom: `${CUSTOM_HANDOVER}을 넘겨 드립니다.`,
      },
    },
  ] satisfies ProcessStep[],
  // OWNER-CONFIRM: '평균 14일'이 포함하는 기간 (PREVIEW.facts 첫 칸과 함께 수정)
  note: `${SITE.deliveryAvg}은 현장 구축을 시작한 날부터 포털을 인계하는 날까지입니다. 장비 조달, 계약, 사내 보안성 검토 기간은 포함하지 않으며, 연동할 시스템이 많거나 문서 정리가 먼저 필요하면 더 걸릴 수 있습니다. 확정 일정은 견적서에 적어 드립니다.`,
  cta: "문의 남기기",
};

export const SECURITY = {
  eyebrow: "보안",
  title: "데이터는 사내망 밖으로 나가지 않습니다",
  lead: "폐쇄망 온프레미스 AI 구축 기준입니다. 보안성 검토에 필요한 시스템 구성과 데이터 흐름 자료는 사전 점검 단계에서 함께 준비합니다.", // OWNER-CONFIRM
  diagram: {
    boundary: "사내망",
    nodes: [
      { label: "직원 PC 브라우저" },
      { label: "사내 AI 웹 포털" },
      { label: "로컬 LLM과 문서 색인", sub: "GPU 서버" },
    ],
    external: "인터넷, 외부 클라우드 AI",
    externalLink: "연결 없음",
    caption: "온프레미스 AI 구축 구성 예시",
  },
  items: [
    {
      term: "데이터 흐름",
      description:
        "추론, 검색, 답변 생성이 모두 사내 서버에서 끝나며 외부 인터넷이나 클라우드 AI API를 호출하지 않습니다. 원본 문서와 색인은 고객사 장비에만 남고, Taco Studio로도 전송되지 않습니다.",
    },
    {
      term: "원격 접속",
      description: "원격 접속을 전제로 하지 않습니다. 인계 후 점검이 필요하면 고객사가 허용한 방식으로만 진행합니다.", // OWNER-CONFIRM
    },
    {
      term: "반입 절차",
      description: "인터넷 없이 설치하므로 모델 파일과 설치 패키지는 고객사 반입 승인 절차에 따라 들여옵니다.", // OWNER-CONFIRM
    },
    {
      term: "기밀 유지",
      description:
        "상세 자료는 NDA 체결 후에 받습니다. 원하시면 첫 상담 전에 체결하고, 고객사 보안 서약이나 출입 절차가 있으면 그대로 따릅니다.", // OWNER-CONFIRM
    },
  ],
  /** 누르면 문의 양식으로 이동하면서 'NDA 먼저 체결' 체크박스를 켭니다. */
  cta: "상담 전에 NDA부터 체결하기",
};

export type FaqItem = { question: string; answer: string; defaultOpen?: boolean };

export const FAQ = {
  eyebrow: "자주 묻는 질문",
  title: "도입 전에 많이 물어보시는 것들",
  groups: [
    {
      heading: "비용·계약",
      items: [
        {
          question: "비용은 어떻게 정해지나요?",
          answer:
            "정해진 가격표는 없습니다. 사용 인원, 연결할 문서 규모, 장비 구성에 따라 달라지므로 범위를 확정한 뒤 견적을 드립니다. 온프레미스 AI 구축은 고정 견적, 맞춤 개발은 스프린트 단위 견적이며, 장비 구매 비용은 별도입니다. 예산 범위를 먼저 알려 주시면 그 안에서 가능한 구성을 제안합니다.", // OWNER-CONFIRM
          defaultOpen: true,
        },
        {
          question: "소스코드도 넘겨받을 수 있나요?",
          answer: `서비스에 따라 다릅니다. 온프레미스 AI 구축은 컴파일된 바이너리로 설치되어 소스코드가 포함되지 않고, 운영에 필요한 사용 방법과 문서를 인계합니다. 소스코드를 소유하셔야 한다면 맞춤 개발로 진행하며, 이때는 ${CUSTOM_HANDOVER}을 100% 인계합니다. 인계 항목은 계약서에 명시합니다.`, // OWNER-CONFIRM
        },
        {
          question: "GPU 서버가 없어도 되나요? 있는 장비를 써도 되나요?",
          answer:
            "장비가 없어도 시작할 수 있습니다. 장비는 고객사에서 구매하시고, 저희는 사용 인원과 업무에 맞는 사양을 제안하고 구매를 지원합니다. 이미 서버가 있다면 그대로 쓸 수 있는지 먼저 확인합니다.", // OWNER-CONFIRM
        },
        {
          question: "납품 후 유지보수는 어떻게 되나요?",
          answer: "새 문서 반영, 모델 교체, 장애 대응처럼 구축 이후에 필요한 지원은 범위와 방식을 계약할 때 함께 정합니다.", // OWNER-CONFIRM
        },
      ],
    },
    {
      heading: "성능·기술",
      items: [
        {
          question: "ChatGPT 같은 클라우드 AI만큼 성능이 나오나요?",
          answer:
            "업무에 따라 다릅니다. 사내 장비에서 돌아가는 모델이 모든 작업에서 최신 클라우드 모델만큼의 결과를 내지는 않습니다. 그래서 계약 전에 실제 업무 예시를 놓고 무엇이 되고 무엇이 어려운지 먼저 말씀드립니다.", // OWNER-CONFIRM
        },
        {
          question: "한글(HWP)·PDF·엑셀 문서도 검색할 수 있나요?",
          answer:
            "실제로 연결할 문서를 샘플로 받아 형식과 분량을 확인한 뒤 처리 방식을 정합니다. 바로 처리하기 어려운 형식은 견적 단계에서 미리 알려 드립니다.", // OWNER-CONFIRM
        },
        {
          question: "부서마다 볼 수 있는 문서를 나눌 수 있나요?",
          answer:
            "열람 권한을 나눠야 한다면 그 범위를 확인해 견적에 반영합니다. 인사 평가처럼 특히 민감한 문서는 처음부터 검색 대상에서 빼 두시기를 권합니다.", // OWNER-CONFIRM
        },
        {
          question: "어떤 AI 모델을 쓰나요?",
          answer:
            "외부 연결 없이 사내 장비에서 돌릴 수 있는 공개 모델 가운데 고릅니다. 장비 사양, 한국어 성능, 상업적 이용이 가능한 라이선스인지를 따져 함께 정합니다.", // OWNER-CONFIRM
        },
      ],
    },
  ] satisfies { heading: string; items: FaqItem[] }[],
  closing: "여기 없는 질문도 편하게 보내 주세요.",
  cta: "질문 보내기",
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
  eyebrow: "문의",
  title: "엔지니어가 직접 읽고 답합니다",
  lead: "영업 담당자를 거치지 않고, 실제로 구축하고 개발할 사람이 처음부터 상담합니다.",
  stepsTitle: "문의 후 진행",
  steps: [
    "남겨 주신 내용을 검토해 이메일로 회신드립니다.",
    "통화나 미팅은 원하실 때만 잡습니다.", // OWNER-CONFIRM
    "범위와 일정을 정리한 견적을 드립니다.",
  ],
  reassuranceTitle: "진행 여부",
  reassurance: [
    "견적을 받아 보신 뒤 진행하지 않기로 하셔도 됩니다.", // OWNER-CONFIRM
    "저희 방식이 맞지 않는다고 판단되면 먼저 말씀드립니다.", // OWNER-CONFIRM
  ],
  emailAlternative: "이메일로 바로 보내셔도 됩니다:",
};

export const FORM = {
  intro: "회사·기관명, 성함, 회사 이메일과 개인정보 동의만 있으면 됩니다.",
  typeLegend: "문의 분야",
  fields: {
    company: { label: "회사·기관명", placeholder: "예: 주식회사 OO" },
    name: { label: "성함", placeholder: "홍길동" },
    title: { label: "부서·직함 (선택)", placeholder: "예: 정보보안팀 팀장" },
    email: { label: "회사 이메일", placeholder: "name@company.co.kr", hint: "회신은 이 주소로 드립니다." },
    phone: { label: "연락처 (선택)", placeholder: "010-0000-0000", hint: "비워 두시면 이메일로만 연락드립니다." },
    message: {
      label: "문의 내용 (선택)",
      hint: "기밀 정보는 빼고 사용 인원과 망 구성, 원하시는 일정 정도를 적어 주세요.",
    },
    nda: { label: "상담 전에 NDA(비밀유지계약)를 먼저 체결하고 싶습니다." },
    consent: { label: "[필수] 개인정보 수집·이용에 동의합니다.", toggle: "내용 보기" },
  },
  messagePlaceholders: {
    onprem:
      "예) 직원 약 200명, 업무망과 인터넷망이 분리된 환경입니다. 사내 규정집과 업무 매뉴얼을 검색하는 AI 포털을 검토 중이며, GPU 서버는 아직 없습니다.",
    custom:
      "예) 엑셀로 하는 견적 업무를 자동화할 사내 웹 도구가 필요합니다. 기존 ERP 데이터와 연동해야 하고, 3개월 안에 쓰기 시작하는 것이 목표입니다.",
    undecided:
      "예) 사내에 AI를 도입하고 싶은데 어디서부터 시작할지 모르겠습니다. 상황을 설명드리고 의견을 듣고 싶습니다.",
  } satisfies Record<InquiryType, string>,
  submit: "상담 요청 보내기",
  submitting: "보내는 중…",
  submitNote: `${SITE.replyPromise}에 이메일로 회신드립니다.`,
  errorSummary: (count: number) => `입력 내용을 확인해 주세요. ${count}개 항목을 입력하거나 고쳐야 합니다.`,
  failed: "전송하지 못했습니다. 입력하신 내용은 그대로 있으니 잠시 후 다시 시도해 주세요.",
  network: "인터넷 연결이 불안정해 보내지 못했습니다. 입력하신 내용은 그대로 있으니 연결을 확인한 뒤 다시 보내 주세요.",
  stale: "사이트가 방금 업데이트되어 이 화면에서는 보낼 수 없습니다. 새로고침한 뒤 다시 보내 주세요. 입력하신 내용은 새로고침 후에도 남아 있습니다.",
  staleUnsaved:
    "사이트가 방금 업데이트되어 이 화면에서는 보낼 수 없습니다. 이 브라우저에서는 입력 내용을 임시 저장할 수 없으니, 문의 내용을 복사해 둔 뒤 새로고침해 다시 보내 주세요.",
  reload: "새로고침",
  fallbackEmail: (email: string) => `계속 문제가 생기면 ${email}로 보내 주세요.`,
  noscript: "문의 양식을 사용하려면 JavaScript가 필요합니다.",
  success: {
    title: "상담 요청을 받았습니다",
    body: (name: string, email: string) => `${name}님, ${SITE.replyPromise}에 ${email}로 회신드리겠습니다.`,
    steps: (nda: boolean) => [
      "담당 엔지니어가 남겨 주신 내용을 검토합니다.",
      "이메일로 회신드리고, 원하시면 통화나 미팅 일정을 잡습니다.", // OWNER-CONFIRM
      nda ? "요청하신 대로 NDA 체결 절차부터 안내해 드립니다." : "상세 자료는 NDA를 체결한 뒤에 받습니다.",
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
 * 법적 고지이므로 문구 정리 대상에서 제외했습니다.
 */
export const PRIVACY = {
  required: "회사·기관명, 성함, 회사 이메일",
  optional: "부서·직함, 연락처, 문의 내용, NDA 체결 희망 여부",
  purpose: "상담 요청 확인과 회신, 상담 진행",
  retention: "상담 종료 후 1년. 삭제를 요청하시면 지체 없이 파기합니다.", // OWNER-CONFIRM
  // OWNER-CONFIRM: 실제로 사용하는 알림 서비스와 국가 ('또는'으로 두지 말고 실제 쓰는 서비스 하나로 적어 주세요)
  processors:
    "접수 내용은 담당자 알림을 위해 업무용 메신저(Slack 또는 Discord, 미국)로 전달될 수 있으며, 이 웹사이트는 Vercel(미국)에서 운영됩니다. 문의 접수 시 네트워크로 전송되며, 위 보유 기간 동안 보관됩니다.",
  refusal: "동의를 거부하실 수 있으며, 이 경우 상담 요청을 접수할 수 없습니다.",
  officer: undefined as string | undefined,
  contact: undefined as string | undefined,
  effectiveDate: undefined as string | undefined,
};

export const FOOTER = {
  confidentiality: "상담 중 받은 자료는 외부에 공개하지 않습니다.", // OWNER-CONFIRM
  privacyTitle: "개인정보처리방침",
};
