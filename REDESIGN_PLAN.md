# ORBITAL ROBOTICS — FINAL REDESIGN PLAN
## "HARD CAPTURE" (Mission Console build)

> Produced 2026-06-09 via a 9-agent design process: site audit + competitor research
> (SpaceX, Anduril, GITAI, Figure, K2 Space, Stoke, Linear, Vercel…), three independent
> redesign concepts (Cinematic Aerospace / Mission Control / Product-Led Premium),
> scored by a 3-judge panel (buyer/investor, art director, frontend builder), then
> synthesized into this single direction.

---

## 1. Design direction

> **Provenance correction (2026-06-10):** all current video assets are simulations — no real-hardware
> footage exists yet (first physical prototype: Q2 2026 per roadmap). The thesis below is reframed
> accordingly. Nothing on the site may be labeled or implied to be real footage.

The site becomes the evidence — but the evidence is *engineering*, not footage. What Orbital Robotics can show that competitors' marketing animations cannot: the actual autonomy stack executing captures in physics simulation — NavIQ segmenting targets, ASTRA-P computing the approach, IK solving in real time, thousands of Monte Carlo runs. The difference between a hand-animated render and a software-in-the-loop simulation is the difference between a movie and a wind tunnel — and the site's job is to make that difference visible. Every frame is framed in the visual language of the company's own NavIQ overlays: mono telemetry, hairline rules, corner-bracket reticles, dated milestones. The recurring stamp on every media frame is an honest provenance label — `SIMULATION — FLIGHT SOFTWARE IN THE LOOP` — deployed at instrument scale. Honest labels in telemetry mono read as *more* credible to NASA-adjacent buyers and defense primes, who know exactly where a pre-first-mission startup stands. And the system is built to upgrade: when ground-test footage of the Alpha Prototype arrives (Q2 2026), it slots into the same FigureFrame convention as `GROUND TEST — REAL FOOTAGE` and takes over the hero — the design gets stronger as the company hits milestones.

---

## 2. Visual identity

**Palette** (enforce existing tokens; purge every literal `#0EA5E9`, `#6366F1`, `#818CF8`, `rgba(14,165,233,…)`, `#0077B5` — lint-able violations):

- Canvas `#030308` · Panel `#0A0B0F` · Raised `#15171D`
- Hairlines `rgba(255,255,255,0.08)` default → `0.16` active
- Text `#F4F6F8` / `#AEB4BE` / `#5B616B` — never more than three
- **Signal blue `#2E8BE6`** — interactive + HUD only; hover brightens to `#56A8EE` (*instruments brighten, they don't darken* — retire darkening hovers)
- **Ember `#E0701A`** — sacred: flight heritage, COMPLETE, CAPTURE CONFIRMED, availability badges. Nothing else.
- Status as literal mono words: NOMINAL `#3FB27F` · CAUTION `#E0A91A` · FAULT `#E0533F`
- **Hard rule:** one accent per viewport beyond what footage supplies. Radius 2–4px max — instruments are rectangular; kill `rounded-full` pills.

**Typography** (self-hosted via @fontsource; delete the render-blocking `@import` in `src/styles/global.css`; retire Outfit):

- **Display: Archivo** variable — UPPERCASE, wdth 120–125, wght 800. The ownable aerospace-industrial register (two of three judges); `clamp(3.25rem, 8vw, 7.5rem)`, lh 0.95, ls −0.01em. H2 `clamp(2rem, 4.5vw, 3.5rem)`.
- **Body: Inter** 400/500 (keep — zero migration), locked 1rem–1.0625rem.
- **Mono: JetBrains Mono** (already tokenized, finally used) — every eyebrow, spec value, timestamp, caption, table cell, form label: 11–13px uppercase, ls 0.12–0.18em.
- Hierarchy from 4×+ scale jumps, never color. Kill `.text-gradient` sitewide.

**Graphic language:** keep the Grain overlay. Add: HUD corner brackets (12px SVG L-corners, `#56A8EE`/60%, 1.5px) on media frames and primary buttons; `+` registration crosses at section corners; 1px hairline section rules carrying mono indices (`02 / PERCEIVE`); the **FigureFrame** caption convention on all media, always carrying provenance: `FIG. 03 — AR-3 FREE-FLY CAPTURE / SIMULATION — ASTRA-P + NAVIQ IN THE LOOP / 14s LOOP`. Provenance vocabulary (the only allowed values): `SIMULATION`, `SIMULATION — FLIGHT SOFTWARE IN THE LOOP`, `GROUND TEST — REAL FOOTAGE` (future), `FLIGHT` (future). Banned: glows, glassmorphism, react-icons glyphs (1.5px-stroke custom SVG only), stock imagery, AI imagery, and **any "real footage" claim until real footage exists** — `satellite-os.png` and `coming_soon.png` are deleted on day one.

**Imagery:** all sim video graded cold once in ffmpeg (teal-steel shadows) so the library reads as one camera system; renders cut out onto `#0A0B0F`; people in uniform CSS duotone (grayscale + 12% blue multiply) to equalize founder phone shots vs 200px advisor thumbnails.

---

## 3. The homepage, section by section

Numbered engineering-doc sections (mono index + hairline rule), rebuilt in `src/pages/Home.js`:

**000 — HERO.** Graded poster JPEG of the arm mid-catch paints instantly; re-encoded `ar3_catch.mp4` (~6MB, muted/loop/playsInline/`preload="metadata"`) crossfades in under 1.5s. Left-aligned, lower-left third — never centered. Mono eyebrow types on: `AR-3 FREE-FLY CAPTURE — PHYSICS SIMULATION — ASTRA-P + NAVIQ IN THE LOOP`. Display headline, Archivo expanded uppercase: **"BUILT TO CATCH SPACECRAFT."** (claims intent, not accomplishment — pre-seed restraint per the buyer judge). One dense sentence: *"Autonomous robotic arms that rendezvous with, capture, and service spacecraft in orbit. Every maneuver you're watching was computed by our flight software — nothing is animated by hand."* Two audience-split CTAs: **Book a capture demo** / ghost **See the system**. Top-right of the frame: the **[ SIM | NAVIQ ]** segmented toggle — one click crossfades to `ai_view_ar3_catch.mp4`, the same capture through the robot's perception; the entire pitch before anyone scrolls. A `timeupdate` listener flips the HUD status `TRACKING` (blue) → `CAPTURE CONFIRMED` (ember flash, 200ms) at the exact catch frame — text/color swap, no spatial tracking. Bottom: hairline-topped mono spec strip — `7 DOF · LYAPUNOV-VERIFIED CONTROL · 1000s OF MONTE CARLO RUNS · FIRST COMMERCIAL CONTRACT SIGNED · RPOC Q4 2026`. Stats flicker in like instruments powering on — **no count-up counters anywhere** ("1 Patent Pending" never counts again).

**001 — HERITAGE.** Credibility above the fold — **wording must match reality**: since no Orbital Robotics hardware has flown yet, the claim is about the people and lineage, e.g. `BUILT BY ENGINEERS FROM SIX NASA-AFFILIATED FLIGHT PROGRAMS`, six ember-ticked chips — founder supplies names; NDA'd entries read `PROGRAM 04 — RESTRICTED` (stronger for defense primes than omission). ⚠️ The current `productsData.js` describes ORA-Astrosfera as "flight-proven across six NASA-affiliated programs" — if the arm itself hasn't flown, that copy needs the same heritage reframing sitewide. Below: static, normalized white-monochrome logo row labeled `WORKING WITH` — marquee deleted, NVIDIA rebuilt transparent.

**002 — THE CATCH.** Centerpiece comparator: `ar3_catch` vs `ai_view_ar3_catch`, time-synced, split by a draggable reticle handle (`SIM FEED | NAVIQ OVERLAY`). Header: **"SEE LIKE THE ARM SEES."** FigureFrame caption carries the `SIMULATION — FLIGHT SOFTWARE IN THE LOOP` provenance. Keyboard-operable; pre-rendered side-by-side composite mp4 as fallback.

**003 — THE SYSTEM.** Four full-width numbered rows, the Figure-AI arc: `01 ACTUATE — ORA ARM FAMILY` (dual_arm_ik footage) · `02 PERCEIVE — NavIQ` (`in_space_segmentation_compressed.mp4`) · `03 DECIDE — ASTRA-P` (point-control GIF re-encoded to ~700KB mp4; mono chip `STABILITY: LYAPUNOV-VERIFIED`) · `04 OPERATE — ORBtos` (the live DOM console — see signature moments). Each: mono index, uppercase title, one sentence, ONE quantified outcome line, `Open dossier →`. **Copy lint: no adjective without adjacent evidence** (sim output, figure, or dated milestone).

**004 — THE FAMILY.** Tabbed ORA explorer: Astrosfera / Mini / Giga. `layoutId` spring tab pill (the proven Header pattern); spec numerals **roll** between values via `useSpring` (reach, payload, mass, DOF); static per-variant SVG dimension overlays. *Skip* morphing dimension lines and blueprint wireframe traces — the one asset this team can't produce at quality.

**005 — MISSIONS MANIFEST.** Ledger rows, not cards: `RPOC-AS-A-SERVICE — Q4 2026 — NOW BOOKING` (ember) · `DE-ORBIT-AS-A-SERVICE — 2028 — PLANNED`. Plus a client-side computed mono line: `T−XXX DAYS TO RPOC SERVICE` (pure date math). Dating the future is the credibility move.

**006 — TARGET: HUBBLE.** Pinned sequence: sticky full-viewport `hubble_capture_compressed.mp4` (labeled `SIMULATION` in the persistent mono caption) plays while scroll advances mono captions (`ACQUIRE → TRACK → APPROACH → HARD CAPTURE`). End card: **"Hubble has no docking fixture. That's the point."** → Save Hubble article.

**007 — MISSION LOG.** Three latest news items as mono-dated ledger rows (`date | source | headline | ↗`). `Full log →`.

**008 — FIRST CONTACT.** Display type: **"HAVE A TARGET IN ORBIT?"** over a graded still. Three audience CTAs: Book a capture demo / Mission inquiries / Join the crew. The countdown line repeats here.

**Deleted from Home:** stat counters, FaRocket icon cards, glass About cards, hardcoded-indigo ORBtos block, "Trusted by Industry Leaders."

---

## 4. Signature moments

1. **CAPTURE CONFIRMED** — the hero watches its own video's timecode and flips `TRACKING → CAPTURE CONFIRMED` (ember flash + bracket snap) at the catch frame, every loop. The site reacts to the sim's own event timeline — and the moment real ground-test footage exists, the same mechanism runs on it unchanged.
2. **SIM | NAVIQ, twice** — one-click hero toggle + the draggable comparator in 002. The perception product demoed with the perception product's own output; nobody who drags it forgets the company.
3. **THE ORBtos CONSOLE** — the gibberish AI dashboard is replaced by a real DOM instrument panel that **boots on scroll** (typed lines: `ORBTOS v2.4 BOOT… NAVIQ MODULE LOADED… ARM JOINTS 1–7 NOMINAL`, blinking cursor), then runs rAF telemetry (joint angles, quaternions, event log). ~3KB instead of 649KB; can never look fake because it's actual UI. Telemetry vocabulary engineer-approved — **never invent figures**.
4. **THE FAMILY EXPLORER + ANATOMY PLATE** — rolling spec numerals on tab switch; on the robotic-arms dossier, the Astrosfera render gets SVG callout lines that draw in (`pathLength` 0→1) labeling joints and end-effector, spec readouts responding to hover.
5. **THE SHUTTER** — 200ms black panel wipes on route change, stamped `// SYSTEMS`, `// CREW` in mono (first navigation per session only; plain wipe after). Existing `AnimatePresence mode="wait"`, costs nothing, feels like switching mission-control feeds.
6. **THE GROUND-STATION FOOTER** — `SEATTLE — 47.6062 N, 122.3321 W`, slow CSS radar sweep, live T+ clock. The detail investors screenshot.

---

## 5. Other pages

- **SYSTEMS** (`/products`): card grid → catalog index. Sticky left rail (HARDWARE / AUTONOMY / SERVICES), full-width dossier rows: mono ID (`ORA-AS-07`, `NAV-IQ`, `SVC-RPOC`), one quantified outcome line, three mono specs, status badge (`FLIGHT-PROVEN` ember / `IN DEVELOPMENT` / `Q4 2026`), FigureFrame thumb. Keep scroll restore and the cycling-video RPOC card.
- **Product detail**: the template already supports everything — **populate `productsData.js`** (the only external dependency: founder content sprint, week 1). KeyFigures, mono spec tables with dotted leaders and corner brackets; undisclosable rows read `ITAR — REQUEST DATASHEET` (signals seriousness, creates a contact event). Variant cards → comparison table + explorer. ASTRA-P hero = re-encoded mp4; ORBtos hero = the console; AstroBot = cutout on dark panel. Keep sticky anchor nav + stack cross-links.
- **CREW** (`/team`): "BUILT BY PEOPLE WHO'VE FLOWN HARDWARE." All portraits 800px WebP + duotone; founders keep cards with prominent ember credential chips; **advisors become a dense roster table** (small thumbs by design — 200px crops never scale up). One truthful pedigree line up top.
- **MISSION LOG** (`/news`): featured full-bleed graded still; rest as dated ledger rows with year dividers. Keep ArticleLayout, ShareRow, JSON-LD.
- **CONTACT**: mono comms panel (`HQ 47.6062 N… / RESPONSE < 48 HRS`); instrument inputs (mono labels, hairline-bottom fields, focus underline `scaleX` 0→1); audience radio chips (`SATELLITE OPERATOR / GOVERNMENT & DEFENSE / INVESTOR / CAREERS`) pre-filling the existing Apps Script payload. Status text uses token colors. Delete `Contact.css`.
- **FLIGHT MANIFEST** (`/roadmap`, resurrected + re-linked): one 1px rail drawing with scroll — solid ember through COMPLETE milestones, dashed blue into RPOC Q4 2026 and De-Orbit 2028.

---

## 6. Motion system

**Law: motion demonstrates the product or it doesn't ship.** All Framer Motion, no GSAP/WebGL; everything inherits the existing `MotionConfig reducedMotion="user"` (reduced-motion = posters + opacity-only).

1. **Tokens enforced** — `motionTokens.js` imported everywhere; durations 0.18/0.4/0.7, `ease.standard`; delete Home.js inline ease arrays, `float`/`glow-pulse` keyframes, `hover:scale-105`, `whileHover rotate`.
2. **Reveals** — one motion per block: 24px y-rise + fade, 0.5s, `once: true`. Headlines clip-reveal (y 110%→0, 80ms line stagger). Hairlines `scaleX` 0→1; brackets/leader lines draw via `pathLength`. Staggers only in ledger rows (0.05s).
3. **Video discipline** — a `SmartVideo` + singleton VideoDirector: poster always, `preload="none"` below fold, IntersectionObserver play/pause at 30% visibility, **max one autoplaying video at a time**. Hero `timeupdate` drives CAPTURE CONFIRMED.
4. **Pinned Hubble** — `position: sticky` + `useScroll` mapping progress to a caption index. **Never scroll-scrub `currentTime`** — it stutters on static hosting.
5. **Comparator** — drag motionValue → `clip-path: inset()`; clips trimmed to identical length/fps at encode time; re-sync if drift > 0.1s; arrow keys move the handle.
6. **Micro** — button corner ticks converge 2px on hover; hairlines brighten 8→16%; nav keeps the `layoutId="nav-pill"` spring; the ember LIVE dot is the only pulsing element on the site.

---

## 7. Asset plan

**Video (one ffmpeg afternoon; build media 119MB → <35MB, CI-gated):** H.264 CRF 26, 1080p24, faststart, audio stripped, poster frame each, one shared cold-grade filter chain. `ar3_catch` → ~6MB hero + 720p ~2.5MB mobile variant; `ai_view_ar3_catch` trimmed to identical in/outs; `segmentation_demo2` 26→7MB; `point_control.gif` 11MB→0.7MB mp4; surface `dual_arm_ik_obj_grasp`, `single_arm_docking` (≤6MB each). Retire `Home_Page.mp4` from the hero. **Delete from repo** (~800MB of unused media): masters to Drive.

**Images:** `satellite-os.png` and `coming_soon.png` deleted (console + mono `IN DEVELOPMENT` card replace them); `astrobot.png` background-knocked onto dark panel (30 min); headshots → 800px WebP duotone; news previews → 800w WebP; 10 partner logos rebuilt white-monochrome at uniform optical height. **OG images:** one dark HTML template, screenshot ~8 route variants at 1200×630; default share card = the arm mid-catch graded still.

**Fonts:** `@fontsource/archivo`, `@fontsource/inter`, `@fontsource/jetbrains-mono`, preloaded woff2. No photo shoot, no 3D artist; the priciest item is one day of console design.

**The sim advantage:** unlike footage, simulations can be re-rendered. If any clip is low-res, badly framed, or off-brand, re-run it — higher resolution, consistent camera language (slow orbital push-ins, locked-off captures), pure `#030308` backgrounds. Treat the sim pipeline as an in-house film studio: one render-settings preset shared across all clips makes the whole library look like a single instrument observed it.

---

## 8. Build plan

**Week 1 — credibility + performance (highest impact-per-effort; shippable alone):**
ffmpeg batch + repo purge + CI size gate · delete `satellite-os.png`/`coming_soon.png` (interim: graded video stills) · poster-first hero swap to `ar3_catch` · @fontsource migration, kill `@import` · token-enforcement sweep (purge legacy hexes, radius 2–4px, hover-brighten) · dead code out (`FeatureCard.js`, `Contact.css`) · **BrowserRouter + 404.html fallback as a contained PR** (clean URLs for pitch decks; fix SEO.js canonical; no react-snap) · **kick off founder content sprint**: real specs, six program names (`RESTRICTED` acceptable), console telemetry review.

**Week 2 — primitives + hero:** FigureFrame, SmartVideo/VideoDirector, SectionHeader, SpecTable, LedgerRow, StatusBadge, Button refactor, Shutter · full hero (toggle + CAPTURE CONFIRMED) · sections 001, 005, 007, 008 · footer ground station.

**Week 3 — centerpieces:** comparator (002) · system rows (003) · ORBtos console with boot · Hubble pinned sequence · Systems catalog index.

**Week 4 — depth + polish:** product-detail data population + spec tables + anatomy plate · Family Explorer · Crew/Mission Log/Contact/Flight Manifest restyles · OG images · iOS Safari QA (muted+playsInline autoplay, sticky pinning fallback to static stack) · Lighthouse pass.

**Out of scope:** Vite migration, git history rewrite, blueprint wireframe tracing, react-snap.

**Risks, pre-mitigated:** dual-video sync → identical trims + drift correction + side-by-side composite fallback; cellular first paint → poster-first, ~8MB above-fold hard cap, Save-Data poster-only gate; spec disclosure → ranges or `ITAR — REQUEST DATASHEET`; console plausibility → engineer sign-off, never fabricated precision.
