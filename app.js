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
  // Curated destination suggestions, not endorsements or live venue records.
  // Fields: name | area | address/search location | suggested reason to explore.
  const cardiffSuggestions = [
    'City Arms|City Centre|Quay Street, Cardiff|Traditional central pub close to the stadium',
    'The Old Arcade|City Centre|Church Street, Cardiff|Old-school Cardiff sporting pub',
    "The Queen's Vaults|City Centre|Westgate Street, Cardiff|Match-day stop beside the stadium",
    'The Cambrian Tap|City Centre|St Mary Street, Cardiff|Beer-focused city-centre stop',
    'Tiny Rebel Cardiff|City Centre|Westgate Street, Cardiff|Craft beer close to the stadium',
    'The Head of Steam|City Centre|Church Street, Cardiff|Big beer choice in the centre',
    'Blue Bell|City Centre|High Street, Cardiff|Traditional pub opposite Cardiff Castle',
    'Owain Glyndwr|City Centre|St John Street, Cardiff|A sporting pub in the heart of town',
    'Prince of Wales|City Centre|St Mary Street, Cardiff|Grand old building for an easy central stop',
    'The Philharmonic|City Centre|St Mary Street, Cardiff|Lively venue for a night out',
    'The Goat Major|City Centre|High Street, Cardiff|Cosy traditional pub by the castle',
    'The Rummer Tavern|City Centre|Duke Street, Cardiff|Compact historic city-centre pub',
    'The Cottage|City Centre|St Mary Street, Cardiff|A stop on the central pub circuit',
    'The Traders Tavern|City Centre|St Mary Street, Cardiff|Sports and a bustling central location',
    'The Flute & Tankard|City Centre|Windsor Place, Cardiff|Traditional beer-focused pub',
    'The Borough Arms|City Centre|St Mary Street, Cardiff|A central local to investigate',
    'The Moon|City Centre|Womanby Street, Cardiff|Independent music-led bar',
    'Fuel Rock Club|City Centre|Womanby Street, Cardiff|Rock and alternative music venue',
    'The Halfway|Pontcanna|Cathedral Road, Cardiff|Neighbourhood pub near Pontcanna',
    'The Cricketers|Pontcanna|Cathedral Road, Cardiff|Pub stop by leafy residential streets',
    'The Pontcanna Inn|Pontcanna|Cathedral Road, Cardiff|Relaxed Pontcanna pub option',
    'The Beverley|Pontcanna|Cathedral Road, Cardiff|Traditional neighbourhood pub',
    'The Conway|Pontcanna|Conway Road, Cardiff|Cosy pub away from the city-centre crowds',
    'The Ivor Davies|Canton|Cowbridge Road East, Cardiff|Community pub on the Canton side',
    'The Corporation Yard|Canton|Cowbridge Road East, Cardiff|Creative independent drinking spot',
    'The Lansdowne|Canton|Beda Road, Cardiff|A favourite candidate for a proper local',
    'The Romilly|Canton|Romilly Crescent, Cardiff|Victorian-era local with a neighbourhood feel',
    'The Four Elms|Roath|Elm Street, Cardiff|A Roath pub to add to your list',
    'The Albany|Roath|Albany Road, Cardiff|Classic Roath local',
    'The Claude|Roath|Albany Road, Cardiff|Casual pub option on the Roath circuit',
    'The Mackintosh|Roath|Keppoch Street, Cardiff|A characterful neighbourhood stop',
    'The Andrew Buchan|Roath|Albany Road, Cardiff|A traditional local near the park',
    'The Pen & Wig|Cathays|Park Grove, Cardiff|Leafy terrace near the civic centre',
    'The Woodville|Cathays|Woodville Road, Cardiff|Student-area pub with a lively feel',
    'The Taf|Cathays|Park Place, Cardiff|Student Union pub option',
    'The Eli Jenkins|Cardiff Bay|Bute Crescent, Cardiff|A central Bay pub near the waterfront',
    'The Packet|Cardiff Bay|Bute Street, Cardiff|Historic-feeling pub near the docks',
    'The Mount Stuart|Cardiff Bay|Cardiff Bay, Cardiff|Waterfront option for a Bay wander',
    'The Waterguard|Cardiff Bay|Harbour Drive, Cardiff|Waterside views and outdoor space',
    'The Dock|Cardiff Bay|Mermaid Quay, Cardiff|A modern Bay stop',
    'The Black Griffin|Lisvane|Lisvane, Cardiff|Village pub outside the central bustle',
    'The Aneurin Bevan|Birchgrove|Caerphilly Road, Cardiff|A suburban local to try',
    'The Plough|Whitchurch|Merthyr Road, Cardiff|Whitchurch village pub option',
    'The Fox & Hounds|Whitchurch|Whitchurch, Cardiff|A suburban pub to explore',
    'The Earl Haig Club|Whitchurch|Penlline Road, Cardiff|Club venue known for music and events'
  ];
  const valeSuggestions = [
    'The Bear Hotel|Cowbridge|High Street, Cowbridge|Historic coaching inn in the market town',
    'Duke of Wellington|Cowbridge|High Street, Cowbridge|High Street pub with food and a garden',
    'Vale of Glamorgan Inn|Cowbridge|High Street, Cowbridge|Traditional Cowbridge local',
    'The Edmondes Arms|Cowbridge|Cardiff Road, Cowbridge|Unspoilt pub with old-school character',
    "Farmer's Arms|Aberthin|Cowbridge Road, Aberthin|Village pub with a streamside setting",
    'The Cross Inn|Llanblethian|Llantwit Major Road, Llanblethian|Cosy stop just outside Cowbridge',
    'The Fox|Penllyn|Penllyn, Cowbridge|Country pub with dining and rural surroundings',
    'The Bush Inn|St Hilary|St Hilary, Vale of Glamorgan|Thatched village inn',
    'The Victoria Inn|Sigingstone|Sigingstone, Vale of Glamorgan|Rural pub near Cowbridge',
    'The Plough & Harrow|Monknash|Monknash, Vale of Glamorgan|Historic pub for coastal-path days',
    'The Blue Anchor|Aberthaw|East Aberthaw, Vale of Glamorgan|Characterful old thatched pub',
    'The Old Swan Inn|Llantwit Major|Church Street, Llantwit Major|Historic pub in the old town',
    'The White Hart|Llantwit Major|Wine Street, Llantwit Major|Town-centre pub near the square',
    "The Blacksmith's Arms|Llanmaes|Llanmaes, Vale of Glamorgan|Village inn near Llantwit Major",
    'Boverton Castle|Boverton|Eagleswell Road, Boverton|A village pub stop near Llantwit',
    'The Pilot|Penarth|Queens Road, Penarth|Neighbourhood pub overlooking the town',
    'The Windsor|Penarth|Windsor Road, Penarth|An easy central Penarth stop',
    'The Railway Hotel|Penarth|Plymouth Road, Penarth|Traditional town pub',
    'The Golden Lion|Penarth|Glendale Road, Penarth|Cosy residential-area pub',
    'The Albion|Penarth|Glebe Street, Penarth|Community-style local',
    'The Baruc Arms|Barry|High Street, Barry|Pub in Barry old town',
    'The Park|Barry|Park Crescent, Barry|Neighbourhood pub in the West End',
    'Sir Samuel Romilly|Barry|Broad Street, Barry|Historic building with a spacious bar',
    'The Ship|Barry|Harbour Road, Barry|Near the route to Barry Island',
    'The Cherry Orchard|Barry|Barry Road, Barry|Relaxed pub option outside the centre',
    'The Colcot Arms|Barry|Colcot Road, Barry|Food-led local in Barry',
    'The Old Dock|Barry|Holton Road, Barry|Independent stop in the town centre',
    'Craft Republic|Barry|Neptune Road, Barry|Craft beer by the waterfront',
    'The Two Bells|Barry|Holton Road, Barry|Traditional Barry pub',
    'The Rhoose|Rhoose|Port Road West, Rhoose|Food-led pub near the airport',
    'The Pelican in Her Piety|Ogmore-by-Sea|Ogmore-by-Sea, Vale of Glamorgan|Coastal pub for a sea-air stop',
    'The Three Horseshoes|St Athan|St Athan, Vale of Glamorgan|Village pub inland from the coast',
    'The Star Inn|Wick|Wick, Vale of Glamorgan|Village pub near the Heritage Coast',
    'The Three Golden Cups|Southerndown|Southerndown, Vale of Glamorgan|Pub option close to the coast'
  ];
  const parseSuggestions = (rows,region) => rows.map((row,index)=>{const [name,area,address,description]=row.split('|');return {id:`suggestion-${region.toLowerCase()}-${index}`,name,area,address,description,region}});
  const starterPubs=[...parseSuggestions(cardiffSuggestions,'Cardiff'),...parseSuggestions(valeSuggestions,'Vale')];
  ['city-arms','old-arcade','queens-vaults','cambrian-tap','tiny-rebel','head-of-steam'].forEach((id,index)=>starterPubs[index].id=id);
  const $ = (selector) => document.querySelector(selector);
  const safe = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const emptyData = () => ({pubs:[],logs:[],favourites:[]});
  function validateData(data){
    if (!data || !Array.isArray(data.pubs) || !Array.isArray(data.logs) || !Array.isArray(data.favourites)) throw Error('Not a PINT backup');
    const pubs = data.pubs.slice(0,500).filter(p=>p && typeof p.id==='string' && typeof p.name==='string' && typeof p.area==='string').map(p=>({id:p.id.slice(0,100),name:p.name.slice(0,90),area:p.area.slice(0,50),address:String(p.address||'').slice(0,150),description:String(p.description||'').slice(0,180),region:p.region==='Vale'?'Vale':'Cardiff'}));
    const score = v => v==null||v===''?null:(Number(v)>=1&&Number(v)<=5?Number(v):null);
    const logs = data.logs.slice(0,5000).filter(l=>l && typeof l.pubId==='string' && Number(l.rating)>=1 && Number(l.rating)<=10 && (l.price==null||l.price===''||(Number(l.price)>0&&Number(l.price)<=100))).map(l=>({id:String(l.id||crypto.randomUUID()).slice(0,100),pubId:l.pubId,drink:String(l.drink||'').slice(0,60),price:l.price==null||l.price===''?null:Number(l.price),rating:l.guinness===undefined&&l.atmosphere===undefined&&l.setting===undefined?Number(l.rating)/2:Number(l.rating),guinness:score(l.guinness),atmosphere:score(l.atmosphere),setting:score(l.setting),date:String(l.date||'').slice(0,10),notes:String(l.notes||'').slice(0,300)}));
    return {pubs,logs,favourites:data.favourites.filter(id=>typeof id==='string').slice(0,500)};
  }
  let data;
  try { data = validateData(JSON.parse(localStorage.getItem(KEY))) } catch { data = emptyData() }
  const allPubs = () => [...starterPubs,...data.pubs];
  const getPub = id => allPubs().find(pub=>pub.id===id);
  const latestPrice = id => [...data.logs].filter(log=>log.pubId===id && log.price!=null).sort((a,b)=>b.date.localeCompare(a.date))[0]?.price;
  const averageRating = id => {const logs=data.logs.filter(log=>log.pubId===id);return logs.length?logs.reduce((s,l)=>s+l.rating,0)/logs.length:null};
  const averageField = (id,field) => {const logs=data.logs.filter(l=>l.pubId===id&&l[field]!=null);return logs.length?logs.reduce((sum,l)=>sum+l[field],0)/logs.length:null};
  const money = value => '£'+Number(value).toFixed(2);
  function save(){localStorage.setItem(KEY,JSON.stringify(data));render()}
  let toastTimer;
  function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3000)}
  let photoPreviewUrls=[];
  function clearPhotoPreview(){photoPreviewUrls.forEach(url=>URL.revokeObjectURL(url));photoPreviewUrls=[];$('#photo-preview').innerHTML=''}
  function openDialog(id){if(id==='entry-dialog'){$('#entry-form').reset();clearPhotoPreview();const today=new Date();$('#entry-date').value=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);updateEntryPubs()}document.getElementById(id).showModal()}
  function updateEntryPubs(){const select=$('#entry-pub');const current=select.value;select.innerHTML=allPubs().map(p=>`<option value="${safe(p.id)}">${safe(p.name)} — ${safe(p.area)}</option>`).join('');if(allPubs().some(p=>p.id===current))select.value=current}
  let favouritesOnly=false;
  function render(){
    const pubs=allPubs();
    $('#stat-pubs').textContent=pubs.length;$('#stat-logs').textContent=data.logs.length;$('#stat-favourites').textContent=data.favourites.length;
    const selectedArea=$('#area-filter').value;
    const selectedRegion=$('#region-filter').value;
    const areas=[...new Set(pubs.filter(p=>selectedRegion==='all'||p.region===selectedRegion).map(p=>p.area))].sort();
    $('#area-filter').innerHTML='<option value="all">All areas</option>'+areas.map(a=>`<option value="${safe(a)}">${safe(a)}</option>`).join('');
    $('#area-filter').value=areas.includes(selectedArea)?selectedArea:'all';
    const q=$('#search').value.trim().toLowerCase();
    let filtered=pubs.filter(p=>(p.name+' '+p.area+' '+p.address+' '+p.description).toLowerCase().includes(q)&&(selectedRegion==='all'||p.region===selectedRegion)&&($('#area-filter').value==='all'||p.area===$('#area-filter').value)&&(!favouritesOnly||data.favourites.includes(p.id)));
    const sort=$('#sort-filter').value;
    if(sort==='cheapest')filtered.sort((a,b)=>(latestPrice(a.id)??Infinity)-(latestPrice(b.id)??Infinity)||a.name.localeCompare(b.name));
    else if(sort==='rated')filtered.sort((a,b)=>(averageRating(b.id)??-1)-(averageRating(a.id)??-1)||a.name.localeCompare(b.name));
    else if(sort==='unvisited')filtered.sort((a,b)=>Number(data.logs.some(l=>l.pubId===a.id))-Number(data.logs.some(l=>l.pubId===b.id))||a.name.localeCompare(b.name));
    else filtered.sort((a,b)=>a.name.localeCompare(b.name));
    $('#result-count').textContent=`${filtered.length} ${filtered.length===1?'pub':'pubs'}`;
    $('#empty-state').hidden=filtered.length>0;
    $('#pub-grid').innerHTML=filtered.map((pub,i)=>{
      const price=latestPrice(pub.id),rating=averageRating(pub.id),guinness=averageField(pub.id,'guinness'),fav=data.favourites.includes(pub.id);
      const image=photos[Math.abs([...pub.id].reduce((n,c)=>n+c.charCodeAt(0),0))%photos.length];
      const maps='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(pub.name+', '+(pub.address||pub.area)+', Wales');
      return `<article class="pub-card"><div class="pub-photo" style="background-image:url('${image}')"><span class="photo-label">${safe(pub.region==='Vale'?'THE VALE · '+pub.area.toUpperCase():'CARDIFF · '+pub.area.toUpperCase())}</span><button class="heart ${fav?'active':''}" data-favourite="${safe(pub.id)}" aria-label="${fav?'Remove':'Add'} ${safe(pub.name)} ${fav?'from':'to'} favourites" aria-pressed="${fav}">${fav?'♥':'♡'}</button></div><div class="pub-body"><h3>${safe(pub.name)}</h3><span class="pub-area">⌖ ${safe(pub.address||pub.area)}</span><p class="pub-description">${safe(pub.description||'A pub to explore and review yourself.')}</p><div class="pub-metrics"><div><strong>${rating==null?'Not visited':rating.toFixed(1)+' ★'}</strong><span>YOUR OVERALL /5</span></div><div><strong>${guinness==null?'Not rated':guinness.toFixed(1)+' ★'}</strong><span>YOUR GUINNESS /5</span></div></div><div class="pub-price">${price==null?'No pint price logged yet':'Last logged pint: '+money(price)}</div><div class="pub-actions"><button data-log="${safe(pub.id)}">★ Review visit</button><a href="${maps}" target="_blank" rel="noopener noreferrer">Directions ↗</a></div></div></article>`;
    }).join('');
    $('#entry-count').textContent=`${data.logs.length} LOGGED`;
    const recents=[...data.logs].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4);
    $('#recent-list').innerHTML=recents.length?recents.map(l=>`<div class="recent-entry"><div><strong>${safe(getPub(l.pubId)?.name||'Unknown pub')}</strong><small>${safe(l.date)}${l.guinness!=null?' · Guinness '+l.guinness+'★':''}${l.price!=null?' · '+money(l.price):''}</small>${l.notes?`<div class="review-notes">${safe(l.notes)}</div>`:''}<div class="review-photos" data-review-photos="${safe(l.id)}"></div></div><b>${l.rating.toFixed(1)} ★</b></div>`).join(''):'<div class="recent-empty">No pub reviews yet.<br/>Your adventures start with the first one.</div>';
    recents.forEach(async log=>{try{const images=await window.PintPhotos.read(log.id);const el=[...document.querySelectorAll('[data-review-photos]')].find(x=>x.dataset.reviewPhotos===log.id);if(el)el.innerHTML=images.map((src,i)=>`<button class="photo-thumb" type="button" aria-label="View photo ${i+1}"><img alt="Photo ${i+1} from ${safe(getPub(log.pubId)?.name||'pub')}" src="${src}" /></button>`).join('')}catch{}});
  }
  $('#pub-grid').addEventListener('click',event=>{const heart=event.target.closest('[data-favourite]');if(heart){const id=heart.dataset.favourite;data.favourites=data.favourites.includes(id)?data.favourites.filter(x=>x!==id):[...data.favourites,id];save();toast('Favourites updated');return}const log=event.target.closest('[data-log]');if(log){openDialog('entry-dialog');$('#entry-pub').value=log.dataset.log}});
  $('#review-photos').addEventListener('change',event=>{clearPhotoPreview();const files=[...event.target.files];if(files.length>3){toast('Only the first three photos will be saved')}files.slice(0,3).forEach(file=>{const url=URL.createObjectURL(file);photoPreviewUrls.push(url);const image=document.createElement('img');image.src=url;image.alt='Selected review photo';$('#photo-preview').appendChild(image)});if(files.length)$('#photo-preview').insertAdjacentHTML('beforeend',`<span class="photo-count">${Math.min(3,files.length)} selected</span>`)});
  $('#entry-form').addEventListener('submit',async event=>{event.preventDefault();const button=event.target.querySelector('[type=submit]');button.disabled=true;const f=new FormData(event.target);const optionalScore=name=>f.get(name)===''?null:Number(f.get(name));const price=f.get('price')===''?null:Number(f.get('price'));const log={id:crypto.randomUUID(),pubId:f.get('pubId'),drink:'',price,rating:Number(f.get('rating')),guinness:optionalScore('guinness'),atmosphere:optionalScore('atmosphere'),setting:optionalScore('setting'),date:String(f.get('date')),notes:String(f.get('notes')).trim()};try{if(!getPub(log.pubId)||(price!=null&&(price<=0||price>100))||log.rating<1||log.rating>5){toast('Check your review details');return}const files=[...$('#review-photos').files].slice(0,3);let photoError=false;if(files.length){try{await window.PintPhotos.save(log.id,files)}catch(error){photoError=true;toast('Photos could not be saved: '+error.message)}}data.logs.push(log);save();$('#entry-dialog').close();clearPhotoPreview();if(!photoError)toast('Review'+(files.length?' and photos':'')+' saved')}finally{button.disabled=false}});
  $('#recent-list').addEventListener('click',event=>{const image=event.target.closest('.photo-thumb img');if(image){$('#photo-full').src=image.src;$('#photo-dialog').showModal()}});
  $('#pub-form').addEventListener('submit',event=>{event.preventDefault();const f=new FormData(event.target);const name=String(f.get('name')).trim(),area=String(f.get('area')).trim();if(!name||!area)return;data.pubs.push({id:crypto.randomUUID(),name,area,region:f.get('region')==='Vale'?'Vale':'Cardiff',address:String(f.get('address')).trim(),description:String(f.get('description')).trim()});save();$('#pub-dialog').close();event.target.reset();toast('Pub added to your directory')});
  $('#search').addEventListener('input',render);$('#region-filter').addEventListener('change',render);$('#area-filter').addEventListener('change',render);$('#sort-filter').addEventListener('change',render);
  $('#favourites-filter').addEventListener('click',()=>{favouritesOnly=!favouritesOnly;$('#favourites-filter').setAttribute('aria-pressed',String(favouritesOnly));render()});
  $('#add-pub-button').addEventListener('click',()=>openDialog('pub-dialog'));$('#log-first-button').addEventListener('click',()=>openDialog('entry-dialog'));$('#journal-log-button').addEventListener('click',()=>openDialog('entry-dialog'));$('#open-data-button').addEventListener('click',()=>openDialog('data-dialog'));
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.close).close()));
  document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',event=>{if(event.target===d)d.close()}));
  $('#export-button').addEventListener('click',async()=>{try{const photoBackup=await window.PintPhotos.exportAll(),golf=JSON.parse(localStorage.getItem('pint-golf-scores-v1')||'{}');const blob=new Blob([JSON.stringify({app:'PINT',version:3,exportedAt:new Date().toISOString(),...data,photos:photoBackup,golf},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='pint-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Backup downloaded, including photos')}catch(error){toast('Backup could not be made: '+error.message)}});
  $('#import-input').addEventListener('change',async event=>{const file=event.target.files?.[0];if(!file)return;try{if(file.size>80_000_000)throw Error('File too large');const raw=JSON.parse(await file.text());if(raw.app!=='PINT')throw Error('Not a PINT backup');const imported=validateData(raw);if(confirm('Replace your current PINT reviews, photos and scorecards with this backup?')){if(raw.photos)await window.PintPhotos.importAll(raw.photos);if(raw.golf&&typeof raw.golf==='object')localStorage.setItem('pint-golf-scores-v1',JSON.stringify(raw.golf));data=imported;save();$('#data-dialog').close();toast('Backup restored — refresh for scorecards')}}catch(error){toast('Import failed: '+error.message)}event.target.value=''});
  $('#year').textContent=new Date().getFullYear();render();
})();
