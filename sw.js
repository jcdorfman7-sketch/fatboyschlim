const STATIC='fatboyschlim-v190-static';
const MEDIA='fatboyschlim-v190-media';
const STATIC_ASSETS=[
'./','./index.html','./manifest.webmanifest',
'./styles.css?v=1.5','./v1.6.css?v=1.6','./v1.7.css?v=1.7','./v1.7.2.css?v=1.7.2',
'./v1.7.3.css?v=1.7.3','./v1.8.css?v=1.8','./v1.8.1.css?v=1.8.1','./v1.8.2.css?v=1.8.2',
'./v1.8.3b.css?v=1.8.3b','./v1.9.css?v=1.9.0',
'./app.js?v=1.5','./v1.6.js?v=1.6','./v1.7.js?v=1.7','./v1.9.js?v=1.9.0'
];

self.addEventListener('install',e=>e.waitUntil(
  caches.open(STATIC).then(c=>c.addAll(STATIC_ASSETS)).then(()=>self.skipWaiting())
));

self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(k=>![STATIC,MEDIA].includes(k)).map(k=>caches.delete(k))))
  .then(()=>self.clients.claim())
));

self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;

  if(req.mode==='navigate'){
    e.respondWith(fetch(req,{cache:'no-store'}).catch(()=>caches.match('./index.html')));
    return;
  }

  if(req.destination==='image'){
    e.respondWith(
      caches.open(MEDIA).then(async c=>{
        const hit=await c.match(req);
        if(hit)return hit;
        try{
          const res=await fetch(req);
          if(res.ok||res.type==='opaque')c.put(req,res.clone());
          return res;
        }catch(err){return hit||Response.error()}
      })
    );
    return;
  }

  const url=new URL(req.url);
  if(url.origin===location.origin){
    e.respondWith(
      caches.open(STATIC).then(async c=>{
        const hit=await c.match(req);
        const net=fetch(req).then(res=>{if(res.ok)c.put(req,res.clone());return res}).catch(()=>hit);
        return hit||net;
      })
    );
  }
});
