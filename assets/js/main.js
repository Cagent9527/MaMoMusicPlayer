// ===== MaMoMusic landing — interactions =====
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Particle network background ----------
  const canvas = document.getElementById("bg-canvas");
  if (canvas && canvas.getContext && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let w, h, particles, raf;
    const COLORS = ["#a78bfa", "#f0abfc", "#67e8f9"];
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = Math.min(90, Math.floor((w * h) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.6 + 0.6,
        c: COLORS[(Math.random() * COLORS.length) | 0],
      }));
    }

    function step() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const dxm = p.x - mouse.x, dym = p.y - mouse.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 130) { p.x += (dxm / dm) * 1.1; p.y += (dym / dm) * 1.1; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = 0.7;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d = Math.hypot(dx, dy);
          if (d < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = p.c;
            ctx.globalAlpha = (1 - d / 140) * 0.16;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(step);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener("mouseout", () => { mouse.x = -9999; mouse.y = -9999; });
    resize();
    step();
  }

  // ---------- Cursor glow (smooth follow) ----------
  const glow = document.getElementById("cursor-glow");
  if (glow && !reduceMotion) {
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2, tx = gx, ty = gy, on = false;
    window.addEventListener("mousemove", (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!on) { glow.style.opacity = "1"; on = true; }
    });
    window.addEventListener("mouseleave", () => { glow.style.opacity = "0"; on = false; });
    (function loop() {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = `translate3d(${gx}px, ${gy}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
  }

  // ---------- Nav scroll state + mobile toggle ----------
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 30);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  // ---------- Nav active section highlight ----------
  const navLinks = document.querySelectorAll(".nav-link");
  if (navLinks.length && "IntersectionObserver" in window) {
    const map = {};
    navLinks.forEach((l) => {
      const id = l.getAttribute("href").slice(1);
      const sec = document.getElementById(id);
      if (sec) map[id] = l;
    });
    const navObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove("active"));
            if (map[en.target.id]) map[en.target.id].classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    Object.keys(map).forEach((id) => navObs.observe(document.getElementById(id)));
  }

  // ---------- Scroll reveal ----------
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en, i) => {
          if (en.isIntersecting) {
            setTimeout(() => en.target.classList.add("in"), (i % 6) * 80);
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  // ---------- Count up stats ----------
  const counts = document.querySelectorAll(".count");
  function animateCount(el) {
    const to = parseInt(el.dataset.to, 10) || 0;
    const suffix = el.dataset.suffix || "";
    const dur = 1400;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * to) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { animateCount(en.target); co.unobserve(en.target); }
      }),
      { threshold: 0.6 }
    );
    counts.forEach((el) => co.observe(el));
  } else {
    counts.forEach((el) => (el.textContent = (el.dataset.to || "") + (el.dataset.suffix || "")));
  }

  // ---------- Hero waveform bars ----------
  const wave = document.getElementById("pc-wave");
  if (wave) {
    const N = 28;
    for (let i = 0; i < N; i++) {
      const bar = document.createElement("span");
      bar.style.animationDelay = (i * 0.06).toFixed(2) + "s";
      bar.style.animationDuration = (0.8 + Math.random() * 0.7).toFixed(2) + "s";
      wave.appendChild(bar);
    }
  }
})();
