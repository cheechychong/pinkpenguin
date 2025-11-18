const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const sourceDir = path.resolve("images");
const outputDir = path.resolve("images/webp");
const allowedExt = new Set([".jpg", ".jpeg", ".png"]);
const quality = 100;

async function ensureOutputDir() {
  await fs.mkdir(outputDir, { recursive: true });
}

async function convertFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!allowedExt.has(ext)) return;
  const basename = path.basename(file, ext);
  const inputPath = path.join(sourceDir, file);
  const outputPath = path.join(outputDir, `${basename}.webp`);
  await sharp(inputPath).webp({ quality }).toFile(outputPath);
  return outputPath;
}

(async () => {
  await ensureOutputDir();
  const entries = await fs.readdir(sourceDir);
  const results = await Promise.all(entries.map(convertFile));
  const created = results.filter(Boolean);
  console.log(`Converted ${created.length} image(s) to WebP at quality ${quality}.`);
})().catch((err) => {
  console.error("WebP conversion failed:", err);
  process.exit(1);
});
