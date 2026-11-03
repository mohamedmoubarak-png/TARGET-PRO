// يخزن الملفات عشان التطبيق يشتغل من غير نت
// الصفحات والسكربتات والمحتوى: من النت الأول (عشان أي تعديل يوصل على طول) ولو مفيش نت أو النت بطيء من الكاش
// الصور والخطوط: من الكاش الأول (مش بتتغير)
const C='ej-v5';
const FILES=['./','./index.html','./app.js','./data.js','./packs.js','./lessons.js','./version.js','./pen.js','./practice.js','./manifest.webmanifest','./notes/grammar.html','./notes/pron.html',
 './icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png','./icons/apple-touch-icon.png','./icons/favicon-64.png'];
const NET_WAIT=3500;
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C&&k!=='ej-meta').map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// طلبات no-store (فحص التحديث) ما بتتخزنش، عشان الكاش يفضل متطابق مع النسخة اللي شغالة
function put(r,res){if(r.cache!=='no-store'&&res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}
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

// ---------- التذكير اليومي ----------
// المتصفح بيصحّي التطبيق من وقت للتاني (Periodic Background Sync على أندرويد بعد التثبيت).
// لو عدّى ميعاد التذكير والروتين أقل من 3 حاجات وما ظهرش إشعار النهارده، بيظهر إشعار.
function dstr(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
async function remind(){const c=await caches.open('ej-meta'),r=await c.match('./__meta');if(!r)return;const m=await r.json();if(!m.on)return;
 const now=new Date(),d=dstr(now),[h,mi]=String(m.t||'20:00').split(':').map(Number);
 if(now.getHours()*60+now.getMinutes()<h*60+mi||m.shown===d)return;const done=(m.done&&m.done[d])||0;if(done>=3)return;
 await self.registration.showNotification('رحلة الإنجليزي ✨',{body:done?'خلصت '+done+' من 6 في روتين النهارده. كمّل حاجة كمان!':'لسه ما بدأتش روتين النهارده. 20 دقيقة بطاقات بتفرق.',
  icon:'icons/icon-192.png',badge:'icons/favicon-64.png',tag:'ej-remind',lang:'ar',dir:'rtl',data:{url:'./index.html#today'}});
 m.shown=d;await c.put('./__meta',new Response(JSON.stringify(m),{headers:{'Content-Type':'application/json'}}))}
self.addEventListener('periodicsync',e=>{if(e.tag==='ej-remind')e.waitUntil(remind())});
self.addEventListener('notificationclick',e=>{e.notification.close();const url=(e.notification.data&&e.notification.data.url)||'./index.html#today';
 e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>{const w=ws[0];return w?w.focus():self.clients.openWindow(url)}))});
