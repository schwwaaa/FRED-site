# FRED website

The landing page for FRED (Fast Response Effects Deck). Plain HTML, CSS and JS, no build step. This folder is meant to be its own repo, published with GitHub Pages from the repo root (Settings → Pages → Deploy from a branch → `main` / `(root)`).

```
index.html            the page
css/site.css          styles (the app's Geocities '99 theme)
js/site.js            alpha sign-up form -> Google Form (setup steps at the top of the file)
img/                  screenshots and icons (generated, see below)
onepager/             copy of the one-pager (generated)
FRED-one-pager.pdf    copy of the one-pager PDF (generated)
```

## Do not edit by hand

`onepager/`, `FRED-one-pager.pdf` and `img/{board,editor,mixer,fx}.webp` are copies. They are rebuilt from the app repo, so a manual edit here is overwritten. In the app repo, edit `docs/onepager/onepager.html` (or its screenshots) and run:

```sh
npm run onepager
```

That prints the PDF, then copies everything into this folder. Commit and push this folder afterwards to update the site. `npm run onepager -- --sync` skips the PDF and only copies.

## Preview locally

```sh
python3 -m http.server 8000
```

then open http://localhost:8000.
