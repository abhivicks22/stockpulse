'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

function SpaceAtmosphere() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animFrame: number
        const particles: { x: number; y: number; size: number; speedY: number; opacity: number }[] = []

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        // Create slow rising "embers" or distant stars
        for (let i = 0; i < 100; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5,
                speedY: (Math.random() * 0.2) + 0.05,
                opacity: Math.random() * 0.5,
            })
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Atmospheric gradient at the top (like an aurora or orbital glow)
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.6)
            gradient.addColorStop(0, 'rgba(41, 10, 89, 0.4)') // Deep purple
            gradient.addColorStop(0.5, 'rgba(20, 40, 100, 0.2)') // Deep blue
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Draw particles
            particles.forEach((p) => {
                p.y -= p.speedY
                if (p.y < 0) {
                    p.y = canvas.height
                    p.x = Math.random() * canvas.width
                }
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

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
}

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
})

export default function Hero() {
    return (
        <section className="relative min-h-[100vh] flex flex-col justify-center bg-[#000000] overflow-hidden pt-20">
            {/* Atmospheric Background Subagent Extraction */}
            <SpaceAtmosphere />

            {/* Tree silhouette overlay (simulating looking up from earth) */}
            <div
                className="absolute bottom-0 left-0 right-0 h-[40vh] bg-contain bg-bottom bg-repeat-x opacity-40 mix-blend-screen pointer-events-none z-0"
                style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\' preserveAspectRatio=\'none\'%3E%3Cpath d=\'M0,100 L0,70 L5,60 L10,80 L15,40 L20,70 L25,30 L35,80 L40,50 L45,90 L50,60 L55,80 L60,40 L65,70 L70,50 L75,80 L80,20 L85,70 L95,40 L100,80 L100,100 Z\' fill=\'%23000000\' opacity=\'0.8\'/%3E%3C/svg%3E")',
                    filter: 'blur(2px)'
                }}
            />

            {/* Content Container - Left Aligned Cinematic */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-start justify-center h-full pb-20 mt-[10vh]">

                {/* Massive Heading */}
                <motion.h1
                    className="text-[50px] sm:text-[70px] md:text-[90px] lg:text-[110px] font-extrabold tracking-[-0.03em] leading-[0.9] text-white max-w-[1000px] mb-8"
                    {...fadeUp(0.1)}
                >
                    By all accounts, this isn&apos;t the obvious choice for a trading platform.
                </motion.h1>

                {/* Sub-heading with TV Accent Blue */}
                <motion.h2
                    className="text-[40px] md:text-[60px] font-medium tracking-tight text-[#2962FF] mb-12"
                    {...fadeUp(0.3)}
                >
                    But what sets it apart?
                </motion.h2>

                {/* Features Checkmarks */}
                <motion.div className="flex flex-col gap-5 mb-14" {...fadeUp(0.5)}>
                    {[
                        'Professional-grade charting engine built for precision',
                        'Real-time AI sentiment analysis on every ticker',
                        'The right environment and the exact tools you need'
                    ].map((text, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <svg className="w-8 h-8 text-[#2962FF] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span className="text-xl md:text-2xl font-medium text-white">{text}</span>
                        </div>
                    ))}
                </motion.div>

                {/* Primary CTA */}
                <motion.div {...fadeUp(0.7)}>
                    <Link href="/sign-in">
                        <button className="bg-gradient-to-r from-[#1848FF] to-[#7E22CE] text-white text-xl font-bold px-10 py-5 rounded-lg transition-transform hover:scale-105 shadow-[0_0_30px_rgba(24,72,255,0.3)]">
                            Launch platform
                        </button>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
