#!/usr/bin/env node
// Builds every page of rakshahospital.com into the repo root (the folder you upload to the server).
//
//   node src/build.mjs            build all pages, sitemap.xml and robots.txt
//   node src/build.mjs --check    build, then verify that every internal link and image exists
//
// No dependencies - plain Node 18+.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, usedIcons } from './lib/core.mjs';
import { SITE, BRANCH_LIST } from './data/site.mjs';
import { SPECIALITIES } from './data/specialities.mjs';
import { blogs } from './lib/data.mjs';
import { groupPage } from './pages/group.mjs';
import { homePage, aboutPage, doctorsPage, specialitiesPage, specialityPage } from './pages/main.mjs';
import { healthCheckPage, appointmentPage, contactPage, galleryPage, insightsPage, feedbackPage, blogsPage, blogPage, errorPage } from './pages/more.mjs';

const pages = [];
const add = (p, { sitemap = true, priority = 0.6 } = {}) => pages.push({ ...p, sitemap, priority });

add(groupPage(), { priority: 1.0 });
for (const b of BRANCH_LIST) {
  add(homePage(b), { priority: 0.9 });
  add(aboutPage(b), { priority: 0.7 });
  add(doctorsPage(b), { priority: 0.8 });
  add(specialitiesPage(b), { priority: 0.8 });
  add(appointmentPage(b), { priority: 0.8 });
  add(contactPage(b), { priority: 0.7 });
  add(healthCheckPage(b), { priority: 0.7 });
  add(blogsPage(b), { priority: 0.6 });
  add(galleryPage(b), { priority: 0.5 });
  if (b.paths.insights) add(insightsPage(b), { priority: 0.4 });
  if (b.paths.feedback) add(feedbackPage(b), { priority: 0.4 });
  for (const s of SPECIALITIES[b.id]) add(specialityPage(b, s), { priority: 0.7 });
  const posts = blogs(b.id);
  for (const post of posts) add(blogPage(b, post, posts), { priority: 0.5 });
  add(errorPage(b, 404), { sitemap: false });
  if (b.paths.serverError) add(errorPage(b, 500), { sitemap: false });
}

// ---------------------------------------------------------------- write pages
for (const p of pages) {
  const out = path.join(ROOT, p.file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, p.html);
}

// ---------------------------------------------------------------- sitemap + robots
const today = new Date().toISOString().slice(0, 10);
const loc = (file) => `${SITE.origin}/${encodeURI(file.replace(/(^|\/)index\.html$/, '$1'))}`;
const sitemap = (list) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${list.map((p) => `  <url><loc>${loc(p.file)}</loc><lastmod>${today}</lastmod><priority>${p.priority.toFixed(1)}</priority></url>`).join('\n')}
</urlset>
`;
const listed = pages.filter((p) => p.sitemap);
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap(listed));
for (const b of BRANCH_LIST) fs.writeFileSync(path.join(ROOT, b.dir, 'sitemap.xml'), sitemap(listed.filter((p) => p.file.startsWith(`${b.dir}/`))));
fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *
Allow: /
Disallow: /src/

Sitemap: ${SITE.origin}/sitemap.xml
`);

console.log(`Built ${pages.length} pages (${listed.length} in sitemap.xml), ${usedIcons.size} icons used.`);

// ---------------------------------------------------------------- link check
if (process.argv.includes('--check')) {
  let bad = 0;
  const exists = (f) => fs.existsSync(f) && (fs.statSync(f).isFile() || fs.existsSync(path.join(f, 'index.html')));
  for (const p of pages) {
    const dir = path.dirname(path.join(ROOT, p.file));
    const refs = [...p.html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1])
      .concat([...p.html.matchAll(/\ssrcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((x) => x.trim().split(/\s+/)[0])));
    const ids = new Set([...p.html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    for (const raw of refs) {
      const ref = raw.replace(/&amp;/g, '&');
      if (/^(https?:|mailto:|tel:|data:)/.test(ref)) continue;
      if (ref.startsWith('#')) { if (ref.length > 1 && !ids.has(ref.slice(1))) { console.log(`  ${p.file}: missing anchor ${ref}`); bad++; } continue; }
      const clean = decodeURI(ref.split('#')[0].split('?')[0]);
      const target = clean.startsWith('/') ? path.join(ROOT, clean) : path.resolve(dir, clean);
      if (!exists(target)) { console.log(`  ${p.file}: broken link ${ref}`); bad++; }
    }
    for (const m of p.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try { JSON.parse(m[1]); } catch { console.log(`  ${p.file}: invalid JSON-LD`); bad++; }
    }
    if ((p.html.match(/<h1[\s>]/g) || []).length !== 1) { console.log(`  ${p.file}: expected exactly one <h1>`); bad++; }
  }
  console.log(bad ? `Link check: ${bad} problem(s).` : 'Link check: all internal links, images and anchors resolve.');
  if (bad) process.exitCode = 1;
}
