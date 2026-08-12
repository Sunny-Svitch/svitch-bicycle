/* ============================================= */
/* SVITCH BIKE — NEW IDEAS                       */
/* Header behaviour + hero component hotspots    */
/* ============================================= */

/* ─── Component hotspots ───
   x/y are PERCENTAGES of the bike image box, not pixels — that is what
   keeps each marker welded to its part as the image scales.
   `side` decides which way the card opens so it never leaves the stage.
   To re-aim a marker, nudge x/y here; nothing else needs to change. */
const COMPONENTS = [
  {
    name: "Suspension Seat",
    note: "Shock-absorbing saddle post",
    img: "images/Suspension%20Seat.webp",
    x: 36,
    y: 31,
    side: "left",
  },
  {
    name: "XE Smart Display",
    note: "Speed, range and assist level",
    img: "images/LITE-XE-Display.webp",
    x: 68,
    y: 16,
    side: "right",
  },
  {
    name: "Lithium Battery",
    note: "Removable, key-locked pack",
    img: "images/Battery.webp",
    x: 57,
    y: 43,
    side: "right",
  },
  {
    name: "Svitch XE Motor",
    note: "Rear hub drive",
    img: "images/Svitch%20XE%20Motor.webp",
    x: 19,
    y: 63,
    side: "right",
  },
  {
    name: "Pedal Assist",
    note: "Multi-level cadence sensing",
    img: "images/Padel%20Assist%20png.webp",
    x: 41,
    y: 61,
    side: "left",
  },
  {
    name: "Disc Brakes",
    note: "Dual-disc stopping power",
    img: "images/DishBreak.webp",
    x: 73,
    y: 63,
    side: "right",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("siteHeader");
  const nav = document.getElementById("headerNav");
  const toggle = document.getElementById("menuToggle");
  const backdrop = document.getElementById("menuBackdrop");
  const navLinks = nav ? Array.from(nav.querySelectorAll(".nav-link")) : [];

  /* ─── Mobile menu ─── */
  const setMenu = (open) => {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);

    if (!backdrop) return;
    if (open) {
      backdrop.hidden = false;
      // Next frame, so the browser paints opacity:0 before transitioning
      requestAnimationFrame(() => backdrop.classList.add("is-visible"));
    } else {
      backdrop.classList.remove("is-visible");
      setTimeout(() => {
        backdrop.hidden = true;
      }, 350);
    }
  };

  const isMenuOpen = () => !!nav && nav.classList.contains("is-open");

  if (toggle) toggle.addEventListener("click", () => setMenu(!isMenuOpen()));
  if (backdrop) backdrop.addEventListener("click", () => setMenu(false));

  navLinks.forEach((link) =>
    link.addEventListener("click", () => setMenu(false)),
  );

  // Resizing up to desktop must not leave body scroll locked
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024 && isMenuOpen()) setMenu(false);
  });

  /* ─── Currency dropdown ─── */
  const currency = document.getElementById("currency");
  const currencyBtn = document.getElementById("currencyBtn");
  const currencyLabel = document.getElementById("currencyLabel");
  const currencyMenu = document.getElementById("currencyMenu");

  const setCurrencyOpen = (open) => {
    if (!currency || !currencyBtn) return;
    currency.classList.toggle("is-open", open);
    currencyBtn.setAttribute("aria-expanded", String(open));
  };

  if (currencyBtn) {
    currencyBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      setCurrencyOpen(!currency.classList.contains("is-open"));
    });
  }

  if (currencyMenu) {
    currencyMenu.addEventListener("click", (e) => {
      const opt = e.target.closest("[data-cur]");
      if (!opt) return;
      if (currencyLabel) currencyLabel.textContent = opt.dataset.cur;
      setCurrencyOpen(false);
    });
  }

  /* ─── Hotspots ───
       Built from COMPONENTS rather than hand-written markup, so adding a
       seventh part is one array entry. */
  const layer = document.getElementById("hotspotLayer");
  let openHotspot = null;

  const closeHotspot = () => {
    if (!openHotspot) return;
    openHotspot.classList.remove("is-open");
    openHotspot
      .querySelector(".hotspot-dot")
      .setAttribute("aria-expanded", "false");
    openHotspot = null;
  };

  const openOnly = (spot) => {
    // One card at a time — two overlapping cards on a bike is unreadable
    if (openHotspot === spot) {
      closeHotspot();
      return;
    }
    closeHotspot();
    spot.classList.add("is-open");
    spot.querySelector(".hotspot-dot").setAttribute("aria-expanded", "true");
    openHotspot = spot;
  };

  if (layer) {
    COMPONENTS.forEach((part, i) => {
      const spot = document.createElement("div");
      spot.className = "hotspot";
      spot.dataset.side = part.side;
      spot.style.left = `${part.x}%`;
      spot.style.top = `${part.y}%`;
      // Staggered reveal is driven here rather than in CSS so the
      // delay stays tied to array order. The 0.5s base lets the bike
      // land before the markers start popping.
      spot.style.animationDelay = `${0.5 + 0.15 * i}s`;

      spot.innerHTML = `
                <button class="hotspot-dot" type="button"
                        aria-expanded="false"
                        aria-label="${part.name} — ${part.note}"></button>
                <div class="hotspot-card" role="dialog" aria-label="${part.name}">
                    <div class="hotspot-card-media">
                        <img src="${part.img}" alt="${part.name}" loading="lazy" />
                    </div>
                    <p class="hotspot-card-name">${part.name}</p>
                    <p class="hotspot-card-note">${part.note}</p>
                </div>
            `;

      const dot = spot.querySelector(".hotspot-dot");

      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        openOnly(spot);
      });

      // Desktop pointers get hover-to-peek; touch devices don't fire
      // this, so tap remains the only path there (no double-tap trap)
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        spot.addEventListener("mouseenter", () => openOnly(spot));
        spot.addEventListener("mouseleave", closeHotspot);
      }

      layer.appendChild(spot);
    });
  }

  /* ─── Bike reveal ───
       The cycle opens from its center as the section arrives, and only
       then do the markers start their staggered pop. Both hang off this
       one class (see .bike-stage.is-revealed in style.css) so they can
       never drift apart.

       This has to be scroll-driven: the markers' delays are inline
       animation-delays, so before this existed they burned down from page
       load and the whole stagger was finished long before anyone scrolled
       this far. CSS holds them paused until the class lands. */
  const bikeStage = document.getElementById("bikeStage");

  if (bikeStage) {
    const revealBike = () => bikeStage.classList.add("is-revealed");

    if ("IntersectionObserver" in window) {
      const bikeObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            revealBike();
            bikeObserver.unobserve(entry.target);
          });
        },
        // A fifth of the stage on screen — late enough that the reveal is
        // watched rather than already spent by the time it's looked at.
        { threshold: 0.2 },
      );

      bikeObserver.observe(bikeStage);
    } else {
      revealBike();
    }
  }

  // Any click outside a hotspot or the currency menu closes them
  document.addEventListener("click", () => {
    closeHotspot();
    setCurrencyOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (isMenuOpen()) {
      setMenu(false);
      if (toggle) toggle.focus();
    }
    closeHotspot();
    setCurrencyOpen(false);
  });

  /* ─── Scroll: compact header ─── */
  let ticking = false;

  /* Footer — back-to-top button + live copyright year */
  const yearEl = document.querySelector("[data-footer-year]");
  if (yearEl) {
    yearEl.textContent = yearEl.textContent.replace(/\d{4}/, new Date().getFullYear());
  }
  /* ─── Newsletter form ───
       No endpoint yet — this validates the address and shows the confirmed
       state so the section behaves. Point it at the real list provider by
       replacing the body of the success branch. */
  const newsletterForm = document.getElementById("newsletterForm");

  if (newsletterForm) {
    const emailInput = document.getElementById("newsletterEmail");
    const msg = document.getElementById("newsletterMsg");
    const btn = newsletterForm.querySelector("button");

    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const value = emailInput.value.trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        newsletterForm.classList.add("is-error");
        msg.textContent = "Enter a valid email address.";
        emailInput.focus();
        return;
      }

      newsletterForm.classList.remove("is-error");
      newsletterForm.classList.add("is-done");
      btn.innerHTML = '<i class="bi bi-check2"></i> You\'re in';
      msg.textContent = "Thanks — check your inbox to confirm.";
      emailInput.readOnly = true;
    });

    // Clearing the error the moment they start fixing it
    emailInput.addEventListener("input", () => {
      if (!newsletterForm.classList.contains("is-error")) return;
      newsletterForm.classList.remove("is-error");
      msg.textContent = "";
    });
  }

  const toTopBtn = document.querySelector("[data-scroll-top]");
  if (toTopBtn) {
    toTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const onScroll = () => {
    const y = window.scrollY;

    if (header) header.classList.toggle("is-scrolled", y > 10);
    if (toTopBtn) toTopBtn.classList.toggle("is-visible", y > 600);

    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(onScroll);
    },
    { passive: true },
  );

  onScroll(); // sync on load (covers a refresh mid-page)

  /* ─── Active nav link ───
       IntersectionObserver rather than scroll math: it stays correct when
       sections have wildly different heights. rootMargin pulls the
       detection band to the upper-middle of the viewport so a section
       highlights as it takes over the screen. */
  const sections = navLinks
    .map((link) => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#") || href === "#") return null;
      const el = document.querySelector(href);
      return el ? { link, el } : null;
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const match = sections.find((s) => s.el === entry.target);
          if (match)
            match.link.classList.toggle("is-active", entry.isIntersecting);
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    sections.forEach(({ el }) => observer.observe(el));
  }

  /* ═══════════════════════════════════════════════════════ */
  /* GSAP — hero text wave color shift + products carousel   */
  /* ═══════════════════════════════════════════════════════ */
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const heroTitle = document.querySelector(".hero-head .heading-title");

    if (heroTitle && !reduced) {
      const wrapCharacters = (element) => {
        [...element.childNodes].forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const frag = document.createDocumentFragment();

            node.textContent.split("").forEach((letter) => {
              const span = document.createElement("span");

              span.className = "char";

              span.innerHTML = letter === " " ? "&nbsp;" : letter;

              frag.appendChild(span);
            });

            node.replaceWith(frag);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            wrapCharacters(node);
          }
        });
      };

      wrapCharacters(heroTitle);

      gsap.from(".hero-head .heading-title .char", {
        y: 80,

        opacity: 0,

        stagger: 0.03,

        duration: 0.8,

        ease: "power4.out",
      });

      gsap.to(".hero-head .heading-title .accent .char", {
        color: "#AD0101",

        duration: 0.8,

        stagger: 0.02,

        delay: 0.25,
      });
    }

    /* ── Products carousel: pinned horizontal scroll (vanilla JS + sticky) ── */
    const pin = document.getElementById("productsPin");
    const track = document.getElementById("productsTrack");

    if (pin && track) {
      let rafId = 0;
      let maxX = 0;

      function measure() {
        const viewport = track.closest(".products-viewport");
        const padL = viewport ? parseFloat(getComputedStyle(viewport).paddingLeft) || 0 : 0;
        const padR = viewport ? parseFloat(getComputedStyle(viewport).paddingRight) || 0 : 0;
        maxX = Math.max(0, track.scrollWidth + padL + padR - window.innerWidth);
        pin.style.height = window.innerHeight + maxX + "px";
      }

      function update() {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const rect = pin.getBoundingClientRect();
          const scrolled = Math.min(Math.max(-rect.top, 0), maxX);
          track.style.transform = "translate3d(" + -scrolled + "px,0,0)";
        });
      }

      measure();
      update();
      window.addEventListener("resize", () => {
        measure();
        update();
      });
      window.addEventListener("load", () => {
        measure();
        update();
      });
      document.addEventListener("scroll", update, { passive: true });
    }

    /* ── Section 3 — Features: explore toggle ── */
    const featuresSection = document.querySelector(".features");
    const featuresToggle = document.getElementById("featuresToggle");
    const featuresClose = document.getElementById("featuresClose");
    const featuresGrid = document.getElementById("featuresGrid");

    const setFeaturesOpen = (open) => {
      if (!featuresSection) return;
      featuresSection.classList.toggle("is-open", open);
      if (featuresToggle) featuresToggle.setAttribute("aria-expanded", String(open));
      if (featuresGrid) featuresGrid.setAttribute("aria-hidden", String(!open));
    };

    if (featuresToggle) {
      featuresToggle.addEventListener("click", () => setFeaturesOpen(true));
    }
    if (featuresClose) {
      featuresClose.addEventListener("click", () => setFeaturesOpen(false));
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && featuresSection && featuresSection.classList.contains("is-open")) {
        setFeaturesOpen(false);
      }
    });

/* Add to Cart (product + merch cards) — brief fill feedback. */
    document.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        btn.classList.add("is-added");
        setTimeout(() => btn.classList.remove("is-added"), 900);
      });
    });

    /* ── Section 4 — Merchandise: Royal-Enfield style auto carousel + zoom ── */
    const merchCarousel = document.getElementById("merchCarousel");
    const merchPrev = document.querySelector(".merch-prev");
    const merchNext = document.querySelector(".merch-next");

    const merchZoom = document.getElementById("merchZoom");
    const zoomImg = document.getElementById("merchZoomImg");
    const zoomName = document.getElementById("merchZoomName");
    const zoomPrice = document.getElementById("merchZoomPrice");
    const zoomClose = document.getElementById("merchZoomClose");

    const setZoom = (open) => {
      if (!merchZoom) return;
      merchZoom.classList.toggle("is-open", open);
      merchZoom.setAttribute("aria-hidden", String(!open));
      if (open) document.body.style.overflow = "hidden";
      else document.body.style.overflow = "";
    };

    const openZoom = (card) => {
      const media = card.querySelector(".merch-card-media");
      const name = card.getAttribute("data-name");
      const price = card.getAttribute("data-price");
      if (!merchZoom || !media) return;
      const match = media.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
      zoomImg.src = match ? match[1] : "";
      zoomImg.alt = name || "";
      zoomName.textContent = name || "";
      zoomPrice.textContent = price || "";
      setZoom(true);
    };

    /* Same Swiper config as the draft's "Built Around You" section — looped
       centred carousel that auto-moves right-to-left, no empty edges. */
    if (merchCarousel && window.Swiper) {
      const swiper = new Swiper(merchCarousel, {
        slidesPerView: 1,
        centeredSlides: false,
        spaceBetween: 16,
        grabCursor: true,
        loop: true,
        speed: 700,
        autoplay: {
          delay: 2200,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
          reverseDirection: true,
        },
        navigation: { prevEl: merchPrev, nextEl: merchNext },
        keyboard: { enabled: true },
        breakpoints: {
          788: { slidesPerView: "auto", centeredSlides: true, spaceBetween: 28 },
        },
      });

      merchCarousel.querySelectorAll(".merch-card").forEach((card) =>
        card.addEventListener("click", () => openZoom(card))
      );
    }

    if (zoomClose) zoomClose.addEventListener("click", () => setZoom(false));
    if (merchZoom) merchZoom.addEventListener("click", (e) => {
      if (e.target === merchZoom) setZoom(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && merchZoom && merchZoom.classList.contains("is-open")) setZoom(false);
    });

    /* ── Top banner carousel — auto-play, bottom-right progress pills.
       Each pill carries a progress fill that animates across the autoplay
       delay so the user sees when the next slide fires. */
    const bannerSwiperEl = document.getElementById("heroBannerSwiper");
    const bannerPagination = document.getElementById("heroBannerPagination");

    if (bannerSwiperEl && window.Swiper) {
      const bannerSwiper = new Swiper(bannerSwiperEl, {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        speed: 700,
        grabCursor: true,
        autoplay: {
          delay: 3200,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        pagination: {
          el: bannerPagination,
          clickable: true,
          renderBullet: (index, className) =>
            `<span class="${className}"><span class="banner-progress-fill"></span></span>`,
        },
        keyboard: { enabled: true },
      });
    }

    /* ── Section 5 — Svitch Stories: zoom-on-scroll gallery ──
       CSR-762 c4 mechanism: each stacked card has its own scroll window
       during which it scales up (each card larger than the last) and fades
       in then out. Eased with a quadratic ease-out, rAF throttled. */
    const storiesScroll = document.getElementById("storiesScroll");
    const storiesCards = storiesScroll
      ? Array.from(storiesScroll.querySelectorAll(".stories-card"))
      : [];

    if (storiesScroll && storiesCards.length) {
      const n = storiesCards.length;
      let rafId = 0;

      const startScale = () => (window.innerWidth <= 767 ? 0.65 : 0.3);

      // The final card must NOT fill the whole viewport (touching screen
      // edges). It stops at a comfortable size so a frame stays visible
      // around it — the zoom never hides the pinned heading above it.
      const endScale = () => (window.innerWidth <= 767 ? 1 : 0.85);

      const render = () => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const rect = storiesScroll.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          const progress = Math.min(
            Math.max((window.scrollY - top) / (storiesScroll.offsetHeight - window.innerHeight), 0),
            1
          );
          const d = startScale();

          storiesCards.forEach((card, t) => {
            const start = t / n - 0.05;
            const end = (t + 1) / n;
            let x = (progress - start) / (end - start);

            if (x <= 0) {
              card.style.opacity = "0";
              card.style.transform = `scale(${d})`;
              return;
            }
            if (x > 1) {
              if (t === n - 1) {
                card.style.opacity = "1";
                card.style.transform = `scale(${endScale()})`;
              } else {
                card.style.opacity = "0";
              }
              return;
            }

            const eased = 1 - (1 - x) * (1 - x);
            const max = d + ((t + 1) / n) * (endScale() - d);
            const scale = d + eased * (max - d);

            // Fade in to full at the mid-point of the card's window, then out.
            // The LAST card never fades out — it holds the final zoomed frame
            // so the section ends on the full image instead of disappearing.
            let opacity;
            if (t === n - 1) {
              opacity = Math.min(x / 0.5, 1);
            } else {
              opacity = Math.sin(Math.min(x, 1) * Math.PI);
            }

            card.style.opacity = opacity.toFixed(3);
            card.style.transform = `scale(${scale.toFixed(4)})`;
            card.style.zIndex = "10";
          });
        });
      };

      document.addEventListener("scroll", render, { passive: true });
      window.addEventListener("resize", render);
      render();
    }
  }
});
