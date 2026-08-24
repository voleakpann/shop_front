"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "./icons";

/** Clean pagination with arrow icons and clickable page numbers. */
export default function Pagination({ pages = 3, active = 1 }: { pages?: number; active?: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = parseInt(searchParams.get("page") || "0");

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 0) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const qs = params.toString();
    return qs ? `?${qs}` : pathname;
  };

  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < pages - 1;

  return (
    <div className="mt-12 flex items-center justify-center gap-3 text-sm text-muted">
      {/* Previous Arrow */}
      {canGoPrevious ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center hover:text-brand transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
      ) : (
        <span className="flex h-8 w-8 items-center justify-center opacity-30 cursor-not-allowed">
          <ChevronLeft className="h-5 w-5" />
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {Array.from({ length: pages }).map((_, i) => {
          const pageNum = i;
          const pageDisplay = i + 1;
          return (
            <Link
              key={pageNum}
              href={getPageUrl(pageNum)}
              className={`flex h-8 w-8 items-center justify-center text-sm font-medium transition-colors ${
                pageNum === currentPage
                  ? "text-ink font-semibold"
                  : "text-muted hover:text-ink"
              }`}
              aria-label={`Go to page ${pageDisplay}`}
              aria-current={pageNum === currentPage ? "page" : undefined}
            >
              {pageDisplay}
            </Link>
          );
        })}
      </div>

      {/* Next Arrow */}
      {canGoNext ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center hover:text-brand transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      ) : (
        <span className="flex h-8 w-8 items-center justify-center opacity-30 cursor-not-allowed">
          <ChevronRight className="h-5 w-5" />
        </span>
      )}
    </div>
  );
}
