"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 glass-card rounded-none border-t-0 border-x-0 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <div className="w-10 h-10 bg-utd-red rounded-full flex items-center justify-center border-2 border-utd-gold shadow-[0_0_10px_rgba(218,41,28,0.8)]">
              <span className="text-utd-gold font-heading font-bold">MU</span>
            </div>
            <span className="text-white font-heading text-xl uppercase tracking-widest hidden md:block">
              Tactical <span className="text-utd-red">Hub</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors uppercase tracking-wider font-heading">
                Home
              </Link>
              <Link href="/#news" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors uppercase tracking-wider font-heading">
                News
              </Link>
              <Link href="/fixtures" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors uppercase tracking-wider font-heading">
                Fixtures
              </Link>
              <Link href="/squad" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors uppercase tracking-wider font-heading">
                Full Squad
              </Link>
              <Link href="/#analytics" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors uppercase tracking-wider font-heading">
                Analytics
              </Link>
            </div>
          </div>

          {/* Premium Button */}
          <div>
            <Link href="#premium" className="bg-utd-gold text-black hover:bg-yellow-400 px-6 py-2 rounded-full text-sm font-bold transition-transform transform hover:scale-105 uppercase tracking-wider font-heading shadow-lg">
              Go Premium
            </Link>
          </div>

        </div>
      </div>
    </motion.nav>
  );
}
