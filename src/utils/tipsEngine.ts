import { MonthData, DaysInfo, Tip, Product } from "../types";
import { calculateStats, calculateProductStats } from "./statsUtils";

export function generateTips(data: MonthData | null, daysInfo: DaysInfo, products: Product[]): Tip[] {
  const tips: Tip[] = [];

  if (!data || Object.keys(data).length === 0) {
    tips.push({
      type: "info",
      icon: "🎯",
      title: "أهلاً بك في Target Pro",
      text: "ابدأ بتحديد مستهدفاتك الشهرية من تبويب المستهدفات."
    });
    return tips;
  }

  const { totalTarget, overallPct, totalGap } = calculateStats(data);
  const expectedPct = daysInfo.total > 0 ? (daysInfo.passed / daysInfo.total) * 100 : 0;

  if (totalTarget === 0) {
    return [{
      type: "info",
      icon: "🎯",
      title: "أهلاً بك",
      text: "ابدأ بتحديد مستهدفاتك الشهرية."
    }];
  }

  // Step 2: Overall performance
  if (overallPct >= 100) {
    tips.push({ type: "success", icon: "🌟", title: "تجاوزت المستهدف!", text: "أداء استثنائي، استمر في هذا التفوق!" });
  } else if (overallPct >= expectedPct + 10) {
    tips.push({ type: "success", icon: "🚀", title: "في المسار الصح!", text: "أنت متقدم على المعدل المطلوب، ممتاز." });
  } else if (overallPct < expectedPct - 15) {
    const dailyNeeded = daysInfo.remaining > 0 ? (totalGap / daysInfo.remaining).toFixed(1) : totalGap;
    tips.push({ type: "danger", icon: "⚠️", title: "تحتاج تسرّع!", text: `متأخر عن المعدل، تحتاج إغلاق ${dailyNeeded} يومياً.` });
  } else {
    tips.push({ type: "warning", icon: "⚡", title: "أداء متوسط — وقت تضغط", text: "أنت قريب من المعدل، دفعة بسيطة تصنع الفارق." });
  }

  // Steps 3 & 4: Best and worst products — use reduce to avoid TypeScript narrowing to 'never'
  type ProductStat = { product: Product; pct: number; gap: number };

  const worstEntry = products.reduce<ProductStat | null>((acc, p) => {
    const pd = data[p.id];
    if (!pd || pd.target === 0) return acc;
    const { pct, gap } = calculateProductStats(pd.target, pd.achieved);
    if (acc === null || pct < acc.pct) return { product: p, pct, gap };
    return acc;
  }, null);

  const bestEntry = products.reduce<ProductStat | null>((acc, p) => {
    const pd = data[p.id];
    if (!pd || pd.target === 0) return acc;
    const { pct, gap } = calculateProductStats(pd.target, pd.achieved);
    if (acc === null || pct > acc.pct) return { product: p, pct, gap };
    return acc;
  }, null);

  if (worstEntry && worstEntry.pct < 50) {
    tips.push({
      type: "warning",
      icon: "🎯",
      title: `ركز على ${worstEntry.product.name}`,
      text: `محقق ${worstEntry.pct.toFixed(0)}% فقط، باقي لك ${worstEntry.gap} ${worstEntry.product.unit}.`
    });
  }

  if (bestEntry && bestEntry.pct >= 80 && bestEntry.product !== worstEntry?.product) {
    tips.push({
      type: "success",
      icon: bestEntry.product.emoji,
      title: `${bestEntry.product.name} — نقطة قوتك!`,
      text: `محقق ${bestEntry.pct.toFixed(0)}%، استغل زخمك هنا.`
    });
  }

  // Step 5: Urgency
  if (daysInfo.remaining <= 5 && overallPct < 80) {
    tips.push({
      type: "danger",
      icon: "⏳",
      title: `ساعة الصفر! باقي ${daysInfo.remaining} أيام`,
      text: "الوقت يداهمنا، ركز على الإغلاقات السريعة والعملاء الجاهزين."
    });
  }

  // Step 6: Pad with static rotating tips
  const staticTips: Tip[] = [
    { type: "info", icon: "📱", title: "الواتساب أداة إغلاق قوية", text: "استخدم الرسائل الصوتية القصيرة للمتابعة." },
    { type: "info", icon: "🎁", title: "البيع المتقاطع (Cross-sell)", text: "العميل طالب القرض غالباً يحتاج بطاقة ائتمانية أيضاً." },
    { type: "info", icon: "⏰", title: "وقت التواصل الأمثل", text: "جرب الاتصال في الـ 10 صباحاً أو 4 مساءً لنتائج أفضل." },
    { type: "info", icon: "🤝", title: "تجديد الشهادات", text: "عملاء الشهادات المنتهية هم الأسهل لإعادة الاستثمار." },
  ];

  let i = 0;
  while (tips.length < 4 && i < staticTips.length) {
    if (!tips.find(t => t.title === staticTips[i].title)) {
      tips.push(staticTips[i]);
    }
    i++;
  }

  return tips.slice(0, 4);
}
