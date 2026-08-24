"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Fade out once hydration/first paint settles
    const t = setTimeout(() => setHidden(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      aria-hidden={hidden}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        transition: "opacity 0.4s ease, visibility 0.4s ease",
        opacity: hidden ? 0 : 1,
        visibility: hidden ? "hidden" : "visible",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: "3px solid #eee",
          borderTopColor: "var(--anim-accent)",
          borderRadius: "50%",
          animation: "anim-spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes anim-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
