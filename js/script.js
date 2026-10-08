/* ============================================================
   GANESH GONUGUNTLA — PORTFOLIO SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     CURSOR — motion logic preserved exactly (dot + lazy ring)
  --------------------------------------------------------- */
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animRing() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  document.querySelectorAll('a,button,.project-card,.skill-card,.activity-card,.cert-card,.pinned,.contact-row').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.transform = 'translate(-50%,-50%) scale(1.7)';
      ring.style.borderColor = 'rgba(42,82,227,0.8)';
      ring.style.background = 'rgba(42,82,227,0.06)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.borderColor = 'rgba(27,33,48,0.45)';
      ring.style.background = 'transparent';
    });
  });

  /* ---------------------------------------------------------
     AMBIENT ORB PARALLAX
  --------------------------------------------------------- */
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - .5) * 22;
    const y = (e.clientY / window.innerHeight - .5) * 22;
    const orb1 = document.querySelector('.orb1');
    const orb2 = document.querySelector('.orb2');
    if (orb1) orb1.style.transform = `translate(${x}px,${y}px)`;
    if (orb2) orb2.style.transform = `translate(${-x}px,${-y}px)`;
  });

  /* ---------------------------------------------------------
     WELCOME CHIME — synthesized, no external audio file
  --------------------------------------------------------- */
  let audioCtx = null;
  let soundEnabled = true;
  let chimeQueued = false;

  function getCtx() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    return audioCtx;
  }

  function playWelcomeChime() {
    if (!soundEnabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);
    master.gain.exponentialRampToValueAtTime(0.22, now + 0.05);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = now + i * 0.11;
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(0.9, start + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, start + 0.55);
      osc.connect(g);
      g.connect(master);
      osc.start(start);
      osc.stop(start + 0.6);
    });

    // soft swoosh (filtered noise) under the chime
    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.05;
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
  }

  function tryPlayChime() {
    const ctx = getCtx();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(playWelcomeChime).catch(() => { chimeQueued = true; });
    } else {
      playWelcomeChime();
    }
  }

  // fallback: if autoplay was blocked, fire chime on first user interaction
  ['click', 'touchstart', 'keydown', 'scroll'].forEach(evt => {
    window.addEventListener(evt, () => {
      if (chimeQueued) { playWelcomeChime(); chimeQueued = false; }
    }, { once: false, passive: true });
  });

  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggle.classList.toggle('is-muted', !soundEnabled);
      soundToggle.setAttribute('aria-pressed', String(!soundEnabled));
    });
  }

  /* ---------------------------------------------------------
     INTRO — equator split reveal
  --------------------------------------------------------- */
  const intro = document.getElementById('intro');
  document.body.classList.add('intro-active');

  function openPortfolio() {
    intro.classList.add('split');
    tryPlayChime();
    setTimeout(() => {
      intro.classList.add('hide');
      document.body.classList.remove('intro-active');
    }, reduceMotion ? 50 : 1100);
  }

  if (reduceMotion) {
    setTimeout(openPortfolio, 500);
  } else {
    setTimeout(openPortfolio, 2700);
  }

  // allow an impatient visitor to skip by clicking the seam/hint
  intro.addEventListener('click', () => {
    if (!intro.classList.contains('split')) openPortfolio();
  });

  /* ---------------------------------------------------------
     MOBILE MENU
  --------------------------------------------------------- */
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  const backdrop = document.getElementById('menuBackdrop');

  function closeMenu() {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    backdrop.classList.remove('open');
  }
  if (burger) {
    burger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      burger.classList.toggle('open', open);
      backdrop.classList.toggle('open', open);
    });
    backdrop.addEventListener('click', closeMenu);
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  /* ---------------------------------------------------------
     SCROLL REVEAL
  --------------------------------------------------------- */
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: .12 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

  /* ---------------------------------------------------------
     ACTIVE NAV LINK ON SCROLL
  --------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const navObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const a = document.querySelector('.nav-links a[href="#' + e.target.id + '"]');
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: .5 });
  sections.forEach(s => navObs.observe(s));


  /* ---------------------------------------------------------
     EXTRA MOTION: scroll bar, floating glyphs, staggered reveals,
     card tilt, count-up
  --------------------------------------------------------- */
  const bar = document.createElement('div'); bar.id = 'scrollbar'; document.body.appendChild(bar);
  const layer = document.createElement('div'); layer.id = 'float-layer'; layer.setAttribute('aria-hidden', 'true');
  if (!reduceMotion) {
    const glyphs = ['</>', '{ }', ';', '=>', '[ ]', '0101', '( )', '&&', 'fn()', '✎', '✏', '◐', '✦', '~'];
    glyphs.concat(glyphs.slice(0, 6)).forEach((g, i) => {
      const s = document.createElement('span'), t = document.createElement('i');
      t.textContent = g;
      const art = '✎✏◐✦~'.includes(g);
      s.style.left = (Math.random() * 94) + '%';
      s.style.top = (Math.random() * 95) + '%';
      s.style.setProperty('--s', (Math.random() * .25 + .05).toFixed(2));
      t.style.fontSize = (1.2 + Math.random() * 2) + 'rem';
      t.style.color = art ? 'var(--pencil)' : 'var(--blue)';
      t.style.opacity = (.14 + Math.random() * .1).toFixed(2);
      t.style.setProperty('--t', (9 + Math.random() * 9).toFixed(1) + 's');
      t.style.setProperty('--dl', (-Math.random() * 10).toFixed(1) + 's');
      s.appendChild(t); layer.appendChild(s);
    });
    document.body.appendChild(layer);
  }
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
      layer.style.setProperty('--sy', (-y) + 'px');
      ticking = false;
    });
  }, { passive: true });

  // staggered directional reveal for cards / rows
  document.querySelectorAll('.project-card,.project-featured,.skill-card,.cert-card,.contact-row').forEach((el, i) => {
    const sibs = [...el.parentElement.children].filter(n => n.matches('.project-card,.project-featured,.skill-card,.cert-card,.contact-row'));
    const k = sibs.indexOf(el);
    el.classList.add('rv', ['rv-a', 'rv-b', 'rv-c'][(k + (el.classList.contains('skill-card') ? 2 : 0)) % 3]);
    el.style.setProperty('--d', (Math.min(k, 5) * .1) + 's');
    const o = new IntersectionObserver(es => {
      if (es[0].isIntersecting) {
        el.classList.add('visible'); o.disconnect();
        setTimeout(() => el.classList.remove('rv', 'rv-a', 'rv-b', 'rv-c', 'visible'), 1500 + k * 100);
      }
    }, { threshold: .1 });
    o.observe(el);
  });

  // 3D tilt on cards (pointer devices only)
  if (!reduceMotion && window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.project-card,.project-featured,.skill-card,.cert-card').forEach(el => {
      el.classList.add('tilt');
      const max = el.classList.contains('project-featured') ? 2 : 6;
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * max * 2).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((.5 - (e.clientY - r.top) / r.height) * max * 2).toFixed(2) + 'deg');
      });
      el.addEventListener('mouseleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
  }

  // count-up numbers
  document.querySelectorAll('.spec-stat-num').forEach(el => {
    const txt = el.textContent, n = parseInt(txt, 10), suf = txt.replace(/[0-9]/g, '');
    if (isNaN(n) || reduceMotion) return;
    const o = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return; o.disconnect();
      const t0 = performance.now();
      (function step(t) {
        const p = Math.min((t - t0) / 1400, 1);
        el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + suf;
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }, { threshold: .5 });
    o.observe(el);
  });


});