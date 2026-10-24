import { describe, expect, test } from "bun:test";
import { FAQ, SERVICES } from "@/content/site";
import { buildJsonLd, serializeJsonLd } from "./json-ld";

describe("JSON-LD", () => {
  test("</script>로 태그가 닫히지 않는다", () => {
    const out = serializeJsonLd({ text: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("</script");
    expect(JSON.parse(out)).toEqual({ text: "</script><script>alert(1)</script>" });
  });

  test("서비스 카드와 FAQ 질문을 모두 담는다", () => {
    const graph = buildJsonLd()["@graph"] as { "@type": string; mainEntity?: unknown[] }[];
    expect(graph.filter((node) => node["@type"] === "Service")).toHaveLength(SERVICES.cards.length);
    const faq = graph.find((node) => node["@type"] === "FAQPage");
    expect(faq?.mainEntity).toHaveLength(FAQ.groups.flatMap((group) => group.items).length);
  });
});
