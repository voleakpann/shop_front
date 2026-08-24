"use client";

import { useEffect, useState } from "react";
import { progressBar } from "@/lib/progress-bar";

export default function PageProgressBar() {
  const [value, setValue] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = progressBar.subscribe(({ value, visible }) => {
      setValue(value);
      setVisible(visible);
    });
    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 9999,
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${value}%`,
          background: "var(--anim-accent)",
          boxShadow: "0 0 8px var(--anim-accent)",
          transition: "width 0.25s ease",
        }}
      />
    </div>
  );
}
