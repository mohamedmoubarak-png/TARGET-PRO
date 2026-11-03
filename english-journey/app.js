// ===== رحلة الإنجليزي — المنطق =====
'use strict';
const KEY='ej_state_v1';
const LV_BANDS=[[0,30,'A1'],[31,40,'A2'],[41,50,'B1'],[51,60,'B2'],[61,70,'C1'],[71,100,'C2']];
const NEW_PER_DAY=15;

// ---------- التخزين ----------
function defState(){return{start:'',theme:'auto',level:'A2',days:{},mins:{},plan:{},cards:{},custom:[],newSeen:{},journal:{},scores:[],open:{},texts:{},drafts:{}}}
let S=defState();
function load(){try{const r=localStorage.getItem(KEY);if(r)S=Object.assign(defState(),JSON.parse(r))}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
load();
if(!S.start){S.start=today();save()}

// ---------- أدوات ----------
function today(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function addDays(ds,n){const d=new Date(ds+'T12:00:00');d.setDate(d.getDate()+n);return today(d)}
function diffDays(a,b){return Math.round((new Date(b+'T12:00:00')-new Date(a+'T12:00:00'))/864e5)}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function tx(s){return String(s==null?'':s).split(/((?:\((?=[A-Za-z]))?[A-Za-z0-9][A-Za-z0-9 .,'’\/&+()\-–:]*[A-Za-z0-9)]|[A-Za-z0-9])/).map((x,i)=>i%2?`<span class="en">${esc(x)}</span>`:esc(x)).join('')}
function $(s){return document.querySelector(s)}
function curWeek(){return Math.min(12,Math.max(1,Math.floor(diffDays(S.start,today())/7)+1))}
function dayInPlan(){return diffDays(S.start,today())+1}
function lvFromScore(s){for(const b of LV_BANDS)if(s>=b[0]&&s<=b[1])return b[2];return 'A1'}
function toast(m){document.querySelectorAll('.toast').forEach(x=>x.remove());const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),1800)}
function copy(txt){(navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(()=>toast('اتنسخ ✓')).catch(()=>{const a=document.createElement('textarea');a.value=txt;document.body.appendChild(a);a.select();try{document.execCommand('copy');toast('اتنسخ ✓')}catch(e){}a.remove()})}
function enVoices(){try{return speechSynthesis.getVoices().filter(v=>/^en(-|_)/i.test(v.lang))}catch(e){return[]}}
function utter(t,rate){const u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=rate||.9;const v=enVoices().find(v=>/US/i.test(v.lang));if(v)u.voice=v;return u}
function speak(txt,rate){try{speechSynthesis.cancel();speechSynthesis.speak(utter(txt,rate))}catch(e){toast('النطق مش متاح على الجهاز ده')}}
// النصوص الطويلة بتتقال جملة جملة عشان بعض المتصفحات بتقطع الصوت الطويل
function speakSeq(txt,rate){try{speechSynthesis.cancel();const t=String(txt).replace(/\b(Mr|Mrs|Ms|Dr)\./g,'$1');(t.match(/[^.!?]+[.!?]+["”')]*\s*|[^.!?]+$/g)||[t]).forEach(x=>{x=x.trim();if(x)speechSynthesis.speak(utter(x,rate))})}catch(e){toast('النطق مش متاح على الجهاز ده')}}
function stopSpeak(){try{speechSynthesis.cancel()}catch(e){}}
function beep(){try{const c=new (window.AudioContext||window.webkitAudioContext)();[0,.35,.7].forEach(t=>{const o=c.createOscillator(),g=c.createGain();o.frequency.value=880;o.connect(g);g.connect(c.destination);g.gain.setValueAtTime(.25,c.currentTime+t);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+t+.3);o.start(c.currentTime+t);o.stop(c.currentTime+t+.3)})}catch(e){}}
function dayDone(ds){const d=S.days[ds]||{};return ROUTINE.filter(r=>d[r.k]).length}
function streak(){let n=0,d=today();if(dayDone(d)<3)d=addDays(d,-1);while(dayDone(d)>=3){n++;d=addDays(d,-1)}return n}
function weekLinks(w){const L=LINKS[w]||{g:[],p:[]};return{g:L.g.map(a=>`<a href="notes/grammar.html#${a}">${tx(GNAMES[a]||a)}</a>`).join(' · '),p:L.p.map(a=>`<a href="notes/pron.html#${a}">${tx(PNAMES[a]||a)}</a>`).join(' · ')}}
function phaseLabel(){return 'المرحلة الأولى: <span class="en">A2 → B1</span>'}

// ---------- الأيقونات (خط بسيط) ----------
const IC={
 today:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17M8.5 14.5l2.2 2.2 4.8-4.7"/></svg>',
 axes:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/></svg>',
 words:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="6" y="3.5" width="14" height="17" rx="2.5"/><path d="M4 7v11.5A2.5 2.5 0 0 0 6.5 21M10 9h6M10 13h4"/></svg>',
 plan:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 19c3-1 4-6 8-7s4-5 8-7"/><circle cx="4" cy="19" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="20" cy="5" r="1.6"/></svg>',
 progress:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/></svg>',
};
const AXES=[
 {k:'grammar',t:'القواعد',s:'Grammar',ic:'Gr',d:'18 درس + 86 سؤال'},
 {k:'pron',t:'النطق',s:'Pronunciation',ic:'/ə/',d:'11 درس بالصوت'},
 {k:'words',t:'الكلمات',s:'Vocabulary',ic:'Aa',d:'باقة كل أسبوع + تكرار ذكي'},
 {k:'listen',t:'الاستماع',s:'Listening',ic:'♪',d:'نص كل أسبوع بالصوت + مصادر'},
 {k:'read',t:'القراءة',s:'Reading',ic:'¶',d:'12 نص بأسئلة فهم + مصادر'},
 {k:'speak',t:'الكلام',s:'Speaking',ic:'“ ”',d:'12 حوار + بنك العبارات'},
 {k:'write',t:'الكتابة',s:'Writing',ic:'✎',d:'9 نماذج + يوميات + تصحيح'},
];

// ---------- البطاقات (تكرار متباعد) ----------
// المصادر: أساسيات البنك (STARTER) + باقة لكل أسبوع (PACKS) + كلماتك. الـ id ثابت عشان التقدم ما يضيعش.
function starterWords(){return STARTER.map((w,i)=>({id:'s'+i,w:w[0],m:w[1],e:w[2],pk:0}))}
function packWords(P){return P.w.map((w,i)=>({id:'k'+P.wk+'_'+i,w:w[0],m:w[1],e:w[2],pk:P.wk}))}
function customWords(){return S.custom.map((w,i)=>w&&({id:'c'+i,w:w[0],m:w[1],e:w[2]||'',pk:-1})).filter(Boolean)}
function packOpen(wk){return wk<=curWeek()||!!S.open[wk]}
function allWords(){return starterWords().concat(...PACKS.filter(P=>packOpen(P.wk)).map(packWords),customWords())}
function everyWord(){return starterWords().concat(...PACKS.map(packWords),customWords())}
// الجديد بالترتيب: باقة الأسبوع الحالي، بعدها كلماتك، بعدها الباقي بالترتيب
function queue(){const t=today(),A=allWords(),cw=curWeek();const due=A.filter(c=>S.cards[c.id]&&S.cards[c.id].due<=t);
 const left=Math.max(0,NEW_PER_DAY-(S.newSeen[t]||0)),pri=c=>c.pk===cw?0:c.pk===-1?1:2;
 const fresh=A.filter(c=>!S.cards[c.id]).map((c,i)=>({c,i,p:pri(c)})).sort((a,b)=>a.p-b.p||a.i-b.i).map(x=>x.c).slice(0,left);return due.concat(fresh)}
function packStat(L){return{n:L.length,seen:L.filter(c=>S.cards[c.id]).length,fixed:L.filter(c=>S.cards[c.id]&&S.cards[c.id].ivl>=3).length}}
function rateCard(id,r){const t=today();let c=S.cards[id];
 if(!c){c={ivl:0,ease:2.5,reps:0,due:t};S.newSeen[t]=(S.newSeen[t]||0)+1}
 if(r===0){c.reps=0;c.ivl=0;c.ease=Math.max(1.3,c.ease-.2);c.due=t}
 else{if(r===1){c.ivl=Math.max(1,Math.round((c.ivl||1)*1.2));c.ease=Math.max(1.3,c.ease-.15)}
  else if(r===2){c.ivl=c.reps===0?1:c.reps===1?3:Math.round(c.ivl*c.ease)}
  else{c.ivl=c.reps===0?3:Math.round(Math.max(c.ivl,1)*c.ease*1.3);c.ease+=.15}
  c.reps++;c.due=addDays(t,c.ivl)}
 S.cards[id]=c;save()}
function learnedCount(){return Object.values(S.cards).filter(c=>c.ivl>=3).length}

// ---------- الهيكل ----------
let sess=null,timerInt=null,mediaRec=null,recUrl='',dl=null,tAns={};
function shell(title,body,tab){
 const nav=[['today','اليوم'],['axes','المحاور'],['words','الكلمات'],['plan','الخطة'],['progress','التقدم']];
 $('#app').innerHTML=`<header class="top"><img src="icons/icon-192.png" alt=""><h1>${title}</h1><button class="ib" onclick="go('prefs')" aria-label="الإعدادات">⚙</button></header>
 <main class="wrap">${body}</main>
 <nav class="nav">${nav.map(n=>`<button class="${tab===n[0]?'on':''}" onclick="go('${n[0]}')">${IC[n[0]]}${n[1]}</button>`).join('')}</nav>`;
 window.scrollTo(0,0)}
function go(h){sess=null;dl=null;if(location.hash==='#'+h)route();else location.hash=h}
function route(){if(timerInt){clearInterval(timerInt);timerInt=null}stopSpeak();if(dl&&location.hash!=='#dlg-'+dl.n)dl=null;
 const h=(location.hash||'#today').slice(1).split('-');
 const R={today:vToday,axes:vAxes,ax:()=>vAx(h[1]),words:vWords,plan:vPlan,week:()=>vWeek(+h[1]),progress:vProgress,prefs:vSettings,timer:()=>vTimer(h[1]),text:()=>vText(h[1]),dlg:()=>vDlg(h[1]),phrases:vPhrases,model:()=>vModel(h[1]),pack:()=>vPack(h[1])};
 (R[h[0]]||vToday)()}
window.addEventListener('hashchange',route);

// ---------- اليوم ----------
function vToday(){const t=today(),w=curWeek(),Wk=W[w],d=S.days[t]||{},L=weekLinks(w),q=queue().length;
 const done=dayDone(t),mins=ROUTINE.filter(r=>d[r.k]).reduce((a,r)=>a+r.m,0);
 const n=dayInPlan();
 const body=`
 <div class="hero"><small>${phaseLabel()} · الأسبوع ${w} من 12 · اليوم ${Math.max(1,n)}</small>
  <h2>${tx(Wk.t)}</h2>
  <div class="ln">📘 القواعد: ${L.g}<br>🔊 النطق: ${L.p}<br>🗂 الكلمات: ${tx(Wk.v)}<br>📄 نص الأسبوع: <a href="#text-${w}" class="en">${esc(TEXTS[w].t)}</a><br>🎭 حوار الأسبوع: <a href="#dlg-${w}" class="en">${esc(DIALOGS[w].t)}</a><br>🎧 كمان: ${tx(Wk.l)}</div></div>
 <div class="h2">روتين النهارده <span class="pill">${done}/6 · ${mins} دقيقة</span></div>
 <div class="bar" style="margin-bottom:12px"><i style="width:${done/6*100}%"></i></div>
 ${ROUTINE.map(r=>`<div class="task ${d[r.k]?'done':''}">
   <button class="chk" onclick="tick('${r.k}')" aria-label="تم">${d[r.k]?'✓':''}</button>
   <div class="tx" onclick="go('ax-${r.ax}')"><b>${r.t} <span class="muted small">${r.m} د</span></b><span>${r.k==='words'?`${q} بطاقة مستنية مراجعة`:tx(r.d)}</span></div>
   <button class="btn sm ghost" onclick="go('timer-${r.k}')" aria-label="مؤقت">⏱</button></div>`).join('')}
 <div class="stats" style="margin-top:12px">
  <div class="stat"><b>${streak()}</b><span>أيام متتالية</span></div>
  <div class="stat"><b>${learnedCount()}</b><span>كلمة ثابتة</span></div>
  <div class="stat"><b>${Object.keys(S.journal).filter(k=>S.journal[k].trim()).length}</b><span>يوم كتابة</span></div>
  <div class="stat"><b>${S.level}</b><span>مستواك</span></div></div>
 <div class="card" style="margin-top:12px"><span class="lbl">🎯 مهام الأسبوع ${w}</span>
  ${Wk.task.map((x,i)=>`<div class="wl"><span>${tx(x)}</span><button class="chk" style="width:24px;height:24px" onclick="ptick(${w},${i})" aria-label="تمت المهمة">${S.plan['w'+w+'t'+i]?'✓':''}</button></div>`).join('')}
  <div class="small muted" style="margin-top:6px">✅ علامة النجاح: ${tx(Wk.ck)}</div></div>
 ${needBackup()?`<div class="card" style="border-color:var(--gold)"><span class="lbl">💾 خد نسخة احتياطية</span><p class="small muted" style="margin:0 0 8px">${S.lastBackup?'آخر نسخة من '+diffDays(S.lastBackup,t)+' يوم':'لسه ما خدتش أي نسخة'}. كل تقدمك محفوظ على الموبايل ده بس.</p><button class="btn sm gold" onclick="exportData()">⬇ تصدير دلوقتي</button></div>`:''}
 <div class="small muted" style="text-align:center">يوم بيتحسب في السلسلة لو خلصت 3 حاجات على الأقل</div>`;
 shell('النهارده',body,'today');
 document.querySelectorAll('.task.done .chk').forEach(b=>b.style.color='#fff');
 document.querySelectorAll('.wl .chk').forEach(b=>{if(b.textContent){b.style.background='var(--ok)';b.style.borderColor='var(--ok)'}})}
function needBackup(){return Object.keys(S.days).length>=3&&(!S.lastBackup||diffDays(S.lastBackup,today())>=7)}
function tick(k){const t=today();S.days[t]=S.days[t]||{};S.days[t][k]=!S.days[t][k];save();if(dayDone(t)===6)toast('خلصت روتين النهارده كله 👏');route()}
function ptick(w,i){const k='w'+w+'t'+i;S.plan[k]=!S.plan[k];save();route()}

// ---------- المؤقت ----------
function vTimer(k){const r=ROUTINE.find(x=>x.k===k)||ROUTINE[0];let left=r.m*60,run=false,end=0;
 shell('مؤقت: '+r.t,`<div class="card" style="text-align:center"><span class="lbl">${r.t} · ${r.m} دقيقة</span><p class="muted">${tx(r.d)}</p>
  <div class="timer" id="tm">${fmt(left)}</div>
  <div class="row" style="justify-content:center;margin-top:10px"><button class="btn" id="tb">ابدأ</button><button class="btn ghost" onclick="go('ax-${r.ax}')">افتح المحور</button></div></div>
  <button class="btn ghost full" onclick="go('today')">→ رجوع لليوم</button>`,'today');
 const tb=$('#tb');tb.onclick=()=>{run=!run;tb.textContent=run?'إيقاف مؤقت':'كمّل';
  if(run){end=Date.now()+left*1000;timerInt=setInterval(()=>{left=Math.max(0,Math.round((end-Date.now())/1000));$('#tm').textContent=fmt(left);if(left<=0){clearInterval(timerInt);timerInt=null;beep();const t=today();S.days[t]=S.days[t]||{};S.days[t][k]=true;save();toast('الوقت خلص ✓ اتعلّمت');setTimeout(()=>go('today'),1200)}},500)}
  else{clearInterval(timerInt);timerInt=null}}}
function fmt(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}

// ---------- المحاور ----------
function vAxes(){shell('المحاور',`<p class="muted" style="margin-top:0">كل مهارة ليها مكانها. اختار المحور اللي هتشتغل عليه.</p>
 <div class="grid2">${AXES.map(a=>`<button class="ax" onclick="go('ax-${a.k}')"><div class="ic">${a.ic}</div><b>${a.t}</b><span class="en">${a.s}</span><br><span>${a.d}</span></button>`).join('')}</div>`,'axes')}
function vAx(k){const w=curWeek(),Wk=W[w],L=weekLinks(w);
 if(k==='words')return vWords();
 if(k==='grammar')return shell('القواعد',`<div class="card"><span class="lbl">درس الأسبوع ${w}</span><p>${tx(Wk.g)}</p><p>${L.g}</p></div>
  <a class="lnk" href="notes/grammar.html"><div class="ic" style="font-size:22px">📘</div><div><b>مذكرة القواعد كاملة</b><small>18 درس · حالات خادعة · كبسولة</small></div></a>
  <a class="lnk" href="notes/grammar.html#quiz"><div style="font-size:22px">✅</div><div><b>اختبار القواعد</b><small>86 سؤال بالشرح · راجع الغلط</small></div></a>
  ${promptCard(2)}`,'axes');
 if(k==='pron')return shell('النطق',`<div class="card"><span class="lbl">نطق الأسبوع ${w}</span><p>${tx(Wk.p)}</p><p>${L.p}</p></div>
  <a class="lnk" href="notes/pron.html"><div style="font-size:22px">🔊</div><div><b>مذكرة النطق كاملة</b><small>11 درس · كل كلمة بتسمعها</small></div></a>
  <a class="lnk" href="notes/pron.html#quiz"><div style="font-size:22px">✅</div><div><b>اختبار النطق</b><small>36 سؤال</small></div></a>
  <div class="card"><span class="lbl">اسمع أي كلمة أو جملة</span><input type="text" id="sx" dir="ltr" placeholder="Type a word or sentence"><div class="row" style="margin-top:8px"><button class="btn" onclick="speak($('#sx').value||'Hello')">🔊 اسمع</button><a class="btn ghost" target="_blank" rel="noopener" onclick="this.href='https://youglish.com/pronounce/'+encodeURIComponent($('#sx').value||'hello')+'/english'">YouGlish</a></div></div>`,'axes');
 if(k==='listen'||k==='read'){const t=today(),m=(S.mins[t]||{})[k]||0,tot=Object.values(S.mins).reduce((a,x)=>a+(x[k]||0),0);
  return shell(k==='listen'?'الاستماع':'القراءة',`${textCard(w,k)}<div class="card"><span class="lbl">${k==='listen'?'استماع الأسبوع':'قراءة الأسبوع'} ${w}</span><p>${tx(k==='listen'?Wk.l:Wk.task.find(x=>/قصة|مقال|قرا/.test(x))||'نص على مستواك كل يوم')}</p>
   <div class="row"><b style="flex:1">النهارده: ${m} دقيقة · المجموع: ${Math.round(tot/60*10)/10} ساعة</b></div>
   <div class="row" style="margin-top:8px">${[10,15,30].map(n=>`<button class="btn sm ghost" onclick="addMin('${k}',${n})">+${n} د</button>`).join('')}</div></div>
   <div class="card small"><span class="lbl">الطريقة</span>${k==='listen'?'١) اسمع من غير نص · ٢) اسمع بالنص وعلّم الكلمات الجديدة · ٣) اسمع تاني من غير نص · ٤) كرر 3 جمل بصوتك (shadowing)':'١) اقرا مرة للفكرة العامة · ٢) علّم 5 كلمات بس وضيفهم للبطاقات · ٣) لخّص الفقرة في جملتين في دفتر الكتابة'}</div>
   ${allTexts()}<div class="h2">المصادر</div>${RES[k].map(resRow).join('')}`,'axes')}
 if(k==='speak')return vSpeak();
 if(k==='write')return vWrite();
 vAxes()}
function resRow(r){return `<a class="lnk" href="${r.u}" target="_blank" rel="noopener">${r.lv?`<span class="pill lv en">${r.lv}</span>`:''}<div><b>${esc(r.n)}</b><small>${tx(r.d)}</small></div></a>`}
function addMin(k,n){addMinQ(k,n);route()}
function addMinQ(k,n){const t=today();S.mins[t]=S.mins[t]||{};S.mins[t][k]=(S.mins[t][k]||0)+n;
 const need=(ROUTINE.find(r=>r.k===k)||{m:30}).m;if(S.mins[t][k]>=need){S.days[t]=S.days[t]||{};S.days[t][k]=true}save()}
function fillP(p){return p.replace(/\{LV\}/g,S.level).replace(/\{G\}/g,W[curWeek()].g)}
function promptCard(i){const P=PROMPTS[i];return `<div class="card"><span class="lbl">💬 ${esc(P.t)} (معايا)</span><pre class="pr">${esc(fillP(P.p))}</pre><button class="btn sm gold" onclick="copy(fillP(PROMPTS[${i}].p))">انسخ وابعتهولي</button></div>`}

// ---------- الكلام ----------
function vSpeak(){const w=curWeek(),D=DIALOGS[w];shell('الكلام',`<a class="lnk hi" href="#dlg-${w}"><div style="font-size:24px">🎭</div><div><b>حوار الأسبوع ${w}: <span class="en">${esc(D.t)}</span></b><small>${esc(D.sit)}</small></div></a>
 <a class="lnk" href="#phrases"><div style="font-size:24px">💼</div><div><b>بنك العبارات</b><small>${PHRASES.reduce((a,g)=>a+g.p.length,0)} عبارة للشغل في ${PHRASES.length} مواقف</small></div></a>
 <div class="card" style="text-align:center"><span class="lbl">سجّل صوتك</span><p class="small muted">اتكلم دقيقتين عن موضوع الأسبوع، واسمع نفسك وقارن بالأصل.</p>
 <button class="rec" id="rb">● سجل</button><div id="pl"></div></div>
 <div class="card small"><span class="lbl">Shadowing في 4 خطوات</span>١) شغّل جملة قصيرة من حلقة الاستماع · ٢) وقّف وكررها بنفس السرعة والنغمة · ٣) سجّل نفسك · ٤) قارن وعيد الجملة اللي اتلخبطت فيها</div>
 ${allDlgs()}${PROMPTS.map((_,i)=>i===2?'':promptCard(i)).join('')}`,'axes');
 $('#rb').onclick=toggleRec}
async function toggleRec(){const b=$('#rb');
 if(mediaRec&&mediaRec.state==='recording'){mediaRec.stop();return}
 try{const st=await navigator.mediaDevices.getUserMedia({audio:true});const ch=[];mediaRec=new MediaRecorder(st);
  mediaRec.ondataavailable=e=>ch.push(e.data);
  mediaRec.onstop=()=>{st.getTracks().forEach(t=>t.stop());if(recUrl)URL.revokeObjectURL(recUrl);recUrl=URL.createObjectURL(new Blob(ch,{type:mediaRec.mimeType||'audio/webm'}));
   $('#pl').innerHTML=`<audio controls src="${recUrl}" style="width:100%;margin-top:8px"></audio><button class="btn sm ghost" style="margin-top:6px" onclick="markDone('speak')">✓ علّم الكلام اتعمل</button>`;b.classList.remove('on');b.textContent='● سجل'};
  mediaRec.start();b.classList.add('on');b.textContent='■ وقّف'}
 catch(e){toast('محتاج إذن المايك (والموقع لازم يكون https)')}}
function markDone(k){const t=today();S.days[t]=S.days[t]||{};S.days[t][k]=true;save();toast('اتعلّم ✓')}

// ---------- الكتابة ----------
function vWrite(){const t=today(),jtx=S.journal[t]||'',past=Object.keys(S.journal).filter(k=>k!==t&&S.journal[k].trim()).sort().reverse().slice(0,7);
 shell('الكتابة',`${modelCard()}<div class="card"><span class="lbl">يوميات ${t}</span><p class="small muted">5 جمل بس عن يومك. استعمل قاعدة الأسبوع: ${tx(W[curWeek()].g)}</p>
 <textarea id="jt" placeholder="Today I ...">${esc(jtx)}</textarea>
 <div class="row" style="margin-top:8px"><span class="muted small" id="wc" style="flex:1"></span><button class="btn sm gold" onclick="copyFix()">انسخ للتصحيح</button></div></div>
 ${past.length?`<div class="h2">اللي كتبته قبل كده</div>`+past.map(k=>`<div class="card"><span class="pill en">${k}</span><p class="en" style="white-space:pre-wrap;text-align:left;margin:6px 0 0">${esc(S.journal[k])}</p></div>`).join(''):''}${allModels()}`,'axes');
 const jt=$('#jt'),wc=()=>{const n=(jt.value.trim().match(/\S+/g)||[]).length;$('#wc').textContent=n+' كلمة'};wc();
 jt.oninput=()=>{S.journal[t]=jt.value;const n=(jt.value.trim().match(/\S+/g)||[]).length;if(n>=40){S.days[t]=S.days[t]||{};S.days[t].write=true}save();wc()}}
function copyFix(){const jv=($('#jt')||{}).value||'';if(!jv.trim())return toast('اكتب الأول');copy(`My level is ${S.level}. Correct my English below. Show each mistake, the correct version, and a short reason in Egyptian Arabic. Then give me a better version of the whole text at ${S.level==='A2'?'B1':S.level} level.\n\n${jv}`)}

// ---------- الكلمات ----------
function wordRow(c){return `<div class="wd"><div class="row" style="flex-wrap:nowrap"><span class="en ltr" style="flex:1;font-weight:700">${esc(c.w)}</span><button class="say" onclick="speak(${esc(JSON.stringify(c.w))})" aria-label="اسمع">🔊</button>${c.pk===-1?`<button class="say" onclick="delWord('${c.id}')" aria-label="امسح الكلمة">✕</button>`:''}</div><div class="small muted">${esc(c.m)}</div></div>`}
const BASICS={t:'أساسيات البنك والشغل',d:'حسابات، كروت، قروض، ديجيتال، خدمة العملاء، والشغل'};
function vWords(){const q=queue(),A=allWords(),mine=customWords(),cw=curWeek();
 const G=[{k:0,t:BASICS.t,list:starterWords(),open:true}].concat(PACKS.map(P=>({k:P.wk,t:P.t,list:packWords(P),open:packOpen(P.wk)})));
 shell('الكلمات',`<div class="stats"><div class="stat"><b>${q.length}</b><span>مستنية</span></div><div class="stat"><b>${Object.keys(S.cards).length}</b><span>بدأتها</span></div><div class="stat"><b>${learnedCount()}</b><span>ثابتة</span></div><div class="stat"><b>${A.length}</b><span>متاحة</span></div></div>
 <div class="card" style="margin-top:12px;text-align:center">${q.length?`<p style="margin-top:0">عندك <b>${q.length}</b> بطاقة النهارده (لحد ${NEW_PER_DAY} جديدة في اليوم، وباقة الأسبوع الأول)</p><button class="btn full" onclick="startDeck()">ابدأ المراجعة</button>`:`<p style="margin:0">خلصت بطاقات النهارده 👏 ارجع بكره، أو ضيف كلمات جديدة من القراءة والاستماع.</p>`}</div>
 <div class="card"><input type="text" id="wsr" dir="auto" placeholder="🔎 دوّر على كلمة أو معنى"><div id="wres"></div></div>
 <div class="h2">الباقات</div>
 ${G.map(g=>{const s=packStat(g.list);return `<button class="week ${g.k===cw?'cur':''}" onclick="go('pack-${g.k}')"><div class="n">${g.k||'★'}</div><div class="tt"><b>${esc(g.t)}</b><small>${g.open?`بدأت ${s.seen} من ${s.n} · ثابتة ${s.fixed}`:`بتفتح في الأسبوع ${g.k}`}</small></div><span class="pill">${g.open?s.n:'🔒'}</span></button>`}).join('')}
 <div class="card" style="margin-top:12px"><span class="lbl">➕ ضيف كلمة</span><input type="text" id="nw" dir="ltr" placeholder="word"><input type="text" id="nm" placeholder="المعنى" style="margin-top:6px"><input type="text" id="ne" dir="ltr" placeholder="Example sentence" style="margin-top:6px"><button class="btn sm" style="margin-top:8px" onclick="addWord()">ضيف</button></div>
 ${mine.length?`<div class="card"><span class="lbl">كلماتي (${mine.length})</span>${mine.slice().reverse().map(wordRow).join('')}</div>`:''}`,'words');
 $('#wsr').oninput=()=>{const v=$('#wsr').value.trim().toLowerCase();$('#wres').innerHTML=v.length<2?'':(everyWord().filter(c=>c.w.toLowerCase().includes(v)||c.m.includes(v)).slice(0,25).map(wordRow).join('')||'<p class="small muted" style="margin:8px 0 0">مفيش نتيجة. تقدر تضيفها تحت.</p>')}}
function vPack(k){k=+k||0;const P=k?PACKS.find(x=>x.wk===k):null;if(k&&!P)return vWords();
 const t=P?P.t:BASICS.t,d=P?P.d:BASICS.d,list=P?packWords(P):starterWords(),s=packStat(list),open=!P||packOpen(k);
 shell('الكلمات',`<div class="hero"><small>${P?'باقة الأسبوع '+k:'الأساسيات'}</small><h2>${esc(t)}</h2><div class="ln">${tx(d)}<br>${s.n} كلمة · بدأت ${s.seen} · ثابتة ${s.fixed}</div></div>
 ${open?'':`<div class="card" style="text-align:center;margin-top:12px"><p style="margin-top:0">الباقة دي بتفتح في الأسبوع ${k}. لو خلصت اللي قبلها، افتحها دلوقتي وكلماتها هتدخل المراجعة.</p><button class="btn gold" onclick="openPack(${k})">افتحها دلوقتي</button></div>`}
 <div class="card" style="margin-top:12px">${list.map(c=>{const r=S.cards[c.id];return `<div class="wd"><div class="row"><b class="en">${esc(c.w)}</b><span style="flex:1">${esc(c.m)}</span>${r?`<span class="pill">${r.ivl>=3?'ثابتة ✓':'بتتراجع'}</span>`:''}<button class="say" onclick="speak(${esc(JSON.stringify(c.w+'. '+c.e))})" aria-label="اسمع">🔊</button></div><div class="ex2">${esc(c.e)}</div></div>`}).join('')}</div>
 <button class="btn ghost full" onclick="go('words')">→ رجوع للكلمات</button>`,'words')}
function openPack(k){S.open[k]=true;save();toast('الباقة اتفتحت ✓ كلماتها هتدخل المراجعة');route()}
function addWord(){const w=$('#nw').value.trim(),m=$('#nm').value.trim(),e=$('#ne').value.trim();if(!w)return toast('اكتب الكلمة');
 if(everyWord().some(c=>c.w.toLowerCase()===w.toLowerCase()))return toast('الكلمة دي موجودة في الدفتر');S.custom.push([w,m,e]);save();toast('اتضافت ✓');route()}
function delWord(id){if(!confirm('تمسح الكلمة دي من الدفتر؟'))return;S.custom[+id.slice(1)]=null;delete S.cards[id];save();toast('اتمسحت');route()}
function startDeck(){sess={q:queue(),i:0,show:false,n:0};card()}
function card(){if(!sess||!sess.q.length){const t=today();S.days[t]=S.days[t]||{};S.days[t].words=true;save();
  shell('الكلمات',`<div class="card" style="text-align:center"><h2 style="color:var(--head)">خلصت المراجعة ✓</h2><p>راجعت ${sess?sess.n:0} بطاقة. اتعلّم بند الكلمات في روتين النهارده.</p><button class="btn" onclick="go('today')">رجوع لليوم</button></div>`,'words');sess=null;return}
 const c=sess.q[0];
 shell('الكلمات',`<div class="row small muted" style="margin-bottom:8px"><span style="flex:1">فاضل ${sess.q.length}</span><span>${S.cards[c.id]?'مراجعة':'<span class="pill">جديدة</span>'}</span></div>
 <div class="fc" onclick="flip()"><div class="w"${c.w.length>22?' style="font-size:22px"':''}>${esc(c.w)}</div>${sess.show?`<div class="m">${esc(c.m)}</div><div class="ex">${esc(c.e)}</div>`:'<div class="muted small">فكر في المعنى، وبعدين اضغط</div>'}
 <div><button class="say" onclick="event.stopPropagation();speak(${esc(JSON.stringify(c.w+(sess.show&&c.e?'. '+c.e:'')))})">🔊 اسمع</button></div></div>
 ${sess.show?`<div class="rate"><button class="r0" onclick="rate(0)">تاني<small>نسيتها</small></button><button class="r1" onclick="rate(1)">صعبة<small>بالعافية</small></button><button class="r2" onclick="rate(2)">تمام<small>فاكرها</small></button><button class="r3" onclick="rate(3)">سهلة<small>جدًا</small></button></div>`:`<button class="btn full" style="margin-top:12px" onclick="flip()">اظهر المعنى</button>`}
 <button class="btn ghost full" style="margin-top:10px" onclick="go('words')">وقّف</button>`,'words')}
function flip(){if(!sess)return;sess.show=true;card()}
function rate(r){const c=sess.q.shift();rateCard(c.id,r);sess.n++;if(r===0)sess.q.push(c);sess.show=false;card()}

// ---------- الخطة ----------
function vPlan(){const cw=curWeek();
 shell('الخطة',`<div class="card"><span class="lbl">${phaseLabel()}</span><p class="small" style="margin:0">12 أسبوع · 2.5–3 ساعات في اليوم. الهدف الواقعي: B1 ثابت (أو B1+ بـ 3 ساعات). بعدها نبني المرحلة التانية B1 → B2.</p>
 <label class="f" for="sd">بدأت يوم</label><input type="date" id="sd" value="${S.start}" onchange="S.start=this.value||today();save();route()"></div>
 ${Object.keys(W).map(n=>{n=+n;const dn=W[n].task.filter((_,i)=>S.plan['w'+n+'t'+i]).length;return `<button class="week ${n===cw?'cur':''}" onclick="go('week-${n}')"><div class="n">${n}</div><div class="tt"><b>${tx(W[n].t)}</b><small>${tx(W[n].g)}</small></div><span class="pill">${dn}/${W[n].task.length}</span></button>`}).join('')}`,'plan')}
function vWeek(n){if(!W[n])return vPlan();const Wk=W[n],L=weekLinks(n);
 shell('الأسبوع '+n,`<div class="hero"><small>الأسبوع ${n}${n===curWeek()?' · الأسبوع الحالي':''}</small><h2>${tx(Wk.t)}</h2>
 <div class="ln">📘 ${tx(Wk.g)}<br>${L.g}<br>🔊 ${tx(Wk.p)}<br>${L.p}<br>🗂 ${tx(Wk.v)}<br>📄 <a href="#text-${n}" class="en">${esc(TEXTS[n].t)}</a> · 🎭 <a href="#dlg-${n}" class="en">${esc(DIALOGS[n].t)}</a><br>🎧 ${tx(Wk.l)}</div></div>
 <div class="h2">المهام</div>${Wk.task.map((x,i)=>{const on=S.plan['w'+n+'t'+i];return `<div class="task ${on?'done':''}"><button class="chk" onclick="ptick(${n},${i})" aria-label="تمت المهمة">${on?'✓':''}</button><div class="tx"><b style="font-weight:600">${tx(x)}</b></div></div>`}).join('')}
 <div class="card"><span class="lbl">✅ تنتقل للأسبوع اللي بعده لما</span>${tx(Wk.ck)}</div>
 <div class="row"><button class="btn ghost" style="flex:1" ${n<=1?'disabled':''} onclick="go('week-${n-1}')">→ السابق</button><button class="btn ghost" style="flex:1" ${n>=12?'disabled':''} onclick="go('week-${n+1}')">التالي ←</button></div>`,'plan')}

// ---------- التقدم ----------
function vProgress(){const sc=S.scores.slice().sort((a,b)=>a.d<b.d?-1:1);
 let active=0,totM=0;Object.keys(S.days).forEach(k=>{const n=dayDone(k);if(n>=3)active++;totM+=ROUTINE.filter(r=>S.days[k][r.k]).reduce((a,r)=>a+r.m,0)});
 shell('التقدم',`<div class="stats"><div class="stat"><b>${streak()}</b><span>سلسلة</span></div><div class="stat"><b>${active}</b><span>يوم شغال</span></div><div class="stat"><b>${Math.round(totM/6)/10}</b><span>ساعة</span></div><div class="stat"><b>${S.level}</b><span>المستوى</span></div></div>
 <div class="card" style="margin-top:12px"><span class="lbl">نتيجة EF SET</span><p class="small muted" style="margin-top:0">اعمل الاختبار في الأسبوع 1 و4 و8 و12 وسجّل النتيجة هنا (من 100).</p>
  <div class="row"><input type="number" id="es" min="0" max="100" placeholder="مثلاً 38" style="flex:1"><button class="btn" onclick="addScore()">سجّل</button></div>
  <a class="small" href="https://www.efset.org" target="_blank" rel="noopener">افتح EF SET ↗</a>
  ${sc.length?chart(sc):''}
  ${sc.map((x,i)=>`<div class="wl"><span class="en">${x.d}</span><b>${x.s} · ${lvFromScore(x.s)}</b><button class="say" onclick="delScore(${S.scores.indexOf(x)})">✕</button></div>`).join('')}</div>
 ${textsProgress()}<div class="card small"><span class="lbl">مفتاح المستويات</span><div class="lvk">${LV_BANDS.map(b=>`<span class="pill en">${b[2]}: ${b[0]}–${b[1]}</span>`).join('')}</div></div>
 <div class="card"><span class="lbl">آخر 28 يوم</span><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:5px;direction:ltr">${Array.from({length:28},(_,i)=>{const d=addDays(today(),i-27),n=dayDone(d);return `<div title="${d}" style="aspect-ratio:1;border-radius:6px;background:${n===0?'var(--soft)':n<3?'var(--gold-l)':n<6?'var(--gold)':'var(--red)'};border:1px solid var(--line)"></div>`}).join('')}</div></div>`,'progress')}
function chart(sc){const w=300,h=140,p=22,xs=i=>sc.length===1?w/2:p+i*(w-2*p)/(sc.length-1),ys=v=>h-p-(v/100)*(h-2*p);
 const lines=[30,40,50,60,70].map(v=>`<line x1="${p}" x2="${w-p}" y1="${ys(v)}" y2="${ys(v)}" stroke="var(--line)" stroke-dasharray="3 3"/><text x="2" y="${ys(v)+4}" font-size="9" fill="var(--muted)">${v}</text>`).join('');
 return `<svg class="chart" viewBox="0 0 ${w} ${h}" style="direction:ltr;margin-top:8px">${lines}<polyline fill="none" stroke="var(--red)" stroke-width="2.5" points="${sc.map((x,i)=>xs(i)+','+ys(x.s)).join(' ')}"/>${sc.map((x,i)=>`<circle cx="${xs(i)}" cy="${ys(x.s)}" r="4" fill="var(--gold)"/>`).join('')}</svg>`}
function addScore(){const v=+$('#es').value;if(!(v>=0&&v<=100)||$('#es').value==='')return toast('اكتب رقم من 0 لـ 100');S.scores.push({d:today(),s:v});S.level=lvFromScore(v);save();toast('مستواك دلوقتي '+S.level);route()}
function delScore(i){S.scores.splice(i,1);const l=S.scores.slice().sort((a,b)=>a.d<b.d?-1:1).pop();if(l)S.level=lvFromScore(l.s);save();route()}

// ---------- الإعدادات ----------
function vSettings(){shell('الإعدادات',`<div class="card"><label class="f" for="st" style="margin-top:0">تاريخ بداية الخطة</label><input type="date" id="st" value="${S.start}">
 <label class="f" for="lv">مستواك الحالي</label><select id="lv">${['A1','A2','B1','B2','C1','C2'].map(l=>`<option ${S.level===l?'selected':''}>${l}</option>`).join('')}</select>
 <label class="f" for="th">الشكل</label><select id="th"><option value="auto">حسب الجهاز</option><option value="light">فاتح</option><option value="dark">غامق</option></select>
 <button class="btn full" style="margin-top:12px" onclick="saveSet()">حفظ</button></div>
 <div class="card"><span class="lbl">نسخة احتياطية</span><p class="small muted" style="margin-top:0">كل حاجة محفوظة على الجهاز ده بس. خد نسخة كل أسبوع.</p>
 <div class="row"><button class="btn gold" onclick="exportData()">⬇ تصدير</button><button class="btn ghost" onclick="copy(JSON.stringify(S))">نسخ</button><label class="btn ghost">⬆ استيراد<input type="file" accept="application/json" hidden onchange="importData(this)"></label></div></div>
 <div class="card"><span class="lbl">أدوات مفيدة</span>${RES.tools.map(resRow).join('')}</div>
 <button class="btn ghost full" style="color:var(--bad)" onclick="resetAll(this)">مسح كل البيانات</button>`,'');
 $('#th').value=S.theme}
function saveSet(){S.start=$('#st').value||today();S.level=$('#lv').value;S.theme=$('#th').value;try{localStorage.removeItem('eng-theme');localStorage.removeItem('pron-theme')}catch(e){}applyTheme();save();toast('اتحفظ ✓')}
function applyTheme(){const r=document.documentElement;if(S.theme==='auto')r.removeAttribute('data-theme');else r.setAttribute('data-theme',S.theme)}
function exportData(){const b=new Blob([JSON.stringify(S,null,1)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='english-journey-'+today()+'.json';document.body.appendChild(a);a.click();S.lastBackup=today();save();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
function importData(inp){const f=inp.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(typeof d!=='object'||!d.days)throw 0;S=Object.assign(defState(),d);save();applyTheme();toast('اترجعت البيانات ✓');go('today')}catch(e){toast('الملف مش صالح')}};r.readAsText(f)}
let rsArm=0;function resetAll(b){if(!rsArm){rsArm=1;b.textContent='اضغط تاني للتأكيد: هيتمسح كل تقدمك';setTimeout(()=>{rsArm=0;if(b.isConnected)b.textContent='مسح كل البيانات'},4000);return}rsArm=0;S=defState();S.start=today();save();go('today');route()}

// ---------- نصوص الأسبوع (قراءة واستماع) ----------
function textCard(w,k){const T=TEXTS[w],r=S.texts[w];return `<a class="lnk hi" href="#text-${w}"><div style="font-size:24px">📄</div><div><b>نص الأسبوع ${w}: <span class="en">${esc(T.t)}</span></b><small>${k==='listen'?'اسمعه عادي وبطيء، وبعدين اقراه':'اقراه، اسمعه، وجاوب 5 أسئلة'} · ${r?'آخر نتيجة '+r.s+'/'+r.n:'لسه ما اتحلّش'}</small></div></a>`}
function allTexts(){return `<details class="card"><summary class="lbl">📚 كل النصوص (12) ▾</summary>${Object.keys(TEXTS).map(n=>{const r=S.texts[n];return `<a class="wl lk" href="#text-${n}"><span class="pill">${n}</span><span class="en" style="flex:1;text-align:start">${esc(TEXTS[n].t)}</span><span class="small muted">${r?r.s+'/'+r.n:'—'}</span></a>`}).join('')}</details>`}
function textsProgress(){return `<div class="card"><span class="lbl">نصوص الأسبوع: ${Object.keys(S.texts).length} من 12</span><div class="tgrid">${Object.keys(TEXTS).map(n=>{const r=S.texts[n];return `<a href="#text-${n}" class="stat"><b>${r?r.s+'/'+r.n:'—'}</b><span>نص ${n}</span></a>`}).join('')}</div></div>`}
function vText(n){n=+n;const T=TEXTS[n];if(!T)return vAx('read');const r=S.texts[n];tAns={};
 shell('القراءة والاستماع',`<div class="hero"><small>نص الأسبوع ${n} · مستوى <span class="en">${T.lv}</span></small><h2 class="en ltr">${esc(T.t)}</h2><div class="ln">📘 القاعدة اللي في النص: <span class="en">${esc(T.gr)}</span></div></div>
 <div class="card small" style="margin-top:12px"><span class="lbl">الطريقة</span>١) اسمع من غير ما تبص على النص · ٢) اسمع وانت بتقرا · ٣) جاوب الأسئلة · ٤) اقرا بصوت عالي وسجّل نفسك في محور الكلام</div>
 <div class="row" style="margin-bottom:12px"><button class="btn" style="flex:1" onclick="speakSeq(TEXTS[${n}].p.join(' '),.9)">🔊 اسمع</button><button class="btn ghost" style="flex:1" onclick="speakSeq(TEXTS[${n}].p.join(' '),.7)">🐢 أبطأ</button><button class="btn ghost" onclick="stopSpeak()" aria-label="وقّف الصوت">■</button></div>
 <div class="card rd">${T.p.map(p=>`<p>${esc(p)}</p>`).join('')}</div>
 <div class="card"><span class="lbl">🔑 كلمات من النص</span>${T.gl.map(g=>`<div class="wl"><span class="en" style="font-weight:700">${esc(g[0])}</span><span style="flex:1;text-align:start">${esc(g[1])}</span><button class="say" onclick="speak(${esc(JSON.stringify(g[0]))})" aria-label="اسمع">🔊</button><button class="say" onclick="addGloss(${esc(JSON.stringify(g[0]))},${esc(JSON.stringify(g[1]))})" aria-label="ضيفها للبطاقات">+</button></div>`).join('')}</div>
 <div class="h2">أسئلة الفهم ${r?`<span class="pill">آخر نتيجة ${r.s}/${r.n}</span>`:''}</div>
 ${T.q.map((q,i)=>`<div class="card"><b class="qq">${i+1}. ${esc(q[0])}</b>${q[1].map((o,j)=>`<button class="opt" id="o${i}_${j}" onclick="pick(${i},${j})">${esc(o)}</button>`).join('')}<div class="fbk small" id="fb${i}"></div></div>`).join('')}
 <button class="btn full" onclick="checkText(${n})">صحّح إجاباتي</button>
 <div class="row" style="margin-top:10px"><button class="btn ghost" style="flex:1" ${n<=1?'disabled':''} onclick="go('text-${n-1}')">→ السابق</button><button class="btn ghost" style="flex:1" ${n>=12?'disabled':''} onclick="go('text-${n+1}')">التالي ←</button></div>`,'axes')}
function pick(i,j){if(tAns.done)return;tAns[i]=j;document.querySelectorAll(`[id^="o${i}_"]`).forEach(b=>b.classList.toggle('on',b.id===`o${i}_${j}`))}
function checkText(n){const T=TEXTS[n];if(tAns.done)return;if(T.q.some((_,i)=>tAns[i]==null))return toast('جاوب كل الأسئلة الأول');
 let s=0;T.q.forEach((q,i)=>{const ok=tAns[i]===q[2];if(ok)s++;$(`#o${i}_${q[2]}`).classList.add('ok');if(!ok)$(`#o${i}_${tAns[i]}`).classList.add('bad');$('#fb'+i).innerHTML=/^[A-Za-z“"]/.test(q[3])?`<div class="ltr en">${ok?'✓':'✗'} ${esc(q[3])}</div>`:(ok?'✓ ':'✗ ')+tx(q[3])});
 tAns.done=1;const t=today(),first=!S.texts[n]||S.texts[n].d!==t;S.texts[n]={s,n:T.q.length,d:t};if(first)addMinQ('read',15);else save();
 toast(`نتيجتك ${s}/${T.q.length}${first?' · اتحسب 15 دقيقة قراءة':''}`)}
function addGloss(w,m){if(everyWord().some(c=>c.w.toLowerCase()===String(w).toLowerCase()))return toast('موجودة في الدفتر بالفعل');S.custom.push([w,m,'']);save();toast('اتضافت للبطاقات ✓')}

// ---------- حوارات الفرع ----------
function allDlgs(){return `<details class="card"><summary class="lbl">🎭 كل الحوارات (12) ▾</summary>${Object.keys(DIALOGS).map(n=>`<a class="wl lk" href="#dlg-${n}"><span class="pill">${n}</span><span class="en" style="flex:1;text-align:start">${esc(DIALOGS[n].t)}</span></a>`).join('')}</details>`}
function vDlg(n){n=+n;const D=DIALOGS[n];if(!D)return vSpeak();const P=!!(dl&&dl.n===n),L=P?D.l.slice(0,dl.i+1):D.l;
 shell('الكلام',`<div class="hero"><small>حوار الأسبوع ${n}${P?' · وضع التمرين':''}</small><h2 class="en ltr">${esc(D.t)}</h2><div class="ln">${esc(D.sit)}</div></div>
 ${P?'<div style="height:12px"></div>':`<div class="card small" style="margin-top:12px"><span class="lbl">الطريقة</span>١) اسمع الحوار كله · ٢) كرر جملك (الصفرا) بصوت عالي · ٣) دوس «اتمرن على دورك»: هتسمع العميل وتشوف ردك بالعربي، وانت تقوله بالإنجليزي قبل ما يظهر.</div>
 <div class="row" style="margin-bottom:12px"><button class="btn" style="flex:1" onclick="dlgPlay(${n})">🔊 اسمع الحوار</button><button class="btn gold" style="flex:1" onclick="dlgStart(${n})">🎭 اتمرن على دورك</button><button class="btn ghost" onclick="stopSpeak()" aria-label="وقّف الصوت">■</button></div>`}
 ${L.map((l,i)=>dlgLine(l,P&&i===dl.i&&l[0]==='E'&&!dl.show)).join('')}
 ${P?dlgCtl(D,n):`<div class="card" style="margin-top:12px"><span class="lbl">🔑 عبارات تحفظها</span>${D.k.map(k=>`<div class="wl"><span class="en" style="font-weight:700">${esc(k[0])}</span><span style="flex:1;text-align:start">${esc(k[1])}</span><button class="say" onclick="speak(${esc(JSON.stringify(k[0]))})" aria-label="اسمع">🔊</button></div>`).join('')}</div>
 <div class="row"><button class="btn ghost" style="flex:1" ${n<=1?'disabled':''} onclick="go('dlg-${n-1}')">→ السابق</button><button class="btn ghost" style="flex:1" ${n>=12?'disabled':''} onclick="go('dlg-${n+1}')">التالي ←</button></div>`}`,'axes')}
function dlgLine(l,hide){const c=l[0]==='C';
 if(hide)return `<div class="dl-e"><span class="who">🙋 دورك</span><b>${esc(l[2])}</b><span class="small muted" style="display:block">قولها بالإنجليزي بصوت عالي، وبعدين اضغط «اظهر الرد».</span></div>`;
 return `<div class="${c?'dl-c':'dl-e'}"><span class="who">${c?'👤 العميل':'🙋 انت'}<button class="say" onclick="speak(${esc(JSON.stringify(l[1]))})" aria-label="اسمع">🔊</button></span><span class="en">${esc(l[1])}</span>${!c&&l[2]?`<span class="small muted" style="display:block">${esc(l[2])}</span>`:''}</div>`}
function dlgCtl(D,n){const l=D.l[dl.i],last=dl.i>=D.l.length-1;
 if(l[0]==='E'&&!dl.show)return `<div class="row"><button class="btn" style="flex:1" onclick="dlgShow()">اظهر الرد</button><button class="btn ghost" onclick="dlgEnd()">خروج</button></div>`;
 if(last)return `<div class="card" style="text-align:center"><b>خلصت الحوار 👏</b><p class="small muted">عيده تاني، والمرة دي حاول تقول الرد قبل ما تبص على العربي.</p><div class="row" style="justify-content:center"><button class="btn" onclick="dlgStart(${n})">عيد التمرين</button><button class="btn ghost" onclick="dlgEnd()">خروج</button></div></div>`;
 return `<div class="row"><button class="btn" style="flex:1" onclick="dlgNext()">اللي بعده ←</button><button class="btn ghost" onclick="dlgEnd()">خروج</button></div>`}
function dlgStart(n){dl={n:+n,i:0,show:false};dlgRender()}
function dlgShow(){dl.show=true;dlgRender()}
function dlgNext(){dl.i++;dl.show=false;dlgRender()}
function dlgEnd(){const n=dl?dl.n:1;dl=null;stopSpeak();vDlg(n)}
function dlgRender(){const D=DIALOGS[dl.n],l=D.l[dl.i];vDlg(dl.n);window.scrollTo(0,document.body.scrollHeight);
 if(l[0]==='C'||dl.show)speak(l[1]);
 if(dl.i===D.l.length-1&&(l[0]==='C'||dl.show)&&!dl.done){dl.done=1;const t=today();S.days[t]=S.days[t]||{};S.days[t].speak=true;save();toast('خلصت الحوار ✓ اتعلّم الكلام في روتين النهارده')}}
function dlgPlay(n){const D=DIALOGS[n];try{speechSynthesis.cancel();const V=enVoices(),a=V.find(v=>/US/i.test(v.lang))||V[0],b=V.find(v=>v!==a&&/GB/i.test(v.lang))||V.find(v=>v!==a);
 D.l.forEach(l=>{const u=utter(l[1]),c=l[0]==='C';if(c&&b)u.voice=b;else if(a)u.voice=a;if(c&&!b)u.pitch=1.25;speechSynthesis.speak(u)})}catch(e){toast('النطق مش متاح على الجهاز ده')}}

// ---------- بنك العبارات ----------
function vPhrases(){shell('بنك العبارات',`<p class="muted" style="margin-top:0">عبارات الشغل اليومية في ${PHRASES.length} مواقف. اسمع وكرر، وضيف اللي محتاجه للبطاقات بزرار +.</p>
 ${PHRASES.map(g=>`<div class="card"><span class="lbl">${esc(g.t)}</span>${g.p.map(p=>`<div class="wd"><div class="row" style="flex-wrap:nowrap"><span class="en ltr" style="flex:1;font-weight:700">${esc(p[0])}</span><button class="say" onclick="speak(${esc(JSON.stringify(p[0]))})" aria-label="اسمع">🔊</button><button class="say" onclick="addGloss(${esc(JSON.stringify(p[0]))},${esc(JSON.stringify(p[1]))})" aria-label="ضيفها للبطاقات">+</button></div><div class="small muted">${esc(p[1])}</div></div>`).join('')}</div>`).join('')}
 <button class="btn ghost full" onclick="go('ax-speak')">→ رجوع للكلام</button>`,'axes')}

// ---------- نماذج الكتابة ----------
function modelIdx(w){let m=-1;MODELS.forEach((x,i)=>{if(x.wk<=w)m=i});return m}
function modelCard(){const i=modelIdx(curWeek());if(i<0)return '';const M=MODELS[i];return `<a class="lnk hi" href="#model-${i}"><div style="font-size:24px">📝</div><div><b>نموذج الأسبوع: ${esc(M.t)}</b><small>${tx(M.k)}</small></div></a>`}
function allModels(){return `<details class="card"><summary class="lbl">📝 كل نماذج الكتابة (${MODELS.length}) ▾</summary>${MODELS.map((M,i)=>`<a class="wl lk" href="#model-${i}"><span class="pill">أسبوع ${M.wk}</span><span style="flex:1;text-align:start">${esc(M.t)}</span><span class="small muted">${(S.drafts[i]||'').trim()?'✓':''}</span></a>`).join('')}</details>`}
function vModel(i){i=+i;const M=MODELS[i];if(!M)return vAx('write');const d=S.drafts[i]||'',wn=v=>(v.trim().match(/\S+/g)||[]).length;
 shell('الكتابة',`<div class="hero"><small>نموذج كتابة · الأسبوع ${M.wk}</small><h2>${esc(M.t)}</h2><div class="ln">${tx(M.k)}</div></div>
 <div class="card" style="margin-top:12px"><span class="lbl">إزاي تكتبه</span>${M.tips.map(t=>`<div class="small" style="padding:3px 0">• ${tx(t)}</div>`).join('')}</div>
 <div class="card"><span class="lbl">النموذج</span><pre class="mdl">${esc(M.txt)}</pre><div class="row"><button class="btn sm ghost" onclick="speakSeq(MODELS[${i}].txt,.9)">🔊 اسمع</button><button class="btn sm ghost" onclick="stopSpeak()" aria-label="وقّف الصوت">■</button></div></div>
 <div class="card"><span class="lbl">✍️ اكتب نسختك</span><p class="small muted" style="margin-top:0">اكتب عن نفسك وشغلك انت، ما تنسخش النموذج. بيتحفظ لوحده.</p><textarea id="dr" placeholder="Start writing...">${esc(d)}</textarea>
 <div class="row" style="margin-top:8px"><span class="muted small" id="dwc" style="flex:1"></span><button class="btn sm gold" onclick="copyModelFix(${i})">انسخ للتصحيح</button></div></div>
 <div class="card"><span class="lbl">✅ راجع قبل ما تبعت</span>${M.ck.map(c=>`<div class="small" style="padding:3px 0">☐ ${tx(c)}</div>`).join('')}</div>
 <button class="btn ghost full" onclick="go('ax-write')">→ رجوع للكتابة</button>`,'axes');
 const dr=$('#dr'),wc=()=>{$('#dwc').textContent=wn(dr.value)+' كلمة'};wc();
 dr.oninput=()=>{S.drafts[i]=dr.value;if(wn(dr.value)>=40){const t=today();S.days[t]=S.days[t]||{};S.days[t].write=true}save();wc()}}
function copyModelFix(i){const M=MODELS[i],v=($('#dr')||{}).value||'';if(!v.trim())return toast('اكتب الأول');
 copy(`My level is ${S.level}. I wrote this for the task "${M.t}" (${M.k}).\nCorrect my English. Show each mistake, the correct version, and a short reason in Egyptian Arabic. Then check it against this checklist and give me a better version:\n- ${M.ck.join('\n- ')}\n\n${v}`)}

// ---------- تشغيل ----------
applyTheme();route();
if('serviceWorker' in navigator){window.addEventListener('load',()=>{try{navigator.serviceWorker.register('sw.js').catch(()=>{})}catch(e){}})}
