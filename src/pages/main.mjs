// Home (per branch), About, Doctors and Specialities. The site's front door is in group.mjs.
import { SITE, BRANCH_LIST } from '../data/site.mjs';
import { DOCTORS, DEPARTMENTS, LEADERSHIP } from '../data/doctors.mjs';
import { SPECIALITIES } from '../data/specialities.mjs';
import { PACKAGES, FACILITIES, ALWAYS_ON, KUDLU_EXTRA_SERVICES, WHY, ABOUT, LOCAL_SERVICES, REVIEWS, APPOINTMENT_STEPS } from '../data/content.mjs';
import { esc, cx, rel, pageUrl, icon, img, avatar, tel, splitSections, normalizeHeadings } from '../lib/core.mjs';
import { page, hospitalLd, breadcrumbLd, specUrl } from '../lib/layout.mjs';
import { legacyMeta, blogs, specialityContent, doctorsFor, twinSpeciality, HOME_BLOCKS } from '../lib/data.mjs';
import * as P from '../lib/parts.mjs';

const other = (b) => BRANCH_LIST.find((x) => x.id !== b.id);
const L = (ctx, to) => esc(rel(ctx.path, to));

export function makeCtx(b, file, { legacy, title, description, ...rest } = {}) {
  const lm = legacyMeta(legacy || file);
  const ctx = { branch: b, path: file, title: title || lm.title, description: description || lm.description, keywords: lm.keywords, jsonLd: [], ...rest };
  const bc = breadcrumbLd(ctx);
  if (bc && ctx.crumbs.length > 1) ctx.jsonLd.push(bc);
  return ctx;
}
const home = (b) => ({ name: 'Home', url: `${b.dir}/` });

function stats(b) {
  return `<ul class="stats">
    <li><strong>${DOCTORS.length}</strong><span>consultants</span></li>
    <li><strong>${SPECIALITIES[b.id].length}</strong><span>specialities</span></li>
    <li><strong>24×7</strong><span>emergency, ICU &amp; pharmacy</span></li>
    <li><strong>2</strong><span>branches in Bengaluru</span></li>
  </ul>`;
}

// ================================================================= branch home
export function homePage(b) {
  const file = `${b.dir}/index.html`;
  const blocks = HOME_BLOCKS[b.id];
  const ctx = makeCtx(b, file, { current: 'home', bodyClass: 'is-home', altPath: `${other(b).dir}/` });
  ctx.jsonLd.push(hospitalLd(b));
  if (blocks.faqs.length) {
    ctx.jsonLd.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: blocks.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') } })) });
  }
  const specs = SPECIALITIES[b.id];
  const posts = blogs(b.id).slice(0, 3);
  const pk = PACKAGES[b.id].items.slice(0, 3);
  const reviews = REVIEWS[b.id];
  const teamFaces = ['dayanand-yaligar', 'shrilakshmi', 'chandan-s', 'sushma-s'];

  const body = `
<section class="hero">
  <div class="container hero__in">
    <div class="hero__text">
      <p class="hero__eyebrow"><span class="dot" aria-hidden="true"></span>${esc(b.hero.eyebrow)}</p>
      <h1>${b.hero.title}</h1>
      <p class="lede">${esc(b.hero.text)}</p>
      <div class="actions">
        ${P.bookBtn(ctx, b, { label: 'Book an Appointment', cls: 'btn btn--primary btn--lg' })}
        <a class="btn btn--sos-outline btn--lg" href="${tel(b.phone)}">${icon('phone-call')}<span>Emergency ${esc(b.phoneDisplay)}</span></a>
      </div>
      <ul class="hero__trust">
        <li>${icon('circle-check')}24×7 emergency &amp; ICU</li>
        <li>${icon('circle-check')}Ambulance on call</li>
        <li>${icon('circle-check')}Cashless insurance support</li>
      </ul>
    </div>
    <div class="hero__visual">
      <div class="hero__photo">${img(ctx, b.hero.photo, b.hero.photoAlt, { eager: true, sizes: '(min-width: 1000px) 560px, 100vw', extra: { style: b.hero.photoFocus ? `object-position: ${b.hero.photoFocus}` : null } })}</div>
      <div class="hero__photo2">${img(ctx, b.hero.photo2, b.hero.photo2Alt, { eager: true, sizes: '240px' })}</div>
      <a class="hero__sos" href="${tel(b.phone)}"><span class="pulse" aria-hidden="true"></span><span><small>24×7 Emergency</small><strong>${esc(b.phoneDisplay)}</strong></span></a>
      <a class="hero__team" href="${L(ctx, pageUrl(b, 'doctors'))}">
        <span class="faces">${teamFaces.map((id) => avatar(ctx, id, '', 'avatar avatar--xs')).join('')}</span>
        <span><strong>${DOCTORS.length} consultants</strong><small>across ${specs.length} specialities</small></span>
      </a>
    </div>
  </div>
</section>

<section class="quick" aria-label="Quick actions">
  <div class="container quick__grid">
    <a class="quick-card" href="${L(ctx, pageUrl(b, 'appointment'))}"><span class="tile">${icon('calendar-check')}</span><span><strong>Book an appointment</strong><small>Send a request in under a minute</small></span>${icon('arrow-right', 'go')}</a>
    <a class="quick-card" href="${L(ctx, pageUrl(b, 'doctors'))}"><span class="tile">${icon('stethoscope')}</span><span><strong>Find a doctor</strong><small>${DOCTORS.length} consultants, ${DEPARTMENTS.length} departments</small></span>${icon('arrow-right', 'go')}</a>
    <a class="quick-card" href="${L(ctx, pageUrl(b, 'healthCheck'))}"><span class="tile">${icon('clipboard-check')}</span><span><strong>Health check packages</strong><small>Preventive screening for every age</small></span>${icon('arrow-right', 'go')}</a>
    <a class="quick-card quick-card--sos" href="${tel(b.phone)}"><span class="tile">${icon('siren')}</span><span><strong>Emergency &amp; ambulance</strong><small>${esc(b.phoneDisplay)} · 24×7</small></span>${icon('arrow-right', 'go')}</a>
  </div>
</section>

<section class="section" id="specialities">
  <div class="container">
    ${P.sectionHead({ eyebrow: 'Specialities', title: 'Specialist care under one roof', text: `From everyday illnesses to complex surgery, our departments work together so that you rarely need to go elsewhere.`, link: { href: L(ctx, pageUrl(b, 'specialities')), label: `All ${specs.length} specialities` } })}
    <div class="spec-grid spec-grid--home">${specs.slice(0, 8).map((s) => P.specCard(ctx, b, s)).join('')}</div>
    <p class="spec-more">${specs.slice(8).map((s) => `<a class="chip chip--link" href="${L(ctx, specUrl(b, s))}">${icon(s.icon)}${esc(s.name)}</a>`).join('')}</p>
  </div>
</section>

<section class="section section--tint" id="about">
  <div class="container split">
    <div class="split__media">
      <div class="collage">
        ${img(ctx, b.about.photo, b.about.photoAlt, { cls: 'collage__a', sizes: '(min-width: 1000px) 420px, 80vw' })}
        ${img(ctx, b.about.photo2, b.about.photo2Alt, { cls: 'collage__b', sizes: '(min-width: 1000px) 300px, 60vw' })}
        <p class="collage__badge">${icon('heart-handshake')}<span>${esc(SITE.tagline)}</span></p>
      </div>
    </div>
    <div class="split__text">
      ${P.sectionHead({ eyebrow: `About Raksha Hospital, ${b.name}`, title: 'Care that puts patients and families first' })}
      <p>${esc(ABOUT.intro[0])}</p>
      <p>${esc(ABOUT.intro[1])}</p>
      ${stats(b)}
      <div class="led-by">
        <p class="led-by__label">Led by</p>
        <ul>${LEADERSHIP[b.id].map((p) => `<li>${avatar(ctx, p.id, p.name, 'avatar avatar--sm')}<span><strong>${esc(p.name)}</strong><small>${esc(p.role)}</small></span></li>`).join('')}</ul>
      </div>
      <div class="actions"><a class="btn btn--soft" href="${L(ctx, pageUrl(b, 'about'))}">More about us${icon('arrow-right')}</a></div>
    </div>
  </div>
</section>

<section class="section" id="doctors">
  <div class="container">
    ${P.sectionHead({ eyebrow: 'Our doctors', title: 'Meet the specialists who will care for you', text: 'Experienced consultants across medicine, surgery, women’s and children’s health.', link: { href: L(ctx, pageUrl(b, 'doctors')), label: `View all ${DOCTORS.length} doctors` } })}
    ${P.teamDirectory(ctx, { bookAt: b, pagesAt: [b], level: 3 })}
    ${P.doctorShowcase(ctx, b)}
  </div>
</section>

<section class="section section--dark" id="facilities">
  <div class="container">
    ${P.sectionHead({ eyebrow: 'Facilities', title: 'Ready for emergencies, equipped for recovery', text: `Critical care, surgery, diagnostics and pharmacy on one campus in ${esc(b.area)} — open every hour of every day.` })}
    <div class="fac-grid">${FACILITIES[b.id].map((f) => P.facilityCard(ctx, f)).join('')}</div>
    <div class="always-on">${ALWAYS_ON[b.id].map((g) => `<div class="always-on__col"><h3>${icon(g.icon)}${esc(g.title)}</h3><ul>${g.items.map((i) => `<li>${icon('check')}${esc(i)}</li>`).join('')}</ul></div>`).join('')}</div>
  </div>
</section>
${b.id === 'kudlu' ? `
<section class="section">
  <div class="container">
    ${P.sectionHead({ eyebrow: 'More at Kudlu', title: 'Specialised services to improve your health' })}
    <ul class="mini-grid">${KUDLU_EXTRA_SERVICES.map((s) => `<li><span class="tile">${icon(s.icon)}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></li>`).join('')}</ul>
  </div>
</section>` : ''}

<section class="section section--tint" id="health-check">
  <div class="container">
    ${P.sectionHead({ eyebrow: 'Preventive care', title: 'Health check packages', text: 'Early detection saves lives. Choose a package designed by our specialists, or ask us to tailor one for you.', link: { href: L(ctx, pageUrl(b, 'healthCheck')), label: 'See all packages' } })}
    <div class="pkg-grid">${pk.map((p) => P.packageCard(ctx, b, p, { fold: true })).join('')}</div>
  </div>
</section>

<section class="section" id="book">
  <div class="container split split--form">
    <div class="split__text">
      ${P.sectionHead({ eyebrow: 'Appointments', title: 'Request an appointment in three steps' })}
      <ol class="steps">${APPOINTMENT_STEPS.map(([t, d, ic]) => `<li><span class="tile">${icon(ic)}</span><div><h3>${esc(t)}</h3><p>${esc(d)}</p></div></li>`).join('')}</ol>
    </div>
    <div class="card card--form">
      <h3>Book a consultation</h3>
      ${P.appointmentForm(ctx, b, { compact: true, id: 'home-appointment-form' })}
    </div>
  </div>
</section>

<section class="section section--tint" id="why">
  <div class="container">
    ${P.sectionHead({ eyebrow: 'Why Raksha', title: 'Why families choose Raksha Hospital', center: true })}
    ${P.whyGrid(WHY)}
  </div>
</section>

<section class="section" id="reviews">
  <div class="container">
    ${P.sectionHead({ eyebrow: 'Patient voices', title: reviews.length ? 'What our patients say' : 'Your feedback matters to us' })}
    ${reviews.length ? `<div class="review-grid">${reviews.map((r) => `<figure class="review"><span class="review__q">${icon('quote')}</span><blockquote><p>${esc(r.text)}</p></blockquote><figcaption><strong>${esc(r.name)}</strong><span>${icon('google')}Google review</span></figcaption></figure>`).join('')}</div>` : ''}
    ${P.reviewCta(b, reviews.length ? { title: 'Been to Raksha Hospital?', text: 'Tell us how we did. Your review helps other families and helps us improve.' } : {})}
  </div>
</section>

<section class="section section--tint" id="blogs">
  <div class="container">
    ${P.sectionHead({ eyebrow: 'Health library', title: 'Advice from our doctors', link: { href: L(ctx, pageUrl(b, 'blogs')), label: 'All articles' } })}
    <div class="blog-grid blog-grid--feature">${posts.map((p) => P.blogCard(ctx, b, p)).join('')}</div>
  </div>
</section>

<section class="section" id="services">
  <div class="container">
    ${P.sectionHead({ eyebrow: `Hospital services in ${b.area}`, title: `Multi-speciality hospital services in ${esc(b.areaLong)}`, text: `Raksha Multi Speciality Hospital is easy to reach from ${esc(b.nearby.join(', '))} and the neighbourhoods around ${esc(b.area)}.` })}
    <ul class="svc-grid" id="svc-list">${LOCAL_SERVICES.map(([ic, t, d]) => `<li>${icon(ic)}<div><h3>${esc(t)}</h3><p>${esc(d.replace('{area}', b.area))}</p></div></li>`).join('')}</ul>
    <button type="button" class="btn btn--soft svc-more" data-svc-toggle aria-controls="svc-list" aria-expanded="false">Show all ${LOCAL_SERVICES.length} services${icon('chevron-down')}</button>
    <ul class="near">
      <li>${icon('map-pin')}<span><strong>Convenient location</strong>Near ${esc(b.nearby.join(', '))}</span></li>
      <li>${icon('clock')}<span><strong>24×7 availability</strong>Emergency, ICU and ambulance round the clock</span></li>
      <li>${icon('wallet')}<span><strong>Affordable care</strong>Transparent pricing, most insurance plans accepted, cashless facility</span></li>
    </ul>
  </div>
</section>

<section class="section section--tint" id="faq">
  <div class="container faq-wrap">
    <div class="faq-wrap__head">
      ${P.sectionHead({ eyebrow: 'FAQ', title: 'Frequently asked questions' })}
      <div class="card card--help">
        <h3>Still have a question?</h3>
        <p>Our front desk is happy to help, any time of day.</p>
        <div class="actions">${P.callBtn(b, { cls: 'btn btn--soft' })}${P.waBtn(b)}</div>
      </div>
    </div>
    ${P.faqList(blocks.faqs)}
  </div>
</section>

${P.locationSection(ctx, b)}
`;
  return { file, html: page(ctx, body) };
}

// ================================================================= about
export function aboutPage(b) {
  const file = pageUrl(b, 'about');
  const ctx = makeCtx(b, file, {
    current: 'about', crumbs: [home(b), { name: 'About' }], altPath: pageUrl(other(b), 'about'),
    title: legacyMeta(file).title || `About Raksha Multi-Speciality Hospital ${b.areaLong.replace(',', '')} | Our Story & Mission`,
    description: legacyMeta(file).description || `Learn about Raksha Multi-Speciality Hospital ${b.areaLong} — our mission, our team and our commitment to patient-centred care with 24×7 emergency services.`,
  });
  const fac = FACILITIES[b.id].slice(0, 3);
  const body = `
${P.pageHero(ctx, { eyebrow: `About us · ${b.name}`, title: 'Health and happiness for all', lede: 'Raksha Multi Speciality Hospital brings experienced doctors, modern facilities and round-the-clock emergency care to the families of South Bengaluru.', actions: `${P.bookBtn(ctx, b)}<a class="btn btn--soft" href="${L(ctx, pageUrl(b, 'doctors'))}">Meet our doctors${icon('arrow-right')}</a>` })}

<section class="section">
  <div class="container split">
    <div class="split__media">
      <div class="collage">
        ${img(ctx, b.about.photo, b.about.photoAlt, { cls: 'collage__a', sizes: '(min-width: 1000px) 420px, 80vw' })}
        ${img(ctx, b.about.photo2, b.about.photo2Alt, { cls: 'collage__b', sizes: '(min-width: 1000px) 300px, 60vw' })}
        <p class="collage__badge">${icon('heart-handshake')}<span>${esc(SITE.tagline)}</span></p>
      </div>
    </div>
    <div class="split__text">
      ${P.sectionHead({ eyebrow: 'Who we are', title: 'A multi-speciality hospital built around patients' })}
      ${ABOUT.intro.map((p) => `<p>${esc(p)}</p>`).join('')}
      ${stats(b)}
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="container">
    <div class="duo">
      <article class="card card--pad"><span class="tile tile--green">${icon('locate-fixed')}</span><h2>Our mission</h2><p>${esc(ABOUT.mission)}</p></article>
      <article class="card card--pad"><span class="tile tile--green">${icon('hand-heart')}</span><h2>Our promise</h2><p>${esc(ABOUT.promise)}</p></article>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    ${P.sectionHead({ eyebrow: 'Why Raksha', title: 'What you can expect from us', center: true })}
    ${P.whyGrid(WHY)}
  </div>
</section>

<section class="section section--tint">
  <div class="container">
    ${P.sectionHead({ eyebrow: 'Leadership', title: 'The people who lead Raksha Hospital', center: true })}
    <div class="leader-grid">${LEADERSHIP[b.id].map((p) => P.leaderCard(ctx, p)).join('')}</div>
  </div>
</section>

<section class="section section--dark">
  <div class="container">
    ${P.sectionHead({ eyebrow: 'Facilities', title: 'Equipped for emergencies and recovery', link: { href: L(ctx, pageUrl(b, 'gallery')), label: 'See the gallery' } })}
    <div class="fac-grid">${fac.map((f) => P.facilityCard(ctx, f)).join('')}</div>
  </div>
</section>

<section class="section">
  <div class="container split split--narrow">
    <div class="split__text">
      ${P.sectionHead({ eyebrow: 'Safety & hygiene', title: 'A clean, safe hospital — every day', text: esc(ABOUT.hygieneIntro) })}
    </div>
    <ul class="hygiene">${ABOUT.hygiene.map(([t, d, ic]) => `<li><span class="tile">${icon(ic)}</span><div><h3>${esc(t)}</h3><p>${esc(d)}</p></div></li>`).join('')}</ul>
  </div>
</section>

${P.locationSection(ctx, b)}
`;
  return { file, html: page(ctx, body) };
}

// ================================================================= doctors
export function doctorsPage(b) {
  const file = pageUrl(b, 'doctors');
  const ctx = makeCtx(b, file, { current: 'doctors', crumbs: [home(b), { name: 'Doctors' }], altPath: pageUrl(other(b), 'doctors') });
  ctx.jsonLd.push({
    '@context': 'https://schema.org', '@type': 'ItemList', name: `Doctors at ${b.fullName}`,
    itemListElement: DOCTORS.map((d, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'Physician', name: d.name, medicalSpecialty: d.role, worksFor: { '@id': `${SITE.origin}/${b.dir}/#hospital` } } })),
  });
  const body = `
${P.pageHero(ctx, { eyebrow: `Our doctors · ${b.name}`, title: 'Find a doctor', lede: `${DOCTORS.length} experienced consultants serving both our Electronic City and Kudlu branches. Search by name or choose a department.`, compact: true })}

<section class="section section--flush">
  <div class="container">
    <div class="filter" data-doctor-filter>
      <label class="search">${icon('search')}<span class="sr-only">Search doctors</span><input type="search" placeholder="Search by name or speciality" autocomplete="off" data-doctor-search></label>
      <div class="filter__chips" role="group" aria-label="Filter by department">
        <button type="button" class="chip chip--toggle is-active" data-dept="" aria-pressed="true">All</button>
        ${DEPARTMENTS.map((d) => `<button type="button" class="chip chip--toggle" data-dept="${esc(d)}" aria-pressed="false">${esc(d)}</button>`).join('')}
      </div>
    </div>
    <h2 class="sr-only">Our consultants</h2>
    <p class="filter__count" data-doctor-count aria-live="polite">Showing all ${DOCTORS.length} doctors</p>
    <div class="doc-grid" data-doctor-grid>${DOCTORS.map((d) => P.doctorCard(ctx, b, d)).join('')}</div>
    <p class="filter__empty" data-doctor-empty hidden>No doctors match your search. <button type="button" class="link-btn" data-doctor-reset>Clear filters</button> or call us on <a href="${tel(b.phone)}">${esc(b.phoneDisplay)}</a>.</p>
  </div>
</section>

<section class="section section--tint">
  <div class="container">
    ${P.sectionHead({ eyebrow: 'Leadership', title: 'Hospital leadership', center: true })}
    <div class="leader-grid">${LEADERSHIP[b.id].map((p) => P.leaderCard(ctx, p)).join('')}</div>
  </div>
</section>

${P.bookBand(ctx, b, { title: 'Not sure which doctor to see?', text: 'Tell us your concern and our team will guide you to the right specialist.' })}
`;
  return { file, html: page(ctx, body) };
}

// ================================================================= specialities (list)
export function specialitiesPage(b) {
  const file = pageUrl(b, 'specialities');
  const ctx = makeCtx(b, file, { current: 'specialities', crumbs: [home(b), { name: 'Specialities' }], altPath: pageUrl(other(b), 'specialities') });
  const specs = SPECIALITIES[b.id];
  const body = `
${P.pageHero(ctx, { eyebrow: `Specialities · ${b.name}`, title: 'Our medical specialities', lede: `Advanced, multi-disciplinary care across ${specs.length} departments, supported by 24×7 emergency, ICU, diagnostics and pharmacy.`, actions: `${P.bookBtn(ctx, b)}${P.callBtn(b)}`, compact: true })}

<section class="section section--flush">
  <div class="container">
    <div class="spec-grid spec-grid--3">${specs.map((s) => P.specCard(ctx, b, s)).join('')}</div>
  </div>
</section>

${P.bookBand(ctx, b, { title: 'Need a consultation?', text: 'Our doctors are available for consultations, and emergency care is open 24×7.' })}
`;
  return { file, html: page(ctx, body) };
}

// ================================================================= speciality (detail)
const BOX_ICONS = { Symptoms: 'thermometer', Causes: 'search', Treatment: 'pill', Care: 'hand-heart' };

export function specialityPage(b, s) {
  const file = specUrl(b, s);
  const c = specialityContent(b.id, s);
  const twin = twinSpeciality(other(b).id, s.key);
  const ctx = makeCtx(b, file, {
    legacy: c.legacy, current: 'specialities',
    crumbs: [home(b), { name: 'Specialities', url: pageUrl(b, 'specialities') }, { name: s.name }],
    altPath: twin ? specUrl(other(b), twin) : pageUrl(other(b), 'specialities'),
  });
  const docs = doctorsFor(s.key);
  const others = SPECIALITIES[b.id].filter((x) => x.slug !== s.slug);

  let main;
  if (b.id === 'ec') {
    const secs = splitSections(c.html, 'h2');
    const intro = secs.find((x) => /<p>/.test(x.body) && !/<ul>/.test(x.body));
    const lists = secs.filter((x) => x !== intro);
    main = `${intro ? `<div class="prose prose--lead"><h2>${intro.title}</h2>${intro.body}</div>` : ''}
      <div class="topic-grid">${lists.map((x) => `<section class="topic"><h2>${x.title}</h2>${x.body.replace(/<ul>/g, '<ul class="checks">')}</section>`).join('')}</div>`;
  } else {
    main = `<div class="prose">${normalizeHeadings(c.html).replace(/<ul>/g, '<ul class="checks">')}</div>
      ${c.boxes.length ? `<div class="box-grid">${c.boxes.map((x) => `<section class="box"><h2><span class="tile tile--sm">${icon(BOX_ICONS[x.title] || 'info')}</span>${esc(x.title)}</h2><ul>${x.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></section>`).join('')}</div>` : ''}`;
  }

  const body = `
${P.pageHero(ctx, {
    badge: `<span class="tile tile--lg">${icon(s.icon)}</span>`,
    eyebrow: `${b.areaLong}`, title: esc(s.name), lede: esc(c.lede),
    actions: `${P.bookBtn(ctx, b, { query: `?source=${encodeURIComponent(s.key)}` })}${P.callBtn(b)}`,
    visual: img(ctx, s.photo, `Raksha Hospital, ${b.name}`, { eager: true, sizes: '(min-width: 1000px) 480px, 100vw' }),
  })}

<section class="section section--flush">
  <div class="container with-aside">
    <div class="with-aside__main">${main}</div>
    <div class="with-aside__side">
      <div class="card card--pad side-book">
        <h2>Consult our ${esc(s.name.toLowerCase().startsWith('icu') ? 'critical care' : s.name)} team</h2>
        <p>Send a request and we will confirm your slot within 24 hours.</p>
        ${P.bookBtn(ctx, b, { cls: 'btn btn--primary btn--block', query: `?source=${encodeURIComponent(s.key)}` })}
        ${P.waBtn(b, { cls: 'btn btn--wa btn--block' })}
        <a class="side-book__call" href="${tel(b.phone)}">${icon('phone-call')}<span><small>24×7 emergency</small><strong>${esc(b.phoneDisplay)}</strong></span></a>
      </div>
      ${docs.length ? `<div class="card card--pad">
        <h2>Specialists</h2>
        <ul class="mini-docs">${docs.map((d) => `<li>${avatar(ctx, d.id, d.name, 'avatar avatar--sm')}<span><strong>${esc(d.name)}</strong><small>${esc(d.role)}</small></span><a href="${L(ctx, `${pageUrl(b, 'appointment')}?doctor=${d.id}`)}" aria-label="Book a consultation with ${esc(d.name)}">${icon('calendar-plus')}</a></li>`).join('')}</ul>
        <a class="link-arrow" href="${L(ctx, pageUrl(b, 'doctors'))}">All doctors${icon('arrow-right')}</a>
      </div>` : ''}
      <div class="card card--pad">
        <h2>Other specialities</h2>
        <ul class="side-links">${others.slice(0, 8).map((x) => `<li><a href="${L(ctx, specUrl(b, x))}">${icon(x.icon)}${esc(x.name)}</a></li>`).join('')}</ul>
        <a class="link-arrow" href="${L(ctx, pageUrl(b, 'specialities'))}">View all${icon('arrow-right')}</a>
      </div>
    </div>
  </div>
</section>
`;
  return { file, html: page(ctx, body) };
}

export { other, home, L };
