// Validate ad copy lengths against platform limits.
// Usage: node validate-copy.mjs <copy.json> --platform <google-rsa|meta>
//
// copy.json format:
//   { "headlines": ["..."], "descriptions": ["..."], "primaryTexts": ["..."] }
//
// Lengths are measured the way Google Ads counts them: half-width
// characters = 1, full-width (CJK, kana, full-width punctuation) = 2.
import { readFileSync } from "node:fs";

const WIDE = /[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹏＀-｠￠-￦　-〿]/u;

export function adWidth(text) {
  let w = 0;
  for (const ch of text) w += WIDE.test(ch) ? 2 : 1;
  return w;
}

const LIMITS = {
  "google-rsa": {
    headlines: { max: 30, maxCount: 15, label: "見出し" },
    descriptions: { max: 90, maxCount: 4, label: "説明文" },
  },
  meta: {
    primaryTexts: { max: 250, maxCount: 5, label: "プライマリテキスト(推奨125)" },
    headlines: { max: 80, maxCount: 5, label: "見出し(推奨40)" },
    descriptions: { max: 60, maxCount: 5, label: "説明" },
  },
};

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const platform = args[args.indexOf("--platform") + 1];
const limits = LIMITS[platform];
if (!file || !limits) {
  console.error(`Usage: node validate-copy.mjs <copy.json> --platform <${Object.keys(LIMITS).join("|")}>`);
  process.exit(1);
}

const copy = JSON.parse(readFileSync(file, "utf8"));
let failed = false;

for (const [field, rule] of Object.entries(limits)) {
  const items = copy[field];
  if (!items) continue;
  console.log(`\n## ${rule.label} (上限${rule.max}・${items.length}/${rule.maxCount}本)`);
  if (items.length > rule.maxCount) {
    console.log(`✗ 本数超過: ${items.length} > ${rule.maxCount}`);
    failed = true;
  }
  for (const text of items) {
    const w = adWidth(text);
    const ok = w <= rule.max;
    if (!ok) failed = true;
    console.log(`${ok ? "✓" : "✗"} [${String(w).padStart(3)}] ${text}`);
  }
}

console.log(failed ? "\nRESULT: FAIL — ✗ の行を修正して再実行" : "\nRESULT: PASS");
process.exit(failed ? 1 : 0);
