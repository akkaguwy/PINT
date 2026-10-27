# PINT — Cardiff & Vale Edition (v2.4)

A mobile-friendly, static pub journal built with plain HTML, CSS and JavaScript. Ready for GitHub Pages — no server, API keys or installation required.

## What works

- Browse a curated suggestion directory of roughly 80 pubs across Cardiff and the Vale of Glamorgan.
- Choose from seven Pub Golf routes (Cardiff centre, match day, Pontcanna, Cardiff Bay, Cowbridge, Penarth or Barry) and keep a local scorecard with completed stops and optional challenge points.
- Filter by region or neighbourhood, search, favourite, and find places you haven't visited.
- Switch between a list and an OpenStreetMap neighbourhood-cluster view; map pins are approximate area centres, **not verified pub locations**.
- Tap **Near me** to sort pubs by approximate distance to their neighbourhood centres. Location is requested only when tapped, and not stored or sent to PINT servers.
- Open a shareable, dedicated pub details screen with your personal ratings, prior reviews and photos, and a Google Maps venue search link.
- Add pubs of your own and review each visit: overall 1–5 stars, Guinness quality, atmosphere, setting, optional pint price and notes.
- Take or select up to three photos per review on a phone or desktop. Images are resized and stored privately in browser IndexedDB.
- Install it to an iPhone Home Screen as a standalone web app, with a custom PINT icon and cached core screens for offline use.
- Sort by your own ratings or last logged prices.
- Open directions in Google Maps.
- Back up and restore your data in JSON.

Reviews, favourites and scorecards are held in browser `localStorage`; photos are held in IndexedDB. **Nothing syncs across devices**, and the app has no public review sharing yet. The JSON export includes photos and scorecards, so keep a backup before clearing browser data or switching devices. Seeded pubs have **no fabricated prices or ratings**. Venue images are illustrative and not necessarily photos of each named venue. Directory suggestions and walking routes are not guarantees that a venue is open or serves Guinness; check before travelling. The curated list is a starting point, not a comprehensive live business database.

Existing v1 local reviews in the same browser are retained, with their old /10 overall ratings converted to /5 for display.

## Install on iPhone

1. Open `https://akkaguwy.github.io/PINT/` in **Safari** (not an in-app browser).
2. Tap **Share** (sometimes under the Safari Page Menu).
3. Choose **Add to Home Screen**.
4. Enable **Open as Web App**, then tap **Add**.

The Home Screen icon launches PINT full-screen. Its on-device storage may be separate from regular Safari, so reviews already entered in Safari might not appear in the installed app. Export a PINT backup before switching and restore it in the installed version if needed. No account or App Store distribution is involved. For offline use, open PINT once while connected. External map links and illustrative photos require a connection.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Visit `http://localhost:8000`.

## Publish through GitHub Pages

1. Open your existing GitHub repository named `PINT`.
2. Push the app files (`index.html`, `styles.css`, `features.css`, `app.js`, `photos.js`, `pub_golf.js`, `pwa.js`, `sw.js`, `manifest.webmanifest`, and `icons/`) at the repository root.
3. In the repository, go to **Settings → Pages → Build and deployment**.
4. Choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. GitHub will show the published URL once deployment finishes (usually `https://YOUR-USERNAME.github.io/PINT/`).

The hosted source is public if the GitHub Pages repository is public. This first edition is a personal, browser-local prototype, not a shared price-reporting service.
