const CACHE_NAME='pint-offline-v4.14';
const CORE=['./','./index.html','./styles.css','./features.css?v=4.14','./polish.css','./pub_identity.css','./pub_identity.js','./profile.js','./firebase_auth.js','./profile.css','./home.css','./home.js','./update.css','./app.js?v=4.14','./dublin_directory.js','./dublin_explore.js','./navigation.js','./shared.js?v=4.13','./pub_golf.js','./custom_golf.js?v=4.14','./photos.js','./pwa.js','./manifest.webmanifest','./icons/pint-180.png','./icons/pint-192.png','./icons/pint-512.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()))
});
self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([
    caches.keys().then(names=>Promise.all(names.filter(n=>n.startsWith('pint-offline-')&&n!==CACHE_NAME).map(n=>caches.delete(n)))),
    self.clients.claim()
  ]))
});
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
  const isDocument=request.mode==='navigate';
  const isAppAsset=/\.(?:js|css|html)$/.test(url.pathname);
  if(isDocument||isAppAsset){
    // Critical fix: HTML and scripts must prefer the latest deployed version.
    event.respondWith(fetch(request,{cache:'no-store'}).then(response=>{
      if(response.ok){const clone=response.clone();event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put(request,clone)))}
      return response
    }).catch(async()=>await caches.match(request)||await caches.match('./index.html')||Response.error()));
    return;
  }
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{
    if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put(request,copy)))}
    return response
  })));
});