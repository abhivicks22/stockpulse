'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

const marketData = [
    { name: 'S&P 500', value: '5,088.80', change: '+0.03%', positive: true },
    { name: 'NASDAQ', value: '15,996.82', change: '-0.28%', positive: false },
    { name: 'DOW JONES', value: '39,131.53', change: '+0.16%', positive: true },
    { name: 'BITCOIN', value: '51,420.00', change: '+2.41%', positive: true },
]

export default function MarketsSection() {
    return (
        <section id="markets" className="py-24 relative z-10 border-b border-white/5 bg-black/50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Activity className="w-5 h-5 text-indigo-500" />
                            <span className="text-indigo-400 font-bold uppercase tracking-widest text-sm">Live Markets</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                            The pulse of the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">global economy.</span>
                        </h2>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {marketData.map((item, i) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.04] transition-colors group cursor-default"
                        >
                            <h3 className="text-zinc-400 font-medium text-sm mb-2 uppercase tracking-wider">{item.name}</h3>
                            <div className="flex items-end justify-between">
                                <span className="text-2xl font-bold text-white">{item.value}</span>
                                <div className={`flex items-center gap-1 text-sm font-bold ${item.positive ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                                    {item.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                    {item.change}
                                </div>
                            </div>

                            {/* Abstract decorative sparkline */}
                            <div className="h-10 mt-6 w-full relative overflow-hidden rounded-lg opacity-50 group-hover:opacity-100 transition-opacity">
                                <div className={`absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t ${item.positive ? 'from-[#089981]/20' : 'from-[#F23645]/20'} to-transparent`} />
                                <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                    <path
                                        d={item.positive ? "M0,100 L20,80 L40,90 L60,40 L80,50 L100,10" : "M0,10 L20,30 L40,20 L60,80 L80,60 L100,90"}
                                        fill="none"
                                        stroke={item.positive ? '#089981' : '#F23645'}
                                        strokeWidth="3"
                                        vectorEffect="non-scaling-stroke"
                                    />
                                </svg>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
