const animatedElements = document.querySelectorAll("[data-animate]");

const intersectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        intersectionObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
    rootMargin: "0px 0px -40px 0px",
  }
);

animatedElements.forEach((element) => intersectionObserver.observe(element));

const header = document.querySelector(".site-header");
const nav = document.querySelector(".site-nav");
const toggle = document.querySelector(".nav-toggle");

const closeNav = () => {
  header?.classList.remove("is-open");
  nav?.classList.remove("is-visible");
  toggle?.setAttribute("aria-expanded", "false");
};

toggle?.addEventListener("click", () => {
  const isOpen = header?.classList.toggle("is-open");
  nav?.classList.toggle("is-visible");
  toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

document.addEventListener("click", (event) => {
  if (!header?.classList.contains("is-open")) return;
  if (!header.contains(event.target)) {
    closeNav();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1080) {
    closeNav();
  }
});
