// ALPHE.AI — interaction engine
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- preloader ---------- */
  const preloader = document.getElementById('preloader');
  const preCount = document.getElementById('preCount');

  function boot() {
    document.body.classList.add('booted');
  }

  if (preloader && !reduced) {
    let n = 0;
    const tick = () => {
      n = Math.min(100, n + Math.ceil(Math.random() * 9));
      preCount.textContent = String(n).padStart(3, '0');
      if (n < 100) {
        setTimeout(tick, 42);
      } else {
        setTimeout(() => {
          preloader.classList.add('done');
          boot();
          setTimeout(() => preloader.remove(), 900);
        }, 220);
      }
    };
    tick();
  } else {
    if (preloader) preloader.remove();
    boot();
  }

  /* ---------- header ---------- */
  const header = document.getElementById('siteHeader');
  addEventListener('scroll', () => {
    header.classList.toggle('scrolled', scrollY > 10);
  }, { passive: true });

  const menuToggle = document.getElementById('menuToggle');
  const navCenter = document.getElementById('navCenter');
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    navCenter.classList.toggle('open');
  });
  // mobile: tap dropdown parents to expand
  document.querySelectorAll('.nav-item > .nav-link').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (matchMedia('(max-width: 900px)').matches) {
        e.preventDefault();
        btn.parentElement.classList.toggle('open');
      }
    });
  });
  // close mobile nav on link click
  navCenter.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    navCenter.classList.remove('open');
    menuToggle.classList.remove('open');
  }));

  /* ---------- hero glow follows cursor ---------- */
  const glow = document.getElementById('heroGlow');
  const hero = document.querySelector('.hero');
  if (glow && hero && !reduced) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      glow.style.left = `${e.clientX - r.left}px`;
      glow.style.top = `${e.clientY - r.top}px`;
    });
  }

  /* ---------- rotating hero word ---------- */
  const rotator = document.getElementById('wordRotator');
  if (rotator && !reduced) {
    const words = [...rotator.querySelectorAll('.word')];
    // reserve width of the longest word so layout doesn't jump
    let i = 0;
    setInterval(() => {
      const prev = words[i];
      i = (i + 1) % words.length;
      const next = words[i];
      prev.classList.remove('active');
      prev.classList.add('leaving');
      next.classList.remove('leaving');
      next.classList.add('active');
      setTimeout(() => prev.classList.remove('leaving'), 600);
    }, 2400);
  }

  /* ---------- scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    }
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* ---------- core router live log ---------- */
  const coreLog = document.getElementById('coreLog');
  const coreCounter = document.getElementById('coreCounter');
  if (coreLog) {
    const models = ['gemini-ultra', 'gpt-4o-mini', 'gemini-flash', 'llama-4', 'deepseek-v3', 'qwen-max', 'mistral-lg'];
    const tasks = ['summarize', 'extract', 'classify', 'generate', 'translate', 'embed', 'analyze'];
    let total = 0;

    const line = () => {
      const id = 'req_' + Math.floor(1000 + Math.random() * 9000);
      const task = tasks[Math.floor(Math.random() * tasks.length)];
      const model = models[Math.floor(Math.random() * models.length)];
      const save = 40 + Math.floor(Math.random() * 40);
      const ms = (0.3 + Math.random() * 1.6).toFixed(1);
      return `${id}  ${task.padEnd(10)} → ${model.padEnd(14)} -${save}%  ${ms}s ✓\n`;
    };

    const push = () => {
      total++;
      coreLog.textContent += line();
      const rows = coreLog.textContent.split('\n');
      if (rows.length > 9) coreLog.textContent = rows.slice(rows.length - 9).join('\n');
      if (coreCounter) coreCounter.textContent = `${total.toLocaleString()} requests routed`;
      setTimeout(push, reduced ? 4000 : 700 + Math.random() * 1200);
    };
    push();
  }

  /* ---------- security monitor log ---------- */
  const secLog = document.getElementById('secLog');
  if (secLog) {
    const events = [
      ['pii-scan', 'clean ✓'],
      ['encrypt', 'AES-256 ✓'],
      ['audit', 'logged → SIEM ✓'],
      ['access', 'workspace key verified ✓'],
      ['compliance', 'SOC 2 · GDPR · HIPAA ✓'],
      ['threat-scan', '0 anomalies ✓'],
      ['retention', 'policy enforced ✓'],
    ];
    let k = 0;
    const pushSec = () => {
      const t = new Date();
      const ts = [t.getHours(), t.getMinutes(), t.getSeconds()].map((x) => String(x).padStart(2, '0')).join(':');
      const [ev, res] = events[k % events.length];
      k++;
      secLog.textContent += `${ts}  ${ev.padEnd(12)} ${res}\n`;
      const rows = secLog.textContent.split('\n');
      if (rows.length > 12) secLog.textContent = rows.slice(rows.length - 12).join('\n');
      setTimeout(pushSec, reduced ? 5000 : 1100 + Math.random() * 900);
    };
    pushSec();
  }

  /* ---------- solutions machine: click + auto-advance ---------- */
  const machine = document.getElementById('solutions-machine');
  if (machine) {
    const CYCLE = 6000;
    machine.style.setProperty('--cycle', CYCLE + 'ms');
    const tabs = [...machine.querySelectorAll('.sol-tab')];
    const panels = [...machine.querySelectorAll('.sol-panel')];
    const segs = [...machine.querySelectorAll('.seg')];
    let idx = 0;
    let timer = null;

    const activate = (n) => {
      idx = n;
      tabs.forEach((t, j) => t.classList.toggle('active', j === n));
      panels.forEach((p, j) => p.classList.toggle('active', j === n));
      segs.forEach((s, j) => {
        s.classList.toggle('done', j < n);
        s.classList.remove('active');
        // restart fill animation
        void s.offsetWidth;
        if (j === n) s.classList.add('active');
      });
    };

    const schedule = () => {
      clearTimeout(timer);
      if (reduced) return;
      timer = setTimeout(() => {
        activate((idx + 1) % tabs.length);
        schedule();
      }, CYCLE);
    };

    tabs.forEach((t, j) => t.addEventListener('click', () => { activate(j); schedule(); }));
    segs.forEach((s, j) => s.addEventListener('click', () => { activate(j); schedule(); }));

    // start auto-advance only when visible
    const mio = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) { activate(idx); schedule(); }
        else clearTimeout(timer);
      });
    }, { threshold: 0.25 });
    mio.observe(machine);
  }

  /* ---------- count-up stats ---------- */
  const counters = document.querySelectorAll('.count');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      cio.unobserve(en.target);
      const el = en.target;
      const target = parseFloat(el.dataset.target);
      if (reduced) { el.textContent = target; return; }
      const t0 = performance.now();
      const dur = 1400;
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => cio.observe(c));

  /* ---------- team tabs ---------- */
  const teamTabs = document.querySelectorAll('.team-tab');
  teamTabs.forEach((t) => t.addEventListener('click', () => {
    teamTabs.forEach((x) => x.classList.remove('active'));
    t.classList.add('active');
    document.querySelectorAll('.team-panel').forEach((p) => {
      p.classList.toggle('active', p.dataset.memberPanel === t.dataset.member);
    });
  }));

  /* ---------- accordion ---------- */
  document.querySelectorAll('.acc-q').forEach((q) => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.acc-item').forEach((it) => {
        it.classList.remove('open');
        it.querySelector('.acc-a').style.maxHeight = '0';
      });
      if (!wasOpen) {
        item.classList.add('open');
        const a = item.querySelector('.acc-a');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
  // open first accordion item by default
  const firstAcc = document.querySelector('.acc-item.open .acc-a');
  if (firstAcc) firstAcc.style.maxHeight = firstAcc.scrollHeight + 'px';

  /* ---------- cursor spotlight on board cells ---------- */
  document.querySelectorAll('.spotlight').forEach((cell) => {
    cell.addEventListener('mousemove', (e) => {
      const r = cell.getBoundingClientRect();
      cell.style.setProperty('--mx', `${e.clientX - r.left}px`);
      cell.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  const finePointer = matchMedia('(pointer: fine)').matches;

  /* ---------- scroll progress bar ---------- */
  const progress = document.getElementById('scrollProgress');
  if (progress) {
    const setProgress = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      progress.style.transform = `scaleX(${max > 0 ? doc.scrollTop / max : 0})`;
    };
    addEventListener('scroll', setProgress, { passive: true });
    setProgress();
  }

  /* ---------- custom cursor: dot + easing ring ---------- */
  const cDot = document.getElementById('cursorDot');
  const cRing = document.getElementById('cursorRing');
  if (cDot && cRing) {
    if (finePointer && !reduced) {
      let mx = -100, my = -100, rx = -100, ry = -100;
      addEventListener('mousemove', (e) => {
        mx = e.clientX; my = e.clientY;
        cDot.style.left = mx + 'px';
        cDot.style.top = my + 'px';
      }, { passive: true });
      const ringLoop = () => {
        rx += (mx - rx) * 0.16;
        ry += (my - ry) * 0.16;
        cRing.style.left = rx + 'px';
        cRing.style.top = ry + 'px';
        requestAnimationFrame(ringLoop);
      };
      ringLoop();
      document.querySelectorAll('a, button, .seg').forEach((el) => {
        el.addEventListener('mouseenter', () => cRing.classList.add('on'));
        el.addEventListener('mouseleave', () => cRing.classList.remove('on'));
      });
    } else {
      cDot.remove();
      cRing.remove();
    }
  }

  /* ---------- magnetic buttons ---------- */
  if (finePointer && !reduced) {
    document.querySelectorAll('.btn').forEach((b) => {
      b.addEventListener('mousemove', (e) => {
        const r = b.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.22;
        const y = (e.clientY - r.top - r.height / 2) * 0.3;
        b.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      });
      b.addEventListener('mouseleave', () => { b.style.transform = ''; });
    });
  }

  /* ---------- click ripple on buttons ---------- */
  document.querySelectorAll('.btn').forEach((b) => {
    b.addEventListener('click', (e) => {
      if (reduced) return;
      const r = b.getBoundingClientRect();
      const d = Math.max(r.width, r.height);
      const s = document.createElement('span');
      s.className = 'ripple';
      s.style.width = s.style.height = d + 'px';
      s.style.left = (e.clientX - r.left - d / 2) + 'px';
      s.style.top = (e.clientY - r.top - d / 2) + 'px';
      b.appendChild(s);
      setTimeout(() => s.remove(), 650);
    });
  });

  /* ---------- hero particle field ---------- */
  const pCanvas = document.getElementById('heroParticles');
  if (pCanvas && !reduced) {
    const ctx = pCanvas.getContext('2d');
    let w = 0, h = 0, pts = [], running = false;

    const resize = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      w = pCanvas.clientWidth;
      h = pCanvas.clientHeight;
      pCanvas.width = w * dpr;
      pCanvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const seed = () => {
      pts = Array.from({ length: 70 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vy: 0.15 + Math.random() * 0.35,
        r: 0.6 + Math.random() * 1.4,
        a: 0.12 + Math.random() * 0.35,
      }));
    };
    const frame = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#51a2ff';
      for (const p of pts) {
        p.y -= p.vy;
        if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
        ctx.globalAlpha = p.a;
        ctx.fillRect(p.x, p.y, p.r, p.r); // square dots — matches sharp aesthetic
      }
      requestAnimationFrame(frame);
    };

    resize();
    seed();
    addEventListener('resize', () => { resize(); seed(); });
    new IntersectionObserver((es) => {
      es.forEach((e) => {
        const was = running;
        running = e.isIntersecting;
        if (running && !was) frame();
      });
    }).observe(pCanvas);
  }

  /* ---------- parallax layers ---------- */
  const plxEls = [...document.querySelectorAll('[data-plx]')];
  if (plxEls.length && !reduced) {
    let ticking = false;
    const updatePlx = () => {
      ticking = false;
      for (const el of plxEls) {
        const f = parseFloat(el.dataset.plx);
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) continue;
        const off = (r.top + r.height / 2 - innerHeight / 2) * f;
        el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
      }
    };
    addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(updatePlx); }
    }, { passive: true });
    updatePlx();
  }

  /* ---------- problems: pinned horizontal scroll ---------- */
  const hs = document.getElementById('problemsHscroll');
  if (hs) {
    const sticky = hs.querySelector('.hscroll-sticky');
    const track = document.getElementById('problemsTrack');
    const idxEl = document.getElementById('hscrollIdx');
    const nPanels = track.children.length;
    const isStatic = () => reduced || matchMedia('(max-width: 900px)').matches;

    const size = () => {
      if (isStatic()) {
        hs.classList.add('static');
        hs.style.height = '';
        return;
      }
      hs.classList.remove('static');
      const extra = Math.max(0, track.scrollWidth - sticky.clientWidth);
      hs.style.height = (innerHeight + extra) + 'px';
    };

    const onHScroll = () => {
      if (isStatic()) return;
      const r = hs.getBoundingClientRect();
      const range = r.height - innerHeight;
      if (range <= 0) return;
      const p = Math.min(1, Math.max(0, -r.top / range));
      const max = Math.max(0, track.scrollWidth - sticky.clientWidth);
      track.style.transform = `translate3d(${(-p * max).toFixed(1)}px, 0, 0)`;
      if (idxEl) idxEl.textContent = String(Math.min(nPanels, 1 + Math.floor(p * nPanels))).padStart(2, '0');
    };

    addEventListener('resize', () => { size(); onHScroll(); });
    addEventListener('scroll', onHScroll, { passive: true });
    size();
    onHScroll();
  }

  /* ---------- text scramble on badges ---------- */
  if (!reduced) {
    const GLYPHS = '!<>-_\\/[]{}=+*^?#';
    const scramble = (el) => {
      const original = el.textContent;
      const len = original.length;
      let f = 0;
      const total = Math.max(14, len + 6);
      const step = () => {
        f++;
        const settled = Math.floor((f / total) * len);
        let out = '';
        for (let i = 0; i < len; i++) {
          if (i < settled || original[i] === ' ') out += original[i];
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        el.textContent = out;
        if (settled < len) requestAnimationFrame(step);
        else el.textContent = original;
      };
      step();
    };
    const sio = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          scramble(e.target);
          sio.unobserve(e.target);
        }
      });
    }, { threshold: 0.8 });
    document.querySelectorAll('.badge .mono').forEach((el) => sio.observe(el));
  }

  /* ---------- 3D tilt cards ---------- */
  if (finePointer && !reduced) {
    document.querySelectorAll('.term, .member-mark, .routing-stage').forEach((el) => {
      el.classList.add('tilt');
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(800px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 5).toFixed(2)}deg)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }
})();
