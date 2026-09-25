import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve('public/wedding');
const output = path.join(root, 'web');
await fs.mkdir(output, { recursive: true });
const files = (await fs.readdir(root, { recursive: true })).filter(file => /\.jpe?g$/i.test(file));
for (const file of files) {
  const name = `${path.parse(file).name}.webp`;
  await sharp(path.join(root, file)).rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 }).toFile(path.join(output, name));
  const { size } = await fs.stat(path.join(output, name));
  console.log(`${name}: ${Math.round(size / 1024)} KB`);
}
