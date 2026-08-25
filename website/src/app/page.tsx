import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import StatsDashboard from '@/components/StatsDashboard';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import AffiliateBlock from '@/components/AffiliateBlock';
import PremiumPaywall from '@/components/PremiumPaywall';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import LiveNewsSection from '@/components/LiveNewsSection';
import Footer from '@/components/Footer';

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

  const statsData = rawStats ? JSON.parse(rawStats) : { top_performers: [], live_news: [] };
  const finalScript = youtubeScript || "Loading live Gemini AI analysis from AWS...";

  return (
    <main className="min-h-screen bg-sir-alex text-white flex flex-col font-sans">
      <Navbar />
      
      <HeroSection />
      
      <LiveNewsSection news={statsData.live_news || []} />
      
      {/* 3. Stats Dashboard */}
      <section id="squad" className="w-full max-w-7xl mx-auto p-8 mt-12 scroll-mt-24 relative z-10">
        <StatsDashboard statsData={statsData} youtubeScript={finalScript} />
      </section>

      {/* 4. Advanced Analytics (Radar Chart) */}
      <section id="analytics" className="w-full max-w-7xl mx-auto p-8 mt-4 scroll-mt-24 relative z-10">
        <AdvancedAnalytics statsData={statsData} />
      </section>

      <section id="premium" className="w-full max-w-7xl mx-auto p-8 scroll-mt-24 relative z-10">
        <AffiliateBlock />
        <PremiumPaywall />
      </section>
      
      <Footer />
    </main>
  );
}
