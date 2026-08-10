# SVITCH BIKE — PROJECT SESSION LOG

> Single source of truth for everything we design and build on svitchbike.com.
> Add every task, change, and decision here as we work.

---

## CURRENT DESIGN STATE (analyzed 2026-08-08)

Single-page site (`index.html` + `style.css` + `script.js`), vanilla + GSAP/Swiper. Dark, premium, automotive-feel.

### Design tokens
- **Colors**: `--red: #AD0101` (primary accent), hover/glow `--red-lit: #d40202`, pure black bg, `--surface: #0b0b0d`, subtle white lines (10% opacity)
- **Fonts**: Barlow (display) / Rajdhani (headings) / Inter (body), Century Gothic & Microgramma (local backup / logo-style fonts in `fonts/` + `fonts2/`)
- **Motion**: `--ease: cubic-bezier(0.22, 1, 0.36, 1)`, GSAP char-split hero anim, staggered hotspot reveal

### Page sections (top → bottom as built)
1. **Header** (sticky, compact on scroll) — Svitch white logo, 6 nav links, currency dropdown (INR/USD/EUR/AED), search/account/cart icons + badge, mobile hamburger + backdrop
2. **Hero Banner** (#hero, SECTION 1) — edge-to-edge full-width AUTO-playing banner carousel, slides locked to **1905×820** showcase ratio via `aspect-ratio: 1905/820`, image fills via `object-fit: cover`. **Bottom-right progress pills** (red fill animates 0→100% across the 3.2s autoplay delay); positioned with the DevTools-tuned rule `left:-29px; width:100%` made permanent. Pills are slim (26×4px) and **center on mobile** (≤720px, 22×4px). No side arrows. **Gap below banner into Products**: 56px (32px mobile). Add more slides to `.swiper-wrapper` when needed.
3. **Products** (#products) — PINNED horizontal scroll carousel (vanilla sticky JS), 10 product cards (Handpainted, Lite XE, MXE, Brorix 7, Elegon 7, Velona, Power Pack, Disk Break, Display, Motor), each with add-to-cart
4. **Technology / Features** (#technology) — bike image with glassy "Explore Features" toggle → swaps to 6-feature grid (suspension seat, XE display, battery, motor, pedal assist, disc brakes) + "Back to the bike" close
5. **Merchandise** (#merch) — Swiper loop carousel (auto, reverse-dir, centered ≥788px), 6 athleisure products, click card → zoom lightbox (name + price)
6. **Cycles/Showcase** (#cycles, moved here 2026-08-08) — corner-frame heading + white-line eyebrow "The Svitch Range" and title **"Explore Our Cycles"**, then the interactive bike with hotspot component map (6 parts, percentage-positioned, one-open-at-a-time, hover/tap, stagger reveal), CTA buttons
7. **Svitch Stories** (#stories) — zoom-on-scroll stacked image gallery, 5 cards, each scales up / fades in-out; last card holds final frame
8. **Footer** — brand + socials, Reach Us / Support / Company link columns, legal bar, back-to-top, live copyright year

### Shared UI patterns
- **Corner-frame headings** (`heading-frame` / `cf-mark` SVG) reused across all sections for consistent brand look
- **add-to-cart buttons** — brief "is-added" fill feedback (no real cart yet)
- **Currency selector** — label swap only, prices NOT converted yet
- **Fully responsive** — mobile menu, breakpoints at 1024px / 788px / 767px, prefers-reduced-motion respected

### Assets
- Images all converted to `.webp` (original `.png/.jpg` kept alongside in `images/`)
- Product folders: `images/products/handpainted`, `lite xe`, `Mxe`; merch in `images/Merchendies`; stories in `images/Stories`
- `cycles/` holds per-cycle photo sets (Brorix / ELEGON / Velono) — NOT yet wired into the page

### CSS structure notes
- `:root` tokens (colors, fonts, header/announce heights, spacing, easing)
- Metric/Barlow styling per-section leading to reuse; section gap 72px desktop / 44px mobile

---

## TASK LOG (chronological, newest last)

### 2026-08-08 — Hero → top banner carousel + cycles section reposition (corrected)
- Banner carousel is now **SECTION 1 at the very top** of the page — **edge-to-edge full-width** (`width:100%`, no max-width), slides keep natural aspect ratio (`width:100%; height:auto`) so nothing crops and there are **no empty side gaps**.
- **Bottom-right indicator pills restored**: 40×5px bars over the image, active one shows red `.banner-progress-fill` animating 0→100% across the 3.2s autoplay delay (Swiper `renderBullet`); clickable to jump slides. No side arrows.
- **Section gap added** between banner and Products slider: `.hero-banner-section` padding-bottom 56px (32px mobile).
- Red bike + hotspot section moved **after Merch** with heading: white-line eyebrow + **"Explore Our Cycles"**
- **Section spacing increased** in the Cycles block (padding uses `--section-gap` + heading margin up to 34px) and in Stories (heading padding up to 36px top / 44px bottom); mobile padding bumped accordingly
- Add more banner slides: drop new `<div class="swiper-slide hero-banner-slide"><img src="images/slide-N.png" /></div>` into `#heroBannerSwiper .swiper-wrapper` — autoplay picks them up automatically.

### 2026-08-10 — Cycles banner: scroll-reveal (avoncycles.com mechanism)
- Reference analysed: avoncycles.com "Explore Categories / Pick Your Adventure". Their banner reveal is **not** an animation — the section carries `background: linear-gradient(#0009, #0009), url(mtb-hero-banner.png) center/cover no-repeat **fixed**`. `background-attachment: fixed` paints the image against the viewport, so the section slides over a stationary photo. Amplified by Lenis smooth scroll (`lerp: 0.03`). Their `.reveal` fade-up is a separate IntersectionObserver (`threshold 0.1`).
- **We did not copy `background-attachment: fixed`** — it's ignored on iOS Safari and repaints the whole section every scroll frame.
- Our version: `.cycles-banner` is stretched one viewport past the section on **both** sides (`inset: calc(-1 * var(--banner-reach)) 0`), and `.cycles-banner-layer` inside is `position: sticky; top: 0; height: var(--banner-reach)`. The layer is therefore already pinned before the section enters the viewport and stays pinned until it fully leaves — identical to fixed attachment, GPU-composited, works on mobile.
- **`.cycles` uses `overflow: clip`, NOT `hidden`** (with `hidden` kept as the pre-`clip` fallback, upgraded in `@supports`). This is load-bearing: `overflow: hidden` makes the section a scroll container and the sticky layer would freeze against it instead of the page. Don't "tidy" this back to `hidden`.
- `--banner-reach` is `100vh`, upgraded to `100lvh` via `@supports` so the layer still covers when a mobile URL bar retracts.
- Darkening moved from a `brightness(0.72)` filter to a `linear-gradient(#0000009e, #000000bd)` scrim on `.cycles-banner::after` — a flat gradient instead of re-filtering a 1672×941 image every frame. Blur raised 1px → 2px, scale 1.03 → 1.06 to cover the blur fringe.
- Cleaned up: removed the redundant `.hero-head, .bike-stage, .hero-foot { position: relative; z-index: 2 }` group (all three already declare it individually) and the orphaned `.hero-glow` comment stub; banner dropped to `z-index: 0`; added `loading="lazy"` + `decoding="async"` to the banner img; added a `prefers-reduced-motion` rule that flattens the banner to a still image.
- **Still open**: `images/explore-cycle.png` is **1.8 MB** and the only non-webp image on the page — needs converting to `.webp` (no encoder installed locally).

### 2026-08-10 — Cycles: bike reveals from center on scroll-in
- `.bike-img` now opens from its middle like a shutter — `clip-path: inset(0 50% 0 50%)` → `inset(0)` with `scale(1.08)` → `1` and a fade, 1.05s on `--ease`. Fires when `.bike-stage` gets `.is-revealed`.
- **Bug found and fixed:** the hotspot markers' stagger was burning down from **page load**, not from scroll-in. Their delays are inline `animation-delay`s (`0.5s + 0.15s x index`) written by `script.js`, so on a section this far down the page the whole stagger was finished before anyone ever saw it. CSS now ships `.hotspot { animation-play-state: paused }` and resumes on `.bike-stage.is-revealed` — pausing rather than redeclaring the animation keeps those inline delays intact, they just start counting from the reveal.
- Trigger: one IntersectionObserver on `#bikeStage` at `threshold: 0.2`, adds `.is-revealed` once then unobserves (`script.js`). Falls back to revealing immediately where IO is missing.
- `prefers-reduced-motion` shows the bike and markers outright, with no dependency on the observer.
- **Note / not yet done**: the GSAP heading char-wave on `.hero-head .heading-title` has the *same* page-load problem — it's a bare `gsap.from()` with no ScrollTrigger, so the "Explore Our Cycle" title animates while the user is still up at the hero banner. Worth wrapping in a ScrollTrigger the same way.

---

## CHANGE LOG

### 2026-08-08 — Hero → Cycles section + banner carousel (corrected after feedback)
- `index.html`: banner carousel placed as SECTION 1 (`#hero`, `.hero-banner-section`, no arrows); the interactive bike showcase moved after merch with corner-frame heading + white-line eyebrow + "Explore Our Cycles" title (`#cycles`)
- `style.css`: top banner edge-to-edge full-width with natural-aspect slides (no crop, no letterbox), bottom-right progress-pill indicators (`banner-progress-fill` keyframes), gap below banner (56px/32px); `.cycles` section gets flowing layout, heading rules + extra section spacing; `.stories-head` spacing increased
- `script.js`: banner Swiper loop/autoplay with clickable pagination pills (renderBullet injects progress fill). GSAP hero-title selectors point at `.hero-head .heading-title` in the cycles block.

---

## BACKLOG / IDEAS

- `cycles/` photo galleries not wired into any section (potential bike detail pages)
- Currency prices hardcoded in INR only — conversion is UI-only right now
- Merchant "Svitch Tank" header label says ₹599 vs price ₹899 (titlebar mismatch)
- Search / account icons have no behavior (decorative)
- Products section: add-to-cart has no real cart drawer / state
- Stories section has commented-out extra slides (slide6–10) waiting for images