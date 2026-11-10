(() => {
  'use strict';

  const key = 'pint-darts:match-v1';
  const $ = id => document.getElementById(id);
  const setup = $('darts-setup');
  const match = $('darts-match');
  const visit = $('darts-visit');
  const score = visit.elements.score;
  const finishDouble = visit.elements.double;
  const cancel = $('darts-cancel');
  const undo = $('darts-undo');
  const rematch = $('darts-rematch');
  const checkout = $('darts-checkout');
  const doubleLabel = $('darts-double-label');
  const validScore = value => Number.isInteger(value) && value >= 0 && value <= 180;

  function readMatch() {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if ([301, 501].includes(saved?.start) && ['double', 'straight'].includes(saved.finish) &&
          Array.isArray(saved.players) && saved.players.length >= 1 && saved.players.length <= 4 &&
          saved.players.every(name => typeof name === 'string' && name.length >= 1 && name.length <= 20) &&
          Array.isArray(saved.visits) && saved.visits.every(item => validScore(item?.score) && typeof item.double === 'boolean')) {
        return saved;
      }
    } catch { /* A fresh setup is still available. */ }
    return null;
  }

  let game = readMatch();
  let state;
  let editing = !game;

  function save() {
    try { localStorage.setItem(key, JSON.stringify(game)); }
    catch { $('darts-storage-note').textContent = 'Your scorecard can only stay open in this tab.'; }
  }

  function replay({ start, finish, players, visits }) {
    const remaining = players.map(() => start);
    const history = [];
    let active = 0;
    let winner = null;
    for (const turn of visits) {
      const next = remaining[active] - turn.score;
      const bust = next < 0 || (finish === 'double' && (next === 1 || (next === 0 && !turn.double)));
      if (!bust) remaining[active] = next;
      history.push({ player: active, score: turn.score, bust, remaining: remaining[active] });
      if (!bust && next === 0) {
        winner = active;
        break;
      }
      active = (active + 1) % players.length;
    }
    return { remaining, history, active, winner };
  }

  const doubles = [20, 16, 18, 12, 10, 8, 4, 2, 1, 19, 17, 15, 14, 13, 11, 9, 7, 6, 5, 3, 25]
    .map(number => ({ points: number * 2, label: number === 25 ? 'Bull' : 'D' + number }));
  const numbers = Array.from({ length: 20 }, (_, index) => 20 - index);
  const scoringDarts = [
    ...numbers.map(number => ({ points: number * 3, label: 'T' + number })),
    ...numbers.map(number => ({ points: number, label: 'S' + number })),
    { points: 25, label: '25' },
    ...doubles,
  ];
  const doubleByPoints = new Map(doubles.map(dart => [dart.points, dart.label]));

  function checkoutRoute(total) {
    if (total < 2 || total > 170) return '';
    const direct = doubleByPoints.get(total);
    if (direct) return direct;
    for (const last of doubles) {
      const first = scoringDarts.find(dart => dart.points === total - last.points);
      if (first) return first.label + ' → ' + last.label;
    }
    for (const first of scoringDarts) {
      for (const second of scoringDarts) {
        const last = doubleByPoints.get(total - first.points - second.points);
        if (last) return first.label + ' → ' + second.label + ' → ' + last;
      }
    }
    return '';
  }

  function showNames() {
    const count = Number(setup.elements.count.value);
    for (let i = 1; i <= 4; i++) {
      setup.elements['player' + i].closest('label').hidden = i > count;
    }
  }

  function showFinishPrompt() {
    const entered = score.valueAsNumber;
    const needsDouble = game?.finish === 'double' && entered === state?.remaining[state.active];
    doubleLabel.hidden = !needsDouble;
    finishDouble.disabled = !needsDouble;
    finishDouble.required = needsDouble;
    if (!needsDouble) finishDouble.value = '';
  }

  function render() {
    setup.hidden = !editing;
    match.hidden = editing;
    cancel.hidden = !game;
    if (editing) return;

    state = replay(game);
    const { remaining, history, active, winner } = state;
    $('darts-rules').textContent = game.start + ' · ' + (game.finish === 'double' ? 'Double out' : 'Straight out');
    $('darts-scores').replaceChildren(...game.players.map((name, index) => {
      const row = document.createElement('li');
      if (index === active) row.dataset.active = '';
      const label = document.createElement('span');
      label.className = 'darts-player-name';
      label.textContent = name;
      const points = document.createElement('strong');
      points.textContent = remaining[index];

      const turns = history.filter(turn => turn.player === index);
      const average = turns.length ? ((game.start - remaining[index]) / turns.length).toFixed(1) : '—';
      const stats = document.createElement('small');
      stats.textContent = 'Visit avg ' + average;
      row.append(label, points, stats);
      return row;
    }));

    const last = history.at(-1);
    const bust = last?.bust ? game.players[last.player] + ' busts. ' : '';
    $('darts-turn').textContent = winner === null
      ? bust + game.players[active] + ' to throw.'
      : game.players[winner] + ' wins!';
    visit.hidden = winner !== null;
    rematch.hidden = winner === null;
    const route = game.finish === 'double' && winner === null ? checkoutRoute(remaining[active]) : '';
    checkout.hidden = !route;
    $('darts-route').textContent = route || '';
    visit.reset();
    showFinishPrompt();
    undo.disabled = history.length === 0;
    const recent = $('darts-history');
    recent.start = history.length;
    recent.replaceChildren(...history.slice(-8).reverse().map(turn => {
      const row = document.createElement('li');
      row.textContent = game.players[turn.player] + ' · ' + turn.score +
        (turn.bust ? ' · Bust · ' : ' · ') + turn.remaining + ' left';
      return row;
    }));
  }

  setup.elements.count.addEventListener('change', showNames);
  setup.addEventListener('submit', event => {
    event.preventDefault();
    const count = Number(setup.elements.count.value);
    game = {
      start: Number(setup.elements.start.value),
      finish: setup.elements.finish.value,
      players: Array.from({ length: count }, (_, index) => {
        const field = 'player' + (index + 1);
        return setup.elements[field].value.trim() || 'Player ' + (index + 1);
      }),
      visits: [],
    };
    save();
    editing = false;
    render();
    score.focus();
  });

  $('darts-new').addEventListener('click', () => {
    setup.elements.start.value = game.start;
    setup.elements.finish.value = game.finish;
    setup.elements.count.value = game.players.length;
    for (let i = 1; i <= 4; i++) setup.elements['player' + i].value = game.players[i - 1] || '';
    editing = true;
    showNames();
    render();
    setup.elements.start.focus();
  });

  cancel.addEventListener('click', () => {
    editing = false;
    render();
    $('darts-new').focus();
  });

  $('darts-keypad').addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const { total, digit, key: action } = button.dataset;
    if (total !== undefined) score.value = total;
    else if (action === 'clear') score.value = '';
    else if (action === 'delete') score.value = score.value.slice(0, -1);
    else if (digit !== undefined && score.value.length < 3) score.value = String(Number(score.value + digit));
    showFinishPrompt();
  });

  rematch.addEventListener('click', () => {
    game.visits = [];
    save();
    render();
    score.focus();
  });

  score.addEventListener('input', showFinishPrompt);
  visit.addEventListener('submit', event => {
    event.preventDefault();
    const points = score.valueAsNumber;
    if (!validScore(points) || state.winner !== null) return;
    if (!finishDouble.disabled && !finishDouble.value) {
      finishDouble.reportValidity();
      return;
    }
    game.visits.push({ score: points, double: finishDouble.value === 'yes' });
    save();
    render();
    if (state.winner === null) score.focus();
    else rematch.focus();
  });

  undo.addEventListener('click', () => {
    if (!game.visits.length) return;
    game.visits.pop();
    save();
    render();
    score.focus();
  });

  showNames();
  render();
})();
