/* Shared PINT community data. This URL hosts only the database and photo API;
   the PINT app itself continues to live on GitHub Pages. */
(() => {
  'use strict';
  const API = 'https://pint-live-data-akka.akkaguwy.chatgpt.site';
  async function call(path, payload) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 18000);
    try {
      const response = await fetch(API + path, {
        method: payload === undefined ? 'GET' : 'POST',
        headers: payload === undefined ? {} : { 'Content-Type': 'application/json' },
        body: payload === undefined ? undefined : JSON.stringify(payload),
        signal: controller.signal,
        cache: 'no-store',
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw Error(result.error || 'Shared PINT request failed (' + response.status + ')');
      return result;
    } finally { clearTimeout(timeout); }
  }
  window.PintShared = {
    photoUrls(review) {
      return Array.from({ length: Math.min(3, Number(review.photoCount) || 0) },
        (_, i) => API + '/api/photos/' + encodeURIComponent(review.id) + '/' + i);
    },
    load: () => call('/api/state'),
    addReview: review => call('/api/reviews', review),
    addPub: pub => call('/api/pubs', pub),
    customRound: id => call('/api/custom-golf?id=' + encodeURIComponent(id)),
    publishCustomRound: payload => call('/api/custom-golf', payload),
    golfRound: id => call('/api/golf?round=' + encodeURIComponent(id)),
    golfWrite: payload => call('/api/golf', payload),
  };
})();
