#!/usr/bin/env node
// Generates a `_mobile.webp` companion (≤800px wide, q=75) for every Hero image.
// Run after uploading a new hero photo via the back-office, e.g. `npm run hero:mobile`.
// Hero.tsx and the LCP preload in index.html expect these companions to exist.

import { readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const heroDir = resolve(__dirname, '..', 'public', 'Hero');

const files = readdirSync(heroDir).filter(
  (f) => f.endsWith('.webp') && !f.endsWith('_mobile.webp'),
);

let totalIn = 0;
let totalOut = 0;

for (const f of files) {
  const src = join(heroDir, f);
  const dst = src.replace(/\.webp$/, '_mobile.webp');
  const meta = await sharp(src).metadata();
  await sharp(src)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(dst);
  const inSize = statSync(src).size;
  const outSize = statSync(dst).size;
  totalIn += inSize;
  totalOut += outSize;
  const dims = `${meta.width}x${meta.height}`;
  console.log(`${f.padEnd(48)} ${dims.padEnd(11)} ${(inSize / 1024).toFixed(0).padStart(4)} KB → ${(outSize / 1024).toFixed(0).padStart(4)} KB`);
}

console.log('───');
console.log(`Total: ${(totalIn / 1024).toFixed(0)} KB → mobile total: ${(totalOut / 1024).toFixed(0)} KB`);
console.log(`Saved on hero (mobile-only): ${((totalIn - totalOut) / 1024).toFixed(0)} KB`);
