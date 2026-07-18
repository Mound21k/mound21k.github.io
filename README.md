# shamsipoor.dev — portfolio site

A single-page portfolio built with plain HTML, CSS, and JavaScript (no build step, no dependencies). "Flight Deck" concept: the page reads as a spacecraft's onboard mission computer. A trajectory rail on the left tracks your scroll position with a moving ship marker; the hero is a boot-sequence console; light mode is sky blue &amp; white (daytime launch), dark mode is black &amp; violet (deep space). Toggling themes triggers a short warp-flash transition.

## Files
- `index.html` — all content and structure
- `style.css` — design system (colors, type, layout) for both themes
- `script.js` — theme toggle, mobile nav, scroll-spy, terminal typing animation
- `assets/MohammadHosein_Shamsipoor_CV.pdf` — downloadable CV (compiled from `cv.tex`)

## Editing content
All text lives directly in `index.html` inside labeled `<section>` blocks (`#about`, `#education`, `#research`, `#projects`, `#industry`, `#teaching`, `#skills`, `#coursework`, `#contact`). Edit the text there — no templating engine, so changes are just plain HTML edits.

## Editing colors
Both themes are defined as CSS custom properties at the top of `style.css`, under `[data-theme="dark"]` and `[data-theme="light"]`. Change a variable there and it updates everywhere it's used.

## Local preview
Open `index.html` directly in a browser, or run a tiny local server from this folder:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.
