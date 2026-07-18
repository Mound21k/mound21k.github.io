# shamsipoor.dev — portfolio site

A single-page portfolio built with plain HTML, CSS, and JavaScript (no build step, no dependencies). Designed to look like an annotated source file — section headers are comments, facts are key/value pairs, skills are a JSON block — with a light/dark mode toggle.

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
