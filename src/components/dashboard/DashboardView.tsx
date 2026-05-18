import React, { useMemo } from "react";
import { MonthData, DaysInfo, Product } from "../../types";
import { HeroCard } from "./HeroCard";
import { ProductsGrid } from "./ProductsGrid";
import { ComparisonChart } from "./ComparisonChart";
import { SmartTips } from "./SmartTips";
import { calculateStats } from "../../utils/statsUtils";
import { generateTips } from "../../utils/tipsEngine";

interface DashboardViewProps {
  data: MonthData | null;
  daysInfo: DaysInfo;
  products: Product[];
}

export function DashboardView({ data, daysInfo, products }: DashboardViewProps) {
  const safeData = data || {};
  const stats = useMemo(() => calculateStats(safeData), [safeData]);
  const tips = useMemo(() => generateTips(safeData, daysInfo, products), [safeData, daysInfo, products]);

  return (
    <div className="fade-in" style={{ padding: "24px" }}>
      <HeroCard
        totalTarget={stats.totalTarget}
        totalAchieved={stats.totalAchieved}
        overallPct={stats.overallPct}
        totalGap={stats.totalGap}
        daysInfo={daysInfo}
      />
      <ProductsGrid data={safeData} products={products} />
      <ComparisonChart data={safeData} products={products} />
      <SmartTips tips={tips} />
    </div>
  );
}
