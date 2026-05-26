function setupMobileMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  if (!menuBtn || !mobileNav) return;

  const close = () => {
    mobileNav.classList.remove("is-open");
    mobileNav.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  menuBtn.addEventListener("click", () => {
    const open = !mobileNav.classList.contains("is-open");
    mobileNav.classList.toggle("is-open", open);
    mobileNav.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
}

function setCurrentYear() {
  const el = document.getElementById("currentYear");
  if (el) el.textContent = new Date().getFullYear();
}

function setupActiveNav() {
  const sections = document.querySelectorAll("section[id], main#home");
  const links = document.querySelectorAll(".dock-nav a[data-nav], .mobile-drawer a");

  if (!sections.length || !links.length) return;

  const byId = {};
  links.forEach((link) => {
    const id = (link.getAttribute("href") || "").replace("#", "");
    if (id) byId[id] = link;
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id || "home";
        document.querySelectorAll(".dock-nav a, .mobile-drawer a").forEach((a) => {
          const href = (a.getAttribute("href") || "").replace("#", "");
          a.classList.toggle("is-active", href === id);
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((s) => io.observe(s));
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const btn = form.querySelector(".btn-submit");
    const name = form.querySelector("#name")?.value?.trim() || "";
    const email = form.querySelector("#email")?.value?.trim() || "";
    const interest = form.querySelector("#interest")?.value || "";
    const message = form.querySelector("#message")?.value?.trim() || "";
    const subject = encodeURIComponent(`Portfolio — ${interest || "Inquiry"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nInterest: ${interest || "—"}\n\n${message}`
    );

    btn?.classList.add("is-busy");
    const label = btn?.querySelector(".btn-submit__label");
    if (label) label.textContent = "Opening email…";

    window.location.href = `mailto:xolanivictor02@gmail.com?subject=${subject}&body=${body}`;

    window.setTimeout(() => {
      btn?.classList.remove("is-busy");
      if (label) label.textContent = "Send via email";
    }, 2500);
  });
}

function setupCopyEmail() {
  const btn = document.getElementById("copyEmailBtn");
  if (!btn) return;

  const email = btn.getAttribute("data-email") || "";
  const feedback = btn.querySelector(".contact-copy__feedback");

  btn.addEventListener("click", async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      btn.classList.add("is-copied");
      if (feedback) feedback.textContent = "Copied!";
      window.setTimeout(() => {
        btn.classList.remove("is-copied");
        if (feedback) feedback.textContent = "";
      }, 2200);
    } catch {
      if (feedback) feedback.textContent = "Copy failed";
    }
  });
}

function setupTestimonialModal() {
  const modal = document.getElementById("testimonialModal");
  if (!modal) return;

  const openBtn = document.querySelector("[data-testimonial-open]");
  const closeBtn = modal.querySelector("[data-testimonial-close]");

  const open = () => {
    modal.hidden = false;
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    closeBtn?.focus();
  };

  const close = () => {
    modal.classList.remove("is-open");
    modal.hidden = true;
    document.body.style.overflow = "";
    openBtn?.focus();
  };

  openBtn?.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) close();
  });
}

function setupSubmitGlow() {
  const btn = document.querySelector(".btn-submit");
  if (!btn) return;
  btn.addEventListener("mousemove", (e) => {
    const r = btn.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    btn.style.setProperty("--x", `${x}%`);
    btn.style.setProperty("--y", `${y}%`);
  });
}

function setupProjectVideos() {
  document.querySelectorAll(".project-card__media--video").forEach((media) => {
    const video = media.querySelector(".project-card__video");
    const playBtn = media.querySelector(".project-card__play");
    if (!video || !playBtn) return;

    const toggle = () => {
      if (video.paused) {
        video.play();
        media.classList.add("is-playing");
        media.classList.remove("is-paused");
      } else {
        video.pause();
        media.classList.add("is-paused");
      }
    };

    playBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    });

    media.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      toggle();
    });

    video.addEventListener("ended", () => {
      media.classList.remove("is-playing", "is-paused");
      video.currentTime = 0;
    });
  });
}

function setupPromoBanner() {
  const banner = document.getElementById("promoBanner");
  const soundBtn = document.getElementById("promoBannerSound");
  const video = banner?.querySelector(".promo-banner__video");
  if (!banner || !video) return;

  soundBtn?.addEventListener("click", () => {
    video.muted = !video.muted;
    soundBtn.classList.toggle("is-unmuted", !video.muted);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupPromoBanner();
  setupMobileMenu();
  setCurrentYear();
  setupActiveNav();
  setupContactForm();
  setupCopyEmail();
  setupSubmitGlow();
  setupTestimonialModal();
  setupProjectVideos();
});
