"use client";

import { ReactNode } from "react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

interface Props {
  children: ReactNode;
  /** index within its section — used for stagger (~60ms each) */
  index?: number;
}

export default function AnimatedProductCard({ children, index = 0 }: Props) {
  const { ref, inView } = useInViewAnimation<HTMLDivElement>({
    delay: index * 60,
  });

  return (
    <div
      ref={ref}
      className={`reveal product-card-anim ${inView ? "in-view" : ""}`}
    >
      {children}
    </div>
  );
}
