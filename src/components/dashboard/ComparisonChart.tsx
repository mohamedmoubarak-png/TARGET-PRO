import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { MonthData, Product } from "../../types";

interface ComparisonChartProps {
  data: MonthData;
  products: Product[];
}

export function ComparisonChart({ data, products }: ComparisonChartProps) {
  const chartData = useMemo(() => {
    return products.map(p => ({
      name: p.short,
      target: data[p.id]?.target || 0,
      achieved: data[p.id]?.achieved || 0,
      color: p.color
    }));
  }, [data, products]);

  const hasTargets = chartData.some(d => d.target > 0);

  if (!hasTargets) return null;

  return (
    <div className="card fade-in" style={{ marginBottom: "24px", padding: "16px", height: "300px" }}>
      <h3 style={{ marginBottom: "16px", color: "var(--text-secondary)" }}>مقارنة أداء المنتجات</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            cursor={{ fill: "var(--bg-hover)" }}
            contentStyle={{ backgroundColor: "var(--bg-base)", border: "1px solid var(--border-subtle)", borderRadius: "var(--r-md)", color: "var(--text-primary)" }}
            itemStyle={{ color: "var(--text-primary)" }}
          />
          <Bar dataKey="target" name="المستهدف" fill="var(--gold)" fillOpacity={0.2} radius={[4, 4, 0, 0]} />
          <Bar dataKey="achieved" name="المحقق" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
