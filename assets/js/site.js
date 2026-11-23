/* Raksha Multi Speciality Hospital — site behaviour (no dependencies).
   Everything here is progressive enhancement: pages are readable and navigable without it. */
(function () {
  'use strict';
  var doc = document;
  var $ = function (sel, root) { return (root || doc).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Opening the files straight from a folder (file://): folder links need index.html ---- */
  if (location.protocol === 'file:') {
    $$('a[href]').forEach(function (a) {
      var h = a.getAttribute('href');
      if (/^(https?:|mailto:|tel:|#)/.test(h)) return;
      var m = /^([^?#]*)(.*)$/.exec(h);
      if (m[1] === '' || /\/$/.test(m[1])) a.setAttribute('href', m[1] + 'index.html' + m[2]);
    });
  }

  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ---- Logo: on the page it links to, return to the top straight away instead of reloading the page ---- */
  $$('a.brand, a.footer__logo').forEach(function (logo) {
    logo.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var same = function (path) { return path.replace(/index\.html$/, ''); };
      if (logo.host !== location.host || same(logo.pathname) !== same(location.pathname)) return;
      e.preventDefault();
      if (location.hash) history.replaceState(history.state, '', location.href.split('#')[0]);
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---- Header shadow once the top bar has scrolled away ---- */
  var header = $('#site-header');
  var topbar = $('.topbar');
  if (header && topbar && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      header.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }).observe(topbar);
  }

  /* ---- Mobile menu ---- */
  var drawer = $('#drawer');
  var menuBtn = $('.menu-btn');
  if (drawer && menuBtn) {
    var setDrawer = function (open) {
      drawer.hidden = !open;
      menuBtn.setAttribute('aria-expanded', String(open));
      // keep keyboard and screen-reader focus inside the open menu
      $$('main, .footer, .topbar, .sos-band, .mobile-bar').forEach(function (el) { el.inert = open; });
      doc.documentElement.style.overflow = open ? 'hidden' : '';
      if (open) { var first = $('.drawer__head button', drawer); if (first) first.focus(); }
      else menuBtn.focus();
    };
    menuBtn.addEventListener('click', function () { setDrawer(drawer.hidden); });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('[data-close-drawer]') || e.target.closest('a')) setDrawer(false);
    });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !drawer.hidden) setDrawer(false); });
  }

  /* ---- Find a doctor: search + department filter ---- */
  var docFilter = $('[data-doctor-filter]');
  if (docFilter) {
    var cards = $$('[data-doctor-grid] .doc-card');
    var search = $('[data-doctor-search]');
    var chips = $$('[data-dept]', docFilter);
    var count = $('[data-doctor-count]');
    var empty = $('[data-doctor-empty]');
    var dept = '';
    var apply = function () {
      var q = search.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (c) {
        var ok = (!dept || c.getAttribute('data-depts').split('|').indexOf(dept) !== -1) &&
          (!q || c.getAttribute('data-search').indexOf(q) !== -1);
        c.hidden = !ok;
        if (ok) shown++;
      });
      count.textContent = shown === cards.length ? 'Showing all ' + cards.length + ' doctors' : 'Showing ' + shown + ' of ' + cards.length + ' doctors';
      empty.hidden = shown !== 0;
    };
    var pick = function (value) {
      dept = value;
      chips.forEach(function (c) {
        var on = c.getAttribute('data-dept') === value;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', String(on));
      });
      apply();
    };
    chips.forEach(function (c) { c.addEventListener('click', function () { pick(c.getAttribute('data-dept')); }); });
    search.addEventListener('input', apply);
    var reset = $('[data-doctor-reset]');
    if (reset) reset.addEventListener('click', function () { search.value = ''; pick(''); search.focus(); });
    var wanted = new URLSearchParams(location.search).get('dept');
    if (wanted) pick(wanted);
  }

  /* ---- Blog topic filter ---- */
  var blogFilter = $('[data-blog-filter]');
  if (blogFilter) {
    var posts = $$('[data-blog-grid] .blog-card');
    $$('[data-cat]', blogFilter).forEach(function (chip) {
      chip.addEventListener('click', function () {
        var cat = chip.getAttribute('data-cat');
        $$('[data-cat]', blogFilter).forEach(function (c) {
          c.classList.toggle('is-active', c === chip);
          c.setAttribute('aria-pressed', String(c === chip));
        });
        posts.forEach(function (p) { p.hidden = !!cat && p.getAttribute('data-cat') !== cat; });
      });
    });
  }

  /* ---- "Show all services" on phones ---- */
  var svcToggle = $('[data-svc-toggle]');
  if (svcToggle) {
    svcToggle.addEventListener('click', function () {
      $('#svc-list').classList.add('is-open');
      svcToggle.hidden = true;
    });
  }

  /* ---- Forms that open WhatsApp with the message filled in ---- */
  var SOURCE_TO_DEPT = {
    'cardiology': 'Cardiology', 'general-medicine': 'General Medicine', 'orthopedics': 'Orthopaedics', 'pediatrics': 'Paediatrics',
    'obgyn': 'Obstetrics & Gynaecology', 'high-risk-pregnancy': 'Obstetrics & Gynaecology', 'general-surgery': 'General Surgery',
    'neurology': 'Neurology', 'urology': 'Urology', 'nephrology': 'Nephrology', 'ent': 'ENT', 'dermatology': 'Dermatology',
    'ophthalmology': 'Ophthalmology', 'psychiatry': 'Psychiatry', 'oncology': 'Oncology', 'gastroenterology': 'Gastroenterology',
    'diabetology': 'Diabetology', 'health-checkup': 'Health Check-up'
  };
  var params = new URLSearchParams(location.search);
  var today = new Date();
  var isoToday = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
  $$('[data-min-today]').forEach(function (i) { i.min = isoToday; });

  var selectByText = function (select, text) {
    if (!select || !text) return;
    $$('option', select).forEach(function (o) { if (o.textContent.trim() === text || o.value === text) select.value = o.value; });
  };
  var prettyDate = function (iso) {
    var p = iso.split('-');
    if (p.length !== 3) return iso;
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return Number(p[2]) + ' ' + months[Number(p[1]) - 1] + ' ' + p[0];
  };

  $$('form[data-wa-form]').forEach(function (form) {
    var kind = form.getAttribute('data-wa-form');
    var el = function (name) { return form.elements[name]; };
    var errorBox = $('.form__error', form);
    var branchSel = $('[data-branch-select]', form);
    var phoneLink = $('[data-branch-phone]', form);

    if (branchSel && phoneLink) {
      branchSel.addEventListener('change', function () {
        var o = branchSel.options[branchSel.selectedIndex];
        phoneLink.textContent = o.getAttribute('data-phone-display');
        phoneLink.href = 'tel:' + o.getAttribute('data-phone');
      });
    }

    if (kind === 'appointment') {
      // Links such as appointment.html?doctor=sushma-s or ?package=cardiac-care&source=health-checkup pre-fill the form.
      var wantDoctor = params.get('doctor');
      if (wantDoctor && el('doctor')) {
        $$('option', el('doctor')).forEach(function (o) {
          var ids = [o.getAttribute('data-id')].concat((o.getAttribute('data-aliases') || '').split(' '));
          if (ids.indexOf(wantDoctor) !== -1) el('doctor').value = o.value;
        });
      }
      var source = params.get('source');
      var wantDept = params.get('department') || (source && SOURCE_TO_DEPT[source]);
      if (wantDept) selectByText(el('department'), wantDept);
      var pkg = params.get('package');
      if (pkg) {
        var names = {};
        try { names = JSON.parse(form.getAttribute('data-packages') || '{}'); } catch (e) { /* ignore */ }
        var label = names[pkg] || pkg.replace(/-/g, ' ');
        el('package').value = label;
        selectByText(el('department'), 'Health Check-up');
        var note = $('[data-package-note]', form);
        if (note) { $('span', note).textContent = 'Health package: ' + label; note.hidden = false; }
      }
      if ((wantDoctor || pkg) && form.id === 'appointment-form' && !location.hash) {
        var card = form.closest('.card');
        if (card && card.getBoundingClientRect().top > window.innerHeight * 0.6) card.scrollIntoView({ block: 'start' });
      }
    }

    var fail = function (field, message) {
      if (field && field.classList) { field.classList.add('is-invalid'); if (field.focus) field.focus(); }
      errorBox.textContent = message;
      errorBox.hidden = false;
      return false;
    };

    form.addEventListener('input', function (e) {
      if (e.target.classList) e.target.classList.remove('is-invalid');
      errorBox.hidden = true;
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errorBox.hidden = true;
      var val = function (name) { return el(name) && el(name).value ? String(el(name).value).trim() : ''; };
      var name = val('name'), phone = val('phone');
      if (name.length < 2) return fail(el('name'), 'Please enter your full name.');
      if (phone && phone.replace(/\D/g, '').length < 10) return fail(el('phone'), 'Please enter a valid 10-digit phone number, or leave it blank.');

      var branch = val('branch') || 'Electronic City';
      var number = doc.body.getAttribute('data-wa');
      if (branchSel) number = branchSel.options[branchSel.selectedIndex].getAttribute('data-wa') || number;

      var lines = [];
      var add = function (label, value) { if (value) lines.push('*' + label + ':* ' + value); };
      if (kind === 'appointment') {
        lines.push('*Appointment request — Raksha Hospital, ' + branch + '*', '');
        add('Name', name); add('Phone', phone); add('Department', val('department')); add('Preferred doctor', val('doctor'));
        add('Preferred date', val('date') ? prettyDate(val('date')) : ''); add('Health package', val('package')); add('Reason for visit', val('reason'));
      } else if (kind === 'contact') {
        if (val('message').length < 3) return fail(el('message'), 'Please type your message.');
        lines.push('*Enquiry — Raksha Hospital, ' + branch + '*', '');
        add('Name', name); add('Phone', phone);
        lines.push('', val('message'));
      } else {
        var rating = form.querySelector('input[name="rating"]:checked');
        if (!rating) return fail(null, 'Please choose a star rating.');
        if (val('message').length < 3) return fail(el('message'), 'Please share a few words about your experience.');
        var n = Number(rating.value);
        lines.push('*Patient feedback — Raksha Hospital, ' + branch + '*', '');
        add('Name', name); add('Phone', phone);
        add('Rating', new Array(n + 1).join('★') + new Array(6 - n).join('☆') + ' (' + n + '/5)');
        lines.push('', val('message'));
      }
      lines.push('', '_Sent from rakshahospital.com_');

      var url = 'https://wa.me/' + number + '?text=' + encodeURIComponent(lines.join('\n'));
      var win = window.open(url, '_blank', 'noopener');
      if (win === null && !/Mobi|Android/i.test(navigator.userAgent)) { location.href = url; return; }

      var ok = $('.form__ok', form);
      if (!ok) {
        ok = doc.createElement('p');
        ok.className = 'form__ok';
        ok.setAttribute('role', 'status');
        form.insertBefore(ok, $('.form__foot', form));
      }
      ok.textContent = 'WhatsApp has opened with your message. Tap Send there to complete your request.';
    });
  });

  /* ---- Gallery lightbox (and tap-to-reveal for surgical photographs) ---- */
  var dialog = $('[data-lightbox-dialog]');
  var shots = $$('a[data-lightbox]');
  if (dialog && shots.length && typeof dialog.showModal === 'function') {
    var image = $('img', dialog), caption = $('figcaption', dialog), index = 0;
    var blocked = function (a) { var f = a.closest('.shot--sensitive'); return f && !f.classList.contains('is-revealed'); };
    var show = function (i) {
      index = (i + shots.length) % shots.length;
      var a = shots[index];
      image.src = a.href;
      image.width = a.getAttribute('data-w');
      image.height = a.getAttribute('data-h');
      image.alt = a.getAttribute('data-caption');
      caption.textContent = a.getAttribute('data-caption');
    };
    var step = function (dir) {
      var i = index;
      for (var n = 0; n < shots.length; n++) { i = (i + dir + shots.length) % shots.length; if (!blocked(shots[i])) break; }
      show(i);
    };
    shots.forEach(function (a, i) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        if (blocked(a)) { a.closest('.shot--sensitive').classList.add('is-revealed'); return; }
        show(i);
        dialog.showModal();
      });
    });
    $('[data-lightbox-close]', dialog).addEventListener('click', function () { dialog.close(); });
    $('[data-lightbox-prev]', dialog).addEventListener('click', function () { step(-1); });
    $('[data-lightbox-next]', dialog).addEventListener('click', function () { step(1); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  /* ---- Landing page: specialities by branch (tabs) ---- */
  $$('[data-tabs]').forEach(function (root) {
    var tabs = $$('[role="tab"]', root);
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        doc.getElementById(t.getAttribute('aria-controls')).classList.toggle('is-active', on);
      });
      if (focus) tab.focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        select(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true);
      });
    });
  });

  /* ---- Consultants by department (phones): tap a department to open or close it ---- */
  $$('[data-team-dir] .team-dir__tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var open = !tab.classList.contains('is-active');
      tab.classList.toggle('is-active', open);
      tab.setAttribute('aria-expanded', String(open));
      doc.getElementById(tab.getAttribute('aria-controls')).classList.toggle('is-active', open);
    });
  });

  /* ---- Health packages on the home pages: "What's included" opens the list of tests (phones) ---- */
  $$('[data-pkg-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      doc.getElementById(btn.getAttribute('aria-controls')).classList.toggle('is-open', open);
    });
  });

  /* ---- Landing page: "Nearest to me" (the location never leaves the visitor's device) ---- */
  var nearestBtn = $('[data-nearest]');
  if (nearestBtn && 'geolocation' in navigator) {
    var branchCards = $$('[data-branch-card]');
    var nearestMsg = $('[data-nearest-msg]');
    var say = function (text) { nearestMsg.textContent = text; nearestMsg.hidden = !text; };
    var distanceKm = function (lat1, lng1, lat2, lng2) {
      var rad = Math.PI / 180, dLat = (lat2 - lat1) * rad, dLng = (lng2 - lng1) * rad;
      var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
      return 2 * 6371 * Math.asin(Math.sqrt(h));
    };
    nearestBtn.hidden = false;
    nearestBtn.addEventListener('click', function () {
      nearestBtn.disabled = true;
      say('Finding your location…');
      navigator.geolocation.getCurrentPosition(function (pos) {
        var best = null, bestKm = Infinity;
        var found = branchCards.map(function (card) {
          var km = distanceKm(pos.coords.latitude, pos.coords.longitude, Number(card.getAttribute('data-lat')), Number(card.getAttribute('data-lng')));
          if (km < bestKm) { bestKm = km; best = card; }
          return { card: card, km: km };
        });
        found.forEach(function (f) {
          var badge = $('[data-dist]', f.card);
          var text = f.km < 1 ? 'under 1 km' : '≈ ' + (f.km < 10 ? f.km.toFixed(1) : Math.round(f.km)) + ' km';
          badge.textContent = f.card === best ? 'Nearest to you · ' + text : text + ' away';
          badge.hidden = false;
          f.card.classList.toggle('is-nearest', f.card === best);
        });
        if (best !== branchCards[0]) best.parentNode.insertBefore(best, branchCards[0]);
        nearestBtn.disabled = false;
        say(bestKm > 60 ? 'You appear to be outside Bengaluru. Distances are straight-line estimates.' : '');
      }, function () {
        nearestBtn.disabled = false;
        say('We could not get your location. Please choose a branch below.');
      }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
    });
  }

  /* ---- Gentle reveal for content below the fold ---- */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var targets = $$('.section-head, .spec-card, .doc-card, .doc-mini, .fac-card, .pkg-card, .blog-card, .why-grid li, .review, .topic, .box, .shot, .leader-card, .contact-cards li, .steps li, .mini-grid li, .hygiene li, .always-on__col, .gp-mosaic a, .gp-why__list li, .book-band, .review-cta');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    var fold = window.innerHeight * 0.92;
    targets.forEach(function (t) {
      if (t.getBoundingClientRect().top < fold) return;
      var siblings = t.parentElement ? Array.prototype.indexOf.call(t.parentElement.children, t) : 0;
      t.style.transitionDelay = Math.min(siblings % 4, 3) * 70 + 'ms';
      t.classList.add('reveal');
      io.observe(t);
    });
  }
})();
