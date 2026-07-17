import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
  MailIcon,
} from "./icons";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Shop", href: "/shop" },
  { label: "Blogs", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const helpLinks = [
  "Track Your Order",
  "Returns Policies",
  "Shipping + Delivery",
  "Contact Us",
  "FAQs",
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-x grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link href="/" className="text-2xl font-semibold text-ink">
            Mini<span className="font-light">Store</span>
            <span className="text-brand">.</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Nisi, purus vitae, ultrices nunc. Sit at sit suscipit hendrerit.
            Gravida massa volutpat aenean odio erat nullam fringilla.
          </p>
          <div className="mt-5 flex items-center gap-4 text-muted">
            <a href="#" aria-label="Facebook" className="hover:text-brand"><FacebookIcon /></a>
            <a href="#" aria-label="Instagram" className="hover:text-brand"><InstagramIcon /></a>
            <a href="#" aria-label="Twitter" className="hover:text-brand"><TwitterIcon /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-brand"><LinkedinIcon /></a>
            <a href="#" aria-label="Email" className="hover:text-brand"><MailIcon /></a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="mb-5 text-sm font-medium uppercase tracking-[0.12em] text-ink">
            Quick Links
          </h4>
          <ul className="space-y-3 text-sm">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="link-muted">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help & info */}
        <div>
          <h4 className="mb-5 text-sm font-medium uppercase tracking-[0.12em] text-ink">
            Help &amp; Info
          </h4>
          <ul className="space-y-3 text-sm">
            {helpLinks.map((l) => (
              <li key={l}>
                <a href="#" className="link-muted">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact us */}
        <div>
          <h4 className="mb-5 text-sm font-medium uppercase tracking-[0.12em] text-ink">
            Contact Us
          </h4>
          <p className="text-sm leading-relaxed text-muted">
            Do you have any queries or suggestions?
          </p>
          <a href="mailto:yourinfo@gmail.com" className="mt-1 block text-sm text-brand">
            yourinfo@gmail.com
          </a>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            If you need support? Just give us a call.
          </p>
          <a href="tel:+5511122233344" className="mt-1 block text-sm text-brand">
            +55 111 222 333 44
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted sm:flex-row">
          <p>
            We ship with:{" "}
            <span className="font-medium text-ink">DHL · FedEx · UPS</span>
          </p>
          <p>
            © Copyright {new Date().getFullYear()} MiniStore. Design by{" "}
            <span className="text-ink">TemplatesJungle</span>
          </p>
          <p>
            Payment options:{" "}
            <span className="font-medium text-ink">VISA · Mastercard · PayPal</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
