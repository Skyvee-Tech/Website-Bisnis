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
    const state = { device: '', issue: '', note: '' };
    const steps = [...wz.querySelectorAll('[data-step]')];
    const dots = [...wz.querySelectorAll('[data-dot]')];
    const summary = wz.querySelector('[data-summary]');
    const send = wz.querySelector('[data-send]');
    const note = wz.querySelector('[data-note]');
    let current = 1;

    const update = () => {
      if (!summary || !send) return;
      summary.textContent = state.device && state.issue ? `${state.device} · ${state.issue}` : '';
      const msg = `Halo Skyvee Tech, saya mau konsultasi servis.\n\nPerangkat: ${state.device}\nKeluhan: ${state.issue}` +
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
        });
      });
    };
    bind(1, 'device');
    bind(2, 'issue');

    wz.querySelectorAll('[data-next]').forEach((btn) => btn.addEventListener('click', () => show(current + 1)));
    wz.querySelectorAll('[data-back]').forEach((btn) => btn.addEventListener('click', () => show(current - 1)));
    note?.addEventListener('input', () => { state.note = note.value.trim(); update(); });
  }

  const reviewMore = document.querySelector('[data-review-more]');
  const reviewExtras = [...document.querySelectorAll('[data-review-extra]')];
  if (reviewMore && reviewExtras.length) {
    const moreLabel = `Tampilkan ${reviewExtras.length} ulasan lainnya`;
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
    });
  }

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

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
