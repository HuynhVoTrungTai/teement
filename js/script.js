/* =========================================================
   TEEMENT — script.js
   Three small, independent modules: mobile nav, scroll state
   (header style + active link), and the contact form.
   No framework — vanilla DOM APIs only.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initScrollState();
  initContactForm();
  initInspectionDeterrents();
});

/* ---------- Mobile navigation ---------- */
function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("primaryNav");
  if (!toggle || !nav) return;

  const closeNav = () => {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  };
  const openNav = () => {
    toggle.setAttribute("aria-expanded", "true");
    nav.classList.add("is-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeNav() : openNav();
  });

  // Close after choosing a link (mobile only; harmless on desktop).
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  // Close on Escape, and return focus to the toggle button.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      closeNav();
      toggle.focus();
    }
  });

  // Close on an outside click.
  document.addEventListener("click", (event) => {
    const clickedInside = nav.contains(event.target) || toggle.contains(event.target);
    if (!clickedInside && toggle.getAttribute("aria-expanded") === "true") {
      closeNav();
    }
  });
}

/* ---------- Header scroll state + active section link ---------- */
function initScrollState() {
  const header = document.querySelector(".site-header");
  if (header) {
    const setScrolled = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    setScrolled();
    window.addEventListener("scroll", setScrolled, { passive: true });
  }

  const sections = document.querySelectorAll("main > section[id]");
  const navLinks = document.querySelectorAll(".primary-nav a[href^='#']");
  if (!sections.length || !navLinks.length || !("IntersectionObserver" in window)) return;

  const linkFor = (id) =>
    Array.from(navLinks).find((link) => link.getAttribute("href") === `#${id}`);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = linkFor(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Contact form ----------
   No backend is wired up yet. This validates the fields and shows
   a confirmation message so the UI is fully demonstrable today.
   To go live, replace the body of `submitLead()` with a real call —
   e.g. a fetch() POST to a form service (Formspree, Getform) or your
   own endpoint — and keep the same success/error handling around it. */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (!form || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitBtn = form.querySelector("button[type='submit']");
    const data = Object.fromEntries(new FormData(form).entries());

    submitBtn.disabled = true;
    status.textContent = "Sending…";
    status.className = "form-status";

    try {
      await submitLead(data);
      status.textContent = "Thanks — we've got your message and will reply within 24 hours.";
      status.className = "form-status is-success";
      form.reset();
    } catch (error) {
      status.textContent = "Something went wrong. Please email ???@teement.com directly.";
      status.className = "form-status is-error";
    } finally {
      submitBtn.disabled = false;
    }
  });
}

function submitLead(data) {
  // Placeholder "send": swap this for a real request when a backend
  // or form service is connected. Kept async so the swap is a
  // one-function change with no other code to touch.
  return new Promise((resolve) => setTimeout(resolve, 500));
}
function initInspectionDeterrents() {
  document.addEventListener("contextmenu", (event) => event.preventDefault());

  document.addEventListener("keydown", (event) => {
    const key = event.key.toUpperCase();
    const isBlocked =
      key === "F12" ||
      (event.ctrlKey && event.shiftKey && ["I", "J", "C"].includes(key)) ||
      (event.ctrlKey && key === "U");
    if (isBlocked) event.preventDefault();
  });
}