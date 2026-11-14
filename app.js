(() => {
  'use strict';
  const KEY = 'pint-cardiff-v1';
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
    'The Three Golden Cups|Southerndown|Southerndown, Vale of Glamorgan|Pub option close to the coast',
    '1 Town Hall Square|Cowbridge|1 Town Hall Square, Cowbridge CF71 7DD|Small independent freehouse with a courtyard off the High Street',
    'Horse & Groom|Cowbridge|19 High Street, Cowbridge CF71 7AD|Traditional town pub with drinks, games and occasional live music',
    'Harry\'s Bar|Cowbridge|2 Westgate, Cowbridge CF71 7AR|Westgate bar and grill serving drinks and food',
    'Barbacoa Bar & Tapas|Cowbridge|69 High Street, Cowbridge CF71 7AF|Independent tapas and drinks bar on the High Street',
    'The Hare & Hounds|Aberthin|Aberthin Road, Aberthin CF71 7LG|Temporarily closed after fire damage as of November 2026; check before visiting',
    'The Barley Mow|Craig Penllyn|Graig Penllyn, Cowbridge CF71 7RT|Traditional country pub with seasonal meals and ales',
    'The Sycamore Tree|Colwinston|Coed Marsarnen, Colwinston CF71 7NG|Village pub with home-cooked food and a welcoming bar',
    'The White Lion|Ystradowen|Cowbridge Road, Ystradowen CF71 7SY|Village pub with a bar, dining and accommodation'
  ];
  // Cowbridge postal district: group villages without changing pub areas or existing IDs.
  // Methven / Mt Hutt Village — verified licensed pubs, bars and après-ski venues.
  // Keep IDs stable: old destination starter catalogues are untouched.
  const methvenSuggestions = [
    'The Blue Pub|Methven|1 Barkers Road, Methven 7730, New Zealand|Iconic blue pub with live music, pub meals and accommodation',
    'The Brown Pub|Methven|Corner of Main Street and Forest Drive, Methven 7730, New Zealand|Traditional Kiwi local with sports screens, a beer garden and hearty food',
    'The Dubliner|Methven|116 Main Street, Methven 7730, New Zealand|Irish gastro pub in the former post office with stout and hearty meals',
    'The Green Parrot Bar & Grill|Methven|36 Forest Drive, Methven 7730, New Zealand|Relaxed local bar and grill popular after a day in the mountains',
    'Amara Bar & Snackery|Methven|129 Main Street, Methven 7730, New Zealand|Cocktail bar offering New Zealand wines and small plates',
    'Craft @ Arabica|Methven|36 McMillan Street, Methven 7730, New Zealand|Licensed cafe and eatery serving craft beers and gourmet burgers',
    'Ski Time Restaurant & Bar|Methven|43 Racecourse Avenue, Methven 7730, New Zealand|Lodge-style bar and restaurant with Mt Hutt views and a warm fire',
    "Shackleton's @ Brinkley|Methven|43 Barkers Road, Methven 7730, New Zealand|Seasonal winter-only restaurant and licensed bar; check opening before visiting"
  ];
  const COWBRIDGE_GROUP='cowbridge-area';
  const COWBRIDGE_AREAS=new Set([
    'Cowbridge','Aberthin','Llanblethian','Penllyn','Craig Penllyn',
    'Colwinston','Ystradowen','St Hilary','Sigingstone','Wick','Monknash','Llysworney'
  ]);
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
  const starterPubs=[...parseSuggestions(cardiffSuggestions,'Cardiff'),...parseSuggestions(valeSuggestions,'Vale'),...parseSuggestions(dublinSuggestions,'Dublin'),...dublinExtra,...parseSuggestions(methvenSuggestions,'Methven')];
  ['city-arms','old-arcade','queens-vaults','cambrian-tap','tiny-rebel','head-of-steam'].forEach((id,index)=>starterPubs[index].id=id);
  const $ = (selector) => document.querySelector(selector);
  const safe = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const emptyData = () => ({pubs:[],logs:[],favourites:[]});
  function validateData(data){
    if (!data || !Array.isArray(data.pubs) || !Array.isArray(data.logs) || !Array.isArray(data.favourites)) throw Error('Not a PINT backup');
    const pubs = data.pubs.slice(0,500).filter(p=>p && typeof p.id==='string' && typeof p.name==='string' && typeof p.area==='string').map(p=>({id:p.id.slice(0,100),name:p.name.slice(0,90),area:p.area.slice(0,50),address:String(p.address||'').slice(0,150),description:String(p.description||'').slice(0,180),region:['Vale','Cardiff','Dublin','Methven'].includes(p.region)?p.region:'Cardiff'}));
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
  let requestSerial=0, sharedLoaded=false;
  let discoveredPubs=[];
  const cachedDiscover=window.PintDublinExplore?.readCache();
  if(cachedDiscover?.pubs)discoveredPubs=cachedDiscover.pubs;
  const allPubs = () => {
    const pubs=[...starterPubs,...sharedPubs,...data.pubs,...discoveredPubs];
    const seen=new Set();
    return pubs.filter(p=>{if(!p||!p.name)return false;const key=(p.region+'|'+p.name+'|'+p.area).toLowerCase();if(seen.has(key))return false;seen.add(key);return true});
  };
  window.PintDirectory={pubs:allPubs};
  const getPub = id => allPubs().find(pub=>pub.id===id);
  const visibleLogs=()=>[...sharedLogs,...data.logs.filter(l=>!sharedLogs.some(s=>s.id===l.id))];
  const ratingLogs=()=>sharedLogs.length?sharedLogs:data.logs;
  const latestPriceLog = id => ratingLogs().filter(log=>log.pubId===id && log.price!=null).sort((a,b)=>b.date.localeCompare(a.date)||activityTime(b)-activityTime(a))[0];
  const latestPrice = id => latestPriceLog(id)?.price;
  const averageRating = id => {const logs=ratingLogs().filter(log=>log.pubId===id);return logs.length?logs.reduce((s,l)=>s+l.rating,0)/logs.length:null};
  const averageField = (id,field) => {const logs=ratingLogs().filter(l=>l.pubId===id&&l[field]!=null);return logs.length?logs.reduce((sum,l)=>sum+l[field],0)/logs.length:null};
  const activityTime=log=>Number(log.createdAt)||Date.parse(log.createdAt||log.date)||0;
  function guinnessStats(){
    const stats=new Map();
    for(const log of ratingLogs()){
      const rating=Number(log.guinness);
      if(!Number.isFinite(rating)||rating<1||rating>5)continue;
      const entry=stats.get(log.pubId)||{sum:0,count:0,last:null};
      entry.sum+=rating;
      entry.count++;
      if(!entry.last||String(log.date||'')>String(entry.last.date||'')||
        log.date===entry.last.date&&activityTime(log)>activityTime(entry.last))entry.last=log;
      stats.set(log.pubId,entry);
    }
    return stats;
  }
  const guinnessAverage=entry=>entry?entry.sum/entry.count:0;
  function guinnessEvidence(entry){
    if(!entry)return '';
    const count=entry.count+' '+(entry.count===1?'Guinness rating':'Guinness ratings');
    const date=/^\d{4}-\d{2}-\d{2}$/.test(entry.last?.date||'')?entry.last.date:'';
    return '<p class="guinness-evidence">'+count+(date?' · Latest '+safe(date)+' · '+Number(entry.last.guinness).toFixed(1)+'★':'')+'</p>';
  }
  const logPhotos=log=>log.shared?Promise.resolve(window.PintShared.photoUrls(log)):window.PintPhotos.read(log.id);
  const pubTags=pub=>window.PintIdentity?.tags(pub)||['Pub'];
  const tagsMarkup=pub=>'<div class="pub-tags" aria-label="Pub types">'+pubTags(pub).map(tag=>'<span class="pub-tag">'+safe(tag)+'</span>').join('')+'</div>';
  // Display genuine photos uploaded with pub reviews, never unrelated stock photos.
  async function pubCover(pubId){
    const logs=visibleLogs().filter(l=>l.pubId===pubId).sort((a,b)=>Number(Boolean(b.coverPhoto))-Number(Boolean(a.coverPhoto))||String(b.date||'').localeCompare(String(a.date||'')));
    for(const log of logs){
      if(log.shared&&(!Number(log.photoCount)||Number(log.photoCount)<1))continue;
      try{const urls=await logPhotos(log);if(urls.length)return urls[0]}catch{}
    }
    return null;
  }
  async function hydratePubCovers(root=document){
    const nodes=[...root.querySelectorAll('[data-pub-cover]')];
    await Promise.all(nodes.map(async node=>{
      const pubId=node.dataset.pubCover;
      const url=await pubCover(pubId);
      if(!url||!node.isConnected||node.dataset.pubCover!==pubId)return;
      const img=new Image();img.alt='Photo shared by a PINT reviewer';img.loading='lazy';img.decoding='async';
      img.onload=()=>{
        if(!node.isConnected||node.dataset.pubCover!==pubId)return;
        node.querySelector('.pub-photo-placeholder')?.remove();
        node.querySelector('.pub-cover-img')?.remove();
        img.className='pub-cover-img';node.prepend(img);node.classList.add('has-real-photo');
      };
      img.onerror=()=>node.classList.remove('has-real-photo');
      img.src=url;
    }));
  }
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
      sharedLoaded=true;
      lastSuccessfulSync=Date.now();
      try{localStorage.setItem('pint-community-snapshot-v1',JSON.stringify({pubs:sharedPubs,reviews:sharedLogs,syncedAt:lastSuccessfulSync}))}catch{}
      setSharedStatus('● Connected · '+sharedLogs.length+' shared reviews · Synced '+new Date(lastSuccessfulSync).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),'online');
      render();
      if(location.hash.startsWith('#pub='))syncPubHash();
      return true;
    }catch(error){
      if(serial!==requestSerial)return false;
      sharedOnline=false;
      sharedLoaded=true;
      const last=lastSuccessfulSync?(' · Last synced '+new Date(lastSuccessfulSync).toLocaleString()):'';
      setSharedStatus('⚠ Live connection unavailable'+last+(lastSuccessfulSync?' · Showing saved reviews':' · Please try again shortly'),'offline');
      render();
      return false;
    }
  }
  const money = (value,pubId) => (getPub(pubId)?.region==='Dublin'?'€':getPub(pubId)?.region==='Methven'?'NZ$':'£')+Number(value).toFixed(2);
  // Approximate neighbourhood centres for discovery; never used as exact pub coordinates.
  const centres={
    'City Centre':[51.4801,-3.1791],Pontcanna:[51.4875,-3.2040],Canton:[51.4819,-3.2124],Roath:[51.4924,-3.1616],Cathays:[51.4905,-3.1767],
    'Cardiff Bay':[51.4633,-3.1643],Lisvane:[51.5440,-3.1630],Birchgrove:[51.5170,-3.1910],Whitchurch:[51.5149,-3.2200],
    Cowbridge:[51.4622,-3.4483],Aberthin:[51.4670,-3.4740],Llanblethian:[51.4538,-3.4550],Penllyn:[51.4740,-3.4760],
    'Craig Penllyn':[51.485294,-3.473981],Colwinston:[51.4693,-3.52466],Ystradowen:[51.489671,-3.423927],
    'St Hilary':[51.4510,-3.4220],Sigingstone:[51.4280,-3.4200],Monknash:[51.4230,-3.5590],Aberthaw:[51.3920,-3.3870],
    'Llantwit Major':[51.4083,-3.4850],Llanmaes:[51.4170,-3.4730],Boverton:[51.4060,-3.4630],Penarth:[51.4388,-3.1737],
    Barry:[51.4069,-3.2694],Rhoose:[51.3890,-3.3520],'Ogmore-by-Sea':[51.4640,-3.6310],'St Athan':[51.4030,-3.4140],Wick:[51.4390,-3.5490],Southerndown:[51.4470,-3.6060],
    'Methven|Methven':[-43.6324,171.6473],
    'Dublin|Temple Bar':[53.3455,-6.2635],'Dublin|City Centre South':[53.3428,-6.2640],'Dublin|Grafton Street':[53.3422,-6.2600],
    'Dublin|Trinity':[53.3462,-6.2516],'Dublin|Merrion Row':[53.3385,-6.2516],'Dublin|Baggot Street':[53.3375,-6.2470],
    'Dublin|Smithfield':[53.3496,-6.2786],'Dublin|The Liberties':[53.3445,-6.2766],'Dublin|Glasnevin':[53.3698,-6.2716],
    // Approximate street-area centres only: pins do not claim precise pub entrances.
    'Dublin|North City Centre':[53.3490,-6.2600],
    'Dublin|Cathedral Street':[53.3500,-6.2590],
    'Dublin|North Earl Street':[53.3500,-6.2578],
    'Dublin|O\'Connell Street':[53.3508,-6.2605],
    'Dublin|Marlborough Street':[53.3499,-6.2561],
    'Dublin|Abbey Street':[53.3482,-6.2576],
    'Dublin|Sackville Place':[53.3489,-6.2584],
    'Dublin|Eden Quay':[53.3470,-6.2539],
    'Dublin|Bachelors Walk':[53.3471,-6.2624],
    'Dublin|Parnell Street':[53.3527,-6.2599],
    'Dublin|Talbot Street':[53.3510,-6.2517],
    'Dublin|Amiens Street':[53.3509,-6.2495],
    'Dublin|Westmoreland Street':[53.3463,-6.2599],
    'Dublin|College Street':[53.3454,-6.2567],
    'Dublin|Hawkins Street':[53.3471,-6.2572],
    'Dublin|Aston Quay':[53.3461,-6.2634],
    'Dublin|Jervis Street':[53.3485,-6.2674],
    'Dublin|Little Mary Street':[53.3493,-6.2723],
    'Dublin|Store Street':[53.3504,-6.2494],
    'Dublin|Suffolk Street':[53.3436,-6.2611],
    'Dublin|Nassau Street':[53.3430,-6.2558]
  };
  const distanceKm=(a,b)=>{const rad=Math.PI/180,dLat=(b[0]-a[0])*rad,dLon=(b[1]-a[1])*rad,x=Math.sin(dLat/2)**2+Math.cos(a[0]*rad)*Math.cos(b[0]*rad)*Math.sin(dLon/2)**2;return 6371*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))};
  const pubCentre=pub=>(Number.isFinite(pub.lat)&&Number.isFinite(pub.lon)?[pub.lat,pub.lon]:(centres[pub.region+'|'+pub.area]||centres[pub.area]));
  // Share exactly the same approximate neighbourhood and verified coordinate logic with Home.
  window.PintPubGeo={centre:pubCentre};

  const pubDistance=pub=>nearPosition&&pubCentre(pub)?distanceKm(nearPosition,pubCentre(pub)):null;
  function pubMapsUrl(value){
    try{
      const url=new URL(value);
      const direct=['www.google.com','google.com','www.google.co.uk','google.co.uk'].includes(url.hostname)&&/^\/maps(?:\/|$)/.test(url.pathname);
      const short=url.hostname==='maps.app.goo.gl'||url.hostname==='goo.gl'&&url.pathname.startsWith('/maps/');
      return url.protocol==='https:'&&!url.username&&!url.password&&!url.port&&url.href.length<=1200&&(direct||short)?url.href:null;
    }catch{return null}
  }
  const mapDirections=pub=>'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(pub.name+', '+(pub.address||pub.area)+(pub.region==='Dublin'?', Ireland':pub.region==='Methven'?', New Zealand':', Wales'));
  let nearPosition=null,view='list',pubMap=null,mapMarkers=null,lastFiltered=[],lastMapSignature='';
  function save(){localStorage.setItem(KEY,JSON.stringify(data));render()}
  let toastTimer;
  function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3000)}
  const reviewForm=$('#entry-form'), draftKey='pint-review-draft-v1';
  let draftImages=[], draftId, photoTask=null, submittingReview=false;
  function draftStatus(message){
    const status=$('#review-draft-status');
    status.textContent=message;
    status.hidden=!message;
  }
  function saveReviewDraft(){
    const fields=Object.fromEntries(new FormData(reviewForm));
    delete fields.photos;
    try{
      localStorage.setItem(draftKey,JSON.stringify({id:draftId,fields,images:draftImages,details:$('#review-details').open}));
    }catch{
      draftStatus('Browser storage is full or unavailable. Keep this form open to retain your changes.');
      return;
    }
    draftStatus('Draft saved on this device');
  }
  function renderDraftPhotos(){
    const preview=$('#photo-preview');
    preview.replaceChildren(...draftImages.map(src=>{
      const image=document.createElement('img');
      image.src=src;
      image.alt='Selected review photo';
      return image;
    }));
    $('#clear-review-photos').hidden=!draftImages.length;
  }
  function readReviewDraft(){
    try{return JSON.parse(localStorage.getItem(draftKey)||'null')}catch{return null}
  }
  function openDialog(id,pubId){
    if(id==='pub-dialog'){
      $('#pub-form [name=region]').value=$('#region-filter').value;
      showPubMatches();
    }
    if(id==='entry-dialog'){
      if(submittingReview||photoTask)return;
      reviewForm.reset();
      const draft=readReviewDraft();
      const restore=draft?.fields&&getPub(draft.fields.pubId)&&(!pubId||pubId===draft.fields.pubId);
      draftId=restore?draft.id:crypto.randomUUID();
      draftImages=restore&&Array.isArray(draft.images)?draft.images:[];
      $('#review-details').open=Boolean(restore&&draft.details);
      draftStatus(restore?'Draft restored':'');
      $('#review-form-error').hidden=true;
      $('#entry-form [name=reviewerName]').value=window.PintProfile?.load()?.name||localStorage.getItem('pint-reviewer-name')||'';
      renderDraftPhotos();
      const today=new Date();
      $('#entry-date').value=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);
      updateEntryPubs(restore?draft.fields.pubId:pubId);
      if(restore){
        for(const [name,value] of Object.entries(draft.fields)){
          const field=reviewForm.elements.namedItem(name);
          if(!field||field.type==='file')continue;
          if(field.type==='checkbox')field.checked=Boolean(value);
          else field.value=value;
        }
      }
    }
    document.getElementById(id).showModal();
  }
  function updateEntryPubs(pubId){
    const select=$('#entry-pub');
    const region=getPub(pubId)?.region||$('#region-filter').value;
    select.innerHTML=allPubs().filter(p=>p.region===region).map(p=>`<option value="${safe(p.id)}">${safe(p.name)} — ${safe(p.area)}</option>`).join('');
    if(getPub(pubId))select.value=pubId;
    const currency=money(0,select.value).replace('0.00','');
    $('#entry-price-label').textContent='Price of pint ('+currency+') · optional';
  }
  let favouritesOnly=false;
  let directoryLimit=12;
  let reviewFeedLimit=12;
  const DIRECTORY_PAGE_SIZE=12;
  function render(){
    const pubs=allPubs();
    const destination=$('#region-filter').value;
    $('#discover-dublin').hidden=destination!=='Dublin';
    $('#destination-title').textContent=destination==='Dublin'?'Explore Dublin pubs':destination==='Vale'?'Explore Vale of Glamorgan pubs':destination==='Methven'?'Explore Methven pubs & bars':'Explore Cardiff pubs';
    const currentPubs=pubs.filter(p=>p.region===destination);
    $('#stat-pubs').textContent=currentPubs.length;
    $('#stat-logs').textContent=visibleLogs().filter(l=>getPub(l.pubId)?.region===destination).length;
    $('#stat-favourites').textContent=currentPubs.filter(p=>data.favourites.includes(p.id)).length;
    const selectedArea=$('#area-filter').value;
    const selectedRegion=$('#region-filter').value;
    const areas=[...new Set(pubs.filter(p=>selectedRegion==='all'||p.region===selectedRegion).map(p=>p.area))].sort();
    const cowbridgeOption=selectedRegion==='Vale'?'<option value="'+COWBRIDGE_GROUP+'">Cowbridge & nearby villages</option>':'';
    $('#area-filter').innerHTML='<option value="all">All areas</option>'+cowbridgeOption+areas.map(a=>`<option value="${safe(a)}">${safe(a)}</option>`).join('');
    $('#area-filter').value=areas.includes(selectedArea)||(selectedRegion==='Vale'&&selectedArea===COWBRIDGE_GROUP)?selectedArea:'all';
    const cowbridgeSelected=selectedRegion==='Vale'&&$('#area-filter').value===COWBRIDGE_GROUP;
    $('#directory-hint').textContent=cowbridgeSelected
      ?'Cowbridge & nearby villages · '+pubs.filter(p=>p.region==='Vale'&&COWBRIDGE_AREAS.has(p.area)).length+' pubs and bars listed. Check opening status before visiting.'
      :'Directory: '+pubs.filter(p=>p.region===selectedRegion).length+' '+selectedRegion+' pubs (browse in batches of 12).';
    if(cowbridgeSelected)$('#destination-title').textContent='Explore Cowbridge & nearby villages';
    const q=$('#search').value.trim().toLowerCase();
    let filtered=pubs.filter(p=>(p.name+' '+p.area+' '+p.address+' '+p.description+' '+pubTags(p).join(' ')).toLowerCase().includes(q)&&(selectedRegion==='all'||p.region===selectedRegion)&&($('#area-filter').value==='all'||($('#area-filter').value===COWBRIDGE_GROUP&&COWBRIDGE_AREAS.has(p.area))||p.area===$('#area-filter').value)&&(!favouritesOnly||data.favourites.includes(p.id)));
    const stats=guinnessStats();
    const minGuinness=Number($('#guinness-filter').value);
    const minCount=Number($('#guinness-count').value);
    const radius=Number($('#nearby-radius').value);
    if(minGuinness||minCount)filtered=filtered.filter(pub=>{
      const entry=stats.get(pub.id);
      return entry&&entry.count>=minCount&&guinnessAverage(entry)>=minGuinness;
    });
    if(nearPosition&&radius)filtered=filtered.filter(pub=>(pubDistance(pub)??Infinity)<=radius);
    const sort=$('#sort-filter').value;
    if(sort==='cheapest')filtered.sort((a,b)=>(latestPrice(a.id)??Infinity)-(latestPrice(b.id)??Infinity)||a.name.localeCompare(b.name));
    else if(sort==='rated')filtered.sort((a,b)=>(averageRating(b.id)??-1)-(averageRating(a.id)??-1)||a.name.localeCompare(b.name));
    else if(sort==='guinness')filtered.sort((a,b)=>{
      const first=stats.get(a.id),second=stats.get(b.id);
      return guinnessAverage(second)-guinnessAverage(first)||(second?.count||0)-(first?.count||0)||a.name.localeCompare(b.name);
    });
    else if(sort==='recent-guinness')filtered.sort((a,b)=>{
      const first=stats.get(a.id)?.last,second=stats.get(b.id)?.last;
      return String(second?.date||'').localeCompare(String(first?.date||''))||
        (second?activityTime(second):0)-(first?activityTime(first):0)||a.name.localeCompare(b.name);
    });
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
    if(filtered.length===0&&pubs.some(p=>p.region===selectedRegion))$('#empty-state').textContent='No pubs match these filters. Try changing the area, rating, distance or search.';
    $('#pub-grid').innerHTML=filtered.slice(0,directoryLimit).map((pub,i)=>{
      const price=latestPrice(pub.id),rating=averageRating(pub.id),guinness=guinnessAverage(stats.get(pub.id)),fav=data.favourites.includes(pub.id);
      const distance=pubDistance(pub);
      return `<article class="pub-card"><div class="pub-photo" data-pub-cover="${safe(pub.id)}"><span class="pub-photo-placeholder" aria-hidden="true">P<span>.</span><small>No photo yet</small></span><button class="heart ${fav?'active':''}" data-favourite="${safe(pub.id)}" aria-label="${fav?'Remove':'Add'} ${safe(pub.name)} ${fav?'from':'to'} favourites" aria-pressed="${fav}">${fav?'♥':'♡'}</button></div><div class="pub-body"><h3>${safe(pub.name)}</h3>${/Temporarily closed/i.test(pub.description||'')?'<span class="pint-temporary-closed">Temporarily closed</span>':/winter-only/i.test(pub.description||'')?'<span class="pint-seasonal-status">Winter seasonal</span>':''}${tagsMarkup(pub)}<span class="pub-area">⌖ ${safe(pub.address||pub.area)}${distance==null?'':' · ~'+distance.toFixed(1)+' km'}</span><p class="pub-description">${safe(pub.description||'A pub to explore and review yourself.')}</p><div class="pub-metrics"><div><strong>${rating==null?'Not rated':rating.toFixed(1)+' ★'}</strong><span>${sharedOnline?'COMMUNITY':'YOUR'} OVERALL /5</span></div><div><strong>${!guinness?'Not rated':guinness.toFixed(1)+' ★'}</strong><span>${sharedOnline||sharedLogs.length?'COMMUNITY':'YOUR'} GUINNESS /5</span></div></div>${guinnessEvidence(stats.get(pub.id))}<div class="pub-price">${price==null?'No pint price logged yet':'Last logged pint: '+money(price,pub.id)}</div><div class="pub-actions"><button data-details="${safe(pub.id)}">View pub ↗</button><button data-log="${safe(pub.id)}">★ Review</button></div></div></article>`;
    }).join('');
    hydratePubCovers($('#pub-grid'));
    const destinationReviews=visibleLogs().filter(l=>getPub(l.pubId)?.region===$('#region-filter').value);
    $('#entry-count').textContent=`${destinationReviews.filter(l=>l.shared).length} SHARED · ${destinationReviews.filter(l=>!l.shared).length} PRIVATE`;
    const destinationName=$('#region-filter').selectedOptions[0]?.textContent||'destination';
    const destinationShared=sharedLogs.filter(l=>getPub(l.pubId)?.region===$('#region-filter').value).length;
    $('#community-summary').textContent=sharedOnline?`${destinationShared} shared reviews in ${destinationName}`:lastSuccessfulSync?`Showing ${destinationShared} saved reviews in ${destinationName}.`:sharedLoaded?'Reviews couldn’t load. Use Refresh reviews to try again.':'Loading community reviews…';
    const recents=[...destinationReviews].sort((a,b)=>b.date.localeCompare(a.date)||(b.createdAt||0)-(a.createdAt||0)).slice(0,reviewFeedLimit);
    const reviewMore=$('#more-community-reviews');
    reviewMore.hidden=destinationReviews.length<=reviewFeedLimit;
    reviewMore.textContent='Show more reviews ('+(destinationReviews.length-reviewFeedLimit)+' remaining)';
    $('#recent-list').innerHTML=recents.length?recents.map(l=>`<div class="recent-entry"><div><strong>${safe(getPub(l.pubId)?.name||'Unknown pub')}</strong><div class="review-author">${l.shared?(window.PintProfile?.author(l.reviewerName)||safe(l.reviewerName)):'Your saved review · not shared'}</div><small>${safe(l.date)}${l.guinness!=null?' · Guinness '+l.guinness+'★':''}${l.price!=null?' · '+money(l.price,l.pubId):''}</small>${l.notes?`<div class="review-notes">${safe(l.notes)}</div>`:''}<div class="review-photos" data-review-photos="${safe(l.id)}"></div></div><b>${Number(l.rating).toFixed(1)} ★</b></div>`).join(''):sharedOnline||lastSuccessfulSync?'<div class="recent-empty">No pub reviews here yet. Be the first to share a visit.</div>':'';
    recents.forEach(async log=>{try{const images=await logPhotos(log);const el=[...document.querySelectorAll('[data-review-photos]')].find(x=>x.dataset.reviewPhotos===log.id);if(el)el.innerHTML=images.map((src,i)=>`<button class="photo-thumb" type="button" aria-label="View photo ${i+1}"><img alt="Photo ${i+1} from ${safe(getPub(log.pubId)?.name||'pub')}" src="${src}" /></button>`).join('')}catch{}});
    if(view==='map')renderMap();
    window.PintProfile?.render(visibleLogs(),getPub);
    window.PintGallery?.render({pubs,reviews:sharedLogs,connected:sharedOnline,initial:!sharedLoaded&&!lastSuccessfulSync});
    window.PintHome?.render({destination,pubs,reviews:sharedLogs,addedPubs:sharedPubs,connected:sharedOnline,initial:!sharedLoaded&&!lastSuccessfulSync});
  }
  function showView(next){view=next;$('#show-more-pubs').hidden=next==='map'||lastFiltered.length<=directoryLimit;$('#pub-grid').hidden=next==='map';$('#map-container').hidden=next!=='map';$('#list-view-button').classList.toggle('active',next==='list');$('#map-view-button').classList.toggle('active',next==='map');$('#list-view-button').setAttribute('aria-pressed',next==='list');$('#map-view-button').setAttribute('aria-pressed',next==='map');if(next==='map')requestAnimationFrame(renderMap)}
  function mapPubButton(pub){
    const button=document.createElement('button');
    button.type='button';
    button.className='map-popup-button';
    button.textContent=pub.name+' ↗';
    button.addEventListener('click',()=>{location.hash='pub='+encodeURIComponent(pub.id)});
    return button;
  }
  function renderMap(){
    if(view!=='map')return;
    const root=$('#pub-map');
    // The Explore screen is hidden until the mobile router opens it.
    if(!root||!root.getClientRects().length)return;
    const rect=root.getBoundingClientRect();
    if(rect.width<80||rect.height<100)return;
    const mode=$('#map-filter').value;
    const ownReviewIds=new Set(window.PintProfile?.ids()||[]);
    const visited=new Set(visibleLogs().filter(log=>!log.shared||ownReviewIds.has(log.id)).map(log=>log.pubId));
    const scores=new Map();
    for(const log of sharedLogs){
      const score=scores.get(log.pubId)||{total:0,count:0};
      score.total+=log.rating;
      score.count++;
      scores.set(log.pubId,score);
    }
    const pubs=lastFiltered.filter(pub=>{
      if(mode==='visited')return visited.has(pub.id);
      if(mode==='saved')return data.favourites.includes(pub.id);
      if(mode==='rated'){
        const score=scores.get(pub.id);
        return score&&score.total/score.count>=4;
      }
      return true;
    });
    const groups=new Map(),unpinned=[];
    for(const pub of pubs){
      const pos=pubCentre(pub);
      if(!window.L||!pos){unpinned.push(pub);continue}
      const exact=Number.isFinite(pub.lat)&&Number.isFinite(pub.lon);
      const key=exact?'point:'+pos.join(','):'area:'+pub.region+'|'+pub.area;
      if(!groups.has(key))groups.set(key,{pos,exact,pubs:[]});
      groups.get(key).pubs.push(pub);
    }
    const unmapped=$('#map-unpinned');
    unmapped.hidden=!unpinned.length;
    unmapped.querySelector('summary').textContent=unpinned.length+' pubs without pins';
    $('#map-unpinned-list').replaceChildren(...unpinned.map(mapPubButton));
    $('#map-status').textContent=pubs.length
      ?(pubs.length-unpinned.length)+' of '+pubs.length+' matching pubs on the map'
      :'No pubs match these map filters.';
    if(!window.L){$('#pub-map').textContent='The interactive map needs an internet connection.';return}
    const isFirstMap=!pubMap;
    if(!pubMap){
      pubMap=L.map('pub-map',{scrollWheelZoom:false,tap:false}).setView([51.467,-3.29],10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap contributors',maxZoom:18}).addTo(pubMap);
      mapMarkers=L.layerGroup().addTo(pubMap);
    }
    mapMarkers.clearLayers();
    const bounds=[];
    for(const {pos,exact,pubs:venues} of groups.values()){
      bounds.push(pos);
      const title=exact&&venues.length===1?venues[0].name:venues[0].area+' · '+venues.length+' '+(venues.length===1?'pub':'pubs');
      const markerIcon=L.divIcon({
        className:'pint-map-marker-shell',
        html:'<span class="pint-map-marker '+(exact?'is-exact':'is-area')+'" aria-hidden="true">'+(venues.length>1?venues.length:'🍺')+'</span>',
        iconSize:[38,42],iconAnchor:[19,39],popupAnchor:[0,-32]
      });
      const marker=L.marker(pos,{title,alt:title,icon:markerIcon}).addTo(mapMarkers);
      const popup=document.createElement('div');
      popup.className='map-popup-pubs';
      const heading=document.createElement('strong');
      heading.textContent=title;
      popup.append(heading,...venues.map(mapPubButton));
      marker.bindPopup(popup);
    }
    if(nearPosition){
      L.circleMarker(nearPosition,{radius:8,color:'#f6e7c7',fillColor:'#c9a35b',fillOpacity:1}).addTo(mapMarkers).bindPopup('Your approximate location');
      if(bounds.length&&bounds.some(pos=>distanceKm(pos,nearPosition)<50))bounds.push(nearPosition);
    }
    pubMap.invalidateSize({pan:false,animate:false});
    // Preserve pan/zoom when background reviews sync; refit on actual filter changes.
    const signature=[$('#region-filter').value,$('#area-filter').value,mode,bounds.map(p=>p.join(',')).join(';')].join('|');
    if(isFirstMap||signature!==lastMapSignature){
      lastMapSignature=signature;
      if(bounds.length)pubMap.fitBounds(bounds,{padding:[25,25],maxZoom:14,animate:false});
      else {
        const centres={Cardiff:[51.48,-3.18],Vale:[51.43,-3.42],Dublin:[53.35,-6.26],Methven:[-43.63,171.65]};
        pubMap.setView(centres[$('#region-filter').value]||centres.Cardiff,11);
      }
    }
  }
  function detailReviewMarkup(log){
    const author=log.shared
      ?window.PintProfile?.author(log.reviewerName)||safe(log.reviewerName||'PINT member')
      :'Your saved review · not shared';
    return `<article class="detail-review">
      <div class="detail-review-heading"><div class="review-author">${author}</div><strong>${Number(log.rating).toFixed(1)} ★</strong></div>
      <small>${safe(log.date)}${log.guinness!=null?' · Guinness '+safe(log.guinness)+'★':''}</small>
      ${log.notes?`<p>${safe(log.notes)}</p>`:''}
      <div class="review-photos" data-detail-photos="${safe(log.id)}"></div>
    </article>`;
  }
  function detailMarkup(pub){
    const logs=visibleLogs().filter(log=>log.pubId===pub.id).sort((a,b)=>activityTime(b)-activityTime(a));
    const rated=ratingLogs().filter(log=>log.pubId===pub.id);
    const rating=averageRating(pub.id);
    const ratingLabel=rated.length===1?'1 rating':rated.length+' ratings';
    const latest=logs.find(log=>log.shared);
    const remaining=logs.filter(log=>log!==latest);
    const price=latestPriceLog(pub.id);
    const guinness=guinnessStats().get(pub.id);
    const scores=[['Atmosphere','atmosphere'],['Setting','setting']];
    return `<div class="detail-cover" data-pub-cover="${safe(pub.id)}">
      <span class="pub-photo-placeholder" aria-hidden="true">P<span>.</span><small>No photo yet</small></span>
      <span>${safe(pub.region==='Vale'?'VALE OF GLAMORGAN':pub.region.toUpperCase())} · ${safe(pub.area)}</span>
    </div>
    <h2>${safe(pub.name)}</h2>
    <div class="detail-facts">
      <div><small>Guinness</small><strong>${guinness?guinnessAverage(guinness).toFixed(1)+' / 5 ★':'Not rated'}</strong><span>${guinness?.count||0} ${guinness?.count===1?'rating':'ratings'}</span></div>
      <div><small>Overall</small><strong>${rating==null?'Not rated':rating.toFixed(1)+' / 5 ★'}</strong><span>${ratingLabel}</span></div>
      <div><small>Last pint price</small><strong>${price?money(price.price,pub.id):'No price yet'}</strong><span>${price?.date?'Logged '+safe(price.date):''}</span></div>
    </div>
    <div class="detail-actions">
      <button class="button button-gold" type="button" data-detail-review="${safe(pub.id)}">Write a review</button>
      <button class="button button-outline" type="button" data-share-pub="${safe(pub.id)}">Share pub</button>
      <a class="button button-outline" href="${safe(pubMapsUrl(pub.mapsUrl)||mapDirections(pub))}" target="_blank" rel="noopener noreferrer">Directions ↗</a>
    </div>
    ${tagsMarkup(pub)}
    <p class="detail-address">⌖ ${safe(pub.address||pub.area)}</p>
    <p>${safe(pub.description||'A pub to visit and discover for yourself.')}</p>
    ${latest?`<section class="detail-latest"><h3>Latest shared review</h3>${detailReviewMarkup(latest)}</section>`:''}
    <div class="detail-scores">${scores.map(([label,field])=>{
      const value=averageField(pub.id,field);
      return `<div><small>${label}</small><strong>${value==null?'—':value.toFixed(1)+' ★'}</strong></div>`;
    }).join('')}</div>
    ${remaining.length?`<h3>${latest?'More reviews':'Reviews'} (${remaining.length})</h3><div class="detail-reviews">${remaining.map(detailReviewMarkup).join('')}</div>`:''}
    ${logs.length?'':'<p>No reviews yet. Be the first to add one.</p>'}
    <p class="small-print">Check opening times before travelling. Photos are contributed by reviewers and may show a drink or the pub.</p>`;
  }
  async function renderDetailPhotos(id){const dialog=$('#detail-dialog');const logs=visibleLogs().filter(l=>l.pubId===id);for(const log of logs){try{const images=await logPhotos(log);const el=[...dialog.querySelectorAll('[data-detail-photos]')].find(node=>node.dataset.detailPhotos===log.id);if(el)el.innerHTML=images.map((src,i)=>`<button class="photo-thumb" type="button" aria-label="View visit photo ${i+1}"><img src="${src}" alt="Pub visit photo" /></button>`).join('')}catch{}}}
  async function openPubDetail(id){const pub=getPub(id);if(!pub)return;const dialog=$('#detail-dialog');$('#detail-content').innerHTML=detailMarkup(pub);if(!dialog.open)dialog.showModal();hydratePubCovers($('#detail-content'));await renderDetailPhotos(id)}
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
  $('#pub-grid').addEventListener('click',async event=>{const heart=event.target.closest('[data-favourite]');if(heart){const id=heart.dataset.favourite;data.favourites=data.favourites.includes(id)?data.favourites.filter(x=>x!==id):[...data.favourites,id];save();toast('Favourites updated');return}const details=event.target.closest('[data-details]');if(details){location.hash='pub='+encodeURIComponent(details.dataset.details);return}const log=event.target.closest('[data-log]');if(log){openDialog('entry-dialog',log.dataset.log)}});
  $('#detail-content').addEventListener('click',async event=>{const review=event.target.closest('[data-detail-review]');if(review){$('#detail-dialog').close();openDialog('entry-dialog',review.dataset.detailReview);return}const image=event.target.closest('.photo-thumb img');if(image){$('#photo-full').src=image.src;$('#photo-dialog').showModal()}});
  $('#detail-dialog').addEventListener('close',()=>{if(location.hash.startsWith('#pub=')){const url=new URL(location.href);url.hash='';history.replaceState(history.state,'',url)}});
  window.addEventListener('hashchange',syncPubHash);
  reviewForm.addEventListener('input',event=>{
    if(event.target.type!=='file')saveReviewDraft();
  });
  $('#entry-pub').addEventListener('change',event=>updateEntryPubs(event.target.value));
  reviewForm.addEventListener('invalid',event=>{
    if(event.target.closest('#review-details'))$('#review-details').open=true;
  },true);
  $('#review-photos').addEventListener('change',async event=>{
    const input=event.target;
    const files=[...input.files].slice(0,3);
    if(!files.length)return;
    input.disabled=true;
    photoTask=Promise.all(files.map(window.PintPhotos.resize));
    draftStatus('Preparing photos…');
    try{
      draftImages=await photoTask;
      renderDraftPhotos();
      saveReviewDraft();
    }catch(error){draftStatus(error.message)}
    finally{photoTask=null;input.disabled=false;input.value=''}
  });
  $('#clear-review-photos').addEventListener('click',()=>{
    if(photoTask)return;
    draftImages=[];
    renderDraftPhotos();
    saveReviewDraft();
  });
  reviewForm.addEventListener('submit',async event=>{
    event.preventDefault();
    if(submittingReview)return;
    submittingReview=true;
    const button=event.target.querySelector('[type=submit]');
    button.disabled=true;
    reviewForm.inert=true;
    const status=$('#review-form-error');
    status.hidden=true;
    const showError=message=>{status.hidden=false;status.textContent=message};
    const f=new FormData(event.target),optionalScore=name=>f.get(name)===''?null:Number(f.get(name));
    const price=f.get('price')===''?null:Number(f.get('price'));
    const log={id:draftId,pubId:String(f.get('pubId')),reviewerName:String(f.get('reviewerName')).trim(),price,rating:Number(f.get('rating')),guinness:optionalScore('guinness'),atmosphere:optionalScore('atmosphere'),setting:optionalScore('setting'),date:String(f.get('date')),notes:String(f.get('notes')).trim(),coverPhoto:Boolean(f.get('coverPhoto'))};
    try{
      if(!getPub(log.pubId)||!log.reviewerName||(price!=null&&(price<=0||price>100))||log.rating<1||log.rating>5){showError('Check your review details and try again.');return}
      button.textContent='Sharing review…';
      if(photoTask)await photoTask;
      saveReviewDraft();
      if(!await ensureSharedPub(log.pubId))throw Error('Pub unavailable');
      const images=draftImages;
      log.coverPhoto=log.coverPhoto&&images.length>0;
      await window.PintShared.addReview({...log,images});
      window.PintProfile?.record(log.id);
      try{
        localStorage.setItem('pint-reviewer-name',log.reviewerName);
        if(readReviewDraft()?.id===log.id)localStorage.removeItem(draftKey);
      }catch{}
      $('#entry-dialog').close();
      draftImages=[];
      renderDraftPhotos();
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
    }catch{showError('We couldn’t confirm your review was shared. Your details are still here. Check your connection and try again.');}finally{submittingReview=false;reviewForm.inert=false;button.disabled=false;button.textContent='Save my review ↗'}
  });
  $('#recent-list').addEventListener('click',event=>{const image=event.target.closest('.photo-thumb img');if(image){$('#photo-full').src=image.src;$('#photo-dialog').showModal()}});
  const pubNameKey=value=>value.normalize('NFKD').toLowerCase().replace(/\p{M}/gu,'')
    .replace(/['’]/g,'').replace(/[^a-z0-9]+/g,' ').trim().replace(/^the /,'');
  function showPubMatches(){
    const form=$('#pub-form');
    const key=pubNameKey(form.elements.name.value);
    const area=pubNameKey(form.elements.area.value);
    const region=form.elements.region.value;
    const mapsUrl=pubMapsUrl(form.elements.mapsUrl.value);
    const root=$('#pub-duplicates');
    const matches=key.length<3?[]:allPubs().filter(pub=>{
      const existing=pubNameKey(pub.name);
      return pub.region===region&&(mapsUrl&&mapsUrl===pub.mapsUrl||existing===key||(area&&pubNameKey(pub.area)===area&&(existing.includes(key)||key.includes(existing))));
    });
    const duplicate=matches.find(pub=>mapsUrl&&mapsUrl===pub.mapsUrl||pubNameKey(pub.name)===key&&pubNameKey(pub.area)===area);
    root.hidden=!matches.length;
    root.textContent=duplicate?'This pub is already listed:':'Check these existing listings:';
    for(const pub of matches.slice(0,5)){
      const button=mapPubButton(pub);
      button.addEventListener('click',()=>$('#pub-dialog').close());
      root.append(button);
    }
    return duplicate;
  }
  $('#pub-form').addEventListener('input',showPubMatches);
  $('#pub-form').addEventListener('submit',async event=>{
    event.preventDefault();
    const button=event.target.querySelector('[type=submit]'),f=new FormData(event.target);
    const pub={id:crypto.randomUUID(),name:String(f.get('name')).trim(),area:String(f.get('area')).trim(),region:['Cardiff','Vale','Dublin','Methven'].includes(f.get('region'))?f.get('region'):'Cardiff',address:String(f.get('address')).trim(),description:String(f.get('description')).trim(),pubType:String(f.get('pubType')||'Pub')};
    const mapsInput=String(f.get('mapsUrl')).trim();
    if(mapsInput&&!pubMapsUrl(mapsInput)){toast('Paste a Google Maps place link');return}
    pub.mapsUrl=pubMapsUrl(mapsInput);
    if(!pub.name||!pub.area||showPubMatches())return;
    button.disabled=true;button.textContent='Sharing pub…';
    try{
      if(!await refreshShared())throw Error('Could not check the latest pub listings. Try again.');
      if(['name','area','region','address','description','pubType'].some(key=>event.target.elements[key].value.trim()!==pub[key])||event.target.elements.mapsUrl.value.trim()!==mapsInput)throw Error('The listing changed. Check the details and submit again.');
      if(showPubMatches())return;
      await window.PintShared.addPub(pub);window.PintIdentity?.rememberType(pub,pub.pubType);$('#pub-dialog').close();event.target.reset();toast('Pub added for everyone ✓');await refreshShared();}
    catch(error){toast('Not shared: '+(error.message||'please retry'));}
    finally{button.disabled=false;button.textContent='Add pub for everyone ↗'}
  });
  const resetDirectory=()=>{directoryLimit=DIRECTORY_PAGE_SIZE;render()};
  // A single tap opens Cowbridge and all the neighbouring villages from Home.
  $('#home-cowbridge-link')?.addEventListener('click',()=>{
    const region=$('#region-filter');
    if(region.value!=='Vale'){region.value='Vale';region.dispatchEvent(new Event('change',{bubbles:true}));}
    $('#search').value='';
    $('#area-filter').value=COWBRIDGE_GROUP;
    resetDirectory();
  });
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
  $('#home-map-link').addEventListener('click',()=>showView('map'));
  $('#map-filter').addEventListener('change',renderMap);
   const refreshExploreMap=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
     if(view==='map'){renderMap();pubMap?.invalidateSize({pan:false,animate:false})}
   }));
   document.addEventListener('pint:screen-change',event=>{
     if(event.detail?.screen==='explore')refreshExploreMap();
   });
   window.addEventListener('resize',refreshExploreMap);
   if(window.ResizeObserver){
     const el=$('#pub-map');
     if(el)new ResizeObserver(refreshExploreMap).observe(el);
   }
  ['guinness-filter','guinness-count','nearby-radius'].forEach(id=>document.getElementById(id).addEventListener('change',resetDirectory));
  $('#nearby-button').addEventListener('click',()=>{
    if(nearPosition){nearPosition=null;$('#nearby-radius').hidden=true;$('#nearby-radius').value='0';$('#nearby-button').textContent='⌖ Near me';$('#nearby-button').setAttribute('aria-pressed','false');$('#sort-filter').value='name';$('#location-note').textContent='';render();return}
    if(!navigator.geolocation){toast('Location is not available on this device');return}
    const button=$('#nearby-button');button.disabled=true;button.textContent='Locating…';
    navigator.geolocation.getCurrentPosition(position=>{nearPosition=[position.coords.latitude,position.coords.longitude];button.disabled=false;button.textContent='⌖ Near me ✓';button.setAttribute('aria-pressed','true');$('#nearby-radius').hidden=false;if(!['guinness','recent-guinness'].includes($('#sort-filter').value))$('#sort-filter').value='nearby';$('#location-note').textContent='Approximate area distances · tap Near me to turn off';render()},()=>{button.disabled=false;button.textContent='⌖ Near me';toast('Could not access location. Check iPhone location permission.')},{enableHighAccuracy:false,timeout:12000,maximumAge:300000});
  });
  $('#favourites-filter').addEventListener('click',()=>{favouritesOnly=!favouritesOnly;$('#favourites-filter').setAttribute('aria-pressed',String(favouritesOnly));render()});
  $('#add-pub-button').addEventListener('click',()=>openDialog('pub-dialog'));$('#log-first-button').addEventListener('click',()=>openDialog('entry-dialog'));$('#journal-log-button').addEventListener('click',()=>openDialog('entry-dialog'));$('#open-data-button').addEventListener('click',()=>openDialog('data-dialog'));
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.close!=='entry-dialog'||!submittingReview&&!photoTask)document.getElementById(b.dataset.close).close()}));
  $('#entry-dialog').addEventListener('cancel',event=>{
    if(submittingReview||photoTask)event.preventDefault();
  });
  document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',event=>{
    if(event.target===d&&(d.id!=='entry-dialog'||!submittingReview&&!photoTask))d.close();
  }));
  $('#export-button').addEventListener('click',async()=>{try{const photoBackup=await window.PintPhotos.exportAll(),golf=JSON.parse(localStorage.getItem('pint-golf-scores-v1')||'{}');const blob=new Blob([JSON.stringify({app:'PINT',version:3,exportedAt:new Date().toISOString(),...data,photos:photoBackup,golf,customGolf:window.PintCustomGolf.backup()},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='pint-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Backup downloaded, including photos')}catch(error){toast('Backup could not be made: '+error.message)}});
  $('#import-input').addEventListener('change',async event=>{const file=event.target.files?.[0];if(!file)return;try{if(file.size>80_000_000)throw Error('File too large');const raw=JSON.parse(await file.text());if(raw.app!=='PINT')throw Error('Not a PINT backup');const imported=validateData(raw);const customGolf=raw.customGolf===undefined?undefined:window.PintCustomGolf.validate(raw.customGolf);if(confirm('Replace your current PINT reviews, photos and scorecards with this backup?')){if(raw.photos)await window.PintPhotos.importAll(raw.photos);if(raw.golf&&typeof raw.golf==='object')localStorage.setItem('pint-golf-scores-v1',JSON.stringify(raw.golf));if(customGolf!==undefined)window.PintCustomGolf.restore(customGolf);data=imported;save();$('#data-dialog').close();toast('Backup restored — refresh for scorecards')}}catch(error){toast('Import failed: '+error.message)}event.target.value=''});
  const authorLabel=document.createElement('label');
  authorLabel.textContent='Your name (visible to everyone)';
  const authorInput=document.createElement('input');
  authorInput.name='reviewerName';authorInput.required=true;authorInput.maxLength=40;authorInput.placeholder='e.g. Akka';
  authorInput.autocomplete='nickname';authorLabel.appendChild(authorInput);
  $('#entry-form').querySelector('label').before(authorLabel);
  document.addEventListener('pint:profile-updated',()=>render());
  $('#pub-form [type=submit]').textContent='Add pub for everyone ↗';
  const backupDialog=$('#data-dialog');
  backupDialog.querySelector('p').textContent='Your old reviews, photos, favourites and Pub Golf scorecards are kept on this device. New shared reviews and pubs are stored online. A JSON backup includes your local data only.';
  backupDialog.querySelector('.small-print').textContent='Import replaces only the local data on this device. It does not erase shared reviews or pubs. Old private reviews are not published automatically.';
  $('#share-pint-button').addEventListener('click',async()=>{
    // Always check the latest published release before sharing, even if the
    // sender still has an older PINT version installed on their phone.
    const version=await window.PintUpdates?.getPublishedVersion?.()
      ||new URL(document.querySelector('script[src*="app.js?v="]')?.src||location.href).searchParams.get('v')||'4.6';
    const url='https://akkaguwy.github.io/PINT/?destination='+encodeURIComponent($('#region-filter').value)
      +'&screen=home&v='+encodeURIComponent(version)
      +'&fresh='+Date.now().toString(36);
    try{
      if(navigator.share)await navigator.share({title:'PINT — Discover & review pubs',text:'Join me on PINT. Rate the pubs and share your Guinness reviews 🍺',url});
      else{await navigator.clipboard.writeText(url);toast('PINT link copied ✓')}
    }catch(error){if(error.name!=='AbortError')toast('Share this link: '+url)}
  });
  $('#year').textContent=new Date().getFullYear();
  const requestedDestination=new URLSearchParams(location.search).get('destination');
  const savedDestination=localStorage.getItem('pint-destination-v1');
  const startDestination=['Cardiff','Vale','Dublin','Methven'].includes(requestedDestination)?requestedDestination:savedDestination;
  if(['Cardiff','Vale','Dublin','Methven'].includes(startDestination))$('#region-filter').value=startDestination;
  // A destination link takes priority over filters left from another city.
  if(requestedDestination){$('#search').value='';favouritesOnly=false;$('#favourites-filter').setAttribute('aria-pressed','false');$('#area-filter').value='all';}
  $('#sort-filter').insertAdjacentHTML('beforeend','<option value="nearby">Nearest to me</option>');
  render();
  // Shareable link: ?destination=Vale&area=cowbridge-area&screen=explore
  const requestedArea=new URLSearchParams(location.search).get('area');
  if($('#region-filter').value==='Vale'&&requestedArea===COWBRIDGE_GROUP){
    $('#area-filter').value=COWBRIDGE_GROUP;
    resetDirectory();
  }
  syncPubHash();
  if(lastSuccessfulSync)setSharedStatus('↻ Loading current reviews · Last synced '+new Date(lastSuccessfulSync).toLocaleString(),'');
  refreshShared();
  // Poll less aggressively for a public-sized audience; manual refresh and tab focus still work.
  setInterval(()=>{if(!document.hidden&&navigator.onLine)refreshShared()},60000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&navigator.onLine)refreshShared()});
  window.addEventListener('online',refreshShared);
})();
