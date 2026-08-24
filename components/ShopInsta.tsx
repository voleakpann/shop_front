import Ph from "./Ph";
import { instaImages } from "@/lib/data";

export default function ShopInsta() {
  return (
    <section className="container-x py-8 text-center">
      <h3 className="section-heading mb-8">Shop Our Insta</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {instaImages.map((src, i) => (
          <a
            key={i}
            href="https://instagram.com/yourstore"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-square overflow-hidden"
            title="Follow us on Instagram"
          >
            <Ph
              src={src}
              alt={`Instagram post ${i + 1}`}
              sizes="(max-width: 768px) 50vw, 220px"
              className="h-full w-full transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/10 flex items-center justify-center">
              <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">📷</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
