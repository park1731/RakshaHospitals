// Derived data: joins the hand-written data files with the content harvested from the previous site.
import { readJSON, fragment } from './core.mjs';
import { BLOG_META } from '../data/content.mjs';
import { SPECIALITIES } from '../data/specialities.mjs';
import { DOCTORS } from '../data/doctors.mjs';

const index = readJSON('content/index.json');
const legacy = readJSON('content/legacy-meta.json');

export const HOME_BLOCKS = { ec: readJSON('content/ec-home.json'), kudlu: readJSON('content/kudlu-home.json') };

/** <title>/<meta description>/<meta keywords> of the page as it was on the previous site (keeps search snippets stable). */
export function legacyMeta(file) {
  const m = legacy[file] || {};
  return { title: m.title || '', description: m.description || '', keywords: m.keywords || '' };
}

const clip = (s, n) => (s.length <= n ? s : `${s.slice(0, s.lastIndexOf(' ', n))}…`);

export function blogs(branchId) {
  if (branchId === 'ec') {
    return Object.keys(index.blogCardsEC).map((slug) => {
      const b = index.blogs[slug], card = index.blogCardsEC[slug], meta = BLOG_META[slug];
      return {
        slug, title: card.cardTitle || b.heading, heading: b.heading, lede: b.lede, blurb: card.blurb || b.lede,
        cover: meta.coverEc || meta.cover, category: meta.categoryEc || meta.category,
        body: `blogs/${slug}.html`, legacy: `electroniccity/blogs/${slug}.html`,
      };
    });
  }
  const order = [...Object.keys(index.blogCardsKudlu), ...Object.keys(index.kudluBlogs).filter((s) => !index.blogCardsKudlu[s])];
  return order.map((slug) => {
    const b = index.kudluBlogs[slug], card = index.blogCardsKudlu[slug] || {}, meta = BLOG_META[slug];
    const category = !b.category || b.category === 'Heart Surgery' ? meta.category : b.category;
    return {
      slug, title: card.cardTitle || b.heading, heading: card.cardTitle && slug === 'Heart_Health' ? card.cardTitle : b.heading,
      lede: card.blurb || '', blurb: card.blurb || clip(b.description || '', 120),
      cover: meta.cover, category, body: `kudlu-blogs/${slug}.html`, legacy: `kudlu/blogs/${slug}.html`,
    };
  });
}

/** Everything needed to render one speciality page. */
export function specialityContent(branchId, s) {
  if (branchId === 'ec') {
    const h = index.ecSpecialities[s.slug];
    return { lede: h.lede, html: fragment(`ec-specialities/${s.slug}.html`), boxes: [], legacy: `electroniccity/specialities/${s.slug}.html` };
  }
  const name = s.content || s.slug;
  const h = index.kudluDiseases[name];
  const seen = new Set();
  const boxes = (s.boxes || h.boxes).filter((b) => (seen.has(b.title) ? false : seen.add(b.title)));
  const html = fragment(`kudlu-diseases/${name}.html`);
  return { lede: s.blurb, html, boxes, legacy: `kudlu/Diseases/${name}.html` };
}

export const doctorsFor = (key) => DOCTORS.filter((d) => d.specs.includes(key));

/** The matching speciality in the other branch (for the branch switch), if there is one. */
export function twinSpeciality(otherBranchId, key) {
  return SPECIALITIES[otherBranchId].find((s) => s.key === key) || null;
}
