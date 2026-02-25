'use client'

import { motion } from 'framer-motion'
import { LineChart, Zap, Layers, BellRing, Sparkles } from 'lucide-react'

const features = [
    {
        title: "Zero-Latency Charting",
        description: "Powered by the exact same charting engine used by millions of institutional traders. Rendered locally in your browser for 60fps performance.",
        icon: LineChart,
        colSpan: "col-span-1 md:col-span-2",
        bg: "bg-gradient-to-br from-indigo-500/10 to-transparent",
        glow: "shadow-[0_0_50px_rgba(99,102,241,0.1)]"
    },
    {
        title: "AI Sentiment",
        description: "Instant bullish or bearish analysis driven by real-time financial models.",
        icon: Sparkles,
        colSpan: "col-span-1 md:col-span-1",
        bg: "bg-gradient-to-br from-purple-500/10 to-transparent",
        glow: "shadow-[0_0_50px_rgba(168,85,247,0.1)]"
    },
    {
        title: "Infinite Tracking",
        description: "Keep your finger on the pulse. Build unlimited custom watchlists.",
        icon: Layers,
        colSpan: "col-span-1 md:col-span-1",
        bg: "bg-gradient-to-br from-blue-500/10 to-transparent",
        glow: "shadow-[0_0_50px_rgba(59,130,246,0.1)]"
    },
    {
        title: "Fuzzy Search Engine",
        description: "We indexed 10,000+ global equities so you can find tickers in milliseconds. Even if you spell them wrong.",
        icon: Zap,
        colSpan: "col-span-1 md:col-span-2",
        bg: "bg-gradient-to-br from-emerald-500/10 to-transparent",
        glow: "shadow-[0_0_50px_rgba(16,185,129,0.1)]"
    },
]

export default function FeaturesSection() {
    return (
        <section id="features" className="py-32 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-16 md:mb-24">
                <span className="text-indigo-500 font-bold uppercase tracking-[0.2em] mb-4 block">The Toolkit</span>
                <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
                    Everything you need.<br />
                    <span className="text-zinc-500">Nothing you don&apos;t.</span>
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((f, i) => (
                    <motion.div
                        key={f.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className={`
                            relative overflow-hidden rounded-3xl border border-white/10 backdrop-blur-md 
                            p-10 flex flex-col justify-between ${f.colSpan} ${f.bg} hover:${f.glow} 
                            transition-all duration-500 group
                        `}
                    >
                        <div className="mb-12">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 group-hover:bg-white/10 transition-all">
                                <f.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{f.title}</h3>
                            <p className="text-zinc-400 leading-relaxed text-lg max-w-[400px]">
                                {f.description}
                            </p>
                        </div>

                        {/* Decorative background flair */}
                        <div className="absolute -right-10 -bottom-10 opacity-10 blur-2xl group-hover:opacity-20 transition-opacity">
                            <f.icon className="w-64 h-64" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
