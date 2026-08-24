"use client";

import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function AdvancedAnalytics({ statsData }: { statsData: any }) {
  const hasPerformers = statsData?.top_performers && statsData.top_performers.length > 0;
  if (!hasPerformers) return null;

  // Take the top 3 players for comparison to keep the radar chart readable
  const top3 = statsData.top_performers.slice(0, 3);
  
  // Recharts radar chart requires data in a specific format:
  const chartData = [
    {
      subject: 'Goals',
      [top3[0]?.name || 'Player 1']: top3[0]?.goals || 0,
      [top3[1]?.name || 'Player 2']: top3[1]?.goals || 0,
      [top3[2]?.name || 'Player 3']: top3[2]?.goals || 0,
      fullMark: 20,
    },
    {
      subject: 'Assists',
      [top3[0]?.name || 'Player 1']: top3[0]?.assists || 0,
      [top3[1]?.name || 'Player 2']: top3[1]?.assists || 0,
      [top3[2]?.name || 'Player 3']: top3[2]?.assists || 0,
      fullMark: 15,
    },
    {
      subject: 'Clean Sheets',
      [top3[0]?.name || 'Player 1']: top3[0]?.clean_sheets || 0,
      [top3[1]?.name || 'Player 2']: top3[1]?.clean_sheets || 0,
      [top3[2]?.name || 'Player 3']: top3[2]?.clean_sheets || 0,
      fullMark: 15,
    },
    {
      subject: 'Form',
      [top3[0]?.name || 'Player 1']: parseFloat(top3[0]?.form) || 0,
      [top3[1]?.name || 'Player 2']: parseFloat(top3[1]?.form) || 0,
      [top3[2]?.name || 'Player 3']: parseFloat(top3[2]?.form) || 0,
      fullMark: 10,
    },
    {
      subject: 'ICT/10', // Scaled down by 10 to match other metric boundaries visually
      [top3[0]?.name || 'Player 1']: (parseFloat(top3[0]?.ict_index) / 10) || 0,
      [top3[1]?.name || 'Player 2']: (parseFloat(top3[1]?.ict_index) / 10) || 0,
      [top3[2]?.name || 'Player 3']: (parseFloat(top3[2]?.ict_index) / 10) || 0,
      fullMark: 20,
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full relative z-10 glass-card p-8 md:p-12 rounded-xl"
    >
      <div className="text-center mb-10">
         <h2 className="text-4xl font-heading uppercase text-utd-gold drop-shadow-md">
            Advanced Analytics
         </h2>
         <p className="text-gray-400 font-body mt-2">Head-to-head comparison of our Top 3 Performers</p>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="#333333" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#FFFFFF', fontSize: 14 }} />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111111', border: '1px solid #DA291C', borderRadius: '8px', color: '#fff' }} 
            />
            <Radar name={top3[0]?.name || 'Player 1'} dataKey={top3[0]?.name || 'Player 1'} stroke="#DA291C" fill="#DA291C" fillOpacity={0.5} />
            <Radar name={top3[1]?.name || 'Player 2'} dataKey={top3[1]?.name || 'Player 2'} stroke="#FBE122" fill="#FBE122" fillOpacity={0.5} />
            {top3[2] && (
              <Radar name={top3[2]?.name} dataKey={top3[2]?.name} stroke="#FFFFFF" fill="#FFFFFF" fillOpacity={0.3} />
            )}
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center items-center space-x-6 mt-8 flex-wrap gap-y-4">
         <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-utd-red border border-utd-red rounded"></div>
            <span className="text-white font-body">{top3[0]?.name}</span>
         </div>
         <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-utd-gold border border-utd-gold rounded"></div>
            <span className="text-white font-body">{top3[1]?.name}</span>
         </div>
         {top3[2] && (
           <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-white border border-white rounded opacity-50"></div>
              <span className="text-white font-body">{top3[2]?.name}</span>
           </div>
         )}
      </div>
    </motion.div>
  );
}
