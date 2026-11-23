// The site's front door (rakshahospital.com/): brand statement + branch chooser.
// Designed phone-first: both branches are reachable within one thumb-scroll, and nothing needs sideways swiping.
import { SITE, BRANCHES, BRANCH_LIST } from '../data/site.mjs';
import { DOCTORS, LEADERSHIP } from '../data/doctors.mjs';
import { SPECIALITIES } from '../data/specialities.mjs';
import { WHY, ABOUT } from '../data/content.mjs';
import { esc, rel, pageUrl, icon, img, imgSize, avatar, tel, wa } from '../lib/core.mjs';
import { page, hospitalLd, specUrl } from '../lib/layout.mjs';
import { legacyMeta } from '../lib/data.mjs';
import * as P from '../lib/parts.mjs';

// Branch cards: a wide photo on phones (photo on top) and a tall one on desktops (photo at the side).
const CARD_PHOTO = {
  ec: { wide: 'ec/reception', tall: 'ec/building-sm', alt: 'Reception at Raksha Hospital, Electronic City' },
  kudlu: { wide: 'kudlu/reception', tall: 'kudlu/front-desk', alt: 'Raksha Hospital, Kudlu' },
};

// "Inside our hospitals": [photo, caption, branch id]. The first one is shown large.
const INSIDE = [
  ['ec/icu', 'Intensive care unit', 'ec'],
  ['kudlu/ot', 'Operation theatre', 'kudlu'],
  ['ec/consult-room-1', 'Consultation room', 'ec'],
  ['kudlu/pharmacy', 'In-house pharmacy', 'kudlu'],
  ['kudlu/front-desk', 'Front desk', 'kudlu'],
];

export function groupPage() {
  const file = 'index.html';
  const lm = legacyMeta('index.html');
  const ctx = { branch: null, path: file, title: lm.title, description: lm.description, keywords: lm.keywords, bodyClass: 'is-home is-group', jsonLd: [] };
  const L = (to) => esc(rel(ctx.path, to));
  ctx.jsonLd.push({
    '@context': 'https://schema.org', '@type': 'MedicalOrganization', '@id': `${SITE.origin}/#organization`, name: SITE.name, alternateName: SITE.shortName, url: `${SITE.origin}/`,
    logo: `${SITE.origin}/assets/img/brand/logo.png`, slogan: SITE.tagline,
    department: BRANCH_LIST.map((b) => ({ '@id': `${SITE.origin}/${b.dir}/#hospital` })),
  }, ...BRANCH_LIST.map(hospitalLd));

  const allKeys = new Set(BRANCH_LIST.flatMap((b) => SPECIALITIES[b.id].map((s) => s.key)));
  const eb = BRANCHES.ec;

  const branchCard = (b) => {
    const photo = CARD_PHOTO[b.id];
    const tall = imgSize(photo.tall);
    const home = L(`${b.dir}/`);
    return `<article class="gp-branch" data-branch-card data-lat="${b.geo.lat}" data-lng="${b.geo.lng}">
        <a class="gp-branch__media" href="${home}" tabindex="-1" aria-hidden="true">
          <picture>
            <source media="(min-width: 1001px)" srcset="${L(`assets/img/${photo.tall}.webp`)}" width="${tall.w}" height="${tall.h}">
            ${img(ctx, photo.wide, photo.alt, { eager: true, sizes: '(min-width: 680px) 50vw, 100vw' })}
          </picture>
          <span class="gp-open"><span class="pulse"></span>Open 24×7</span>
        </a>
        <div class="gp-branch__body">
          <p class="gp-branch__over">Raksha Hospital<span class="gp-dist" data-dist hidden></span></p>
          <h3><a href="${home}">${esc(b.name)}</a></h3>
          <p class="gp-branch__addr">${b.address.lines.map(esc).join(' ')}</p>
          <p class="gp-branch__near">${icon('map-pin')}<span>Near ${esc(b.nearby.join(' · '))}</span></p>
          <div class="gp-branch__foot">
            <div class="gp-branch__row">
              <a class="gp-branch__tel" href="${tel(b.phone)}">${icon('phone-call')}<span><small>24×7 emergency</small><strong>${esc(b.phoneDisplay)}</strong></span></a>
              <div class="gp-branch__icons">
                <a class="icon-btn icon-btn--wa" href="${wa(b.whatsapp)}" target="_blank" rel="noopener" aria-label="WhatsApp the ${esc(b.name)} branch">${icon('whatsapp')}</a>
                <a class="icon-btn" href="${esc(b.mapLink)}" target="_blank" rel="noopener" aria-label="Directions to the ${esc(b.name)} branch">${icon('navigation')}</a>
              </div>
            </div>
            <a class="btn btn--primary btn--block" href="${home}">Visit ${esc(b.name)} branch${icon('arrow-right')}</a>
          </div>
        </div>
      </article>`;
  };

  // leadership of both branches, each person listed once with the branches they lead
  const leaders = [];
  for (const b of BRANCH_LIST) {
    for (const person of LEADERSHIP[b.id]) {
      let entry = leaders.find((x) => x.id === person.id);
      if (!entry) leaders.push(entry = { ...person, at: [] });
      entry.at.push(b.name);
    }
  }

  const specPanel = (b, i) => `<div class="gp-tabs__panel${i === 0 ? ' is-active' : ''}" role="tabpanel" id="panel-${b.id}" aria-labelledby="tab-${b.id}">
        <h3 class="gp-tabs__heading">${esc(b.name)}</h3>
        <ul class="gp-specs">${SPECIALITIES[b.id].map((s) => `<li><a href="${L(specUrl(b, s))}"><span class="tile tile--sm">${icon(s.icon)}</span><span>${esc(s.name)}</span></a></li>`).join('')}</ul>
        <a class="link-arrow gp-tabs__more" href="${L(pageUrl(b, 'specialities'))}">All specialities at ${esc(b.name)}${icon('arrow-right')}</a>
      </div>`;

  const body = `
<section class="gp-hero">
  <svg class="gp-hero__ecg" viewBox="0 0 1440 140" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <defs><linearGradient id="gp-ecg" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#5FDCA6" stop-opacity="0"/><stop offset=".3" stop-color="#5FDCA6" stop-opacity=".6"/><stop offset=".7" stop-color="#8DBBF0" stop-opacity=".6"/><stop offset="1" stop-color="#8DBBF0" stop-opacity="0"/></linearGradient></defs>
    <path d="M0 96H300l14 0 10-22 12 44 16-92 18 104 12-46 10 12H640l10-14 10 14H900l14 0 10-22 12 44 16-92 18 104 12-46 10 12H1440" fill="none" stroke="url(#gp-ecg)" stroke-width="2" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
  </svg>
  <div class="container gp-hero__in">
    <div class="gp-hero__text">
      <p class="gp-chip"><span class="dot" aria-hidden="true"></span>Multi-speciality hospitals · South Bengaluru</p>
      <h1><span class="gp-kicker">${esc(SITE.name)}</span>Health &amp; <em>happiness</em> for all</h1>
      <p class="gp-lede">24×7 emergency, ICU, surgery, diagnostics and pharmacy — with experienced specialists at two branches in South Bengaluru.</p>
      <ul class="gp-stats">
        <li><strong>${DOCTORS.length}</strong><span>consultants</span></li>
        <li><strong>${allKeys.size}</strong><span>specialities</span></li>
        <li><strong>24×7</strong><span>emergency &amp; ICU</span></li>
        <li><strong>${BRANCH_LIST.length}</strong><span>branches</span></li>
      </ul>
    </div>

    <div class="gp-sos">
      <p><span class="pulse" aria-hidden="true"></span>24×7 emergency &amp; ambulance</p>
      ${BRANCH_LIST.map((b) => `<a href="${tel(b.phone)}">${icon('phone-call')}<span><small>${esc(b.name)}</small><strong>${esc(b.phoneDisplay)}</strong></span></a>`).join('')}
    </div>

    <div class="gp-branches" id="branches">
      <div class="gp-branches__head">
        <h2 class="gp-branches__title">${icon('map-pin')}Choose your branch</h2>
        <button type="button" class="gp-nearest" data-nearest hidden>${icon('locate-fixed')}<span>Nearest<span class="gp-nearest__long"> to me</span></span></button>
      </div>
      <p class="gp-nearest__msg" data-nearest-msg role="status" hidden></p>
      ${BRANCH_LIST.map(branchCard).join('\n      ')}
    </div>
  </div>
</section>

<section class="section" id="specialities">
  <div class="container">
    ${P.sectionHead({ eyebrow: 'Specialities', title: 'Find the care you need', text: 'Choose a branch to see the departments there.' })}
    <div class="gp-tabs" data-tabs>
      <div class="gp-tabs__list" role="tablist" aria-label="Branch">
        ${BRANCH_LIST.map((b, i) => `<button type="button" role="tab" id="tab-${b.id}" aria-controls="panel-${b.id}" aria-selected="${i === 0}"${i === 0 ? ' class="is-active"' : ' tabindex="-1"'}>${esc(b.name)}<span>${SPECIALITIES[b.id].length}</span></button>`).join('')}
      </div>
      ${BRANCH_LIST.map(specPanel).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--tint" id="doctors">
  <div class="container">
    ${P.sectionHead({ eyebrow: 'Our team', title: 'Meet the team behind your care', text: 'Our leadership and our consultants. Our doctors see patients across both branches.', link: { href: L(pageUrl(eb, 'doctors')), label: `View all ${DOCTORS.length} doctors` } })}

    <div class="gp-lead">
      <h3 class="gp-tier">${icon('users-round')}Leadership</h3>
      <ul class="gp-lead__list">${leaders.map((p) => `<li>${avatar(ctx, p.id, p.name, 'avatar avatar--sm')}<div><strong>${esc(p.name)}</strong><span>${esc(p.role)}</span><small>${p.at.map(esc).join(' · ')}</small></div></li>`).join('')}</ul>
    </div>

    <h3 class="gp-tier">${icon('stethoscope')}<span>Consultants<span class="team-dir-only"> by department</span></span></h3>
    ${P.teamDirectory(ctx, { bookAt: eb, pagesAt: BRANCH_LIST, level: 4 })}
    ${P.doctorShowcase(ctx, eb)}
  </div>
</section>

<section class="section" id="inside">
  <div class="container">
    ${P.sectionHead({ eyebrow: 'Facilities', title: 'Inside our hospitals', text: 'Real photographs from both branches — critical care, surgery, consultation rooms and pharmacy on campus.' })}
    <div class="gp-mosaic">${INSIDE.map(([photo, caption, id], i) => {
    const b = BRANCHES[id];
    return `<a href="${L(pageUrl(b, 'gallery'))}">${img(ctx, photo, `${caption} at Raksha Hospital, ${b.name}`, { sizes: i === 0 ? '(min-width: 680px) 600px, 100vw' : '(min-width: 680px) 300px, 50vw' })}<span><small>${esc(b.name)}</small>${esc(caption)}</span></a>`;
  }).join('')}</div>
    <p class="gp-galleries">See more: ${BRANCH_LIST.map((b) => `<a class="chip chip--link" href="${L(pageUrl(b, 'gallery'))}">${icon('images')}${esc(b.name)} gallery</a>`).join('')}</p>
  </div>
</section>

<section class="section section--tint" id="why">
  <div class="container gp-why">
    <div class="gp-why__intro">
      ${P.sectionHead({ eyebrow: 'Why Raksha', title: 'Why families choose Raksha Hospital' })}
      <p>${esc(ABOUT.intro[0])}</p>
      <p class="gp-why__links">${BRANCH_LIST.map((b) => `<a class="link-arrow" href="${L(pageUrl(b, 'about'))}">About ${esc(b.name)}${icon('arrow-right')}</a>`).join('')}</p>
    </div>
    <ul class="gp-why__list">${WHY.map((w) => `<li><span class="tile tile--green">${icon(w.icon)}</span><div><h3>${esc(w.title)}</h3><p>${esc(w.text)}</p></div></li>`).join('')}</ul>
  </div>
</section>

<section class="section section--tight">
  <div class="container">
    <div class="book-band">
      <div><h2>Ready to see a doctor?</h2><p>Pick your branch and send an appointment request — our front desk confirms within 24 hours.</p></div>
      <div class="actions">${BRANCH_LIST.map((b) => `<a class="btn btn--white" href="${L(pageUrl(b, 'appointment'))}">${icon('calendar-check')}Book at ${esc(b.name)}</a>`).join('')}</div>
    </div>
  </div>
</section>
`;
  return { file, html: page(ctx, body) };
}
