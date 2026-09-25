import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("public");
const outDir = path.join(root, "optimized");
const albumOut = path.join(outDir, "album");

await fs.promises.mkdir(albumOut, { recursive: true });

const jobs = [
  { src: "TOM09566.JPG", dest: "hero-desktop.webp", width: 1920, quality: 78 },
  { src: "TOM00185.JPG", dest: "hero-mobile.webp", width: 1080, quality: 76 },
  { src: "TOM09594.JPG", dest: "groom.webp", width: 800, quality: 78 },
  { src: "TOM09594.JPG", dest: "groom-lg.webp", width: 1600, quality: 80 },
  { src: "TOM09117.JPG", dest: "bride.webp", width: 800, quality: 78 },
  { src: "TOM09117.JPG", dest: "bride-lg.webp", width: 1600, quality: 80 },
  { src: "TOM00201.JPG", dest: "save-date-bg.webp", width: 1400, quality: 76 },
];

for (const job of jobs) {
  const input = path.join(root, job.src);
  const output = path.join(outDir, job.dest);
  await sharp(input)
    .rotate()
    .resize({ width: job.width, withoutEnlargement: true })
    .webp({ quality: job.quality })
    .toFile(output);
  const size = (fs.statSync(output).size / 1024).toFixed(0);
  console.log(`${job.dest}: ${size} KB`);
}

const albumDir = path.join(root, "compressed_album");
for (const file of fs.readdirSync(albumDir)) {
  if (!/\.jpe?g$/i.test(file)) continue;
  const output = path.join(albumOut, file.replace(/\.jpe?g$/i, ".webp"));
  await sharp(path.join(albumDir, file))
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 76 })
    .toFile(output);
  const size = (fs.statSync(output).size / 1024).toFixed(0);
  console.log(`album/${path.basename(output)}: ${size} KB`);
}
