import HelpInfoLinks from './HelpInfoLinks';

// Example 1: Using default "HELP & INFO" with default links
export function FooterExample1() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-4 gap-8">
        <HelpInfoLinks />
      </div>
    </footer>
  );
}

// Example 2: Custom "SHOP" section with different links
export function FooterExample2() {
  const shopLinks = [
    { label: 'New Arrivals', href: '/products?filter=new' },
    { label: 'Best Sellers', href: '/products?filter=bestsellers' },
    { label: 'Sale', href: '/products?filter=sale' },
    { label: 'All Products', href: '/products' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-4 gap-8">
        <HelpInfoLinks title="SHOP" links={shopLinks} />
        <HelpInfoLinks /> {/* Default HELP & INFO */}
      </div>
    </footer>
  );
}

// Example 3: Full footer with multiple columns
export function CompleteFooter() {
  const shopLinks = [
    { label: 'New Arrivals', href: '/products?filter=new' },
    { label: 'Best Sellers', href: '/products?filter=bestsellers' },
    { label: 'Sale', href: '/products?filter=sale' },
  ];

  const aboutLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <HelpInfoLinks title="SHOP" links={shopLinks} />
          <HelpInfoLinks title="ABOUT" links={aboutLinks} />
          <HelpInfoLinks title="LEGAL" links={legalLinks} />
          <HelpInfoLinks /> {/* Default HELP & INFO */}
        </div>

        {/* Footer bottom */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm text-center">
            &copy; 2026 MiniStore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
