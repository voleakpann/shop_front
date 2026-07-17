export default function Dots({ count = 3, active = 0 }: { count?: number; active?: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full ${i === active ? "bg-ink" : "bg-line"}`}
        />
      ))}
    </div>
  );
}
