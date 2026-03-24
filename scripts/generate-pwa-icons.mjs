import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "icons");

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#059669"/>
  <path
    d="M120 264 L216 360 L392 168"
    fill="none"
    stroke="#ffffff"
    stroke-width="36"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>`;

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const buf = Buffer.from(svg);
  await sharp(buf).resize(192, 192).png().toFile(path.join(outDir, "icon-192.png"));
  await sharp(buf).resize(512, 512).png().toFile(path.join(outDir, "icon-512.png"));
  console.log("Wrote public/icons/icon-192.png, icon-512.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
