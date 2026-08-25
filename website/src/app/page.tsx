import StatsDashboard from '@/components/StatsDashboard';
import AdvancedAnalytics from '@/components/AdvancedAnalytics';
import AffiliateBlock from '@/components/AffiliateBlock';
import PremiumPaywall from '@/components/PremiumPaywall';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import LiveNewsSection from '@/components/LiveNewsSection';
import Footer from '@/components/Footer';
import { fetchFromS3 } from '@/lib/s3';

export async function generateMetadata() {
  return {
    title: "Manchester United | Official Tactical Hub",
    description: "Live Manchester United player statistics, match analysis, and exclusive tactical breakdowns powered by AI.",
    keywords: ["Manchester United", "Man Utd stats", "Premier League data", "FPL stats", "Tactical analysis"],
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
