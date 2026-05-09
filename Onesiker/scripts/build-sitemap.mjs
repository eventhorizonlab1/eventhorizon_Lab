#!/usr/bin/env node
// Generates public/sitemap.xml from the live data files.
//
// Inputs (read after sync-prod-data has run):
//   - public/data/layout.json       — visible sections + their id
//   - public/data/custom_pages.json — extra pages exposed by the back-office
//
// Output:
//   - public/sitemap.xml            — overwritten
//
// Why ancres SPA even though Google ignores them:
//   Google normalises `/#bio` to `/` so it adds nothing for SEO. Bing and
//   Yandex *do* sometimes use them as section signals, and there's no cost
//   to listing them. The lastmod tag uses the most recent mtime among the
//   data files so the sitemap reflects the actual freshness of the content
//   (not just the build date).

import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const dataDir = resolve(projectRoot, 'public', 'data');
const sitemapPath = resolve(projectRoot, 'public', 'sitemap.xml');

const SITE_URL = 'https://onesiker.org';

function readJson(name) {
  try {
    return JSON.parse(readFileSync(resolve(dataDir, name), 'utf8'));
  } catch {
    return null;
  }
}

function latestMtime(files) {
  let max = 0;
  for (const f of files) {
    try {
      const t = statSync(resolve(dataDir, f)).mtimeMs;
      if (t > max) max = t;
    } catch {
      /* file missing — skip */
    }
  }
  return max ? new Date(max) : new Date();
}

function isoDate(d) {
  return d.toISOString().split('T')[0];
}

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const layout = readJson('layout.json');
const customPages = readJson('custom_pages.json');

const buildDate = isoDate(latestMtime(['layout.json', 'custom_pages.json', 'news.json', 'artworks.json', 'bio.json', 'contact.json']));

const entries = [];

// 1. Homepage
entries.push(
  urlEntry({
    loc: `${SITE_URL}/`,
    lastmod: buildDate,
    changefreq: 'weekly',
    priority: '1.0',
  }),
);

// 2. Each visible section becomes a #anchor entry.
//    Google will dedupe to /, but Bing/Yandex pick up the structure.
const sections = layout?.sections ?? [];
for (const s of sections) {
  if (!s.visible || !s.id) continue;
  entries.push(
    urlEntry({
      loc: `${SITE_URL}/#${encodeURIComponent(s.id)}`,
      lastmod: buildDate,
      changefreq: 'weekly',
      priority: '0.7',
    }),
  );
}

// 3. Custom pages declared via the back-office (object keyed by id).
if (customPages && typeof customPages === 'object' && !Array.isArray(customPages)) {
  for (const id of Object.keys(customPages)) {
    if (!id) continue;
    entries.push(
      urlEntry({
        loc: `${SITE_URL}/#${encodeURIComponent(id)}`,
        lastmod: buildDate,
        changefreq: 'monthly',
        priority: '0.6',
      }),
    );
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

writeFileSync(sitemapPath, xml, 'utf8');
console.log(`[build-sitemap] Wrote ${entries.length} URL(s) to public/sitemap.xml (lastmod ${buildDate})`);
