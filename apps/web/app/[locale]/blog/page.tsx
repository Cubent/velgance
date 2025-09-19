import { Metadata } from 'next';
import Link from 'next/link';
import './blog.css';

export const metadata: Metadata = {
  title: 'Travel Blog | Travira',
  description: 'Expert travel tips, flight deal insights, and destination guides to help you find the best flight deals and plan your perfect trip.',
  openGraph: {
    title: 'Travel Blog | Travira',
    description: 'Expert travel tips, flight deal insights, and destination guides to help you find the best flight deals and plan your perfect trip.',
    type: 'website',
  },
};

// Blog posts data - in a real app, this would come from a CMS or database
const blogPosts = [
  {
    slug: 'best-hacks-find-cheap-flights-europe',
    title: 'Best Hacks to Find Cheap Flights to Europe',
    excerpt: 'Discover insider secrets and proven strategies to score amazing flight deals to Europe. From timing your bookings to using the right tools, learn how to save hundreds on your next European adventure.',
    author: 'Travira Team',
    publishedAt: '2024-01-15',
    readTime: '8 min read',
    category: 'Flight Deals',
    image: '',
    featured: true,
  },
  // Add more posts here as you create them
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#f9f7ee]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#045530] mb-6">
            Travel Blog
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Expert travel tips, flight deal insights, and destination guides to help you find the best deals and plan your perfect trip.
          </p>
        </div>

        {/* Featured Post */}
        {blogPosts.filter(post => post.featured).map((post) => (
          <div key={post.slug} className="mb-16">
            <Link href={`/blog/${post.slug}`} className="group">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-8">
                  <div className="mb-4">
                    <span className="bg-[#d5e27b] text-[#045530] px-3 py-1 rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-[#045530] mb-4 group-hover:text-[#045530]/80 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-[#4a5565] text-lg mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="mb-6">
                    <img 
                      src="https://i.postimg.cc/8PksCwcY/Best-Hacks-to-Find-Cheap-Flights-to-Europe-1.png" 
                      alt="Best Hacks to Find Cheap Flights to Europe"
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span>By {post.author}</span>
                      <span>•</span>
                      <span>{post.publishedAt}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <span className="text-[#045530] font-semibold group-hover:underline">
                      Read more →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}

        {/* All Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.filter(post => !post.featured).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="mb-3">
                    <span className="bg-[#d5e27b] text-[#045530] px-2 py-1 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#045530] mb-3 group-hover:text-[#045530]/80 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[#4a5565] mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <span>{post.readTime}</span>
                    </div>
                    <span className="text-[#045530] font-semibold group-hover:underline">
                      Read more →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-[#045530] rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with Travel Deals
          </h2>
          <p className="text-[#fff0d2] mb-6 max-w-2xl mx-auto">
            Get the latest flight deals, travel tips, and destination guides delivered straight to your inbox.
          </p>
          <div className="flex justify-center">
            <button className="bg-[#d5e27b] text-[#045530] px-6 py-3 rounded-lg font-semibold hover:bg-[#c4d16a] transition-colors">
              Start Your Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
