// npm run images
// 1. Optimises the AI images in raw-images/ into public/images/<slot>.webp and records
//    width, height and a tiny blur placeholder in content/images.generated.json.
// 2. Takes the client's original logo files (brand/reference/, white background) and removes
//    the white with an exact matte, so the logo looks identical on light grounds.
// 3. Builds the icon set (app/icon.png, app/apple-icon.png, app/favicon.ico) from the mark.
// Originals are never modified. Missing inputs are skipped; existing outputs are kept.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const RAW = path.join(root, "raw-images");
const OUT = path.join(root, "public", "images");
const MANIFEST = path.join(root, "content", "images.generated.json");
const LOGO_SRC = path.join(root, "brand", "reference");
const BRAND_OUT = path.join(root, "public", "brand");
const APP = path.join(root, "app");

const SLOTS = [
  "hero-car-wide",
  "hero-car-tall",
  "sunfilm-fitting",
  "interior-sunlight",
  "safety-glass",
  "glare-drive",
  "ppf-fitting",
  "paint-surface",
  "ceramic-gloss",
  "ceramic-beading",
  "doorstep-fitting",
];
const MAX_SIDE = 2560;
const QUALITY = 82;
const PORCELAIN = { r: 246, g: 248, b: 252 };

async function blurDataURL(input) {
  const buf = await sharp(input).resize(24, 24, { fit: "inside" }).webp({ quality: 45 }).toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

async function optimiseImages() {
  await mkdir(OUT, { recursive: true });
  const previous = existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, "utf8")) : {};
  const manifest = {};

  for (const slot of SLOTS) {
    const raw = path.join(RAW, `${slot}.png`);
    const out = path.join(OUT, `${slot}.webp`);

    if (existsSync(raw)) {
      const info = await sharp(raw)
        .resize(MAX_SIDE, MAX_SIDE, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6, smartSubsample: true })
        .toFile(out);
      manifest[slot] = {
        src: `/images/${slot}.webp`,
        width: info.width,
        height: info.height,
        blurDataURL: await blurDataURL(raw),
      };
      console.log(`  ${slot}: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB`);
    } else if (existsSync(out)) {
      // Fresh clones have no raw-images/: keep what is already optimised and committed.
      manifest[slot] = previous[slot] ?? {
        src: `/images/${slot}.webp`,
        ...(await sharp(out).metadata().then(({ width, height }) => ({ width, height }))),
        blurDataURL: await blurDataURL(out),
      };
      console.log(`  ${slot}: kept existing output`);
    } else {
      console.log(`  ${slot}: missing (placeholder will render)`);
    }
  }

  await mkdir(path.dirname(MANIFEST), { recursive: true });
  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
}

// Exact white matte: alpha comes from the distance to white, and the colour is un-multiplied,
// so compositing the result over white returns the original pixel. Colours at least `opaqueAt`
// away from white stay fully opaque, so the logo also holds on tinted surfaces.
async function matteWhite(file, opaqueAt = 150, floor = 6) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const out = Buffer.alloc(width * height * 4);
  let minX = width, minY = height, maxX = -1, maxY = -1;

  for (let p = 0, q = 0, i = 0; p < data.length; p += 3, q += 4, i++) {
    const r = data[p], g = data[p + 1], b = data[p + 2];
    const dist = Math.max(255 - r, 255 - g, 255 - b);
    if (dist < floor) continue; // transparent
    const a = Math.min(1, dist / opaqueAt);
    const un = (c) => Math.max(0, Math.min(255, Math.round(255 - (255 - c) / a)));
    out[q] = un(r);
    out[q + 1] = un(g);
    out[q + 2] = un(b);
    out[q + 3] = Math.round(a * 255);
    if (out[q + 3] > 10) {
      const x = i % width, y = (i / width) | 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  // Trim to the artwork with a small even margin.
  const pad = Math.round(Math.max(maxX - minX, maxY - minY) * 0.02);
  const left = Math.max(0, minX - pad), top = Math.max(0, minY - pad);
  const right = Math.min(width - 1, maxX + pad), bottom = Math.min(height - 1, maxY + pad);
  return sharp(out, { raw: { width, height, channels: 4 } })
    .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

// Square icon with the mark centred on a transparent or flat ground.
async function squareIcon(mark, size, { inset = 0.08, background } = {}) {
  const inner = Math.round(size * (1 - inset * 2));
  const fitted = await sharp(mark).resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background: background ?? { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: fitted, gravity: "centre" }])
    .png({ palette: true, quality: 90, effort: 10, compressionLevel: 9 })
    .toBuffer();
}

// ICO container holding PNG frames (supported by every current browser).
function ico(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  const dir = Buffer.alloc(16 * frames.length);
  let offset = header.length + dir.length;
  frames.forEach(({ size, buf }, i) => {
    const o = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, o);
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(buf.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += buf.length;
  });
  return Buffer.concat([header, dir, ...frames.map((f) => f.buf)]);
}

async function logosAndIcons() {
  const markSrc = path.join(LOGO_SRC, "logo-original-mark.png");
  const lockupSrc = path.join(LOGO_SRC, "logo-original-lockup.png");
  const markOut = path.join(BRAND_OUT, "logo-mark.png");
  await mkdir(BRAND_OUT, { recursive: true });

  if (existsSync(markSrc)) {
    const mark = await matteWhite(markSrc);
    await writeFile(markOut, mark);
    const meta = await sharp(mark).metadata();
    console.log(`  logo-mark.png: ${meta.width}x${meta.height}`);
  } else {
    console.log("  logo mark source missing, keeping existing public/brand/logo-mark.png");
  }
  if (existsSync(lockupSrc)) {
    const lockup = await matteWhite(lockupSrc);
    await writeFile(path.join(BRAND_OUT, "logo-lockup.png"), lockup);
    const meta = await sharp(lockup).metadata();
    console.log(`  logo-lockup.png: ${meta.width}x${meta.height}`);
  }

  if (!existsSync(markOut)) return;
  const mark = await readFile(markOut);
  await writeFile(path.join(APP, "icon.png"), await squareIcon(mark, 512, { inset: 0.06 }));
  await writeFile(
    path.join(APP, "apple-icon.png"),
    await squareIcon(mark, 180, { inset: 0.14, background: { ...PORCELAIN, alpha: 1 } }),
  );
  const frames = [];
  for (const size of [16, 32, 48]) frames.push({ size, buf: await squareIcon(mark, size, { inset: 0.02 }) });
  await writeFile(path.join(APP, "favicon.ico"), ico(frames));
  console.log("  icons: app/icon.png, app/apple-icon.png, app/favicon.ico");
}

// Social preview base (assets/og-base.jpg, read by app/opengraph-image.tsx): the hero photo,
// 1000px wide at (200, 67) on a 1200x630 porcelain canvas, feathered on the left and top
// edges so the headline column sits on clean ground. The route draws the roof and type on top.
const OG = { width: 1200, height: 630, photoWidth: 1000, left: 200, top: 67 };

async function socialBase() {
  const raw = path.join(RAW, "hero-car-wide.png");
  const src = existsSync(raw) ? raw : path.join(OUT, "hero-car-wide.webp");
  if (!existsSync(src)) {
    console.log("  hero-car-wide missing, keeping existing assets/og-base.jpg");
    return;
  }
  const photo = await sharp(src).resize(OG.photoWidth).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = photo.info;
  const feather = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <linearGradient id="h" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#fff" stop-opacity="0"/>
          <stop offset="0.14" stop-color="#fff"/>
          <stop offset="1" stop-color="#fff"/>
        </linearGradient>
        <linearGradient id="v" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#000"/>
          <stop offset="0.2" stop-color="#fff"/>
          <stop offset="0.93" stop-color="#fff"/>
          <stop offset="1" stop-color="#000"/>
        </linearGradient>
        <mask id="m"><rect width="100%" height="100%" fill="url(#v)"/></mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#h)" mask="url(#m)"/>
    </svg>`,
  );
  const feathered = await sharp(photo.data, { raw: photo.info })
    .composite([{ input: feather, blend: "dest-in" }])
    .png()
    .toBuffer();
  const out = path.join(root, "assets", "og-base.jpg");
  const info = await sharp({ create: { width: OG.width, height: OG.height, channels: 3, background: PORCELAIN } })
    .composite([{ input: feathered, left: OG.left, top: OG.top }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(out);
  console.log(`  assets/og-base.jpg: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB`);
}

console.log("Images");
await optimiseImages();
console.log("Logos and icons");
await logosAndIcons();
console.log("Social preview");
await socialBase();
console.log("Done.");
