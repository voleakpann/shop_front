import Link from "next/link";

/** Light-grey banner with a big centred title and breadcrumb (inner pages). */
export default function PageHeader({
  title,
  crumbs,
}: {
  title: string;
  crumbs: { label: string; href?: string }[];
}) {
  return (
    <section className="bg-band">
      <div className="container-x py-16 text-center sm:py-20">
        <h1 className="page-title">{title}</h1>
        <nav className="mt-4 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.1em] text-muted">
          {crumbs.map((c, i) => (
            <span key={c.label} className="flex items-center gap-2">
              {c.href ? (
                <Link href={c.href} className="hover:text-ink">{c.label}</Link>
              ) : (
                <span className="text-brand">{c.label}</span>
              )}
              {i < crumbs.length - 1 && <span>›</span>}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
