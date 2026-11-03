// يخزن الملفات عشان التطبيق يشتغل من غير نت
// الصفحات والسكربتات والمحتوى: من النت الأول (عشان أي تعديل يوصل على طول) ولو مفيش نت أو النت بطيء من الكاش
// الصور والخطوط: من الكاش الأول (مش بتتغير)
const C='ej-v3';
const FILES=['./','./index.html','./app.js','./data.js','./packs.js','./lessons.js','./manifest.webmanifest','./notes/grammar.html','./notes/pron.html',
 './icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png','./icons/apple-touch-icon.png','./icons/favicon-64.png'];
const NET_WAIT=3500;
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
function put(r,res){if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}
function fromCache(r){return caches.match(r,{ignoreSearch:true}).then(hit=>hit||(r.mode==='navigate'?caches.match('./index.html'):undefined))}
function cacheFirst(r){return caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>put(r,res)))}
function networkFirst(r){
 const net=fetch(r).then(res=>put(r,res));net.catch(()=>{});
 const slow=new Promise(ok=>setTimeout(ok,NET_WAIT)).then(()=>fromCache(r));
 return Promise.race([net,slow]).then(x=>x||net).catch(()=>fromCache(r).then(hit=>hit||Response.error()))}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);const font=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
 if(u.origin!==location.origin&&!font)return;
 const asset=font||/\.(png|jpe?g|svg|ico|webp|woff2?)$/i.test(u.pathname);
 e.respondWith(asset?cacheFirst(r):networkFirst(r))});
