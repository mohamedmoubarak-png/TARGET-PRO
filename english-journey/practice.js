// ===== اختبار علامة النجاح + مراجعة الأخطاء =====
// الأسئلة بتتسحب من المذكرات نفسها (notes/*.html) عشان يبقى فيه مصدر واحد للأسئلة.
// المذكرات بتسجل كل إجابة في localStorage (ej_qinbox)، والتطبيق بياخد الغلط منها ويحطه في «مراجعة الأخطاء».
// مفتاح السؤال = حرف المصدر (g قواعد، p نطق) + hash للسؤال واختياراته، فترتيب الأسئلة في المذكرات ممكن يتغير عادي.
// الملف ده لازم يتحمّل قبل app.js.
function ejHash(s){let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return (h>>>0).toString(36)}
let QB=null;
async function quizBank(){if(QB)return QB;
 const get=async(f,p)=>{const t=await (await fetch(f)).text(),m=t.match(/const QD=(\{.*?\});\n/s);if(!m)throw new Error('no quiz in '+f);const D=JSON.parse(m[1]);
  return D.m.map(d=>Object.assign({},d,{key:p+ejHash(d.q+'|'+d.o.join('|')),src:p,sec:D.secs[d.s]||''}))};
 const [g,p]=await Promise.all([get('notes/grammar.html','g'),get('notes/pron.html','p')]);
 QB={g,p,all:{}};g.concat(p).forEach(q=>{QB.all[q.key]=q});return QB}
function consumeInbox(){try{const K='ej_qinbox',a=JSON.parse(localStorage.getItem(K)||'[]');if(!a.length)return;
 a.forEach(([k,ok])=>{if(!ok&&!S.qmiss[k])S.qmiss[k]={d:today()}});localStorage.removeItem(K);save()}catch(e){}}
function pickN(a,n){return shuffle(a.slice()).slice(0,n)}
const qCardId=k=>'q'+k;
// كارت السؤال بيتعمل من غير ما ياكل من حد الكلمات الجديدة في اليوم
function qRate(k,ok){const id=qCardId(k);if(!S.cards[id])S.cards[id]={ivl:0,ease:2.5,reps:0,due:today()};rateCard(id,ok?2:0);
 if(ok&&S.cards[id].ivl>=7){delete S.qmiss[k];delete S.cards[id];return true}return false}
function qDue(){const t=today();return Object.keys(S.qmiss).filter(k=>{const c=S.cards[qCardId(k)];return !c||c.due<=t})}
function wordReview(c){if(!c||!c.id)return;if(!S.cards[c.id])S.cards[c.id]={ivl:0,ease:2.5,reps:0,due:today()};rateCard(c.id,0)}

// ---------- عرض سؤال اختيار من متعدد (مشترك) ----------
// q: سؤال من المذكرات (q/o/a/e/w بـ HTML من ملفاتنا) أو سؤال كلمة {vq,vo,va,ar}
function mcqHTML(it,pfx){if(it.type==='v')return `<div class="small muted">🗂 كلمات الأسبوع</div><div class="qt2">${it.vq}</div>${it.vo.map((o,j)=>`<button class="opt${it.ar?' ar':''}" id="${pfx}${j}" onclick="mcqPick(${j})">${esc(o)}</button>`).join('')}`;
 const q=it.q;return `<div class="small muted">${q.src==='g'?'📘':'🔊'} ${esc(q.sec)}</div><div class="qt2" dir="auto">${q.q}</div>${q.o.map((o,j)=>`<button class="opt" id="${pfx}${j}" onclick="mcqPick(${j})"><span class="en-i">${esc(o)}</span></button>`).join('')}`}
function mcqAnswer(it){return it.type==='v'?it.va:it.q.a}
function mcqExplain(it,j){if(it.type==='v')return `<b class="en">${esc(it.c.w)}</b> = ${esc(it.c.m)}<div class="ex2">${esc(it.c.e)}</div>`;
 const q=it.q,ok=j===q.a;return `<div><b>✓ الصح: <span class="en-i">${esc(q.o[q.a])}</span></b> ${q.e}</div>${ok?'':`<div style="margin-top:4px"><b>✗ ليه «<span class="en-i">${esc(q.o[j])}</span>» غلط:</b> ${q.w[j]||''}</div>`}`}
function mcqReveal(it,j,pfx){const a=mcqAnswer(it);document.querySelectorAll(`[id^="${pfx}"]`).forEach(b=>b.disabled=true);$('#'+pfx+a).classList.add('ok');if(j!==a)$('#'+pfx+j).classList.add('bad')}
let mcqPick=()=>{};

// ---------- اختبار علامة النجاح ----------
let CK=null;
function vocabItem(c,pool){const others=shuffle(pool.filter(x=>x.id!==c.id&&x.m!==c.m)).slice(0,3);
 if(Math.random()<.5){const vo=shuffle([c.m,...others.map(x=>x.m)]);return{type:'v',c,ar:true,vq:`يعني إيه <span class="en-i">${esc(c.w)}</span>؟`,vo,va:vo.indexOf(c.m)}}
 const vo=shuffle([c.w,...others.map(x=>x.w)]);return{type:'v',c,ar:false,vq:`إزاي تقول «${esc(c.m)}» بالإنجليزي؟`,vo,va:vo.indexOf(c.w)}}
// 10 أسئلة: 5 قواعد الأسبوع + 1 مراجعة قواعد من اللي فات + 2 نطق الأسبوع + 2 كلمات الأسبوع
function buildCheck(n,B){const L=LINKS[n]||{g:[],p:[]},all=L.g.includes('quiz'),inS=(arr,secs)=>arr.filter(q=>secs.includes(q.s));
 const g=all?B.g:inS(B.g,L.g),p=all?B.p:inS(B.p,L.p);
 const prev=[...new Set(Object.keys(LINKS).filter(w=>+w<n).flatMap(w=>LINKS[w].g))].filter(s=>!L.g.includes(s)&&s!=='quiz');
 const used=new Set(),take=(arr,k)=>{const out=pickN(arr.filter(q=>!used.has(q.key)),k);out.forEach(q=>used.add(q.key));return out};
 const items=[...take(g,5),...take(prev.length?inS(B.g,prev):g,1),...take(p,2)].map(q=>({type:'q',q}));
 const P=PACKS.find(x=>x.wk===n),W=(P?packWords(P):starterWords()).filter(c=>c.m);pickN(W,2).forEach(c=>items.push(vocabItem(c,W)));
 if(items.length<10)take(B.g.concat(B.p),10-items.length).forEach(q=>items.push({type:'q',q}));
 return shuffle(items).slice(0,10)}
async function vCheck(n){n=Math.min(12,Math.max(1,+n||curWeek()));const title='اختبار الأسبوع '+n;
 shell(title,'<div class="card" style="text-align:center">بيتحضّر...</div>','plan');let B;
 try{B=await quizBank()}catch(e){return shell(title,'<div class="card">محتاج نت أول مرة عشان أجهز الأسئلة. افتح التطبيق وانت متصل وجرّب تاني.</div>','plan')}
 if(location.hash!=='#check-'+n)return;CK={n,items:buildCheck(n,B),i:0,res:[],shown:false};actStart('grammar');ckRender()}
function ckRender(){const it=CK.items[CK.i],N=CK.items.length;if(!it)return ckDone();
 mcqPick=ckPick;shell('اختبار الأسبوع '+CK.n,`<div class="row small muted" style="margin-bottom:8px"><span style="flex:1">🎯 علامة النجاح · سؤال ${CK.i+1} من ${N}</span><span>✅ ${CK.res.filter(Boolean).length}</span></div>
 <div class="bar" style="margin-bottom:12px"><i style="width:${CK.i/N*100}%"></i></div>
 <div class="card">${mcqHTML(it,'ck')}<div class="fbk small" id="ckfb"></div></div><div id="ckact"></div>`,'plan');actStart('grammar')}
function ckPick(j){if(CK.shown)return;CK.shown=true;const it=CK.items[CK.i],ok=j===mcqAnswer(it);CK.res.push(ok);mcqReveal(it,j,'ck');
 $('#ckfb').innerHTML=(ok?'✅ ':'❌ ')+mcqExplain(it,j);
 if(!ok){if(it.type==='q')S.qmiss[it.q.key]=S.qmiss[it.q.key]||{d:today()};else wordReview(it.c);save()}
 $('#ckact').innerHTML=`<button class="btn full" onclick="CK.i++;CK.shown=false;ckRender()">${CK.i>=CK.items.length-1?'النتيجة 🏁':'اللي بعده ←'}</button>`}
function ckDone(){const n=CK.n,s=CK.res.filter(Boolean).length,N=CK.res.length,pass=s>=8,prev=S.checks[n];
 S.checks[n]={best:Math.max(s,prev?prev.best:0),last:s,d:today()};save();
 const wrong=CK.items.filter((_,i)=>!CK.res[i]);
 shell('اختبار الأسبوع '+n,`<div class="card" style="text-align:center"><div style="font-size:44px;font-weight:800;color:var(--head)">${s}/${N}</div>
 <h2 style="margin:4px 0;color:${pass?'var(--ok)':'var(--head)'}">${pass?'🎉 عدّيت علامة النجاح':'لسه شوية'}</h2>
 <p class="small muted">${pass?(n<12?`جاهز للأسبوع ${n+1}. كمّل بنفس الروتين.`:'خلصت المرحلة الأولى! اعمل EF SET وسجّل نتيجتك في التقدم.'):'علامة النجاح 8 من 10. أخطاءك اتحطت في «مراجعة الأخطاء»، راجعها وجرّب الاختبار تاني بكره.'}</p>
 ${wrong.length?`<div style="text-align:start">${wrong.map(it=>`<div class="wd"><div class="small muted">${it.type==='q'?esc(it.q.sec):'كلمة'}</div><div>${it.type==='q'?`${it.q.q} ← <b class="en-i">${esc(it.q.o[it.q.a])}</b>`:`<b class="en">${esc(it.c.w)}</b> = ${esc(it.c.m)}`}</div></div>`).join('')}</div>`:''}
 <div class="row" style="justify-content:center;margin-top:12px">${wrong.length?'<button class="btn gold" onclick="go(\'mistakes\')">راجع أخطاءك</button>':''}<button class="btn ghost" onclick="go('check-${n}')">اختبار تاني</button><button class="btn ghost" onclick="go('week-${n}')">الأسبوع ${n}</button></div></div>`,'plan');CK=null}
function checkBtn(n){const c=S.checks[n];return `<button class="btn sm gold" style="margin-top:8px" onclick="go('check-${n}')">🎯 اختبار علامة النجاح (10 أسئلة)${c?` · أحسن نتيجة ${c.best}/10${c.best>=8?' ✓':''}`:''}</button>`}
function checksProgress(){return `<div class="card"><span class="lbl">اختبارات الأسابيع: ${Object.values(S.checks).filter(c=>c.best>=8).length} من 12 عدّيتها</span><div class="tgrid">${Object.keys(W).map(n=>{const c=S.checks[n];return `<a href="#check-${n}" class="stat"><b style="color:${c&&c.best>=8?'var(--ok)':'var(--head)'}">${c?c.best+'/10':'—'}</b><span>أسبوع ${n}</span></a>`}).join('')}</div></div>`}

// ---------- مراجعة الأخطاء (تكرار متباعد) ----------
let MR=null;
function mistakesCard(){const n=qDue().length;return n?`<a class="lnk hi" href="#mistakes"><div style="font-size:24px">🔁</div><div><b>مراجعة الأخطاء: ${n} سؤال</b><small>أسئلة غلطت فيها في المذكرات أو الاختبار، وراجعة بتكرار ذكي</small></div></a>`:''}
async function vMistakes(){shell('مراجعة الأخطاء','<div class="card" style="text-align:center">بيتحضّر...</div>','axes');let B;
 try{B=await quizBank()}catch(e){return shell('مراجعة الأخطاء','<div class="card">محتاج نت أول مرة عشان أجهز الأسئلة.</div>','axes')}
 if(location.hash!=='#mistakes')return;Object.keys(S.qmiss).forEach(k=>{if(!B.all[k])delete S.qmiss[k]});save();
 const keys=shuffle(qDue()).slice(0,15);MR={items:keys.map(k=>({type:'q',q:B.all[k]})),i:0,ok:0,gone:0,shown:false};actStart('grammar');mrRender()}
function mrRender(){if(!MR.items.length)return shell('مراجعة الأخطاء',`<div class="card" style="text-align:center"><h2 style="color:var(--head)">مفيش أخطاء مستنية 👏</h2><p class="small muted">أي سؤال تغلط فيه في المذكرات أو اختبار الأسبوع بيتحط هنا، ويرجعلك على فترات لحد ما تثبّته.</p><button class="btn" onclick="go('today')">رجوع لليوم</button></div>`,'axes');
 const it=MR.items[MR.i];if(!it)return mrDone();mcqPick=mrPick;
 shell('مراجعة الأخطاء',`<div class="row small muted" style="margin-bottom:8px"><span style="flex:1">🔁 ${MR.i+1} من ${MR.items.length}</span><span>✅ ${MR.ok}</span></div>
 <div class="bar" style="margin-bottom:12px"><i style="width:${MR.i/MR.items.length*100}%"></i></div>
 <div class="card">${mcqHTML(it,'mr')}<div class="fbk small" id="mrfb"></div></div><div id="mract"></div>`,'axes');actStart('grammar')}
function mrPick(j){if(MR.shown)return;MR.shown=true;const it=MR.items[MR.i],ok=j===it.q.a;if(ok)MR.ok++;mcqReveal(it,j,'mr');
 const grad=qRate(it.q.key,ok);if(grad)MR.gone++;save();
 $('#mrfb').innerHTML=(ok?'✅ ':'❌ ')+mcqExplain(it,j)+(grad?'<div style="margin-top:6px;color:var(--ok);font-weight:800">🎓 السؤال ده اتثبّت وخرج من المراجعة</div>':ok?'':'<div class="muted" style="margin-top:6px">هيرجعلك بكره.</div>');
 $('#mract').innerHTML=`<button class="btn full" onclick="MR.i++;MR.shown=false;mrRender()">${MR.i>=MR.items.length-1?'خلصت 🏁':'اللي بعده ←'}</button>`}
function mrDone(){const n=MR.items.length;shell('مراجعة الأخطاء',`<div class="card" style="text-align:center"><div style="font-size:40px;font-weight:800;color:var(--head)">${MR.ok}/${n}</div><p>${MR.gone?`🎓 ${MR.gone} سؤال اتثبّت وخرج من المراجعة. `:''}اللي غلطت فيه هيرجعلك بكره، واللي صح هيرجع بعد فترة أطول.</p><div class="row" style="justify-content:center"><button class="btn" onclick="go('today')">رجوع لليوم</button><button class="btn ghost" onclick="go('ax-grammar')">القواعد</button></div></div>`,'axes');MR=null}
