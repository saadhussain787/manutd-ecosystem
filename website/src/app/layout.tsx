import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import GlobalHeader from "@/components/GlobalHeader";
import ClubSidebar from "@/components/ClubSidebar";
import ClubNav from "@/components/ClubNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Manchester United | Official Club Profile | Premier League",
  description: "Automated Jamstack frontend for Manchester United statistics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans">
        <GlobalHeader />
        
        {/* Main Content Container */}
        <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
          <ClubSidebar />
          
          <div className="flex-1 w-full min-w-0">
            <ClubNav />
            <div className="w-full">
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
