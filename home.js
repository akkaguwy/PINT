/* PINT home dashboard — real destination counts and real community reviews. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const names={Cardiff:'Cardiff',Vale:'the Vale',Dublin:'Dublin',Methven:'Methven'};
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  let activeDestination='Cardiff';
  const compactDate=value=>{
    if(!value)return '';
    const date=new Date(value);
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
  $('home-feed-list')?.addEventListener('error',event=>{
    if(event.target.matches('.home-activity-avatar img'))event.target.remove();
  },true);
  function render({destination='Cardiff',pubs=[],reviews=[],connected=false,addedPubs=[]}={}){
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
    if(subtitle)subtitle.textContent=connected?'Latest reviews, photos and pubs from the PINT community':'Saved community activity · updates when connected';
    const root=$('home-feed-list');
    if(root){
      const lookup=new Map(pubs.map(pub=>[pub.id,pub]));
      const events=[
        ...reviews.filter(review=>lookup.has(review.pubId)&&Number(review.rating)>=1&&Number(review.rating)<=5)
          .map(review=>({pub:lookup.get(review.pubId),review,date:review.createdAt||review.date})),
        ...addedPubs.filter(pub=>lookup.has(pub.id)&&pub.createdAt).map(pub=>({pub,date:pub.createdAt}))
      ];
      const time=value=>Number(value)||Date.parse(value)||0;
      const recent=events.sort((a,b)=>time(b.date)-time(a.date)).slice(0,5);
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
      }).join(''):'<div class="home-empty-feed"><strong>No reviews here yet</strong><span>Be the first to share a visit.</span><a href="#my-pints">Open community <span aria-hidden="true">↗</span></a></div>';
    }
    personalise();
  }
  document.addEventListener('pint:auth-changed',personalise);
  document.addEventListener('pint:profile-updated',personalise);
  personalise();
  window.PintHome={render};
})();