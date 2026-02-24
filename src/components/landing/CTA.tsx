'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
    return (
        <section id="cta" className="py-20 md:py-28 px-4 bg-[#0d1117] relative overflow-hidden">
            {/* Indigo glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600 opacity-[0.07] blur-[120px] rounded-full pointer-events-none" />

            <div className="relative max-w-3xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Ready to trade with an edge?
                    </h2>
                    <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">
                        Join thousands using AI-powered market intelligence. Free forever — no credit card needed.
                    </p>
                    <Link href="/sign-in">
                        <Button className="bg-indigo-500 hover:bg-indigo-600 text-white text-lg px-10 py-6 rounded-xl font-semibold shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.5)] transition-all hover:scale-105 focus:ring-2 focus:ring-indigo-500 gap-2">
                            Create Free Account <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                    <p className="text-sm text-zinc-600 mt-6">No credit card • Setup in 30 seconds</p>
                </motion.div>
            </div>
        </section>
    )
}
