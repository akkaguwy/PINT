const CACHE_NAME='pint-offline-v2.4';
const CORE=['./','./index.html','./styles.css','./features.css','./app.js','./pub_golf.js','./photos.js','./pwa.js','./manifest.webmanifest','./icons/pint-180.png','./icons/pint-192.png','./icons/pint-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(Promise.all([caches.keys().then(names=>Promise.all(names.filter(name=>name.startsWith('pint-offline-')&&name!==CACHE_NAME).map(name=>caches.delete(name)))),self.clients.claim()]))});
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put('./',copy))}return response}).catch(()=>caches.match('./index.html').then(cached=>cached||caches.match('./'))));
    return;
  }
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,copy))}return response})));
});
