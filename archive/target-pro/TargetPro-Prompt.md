# ROLE
You are an Expert Senior Frontend Engineer specializing in Arabic RTL Progressive 
Web Apps (PWA), React, TypeScript, and financial/banking UX design.

# PROJECT NAME
"Target Pro" — نظام تتبع المستهدفات البنكية الاحترافي

# PROJECT DESCRIPTION
A fully client-side PWA for Egyptian bank employees to track their monthly 
sales targets across 6 product categories, log achievements, analyze gaps, 
and receive AI-powered smart tips — all stored locally on the device with 
zero backend, zero login, zero server.

# TECH STACK
- React 18 + TypeScript (strict mode)
- Vite + vite-plugin-pwa (fully installable PWA, offline capable)
- Plain CSS (CSS Variables system — NO Tailwind)
- Recharts (BarChart for product comparison)
- localStorage for all data persistence
- Google Fonts: Cairo (Arabic) — loaded dynamically

---

# DATA MODEL

## Products (fixed list, 6 items):
```typescript
interface Product {
  id: "certificates" | "loans" | "cards" | "accounts" | "insurance" | "digital";
  name: string;        // Arabic full name
  short: string;       // Arabic short name for charts
  emoji: string;
  unit: string;        // "عدد" or "ألف ج.م"
  color: string;       // hex color
}
```

| id           | name                  | short    | emoji | unit      | color   |
|--------------|-----------------------|----------|-------|-----------|---------|
| certificates | الشهادات              | شهادات   | 🏆    | عدد       | #D4A843 |
| loans        | القروض الشخصية        | قروض     | 💰    | ألف ج.م   | #4F9CF9 |
| cards        | البطاقات الائتمانية   | بطاقات   | 💳    | عدد       | #A78BFA |
| accounts     | حسابات التوفير        | حسابات   | 🏦    | عدد       | #34D399 |
| insurance    | التأمين               | تأمين    | 🛡️   | عدد       | #F87171 |
| digital      | الخدمات الرقمية       | رقمي     | 📱    | عدد       | #22D3EE |

## Storage Keys (localStorage):
```typescript
// Employee name
localStorage.setItem("tp:employee", JSON.stringify("Mohamed"))

// Monthly data — one key per month
// Key format: "tp:m:YYYY-MM"
interface MonthData {
  [productId: string]: {
    target: number;
    achieved: number;
  };
}
localStorage.setItem("tp:m:2025-01", JSON.stringify(monthData))
```

---

# COMPONENT ARCHITECTURE

```
src/
├── main.tsx
├── App.tsx                          ← root, loads employee + month data
├── components/
│   ├── Header.tsx                   ← logo + month navigator + employee name
│   ├── NavTabs.tsx                  ← 3 tabs: dashboard / targets / achieved
│   ├── dashboard/
│   │   ├── DashboardView.tsx        ← orchestrates dashboard layout
│   │   ├── HeroCard.tsx             ← Ring chart + 4 KPI mini-cards
│   │   ├── RingChart.tsx            ← SVG circular progress
│   │   ├── ProductCard.tsx          ← individual product card with progress bar
│   │   ├── ProductsGrid.tsx         ← responsive grid of 6 ProductCards
│   │   ├── ComparisonChart.tsx      ← Recharts BarChart
│   │   └── SmartTips.tsx            ← tips engine + TipCard renderer
│   ├── forms/
│   │   ├── TargetsForm.tsx          ← set monthly targets
│   │   └── AchievementsForm.tsx     ← log cumulative achievements
│   └── ui/
│       ├── Toast.tsx                ← success/error notification
│       ├── WelcomeModal.tsx         ← first-time name entry
│       └── ProgressBar.tsx          ← horizontal progress bar component
├── hooks/
│   ├── useMonthData.ts              ← load/save month data from localStorage
│   └── useEmployeeName.ts           ← load/save employee name
├── utils/
│   ├── dateUtils.ts                 ← getCurrentMonth, getMonthLabel, getDaysInfo
│   ├── statsUtils.ts                ← compute stats from MonthData
│   └── tipsEngine.ts                ← smart tips generation logic
├── types/
│   └── index.ts                     ← all TypeScript interfaces
└── styles/
    ├── variables.css                ← CSS custom properties
    ├── global.css                   ← reset + base styles
    └── animations.css               ← keyframes
```

---

# CSS DESIGN SYSTEM

## Color Palette:
```css
:root {
  /* Backgrounds — 3 elevation levels */
  --bg-base:      #060d1a;
  --bg-surface:   rgba(255,255,255,0.04);
  --bg-elevated:  rgba(255,255,255,0.07);
  --bg-hover:     rgba(255,255,255,0.09);

  /* Accent */
  --gold:         #D4A843;
  --gold-light:   #f0c857;
  --gold-glow:    rgba(212,168,67,0.15);
  --gold-border:  rgba(212,168,67,0.22);

  /* Semantic */
  --success:      #34D399;
  --success-bg:   rgba(52,211,153,0.09);
  --success-bd:   rgba(52,211,153,0.25);

  --warning:      #D4A843;
  --warning-bg:   rgba(212,168,67,0.09);
  --warning-bd:   rgba(212,168,67,0.25);

  --danger:       #F87171;
  --danger-bg:    rgba(248,113,113,0.09);
  --danger-bd:    rgba(248,113,113,0.25);

  --info:         #4F9CF9;
  --info-bg:      rgba(79,156,249,0.09);
  --info-bd:      rgba(79,156,249,0.25);

  /* Typography */
  --text-primary:   #e8edf8;
  --text-secondary: rgba(255,255,255,0.65);
  --text-muted:     rgba(255,255,255,0.35);
  --text-subtle:    rgba(255,255,255,0.18);

  /* Borders */
  --border-subtle: rgba(255,255,255,0.08);
  --border-accent: rgba(212,168,67,0.22);

  /* Shadows */
  --shadow-card: 0 4px 24px rgba(0,0,0,0.35);
  --shadow-glow: 0 0 24px var(--gold-glow);

  /* Radii */
  --r-sm:  8px;
  --r-md:  12px;
  --r-lg:  18px;
  --r-xl:  24px;
}
```

## App Background:
```css
body {
  background: #060d1a;
  background-image: radial-gradient(
    ellipse 80% 50% at 50% -20%,
    rgba(212,168,67,0.12),
    transparent
  );
  min-height: 100vh;
}
```

## Card Style:
```css
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--r-lg);
  padding: 22px;
}
.card--gold-border { border-color: var(--border-accent); }
.card--product     { border-top: 3px solid var(--product-color); }
```

## Input Style:
```css
.input {
  width: 100%;
  background: var(--bg-elevated);
  border: 1.5px solid rgba(255,255,255,0.10);
  border-radius: var(--r-md);
  padding: 12px 14px;
  color: var(--text-primary);
  font-size: 0.95rem;
  font-family: 'Cairo', sans-serif;
  direction: rtl;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.input:focus {
  outline: none;
  border-color: var(--gold);
  box-shadow: 0 0 0 3px var(--gold-glow);
}
```

## Button Styles:
```css
.btn {
  border: none;
  border-radius: var(--r-md);
  padding: 11px 18px;
  font-weight: 700;
  font-family: 'Cairo', sans-serif;
  cursor: pointer;
  transition: opacity 0.18s, transform 0.18s;
}
.btn:hover  { opacity: 0.88; }
.btn:active { transform: scale(0.98); }

.btn--gold {
  background: linear-gradient(135deg, var(--gold), var(--gold-light));
  color: #060d1a;
}
.btn--ghost {
  background: var(--bg-elevated);
  color: var(--text-primary);
}
```

---

# CORE FEATURES SPECIFICATION

## Feature 1 — Welcome Modal (first launch)
- Triggers when no `tp:employee` key in localStorage
- Full-screen overlay with blur backdrop
- Input for employee name (required, Enter key submits)
- Save to localStorage on submit, close modal

## Feature 2 — Header
- Gold gradient icon + "Target Pro" title + subtitle
- Month navigator: ‹ [شهر سنة] › — cannot exceed current month
- Employee name with green pulsing online dot

## Feature 3 — Tab Navigation
| Tab ID     | Label              |
|------------|--------------------|
| dashboard  | 📊 لوحة التحكم     |
| targets    | 🎯 المستهدفات      |
| achieved   | ✅ الإنجاز         |

Active tab: gold color + 2px gold bottom border  
Inactive: muted color, transparent background

## Feature 4 — Dashboard

### 4a. HeroCard
- SVG Ring Chart (180×180px) using strokeDashoffset
- Color logic: ≥100% green | ≥70% gold | ≥40% blue | <40% red
- Centered text: large % + "الإنجاز الكلي" label
- 2×2 grid of mini-KPI cards:
  - المستهدف (gold) | المحقق (green) | الفجوة (red) | أيام متبقية (blue)

### 4b. ProductsGrid
- CSS Grid: `repeat(auto-fill, minmax(240px, 1fr))`
- Each ProductCard:
  - Header row: emoji + name + achievement %
  - Horizontal progress bar in product color
  - Footer: هدف X | محقق Y | فجوة Z
  - Border-top: 3px solid product color
  - Mount animation with staggered delay (n × 0.06s)

### 4c. ComparisonChart (Recharts BarChart)
- Two bars per product: "مستهدف" (gold, 20% opacity) + "محقق" (Cell with product color)
- Custom dark Tooltip
- Only render when at least one target > 0
- Responsive via ResponsiveContainer

### 4d. SmartTips
- Call `generateTips(data, daysInfo)` → array of Tip objects
- Render up to 4 TipCards
- Each TipCard: icon + bold title + body text
- Color-coded border + background by type (success/warning/danger/info)

## Feature 5 — Targets Form
- Number input per product, pre-filled with existing values
- Label: emoji + name + unit badge (right-aligned)
- Gold "💾 حفظ المستهدفات" button → save + toast + navigate to dashboard

## Feature 6 — Achievements Form
- Number input per product, pre-filled with existing values
- If target > 0: show mini progress bar + % badge above input
- Placeholder: "من أصل X [unit]" when target exists
- Gold "💾 حفظ الإنجازات" button → save + toast + navigate to dashboard

## Feature 7 — Month History Navigation
- Navigate backward to any past month (not forward beyond current)
- Each month is an independent localStorage key
- Data reloads automatically on month change

---

# SMART TIPS ENGINE (tipsEngine.ts)

```typescript
interface Tip {
  type: "success" | "warning" | "danger" | "info";
  icon: string;
  title: string;
  text: string;
}

interface DaysInfo {
  remaining: number;
  total: number;
  passed: number;
}

export function generateTips(data: MonthData, daysInfo: DaysInfo): Tip[]
```

## Decision Logic:

### Step 1 — No targets set → return 2 onboarding tips

### Step 2 — Overall performance (always first tip):
```
overallPct   = (totalAchieved / totalTarget) * 100
expectedPct  = (daysPassed / totalDays) * 100
dailyNeeded  = gap / daysRemaining

if overallPct >= 100   → SUCCESS "تجاوزت المستهدف!"
if overallPct >= expectedPct + 10 → SUCCESS "في المسار الصح!"
if overallPct < expectedPct - 15  → DANGER  "تحتاج تسرّع!" + dailyNeeded
else                   → WARNING "أداء متوسط — وقت تضغط"
```

### Step 3 — Worst product (if worstPct < 50%):
```
WARNING "ركز على [productName]"
Show: current % + gap units
```

### Step 4 — Best product (if bestPct ≥ 80% AND best ≠ worst):
```
SUCCESS "[productName] — نقطة قوتك!"
Show: achievement %
```

### Step 5 — Urgency (if daysRemaining ≤ 5 AND overallPct < 80%):
```
DANGER "ساعة الصفر! باقي X أيام"
```

### Step 6 — Pad with static rotating tips if total < 3:
- 📱 الواتساب أداة إغلاق قوية
- 🎁 بيع منتجين دفعة واحدة
- ⏰ وقت التواصل الأمثل (10 صبح / 4 مساء)
- 🤝 عملاء الشهادات المنتهية هم الأسهل

**Return max 4 tips.**

---

# ANIMATIONS (animations.css)

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px) translateX(-50%); }
  to   { opacity: 1; transform: translateY(0)    translateX(-50%); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

.fade-in { animation: fadeIn 0.4s ease both; }

/* Staggered product cards */
.product-card:nth-child(1) { animation-delay: 0.00s; }
.product-card:nth-child(2) { animation-delay: 0.06s; }
.product-card:nth-child(3) { animation-delay: 0.12s; }
.product-card:nth-child(4) { animation-delay: 0.18s; }
.product-card:nth-child(5) { animation-delay: 0.24s; }
.product-card:nth-child(6) { animation-delay: 0.30s; }

/* Ring chart smooth transition */
.ring-circle {
  transition: stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1),
              stroke 0.5s ease;
}
```

---

# PWA CONFIGURATION (vite.config.ts)

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Target Pro — نظام المستهدفات البنكية",
        short_name: "Target Pro",
        description: "تتبع مستهدفاتك البنكية باحترافية",
        theme_color: "#060d1a",
        background_color: "#060d1a",
        display: "standalone",
        orientation: "portrait",
        lang: "ar",
        dir: "rtl",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
      },
    }),
  ],
});
```

---

# RESPONSIVENESS RULES
- Mobile-first: base styles for ≤ 480px
- ProductsGrid: `auto-fill minmax(240px, 1fr)`
- HeroCard: `flex-wrap`, Ring shrinks on mobile
- Header: `flex-wrap` for small screens
- All inputs: min-height 48px (touch-friendly)
- Padding halves on screens < 480px

---

# CODING STANDARDS
- Strict TypeScript — no `any`
- `useMemo` for all stats and tips calculations
- `useCallback` for all event handlers in forms
- Named exports for all components
- CSS class names: BEM-style (`.product-card__progress-bar`)
- All user-facing text in Arabic
- `direction="rtl"` on root div
- Google Fonts loaded via `useEffect` (inject `<link>` tag dynamically)
- No external UI libraries — pure CSS + Recharts only

---

# WHAT NOT TO DO
- ❌ No backend, no API calls, no authentication
- ❌ No Tailwind, no styled-components, no CSS-in-JS
- ❌ No Redux, no Zustand — useState + useReducer only
- ❌ No date libraries (dayjs/moment) — use native Date API
- ❌ No UI component libraries (shadcn / MUI / Ant Design)
- ❌ Don't hardcode month names — use MONTHS_AR array
- ❌ Don't break the 6-product structure
- ❌ Don't use random colors — respect the product color system
- ❌ Don't rewrite features not listed here
