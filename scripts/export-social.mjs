// npm run social
// Writes the official full-colour Instagram, Facebook and WhatsApp marks from theSVG
// (@thesvg/icons, MIT) to public/social/. Their internal ids collide (Instagram's gradients
// and Facebook's clipPath both use "a"), so each file gets prefixed ids and the site renders
// them with <img>. Shapes and colours are untouched.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { optimize } from "svgo";
import instagram from "@thesvg/icons/instagram";
import facebook from "@thesvg/icons/facebook";
import whatsapp from "@thesvg/icons/whatsapp";

const OUT = path.join(process.cwd(), "public", "social");
await mkdir(OUT, { recursive: true });

for (const icon of [instagram, facebook, whatsapp]) {
  const { data } = optimize(icon.svg, {
    multipass: false,
    plugins: [
      { name: "prefixIds", params: { prefix: icon.slug, delim: "-" } },
      "removeComments",
      "removeMetadata",
    ],
  });
  await writeFile(path.join(OUT, `${icon.slug}.svg`), `${data}\n`);
  console.log(`  ${icon.slug}.svg (${icon.title}, #${icon.hex}, ${icon.license})`);
}
