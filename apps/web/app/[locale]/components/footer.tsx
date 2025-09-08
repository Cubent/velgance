import Link from 'next/link';
import { TextHoverEffect } from '../(home)/components/TextHoverEffect';

export const Footer = () => {
  const navigationItems = [
    {
      title: 'Product',
      items: [
        { title: 'Home', href: '/' },
        { title: 'Pricing', href: '/pricing' },
        { title: 'Dashboard', href: '/dashboard' },
      ],
    },
    {
      title: 'Support',
      items: [
        { title: 'Contact', href: '/contact' },
        { title: 'Help Center', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      items: [
        { title: 'Privacy Policy', href: '/legal/privacy' },
        { title: 'Terms of Service', href: '/legal/terms' },
      ],
    },
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

        {/* Navigation columns */}
        <div className="flex justify-center mb-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-2xl">
            {navigationItems.map((section) => (
              <div key={section.title} className="flex flex-col gap-4">
                <h3 className="text-sm font-medium text-gray-900">
                  {section.title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {section.items?.map((item: any) => (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                        target={
                          item.href.includes('http') ? '_blank' : undefined
                        }
                        rel={
                          item.href.includes('http')
                            ? 'noopener noreferrer'
                            : undefined
                        }
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
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
