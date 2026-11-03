const MONTHS_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

export function getCurrentMonthKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `tp:m:${y}-${m}`;
}

export function getMonthLabel(key: string): string {
  // key format: tp:m:YYYY-MM
  const parts = key.split(":");
  if (parts.length !== 3) return "";
  const [year, month] = parts[2].split("-");
  const mIndex = parseInt(month, 10) - 1;
  return `${MONTHS_AR[mIndex]} ${year}`;
}

export function getDaysInfo(key: string) {
  const parts = key.split(":");
  if (parts.length !== 3) return { total: 30, passed: 15, remaining: 15 };
  const [yStr, mStr] = parts[2].split("-");
  const year = parseInt(yStr, 10);
  const month = parseInt(mStr, 10);

  const d = new Date();
  const currentYear = d.getFullYear();
  const currentMonth = d.getMonth() + 1;

  const total = new Date(year, month, 0).getDate();
  
  if (year === currentYear && month === currentMonth) {
    const passed = d.getDate();
    return { total, passed, remaining: total - passed };
  } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { total, passed: total, remaining: 0 };
  } else {
    return { total, passed: 0, remaining: total };
  }
}

export function getPreviousMonthKey(key: string): string {
  const parts = key.split(":");
  const [year, month] = parts[2].split("-").map(Number);
  let prevYear = year;
  let prevMonth = month - 1;
  if (prevMonth < 1) {
    prevMonth = 12;
    prevYear--;
  }
  return `tp:m:${prevYear}-${String(prevMonth).padStart(2, "0")}`;
}
