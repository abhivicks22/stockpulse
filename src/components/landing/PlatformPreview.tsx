'use client'

import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

export default function PlatformPreview() {
    return (
        <section className="py-20 md:py-28 px-4 bg-gradient-to-b from-[#0d1117] to-[#131722]">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Where smart traders do research
                    </h2>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        A professional-grade dashboard designed for speed, clarity, and insight.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="max-w-6xl mx-auto bg-[#131722] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(99,102,241,0.12)]"
                >
                    {/* Top bar */}
                    <div className="flex items-center gap-2 px-6 py-3 border-b border-white/5 bg-[#0d1117]/60">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/60" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                            <div className="w-3 h-3 rounded-full bg-green-500/60" />
                        </div>
                        <div className="flex gap-1 ml-4">
                            {['Dashboard', 'Charts', 'Watchlist'].map((tab) => (
                                <button
                                    key={tab}
                                    className={`text-xs px-3 py-1 rounded-md transition-colors ${tab === 'Dashboard'
                                            ? 'bg-indigo-500/20 text-indigo-300'
                                            : 'text-zinc-500 hover:text-zinc-300'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col md:flex-row">
                        {/* Chart area */}
                        <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <span className="text-white font-bold text-lg">AAPL</span>
                                    <span className="text-zinc-500 text-sm ml-2">Apple Inc.</span>
                                </div>
                                <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
                                    <TrendingUp className="w-4 h-4" />
                                    +1.42%
                                </div>
                            </div>
                            {/* SVG chart */}
                            <div className="relative h-52 w-full">
                                <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    {/* Grid lines */}
                                    {[50, 100, 150].map((y) => (
                                        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                                    ))}
                                    {/* Area fill */}
                                    <path
                                        d="M0,160 C40,150 80,130 120,110 C160,90 180,100 220,80 C260,60 300,50 340,35 C360,28 380,22 400,15 L400,200 L0,200 Z"
                                        fill="url(#chartGrad)"
                                    />
                                    {/* Line */}
                                    <path
                                        d="M0,160 C40,150 80,130 120,110 C160,90 180,100 220,80 C260,60 300,50 340,35 C360,28 380,22 400,15"
                                        fill="none"
                                        stroke="#22c55e"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </div>
                            {/* Time pills */}
                            <div className="flex gap-1 mt-3">
                                {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((t) => (
                                    <button
                                        key={t}
                                        className={`text-xs px-2 py-0.5 rounded transition-colors ${t === '3M'
                                                ? 'bg-indigo-500/20 text-indigo-300'
                                                : 'text-zinc-600 hover:text-zinc-400'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Watchlist */}
                        <div className="w-full md:w-64 p-4">
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3 font-medium">Watchlist</p>
                            {[
                                { sym: 'AAPL', price: '$192.50', chg: '+1.2%', up: true, badge: '🟢 Bullish' },
                                { sym: 'TSLA', price: '$248.30', chg: '-0.8%', up: false, badge: '🔴 Bearish' },
                                { sym: 'BTC', price: '$67,420', chg: '+3.1%', up: true, badge: '🟢 Bullish' },
                                { sym: 'GOOGL', price: '$175.20', chg: '+0.5%', up: true, badge: '🟡 Neutral' },
                            ].map((s) => (
                                <div
                                    key={s.sym}
                                    className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
                                >
                                    <div>
                                        <p className="text-sm font-semibold text-white">{s.sym}</p>
                                        <span className="text-[10px] text-zinc-600">{s.badge}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-white">{s.price}</p>
                                        <p className={`text-xs font-medium ${s.up ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {s.chg}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
