import React from "react";

interface RingChartProps {
  percentage: number;
}

export function RingChart({ percentage }: RingChartProps) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const safePct = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (safePct / 100) * circumference;

  let color = "var(--danger)";
  if (safePct >= 100) color = "var(--success)";
  else if (safePct >= 70) color = "var(--gold)";
  else if (safePct >= 40) color = "var(--info)";

  return (
    <div style={{ position: "relative", width: "180px", height: "180px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="180" height="180" style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx="90" cy="90" r={radius}
          fill="none" stroke="var(--bg-elevated)" strokeWidth="12"
        />
        <circle
          className="ring-circle"
          cx="90" cy="90" r={radius}
          fill="none" stroke={color} strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div style={{ position: "absolute", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--text-primary)", lineHeight: 1 }}>
          {safePct.toFixed(0)}%
        </span>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px" }}>الإنجاز الكلي</span>
      </div>
    </div>
  );
}
