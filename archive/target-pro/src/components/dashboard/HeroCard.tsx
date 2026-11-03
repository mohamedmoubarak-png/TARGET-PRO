import React from "react";
import { RingChart } from "./RingChart";
import { DaysInfo } from "../../types";

interface HeroCardProps {
  totalTarget: number;
  totalAchieved: number;
  overallPct: number;
  totalGap: number;
  daysInfo: DaysInfo;
}

export function HeroCard({ totalTarget, totalAchieved, overallPct, totalGap, daysInfo }: HeroCardProps) {
  return (
    <div className="card" style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
      <RingChart percentage={overallPct} />
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", flex: "1", minWidth: "240px" }}>
        <div style={{ background: "var(--bg-elevated)", padding: "16px", borderRadius: "var(--r-md)", borderLeft: "4px solid var(--gold)" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "4px" }}>المستهدف الكلي</div>
          <div style={{ fontSize: "1.4rem", fontWeight: "bold" }}>{totalTarget.toLocaleString()}</div>
        </div>
        <div style={{ background: "var(--bg-elevated)", padding: "16px", borderRadius: "var(--r-md)", borderLeft: "4px solid var(--success)" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "4px" }}>إجمالي المحقق</div>
          <div style={{ fontSize: "1.4rem", fontWeight: "bold" }}>{totalAchieved.toLocaleString()}</div>
        </div>
        <div style={{ background: "var(--bg-elevated)", padding: "16px", borderRadius: "var(--r-md)", borderLeft: "4px solid var(--danger)" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "4px" }}>الفجوة المتبقية</div>
          <div style={{ fontSize: "1.4rem", fontWeight: "bold" }}>{totalGap.toLocaleString()}</div>
        </div>
        <div style={{ background: "var(--bg-elevated)", padding: "16px", borderRadius: "var(--r-md)", borderLeft: "4px solid var(--info)" }}>
          <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "4px" }}>أيام متبقية</div>
          <div style={{ fontSize: "1.4rem", fontWeight: "bold" }}>{daysInfo.remaining} <span style={{ fontSize: "0.8rem", fontWeight: "normal" }}>من {daysInfo.total}</span></div>
        </div>
      </div>
    </div>
  );
}
