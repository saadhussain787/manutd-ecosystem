'use client';
import { motion } from 'framer-motion';
import { Globe, MessageCircle, Camera, ArrowUpRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 pt-16 pb-8 relative z-10">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    
                    <div className="col-span-1 md:col-span-2">
                        <motion.h3 
                            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                            className="text-2xl font-black text-white uppercase tracking-tight mb-4"
                        >
                            The <span className="text-[#DA291C]">Theatre</span> of Dreams
                        </motion.h3>
                        <p className="text-gray-400 text-sm max-w-sm mb-6">
                            The ultimate Manchester United ecosystem. Live news, real-time advanced analytics, and premium content for the global fanbase.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-[#DA291C] hover:text-white transition-colors text-gray-400">
                                <MessageCircle size={20} />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-[#DA291C] hover:text-white transition-colors text-gray-400">
                                <Camera size={20} />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-[#DA291C] hover:text-white transition-colors text-gray-400">
                                <Globe size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Ecosystem</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#news" className="hover:text-white transition-colors flex items-center gap-1">Live News <ArrowUpRight size={12}/></a></li>
                            <li><a href="#squad" className="hover:text-white transition-colors flex items-center gap-1">Squad Analytics <ArrowUpRight size={12}/></a></li>
                            <li><a href="#premium" className="hover:text-[#FBE122] transition-colors">Premium Affiliates</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-4">Legal</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Data Usage</a></li>
                        </ul>
                    </div>

                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-600 text-xs">
                        © {new Date().getFullYear()} The Global Phenomenon. Not officially affiliated with Manchester United PLC.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span>Powered by AWS & Next.js</span>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-green-500">Systems Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
