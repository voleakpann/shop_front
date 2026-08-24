import { TruckIcon, BadgeIcon, TagIcon, ShieldIcon } from "./icons";

const features = [
  { Icon: TruckIcon, title: "Free Delivery", text: "Free shipping on every order, no minimum spend required." },
  { Icon: BadgeIcon, title: "Quality Guarantee", text: "Every product is checked for quality before it ships." },
  { Icon: TagIcon, title: "Daily Offers", text: "New deals and discounts added to the store every day." },
  { Icon: ShieldIcon, title: "100% Secure Payment", text: "Your payment details are encrypted and always protected." },
];

export default function FeatureBar() {
  return (
    <section id="services" className="container-x scroll-mt-24 py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map(({ Icon, title, text }, idx) => (
          <div
            key={title}
            className="card-cascade flex items-start gap-3"
            style={{ transitionDelay: `${idx * 80}ms` }}
          >
            <Icon className="mt-0.5 h-7 w-7 shrink-0 text-ink" />
            <div>
              <h4 className="text-sm font-medium uppercase tracking-[0.08em] text-ink">
                {title}
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-muted">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
