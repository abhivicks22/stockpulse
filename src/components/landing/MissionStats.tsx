'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
})

function StatRow({ stat, title, description, delay = 0 }: { stat: string, title: string, description: string | ReactNode, delay?: number }) {
    return (
        <motion.div
            className="flex flex-col md:flex-row gap-8 md:gap-16 items-start border-t border-white/10 pt-12 pb-20"
            {...fadeUp(delay)}
        >
            <div className="w-full md:w-[45%] shrink-0">
                <h3 className="text-[40px] md:text-[60px] font-extrabold tracking-tight text-white leading-[1.1] mb-4">
                    {stat}
                </h3>
            </div>
            <div className="w-full md:w-[55%] flex flex-col justify-center">
                <h4 className="text-2xl font-bold text-white mb-4">
                    {title}
                </h4>
                <div className="text-lg md:text-xl text-[#D1D4DC] leading-relaxed font-medium">
                    {description}
                </div>
            </div>
        </motion.div>
    )
}

export default function MissionStats() {
    return (
        <section className="relative w-full bg-[#000000] py-32 px-6 lg:px-8 overflow-hidden">

            {/* Background Line Art Diagram (simulating the astronaut/capsule from TV screenshot) */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] opacity-20 pointer-events-none stroke-white/40" style={{ fill: 'none', strokeWidth: 1.5 }}>
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    {/* Simulated capsule/satellite abstract shape */}
                    <path d="M 120 40 L 160 30 L 180 60 L 140 80 Z" />
                    <circle cx="140" cy="50" r="5" fill="white" />
                    <circle cx="160" cy="65" r="5" fill="white" />
                    {/* Trailing tether */}
                    <path d="M 140 80 Q 100 120 70 150" />
                    {/* Simulated astronaut abstract shape */}
                    <path d="M 60 140 Q 70 145 70 160 Q 60 170 50 160 Z" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <StatRow
                    stat="10,000+ data points"
                    title="Real-time precision"
                    description="StockPulse goes deeper than basic tickers. We stream professional-grade OHLCV candles, volume profiles, and live quotes directly into your browser without the heavy subscription fees."
                    delay={0.1}
                />

                <StatRow
                    stat="1st truly AI-native dashboard"
                    title="Not just a milestone — it's a giant leap for retail."
                    description={
                        <p>
                            We didn't just add an AI chatbot on the side. We embedded <span className="text-white font-bold">real-time sentiment analysis</span> directly into every chart, scanning thousands of news articles and analyst ratings in milliseconds so you know exactly what the market is feeling before it moves.
                        </p>
                    }
                    delay={0.2}
                />

                <StatRow
                    stat="< 50ms latency"
                    title="TradingView speeds. Local setup."
                    description="Our architecture pushes data processing to the absolute edge. By leveraging Next.js React Server Components and optimized Lightweight Charts, your dashboard renders faster than legacy platforms can load their loading screens."
                    delay={0.3}
                />
            </div>
        </section>
    )
}
