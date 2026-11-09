/* PINT home dashboard — real destination counts and real community reviews. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const names={Cardiff:'Cardiff',Vale:'the Vale',Dublin:'Dublin',Methven:'Methven'};
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  let activeDestination='Cardiff', lastState, resume;
  // The overview tiles navigate through the existing mobile router.
  // Saved opens the directory with its existing favourites filter enabled.
  $('home-saved-link')?.addEventListener('click',()=>{
    const search=$('search'),area=$('area-filter'),sort=$('sort-filter'),favourites=$('favourites-filter');
    if(search)search.value='';
    if(area)area.value='all';
    if(sort)sort.value='name';
    if(favourites?.getAttribute('aria-pressed')!=='true')favourites?.click();
    else sort?.dispatchEvent(new Event('change',{bubbles:true}));
  });
  const areaFilter=$('home-activity-area');
  areaFilter?.addEventListener('change',()=>render(lastState));
  const resumeButton=$('home-resume-round');
  function updateResume(){
    if(!resumeButton)return;
    resume=[window.PintCustomGolf?.resume(),...window.PintGolf?.resumable()||[]]
      .filter(Boolean).sort((a,b)=>b.time-a.time)[0];
    resumeButton.hidden=!resume;
    if(resume)$('home-resume-stop').textContent='Hole '+resume.hole+' · '+resume.pub;
  }
  resumeButton?.addEventListener('click',()=>resume?.open());
  document.addEventListener('pint:golf-progress',updateResume);

  const compactDate=value=>{
    if(!value)return '';
    const date=new Date(value);
    return Number.isFinite(date.getTime())?new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short'}).format(date):'';
  };
  function choose(destination){
    const select=$('region-filter');
    if(!select||!names[destination]||select.value===destination)return;
    select.value=destination;
    select.dispatchEvent(new Event('change',{bubbles:true}));
  }
  document.querySelectorAll('[data-home-region]').forEach(button=>{
    button.addEventListener('click',()=>choose(button.dataset.homeRegion));
  });
  $('home-feed-list')?.addEventListener('click',event=>{
    const button=event.target.closest('[data-home-review-pub]');
    if(!button)return;
    location.hash='pub='+encodeURIComponent(button.dataset.homeReviewPub);
  });
  $('home-feed-list')?.addEventListener('error',event=>{
    if(event.target.matches('.home-activity-avatar img'))event.target.remove();
  },true);

  // Location discovery uses the SAME neighbourhood/coordinate data as the full directory.
  // Never imply a neighbourhood centre is an exact pub entrance.
  let homeMap,homeMarkers,homeGroups=new Map(),homePubs=[],homeDestination='Cardiff',selectedHomeArea='all';
  const mapFallback={Cardiff:[51.48,-3.18],Vale:[51.43,-3.42],Dublin:[53.35,-6.26],Methven:[-43.6324,171.6473]};
  const mapSearch=$('home-map-search'),mapArea=$('home-map-area');
  const mapList=$('home-map-venues');
  const hasCoordinates=pub=>Number.isFinite(pub.lat)&&Number.isFinite(pub.lon);
  function showPub(pub){
    location.hash='pub='+encodeURIComponent(pub.id);
  }
  function focusPub(pub){
    const centre=window.PintPubGeo?.centre(pub);
    if(!homeMap||!centre)return;
    homeMap.setView(centre,Math.max(homeMap.getZoom(),13),{animate:true});
    const key=hasCoordinates(pub)?'exact:'+centre.join(','):'area:'+homeDestination+'|'+pub.area;
    homeGroups.get(key)?.marker?.openPopup();
  }
  function renderHomePubList(){
    if(!mapList)return;
    const query=(mapSearch?.value||'').trim().toLocaleLowerCase();
    const filtered=homePubs.filter(pub=>(selectedHomeArea==='all'||pub.area===selectedHomeArea)&&(!query||(pub.name+' '+pub.area).toLocaleLowerCase().includes(query)));
    mapList.replaceChildren();
    const info=document.createElement('p');
    info.className='home-map-list-count';
    info.textContent=filtered.length+' '+(filtered.length===1?'pub':'pubs')+' found';
    mapList.append(info);
    if(!filtered.length){
      const empty=document.createElement('p');
      empty.className='home-map-list-empty';
      empty.textContent='No pubs match. Try another search or neighbourhood.';
      mapList.append(empty);
    }
    for(const pub of filtered.slice(0,90)){
      const button=document.createElement('button');
      button.type='button';
      button.className='home-map-list-item';
      const name=document.createElement('strong'),area=document.createElement('small');
      name.textContent=pub.name;
      area.textContent=pub.area+(window.PintPubGeo?.centre(pub)?' · Show on map':' · No map location');
      button.append(name,area);
      button.addEventListener('click',()=>{
        if(window.PintPubGeo?.centre(pub))focusPub(pub);
        else showPub(pub);
      });
      mapList.append(button);
    }
    if(filtered.length>90){
      const more=document.createElement('p');
      more.className='home-map-list-empty';
      more.textContent='Showing the first 90 results. Refine your search for more.';
      mapList.append(more);
    }
  }
  function updateHomeMapVisibility(){
    if(!homeMap)return;
    const root=$('home-pub-map');
    if(!root||root.getBoundingClientRect().width<10)return;
    homeMap.invalidateSize();
    const points=[...homeGroups.values()].map(group=>group.pos);
    if(points.length)homeMap.fitBounds(points,{padding:[30,30],maxZoom:13,animate:false});
  }
  function renderHomeMap(destination,pubs){
    const root=$('home-pub-map'),status=$('home-map-status');
    if(!root||!status)return;
    const changed=destination!==homeDestination;
    homeDestination=destination;
    homePubs=pubs.slice().sort((a,b)=>a.name.localeCompare(b.name));
    if(changed){
      selectedHomeArea='all';
      if(mapSearch)mapSearch.value='';
    }
    if(mapArea){
      const areas=[...new Set(pubs.map(p=>p.area).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
      mapArea.replaceChildren(new Option('All neighbourhoods','all'),...areas.map(area=>new Option(area,area)));
      if(!areas.includes(selectedHomeArea))selectedHomeArea='all';
      mapArea.value=selectedHomeArea;
    }
    renderHomePubList();
    if(!window.L||!window.PintPubGeo?.centre){
      status.textContent='Map tiles are unavailable. You can still select pubs from the list or open the full directory.';
      return;
    }
    if(!homeMap){
      homeMap=L.map(root,{scrollWheelZoom:false,tap:false,zoomControl:true}).setView(mapFallback[destination]||mapFallback.Cardiff,11);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution:'&copy; OpenStreetMap contributors',maxZoom:18
      }).addTo(homeMap);
      homeMarkers=L.layerGroup().addTo(homeMap);
    }
    homeMarkers.clearLayers();
    homeGroups=new Map();
    let unmapped=0;
    for(const pub of pubs){
      const pos=window.PintPubGeo.centre(pub);
      if(!pos||!pos.every(Number.isFinite)){unmapped++;continue}
      const exact=hasCoordinates(pub);
      const key=exact?'exact:'+pos.join(','):'area:'+destination+'|'+pub.area;
      if(!homeGroups.has(key))homeGroups.set(key,{pos,exact,area:pub.area,pubs:[]});
      homeGroups.get(key).pubs.push(pub);
    }
    const bounds=[];
    for(const group of homeGroups.values()){
      bounds.push(group.pos);
      const title=group.exact&&group.pubs.length===1?group.pubs[0].name:group.area+' · '+group.pubs.length+' '+(group.pubs.length===1?'pub':'pubs');
      const popup=document.createElement('div');
      popup.className='home-map-popup';
      const heading=document.createElement('strong');
      heading.textContent=title;
      popup.append(heading);
      if(!group.exact){
        const approx=document.createElement('small');
        approx.textContent='Approximate neighbourhood location';
        popup.append(approx);
      }
      for(const pub of group.pubs){
        const button=document.createElement('button');
        button.type='button';
        button.className='home-map-pub-button';
        button.textContent=pub.name+' ↗';
        button.addEventListener('click',()=>showPub(pub));
        popup.append(button);
      }
      const marker=L.marker(group.pos,{title,alt:title}).addTo(homeMarkers).bindPopup(popup,{maxHeight:260,minWidth:175});
      group.marker=marker;
    }
    const visible=root.getBoundingClientRect().width>=10;
    if(visible)homeMap.invalidateSize();
    if(bounds.length)homeMap.fitBounds(bounds,{padding:[30,30],maxZoom:13,animate:false});
    else homeMap.setView(mapFallback[destination]||mapFallback.Cardiff,11);
    status.textContent=(pubs.length-unmapped)+' of '+pubs.length+' pubs mapped · Grouped markers are approximate neighbourhoods'+(unmapped?' · '+unmapped+' pubs without coordinates':'');
  }
  mapSearch?.addEventListener('input',renderHomePubList);
  mapArea?.addEventListener('change',()=>{
    selectedHomeArea=mapArea.value;
    renderHomePubList();
    if(!homeMap)return;
    const positions=homePubs.filter(pub=>selectedHomeArea==='all'||pub.area===selectedHomeArea)
      .map(pub=>window.PintPubGeo?.centre(pub)).filter(Boolean);
    if(positions.length)homeMap.fitBounds(positions,{padding:[30,30],maxZoom:14});
  });
  window.addEventListener?.('resize',updateHomeMapVisibility);
  document.addEventListener('visibilitychange',updateHomeMapVisibility);
  document.addEventListener('pint:screen-change',updateHomeMapVisibility);

  function render(state={}){
    lastState=state;
    const {destination='Cardiff',pubs=[],reviews=[],connected=false,addedPubs=[],initial=false}=state;
    updateResume();
    activeDestination=names[destination]?destination:'Cardiff';
    const chosen=names[activeDestination];
    const inArea=pubs.filter(p=>p.region===activeDestination);
    const count=inArea.length;
    renderHomeMap(activeDestination,inArea);
    const label=$('home-destination-label'),city=$('home-hero-city'),heroCount=$('home-hero-count');
    if(label)label.textContent=chosen;
    if(city)city.textContent=chosen;
    if(heroCount)heroCount.textContent=count.toLocaleString('en-GB')+' '+(count===1?'pub':'pubs');
    const cowbridgeLink=$('home-cowbridge-link');
    if(cowbridgeLink)cowbridgeLink.hidden=activeDestination!=='Vale';
    const browse=$('home-browse-link');
    if(browse)browse.setAttribute('aria-label','Explore pubs in '+chosen);
    document.querySelectorAll('[data-home-region]').forEach(button=>{
      const selected=button.dataset.homeRegion===activeDestination;
      button.setAttribute('aria-pressed',String(selected));
      button.classList.toggle('selected',selected);
    });
    const allAreas=areaFilter?.value==='all';
    if(areaFilter)areaFilter.options[0].textContent=chosen;
    const subtitle=$('home-community-note');
    if(subtitle)subtitle.textContent=connected?(allAreas?'Latest reviews, photos and pubs across all areas':'Latest reviews, photos and pubs in '+chosen):initial?'Checking for recent reviews and photos':'Updates when connected';
    const root=$('home-feed-list');
    if(root){
      const lookup=new Map(pubs.map(pub=>[pub.id,pub]));
      const events=[
        ...reviews.filter(review=>lookup.has(review.pubId)&&Number(review.rating)>=1&&Number(review.rating)<=5)
          .map(review=>({pub:lookup.get(review.pubId),review,date:review.createdAt||review.date})),
        ...addedPubs.filter(pub=>lookup.has(pub.id)&&pub.createdAt).map(pub=>({pub,date:pub.createdAt}))
      ];
      const time=value=>Number(value)||Date.parse(value)||0;
      const recent=events.filter(event=>allAreas||event.pub.region===activeDestination).sort((a,b)=>time(b.date)-time(a.date)).slice(0,5);
      root.innerHTML=recent.length?recent.map(({pub,review,date})=>{
        const author=String(review?.reviewerName||'').trim()||'PINT member';
        const photo=review&&window.PintShared?.photoUrls(review)[0];
        const action=review?author+(photo?' rated and shared photos':' rated a pint'):'New pub added';
        const rating=review?'<span class="home-activity-rating">'+Number(review.rating).toFixed(1)+' <span aria-hidden="true">★</span></span>':'';
        const image=photo?'<img src="'+escapeHtml(photo)+'" alt="" loading="lazy" />':'';
        const info=[action,pub.area,compactDate(time(date))].filter(Boolean).join(' · ');
        return '<button class="home-activity" type="button" data-home-review-pub="'+escapeHtml(pub.id)+'">'
          +'<span class="home-activity-avatar" aria-hidden="true">'+escapeHtml(review?author[0].toUpperCase():'+')+image+'</span>'
          +'<span class="home-activity-copy"><strong>'+escapeHtml(pub.name)+'</strong><span>'+escapeHtml(info)+'</span></span>'
          +rating+'</button>';
      }).join(''):initial
        ?'<div class="home-empty-feed" data-state="loading"><strong>Loading recent reviews…</strong></div>'
        :!connected
          ?'<div class="home-empty-feed" data-state="error"><strong>Recent reviews are unavailable</strong><span>Open Community to try again.</span><a href="#my-pints">Open community <span aria-hidden="true">↗</span></a></div>'
          :'<div class="home-empty-feed"><strong>No reviews here yet</strong><span>Be the first to share a visit.</span><a href="#my-pints">Open community <span aria-hidden="true">↗</span></a></div>';
    }
  }
  window.PintHome={render};
})();