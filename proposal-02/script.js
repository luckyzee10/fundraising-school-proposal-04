const animatedSections = document.querySelectorAll("[data-animate]");

const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }),
  {
    threshold: 0.12,
    rootMargin: "0px 0px -60px 0px",
  }
);

animatedSections.forEach((section) => observer.observe(section));

const header = document.querySelector(".header");
const nav = document.querySelector(".nav");
const cta = document.querySelector(".cta");
const menuButton = document.querySelector(".menu");

const closeMenu = () => {
  header?.classList.remove("is-open");
  nav?.classList.remove("is-visible");
  cta?.classList.remove("is-inline");
  menuButton?.setAttribute("aria-expanded", "false");
};

menuButton?.addEventListener("click", () => {
  const isOpen = header?.classList.toggle("is-open");
  nav?.classList.toggle("is-visible");
  cta?.classList.toggle("is-inline");
  menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

document.addEventListener("click", (event) => {
  if (!header?.classList.contains("is-open")) return;
  if (!header.contains(event.target)) {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1024) {
    closeMenu();
  }
});
