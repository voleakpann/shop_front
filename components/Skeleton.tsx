import { CSSProperties } from "react";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
  style?: CSSProperties;
}

export default function Skeleton({
  width = "100%",
  height = 16,
  radius = 6,
  className = "",
  style,
}: SkeletonProps) {
  return (
    <span
      className={`skeleton ${className}`}
      style={{
        display: "block",
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
    />
  );
}
