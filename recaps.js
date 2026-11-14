/* Shared night albums. The unguessable night link grants access to the album. */
(() => {
  'use strict';
  const API='https://pint-live-data-akka.akkaguwy.chatgpt.site';
  const $=id=>document.getElementById(id),safe=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const storage={get(k,f){try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
  let chosenFile=null;
  let nights=storage.get('pint-recap-nights',[]),current=null,signature='',busy=false,loading=false,requestId=crypto.randomUUID(),createId=crypto.randomUUID(),previewURL,selectedFile=null;
  const form=$('recap-moment-form'),status=$('recap-status'),fileInput=$('recap-media');
  const localTime=date=>{const d=new Date(date);return new Date(d-d.getTimezoneOffset()*60000).toISOString().slice(0,16)};
  function message(s){status.textContent=s}
  function link(id){const u=new URL(location.href);u.search='';u.hash='';u.searchParams.set('screen','recaps');u.searchParams.set('night',id);return u.href}
  async function call(path,body){const r=await fetch(API+path,{method:body?'POST':'GET',headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined,cache:'no-store',signal:AbortSignal.timeout(20000)});const v=await r.json();if(!r.ok)throw Error(v.error||'Request failed');return v}
  $('recap-venues').innerHTML=(typeof window.PintDirectory?.pubs==='function'?window.PintDirectory.pubs():[]).map(p=>`<option value="${safe(p.name)}"></option>`).join('');
  function list(){ $('recap-saved').innerHTML=nights.length?nights.map(n=>`<button class="button button-outline" type="button" data-night="${safe(n.id)}">${safe(n.title)}</button>`).join(''):'<p class="small-print">No nights saved in this app yet. Join with a link or start one below.</p>';const last=nights[0];$('home-recap-label').textContent=last?'Revisit '+last.title:'What happened last night?'; }
  function remember(n){nights=[n,...nights.filter(x=>x.id!==n.id)].slice(0,30);storage.set('pint-recap-nights',nights);list()}
  function timeline(moments){const next=JSON.stringify(moments);if(next===signature)return;signature=next;
    $('recap-summary').textContent=`${moments.length} moments · ${moments.filter(m=>m.mediaType==='image/jpeg').length} photos · ${moments.filter(m=>m.mediaType.startsWith('video/')).length} videos`;
    $('recap-timeline').innerHTML=moments.length?moments.map(m=>{const src=API+'/api/recaps/media/'+current.id+'/'+m.id;return `<article class="recap-card"><div class="recap-card-head"><time datetime="${new Date(m.occurredAt).toISOString()}">${safe(new Date(m.occurredAt).toLocaleString(undefined,{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}))}</time><strong>${safe(m.venue||'Somewhere on the night')}</strong><small>Added by ${safe(m.author)}</small></div>${m.mediaType==='image/jpeg'?`<a href="${src}" target="_blank" rel="noopener"><img src="${src}" alt="${safe(m.note||'Night photo')}" loading="lazy" /></a>`:m.mediaType?`<video controls playsinline preload="metadata" src="${src}"></video><p><a href="${src}" target="_blank" rel="noopener">Open video ↗</a></p>`:''}${m.note?`<p>${safe(m.note)}</p>`:''}</article>`}).join(''):'<p class="recap-empty">The night starts here. Add the first photo, video or memory.</p>';
  }
  async function load(id,quiet=false){if(loading)return false;loading=true;if(!quiet)message('Loading your night…');try{const v=await call('/api/recaps?id='+encodeURIComponent(id));if(current?.id!==id){signature='';current=v.night;}remember(v.night);$('recap-album').hidden=false;$('recap-title').textContent=v.night.title;$('recap-share-link').value=link(id);timeline(v.moments);if(!quiet)message('');return true;}catch(e){message(e.message+' Your upload has not been cleared.');return false;}finally{loading=false}}
  function invitedNightId(input){
    const value=String(input||'').trim();
    if(/^[0-9a-f-]{36}$/i.test(value))return value;
    try{
      const url=new URL(value);
      const id=url.searchParams.get('night');
      return id&&/^[0-9a-f-]{36}$/i.test(id)?id:null;
    }catch{return null}
  }
  $('recap-join').addEventListener('submit',async e=>{
    e.preventDefault();
    if(busy||loading){message('Finish the current action before joining another night.');return}
    const id=invitedNightId(e.target.elements.invite.value);
    if(!id){message('Paste a valid PINT night invitation link.');return}
    const button=e.submitter||e.target.querySelector('button[type="submit"]');
    button.disabled=true;
    try{
      if(await load(id)){
        const url=new URL(location.href);
        url.searchParams.set('screen','recaps');
        url.searchParams.set('night',id);
        history.replaceState(history.state,'',url);
        e.target.reset();
        message('Joined! This night is saved in My nights on this device. You can now add photos and memories.');
      }
    }finally{button.disabled=false}
  });
  $('recap-create').addEventListener('submit',async e=>{e.preventDefault();if(busy){message('Wait for your upload to finish.');return}const b=e.submitter;b.disabled=true;message('Creating night…');try{const v=await call('/api/recaps',{id:createId,title:e.target.elements.title.value.trim()});createId=crypto.randomUUID();e.target.reset();await load(v.night.id);const u=new URL(location.href);u.searchParams.set('night',v.night.id);history.replaceState(history.state,'',u);}catch(e){message(e.message)}finally{b.disabled=false}});
  $('recap-saved').addEventListener('click',e=>{const id=e.target.closest('[data-night]')?.dataset.night;if(id){if(busy){message('Wait for your upload to finish.');return}const u=new URL(location.href);u.searchParams.set('night',id);history.replaceState(history.state,'',u);load(id)}});
  $('recap-share').addEventListener('click',async()=>{if(!current)return;const url=link(current.id);try{if(navigator.share)await navigator.share({title:current.title,text:'Add your photos, videos and memories to our PINT night.',url});else{await navigator.clipboard.writeText(url);message('Night link copied. Send it to your mates.')}}catch(e){if(e.name!=='AbortError'){ $('recap-share-link').focus();$('recap-share-link').select();message('Copy the night link below.')}}});
  $('recap-refresh').addEventListener('click',()=>current&&load(current.id));
  const previews=$('recap-preview');function clearPreview(){if(previewURL)URL.revokeObjectURL(previewURL);previewURL=null;previews.replaceChildren()}
  function chooseMedia(e){
    const f=e.target.files?.[0];
    if(!f)return; // Cancelling the camera must not discard an earlier attachment.
    const isPhoto=f.type.startsWith('image/');
    const maxMB=isPhoto?20:30;
    if(f.size>maxMB*1024*1024){message('Choose a '+(isPhoto?'photo':'video')+' of '+maxMB+' MB or less.');e.target.value='';return}
    requestId=crypto.randomUUID();clearPreview();chosenFile=f;
    previewURL=URL.createObjectURL(f);
    const el=document.createElement(f.type.startsWith('video/')?'video':'img');
    el.src=previewURL;if(el.tagName==='VIDEO'){el.controls=true;el.playsInline=true}else el.alt='Selected photo';
    previews.append(el);
    const label=document.createElement('p');label.textContent=f.name+' · '+(f.size/1024/1024).toFixed(1)+' MB';previews.append(label);
    message(isPhoto?'Photo ready. Tap Add moment to upload it to this night.':'Video ready. Tap Add moment to upload it to this night.');
  }
  [fileInput,$('recap-camera-photo'),$('recap-camera-video')].forEach(el=>el.addEventListener('change',chooseMedia));
  $('recap-remove-media').addEventListener('click',()=>{fileInput.value='';$('recap-camera-photo').value='';$('recap-camera-video').value='';chosenFile=null;clearPreview();requestId=crypto.randomUUID()});
  form.addEventListener('input',()=>{requestId=crypto.randomUUID()});
  form.elements.author.value=storage.get('pint-recap-author','')||window.PintProfile?.load()?.name||'';
  form.elements.occurredAt.value=localTime(Date.now());
  form.addEventListener('submit',async e=>{e.preventDefault();if(!current||busy)return;const file=chosenFile,note=form.elements.note.value.trim();if(!file&&!note){message('Add a photo, video or note.');return}busy=true;const fields=[...form.elements];fields.forEach(el=>el.disabled=true);$('recap-progress').hidden=false;const progress=$('recap-progress');progress.value=0;message('Preparing your moment…');
    try{const data=new FormData();data.set('id',requestId);data.set('nightId',current.id);['author','venue','note'].forEach(k=>data.set(k,form.elements[k].value.trim()));data.set('occurredAt',String(new Date(form.elements.occurredAt.value).getTime()));if(file){if(file.type.startsWith('image/')){const jpeg=await window.PintPhotos.resize(file);data.set('media',await(await fetch(jpeg)).blob(),'photo.jpg')}else data.set('media',file)}
      await new Promise((resolve,reject)=>{const xhr=new XMLHttpRequest();xhr.open('POST',API+'/api/recaps/moments');xhr.timeout=180000;xhr.upload.onprogress=e=>{if(e.lengthComputable){progress.value=Math.round(e.loaded/e.total*100);message('Uploading '+progress.value+'%…')}};xhr.onload=()=>{let v;try{v=JSON.parse(xhr.responseText)}catch{}if(xhr.status>=200&&xhr.status<300)resolve();else reject(Error(v?.error||'Upload failed. Tap Add moment to retry.'))};xhr.onerror=()=>reject(Error('Connection lost. Tap Add moment to retry.'));xhr.ontimeout=()=>reject(Error('Upload timed out. Tap Add moment to retry.'));xhr.send(data)});
      storage.set('pint-recap-author',form.elements.author.value);form.elements.note.value='';fileInput.value='';$('recap-camera-photo').value='';$('recap-camera-video').value='';chosenFile=null;clearPreview();requestId=crypto.randomUUID();form.elements.occurredAt.value=localTime(Date.now());await load(current.id,true);message('Moment added for everyone ✓');
    }catch(e){message(e.message)}finally{busy=false;fields.forEach(el=>el.disabled=false);progress.hidden=true}
  });
  function fromURL(){const id=new URL(location.href).searchParams.get('night');if(id&&/^[0-9a-f-]{36}$/i.test(id)&&current?.id!==id)load(id)}
  document.addEventListener('pint:screen-change',e=>{if(e.detail.screen==='recaps'){fromURL();if(!current&&nights[0])load(nights[0].id)}});window.addEventListener('popstate',fromURL);
  setInterval(()=>{if(current&&!busy&&!document.hidden&&document.body.dataset.screen==='recaps')load(current.id,true)},20000);
  window.addEventListener('beforeunload',e=>{if(busy){e.preventDefault();e.returnValue=''}});list();fromURL();
})();
