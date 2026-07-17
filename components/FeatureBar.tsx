import { TruckIcon, BadgeIcon, TagIcon, ShieldIcon } from "./icons";

const features = [
  { Icon: TruckIcon, title: "Free Delivery", text: "Consectetur adipi elit lorem ipsum dolor sit amet." },
  { Icon: BadgeIcon, title: "Quality Guarantee", text: "Dolor sit amet orem ipsu mcons ectetur adipi elit." },
  { Icon: TagIcon, title: "Daily Offers", text: "Amet consectetur adipi elit loreme ipsum dolor sit." },
  { Icon: ShieldIcon, title: "100% Secure Payment", text: "Rem Lopsum dolor sit amet, consectetur adipi elit." },
];

export default function FeatureBar() {
  return (
    <section id="services" className="container-x scroll-mt-24 py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map(({ Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3">
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
