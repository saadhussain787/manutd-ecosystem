import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const revalidate = 3600; // Cache for 1 hour

async function getSquadData() {
  const res = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Failed to fetch squad data');
  }

  const data = await res.json();
  
  // Find Manchester United ID (16 in this simulation)
  const manUtdId = data.teams.find((t: any) => t.name === 'Man Utd')?.id || 16;

  // Filter players
  const players = data.elements.filter((p: any) => p.team === manUtdId);

  // Sort players by ICT index
  players.sort((a: any, b: any) => parseFloat(b.ict_index) - parseFloat(a.ict_index));

  return players;
}

export default async function SquadPage() {
  const squad = await getSquadData();

  const getPositionName = (id: number) => {
    switch (id) {
      case 1: return "Goalkeepers";
      case 2: return "Defenders";
      case 3: return "Midfielders";
      case 4: return "Forwards";
      default: return "Unknown";
    }
  };

  const groupedSquad = [1, 2, 3, 4].map(posId => ({
    name: getPositionName(posId),
    players: squad.filter((p: any) => p.element_type === posId)
  }));

  return (
    <main className="min-h-screen bg-sir-alex text-white flex flex-col font-sans">
      <Navbar />
      
      <div className="flex-grow pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-12 border-b border-utd-red pb-6">
          <h1 className="text-5xl font-heading font-bold uppercase tracking-wider text-utd-gold mb-4 drop-shadow-[0_0_15px_rgba(251,225,34,0.5)]">
            Manchester United Squad
          </h1>
          <p className="text-xl text-gray-300 font-body">Comprehensive player analytics, real-time FPL data, and performance metrics for the 2026/27 season.</p>
        </div>

        {groupedSquad.map(group => group.players.length > 0 && (
          <section key={group.name} className="mb-16">
            <h2 className="text-3xl font-heading uppercase text-white mb-8 border-l-4 border-utd-red pl-4">
              {group.name}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {group.players.map((player: any) => (
                <div key={player.id} className="glass-card overflow-hidden hover:scale-105 transition-transform duration-300">
                  <div className="relative h-64 bg-gradient-to-t from-black to-transparent flex items-end justify-center pt-4">
                    <img 
                      src={`https://resources.premierleague.com/premierleague/photos/players/250x250/p${player.code}.png`} 
                      alt={`${player.first_name} ${player.second_name}`}
                      className="h-full object-contain relative z-10"
                    />
                    <div className="absolute top-4 right-4 bg-utd-red text-white font-bold px-3 py-1 rounded-lg text-sm z-20 shadow-lg border border-utd-gold/30">
                      £{(player.now_cost / 10).toFixed(1)}m
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-white/10 bg-black/50">
                    <h3 className="text-xl font-heading font-bold uppercase truncate">
                      {player.first_name} <span className="text-utd-gold">{player.second_name}</span>
                    </h3>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">ICT Index</span>
                        <span className="text-lg font-bold">{player.ict_index}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Form</span>
                        <span className="text-lg font-bold">{player.form}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Pts</span>
                        <span className="text-lg font-bold text-green-400">{player.total_points}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Selected</span>
                        <span className="text-lg font-bold">{player.selected_by_percent}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Footer />
    </main>
  );
}
