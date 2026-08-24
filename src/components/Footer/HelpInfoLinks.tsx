import Link from 'next/link';
import { ReactNode } from 'react';

interface FooterLink {
  label: string;
  href: string;
}

interface HelpInfoLinksProps {
  title?: string;
  links?: FooterLink[];
}

const defaultLinks: FooterLink[] = [
  { label: 'Track Your Order', href: '/track-order' },
  { label: 'Returns Policies', href: '/returns-policy' },
  { label: 'Shipping + Delivery', href: '/shipping-delivery' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'FAQs', href: '/faqs' },
];

export default function HelpInfoLinks({
  title = 'HELP & INFO',
  links = defaultLinks,
}: HelpInfoLinksProps): ReactNode {
  return (
    <nav className="flex flex-col">
      {/* Section Heading */}
      <h3 className="text-xs font-bold tracking-wide text-gray-900 uppercase mb-4">
        {title}
      </h3>

      {/* Links List */}
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-gray-500 text-sm transition-colors duration-200 hover:text-gray-900"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
