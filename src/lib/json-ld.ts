import { FAQ, SERVICES, SITE } from "@/content/site";

const ORG_ID = `${SITE.url}/#org`;

/** 검색 엔진용 구조화 데이터. 사이트에 실제로 적힌 내용만 담습니다(주소·전화번호 등은 넣지 않습니다). */
export function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE.name,
        url: SITE.url,
        description: "폐쇄망 온프레미스 AI 구축 및 맞춤 소프트웨어·AI 개발",
        ...(SITE.contactEmail ? { email: SITE.contactEmail } : {}),
      },
      ...SERVICES.cards.map((card) => ({
        "@type": "Service",
        serviceType: card.title,
        description: card.summary,
        provider: { "@id": ORG_ID },
        areaServed: "KR",
      })),
      {
        "@type": "FAQPage",
        mainEntity: FAQ.groups.flatMap((group) =>
          group.items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        ),
      },
    ],
  };
}

/** `</script>`로 태그가 닫히지 않도록 `<`를 이스케이프해 직렬화합니다. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
