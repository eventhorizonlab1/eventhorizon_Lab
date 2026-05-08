#!/usr/bin/env node
// Pulls JSON files from the production FTP into public/data/ before a Vite build.
// Without this step, `npm run build` would copy the stale local public/data/ into
// dist/, overwriting any content the client has edited via the back-office in prod.
//
// Skips silently with a warning if FTP credentials aren't configured — that lets
// devs build locally without prod access.

import 'dotenv/config';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from 'basic-ftp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const localDataDir = resolve(projectRoot, 'public/data');

const {
  FTP_HOST,
  FTP_USER,
  FTP_PASSWORD,
  FTP_SECURE = 'true',
  FTP_REMOTE_DATA_DIR = 'www/data',
  SYNC_PROD_DATA_SKIP,
} = process.env;

if (SYNC_PROD_DATA_SKIP === 'true') {
  console.log('[sync-prod-data] SYNC_PROD_DATA_SKIP=true, skipping.');
  process.exit(0);
}

if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD) {
  console.warn(
    '[sync-prod-data] FTP credentials missing (FTP_HOST/FTP_USER/FTP_PASSWORD). ' +
      'Skipping prod data sync — local public/data/ will be used as-is. ' +
      'Set SYNC_PROD_DATA_SKIP=true to silence this warning.'
  );
  process.exit(0);
}

const client = new Client();
client.ftp.verbose = false;

try {
  await client.access({
    host: FTP_HOST,
    user: FTP_USER,
    password: FTP_PASSWORD,
    secure: FTP_SECURE !== 'false',
  });
  console.log(`[sync-prod-data] Connected to ${FTP_HOST}`);

  await client.cd(FTP_REMOTE_DATA_DIR);
  const files = await client.list();
  const jsonFiles = files.filter((f) => f.isFile && f.name.endsWith('.json'));

  if (jsonFiles.length === 0) {
    console.warn(`[sync-prod-data] No JSON files found in ${FTP_REMOTE_DATA_DIR}.`);
    process.exit(0);
  }

  await mkdir(localDataDir, { recursive: true });

  for (const file of jsonFiles) {
    const localPath = resolve(localDataDir, file.name);
    const chunks = [];
    const writable = new (await import('node:stream')).Writable({
      write(chunk, _enc, cb) {
        chunks.push(chunk);
        cb();
      },
    });
    await client.downloadTo(writable, file.name);
    await writeFile(localPath, Buffer.concat(chunks));
    console.log(`[sync-prod-data] ↓ ${file.name} (${file.size} B)`);
  }

  console.log(`[sync-prod-data] Synced ${jsonFiles.length} file(s) into public/data/`);
} catch (err) {
  console.error('[sync-prod-data] Failed:', err.message);
  if (process.env.SYNC_PROD_DATA_STRICT === 'true') {
    process.exit(1);
  }
  console.error('[sync-prod-data] Continuing anyway. Set SYNC_PROD_DATA_STRICT=true to fail builds on sync errors.');
} finally {
  client.close();
}
