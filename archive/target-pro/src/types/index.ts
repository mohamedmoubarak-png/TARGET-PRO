export interface Product {
  id: string;
  name: string;        // Arabic full name
  short: string;       // Arabic short name for charts
  emoji: string;
  unit: string;        // "عدد" or "ألف ج.م"
  color: string;       // hex color
}

export interface MonthData {
  [productId: string]: {
    target: number;
    achieved: number;
  };
}

export interface Tip {
  type: "success" | "warning" | "danger" | "info";
  icon: string;
  title: string;
  text: string;
}

export interface DaysInfo {
  remaining: number;
  total: number;
  passed: number;
}
