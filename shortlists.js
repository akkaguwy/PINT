(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const dialog = byId('shortlist-dialog');
  const form = byId('shortlist-form');
  const options = byId('shortlist-options');
  const search = byId('shortlist-search');
  const picks = byId('shortlist-picks');
  const status = byId('shortlist-status');
  const results = byId('shortlist-results');
  const retry = byId('shortlist-retry');
  const voteRows = byId('shortlist-votes');
  const addButton = byId('shortlist-add');
  const submit = form.querySelector('[type="submit"]');
  const selected = new Map();
  const params = new URL(location.href).searchParams;
  const recentButton = byId('recent-shortlist');
  const recentKey = 'pint-shortlist-recent';
  const storageKey = 'pint-shortlist-voter';
  let listId = params.get('poll');
  let draftId;
  let busy = false;
  let requestNumber = 0;

  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  let voter = read(storageKey);
  const voteKey = id => 'pint-shortlist-vote-' + id;
  let chosen = listId && read(voteKey(listId));
  const appLink = () => new URL(location.pathname, location.origin);
  const pollLink = () => {
    const url = appLink();
    url.searchParams.set('screen', 'explore');
    url.searchParams.set('poll', listId);
    return url.href;
  };

  function updateMatches() {
    const query = search.value.trim().toLowerCase();
    const region = byId('region-filter').value;
    const matches = (window.PintDirectory?.pubs() || []).filter(pub => !selected.has(pub.id) &&
      (query ? (pub.name + ' ' + pub.area).toLowerCase().includes(query) : pub.region === region));
    options.replaceChildren(new Option(matches.length ? 'Choose a pub' : 'No matching pubs', ''));
    for (const pub of matches.slice(0, 50)) options.add(new Option(pub.name + ' · ' + pub.area, pub.id));
    addButton.disabled = busy || selected.size >= 6 || !options.value;
  }

  function updatePicks() {
    picks.replaceChildren();
    for (const pub of selected.values()) {
      const row = document.createElement('li');
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'button button-outline';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', 'Remove ' + pub.name);
      remove.disabled = busy;
      remove.addEventListener('click', () => { selected.delete(pub.id); updatePicks(); });
      row.append(pub.name + ' ', remove);
      picks.append(row);
    }
    submit.disabled = busy || selected.size < 2;
    updateMatches();
  }

  function showList(list) {
    listId = list.id;
    write(recentKey, listId);
    recentButton.hidden = false;
    byId('shortlist-heading').textContent = list.title;
    form.hidden = true;
    retry.hidden = true;
    results.hidden = false;
    voteRows.replaceChildren();
    const counts = new Map(list.counts.map(entry => [entry.pubId, entry.votes]));
    for (const pub of list.pubs) {
      const row = document.createElement('li');
      const link = document.createElement('a');
      const url = appLink();
      url.searchParams.set('screen', 'explore');
      url.hash = 'pub=' + encodeURIComponent(pub.id);
      link.href = url.href;
      link.textContent = pub.name;
      const count = counts.get(pub.id) || 0;
      const vote = document.createElement('button');
      vote.type = 'button';
      vote.className = 'button button-outline';
      vote.setAttribute('aria-label', 'Vote for ' + pub.name);
      vote.setAttribute('aria-pressed', String(chosen === pub.id));
      vote.textContent = chosen === pub.id ? 'Your vote' : 'Vote';
      vote.disabled = busy || chosen === pub.id;
      vote.addEventListener('click', () => castVote(pub.id));
      const details = document.createElement('div');
      const tally = document.createElement('small');
      tally.textContent = pub.area + ' · ' + count + (count === 1 ? ' vote' : ' votes');
      details.append(link, tally);
      row.append(details, vote);
      voteRows.append(row);
    }
  }

  async function loadPoll() {
    const number = ++requestNumber;
    retry.hidden = true;
    status.textContent = 'Loading votes…';
    try {
      const list = await window.PintShared.shortlist(listId);
      if (number !== requestNumber || !dialog.open) return;
      showList(list);
      status.textContent = 'Votes up to date.';
    } catch (error) {
      if (number !== requestNumber || !dialog.open) return;
      status.textContent = error.message || 'Could not load the poll.';
      retry.hidden = false;
    }
  }

  async function castVote(pubId) {
    if (busy) return;
    const number = ++requestNumber;
    const id = listId;
    busy = true;
    voteRows.querySelectorAll('button').forEach(button => { button.disabled = true; });
    byId('shortlist-refresh').disabled = true;
    status.textContent = 'Saving your vote…';
    try {
      voter ||= crypto.randomUUID();
      write(storageKey, voter);
      const list = await window.PintShared.shortlistWrite({ action: 'vote', id, voter, pubId });
      write(voteKey(id), pubId);
      if (number !== requestNumber || !dialog.open) return;
      chosen = pubId;
      busy = false;
      showList(list);
      status.textContent = 'Vote saved.';
    } catch (error) {
      if (number !== requestNumber || !dialog.open) return;
      voteRows.querySelectorAll('button').forEach(button => { button.disabled = button.getAttribute('aria-pressed') === 'true'; });
      status.textContent = error.message || 'Could not save your vote.';
    } finally {
      busy = false;
      byId('shortlist-refresh').disabled = false;
    }
  }

  addButton.addEventListener('click', () => {
    const pub = window.PintDirectory.pubs().find(item => item.id === options.value);
    if (!pub || selected.size >= 6) return;
    selected.set(pub.id, { id: pub.id, name: pub.name, area: pub.area });
    search.value = '';
    updatePicks();
    search.focus();
  });
  options.addEventListener('change', () => { addButton.disabled = busy || selected.size >= 6 || !options.value; });
  search.addEventListener('input', updateMatches);
  search.addEventListener('keydown', event => { if (event.key === 'Enter') event.preventDefault(); });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || selected.size < 2) return;
    const number = ++requestNumber;
    const payload = { action: 'create', title: form.elements.title.value.trim(), pubs: [...selected.values()] };
    const signature = JSON.stringify(payload);
    if (draftId?.signature !== signature) draftId = { signature, id: crypto.randomUUID() };
    busy = true;
    updatePicks();
    status.textContent = 'Creating your poll…';
    try {
      const list = await window.PintShared.shortlistWrite({ ...payload, id: draftId.id });
      if (number !== requestNumber || !dialog.open) return;
      chosen = null;
      busy = false;
      showList(list);
      status.textContent = 'Poll ready. Share the link to start voting.';
      form.reset();
      selected.clear();
      draftId = null;
    } catch (error) {
      if (number === requestNumber && dialog.open) status.textContent = error.message || 'Could not create the poll.';
    } finally {
      busy = false;
      if (!form.hidden) updatePicks();
    }
  });

  byId('open-shortlist').addEventListener('click', () => {
    byId('shortlist-heading').textContent = 'Create a pub poll';
    status.textContent = '';
    results.hidden = true;
    retry.hidden = true;
    form.hidden = false;
    updatePicks();
    dialog.showModal();
  });
  byId('shortlist-refresh').addEventListener('click', loadPoll);
  retry.addEventListener('click', loadPoll);
  dialog.addEventListener('close', () => {
    requestNumber++;
    const url = new URL(location.href);
    if (url.searchParams.has('poll')) {
      url.searchParams.delete('poll');
      history.replaceState(history.state, '', url);
    }
  });

  async function share(title, url) {
    if (navigator.share) {
      try { await navigator.share({ title, url }); return 'shared'; }
      catch (error) { if (error.name === 'AbortError') return 'cancelled'; }
    }
    try { await navigator.clipboard.writeText(url); return 'copied'; } catch { return 'manual'; }
  }

  byId('shortlist-share').addEventListener('click', async () => {
    const url = pollLink();
    const outcome = await share(byId('shortlist-heading').textContent, url);
    if (outcome === 'copied') status.textContent = 'Poll link copied.';
    if (outcome === 'manual') {
      byId('shortlist-link-label').hidden = false;
      byId('shortlist-link').value = url;
      byId('shortlist-link').select();
    }
  });

  byId('detail-content').addEventListener('click', async event => {
    const button = event.target.closest('[data-share-pub]');
    if (!button) return;
    const url = appLink();
    url.searchParams.set('screen', 'explore');
    url.hash = 'pub=' + encodeURIComponent(button.dataset.sharePub);
    const outcome = await share('PINT pub', url.href);
    if (outcome === 'copied') button.textContent = 'Link copied';
    if (outcome === 'manual') window.prompt('Copy this pub link', url.href);
  });

  function openPoll(id) {
    listId = id;
    chosen = read(voteKey(id));
    results.hidden = true;
    byId('shortlist-link-label').hidden = true;
    form.hidden = true;
    byId('shortlist-heading').textContent = 'Pub poll';
    dialog.showModal();
    loadPoll();
  }

  recentButton.hidden = !read(recentKey);
  recentButton.addEventListener('click', () => {
    const recent = read(recentKey);
    if (recent) openPoll(recent);
  });
  if (listId) openPoll(listId);
})();
