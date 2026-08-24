import React from 'react';

export default function PremiumPaywall() {
  return (
    <div className="w-full max-w-4xl mt-12 mb-20 relative overflow-hidden bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl text-center">
      {/* Blurred background effect to simulate gated content */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6">
        <div className="bg-black/90 border border-gray-700 p-8 rounded-2xl shadow-2xl max-w-lg">
          <h3 className="text-[var(--color-utd-gold)] font-heading text-3xl uppercase tracking-wider mb-4">
            Unlock Advanced AI Predictions
          </h3>
          <p className="text-gray-300 font-body text-sm md:text-base leading-relaxed mb-6">
            Basic stats are free, but true analysts need more. Subscribe to Premium to unlock our predictive Gemini AI models, player heat maps, and downloadable raw CSV datasets.
          </p>
          <button className="w-full bg-[var(--color-utd-gold)] hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded uppercase tracking-widest transition-transform hover:scale-105 duration-200 shadow-[0_0_15px_rgba(251,225,34,0.3)]">
            Subscribe via Stripe
          </button>
        </div>
      </div>

      {/* Mock content that is blurred out */}
      <div className="opacity-30 pointer-events-none filter blur-sm">
        <h4 className="text-2xl font-bold mb-4 text-left text-[var(--color-utd-red)]">Predictive Model Outputs</h4>
        <div className="w-full h-64 bg-gray-800 rounded mb-4 animate-pulse"></div>
        <div className="flex gap-4">
          <div className="flex-1 h-32 bg-gray-800 rounded animate-pulse"></div>
          <div className="flex-1 h-32 bg-gray-800 rounded animate-pulse"></div>
          <div className="flex-1 h-32 bg-gray-800 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
