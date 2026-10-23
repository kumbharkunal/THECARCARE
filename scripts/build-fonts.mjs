// Builds the site's Archivo: the variable font from google/fonts, cut to the axis ranges the
// design uses (wdth 62 to 100, wght 400 to 800) and to the characters below, as WOFF2. Google
// serves the full variable font whatever range is asked for (88 KB for Latin); this one is under
// half that, and it loads alongside the hero photo. Usage: npm run fonts
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import subsetFont from "subset-font";

const SOURCE_URL = "https://raw.githubusercontent.com/google/fonts/main/ofl/archivo/Archivo%5Bwdth%2Cwght%5D.ttf";
const CACHE = path.join(".cache", "fonts", "Archivo-VF.ttf");
const OUT = path.join("assets", "fonts", "Archivo-Latin-VF.woff2");

// Basic Latin, a few Latin-1 symbols (no-break space, copyright, registered, degree, plus-minus,
// middle dot, half, multiply), general punctuation (curly quotes, bullets, ellipsis), the rupee
// sign, trade mark, arrows and minus. The copy has no accented letters; a typed one falls back to
// the system face for that glyph alone, and leaving them out saves about 15 KB.
const RANGES = [
  [0x20, 0x7e],
  [0xa0, 0xa0],
  [0xa9, 0xa9],
  [0xae, 0xae],
  [0xb0, 0xb1],
  [0xb7, 0xb7],
  [0xbd, 0xbd],
  [0xd7, 0xd7],
  [0x2010, 0x2027],
  [0x2030, 0x203a],
  [0x20b9, 0x20b9],
  [0x2122, 0x2122],
  [0x2190, 0x2193],
  [0x2212, 0x2212],
];
const text = RANGES.flatMap(([from, to]) => Array.from({ length: to - from + 1 }, (_, i) => String.fromCodePoint(from + i))).join("");

if (!existsSync(CACHE)) {
  console.log(`Downloading ${SOURCE_URL}`);
  const response = await fetch(SOURCE_URL);
  if (!response.ok) throw new Error(`Font download failed: ${response.status}`);
  await mkdir(path.dirname(CACHE), { recursive: true });
  await writeFile(CACHE, Buffer.from(await response.arrayBuffer()));
}

const source = await readFile(CACHE);
const subset = await subsetFont(source, text, {
  targetFormat: "woff2",
  variationAxes: {
    wght: { min: 400, max: 800 },
    wdth: { min: 62, max: 100 },
  },
});
await writeFile(OUT, subset);
console.log(`${OUT}: ${(subset.length / 1024).toFixed(1)} KB (source ${(source.length / 1024).toFixed(0)} KB, ${text.length} characters)`);
