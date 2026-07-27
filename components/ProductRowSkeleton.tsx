export default function ProductRowSkeleton({ title }: { title: string }) {
  return (
    <section className="container-x scroll-mt-24 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="section-heading">{title}</h2>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div
              className="animate-pulse bg-[#f2f3f5]"
              style={{ aspectRatio: "310 / 418" }}
            />
            <div className="mt-3 h-4 w-2/3 animate-pulse bg-[#f2f3f5]" />
          </div>
        ))}
      </div>
    </section>
  );
}
