// ===== الكتابة بالقلم (S Pen) =====
// إملاء كلمات وجمل بخط الإيد على سطور زي الكراسة (4 خطوط).
// - الخط بيتقل ويخف حسب ضغط القلم.
// - أول ما القلم يلمس الشاشة، لمس الإيد بيتجاهل (palm rejection) فتقدر تسند إيدك.
// - زرار القلم الجانبي (لو الجهاز بيبعته للمتصفح) بيمسح.
// مفيش تعرّف تلقائي على الخط: بتكتب من دماغك، وبعدين التطبيق يرسم الإجابة الصح فوق كتابتك وانت تقيّم نفسك.
// الملف ده لازم يتحمّل قبل app.js، وكل اللي فيه دوال بتشتغل وقت الاستخدام.
const HW_FONT='"Andika","Segoe UI",Arial,sans-serif';
let PS=null; // جلسة التمرين الحالية
const PEN={st:[],cur:null,er:false,penSeen:false,dpr:1,w:0,h:0,rows:1,ink:'#2C2C2C'};

function hwState(){if(!S.hw)S.hw={miss:{},n:0,ok:0};return S.hw}
function hwKey(t){return String(t).trim().toLowerCase()}
function cssVar(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

// ---------- مصادر التمرين ----------
function hwWordPool(miss){
 if(miss)return Object.values(hwState().miss).map(x=>({t:x.t,m:x.m,e:x.e||''}));
 const A=allWords().filter(c=>c.w.length<=30),started=A.filter(c=>S.cards[c.id]);
 // الكلمات اللي بدأتها في البطاقات، ولو لسه قليلة نزود باقة الأسبوع
 const base=started.length>=10?started:started.concat(A.filter(c=>!S.cards[c.id]&&c.pk===curWeek()));
 return (base.length?base:A).map(c=>({t:c.w,m:c.m,e:c.e}))}
function hwSentPool(){const w=curWeek(),out=[];
 DIALOGS[w].k.forEach(k=>{if(k[0].split(' ').length>=3&&!/\.\.\./.test(k[0]))out.push({t:k[0],m:k[1]})});
 PHRASES.forEach(g=>g.p.forEach(p=>out.push({t:p[0],m:p[1]})));
 (TEXTS[w].p.join(' ').replace(/\b(Mr|Mrs|Ms|Dr)\./g,'$1#').match(/[^.!?]+[.!?]+/g)||[]).forEach(s=>{
  s=s.trim().replace(/#/g,'.');const n=s.split(/\s+/).length;if(n>=4&&n<=12&&!/[“”"]/.test(s))out.push({t:s,m:''})});
 return out}
// الأخطاء القديمة الأول، والباقي عشوائي
function hwPick(pool,n){const miss=hwState().miss,seen=new Set(),out=[];
 shuffle(pool.slice()).sort((a,b)=>(miss[hwKey(b.t)]?1:0)-(miss[hwKey(a.t)]?1:0)).forEach(x=>{const k=hwKey(x.t);if(!seen.has(k)&&out.length<n){seen.add(k);out.push(x)}});
 return out}

// ---------- الشاشة الرئيسية ----------
function vPen(){const h=hwState(),miss=Object.keys(h.miss).length,acc=h.n?Math.round(h.ok/h.n*100)+'%':'—';
 shell('الكتابة بالقلم',`<div class="hero"><small>✍️ <span class="en">S Pen</span> · خط الإيد</small><h2>اكتب بإيدك، تفتكر أكتر</h2><div class="ln">التطبيق بيقولك الكلمة أو الجملة بالصوت والمعنى، وانت تكتبها بالقلم على سطور زي الكراسة من غير ما تشوفها، وبعدين تقارن بالصح. الكتابة بالإيد بتثبّت الإملا أكتر من الكيبورد.</div></div>
 <div class="stats" style="margin-top:12px"><div class="stat"><b>${h.n}</b><span>كتبت</span></div><div class="stat"><b>${acc}</b><span>صح</span></div><div class="stat"><b>${miss}</b><span>محتاج تمرين</span></div><div class="stat"><b>${allWords().filter(c=>S.cards[c.id]).length}</b><span>من بطاقاتك</span></div></div>
 <div class="h2">اختار التمرين</div>
 <button class="week" onclick="penStart('w')"><div class="n en">Aa</div><div class="tt"><b>إملاء كلمات</b><small>10 كلمات من البطاقات اللي بدأتها وباقة الأسبوع</small></div></button>
 ${miss?`<button class="week cur" onclick="penStart('miss')"><div class="n">↺</div><div class="tt"><b>أخطائي في الكتابة</b><small>${miss} كلمة غلطت فيها قبل كده</small></div></button>`:''}
 <button class="week" onclick="penStart('s')"><div class="n">“ ”</div><div class="tt"><b>إملاء جمل</b><small>5 جمل من حوار ونص الأسبوع وبنك العبارات</small></div></button>
 <button class="week" onclick="penStart('t')"><div class="n">✎</div><div class="tt"><b>تحسين الخط (نقل)</b><small>الجملة بتظهر باهتة على السطور وانت تكتب فوقها</small></div></button>
 <div class="card small" style="margin-top:12px"><span class="lbl">نصايح للـ <span class="en">S Pen</span></span>
 • أول ما تكتب بالقلم، لمسة الإيد بتبطل ترسم، فتقدر تسند إيدك على الشاشة براحتك.<br>
 • جرّب تدوس زرار القلم الجانبي وانت بتكتب: على أغلب الأجهزة بيمسح. وفيه زرار ممحاة كمان.<br>
 • اكتب بحروف منفصلة (<span class="en">print</span>): الحروف الصغيرة زي <span class="en">a</span> و<span class="en">e</span> بين الخط المنقّط والخط الملوّن، والطويلة زي <span class="en">b</span> و<span class="en">l</span> بتطلع لفوق، و<span class="en">g</span> و<span class="en">y</span> بتنزل لتحت.<br>
 • احفظ صفحتك صورة بزرار ⬇ وابعتهالي أصحح خطك وإملاك.</div>`,'axes')}
function penStart(mode){const words=mode==='w'||mode==='miss';
 const items=hwPick(words?hwWordPool(mode==='miss'):hwSentPool(),words?10:mode==='t'?4:5);
 if(!items.length)return toast('مفيش كلمات للتمرين لسه. ابدأ البطاقات الأول');
 PS={mode,words,trace:mode==='t',items,i:0,res:[],shown:false,hint:0};go('penrun')}
function penQuit(){PS=null;go('pen')}

// ---------- شاشة التمرين ----------
function vPenRun(){if(!PS)return vPen();if(PS.i>=PS.items.length)return penSummary();
 const it=PS.items[PS.i],n=PS.items.length,three=/–/.test(it.t);
 shell('الكتابة بالقلم',`<div class="row small muted" style="margin-bottom:8px"><span style="flex:1">${PS.trace?'تحسين الخط':PS.words?'إملاء كلمات':'إملاء جمل'} · ${PS.i+1} من ${n}</span><button class="btn sm ghost" onclick="penQuit()">خروج</button></div>
 <div class="bar" style="margin-bottom:10px"><i style="width:${PS.i/n*100}%"></i></div>
 <div class="card pq">${PS.trace?'<div class="small muted">اكتب فوق الجملة الباهتة، وخلي الحروف على السطور</div>':`<div class="pm">${it.m?esc(it.m):'اسمع الجملة واكتبها'}</div>${three?'<div class="small muted">اكتب التصريفات التلاتة</div>':''}`}
  <div class="row" style="justify-content:center;margin-top:8px"><button class="btn sm" onclick="speak(PS.items[PS.i].t,.85)">🔊 اسمع</button>${PS.words?'<button class="btn sm ghost" onclick="penHint()">💡 تلميح</button>':'<button class="btn sm ghost" onclick="speak(PS.items[PS.i].t,.6)">🐢 أبطأ</button>'}</div>
  <div class="phint en" id="phint"></div></div>
 <div class="pad" id="pad" dir="ltr"><canvas id="guide" aria-hidden="true"></canvas><canvas id="ink" aria-label="مساحة الكتابة"></canvas></div>
 <div class="ptools"><button class="btn sm ghost" onclick="penUndo()">↶ تراجع</button><button class="btn sm ghost" id="erb" onclick="penEraser()">🧽 ممحاة</button><button class="btn sm ghost" onclick="penClear()">🗑 مسح</button><button class="btn sm ghost" onclick="penSave()" aria-label="احفظ صورة">⬇ صورة</button></div>
 <div class="small muted" id="penhint" style="text-align:center;margin:6px 0 10px">${PEN.penSeen?'✓ القلم شغال · لمسة الإيد مش بترسم':'اكتب بالقلم أو بصباعك'}</div>
 <div id="pans"></div>
 <div id="pact">${PS.trace?'<button class="btn full" onclick="penNext(null)">اللي بعده ←</button>':'<button class="btn full" onclick="penReveal()">قارن بالصح ✓</button>'}</div>`,'axes');
 PEN.st=[];PEN.cur=null;PEN.er=false;PEN.rows=PS.words?2:4;penLayout();
 if(document.fonts&&document.fonts.load)document.fonts.load('40px Andika').then(()=>{if($('#guide'))penGuides()}).catch(()=>{});
 if(!PS.trace)setTimeout(()=>{if(PS&&PS.items[PS.i]===it)speak(it.t,.85)},300)}
function penHint(){if(!PS)return;PS.hint=Math.min(2,PS.hint+1);const t=PS.items[PS.i].t;
 // أول ضغطة: عدد الحروف · التانية: أول حرف في كل كلمة
 $('#phint').textContent=t.split(' ').map(w=>w.split('').map((ch,i)=>/[A-Za-z]/.test(ch)?(PS.hint>1&&i===0?ch:'_'):ch).join(' ')).join('   ')}
function penReveal(){if(!PS||PS.shown)return;PS.shown=true;const it=PS.items[PS.i];penGuides();
 $('#pans').innerHTML=`<div class="card pa"><div class="small muted">الصح (مرسوم بالأخضر تحت كتابتك)</div><div class="hw">${esc(it.t)}</div>${it.e?`<div class="ex2">${esc(it.e)}</div>`:''}</div>`;
 $('#pact').innerHTML='<div class="row"><button class="btn" style="flex:1;background:var(--bad)" onclick="penNext(false)">✗ غلطت</button><button class="btn" style="flex:1;background:var(--ok)" onclick="penNext(true)">✓ كتبتها صح</button></div>';
 speak(it.t,.85)}
function penNext(ok){const it=PS.items[PS.i];
 if(ok!==null){const h=hwState(),k=hwKey(it.t);h.n++;
  if(ok){h.ok++;const m=h.miss[k];if(m&&++m.c>=2)delete h.miss[k]}else h.miss[k]={t:it.t,m:it.m||'',e:it.e||'',c:0};
  PS.res.push({t:it.t,ok});save()}
 PS.i++;PS.shown=false;PS.hint=0;vPenRun()}
function penSummary(){const n=PS.res.length,ok=PS.res.filter(r=>r.ok).length,bad=PS.res.filter(r=>!r.ok);
 if(!PS.done){PS.done=1;const t=today();S.days[t]=S.days[t]||{};S.days[t].write=true;save()}
 shell('الكتابة بالقلم',`<div class="card" style="text-align:center"><h2 style="color:var(--head);margin:4px 0">${PS.trace?'خلصت تمرين الخط 👏':`${ok} من ${n} صح`}</h2>
 <p class="small muted">${PS.trace?'كرره 5 دقايق كل يوم وهتلاحظ الفرق في خطك.':bad.length?'اللي غلطت فيه اتحفظ في «أخطائي في الكتابة»، وهيطلعلك تاني لحد ما تكتبه صح مرتين.':'ممتاز! كله صح.'} واتعلّم بند الكتابة في روتين النهارده.</p>
 ${bad.length?`<div style="text-align:start">${bad.map(r=>`<div class="wl"><span class="hw" style="font-size:22px;color:var(--text)">${esc(r.t)}</span><button class="say" onclick="speak(${esc(JSON.stringify(r.t))})" aria-label="اسمع">🔊</button></div>`).join('')}</div>`:''}
 <div class="row" style="justify-content:center;margin-top:12px"><button class="btn" onclick="penStart('${bad.length&&!PS.trace?'miss':PS.mode}')">${bad.length&&!PS.trace?'اتمرن على أخطائك':'تمرين تاني'}</button><button class="btn ghost" onclick="penQuit()">رجوع</button></div></div>`,'axes')}

// ---------- الورقة والقلم ----------
function penLayout(){const pad=$('#pad');if(!pad)return;const g=$('#guide'),k=$('#ink'),dpr=window.devicePixelRatio||1,w=pad.clientWidth,R=PS&&!PS.words?92:108,h=R*PEN.rows;
 Object.assign(PEN,{dpr,w,h,ink:cssVar('--text')||'#2C2C2C'});pad.style.height=h+'px';
 [g,k].forEach(c=>{c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);c.style.width=w+'px';c.style.height=h+'px';c.getContext('2d').setTransform(dpr,0,0,dpr,0,0)});
 penGuides();penRedraw();penBind(k)}
// 4 خطوط لكل سطر: فوق (الحروف الطويلة)، منقّط (نص الحرف الصغير)، ملوّن (خط الأساس)، تحت (g, y, p)
function penGuides(){const g=$('#guide');if(!g)return;const c=g.getContext('2d'),w=PEN.w,R=PEN.h/PEN.rows,L=cssVar('--line'),B=cssVar('--head');c.clearRect(0,0,w,PEN.h);
 const ln=(y,col,lw,dash)=>{c.beginPath();c.setLineDash(dash);c.strokeStyle=col;c.lineWidth=lw;c.moveTo(0,y);c.lineTo(w,y);c.stroke()};
 for(let i=0;i<PEN.rows;i++){const t=i*R;ln(t+R*.18,L,1,[]);ln(t+R*.42,L,1,[6,6]);ln(t+R*.66,B,1.4,[]);ln(t+R*.9,L,1,[2,5])}
 c.setLineDash([]);const it=PS&&PS.items[PS.i];
 if(it&&(PS.trace||PS.shown))penText(c,it.t,PS.trace?.22:.4,PS.trace?PEN.ink:cssVar('--ok'))}
function penText(c,text,alpha,color){const w=PEN.w,R=PEN.h/PEN.rows,pad=12;let fs=Math.round(R*.48),lines=[text];
 c.save();c.globalAlpha=alpha;c.fillStyle=color;c.textBaseline='alphabetic';c.direction='ltr';c.textAlign='left'; // الصفحة عربي، والكانفاس بياخد اتجاهها لو ما حددناش
 // نوزّع الكلام على السطور، ولو مش هيكفي نصغّر الخط
 for(;fs>14;fs-=2){c.font=`${fs}px ${HW_FONT}`;lines=wrapText(c,text,w-pad*2);if(lines.length<=PEN.rows&&lines.every(l=>c.measureText(l).width<=w-pad*2))break}
 lines.slice(0,PEN.rows).forEach((l,i)=>c.fillText(l,pad,i*R+R*.66));c.restore()}
function wrapText(c,t,max){const out=[];let cur='';t.split(' ').forEach(wd=>{const s=cur?cur+' '+wd:wd;if(!cur||c.measureText(s).width<=max)cur=s;else{out.push(cur);cur=wd}});if(cur)out.push(cur);return out}
function penPt(cv,e){const r=cv.getBoundingClientRect();let p=e.pointerType==='pen'?e.pressure:.5;if(!(p>0))p=.5;return[e.clientX-r.left,e.clientY-r.top,p]}
function penBind(cv){
 cv.onpointerdown=e=>{
  if(e.pointerType==='pen'&&!PEN.penSeen){PEN.penSeen=true;const h=$('#penhint');if(h)h.textContent='✓ القلم شغال · لمسة الإيد مش بترسم'}
  if(e.pointerType==='touch'&&PEN.penSeen)return; // palm rejection
  e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(x){}
  PEN.cur={er:PEN.er||!!(e.buttons&34),pts:[penPt(cv,e)],id:e.pointerId};PEN.st.push(PEN.cur);penSeg(cv.getContext('2d'),PEN.cur,0)};
 cv.onpointermove=e=>{const s=PEN.cur;if(!s||e.pointerId!==s.id)return;e.preventDefault();const c=cv.getContext('2d');
  const ev=e.getCoalescedEvents?e.getCoalescedEvents():[];(ev.length?ev:[e]).forEach(x=>{s.pts.push(penPt(cv,x));penSeg(c,s,s.pts.length-1)})};
 cv.onpointerup=cv.onpointercancel=e=>{const s=PEN.cur;if(!s||e.pointerId!==s.id)return;penTail(cv.getContext('2d'),s);PEN.cur=null}}
function penStyle(c,s){c.lineCap='round';c.lineJoin='round';if(s.er){c.globalCompositeOperation='destination-out';c.strokeStyle=c.fillStyle='#000'}else{c.globalCompositeOperation='source-over';c.strokeStyle=c.fillStyle=PEN.ink}}
const penW=(s,p)=>s.er?22:1.2+p*3.6; // سُمك الخط حسب الضغط
// بيرسم الجزء اللي بينتهي عند النقطة i (منحنى ناعم بين نصّات النقط)
function penSeg(c,s,i){const P=s.pts;c.save();penStyle(c,s);
 if(i===0){c.beginPath();c.arc(P[0][0],P[0][1],penW(s,P[0][2])/2,0,7);c.fill()}
 else if(i===1){c.lineWidth=penW(s,P[1][2]);c.beginPath();c.moveTo(P[0][0],P[0][1]);c.lineTo((P[0][0]+P[1][0])/2,(P[0][1]+P[1][1])/2);c.stroke()}
 else{const a=P[i-2],b=P[i-1],d=P[i];c.lineWidth=penW(s,b[2]);c.beginPath();c.moveTo((a[0]+b[0])/2,(a[1]+b[1])/2);c.quadraticCurveTo(b[0],b[1],(b[0]+d[0])/2,(b[1]+d[1])/2);c.stroke()}
 c.restore()}
function penTail(c,s){const P=s.pts,n=P.length;if(n<2)return;const a=P[n-2],b=P[n-1];c.save();penStyle(c,s);c.lineWidth=penW(s,b[2]);c.beginPath();c.moveTo((a[0]+b[0])/2,(a[1]+b[1])/2);c.lineTo(b[0],b[1]);c.stroke();c.restore()}
function penRedraw(){const k=$('#ink');if(!k)return;const c=k.getContext('2d');c.clearRect(0,0,PEN.w,PEN.h);PEN.st.forEach(s=>{s.pts.forEach((_,i)=>penSeg(c,s,i));penTail(c,s)})}
function penUndo(){PEN.st.pop();penRedraw()}
function penClear(){PEN.st=[];penRedraw()}
function penEraser(){PEN.er=!PEN.er;const b=$('#erb');if(b)b.classList.toggle('on',PEN.er)}
function penSave(){const g=$('#guide'),k=$('#ink');if(!k)return;const c=document.createElement('canvas');c.width=k.width;c.height=k.height;const x=c.getContext('2d');
 x.fillStyle=cssVar('--card')||'#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(g,0,0);x.drawImage(k,0,0);
 c.toBlob(b=>{if(!b)return;const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='handwriting-'+today()+'.png';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);toast('اتحفظت الصورة ✓')},'image/png')}
window.addEventListener('resize',()=>{const p=$('#pad');if(p&&p.clientWidth!==PEN.w)penLayout()});
