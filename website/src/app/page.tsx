import Image from 'next/image';
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';

export default async function OverviewPage() {
  const dataPath = path.join(process.cwd(), 'public/data/mock.json');
  const fileContents = await fs.readFile(dataPath, 'utf8');
  const data = JSON.parse(fileContents);

  const { recentMatch, nextMatch, startingXI, news, manager, table, leaguePosition } = data;
  const featuredNews = news && news.length > 0 ? news[0] : null;

  // Process Starting 11 into rows
  const pitchRows: Record<string, any[]> = {};
  if (startingXI) {
    startingXI.forEach((player: any) => {
      let row = "0";
      if (player.grid) {
        row = player.grid.split(":")[0];
      } else {
        // Fallback row assignment if grid is missing
        if (player.position === "GK") row = "1";
        else if (player.position === "DEF") row = "2";
        else if (player.position === "MID") row = "3";
        else if (player.position === "FWD") row = "4";
        else row = "5";
      }
      if (!pitchRows[row]) pitchRows[row] = [];
      pitchRows[row].push(player);
    });
  }

  // Sort rows (1 is closest to our own goal)
  const sortedRows = Object.keys(pitchRows).sort((a, b) => parseInt(a) - parseInt(b));

  // Calculate table slice (show 5 teams around Man Utd)
  let tableSlice: any[] = [];
  if (table) {
    const manUtdIndex = table.findIndex((t: any) => t.isManUtd);
    if (manUtdIndex !== -1) {
      const start = Math.max(0, manUtdIndex - 2);
      const end = Math.min(table.length, manUtdIndex + 3);
      tableSlice = table.slice(start, end);
    } else {
      tableSlice = table.slice(0, 5);
    }
  }

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full">
      {/* Left Column (Featured News & Starting 11) */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Featured News Card */}
        {featuredNews && (
          <Link href="#" className="group relative block overflow-hidden rounded-xl bg-gradient-to-t from-black/80 to-transparent aspect-[4/3] sm:aspect-video w-full">
            <Image 
              src={featuredNews.image || "/images/mourinho.jpg"} 
              alt={featuredNews.title} 
              fill 
              className="object-cover -z-10 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <span className="inline-block bg-[#00ff85] text-black text-xs font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide mb-2">New</span>
              <h2 className="text-white text-2xl md:text-3xl font-oswald font-bold leading-tight">
                {featuredNews.title}
              </h2>
            </div>
          </Link>
        )}

        {/* Last Starting 11 */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-oswald">Last Starting 11</h2>
            <Link href="#" className="text-sm font-bold text-gray-500 hover:text-black flex items-center gap-1">
              See all
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {recentMatch ? (
            <>
              <div className="flex justify-center items-center gap-6 mb-2">
                <span className="font-bold">{recentMatch.opponent}</span>
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-black text-[10px] font-bold">{recentMatch.opponentShort}</span>
                  <span className="text-2xl font-black">{recentMatch.score || "? - ?"}</span>
                  <span className="w-8 h-8 bg-[#DA291C] rounded-full flex items-center justify-center text-white text-[10px] font-bold">MUN</span>
                </div>
                <span className="font-bold text-[#DA291C]">Man Utd</span>
              </div>
              <div className="text-center text-sm text-gray-500 font-bold mb-6">FT</div>
              <div className="text-center text-xs text-gray-400 mb-8">{recentMatch.competition} • {recentMatch.date}</div>
            </>
          ) : (
            <div className="text-center text-sm font-bold text-gray-500 py-4">No recent match data available</div>
          )}

          <div className="mb-4">
            <span className="text-gray-500 text-sm font-semibold">Manager</span> <span className="font-bold text-[#e90052]">{manager}</span>
          </div>

          {/* Football Pitch Visualization */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[4/3] bg-[#428b3f] rounded-lg border-2 border-white/20 overflow-hidden">
             <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
             
             {/* Pitch Markings */}
             <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/40 -translate-x-1/2"></div>
             <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/40 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute top-1/2 left-0 w-16 h-32 border-2 border-white/40 border-l-0 -translate-y-1/2"></div>
             <div className="absolute top-1/2 right-0 w-16 h-32 border-2 border-white/40 border-r-0 -translate-y-1/2"></div>
             
             {/* Players */}
             {sortedRows.length > 0 ? (
               <div className="absolute inset-0 flex flex-col-reverse justify-around py-4">
                 {sortedRows.map(rowIdx => (
                   <div key={rowIdx} className="flex justify-around px-4">
                     {pitchRows[rowIdx].map((player, idx) => (
                       <Player key={idx} marker={player.number?.toString() || "?"} name={player.name.split(" ").pop()} />
                     ))}
                   </div>
                 ))}
               </div>
             ) : (
               <div className="absolute inset-0 flex items-center justify-center text-white/50 font-bold">
                 Lineup not available
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Right Column (Widgets) */}
      <div className="w-full xl:w-80 flex-shrink-0 flex flex-col gap-6">
        
        {/* Next Match Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold font-oswald mb-6">Next Match</h2>
          {nextMatch ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-gray-800 text-sm">Man Utd</span>
                <div className="w-8 h-8 bg-[#DA291C] rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-md">MUN</div>
                <div className="flex flex-col items-center mx-2">
                  <span className="text-xl font-black text-[#38003c]">{nextMatch.time}</span>
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-md">{nextMatch.opponentShort}</div>
                <span className="font-bold text-gray-800 text-sm truncate max-w-[80px] text-right">{nextMatch.opponent}</span>
              </div>
              <div className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest mt-6">
                {nextMatch.competition} • {nextMatch.date}
              </div>
            </>
          ) : (
            <div className="text-center text-sm font-bold text-gray-500 py-8">
              No upcoming matches scheduled.
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-oswald">Table</h2>
            <Link href="/standings" className="text-gray-400 hover:text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="text-5xl font-black text-[#38003c] mb-2">{leaguePosition}th</div>
          <div className="text-xs text-gray-500 font-bold mb-6 flex items-center gap-2">
             <span className="w-2 h-0.5 bg-gray-300"></span>
             Current Premier League Standings
          </div>
          
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs text-left">
                <th className="font-normal pb-2">Pos</th>
                <th className="font-normal pb-2">Team</th>
                <th className="font-normal pb-2 text-center">Pl</th>
                <th className="font-normal pb-2 text-center">GD</th>
                <th className="font-normal pb-2 text-center">Pts</th>
              </tr>
            </thead>
            <tbody>
              {tableSlice.map((team: any, idx: number) => (
                <tr key={idx} className={`border-t border-gray-100 ${team.isManUtd ? 'bg-[#DA291C]/5' : ''}`}>
                  <td className={`py-3 font-bold ${team.isManUtd ? 'text-[#DA291C] border-l-2 border-[#DA291C] pl-2 -ml-2' : 'text-gray-500'}`}>{team.pos}</td>
                  <td className={`py-3 font-bold truncate max-w-[100px] ${team.isManUtd ? 'text-[#DA291C]' : ''}`}>{team.team}</td>
                  <td className="py-3 text-center">{team.played}</td>
                  <td className="py-3 text-center">{team.gd}</td>
                  <td className="py-3 text-center font-bold">{team.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

// Helper component for pitch players
function Player({ name, marker }: { name: string, marker: string }) {
  return (
    <div className="flex flex-col items-center gap-1 z-10 w-16">
      <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold relative">
         {marker}
      </div>
      <span className="text-[10px] md:text-[11px] font-bold text-white bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm shadow-sm truncate max-w-full text-center">
        {name}
      </span>
    </div>
  );
}
