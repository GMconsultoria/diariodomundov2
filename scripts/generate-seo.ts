import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as db from '../api/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSeoFiles() {
  console.log('Generating SEO files...');
  
  const publicDir = path.resolve(__dirname, '../client/public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Generate robots.txt
  const robotsTxt = `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

Sitemap: https://www.diariodomundo.com/sitemap.xml`;
  
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt);
  console.log('Created public/robots.txt');

  // The sitemap.xml generation has been removed from this build script
  // because we now use the dynamic route in api/_core/index.ts
  // This ensures new articles appear automatically without requiring a full redeploy.
  
  process.exit(0);
}

generateSeoFiles();
