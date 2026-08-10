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
2. **Hero Banner** (#hero, SECTION 1) — edge-to-edge full-width AUTO-playing banner carousel (`slide-1.png`/`slide-2.png`), images keep native aspect (never cropped, no side gaps). **Bottom-right indicator pills** — red progress fill animates 0→100% across the 3.2s autoplay delay so the user sees when it changes; clickable. No side arrows. **Gap below banner into Products**: 56px (32px mobile). Add more slides to `.swiper-wrapper` when needed.
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