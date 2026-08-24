import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import StatsDashboard from '@/components/StatsDashboard';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import AffiliateBlock from '@/components/AffiliateBlock';
import PremiumPaywall from '@/components/PremiumPaywall';
import LiveNewsFixtures from '@/components/LiveNewsFixtures';

// Check if we are running in Amplify
const amplifyCredentials = process.env.MY_AWS_ACCESS_KEY_ID
  ? {
      credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY || "",
      },
    }
  : {};

// Initialize S3 Client
const s3 = new S3Client({ 
  region: "ca-central-1",
  ...amplifyCredentials
});
const BUCKET_NAME = "manutd-ecosystem-data-303238378489-ca-central-1";

export async function generateMetadata() {
  return {
    title: "Manchester United | Official Tactical Hub",
    description: "Live Manchester United player statistics, match analysis, and exclusive tactical breakdowns powered by AI.",
    keywords: ["Manchester United", "Man Utd stats", "Premier League data", "FPL stats", "Tactical analysis"],
  }
}

async function fetchFromS3(key: string) {
  try {
    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
    const response = await s3.send(command);
    return await response.Body?.transformToString() || "";
  } catch (error) {
    console.error(`Error fetching ${key}:`, error);
    return null;
  }
}

export default async function Home() {
  const rawStats = await fetchFromS3("latest_stats.json");
  const youtubeScript = await fetchFromS3("latest_youtube_script.txt");

  const statsData = rawStats ? JSON.parse(rawStats) : { top_performers: [] };
  const finalScript = youtubeScript || "Loading live Gemini AI analysis from AWS...";

  return (
    <main className="min-h-screen bg-sir-alex text-white flex flex-col items-center">
      
      {/* 1. Dynamic Hero Section */}
      <section className="relative w-full min-h-[60vh] flex flex-col justify-center p-8 md:p-16 overflow-hidden bg-black/40">
        <div className="w-full max-w-7xl mx-auto z-10 flex flex-col items-start justify-center">
          <span className="text-utd-gold font-bold tracking-widest uppercase mb-4 block text-lg shadow-black drop-shadow-md">Welcome to the Theatre of Dreams</span>
          <h1 className="text-6xl md:text-8xl font-heading text-white uppercase tracking-wider mb-8 drop-shadow-[0_5px_5px_rgba(0,0,0,1)]">
            Manchester United
            <span className="block text-utd-red">Tactical Hub</span>
          </h1>
          <p className="text-xl text-gray-200 font-body leading-relaxed max-w-3xl glass-card p-6 border-l-4 border-utd-red shadow-2xl backdrop-blur-xl">
            {finalScript.substring(0, 300)}... 
          </p>
        </div>
      </section>
      
      {/* 2. Live News & Fixtures Widget */}
      <section className="w-full max-w-7xl mx-auto p-8 mt-4">
        <LiveNewsFixtures />
      </section>
      
      {/* 3. Stats Dashboard */}
      <section className="w-full max-w-7xl mx-auto p-8 mt-12">
        <StatsDashboard statsData={statsData} youtubeScript={finalScript} />
      </section>

      {/* 4. Advanced Analytics (Radar Chart) */}
      <section className="w-full max-w-7xl mx-auto p-8 mt-4">
        <AdvancedAnalytics statsData={statsData} />
      </section>

      <section className="w-full max-w-7xl mx-auto p-8">
        <AffiliateBlock />
        <PremiumPaywall />
      </section>
    </main>
  );
}
