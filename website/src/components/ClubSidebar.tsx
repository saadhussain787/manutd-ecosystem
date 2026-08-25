import Link from 'next/link';
import Image from 'next/image';

export default function ClubSidebar() {
  return (
    <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
      {/* Main Red Profile Card */}
      <div className="bg-[#DA291C] rounded-xl text-white overflow-hidden shadow-xl">
        <div className="p-6 pb-4 relative">
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="w-20 h-20 bg-white/10 p-2 rounded-full flex items-center justify-center">
              <Image src="/images/utd-logo.png" alt="Man Utd" width={64} height={64} className="object-contain" />
            </div>
            <button className="bg-[#DA291C] hover:bg-[#b52217] border border-white/30 px-4 py-1.5 rounded-full text-sm font-bold transition-colors">
              Follow
            </button>
          </div>
          <h1 className="text-3xl font-bold font-oswald tracking-tight mb-2 relative z-10">
            Manchester United
          </h1>
          <div className="flex items-center gap-4 text-sm font-medium text-white/80 relative z-10">
            <span>Est. 1878</span>
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Old Trafford
            </span>
          </div>
          {/* Faded Background Crest */}
          <div className="absolute right-[-40px] bottom-[-40px] opacity-10 pointer-events-none">
            <Image src="/images/utd-logo.png" alt="Man Utd" width={200} height={200} className="object-contain" />
          </div>
        </div>
      </div>

      {/* Visit Website Links */}
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-gray-800">Visit Man Utd Website</h3>
        <Link href="#" className="border border-gray-300 rounded-full py-2.5 px-4 text-center text-sm font-bold text-gray-700 hover:border-[#DA291C] hover:text-[#DA291C] transition-colors">
          Official Website
        </Link>
        <Link href="#" className="border border-gray-300 rounded-full py-2.5 px-4 text-center text-sm font-bold text-gray-700 hover:border-[#DA291C] hover:text-[#DA291C] transition-colors">
          Official Club Shop
        </Link>
        <Link href="#" className="border border-gray-300 rounded-full py-2.5 px-4 text-center text-sm font-bold text-gray-700 hover:border-[#DA291C] hover:text-[#DA291C] transition-colors">
          Official App (iOS)
        </Link>
        <Link href="#" className="border border-gray-300 rounded-full py-2.5 px-4 text-center text-sm font-bold text-gray-700 hover:border-[#DA291C] hover:text-[#DA291C] transition-colors">
          Official App (Android)
        </Link>
      </div>

      {/* Buy Tickets Links */}
      <div className="flex flex-col gap-3 mt-4">
        <h3 className="font-bold text-gray-800">Buy Man Utd Tickets</h3>
        <Link href="#" className="border border-gray-300 rounded-full py-2.5 px-4 text-center text-sm font-bold text-gray-700 hover:border-[#DA291C] hover:text-[#DA291C] transition-colors">
          Buy Tickets
        </Link>
        <Link href="#" className="border border-gray-300 rounded-full py-2.5 px-4 text-center text-sm font-bold text-gray-700 hover:border-[#DA291C] hover:text-[#DA291C] transition-colors">
          Buy Matchday Hospitality
        </Link>
        <Link href="#" className="border border-gray-300 rounded-full py-2.5 px-4 text-center text-sm font-bold text-gray-700 hover:border-[#DA291C] hover:text-[#DA291C] transition-colors">
          Club Ticket Information
        </Link>
      </div>

      {/* Socials */}
      <div className="mt-4">
        <h3 className="font-bold text-gray-800 mb-3">Club Socials</h3>
        <div className="flex gap-3">
          <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#DA291C] hover:text-white transition-colors">
            {/* Instagram icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#DA291C] hover:text-white transition-colors">
            {/* TikTok icon (generic replacement) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
          </a>
          <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#DA291C] hover:text-white transition-colors">
            {/* Twitter icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
          </a>
        </div>
      </div>
    </div>
  );
}
