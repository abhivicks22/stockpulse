'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const MARKET_DATA = [
    { symbol: 'S&P 500', name: 'US Large Cap', price: '5,842.01', change: '+0.87%', up: true },
    { symbol: 'NASDAQ', name: 'Tech Index', price: '18,439.17', change: '+1.24%', up: true },
    { symbol: 'Bitcoin', name: 'BTC/USD', price: '$67,420', change: '+3.12%', up: true },
    { symbol: 'Ethereum', name: 'ETH/USD', price: '$3,521', change: '-0.84%', up: false },
    { symbol: 'Gold', name: 'XAU/USD', price: '$2,341', change: '+0.21%', up: true },
    { symbol: 'USD/INR', name: 'Forex', price: '₹83.42', change: '-0.05%', up: false },
]

export default function MarketTicker() {
    return (
        <section id="markets" className="py-20 md:py-28 px-4 bg-[#0d1117]">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    Live Market Overview
                </motion.h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {MARKET_DATA.map((item, i) => (
                        <motion.div
                            key={item.symbol}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.07 }}
                            className="group bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md border border-white/[0.05] hover:border-indigo-500/30 rounded-xl p-4 flex flex-col gap-2 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] cursor-default"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-zinc-400">{item.symbol}</span>
                                {item.up
                                    ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                                    : <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                                }
                            </div>
                            <p className="text-white font-bold text-sm">{item.price}</p>
                            <p className={`text-xs font-medium ${item.up ? 'text-emerald-400' : 'text-red-400'}`}>
                                {item.change}
                            </p>
                            <p className="text-xs text-zinc-600 truncate">{item.name}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
