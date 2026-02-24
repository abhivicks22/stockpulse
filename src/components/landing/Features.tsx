'use client'

import { motion } from 'framer-motion'
import { Brain, LineChart, Star, Bell, Globe, Zap } from 'lucide-react'

const features = [
    {
        icon: <Brain className="w-8 h-8 text-indigo-400" />,
        title: 'AI-Powered Sentiment Analysis',
        desc: 'Our AI scans thousands of news articles in real-time, scoring every stock Bullish, Bearish, or Neutral — so you always know the market mood.',
        wide: true,
    },
    {
        icon: <LineChart className="w-8 h-8 text-violet-400" />,
        title: 'Interactive Real-Time Charts',
        desc: 'Professional TradingView-powered charts with candlestick, line, and area views. Switch timeframes in one click.',
        wide: false,
    },
    {
        icon: <Star className="w-8 h-8 text-amber-400" />,
        title: 'Smart Watchlists',
        desc: 'Track favorites with real-time prices, mini sparklines, and instant sentiment badges. Your edge at a glance.',
        wide: false,
    },
]

const pills = [
    { icon: <Bell className="w-3.5 h-3.5" />, label: 'Price Alerts' },
    { icon: <Globe className="w-3.5 h-3.5" />, label: 'Multi-Market' },
    { icon: <Zap className="w-3.5 h-3.5" />, label: 'Lightning Fast' },
]

export default function Features() {
    return (
        <section id="features" className="py-20 md:py-28 px-4 bg-[#0d1117]">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="text-center mb-14"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Everything you need to trade smarter
                    </h2>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Professional tools, zero complexity. Built for traders who mean business.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Wide card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0 }}
                        className="md:col-span-2 group bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-md border border-white/[0.05] hover:border-indigo-500/30 rounded-xl p-8 transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.08)]"
                    >
                        <div className="mb-4">{features[0].icon}</div>
                        <h3 className="text-xl font-bold text-white mb-3">{features[0].title}</h3>
                        <p className="text-zinc-400 max-w-xl">{features[0].desc}</p>
                    </motion.div>

                    {/* Two half cards */}
                    {features.slice(1).map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
                            className="group bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-md border border-white/[0.05] hover:border-indigo-500/30 rounded-xl p-6 transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.08)]"
                        >
                            <div className="mb-4">{f.icon}</div>
                            <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                            <p className="text-zinc-400 text-sm">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Pills */}
                <motion.div
                    className="flex flex-wrap justify-center gap-3"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    {pills.map((p) => (
                        <span
                            key={p.label}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-zinc-400 text-sm"
                        >
                            {p.icon} {p.label}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
