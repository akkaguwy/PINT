/* PINT updates: detect newer deployments even in a Home Screen web app. */
(() => {
  'use strict';

  const script = document.querySelector('script[src*="app.js?v="]');
  const localVersion = new URL(script?.src || location.href).searchParams.get('v') || '0';
  const notice = document.getElementById('pint-update-notice');
  const updateButton = document.getElementById('pint-update-now');
  const dismissButton = document.getElementById('pint-update-later');
  const message = document.getElementById('pint-update-message');
  let latestVersion = null;
  let dismissed = false;
  let lastCheck = 0;
  let pendingCheck = null;

  function isNewer(version, current) {
    const a = version.split('.').map(Number);
    const b = current.split('.').map(Number);
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const left = a[i] || 0, right = b[i] || 0;
      if (left !== right) return left > right;
    }
    return false;
  }

  function showUpdate(version) {
    if (!notice || dismissed || !isNewer(version, localVersion)) return;
    latestVersion = version;
    if (message) message.textContent = 'PINT v' + version + ' is ready. Refresh to see the latest features.';
    notice.hidden = false;
  }

  async function checkLatest(force = false) {
    if (!navigator.onLine) return;
    if (!force && Date.now() - lastCheck < 120000) return;
    if (pendingCheck) return pendingCheck;
    lastCheck = Date.now();
    pendingCheck = (async () => {
      try {
        // A unique query parameter bypasses any old installed HTML or asset URL.
        const url = new URL('./sw.js', document.baseURI);
        url.searchParams.set('pint_check', String(Date.now()));
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return;
        const text = await res.text();
        const found = text.match(/CACHE_NAME\s*=\s*['"]pint-offline-v(\d+(?:\.\d+)*)['"]/);
        if (found) showUpdate(found[1]);
      } catch (_) {
        // Offline and intermittent mobile connections should not interrupt PINT.
      } finally {
        pendingCheck = null;
      }
    })();
    return pendingCheck;
  }

  async function refreshToLatest() {
    if (!latestVersion) return;
    updateButton.disabled = true;
    if (message) message.textContent = 'Opening the latest PINT…';
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration('./');
        if (registration) await registration.update().catch(() => {});
      }
    } finally {
      // Keep destination and screen. Force a fresh HTML request without losing local data.
      const url = new URL(location.href);
      url.searchParams.set('v', latestVersion);
      url.searchParams.set('updated', Date.now().toString(36));
      location.replace(url.href);
    }
  }

  updateButton?.addEventListener('click', refreshToLatest);
  dismissButton?.addEventListener('click', () => {
    dismissed = true;
    if (notice) notice.hidden = true;
  });

  window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js', {
        scope: './',
        updateViaCache: 'none'
      }).then(reg => reg.update()).catch(err => {
        console.info('Offline support unavailable:', err.message);
      });
    }
    // Check again after initial startup to account for browser and SW activation delays.
    checkLatest(true);
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) checkLatest(true);
  });
  window.addEventListener('pageshow', () => checkLatest(true));
  window.addEventListener('online', () => checkLatest(true));
  window.setInterval(() => {
    if (!document.hidden) checkLatest();
  }, 300000);
})();
