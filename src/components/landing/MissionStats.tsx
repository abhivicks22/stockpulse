'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { ReactNode } from 'react'

/* ──────────────────────────────────────────────
   AURORA BACKGROUND — Animated CSS aurora lights
   that pulse and flow behind the content sections
   ────────────────────────────────────────────── */
function AuroraBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animFrame: number

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio
            canvas.height = canvas.offsetHeight * window.devicePixelRatio
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
        }
        resize()
        window.addEventListener('resize', resize)

        const draw = (time: number) => {
            const w = canvas.offsetWidth
            const h = canvas.offsetHeight
            ctx.clearRect(0, 0, w, h)

            // Aurora wave 1 - green/cyan
            ctx.save()
            ctx.globalAlpha = 0.12
            ctx.beginPath()
            for (let x = 0; x < w; x += 2) {
                const y = h * 0.3 +
                    Math.sin(x * 0.008 + time * 0.0008) * 60 +
                    Math.sin(x * 0.015 + time * 0.0012) * 30 +
                    Math.cos(x * 0.005 + time * 0.0005) * 40
                if (x === 0) ctx.moveTo(x, y)
                else ctx.lineTo(x, y)
            }
            ctx.lineTo(w, h)
            ctx.lineTo(0, h)
            ctx.closePath()
            const grad1 = ctx.createLinearGradient(0, 0, 0, h)
            grad1.addColorStop(0, 'rgba(20, 200, 120, 0.6)')
            grad1.addColorStop(0.3, 'rgba(30, 120, 200, 0.3)')
            grad1.addColorStop(1, 'rgba(0, 0, 0, 0)')
            ctx.fillStyle = grad1
            ctx.fill()
            ctx.restore()

            // Aurora wave 2 - purple/blue
            ctx.save()
            ctx.globalAlpha = 0.08
            ctx.beginPath()
            for (let x = 0; x < w; x += 2) {
                const y = h * 0.25 +
                    Math.sin(x * 0.006 + time * 0.0006 + 2) * 80 +
                    Math.cos(x * 0.012 + time * 0.001) * 40
                if (x === 0) ctx.moveTo(x, y)
                else ctx.lineTo(x, y)
            }
            ctx.lineTo(w, h)
            ctx.lineTo(0, h)
            ctx.closePath()
            const grad2 = ctx.createLinearGradient(0, 0, 0, h)
            grad2.addColorStop(0, 'rgba(126, 34, 206, 0.5)')
            grad2.addColorStop(0.4, 'rgba(41, 98, 255, 0.3)')
            grad2.addColorStop(1, 'rgba(0, 0, 0, 0)')
            ctx.fillStyle = grad2
            ctx.fill()
            ctx.restore()

            // Aurora wave 3 - faint cyan
            ctx.save()
            ctx.globalAlpha = 0.06
            ctx.beginPath()
            for (let x = 0; x < w; x += 3) {
                const y = h * 0.35 +
                    Math.sin(x * 0.01 + time * 0.0015) * 50 +
                    Math.sin(x * 0.02 + time * 0.0008 + 1) * 25
                if (x === 0) ctx.moveTo(x, y)
                else ctx.lineTo(x, y)
            }
            ctx.lineTo(w, h)
            ctx.lineTo(0, h)
            ctx.closePath()
            const grad3 = ctx.createLinearGradient(0, 0, 0, h)
            grad3.addColorStop(0, 'rgba(0, 200, 255, 0.4)')
            grad3.addColorStop(0.5, 'rgba(20, 60, 120, 0.2)')
            grad3.addColorStop(1, 'rgba(0, 0, 0, 0)')
            ctx.fillStyle = grad3
            ctx.fill()
            ctx.restore()

            animFrame = requestAnimationFrame(draw)
        }
        draw(0)

        return () => {
            cancelAnimationFrame(animFrame)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

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
        <section id="stats" className="relative w-full bg-[#000000] py-32 px-6 lg:px-8 overflow-hidden">
            {/* Animated Aurora Background */}
            <AuroraBackground />

            {/* Floating star particles (CSS) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white animate-pulse"
                        style={{
                            width: `${Math.random() * 2 + 1}px`,
                            height: `${Math.random() * 2 + 1}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.4 + 0.1,
                            animationDuration: `${Math.random() * 3 + 2}s`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Section header */}
                <motion.div
                    className="mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-[#2962FF] text-sm font-bold uppercase tracking-[0.2em] mb-4 block">
                        Mission Control
                    </span>
                    <h2 className="text-[36px] md:text-[60px] font-extrabold tracking-tight text-white leading-[1.05] max-w-[700px]">
                        Built for traders who refuse to{' '}
                        <span className="bg-gradient-to-r from-[#2962FF] to-[#7E22CE] bg-clip-text text-transparent">
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
