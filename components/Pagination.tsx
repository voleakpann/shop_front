import { ChevronLeft, ChevronRight } from "./icons";

/** Arrow + numbered pagination used on Shop / Blog list pages. */
export default function Pagination({ pages = 3, active = 1 }: { pages?: number; active?: number }) {
  return (
    <div className="mt-12 flex items-center justify-center gap-4 text-muted">
      <button aria-label="Previous" className="hover:text-brand">
        <ChevronLeft className="h-5 w-5" />
      </button>
      {Array.from({ length: pages }).map((_, i) => {
        const n = i + 1;
        return (
          <button
            key={n}
            className={`text-sm ${n === active ? "font-medium text-ink" : "hover:text-ink"}`}
          >
            {n}
          </button>
        );
      })}
      <button aria-label="Next" className="hover:text-brand">
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
