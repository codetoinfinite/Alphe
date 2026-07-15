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
})();
