const animatedElements = document.querySelectorAll("[data-animate]");
// Hard edges default; allow override via URL (?edges=soft to disable)
try {
  const params = new URLSearchParams(window.location.search);
  const mode = (params.get("edges") || "hard").toLowerCase();
  if (mode !== "soft") {
    document.body.classList.add("hard-edges");
  } else {
    document.body.classList.remove("hard-edges");
  }
} catch (_) {
  document.body.classList.add("hard-edges");
}

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
    rootMargin: "0px 0px -80px 0px",
  }
);

animatedElements.forEach((element) => observer.observe(element));

const nav = document.querySelector(".nav");
const navLinks = document.querySelector(".nav__links");
const navCtas = document.querySelector(".nav__ctas");
const navToggle = document.querySelector(".nav__toggle");

const closeNav = () => {
  nav?.classList.remove("is-open");
  navLinks?.classList.remove("is-visible");
  navCtas?.classList.remove("is-visible");
  navToggle?.setAttribute("aria-expanded", "false");
};

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  navToggle?.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

document.addEventListener("click", (event) => {
  if (!nav?.classList.contains("is-open")) return;
  if (!nav.contains(event.target)) {
    closeNav();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1100) {
    closeNav();
  }
});

const journeyTrack = document.querySelector("[data-step-progress]");
const progressBar = document.querySelector("[data-progress-bar]");

if (journeyTrack && progressBar) {
  const cards = Array.from(journeyTrack.querySelectorAll("article"));
  const progressObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = cards.indexOf(entry.target);
          cards.forEach((card) => card.classList.remove("active"));
          entry.target.classList.add("active");
          const width = ((index + 1) / cards.length) * 100;
          progressBar.style.width = `${width}%`;
        }
      });
    },
    { threshold: 0.6 }
  );

  cards.forEach((card) => progressObserver.observe(card));
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
const moduleCards = document.querySelectorAll("[data-module]");
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

if (moduleTooltip && moduleCards.length && hasFinePointer) {
  const tooltipState = { rafId: null, x: 0, y: 0 };

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

  const buildTooltip = (id) => {
    const detail = moduleDetails[id];
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

  const showTooltip = (id, x, y) => {
    buildTooltip(id);
    moduleTooltip.classList.add("is-visible");
    moduleTooltip.setAttribute("aria-hidden", "false");
    schedulePosition(x, y);
  };

  const hideTooltip = () => {
    moduleTooltip.classList.remove("is-visible");
    moduleTooltip.setAttribute("aria-hidden", "true");
  };

  moduleCards.forEach((card) => {
    const id = card.getAttribute("data-module");
    if (!moduleDetails[id]) return;

    card.addEventListener("mouseenter", (event) => {
      showTooltip(id, event.clientX, event.clientY);
    });

    card.addEventListener("mousemove", (event) => {
      schedulePosition(event.clientX, event.clientY);
    });

    card.addEventListener("mouseleave", hideTooltip);

    card.addEventListener("focus", () => {
      const rect = card.getBoundingClientRect();
      showTooltip(id, rect.left + 12, rect.bottom);
    });

    card.addEventListener("blur", hideTooltip);
  });

  document.addEventListener("scroll", () => {
    if (!moduleTooltip.classList.contains("is-visible")) return;
    hideTooltip();
  });
}

// Manifesto interactive cards: hover pop and click-to-lock
(() => {
  const grid = document.querySelector('.manifesto__grid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('article'));
  cards.forEach((card) => {
    card.setAttribute('tabindex', '0');
    const activate = (target) => {
      cards.forEach((c) => c.classList.remove('is-active'));
      target.classList.add('is-active', 'is-press');
      window.setTimeout(() => target.classList.remove('is-press'), 320);
    };
    card.addEventListener('click', () => activate(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(card);
      }
    });
  });
})();

// Week cards interactive behavior (Week 01–03)
(() => {
  const track = document.querySelector('.journey__timeline');
  if (!track) return;
  const cards = Array.from(track.querySelectorAll('article'));
  cards.forEach((card) => {
    card.setAttribute('tabindex', '0');
    const activate = (target) => {
      cards.forEach((c) => c.classList.remove('is-active'));
      target.classList.add('is-active', 'is-press');
      window.setTimeout(() => target.classList.remove('is-press'), 320);
    };
    card.addEventListener('click', () => activate(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(card);
      }
    });
  });
})();

const heroSection = document.querySelector(".hero");
if (heroSection && hasFinePointer) {
  heroSection.addEventListener("pointermove", (event) => {
    const rect = heroSection.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    heroSection.style.setProperty("--pointer-x", `${x}%`);
    heroSection.style.setProperty("--pointer-y", `${y}%`);
  });

  heroSection.addEventListener("pointerleave", () => {
    heroSection.style.removeProperty("--pointer-x");
    heroSection.style.removeProperty("--pointer-y");
  });
}

const particleCanvas = document.getElementById("particle-canvas");
if (particleCanvas) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    particleCanvas.remove();
  } else {
  const context = particleCanvas.getContext("2d");
  let particles = [];
  let animationFrame;

  const resizeCanvas = () => {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    particles = generateParticles();
  };

  const generateParticles = () => {
    const count = Math.min(140, Math.floor((particleCanvas.width * particleCanvas.height) / 22000));
    return Array.from({ length: count }, () => ({
      x: Math.random() * particleCanvas.width,
      y: Math.random() * particleCanvas.height,
      radius: Math.random() * 1.6 + 0.4,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.6 + 0.2,
    }));
  };

  const drawParticles = () => {
    context.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach((particle) => {
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(142, 173, 255, ${particle.alpha})`;
      context.fill();

      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0 || particle.x > particleCanvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > particleCanvas.height) particle.speedY *= -1;
    });
    animationFrame = requestAnimationFrame(drawParticles);
  };

  resizeCanvas();
  drawParticles();
  window.addEventListener("resize", resizeCanvas);

  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(animationFrame);
  });
}
}

// Background logos parallax counter-scroll
const logoField = document.querySelector(".logo-field");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (logoField && !reduceMotion) {
  const columns = Array.from(document.querySelectorAll(".logo-field__column"));
  const columnState = columns.map((column, index) => ({
    element: column,
    speed: parseFloat(column.getAttribute("data-speed") || "0") || 0,
    baseOffset: (Math.random() - 0.5) * 120 + (index % 2 === 0 ? 20 : -20),
  }));

  let rafId = null;

  const updateColumns = () => {
    rafId = null;
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const t = performance.now() * 0.0006;

    columnState.forEach(({ element, speed, baseOffset }, i) => {
      const drift = Math.sin(t + i) * 14;
      const translateY = baseOffset + y * speed + drift;
      element.style.transform = `translate3d(0, ${translateY}px, 0)`;
    });
  };

  const requestUpdate = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(updateColumns);
  };

  // Initial paint
  updateColumns();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
}

// Build dynamic carousels from founder names list
const founderListEmbedded = `
###Who You will learn from LIst

Brynne McNulty
Founder & CEO - Habi

Mercedes Bent
Partner - Lightspeed


Courtney Powell
Managing Partner & COO - 500

David Vélez
Founder & CEO - Nu Bank

Simón Borrero
Founder & CEO - Rapi

Marcelo Claure
Founder & CEO - Claure Group

Nico Berman
Partner - Kaszek

Paulo Passoni
Managing Partner - Valor

Mike Maples, Jr
Managing Partner - Floodgate

Carlo Dapuzzo
General Partner - Monashees+

Connie Grossi
Leadership & Talent Advisor - 

Rodrigo Baer
Co-founder and Managing Partner - Upload

Enrique Conde
Partner - Holland and Knight

Gabriel Vasquez
Investment Partner - a16z

Juan Felipe Muñoz
Partner - Britten

Keith Ferrazzi
Author of "Never Eat Alone"

Ronen Olshansky
Co-Founder & CEO
Connected Success



#####MENTORS LIST
Javier Villamizar
Operating Partner - Soft Bank

Karla Berman
Shark Tank México 

Adrian Garcia-Aranyos
Global President

Christine Kenna
Partner - Ignia

Freddy Vega
Founder and CEO - Platzi

Ana Cristina Gadala
Early stage fintech investor - QED

Christian Van Der Henst
Co-founder and President - Platzi

Sarah AlSaleh
General Partner - 
`;

// On GitHub Pages, site is served from proposal-04 root. Place assets alongside index.html
const assetsBase = "assets and copy/";

function normalizeName(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}+/gu, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const imageIndex = (() => {
  const fileBaseNames = [
    "Adrian","Alfonso","Ana Cristina","Anderson","Brynne","carlo","Christian Van Der Henst","Christine","connie","Courtney","David Velez","Diego Galvez","Enrique","Eyal","Federico","Freddy","gabriel","Javier","Juan Felipe","Karla","Keith","Laura copy","Laura","Marcelo Claure","Mercedes","Mike","Nico Berman","Paulo Passoni","rodrigo","Ronen","Sarah AlSaleh","Simon Borrero",
  ];
  const map = new Map();
  fileBaseNames.forEach((base) => {
    const path = `${assetsBase}${base}.webp`;
    const fullKey = normalizeName(base);
    const firstKey = normalizeName(base.split(" ")[0]);
    map.set(fullKey, path);
    map.set(firstKey, path);
  });
  return map;
})();

function lookupImageForName(fullName) {
  if (!fullName) return null;
  const candidates = [fullName, fullName.split(" ")[0]]
    .map((v) => normalizeName(v));
  for (const key of candidates) {
    const hit = imageIndex.get(key);
    if (hit) return hit;
  }
  return null;
}

function parseFounderSections(text) {
  const sections = { learn: [], mentors: [] };
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  let mode = "learn";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    if (line.toUpperCase().startsWith("#####MENTORS")) {
      mode = "mentors";
      continue;
    }

    // Skip other markdown headings
    if (line.startsWith("#")) continue;

    // Name line
    const name = line;

    // Role & company expected on the next line as "Role - Company" (company may be empty)
    const next = lines[i + 1] || "";
    let role = "";
    let company = "";
    if (next && !next.startsWith("#")) {
      const parts = next.split(" - ");
      role = (parts[0] || "").trim();
      company = (parts[1] || "").trim();
      i += 1; // consume the role line only
    }

    sections[mode].push({ name, role, company });
  }
  // De-duplicate by normalized name within each section
  const dedupe = (arr) => {
    const seen = new Set();
    return arr.filter((p) => {
      const key = normalizeName(p.name);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };
  sections.learn = dedupe(sections.learn);
  sections.mentors = dedupe(sections.mentors);
  return sections;
}

function createMentorCard({ name, role, company }) {
  const wrapper = document.createElement("div");
  wrapper.className = "mentor-card";
  const img = document.createElement("img");
  img.className = "mentor-card__face";
  const src = lookupImageForName(name);
  if (src) {
    img.src = src;
    img.alt = name;
  } else {
    // Fallback placeholder
    img.alt = name;
    img.src =
      "data:image/svg+xml;utf8,\n      <svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>\n        <rect width='100%' height='100%' rx='28' ry='28' fill='%23101522'/>\n        <text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, sans-serif' font-size='18' fill='rgba(255,255,255,0.6)'>" +
      encodeURIComponent(name.split(' ')[0] || "?") +
      "</text></svg>";
  }
  const title = document.createElement("strong");
  title.textContent = name;
  const caption = document.createElement("small");
  caption.textContent = role || "";
  const normalizedCompanyKey = normalizeCompany(company || "") || (role ? normalizeCompany(role) : "");
  const logoSrc = lookupLogoForPerson(name, company, role);
  let logoEl = null;
  if (logoSrc) {
    logoEl = document.createElement("img");
    logoEl.className = "mentor-card__logo";
    logoEl.alt = company || "";
    logoEl.src = logoSrc;
    if (normalizedCompanyKey) logoEl.dataset.company = normalizedCompanyKey;
  }
  wrapper.append(img, title, caption);
  if (logoEl) wrapper.appendChild(logoEl);
  return wrapper;
}

function populateCarousel(selector, items) {
  const root = document.querySelector(`[data-carousel="${selector}"]`);
  if (!root) return;
  const tracks = root.querySelectorAll('[data-track]');

  // Build first track content
  const track1 = document.createElement('div');
  track1.style.display = 'flex';
  track1.style.gap = '18px';
  items.forEach((item) => track1.appendChild(createMentorCard(item)));

  // Build second track with a rotated order to avoid same person adjacency at the seam
  const offset = Math.max(1, Math.floor(items.length / 2));
  const rotated = items.slice(offset).concat(items.slice(0, offset));
  const track2 = document.createElement('div');
  track2.style.display = 'flex';
  track2.style.gap = '18px';
  rotated.forEach((item) => track2.appendChild(createMentorCard(item)));

  if (tracks[0]) tracks[0].replaceChildren(track1.cloneNode(true));
  if (tracks[1]) tracks[1].replaceChildren(track2.cloneNode(true));
}

async function initCarousels() {
  let raw = founderListEmbedded;
  try {
    const response = await fetch(encodeURI("../founder names"));
    if (response.ok) {
      raw = await response.text();
    }
  } catch (_) {
    // Use embedded fallback when fetching from file:// or any error
  }
  try {
    const data = parseFounderSections(raw);
    populateCarousel("learn-from", data.learn);
    populateCarousel("mentors", data.mentors);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Unable to build mentor carousels", e);
  }
}

initCarousels();

// Company logo lookup
function normalizeCompany(str) {
  return normalizeName(str)
    .replace(/\s*\+\s*/g, "+");
}

const logoBase = "logos/"; // relative to proposal-04/index.html

const companyToLogo = new Map([
  ["500", "500-logo.webp"],
  ["rappi", "rappi-logo.webp"],
  ["rapi", "rappi-logo.webp"],
  ["habi", "habi-logo.webp"],
  ["a16z", "a6z-logo.webp"],
  ["kaszek", "kaszek.webp"],
  ["floodgate", "floogate-logo.webp"],
  ["ferrazzi", "ferrazzi-logo.webp"],
  ["leadership advisor", "leadershipadvisor-logo.webp"],
  ["connected success", "connected-success-logo.webp"],
  ["claure group", "claure group-logo.webp"],
  ["britten", "britten-logo.webp"],
  ["monashees+", "monashees-logo.webp"],
  ["monashees", "monashees-logo.webp"],
  ["upload", "upload-logo.webp"],
  ["holland and knight", "hollandandkingh-logo.webp"],
  ["valor", "valor-logo.webp"],
  ["nu bank", "nu-logo.webp"],
  ["lightspeed", "lightspeed-logo.webp"],
  ["soft bank", "softbank-logo.webp"],
  ["softbank", "softbank-logo.webp"],
  ["ignia", "ignia-logo.webp"],
  ["platzi", "platzi-logo.webp"],
  ["qed", "qed-logo.webp"],
  ["shark tank mexico", "sharktank-logo.webp"],
]);

// Overrides for names without company or special mapping
const nameOverrides = new Map([
  [normalizeName("Connie Grossi"), "leadershipadvisor-logo.webp"],
  [normalizeName("Adrian Garcia-Aranyos"), "mistery-logo-1.webp"],
  [normalizeName("Sarah AlSaleh"), "mistery-logo-2.webp"],
  [normalizeName("Eyal Shats"), "mistery-logo-3.webp"],
  [normalizeName("Laura Gonzalez"), "mystery-logo-4.webp"],
  [normalizeName("Keith Ferrazzi"), "ferrazzi-logo.webp"],
  [normalizeName("Ronen Olshansky"), "connected-success-logo.webp"],
]);

function lookupLogoForPerson(name, company, role) {
  const override = nameOverrides.get(normalizeName(name || ""));
  if (override) return `${logoBase}${override}`;
  let normalized = normalizeCompany(company || "");
  if (!normalized && role) {
    // Try mapping based on role when company is absent (e.g., "Shark Tank México")
    normalized = normalizeCompany(role);
  }
  if (!normalized) return null;
  // Try exact map, then try "<company>-logo.webp" heuristic
  if (companyToLogo.has(normalized)) {
    const mapped = companyToLogo.get(normalized);
    return mapped ? `${logoBase}${mapped}` : null;
  }
  // Unknown company; skip rendering rather than showing broken image
  // eslint-disable-next-line no-console
  console.warn("No logo mapping for company:", company);
  return null;
}

// Progress nav logic
(() => {
  const nav = document.querySelector('[data-progress-nav]');
  const fill = document.querySelector('[data-progress-fill]');
  if (!nav || !fill) return;
  const dots = Array.from(nav.querySelectorAll('.progress-nav__dot'));
  const targets = dots.map((dot) => document.querySelector(dot.getAttribute('data-target'))).filter(Boolean);

  // Smooth scroll on click
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      targets[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      dot.classList.add('is-pop');
      window.setTimeout(() => dot.classList.remove('is-pop'), 280);
    });
  });

  // Smooth progress based on viewport center position
  const getTopY = (el) => {
    const r = el.getBoundingClientRect();
    return window.scrollY + r.top; // top of section title area
  };

  const magnet = { holdUntil: 0, ratio: null, window: 0.012, holdMs: 200 };

  const updateProgress = () => {
    if (!targets.length) return;
    const start = getTopY(targets[0]);
    const end = getTopY(targets[targets.length - 1]);
    const viewCenter = window.scrollY + window.innerHeight / 2;
    const pctRaw = Math.min(1, Math.max(0, (viewCenter - start) / (end - start)));

    // Subtle magnetism: when close to a dot, snap and hold briefly
    let pct = pctRaw;
    const now = performance.now();
    if (magnet.holdUntil > now && magnet.ratio != null) {
      pct = magnet.ratio;
    } else {
      magnet.ratio = null;
      for (let i = 0; i < dots.length; i++) {
        const ratio = parseFloat((dots[i].style.top || '0%').replace('%','')) / 100;
        if (Math.abs(pctRaw - ratio) <= magnet.window) {
          magnet.ratio = ratio;
          magnet.holdUntil = now + magnet.holdMs;
          pct = ratio;
          break;
        }
      }
    }

    fill.style.height = `${pct * 100}%`;

    // Activate the last dot whose position is <= current fill
    let currentIndex = -1;
    const epsilon = 0.003;
    for (let i = 0; i < dots.length; i++) {
      const ratio = parseFloat((dots[i].style.top || '0%').replace('%','')) / 100;
      if (ratio <= pct + epsilon) currentIndex = i;
    }
    // Ensure first dot is active by default
    if (currentIndex < 0) currentIndex = 0;

    dots.forEach((dot, i) => {
      const nowActive = i === currentIndex;
      const wasActive = dot.classList.contains('is-visited');
      dot.classList.toggle('is-visited', nowActive);
      if (nowActive && !wasActive) {
        dot.classList.add('is-pop');
        window.setTimeout(() => dot.classList.remove('is-pop'), 260);
      }
    });
  };

  // Dynamically position dots along the track to match section title positions
  const positionDots = () => {
    if (!targets.length) return;
    const start = getTopY(targets[0]);
    const end = getTopY(targets[targets.length - 1]);
    const span = Math.max(1, end - start);
    // Per-dot pixel adjustments (positive pushes later/down, negative sooner/up)
    const adjustPx = [0, 0, 0, -50, +110, 0, +200, +200, 0]; // bubble 4: 12px sooner
    dots.forEach((dot, i) => {
      const y = getTopY(targets[i]) + (adjustPx[i] || 0);
      const ratio = Math.min(1, Math.max(0, (y - start) / span));
      dot.style.top = `${ratio * 100}%`;
    });
  };

  positionDots();
  updateProgress();
  window.addEventListener('scroll', () => {
    if (window.requestAnimationFrame) return requestAnimationFrame(updateProgress);
    updateProgress();
  }, { passive: true });
  window.addEventListener('resize', () => {
    if (window.requestAnimationFrame) return requestAnimationFrame(positionDots);
    positionDots();
  });
})();
