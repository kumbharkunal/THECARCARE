// House style: no em dashes (U+2014) or en dashes (U+2013) anywhere a visitor could read them.
// Scans the source (copy, components, metadata) and the rendered pages, including hidden text
// such as the closed menu and FAQ answers, alt text, labels, meta tags and JSON-LD.
// Usage: node scripts/scan-dashes.mjs [url]   (default http://localhost:3000, server running)
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:3000";
const DASH = /[–—]/g;
const hits = [];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(tsx?|css|json)$/.test(entry.name)) yield full;
  }
}
for (const dir of ["content", "components", "app", "lib"]) {
  for await (const file of walk(dir)) {
    const lines = (await readFile(file, "utf8")).split("\n");
    lines.forEach((line, i) => {
      if (DASH.test(line)) hits.push(`${file}:${i + 1}  ${line.trim().slice(0, 100)}`);
      DASH.lastIndex = 0;
    });
  }
}

const browser = await chromium.launch();
const page = await browser.newPage();
for (const route of ["/", "/this-page-does-not-exist"]) {
  await page.goto(new URL(route, url).href, { waitUntil: "networkidle" });
  const found = await page.evaluate((pattern) => {
    const dash = new RegExp(pattern, "g");
    const out = [];
    const check = (where, text) => {
      if (text && dash.test(text)) out.push(`${where}: ${text.trim().slice(0, 100)}`);
      dash.lastIndex = 0;
    };
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const parent = node.parentElement;
      if (parent?.closest("style, noscript") || (parent?.closest("script") && parent.getAttribute("type") !== "application/ld+json")) continue;
      check(`text <${parent?.tagName.toLowerCase()}>`, node.textContent);
    }
    for (const el of document.querySelectorAll("[alt], [aria-label], [title], [placeholder], meta[content]")) {
      for (const attr of ["alt", "aria-label", "title", "placeholder", "content"]) check(`${el.tagName.toLowerCase()}[${attr}]`, el.getAttribute(attr));
    }
    check("document.title", document.title);
    return out;
  }, DASH.source);
  hits.push(...found.map((f) => `${route}  ${f}`));
}
await browser.close();

if (hits.length) {
  console.log(`${hits.length} dash(es) found:`);
  for (const h of hits) console.log(`  x ${h}`);
  process.exit(1);
}
console.log("No em or en dashes in the source or on the rendered pages.");
