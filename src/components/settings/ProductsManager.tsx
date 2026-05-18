import React, { useState, useCallback } from "react";
import { Product } from "../../types";

const PRESET_EMOJIS = ["🏆", "💰", "💳", "🏦", "🛡️", "📱", "📊", "🎯", "💎", "🔑", "📈", "🤝", "🏠", "🚗", "⭐", "💼"];
const PRESET_COLORS = [
  "#D4A843", "#4F9CF9", "#A78BFA", "#34D399",
  "#F87171", "#22D3EE", "#FB923C", "#F472B6",
  "#86EFAC", "#67E8F9", "#C084FC", "#FCD34D"
];
const UNITS = ["عدد", "ألف ج.م", "عميل", "عقد"];
const JOB_TITLES = [
  "مدير علاقات عملاء", "مسؤول مبيعات", "موظف خدمة عملاء",
  "مشرف مبيعات", "مدير فرع", "أخصائي تمويل", "موظف تحصيل",
];

interface ProductsManagerProps {
  products: Product[];
  employeeName: string;
  jobTitle: string;
  onAdd: (product: Omit<Product, "id">) => void;
  onRemove: (id: string) => void;
  onReset: () => void;
  onUpdateInfo: (name: string, job: string) => void;
}

export function ProductsManager({ products, employeeName, jobTitle, onAdd, onRemove, onReset, onUpdateInfo }: ProductsManagerProps) {
  // Profile edit state
  const [nameEdit, setNameEdit] = useState(employeeName);
  const [jobEdit, setJobEdit] = useState(jobTitle);
  const [customJob, setCustomJob] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Product form state
  const [form, setForm] = useState({ name: "", short: "", emoji: "🎯", unit: "عدد", color: "#4F9CF9" });
  const [showForm, setShowForm] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [error, setError] = useState("");

  const handleSaveProfile = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEdit.trim() || !jobEdit.trim()) return;
    onUpdateInfo(nameEdit.trim(), jobEdit.trim());
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  }, [nameEdit, jobEdit, onUpdateInfo]);

  const handleAdd = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("اسم المنتج مطلوب"); return; }
    if (!form.short.trim()) { setError("الاسم المختصر مطلوب"); return; }
    setError("");
    onAdd({ name: form.name.trim(), short: form.short.trim(), emoji: form.emoji, unit: form.unit, color: form.color });
    setForm({ name: "", short: "", emoji: "🎯", unit: "عدد", color: "#4F9CF9" });
    setShowForm(false);
  }, [form, onAdd]);

  return (
    <div className="fade-in" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "28px" }}>

      {/* ── Section 1: Profile ── */}
      <section>
        <h2 style={{ color: "var(--gold)", marginBottom: "4px", fontSize: "1.1rem" }}>👤 بياناتك الشخصية</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "16px" }}>يمكنك تعديل اسمك أو مسماك الوظيفي في أي وقت</p>
        <form onSubmit={handleSaveProfile} className="card card--gold-border" style={{ display: "grid", gap: "14px", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>الاسم</label>
            <input className="input" type="text" value={nameEdit} onChange={e => setNameEdit(e.target.value)} placeholder="اسمك الكريم..." />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>المسمى الوظيفي</label>
            {!customJob ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <select className="input" value={JOB_TITLES.includes(jobEdit) ? jobEdit : ""} onChange={e => setJobEdit(e.target.value)} style={{ cursor: "pointer" }}>
                  <option value="">-- اختر --</option>
                  {JOB_TITLES.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
                <button type="button" onClick={() => { setCustomJob(true); }} style={{ background: "none", border: "none", color: "var(--gold)", fontSize: "0.8rem", cursor: "pointer", textAlign: "right", fontFamily: "'Cairo', sans-serif" }}>
                  + مسمى مخصص
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <input className="input" type="text" value={jobEdit} onChange={e => setJobEdit(e.target.value)} placeholder="مسماك الوظيفي..." />
                <button type="button" onClick={() => setCustomJob(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.8rem", cursor: "pointer", textAlign: "right", fontFamily: "'Cairo', sans-serif" }}>
                  ← الاختيار من القائمة
                </button>
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gridColumn: "1 / -1" }}>
            <button type="submit" className="btn btn--gold" disabled={!nameEdit.trim() || !jobEdit.trim()}>
              {profileSaved ? "✅ تم الحفظ!" : "💾 حفظ البيانات"}
            </button>
          </div>
        </form>
      </section>

      {/* ── Divider ── */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

      {/* ── Section 2: Products ── */}
      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          <div>
            <h2 style={{ color: "var(--gold)", marginBottom: "4px", fontSize: "1.1rem" }}>📦 إدارة المنتجات</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>أضف أو احذف المنتجات حسب مستهدفاتك</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            {!showForm && (
              <button className="btn btn--gold" onClick={() => setShowForm(true)}>+ إضافة منتج</button>
            )}
            <button className="btn btn--ghost" style={{ color: "var(--danger)", border: "1px solid var(--danger-bd)" }} onClick={() => setConfirmReset(true)}>
              🔄 إعادة تعيين
            </button>
          </div>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="card card--gold-border fade-in" style={{ marginBottom: "20px" }}>
            <h3 style={{ marginBottom: "18px" }}>➕ منتج جديد</h3>
            <form onSubmit={handleAdd}>
              <div style={{ display: "grid", gap: "14px", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "0.82rem", color: "var(--text-secondary)" }}>الاسم الكامل *</label>
                  <input className="input" type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="مثال: القروض العقارية" />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "0.82rem", color: "var(--text-secondary)" }}>الاسم المختصر *</label>
                  <input className="input" type="text" value={form.short} onChange={e => setForm({ ...form, short: e.target.value })} placeholder="مثال: عقاري" maxLength={8} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontSize: "0.82rem", color: "var(--text-secondary)" }}>وحدة القياس</label>
                  <select className="input" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} style={{ cursor: "pointer" }}>
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginTop: "14px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "0.82rem", color: "var(--text-secondary)" }}>الأيقونة</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {PRESET_EMOJIS.map(em => (
                    <button key={em} type="button" onClick={() => setForm({ ...form, emoji: em })}
                      style={{ fontSize: "1.4rem", width: "42px", height: "42px", background: form.emoji === em ? "var(--gold-glow)" : "var(--bg-elevated)", border: form.emoji === em ? "2px solid var(--gold)" : "1px solid var(--border-subtle)", borderRadius: "var(--r-sm)", cursor: "pointer" }}>
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "14px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "0.82rem", color: "var(--text-secondary)" }}>اللون</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                  {PRESET_COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                      style={{ width: "32px", height: "32px", borderRadius: "50%", background: c, border: form.color === c ? "3px solid white" : "2px solid transparent", cursor: "pointer", outline: form.color === c ? `2px solid ${c}` : "none" }} />
                  ))}
                  <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}
                    style={{ width: "32px", height: "32px", border: "none", borderRadius: "50%", cursor: "pointer", padding: 0, background: "none" }} title="لون مخصص" />
                </div>
              </div>

              {error && <p style={{ color: "var(--danger)", marginTop: "10px", fontSize: "0.88rem" }}>{error}</p>}
              <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
                <button type="submit" className="btn btn--gold">{form.emoji} إضافة "{form.name || 'منتج'}"</button>
                <button type="button" className="btn btn--ghost" onClick={() => { setShowForm(false); setError(""); }}>إلغاء</button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))" }}>
          {products.map(p => (
            <div key={p.id} className="card fade-in" style={{ borderTop: `3px solid ${p.color}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "14px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "1.6rem" }}>{p.emoji}</span>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "0.95rem" }}>{p.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {p.short} • {p.unit}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: p.color, border: "2px solid var(--border-subtle)" }} />
                <button onClick={() => onRemove(p.id)} title="حذف"
                  style={{ background: "var(--danger-bg)", border: "1px solid var(--danger-bd)", color: "var(--danger)", borderRadius: "var(--r-sm)", padding: "5px 10px", cursor: "pointer", fontSize: "0.82rem", fontFamily: "'Cairo', sans-serif", transition: "all 0.2s" }}>
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>

        <p style={{ marginTop: "16px", color: "var(--text-subtle)", fontSize: "0.8rem", textAlign: "center" }}>
          {products.length} منتج نشط • استخدم "إعادة تعيين" لاستعادة القائمة الافتراضية
        </p>
      </section>

      {/* Confirm Reset */}
      {confirmReset && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(6,13,26,0.85)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
          <div className="card card--gold-border fade-in" style={{ maxWidth: "350px", width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "10px" }}>⚠️</div>
            <h3 style={{ marginBottom: "8px" }}>إعادة تعيين المنتجات</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "22px", lineHeight: 1.5, fontSize: "0.9rem" }}>
              سيتم الرجوع للقائمة الافتراضية. هل أنت متأكد؟
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button className="btn btn--ghost" onClick={() => setConfirmReset(false)}>إلغاء</button>
              <button className="btn" style={{ background: "var(--danger-bg)", color: "var(--danger)", border: "1px solid var(--danger-bd)" }}
                onClick={() => { onReset(); setConfirmReset(false); }}>
                نعم، إعادة تعيين
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
