import React from "react";

export type TabId = "dashboard" | "targets" | "achieved" | "settings";

interface NavTabsProps {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}

export function NavTabs({ activeTab, onChange }: NavTabsProps) {
  const tabs: { id: TabId; label: string }[] = [
    { id: "dashboard", label: "📊 لوحة التحكم" },
    { id: "targets", label: "🎯 المستهدفات" },
    { id: "achieved", label: "✅ الإنجاز" },
    { id: "settings", label: "⚙️ الإعدادات" },
  ];

  return (
    <div style={{ display: "flex", borderBottom: "1px solid var(--border-subtle)", padding: "0 24px", overflowX: "auto" }}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1,
              background: isActive ? "var(--bg-hover)" : "transparent",
              border: "none",
              borderBottom: isActive ? "2px solid var(--gold)" : "2px solid transparent",
              color: isActive ? "var(--gold)" : "var(--text-muted)",
              padding: "16px 8px",
              fontWeight: isActive ? "bold" : "normal",
              fontFamily: "'Cairo', sans-serif",
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap"
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
