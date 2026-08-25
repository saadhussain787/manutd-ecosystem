'use client';
import { motion } from 'framer-motion';
import { ExternalLink, Clock } from 'lucide-react';

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    description: string;
}

interface LiveNewsSectionProps {
    news: NewsItem[];
}

export default function LiveNewsSection({ news }: LiveNewsSectionProps) {
    if (!news || news.length === 0) return null;

    return (
        <section id="news" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
                        Live <span className="text-[#DA291C]">Updates</span>
                    </h2>
                    <p className="text-gray-400 mt-2">The latest from Old Trafford</p>
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="hidden md:flex items-center gap-2 text-sm text-[#FBE122] font-semibold bg-[#FBE122]/10 px-4 py-2 rounded-full border border-[#FBE122]/30"
                >
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FBE122] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FBE122]"></span>
                    </span>
                    LIVE FEED
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item, index) => (
                    <motion.a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group bg-[#111111]/80 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-[#1a1a1a] hover:border-[#DA291C]/50 transition-all shadow-xl hover:shadow-[0_0_20px_rgba(218,41,28,0.2)] flex flex-col h-full"
                    >
                        <div className="text-xs text-gray-500 font-mono mb-3 flex items-center gap-2">
                            <Clock size={12} className="text-[#DA291C]" />
                            {item.pubDate.replace(" +0000", "").replace("GMT", "")}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#DA291C] transition-colors line-clamp-2">
                            {item.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3">
                            {item.description}
                        </p>
                        
                        <div className="mt-auto flex items-center text-[#DA291C] text-sm font-semibold uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                            Read Full Story <ExternalLink size={14} className="ml-2" />
                        </div>
                    </motion.a>
                ))}
            </div>
        </section>
    );
}
