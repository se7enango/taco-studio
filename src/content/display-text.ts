import { CONTACT, FAQ, FORM, HEADLINE, NOT_FOUND, PREVIEW, PROCESS, SECURITY, SERVICES } from "./site";

/**
 * font-display로 그리는 한글 문구. 제목용 글꼴 서브셋(scripts/subset-display-font.ts)이 이 글자만 담습니다.
 * font-display를 쓰는 제목을 새로 만들면 여기에도 넣어 주세요.
 */
export const DISPLAY_TEXT: readonly string[] = [
  ...HEADLINE,
  PREVIEW.title,
  SERVICES.title,
  ...SERVICES.cards.map((card) => card.title),
  PROCESS.title,
  SECURITY.title,
  FAQ.title,
  CONTACT.title,
  FORM.success.title,
  NOT_FOUND.title,
];
