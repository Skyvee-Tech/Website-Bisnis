(() => {
  const header = document.getElementById('site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  const iconUse = toggle?.querySelector('use');

  const setMenu = (open) => {
    if (!toggle) return;
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    iconUse?.setAttribute('href', open ? '#i-close' : '#i-menu');
    if (open) nav?.querySelector('a')?.focus();
  };

  toggle?.addEventListener('click', () => setMenu(!header.classList.contains('is-open')));
  nav?.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const wasOpen = header.classList.contains('is-open');
    setMenu(false);
    if (wasOpen) toggle?.focus();
  });
  document.addEventListener('click', (e) => {
    if (header.classList.contains('is-open') && !header.contains(e.target)) setMenu(false);
  });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  const themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    const themeIcon = themeBtn.querySelector('use');
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    const brandMark = document.getElementById('brand-mark');
    const syncTheme = () => {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      const label = dark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap';
      themeBtn.setAttribute('aria-label', label);
      themeBtn.setAttribute('title', dark ? 'Mode terang' : 'Mode gelap');
      themeIcon.setAttribute('href', dark ? '#i-sun' : '#i-moon');
      if (brandMark) brandMark.src = dark ? brandMark.dataset.dark : brandMark.dataset.light;
      if (metaTheme) metaTheme.setAttribute('content', dark ? '#0b1229' : '#16204a');
    };
    syncTheme();
    themeBtn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncTheme();
    });
  }

  const wz = document.querySelector('[data-wizard]');
  if (wz) {
    const state = { device: '', issue: '', mode: '', note: '' };
    const steps = [...wz.querySelectorAll('[data-step]')];
    const dots = [...wz.querySelectorAll('[data-dot]')];
    const summary = wz.querySelector('[data-summary]');
    const send = wz.querySelector('[data-send]');
    const note = wz.querySelector('[data-note]');
    let current = 1;

    const update = () => {
      if (!summary || !send) return;
      summary.textContent = state.device && state.issue
        ? [state.device, state.issue, state.mode].filter(Boolean).join(' · ')
        : '';
      const msg = `Halo Skyvee Tech, saya mau konsultasi servis.\n\nPerangkat: ${state.device}\nKeluhan: ${state.issue}` +
        (state.mode ? `\nCara layanan: ${state.mode}` : '') +
        (state.note ? `\nCatatan: ${state.note}` : '') +
        '\n\nMohon info estimasi biaya dan langkahnya.';
      send.href = 'https://wa.me/6285641388709?text=' + encodeURIComponent(msg);
    };

    const show = (n) => {
      current = n;
      steps.forEach((s) => s.classList.toggle('is-active', Number(s.dataset.step) === n));
      dots.forEach((d) => d.classList.toggle('is-active', Number(d.dataset.dot) <= n));
      if (n === 3) update();
      wz.querySelector(`[data-step="${n}"] .wizard-q`)?.focus();
    };

    const bind = (step, key) => {
      const group = wz.querySelector(`[data-step="${step}"]`);
      const next = group.querySelector('[data-next]');
      group.querySelectorAll('.chip').forEach((chip) => {
        chip.addEventListener('click', () => {
          group.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', 'false'));
          chip.setAttribute('aria-pressed', 'true');
          const changed = state[key] !== chip.dataset.value;
          state[key] = chip.dataset.value;
          if (next) next.disabled = false;
          if (step === 1 && changed) {
            const issueGroup = wz.querySelector('[data-step="2"]');
            state.issue = '';
            issueGroup.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', 'false'));
            const issueNext = issueGroup.querySelector('[data-next]');
            if (issueNext) issueNext.disabled = true;
          }
          update();
        });
      });
    };
    bind(1, 'device');
    bind(2, 'issue');
    bind(3, 'mode');

    wz.querySelectorAll('[data-next]').forEach((btn) => btn.addEventListener('click', () => show(current + 1)));
    wz.querySelectorAll('[data-back]').forEach((btn) => btn.addEventListener('click', () => show(current - 1)));
    note?.addEventListener('input', () => { state.note = note.value.trim(); update(); });
  }

  const reviewMore = document.querySelector('[data-review-more]');
  const reviewExtras = [...document.querySelectorAll('[data-review-extra]')];
  if (reviewMore && reviewExtras.length) {
    const moreLabel = `Lihat ${reviewExtras.length} ulasan lainnya`;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('review-cards')?.classList.add('is-collapsible');
    reviewMore.hidden = false;
    reviewMore.textContent = moreLabel;
    reviewMore.addEventListener('click', () => {
      const expanded = reviewMore.getAttribute('aria-expanded') === 'true';
      reviewExtras.forEach((card) => {
        card.classList.toggle('is-shown', !expanded);
        if (!expanded) card.classList.add('is-visible');
      });
      reviewMore.setAttribute('aria-expanded', String(!expanded));
      reviewMore.textContent = expanded ? moreLabel : 'Tampilkan lebih sedikit';
      if (expanded) {
        reviewMore.focus();
      } else {
        const first = reviewExtras[0];
        first.setAttribute('tabindex', '-1');
        requestAnimationFrame(() => {
          first.focus({ preventScroll: true });
          first.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        });
      }
    });
  }

  const galleryImgs = [...document.querySelectorAll('.gallery .shot img')];
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox?.querySelector('[data-lb-img]');
  const lbCap = lightbox?.querySelector('[data-lb-caption]');
  if (galleryImgs.length && lightbox && lbImg && lbCap) {
    let lbIndex = 0;
    const closeLb = () => {
      if (typeof lightbox.close === 'function') lightbox.close();
      else lightbox.removeAttribute('open');
    };
    const showLb = (i) => {
      lbIndex = (i + galleryImgs.length) % galleryImgs.length;
      const img = galleryImgs[lbIndex];
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = img.closest('figure')?.querySelector('figcaption')?.textContent || img.alt;
    };
    const openLb = (i) => {
      showLb(i);
      if (typeof lightbox.showModal === 'function') lightbox.showModal();
      else lightbox.setAttribute('open', '');
    };
    galleryImgs.forEach((img, i) => {
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', `Perbesar foto: ${img.alt}`);
      img.addEventListener('click', () => openLb(i));
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLb(i);
        }
      });
    });
    lightbox.querySelector('[data-lb-close]')?.addEventListener('click', closeLb);
    lightbox.querySelector('[data-lb-prev]')?.addEventListener('click', () => showLb(lbIndex - 1));
    lightbox.querySelector('[data-lb-next]')?.addEventListener('click', () => showLb(lbIndex + 1));
    lightbox.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); showLb(lbIndex - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); showLb(lbIndex + 1); }
    });
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });
  }

  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.innerHTML = '<span></span>';
  document.body.prepend(progress);
  const progressBar = progress.firstElementChild;

  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const navSections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    let current = null;
    navSections.forEach((section) => {
      if (section.getBoundingClientRect().top <= 120) current = section;
    });
    navLinks.forEach((link) => {
      if (current && link.getAttribute('href') === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  let ticking = false;
  const requestScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      onScroll();
      ticking = false;
    });
  };
  onScroll();
  window.addEventListener('scroll', requestScroll, { passive: true });
  window.addEventListener('resize', requestScroll);

  const canHover = window.matchMedia('(hover: hover)').matches;
  const reducePointer = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canHover && !reducePointer) {
    let pointerRaf = 0;
    document.addEventListener('pointermove', (e) => {
      const card = e.target.closest('.card, .article-card, .review-card, .wizard');
      if (!card || pointerRaf) return;
      const x = e.clientX;
      const y = e.clientY;
      pointerRaf = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${x - rect.left}px`);
        card.style.setProperty('--my', `${y - rect.top}px`);
        pointerRaf = 0;
      });
    }, { passive: true });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const items = document.querySelectorAll('[data-reveal]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  }
})();
