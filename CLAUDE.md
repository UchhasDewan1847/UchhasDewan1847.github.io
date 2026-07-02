# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio for Uchhas Dewan, hosted on GitHub Pages at `https://uchhasdewan1847.github.io`. Static site — no build step, no package manager. Every push to `main` auto-deploys via GitHub Actions.

## Local Development

Serve with VS Code's **Live Server** extension on port 5500 (the `.vscode/launch.json` is wired to `localhost:5500`). Alternatively:

```bash
python3 -m http.server 5500
```

Then open `http://localhost:5500` in a browser.

## Git Remote

Uses **HTTPS** (not SSH):

```bash
git remote set-url origin https://github.com/UchhasDewan1847/UchhasDewan1847.github.io.git
```

Push with `git push origin main`. If credentials aren't cached, run `git push` in macOS Terminal.app (not VS Code terminal) to get the credential prompt.

## Architecture

One shared stylesheet (`css/styles.css`) and one shared script (`js/scripts.js`) used by all pages. No framework, no bundler.

**Pages:**
- `index.html` — main portfolio (hero, about, projects teaser, experience, skills, education, tests, publications, cert teaser)
- `certificates.html` — dedicated certificates page with filter tabs
- `projects.html` — dedicated projects page with filter tabs

**`js/scripts.js` sections (order matters — each guarded for the page it applies to):**
1. Dark mode toggle (localStorage, applies to all pages)
2. Typing effect — guarded with `if (typedEl)` since `#typed-text` only exists on `index.html`
3. Scroll reveal — `IntersectionObserver` on `.reveal` elements, adds `.visible` class
4. Certificate filters — `if (filterBtns.length)`, toggles `.hidden` on `.cert-card-v2`
5. Project filters — `if (projFilterBtns.length)`, toggles `.hidden` on `.proj-card`
6. Stat counters — `if (statNumbers.length)`, animates `.stat-number[data-target]` on scroll
7. Active nav highlight — `IntersectionObserver` on `section[id]`, only meaningful on `index.html`

**Key CSS patterns:**
- Theme variables on `:root` and `[data-theme="dark"]` — all colors go through variables, never hardcoded
- `.reveal` starts `opacity:0; transform:translateY(28px)` — JS adds `.visible` to animate in. If JS fails, content stays invisible, so always test JS before pushing
- `.cert-card-v2` used for both Coursera and extracurricular certs; extracurriculars additionally get `.cert-img-card`
- Hero (`<header class="hero-header">`) sits **outside** `.content-wrap` so it spans full viewport width

## External CDNs

All loaded in `<head>` of each page that needs them:

```html
<!-- Fonts -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />
<!-- Icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
<!-- Tech logos (index.html only) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/devicon@2.16.0/devicon.min.css" />
```

`certificates.html` and `projects.html` do **not** include devicon (not needed there).

## Resources Layout

```
resources/
  CV/Updated_CV.pdf                          — downloadable CV (linked from hero)
  propicJun26.jpeg                           — hero cover photo (referenced in CSS, not HTML)
  certificates/
    Coursera_pics/*.jpg                      — certificate screenshots (case-sensitive: capital C)
    extraCurricular/*.jpeg                   — extracurricular cert photos
```

Filenames with special characters (`(`, `,`) must be URL-encoded in HTML `src`/`href` attributes:
- `(` → `%28`, `)` → `%29`, `,` → `%2C`

## Owner Info

- **Name:** Uchhas Dewan
- **Email:** uchhasdewan47@gmail.com
- **Current role:** Software Engineer at SuffixIt Ltd (Jan 2025–Present)
- **CV:** `resources/CV/Updated_CV.pdf`
