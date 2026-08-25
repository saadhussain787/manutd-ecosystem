import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchFromS3 } from '@/lib/s3';

export const revalidate = 3600; // Cache for 1 hour

async function getFixtures() {
  const [fixturesRaw, teamsRaw] = await Promise.all([
    fetchFromS3('fixtures.json'),
    fetchFromS3('teams.json')
  ]);

  if (!fixturesRaw || !teamsRaw) {
    return { pastMatches: [], upcomingMatches: [], teamMap: {}, manUtdId: 16 };
  }

  const fixtures = JSON.parse(fixturesRaw);
  const teams = JSON.parse(teamsRaw);
  
  // Find Manchester United ID
  const manUtdId = teams.find((t: any) => t.name === 'Man Utd')?.id || 16;
  
  const teamMap: Record<number, any> = {};
  teams.forEach((t: any) => {
    teamMap[t.id] = { name: t.name, short_name: t.short_name };
  });

  const muFixtures = fixtures.filter((f: any) => f.team_h === manUtdId || f.team_a === manUtdId);

  const isFinished = (f: any) => f.finished || f.finished_provisional;
  const pastMatches = muFixtures.filter(isFinished).reverse(); // Most recent first
  const upcomingMatches = muFixtures.filter((f: any) => !isFinished(f)); // Next match first

  return { pastMatches, upcomingMatches, teamMap, manUtdId };
}

export default async function FixturesPage() {
  const { pastMatches, upcomingMatches, teamMap, manUtdId } = await getFixtures();

  return (
    <main className="min-h-screen bg-sir-alex text-white flex flex-col font-sans">
      <Navbar />
      
      <div className="flex-grow pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-12 border-b border-utd-red pb-6">
          <h1 className="text-5xl font-heading font-bold uppercase tracking-wider text-utd-gold mb-4 drop-shadow-[0_0_15px_rgba(251,225,34,0.5)]">
            Fixtures & Results
          </h1>
          <p className="text-xl text-gray-300 font-body">Complete Manchester United 2026/27 schedule and historical match results.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Upcoming Matches */}
          <section>
            <h2 className="text-3xl font-heading uppercase text-white mb-8 border-l-4 border-utd-gold pl-4 flex items-center gap-3">
              <span className="text-utd-gold">●</span> Upcoming Matches
            </h2>
            <div className="flex flex-col gap-4">
              {upcomingMatches.length === 0 ? (
                <p className="text-gray-400">No upcoming matches available.</p>
              ) : (
                upcomingMatches.map((match: any) => {
                  const date = new Date(match.kickoff_time);
                  const isHome = match.team_h === manUtdId;
                  const opponent = isHome ? teamMap[match.team_a] : teamMap[match.team_h];
                  
                  return (
                    <div key={match.id} className="glass-card p-6 border-l-4 border-utd-gold hover:bg-white/5 transition-colors">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                          {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-sm font-bold text-utd-gold bg-utd-gold/10 px-3 py-1 rounded-full uppercase tracking-wider">
                          {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className={`flex-1 text-center font-heading text-xl md:text-2xl font-bold uppercase truncate ${isHome ? 'text-white' : 'text-gray-400'}`}>
                          {isHome ? 'Man Utd' : opponent?.name}
                        </div>
                        <div className="px-6 text-gray-500 font-heading text-2xl font-black">
                          VS
                        </div>
                        <div className={`flex-1 text-center font-heading text-xl md:text-2xl font-bold uppercase truncate ${!isHome ? 'text-white' : 'text-gray-400'}`}>
                          {!isHome ? 'Man Utd' : opponent?.name}
                        </div>
                      </div>
                      <div className="text-center mt-4 text-xs text-gray-500 uppercase tracking-widest">
                        {isHome ? 'Old Trafford' : 'Away'}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Past Matches */}
          <section>
            <h2 className="text-3xl font-heading uppercase text-white mb-8 border-l-4 border-gray-500 pl-4">
              Past Results
            </h2>
            <div className="flex flex-col gap-4">
              {pastMatches.length === 0 ? (
                <p className="text-gray-400">No past matches available.</p>
              ) : (
                pastMatches.map((match: any) => {
                  const date = new Date(match.kickoff_time);
                  const isHome = match.team_h === manUtdId;
                  const opponent = isHome ? teamMap[match.team_a] : teamMap[match.team_h];
                  const utdScore = isHome ? match.team_h_score : match.team_a_score;
                  const oppScore = isHome ? match.team_a_score : match.team_h_score;
                  
                  let resultColor = "text-gray-400";
                  let resultBorder = "border-gray-500";
                  if (utdScore > oppScore) {
                    resultColor = "text-green-500";
                    resultBorder = "border-green-500";
                  } else if (utdScore < oppScore) {
                    resultColor = "text-utd-red";
                    resultBorder = "border-utd-red";
                  }

                  return (
                    <div key={match.id} className={`glass-card p-6 border-l-4 ${resultBorder} hover:bg-white/5 transition-colors opacity-80`}>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                          {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className={`text-sm font-bold ${resultColor} bg-white/5 px-3 py-1 rounded-full uppercase tracking-wider`}>
                          FT
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className={`flex-1 text-center font-heading text-lg md:text-xl font-bold uppercase truncate ${isHome ? 'text-white' : 'text-gray-400'}`}>
                          {isHome ? 'Man Utd' : opponent?.name}
                        </div>
                        
                        <div className="px-6 flex gap-4 items-center font-heading text-3xl font-black">
                          <span className={isHome ? 'text-white' : 'text-gray-400'}>{match.team_h_score}</span>
                          <span className="text-gray-600 text-lg">-</span>
                          <span className={!isHome ? 'text-white' : 'text-gray-400'}>{match.team_a_score}</span>
                        </div>
                        
                        <div className={`flex-1 text-center font-heading text-lg md:text-xl font-bold uppercase truncate ${!isHome ? 'text-white' : 'text-gray-400'}`}>
                          {!isHome ? 'Man Utd' : opponent?.name}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </main>
  );
}
