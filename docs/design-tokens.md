# Design Tokens — Gagan Mobile Care

> Source of truth extracted from `reference/styles.css`.
> When initializing Next.js, port these to `theme.extend` in `tailwind.config.ts`.

---

## Colors

### Background
| Token | Hex | Role |
|---|---|---|
| `bg` | `#FFFFFF` | Page background (dominant — 60% of surface area) |
| `bg-card` | `#FFFFFF` | Card surface (same as bg; border distinguishes it) |
| `bg-soft` | `#F5F5F5` | Subtle fills — table headers, input backgrounds, empty states |

### Text (ink scale)
| Token | Hex | Role |
|---|---|---|
| `ink` | `#0A0A0A` | Primary text, dark buttons, headings |
| `ink-2` | `#1A1A1A` | Secondary body text |
| `ink-3` | `#6B6B6B` | Muted text — labels, captions, placeholders |
| `ink-4` | `#A8A8A8` | Disabled, faint placeholders |

### Accent — LOCKED
| Token | Hex | Role |
|---|---|---|
| `accent` | `#E63329` | CTAs, urgent badges, booking buttons, status dot |
| `accent-soft` | `#FDE3E1` | Accent backgrounds — pill badges, highlights |

> Red `#E63329` is locked to Gagan's existing shop signage. Do not change without explicit instruction.

### Status
| Token | Hex | Role |
|---|---|---|
| `success` | `#22A06B` | "Open" dot, ready-for-pickup status, green success states |
| `info` | `#0A66C2` | "Called" booking status |
| `warning` | — | Not used in prototype; reserve for future use |

### Brand / third-party
| Token | Hex | Role |
|---|---|---|
| `whatsapp` | `#25D366` | WhatsApp button background only — do not use for anything else |

### Border / divider
| Token | Hex | Role |
|---|---|---|
| `line` | `#E5E5E5` | All borders, card outlines, table dividers, hairlines |

### Dark surfaces (used inline in prototype, not in `:root`)
| Value | Role |
|---|---|
| `#0A0A0A` (= `ink`) | Dark cards (PostFlow, Footer, mobile menu) — use `bg-ink` alias in Tailwind |
| `#0E0E10` | Slightly cooler near-black in some brand glyphs — one-off, no token needed |

---

## Typography

### Font families

| Role | Family | Google Fonts URL |
|---|---|---|
| Body / UI | Inter | `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap` |
| Display / headings | Instrument Serif (italic variant used) | `https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap` |
| Prices / IDs / code | JetBrains Mono | `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap` |

Combined import (use this single URL in `layout.tsx`):
```
https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap
```

Font feature settings on body: `"ss01", "cv11"` — enables Inter's stylistic alternates (cleaner `a`, `g`). Apply via `fontFeatureSettings` in Tailwind config or global CSS.

### Type scale

| Name | Mobile | Desktop | Font | Usage |
|---|---|---|---|---|
| `hero` | 44px / lh 1.0 | 68px / lh 1.0 | Instrument Serif | Hero H1 only |
| `display` | 32px / lh 1.05 | 56px / lh 1.0 | Instrument Serif | Section hero headings |
| `section` | 28px / lh 1.05 | 48px / lh 1.02 | Instrument Serif | Section titles (H2) |
| `h3` | 28px / lh 1.05 | 32px / lh 1.05 | Instrument Serif | Card titles, sub-section headings |
| `body` | 14px / lh 1.5 | 15px / lh 1.5 | Inter | Default body text |
| `small` | 13px | 13px | Inter | Secondary body, card descriptions |
| `label` | 12px | 12px | Inter | Form labels, metadata, card subtitles |
| `micro` | 11px / lh 1.0 | 11px / lh 1.0 | Inter | Uppercase labels — `letter-spacing: 0.14em`, `text-transform: uppercase`, `font-weight: 500` |
| `mono` | 12–13px | 12–13px | JetBrains Mono | Prices, booking IDs, phone numbers, code |

### Font weights in use
`300` (light — rare), `400` (regular), `500` (medium), `600` (semibold), `700` (bold), `800` (extrabold — hero stats)

---

## Spacing

Base unit: `4px` (Tailwind default — matches the prototype's visual rhythm).

| Name | Value | Tailwind key | Typical use |
|---|---|---|---|
| `xs` | 4px | `1` | Icon gaps, tight internal padding |
| `sm` | 8px | `2` | Button icon gaps, small internal gaps |
| `md` | 12px | `3` | Card inner padding (compact), grid gaps |
| `lg` | 16px | `4` | Standard card padding, section inner gaps |
| `xl` | 24px | `6` | Section padding mobile, between-section gaps |
| `2xl` | 32px | `8` | Section padding tablet, large card padding |
| `3xl` | 40px–48px | `10`–`12` | Section padding desktop, hero inner padding |

Section padding rule:
- Mobile: `24px 16px` (y: `xl`, x: `lg`)
- Desktop: `40px 36px` (y: `3xl`, x: `9`)

---

## Radii

| Name | Value | Tailwind key | Used on |
|---|---|---|---|
| `sm` | 6px | `md` | Keyboard hints, small badges |
| `md` | 8px–10px | `lg` | Inputs, small UI chips |
| `lg` | 12px–14px | `xl` | Brand tiles, issue cards in booking flow |
| `card` | 16px | `2xl` | Standard cards (`.card` class) |
| `hero` | 20px mobile / 28px desktop | `3xl` / `4xl` | Hero card, large feature cards |
| `pill` | 999px | `full` | All buttons, filter tabs, status badges |

---

## Shadows

| Name | Value | Used on |
|---|---|---|
| `float` | `0 1px 2px rgba(20,20,30,.04), 0 12px 32px -12px rgba(20,20,30,.10)` | Floating cards in hero, modals |
| `soft` | `0 1px 2px rgba(20,20,30,.04), 0 6px 18px -8px rgba(20,20,30,.08)` | Standard elevated cards, estimate summary |
| `cta` | `0 12px 28px -10px rgba(0,0,0,.35)` | Sticky mobile CTA bar only |

---

## Notes

- All three font families must be loaded via `next/font/google` in `app/layout.tsx` — not via a `<link>` tag. Use `display: 'swap'`.
- The `--good` token in the prototype reuses `#0A0A0A` (ink). It is not a green success colour. The green used for success states is `#22A06B`, added as `success` above.
- The map background pattern (CSS `background-image` grid lines) is a visual-only decoration. Do not implement as a Tailwind token — apply it as a custom CSS class `map-bg` in `globals.css`.
- `font-feature-settings: "ss01", "cv11"` should be set on `<body>` in global CSS. Tailwind does not have a built-in for this.
- Admin dashboard uses additional semantic tokens (`--line-2`, `--info-soft`, `--violet-soft`, `--violet`, `--accent-deep`, `--info`, `--bg-ink-5`) referenced in `admin-styles.css` which has not yet been audited. Extend this file after reading that stylesheet.
