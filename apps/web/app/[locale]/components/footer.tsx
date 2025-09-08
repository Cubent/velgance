import Link from 'next/link';
import { TextHoverEffect } from '../(home)/components/TextHoverEffect';

export const Footer = () => {
  const navigationItems = [
    { title: 'Pricing', href: '/pricing' },
    { title: 'Contact', href: '/contact' },
    { title: 'FAQ', href: '/#faq' },
    { title: 'Terms', href: '/terms-and-conditions' },
    { title: 'Privacy', href: '/privacy-policy' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        {/* Contact section on top */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">✈️</span>
            <h3 className="text-xl font-bold text-green-600">Travira</h3>
          </div>
          <Link
            href="mailto:support@travira.net"
            className="text-gray-600 hover:text-green-600 transition-colors text-lg font-medium"
          >
            support@travira.net
          </Link>

        </div>

        {/* Navigation links */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap justify-center gap-8">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="text-sm text-gray-600 hover:text-green-600 transition-colors font-medium"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Status and Copyright */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-3 font-medium text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-gray-600">All Systems Operational</span>
          </div>
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Travira. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
