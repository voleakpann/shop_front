"use client";

import { ReactNode } from "react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

interface Props {
  title: string;
  action?: ReactNode; // e.g. the "GO TO SHOP" link
}

export default function SectionHeaderAnimated({ title, action }: Props) {
  const { ref, inView } = useInViewAnimation<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal-left ${inView ? "in-view" : ""}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "8px 0 20px",
      }}
    >
      <h2
        style={{
          fontSize: 14,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#c9975b",
          fontWeight: 600,
        }}
      >
        {title}
      </h2>
      {action}
    </div>
  );
}
