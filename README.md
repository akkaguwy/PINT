# PINT — Cardiff & Vale Edition (v2)

A mobile-friendly, static pub journal built with plain HTML, CSS and JavaScript. Ready for GitHub Pages — no server, API keys or installation required.

## What works

- Browse a curated suggestion directory of roughly 80 pubs across Cardiff and the Vale of Glamorgan.
- Filter by region or neighbourhood, search, favourite, and find places you haven't visited.
- Add pubs of your own and review each visit: overall 1–5 stars, Guinness quality, atmosphere, setting, optional pint price and notes.
- Sort by your own ratings or last logged prices.
- Open directions in Google Maps.
- Back up and restore your data in JSON.

All personal data is held in the browser's `localStorage`. **It does not sync across devices**, and it is not available to other users. Seeded pubs have **no fabricated prices or ratings**. Venue images are illustrative and not necessarily photos of each named venue. Directory suggestions are not guarantees that a venue is open or serves Guinness; check before travelling. The curated list is a starting point, not a comprehensive live business database.

Existing v1 local reviews in the same browser are retained, with their old /10 overall ratings converted to /5 for display.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Visit `http://localhost:8000`.

## Publish through GitHub Pages

1. Open your existing GitHub repository named `PINT`.
2. Replace the three app files (`index.html`, `styles.css`, `app.js`) at the repository root with these versions; update this README too if you like.
3. In the repository, go to **Settings → Pages → Build and deployment**.
4. Choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. GitHub will show the published URL once deployment finishes (usually `https://YOUR-USERNAME.github.io/PINT/`).

The hosted source is public if the GitHub Pages repository is public. This first edition is a personal, browser-local prototype, not a shared price-reporting service.
