"use client";

import { motion } from 'framer-motion';

export default function StatsDashboard({ statsData, youtubeScript }: { statsData: any, youtubeScript: string }) {
  // Check if we have the FPL top_performers array
  const hasPerformers = statsData?.top_performers && statsData.top_performers.length > 0;

  if (!hasPerformers) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full relative z-10"
    >
      <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
         <h2 className="text-4xl font-heading uppercase text-white drop-shadow-md">
            Top Performers
         </h2>
         <span className="text-utd-red font-body font-bold uppercase tracking-wider text-sm">
            Based on FPL ICT Index
         </span>
      </div>

      {/* Horizontal Scroll Container (Hiding the scrollbar for premium look) */}
      <div className="flex overflow-x-auto pb-8 space-x-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {statsData.top_performers.map((player: any, idx: number) => (
          <motion.div 
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="snap-start shrink-0 w-72 h-96 glass-card relative overflow-hidden group rounded-xl cursor-pointer"
          >
            {/* Background Gradient to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-[#4a0907]/80 to-transparent z-0 opacity-90"></div>
            
            {/* FPL Player Image */}
            <img 
              src={player.image_url} 
              alt={player.name}
              className="w-full h-full object-cover object-top relative z-10 group-hover:scale-110 transition-transform duration-500 mix-blend-luminosity group-hover:mix-blend-normal"
            />
            
            {/* Player Info (Bottom Overlaid) */}
            <div className="absolute bottom-0 left-0 w-full p-6 z-20 bg-gradient-to-t from-black via-black/80 to-transparent pt-12">
              <h3 className="text-2xl font-heading uppercase text-white truncate drop-shadow-lg">
                {player.name}
              </h3>
              
              <div className="flex justify-between items-center mt-2 border-t border-white/20 pt-3">
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase tracking-widest">ICT Index</span>
                  <span className="text-2xl font-bold text-utd-gold">{player.ict_index}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-gray-400 uppercase tracking-widest">Form</span>
                  <span className="text-2xl font-bold text-white">{player.form}</span>
                </div>
              </div>
            </div>
            
            {/* Top Right Ranking Badge */}
            <div className="absolute top-4 right-4 z-20 bg-utd-red text-white font-bold font-heading text-xl w-10 h-10 flex items-center justify-center rounded-full shadow-lg shadow-black">
              #{idx + 1}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
