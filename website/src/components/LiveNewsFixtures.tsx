"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LiveNewsFixtures() {
  const [fixtures, setFixtures] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fixtures')
      .then(res => res.json())
      .then(data => {
        setFixtures(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load fixtures", err);
        setLoading(false);
      });
  }, []);

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

      {/* Match Center: Dynamic */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="glass-card w-full md:w-1/3 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-utd-red via-utd-gold to-utd-red"></div>
        <h2 className="text-gray-400 font-heading text-sm uppercase tracking-widest mb-2">Previous Match</h2>
        
        {loading ? (
          <div className="animate-pulse flex flex-col items-center h-full justify-center text-gray-400">
            Loading Live Fixture Data...
          </div>
        ) : fixtures?.lastMatch ? (
          <>
            <p className="text-xs text-gray-500 mb-6 font-body">Premier League - GW {fixtures.lastMatch.event}</p>
            
            <div className="flex items-center justify-between w-full px-4 mb-8">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-[0_0_15px_rgba(218,41,28,0.5)] ${fixtures.lastMatch.team_h === 16 ? 'bg-white/10 border-utd-red' : 'bg-white/5 border-gray-600'}`}>
                  <span className={`font-heading text-xl font-bold ${fixtures.lastMatch.team_h === 16 ? 'text-white' : 'text-gray-300'}`}>
                    {fixtures.teams?.[fixtures.lastMatch.team_h]?.toUpperCase().substring(0,3) || 'H'}
                  </span>
                </div>
                <span className={`text-sm font-bold ${fixtures.lastMatch.team_h === 16 ? 'text-white' : 'text-gray-300'}`}>
                  {fixtures.teams?.[fixtures.lastMatch.team_h] || 'Home'}
                </span>
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-4xl font-heading font-bold text-white bg-white/10 px-4 py-2 rounded-lg">
                  {fixtures.lastMatch.team_h_score} - {fixtures.lastMatch.team_a_score}
                </span>
                <span className="text-xs text-utd-gold mt-2">FT</span>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-[0_0_15px_rgba(218,41,28,0.5)] ${fixtures.lastMatch.team_a === 16 ? 'bg-white/10 border-utd-red' : 'bg-white/5 border-gray-600'}`}>
                  <span className={`font-heading text-xl font-bold ${fixtures.lastMatch.team_a === 16 ? 'text-white' : 'text-gray-300'}`}>
                    {fixtures.teams?.[fixtures.lastMatch.team_a]?.toUpperCase().substring(0,3) || 'A'}
                  </span>
                </div>
                <span className={`text-sm font-bold ${fixtures.lastMatch.team_a === 16 ? 'text-white' : 'text-gray-300'}`}>
                  {fixtures.teams?.[fixtures.lastMatch.team_a] || 'Away'}
                </span>
              </div>
            </div>

            {fixtures.nextMatch && (
              <div className="w-full text-sm font-body text-gray-300 border-t border-white/10 pt-4 flex flex-col gap-1">
                <span className="text-xs text-utd-gold uppercase tracking-wider mb-2">Next Match</span>
                <div className="flex justify-between w-full">
                  <span>vs {fixtures.teams?.[fixtures.nextMatch.team_h === 16 ? fixtures.nextMatch.team_a : fixtures.nextMatch.team_h]}</span>
                  <span>{new Date(fixtures.nextMatch.kickoff_time).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            No match data available
          </div>
        )}
      </motion.div>
    </div>
  );
}
