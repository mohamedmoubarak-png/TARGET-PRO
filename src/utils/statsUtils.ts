import { MonthData } from "../types";

export function calculateStats(data: MonthData | null) {
  if (!data) return { totalTarget: 0, totalAchieved: 0, overallPct: 0, totalGap: 0 };
  
  let totalTarget = 0;
  let totalAchieved = 0;

  Object.values(data).forEach(p => {
    totalTarget += p.target;
    totalAchieved += p.achieved;
  });

  const totalGap = Math.max(0, totalTarget - totalAchieved);
  const overallPct = totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0;

  return { totalTarget, totalAchieved, overallPct, totalGap };
}

export function calculateProductStats(target: number, achieved: number) {
  const gap = Math.max(0, target - achieved);
  const pct = target > 0 ? (achieved / target) * 100 : 0;
  return { gap, pct };
}
