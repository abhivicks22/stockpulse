'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const stats = [
    { value: 10000, suffix: '+', label: 'Active Traders' },
    { value: 50000, suffix: '+', label: 'Charts Generated' },
    { value: 100, suffix: '+', label: 'Markets Tracked' },
    { value: 99.9, suffix: '%', label: 'Uptime SLA', decimals: 1 },
]

function CountUp({ target, suffix, decimals = 0 }: { target: number; suffix: string; decimals?: number }) {
    const [count, setCount] = useState(0)
    const ref = useRef<HTMLSpanElement>(null)
    const inView = useInView(ref, { once: true })

    useEffect(() => {
        if (!inView) return
        const duration = 1800
        const start = Date.now()
        const tick = () => {
            const elapsed = Date.now() - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(parseFloat((target * eased).toFixed(decimals)))
            if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
    }, [inView, target, decimals])

    return (
        <span ref={ref}>
            {count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
            {suffix}
        </span>
    )
}

export default function SocialProof() {
    return (
        <section className="py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-violet-500/5 to-indigo-500/5" />
            <div className="absolute inset-0 bg-[#0d1117]/60" />
            <div className="relative max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                                <CountUp target={s.value} suffix={s.suffix} decimals={s.decimals} />
                            </p>
                            <p className="text-sm text-zinc-500">{s.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
