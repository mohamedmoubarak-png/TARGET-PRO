import React, { useMemo } from "react";
import { MonthData, Product } from "../../types";
import { ProductCard } from "./ProductCard";

interface ProductsGridProps {
  data: MonthData;
  products: Product[];
}

export function ProductsGrid({ data, products }: ProductsGridProps) {
  // Sort by achievement % ascending (worst performers first)
  const sorted = useMemo(() => {
    return [...products].sort((a, b) => {
      const pdA = data[a.id] || { target: 0, achieved: 0 };
      const pdB = data[b.id] || { target: 0, achieved: 0 };
      const pctA = pdA.target > 0 ? pdA.achieved / pdA.target : 1;
      const pctB = pdB.target > 0 ? pdB.achieved / pdB.target : 1;
      return pctA - pctB;
    });
  }, [products, data]);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px", marginBottom: "24px" }}>
      {sorted.map((p, idx) => {
        const pd = data[p.id] || { target: 0, achieved: 0 };
        return (
          <ProductCard
            key={p.id}
            product={p}
            target={pd.target}
            achieved={pd.achieved}
            delayIndex={idx}
          />
        );
      })}
    </div>
  );
}
