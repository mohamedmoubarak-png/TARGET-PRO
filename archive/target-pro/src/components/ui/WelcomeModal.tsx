import React, { useState } from "react";

const JOB_TITLES = [
  "مدير علاقات عملاء",
  "مسؤول مبيعات",
  "موظف خدمة عملاء",
  "مشرف مبيعات",
  "مدير فرع",
  "أخصائي تمويل",
  "موظف تحصيل",
];

interface WelcomeModalProps {
  onSave: (name: string, jobTitle: string) => void;
}

export function WelcomeModal({ onSave }: WelcomeModalProps) {
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [customJob, setCustomJob] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && jobTitle.trim()) {
      onSave(name.trim(), jobTitle.trim());
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(6, 13, 26, 0.92)",
      backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 10000,
      padding: "20px"
    }}>
      <div className="card card--gold-border fade-in" style={{ width: "100%", maxWidth: "440px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "8px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "8px" }}>🎯</div>
          <h2 style={{ color: "var(--gold)", marginBottom: "4px", fontSize: "1.5rem" }}>أهلاً بك في Target Pro</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>نظام تتبع المستهدفات البنكية الاحترافي</p>
        </div>

        <div style={{ height: "1px", background: "var(--border-subtle)", margin: "20px 0" }} />

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Name */}
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              الاسم الكريم *
            </label>
            <input
              type="text"
              className="input"
              placeholder="أدخل اسمك..."
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Job Title */}
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              المسمى الوظيفي *
            </label>
            {!customJob ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <select
                  className="input"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  style={{ cursor: "pointer" }}
                >
                  <option value="">-- اختر المسمى الوظيفي --</option>
                  {JOB_TITLES.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
                <button
                  type="button"
                  onClick={() => { setCustomJob(true); setJobTitle(""); }}
                  style={{ background: "none", border: "none", color: "var(--gold)", fontSize: "0.82rem", cursor: "pointer", textAlign: "right", fontFamily: "'Cairo', sans-serif" }}>
                  + أدخل مسمى وظيفي مخصص
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <input
                  type="text"
                  className="input"
                  placeholder="مثال: أخصائي بيع المنتجات..."
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => { setCustomJob(false); setJobTitle(""); }}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.82rem", cursor: "pointer", textAlign: "right", fontFamily: "'Cairo', sans-serif" }}>
                  ← الرجوع للاختيار من القائمة
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn--gold"
            disabled={!name.trim() || !jobTitle.trim()}
            style={{ marginTop: "6px", fontSize: "1rem" }}>
            ابدأ الآن 🚀
          </button>
        </form>
      </div>
    </div>
  );
}
