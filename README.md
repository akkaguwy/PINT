# PINT — Cardiff & Vale Edition (v3.0)

A mobile-friendly pub community built with plain HTML, CSS and JavaScript. The frontend stays on GitHub Pages, with a separately hosted database and photo service for shared submissions. No account or API key is needed to use PINT.

## What works

- Browse a curated suggestion directory of roughly 80 pubs across Cardiff and the Vale of Glamorgan.
- Choose from seven Pub Golf routes (Cardiff centre, match day, Pontcanna, Cardiff Bay, Cowbridge, Penarth or Barry) and keep a local scorecard with completed stops and optional challenge points.
- Filter by region or neighbourhood, search, favourite, and find places you haven't visited.
- Switch between a list and an OpenStreetMap neighbourhood-cluster view; map pins are approximate area centres, **not verified pub locations**.
- Tap **Near me** to sort pubs by approximate distance to their neighbourhood centres. Location is requested only when tapped, and not stored or sent to PINT servers.
- Open a shareable, dedicated pub details screen with community ratings, reviews, photos and a Google Maps venue search link.
- Add pubs for everyone and review each visit: overall 1–5 stars, Guinness quality, atmosphere, setting, optional pint price and notes. Add a display name when posting.
- Take or select up to three photos per review. Images are resized and uploaded with the shared review.
- Install it to an iPhone Home Screen as a standalone web app, with a custom PINT icon and cached core screens for offline use.
- Sort by community ratings or last logged prices.
- Open directions in Google Maps.
- Back up and restore your data in JSON.

**Shared data:** New reviews, their photos, and newly submitted pubs are stored in the PINT live-data service and become visible to other PINT users. The app refreshes approximately every 20 seconds while active. It must be online to post. Anyone who uses the public PINT link can submit or read this information, and display names are not verified identities. Public posts have no self-service editing or deletion yet. Basic per-IP submission limits and image limits are applied. Don't publish personal details or photos you wouldn't want publicly visible.

**Device-local data:** Favourites, Pub Golf scorecards, and reviews/photos saved *before v3.0* remain on the original device. Historical reviews are **not uploaded automatically** and are clearly labelled as not shared. JSON export/import continues to cover only device-local data. The export includes older private photos and scorecards, so keep a backup before clearing browser data. Seeded pubs have **no fabricated prices or ratings**. Venue images are illustrative and not necessarily photographs of each named venue. Pub suggestions and walking routes are not guarantees that a venue is open or serves Guinness.

Existing v1 local reviews in the same browser are retained, with their old /10 overall ratings converted to /5 for display.

## Install on iPhone

1. Open `https://akkaguwy.github.io/PINT/` in **Safari** (not an in-app browser).
2. Tap **Share** (sometimes under the Safari Page Menu).
3. Choose **Add to Home Screen**.
4. Enable **Open as Web App**, then tap **Add**.

The Home Screen icon launches PINT full-screen. Its local favourites and old private reviews may differ from Safari, but new shared reviews and pubs sync regardless. No account or App Store distribution is involved. For offline use, open PINT once while connected; shared data and new submissions need an internet connection.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Visit `http://localhost:8000`.

## Publish through GitHub Pages

1. Open your existing GitHub repository named `PINT`.
2. Push the app files (`index.html`, `styles.css`, `features.css`, `app.js`, `shared.js`, `photos.js`, `pub_golf.js`, `pwa.js`, `sw.js`, `manifest.webmanifest`, and `icons/`) at the repository root.
3. In the repository, go to **Settings → Pages → Build and deployment**.
4. Choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. GitHub will show the published URL once deployment finishes (usually `https://YOUR-USERNAME.github.io/PINT/`).

The GitHub Pages frontend and shared-data service are both public. The backend endpoint configured in `shared.js` is `https://pint-live-data-akka.akkaguwy.chatgpt.site`; it stores public reviews, submitted pubs and JPEG photos in Cloudflare D1/R2 through the Sites hosting service.

## Night recaps

### Inviting friends who already have PINT installed

Each night is shared by a link. Opening an invite in WhatsApp or Safari may save it only in that browser, not in the separate iPhone Home Screen web app. Friends can copy the invite, open their installed PINT app, choose **What happened last night? → Join night**, and paste it. PINT loads the shared album and saves the night under **My nights** on that device, so they can return without the link. This is a device-local shortcut, not an account-synchronised membership; opening an invite does not install the PINT app automatically. **Remove** beside a night removes that shortcut from My nights on the current device after confirmation. It does not erase the shared night, photos, videos or other members' access. Anyone with the original link can reopen the night. If the invite opens inside the installed app directly, it is saved there automatically.

Open **What happened last night?** on Home (or **Nights** on desktop), name your night and share its link. Contributors can take photos, record videos, choose existing media, or post a note. Each moment has a contributor name, optional venue and editable occurrence time before posting; timelines sort by that time across midnight. Photos are resized to JPEG; MP4/MOV/WebM videos are limited to 30 MB per moment. Playback depends on the device supporting the video's codec.

Nights and moments are stored in the existing shared D1/R2 service. Night links grant read and contribution access; keep them within the group. There is no public album directory, and no verified identity or post editing/deletion in this first version. The local recent-nights list is only a shortcut; keep the shared link to reopen a night on another device. Uploads require a connection; failed uploads remain in the open form for retry and are not an offline queue.

Regression check: `node tests/recaps.cjs`.

## Shared night recaps

Open Nights (or the home recap card), name a night and invite mates with its link. Take photos, record short videos or choose existing media. Each moment can include an optional note, place and editable time; note-only memories work too. Photos are resized before upload (20 MB source limit); videos support MP4, MOV and WebM up to 30 MB each. Uploads show progress and preserve the selected content on failure for retry. The timeline refreshes while open. Night links grant anyone holding them access to view and contribute; recent nights are remembered on the device, so keep the link.
