import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";

// ─── Data ─────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: "certificates", name: "الشهادات",            short: "شهادات", emoji: "🏆", unit: "عدد",      color: "#D4A843" },
  { id: "loans",        name: "القروض الشخصية",      short: "قروض",   emoji: "💰", unit: "ألف ج.م",  color: "#4F9CF9" },
  { id: "cards",        name: "البطاقات الائتمانية", short: "بطاقات", emoji: "💳", unit: "عدد",      color: "#A78BFA" },
  { id: "accounts",     name: "حسابات التوفير",      short: "حسابات", emoji: "🏦", unit: "عدد",      color: "#34D399" },
  { id: "insurance",    name: "التأمين",              short: "تأمين",  emoji: "🛡️", unit: "عدد",     color: "#F87171" },
  { id: "digital",      name: "الخدمات الرقمية",     short: "رقمي",   emoji: "📱", unit: "عدد",      color: "#22D3EE" },
];

const MONTHS_AR = ["يناير","فبراير","مارس","أبريل","مايو","يونيو",
                   "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getNow   = () => { const n = new Date(); return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`; };
const mlabel   = (m) => { const [y,mo]=m.split("-"); return `${MONTHS_AR[+mo-1]} ${y}`; };
const emptyD   = () => { const d={}; PRODUCTS.forEach(p=>{d[p.id]={target:0,achieved:0}}); return d; };
const daysInfo = () => { const n=new Date(),tot=new Date(n.getFullYear(),n.getMonth()+1,0).getDate(); return {remaining:tot-n.getDate(),total:tot,passed:n.getDate()}; };
const fmt      = (n) => Number(n).toLocaleString("ar-EG");

// ─── Tips Engine ──────────────────────────────────────────────────────────────
const makeTips = (data, di) => {
  const tips = [];
  const {remaining, total, passed} = di;
  let tT=0, tA=0;
  PRODUCTS.forEach(p=>{tT+=data[p.id]?.target||0; tA+=data[p.id]?.achieved||0});

  if (tT === 0) return [
    {type:"info",icon:"📋",title:"ابدأ بتحديد مستهدفاتك",text:"انتقل لتبويب «المستهدفات» وأدخل هدف كل منتج عشان نبدأ نتابع معك ونقدملك نصايح مخصصة."},
    {type:"info",icon:"🤝",title:"أسهل عميل في البنك",text:"عملاء الشهادات المنتهية هم الأسهل تحويلاً — اطلب قائمتهم من مديرك وابدأ بيهم."},
  ];

  const pct = (tA/tT)*100;
  const exp = (passed/total)*100;
  const gap = tT - tA;

  if (pct >= 100)
    tips.push({type:"success",icon:"🏆",title:"تجاوزت المستهدف!",text:`أداء استثنائي! حققت ${pct.toFixed(0)}% من الهدف. استغل الزخم ده وحاول تكسر رقم قياسي — مديرك بيلاحظ.`});
  else if (pct >= exp + 10)
    tips.push({type:"success",icon:"🚀",title:"في المسار الصح!",text:`أداؤك أحسن من المتوقع بـ ${(pct-exp).toFixed(0)}%، باقي ${remaining} يوم. استمر على نفس الوتيرة وهتقفل بسهولة.`});
  else if (pct < exp - 15)
    tips.push({type:"danger",icon:"⚠️",title:"تحتاج تسرّع!",text:`باقي ${remaining} يوم والفجوة ${fmt(gap)} وحدة. محتاج تحقق ${remaining>0?(gap/remaining).toFixed(1):gap} وحدة يومياً عشان تقفل.`});
  else
    tips.push({type:"warning",icon:"💡",title:"أداء متوسط — وقت تضغط",text:`الفجوة ${fmt(gap)} وحدة. زيادة تواصلاتك اليومية بـ 3 عملاء هتفرق كبير في نهاية الشهر.`});

  let worst=null,wPct=Infinity,best=null,bPct=-1;
  PRODUCTS.forEach(p=>{
    const t=data[p.id]?.target||0,a=data[p.id]?.achieved||0;
    if(t>0){const pc=(a/t)*100;if(pc<wPct){wPct=pc;worst=p}if(pc>bPct){bPct=pc;best=p}}
  });

  if(worst&&wPct<50){
    const wg=(data[worst.id]?.target||0)-(data[worst.id]?.achieved||0);
    tips.push({type:"warning",icon:"🎯",title:`ركز على ${worst.name}`,text:`ده أضعف منتج بنسبة ${wPct.toFixed(0)}% وفجوة ${fmt(wg)} وحدة. خصص ليه أول 30 دقيقة من يوم شغلك كل يوم.`});
  }
  if(best&&bPct>=80&&best!==worst)
    tips.push({type:"success",icon:"💪",title:`${best.name} — نقطة قوتك!`,text:`حققت ${bPct.toFixed(0)}% في ${best.name}. شارك الأسلوب ده مع زملائك وحاول تطبقه على المنتجات الأضعف.`});
  if(remaining<=5&&pct<80&&tT>0)
    tips.push({type:"danger",icon:"🔥",title:"ساعة الصفر!",text:`باقي ${remaining} أيام بس! اتصل بكل عميل VIP دلوقتي. مين المتردد اللي ممكن تقفله بسرعة؟`});

  const extra=[
    {type:"info",icon:"📱",title:"الواتساب أداة إغلاق",text:"بعد كل اجتماع أرسل ملخص العرض على الواتساب. العميل بيراجعه في الليل ويوافق في الصبح."},
    {type:"info",icon:"🎁",title:"بيع منتجين دفعة واحدة",text:"كل عميل قرض هو فرصة شهادة، وكل عميل شهادة هو فرصة بطاقة. دايماً اعرض منتج تاني — أكتر من نص العملاء بيوافقوا."},
    {type:"info",icon:"⏰",title:"وقت التواصل الأمثل",text:"أفضل وقت لتواصل العملاء: 10 الصبح أو 4 المساء. تجنب وقت الغداء وأول الصبح الباكر."},
  ];
  if(tips.length<3) tips.push(extra[Math.floor(Math.random()*extra.length)]);
  return tips.slice(0,4);
};

// ─── Sub-Components ───────────────────────────────────────────────────────────
const Ring = ({pct}) => {
  const R=72, C=2*Math.PI*R, off=C-(Math.min(pct,100)/100)*C;
  const color = pct>=100?"#34D399":pct>=70?"#D4A843":pct>=40?"#4F9CF9":"#F87171";
  return (
    <div style={{position:"relative",width:180,height:180,flexShrink:0}}>
      <svg width={180} height={180} style={{transform:"rotate(-90deg)"}}>
        <circle cx={90} cy={90} r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={14}/>
        <circle cx={90} cy={90} r={R} fill="none" stroke={color} strokeWidth={14}
          strokeDasharray={C} strokeDashoffset={off} strokeLinecap="round"
          style={{transition:"stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1), stroke .5s"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontSize:"2rem",fontWeight:900,color,lineHeight:1}}>{Math.min(pct,999).toFixed(0)}%</span>
        <span style={{fontSize:"0.68rem",color:"rgba(255,255,255,0.4)",marginTop:4}}>الإنجاز الكلي</span>
      </div>
    </div>
  );
};

const Bar2 = ({pct,color}) => (
  <div style={{height:7,background:"rgba(255,255,255,0.07)",borderRadius:99,overflow:"hidden"}}>
    <div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:color,borderRadius:99,transition:"width 1s cubic-bezier(.4,0,.2,1)"}}/>
  </div>
);

const TipCard = ({tip}) => {
  const pal={success:{bg:"rgba(52,211,153,.09)",border:"rgba(52,211,153,.25)",c:"#34D399"},
             warning:{bg:"rgba(212,168,67,.09)",border:"rgba(212,168,67,.25)",c:"#D4A843"},
             danger: {bg:"rgba(248,113,113,.09)",border:"rgba(248,113,113,.25)",c:"#F87171"},
             info:   {bg:"rgba(79,156,249,.09)", border:"rgba(79,156,249,.25)", c:"#4F9CF9"}};
  const p=pal[tip.type]||pal.info;
  return (
    <div style={{background:p.bg,border:`1px solid ${p.border}`,borderRadius:14,padding:"14px 16px",marginBottom:10}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
        <span style={{fontSize:"1.1rem"}}>{tip.icon}</span>
        <span style={{fontWeight:700,color:p.c,fontSize:"0.875rem"}}>{tip.title}</span>
      </div>
      <p style={{margin:0,color:"rgba(255,255,255,.65)",fontSize:"0.83rem",lineHeight:1.75}}>{tip.text}</p>
    </div>
  );
};

const CustomTooltip = ({active,payload,label}) => {
  if(!active||!payload?.length) return null;
  return (
    <div style={{background:"#0d1829",border:"1px solid rgba(255,255,255,.12)",borderRadius:10,padding:"10px 14px"}}>
      <p style={{margin:"0 0 6px",fontSize:"0.8rem",color:"rgba(255,255,255,.5)"}}>{label}</p>
      {payload.map((e,i)=>(
        <p key={i} style={{margin:"2px 0",fontSize:"0.85rem",color:e.color,fontWeight:700}}>
          {e.name}: {fmt(e.value)}
        </p>
      ))}
    </div>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────
export default function TargetPro() {
  const NOW = getNow();
  const [month,    setMonth]    = useState(NOW);
  const [data,     setData]     = useState(emptyD());
  const [tab,      setTab]      = useState("dashboard");
  const [loading,  setLoading]  = useState(true);
  const [empName,  setEmpName]  = useState("");
  const [showWelc, setShowWelc] = useState(false);
  const [toast,    setToast]    = useState(null);
  const [tempT,    setTempT]    = useState({});  // temp targets
  const [tempA,    setTempA]    = useState({});  // temp achieved
  const [welcName, setWelcName] = useState("");

  // Google Fonts
  useEffect(()=>{
    const l=document.createElement("link");
    l.href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap";
    l.rel="stylesheet"; document.head.appendChild(l);
  },[]);

  // Load from storage
  useEffect(()=>{
    (async()=>{
      setLoading(true);
      try {
        const emp = await window.storage.get("tp:employee");
        if(emp) setEmpName(JSON.parse(emp.value));
        else setShowWelc(true);
      } catch { setShowWelc(true); }
      try {
        const md = await window.storage.get(`tp:m:${month}`);
        setData(md ? JSON.parse(md.value) : emptyD());
      } catch { setData(emptyD()); }
      setLoading(false);
    })();
  },[month]);

  const persist = async (d) => { await window.storage.set(`tp:m:${month}`,JSON.stringify(d)); setData(d); };
  const notify  = (msg,ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000); };

  const changeMonth = (dir) => {
    const [y,m] = month.split("-").map(Number);
    let ny=y, nm=m+dir;
    if(nm>12){ny++;nm=1} if(nm<1){ny--;nm=12}
    const next=`${ny}-${String(nm).padStart(2,"0")}`;
    if(next<=NOW) setMonth(next);
  };

  const isCurrent = month === NOW;
  const di = daysInfo();

  // Computed stats
  const stats = useMemo(()=>{
    let tT=0,tA=0;
    const ps = PRODUCTS.map(p=>{
      const t=data[p.id]?.target||0, a=data[p.id]?.achieved||0;
      tT+=t; tA+=a;
      return {...p,target:t,achieved:a,gap:Math.max(0,t-a),pct:t>0?Math.min((a/t)*100,100):0};
    });
    return {totalT:tT,totalA:tA,gap:Math.max(0,tT-tA),pct:tT>0?Math.min((tA/tT)*100,100):0,products:ps};
  },[data]);

  const tips = useMemo(()=>makeTips(data,di),[data]);

  const chartData = stats.products.filter(p=>p.target>0).map(p=>({
    name:p.short, مستهدف:p.target, محقق:p.achieved, fill:p.color
  }));

  const handleSaveTargets = async () => {
    const d = {...data};
    PRODUCTS.forEach(p=>{ d[p.id]={...d[p.id],target:parseFloat(tempT[p.id])||0}; });
    await persist(d); notify("تم حفظ المستهدفات بنجاح ✅"); setTab("dashboard");
  };

  const handleSaveAchieved = async () => {
    const d = {...data};
    PRODUCTS.forEach(p=>{ if(tempA[p.id]!=="" && tempA[p.id]!==undefined) d[p.id]={...d[p.id],achieved:parseFloat(tempA[p.id])||0}; });
    await persist(d); notify("تم تحديث الإنجازات بنجاح ✅"); setTab("dashboard");
  };

  const handleWelcome = async () => {
    if(!welcName.trim()) return;
    await window.storage.set("tp:employee",JSON.stringify(welcName.trim()));
    setEmpName(welcName.trim()); setShowWelc(false);
  };

  const openTab = (t) => {
    setTab(t);
    if(t==="targets")  { const tmp={}; PRODUCTS.forEach(p=>tmp[p.id]=data[p.id]?.target||0);   setTempT(tmp); }
    if(t==="achieved") { const tmp={}; PRODUCTS.forEach(p=>tmp[p.id]=data[p.id]?.achieved||0); setTempA(tmp); }
  };

  // ── Styles ──────────────────────────────────────────────────────────────────
  const css = {
    app:  { minHeight:"100vh", background:"#060d1a", color:"#e8edf8",
            fontFamily:"'Cairo','Segoe UI',sans-serif", direction:"rtl",
            backgroundImage:"radial-gradient(ellipse 80% 50% at 50% -20%,rgba(212,168,67,.12),transparent)" },
    hdr:  { background:"rgba(255,255,255,.025)", backdropFilter:"blur(12px)",
            borderBottom:"1px solid rgba(255,255,255,.07)", padding:"14px 20px", position:"sticky", top:0, zIndex:10 },
    card: { background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:18, padding:22 },
    inp:  { width:"100%", background:"rgba(255,255,255,.07)", border:"1.5px solid rgba(255,255,255,.1)",
            borderRadius:10, padding:"12px 14px", color:"#e8edf8", fontSize:"0.95rem",
            boxSizing:"border-box", direction:"rtl", outline:"none", transition:"border-color .2s,box-shadow .2s",
            fontFamily:"inherit" },
    btn:  { border:"none", borderRadius:11, padding:"11px 18px", fontWeight:700, cursor:"pointer",
            fontSize:"0.875rem", transition:"all .18s", fontFamily:"inherit" },
    gold: { background:"linear-gradient(135deg,#D4A843,#f0c857)", color:"#060d1a" },
    nav:  (a)=>({ border:"none", borderRadius:10, padding:"9px 16px", fontWeight:700, cursor:"pointer",
                  fontSize:"0.82rem", transition:"all .2s", fontFamily:"inherit",
                  background:a?"rgba(212,168,67,.15)":"transparent",
                  color:a?"#D4A843":"rgba(255,255,255,.45)",
                  borderBottom:a?"2px solid #D4A843":"2px solid transparent" }),
  };

  // ── Loading ─────────────────────────────────────────────────────────────────
  if(loading) return (
    <div style={{...css.app,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:"3rem",marginBottom:12,animation:"pulse 1.5s infinite"}}>📊</div>
        <p style={{color:"rgba(255,255,255,.4)",fontSize:"0.9rem"}}>جاري تحميل بياناتك…</p>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={css.app}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
        input[type=number]{-moz-appearance:textfield}
        input:focus{border-color:#D4A843 !important;box-shadow:0 0 0 3px rgba(212,168,67,.18) !important}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:99px}
        @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .card-anim{animation:fadeIn .5s ease both}
        .card-anim:nth-child(2){animation-delay:.06s}
        .card-anim:nth-child(3){animation-delay:.12s}
        .card-anim:nth-child(4){animation-delay:.18s}
        .card-anim:nth-child(5){animation-delay:.24s}
        .card-anim:nth-child(6){animation-delay:.30s}
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",
          background:toast.ok?"#34D399":"#F87171",color:"#060d1a",padding:"12px 24px",
          borderRadius:12,fontWeight:800,zIndex:9999,fontSize:"0.9rem",
          boxShadow:"0 8px 30px rgba(0,0,0,.4)",animation:"slideDown .3s ease"}}>
          {toast.msg}
        </div>
      )}

      {/* Welcome Modal */}
      {showWelc && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",display:"flex",
          alignItems:"center",justifyContent:"center",zIndex:999,padding:20,backdropFilter:"blur(6px)"}}>
          <div style={{...css.card,maxWidth:380,width:"100%",textAlign:"center",padding:36,
            border:"1px solid rgba(212,168,67,.25)",animation:"fadeIn .4s ease"}}>
            <div style={{fontSize:"2.8rem",marginBottom:14}}>📊</div>
            <h2 style={{fontSize:"1.35rem",fontWeight:800,marginBottom:6,color:"#D4A843"}}>Target Pro</h2>
            <p style={{color:"rgba(255,255,255,.4)",marginBottom:24,fontSize:"0.85rem",lineHeight:1.7}}>
              نظام تتبع المستهدفات البنكية الاحترافي<br/>البيانات محفوظة محلياً على جهازك بالكامل
            </p>
            <input style={{...css.inp,textAlign:"center",marginBottom:16,fontSize:"1rem"}}
              placeholder="اكتب اسمك هنا…" value={welcName}
              onChange={e=>setWelcName(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleWelcome()} autoFocus/>
            <button style={{...css.btn,...css.gold,width:"100%",padding:14,fontSize:"1rem"}}
              onClick={handleWelcome}>ابدأ الآن 🚀</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={css.hdr}>
        <div style={{maxWidth:860,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:38,height:38,borderRadius:10,background:"linear-gradient(135deg,#D4A843,#f0c857)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.2rem",flexShrink:0}}>📊</div>
            <div>
              <div style={{fontWeight:900,fontSize:"1.05rem",color:"#D4A843",letterSpacing:"-.01em"}}>Target Pro</div>
              <div style={{fontSize:"0.65rem",color:"rgba(255,255,255,.3)"}}>نظام المستهدفات البنكية</div>
            </div>
          </div>

          {/* Month nav */}
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <button onClick={()=>changeMonth(-1)}
              style={{...css.btn,background:"rgba(255,255,255,.08)",color:"#e8edf8",padding:"8px 14px",fontSize:"1rem"}}>‹</button>
            <span style={{fontSize:"0.82rem",fontWeight:700,minWidth:110,textAlign:"center",color:"rgba(255,255,255,.8)"}}>
              {mlabel(month)}
            </span>
            <button onClick={()=>changeMonth(1)} disabled={month>=NOW}
              style={{...css.btn,background:month>=NOW?"rgba(255,255,255,.03)":"rgba(255,255,255,.08)",
                color:month>=NOW?"rgba(255,255,255,.2)":"#e8edf8",padding:"8px 14px",fontSize:"1rem"}}>›</button>
          </div>

          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#34D399",boxShadow:"0 0 6px #34D399"}}/>
            <span style={{fontSize:"0.8rem",fontWeight:700,color:"rgba(255,255,255,.6)"}}>👤 {empName}</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{borderBottom:"1px solid rgba(255,255,255,.07)",padding:"10px 20px 0"}}>
        <div style={{maxWidth:860,margin:"0 auto",display:"flex",gap:4}}>
          {[
            {id:"dashboard",label:"📊 لوحة التحكم"},
            {id:"targets",  label:"🎯 المستهدفات"},
            {id:"achieved", label:"✅ الإنجاز"},
          ].map(t=>(
            <button key={t.id} onClick={()=>openTab(t.id)} style={css.nav(tab===t.id)}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{maxWidth:860,margin:"0 auto",padding:"24px 16px 48px"}}>

        {/* ── DASHBOARD ────────────────────────────────────────────────────── */}
        {tab==="dashboard" && (
          <div style={{animation:"fadeIn .4s ease"}}>

            {/* Hero card */}
            <div style={{...css.card,display:"flex",gap:24,alignItems:"center",marginBottom:20,
              flexWrap:"wrap",border:"1px solid rgba(212,168,67,.18)"}}>
              <Ring pct={stats.pct}/>
              <div style={{flex:1,minWidth:200}}>
                <p style={{fontSize:"0.72rem",color:"rgba(255,255,255,.35)",marginBottom:4,fontWeight:600,letterSpacing:".05em",textTransform:"uppercase"}}>
                  {mlabel(month)}
                </p>
                <h2 style={{fontSize:"1.15rem",fontWeight:800,marginBottom:16,color:"#e8edf8"}}>
                  {stats.pct>=100?"🏆 تجاوزت المستهدف!":stats.pct>=70?"🚀 في المسار الصح":stats.pct>=40?"💪 استمر وزد السرعة":"⚡ ابدأ الضغط دلوقتي"}
                </h2>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {[
                    {label:"المستهدف",val:fmt(stats.totalT),  color:"#D4A843"},
                    {label:"المحقق",  val:fmt(stats.totalA),  color:"#34D399"},
                    {label:"الفجوة",  val:fmt(stats.gap),     color:"#F87171"},
                    {label:"أيام متبقية", val:isCurrent?di.remaining:"—", color:"#4F9CF9"},
                  ].map(s=>(
                    <div key={s.label} style={{background:"rgba(255,255,255,.05)",borderRadius:10,padding:"10px 12px"}}>
                      <div style={{fontSize:"0.68rem",color:"rgba(255,255,255,.35)",marginBottom:3,fontWeight:600}}>{s.label}</div>
                      <div style={{fontSize:"1.25rem",fontWeight:900,color:s.color}}>{s.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product cards grid */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14,marginBottom:20}}>
              {stats.products.map(p=>(
                <div key={p.id} className="card-anim"
                  style={{...css.card,borderTop:`3px solid ${p.color}`,padding:18}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <span style={{fontSize:"1.25rem"}}>{p.emoji}</span>
                      <span style={{fontWeight:700,fontSize:"0.85rem"}}>{p.name}</span>
                    </div>
                    <span style={{fontSize:"0.9rem",fontWeight:900,
                      color:p.pct>=100?"#34D399":p.pct>=70?"#D4A843":p.pct>=40?"#4F9CF9":"#F87171"}}>
                      {p.pct.toFixed(0)}%
                    </span>
                  </div>
                  <Bar2 pct={p.pct} color={p.color}/>
                  <div style={{display:"flex",justifyContent:"space-between",marginTop:10,fontSize:"0.73rem",color:"rgba(255,255,255,.4)"}}>
                    <span>هدف <strong style={{color:"rgba(255,255,255,.7)"}}>{fmt(p.target)}</strong></span>
                    <span>محقق <strong style={{color:p.color}}>{fmt(p.achieved)}</strong></span>
                    <span>فجوة <strong style={{color:"#F87171"}}>{fmt(p.gap)}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            {chartData.length > 0 && (
              <div style={{...css.card,marginBottom:20}}>
                <h3 style={{fontSize:"0.95rem",fontWeight:700,marginBottom:18,color:"rgba(255,255,255,.8)"}}>
                  📈 مقارنة المستهدف بالمحقق
                </h3>
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={chartData} margin={{top:0,right:0,left:-24,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)"/>
                    <XAxis dataKey="name" stroke="rgba(255,255,255,.2)"
                      tick={{fontSize:11,fill:"rgba(255,255,255,.45)",fontFamily:"Cairo"}}/>
                    <YAxis stroke="rgba(255,255,255,.2)"
                      tick={{fontSize:10,fill:"rgba(255,255,255,.45)",fontFamily:"Cairo"}}/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Bar dataKey="مستهدف" fill="rgba(212,168,67,.2)" radius={[5,5,0,0]}/>
                    <Bar dataKey="محقق"   radius={[5,5,0,0]}>
                      {chartData.map((e,i)=><Cell key={i} fill={e.fill}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Smart Tips */}
            <div style={css.card}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <h3 style={{fontSize:"0.95rem",fontWeight:700,color:"rgba(255,255,255,.8)"}}>🧠 النصايح الذكية</h3>
                <span style={{fontSize:"0.68rem",background:"rgba(212,168,67,.15)",color:"#D4A843",
                  padding:"3px 10px",borderRadius:99,fontWeight:700,border:"1px solid rgba(212,168,67,.2)"}}>
                  مخصصة لك
                </span>
              </div>
              {tips.map((t,i)=><TipCard key={i} tip={t}/>)}
            </div>
          </div>
        )}

        {/* ── TARGETS ──────────────────────────────────────────────────────── */}
        {tab==="targets" && (
          <div style={{animation:"fadeIn .4s ease"}}>
            <div style={{...css.card,marginBottom:16}}>
              <h3 style={{fontSize:"1rem",fontWeight:800,marginBottom:4}}>🎯 مستهدفات {mlabel(month)}</h3>
              <p style={{fontSize:"0.8rem",color:"rgba(255,255,255,.35)",marginBottom:22,lineHeight:1.6}}>
                أدخل مستهدفك الشهري لكل منتج. الأرقام بتتحفظ على جهازك فوراً.
              </p>
              {PRODUCTS.map(p=>(
                <div key={p.id} style={{marginBottom:18}}>
                  <label style={{display:"flex",alignItems:"center",gap:7,marginBottom:7,
                    fontSize:"0.875rem",color:"rgba(255,255,255,.75)",fontWeight:600}}>
                    <span>{p.emoji}</span>{p.name}
                    <span style={{marginRight:"auto",fontSize:"0.72rem",color:"rgba(255,255,255,.3)",
                      background:"rgba(255,255,255,.05)",padding:"2px 8px",borderRadius:99}}>{p.unit}</span>
                  </label>
                  <input type="number" style={css.inp} min={0}
                    placeholder={`أدخل المستهدف`}
                    value={tempT[p.id]||""}
                    onChange={e=>setTempT(prev=>({...prev,[p.id]:e.target.value}))}/>
                </div>
              ))}
              <button style={{...css.btn,...css.gold,width:"100%",padding:14,fontSize:"1rem",marginTop:6}}
                onClick={handleSaveTargets}>💾 حفظ المستهدفات</button>
            </div>
          </div>
        )}

        {/* ── ACHIEVEMENTS ─────────────────────────────────────────────────── */}
        {tab==="achieved" && (
          <div style={{animation:"fadeIn .4s ease"}}>
            <div style={{...css.card,marginBottom:16}}>
              <h3 style={{fontSize:"1rem",fontWeight:800,marginBottom:4}}>✅ تسجيل الإنجاز — {mlabel(month)}</h3>
              <p style={{fontSize:"0.8rem",color:"rgba(255,255,255,.35)",marginBottom:22,lineHeight:1.6}}>
                أدخل الرقم الكلي المحقق حتى الآن لكل منتج (مش الزيادة — الرقم الكلي).
              </p>
              {PRODUCTS.map(p=>{
                const tgt = data[p.id]?.target||0;
                const val = parseFloat(tempA[p.id])||0;
                const pct = tgt>0?(val/tgt)*100:0;
                const pColor = pct>=100?"#34D399":pct>=70?"#D4A843":pct>=40?"#4F9CF9":"#F87171";
                return (
                  <div key={p.id} style={{marginBottom:18}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                      <label style={{display:"flex",alignItems:"center",gap:7,fontSize:"0.875rem",
                        color:"rgba(255,255,255,.75)",fontWeight:600}}>
                        <span>{p.emoji}</span>{p.name}
                      </label>
                      {tgt>0&&<span style={{fontSize:"0.78rem",color:pColor,fontWeight:800}}>{pct.toFixed(0)}%</span>}
                    </div>
                    {tgt>0&&<Bar2 pct={pct} color={p.color}/>}
                    <input type="number" style={{...css.inp,marginTop:tgt>0?8:0}} min={0}
                      placeholder={tgt>0?`من أصل ${fmt(tgt)} ${p.unit}`:`لم يتم تحديد مستهدف`}
                      value={tempA[p.id]!==""&&tempA[p.id]!==undefined?tempA[p.id]:""}
                      onChange={e=>setTempA(prev=>({...prev,[p.id]:e.target.value}))}/>
                  </div>
                );
              })}
              <button style={{...css.btn,...css.gold,width:"100%",padding:14,fontSize:"1rem",marginTop:6}}
                onClick={handleSaveAchieved}>💾 حفظ الإنجازات</button>
            </div>
          </div>
        )}

        <p style={{textAlign:"center",fontSize:"0.68rem",color:"rgba(255,255,255,.15)",marginTop:8}}>
          Target Pro — البيانات محفوظة محلياً على جهازك | لا يوجد سيرفر أو تسجيل دخول
        </p>
      </div>
    </div>
  );
}
