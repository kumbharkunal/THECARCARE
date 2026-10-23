import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { site } from "@/content/site";
import { roofPoints } from "@/components/art/Chevrons";

export const alt = site.meta.ogAlt;
export const size = { width: 1200, height: 630 };
// JPEG, not PNG: a photo as PNG is ~600 KB, too heavy for WhatsApp link previews.
export const contentType = "image/jpeg";

const INK = "#0E1A33";
const BLUE = "#4066AF";
const GREEN = "#12964B";
const LAVENDER = "#A4B0DA";

// The hero's roof mapped onto the photo in assets/og-base.jpg (1000px wide at 200, 67;
// see scripts/optimize-images.mjs): the hero geometry times 0.625, plus that offset.
const ROOF = { cx: 825, apexY: 112, halfWidth: 363, legEnd: 380, stroke: 7 };

/** Link preview (WhatsApp, Instagram, search): the hero in one frame. */
export default async function OpengraphImage() {
  return new Response(await renderPreview(), { headers: { "Content-Type": contentType } });
}

// Cached so the image is rendered once at build, not on every request.
async function renderPreview() {
  "use cache";
  cacheLife("max");
  const [font, base, mark] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Archivo-ExtraCondensed-ExtraBold.ttf")),
    readFile(join(process.cwd(), "assets/og-base.jpg")),
    readFile(join(process.cwd(), "public/brand/logo-mark.png")),
  ]);
  const dataUri = (buf: Buffer, type: string) => `data:${type};base64,${buf.toString("base64")}`;
  const roof = roofPoints(ROOF);

  const png = await new ImageResponse(
    (
      <div style={{ position: "relative", display: "flex", width: "100%", height: "100%", fontFamily: "Archivo", color: INK }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser */}
        <img src={dataUri(base, "image/jpeg")} width={1200} height={630} alt="" style={{ position: "absolute", left: 0, top: 0 }} />
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <linearGradient id="fade" x1="0" y1={roof.innerTop} x2="0" y2={roof.innerEnd} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor={BLUE} />
              <stop offset="0.55" stopColor={BLUE} />
              <stop offset="0.85" stopColor={LAVENDER} />
              <stop offset="1" stopColor={LAVENDER} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline points={roof.outer} fill="none" stroke={GREEN} strokeWidth={ROOF.stroke} strokeLinejoin="miter" />
          <polyline points={roof.inner} fill="none" stroke="url(#fade)" strokeWidth={ROOF.stroke / 2} strokeLinejoin="miter" />
        </svg>

        <div style={{ position: "absolute", left: 72, top: 60, display: "flex", alignItems: "center", gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser */}
          <img src={dataUri(mark, "image/png")} width={60} height={60} alt="" />
          <div style={{ fontSize: 36, color: BLUE, letterSpacing: 0.5 }}>{site.wordmark}</div>
        </div>

        <div style={{ position: "absolute", left: 72, top: 220, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 34 }}>{site.hero.lead}</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 14, fontSize: 78, lineHeight: 0.92 }}>
            {site.hero.title.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </div>

        <div style={{ position: "absolute", left: 72, bottom: 58, fontSize: 28, color: BLUE }}>{site.meta.ogLine}</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Archivo", data: font, weight: 800, style: "normal" }] },
  ).arrayBuffer();
  const jpeg = await sharp(Buffer.from(png)).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
  return new Uint8Array(jpeg);
}
