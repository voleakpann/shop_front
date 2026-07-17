"use client";

export default function Newsletter() {
  return (
    <section className="container-x py-14">
      <div className="flex flex-col items-start justify-between gap-6 bg-charcoal px-8 py-10 text-white sm:px-12 md:flex-row md:items-center">
        <div>
          <h3 className="text-2xl font-light uppercase tracking-[0.08em]">
            Subscribe Us Now
          </h3>
          <p className="mt-2 text-sm text-white/70">
            Get latest news, updates and deals directly mailed to your inbox.
          </p>
        </div>
        <form
          className="flex w-full max-w-md items-stretch"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            required
            placeholder="Your email address here"
            className="w-full bg-white px-4 py-3 text-sm text-ink outline-none placeholder:text-muted"
          />
          <button type="submit" className="btn bg-brand px-6 text-white hover:bg-brand-dark">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
