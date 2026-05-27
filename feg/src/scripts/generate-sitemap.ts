// // scripts/generate-sitemap.ts
// import { writeFileSync } from 'node:fs';
// import { resolve } from 'node:path';
// import { routes } from '../src/routes';
//
// const SITE_URL = process.env.VITE_SITE_URL ?? 'https://yoursite.com';
// const today = new Date().toISOString().split('T')[0];
//
// const urls = routes
//     .filter(r => r.includeInSitemap !== false)
//     .map(r => `  <url>
//     <loc>${SITE_URL}${r.path}</loc>
//     <lastmod>${today}</lastmod>
//     <changefreq>${r.changefreq ?? 'monthly'}</changefreq>
//     <priority>${r.priority ?? 0.5}</priority>
//   </url>`)
//     .join('\n');
//
// const xml = `<?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
// ${urls}
// </urlset>
// `;
//
// writeFileSync(resolve('public/sitemap.xml'), xml);
// console.log(`✓ Sitemap generated with ${routes.filter(r => r.includeInSitemap !== false).length} URLs`);