"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function StatsDashboard({ statsData, youtubeScript }: { statsData: any, youtubeScript: string }) {
  // Transform raw JSON into Recharts format
  const chartData = [
    { name: 'Wins', value: statsData.wins, fill: '#16a34a' }, // Green for wins
    { name: 'Draws', value: statsData.draws, fill: '#FBE122' }, // Gold for draws
    { name: 'Losses', value: statsData.loses, fill: '#DA291C' } // Red for losses
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      
      {/* Chart Section */}
      <section className="bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-2xl hover:border-gray-700 transition-colors duration-300">
        <h3 className="text-3xl font-heading text-[var(--color-utd-gold)] mb-8 text-center uppercase tracking-wider">
          Season Performance
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                cursor={{fill: '#1f2937'}} 
                contentStyle={{backgroundColor: '#000', borderColor: '#DA291C'}} 
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* AI Analysis Section */}
      <section className="bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-2xl hover:border-gray-700 transition-colors duration-300">
        <h3 className="text-3xl font-heading text-[var(--color-utd-red)] mb-6 text-center uppercase tracking-wider">
          Gemini AI Tactical Analysis
        </h3>
        <p className="text-gray-300 text-lg font-body leading-relaxed whitespace-pre-wrap">
          {youtubeScript}
        </p>
      </section>
    </div>
  );
}
