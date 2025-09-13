import Image from 'next/image';
import Link from 'next/link';

const MailingListPage = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center px-0 sm:px-4 relative"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1550318817-ddbecc4d078d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Grainy overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />
      
      {/* Logo */}
      <Link href="/" className="absolute top-6 left-6 z-20 flex items-center gap-3 hover:opacity-80 transition-opacity">
        <Image 
          src="/Travira-light.svg" 
          alt="Travira" 
          width={50} 
          height={50}
          className="h-12 w-12"
        />
        <span className="text-2xl font-bold" style={{ color: '#d5e27b' }}>Travira</span>
      </Link>

      <div className="w-full max-w-md sm:max-w-md relative z-10">
        {/* Custom Header Text */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#fff0d2' }}>Get Notified</h1>
          <p className="text-lg" style={{ color: '#fff0d2' }}>Subscribe and get notified when we release</p>
        </div>
        
        <div className="rounded-lg sm:rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-sm p-4 sm:p-6 shadow-sm">
          {/* Email Subscription Form */}
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d5e27b] focus:border-[#d5e27b]"
                placeholder="Enter your email address"
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#d5e27b] text-[#333333] font-semibold py-2 px-4 rounded-md hover:bg-[#c4d16a] transition-colors duration-200"
            >
              Subscribe Now
            </button>
          </form>
          
          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Be the first to know about new features and exclusive deals
            </p>
          </div>
        </div>
        
        {/* Privacy Disclaimer */}
        <div className="mt-4 text-center">
          <p className="text-xs leading-relaxed" style={{ color: '#fff0d2' }}>
            We guarantee 100% privacy. Your information will not be shared. This app is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MailingListPage;
