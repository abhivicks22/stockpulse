'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, ArrowDown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animFrame: number
        const particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[] = []

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        for (let i = 0; i < 150; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 0.5 + Math.random() * 1.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: 0.1 + Math.random() * 0.3,
            })
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            particles.forEach((p) => {
                p.x += p.speedX
                p.y += p.speedY
                if (p.x < 0) p.x = canvas.width
                if (p.x > canvas.width) p.x = 0
                if (p.y < 0) p.y = canvas.height
                if (p.y > canvas.height) p.y = 0
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255,255,255,${p.opacity})`
                ctx.fill()
            })
            animFrame = requestAnimationFrame(draw)
        }
        draw()

        return () => {
            cancelAnimationFrame(animFrame)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
})

export default function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#131722] via-[#0d1117] to-black overflow-hidden">
            {/* Layer 1: Particles */}
            <ParticleBackground />

            {/* Layer 2: Grid overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Layer 3: Indigo glow blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-600 opacity-[0.07] blur-[150px] rounded-full pointer-events-none" />

            {/* Layer 4: Orbit rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    className="absolute w-[700px] h-[700px] border border-indigo-500/15 rounded-full"
                    style={{ perspective: 800, rotateX: 70 }}
                    animate={{ rotateZ: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                </motion.div>
                <motion.div
                    className="absolute w-[500px] h-[500px] border border-violet-500/20 rounded-full"
                    style={{ perspective: 800, rotateX: 70 }}
                    animate={{ rotateZ: -360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-violet-400 rounded-full shadow-[0_0_6px_rgba(139,92,246,0.8)]" />
                </motion.div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
                {/* Pill */}
                <motion.div {...fadeUp(0)}>
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
                        🚀 AI-Powered Market Intelligence
                    </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    className="text-3xl sm:text-5xl md:text-6xl lg:text-[80px] font-bold tracking-[-2px] leading-[1.1] text-white mb-6"
                    {...fadeUp(0.1)}
                >
                    Track Markets{' '}
                    <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                        Smarter.
                    </span>
                    <br />
                    Trade with Confidence.
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10"
                    {...fadeUp(0.2)}
                >
                    Real-time charts, AI sentiment analysis, and smart watchlists — everything you need in one powerful dashboard.
                </motion.p>

                {/* Buttons */}
                <motion.div className="flex flex-col sm:flex-row gap-4 mb-10" {...fadeUp(0.3)}>
                    <Link href="/sign-in">
                        <Button className="bg-indigo-500 hover:bg-indigo-600 text-white text-base px-8 py-6 rounded-xl font-semibold shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-all hover:scale-105 focus:ring-2 focus:ring-indigo-500">
                            Get Started — It&apos;s Free
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/5 text-base px-8 py-6 rounded-xl font-semibold transition-all hover:scale-105 bg-transparent"
                    >
                        Watch Demo
                    </Button>
                </motion.div>

                {/* Social proof */}
                <motion.p className="text-sm text-zinc-500" {...fadeUp(0.4)}>
                    No credit card required • Free forever • 10,000+ active traders
                </motion.p>
            </div>

            {/* Scroll chevron */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <ArrowDown className="w-5 h-5" />
            </motion.div>
        </section>
    )
}
