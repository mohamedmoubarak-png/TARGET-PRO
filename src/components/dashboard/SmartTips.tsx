import React from "react";
import { Tip } from "../../types";

interface SmartTipsProps {
  tips: Tip[];
}

export function SmartTips({ tips }: SmartTipsProps) {
  if (tips.length === 0) return null;

  return (
    <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
      {tips.map((tip, idx) => {
        let bgColor = "var(--info-bg)";
        let bdColor = "var(--info-bd)";
        if (tip.type === "success") { bgColor = "var(--success-bg)"; bdColor = "var(--success-bd)"; }
        else if (tip.type === "warning") { bgColor = "var(--warning-bg)"; bdColor = "var(--warning-bd)"; }
        else if (tip.type === "danger") { bgColor = "var(--danger-bg)"; bdColor = "var(--danger-bd)"; }

        return (
          <div key={idx} className="card fade-in" style={{
            background: bgColor,
            borderColor: bdColor,
            animationDelay: `${idx * 0.1}s`,
            padding: "16px",
            display: "flex",
            gap: "12px",
            alignItems: "flex-start"
          }}>
            <div style={{ fontSize: "1.5rem" }}>{tip.icon}</div>
            <div>
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>{tip.title}</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>{tip.text}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
