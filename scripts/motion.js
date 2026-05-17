/**
 * Portfolio motion — scroll reveals, counters, parallax, hero entrance.
 * Respects prefers-reduced-motion.
 */
(function () {
  const prefersReduced =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /* ── Scroll progress bar ── */
  function initScrollProgress() {
    const bar = document.querySelector(".scroll-progress__fill");
    if (!bar || prefersReduced) return;

    const update = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? scrollTop / max : 0;
      bar.style.transform = `scaleX(${p})`;
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ── Reveal + stagger ── */
  function initReveals() {
    const staggerParents = document.querySelectorAll("[data-stagger]");
    staggerParents.forEach((parent) => {
      const kids = parent.querySelectorAll("[data-animate], .project-card, .hero-stat, .exp-card, .tool-card, .detail-project, .detail-stat, .contact-highlight, .contact-channel, .more-card, .class-card, .testimonial-card, .highlight-card");
      kids.forEach((el, i) => {
        el.classList.add("motion-item");
        if (!el.dataset.animate) el.dataset.animate = parent.dataset.staggerChild || "fade-up";
        el.style.setProperty("--motion-i", String(i));
      });
    });

    const targets = document.querySelectorAll(
      ".reveal, .motion-item, [data-animate], [data-count], .section-heading"
    );

    document.querySelectorAll(".profile-sticky--visible").forEach((el) => {
      el.classList.add("is-visible");
    });

    if (prefersReduced) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;

          if (el.classList.contains("section-heading")) {
            el.classList.add("is-visible", "heading-lit");
          } else {
            el.classList.add("is-visible");
          }

          if (el.dataset.count !== undefined) animateCounter(el);

          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach((el) => io.observe(el));
  }

  function animateCounter(el) {
    const raw = el.dataset.count;
    if (raw === undefined || raw === "") return;

    const target = parseFloat(raw);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const decimals = (raw.split(".")[1] || "").length;
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const val = target * easeOut(t);
      el.textContent =
        prefix +
        (decimals ? val.toFixed(decimals) : Math.round(val)) +
        suffix;
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  /* ── Hero entrance (page load) ── */
  function initHeroEntrance() {
    const reveal = () => {
      document.body.classList.add("hero-ready");
      requestAnimationFrame(() => {
        fitHeroTitle();
      });
    };

    if (prefersReduced) {
      reveal();
      return;
    }

    requestAnimationFrame(reveal);
  }

  /* ── Parallax orbs + content drift ── */
  function initParallax() {
    if (prefersReduced || window.innerWidth < 1024) return;

    const orbs = document.querySelectorAll("[data-parallax]");
    let sy = 0;

    window.addEventListener(
      "scroll",
      () => {
        sy = window.scrollY;
      },
      { passive: true }
    );

    const loop = () => {
      orbs.forEach((orb) => {
        const speed = parseFloat(orb.dataset.parallax) || 0.08;
        const y = sy * speed;
        orb.style.transform = `translate3d(0, ${y}px, 0)`;
      });

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  /* ── Profile card 3D tilt ── */
  function initProfileTilt() {
    const card = document.querySelector(".profile-card");
    if (!card || prefersReduced || window.innerWidth < 1024) return;

    const max = 6;

    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * max}deg) rotateX(${-y * max}deg) translateZ(0)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  }

  /* ── Magnetic CTAs & dock ── */
  function initMagnetic() {
    if (prefersReduced || window.innerWidth < 768) return;

    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.25}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* ── Cursor glow (desktop) ── */
  function initCursorGlow() {
    if (prefersReduced || !window.matchMedia("(pointer: fine)").matches) return;

    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);

    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    const follow = () => {
      cx = lerp(cx, mx, 0.12);
      cy = lerp(cy, my, 0.12);
      glow.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(follow);
    };
    follow();
  }

  /* ── Project row hover line ── */
  function initProjectHover() {
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("mouseenter", () => card.classList.add("is-hovered"));
      card.addEventListener("mouseleave", () => card.classList.remove("is-hovered"));
    });
  }

  /* ── Text scramble on hero ghost line (subtle) ── */
  function initGhostPulse() {
    const ghost = document.querySelector(".line-ghost");
    if (!ghost || prefersReduced) return;
    ghost.classList.add("ghost-pulse");
  }

  /* ── Fit hero title so long words are never clipped ── */
  function fitHeroTitle() {
    const title = document.querySelector(".hero-title");
    if (!title) return;

    if (window.innerWidth < 1024) {
      title.style.fontSize = "";
      return;
    }

    const solid = title.querySelector(".line-solid");
    const ghost = title.querySelector(".line-ghost");
    if (!solid || !ghost) return;

    title.style.fontSize = "";
    const computed = window.getComputedStyle(title).fontSize;
    let size = parseFloat(computed);
    if (!size) return;

    const minPx = 28;
    let guard = 0;

    while (
      guard < 48 &&
      size > minPx &&
      (solid.scrollWidth > title.clientWidth + 1 ||
        ghost.scrollWidth > title.clientWidth + 1)
    ) {
      size *= 0.97;
      title.style.fontSize = `${size}px`;
      guard += 1;
    }
  }

  /* ── Dust particles behind hero headline ── */
  function initHeroDust() {
    const wrap = document.querySelector(".hero-headline");
    const canvas = wrap?.querySelector(".hero-dust");
    if (!wrap || !canvas || prefersReduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = {
      orange: [255, 92, 26],
      lime: [200, 245, 66],
      white: [255, 255, 255],
    };

    let particles = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let rafId = 0;
    let t = 0;

    function pickHue() {
      const r = Math.random();
      if (r < 0.5) return "orange";
      if (r < 0.78) return "lime";
      return "white";
    }

    function spawn(count) {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.8 + 0.4,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 1.2 + Math.random() * 1.6,
        hue: pickHue(),
      }));
    }

    function resize() {
      const rect = wrap.getBoundingClientRect();
      w = Math.max(rect.width, 1);
      h = Math.max(rect.height, 1);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(72, Math.max(28, Math.floor((w * h) / 9000)));
      spawn(count);
    }

    function tick() {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;
        if (p.y < -4) p.y = h + 4;
        if (p.y > h + 4) p.y = -4;

        const pulse = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * p.pulseSpeed + p.phase));
        const [r, g, b] = colors[p.hue];
        const alpha = (p.hue === "white" ? 0.22 : 0.55) * pulse;
        const radius = p.r * (0.75 + pulse * 0.55);

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();

        if (pulse > 0.72) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.18})`;
          ctx.fill();
        }
      });

      rafId = requestAnimationFrame(tick);
    }

    resize();
    tick();

    const onResize = () => {
      resize();
      fitHeroTitle();
    };

    window.addEventListener("resize", onResize, { passive: true });
    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(onResize);
      ro.observe(wrap);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }

  function ensureProfileVisible() {
    document
      .querySelectorAll(".profile-sticky--visible, .profile-sticky, .detail-sidebar")
      .forEach((el) => {
        el.classList.add("is-visible");
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.visibility = "visible";
      });

    document.querySelectorAll(".profile-card").forEach((card) => {
      card.style.opacity = "1";
      card.style.transform = "none";
    });
  }

  function init() {
    ensureProfileVisible();
    initScrollProgress();
    initHeroEntrance();
    initReveals();
    initParallax();
    initProfileTilt();
    initMagnetic();
    initCursorGlow();
    initProjectHover();
    initGhostPulse();
    initHeroDust();
    window.addEventListener("load", fitHeroTitle, { once: true });
    if (document.fonts?.ready) {
      document.fonts.ready.then(fitHeroTitle);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
