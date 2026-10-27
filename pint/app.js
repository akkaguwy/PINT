(() => {
  'use strict';
  const KEY = 'pint-cardiff-v1';
  const photos = [
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80'
  ];
  // Directory entries are starting suggestions, not claims about prices, ratings or hours.
  const starterPubs = [
    {id:'city-arms',name:'City Arms',area:'City Centre',address:'Quay Street, Cardiff',description:'A classic central stop, especially handy on a match day.'},
    {id:'old-arcade',name:'The Old Arcade',area:'City Centre',address:'Church Street, Cardiff',description:'Traditional Cardiff pub with a sporting atmosphere.'},
    {id:'queens-vaults',name:"The Queen's Vaults",area:'City Centre',address:'Westgate Street, Cardiff',description:'A familiar name near the Principality Stadium.'},
    {id:'cambrian-tap',name:'The Cambrian Tap',area:'City Centre',address:'St Mary Street, Cardiff',description:'A lively central option for a beer stop.'},
    {id:'tiny-rebel',name:'Tiny Rebel Cardiff',area:'City Centre',address:'Westgate Street, Cardiff',description:'Contemporary craft beer bar near the stadium.'},
    {id:'head-of-steam',name:'The Head of Steam',area:'City Centre',address:'Church Street, Cardiff',description:'A central beer-focused venue with plenty to explore.'}
  ];
  const $ = (selector) => document.querySelector(selector);
  const safe = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const emptyData = () => ({pubs:[],logs:[],favourites:[]});
  function validateData(data){
    if (!data || !Array.isArray(data.pubs) || !Array.isArray(data.logs) || !Array.isArray(data.favourites)) throw Error('Not a PINT backup');
    const pubs = data.pubs.slice(0,500).filter(p=>p && typeof p.id==='string' && typeof p.name==='string' && typeof p.area==='string').map(p=>({id:p.id.slice(0,100),name:p.name.slice(0,90),area:p.area.slice(0,50),address:String(p.address||'').slice(0,150),description:String(p.description||'').slice(0,180)}));
    const logs = data.logs.slice(0,5000).filter(l=>l && typeof l.pubId==='string' && Number(l.price)>0 && Number(l.rating)>=1 && Number(l.rating)<=10 && Number(l.price)<=100).map(l=>({id:String(l.id||crypto.randomUUID()).slice(0,100),pubId:l.pubId,drink:String(l.drink||'Guinness').slice(0,60),price:Number(l.price),rating:Number(l.rating),date:String(l.date||'').slice(0,10),notes:String(l.notes||'').slice(0,300)}));
    return {pubs,logs,favourites:data.favourites.filter(id=>typeof id==='string').slice(0,500)};
  }
  let data;
  try { data = validateData(JSON.parse(localStorage.getItem(KEY))) } catch { data = emptyData() }
  const allPubs = () => [...starterPubs,...data.pubs];
  const getPub = id => allPubs().find(pub=>pub.id===id);
  const latestPrice = id => [...data.logs].filter(log=>log.pubId===id).sort((a,b)=>b.date.localeCompare(a.date))[0]?.price;
  const averageRating = id => {const logs=data.logs.filter(log=>log.pubId===id);return logs.length?logs.reduce((s,l)=>s+l.rating,0)/logs.length:null};
  const money = value => '£'+Number(value).toFixed(2);
  function save(){localStorage.setItem(KEY,JSON.stringify(data));render()}
  let toastTimer;
  function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3000)}
  function openDialog(id){if(id==='entry-dialog'){$('#entry-form').reset();$('#entry-date').value=new Date().toLocaleDateString('en-CA');updateEntryPubs()}document.getElementById(id).showModal()}
  function updateEntryPubs(){const select=$('#entry-pub');const current=select.value;select.innerHTML=allPubs().map(p=>`<option value="${safe(p.id)}">${safe(p.name)}</option>`).join('');if(allPubs().some(p=>p.id===current))select.value=current}
  let favouritesOnly=false;
  function render(){
    const pubs=allPubs();
    $('#stat-pubs').textContent=pubs.length;$('#stat-logs').textContent=data.logs.length;$('#stat-favourites').textContent=data.favourites.length;
    const selectedArea=$('#area-filter').value;
    const areas=[...new Set(pubs.map(p=>p.area))].sort();
    $('#area-filter').innerHTML='<option value="all">All areas</option>'+areas.map(a=>`<option value="${safe(a)}">${safe(a)}</option>`).join('');
    $('#area-filter').value=areas.includes(selectedArea)?selectedArea:'all';
    const q=$('#search').value.trim().toLowerCase();
    let filtered=pubs.filter(p=>(p.name+' '+p.area+' '+p.address).toLowerCase().includes(q)&&($('#area-filter').value==='all'||p.area===$('#area-filter').value)&&(!favouritesOnly||data.favourites.includes(p.id)));
    const sort=$('#sort-filter').value;
    if(sort==='cheapest')filtered.sort((a,b)=>(latestPrice(a.id)??Infinity)-(latestPrice(b.id)??Infinity)||a.name.localeCompare(b.name));
    else if(sort==='rated')filtered.sort((a,b)=>(averageRating(b.id)??-1)-(averageRating(a.id)??-1)||a.name.localeCompare(b.name));
    else filtered.sort((a,b)=>a.name.localeCompare(b.name));
    $('#result-count').textContent=`${filtered.length} ${filtered.length===1?'pub':'pubs'}`;
    $('#empty-state').hidden=filtered.length>0;
    $('#pub-grid').innerHTML=filtered.map((pub,i)=>{
      const price=latestPrice(pub.id),rating=averageRating(pub.id),fav=data.favourites.includes(pub.id);
      const image=photos[Math.abs([...pub.id].reduce((n,c)=>n+c.charCodeAt(0),0))%photos.length];
      const maps='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent((pub.address||pub.name+', Cardiff')+', Wales');
      return `<article class="pub-card"><div class="pub-photo" style="background-image:url('${image}')"><span class="photo-label">${safe(pub.area.toUpperCase())}</span><button class="heart ${fav?'active':''}" data-favourite="${safe(pub.id)}" aria-label="${fav?'Remove':'Add'} ${safe(pub.name)} ${fav?'from':'to'} favourites" aria-pressed="${fav}">${fav?'♥':'♡'}</button></div><div class="pub-body"><h3>${safe(pub.name)}</h3><span class="pub-area">⌖ ${safe(pub.address||pub.area+', Cardiff')}</span><p class="pub-description">${safe(pub.description||'Your next Cardiff pub discovery.')}</p><div class="pub-metrics"><div><strong>${price==null?'—':money(price)}</strong><span>LAST LOGGED PRICE</span></div><div><strong>${rating==null?'—':rating.toFixed(1)+' ★'}</strong><span>YOUR AVG RATING /10</span></div></div><div class="pub-actions"><button data-log="${safe(pub.id)}">+ Log a pint</button><a href="${maps}" target="_blank" rel="noopener noreferrer">Directions ↗</a></div></div></article>`;
    }).join('');
    $('#entry-count').textContent=`${data.logs.length} LOGGED`;
    const recents=[...data.logs].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4);
    $('#recent-list').innerHTML=recents.length?recents.map(l=>`<div class="recent-entry"><div><strong>${safe(getPub(l.pubId)?.name||'Unknown pub')}</strong><small>${safe(l.drink)} · ${safe(l.date)} · ${money(l.price)}</small></div><b>${l.rating.toFixed(1)} ★</b></div>`).join(''):'<div class="recent-empty">No pints logged yet.<br/>Your adventures start with the first one.</div>';
  }
  $('#pub-grid').addEventListener('click',event=>{const heart=event.target.closest('[data-favourite]');if(heart){const id=heart.dataset.favourite;data.favourites=data.favourites.includes(id)?data.favourites.filter(x=>x!==id):[...data.favourites,id];save();toast('Favourites updated');return}const log=event.target.closest('[data-log]');if(log){openDialog('entry-dialog');$('#entry-pub').value=log.dataset.log}});
  $('#entry-form').addEventListener('submit',event=>{event.preventDefault();const f=new FormData(event.target);const log={id:crypto.randomUUID(),pubId:f.get('pubId'),drink:String(f.get('drink')).trim(),price:Number(f.get('price')),rating:Number(f.get('rating')),date:String(f.get('date')),notes:String(f.get('notes')).trim()};if(!getPub(log.pubId)||log.price<=0||log.price>100||log.rating<1||log.rating>10){toast('Check the price and rating');return}data.logs.push(log);save();$('#entry-dialog').close();toast('Pint saved to your journal')});
  $('#pub-form').addEventListener('submit',event=>{event.preventDefault();const f=new FormData(event.target);const name=String(f.get('name')).trim(),area=String(f.get('area')).trim();if(!name||!area)return;data.pubs.push({id:crypto.randomUUID(),name,area,address:String(f.get('address')).trim(),description:String(f.get('description')).trim()});save();$('#pub-dialog').close();event.target.reset();toast('Pub added to your directory')});
  $('#search').addEventListener('input',render);$('#area-filter').addEventListener('change',render);$('#sort-filter').addEventListener('change',render);
  $('#favourites-filter').addEventListener('click',()=>{favouritesOnly=!favouritesOnly;$('#favourites-filter').setAttribute('aria-pressed',String(favouritesOnly));render()});
  $('#add-pub-button').addEventListener('click',()=>openDialog('pub-dialog'));$('#log-first-button').addEventListener('click',()=>openDialog('entry-dialog'));$('#journal-log-button').addEventListener('click',()=>openDialog('entry-dialog'));$('#open-data-button').addEventListener('click',()=>openDialog('data-dialog'));
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.close).close()));
  document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',event=>{if(event.target===d)d.close()}));
  $('#export-button').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({app:'PINT',version:1,exportedAt:new Date().toISOString(),...data},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='pint-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Backup downloaded')});
  $('#import-input').addEventListener('change',async event=>{const file=event.target.files?.[0];if(!file)return;try{if(file.size>5_000_000)throw Error('File too large');const raw=JSON.parse(await file.text());if(raw.app!=='PINT')throw Error('Not a PINT backup');const imported=validateData(raw);if(confirm('Replace your current PINT entries with this backup?')){data=imported;save();$('#data-dialog').close();toast('Backup restored')}}catch(error){toast('Import failed: '+error.message)}event.target.value=''});
  $('#year').textContent=new Date().getFullYear();render();
})();
