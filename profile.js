/* PINT device profiles. This is deliberately NOT authentication. */
(() => {
  'use strict';
  const KEY='pint-device-profile-v1', OWN='pint-my-review-ids-v1';
  const safe=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const initials=name=>String(name||'P').trim().split(/\s+/).slice(0,2).map(w=>w[0]?.toUpperCase()||'').join('')||'P';
  function load(){
    try{
      const obj=JSON.parse(localStorage.getItem(KEY)||'null');
      if(obj&&typeof obj.id==='string'&&typeof obj.name==='string')return obj;
    }catch{}
    return null;
  }
  function ids(){
    try{const a=JSON.parse(localStorage.getItem(OWN)||'[]');return Array.isArray(a)?a.filter(x=>typeof x==='string'):[]}catch{return []}
  }
  function saveName(name){
    name=String(name||'').trim().replace(/\s+/g,' ').slice(0,40);
    if(name.length<2)throw Error('Choose a display name with at least two characters');
    const profile=load()||{id:crypto.randomUUID(),createdAt:new Date().toISOString()};
    profile.name=name;
    localStorage.setItem(KEY,JSON.stringify(profile));
    localStorage.setItem('pint-reviewer-name',name);
    renderHeader();
    document.dispatchEvent(new Event('pint:profile-updated'));
    return profile;
  }
  function record(reviewId){
    if(typeof reviewId!=='string'||!reviewId)return;
    const current=ids();
    if(!current.includes(reviewId)){
      current.unshift(reviewId);
      try{localStorage.setItem(OWN,JSON.stringify(current.slice(0,5000)))}catch{}
    }
    document.dispatchEvent(new Event('pint:profile-updated'));
  }
  function renderHeader(){
    const profile=load(),root=document.getElementById('profile-header');
    if(!root)return;
    document.getElementById('profile-avatar').textContent=initials(profile?.name);
    document.getElementById('profile-name').textContent=profile?.name||'Your PINT profile';
    document.getElementById('profile-description').textContent=profile?'Your display name is shown on new reviews.':'Choose a display name to get started.';
    const input=document.getElementById('profile-display-name');
    if(input&&document.activeElement!==input)input.value=profile?.name||localStorage.getItem('pint-reviewer-name')||'';
  }
  function author(name){
    return '<span class="review-user-avatar" aria-hidden="true">'+safe(initials(name))+'</span><span class="review-user-name">'+safe(name||'Anonymous visitor')+'</span>';
  }
  function render(reviews=[],getPub=()=>null){
    renderHeader();
    const container=document.getElementById('profile-review-list'),count=document.getElementById('profile-review-count');
    if(!container)return;
    const mine=new Set(ids());
    const own=reviews.filter(review=>mine.has(review.id))
      .sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
    if(count)count.textContent=own.length+' '+(own.length===1?'review':'reviews');
    container.innerHTML=own.length?own.map(review=>{
      const pub=getPub(review.pubId);
      const name=pub?.name||'Unknown pub',where=pub?.region||'';
      const score=Number(review.rating);
      return '<article class="profile-review"><div class="profile-review-top"><strong>'+safe(name)+'</strong><b>'+ (Number.isFinite(score)?score.toFixed(1)+' ★':'—')+'</b></div><div class="profile-review-meta">'+safe(where)+(where?' · ':'')+safe(review.date||'')+'</div>'+(review.notes?'<p>'+safe(review.notes)+'</p>':'')+'<div class="profile-review-photos" data-own-review="'+safe(review.id)+'"></div><small>'+(review.shared?'Shared review':'Saved on this device')+'</small></article>';
    }).join(''):'<div class="profile-empty">Your reviews will appear here after you post them from this device. Older reviews cannot be claimed by matching a display name.</div>';
    own.forEach(async review=>{
      const element=[...container.querySelectorAll('[data-own-review]')].find(node=>node.dataset.ownReview===review.id);
      if(!element)return;
      try{
        const urls=review.shared?window.PintShared.photoUrls(review):await window.PintPhotos.read(review.id);
        if(!element.isConnected)return;
        urls.slice(0,3).forEach((src,index)=>{
          const img=document.createElement('img');
          img.src=src;img.loading='lazy';
          img.alt='Your review photo '+(index+1);
          element.appendChild(img);
        });
      }catch{}
    });
  }
  document.getElementById('profile-form')?.addEventListener('submit',event=>{
    event.preventDefault();
    const input=document.getElementById('profile-display-name');
    const status=document.getElementById('profile-message');
    try{const p=saveName(input.value);status.textContent='Display name saved: '+p.name}
    catch(err){status.textContent=err.message}
  });
  document.getElementById('profile-review-button')?.addEventListener('click',()=>document.getElementById('journal-log-button')?.click());
  renderHeader();
  window.PintProfile={load,saveName,record,render,author,initials};
})();
