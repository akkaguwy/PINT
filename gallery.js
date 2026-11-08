(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const grid=$('gallery-grid'),region=$('gallery-region'),more=$('gallery-more');
  const dialog=$('photo-dialog'),image=$('photo-full'),caption=$('photo-gallery-caption'),pubButton=$('photo-gallery-pub');
  const pageSize=24;
  const safe=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  let photos=[],shown=[],limit=pageSize,signature='',connected=false,initial=true,activePubId;
  const timestamp=review=>Number(review.createdAt)||Date.parse(review.createdAt||review.date)||0;
  const meta=photo=>[photo.author,photo.date].filter(Boolean).join(' · ');

  function display(){
    const filtered=region.value==='all'?photos:photos.filter(photo=>photo.region===region.value);
    shown=filtered.slice(0,limit);
    const next=JSON.stringify(shown);
    if(next!==signature){
      grid.innerHTML=shown.map((photo,i)=>`<button type="button" class="gallery-card" data-gallery-photo="${i}" aria-label="Open photo ${photo.number} of ${safe(photo.name)} · ${safe(meta(photo))}">
        <span class="gallery-image"><img src="${safe(photo.src)}" alt="" loading="lazy" decoding="async" /><small hidden>Photo unavailable</small></span>
        <strong>${safe(photo.name)}</strong><small>${safe(meta(photo))}</small>
      </button>`).join('');
      signature=next;
    }
    more.hidden=shown.length>=filtered.length;
    $('gallery-status').textContent=filtered.length
      ?filtered.length+' '+(filtered.length===1?'photo':'photos')+(connected?'':' · Saved photo listings')
      :initial?'Loading community photos…':connected?'No shared photos here yet.':'Photo listings are unavailable. Try again when connected.';
  }
  function render({pubs,reviews,connected:online,initial:loading}){
    const venues=new Map(pubs.map(pub=>[pub.id,pub]));
    photos=[...reviews].filter(review=>Number(review.photoCount)>0)
      .sort((a,b)=>timestamp(b)-timestamp(a))
      .flatMap(review=>{
        const pub=venues.get(review.pubId);
        return window.PintShared.photoUrls(review).map((src,index)=>({
          src,number:index+1,pubId:pub?.id,region:pub?.region,name:pub?.name||'Pub review',
          author:review.reviewerName||'PINT member',date:review.date
        }));
      });
    connected=online;
    initial=loading;
    display();
  }
  region.addEventListener('change',()=>{limit=pageSize;display()});
  more.addEventListener('click',()=>{
    const firstNew=shown.length;
    limit+=pageSize;
    display();
    grid.querySelector('[data-gallery-photo="'+firstNew+'"]')?.focus();
  });
  grid.addEventListener('error',event=>{
    if(event.target.tagName!=='IMG')return;
    event.target.hidden=true;
    event.target.nextElementSibling.hidden=false;
  },true);
  grid.addEventListener('click',event=>{
    const button=event.target.closest('[data-gallery-photo]');
    if(!button)return;
    const photo=shown[Number(button.dataset.galleryPhoto)];
    if(!photo)return;
    activePubId=photo.pubId;
    $('photo-gallery-credit').textContent=photo.name+' · '+meta(photo);
    pubButton.hidden=!activePubId;
    caption.hidden=false;
    image.alt='Review photo from '+photo.name;
    image.src=photo.src;
    dialog.showModal();
  });
  pubButton.addEventListener('click',()=>{
    if(!activePubId)return;
    const id=activePubId;
    dialog.close();
    location.hash='pub='+encodeURIComponent(id);
  });
  dialog.addEventListener('close',()=>{
    activePubId=undefined;
    caption.hidden=true;
    image.alt='Pub review photo';
  });
  window.PintGallery={render};
})();
