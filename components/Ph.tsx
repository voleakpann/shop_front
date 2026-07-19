import Image from "next/image";
import DownloadButton from "./DownloadButton";

/**
 * Image with graceful fallback.
 * If `src` is provided it renders a real next/image; otherwise it shows a
 * tasteful light-grey box with a product/camera glyph so the layout reads
 * correctly before real assets are dropped in.
 */
export default function Ph({
  src,
  alt = "",
  className = "",
  label,
  glyph = "product",
  fit = "cover",
  sizes = "(max-width: 768px) 100vw, 400px",
  downloadable = false,
  downloadName,
}: {
  src?: string;
  alt?: string;
  className?: string;
  label?: string;
  glyph?: "product" | "watch" | "photo";
  fit?: "cover" | "contain";
  sizes?: string;
  /** Show a hover button to download the original, full-resolution file. */
  downloadable?: boolean;
  downloadName?: string;
}) {
  if (src) {
    return (
      <div className={`group relative overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          draggable={false}
          className={fit === "contain" ? "object-contain" : "object-cover"}
        />
        {downloadable && (
          <DownloadButton src={src} filename={downloadName} className="bottom-3 right-3" />
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-[#f2f3f5] text-[#c9ccd1] ${className}`}
      role="img"
      aria-label={alt || label || "image placeholder"}
    >
      <Glyph type={glyph} />
      {label ? <span className="sr-only">{label}</span> : null}
    </div>
  );
}

function Glyph({ type }: { type: "product" | "watch" | "photo" }) {
  const common = "h-1/4 w-1/4 max-h-16 max-w-16 min-h-8 min-w-8";
  if (type === "watch") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth={1.2}>
        <rect x="7" y="7" width="10" height="10" rx="2" />
        <path d="M9 7l.6-3h4.8L15 7M9 17l.6 3h4.8l.6-3" />
      </svg>
    );
  }
  if (type === "photo") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth={1.2}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="10" r="1.5" />
        <path d="M3 17l5-4 4 3 3-2 6 4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth={1.2}>
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </svg>
  );
}
