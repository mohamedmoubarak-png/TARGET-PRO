import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { DaysInfo } from "../types";

interface HeaderProps {
  employeeName: string;
  jobTitle: string;
  monthLabel: string;
  daysInfo: DaysInfo;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  hasNextMonth: boolean;
}

export function Header({ employeeName, jobTitle, monthLabel, daysInfo, onPrevMonth, onNextMonth, hasNextMonth }: HeaderProps) {
  const monthPct = daysInfo.total > 0 ? (daysInfo.passed / daysInfo.total) * 100 : 0;

  return (
    <div>
      <header style={{
        display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center",
        padding: "16px 24px",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(16px)",
        gap: "10px"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "12px",
            background: "linear-gradient(135deg, var(--gold), var(--gold-light))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.3rem", boxShadow: "0 4px 16px rgba(212,168,67,0.35)",
            flexShrink: 0
          }}>🎯</div>
          <div>
            <h1 style={{ color: "var(--gold)", fontSize: "1.25rem", margin: 0, lineHeight: 1.2, fontWeight: 800 }}>
              Target Pro
            </h1>
            <div style={{ color: "var(--text-muted)", fontSize: "0.72rem", letterSpacing: "0.03em" }}>
              نظام المستهدفات الذكي
            </div>
          </div>
        </div>

        {/* Month Navigator */}
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(8px)",
          padding: "7px 16px",
          borderRadius: "var(--r-xl)",
          border: "1px solid rgba(255,255,255,0.09)"
        }}>
          <button onClick={onNextMonth} disabled={!hasNextMonth} style={{
            background: "none", border: "none",
            color: hasNextMonth ? "var(--text-primary)" : "var(--text-muted)",
            cursor: hasNextMonth ? "pointer" : "default",
            display: "flex", alignItems: "center", padding: "2px"
          }}>
            <ChevronRight size={17} />
          </button>
          <div style={{ textAlign: "center", minWidth: "105px" }}>
            <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>{monthLabel}</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "1px" }}>
              مضى {daysInfo.passed} من {daysInfo.total} يوم
            </div>
          </div>
          <button onClick={onPrevMonth} style={{
            background: "none", border: "none",
            color: "var(--text-primary)", cursor: "pointer",
            display: "flex", alignItems: "center", padding: "2px"
          }}>
            <ChevronLeft size={17} />
          </button>
        </div>

        {/* Employee Info */}
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(8px)",
          padding: "7px 14px",
          borderRadius: "var(--r-xl)",
          border: "1px solid rgba(255,255,255,0.09)"
        }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "50%",
            background: "linear-gradient(135deg, var(--gold), var(--gold-light))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.95rem", fontWeight: "bold", color: "#060d1a",
            flexShrink: 0, boxShadow: "0 2px 10px rgba(212,168,67,0.3)"
          }}>
            {employeeName ? employeeName.charAt(0) : "؟"}
          </div>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontWeight: "bold", fontSize: "0.9rem", color: "var(--text-primary)" }}>
              {employeeName}
            </div>
            {jobTitle && (
              <div style={{ fontSize: "0.72rem", color: "var(--gold)", opacity: 0.85 }}>
                {jobTitle}
              </div>
            )}
          </div>
          <div style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: "var(--success)",
            boxShadow: "0 0 8px var(--success)",
            animation: "pulse 2s infinite",
            flexShrink: 0
          }} />
        </div>
      </header>

      {/* Month Progress Bar */}
      <div className="month-progress-track">
        <div
          className="month-progress-fill"
          style={{ width: `${monthPct}%` }}
          title={`مضى ${monthPct.toFixed(0)}% من الشهر`}
        />
      </div>
    </div>
  );
}
