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

  // Reuses the main directory's location logic. Approximate venues share one area pin.
  let homeMap,homeMarkers,lastMapKey='';
  const mapFallback={Cardiff:[51.48,-3.18],Vale:[51.43,-3.42],Dublin:[53.35,-6.26],Methven:[-43.6324,171.6473]};
  function renderHomeMap(destination,pubs){
    const root=$('home-pub-map'),status=$('home-map-status');
    if(!root||!status)return;
    if(!window.L||!window.PintPubGeo?.centre){
      status.textContent='Map unavailable. Use Explore pubs to browse the directory.';
      return;
    }
    const groups=new Map();
    let unmapped=0;
    for(const pub of pubs){
      const pos=window.PintPubGeo.centre(pub);
      if(!pos||!pos.every(Number.isFinite)){unmapped++;continue}
      const exact=Number.isFinite(pub.lat)&&Number.isFinite(pub.lon);
      const key=exact?'exact:'+pos.join(','):'area:'+destination+'|'+pub.area;
      if(!groups.has(key))groups.set(key,{pos,exact,area:pub.area,pubs:[]});
      groups.get(key).pubs.push(pub);
    }
    const key=destination+'|'+[...groups].map(([id,g])=>id+':'+g.pubs.map(p=>p.id).join(',')).join('|')+'|'+unmapped;
    if(key===lastMapKey&&homeMap){homeMap.invalidateSize();return}
    lastMapKey=key;
    if(!homeMap){
      homeMap=L.map(root,{scrollWheelZoom:false,zoomControl:true}).setView(mapFallback[destination]||mapFallback.Cardiff,11);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution:'&copy; OpenStreetMap contributors',maxZoom:18
      }).addTo(homeMap);
      homeMarkers=L.layerGroup().addTo(homeMap);
    }
    homeMarkers.clearLayers();
    const bounds=[];
    for(const group of groups.values()){
      bounds.push(group.pos);
      const title=group.exact&&group.pubs.length===1?group.pubs[0].name:group.area+' · '+group.pubs.length+' '+(group.pubs.length===1?'pub':'pubs');
      const popup=document.createElement('div');
      popup.className='home-map-popup';
      const heading=document.createElement('strong');
      heading.textContent=title;
      popup.append(heading);
      for(const pub of group.pubs){
        const button=document.createElement('button');
        button.type='button';
        button.className='home-map-pub-button';
        button.textContent=pub.name+' ↗';
        button.addEventListener('click',()=>{
          homeMap.closePopup();
          location.hash='pub='+encodeURIComponent(pub.id);
        });
        popup.append(button);
      }
      L.marker(group.pos,{title,alt:title}).addTo(homeMarkers).bindPopup(popup,{maxHeight:220});
    }
    homeMap.invalidateSize();
    if(bounds.length)homeMap.fitBounds(bounds,{padding:[20,20],maxZoom:13});
    else homeMap.setView(mapFallback[destination]||mapFallback.Cardiff,11);
    const shown=pubs.length-unmapped;
    status.textContent=shown+' of '+pubs.length+' pubs mapped · Area pins are approximate, not exact addresses'+(unmapped?' · '+unmapped+' without locations':'');
  }

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