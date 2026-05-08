import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = '/Users/olivierlavergne/Desktop/PHOTOS A AJOUTER SITE/COLLABS';
const destDir = path.join(__dirname, '../public/Atelier/Collabs');

const files = [
  '16_Onesiker_SUPERSTOP_ONESIKER_LEREFLET_100X130.PNG',
  '17_Onesiker_SUPERSTOP_ONESIKER_THE MESSAGE_36X51.jpg',
  '18_Onesiker_SUPERSTOP_ONESIKER_THE_MESSAGE_120X100.PNG',
  '19_Onesiker_SUPERSTOP_ONESIKER_WALLBREAK_130x100.PNG',
];

const MAX_SIZE = 900 * 1024; // 900KB target

async function convertToWebP(srcFile, destFile, quality = 82) {
  await sharp(srcFile)
    .webp({ quality })
    .toFile(destFile);
  const stats = fs.statSync(destFile);
  return stats.size;
}

async function main() {
  for (const filename of files) {
    const src = path.join(srcDir, filename);
    // Sanitize filename: replace spaces with underscores, change extension
    const destName = filename
      .replace(/ /g, '_')
      .replace(/\.(jpg|jpeg|png|PNG|JPG|JPEG)$/i, '.webp');
    const dest = path.join(destDir, destName);

    if (!fs.existsSync(src)) {
      console.error(`❌ Source not found: ${src}`);
      continue;
    }

    let quality = 82;
    let size = await convertToWebP(src, dest, quality);

    while (size > MAX_SIZE && quality > 55) {
      quality -= 5;
      size = await convertToWebP(src, dest, quality);
      console.log(`   ↩ Retry q=${quality} → ${(size / 1024).toFixed(0)}KB`);
    }

    const sizeKB = (size / 1024).toFixed(0);
    const status = size < 1024 * 1024 ? '✅' : '⚠️';
    console.log(`${status} ${destName} → ${sizeKB}KB (q=${quality})`);
  }
  console.log('\nDone!');
}

main().catch(console.error);
