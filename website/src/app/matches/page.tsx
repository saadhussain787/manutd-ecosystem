import { promises as fs } from 'fs';
import path from 'path';

export const metadata = {
  title: 'Matches | Manchester United',
};

export default async function MatchesPage() {
  const dataPath = path.join(process.cwd(), 'public/data/mock.json');
  const fileContents = await fs.readFile(dataPath, 'utf8');
  const data = JSON.parse(fileContents);

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold font-oswald mb-6">Upcoming Matches</h2>
        <div className="flex flex-col gap-4">
          {data.nextMatch ? (
            <div className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex flex-col items-center sm:items-start text-sm">
                 <span className="font-bold text-gray-500">Premier League</span>
                 <span className="font-bold">{data.nextMatch.date} • {data.nextMatch.time}</span>
               </div>
               <div className="flex items-center gap-4">
                 <span className="font-bold text-lg w-24 text-right">Man Utd</span>
                 <div className="w-10 h-10 bg-[#DA291C] rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">MUN</div>
                 <span className="text-gray-400 font-bold px-2">v</span>
                 <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">IPS</div>
                 <span className="font-bold text-lg w-24">{data.nextMatch.opponent}</span>
               </div>
               <div className="w-full sm:w-auto mt-2 sm:mt-0">
                 <button className="w-full sm:w-auto bg-[#DA291C] text-white font-bold px-4 py-2 rounded-full text-sm">Tickets</button>
               </div>
            </div>
          ) : (
            <div className="text-center text-sm font-bold text-gray-500 py-4">
              No upcoming matches scheduled.
            </div>
          )}
          
          {data.upcomingMatches.map((match: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex flex-col items-center sm:items-start text-sm">
                 <span className="font-bold text-gray-500">Premier League</span>
                 <span className="font-bold">{match.date} • {match.time}</span>
               </div>
               <div className="flex items-center gap-4">
                 <span className="font-bold text-lg w-24 text-right">{match.isHome ? 'Man Utd' : match.opponent}</span>
                 <div className={`w-10 h-10 ${match.isHome ? 'bg-[#DA291C]' : 'bg-gray-800'} rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                   {match.isHome ? 'MUN' : 'OPP'}
                 </div>
                 <span className="text-gray-400 font-bold px-2">v</span>
                 <div className={`w-10 h-10 ${!match.isHome ? 'bg-[#DA291C]' : 'bg-gray-800'} rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                   {!match.isHome ? 'MUN' : 'OPP'}
                 </div>
                 <span className="font-bold text-lg w-24">{!match.isHome ? 'Man Utd' : match.opponent}</span>
               </div>
               <div className="w-full sm:w-auto mt-2 sm:mt-0">
                 <button className="w-full sm:w-auto border border-gray-300 text-gray-700 font-bold px-4 py-2 rounded-full text-sm hover:border-black transition-colors">Tickets</button>
               </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-bold font-oswald mb-6">Past Results</h2>
        <div className="flex flex-col gap-4">
          {data.recentMatch ? (
            <div className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex flex-col items-center sm:items-start text-sm">
                 <span className="font-bold text-gray-500">{data.recentMatch.competition}</span>
                 <span className="font-bold">{data.recentMatch.date}</span>
               </div>
               <div className="flex items-center gap-4">
                 <span className="font-bold text-lg w-24 text-right">{data.recentMatch.isHome ? 'Man Utd' : data.recentMatch.opponent}</span>
                 <div className={`w-10 h-10 ${data.recentMatch.isHome ? 'bg-[#DA291C]' : 'bg-orange-500'} rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                   {data.recentMatch.isHome ? 'MUN' : data.recentMatch.opponentShort}
                 </div>
                 
                 <div className="flex items-center justify-center bg-gray-900 text-white px-3 py-1 font-bold text-xl rounded shadow-sm">
                   {data.recentMatch.isHome ? data.recentMatch.score : data.recentMatch.score.split('-').reverse().join('-')}
                 </div>
  
                 <div className={`w-10 h-10 ${!data.recentMatch.isHome ? 'bg-[#DA291C]' : 'bg-orange-500'} rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                   {!data.recentMatch.isHome ? 'MUN' : data.recentMatch.opponentShort}
                 </div>
                 <span className="font-bold text-lg w-24">{!data.recentMatch.isHome ? 'Man Utd' : data.recentMatch.opponent}</span>
               </div>
               <div className="w-full sm:w-auto mt-2 sm:mt-0 flex items-center gap-2">
                 <button className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-4 py-2 rounded-full text-sm flex items-center gap-1 justify-center transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Highlights
                 </button>
               </div>
            </div>
          ) : (
            <div className="text-center text-sm font-bold text-gray-500 py-4">No recent matches found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
