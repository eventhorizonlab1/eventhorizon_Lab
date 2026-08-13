import 'dotenv/config';
import { Client } from 'basic-ftp';
async function run() {
  const c = new Client();
  await c.access({host: process.env.FTP_HOST, user: process.env.FTP_USER, password: process.env.FTP_PASSWORD});
  const list = await c.list('www/admin/js/modules');
  console.log(list.find(f => f.name === 'pages.js'));
  c.close();
}
run();
