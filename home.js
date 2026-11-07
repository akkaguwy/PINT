/* PINT home dashboard — real destination counts and real community reviews. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const names={Cardiff:'Cardiff',Vale:'the Vale',Dublin:'Dublin',Methven:'Methven'};
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  let activeDestination='Cardiff';
  const compactDate=value=>{
    if(!/^\d{4}-\d{2}-\d{2}$/.test(String(value||'')))return '';
    const date=new Date(value+'T12:00:00');
    return Number.isFinite(date.getTime())?new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short'}).format(date):'';
  };
  function personalise(){
    const user=window.PintAuth?.currentUser;
    const device=window.PintProfile?.load();
    const rawName=String(user?.displayName||device?.name||'').trim();
    const firstName=rawName.split(/\s+/)[0];
    const hour=new Date().getHours();
    const greeting=hour<12?'Good morning':hour<17?'Good afternoon':'Good evening';
    const greet=$('home-greeting');
    if(greet)greet.textContent=firstName?greeting+', '+firstName:greeting;
    const avatar=$('home-avatar'),label=$('home-account-label');
    if(avatar)avatar.textContent=(rawName||'P').slice(0,1).toUpperCase();
    if(label)label.textContent=user?'My profile':device?'Your profile':'Set up profile';
  }
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
  function render({destination='Cardiff',pubs=[],reviews=[],connected=false,favourites=[]}={}){
    activeDestination=names[destination]?destination:'Cardiff';
    const chosen=names[activeDestination];
    const inArea=pubs.filter(p=>p.region===activeDestination);
    const count=inArea.length;
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
    const subtitle=$('home-community-note');
    if(subtitle)subtitle.textContent=connected?'Latest shared reviews in '+chosen:'Latest available reviews in '+chosen+' · Cached feed';
    const root=$('home-feed-list');
    if(root){
      const lookup=new Map(pubs.map(p=>[p.id,p]));
      const recent=reviews.filter(r=>lookup.has(r.pubId)&&Number.isFinite(Number(r.rating)))
        .sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))||String(b.createdAt||'').localeCompare(String(a.createdAt||''))).slice(0,3);
      root.innerHTML=recent.length?recent.map(review=>{
        const pub=lookup.get(review.pubId);
        const author=String(review.reviewerName||'PINT member').trim();
        const stars=Math.min(5,Math.max(1,Number(review.rating)));
        return '<button class="home-activity" type="button" data-home-review-pub="'+escapeHtml(pub.id)+'" aria-label="View '+escapeHtml(pub.name)+'">'
          +'<span class="home-activity-avatar" aria-hidden="true">'+escapeHtml(author[0]?.toUpperCase()||'P')+'</span>'
          +'<span class="home-activity-copy"><strong>'+escapeHtml(pub.name)+'</strong>'
          +'<span>'+escapeHtml(author)+' <span class="home-activity-sep">·</span> '+escapeHtml(compactDate(review.date))+'</span></span>'
          +'<span class="home-activity-rating">'+stars.toFixed(1)+' <span aria-hidden="true">★</span></span>'
          +'</button>';
      }).join(''):'<div class="home-empty-feed"><strong>No reviews here yet</strong><span>Be the first to share a visit in '+escapeHtml(chosen)+'.</span><a href="#my-pints">Open community <span aria-hidden="true">↗</span></a></div>';
    }
    personalise();
  }
  document.addEventListener('pint:auth-changed',personalise);
  document.addEventListener('pint:profile-updated',personalise);
  personalise();
  window.PintHome={render};
})();