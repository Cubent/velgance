import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import '../blog.css';

// Blog posts data - in a real app, this would come from a CMS or database
const blogPosts = {
  'best-hacks-find-cheap-flights-europe': {
    slug: 'best-hacks-find-cheap-flights-europe',
    title: 'Best Hacks to Find Cheap Flights to Europe',
    excerpt: 'Discover insider secrets and proven strategies to score amazing flight deals to Europe. From timing your bookings to using the right tools, learn how to save hundreds on your next European adventure.',
    content: `
      <p>Europe has always been a dream destination for travelers worldwide, but the cost of flights can often be a major deterrent. However, with the right strategies and insider knowledge, you can find incredible deals that make your European adventure not just possible, but affordable. In this comprehensive guide, we'll share the best hacks to find cheap flights to Europe.</p>

      <h2>1. Timing is Everything: When to Book</h2>
      <p>The timing of your booking can make or break your budget. Here's what you need to know:</p>
      
      <h3>Best Time to Book</h3>
      <ul>
        <li><strong>2-3 months in advance</strong> for summer travel (June-August)</li>
        <li><strong>1-2 months in advance</strong> for shoulder season (April-May, September-October)</li>
        <li><strong>2-6 weeks in advance</strong> for winter travel (November-March)</li>
      </ul>

      <h3>Best Days to Book</h3>
      <p>Research consistently shows that Tuesday and Wednesday are the best days to book flights. Airlines typically release sales on Tuesdays, and by Wednesday, competitors have matched prices, creating a competitive environment that benefits travelers.</p>

      <h2>2. Be Flexible with Your Travel Dates</h2>
      <p>Flexibility is your greatest asset when hunting for cheap flights. Here's how to maximize your savings:</p>

      <h3>Use Flexible Date Search</h3>
      <p>Most flight search engines offer flexible date options. Instead of searching for specific dates, use the "flexible dates" feature to see prices across an entire month. You might find that flying just one day earlier or later can save you hundreds of dollars.</p>

      <h3>Consider Off-Peak Travel</h3>
      <ul>
        <li><strong>Shoulder seasons:</strong> April-May and September-October offer great weather with lower prices</li>
        <li><strong>Mid-week flights:</strong> Tuesday, Wednesday, and Thursday flights are typically cheaper</li>
        <li><strong>Red-eye flights:</strong> Overnight flights often cost less than daytime departures</li>
      </ul>

      <h2>3. Master the Art of Flight Search</h2>
      <p>Not all flight search engines are created equal. Here are the best tools and techniques:</p>

      <h3>Use Multiple Search Engines</h3>
      <ul>
        <li><strong>Google Flights:</strong> Excellent for flexible date searches and price tracking</li>
        <li><strong>Skyscanner:</strong> Great for finding the cheapest month to travel</li>
        <li><strong>Kayak:</strong> Good for comparing multiple airlines and booking sites</li>
        <li><strong>Momondo:</strong> Often finds deals that other engines miss</li>
      </ul>

      <h3>Set Up Price Alerts</h3>
      <p>Don't have time to check prices daily? Set up price alerts on Google Flights, Kayak, or Skyscanner. These tools will notify you when prices drop for your desired route and dates.</p>

      <h2>4. Consider Alternative Airports</h2>
      <p>Major cities often have multiple airports, and flying into a secondary airport can save you significant money:</p>

      <h3>European Airport Alternatives</h3>
      <ul>
        <li><strong>London:</strong> Consider Stansted, Luton, or Gatwick instead of Heathrow</li>
        <li><strong>Paris:</strong> Beauvais or Orly instead of Charles de Gaulle</li>
        <li><strong>Rome:</strong> Ciampino instead of Fiumicino</li>
        <li><strong>Barcelona:</strong> Girona or Reus instead of El Prat</li>
      </ul>

      <h2>5. Leverage Airline Sales and Promotions</h2>
      <p>Stay informed about airline sales and promotions:</p>

      <h3>Follow Airlines on Social Media</h3>
      <p>Many airlines announce flash sales on Twitter, Facebook, and Instagram. Follow your preferred airlines to catch these limited-time offers.</p>

      <h3>Sign Up for Airline Newsletters</h3>
      <p>While it might seem like spam, airline newsletters often contain exclusive deals and early access to sales.</p>

      <h2>6. Use Credit Card Points and Miles</h2>
      <p>If you're not already using a travel rewards credit card, you're missing out on free flights:</p>

      <h3>Best Travel Credit Cards</h3>
      <ul>
        <li><strong>Chase Sapphire Preferred:</strong> Great for beginners with flexible point transfers</li>
        <li><strong>American Express Gold Card:</strong> Excellent for dining and grocery purchases</li>
        <li><strong>Capital One Venture:</strong> Simple earning and redemption structure</li>
      </ul>

      <h2>7. Consider Stopovers and Open Jaws</h2>
      <p>Sometimes, the cheapest way to get to Europe is to make it part of a longer journey:</p>

      <h3>Stopover Programs</h3>
      <p>Many airlines offer free stopovers in their hub cities. For example, Icelandair allows free stopovers in Reykjavik, and Turkish Airlines offers stopovers in Istanbul.</p>

      <h3>Open Jaw Tickets</h3>
      <p>Flying into one city and out of another can sometimes be cheaper than a round-trip ticket, especially if you're planning to visit multiple countries.</p>

      <h2>8. Book at the Right Time of Day</h2>
      <p>Believe it or not, the time of day you book can affect prices:</p>
      <ul>
        <li><strong>Early morning (6-10 AM):</strong> Often the best time to find deals</li>
        <li><strong>Avoid booking on weekends:</strong> Prices tend to be higher</li>
        <li><strong>Tuesday afternoons:</strong> Another optimal time for deals</li>
      </ul>

      <h2>9. Use Incognito Mode and Clear Cookies</h2>
      <p>Some airlines and booking sites use dynamic pricing based on your search history. Always search in incognito or private browsing mode to avoid inflated prices.</p>

      <h2>10. Consider Package Deals</h2>
      <p>Sometimes, booking a flight and hotel together can save you money:</p>
      <ul>
        <li><strong>Expedia:</strong> Often offers package discounts</li>
        <li><strong>Priceline:</strong> Good for bundled deals</li>
        <li><strong>Booking.com:</strong> Sometimes has flight + hotel packages</li>
      </ul>

      <h2>Final Tips for Success</h2>
      <p>Finding cheap flights to Europe requires patience, flexibility, and a bit of strategy. Here are our final tips:</p>
      <ul>
        <li>Start your search early but don't book too early</li>
        <li>Be flexible with both dates and destinations</li>
        <li>Use multiple search engines and set up price alerts</li>
        <li>Consider alternative airports and airlines</li>
        <li>Don't forget about budget airlines like Ryanair, EasyJet, and Wizz Air for intra-European travel</li>
        <li>Book directly with the airline when possible to avoid third-party booking fees</li>
      </ul>

      <p>Remember, the best deal is the one that fits your schedule and budget. Don't get so caught up in finding the absolute cheapest flight that you compromise on important factors like convenience, comfort, or travel time.</p>

      <p>Happy travels, and may your European adventure be both memorable and affordable!</p>
    `,
    author: 'Travira Team',
    publishedAt: '2024-01-15',
    readTime: '8 min read',
    category: 'Flight Deals',
    image: '',
    tags: ['Europe', 'Flight Deals', 'Travel Tips', 'Budget Travel', 'Booking Strategies'],
  },
};

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = blogPosts[params.slug as keyof typeof blogPosts];
  
  if (!post) {
    return {
      title: 'Post Not Found | Travira Blog',
    };
  }

  return {
    title: `${post.title} | Travira Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 600,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts[params.slug as keyof typeof blogPosts];

  if (!post) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image,
    "author": {
      "@type": "Organization",
      "name": post.author,
    },
    "publisher": {
      "@type": "Organization",
      "name": "Travira",
      "logo": {
        "@type": "ImageObject",
        "url": "https://i.postimg.cc/KjR55hC6/Travira-9.png",
      },
    },
    "datePublished": post.publishedAt,
    "dateModified": post.publishedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://travira.org/blog/${post.slug}`,
    },
    "keywords": post.tags.join(", "),
    "articleSection": post.category,
    "wordCount": post.content.split(' ').length,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-[#f9f7ee]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-[#045530]">Home</Link></li>
              <li>/</li>
              <li><Link href="/blog" className="hover:text-[#045530]">Blog</Link></li>
              <li>/</li>
              <li className="text-[#045530] font-medium">{post.title}</li>
            </ol>
          </nav>

          {/* Article Header */}
          <header className="mb-12">
            <div className="mb-4">
              <span className="bg-[#d5e27b] text-[#045530] px-3 py-1 rounded-full text-sm font-semibold">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#045530] mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-[#4a5565] mb-6 leading-relaxed">
              {post.excerpt}
            </p>
            <div className="mb-8">
              <img 
                src="https://i.postimg.cc/8PksCwcY/Best-Hacks-to-Find-Cheap-Flights-to-Europe-1.png" 
                alt="Best Hacks to Find Cheap Flights to Europe"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
            <div className="flex items-center text-sm text-gray-600 border-b border-gray-200 pb-6">
              <div className="flex items-center space-x-4">
                <span>By {post.author}</span>
                <span>•</span>
                <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </header>


          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>


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
    </>
  );
}
