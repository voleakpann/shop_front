import { DownloadIcon } from "./icons";

/** Overlay link that downloads the original, full-resolution image file. */
export default function DownloadButton({
  src,
  filename,
  className = "",
}: {
  src: string;
  filename?: string;
  className?: string;
}) {
  return (
    <a
      href={src}
      download={filename || true}
      onClick={(e) => e.stopPropagation()}
      aria-label="Download full-resolution image"
      title="Download HD image"
      className={`absolute z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow transition-opacity duration-200 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 ${className}`}
    >
      <DownloadIcon className="h-4 w-4" />
    </a>
  );
}
