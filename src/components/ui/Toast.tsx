import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "var(--success)" : "var(--danger)";

  return (
    <div style={{
      position: "fixed",
      bottom: "24px",
      left: "50%",
      transform: "translateX(-50%)",
      background: bgColor,
      color: "#fff",
      padding: "12px 24px",
      borderRadius: "var(--r-md)",
      boxShadow: "var(--shadow-card)",
      zIndex: 9999,
      fontWeight: "bold",
      fontFamily: "'Cairo', sans-serif"
    }} className="fade-in">
      {message}
    </div>
  );
}
