import React, { useState, useEffect } from "react";
import { MonthData, Product } from "../../types";

interface TargetsFormProps {
  initialData: MonthData | null;
  products: Product[];
  onSave: (data: MonthData) => void;
}

export function TargetsForm({ initialData, products, onSave }: TargetsFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    const init: Record<string, string> = {};
    products.forEach(p => {
      init[p.id] = initialData?.[p.id]?.target?.toString() || "";
    });
    setFormData(init);
  }, [initialData, products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result: MonthData = {};
    products.forEach(p => {
      const targetVal = parseFloat(formData[p.id]) || 0;
      const achievedVal = initialData?.[p.id]?.achieved || 0;
      result[p.id] = { target: targetVal, achieved: achievedVal };
    });
    onSave(result);
  };

  return (
    <form onSubmit={handleSubmit} className="fade-in" style={{ padding: "24px" }}>
      <h2 style={{ marginBottom: "20px", color: "var(--gold)" }}>🎯 تعيين المستهدفات الشهرية</h2>
      <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {products.map(p => (
          <div key={p.id} className="card" style={{ borderTop: `3px solid ${p.color}` }}>
            <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontWeight: "bold" }}>
              <span>{p.emoji} {p.name}</span>
              <span style={{ fontSize: "0.8rem", background: "var(--bg-elevated)", padding: "2px 8px", borderRadius: "10px" }}>{p.unit}</span>
            </label>
            <input
              type="number"
              className="input"
              value={formData[p.id] || ""}
              onChange={e => setFormData({ ...formData, [p.id]: e.target.value })}
              min="0"
              step="any"
              placeholder={`مستهدف ال${p.name}...`}
            />
          </div>
        ))}
      </div>
      <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
        <button type="submit" className="btn btn--gold">💾 حفظ المستهدفات</button>
      </div>
    </form>
  );
}
