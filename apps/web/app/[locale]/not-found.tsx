import { Button } from '@repo/design-system/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md mx-auto text-center px-6">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700">404</h1>
          <div className="relative -mt-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/">
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">
                Contact Support
              </Link>
            </Button>
          </div>
          
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Popular pages:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link 
                href="/pricing" 
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                Pricing
              </Link>
              <span className="text-gray-300">•</span>
              <Link 
                href="/blog" 
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                Blog
              </Link>
              <span className="text-gray-300">•</span>
              <Link 
                href="/legal/privacy" 
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-300">•</span>
              <Link 
                href="/legal/terms" 
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 text-xs text-gray-400 dark:text-gray-500">
          <p>Error Code: 404 | Page Not Found</p>
        </div>
      </div>
    </div>
  );
}
