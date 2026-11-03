import { useState, useEffect, useCallback } from "react";
import { MonthData } from "../types";
import { getCurrentMonthKey } from "../utils/dateUtils";

export function useMonthData(monthKey: string = getCurrentMonthKey()) {
  const [data, setData] = useState<MonthData | null>(null);

  useEffect(() => {
    const loadData = () => {
      const stored = localStorage.getItem(monthKey);
      if (stored) {
        try {
          setData(JSON.parse(stored));
        } catch (e) {
          console.error(e);
          setData({});
        }
      } else {
        setData({});
      }
    };
    loadData();
    
    const handleStorage = (e: StorageEvent) => {
      if (e.key === monthKey) {
        loadData();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [monthKey]);

  const saveData = useCallback((newData: MonthData) => {
    localStorage.setItem(monthKey, JSON.stringify(newData));
    setData(newData);
  }, [monthKey]);

  return { data, saveData };
}
