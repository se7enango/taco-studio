import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DISPLAY_TEXT } from "./display-text";

test("제목 글꼴 서브셋에 제목의 모든 글자가 들어 있다", () => {
  const manifest = readFileSync(join(import.meta.dir, "../app/fonts/noto-serif-kr-display.chars.txt"), "utf8");
  const missing = [...new Set(DISPLAY_TEXT.join(""))].filter((char) => !/\s/.test(char) && !manifest.includes(char));
  // 실패하면: bun scripts/subset-display-font.ts 로 글꼴을 다시 만드세요(스크립트 맨 위 안내 참고).
  expect(missing.join("")).toBe("");
});
