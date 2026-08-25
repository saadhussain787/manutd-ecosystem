import Image from 'next/image';
import Link from 'next/link';
import { promises as fs } from 'fs';
import path from 'path';

export default async function OverviewPage() {
  const dataPath = path.join(process.cwd(), 'public/data/mock.json');
  const fileContents = await fs.readFile(dataPath, 'utf8');
  const data = JSON.parse(fileContents);

  const { recentMatch, nextMatch, startingXI, news, manager } = data;
  const featuredNews = news[0];

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full">
      {/* Left Column (Featured News & Starting 11) */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Featured News Card */}
        <Link href="#" className="group relative block overflow-hidden rounded-xl bg-gradient-to-t from-black/80 to-transparent aspect-[4/3] sm:aspect-video w-full">
          <Image 
            src="/images/mourinho.jpg" 
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
          
          <div className="flex justify-center items-center gap-6 mb-2">
            <span className="font-bold">{recentMatch.opponent}</span>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">HUL</span>
              <span className="text-2xl font-black">{recentMatch.score}</span>
              <span className="w-8 h-8 bg-[#DA291C] rounded-full flex items-center justify-center text-white text-xs font-bold">MUN</span>
            </div>
            <span className="font-bold text-[#DA291C]">Man Utd</span>
          </div>
          <div className="text-center text-sm text-gray-500 font-bold mb-6">FT</div>
          <div className="text-center text-xs text-gray-400 mb-8">Matchweek 1 • {recentMatch.date}</div>

          <div className="mb-4">
            <span className="text-gray-500 text-sm font-semibold">Manager</span> <span className="font-bold text-[#e90052]">{manager}</span>
          </div>

          {/* Football Pitch Visualization */}
          <div className="relative w-full aspect-[4/3] bg-[#428b3f] rounded-lg border-2 border-white/20 overflow-hidden">
             <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
             
             {/* Pitch Markings */}
             <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/40 -translate-x-1/2"></div>
             <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/40 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute top-1/2 left-0 w-16 h-32 border-2 border-white/40 border-l-0 -translate-y-1/2"></div>
             <div className="absolute top-1/2 right-0 w-16 h-32 border-2 border-white/40 border-r-0 -translate-y-1/2"></div>
             
             {/* Players */}
             <div className="absolute inset-0 flex flex-col justify-around py-4">
               {/* FW */}
               <div className="flex justify-center">
                 <Player marker="10" name="Cunha" />
               </div>
               {/* MID */}
               <div className="flex justify-around px-8">
                 <Player marker="19" name="Mbeumo" />
                 <Player marker="8" name="Fernandes" />
                 <Player marker="13" name="Dorgu" />
               </div>
               {/* DM */}
               <div className="flex justify-around px-16">
                 <Player marker="18" name="Tielemans" />
                 <Player marker="17" name="Santos" />
               </div>
               {/* DEF */}
               <div className="flex justify-between px-4">
                 <Player marker="3" name="Mazraoui" />
                 <Player marker="5" name="Maguire" />
                 <Player marker="26" name="Heaven" />
                 <Player marker="23" name="Shaw" />
               </div>
               {/* GK */}
               <div className="flex justify-center">
                 <Player marker="1" name="Lammens" />
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Right Column (Widgets) */}
      <div className="w-full xl:w-80 flex-shrink-0 flex flex-col gap-6">
        
        {/* Next Match Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold font-oswald mb-6">Next Match</h2>
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-800">Man Utd</span>
            <div className="w-10 h-10 bg-[#DA291C] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">MUN</div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-[#38003c]">{nextMatch.time}</span>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">IPS</div>
            <span className="font-bold text-gray-800">{nextMatch.opponent}</span>
          </div>
          <div className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest mt-6">
            Premier League • {nextMatch.date}
          </div>
        </div>

        {/* Team Form */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-oswald">Team Form</h2>
            <div className="flex bg-gray-100 rounded-full p-1">
              <button className="px-3 py-1 text-xs font-bold bg-white shadow rounded-full">Previous</button>
              <button className="px-3 py-1 text-xs font-bold text-gray-500 rounded-full">Upcoming</button>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-[#DA291C] rounded-full flex items-center justify-center text-white text-[10px] font-bold">MU</div>
            <span className="font-bold text-sm">Manchester United</span>
          </div>
          <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
             <div className="text-xs text-gray-500 font-bold">MW1</div>
             <div className="flex gap-2 items-center">
                <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                <div className="text-xs font-bold flex flex-col">
                  <span>HUL (A)</span>
                  <span className="text-[#DA291C]">2 - 0</span>
                </div>
                <div className="w-6 h-6 bg-[#DA291C] rounded-full text-white flex items-center justify-center text-xs font-bold ml-auto">L</div>
             </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-oswald">Table</h2>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="text-5xl font-black text-[#38003c] mb-2">{data.leaguePosition}th</div>
          <div className="text-xs text-gray-500 font-bold mb-6 flex items-center gap-2">
             <span className="w-2 h-0.5 bg-gray-300"></span>
             Same position as MW 1
          </div>
          
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs text-left">
                <th className="font-normal pb-2">Pos</th>
                <th className="font-normal pb-2">Team</th>
                <th className="font-normal pb-2 text-center">Pl</th>
                <th className="font-normal pb-2 text-center">W</th>
                <th className="font-normal pb-2 text-center">D</th>
                <th className="font-normal pb-2 text-center">L</th>
                <th className="font-normal pb-2 text-center">GD</th>
                <th className="font-normal pb-2 text-center">Pts</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100">
                <td className="py-3 font-bold text-gray-500">16</td>
                <td className="py-3 font-bold">Crystal Palace</td>
                <td className="py-3 text-center">1</td>
                <td className="py-3 text-center">0</td>
                <td className="py-3 text-center">0</td>
                <td className="py-3 text-center">1</td>
                <td className="py-3 text-center">-2</td>
                <td className="py-3 text-center font-bold">0</td>
              </tr>
              <tr className="border-t border-gray-100 bg-[#DA291C]/5">
                <td className="py-3 font-bold text-[#DA291C] border-l-2 border-[#DA291C] pl-2 -ml-2">{data.leaguePosition}</td>
                <td className="py-3 font-bold text-[#DA291C]">Manchester United</td>
                <td className="py-3 text-center">1</td>
                <td className="py-3 text-center">0</td>
                <td className="py-3 text-center">0</td>
                <td className="py-3 text-center">1</td>
                <td className="py-3 text-center">-2</td>
                <td className="py-3 text-center font-bold">0</td>
              </tr>
              <tr className="border-t border-gray-100">
                <td className="py-3 font-bold text-gray-500">18</td>
                <td className="py-3 font-bold">Coventry City</td>
                <td className="py-3 text-center">1</td>
                <td className="py-3 text-center">0</td>
                <td className="py-3 text-center">0</td>
                <td className="py-3 text-center">1</td>
                <td className="py-3 text-center">-2</td>
                <td className="py-3 text-center font-bold">0</td>
              </tr>
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
    <div className="flex flex-col items-center gap-1 z-10">
      <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold relative">
         {marker}
      </div>
      <span className="text-[10px] md:text-xs font-bold text-white bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm shadow-sm">{name}</span>
    </div>
  );
}
