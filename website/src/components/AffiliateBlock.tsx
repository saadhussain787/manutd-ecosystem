import React from 'react';

export default function AffiliateBlock() {
  return (
    <div className="w-full max-w-4xl mt-12 bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between transition-transform hover:scale-[1.02] duration-300">
      <div className="flex-1 mb-4 md:mb-0">
        <h3 className="text-[var(--color-utd-gold)] font-heading text-2xl uppercase tracking-wider mb-2">
          Official Merchandise
        </h3>
        <p className="text-gray-400 font-body text-sm md:text-base leading-relaxed">
          Support the Red Devils! Get your official 2024/25 kits, training gear, and accessories directly from the club store. 
        </p>
      </div>
      <div className="md:ml-8 w-full md:w-auto">
        <a 
          href="https://store.manutd.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full text-center bg-[var(--color-utd-red)] hover:bg-red-700 text-white font-bold py-3 px-8 rounded uppercase tracking-widest transition-colors duration-200"
        >
          Shop Now
        </a>
        <p className="text-xs text-gray-600 text-center mt-2 italic">
          *Affiliate Link
        </p>
      </div>
    </div>
  );
}
