/**
 * 제목용 한글 명조(Noto Serif KR)를 사이트 제목에 쓰인 글자만 남겨 줄입니다.
 * 전체 폰트를 쓰면 첫 화면에서 약 370KB를 더 내려받기 때문입니다.
 *
 * 제목 문구(src/content/site.ts)를 바꾸면 다시 실행해 주세요. 빠진 글자는 Google Fonts의 Noto Serif KR로
 * 자동 대체되므로 깨지지는 않지만, 그만큼 내려받는 양이 늘어납니다.
 *
 *   pip install fonttools brotli
 *   curl -L -o /tmp/NotoSerifKR.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/notoserifkr/NotoSerifKR%5Bwght%5D.ttf"
 *   # 제목에 쓰는 굵기(400~500)만 남겨 크기를 더 줄입니다(1분 정도 걸립니다).
 *   fonttools varLib.instancer /tmp/NotoSerifKR.ttf wght=400:500 -o /tmp/NotoSerifKR-400-500.ttf
 *   bun scripts/subset-display-font.ts /tmp/NotoSerifKR-400-500.ttf
 */

import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  ABOUT,
  BARRIERS,
  COMMITMENTS,
  CONTACT,
  FAQ,
  FORM,
  HEADLINE,
  PROCESS,
  SECURITY,
  SERVICES,
} from "../src/content/site";

const source = process.argv[2];
if (!source) {
  console.error("사용법: bun scripts/subset-display-font.ts <NotoSerifKR[wght].ttf 경로>");
  process.exit(1);
}

/** font-display / font-serif로 그리는 한글 문구 */
const displayText = [
  ...HEADLINE,
  ABOUT.title,
  ...ABOUT.stats.map((stat) => stat.value),
  BARRIERS.title,
  SERVICES.title,
  ...SERVICES.cards.map((card) => card.title),
  PROCESS.title,
  SECURITY.title,
  COMMITMENTS.title,
  ...COMMITMENTS.columns.map((column) => column.heading),
  FAQ.title,
  CONTACT.title,
  FORM.success.title,
].join("");

// 제목 안의 영문·숫자·문장부호도 같은 글꼴로 그리도록 기본 라틴 문자를 함께 넣습니다.
const latin = Array.from({ length: 0x7e - 0x20 + 1 }, (_, i) => String.fromCharCode(0x20 + i)).join("");
const chars = [...new Set([...displayText, ...latin, "‘", "’", "“", "”", "·", "…"])].join("");

const workdir = mkdtempSync(join(tmpdir(), "subset-"));
const textFile = join(workdir, "chars.txt");
writeFileSync(textFile, chars);

const output = join(import.meta.dir, "../src/app/fonts/noto-serif-kr-display.woff2");
const result = spawnSync(
  "pyftsubset",
  [source, `--text-file=${textFile}`, "--flavor=woff2", "--layout-features=*", "--no-hinting", `--output-file=${output}`],
  { stdio: "inherit" },
);
if (result.status !== 0) process.exit(result.status ?? 1);

const hangul = [...chars].filter((c) => /[가-힣]/.test(c)).length;
console.log(`글자 ${[...chars].length}개(한글 ${hangul}개)로 ${output}을 만들었습니다.`);
