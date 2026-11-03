import { useState, useEffect, useCallback } from "react";
import { Product } from "../types";

const STORAGE_KEY = "tp:products";

export const DEFAULT_PRODUCTS: Product[] = [
  { id: "certificates", name: "الشهادات", short: "شهادات", emoji: "🏆", unit: "عدد", color: "#D4A843" },
  { id: "loans", name: "القروض الشخصية", short: "قروض", emoji: "💰", unit: "ألف ج.م", color: "#4F9CF9" },
  { id: "cards", name: "البطاقات الائتمانية", short: "بطاقات", emoji: "💳", unit: "عدد", color: "#A78BFA" },
  { id: "accounts", name: "حسابات التوفير", short: "حسابات", emoji: "🏦", unit: "عدد", color: "#34D399" },
  { id: "insurance", name: "التأمين", short: "تأمين", emoji: "🛡️", unit: "عدد", color: "#F87171" },
  { id: "digital", name: "الخدمات الرقمية", short: "رقمي", emoji: "📱", unit: "عدد", color: "#22D3EE" },
];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Product[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      } catch {
        setProducts(DEFAULT_PRODUCTS);
      }
    }
  }, []);

  const saveProducts = useCallback((newProducts: Product[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
    setProducts(newProducts);
  }, []);

  const addProduct = useCallback((product: Omit<Product, "id">) => {
    const id = `custom_${Date.now()}` as Product["id"];
    const newProduct: Product = { ...product, id };
    setProducts(prev => {
      const updated = [...prev, newProduct];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeProduct = useCallback((productId: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== productId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
    setProducts(DEFAULT_PRODUCTS);
  }, []);

  return { products, addProduct, removeProduct, saveProducts, resetToDefaults };
}
