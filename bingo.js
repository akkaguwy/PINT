(() => {
  'use strict';

  // Keep the v1 challenge order fixed so existing links always deal the same card.
  const challenges = [
    'Spot a pub dog',
    'Find an old jukebox',
    'Take a group photo',
    'Find a local brewery beer mat',
    'Spot a pub cat',
    'Find a fireplace',
    'Find a menu with a pie on it',
    'Spot a dartboard',
    'Find a pub quiz poster',
    'Spot a crooked picture frame',
    'Find a clock with Roman numerals',
    'Find a pub sign with an animal',
    'Spot a photo of the pub from years ago',
    'Find a board game on a shelf',
    'Spot a table with a number on it',
    'Find a bell behind the bar',
    'Spot a stained-glass window',
    'Find a pub named after a person',
    'Hear a song the whole group knows',
    'Find a handwritten chalkboard',
    'Spot a mismatched chair',
    'Find a pump clip with a pun on it',
    'Spot a rugby shirt on display',
    'Find a map on the wall',
  ];
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  const valid = value => /^v1-[0-9a-f]{8}$/.test(value);
  const lastKey = 'pint-bingo:last-card';
  const marksKey = id => 'pint-bingo:marks:' + id;
  const $ = id => document.getElementById(id);
  const board = $('bingo-card');
  const progress = $('bingo-progress');
  const linkLabel = $('bingo-link-label');
  const linkInput = $('bingo-link');
  const shareStatus = $('bingo-share-status');
  let cardId;
  let marks = new Set();

  function read(key) {
    try { return localStorage.getItem(key) || ''; } catch { return ''; }
  }

  function save(key, value) {
    try { localStorage.setItem(key, value); } catch { /* The card still works for this session. */ }
  }

  function deal(id) {
    let seed = parseInt(id.slice(3), 16);
    const pool = [...challenges];
    return Array.from({ length: 9 }, () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const index = Math.floor((seed / 0x100000000) * pool.length);
      return pool.splice(index, 1)[0];
    });
  }

  function paintMarks() {
    const winners = lines.filter(line => line.every(index => marks.has(index)));
    const winningSquares = new Set(winners.flat());
    Array.from(board.children).forEach((square, index) => {
      const marked = marks.has(index);
      square.setAttribute('aria-pressed', String(marked));
      square.classList.toggle('is-winning', winningSquares.has(index));
      square.firstElementChild.textContent = marked ? '✓' : '';
    });
    progress.textContent = (winners.length ? 'Bingo! ' : '') + marks.size + ' of 9 squares marked';
  }

  function show(id) {
    const url = new URL(location.href);
    url.searchParams.set('screen', 'pub-bingo');
    url.searchParams.set('bingo', id);
    if (url.href !== location.href) history.replaceState(history.state, '', url);
    if (id === cardId) return;

    cardId = id;
    save(lastKey, id);
    marks = new Set([...read(marksKey(id))].filter(value => /^[0-8]$/.test(value)).map(Number));
    linkLabel.hidden = true;
    shareStatus.textContent = '';
    board.replaceChildren(...deal(id).map((challenge, index) => {
      const square = document.createElement('button');
      square.type = 'button';
      square.className = 'bingo-square';
      square.dataset.square = index;
      const mark = document.createElement('span');
      mark.className = 'bingo-mark';
      mark.setAttribute('aria-hidden', 'true');
      const text = document.createElement('span');
      text.textContent = challenge;
      square.append(mark, text);
      return square;
    }));
    paintMarks();
  }

  function newId() {
    return 'v1-' + crypto.getRandomValues(new Uint32Array(1))[0].toString(16).padStart(8, '0');
  }

  document.addEventListener('pint:screen-change', event => {
    if (event.detail.screen !== 'pub-bingo') return;
    const incoming = new URL(location.href).searchParams.get('bingo');
    const last = cardId || read(lastKey);
    show(valid(incoming) ? incoming : valid(last) ? last : newId());
  });

  board.addEventListener('click', event => {
    const square = event.target.closest('[data-square]');
    if (!square) return;
    const index = Number(square.dataset.square);
    if (!marks.delete(index)) marks.add(index);
    save(marksKey(cardId), [...marks].join(''));
    paintMarks();
  });

  $('bingo-new').addEventListener('click', () => {
    if (!marks.size || confirm('Start a new card? You can reopen this one from its shared link.')) show(newId());
  });

  $('bingo-share').addEventListener('click', async () => {
    const sharedCard = cardId;
    const url = new URL(location.pathname, location.origin);
    url.search = new URLSearchParams({ screen: 'pub-bingo', bingo: sharedCard });
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Play Pub Bingo on PINT', url: url.href });
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url.href);
      if (cardId === sharedCard) shareStatus.textContent = 'Card link copied.';
    } catch {
      if (cardId !== sharedCard) return;
      linkInput.value = url.href;
      linkLabel.hidden = false;
      linkInput.select();
      shareStatus.textContent = 'Copy this link to share your card.';
    }
  });
})();
