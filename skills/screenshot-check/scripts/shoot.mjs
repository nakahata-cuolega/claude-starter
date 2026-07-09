// Screenshot a site's pages in desktop / mobile / dark-mode variants.
// Usage: node shoot.mjs <baseURL> [path ...] [--out <dir>]
//   e.g. node shoot.mjs https://example.com / /about/ --out /tmp/shots
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const outDir = outIdx !== -1 ? args.splice(outIdx, 2)[1] : "./shots";
const [baseURL, ...pathArgs] = args;
if (!baseURL) {
  console.error("usage: node shoot.mjs <baseURL> [path ...] [--out <dir>]");
  process.exit(1);
}
const paths = pathArgs.length ? pathArgs : ["/"];
mkdirSync(outDir, { recursive: true });

const slug = (p) => p.replaceAll("/", "-").replace(/^-|-$/g, "") || "home";

const VARIANTS = [
  { label: "desktop", viewport: { width: 1280, height: 800 } },
  {
    label: "mobile",
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  },
  { label: "dark", viewport: { width: 1280, height: 800 }, colorScheme: "dark" },
];

const browser = await chromium.launch();
for (const { label, ...options } of VARIANTS) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  for (const p of paths) {
    await page.goto(new URL(p, baseURL).href, { waitUntil: "networkidle" });
    const file = path.join(outDir, `${label}-${slug(p)}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(file);
  }
  await context.close();
}
await browser.close();
