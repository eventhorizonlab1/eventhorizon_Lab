import 'dotenv/config';
import { Client } from 'basic-ftp';
import { resolve } from 'node:path';

const { FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_SECURE = 'false' } = process.env;

async function deploy() {
  const client = new Client();
  client.ftp.verbose = true;
  try {
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
      secure: FTP_SECURE !== 'false',
    });
    console.log(`Connected to ${FTP_HOST}`);
    
    // Upload index.html
    let localPath = resolve(process.cwd(), 'public/admin/index.html');
    let remotePath = 'www/admin/index.html';
    console.log(`Uploading ${localPath} to ${remotePath}`);
    await client.uploadFrom(localPath, remotePath);

    // Upload pages.js
    localPath = resolve(process.cwd(), 'public/admin/js/modules/pages.js');
    remotePath = 'www/admin/js/modules/pages.js';
    console.log(`Uploading ${localPath} to ${remotePath}`);
    await client.uploadFrom(localPath, remotePath);

    // Upload admin.css
    localPath = resolve(process.cwd(), 'public/admin/css/admin.css');
    remotePath = 'www/admin/css/admin.css';
    console.log(`Uploading ${localPath} to ${remotePath}`);
    await client.uploadFrom(localPath, remotePath);
    
    console.log('Upload complete!');
    
  } catch (err) {
    console.error('Failed:', err);
  } finally {
    client.close();
  }
}
deploy();
