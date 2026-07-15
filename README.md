# Alphe

Marketing site for **Alphe.AI** — the inevitable AI infrastructure. Single-page
static site, no framework, no build step. All copy sourced from
[alphe.in](https://alphe.in).

## Run

```sh
open index.html
# or
python3 -m http.server 8000
```

## Files

```
index.html            single-page site
assets/css/style.css  design system + all animation keyframes
assets/js/main.js     interaction engine (vanilla, zero deps)
```

## Design system

- **Dark-first** (`#0f0f0f`) with light contrast sections (`#f6f6f6`)
- **Sharp corners** (2px radius) and 1px hairline borders everywhere
- **Page frame**: vertical border rails running the full page height
- **Mono micro-labels**: JetBrains Mono, uppercase, letter-spaced, 9–12px
- **Serif-italic emphasis** words inside sans headlines (Instrument Serif)
- **Hard offset shadows** `4px 4px 0` on floating cards
- **Square badge chips** with live pulse dots

Fonts (all free, via Google Fonts): Inter, Instrument Serif, JetBrains Mono.

## Effects inventory

| Effect | Where |
|---|---|
| Preloader with boot counter + curtain lift | page load |
| Staggered boot-in of hero elements | after preloader |
| Rotating headline word (slide-flip) | hero |
| Cursor-following glow + masked grid background | hero |
| Animated scroll cue line | hero |
| Grayscale logo marquee | trusted-by strip |
| System diagram: 6 floating agent cards, dashed SVG flow lines, live request log with counter | Alphe.AI Core |
| Red-accent hover rows + glitch-shake stats | problems |
| Auto-cycling tab machine with progress segments (pauses off-screen, click to override) | solutions |
| Count-up stats on scroll | stats band |
| Floating hard-shadow model chips | smart routing card |
| Cursor spotlight on feature cells | feature board |
| Dual-direction model chip marquees | 300+ models |
| Live security monitor log + exclusive accordion | security |
| Sidebar-selector team panels | team |
| Scroll reveal with stagger, smooth anchors, custom scrollbar | global |
| `prefers-reduced-motion` disables all of the above | global |

## Page flow

Fixed header with dropdowns → full-viewport hero → logo marquee → system diagram
→ problems (bordered rows) → auto-cycling solutions tabs → stats band → light
"what we're building" (routing card + dark feature board + model marquees) →
security (terminal + accordion) → team selector → CTA → footer with giant
outline watermark.
