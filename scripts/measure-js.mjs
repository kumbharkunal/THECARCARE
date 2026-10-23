// Measures what a phone downloads: compressed JavaScript before the load event (the first-load
// budget is about 200 KB), what arrives after it (idle-loaded motion plugins), and the other
// resource types for context. Run against a production server: npm run build && npm start.
// Usage: node scripts/measure-js.mjs [url]   (default http://localhost:3000)
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:3000";
const BUDGET_KB = 200;

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const page = await context.newPage();
const cdp = await context.newCDPSession(page);
await cdp.send("Network.enable");
await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });

const requests = new Map();
let loaded = false;
cdp.on("Network.responseReceived", ({ requestId, type, response }) => {
  requests.set(requestId, { type, url: response.url, bytes: 0, afterLoad: loaded });
});
cdp.on("Network.loadingFinished", ({ requestId, encodedDataLength }) => {
  const r = requests.get(requestId);
  if (r) r.bytes = encodedDataLength;
});
page.on("load", () => {
  loaded = true;
});

await page.goto(url, { waitUntil: "load" });
await page.waitForLoadState("networkidle");
await page.waitForTimeout(2500); // idle callbacks fetch the scroll plugins after first paint
await browser.close();

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const all = [...requests.values()];
const sum = (list) => list.reduce((a, r) => a + r.bytes, 0);
const scripts = all.filter((r) => r.type === "Script");
const before = scripts.filter((r) => !r.afterLoad);
const after = scripts.filter((r) => r.afterLoad);

console.log(`JavaScript on ${url} (compressed, as transferred)`);
console.log(`  before load: ${kb(sum(before))} in ${before.length} files (budget ${BUDGET_KB} KB)`);
console.log(`  after load:  ${kb(sum(after))} in ${after.length} files`);
for (const r of [...scripts].sort((a, b) => b.bytes - a.bytes).slice(0, 12)) {
  console.log(`    ${kb(r.bytes).padStart(9)}  ${r.afterLoad ? "late " : "first"}  ${r.url.replace(/^https?:\/\/[^/]+/, "").slice(0, 90)}`);
}
const byType = {};
for (const r of all) byType[r.type] = (byType[r.type] ?? 0) + r.bytes;
console.log("All resources by type:");
for (const [type, bytes] of Object.entries(byType).sort((a, b) => b[1] - a[1])) console.log(`  ${type.padEnd(12)} ${kb(bytes)}`);
console.log(`  ${"total".padEnd(12)} ${kb(sum(all))}`);

if (sum(before) / 1024 > BUDGET_KB) {
  console.log(`\nOver budget by ${kb(sum(before) - BUDGET_KB * 1024)}.`);
  process.exit(1);
}
