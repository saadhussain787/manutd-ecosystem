import { promises as fs } from 'fs';
import path from 'path';

export const metadata = {
  title: 'Squad | Manchester United',
};

export default async function SquadPage() {
  const dataPath = path.join(process.cwd(), 'public/data/mock.json');
  const fileContents = await fs.readFile(dataPath, 'utf8');
  const data = JSON.parse(fileContents);

  // Group squad by position
  const positions = ['GK', 'DEF', 'MID', 'FWD'];
  const groupedSquad = positions.map(pos => ({
    name: pos === 'GK' ? 'Goalkeepers' : pos === 'DEF' ? 'Defenders' : pos === 'MID' ? 'Midfielders' : 'Forwards',
    players: data.startingXI.filter((p: any) => p.position === pos)
  }));

  return (
    <div className="w-full flex flex-col gap-12">
      {groupedSquad.map(group => group.players.length > 0 && (
        <section key={group.name} className="w-full">
          <h2 className="text-2xl font-bold font-oswald mb-6 pb-2 border-b border-gray-200">
            {group.name}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {group.players.map((player: any) => (
              <div key={player.number} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm group hover:shadow-md transition-shadow">
                <div className="relative h-48 bg-gray-100 flex items-end justify-center pt-4">
                  {/* Fake player silhouette */}
                  <div className="w-3/4 h-[90%] bg-gray-300 rounded-t-[50%] relative z-10 group-hover:scale-105 transition-transform duration-300"></div>
                  <div className="absolute top-4 left-4 text-4xl font-black text-gray-200 z-0 tracking-tighter">
                    {player.number}
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-100 relative">
                   <div className="absolute top-0 right-4 -translate-y-1/2 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {/* Flag placeholder */}
                      <div className="w-full h-full bg-blue-600"></div>
                   </div>
                   
                   <div className="font-bold text-gray-500 text-xs mb-1">{player.name.split(' ')[0]}</div>
                   <h3 className="text-xl font-heading font-black uppercase tracking-tight text-gray-900 leading-none">
                     {player.name}
                   </h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
