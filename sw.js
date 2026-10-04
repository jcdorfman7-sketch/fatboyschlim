const CACHE='fatboyschlim-v172';
const ASSETS=['./','./index.html','./styles.css?v=1.5','./v1.6.css?v=1.6','./v1.7.css?v=1.7','./v1.7.1.css?v=1.7.1','./app.js?v=1.5','./v1.6.js?v=1.6','./v1.7.js?v=1.7','./v1.7.1.js?v=1.7.1','./manifest.webmanifest','./v1.7.2.css?v=1.7.2'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('message',e=>{if(e.data==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',e=>{if(e.request.mode==='navigate'){e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.match('./index.html')));return}e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)))});
