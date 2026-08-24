"use client";

import React, { ReactNode, CSSProperties, useEffect, useRef, ForwardedRef } from "react";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";

type BlockElement = keyof React.JSX.IntrinsicElements;

interface AnimatedBlockProps extends React.ComponentProps<'div'> {
  children: ReactNode;
  as?: BlockElement;
  stagger?: boolean;
  staggerStep?: number;
}

export default function AnimatedBlock({
  children,
  className = "",
  as: Component = "div" as BlockElement,
  stagger = false,
  staggerStep = 80,
  style,
  ...rest
}: AnimatedBlockProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { ref, inView } = useInViewAnimation<HTMLElement>({
    threshold: 0.15,
  });

  useEffect(() => {
    if (containerRef.current) {
      const cascadeElements = containerRef.current.querySelectorAll(".card-cascade");
      cascadeElements.forEach((el) => {
        if (inView) {
          el.classList.add("in-view");
        } else {
          el.classList.remove("in-view");
        }
      });
    }
  }, [inView]);

  const processedChildren = stagger
    ? Array.isArray(children)
      ? children.map((child, idx) => (
          <div
            key={idx}
            className={`card-cascade ${inView ? "in-view" : ""}`}
            style={{
              transitionDelay: inView ? `${idx * staggerStep}ms` : "0ms",
            }}
          >
            {child}
          </div>
        ))
      : children
    : children;

  return React.createElement(
    Component,
    {
      ref: containerRef,
      className: `block-reveal ${inView ? "in-view" : ""} ${className}`.trim(),
      style: style as CSSProperties,
      suppressHydrationWarning: true,
      ...rest,
    },
    processedChildren
  );
}
