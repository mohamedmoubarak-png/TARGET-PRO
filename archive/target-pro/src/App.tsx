import React, { useState, useCallback } from "react";
import { Header } from "./components/Header";
import { NavTabs } from "./components/NavTabs";
import type { TabId } from "./components/NavTabs";
import { DashboardView } from "./components/dashboard/DashboardView";
import { TargetsForm } from "./components/forms/TargetsForm";
import { AchievementsForm } from "./components/forms/AchievementsForm";
import { ProductsManager } from "./components/settings/ProductsManager";
import { Footer } from "./components/Footer";
import { WelcomeModal } from "./components/ui/WelcomeModal";
import { Toast } from "./components/ui/Toast";
import { useEmployeeInfo } from "./hooks/useEmployeeName";
import { useMonthData } from "./hooks/useMonthData";
import { useProducts } from "./hooks/useProducts";
import { getCurrentMonthKey, getPreviousMonthKey, getMonthLabel, getDaysInfo } from "./utils/dateUtils";

function App() {
  const { name, jobTitle, saveInfo, isLoaded } = useEmployeeInfo();
  const [currentMonthKey, setCurrentMonthKey] = useState(getCurrentMonthKey());
  const { data, saveData } = useMonthData(currentMonthKey);
  const { products, addProduct, removeProduct, resetToDefaults } = useProducts();

  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const daysInfo = getDaysInfo(currentMonthKey);
  const isCurrentMonth = currentMonthKey === getCurrentMonthKey();

  const handlePrevMonth = () => setCurrentMonthKey(getPreviousMonthKey(currentMonthKey));

  const handleNextMonth = () => {
    if (!isCurrentMonth) {
      const parts = currentMonthKey.split(":");
      const [year, month] = parts[2].split("-").map(Number);
      let ny = year, nm = month + 1;
      if (nm > 12) { nm = 1; ny++; }
      setCurrentMonthKey(`tp:m:${ny}-${String(nm).padStart(2, "0")}`);
    }
  };

  const handleSaveTargets = useCallback((newData: Parameters<typeof saveData>[0]) => {
    saveData(newData);
    setToastMessage("تم حفظ المستهدفات بنجاح! 💾");
    setActiveTab("dashboard");
  }, [saveData]);

  const handleSaveAchievements = useCallback((newData: Parameters<typeof saveData>[0]) => {
    saveData(newData);
    setToastMessage("تم تسجيل الإنجازات بنجاح! ✅");
    setActiveTab("dashboard");
  }, [saveData]);

  const handleAddProduct = useCallback((product: Parameters<typeof addProduct>[0]) => {
    addProduct(product);
    setToastMessage("تم إضافة المنتج بنجاح! ✨");
  }, [addProduct]);

  const handleRemoveProduct = useCallback((id: string) => {
    removeProduct(id);
    setToastMessage("تم حذف المنتج 🗑️");
  }, [removeProduct]);

  const handleResetProducts = useCallback(() => {
    resetToDefaults();
    setToastMessage("تم إعادة تعيين المنتجات 🔄");
  }, [resetToDefaults]);

  const handleUpdateInfo = useCallback((newName: string, newJob: string) => {
    saveInfo(newName, newJob);
    setToastMessage("تم تحديث بياناتك بنجاح ✅");
  }, [saveInfo]);

  if (!isLoaded) return null;

  const showWelcome = !name || !jobTitle;

  // Bottom nav tabs (mobile)
  const navTabs = [
    { id: "dashboard" as TabId, icon: "📊", label: "لوحة التحكم" },
    { id: "targets"   as TabId, icon: "🎯", label: "المستهدفات" },
    { id: "achieved"  as TabId, icon: "✅", label: "الإنجاز" },
    { id: "settings"  as TabId, icon: "⚙️", label: "الإعدادات" },
  ];

  return (
    <>
      {showWelcome && <WelcomeModal onSave={saveInfo} />}

      <div style={{ maxWidth: "1200px", margin: "0 auto", paddingBottom: "40px" }}>
        <Header
          employeeName={name || ""}
          jobTitle={jobTitle || ""}
          monthLabel={getMonthLabel(currentMonthKey)}
          daysInfo={daysInfo}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          hasNextMonth={!isCurrentMonth}
        />

        {/* Desktop Tabs */}
        <div className="top-nav">
          <NavTabs activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <main className="main-content">
          {activeTab === "dashboard" && <DashboardView data={data} daysInfo={daysInfo} products={products} />}
          {activeTab === "targets"   && <TargetsForm initialData={data} products={products} onSave={handleSaveTargets} />}
          {activeTab === "achieved"  && <AchievementsForm initialData={data} products={products} onSave={handleSaveAchievements} />}
          {activeTab === "settings"  && (
            <ProductsManager
              products={products}
              employeeName={name || ""}
              jobTitle={jobTitle || ""}
              onAdd={handleAddProduct}
              onRemove={handleRemoveProduct}
              onReset={handleResetProducts}
              onUpdateInfo={handleUpdateInfo}
            />
          )}
        </main>

        <Footer />
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav">
        {navTabs.map(t => (
          <button key={t.id} className={activeTab === t.id ? "active" : ""} onClick={() => setActiveTab(t.id)}>
            <span className="nav-icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </>
  );
}

export default App;
