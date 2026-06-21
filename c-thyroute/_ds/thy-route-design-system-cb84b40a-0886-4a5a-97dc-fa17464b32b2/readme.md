# THY Route — Design System

A design system for **THY Route**, a Turkish Airlines–inspired interactive travel-planning PWA. It turns a flight into an end-to-end travel journal: multi-city route planning on Google Maps, real-time co-pilot collaboration, a Miles&Smiles partner network, a live flight board, and one-tap email reports.

This system captures THY Route's two surfaces — the **Booking Portal** (light, turkishairlines.com-style) and the **Map Journal / Cockpit** (dark "business class" glassmorphism) — as reusable tokens, components and full-screen UI kits.

---

## Sources

Everything here was reverse-engineered from the product's own code and brand docs — not guessed.

- **Codebase (source of truth):** the attached `Route/` project — `index.html`, `css/style.css` (6,349 lines), `js/app.js`, `js/map.js`, plus `design_system.md`, `README.md`, `KULLANIM_KILAVUZU.md`, `THY_PITCH_STRATEGY.md`, and two Turkish brand-analysis PDFs (web design analysis + button/geometry spec).
- **GitHub:** https://github.com/oblomovgadged/THY-Route — the same project. Explore it to go deeper on the live JS behavior (Firebase sync, EmailJS, flight APIs) before building anything advanced.
- **Live deployment referenced in docs:** https://thy-route.vercel.app

> THY Route is an independent, Turkish Airlines–*inspired* concept app pitched for B2B integration. Treat the THY crane, name and corporate red as the airline's protected marks — use them to recreate THY Route surfaces, not to invent new official THY products.

---

## Index / Manifest

| Path | What |
|---|---|
| `styles.css` | Global entry point — `@import`s every token + font file. **Consumers link this.** |
| `tokens/fonts.css` | `@import` for Outfit · Montserrat · Inter · JetBrains Mono (Google Fonts) |
| `tokens/colors.css` | Brand, dark surfaces, glass, light surfaces, text, status, fare families |
| `tokens/typography.css` | Families, weights, type scale, tracking, line-height |
| `tokens/spacing.css` | Spacing, radius, shadows/glows, motion, z-index |
| `guidelines/*.html` | Foundation specimen cards (Colors / Type / Spacing / Brand) |
| `components/core/` | `Button`, `Badge`, `Card`, `Input`, `Chip`, `Tabs`, `Toast` |
| `components/travel/` | `BoardingPass`, `FlightCard`, `PartnerItem` |
| `ui_kits/booking_portal/` | Light flight-search portal (search → results → select) |
| `ui_kits/cockpit/` | Dark map journal with flight board + control-panel tabs |
| `assets/` | Logos, crane badge, favicon, route-network map, panorama silhouette |
| `SKILL.md` | Agent Skill manifest for Claude Code |

**Using a component** (inside an `@dsCard` / kit HTML): link `styles.css`, load `_ds_bundle.js` (auto-generated), then
`const { Button, FlightCard } = window.THYRouteDesignSystem_cb84b4;`

---

## Content Fundamentals

**Bilingual, Turkish-first.** The product ships TR + EN. Default copy is Turkish using the formal **siz** register ("Seyahat planınızı oluşturun", "biletinizi alın"). EN strings are kept fully uppercase where the UI uppercases, to dodge the Turkish dotted-İ casing bug.

**Aviation metaphor, everywhere.** The voice leans into the cockpit fantasy without irony: the side panel is the **COCKPIT CONTROL PANEL**, a collaborator is a **Yardımcı Pilot (co-pilot)**, the device-sync code is a **Pilot ID**, the header is a **Flight Board**, a domestic connection renders as a **Boarding Pass**. Lean into this language when writing new copy.

**Premium but practical.** Marketing lines are aspirational ("Avrupa'nın en iyisiyle keşfedin" / "Discover with the best"); functional copy is short, direct and imperative ("Uçuş ara", "Kaydet", "Haritada Bul", "Alarm Kur"). Helper/legal text is small and plain ("Alarm kurarak verilerinizin Gizlilik Politikası uyarınca işlenmesini kabul etmiş olursunuz").

**Casing & labels.** Eyebrows, status chips and form labels are UPPERCASE with wide tracking (`PLANLANIYOR`, `ARAÇ KİRALAMA`, `NEREDEN`). Buttons are Title-case or sentence-case with a trailing `→` on primary actions ("Uçuş ara →").

**Emoji are functional, not decorative.** A tight set is used as inline glyphs in the product: ✈️ (flight), 📍 (location), 🔔 (price alert), 🌐 (language), 🛡️ (privacy/KVKK), 🔗 (invite), 📧 (email), 🗑️ ✏️ 🔍 (map tools). Don't expand the set or use emoji as illustration — prefer the line-icon set for anything structural.

**Numbers carry meaning.** Mileage offers, prices (`6.480 TL`, Turkish thousands separator), IATA codes, gates and coordinates are real-feeling and specific. Never pad with decorative stats.

---

## Visual Foundations

**Two worlds, one brand.**
- *Booking Portal* — bright white cards floating on a **navy → French-blue → THY-red** diagonal hero gradient, over the dimmed Istanbul-hub route-network map. Crisp slate borders (`#E2E8F0`), blue radio/focus accents, a single square red CTA.
- *Cockpit / Map Journal* — deep navy `#0A1628` "Airy Premium" theme. Ultra-thin glass cards (`rgba(255,255,255,.045)`), gold hairline borders on hover, heavy ambient shadows, backdrop blur on every floating surface.

**The cardinal color rule:** on dark surfaces, *never pure `#000` or `#FFF`* — every value is a gradient or an opacity. Depth is built in layers: `#050B14` (map overlay) → `#0A1628` (bg) → `#0B1A33`/`#0F2244` (panel) → `rgba(255,255,255,.045)` (card) → `.075` (hover).

**Color.** THY Red `#B7312C` (Pantone 7620 C) is the brand anchor, with `#EF2E1F` for CTAs/alerts and `#8E211D` for press. French Blue `#0053A5`, gold `#C5A059` for premium/Miles&Smiles. Fare families have their own accents (EcoFly teal → BusinessPrime brown).

**Type.** Outfit drives UI and display (300–900); Montserrat 800 is reserved for the logotype and panel eyebrows (often with a gold gradient text-clip); Inter handles body; JetBrains Mono is the "instrument" face for flight codes, IATA, gates, coordinates and the board clock. Hero is 40px/900 with −1px tracking; labels are 9–10px/800 uppercase with 2px tracking.

**Geometry (THY Flow).** Radii: 4 (chips/inputs) · 8 (cards/buttons) · 12 (panels) · 22 (pill buttons) · 9999 (full). Spacing is a strict 4-8-16-24-32-48 scale.

**Backgrounds.** Full-bleed photographic route-network map (warm-cool desaturated navy on light) as the hero/map; a white semi-transparent landmark **panorama** silhouette as a decorative footer on dark panels. No noise, no mesh gradients, no AI-slop blobs — imagery is either the literal map or the crane.

**Borders, shadows & glows.** Borders are 1px and barely-there (`#223754` dark, `rgba(255,255,255,.085)` glass, `#E2E8F0` light). Three ambient shadow steps plus two signature **glows**: red `0 0 20px rgba(183,49,44,.2)` and gold `0 0 20px rgba(197,160,89,.2)`, used to halo active/hovered cards.

**Motion.** The house easing is **aerodynamic** `cubic-bezier(.16,1,.3,1)` (650ms) for panel/screen glides; 150/250/400ms `cubic-bezier(.4,0,.2,1)` for everyday transitions. Signature animations: a left→right **shimmer sweep** across every button on hover, a pulsing **status dot** + halo on live badges, the red→gold **border-glow** under the flight board, a plane **gliding** along boarding-pass and route lines, and `fadeInUp` for tab/timeline entrances. Respect `prefers-reduced-motion`.

**States.** Hover = lift (`translateY(-1/-4px)`) + brighten + glow + (on glass) gold border. Press = `scale(.96)`. Focus = gold border + soft gold glow on dark inputs, blue inset ring on light cells. Disabled = `#E4E4E4` bg / `#848484` text / 50% opacity, no pointer events.

**Cards.** Dark: thin glass, 8px radius, hairline border, hover lifts with red glow and a gold border tint. Light: solid white, 8px radius, slate border, soft drop shadow (`0 10px 30px rgba(0,0,0,.15)`).

---

## Iconography

- **Primary set:** outline **line icons** in the Lucide / Feather family — `viewBox="0 0 24 24"`, `stroke-width` 2–2.5, round caps/joins, `fill="none"`, `stroke="currentColor"`. They appear inline as SVG throughout panels, tabs, filters and buttons. Reuse these; if you need more, pull matching glyphs from **Lucide** (CDN) and keep the 2.5px round-cap weight. This is a substitution-friendly match to the codebase's hand-authored SVGs — flag it if exact parity matters.
- **Functional emoji:** the small set listed under Content Fundamentals (✈️ 📍 🔔 🌐 🛡️ 🔗 📧 🗑️ ✏️ 🔍). Used as quick affordances; not illustration.
- **Brand marks (in `assets/`):** `logo.png` (white THY Route wordmark + crane), `logo-dark.png` (full-color on light), `logo-badge.png` (the grey **crane in a red roundel** — app icon / board badge), `favicon.png`, `icon-192/512.png`, `thy-favicon.svg`. The crane ("the wild goose") is the airline's emblem — never recolor or redraw it; use the supplied PNGs.
- **Imagery (in `assets/`):** `AnaEkran.png` (flight route-network world map — hero & map backdrop), `panorama.png` (white landmark silhouette for dark footers), `splash.png` (loading screen).
- **No hand-rolled illustration.** Don't invent SVG scenes or generate images; compose from the supplied assets, the crane, the map and the line-icon set.

---

## Caveats / substitutions

- **Fonts** are loaded from **Google Fonts** (`@import` in `tokens/fonts.css`) — all four families (Outfit, Montserrat, Inter, JetBrains Mono) are genuine Google Fonts, so no local binaries are shipped. If you need offline/self-hosted builds, download the `.woff2` files and add `@font-face` rules.
- **Line icons** are recreated to match the codebase's stroke style rather than copied 1:1; Lucide is the recommended CDN source for additions.
- The **map** in the cockpit kit is a static dimmed route-network image standing in for the live Google Maps canvas.
