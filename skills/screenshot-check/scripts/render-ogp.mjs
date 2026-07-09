// Render an HTML file to an OGP image (default 1200x630 JPEG).
// Usage: node render-ogp.mjs <html-path> <output-path> [--width N] [--height N] [--quality N]
// Must be run via its absolute path so Node resolves playwright from this
// script's own node_modules regardless of the current working directory.
import { chromium } from "playwright";
import path from "node:path";

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith("--"));
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? Number(args[i + 1]) : fallback;
};

const [htmlPath, outPath] = positional;
if (!htmlPath || !outPath) {
  console.error("Usage: node render-ogp.mjs <html-path> <output-path> [--width N] [--height N] [--quality N]");
  process.exit(1);
}

const width = opt("width", 1200);
const height = opt("height", 630);
const quality = opt("quality", 90);
const type = outPath.endsWith(".png") ? "png" : "jpeg";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
await page.goto(`file://${path.resolve(htmlPath)}`, { waitUntil: "networkidle" });
// Web fonts (e.g. Google Fonts) finish loading after networkidle.
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({
  path: outPath,
  type,
  ...(type === "jpeg" ? { quality } : {}),
});
await browser.close();
console.log(outPath);
