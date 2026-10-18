(() => {
  const body    = document.body;
  const gate    = document.getElementById('gate');
  const openBtn = document.getElementById('openBtn');
  const invite  = document.getElementById('invite');
  const music   = document.getElementById('music');
  const toggle  = document.getElementById('musicToggle');
  const reduce  = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Open the invitation ---- */
  openBtn.addEventListener('click', () => {
    gate.classList.add('is-open');
    body.classList.remove('locked');
    invite.removeAttribute('aria-hidden');
    toggle.hidden = false;
    music.volume = 0.6;
    music.play().catch(() => toggle.classList.add('muted')); // autoplay can be blocked
    window.scrollTo(0, 0);
  });

  /* ---- Music toggle ---- */
  toggle.addEventListener('click', () => {
    if (music.paused) { music.play(); toggle.classList.remove('muted'); }
    else              { music.pause(); toggle.classList.add('muted'); }
  });

  /* ---- Pause music when tab is hidden ---- */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) music.pause();
    else if (gate.classList.contains('is-open') && !toggle.classList.contains('muted')) music.play().catch(()=>{});
  });

  /* ---- Parallax ---- */
  const layers = [...document.querySelectorAll('.layer')];
  let ticking = false;
  function parallax() {
    const y = window.scrollY;
    const h = window.innerHeight;
    if (y < h * 1.2) {
      layers.forEach(l => {
        const s = parseFloat(l.dataset.speed || 0);
        l.style.transform = `translate3d(0, ${y * s}px, 0)`;
      });
    }
    ticking = false;
  }
  if (!reduce) {
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
  }

  /* ---- Reveal on scroll ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();
