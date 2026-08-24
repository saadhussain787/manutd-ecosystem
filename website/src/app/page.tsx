import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import StatsDashboard from '@/components/StatsDashboard';

// Initialize the S3 Client for the Canada Central region
const s3 = new S3Client({ region: "ca-central-1" });
const BUCKET_NAME = "manutd-ecosystem-data-303238378489-ca-central-1";

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
  // 1. Securely fetch our live data directly from AWS S3!
  const rawStats = await fetchFromS3("latest_stats.json");
  const youtubeScript = await fetchFromS3("latest_youtube_script.txt");

  // 2. Parse the JSON (fallback to mock data if it fails)
  const statsData = rawStats ? JSON.parse(rawStats) : { wins: 0, draws: 0, loses: 0 };
  const finalScript = youtubeScript || "Loading live Gemini AI analysis from AWS...";

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center p-8">
      <header className="mb-12 text-center mt-10">
        <h1 className="text-5xl md:text-7xl font-heading text-[var(--color-utd-red)] uppercase tracking-wider mb-4 drop-shadow-lg">
          Manchester United
        </h1>
        <h2 className="text-2xl font-body text-[var(--color-utd-gold)] uppercase tracking-widest font-bold">
          Live Data Ecosystem
        </h2>
      </header>
      
      <StatsDashboard statsData={statsData} youtubeScript={finalScript} />
    </main>
  );
}
