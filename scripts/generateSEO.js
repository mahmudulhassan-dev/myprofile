import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://botpori.amanaflow.com';

const generateRobots = () => {
    const robotsContent = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: ${BASE_URL}/sitemap.xml
`;
    fs.writeFileSync(path.join(__dirname, '../public/robots.txt'), robotsContent);
    console.log('✅ robots.txt generated');
};

const generateSitemap = () => {
    const pages = [
        '',
        '/login',
        '/projects',
        '/blog',
        '/services'
    ];

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `
  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

    fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), sitemapContent);
    console.log('✅ sitemap.xml generated');
};

generateRobots();
generateSitemap();
