const animatedElements = document.querySelectorAll("[data-animate]");

const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }),
  {
    threshold: 0.2,
    rootMargin: "0px 0px -60px 0px",
  }
);

animatedElements.forEach((element) => observer.observe(element));

const nav = document.querySelector(".nav");
const navLinks = document.querySelector(".nav__links");
const navCta = document.querySelector(".nav__cta");
const navToggle = document.querySelector(".nav__toggle");

const closeMenu = () => {
  nav?.classList.remove("is-open");
  navLinks?.classList.remove("is-visible");
  navCta?.classList.remove("is-visible");
  navToggle?.setAttribute("aria-expanded", "false");
};

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  navLinks?.classList.toggle("is-visible");
  navCta?.classList.toggle("is-visible");
  navToggle?.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

document.addEventListener("click", (event) => {
  if (!nav?.classList.contains("is-open")) return;
  if (!nav.contains(event.target)) {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1060) {
    closeMenu();
  }
});

const timelineTrack = document.querySelector("[data-step-progress]");
const progressBar = document.querySelector("[data-progress-bar]");

if (timelineTrack && progressBar) {
  const steps = Array.from(timelineTrack.querySelectorAll("article"));
  const progressObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = steps.indexOf(entry.target);
          steps.forEach((step) => step.classList.remove("active"));
          entry.target.classList.add("active");
          const width = ((index + 1) / steps.length) * 100;
          progressBar.style.width = `${width}%`;
        }
      });
    },
    {
      threshold: 0.6,
    }
  );

  steps.forEach((step) => progressObserver.observe(step));
}

const slider = document.querySelector("[data-slider]");
const dotsContainer = document.querySelector("[data-slider-dots]");

if (slider && dotsContainer) {
  const slides = Array.from(slider.querySelectorAll("article"));
  let index = 0;
  let intervalId;

  const activateSlide = (nextIndex) => {
    slides.forEach((slide) => slide.classList.remove("active"));
    dotsContainer.querySelectorAll("button").forEach((dot) => dot.classList.remove("active"));
    slides[nextIndex].classList.add("active");
    dotsContainer.querySelectorAll("button")[nextIndex].classList.add("active");
    index = nextIndex;
  };

  const nextSlide = () => {
    const next = (index + 1) % slides.length;
    activateSlide(next);
  };

  slides.forEach((slide, slideIndex) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.addEventListener("click", () => {
      activateSlide(slideIndex);
      restartInterval();
    });
    dotsContainer.appendChild(dot);
  });

  const startInterval = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    intervalId = window.setInterval(nextSlide, 6000);
  };

  const restartInterval = () => {
    if (!intervalId) return;
    window.clearInterval(intervalId);
    startInterval();
  };

  activateSlide(index);
  startInterval();
}

const moduleTooltip = document.getElementById("module-tooltip");
const curriculumModules = document.querySelectorAll("[data-module]");
const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

const moduleDetails = {
  "module-01": {
    tag: "Module 01",
    title: "How to Get Into Y Combinator",
    meta: "Daniel Bilbao · Thursday, Oct 29 · 2:00 PM (Colombia)",
    bullets: [
      "Write a clear and compelling first draft of your YC application.",
      "Understand what YC looks for: team, problem, solution, market, traction.",
      "Draft live responses for the three key application answers.",
      "Avoid common mistakes that derail interviews and applications.",
      "Workshop the toughest questions a YC partner will ask you.",
    ],
  },
  "module-02": {
    tag: "Module 02",
    title: "Should You Raise? Fundraising Reality",
    meta: "Strategic decision frameworks",
    bullets: [
      "Recognize when a startup is not venture-backable.",
      "Decide between angels, venture, bootstrapping, and revenue-based financing.",
      "Set real expectations around time, rejection, and iteration.",
      "Map funding stages from Pre-Seed to Series A with realistic metrics.",
      "Navigate the pipeline from first outreach to money hitting the bank.",
      "Understand the players: angels vs. VCs, pros and cons for each.",
      "Build an ideal fundraising timeline, including YC accelerator cadence.",
    ],
  },
  "module-03": {
    tag: "Module 03",
    title: "Fund Mechanics & Investor Fit",
    meta: "Decode the venture ecosystem",
    bullets: [
      "Understand fund economics and why VCs need 100x outcomes.",
      "Compare venture fund types: LP structure, horizons, and winner portfolios.",
      "Demystify valuation: supply and demand, pre-money vs. post-money.",
      "Arm yourself with the 12 questions you must ask every VC.",
      "Build an Investor-Market Fit scorecard across stage, ticket, and thesis.",
      "Simulate valuation scenarios to plan equity sold and runway preserved.",
    ],
  },
  "module-04": {
    tag: "Module 04",
    title: "Investor Narrative & Deck Systems",
    meta: "Pitch architecture in practice",
    bullets: [
      "Learn what investors actually want to hear in meetings and emails.",
      "Build 5–10 slide decks focused on Problem, Solution, Team, Market, Traction.",
      "Create multiple deck versions and identify deck killers to avoid.",
      "Write and rehearse elevator pitches with proof points and CTA.",
      "Master networking tactics to meet investors beyond Silicon Valley.",
      "Ship tangible deliverables: Deck v1 plus elevator pitch script.",
    ],
  },
  "module-05": {
    tag: "Module 05",
    title: "AI-Accelerated Fundraising",
    meta: "Tools, workflows, and automation",
    bullets: [
      "Adopt best-in-class AI tools for fundraising, like DocSend and more.",
      "Blend AI agents with human connection for cold-to-warm outreach.",
      "Build an investor CRM funnel with 30 segmented leads.",
      "Craft three high-converting investor emails using proven prompts.",
      "Run live practice with Fundraising School’s custom AI angel investor.",
    ],
  },
  "module-06": {
    tag: "Module 06",
    title: "Cap Tables Without Regret",
    meta: "Avoid costly fundraising mistakes",
    bullets: [
      "Structure SAFEs, cap tables, and option pools to avoid bad dilution.",
      "Compare SAFE post-money vs. priced rounds with clarity.",
      "Close legal and tax gaps: Delaware C-Corp, QSBS, and investor incentives.",
      "Spot real case red flags from valuations to outsourced tech pitfalls.",
      "Simulate tough Q&A, mirroring typical early-stage VC conversations.",
    ],
  },
  "module-07": {
    tag: "Module 07",
    title: "Due Diligence to Wire",
    meta: "Close with confidence",
    bullets: [
      "Know exactly what happens after a yes: the diligence checklist.",
      "Assemble light data rooms with bylaws, cap tables, options, and 409A.",
      "Conduct reverse diligence to qualify investors before you accept.",
      "Create urgency and FOMO credibly without burning relationships.",
      "Run investor updates that keep both yes and no responses engaged.",
    ],
  },
  "module-08": {
    tag: "Module 08",
    title: "Success Stories & Live Pitch Lab",
    meta: "Demo Day readiness",
    bullets: [
      "Break down case studies of founders who successfully raised capital.",
      "Pitch live and field tough Q&A with operator-level feedback.",
      "Join mentorship sessions with alumni and guest investors.",
      "Virtual Demo Day: secure direct feedback from VCs and angel investors.",
    ],
  },
};

if (moduleTooltip && curriculumModules.length && hasFinePointer) {
  const tooltipState = {
    rafId: null,
    x: 0,
    y: 0,
  };

  const positionTooltip = (x, y) => {
    const bounds = moduleTooltip.getBoundingClientRect();
    const width = bounds.width || moduleTooltip.offsetWidth || 0;
    const height = bounds.height || moduleTooltip.offsetHeight || 0;
    const padding = 24;
    const offsetX = 24;
    const offsetY = 24;

    let targetX = x - offsetX;
    let targetY = y - height - offsetY;

    const minX = padding;
    const maxX = window.innerWidth - width - padding;
    const minY = padding;
    const maxY = window.innerHeight - height - padding;

    if (targetX < minX) targetX = minX;
    if (targetX > maxX) targetX = maxX;
    if (targetY < minY) targetY = minY;
    if (targetY > maxY) targetY = maxY;

    moduleTooltip.style.left = `${targetX}px`;
    moduleTooltip.style.top = `${targetY}px`;
  };

  const schedulePosition = (x, y) => {
    tooltipState.x = x;
    tooltipState.y = y;
    if (tooltipState.rafId) return;
    tooltipState.rafId = window.requestAnimationFrame(() => {
      tooltipState.rafId = null;
      positionTooltip(tooltipState.x, tooltipState.y);
    });
  };

  const buildTooltip = (moduleId) => {
    const detail = moduleDetails[moduleId];
    if (!detail) return;

    const fragment = document.createDocumentFragment();

    const tag = document.createElement("span");
    tag.className = "module-tooltip__tag";
    tag.textContent = detail.tag;
    fragment.appendChild(tag);

    const title = document.createElement("h4");
    title.textContent = detail.title;
    fragment.appendChild(title);

    if (detail.meta) {
      const meta = document.createElement("p");
      meta.className = "module-tooltip__meta";
      meta.textContent = detail.meta;
      fragment.appendChild(meta);
    }

    if (detail.bullets?.length) {
      const list = document.createElement("ul");
      detail.bullets.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
      });
      fragment.appendChild(list);
    }

    moduleTooltip.replaceChildren(fragment);
  };

  const showTooltip = (moduleId, x, y) => {
    buildTooltip(moduleId);
    moduleTooltip.classList.add("is-visible");
    moduleTooltip.setAttribute("aria-hidden", "false");
    schedulePosition(x, y);
  };

  const hideTooltip = () => {
    moduleTooltip.classList.remove("is-visible");
    moduleTooltip.setAttribute("aria-hidden", "true");
  };

  curriculumModules.forEach((moduleCard) => {
    const id = moduleCard.getAttribute("data-module");
    if (!moduleDetails[id]) return;

    moduleCard.addEventListener("mouseenter", (event) => {
      showTooltip(id, event.clientX, event.clientY);
    });

    moduleCard.addEventListener("mousemove", (event) => {
      schedulePosition(event.clientX, event.clientY);
    });

    moduleCard.addEventListener("mouseleave", hideTooltip);

    moduleCard.addEventListener("focus", () => {
      const rect = moduleCard.getBoundingClientRect();
      showTooltip(id, rect.left + 12, rect.bottom);
    });

    moduleCard.addEventListener("blur", hideTooltip);
  });

  document.addEventListener("scroll", () => {
    if (!moduleTooltip.classList.contains("is-visible")) return;
    hideTooltip();
  });
}
