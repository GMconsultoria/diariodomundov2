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

  // Generate sitemap.xml
  const origin = 'https://www.diariodomundo.com';
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Home
  xml += `  <url><loc>${origin}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n`;
  
  // Static Pages
  ['/sobre', '/politica-de-privacidade', '/contato', '/termos'].forEach(page => {
    xml += `  <url><loc>${origin}${page}</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>\n`;
  });
  
  // Categories
  const CATEGORIES = ["Política", "Economia", "Investimentos", "Ciência e Tecnologia", "Curiosidade"];
  CATEGORIES.forEach(category => {
    const slug = category.toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    xml += `  <url><loc>${origin}/categoria/${encodeURIComponent(slug)}</loc><changefreq>daily</changefreq><priority>0.7</priority></url>\n`;
  });
  
  try {
    const allPosts = await db.getAllPostsForSitemap();

    allPosts.forEach(post => {
      const date = new Date(post.publishedAt || post.createdAt).toISOString().split('T')[0];
      // Format URLs in Portuguese category format, e.g. /noticias/slug
      xml += `  <url><loc>${origin}/noticias/${post.slug}</loc><lastmod>${date}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
    });
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
  }

  xml += `</urlset>`;
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
  console.log('Created public/sitemap.xml');
  
  process.exit(0);
}

generateSeoFiles();
