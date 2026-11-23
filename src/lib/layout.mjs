// The page shell: <head>, top bar, header + navigation, footer, mobile action bar.
import { SITE, BRANCHES, BRANCH_LIST } from '../data/site.mjs';
import { SPECIALITIES } from '../data/specialities.mjs';
import { esc, attrs, rel, pageUrl, icon, jsonLd, tel, wa, imgSize, assetVersion } from './core.mjs';

const BUILD_YEAR = new Date().getFullYear();
let versions = null;
const v = () => (versions ??= { css: assetVersion('assets/css/site.css'), js: assetVersion('assets/js/site.js') });

// Runs before the page is drawn. It marks that JavaScript is available and makes a REFRESH start at the top of the
// page. Browsers normally jump back to where you were (or to the #section in the address), and they do it in
// several steps while the page loads, so on a refresh this script: asks the browser not to restore the position,
// drops any #section from the address, and puts the page back at the top if the browser moves it anyway - until
// the page has finished loading or the visitor starts scrolling. Back/forward navigation is left alone, so going
// back to a page still returns to the place you left.
const BOOT = [
  "document.documentElement.className='js';",
  "(function(){try{",
  "var n=performance.getEntriesByType&&performance.getEntriesByType('navigation')[0];",
  "if(!(n?n.type==='reload':performance.navigation&&performance.navigation.type===1))return;",
  "var d=document.documentElement,on=true;",
  "history.scrollRestoration='manual';",
  "if(location.hash)history.replaceState(history.state,'',location.href.split('#')[0]);",
  "d.style.scrollBehavior='auto';",
  "var top=function(){if(on&&(window.pageYOffset||d.scrollTop))window.scrollTo(0,0)};",
  "var stop=function(){if(!on)return;on=false;d.style.scrollBehavior='';removeEventListener('scroll',top,true)};",
  "addEventListener('scroll',top,true);",
  "document.addEventListener('DOMContentLoaded',top);",
  "addEventListener('load',function(){top();setTimeout(function(){top();stop()},600)});",
  "['wheel','touchstart','keydown','mousedown'].forEach(function(t){addEventListener(t,stop,true)});",
  "addEventListener('pagehide',function(){history.scrollRestoration='auto'});",
  "}catch(e){}})()",
].join('');

export const specUrl = (branch, s) => `${branch.dir}/${branch.paths.specialityDir}/${s.slug}.html`;
export const blogUrl = (branch, slug) => `${branch.dir}/${branch.paths.blogDir}/${slug}.html`;

export function navItems(branch) {
  const p = (k) => pageUrl(branch, k);
  return [
    { key: 'about', label: 'About', url: p('about') },
    { key: 'specialities', label: 'Specialities', url: p('specialities'), mega: true },
    { key: 'doctors', label: 'Doctors', url: p('doctors') },
    { key: 'healthCheck', label: 'Health Check', url: p('healthCheck') },
    { key: 'gallery', label: 'Gallery', url: p('gallery'),
      children: branch.paths.insights ? [{ key: 'gallery', label: 'Hospital gallery', url: p('gallery') }, { key: 'insights', label: 'Clinical insights', url: p('insights') }] : null },
    { key: 'blogs', label: 'Blogs', url: p('blogs') },
    { key: 'contact', label: 'Contact', url: p('contact'),
      children: branch.paths.feedback ? [{ key: 'contact', label: 'Contact us', url: p('contact') }, { key: 'feedback', label: 'Share feedback', url: p('feedback') }] : null },
  ];
}

// ---------------------------------------------------------------- head
function head(ctx) {
  const b = ctx.branch;
  const canonical = `${SITE.origin}/${ctx.path.replace(/^\//, '').replace(/(^|\/)index\.html$/, '$1')}`;
  const og = `${SITE.origin}/assets/img/brand/og-${b ? b.og : 'group'}.jpg`;
  const ogTitle = ctx.ogTitle || ctx.title;
  const L = (to) => rel(ctx.path, to);
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>${BOOT}</script>
<title>${esc(ctx.title)}</title>
${ctx.description ? `<meta name="description" content="${esc(ctx.description)}">` : ''}
${ctx.keywords ? `<meta name="keywords" content="${esc(ctx.keywords)}">` : ''}
<meta name="robots" content="${ctx.noindex ? 'noindex, follow' : 'index, follow, max-snippet:-1, max-image-preview:large'}">
${ctx.noindex ? '' : `<link rel="canonical" href="${esc(canonical)}">`}
<meta name="theme-color" content="${SITE.themeColor}">
<meta name="format-detection" content="telephone=no">
<meta property="og:type" content="${ctx.ogType || 'website'}">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(ogTitle)}">
${ctx.description ? `<meta property="og:description" content="${esc(ctx.description)}">` : ''}
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
${b ? `<meta name="geo.region" content="IN-KA">
<meta name="geo.placename" content="${esc(b.areaLong)}">
<meta name="geo.position" content="${b.geo.lat};${b.geo.lng}">` : ''}
<link rel="icon" href="${L('favicon.ico')}" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="${L('assets/img/brand/favicon-32.png')}">
<link rel="apple-touch-icon" href="${L('assets/img/brand/apple-touch-icon.png')}">
<link rel="preload" href="${L('assets/fonts/plus-jakarta-sans-latin.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${L('assets/css/site.css')}?v=${v().css}">
${(ctx.jsonLd || []).map(jsonLd).join('\n')}
</head>`;
}

// ---------------------------------------------------------------- top bar + header
function branchSwitch(ctx, cls = 'branch-switch') {
  const b = ctx.branch;
  return `<nav class="${cls}" aria-label="Choose hospital branch">${BRANCH_LIST.map((x) => {
    const active = b && x.id === b.id;
    const to = active ? ctx.path.replace(/index\.html$/, '') : (b && ctx.altPath) || `${x.dir}/`;
    return `<a href="${esc(rel(ctx.path, to))}"${active ? ' class="is-active" aria-current="true"' : ''}>${esc(x.name)}</a>`;
  }).join('')}</nav>`;
}

function topbar(ctx) {
  const b = ctx.branch;
  const sos = b
    ? `<a class="topbar__sos" href="${tel(b.phone)}"><span class="pulse" aria-hidden="true"></span><span class="topbar__label">24×7 Emergency &amp; Ambulance</span><strong>${esc(b.phoneDisplay)}</strong></a>`
    : `<span class="topbar__sos"><span class="pulse" aria-hidden="true"></span><span class="topbar__label">24×7 Emergency</span><span class="topbar__short">· ICU · Ambulance</span>${BRANCH_LIST.map((x) => `<a href="${tel(x.phone)}"><span class="topbar__where">${esc(x.name)}</span> <strong>${esc(x.phoneDisplay)}</strong></a>`).join('')}</span>`;
  return `<div class="topbar" role="region" aria-label="Emergency contact and branch selection">
  <div class="container topbar__in">
    ${sos}
    <div class="topbar__right">
      ${b ? `<a class="topbar__mail" href="mailto:${b.email}">${icon('mail')}<span>${esc(b.email)}</span></a>` : ''}
      <span class="topbar__hint">${b ? 'Branch' : 'Choose branch'}</span>
      ${branchSwitch(ctx)}
    </div>
  </div>
</div>`;
}

function megaMenu(ctx, branch) {
  const list = SPECIALITIES[branch.id];
  return `<div class="mega" role="group" aria-label="Specialities">
    <ul class="mega__grid">${list.map((s) => `<li><a href="${esc(rel(ctx.path, specUrl(branch, s)))}">${icon(s.icon)}<span>${esc(s.name)}</span></a></li>`).join('')}</ul>
    <a class="mega__all" href="${esc(rel(ctx.path, pageUrl(branch, 'specialities')))}">View all specialities ${icon('arrow-right')}</a>
  </div>`;
}

function header(ctx) {
  const b = ctx.branch;
  const L = (to) => esc(rel(ctx.path, to));
  const logo = imgSize('brand/logo');
  const home = b ? `${b.dir}/` : '';
  const brand = `<a class="brand" href="${L(home)}" aria-label="${esc(SITE.name)}${b ? `, ${b.name}` : ''} — home"><img src="${L('assets/img/brand/logo.webp')}" width="${logo.w}" height="${logo.h}" alt="${esc(SITE.name)}"></a>`;

  let nav, drawerLinks, cta;
  if (b) {
    const items = navItems(b);
    nav = items.map((it) => {
      const cur = ctx.current === it.key || (it.children || []).some((c) => c.key === ctx.current);
      const link = `<a href="${L(it.url)}"${cur ? ' aria-current="page"' : ''}${it.mega || it.children ? ' aria-haspopup="true"' : ''}>${esc(it.label)}${it.mega || it.children ? icon('chevron-down') : ''}</a>`;
      if (it.mega) return `<li class="has-menu has-mega">${link}${megaMenu(ctx, b)}</li>`;
      if (it.children) return `<li class="has-menu">${link}<ul class="submenu">${it.children.map((c) => `<li><a href="${L(c.url)}"${ctx.current === c.key ? ' aria-current="page"' : ''}>${esc(c.label)}</a></li>`).join('')}</ul></li>`;
      return `<li>${link}</li>`;
    }).join('');
    drawerLinks = `<li><a href="${L(home)}"${ctx.current === 'home' ? ' aria-current="page"' : ''}>Home</a></li>` + items.map((it) => {
      if (it.mega) {
        return `<li><details${ctx.current === 'specialities' ? ' open' : ''}><summary>${esc(it.label)}${icon('chevron-down')}</summary><ul>
          <li><a href="${L(it.url)}">All specialities</a></li>${SPECIALITIES[b.id].map((s) => `<li><a href="${L(specUrl(b, s))}">${esc(s.name)}</a></li>`).join('')}</ul></details></li>`;
      }
      if (it.children) return it.children.map((c) => `<li><a href="${L(c.url)}"${ctx.current === c.key ? ' aria-current="page"' : ''}>${esc(c.label === 'Hospital gallery' ? 'Gallery' : c.label === 'Contact us' ? 'Contact' : c.label)}</a></li>`).join('');
      return `<li><a href="${L(it.url)}"${ctx.current === it.key ? ' aria-current="page"' : ''}>${esc(it.label)}</a></li>`;
    }).join('');
    cta = `<a class="btn btn--primary header__book" href="${L(pageUrl(b, 'appointment'))}" aria-label="Book Appointment">${icon('calendar-check')}<span>Book Appointment</span></a>
      <a class="icon-btn header__call" href="${tel(b.phone)}" aria-label="Call ${esc(b.phoneDisplay)}">${icon('phone')}</a>`;
  } else {
    const links = [['#branches', 'Our branches'], ['#specialities', 'Specialities'], ['#doctors', 'Doctors'], ['#inside', 'Facilities'], ['#why', 'Why Raksha']];
    nav = links.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('');
    drawerLinks = links.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('') + BRANCH_LIST.map((x) => `<li><a href="${L(`${x.dir}/`)}">${esc(x.name)} branch</a></li>`).join('');
    cta = `<a class="btn btn--primary header__book" href="#branches">${icon('map-pin')}<span>Choose your branch</span></a>`;
  }

  const drawerActions = b
    ? `<a class="btn btn--primary btn--block" href="${L(pageUrl(b, 'appointment'))}">${icon('calendar-check')}Book Appointment</a>
       <a class="btn btn--sos btn--block" href="${tel(b.phone)}">${icon('phone-call')}Emergency ${esc(b.phoneDisplay)}</a>
       <a class="btn btn--wa btn--block" href="${wa(b.whatsapp)}" target="_blank" rel="noopener">${icon('whatsapp')}WhatsApp us</a>`
    : BRANCH_LIST.map((x) => `<a class="btn btn--sos btn--block" href="${tel(x.phone)}">${icon('phone-call')}${esc(x.name)}: ${esc(x.phoneDisplay)}</a>`).join('');

  return `<header class="header" id="site-header">
  <div class="container header__in">
    ${brand}
    <nav class="nav" aria-label="Main"><ul>${nav}</ul></nav>
    <div class="header__cta">
      ${cta}
      <button class="icon-btn menu-btn" type="button" aria-controls="drawer" aria-expanded="false" aria-label="Open menu">${icon('menu')}</button>
    </div>
  </div>
</header>
<div class="drawer" id="drawer" hidden>
  <div class="drawer__backdrop" data-close-drawer></div>
  <aside class="drawer__panel" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="drawer__head">
      <span class="drawer__title">Menu</span>
      <button class="icon-btn" type="button" data-close-drawer aria-label="Close menu">${icon('x')}</button>
    </div>
    <div class="drawer__branch"><span>Branch</span>${branchSwitch(ctx, 'branch-switch branch-switch--light')}</div>
    <nav aria-label="Mobile"><ul class="drawer__nav">${drawerLinks}</ul></nav>
    <div class="drawer__actions">${drawerActions}</div>
  </aside>
</div>`;
}

// ---------------------------------------------------------------- footer
function sosBand(ctx) {
  const b = ctx.branch;
  const L = (to) => esc(rel(ctx.path, to));
  const phones = b ? [{ tel: b.phone, display: b.phoneDisplay }, ...b.extraPhones] : BRANCH_LIST.map((x) => ({ tel: x.phone, display: x.phoneDisplay, label: x.name }));
  return `<section class="sos-band" aria-label="Emergency contact">
  <div class="container sos-band__in">
    <div class="sos-band__icon">${icon('siren')}</div>
    <div class="sos-band__text">
      <h2>Medical emergency? We are open 24×7.</h2>
      <p>Emergency care, ICU and ambulance support at any hour${b ? ` in ${esc(b.area)}` : ' at both branches'}. Call us and we will guide you.</p>
    </div>
    <div class="sos-band__actions">
      ${phones.map((p) => `<a class="btn btn--white" href="${tel(p.tel)}">${icon('phone-call')}<span>${p.label ? `<small>${esc(p.label)}</small>` : ''}${esc(p.display)}</span></a>`).join('')}
      ${b ? `<a class="btn btn--ghost-white" href="${L(pageUrl(b, 'appointment'))}">${icon('calendar-check')}Book appointment</a>` : ''}
    </div>
  </div>
</section>`;
}

function socialLinks(b) {
  const s = b ? b.social : { ...BRANCHES.kudlu.social, ...BRANCHES.ec.social };
  const names = { facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube', linkedin: 'LinkedIn' };
  return Object.entries(s).map(([k, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener" aria-label="${names[k]}">${icon(k)}</a>`).join('');
}

function footer(ctx) {
  const b = ctx.branch;
  const L = (to) => esc(rel(ctx.path, to));
  const nb = b || BRANCHES.ec; // link target for the group page
  const quick = [
    ['About us', pageUrl(nb, 'about')], ['Our doctors', pageUrl(nb, 'doctors')], ['Specialities', pageUrl(nb, 'specialities')],
    ['Health check packages', pageUrl(nb, 'healthCheck')], ['Book an appointment', pageUrl(nb, 'appointment')], ['Health blogs', pageUrl(nb, 'blogs')],
    ['Gallery', pageUrl(nb, 'gallery')],
    ...(nb.paths.insights ? [['Clinical insights', pageUrl(nb, 'insights')]] : []),
    ...(nb.paths.feedback ? [['Share feedback', pageUrl(nb, 'feedback')]] : []),
    ['Contact us', pageUrl(nb, 'contact')],
  ];
  const specs = SPECIALITIES[nb.id].slice(0, 8);
  const logo = imgSize('brand/logo');
  return `<footer class="footer">
  <div class="container footer__grid">
    <div class="footer__about">
      <a class="footer__logo" href="${L(b ? `${b.dir}/` : '')}"><img src="${L('assets/img/brand/logo.webp')}" width="${logo.w}" height="${logo.h}" alt="${esc(SITE.name)}" loading="lazy"></a>
      <p>Multi-speciality care with 24×7 emergency, ICU, diagnostics and pharmacy — at two branches in South Bengaluru.</p>
      <p class="footer__tagline">${esc(SITE.tagline)}</p>
      <div class="social">${socialLinks(b)}</div>
    </div>
    <nav class="footer__col" aria-label="Quick links">
      <h2>Quick links</h2>
      <ul>${quick.map(([t, u]) => `<li><a href="${L(u)}">${esc(t)}</a></li>`).join('')}</ul>
    </nav>
    <nav class="footer__col" aria-label="Specialities">
      <h2>Specialities</h2>
      <ul>${specs.map((s) => `<li><a href="${L(specUrl(nb, s))}">${esc(s.name)}</a></li>`).join('')}
      <li><a class="footer__more" href="${L(pageUrl(nb, 'specialities'))}">All specialities ${icon('arrow-right')}</a></li></ul>
    </nav>
    <div class="footer__col footer__branches">
      <h2>Our branches</h2>
      ${BRANCH_LIST.map((x) => `<address>
        <a class="footer__branch" href="${L(`${x.dir}/`)}">${esc(x.name)}</a>
        <span>${x.address.lines.map(esc).join('<br>')}</span>
        <a href="${tel(x.phone)}">${icon('phone')}${esc(x.phoneDisplay)}</a>
        <a href="mailto:${x.email}">${icon('mail')}${esc(x.email)}</a>
      </address>`).join('')}
    </div>
  </div>
  ${b ? `<a class="wa-float" href="${wa(b.whatsapp)}" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">${icon('whatsapp')}</a>` : ''}
  <div class="footer__bar">
    <div class="container footer__bar-in">
      <p>© <span data-year>${BUILD_YEAR}</span> ${esc(SITE.name)}. All rights reserved.</p>
      <p>Information on this website is for general awareness and is not a substitute for medical advice.</p>
    </div>
  </div>
</footer>`;
}

function mobileBar(ctx) {
  const b = ctx.branch;
  if (!b) {
    return `<nav class="mobile-bar mobile-bar--group" aria-label="Call a branch">${BRANCH_LIST.map((x) => `<a href="${tel(x.phone)}">${icon('phone-call')}<span><small>Call 24×7</small>${esc(x.name)}</span></a>`).join('')}</nav>`;
  }
  return `<nav class="mobile-bar" aria-label="Quick actions">
  <a href="${tel(b.phone)}">${icon('phone-call')}<span>Call</span></a>
  <a class="mobile-bar__wa" href="${wa(b.whatsapp)}" target="_blank" rel="noopener">${icon('whatsapp')}<span>WhatsApp</span></a>
  <a class="mobile-bar__primary" href="${esc(rel(ctx.path, pageUrl(b, 'appointment')))}">${icon('calendar-check')}<span>Book</span></a>
</nav>`;
}

// ---------------------------------------------------------------- shell
export function page(ctx, body) {
  const b = ctx.branch;
  return `<!doctype html>
<html lang="en-IN">
${head(ctx)}
<body${attrs({ class: ctx.bodyClass, 'data-branch': b ? b.id : 'group', 'data-wa': b ? b.whatsapp : null })}>
<a class="skip-link" href="#main">Skip to content</a>
${topbar(ctx)}
${header(ctx)}
<main id="main">
${body}
</main>
${ctx.hideSos ? '' : sosBand(ctx)}
${footer(ctx)}
${mobileBar(ctx)}
<script src="${esc(rel(ctx.path, 'assets/js/site.js'))}?v=${v().js}" defer></script>
</body>
</html>
`;
}

// ---------------------------------------------------------------- structured data
export function hospitalLd(b) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Hospital',
    '@id': `${SITE.origin}/${b.dir}/#hospital`,
    name: b.fullName,
    alternateName: SITE.shortName,
    url: `${SITE.origin}/${b.dir}/`,
    logo: `${SITE.origin}/assets/img/brand/logo.png`,
    image: `${SITE.origin}/assets/img/brand/og-${b.og}.jpg`,
    telephone: b.phone,
    email: b.email,
    address: { '@type': 'PostalAddress', streetAddress: b.address.street, addressLocality: b.address.locality, addressRegion: b.address.region, postalCode: b.address.postal, addressCountry: 'IN' },
    geo: { '@type': 'GeoCoordinates', latitude: b.geo.lat, longitude: b.geo.lng },
    openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '00:00', closes: '23:59' },
    hasMap: b.mapLink,
    medicalSpecialty: SPECIALITIES[b.id].map((s) => s.name),
    sameAs: Object.values(b.social),
  };
}

export function breadcrumbLd(ctx) {
  if (!ctx.crumbs || !ctx.crumbs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: ctx.crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: `${SITE.origin}/${(c.url ?? ctx.path).replace(/(^|\/)index\.html$/, '$1')}` })),
  };
}
