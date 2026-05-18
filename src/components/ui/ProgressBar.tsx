import React from "react";

interface ProgressBarProps {
  progress: number;
  color: string;
}

export function ProgressBar({ progress, color }: ProgressBarProps) {
  const safeProgress = Math.min(100, Math.max(0, progress));
  return (
    <div style={{
      height: "8px",
      background: "var(--bg-elevated)",
      borderRadius: "4px",
      overflow: "hidden",
      width: "100%",
      marginTop: "8px",
      marginBottom: "8px"
    }}>
      <div style={{
        height: "100%",
        width: `${safeProgress}%`,
        background: color,
        transition: "width 0.5s ease"
      }} />
    </div>
  );
}
