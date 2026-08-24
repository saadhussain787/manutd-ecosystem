"use client";
import { motion } from "framer-motion";

export default function LiveNewsFixtures() {
  const newsItems = [
    { id: 1, title: "Ten Hag praises team resilience in pre-match presser", time: "2 hrs ago", tag: "Interview" },
    { id: 2, title: "Injury Update: Key defenders return to full training", time: "5 hrs ago", tag: "Squad" },
    { id: 3, title: "Transfer Rumors: New midfield target identified", time: "8 hrs ago", tag: "Transfers" }
  ];

  return (
    <div className="w-full flex flex-col md:flex-row gap-8">
      {/* Latest News Ticker */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-card w-full md:w-2/3 p-6 flex flex-col"
      >
        <h2 className="text-utd-gold font-heading text-2xl uppercase mb-6 flex items-center">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></span>
          Live News Feed
        </h2>
        <div className="flex flex-col gap-4">
          {newsItems.map((news, i) => (
            <motion.div 
              key={news.id}
              whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.05)" }}
              className="p-4 border-l-4 border-utd-red bg-white/5 rounded-r-lg cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-utd-gold font-bold uppercase tracking-wider">{news.tag}</span>
                <span className="text-xs text-gray-400">{news.time}</span>
              </div>
              <p className="text-lg font-body text-white">{news.title}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Match Center: Hull City */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="glass-card w-full md:w-1/3 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-utd-red via-utd-gold to-utd-red"></div>
        <h2 className="text-gray-400 font-heading text-sm uppercase tracking-widest mb-2">Previous Match</h2>
        <p className="text-xs text-gray-500 mb-6 font-body">Carabao Cup - 3rd Round</p>
        
        <div className="flex items-center justify-between w-full px-4 mb-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border-2 border-utd-red shadow-[0_0_15px_rgba(218,41,28,0.5)]">
              <span className="font-heading text-xl font-bold">MUN</span>
            </div>
            <span className="text-sm font-bold">Man Utd</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-4xl font-heading font-bold text-white bg-white/10 px-4 py-2 rounded-lg">3 - 1</span>
            <span className="text-xs text-utd-gold mt-2">FT</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border-2 border-gray-600">
              <span className="font-heading text-xl font-bold text-gray-300">HUL</span>
            </div>
            <span className="text-sm font-bold text-gray-300">Hull City</span>
          </div>
        </div>

        <div className="w-full text-sm font-body text-gray-300 border-t border-white/10 pt-4 flex flex-col gap-1">
          <div className="flex justify-between w-full">
            <span>Fernandes 24'</span>
            <span></span>
          </div>
          <div className="flex justify-between w-full">
            <span>Rashford 55'</span>
            <span></span>
          </div>
          <div className="flex justify-between w-full">
            <span></span>
            <span>Philogene 68'</span>
          </div>
          <div className="flex justify-between w-full">
            <span>Garnacho 89'</span>
            <span></span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
