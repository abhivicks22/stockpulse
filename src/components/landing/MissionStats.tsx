'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ReactNode } from 'react'

/* ──────────────────────────────────────────────
   STAT ROW — Each stat block with scroll animation
   ────────────────────────────────────────────── */
function StatRow({ stat, title, description, index }: { stat: string; title: string; description: string | ReactNode; index: number }) {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"]
    })

    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1])
    const x = useTransform(scrollYProgress, [0, 0.5, 1], [index % 2 === 0 ? -80 : 80, 0, 0])
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 1])

    return (
        <motion.div
            ref={ref}
            className="flex flex-col md:flex-row gap-8 md:gap-16 items-start border-t border-white/10 pt-12 pb-24"
            style={{ opacity, x, scale }}
        >
            <div className="w-full md:w-[45%] shrink-0">
                <h3 className="text-[36px] md:text-[56px] font-extrabold tracking-tight text-white leading-[1.05]">
                    {stat}
                </h3>
            </div>
            <div className="w-full md:w-[55%] flex flex-col justify-center">
                <h4 className="text-xl md:text-2xl font-bold text-white mb-4">
                    {title}
                </h4>
                <div className="text-base md:text-lg text-[#D1D4DC] leading-relaxed font-medium">
                    {description}
                </div>
            </div>
        </motion.div>
    )
}

/* ──────────────────────────────────────────────
   MAIN EXPORT
   ────────────────────────────────────────────── */
export default function MissionStats() {
    return (
        <section id="stats" className="relative w-full py-32 px-6 lg:px-8 overflow-hidden pointer-events-none">

            <div className="max-w-7xl mx-auto relative z-10 pointer-events-auto">
                {/* Section header */}
                <motion.div
                    className="mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-[#2962FF] text-sm font-bold uppercase tracking-[0.2em] mb-4 block drop-shadow-lg">
                        Mission Control
                    </span>
                    <h2 className="text-[36px] md:text-[60px] font-extrabold tracking-tight text-white leading-[1.05] max-w-[700px] drop-shadow-2xl">
                        Built for traders who refuse to{' '}
                        <span className="bg-gradient-to-r from-[#2962FF] to-[#7E22CE] bg-clip-text text-transparent drop-shadow-lg">
                            compromise.
                        </span>
                    </h2>
                </motion.div>

                <StatRow
                    index={0}
                    stat="10,000+ data points"
                    title="Real-time precision at scale"
                    description="StockPulse streams professional-grade OHLCV candles, volume profiles, and live quotes directly into your browser. No subscriptions. No data delays. Just pure market signal."
                />

                <StatRow
                    index={1}
                    stat="AI-native from day one"
                    title="Sentiment baked into every pixel."
                    description={
                        <p>
                            We didn&apos;t bolt on an AI chatbot as an afterthought. StockPulse embeds{' '}
                            <span className="text-white font-bold">real-time sentiment analysis</span>{' '}
                            directly into every chart — scanning thousands of news sources, analyst ratings, and social signals in milliseconds.
                        </p>
                    }
                />

                <StatRow
                    index={2}
                    stat="< 50ms response"
                    title="Engineered for zero compromise."
                    description="Our architecture leverages React Server Components and Lightweight Charts to render faster than legacy platforms can load their login screens. Every millisecond counts when the market moves."
                />
            </div>
        </section>
    )
}
