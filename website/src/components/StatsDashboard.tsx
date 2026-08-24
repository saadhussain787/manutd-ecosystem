"use client";

import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function StatsDashboard({ statsData, youtubeScript }: { statsData: any, youtubeScript: string }) {
  // Our backend now returns top_performers, but let's safely fallback just in case
  const hasPerformers = statsData?.top_performers && statsData.top_performers.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-5xl mx-auto space-y-12 relative z-10"
    >
      
      {/* AI Analysis Section */}
      <motion.section 
        whileHover={{ scale: 1.01 }}
        className="glass-card p-8"
      >
        <h3 className="text-3xl font-heading text-[var(--color-utd-red)] mb-6 text-center uppercase tracking-wider">
          Gemini AI Tactical Analysis
        </h3>
        <p className="text-gray-300 text-lg font-body leading-relaxed whitespace-pre-wrap">
          {youtubeScript}
        </p>
      </motion.section>

      {/* Conditional: Only show if we have the new FPL data */}
      {hasPerformers && (
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass-card p-8"
        >
          <h3 className="text-3xl font-heading text-[var(--color-utd-gold)] mb-8 text-center uppercase tracking-wider drop-shadow-md">
            Top Performers (ICT Index)
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData.top_performers}>
                <XAxis dataKey="name" stroke="#ffffff" tick={{fill: '#ffffff'}} />
                <YAxis stroke="#ffffff" tick={{fill: '#ffffff'}} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.1)'}} 
                  contentStyle={{backgroundColor: '#111111', border: '1px solid #DA291C', borderRadius: '8px', color: '#fff'}} 
                />
                <Bar dataKey="ict_index" fill="var(--color-utd-red)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}
