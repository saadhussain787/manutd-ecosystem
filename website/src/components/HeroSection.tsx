'use client';
import { motion } from 'framer-motion';

export default function HeroSection() {
    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background elements are handled by page.tsx or globals.css, this component is purely the foreground hero content */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-[#DA291C]/20 border border-[#DA291C]/50 text-[#FBE122] text-sm font-semibold mb-6 shadow-[0_0_15px_rgba(218,41,28,0.5)]">
                        The Global Phenomenon
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
                        THE <span className="text-[#DA291C]">THEATRE</span> OF DREAMS
                    </h1>
                </motion.div>
                
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-2xl text-gray-300 max-w-3xl mb-10 font-light drop-shadow-md"
                >
                    Explore live club news, cutting-edge squad analytics, and the ultimate premium experience for Manchester United fans worldwide.
                </motion.p>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <a href="#news" className="px-8 py-4 bg-[#DA291C] text-white font-bold rounded-lg hover:bg-red-700 transition-all shadow-[0_0_20px_rgba(218,41,28,0.6)] hover:shadow-[0_0_30px_rgba(218,41,28,0.8)] hover:-translate-y-1">
                        Latest Live News
                    </a>
                    <a href="#squad" className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-lg border border-white/20 hover:bg-white/20 transition-all hover:-translate-y-1">
                        Explore Squad Analytics
                    </a>
                </motion.div>
            </div>
            
            {/* Scroll Indicator */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            >
                <span className="text-gray-400 text-sm mb-2 uppercase tracking-widest">Scroll</span>
                <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-1 h-8 rounded-full bg-gradient-to-b from-[#DA291C] to-transparent"
                />
            </motion.div>
        </section>
    );
}
