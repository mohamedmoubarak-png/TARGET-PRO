import React from "react";

export function Footer() {
  return (
    <footer style={{
      textAlign: "center",
      padding: "24px 16px 20px",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      marginTop: "16px"
    }}>
      <p style={{
        color: "rgba(255,255,255,0.18)",
        fontSize: "0.75rem",
        letterSpacing: "0.04em",
        fontFamily: "'Cairo', sans-serif"
      }}>
        Developed with ❤️ by{" "}
        <span style={{ color: "rgba(212,168,67,0.45)", fontWeight: "bold" }}>
          MOHAMED SAYED
        </span>
        {" "}• Target Pro v1.0
      </p>
    </footer>
  );
}
