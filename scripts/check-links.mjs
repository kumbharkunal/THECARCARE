// Checks every wa.me, tel: and mailto: link on the rendered page, decodes each WhatsApp
// message, follows in-page anchors, and sends a test enquiry through the builder.
// Usage: node scripts/check-links.mjs [url]   (default http://localhost:3000, server running)
import { chromium } from "playwright";
import { site, WA_PHONE } from "../content/site.ts";

const url = process.argv[2] ?? "http://localhost:3000";
const DASHES = /[–—]/;
const digits = (s) => s.replace(/\D/g, "");
const errors = [];
const fail = (msg) => errors.push(msg);

// The config must agree with itself before the page can agree with it.
const phones = site.contact.phones;
for (const phone of phones) {
  if (digits(phone.label) !== digits(phone.href)) fail(`phone label ${phone.label} does not match ${phone.href}`);
  if (!/^tel:\+91\d{10}$/.test(phone.href)) fail(`phone href is not +91 and 10 digits: ${phone.href}`);
}
if (digits(phones[0].href) !== WA_PHONE) fail(`WhatsApp number ${WA_PHONE} is not the primary phone ${phones[0].label}`);
const telAllowed = new Set(phones.map((p) => p.href));

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const links = await page.$$eval("a[href]", (as) =>
  as.map((a) => ({
    href: a.getAttribute("href"),
    label: (a.getAttribute("aria-label") || a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 48),
    target: a.getAttribute("target"),
    rel: a.getAttribute("rel") || "",
  })),
);

const wa = [];
for (const link of links) {
  const { href } = link;
  if (link.target === "_blank" && !/noopener/.test(link.rel)) fail(`target=_blank without noopener: ${href}`);
  if (href.startsWith("https://wa.me/")) {
    const parsed = new URL(href);
    const number = parsed.pathname.slice(1);
    const text = parsed.searchParams.get("text") ?? "";
    if (number !== WA_PHONE) fail(`wa.me number ${number} (expected ${WA_PHONE}): ${link.label}`);
    if (!text) fail(`wa.me link without a message: ${link.label}`);
    if (/undefined|null|NaN/.test(text)) fail(`wa.me message has a placeholder value: ${text}`);
    if (DASHES.test(text)) fail(`wa.me message has an em or en dash: ${text}`);
    wa.push({ label: link.label, text });
  } else if (href.startsWith("tel:")) {
    if (!telAllowed.has(href)) fail(`unknown tel: link ${href}`);
  } else if (href.startsWith("mailto:")) {
    if (href !== `mailto:${site.contact.email}`) fail(`unexpected mailto: ${href}`);
  } else if (/^\/?#/.test(href)) {
    const id = href.slice(href.indexOf("#") + 1);
    if (id && id !== "top" && !(await page.$(`[id="${id}"]`))) fail(`anchor ${href} has no target`);
  }
}

// The enquiry builder opens WhatsApp itself; catch the URL it would open.
await page.evaluate(() => {
  window.__opened = [];
  window.open = (u) => {
    window.__opened.push(String(u));
    return null;
  };
});
const form = page.locator(".enquiry-form");
await form.scrollIntoViewIfNeeded();
await form.getByLabel(site.visit.enquiry.car.label).fill("Hyundai Creta");
await form.getByRole("button", { name: "PPF", exact: true }).click();
await form.getByRole("button", { name: "Ceramic coating", exact: true }).click();
await form.getByRole("radio", { name: site.visit.enquiry.where.doorstep }).click();
await form.getByLabel(site.visit.enquiry.area.label).fill("Kothrud");
await form.getByLabel(site.visit.enquiry.notes.label).fill("Matte black, weekend please");
await form.getByRole("button", { name: site.visit.enquiry.submit }).click();
const opened = await page.evaluate(() => window.__opened);
if (opened.length !== 1) fail(`enquiry opened ${opened.length} windows`);
else {
  const sent = new URL(opened[0]);
  const text = sent.searchParams.get("text") ?? "";
  if (sent.origin + sent.pathname !== `https://wa.me/${WA_PHONE}`) fail(`enquiry went to ${sent.origin}${sent.pathname}`);
  for (const part of ["Hyundai Creta", "PPF", "Ceramic coating", "Kothrud", "Matte black"]) {
    if (!text.includes(part)) fail(`enquiry message is missing "${part}"`);
  }
  if (DASHES.test(text)) fail("enquiry message has an em or en dash");
  wa.push({ label: "Enquiry builder (test entry)", text });
}
await browser.close();

const count = (p) => links.filter((l) => l.href.startsWith(p)).length;
console.log(`Links on ${url}: ${links.length} (wa.me ${count("https://wa.me/")}, tel ${count("tel:")}, mailto ${count("mailto:")})\n`);
console.log("WhatsApp messages:");
for (const { label, text } of wa) console.log(`  [${label}]\n    ${text.replace(/\n/g, "\n    ")}`);
if (errors.length) {
  console.log(`\n${errors.length} problem(s):`);
  for (const e of errors) console.log(`  x ${e}`);
  process.exit(1);
}
console.log("\nAll links check out.");
