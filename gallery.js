(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const grid=$('gallery-grid'),region=$('gallery-region'),more=$('gallery-more');
  const dialog=$('photo-dialog'),image=$('photo-full'),caption=$('photo-gallery-caption'),pubButton=$('photo-gallery-pub');
  const previous=$('gallery-prev'),nextButton=$('gallery-next'),position=$('gallery-position');
  const pageSize=24;
  const safe=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  let photos=[],filtered=[],shown=[],limit=pageSize,signature='',connected=false,initial=true;
  let viewerPhotos=[],viewerIndex=0,swipe;
  const timestamp=review=>Number(review.createdAt)||Date.parse(review.createdAt||review.date)||0;
  const meta=photo=>[photo.author,photo.date].filter(Boolean).join(' · ');

  function display(){
    filtered=region.value==='all'?photos:photos.filter(photo=>photo.region===region.value);
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
  function showPhoto(index){
    const photo=viewerPhotos[index];
    if(!photo)return;
    viewerIndex=index;
    $('photo-gallery-credit').textContent=[photo.name,meta(photo)].filter(Boolean).join(' · ');
    pubButton.hidden=!photo.pubId;
    position.textContent=(index+1)+' of '+viewerPhotos.length;
    previous.setAttribute('aria-disabled',String(index===0));
    nextButton.setAttribute('aria-disabled',String(index===viewerPhotos.length-1));
    image.alt='Review photo from '+photo.name;
    image.src=photo.src;
  }
  function move(offset){showPhoto(viewerIndex+offset)}
  grid.addEventListener('click',event=>{
    const button=event.target.closest('[data-gallery-photo]');
    if(!button)return;
    const index=Number(button.dataset.galleryPhoto);
    if(!shown[index])return;
    // Keep the current sequence steady while shared reviews refresh in the background.
    viewerPhotos=filtered;
    caption.hidden=false;
    dialog.classList.add('gallery-viewer');
    showPhoto(index);
    dialog.showModal();
  });
  previous.addEventListener('click',()=>move(-1));
  nextButton.addEventListener('click',()=>move(1));
  dialog.addEventListener('keydown',event=>{
    if(!viewerPhotos.length||event.altKey||event.ctrlKey||event.metaKey)return;
    if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
    event.preventDefault();
    move(event.key==='ArrowLeft'?-1:1);
  });
  image.addEventListener('pointerdown',event=>{
    if(!viewerPhotos.length||event.pointerType==='mouse'||!event.isPrimary)return;
    swipe={id:event.pointerId,x:event.clientX,y:event.clientY};
    image.setPointerCapture(event.pointerId);
  });
  image.addEventListener('pointerup',event=>{
    if(!swipe||swipe.id!==event.pointerId)return;
    const dx=event.clientX-swipe.x,dy=event.clientY-swipe.y;
    swipe=undefined;
    if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.4)move(dx<0?1:-1);
  });
  image.addEventListener('pointercancel',()=>{swipe=undefined});
  pubButton.addEventListener('click',()=>{
    const id=viewerPhotos[viewerIndex]?.pubId;
    if(!id)return;
    dialog.close();
    location.hash='pub='+encodeURIComponent(id);
  });
  dialog.addEventListener('close',()=>{
    viewerPhotos=[];
    swipe=undefined;
    caption.hidden=true;
    dialog.classList.remove('gallery-viewer');
    image.alt='Pub review photo';
  });
  window.PintGallery={render};
})();
