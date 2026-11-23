// Small helpers shared by every template: escaping, links, icons, images, content fragments.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SRC = path.join(ROOT, 'src');

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Empty values are dropped, except alt="" which marks an image as decorative for screen readers.
export const attrs = (o) => Object.entries(o).filter(([k, v]) => v !== false && v != null && (v !== '' || k === 'alt')).map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`)).join('');
export const cx = (...a) => a.filter(Boolean).join(' ');
export const readJSON = (rel) => JSON.parse(fs.readFileSync(path.join(SRC, rel), 'utf8'));

// ---------------------------------------------------------------- links
// Every page is described by its path from the site root, e.g. "electroniccity/doctors.html".
// Directory indexes are linked as "electroniccity/" (never ".../index.html") so there is no redirect hop.
export function rel(fromFile, to) {
  // Error pages are served at arbitrary URLs, so they pass a path starting with "/" and get absolute links.
  if (fromFile.startsWith('/')) return `/${to.replace(/^\//, '')}`;
  const m = /^([^?#]*)(.*)$/.exec(to);
  const target = m[1], tail = m[2];
  const fromDir = fromFile.split('/').slice(0, -1);
  const parts = target.split('/');
  let i = 0;
  while (i < fromDir.length && i < parts.length - 1 && fromDir[i] === parts[i]) i++;
  const out = '../'.repeat(fromDir.length - i) + parts.slice(i).join('/');
  return (out === '' ? './' : out) + tail;
}
export const pageUrl = (branch, key) => `${branch.dir}/${branch.paths[key]}`;

// ---------------------------------------------------------------- icons (inline SVG)
const iconCache = new Map();
export const usedIcons = new Set();
export function icon(name, cls = '') {
  if (!iconCache.has(name)) {
    const file = path.join(SRC, 'icons', `${name}.svg`);
    if (!fs.existsSync(file)) throw new Error(`Missing icon: src/icons/${name}.svg`);
    const svg = fs.readFileSync(file, 'utf8').trim();
    const inner = /<svg[^>]*>([\s\S]*)<\/svg>/.exec(svg)[1];
    const filled = /fill="currentColor"/.test(svg.slice(0, svg.indexOf('>')));
    iconCache.set(name, { inner, filled });
  }
  usedIcons.add(name);
  const { inner, filled } = iconCache.get(name);
  const base = filled ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  return `<svg class="${cx('icon', cls)}" viewBox="0 0 24 24" ${base} aria-hidden="true" focusable="false">${inner}</svg>`;
}

// ---------------------------------------------------------------- images
const sizeCache = new Map();
function webpSize(file) {
  if (sizeCache.has(file)) return sizeCache.get(file);
  const b = fs.readFileSync(file);
  const kind = b.toString('ascii', 12, 16);
  let s;
  if (kind === 'VP8 ') s = { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
  else if (kind === 'VP8L') { const v = b.readUInt32LE(21); s = { w: (v & 0x3fff) + 1, h: ((v >>> 14) & 0x3fff) + 1 }; }
  else if (kind === 'VP8X') s = { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
  else throw new Error(`Not a WebP file: ${file}`);
  sizeCache.set(file, s);
  return s;
}
export function imgSize(key) { return webpSize(path.join(ROOT, 'assets', 'img', `${key}.webp`)); }

/** <img> for a photo in assets/img. Uses the "-sm" variant in srcset when it exists. */
export function img(ctx, key, alt, { cls = '', sizes = '(min-width: 900px) 50vw, 100vw', eager = false, extra = {} } = {}) {
  const file = path.join(ROOT, 'assets', 'img', `${key}.webp`);
  if (!fs.existsSync(file)) throw new Error(`Missing image: assets/img/${key}.webp (run python3 src/tools/images.py)`);
  const { w, h } = webpSize(file);
  const src = rel(ctx.path, `assets/img/${key}.webp`);
  const smFile = path.join(ROOT, 'assets', 'img', `${key}-sm.webp`);
  let srcset = null;
  if (fs.existsSync(smFile)) {
    const sm = webpSize(smFile);
    if (sm.w < w) srcset = `${rel(ctx.path, `assets/img/${key}-sm.webp`)} ${sm.w}w, ${src} ${w}w`;
  }
  return `<img${attrs({ class: cls, src, srcset, sizes: srcset ? sizes : null, width: w, height: h, alt, loading: eager ? 'eager' : 'lazy', decoding: 'async', fetchpriority: eager ? 'high' : null, ...extra })}>`;
}

export function avatar(ctx, id, name, cls = 'avatar') {
  return img(ctx, `doctors/${id}`, name, { cls, sizes: '160px' });
}

// ---------------------------------------------------------------- content fragments
export function fragment(relPath) {
  const file = path.join(SRC, 'content', relPath);
  if (!fs.existsSync(file)) throw new Error(`Missing content: src/content/${relPath}`);
  return fs.readFileSync(file, 'utf8')
    .replace(/<img data-legacy-src[^>]*>\s*/g, '')
    .replace(/<ul>\s+/g, '<ul>')
    .trim();
}

/** Split a fragment into sections at each <h2> (or <h3> when there is no <h2>). */
export function splitSections(html, tag = 'h2') {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g');
  const out = []; let last = 0, m, title = null;
  while ((m = re.exec(html))) {
    const body = html.slice(last, m.index).trim();
    if (title !== null || body) out.push({ title, body });
    title = m[1]; last = re.lastIndex;
  }
  const tail = html.slice(last).trim();
  if (title !== null || tail) out.push({ title, body: tail });
  return out;
}

/** Content sits under the page <h1>. Re-level its headings so they never skip a level (h1 > h2 > h3 ...). */
export function normalizeHeadings(html) {
  let prev = 1;
  return html.replace(/<h([2-6])>([\s\S]*?)<\/h\1>/g, (m, level, inner) => {
    const want = Math.min(Number(level), prev + 1);
    prev = want;
    return `<h${want}>${inner}</h${want}>`;
  });
}

export const stripTags = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
export const readingMinutes = (html) => Math.max(1, Math.round(stripTags(html).split(' ').length / 200));

// ---------------------------------------------------------------- misc
export function assetVersion(relPath) {
  return crypto.createHash('sha1').update(fs.readFileSync(path.join(ROOT, relPath))).digest('hex').slice(0, 8);
}
export const jsonLd = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
export const tel = (n) => `tel:${n}`;
export const wa = (number, text) => `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export function parseDate(s) {
  const d = new Date(`${s} UTC`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}
