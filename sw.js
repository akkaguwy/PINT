const CACHE_NAME='pint-offline-v4.36';
const CORE=['./','./index.html','./styles.css?v=4.5','./features.css?v=4.34','./polish.css?v=4.5','./pub_identity.css?v=4.5','./pub_identity.js?v=4.8','./profile.js?v=4.11','./firebase_auth.js?v=4.5','./profile.css?v=4.5','./home.css?v=4.34','./home.js?v=4.34','./update.css?v=4.5','./theme.css?v=4.19','./games.css?v=4.28','./app.js?v=4.36','./shortlists.js?v=4.20','./dublin_directory.js?v=4.36','./dublin_explore.js?v=4.5','./navigation.js?v=4.29','./recaps.js?v=4.32','./recaps.css?v=4.32','./darts.js?v=4.28','./bingo.js?v=4.25','./gallery.js?v=4.19','./shared.js?v=4.24','./feedback.js?v=4.24','./pub_golf.js?v=4.19','./custom_golf.js?v=4.19','./photos.js','./pwa.js?v=4.6','./vendor/leaflet/leaflet.css?v=4.34','./manifest.webmanifest','./icons/pint-180.png','./icons/pint-192.png','./icons/pint-512.png'];
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