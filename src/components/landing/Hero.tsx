'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Link from 'next/link'

// Dynamic import — Three.js cannot run on the server
const SpaceScene = dynamic(() => import('./SpaceScene'), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 bg-[#000000]" />
    ),
})

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
})

export default function Hero() {
    return (
        <section className="relative min-h-[100vh] flex flex-col justify-center bg-[#000000] overflow-hidden">
            {/* ═══ LAYER 1: 3D WebGL Scene (Earth + Satellites + Stars) ═══ */}
            <SpaceScene />

            {/* ═══ LAYER 2: Gradient overlays for text readability ═══ */}
            {/* Left-side vignette so text pops against the 3D scene */}
            <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-[30vh] z-[1] pointer-events-none bg-gradient-to-t from-black to-transparent" />
            {/* Top fade for navbar */}
            <div className="absolute top-0 left-0 right-0 h-[20vh] z-[1] pointer-events-none bg-gradient-to-b from-black/50 to-transparent" />

            {/* ═══ LAYER 3: Content — Left Aligned Cinematic Typography ═══ */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-start justify-center h-full pb-20 pt-32">

                {/* Massive Heading */}
                <motion.h1
                    className="text-[44px] sm:text-[60px] md:text-[80px] lg:text-[100px] font-extrabold tracking-[-0.04em] leading-[0.9] text-white max-w-[900px] mb-6"
                    {...fadeUp(0.2)}
                >
                    See the markets
                    <br />
                    from{' '}
                    <span className="bg-gradient-to-r from-[#2962FF] to-[#7E22CE] bg-clip-text text-transparent">
                        orbit.
                    </span>
                </motion.h1>

                {/* Sub-heading */}
                <motion.p
                    className="text-xl md:text-2xl text-[#D1D4DC] max-w-[600px] mb-10 leading-relaxed font-medium"
                    {...fadeUp(0.4)}
                >
                    Professional-grade charting, real-time AI sentiment,
                    and smart watchlists — all in one mission-critical dashboard.
                </motion.p>

                {/* Features Checkmarks */}
                <motion.div className="flex flex-col gap-4 mb-12" {...fadeUp(0.6)}>
                    {[
                        'Professional-grade charting engine',
                        'Live AI sentiment on every ticker',
                        'Zero latency. Zero compromises.',
                    ].map((text, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <svg className="w-6 h-6 text-[#2962FF] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span className="text-lg md:text-xl font-medium text-white/90">{text}</span>
                        </div>
                    ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div className="flex flex-col sm:flex-row gap-4" {...fadeUp(0.8)}>
                    <Link href="/sign-in">
                        <button className="bg-gradient-to-r from-[#1848FF] to-[#7E22CE] text-white text-lg font-bold px-8 py-4 rounded-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(24,72,255,0.4)] hover:shadow-[0_0_50px_rgba(24,72,255,0.6)]">
                            Launch platform
                        </button>
                    </Link>
                    <Link href="#stats">
                        <button className="border border-white/20 text-white text-lg font-bold px-8 py-4 rounded-lg transition-all hover:bg-white/5 hover:border-white/40 backdrop-blur-sm">
                            Explore mission
                        </button>
                    </Link>
                </motion.div>
            </div>

            {/* ═══ LAYER 4: Scroll indicator ═══ */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <svg className="w-6 h-6 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
            </motion.div>
        </section>
    )
}

