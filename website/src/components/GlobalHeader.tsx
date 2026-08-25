import Link from 'next/link';

export default function GlobalHeader() {
  return (
    <header className="w-full bg-white text-gray-800 border-b border-gray-200">
      {/* Top Banner (Premier League Style) */}
      <div className="flex items-center justify-between px-4 md:px-8 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-900 rounded-full flex items-center justify-center text-white font-bold text-xl">
              PL
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">Premier League</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6 font-semibold text-sm">
          <Link href="#" className="hover:text-[#e90052]">Matches</Link>
          <Link href="#" className="hover:text-[#e90052]">Table</Link>
          <Link href="#" className="hover:text-[#e90052]">Statistics</Link>
          <Link href="#" className="hover:text-[#e90052]">Fantasy</Link>
          <Link href="#" className="hover:text-[#e90052]">News</Link>
          <Link href="#" className="hover:text-[#e90052]">Video</Link>
        </nav>
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-black">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <Link href="#" className="text-sm font-bold border border-gray-300 rounded-full px-4 py-1.5 hover:bg-gray-100">
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}
