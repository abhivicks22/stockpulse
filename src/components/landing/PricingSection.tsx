'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, Zap } from 'lucide-react'

export default function PricingSection() {
    return (
        <section id="pricing" className="py-32 relative z-10 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">

            <div className="text-center mb-16 relative w-full h-full flex flex-col items-center">
                <span className="text-purple-500 font-bold uppercase tracking-[0.2em] mb-4 block">The Cost</span>
                <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
                    Zero compromises.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
                        Zero dollars.
                    </span>
                </h2>
                <p className="text-zinc-400 max-w-xl mx-auto text-lg">
                    Traditional legacy brokerages charge you $30/month just for basic Level II order flow.
                    We built StockPulse to give retail traders an institutional edge, completely free forever.
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-lg relative"
            >
                {/* Background immense glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-30 blur-2xl z-0 animate-pulse" />

                {/* The Pricing Card */}
                <div className="relative bg-[#0d1117] border border-white/20 rounded-3xl p-8 md:p-12 z-10 shadow-2xl overflow-hidden backdrop-blur-xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Zap className="w-32 h-32" />
                    </div>

                    <div className="mb-8 relative z-10">
                        <h3 className="text-2xl font-bold text-white mb-2">Pro Trader</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-extrabold text-white">$0</span>
                            <span className="text-zinc-500 font-medium">/ forever</span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-10 relative z-10">
                        {[
                            'Unlimited TradingView charts',
                            'Real-time AI Sentiment ratings',
                            'Fuzzy-search across 10,000+ assets',
                            'No ads. No tracking. No nonsense.',
                        ].map((feature, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                </div>
                                <span className="text-zinc-300 font-medium leading-relaxed">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <Link href="/sign-in" className="block relative z-10 w-full">
                        <button className="w-full bg-white text-black text-lg font-bold py-4 rounded-xl hover:bg-zinc-200 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.15)] flex justify-center items-center gap-2">
                            <Zap className="w-5 h-5" /> Launch your dashboard
                        </button>
                    </Link>
                </div>
            </motion.div>

        </section>
    )
}
