// Part J screenshots: every section at six viewports, then the interactive states (menu open,
// the four service zones, the sun film stack mid-scroll, each shade guide zone, scratch before,
// during and after healing, both compare sliders at 20, 50 and 80%), reduced motion, script off
// and a keyboard pass. Console errors and sideways overflow are reported at the end.
// Usage: node scripts/qa-shots.mjs [url] [outDir]   (default http://localhost:3000, qa/shots)
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? path.join("qa", "shots");
const VIEWPORTS = [
  [360, 800],
  [390, 844],
  [768, 1024],
  [1024, 768],
  [1440, 900],
  [1920, 1080],
];
const SECTIONS = ["#services", "#sun-film", "#shade-guide", "#ppf", "#ceramic", "#why", "#process", "#faq", "#visit", "#site-footer"];
const problems = [];
const files = [];

await mkdir(out, { recursive: true });
const browser = await chromium.launch();

async function open(w, h, options = {}) {
  const context = await browser.newContext({
    viewport: { width: w, height: h },
    isMobile: w < 1024,
    hasTouch: w < 1024,
    reducedMotion: options.reduced ? "reduce" : "no-preference",
    javaScriptEnabled: options.js !== false,
  });
  const page = await context.newPage();
  const tag = `${w}x${h}${options.reduced ? " reduced" : ""}${options.js === false ? " no-js" : ""}`;
  page.on("pageerror", (e) => problems.push(`${tag} page error: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && problems.push(`${tag} console: ${m.text().slice(0, 160)}`));
  await page.goto(url, { waitUntil: "load" });
  return { context, page };
}

const shot = async (page, name, target) => {
  const file = path.join(out, `${name}.png`);
  if (target) await page.locator(target).first().screenshot({ path: file });
  else await page.screenshot({ path: file });
  files.push(file);
};

// Scroll the whole page once so content-visibility sections are drawn and reveals have played.
async function walk(page, h) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total + h; y += Math.round(h * 0.6)) {
    await page.mouse.wheel(0, Math.round(h * 0.6));
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(800);
}

const scrollTo = (page, selector, offset = 0) =>
  page.evaluate(
    ([s, o]) => {
      const el = document.querySelector(s);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - o, behavior: "instant" });
    },
    [selector, offset],
  );

// 1. Every section at every viewport
for (const [w, h] of VIEWPORTS) {
  const { context, page } = await open(w, h);
  await page.waitForTimeout(3000);
  await shot(page, `${w}x${h}-01-hero`);
  await walk(page, h);
  let n = 2;
  for (const section of SECTIONS) {
    await scrollTo(page, section, w >= 1024 ? 100 : 84);
    await page.waitForTimeout(1100);
    await shot(page, `${w}x${h}-${String(n++).padStart(2, "0")}-${section.slice(1)}`);
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) problems.push(`${w}x${h}: ${overflow}px of sideways overflow`);
  await context.close();
}

// 2. Interactive states, on a phone and a laptop
for (const [w, h] of [
  [390, 844],
  [1440, 900],
]) {
  const { context, page } = await open(w, h);
  await page.waitForTimeout(2500);
  const prefix = `state-${w}`;

  if (w < 1024) {
    await page.click(".mnav-button");
    await page.waitForTimeout(800);
    await shot(page, `${prefix}-menu-open`);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(600);
  }
  await walk(page, h);

  // The four service zones
  const blocks = await page.$$eval(".service", (els) => els.map((el) => el.dataset.service));
  for (const id of blocks) {
    if (w >= 1024) {
      await scrollTo(page, `.service[data-service="${id}"]`, h * 0.4);
      await page.waitForTimeout(1300);
      await shot(page, `${prefix}-services-${id}`);
    } else {
      await scrollTo(page, `#car-${id}`, h * 0.3);
      await page.waitForTimeout(1400);
      await shot(page, `${prefix}-services-${id}`, `#car-${id}`);
    }
  }

  // The sun film stack, part way through
  await scrollTo(page, ".benefits", -Math.round(h * 0.9));
  await page.waitForTimeout(900);
  await shot(page, `${prefix}-sunfilm-stack-mid`);

  // The shade guide on each zone
  await scrollTo(page, "#shade-guide", 90);
  await page.waitForTimeout(800);
  const zones = page.locator("#shade-guide [role=radio]");
  for (let i = 0; i < (await zones.count()); i++) {
    await zones.nth(i).click();
    await page.waitForTimeout(700);
    await shot(page, `${prefix}-shade-zone-${i + 1}`, "#shade-guide");
  }

  // Scratch and heal
  await scrollTo(page, ".scratch-panel", 120);
  await page.waitForTimeout(700);
  await shot(page, `${prefix}-scratch-1-before`, ".scratch");
  await page.locator(".scratch-controls button").nth(0).click();
  await page.waitForTimeout(900);
  await shot(page, `${prefix}-scratch-2-scratched`, ".scratch");
  await page.locator(".scratch-controls button").nth(1).click();
  await page.waitForTimeout(550);
  await shot(page, `${prefix}-scratch-3-healing`, ".scratch");
  await page.waitForTimeout(1800);
  await shot(page, `${prefix}-scratch-4-healed`, ".scratch");

  // Both compare sliders at 20, 50 and 80%
  const compares = page.locator("figure.compare");
  for (let i = 0; i < (await compares.count()); i++) {
    const figure = compares.nth(i);
    await figure.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1800);
    const knob = figure.locator(".compare-knob");
    await knob.focus();
    await knob.press("Home");
    for (const [steps, pct] of [
      [2, 20],
      [3, 50],
      [3, 80],
    ]) {
      for (let s = 0; s < steps; s++) await knob.press("PageUp");
      await page.waitForTimeout(800);
      const now = await knob.getAttribute("aria-valuenow");
      if (Number(now) !== pct) problems.push(`${prefix} compare ${i + 1}: expected ${pct}%, slider says ${now}`);
      await shot(page, `${prefix}-compare-${i + 1}-${pct}`, `figure.compare >> nth=${i}`);
    }
  }
  await context.close();
}

// 3. Reduced motion and script off
for (const [w, h] of [
  [390, 844],
  [1440, 900],
]) {
  const reduced = await open(w, h, { reduced: true });
  await reduced.page.waitForTimeout(1200);
  await shot(reduced.page, `reduced-${w}-hero`);
  await scrollTo(reduced.page, "#process", 90);
  await reduced.page.waitForTimeout(900);
  await shot(reduced.page, `reduced-${w}-process`);
  await reduced.context.close();

  const nojs = await open(w, h, { js: false });
  await shot(nojs.page, `nojs-${w}-hero`);
  await scrollTo(nojs.page, "#faq", 90);
  await shot(nojs.page, `nojs-${w}-faq`);
  await nojs.context.close();
}

// 4. Keyboard pass: every Tab stop must land on something visible with a focus ring
{
  const { context, page } = await open(1440, 900);
  await page.waitForTimeout(2500);
  const stops = [];
  const inspect = () =>
    page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const label = (el.getAttribute("aria-label") || el.textContent || el.getAttribute("href") || el.tagName).replace(/\s+/g, " ").trim().slice(0, 50);
      const ring = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0;
      const visible = r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && cs.visibility !== "hidden" && cs.opacity !== "0";
      return { tag: el.tagName.toLowerCase(), label, ring, visible };
    });
  for (let i = 0; i < 80; i++) {
    await page.keyboard.press("Tab");
    let info = await inspect();
    if (!info) break;
    // Some stops slide in (the skip link): look again once their transition has run.
    if (!info.visible) {
      await page.waitForTimeout(300);
      info = await inspect();
    }
    stops.push(info);
    if (!info.visible) problems.push(`keyboard stop ${i + 1} (${info.tag} "${info.label}") is not visible`);
    if (!info.ring) problems.push(`keyboard stop ${i + 1} (${info.tag} "${info.label}") has no focus ring`);
  }
  if (!/skip/i.test(stops[0]?.label ?? "")) problems.push(`first Tab stop is "${stops[0]?.label}", not the skip link`);
  await writeFile(path.join(out, "keyboard.txt"), stops.map((s, i) => `${String(i + 1).padStart(2)} ${s.tag.padEnd(7)} ${s.label}`).join("\n") + "\n");
  await context.close();
}

await browser.close();
console.log(`${files.length} screenshots in ${out}; keyboard order in ${path.join(out, "keyboard.txt")}`);
if (problems.length) {
  console.log(`${problems.length} problem(s):`);
  for (const p of problems) console.log(`  x ${p}`);
  process.exit(1);
}
console.log("No console errors, no sideways overflow, every keyboard stop visible with a focus ring.");
