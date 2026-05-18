import React from "react";
import { Product } from "../../types";
import { ProgressBar } from "../ui/ProgressBar";

interface ProductCardProps {
  product: Product;
  target: number;
  achieved: number;
  delayIndex: number;
}

export function ProductCard({ product, target, achieved, delayIndex }: ProductCardProps) {
  const pct = target > 0 ? (achieved / target) * 100 : 0;
  const gap = Math.max(0, target - achieved);

  return (
    <div className="card product-card fade-in" style={{ "--product-color": product.color, animationDelay: `${delayIndex * 0.06}s`, borderTop: `3px solid ${product.color}` } as any}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{product.emoji} {product.name}</div>
        <div style={{ color: pct >= 100 ? "var(--success)" : "var(--text-primary)", fontWeight: "bold" }}>
          {target > 0 ? `${pct.toFixed(0)}%` : "-"}
        </div>
      </div>
      
      <ProgressBar progress={pct} color={product.color} />
      
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "12px" }}>
        <div>هدف: <span style={{ color: "var(--text-primary)", fontWeight: "bold" }}>{target}</span></div>
        <div>محقق: <span style={{ color: "var(--text-primary)", fontWeight: "bold" }}>{achieved}</span></div>
        <div>فجوة: <span style={{ color: "var(--danger)", fontWeight: "bold" }}>{gap}</span></div>
      </div>
    </div>
  );
}
