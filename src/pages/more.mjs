// Health check, appointment, contact, gallery, insights, feedback, blogs and error pages.
import { SITE, BRANCH_LIST } from '../data/site.mjs';
import { PACKAGES, GALLERY, INSIGHTS, REVIEWS, APPOINTMENT_STEPS, APPOINTMENT_TIPS } from '../data/content.mjs';
import { esc, cx, rel, pageUrl, icon, img, imgSize, tel, wa, fragment, readingMinutes, stripTags, normalizeHeadings } from '../lib/core.mjs';
import { page, hospitalLd, blogUrl } from '../lib/layout.mjs';
import { blogs } from '../lib/data.mjs';
import * as P from '../lib/parts.mjs';
import { makeCtx, other, home, L } from './main.mjs';

// ================================================================= health check packages
export function healthCheckPage(b) {
  const file = pageUrl(b, 'healthCheck');
  const ctx = makeCtx(b, file, { current: 'healthCheck', crumbs: [home(b), { name: 'Health Check' }], altPath: pageUrl(other(b), 'healthCheck') });
  const pk = PACKAGES[b.id];
  const body = `
${P.pageHero(ctx, { eyebrow: `Preventive care · ${b.name}`, title: 'Health check packages', lede: 'Early detection saves lives. Our check-ups are designed by multi-speciality experts and can be tailored to your age, history and risk factors.', actions: `${P.bookBtn(ctx, b, { label: 'Book a health check', query: '?source=health-checkup' })}<a class="btn btn--soft" href="#packages">View packages${icon('arrow-right')}</a>`, compact: true })}

<section class="section section--flush" id="packages">
  <div class="container">
    <h2 class="sr-only">Packages</h2>
    <div class="pkg-grid">${pk.items.map((p) => P.packageCard(ctx, b, p)).join('')}</div>
    <p class="note">${icon('info')}<span>${esc(pk.note)}</span></p>
  </div>
</section>

<section class="section section--tint">
  <div class="container">
    ${P.sectionHead({ eyebrow: 'How it works', title: 'Your check-up, step by step', center: true })}
    <ol class="steps steps--row">
      <li><span class="tile">${icon('calendar-check')}</span><div><h3>Book your slot</h3><p>Choose a package and send us a request. We confirm the date and any fasting instructions.</p></div></li>
      <li><span class="tile">${icon('test-tubes')}</span><div><h3>Tests on campus</h3><p>Blood tests, imaging and heart checks are done at the hospital, so there is no running between centres.</p></div></li>
      <li><span class="tile">${icon('stethoscope')}</span><div><h3>Review with a doctor</h3><p>Your package includes a consultation to go through the results and the next steps, if any are needed.</p></div></li>
    </ol>
  </div>
</section>

${P.bookBand(ctx, b, { title: 'Not sure which package is right for you?', text: 'Talk to our preventive care coordinator for a personalised recommendation.', query: '?source=health-checkup' })}
`;
  return { file, html: page(ctx, body) };
}

// ================================================================= appointment
export function appointmentPage(b) {
  const file = pageUrl(b, 'appointment');
  const ctx = makeCtx(b, file, { current: 'appointment', crumbs: [home(b), { name: 'Book Appointment' }], altPath: pageUrl(other(b), 'appointment') });
  const body = `
${P.pageHero(ctx, { eyebrow: `Appointments · ${b.name}`, title: 'Book your appointment', lede: 'Tell us who you would like to see and when. Your request goes straight to our front desk on WhatsApp and we confirm within 24 hours.', compact: true })}

<section class="section section--flush">
  <div class="container with-aside with-aside--form">
    <div class="with-aside__main">
      <div class="card card--form" id="appointment-form-card">
        <h2>Appointment request</h2>
        <p class="card__sub">Only your name is required — add as much detail as you like.</p>
        ${P.appointmentForm(ctx, b)}
      </div>
      <div class="card card--pad">
        <h2>What happens next?</h2>
        <ol class="steps">${APPOINTMENT_STEPS.map(([t, d, ic]) => `<li><span class="tile">${icon(ic)}</span><div><h3>${esc(t)}</h3><p>${esc(d)}</p></div></li>`).join('')}</ol>
      </div>
    </div>
    <div class="with-aside__side">
      <div class="card card--pad card--sos">
        <h2>${icon('siren')}Need immediate help?</h2>
        <p>For emergencies, do not wait for a reply — call us now.</p>
        <a class="btn btn--sos btn--block" href="${tel(b.phone)}">${icon('phone-call')}${esc(b.phoneDisplay)}</a>
        ${b.extraPhones.map((p) => `<a class="btn btn--sos-outline btn--block" href="${tel(p.tel)}">${icon('phone-call')}${esc(p.display)}</a>`).join('')}
        ${P.waBtn(b, { cls: 'btn btn--wa btn--block', label: 'Chat on WhatsApp' })}
      </div>
      <div class="card card--pad">
        <h2>Before your visit</h2>
        <ul class="checks">${APPOINTMENT_TIPS.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>
      <div class="card card--pad">
        <h2>Where to find us</h2>
        ${P.contactList(b, { hours: false })}
        <a class="link-arrow" href="${esc(b.mapLink)}" target="_blank" rel="noopener">Get directions${icon('arrow-right')}</a>
      </div>
    </div>
  </div>
</section>
`;
  return { file, html: page(ctx, body) };
}

// ================================================================= contact
export function contactPage(b) {
  const file = pageUrl(b, 'contact');
  const ctx = makeCtx(b, file, { current: 'contact', crumbs: [home(b), { name: 'Contact' }], altPath: pageUrl(other(b), 'contact') });
  ctx.jsonLd.push(hospitalLd(b));
  const o = other(b);
  const phones = [{ tel: b.phone, display: b.phoneDisplay }, ...b.extraPhones];
  const body = `
${P.pageHero(ctx, { eyebrow: `Contact · ${b.name}`, title: 'Get in touch', lede: 'We are here to help with appointments, enquiries and emergencies — 24 hours a day, 7 days a week.', actions: `${P.callBtn(b, { cls: 'btn btn--sos' })}${P.waBtn(b)}`, compact: true })}

<section class="section section--flush">
  <div class="container">
    <ul class="contact-cards">
      <li><span class="tile">${icon('map-pin')}</span><h2>Visit us</h2><p>${b.address.lines.map(esc).join('<br>')}</p><a class="link-arrow" href="${esc(b.mapLink)}" target="_blank" rel="noopener">Get directions${icon('arrow-right')}</a></li>
      <li><span class="tile tile--red">${icon('phone-call')}</span><h2>Call us</h2><p>${phones.map((p) => `<a href="${tel(p.tel)}">${esc(p.display)}</a>`).join('<br>')}</p><span class="muted">Emergency line, 24×7</span></li>
      <li><span class="tile">${icon('mail')}</span><h2>Email us</h2><p><a href="mailto:${b.email}">${esc(b.email)}</a></p><span class="muted">For non-urgent enquiries</span></li>
      <li><span class="tile tile--green">${icon('clock')}</span><h2>Hours</h2><p>${b.hours.map(([k, v]) => `<span class="hours"><em>${esc(k)}</em>${esc(v)}</span>`).join('')}</p></li>
    </ul>
  </div>
</section>

<section class="section section--tint" id="message">
  <div class="container split split--form split--top">
    <div class="card card--form">
      <h2>Send us a message</h2>
      <p class="card__sub">Quick and simple — your message opens in WhatsApp.</p>
      ${P.messageForm(ctx, b)}
    </div>
    <div class="stack">
      ${P.mapFrame(b)}
      <p class="muted">${icon('map-pinned')} ${esc(b.landmarks)}.</p>
      ${b.paths.feedback ? `<a class="other-branch" href="${L(ctx, pageUrl(b, 'feedback'))}">${icon('message-circle')}<span><small>Visited us recently?</small><strong>Share your feedback</strong><span>Tell us how we did</span></span>${icon('arrow-right')}</a>` : ''}
      <a class="other-branch" href="${L(ctx, pageUrl(o, 'contact'))}">${icon('building-2')}<span><small>Also in Bengaluru</small><strong>Raksha Hospital, ${esc(o.name)}</strong><span>${esc(o.address.short)} · ${esc(o.phoneDisplay)}</span></span>${icon('arrow-right')}</a>
    </div>
  </div>
</section>
`;
  return { file, html: page(ctx, body) };
}

// ================================================================= gallery / insights
function figure(ctx, key, caption, { sensitive = false } = {}) {
  const { w, h } = imgSize(key);
  const full = esc(rel(ctx.path, `assets/img/${key}.webp`));
  return `<figure class="${cx('shot', sensitive && 'shot--sensitive')}">
    <a href="${full}" data-lightbox data-caption="${esc(caption)}" data-w="${w}" data-h="${h}"${sensitive ? ' data-sensitive' : ''}>
      ${img(ctx, key, caption, { sizes: '(min-width: 1000px) 380px, (min-width: 640px) 50vw, 100vw' })}
      ${sensitive ? `<span class="shot__veil">${icon('eye-off')}<strong>Surgical image</strong><small>Tap to view</small></span>` : `<span class="shot__zoom" aria-hidden="true">${icon('zoom-in')}</span>`}
    </a>
    <figcaption>${esc(caption)}</figcaption>
  </figure>`;
}

const lightbox = `<dialog class="lightbox" data-lightbox-dialog aria-label="Image viewer">
  <button class="icon-btn lightbox__close" type="button" data-lightbox-close aria-label="Close">${icon('x')}</button>
  <button class="icon-btn lightbox__nav lightbox__prev" type="button" data-lightbox-prev aria-label="Previous image">${icon('chevron-left')}</button>
  <figure><img alt=""><figcaption></figcaption></figure>
  <button class="icon-btn lightbox__nav lightbox__next" type="button" data-lightbox-next aria-label="Next image">${icon('chevron-right')}</button>
</dialog>`;

export function galleryPage(b) {
  const file = pageUrl(b, 'gallery');
  const ctx = makeCtx(b, file, { current: 'gallery', crumbs: [home(b), { name: 'Gallery' }], altPath: pageUrl(other(b), 'gallery') });
  const body = `
${P.pageHero(ctx, { eyebrow: `Gallery · ${b.name}`, title: 'Take a look around', lede: `Real photographs of Raksha Hospital, ${b.name} — our reception, consultation rooms, wards, operation theatres and more.`, compact: true })}

<section class="section section--flush">
  <div class="container">
    <div class="shots">${GALLERY[b.id].map(([k, c]) => figure(ctx, k, c)).join('')}</div>
    ${b.paths.insights ? `<a class="other-branch other-branch--wide" href="${L(ctx, pageUrl(b, 'insights'))}">${icon('square-activity')}<span><small>From our clinical teams</small><strong>Clinical insights</strong><span>X-rays and theatre photographs from our orthopaedic work</span></span>${icon('arrow-right')}</a>` : ''}
  </div>
</section>
${lightbox}
${P.bookBand(ctx, b, { title: 'Come and see us in person', text: 'Book a consultation or drop in — our front desk will guide you.' })}
`;
  return { file, html: page(ctx, body) };
}

export function insightsPage(b) {
  const file = pageUrl(b, 'insights');
  const ctx = makeCtx(b, file, { current: 'insights', crumbs: [home(b), { name: 'Gallery', url: pageUrl(b, 'gallery') }, { name: 'Clinical Insights' }], altPath: pageUrl(other(b), 'gallery') });
  const body = `
${P.pageHero(ctx, { eyebrow: `Clinical insights · ${b.name}`, title: 'Our work in the hospital', lede: 'A look at the orthopaedic and trauma work of our surgical teams — before-and-after X-rays, theatre photographs and ward rounds.', compact: true })}

<section class="section section--flush">
  <div class="container">
    <p class="note note--warn">${icon('triangle-alert')}<span>Some photographs were taken during surgery. They are blurred until you choose to view them. Names and record numbers have been removed from the X-rays.</span></p>
    <div class="shots">${INSIGHTS.map(([k, c, s]) => figure(ctx, k, c, { sensitive: s })).join('')}</div>
  </div>
</section>
${lightbox}
${P.bookBand(ctx, b, { title: 'Bone, joint or spine concern?', text: 'Consult our orthopaedic and spine specialists.', query: '?source=orthopedics' })}
`;
  return { file, html: page(ctx, body) };
}

// ================================================================= feedback (Kudlu)
export function feedbackPage(b) {
  const file = pageUrl(b, 'feedback');
  const ctx = makeCtx(b, file, { current: 'feedback', crumbs: [home(b), { name: 'Feedback' }], altPath: pageUrl(other(b), 'contact') });
  const reviews = REVIEWS[b.id];
  const body = `
${P.pageHero(ctx, { eyebrow: `Feedback · ${b.name}`, title: 'We value your feedback', lede: 'Tell us about your visit. Your experience helps us improve care for every patient.', compact: true })}

<section class="section section--flush">
  <div class="container split split--form split--top">
    <div class="card card--form">
      <h2>Share your experience</h2>
      ${P.feedbackForm(ctx, b)}
    </div>
    <div class="stack">
      ${P.reviewCta(b, { title: 'Prefer to post publicly?', text: 'A Google review helps other families find trusted care.' })}
      ${reviews.map((r) => `<figure class="review"><span class="review__q">${icon('quote')}</span><blockquote><p>${esc(r.text)}</p></blockquote><figcaption><strong>${esc(r.name)}</strong><span>${icon('google')}Google review</span></figcaption></figure>`).join('')}
    </div>
  </div>
</section>
`;
  return { file, html: page(ctx, body) };
}

// ================================================================= blogs
export function blogsPage(b) {
  const file = pageUrl(b, 'blogs');
  const ctx = makeCtx(b, file, { current: 'blogs', crumbs: [home(b), { name: 'Blogs' }], altPath: pageUrl(other(b), 'blogs') });
  const posts = blogs(b.id);
  const cats = [...new Set(posts.map((p) => p.category))];
  const body = `
${P.pageHero(ctx, { eyebrow: `Health library · ${b.name}`, title: 'Health blogs from our doctors', lede: 'Clear, practical articles on heart health, kidney and urinary care, children’s health and everyday wellness.', compact: true })}

<section class="section section--flush">
  <div class="container">
    <div class="filter__chips filter__chips--solo" role="group" aria-label="Filter articles by topic" data-blog-filter>
      <button type="button" class="chip chip--toggle is-active" data-cat="" aria-pressed="true">All topics</button>
      ${cats.map((c) => `<button type="button" class="chip chip--toggle" data-cat="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join('')}
    </div>
    <h2 class="sr-only">All articles</h2>
    <div class="blog-grid" data-blog-grid>${posts.map((p) => P.blogCard(ctx, b, p).replace('<article class="blog-card"', `<article class="blog-card" data-cat="${esc(p.category)}"`)).join('')}</div>
  </div>
</section>

${P.bookBand(ctx, b, { title: 'Have a health concern?', text: 'Articles are for awareness. For advice about your own health, please consult one of our doctors.' })}
`;
  return { file, html: page(ctx, body) };
}

export function blogPage(b, post, all) {
  const file = blogUrl(b, post.slug);
  const ctx = makeCtx(b, file, {
    legacy: post.legacy, current: 'blogs', ogType: 'article',
    crumbs: [home(b), { name: 'Blogs', url: pageUrl(b, 'blogs') }, { name: post.title }],
    altPath: blogUrl(other(b), post.slug),
  });
  let html = fragment(post.body);
  let points = '';
  const pm = /<!--points-->([\s\S]*?)<!--\/points-->/.exec(html);
  if (pm) {
    html = html.replace(pm[0], '').trim();
    const t = /<h4>([\s\S]*?)<\/h4>/.exec(pm[1]);
    points = `<div class="key-points"><h2>${icon('list-checks')}${t ? t[1] : 'Key points'}</h2>${pm[1].replace(/<h4>[\s\S]*?<\/h4>/, '').replace(/<ul>/g, '<ul class="checks">')}</div>`;
  }
  // the page title is the <h1>; a leading heading that repeats it becomes the standfirst
  let standfirst = post.lede;
  const lead = /^<h3>([\s\S]*?)<\/h3>\s*/.exec(html);
  if (lead) { html = html.slice(lead[0].length); if (!standfirst) standfirst = stripTags(lead[1]); }
  html = normalizeHeadings(html);
  const mins = readingMinutes(html + points);
  const cover = imgSize(`blog/${post.cover}`);
  const related = [...all.filter((p) => p.slug !== post.slug && p.category === post.category), ...all.filter((p) => p.slug !== post.slug && p.category !== post.category)].slice(0, 3);

  ctx.jsonLd.push({
    '@context': 'https://schema.org', '@type': 'Article', headline: post.heading,
    image: `${SITE.origin}/assets/img/blog/${post.cover}.webp`,
    author: { '@type': 'Organization', name: SITE.name }, publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: `${SITE.origin}/assets/img/brand/logo.png` } },
    mainEntityOfPage: `${SITE.origin}/${file}`, articleSection: post.category,
  });

  const body = `
<article class="article">
  <header class="article__head">
    <div class="container container--narrow">
      ${P.breadcrumbs(ctx)}
      <p class="article__meta"><span class="chip">${esc(post.category)}</span><span>${icon('clock')}${mins} min read</span><span>${icon('stethoscope')}Raksha Hospital, ${esc(b.name)}</span></p>
      <h1>${esc(post.heading)}</h1>
      ${standfirst ? `<p class="lede">${esc(standfirst)}</p>` : ''}
    </div>
  </header>
  <div class="container container--narrow">
    <div class="article__cover"><img src="${esc(rel(ctx.path, `assets/img/blog/${post.cover}.webp`))}" srcset="${esc(rel(ctx.path, `assets/img/blog/${post.cover}-sm.webp`))} 640w, ${esc(rel(ctx.path, `assets/img/blog/${post.cover}.webp`))} ${cover.w}w" sizes="(min-width: 860px) 820px, 100vw" width="${cover.w}" height="${cover.h}" alt="" fetchpriority="high" decoding="async"></div>
    ${points}
    <div class="prose prose--article">${html}</div>
    <p class="note">${icon('info')}<span>This article is for general awareness and is not a substitute for professional medical advice. If you have symptoms or concerns, please consult a doctor.</span></p>
    <div class="article__cta">
      <div><h2>Talk to a specialist</h2><p>Book a consultation at Raksha Hospital, ${esc(b.name)}.</p></div>
      <div class="actions">${P.bookBtn(ctx, b, { query: `?source=blog-${encodeURIComponent(post.slug)}` })}${P.callBtn(b)}</div>
    </div>
  </div>
</article>

<section class="section section--tint">
  <div class="container">
    ${P.sectionHead({ eyebrow: 'Keep reading', title: 'Related articles', link: { href: L(ctx, pageUrl(b, 'blogs')), label: 'All articles' } })}
    <div class="blog-grid">${related.map((p) => P.blogCard(ctx, b, p)).join('')}</div>
  </div>
</section>
`;
  return { file, html: page(ctx, body) };
}

// ================================================================= error pages
// Served by Apache for any missing URL, so every link must be absolute (rel() switches when the path starts with "/").
export function errorPage(b, kind) {
  const file = pageUrl(b, kind === 404 ? 'notFound' : 'serverError');
  const is404 = kind === 404;
  const ctx = {
    branch: b, path: `/${file}`, current: '', jsonLd: [], noindex: true, hideSos: false,
    title: is404 ? `Page Not Found - Raksha Hospital ${b.name}` : `Server Error - Raksha Hospital ${b.name}`,
    description: is404 ? 'The page you are looking for could not be found.' : 'Something went wrong on our side.',
  };
  const links = [['Home', `${b.dir}/`, 'house'], ['Find a doctor', pageUrl(b, 'doctors'), 'stethoscope'], ['Specialities', pageUrl(b, 'specialities'), 'layout-grid'], ['Book appointment', pageUrl(b, 'appointment'), 'calendar-check'], ['Contact us', pageUrl(b, 'contact'), 'phone']];
  const body = `
<section class="error-page">
  <div class="container container--narrow">
    <p class="error-page__code">${kind}</p>
    <h1>${is404 ? 'We could not find that page' : 'Something went wrong'}</h1>
    <p class="lede">${is404 ? 'The page may have moved or the link may be out of date. These links will get you back on track.' : 'Our website hit a problem. Please try again in a few minutes — and if you need care urgently, call us.'}</p>
    <ul class="error-page__links">${links.map(([t, u, ic]) => `<li><a href="${L(ctx, u)}">${icon(ic)}${esc(t)}</a></li>`).join('')}</ul>
    <p class="muted">Looking for our other branch? ${BRANCH_LIST.filter((x) => x.id !== b.id).map((x) => `<a href="${L(ctx, `${x.dir}/`)}">Raksha Hospital, ${esc(x.name)}</a>`).join('')}</p>
  </div>
</section>
`;
  return { file, html: page(ctx, body) };
}
