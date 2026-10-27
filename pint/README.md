# PINT — Cardiff Edition

A mobile-friendly, static pub journal built with plain HTML, CSS and JavaScript. Ready for GitHub Pages — no server, API keys or installation required.

## What works

- Search and filter a starter directory of six Cardiff pubs.
- Add your own pubs, save favourites and log drinks with price, date, rating and notes.
- Sort by your own ratings or last logged prices.
- Open directions in Google Maps.
- Back up and restore your data in JSON.

All personal data is held in the browser's `localStorage`. **It does not sync across devices**, and it is not available to other users. Seeded pubs have **no fabricated prices or ratings**. Venue images are illustrative and not necessarily photos of each named venue.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Visit `http://localhost:8000`.

## Publish through GitHub Pages

1. Create a new GitHub repository named `PINT`.
2. Upload the three app files (`index.html`, `styles.css`, `app.js`) and this README to the repository root.
3. In the repository, go to **Settings → Pages → Build and deployment**.
4. Choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. GitHub will show the published URL once deployment finishes (usually `https://YOUR-USERNAME.github.io/PINT/`).

The hosted source is public if the GitHub Pages repository is public. This first edition is a personal, browser-local prototype, not a shared price-reporting service.
