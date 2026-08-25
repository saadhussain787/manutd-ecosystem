import { NextResponse } from 'next/server';
import { fetchFromS3 } from '@/lib/s3';

export async function GET() {
  try {
    const [fixturesRaw, teamsRaw] = await Promise.all([
      fetchFromS3('fixtures.json'),
      fetchFromS3('teams.json')
    ]);

    if (!fixturesRaw || !teamsRaw) {
      return NextResponse.json({ error: 'Data not found' }, { status: 404 });
    }

    const fixtures = JSON.parse(fixturesRaw);
    const teams = JSON.parse(teamsRaw);

    const manUtdId = teams.find((t: any) => t.name === 'Man Utd')?.id || 16;
    
    const teamMap: Record<number, string> = {};
    teams.forEach((t: any) => {
      teamMap[t.id] = t.name;
    });

    const muFixtures = fixtures.filter((f: any) => f.team_h === manUtdId || f.team_a === manUtdId);
    const isFinished = (f: any) => f.finished || f.finished_provisional;

    const pastMatches = muFixtures.filter(isFinished);
    const upcomingMatches = muFixtures.filter((f: any) => !isFinished(f));

    const lastMatch = pastMatches.length > 0 ? pastMatches[pastMatches.length - 1] : null;
    const nextMatch = upcomingMatches.length > 0 ? upcomingMatches[0] : null;


    
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
