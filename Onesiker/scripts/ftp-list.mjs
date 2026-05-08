#!/usr/bin/env node
// Helper: connects to the production FTP and prints the directory tree.
// Use this to figure out the correct FTP_REMOTE_DATA_DIR for sync-prod-data.mjs.
//
// Usage: npm run ftp-list           (lists from FTP root, depth 2)
//        npm run ftp-list -- www    (lists starting from /www, depth 2)

import 'dotenv/config';
import { Client } from 'basic-ftp';

const { FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_SECURE = 'true' } = process.env;

if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD) {
  console.error('[ftp-list] Missing FTP_HOST / FTP_USER / FTP_PASSWORD in .env');
  process.exit(1);
}

const startPath = process.argv[2] || '/';
const maxDepth = 2;

const client = new Client();
client.ftp.verbose = false;

async function walk(path, depth) {
  if (depth > maxDepth) return;
  let entries;
  try {
    entries = await client.list(path);
  } catch (err) {
    console.log(`${'  '.repeat(depth)}[!] cannot list ${path}: ${err.message}`);
    return;
  }
  for (const e of entries) {
    const indent = '  '.repeat(depth);
    const tag = e.isDirectory ? '📁' : '📄';
    const size = e.isFile ? ` (${e.size} B)` : '';
    console.log(`${indent}${tag} ${e.name}${size}`);
    if (e.isDirectory && depth < maxDepth) {
      const nextPath = path === '/' ? `/${e.name}` : `${path}/${e.name}`;
      await walk(nextPath, depth + 1);
    }
  }
}

try {
  await client.access({
    host: FTP_HOST,
    user: FTP_USER,
    password: FTP_PASSWORD,
    secure: FTP_SECURE !== 'false',
  });
  console.log(`[ftp-list] Connected to ${FTP_HOST}`);
  console.log(`[ftp-list] Listing from ${startPath} (depth ${maxDepth}):\n`);
  await walk(startPath, 0);
  console.log('\n[ftp-list] Look for a folder containing layout.json, news.json, etc.');
  console.log('[ftp-list] Then set FTP_REMOTE_DATA_DIR in .env to that path (no leading /).');
} catch (err) {
  console.error('[ftp-list] Failed:', err.message);
  process.exit(1);
} finally {
  client.close();
}
