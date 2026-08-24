import Skeleton from "./Skeleton";

export default function ProductCardSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Image block */}
      <Skeleton height={230} radius={8} />
      {/* Title line */}
      <Skeleton width="70%" height={14} />
      {/* Price line */}
      <Skeleton width="35%" height={14} />
    </div>
  );
}

/** Grid of N card skeletons — drop into any product section while loading */
export function ProductCardSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 16,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
