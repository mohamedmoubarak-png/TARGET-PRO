import React, { useState, useEffect } from "react";
import { MonthData, Product } from "../../types";
import { ProgressBar } from "../ui/ProgressBar";

interface AchievementsFormProps {
  initialData: MonthData | null;
  products: Product[];
  onSave: (data: MonthData) => void;
}

export function AchievementsForm({ initialData, products, onSave }: AchievementsFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    const init: Record<string, string> = {};
    products.forEach(p => {
      init[p.id] = initialData?.[p.id]?.achieved?.toString() || "";
    });
    setFormData(init);
  }, [initialData, products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result: MonthData = {};
    products.forEach(p => {
      const achievedVal = parseFloat(formData[p.id]) || 0;
      const targetVal = initialData?.[p.id]?.target || 0;
      result[p.id] = { target: targetVal, achieved: achievedVal };
    });
    onSave(result);
  };

  return (
    <form onSubmit={handleSubmit} className="fade-in" style={{ padding: "24px" }}>
      <h2 style={{ marginBottom: "20px", color: "var(--success)" }}>✅ تسجيل الإنجازات (تراكمي)</h2>
      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {products.map(p => {
          const target = initialData?.[p.id]?.target || 0;
          const currentInput = parseFloat(formData[p.id]) || 0;
          const pct = target > 0 ? (currentInput / target) * 100 : 0;

          return (
            <div key={p.id} className="card" style={{ borderTop: `3px solid ${p.color}` }}>
              <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontWeight: "bold" }}>
                <span>{p.emoji} {p.name}</span>
                {target > 0 && (
                  <span style={{ fontSize: "0.8rem", color: pct >= 100 ? "var(--success)" : "var(--gold)" }}>
                    {pct.toFixed(0)}%
                  </span>
                )}
              </label>
              {target > 0 && <ProgressBar progress={pct} color={p.color} />}
              <input
                type="number"
                className="input"
                value={formData[p.id] || ""}
                onChange={e => setFormData({ ...formData, [p.id]: e.target.value })}
                min="0"
                step="any"
                placeholder={target > 0 ? `من أصل ${target} ${p.unit}` : `لم يتم تعيين مستهدف`}
              />
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
        <button type="submit" className="btn btn--gold">💾 حفظ الإنجازات</button>
      </div>
    </form>
  );
}
