import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://fantasy.premierleague.com/api/fixtures/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch fixtures: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 16 is Manchester United's FPL ID in this simulation
    const muFixtures = data.filter((f: any) => f.team_h === 16 || f.team_a === 16);
    
    // Find the latest finished match (including provisional finish)
    const isFinished = (f: any) => f.finished || f.finished_provisional;
    const finishedMatches = muFixtures.filter(isFinished);
    const lastMatch = finishedMatches.length > 0 ? finishedMatches[finishedMatches.length - 1] : null;
    
    // Find the next upcoming match
    const upcomingMatches = muFixtures.filter((f: any) => !isFinished(f));
    const nextMatch = upcomingMatches.length > 0 ? upcomingMatches[0] : null;

    // Fetch bootstrap-static to get team names
    const bootstrapResponse = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        next: { revalidate: 86400 } // Cache for 24 hours
    });
    
    let teamMap: Record<number, string> = {};
    if (bootstrapResponse.ok) {
        const bootstrapData = await bootstrapResponse.json();
        bootstrapData.teams.forEach((t: any) => {
            teamMap[t.id] = t.short_name;
        });
    }
    
    return NextResponse.json({
      lastMatch,
      nextMatch,
      teams: teamMap
    });
  } catch (error) {
    console.error('Error in fixtures API:', error);
    return NextResponse.json({ error: 'Failed to fetch fixtures' }, { status: 500 });
  }
}
