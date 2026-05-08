import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const basePublic = path.join(__dirname, '../public/Atelier');
const MAX_SIZE = 900 * 1024;

const files = [
  {
    src: '/Users/olivierlavergne/Desktop/PHOTOS A AJOUTER SITE/DRIPS/8_Onesiker_WYNWOODWATERFALL_116X89.jpg',
    dest: path.join(basePublic, 'Drips/8_Onesiker_WYNWOODWATERFALL_116X89.webp'),
  },
  {
    src: '/Users/olivierlavergne/Desktop/PHOTOS A AJOUTER SITE/THROW UPS/8_Onesiker_BEEF_116X81.jpg',
    dest: path.join(basePublic, 'Throw_up/8_Onesiker_BEEF_116X81.webp'),
  },
  {
    src: '/Users/olivierlavergne/Desktop/PHOTOS A AJOUTER SITE/THROW UPS/9_Onesiker_CLASH 116X81.jpg',
    dest: path.join(basePublic, 'Throw_up/9_Onesiker_CLASH_116X81.webp'),
  },
  {
    src: '/Users/olivierlavergne/Desktop/PHOTOS A AJOUTER SITE/THROW UPS/10_Onesiker_WIN_OR_LOOSE_130X97.jpg',
    dest: path.join(basePublic, 'Throw_up/10_Onesiker_WIN_OR_LOOSE_130X97.webp'),
  },
];

async function convertToWebP(src, dest, quality = 82) {
  await sharp(src).webp({ quality }).toFile(dest);
  return fs.statSync(dest).size;
}

async function main() {
  for (const { src, dest } of files) {
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

    const status = size < 1024 * 1024 ? '✅' : '⚠️';
    console.log(`${status} ${path.basename(dest)} → ${(size / 1024).toFixed(0)}KB (q=${quality})`);
  }
  console.log('\nDone!');
}

main().catch(console.error);
