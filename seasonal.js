(() => {
  'use strict';
  function themeFor(date, zone) {
    const month = date.getMonth();
    const day = date.getDate();
    if (month === 11) return 'christmas';
    if (month === 2 && day === 1) return 'stdavid';
    if (month === 2 && day === 17) return 'stpatrick';
    if (month === 9 && day >= 25) return 'halloween';
    const seasons = /^(Pacific\/(Auckland|Chatham)|NZ(-CHAT)?)$/.test(zone)
      ? ['summer', 'autumn', 'winter', 'spring']
      : ['winter', 'spring', 'summer', 'autumn'];
    return seasons[Math.floor(((month + 1) % 12) / 3)];
  }

  let timer;
  function apply() {
    const now = new Date();
    const root = document.documentElement;
    root.dataset.season = themeFor(now, Intl.DateTimeFormat().resolvedOptions().timeZone);
    const paper = getComputedStyle(root).getPropertyValue('--paper').trim();
    if (paper) document.querySelector('meta[name="theme-color"]').content = paper;
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    clearTimeout(timer);
    timer = setTimeout(apply, midnight - now + 50);
  }
  apply();
  window.addEventListener('pageshow', apply);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) apply(); });
})();
