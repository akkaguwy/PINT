(() => {
  'use strict';
  const $ = id => document.getElementById('x-' + id);
  const api = window.PintShared;
  const storeKey = 'pint-christmas-v1';
  let saved;
  try { saved = JSON.parse(localStorage.getItem(storeKey)) || {}; } catch { saved = {}; }
  let outing, activeId, generation = 0, busy = false, reading = false;
  let pendingCreate = crypto.randomUUID();
  const message = value => { $('status').textContent = value; };
  function persist() { localStorage.setItem(storeKey, JSON.stringify(saved)); }
  function keyFor(id) {
    if (!saved[id]) {
      saved[id] = {secret: crypto.randomUUID()};
      persist();
    }
    return saved[id].secret;
  }
  function link(id) {
    const url = new URL(location.pathname, location.origin);
    url.searchParams.set('screen', 'christmas');
    if (id) url.searchParams.set('outing', id);
    return url.href;
  }
  function switchTo(id) {
    history.replaceState(history.state, '', link(id));
    activate();
  }
  function listSaved() {
    $('saved').replaceChildren();
    for (const [id, item] of Object.entries(saved)) {
      if (!item.title) continue;
      const a = document.createElement('a');
      a.href = link(id);
      a.textContent = 'Reopen ' + item.title;
      $('saved').append(a);
    }
    if (!$('saved').childElementCount) $('saved').textContent = 'No outings saved on this device yet. Start one or open an invite from a mate.';
  }
  function showPanel(panel) {
    for (const name of ['saved','create']) {
      const open = name === panel;
      $(name).hidden = !open;
      $('show-' + name).setAttribute('aria-expanded', String(open));
    }
  }
  for (const name of ['saved','create']) {
    $('show-' + name).onclick = () => showPanel($(name).hidden ? name : null);
  }
  function options() {
    if (!outing) return;
    const previous = $('options').value;
    const query = $('search').value.trim().toLowerCase();
    const used = new Set(outing.route.map(stop => stop.id));
    const pubs = (window.PintDirectory?.pubs() || []).filter(pub =>
      !used.has(pub.id) && [pub.name, pub.area, pub.region].join(' ').toLowerCase().includes(query));
    $('options').replaceChildren(...pubs.map(pub => new Option([pub.name,pub.area].filter(Boolean).join(' · '), pub.id)));
    if (pubs.some(pub => pub.id === previous)) $('options').value = previous;
    if (!pubs.length) $('options').add(new Option('No matching pubs', ''));
    $('add').querySelector('button').disabled = !pubs.length || busy;
  }
  function render(value) {
    outing = value;
    const joined = !!saved[value.id]?.title;
    $('outing').hidden = false;
    $('title').textContent = value.title;
    $('members').textContent = 'Going · ' + value.members.join(', ');
    $('count').textContent = value.route.length + ' of 12 stops';
    $('join').hidden = joined;
    $('add').hidden = !joined || value.route.length >= 12;
    $('link').value = link(value.id);
    $('route').replaceChildren(...value.route.map((stop, index) => {
      const li = document.createElement('li');
      const area = document.createElement('small');
      area.textContent = stop.area;
      li.append(stop.name, area);
      if (joined) {
        for (const [action,label,disabled] of [['up','Earlier',index === 0],['down','Later',index === value.route.length-1],['remove','Remove',false]]) {
          const button = document.createElement('button');
          button.className = 'button button-outline';
          button.textContent = label;
          button.setAttribute('aria-label', label + ' · ' + stop.name);
          button.disabled = disabled;
          button.onclick = () => {
            const route = value.route.slice();
            if (action === 'remove') route.splice(index,1);
            else {
              const next = index + (action === 'up' ? -1 : 1);
              [route[index],route[next]] = [route[next],route[index]];
            }
            saveRoute(route);
          };
          li.append(button);
        }
      }
      return li;
    }));
    options();
  }
  async function refresh() {
    if (!activeId || reading || busy || document.hidden) return;
    const epoch = generation;
    reading = true;
    try {
      const value = await api.christmas(activeId);
      if (epoch !== generation) return;
      if (!outing || JSON.stringify(value) !== JSON.stringify(outing)) render(value);
      if ($('status').dataset.loading) message('');
      delete $('status').dataset.loading;
    } catch (error) {
      if (epoch === generation) { message(error.message); $('status').dataset.loading = '1'; }
    } finally { if (epoch === generation) reading = false; }
  }
  function activate() {
    generation++;
    busy = reading = false;
    activeId = document.body.dataset.screen === 'christmas' ? new URL(location.href).searchParams.get('outing') : null;
    outing = null;
    $('lobby').hidden = !!activeId;
    $('back').hidden = !activeId;
    $('outing').hidden = $('link').hidden = true;
    $('search').value = '';
    message(activeId ? 'Loading outing…' : '');
    $('status').dataset.loading = '1';
    showPanel(null);
    listSaved();
    refresh();
  }
  async function write(payload) {
    if (busy) return;
    const epoch = ++generation;
    busy = true;
    reading = false;
    delete $('status').dataset.loading;
    message('Saving…');
    try {
      const result = await api.christmasWrite({...payload,secret:keyFor(payload.id)});
      if (epoch !== generation) return;
      saved[result.id].title = result.title;
      persist();
      if (payload.action === 'create') {
        pendingCreate = crypto.randomUUID();
        $('create').reset();
        history.replaceState(history.state, '', link(result.id));
        activeId = result.id;
        $('lobby').hidden = true;
        $('back').hidden = false;
      }
      busy = false;
      render(result);
      message(payload.action === 'route' ? 'Route saved for everyone.' : 'You’re on the list.');
    } catch (error) {
      if (epoch === generation) {
        busy = false;
        if (activeId) await refresh();
        if (epoch === generation) message(error.message);
      }
    } finally { if (epoch === generation) busy = false; }
  }
  function saveRoute(route) { return write({action:'route',id:outing.id,revision:outing.revision,route}); }
  $('create').onsubmit = e => {
    e.preventDefault();
    write({action:'create',id:pendingCreate,title:e.target.elements.title.value,name:e.target.elements.person.value});
  };
  $('join').onsubmit = e => {
    e.preventDefault();
    write({action:'join',id:activeId,name:e.target.elements.person.value});
  };
  $('search').oninput = options;
  $('add').onsubmit = e => {
    e.preventDefault();
    const pub = window.PintDirectory.pubs().find(p => p.id === $('options').value);
    if (pub && outing.route.length < 12) saveRoute([...outing.route,{id:pub.id,name:pub.name,area:pub.area || pub.region || ''}]);
  };
  $('invite').onclick = async () => {
    const url = link(activeId);
    try {
      if (navigator.share) await navigator.share({title:outing.title,url});
      else { await navigator.clipboard.writeText(url); message('Invite copied. Send it to your mates.'); }
    } catch (error) {
      if (error.name !== 'AbortError') { $('link').hidden = false; $('link').select(); message('Copy the invite link.'); }
    }
  };
  $('back').onclick = () => {
    switchTo(null);
    showPanel('saved');
    $('show-saved').focus();
  };
  document.addEventListener('pint:screen-change', activate);
  document.addEventListener('visibilitychange', refresh);
  window.setInterval(refresh, 5000);
})();
