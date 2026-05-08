import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = '/Users/olivierlavergne/Desktop/PHOTOS A AJOUTER SITE/COLLABS';
const destDir = path.join(__dirname, '../public/Atelier/Collabs');

const files = [
  '11_Onesiker_BOXVINCENT_ONESIKER_IN_MY_WORLD_105X84.jpg',
  '12_Onesiker_SUPERSTOP_ONESIKER_ESSENCE_130X100.PNG',
  '13_Onesiker_SUPERSTOP_ONESIKER_FOND_ET_FORME_120X100.PNG',
  '14_Onesiker_SUPERSTOP_ONESIKER_FOND_ET_FORME_51x36.PNG',
  '15_Onesiker_SUPERSTOP_ONESIKER_INCENDIE_VISUEL_36X51.PNG',
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
    const destName = filename.replace(/\.(jpg|jpeg|png|PNG|JPG)$/i, '.webp');
    const dest = path.join(destDir, destName);

    if (!fs.existsSync(src)) {
      console.error(`❌ Source not found: ${src}`);
      continue;
    }

    let quality = 82;
    let size = await convertToWebP(src, dest, quality);
    
    // If still too big, reduce quality progressively
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
