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
  const dublinSuggestions = [
    "The Palace Bar|Temple Bar|21 Fleet Street, Dublin 2|Historic literary pub in the heart of town",
    "Bowe's Lounge Bar|Temple Bar|31 Fleet Street, Dublin 2|Traditional Fleet Street bar near Temple Bar",
    "The Temple Bar Pub|Temple Bar|47-48 Temple Bar, Dublin 2|Famous lively pub in the tourist quarter",
    "The Old Storehouse|Temple Bar|3 Crown Alley, Temple Bar, Dublin 2|Popular traditional music pub",
    "The Auld Dubliner|Temple Bar|24-25 Temple Bar, Dublin 2|Lively central pub for a night out",
    "The Stag's Head|City Centre South|1 Dame Court, Dublin 2|Victorian bar tucked away off Dame Street",
    "The Long Hall|City Centre South|51 South Great George's Street, Dublin 2|Classic Victorian interior",
    "Grogan's Castle Lounge|City Centre South|15 South William Street, Dublin 2|Art-filled Dublin local",
    "Kehoe's|Grafton Street|9 South Anne Street, Dublin 2|Old-fashioned snugs near Grafton Street",
    "Neary's|Grafton Street|1 Chatham Street, Dublin 2|Traditional pub near the shopping streets",
    "Mulligan's|Trinity|8 Poolbeg Street, Dublin 2|Traditional pub close to Tara Street",
    "O'Donoghue's|Merrion Row|15 Merrion Row, Dublin 2|Traditional music and Dublin pub history",
    "Toners|Baggot Street|139 Baggot Street Lower, Dublin 2|Traditional pub with a beer garden",
    "Doheny & Nesbitt|Baggot Street|5 Baggot Street Lower, Dublin 2|Old-school bar with Victorian character",
    "The Cobblestone|Smithfield|77 King Street North, Dublin 7|Traditional Irish music sessions",
    "The Brazen Head|The Liberties|20 Lower Bridge Street, Dublin 8|Historic Dublin pub by the Liffey",
    "John Kavanagh's (The Gravediggers)|Glasnevin|1 Prospect Square, Glasnevin, Dublin 9|Traditional pub by Glasnevin Cemetery"
  ];
  const parseSuggestions = (rows,region) => rows.map((row,index)=>{const [name,area,address,description]=row.split('|');return {id:`suggestion-${region.toLowerCase()}-${index}`,name,area,address,description,region}});
  const extraDublin=(Array.isArray(window.PintDublinExtra)?window.PintDublinExtra:[]).filter(p=>p&&typeof p.name==='string'&&typeof p.area==='string');
  const knownDublinNames=new Set(dublinSuggestions.map(s=>s.split('|')[0].toLowerCase()));
  const dublinExtra=extraDublin.filter(p=>!knownDublinNames.has(p.name.toLowerCase())).map((p,i)=>({
    id:'dublin-directory-'+i,name:p.name,region:'Dublin',area:p.area,address:p.address||'Dublin, Ireland',description:p.description||'Dublin pub suggestion'
  }));
  const starterPubs=[...parseSuggestions(cardiffSuggestions,'Cardiff'),...parseSuggestions(valeSuggestions,'Vale'),...parseSuggestions(dublinSuggestions,'Dublin'),...dublinExtra];
  ['city-arms','old-arcade','queens-vaults','cambrian-tap','tiny-rebel','head-of-steam'].forEach((id,index)=>starterPubs[index].id=id);
  const $ = (selector) => document.querySelector(selector);
  const safe = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const emptyData = () => ({pubs:[],logs:[],favourites:[]});
  function validateData(data){
    if (!data || !Array.isArray(data.pubs) || !Array.isArray(data.logs) || !Array.isArray(data.favourites)) throw Error('Not a PINT backup');
    const pubs = data.pubs.slice(0,500).filter(p=>p && typeof p.id==='string' && typeof p.name==='string' && typeof p.area==='string').map(p=>({id:p.id.slice(0,100),name:p.name.slice(0,90),area:p.area.slice(0,50),address:String(p.address||'').slice(0,150),description:String(p.description||'').slice(0,180),region:['Vale','Cardiff','Dublin'].includes(p.region)?p.region:'Cardiff'}));
    const score = v => v==null||v===''?null:(Number(v)>=1&&Number(v)<=5?Number(v):null);
    const logs = data.logs.slice(0,5000).filter(l=>l && typeof l.pubId==='string' && Number(l.rating)>=1 && Number(l.rating)<=10 && (l.price==null||l.price===''||(Number(l.price)>0&&Number(l.price)<=100))).map(l=>({id:String(l.id||crypto.randomUUID()).slice(0,100),pubId:l.pubId,drink:String(l.drink||'').slice(0,60),price:l.price==null||l.price===''?null:Number(l.price),rating:l.guinness===undefined&&l.atmosphere===undefined&&l.setting===undefined?Number(l.rating)/2:Number(l.rating),guinness:score(l.guinness),atmosphere:score(l.atmosphere),setting:score(l.setting),date:String(l.date||'').slice(0,10),notes:String(l.notes||'').slice(0,300)}));
    return {pubs,logs,favourites:data.favourites.filter(id=>typeof id==='string').slice(0,500)};
  }
  let data;
  try { data = validateData(JSON.parse(localStorage.getItem(KEY))) } catch { data = emptyData() }
  let sharedOnline=false, sharedPubs=[], sharedLogs=[];
  let lastSuccessfulSync=null;
  // Retain the last successfully received public community snapshot across app restarts.
  try {
    const cached=JSON.parse(localStorage.getItem('pint-community-snapshot-v1')||'null');
    if(cached&&Array.isArray(cached.pubs)&&Array.isArray(cached.reviews)){
      sharedPubs=cached.pubs;sharedLogs=cached.reviews;
      lastSuccessfulSync=cached.syncedAt||null;
    }
  }catch{}
  let requestSerial=0;
  let discoveredPubs=[];
  const cachedDiscover=window.PintDublinExplore?.readCache();
  if(cachedDiscover?.pubs)discoveredPubs=cachedDiscover.pubs;
  const allPubs = () => {
    const pubs=[...starterPubs,...sharedPubs,...data.pubs,...discoveredPubs];
    const seen=new Set();
    return pubs.filter(p=>{if(!p||!p.name)return false;const key=(p.region+'|'+p.name+'|'+p.area).toLowerCase();if(seen.has(key))return false;seen.add(key);return true});
  };
  const getPub = id => allPubs().find(pub=>pub.id===id);
  const visibleLogs=()=>[...sharedLogs,...data.logs.filter(l=>!sharedLogs.some(s=>s.id===l.id))];
  const ratingLogs=()=>sharedLogs.length?sharedLogs:data.logs;
  const latestPrice = id => [...ratingLogs()].filter(log=>log.pubId===id && log.price!=null).sort((a,b)=>b.date.localeCompare(a.date))[0]?.price;
  const averageRating = id => {const logs=ratingLogs().filter(log=>log.pubId===id);return logs.length?logs.reduce((s,l)=>s+l.rating,0)/logs.length:null};
  const averageField = (id,field) => {const logs=ratingLogs().filter(l=>l.pubId===id&&l[field]!=null);return logs.length?logs.reduce((sum,l)=>sum+l[field],0)/logs.length:null};
  const logPhotos=log=>log.shared?Promise.resolve(window.PintShared.photoUrls(log)):window.PintPhotos.read(log.id);
  function setSharedStatus(message,mode='') { const el=$('#shared-status');el.textContent=message;el.className='shared-status shell '+mode; }
  async function refreshShared() {
    const serial=++requestSerial;
    try {
      const result=await window.PintShared.load();
      if(serial!==requestSerial)return false;
      if(!Array.isArray(result.pubs)||!Array.isArray(result.reviews))throw Error('Unexpected response');
      sharedPubs=result.pubs.filter(p=>p&&typeof p.id==='string'&&typeof p.name==='string');
      const seen=new Set();
      sharedLogs=result.reviews.filter(l=>{
        if(!l||typeof l.id!=='string'||seen.has(l.id)||!Number.isFinite(Number(l.rating))||Number(l.rating)<1||Number(l.rating)>5)return false;
        seen.add(l.id);return true;
      }).map(l=>({...l,rating:Number(l.rating),shared:true}));
      sharedOnline=true;
      lastSuccessfulSync=Date.now();
      try{localStorage.setItem('pint-community-snapshot-v1',JSON.stringify({pubs:sharedPubs,reviews:sharedLogs,syncedAt:lastSuccessfulSync}))}catch{}
      setSharedStatus('● Connected · '+sharedLogs.length+' shared reviews · Synced '+new Date(lastSuccessfulSync).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),'online');
      render();
      const detail=$('#detail-dialog');
      if(detail.open&&location.hash.startsWith('#pub=')){
        const id=decodeURIComponent(location.hash.slice(5));
        const pub=getPub(id);
        if(pub){$('#detail-content').innerHTML=detailMarkup(pub);renderDetailPhotos(pub.id)}
      }
      return true;
    }catch(error){
      if(serial!==requestSerial)return false;
      sharedOnline=false;
      const last=lastSuccessfulSync?(' · Last synced '+new Date(lastSuccessfulSync).toLocaleString()):'';
      setSharedStatus('⚠ Live connection unavailable'+last+' · Showing cached reviews','offline');
      render();
      return false;
    }
  }
  const money = (value,pubId) => (getPub(pubId)?.region==='Dublin'?'€':'£')+Number(value).toFixed(2);
  // Approximate neighbourhood centres for discovery; never used as exact pub coordinates.
  const centres={
    'City Centre':[51.4801,-3.1791],Pontcanna:[51.4875,-3.2040],Canton:[51.4819,-3.2124],Roath:[51.4924,-3.1616],Cathays:[51.4905,-3.1767],
    'Cardiff Bay':[51.4633,-3.1643],Lisvane:[51.5440,-3.1630],Birchgrove:[51.5170,-3.1910],Whitchurch:[51.5149,-3.2200],
    Cowbridge:[51.4622,-3.4483],Aberthin:[51.4670,-3.4740],Llanblethian:[51.4538,-3.4550],Penllyn:[51.4740,-3.4760],
    'St Hilary':[51.4510,-3.4220],Sigingstone:[51.4280,-3.4200],Monknash:[51.4230,-3.5590],Aberthaw:[51.3920,-3.3870],
    'Llantwit Major':[51.4083,-3.4850],Llanmaes:[51.4170,-3.4730],Boverton:[51.4060,-3.4630],Penarth:[51.4388,-3.1737],
    Barry:[51.4069,-3.2694],Rhoose:[51.3890,-3.3520],'Ogmore-by-Sea':[51.4640,-3.6310],'St Athan':[51.4030,-3.4140],Wick:[51.4390,-3.5490],Southerndown:[51.4470,-3.6060],
    'Dublin|Temple Bar':[53.3455,-6.2635],'Dublin|City Centre South':[53.3428,-6.2640],'Dublin|Grafton Street':[53.3422,-6.2600],
    'Dublin|Trinity':[53.3462,-6.2516],'Dublin|Merrion Row':[53.3385,-6.2516],'Dublin|Baggot Street':[53.3375,-6.2470],
    'Dublin|Smithfield':[53.3496,-6.2786],'Dublin|The Liberties':[53.3445,-6.2766],'Dublin|Glasnevin':[53.3698,-6.2716]
  };
  const distanceKm=(a,b)=>{const rad=Math.PI/180,dLat=(b[0]-a[0])*rad,dLon=(b[1]-a[1])*rad,x=Math.sin(dLat/2)**2+Math.cos(a[0]*rad)*Math.cos(b[0]*rad)*Math.sin(dLon/2)**2;return 6371*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))};
  const pubCentre=pub=>(Number.isFinite(pub.lat)&&Number.isFinite(pub.lon)?[pub.lat,pub.lon]:(centres[pub.region+'|'+pub.area]||centres[pub.area]));
  const pubDistance=pub=>nearPosition&&pubCentre(pub)?distanceKm(nearPosition,pubCentre(pub)):null;
  const mapSearch=pub=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(pub.name+', '+(pub.address||pub.area)+(pub.region==='Dublin'?', Ireland':', Wales'));
  let nearPosition=null,view='list',pubMap=null,mapMarkers=null,lastFiltered=[];
  function save(){localStorage.setItem(KEY,JSON.stringify(data));render()}
  let toastTimer;
  function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3000)}
  let photoPreviewUrls=[];
  function clearPhotoPreview(){photoPreviewUrls.forEach(url=>URL.revokeObjectURL(url));photoPreviewUrls=[];$('#photo-preview').innerHTML=''}
  function openDialog(id){if(id==='pub-dialog'){$('#pub-form [name=region]').value=$('#region-filter').value}if(id==='entry-dialog'){$('#entry-form').reset();$('#entry-form [name=reviewerName]').value=localStorage.getItem('pint-reviewer-name')||'';clearPhotoPreview();const today=new Date();$('#entry-date').value=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);updateEntryPubs()}document.getElementById(id).showModal()}
  function updateEntryPubs(){const select=$('#entry-pub');const current=select.value;const selected=$('#region-filter').value;select.innerHTML=allPubs().filter(p=>p.region===selected).map(p=>`<option value="${safe(p.id)}">${safe(p.name)} — ${safe(p.area)}</option>`).join('');if(allPubs().some(p=>p.id===current&&p.region===selected))select.value=current}
  let favouritesOnly=false;
  let directoryLimit=12;
  let reviewFeedLimit=12;
  const DIRECTORY_PAGE_SIZE=12;
  function render(){
    const pubs=allPubs();
    const destination=$('#region-filter').value;
    $('#discover-dublin').hidden=destination!=='Dublin';
    $('#destination-title').textContent=destination==='Dublin'?'Explore Dublin pubs':destination==='Vale'?'Explore Vale of Glamorgan pubs':'Explore Cardiff pubs';
    $('#stat-pubs').textContent=pubs.filter(p=>p.region===destination).length;$('#stat-logs').textContent=visibleLogs().length;$('#stat-favourites').textContent=data.favourites.length;
    const selectedArea=$('#area-filter').value;
    const selectedRegion=$('#region-filter').value;
    $('#directory-hint').textContent='Directory: '+pubs.filter(p=>p.region===selectedRegion).length+' '+selectedRegion+' pubs (browse in batches of 12).';
    const areas=[...new Set(pubs.filter(p=>selectedRegion==='all'||p.region===selectedRegion).map(p=>p.area))].sort();
    $('#area-filter').innerHTML='<option value="all">All areas</option>'+areas.map(a=>`<option value="${safe(a)}">${safe(a)}</option>`).join('');
    $('#area-filter').value=areas.includes(selectedArea)?selectedArea:'all';
    const q=$('#search').value.trim().toLowerCase();
    let filtered=pubs.filter(p=>(p.name+' '+p.area+' '+p.address+' '+p.description).toLowerCase().includes(q)&&(selectedRegion==='all'||p.region===selectedRegion)&&($('#area-filter').value==='all'||p.area===$('#area-filter').value)&&(!favouritesOnly||data.favourites.includes(p.id)));
    const sort=$('#sort-filter').value;
    if(sort==='cheapest')filtered.sort((a,b)=>(latestPrice(a.id)??Infinity)-(latestPrice(b.id)??Infinity)||a.name.localeCompare(b.name));
    else if(sort==='rated')filtered.sort((a,b)=>(averageRating(b.id)??-1)-(averageRating(a.id)??-1)||a.name.localeCompare(b.name));
    else if(sort==='unvisited')filtered.sort((a,b)=>Number(ratingLogs().some(l=>l.pubId===a.id))-Number(ratingLogs().some(l=>l.pubId===b.id))||a.name.localeCompare(b.name));
    else if(sort==='activity')filtered.sort((a,b)=>{const last=id=>ratingLogs().filter(l=>l.pubId===id).reduce((m,l)=>Math.max(m,Date.parse(l.createdAt||l.date)||0),0);return last(b.id)-last(a.id)||a.name.localeCompare(b.name)});
    else if(sort==='nearby'&&nearPosition)filtered.sort((a,b)=>(pubDistance(a)??Infinity)-(pubDistance(b)??Infinity)||a.name.localeCompare(b.name));
    else filtered.sort((a,b)=>a.name.localeCompare(b.name));
    lastFiltered=filtered;
    const moreButton=$('#show-more-pubs');
    moreButton.hidden=view==='map'||filtered.length<=directoryLimit;
    moreButton.textContent='Show more pubs ('+Math.min(DIRECTORY_PAGE_SIZE,Math.max(0,filtered.length-directoryLimit))+' of '+(filtered.length-directoryLimit)+' remaining)';
    $('#result-count').textContent=`${filtered.length} ${filtered.length===1?'pub':'pubs'}` + (destination==='Dublin'&&discoveredPubs.length?' · with mapped pubs':'');
    $('#empty-state').hidden=filtered.length>0;
    if(filtered.length===0&&pubs.some(p=>p.region===selectedRegion))$('#empty-state').textContent='No pubs match your filters. Clear the search or tap Favourites to see all pubs.';
    $('#pub-grid').innerHTML=filtered.slice(0,directoryLimit).map((pub,i)=>{
      const price=latestPrice(pub.id),rating=averageRating(pub.id),guinness=averageField(pub.id,'guinness'),fav=data.favourites.includes(pub.id);
      const image=photos[Math.abs([...pub.id].reduce((n,c)=>n+c.charCodeAt(0),0))%photos.length];
      const distance=pubDistance(pub);
      return `<article class="pub-card"><div class="pub-photo" style="background-image:url('${image}')"><span class="photo-label">${safe((pub.region==='Vale'?'THE VALE':pub.region.toUpperCase())+' · '+pub.area.toUpperCase())}</span><button class="heart ${fav?'active':''}" data-favourite="${safe(pub.id)}" aria-label="${fav?'Remove':'Add'} ${safe(pub.name)} ${fav?'from':'to'} favourites" aria-pressed="${fav}">${fav?'♥':'♡'}</button></div><div class="pub-body"><h3>${safe(pub.name)}</h3><span class="pub-area">⌖ ${safe(pub.address||pub.area)}${distance==null?'':' · ~'+distance.toFixed(1)+' km'}</span><p class="pub-description">${safe(pub.description||'A pub to explore and review yourself.')}</p><div class="pub-metrics"><div><strong>${rating==null?'Not rated':rating.toFixed(1)+' ★'}</strong><span>${sharedOnline?'COMMUNITY':'YOUR'} OVERALL /5</span></div><div><strong>${guinness==null?'Not rated':guinness.toFixed(1)+' ★'}</strong><span>${sharedOnline?'COMMUNITY':'YOUR'} GUINNESS /5</span></div></div><div class="pub-price">${price==null?'No pint price logged yet':'Last logged pint: '+money(price,pub.id)}</div><div class="pub-actions"><button data-details="${safe(pub.id)}">View pub ↗</button><button data-log="${safe(pub.id)}">★ Review</button></div></div></article>`;
    }).join('');
    const destinationReviews=visibleLogs().filter(l=>getPub(l.pubId)?.region===$('#region-filter').value);
    $('#entry-count').textContent=`${destinationReviews.filter(l=>l.shared).length} SHARED · ${destinationReviews.filter(l=>!l.shared).length} PRIVATE`;
    const destinationName=$('#region-filter').selectedOptions[0]?.textContent||'destination';
    const destinationShared=sharedLogs.filter(l=>getPub(l.pubId)?.region===$('#region-filter').value).length;
    $('#community-summary').textContent=sharedOnline?`${destinationShared} shared reviews in ${destinationName}`:`Offline snapshot: ${destinationShared} reviews in ${destinationName}. Posting requires an internet connection.`;
    const recents=[...destinationReviews].sort((a,b)=>b.date.localeCompare(a.date)||(b.createdAt||0)-(a.createdAt||0)).slice(0,reviewFeedLimit);
    const reviewMore=$('#more-community-reviews');
    reviewMore.hidden=destinationReviews.length<=reviewFeedLimit;
    reviewMore.textContent='Show more reviews ('+(destinationReviews.length-reviewFeedLimit)+' remaining)';
    $('#recent-list').innerHTML=recents.length?recents.map(l=>`<div class="recent-entry"><div><strong>${safe(getPub(l.pubId)?.name||'Unknown pub')}</strong><div class="review-author">${safe(l.shared?l.reviewerName:'Your saved review · not shared')}</div><small>${safe(l.date)}${l.guinness!=null?' · Guinness '+l.guinness+'★':''}${l.price!=null?' · '+money(l.price,l.pubId):''}</small>${l.notes?`<div class="review-notes">${safe(l.notes)}</div>`:''}<div class="review-photos" data-review-photos="${safe(l.id)}"></div></div><b>${Number(l.rating).toFixed(1)} ★</b></div>`).join(''):'<div class="recent-empty">No pub reviews yet.<br/>Your adventures start with the first one.</div>';
    recents.forEach(async log=>{try{const images=await logPhotos(log);const el=[...document.querySelectorAll('[data-review-photos]')].find(x=>x.dataset.reviewPhotos===log.id);if(el)el.innerHTML=images.map((src,i)=>`<button class="photo-thumb" type="button" aria-label="View photo ${i+1}"><img alt="Photo ${i+1} from ${safe(getPub(log.pubId)?.name||'pub')}" src="${src}" /></button>`).join('')}catch{}});
    if(view==='map')renderMap();
  }
  function showView(next){view=next;$('#show-more-pubs').hidden=next==='map'||lastFiltered.length<=directoryLimit;$('#pub-grid').hidden=next==='map';$('#map-container').hidden=next!=='map';$('#list-view-button').classList.toggle('active',next==='list');$('#map-view-button').classList.toggle('active',next==='map');$('#list-view-button').setAttribute('aria-pressed',next==='list');$('#map-view-button').setAttribute('aria-pressed',next==='map');if(next==='map')requestAnimationFrame(renderMap)}
  function renderMap(){
    if(view!=='map')return;
    if(!window.L){$('#pub-map').textContent='The interactive map needs an internet connection. Switch to List for all pub suggestions.';return}
    if(!pubMap){pubMap=L.map('pub-map',{scrollWheelZoom:false}).setView([51.467,-3.29],10);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap contributors',maxZoom:18}).addTo(pubMap);mapMarkers=L.layerGroup().addTo(pubMap)}
    mapMarkers.clearLayers();const grouped=new Map();lastFiltered.forEach(p=>{if(!pubCentre(p))return;const key=p.region+'|'+p.area;if(!grouped.has(key))grouped.set(key,[]);grouped.get(key).push(p)});
    const bounds=[];grouped.forEach((pubs,key)=>{const area=pubs[0].area,pos=pubCentre(pubs[0]);bounds.push(pos);const marker=L.marker(pos).addTo(mapMarkers);const summary=document.createElement('div');const heading=document.createElement('strong');heading.textContent=area+' · '+pubs.length+' pubs';summary.append(heading,document.createElement('br'));const btn=document.createElement('button');btn.type='button';btn.textContent='Show pubs in this area ↗';btn.className='map-popup-button';btn.addEventListener('click',()=>{$('#region-filter').value=pubs[0].region;render();$('#area-filter').value=area;showView('list');render();$('#explore').scrollIntoView({behavior:'smooth'})});summary.append(btn);marker.bindPopup(summary)});
    if(nearPosition){const you=L.circleMarker(nearPosition,{radius:8,color:'#f6e7c7',fillColor:'#c9a35b',fillOpacity:1}).addTo(mapMarkers);you.bindPopup('Your approximate location');bounds.push(nearPosition)}
    pubMap.invalidateSize();if(bounds.length)pubMap.fitBounds(bounds,{padding:[25,25],maxZoom:13});
  }
  function detailMarkup(pub){const rating=averageRating(pub.id),guinness=averageField(pub.id,'guinness'),atmosphere=averageField(pub.id,'atmosphere'),setting=averageField(pub.id,'setting'),price=latestPrice(pub.id),logs=[...visibleLogs()].filter(l=>l.pubId===pub.id).sort((a,b)=>b.date.localeCompare(a.date));const image=photos[Math.abs([...pub.id].reduce((n,c)=>n+c.charCodeAt(0),0))%photos.length];return `<div class="detail-cover" style="background-image:url('${image}')"><span>${safe(pub.region==='Vale'?'VALE OF GLAMORGAN':pub.region.toUpperCase())} · ${safe(pub.area)}</span></div><span class="overline">THE PINT COMMUNITY</span><h2>${safe(pub.name)}<span class="gold-period">.</span></h2><p class="detail-address">⌖ ${safe(pub.address||pub.area)}</p><p>${safe(pub.description||'A pub to visit and discover for yourself.')}</p><div class="detail-scores">${[['Overall',rating],['Guinness',guinness],['Atmosphere',atmosphere],['Setting',setting]].map(([label,value])=>`<div><small>${label}</small><strong>${value==null?'—':value.toFixed(1)+' ★'}</strong></div>`).join('')}</div><p class="detail-price">${price==null?'No pint price recorded yet':'Last logged pint: '+money(price,pub.id)}</p><div class="detail-actions"><button class="button button-gold" data-detail-review="${safe(pub.id)}">★ Review this pub</button><a class="button button-outline" href="${mapSearch(pub)}" target="_blank" rel="noopener noreferrer">Directions ↗</a></div><h3>Reviews (${logs.length})</h3><div class="detail-reviews">${logs.length?logs.map(l=>`<div class="detail-review"><strong>${Number(l.rating).toFixed(1)} ★</strong><div class="review-author">${safe(l.shared?l.reviewerName:'Your saved review · not shared')}</div><small>${safe(l.date)}${l.guinness!=null?' · Guinness '+l.guinness+'★':''}</small>${l.notes?`<p>${safe(l.notes)}</p>`:''}<div class="review-photos" data-detail-photos="${safe(l.id)}"></div></div>`).join(''):'<p>No reviews yet. Be the first to add one.</p>'}</div><p class="small-print">Check opening times, availability and Guinness before travelling. Cover photo is illustrative.</p>`}
  async function renderDetailPhotos(id){const dialog=$('#detail-dialog');const logs=visibleLogs().filter(l=>l.pubId===id);for(const log of logs){try{const images=await logPhotos(log);const el=[...dialog.querySelectorAll('[data-detail-photos]')].find(node=>node.dataset.detailPhotos===log.id);if(el)el.innerHTML=images.map((src,i)=>`<button class="photo-thumb" type="button" aria-label="View visit photo ${i+1}"><img src="${src}" alt="Pub visit photo" /></button>`).join('')}catch{}}}
  async function openPubDetail(id){const pub=getPub(id);if(!pub)return;const dialog=$('#detail-dialog');$('#detail-content').innerHTML=detailMarkup(pub);if(!dialog.open)dialog.showModal();await renderDetailPhotos(id)}
  function syncPubHash(){const match=location.hash.match(/^#pub=(.+)$/);if(match){let id;try{id=decodeURIComponent(match[1])}catch{return}openPubDetail(id)}else if($('#detail-dialog').open)$('#detail-dialog').close()}
  async function ensureSharedPub(id){
    const pub=getPub(id);if(!pub||!pub.osmDiscovered)return true;
    if(sharedPubs.some(p=>p.id===id))return true;
    try{
      await window.PintShared.addPub({id:pub.id,name:pub.name,region:'Dublin',area:pub.area,address:pub.address,description:pub.description});
      await refreshShared();
      return true;
    }catch(err){toast('Could not add mapped pub to shared reviews: '+(err.message||'try again'));return false}
  }
  $('#discover-dublin').addEventListener('click',async()=>{
    const button=$('#discover-dublin');button.disabled=true;button.textContent='Finding mapped Dublin pubs…';
    try{
      const result=await window.PintDublinExplore.find();
      discoveredPubs=result.pubs;
      $('#search').value='';$('#area-filter').value='all';favouritesOnly=false;$('#favourites-filter').setAttribute('aria-pressed','false');
      directoryLimit=12;render();
      toast('Mapped pub results loaded'+(result.stale?' (saved copy)':'')+' ✓');
    }catch(error){toast('Pub search unavailable: '+(error.message||'try again later'))}
    finally{button.disabled=false;button.textContent='Find more Dublin pubs'}
  });
  $('#pub-grid').addEventListener('click',async event=>{const heart=event.target.closest('[data-favourite]');if(heart){const id=heart.dataset.favourite;data.favourites=data.favourites.includes(id)?data.favourites.filter(x=>x!==id):[...data.favourites,id];save();toast('Favourites updated');return}const details=event.target.closest('[data-details]');if(details){location.hash='pub='+encodeURIComponent(details.dataset.details);return}const log=event.target.closest('[data-log]');if(log){if(!await ensureSharedPub(log.dataset.log))return;openDialog('entry-dialog');$('#entry-pub').value=log.dataset.log}});
  $('#detail-content').addEventListener('click',async event=>{const review=event.target.closest('[data-detail-review]');if(review){if(!await ensureSharedPub(review.dataset.detailReview))return;$('#detail-dialog').close();openDialog('entry-dialog');$('#entry-pub').value=review.dataset.detailReview;return}const image=event.target.closest('.photo-thumb img');if(image){$('#photo-full').src=image.src;$('#photo-dialog').showModal()}});
  $('#detail-dialog').addEventListener('close',()=>{if(location.hash.startsWith('#pub=')){const url=new URL(location.href);url.hash='';history.replaceState(history.state,'',url)}});
  window.addEventListener('hashchange',syncPubHash);
  $('#review-photos').addEventListener('change',event=>{clearPhotoPreview();const files=[...event.target.files];if(files.length>3){toast('Only the first three photos will be saved')}files.slice(0,3).forEach(file=>{const url=URL.createObjectURL(file);photoPreviewUrls.push(url);const image=document.createElement('img');image.src=url;image.alt='Selected review photo';$('#photo-preview').appendChild(image)});if(files.length)$('#photo-preview').insertAdjacentHTML('beforeend',`<span class="photo-count">${Math.min(3,files.length)} selected</span>`)});
  $('#entry-form').addEventListener('submit',async event=>{
    event.preventDefault();
    const button=event.target.querySelector('[type=submit]');button.disabled=true;
    const f=new FormData(event.target),optionalScore=name=>f.get(name)===''?null:Number(f.get(name));
    const price=f.get('price')===''?null:Number(f.get('price'));
    const log={id:crypto.randomUUID(),pubId:String(f.get('pubId')),reviewerName:String(f.get('reviewerName')).trim(),price,rating:Number(f.get('rating')),guinness:optionalScore('guinness'),atmosphere:optionalScore('atmosphere'),setting:optionalScore('setting'),date:String(f.get('date')),notes:String(f.get('notes')).trim()};
    try{
      if(!getPub(log.pubId)||!log.reviewerName||(price!=null&&(price<=0||price>100))||log.rating<1||log.rating>5){toast('Check your review details');return}
      button.textContent='Sharing review…';
      const images=await Promise.all([...$('#review-photos').files].slice(0,3).map(window.PintPhotos.resize));
      await window.PintShared.addReview({...log,images});
      localStorage.setItem('pint-reviewer-name',log.reviewerName);
      $('#entry-dialog').close();clearPhotoPreview();
      toast('Review submitted · checking shared feed…');
      const synced=await refreshShared();
      if(synced&&sharedLogs.some(r=>r.id===log.id))toast('Review confirmed in the community feed ✓');
      else {
        toast('Review accepted; checking visibility again shortly');
        setTimeout(async()=>{
          const updated=await refreshShared();
          if(updated&&sharedLogs.some(r=>r.id===log.id))toast('Your review is now visible to everyone ✓');
          else toast('Review received, but not confirmed in shared feed. Check again later.');
        },4000);
      }
    }catch(error){toast('Not shared: '+(error.message||'please retry'));}finally{button.disabled=false;button.textContent='Save my review ↗'}
  });
  $('#recent-list').addEventListener('click',event=>{const image=event.target.closest('.photo-thumb img');if(image){$('#photo-full').src=image.src;$('#photo-dialog').showModal()}});
  $('#pub-form').addEventListener('submit',async event=>{
    event.preventDefault();
    const button=event.target.querySelector('[type=submit]'),f=new FormData(event.target);
    const pub={id:crypto.randomUUID(),name:String(f.get('name')).trim(),area:String(f.get('area')).trim(),region:['Cardiff','Vale','Dublin'].includes(f.get('region'))?f.get('region'):'Cardiff',address:String(f.get('address')).trim(),description:String(f.get('description')).trim()};
    if(!pub.name||!pub.area)return;
    button.disabled=true;button.textContent='Sharing pub…';
    try{await window.PintShared.addPub(pub);$('#pub-dialog').close();event.target.reset();toast('Pub added for everyone ✓');await refreshShared();}
    catch(error){toast('Not shared: '+(error.message||'please retry'));}
    finally{button.disabled=false;button.textContent='Add pub for everyone ↗'}
  });
  const resetDirectory=()=>{directoryLimit=DIRECTORY_PAGE_SIZE;render()};
   $('#search').addEventListener('input',resetDirectory);$('#region-filter').addEventListener('change',()=>{
      localStorage.setItem('pint-destination-v1',$('#region-filter').value);
      $('#search').value='';
      $('#area-filter').value='all';
      favouritesOnly=false;
      $('#favourites-filter').setAttribute('aria-pressed','false');
      $('#sort-filter').value='name';
      $('#directory-hint').textContent='Showing all pubs for '+$('#region-filter').selectedOptions[0].textContent+'. Use search or neighbourhood filters to narrow down.';
      resetDirectory();
    });$('#area-filter').addEventListener('change',resetDirectory);$('#sort-filter').addEventListener('change',resetDirectory);
   $('#show-more-pubs').addEventListener('click',()=>{directoryLimit+=DIRECTORY_PAGE_SIZE;render()});
   $('#refresh-community').addEventListener('click',async()=>{const btn=$('#refresh-community');btn.disabled=true;try{await refreshShared()}finally{btn.disabled=false}});
   $('#more-community-reviews').addEventListener('click',()=>{reviewFeedLimit+=12;render()});
  $('#list-view-button').addEventListener('click',()=>showView('list'));
  $('#map-view-button').addEventListener('click',()=>showView('map'));
  $('#nearby-button').addEventListener('click',()=>{
    if(nearPosition){nearPosition=null;$('#nearby-button').textContent='⌖ Near me';$('#nearby-button').setAttribute('aria-pressed','false');$('#sort-filter').value='name';$('#location-note').textContent='';render();return}
    if(!navigator.geolocation){toast('Location is not available on this device');return}
    const button=$('#nearby-button');button.disabled=true;button.textContent='Locating…';
    navigator.geolocation.getCurrentPosition(position=>{nearPosition=[position.coords.latitude,position.coords.longitude];button.disabled=false;button.textContent='⌖ Near me ✓';button.setAttribute('aria-pressed','true');$('#sort-filter').value='nearby';$('#location-note').textContent='Approximate area distances · tap Near me to turn off';render()},()=>{button.disabled=false;button.textContent='⌖ Near me';toast('Could not access location. Check iPhone location permission.')},{enableHighAccuracy:false,timeout:12000,maximumAge:300000});
  });
  $('#favourites-filter').addEventListener('click',()=>{favouritesOnly=!favouritesOnly;$('#favourites-filter').setAttribute('aria-pressed',String(favouritesOnly));render()});
  $('#add-pub-button').addEventListener('click',()=>openDialog('pub-dialog'));$('#log-first-button').addEventListener('click',()=>openDialog('entry-dialog'));$('#journal-log-button').addEventListener('click',()=>openDialog('entry-dialog'));$('#open-data-button').addEventListener('click',()=>openDialog('data-dialog'));
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.close).close()));
  document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',event=>{if(event.target===d)d.close()}));
  $('#export-button').addEventListener('click',async()=>{try{const photoBackup=await window.PintPhotos.exportAll(),golf=JSON.parse(localStorage.getItem('pint-golf-scores-v1')||'{}');const blob=new Blob([JSON.stringify({app:'PINT',version:3,exportedAt:new Date().toISOString(),...data,photos:photoBackup,golf},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='pint-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Backup downloaded, including photos')}catch(error){toast('Backup could not be made: '+error.message)}});
  $('#import-input').addEventListener('change',async event=>{const file=event.target.files?.[0];if(!file)return;try{if(file.size>80_000_000)throw Error('File too large');const raw=JSON.parse(await file.text());if(raw.app!=='PINT')throw Error('Not a PINT backup');const imported=validateData(raw);if(confirm('Replace your current PINT reviews, photos and scorecards with this backup?')){if(raw.photos)await window.PintPhotos.importAll(raw.photos);if(raw.golf&&typeof raw.golf==='object')localStorage.setItem('pint-golf-scores-v1',JSON.stringify(raw.golf));data=imported;save();$('#data-dialog').close();toast('Backup restored — refresh for scorecards')}}catch(error){toast('Import failed: '+error.message)}event.target.value=''});
  const authorLabel=document.createElement('label');
  authorLabel.textContent='Your name (visible to everyone)';
  const authorInput=document.createElement('input');
  authorInput.name='reviewerName';authorInput.required=true;authorInput.maxLength=40;authorInput.placeholder='e.g. Akka';
  authorInput.autocomplete='nickname';authorLabel.appendChild(authorInput);
  $('#entry-form').querySelector('label').before(authorLabel);
  $('#pub-form [type=submit]').textContent='Add pub for everyone ↗';
  const backupDialog=$('#data-dialog');
  backupDialog.querySelector('p').textContent='Your old reviews, photos, favourites and Pub Golf scorecards are kept on this device. New shared reviews and pubs are stored online. A JSON backup includes your local data only.';
  backupDialog.querySelector('.small-print').textContent='Import replaces only the local data on this device. It does not erase shared reviews or pubs. Old private reviews are not published automatically.';
  $('#share-pint-button').addEventListener('click',async()=>{
    const url='https://akkaguwy.github.io/PINT/?destination='+encodeURIComponent($('#region-filter').value);
    try{
      if(navigator.share)await navigator.share({title:'PINT — Discover & review pubs',text:'Join me on PINT. Rate the pubs and share your Guinness reviews 🍺',url});
      else{await navigator.clipboard.writeText(url);toast('PINT link copied ✓')}
    }catch(error){if(error.name!=='AbortError')toast('Share this link: '+url)}
  });
  $('#year').textContent=new Date().getFullYear();
  const requestedDestination=new URLSearchParams(location.search).get('destination');
  const savedDestination=localStorage.getItem('pint-destination-v1');
  const startDestination=['Cardiff','Vale','Dublin'].includes(requestedDestination)?requestedDestination:savedDestination;
  if(['Cardiff','Vale','Dublin'].includes(startDestination))$('#region-filter').value=startDestination;
  // A destination link takes priority over filters left from another city.
  if(requestedDestination){$('#search').value='';favouritesOnly=false;$('#favourites-filter').setAttribute('aria-pressed','false');$('#area-filter').value='all';}
  $('#sort-filter').insertAdjacentHTML('beforeend','<option value="nearby">Nearest to me</option>');
  render();syncPubHash();
  if(lastSuccessfulSync)setSharedStatus('↻ Loading current reviews · Last synced '+new Date(lastSuccessfulSync).toLocaleString(),'');
  refreshShared();
  // Poll less aggressively for a public-sized audience; manual refresh and tab focus still work.
  setInterval(()=>{if(!document.hidden&&navigator.onLine)refreshShared()},60000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&navigator.onLine)refreshShared()});
  window.addEventListener('online',refreshShared);
})();
