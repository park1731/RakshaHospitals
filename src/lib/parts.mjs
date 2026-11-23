// Reusable page sections and cards.
import { SITE, BRANCH_LIST } from '../data/site.mjs';
import { DOCTORS, DEPARTMENTS } from '../data/doctors.mjs';
import { SPECIALITIES, APPOINTMENT_DEPARTMENTS } from '../data/specialities.mjs';
import { PACKAGES } from '../data/content.mjs';
import { esc, attrs, cx, rel, pageUrl, icon, img, avatar, tel, wa } from './core.mjs';
import { specUrl, blogUrl } from './layout.mjs';

const L = (ctx, to) => esc(rel(ctx.path, to));

// ---------------------------------------------------------------- headings
export function sectionHead({ eyebrow, title, text, link, center = false, tag = 'h2' }) {
  return `<div class="${cx('section-head', center && 'section-head--center', link && 'section-head--split')}">
    <div>
      ${eyebrow ? `<p class="eyebrow">${icon('plus')}${esc(eyebrow)}</p>` : ''}
      <${tag}>${title}</${tag}>
      ${text ? `<p class="section-head__text">${text}</p>` : ''}
    </div>
    ${link ? `<a class="link-arrow" href="${link.href}">${esc(link.label)}${icon('arrow-right')}</a>` : ''}
  </div>`;
}

export function breadcrumbs(ctx) {
  if (!ctx.crumbs || ctx.crumbs.length < 2) return '';
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${ctx.crumbs.map((c, i) => (i === ctx.crumbs.length - 1
    ? `<li aria-current="page">${esc(c.name)}</li>`
    : `<li><a href="${L(ctx, c.url)}">${esc(c.name)}</a>${icon('chevron-right')}</li>`)).join('')}</ol></nav>`;
}

export function pageHero(ctx, { eyebrow, title, lede, actions = '', visual = '', badge = '', compact = false }) {
  return `<section class="${cx('page-hero', visual && 'page-hero--visual', compact && 'page-hero--compact')}">
  <div class="container page-hero__in">
    <div class="page-hero__text">
      ${breadcrumbs(ctx)}
      ${badge}
      ${eyebrow ? `<p class="eyebrow">${icon('plus')}${esc(eyebrow)}</p>` : ''}
      <h1>${title}</h1>
      ${lede ? `<p class="lede">${lede}</p>` : ''}
      ${actions ? `<div class="actions">${actions}</div>` : ''}
    </div>
    ${visual ? `<div class="page-hero__visual">${visual}</div>` : ''}
  </div>
</section>`;
}

export const bookBtn = (ctx, b, { label = 'Book Appointment', query = '', cls = 'btn btn--primary' } = {}) =>
  `<a class="${cls}" href="${L(ctx, pageUrl(b, 'appointment') + query)}">${icon('calendar-check')}${esc(label)}</a>`;
export const callBtn = (b, { label, cls = 'btn btn--sos-outline' } = {}) =>
  `<a class="${cls}" href="${tel(b.phone)}">${icon('phone-call')}${esc(label || `Call ${b.phoneDisplay}`)}</a>`;
export const waBtn = (b, { label = 'WhatsApp us', cls = 'btn btn--wa', text = '' } = {}) =>
  `<a class="${cls}" href="${wa(b.whatsapp, text)}" target="_blank" rel="noopener">${icon('whatsapp')}${esc(label)}</a>`;

// ---------------------------------------------------------------- cards
export function specCard(ctx, b, s) {
  return `<a class="spec-card" href="${L(ctx, specUrl(b, s))}">
    <span class="tile">${icon(s.icon)}</span>
    <span class="spec-card__body"><strong>${esc(s.name)}</strong><span>${esc(s.blurb)}</span></span>
    <span class="spec-card__go" aria-hidden="true">${icon('arrow-up-right')}</span>
  </a>`;
}

export function doctorCard(ctx, b, d) {
  const search = [d.name, d.role, d.quals, ...d.depts].join(' ').toLowerCase();
  return `<article class="doc-card"${attrs({ 'data-depts': d.depts.join('|'), 'data-search': search, id: d.id })}>
    <div class="doc-card__top">
      ${avatar(ctx, d.id, d.name)}
      <div>
        <h3>${esc(d.name)}</h3>
        <p class="doc-card__role">${esc(d.role)}</p>
      </div>
    </div>
    ${d.quals ? `<p class="doc-card__quals">${icon('graduation-cap')}<span>${esc(d.quals)}</span></p>` : ''}
    ${d.bio ? `<p class="doc-card__bio">${esc(d.bio)}</p>` : ''}
    <div class="doc-card__foot">
      <a class="btn btn--soft btn--sm" href="${L(ctx, `${pageUrl(b, 'appointment')}?doctor=${d.id}`)}">${icon('calendar-plus')}Book consultation</a>
    </div>
  </article>`;
}

// ---------------------------------------------------------------- doctors on the home pages
// Two presentations of the same section, switched by screen width in site.css:
//   phones and small tablets -> teamDirectory(): consultants grouped by department, as an accordion
//   wide screens             -> doctorShowcase(): a strict grid of identical cards

// An icon for each department, and the key of the speciality page that describes it (where one exists).
const DEPT_INFO = {
  'General Medicine': ['stethoscope', 'general-medicine'],
  'Cardiology & Diabetology': ['heart-pulse', 'cardiology'],
  'Obstetrics & Gynaecology': ['venus', 'obgyn'],
  'Orthopaedics & Spine': ['bone', 'orthopedics'],
  'Paediatrics': ['baby', 'pediatrics'],
  'General & Gastro Surgery': ['scissors', 'general-surgery'],
  'Urology': ['droplet', 'urology'],
  'Plastic Surgery': ['sparkles', null],
  'Dermatology': ['scan-face', 'dermatology'],
  'ENT': ['ear', 'ent'],
  'Psychiatry': ['brain-cog', 'psychiatry'],
};

/**
 * Consultants grouped by department (accordion: tap a department to see its doctors).
 *   bookAt  - the branch whose appointment form the "Book" buttons open
 *   pagesAt - the branches whose department pages are linked
 *   level   - heading level for the department names (3 or 4), so the page outline stays in order
 */
export function teamDirectory(ctx, { bookAt, pagesAt, level = 3 }) {
  const blocks = DEPARTMENTS.map((dept, i) => {
    const [ic, specKey] = DEPT_INFO[dept] || ['stethoscope', null];
    const docs = DOCTORS.filter((d) => d.depts.includes(dept));
    const pages = specKey ? pagesAt.map((b) => [b, SPECIALITIES[b.id].find((x) => x.key === specKey)]).filter(([, sp]) => sp) : [];
    let links = '';
    if (pages.length === 1) links = `<p class="team-dir__links"><a href="${L(ctx, specUrl(pages[0][0], pages[0][1]))}">About this department</a></p>`;
    else if (pages.length) links = `<p class="team-dir__links">Department page:${pages.map(([b, sp]) => `<a href="${L(ctx, specUrl(b, sp))}">${esc(b.name)}</a>`).join('')}</p>`;
    return `<button type="button" class="${cx('team-dir__tab', i === 0 && 'is-active')}" id="team-tab-${i}" aria-expanded="${i === 0}" aria-controls="team-panel-${i}">
        <span class="tile tile--sm">${icon(ic)}</span><span class="team-dir__name">${esc(dept)}</span><span class="team-dir__count">${docs.length}<span class="sr-only"> ${docs.length === 1 ? 'doctor' : 'doctors'}</span></span>${icon('chevron-down')}
      </button>
      <div class="${cx('team-dir__panel', i === 0 && 'is-active')}" id="team-panel-${i}" role="group" aria-labelledby="team-tab-${i}">
        <div class="${cx('team-dir__head', !pages.length && 'team-dir__head--bare')}">
          <span class="tile tile--sm">${icon(ic)}</span>
          <div><h${level}>${esc(dept)}</h${level}>${links}</div>
        </div>
        <ul class="team-dir__people">${docs.map((d) => `<li>
          ${avatar(ctx, d.id, d.name)}
          <div class="team-dir__who"><strong>${esc(d.name)}</strong><span>${esc(d.role)}</span></div>
          <a class="btn btn--soft btn--sm" href="${L(ctx, `${pageUrl(bookAt, 'appointment')}?doctor=${d.id}`)}" aria-label="Book consultation with ${esc(d.name)}">${icon('calendar-plus')}Book</a>
        </li>`).join('')}</ul>
      </div>`;
  });
  return `<div class="team-dir" data-team-dir>
      ${blocks.join('\n      ')}
    </div>`;
}

/** A strict grid of identical doctor cards: photo, name, speciality and one button. */
export function doctorShowcase(ctx, b, { count = 8 } = {}) {
  return `<ul class="doc-show">${DOCTORS.slice(0, count).map((d) => `<li class="doc-mini">
      ${avatar(ctx, d.id, d.name)}
      <div class="doc-mini__who"><h3>${esc(d.name)}</h3><p>${esc(d.role)}</p></div>
      <a class="btn btn--soft btn--sm" href="${L(ctx, `${pageUrl(b, 'appointment')}?doctor=${d.id}`)}" aria-label="Book consultation with ${esc(d.name)}">${icon('calendar-plus')}<span>Book<span class="doc-mini__long"> consultation</span></span></a>
    </li>`).join('')}</ul>`;
}

export function leaderCard(ctx, p) {
  return `<article class="leader-card">
    ${avatar(ctx, p.id, p.name, 'avatar avatar--lg')}
    <h3>${esc(p.name)}</h3>
    <p class="leader-card__role">${esc(p.role)}</p>
    <p>${esc(p.bio)}</p>
  </article>`;
}

export function facilityCard(ctx, f) {
  return `<article class="fac-card">
    <div class="fac-card__media">${img(ctx, f.photo, f.alt, { sizes: '(min-width: 1000px) 380px, (min-width: 640px) 50vw, 100vw' })}<span class="tile tile--float">${icon(f.icon)}</span></div>
    <div class="fac-card__body"><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p></div>
  </article>`;
}

/**
 * Health check package. With `fold: true` the list of tests collapses behind a "What's included" button on phones
 * (it is always shown on wider screens, and when JavaScript is unavailable).
 */
export function packageCard(ctx, b, p, { fold = false } = {}) {
  const body = p.tests
    ? `<ul class="checks">${p.tests.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`
    : `<dl class="pkg-groups">${p.groups.map(([g, items]) => `<div><dt>${esc(g)}</dt><dd>${items.map(esc).join(' · ')}</dd></div>`).join('')}</dl>`;
  const book = `<a class="${p.featured ? 'btn btn--primary' : 'btn btn--soft'} btn--block" href="${L(ctx, `${pageUrl(b, 'appointment')}?package=${p.id}&source=health-checkup`)}">${icon('calendar-check')}${p.price ? 'Book this package' : 'Enquire & book'}</a>`;
  const listId = `${p.id}-included`;
  return `<article class="${cx('pkg-card', p.featured && 'pkg-card--featured', fold && 'pkg-card--fold', fold && !p.price && 'pkg-card--noprice')}" id="${esc(p.id)}">
    ${p.featured ? `<span class="pkg-card__flag">${icon('star')}Most chosen</span>` : ''}
    <header>
      <span class="tile">${icon(p.icon)}</span>
      <div><h3>${esc(p.name)}</h3><p>${esc(p.for)}</p></div>
    </header>
    ${p.price ? `<p class="pkg-card__price">${esc(p.price)}</p>` : ''}
    ${fold ? `${book}
    <button type="button" class="pkg-card__toggle" data-pkg-toggle aria-expanded="false" aria-controls="${esc(listId)}">What’s included${icon('chevron-down')}</button>
    <div class="pkg-card__list" id="${esc(listId)}">${body}</div>` : `${body}
    ${book}`}
  </article>`;
}

export function blogCard(ctx, b, post) {
  return `<article class="blog-card">
    <a class="blog-card__media" href="${L(ctx, blogUrl(b, post.slug))}" tabindex="-1" aria-hidden="true">${img(ctx, `blog/${post.cover}`, '', { sizes: '(min-width: 1000px) 380px, (min-width: 640px) 50vw, 100vw' })}</a>
    <div class="blog-card__body">
      <span class="chip">${esc(post.category)}</span>
      <h3><a href="${L(ctx, blogUrl(b, post.slug))}">${esc(post.title)}</a></h3>
      <p>${esc(post.blurb)}</p>
      <span class="link-arrow" aria-hidden="true">Read article${icon('arrow-right')}</span>
    </div>
  </article>`;
}

export function whyGrid(items) {
  return `<ul class="why-grid">${items.map((w) => `<li><span class="tile tile--green">${icon(w.icon)}</span><div><h3>${esc(w.title)}</h3><p>${esc(w.text)}</p></div></li>`).join('')}</ul>`;
}

export function faqList(faqs) {
  return `<div class="faq">${faqs.map((f, i) => `<details name="faq"${i === 0 ? ' open' : ''}>
    <summary><span>${esc(f.q)}</span><span class="faq__icon" aria-hidden="true">${icon('plus')}</span></summary>
    <div class="faq__a"><p>${f.a.replace(/^<p>|<\/p>$/g, '')}</p></div>
  </details>`).join('')}</div>`;
}

// ---------------------------------------------------------------- contact / location
export function contactList(b, { hours = true } = {}) {
  return `<ul class="contact-list">
    <li>${icon('map-pin')}<div><strong>Address</strong><span>${b.address.lines.map(esc).join('<br>')}</span><small>${esc(b.landmarks)}</small></div></li>
    <li>${icon('phone-call')}<div><strong>24×7 emergency &amp; appointments</strong>${[{ tel: b.phone, display: b.phoneDisplay }, ...b.extraPhones].map((p) => `<a href="${tel(p.tel)}">${esc(p.display)}</a>`).join('')}</div></li>
    <li>${icon('mail')}<div><strong>Email</strong><a href="mailto:${b.email}">${esc(b.email)}</a></div></li>
    ${hours ? `<li>${icon('clock')}<div><strong>Hours</strong>${b.hours.map(([k, v]) => `<span><em>${esc(k)}:</em> ${esc(v)}</span>`).join('')}</div></li>` : ''}
  </ul>`;
}

export function mapFrame(b) {
  return `<div class="map"><iframe title="Map showing ${esc(b.fullName)}" src="${esc(b.mapEmbed)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>`;
}

export function locationSection(ctx, b, { title } = {}) {
  const other = BRANCH_LIST.find((x) => x.id !== b.id);
  return `<section class="section" id="find-us">
  <div class="container">
    ${sectionHead({ eyebrow: 'Find us', title: title || `Visit Raksha Hospital, ${esc(b.name)}`, text: esc(b.landmarks) + '.' })}
    <div class="location">
      ${mapFrame(b)}
      <div class="location__card">
        <h3>${esc(b.fullName)}</h3>
        ${contactList(b)}
        <div class="actions">
          <a class="btn btn--primary" href="${esc(b.mapLink)}" target="_blank" rel="noopener">${icon('navigation')}Get directions</a>
          ${callBtn(b, { label: 'Call now' })}
        </div>
        <a class="other-branch" href="${L(ctx, `${other.dir}/`)}">
          ${icon('building-2')}<span><small>Also in Bengaluru</small><strong>Raksha Hospital, ${esc(other.name)}</strong><span>${esc(other.address.short)}</span></span>${icon('arrow-right')}
        </a>
      </div>
    </div>
  </div>
</section>`;
}

export function bookBand(ctx, b, { title = 'Ready to see a doctor?', text = 'Send us your details and our team will confirm your appointment.', query = '' } = {}) {
  return `<section class="section section--tight">
  <div class="container">
    <div class="book-band">
      <div><h2>${esc(title)}</h2><p>${esc(text)}</p></div>
      <div class="actions">${bookBtn(ctx, b, { cls: 'btn btn--white', query })}${waBtn(b, { cls: 'btn btn--ghost-white' })}</div>
    </div>
  </div>
</section>`;
}

// ---------------------------------------------------------------- forms (sent via WhatsApp, no server needed)
const field = (label, control, { hint = '', required = false, wide = false } = {}) =>
  `<label class="${cx('field', wide && 'field--wide')}"><span class="field__label">${esc(label)}${required ? ' <b aria-hidden="true">*</b>' : ''}</span>${control}${hint ? `<small>${esc(hint)}</small>` : ''}</label>`;

function branchSelect(b) {
  return `<select name="branch" data-branch-select>${BRANCH_LIST.map((x) => `<option value="${esc(x.name)}" data-wa="${x.whatsapp}" data-phone="${x.phone}" data-phone-display="${esc(x.phoneDisplay)}"${x.id === b.id ? ' selected' : ''}>${esc(x.name)}</option>`).join('')}</select>`;
}

export function appointmentForm(ctx, b, { compact = false, id = 'appointment-form' } = {}) {
  const doctors = DOCTORS.map((d) => `<option value="${esc(d.name)}" data-id="${d.id}" data-aliases="${esc(d.aliases.join(' '))}">${esc(d.name)} — ${esc(d.role)}</option>`).join('');
  const depts = APPOINTMENT_DEPARTMENTS.map((d) => `<option>${esc(d)}</option>`).join('');
  const packages = Object.fromEntries(Object.values(PACKAGES).flatMap((p) => p.items.map((i) => [i.id, i.name])));
  return `<form class="${cx('form', compact && 'form--compact')}" id="${id}" data-wa-form="appointment" data-packages="${esc(JSON.stringify(packages))}" novalidate>
    <div class="form__grid">
      ${field('Full name', '<input type="text" name="name" autocomplete="name" required placeholder="Patient’s full name">', { required: true })}
      ${field('Phone number', '<input type="tel" name="phone" autocomplete="tel" inputmode="tel" pattern="[0-9+ \\-]{10,15}" placeholder="10-digit mobile number">')}
      ${field('Branch', branchSelect(b))}
      ${field('Department', `<select name="department"><option value="">Select department (optional)</option>${depts}</select>`)}
      ${field('Preferred doctor', `<select name="doctor"><option value="">Any available doctor</option>${doctors}</select>`)}
      ${field('Preferred date', '<input type="date" name="date" data-min-today>')}
      ${compact ? '' : field('Reason for visit', '<textarea name="reason" rows="3" placeholder="Briefly describe your symptoms or reason for the visit (optional)"></textarea>', { wide: true })}
    </div>
    <input type="hidden" name="package" value="">
    <p class="form__package" data-package-note hidden>${icon('clipboard-check')}<span></span></p>
    <p class="form__error" role="alert" hidden></p>
    <div class="form__foot">
      <button class="btn btn--wa btn--lg" type="submit">${icon('whatsapp')}Send on WhatsApp</button>
      <p>Opens WhatsApp with your request ready to send. Prefer to talk? Call <a href="${tel(b.phone)}" data-branch-phone>${esc(b.phoneDisplay)}</a>.</p>
    </div>
  </form>`;
}

export function messageForm(ctx, b) {
  return `<form class="form" id="contact-form" data-wa-form="contact" novalidate>
    <div class="form__grid">
      ${field('Full name', '<input type="text" name="name" autocomplete="name" required placeholder="Your name">', { required: true })}
      ${field('Phone number', '<input type="tel" name="phone" autocomplete="tel" inputmode="tel" pattern="[0-9+ \\-]{10,15}" placeholder="10-digit mobile number">')}
      ${field('Branch', branchSelect(b), { wide: true })}
      ${field('Message', '<textarea name="message" rows="5" required placeholder="Tell us how we can help you"></textarea>', { required: true, wide: true })}
    </div>
    <p class="form__error" role="alert" hidden></p>
    <div class="form__foot">
      <button class="btn btn--wa btn--lg" type="submit">${icon('whatsapp')}Send on WhatsApp</button>
      <p>Your message opens in WhatsApp, ready to send to our front desk.</p>
    </div>
  </form>`;
}

export function feedbackForm(ctx, b) {
  return `<form class="form" id="feedback-form" data-wa-form="feedback" novalidate>
    <div class="form__grid">
      ${field('Your name', '<input type="text" name="name" autocomplete="name" required placeholder="Your name">', { required: true })}
      ${field('Phone number', '<input type="tel" name="phone" autocomplete="tel" inputmode="tel" pattern="[0-9+ \\-]{10,15}" placeholder="Optional">')}
      <fieldset class="field field--wide rating">
        <legend class="field__label">How was your experience? <b aria-hidden="true">*</b></legend>
        <div class="rating__stars">${[5, 4, 3, 2, 1].map((n) => `<input type="radio" name="rating" id="rate-${n}" value="${n}"${n === 5 ? ' required' : ''}><label for="rate-${n}" title="${n} star${n > 1 ? 's' : ''}">${icon('star')}<span class="sr-only">${n} star${n > 1 ? 's' : ''}</span></label>`).join('')}</div>
      </fieldset>
      ${field('Your feedback', '<textarea name="message" rows="5" required placeholder="Share your experience with us"></textarea>', { required: true, wide: true })}
    </div>
    <input type="hidden" name="branch" value="${esc(b.name)}">
    <p class="form__error" role="alert" hidden></p>
    <div class="form__foot">
      <button class="btn btn--wa btn--lg" type="submit">${icon('whatsapp')}Send feedback on WhatsApp</button>
      <p>Your feedback goes straight to the hospital team.</p>
    </div>
  </form>`;
}

export function reviewCta(b, { title = 'Share your experience', text = 'Your feedback helps other families choose care with confidence — and helps us improve.' } = {}) {
  return `<div class="review-cta">
    <span class="review-cta__g">${icon('google')}</span>
    <div><h3>${esc(title)}</h3><p>${esc(text)}</p></div>
    <a class="btn btn--primary" href="${esc(b.reviewLink)}" target="_blank" rel="noopener">${icon('star')}Review us on Google</a>
  </div>`;
}

export const siteName = SITE.name;
