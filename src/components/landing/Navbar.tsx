'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Activity, Menu, X } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

const navLinks = [
    { label: 'Markets', href: '#markets' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
]

export default function Navbar() {
    const [open, setOpen] = useState(false)

    return (
        <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent pt-4">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-14">
                    {/* Left: Mobile Menu + Logo */}
                    <div className="flex items-center gap-4">
                        <div className="md:hidden">
                            <Sheet open={open} onOpenChange={setOpen}>
                                <SheetTrigger asChild>
                                    <button aria-label="Open menu" className="text-white hover:text-white/80 transition-colors p-1">
                                        <Menu className="w-6 h-6" />
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="left" className="bg-[#000000] border-white/10 w-72">
                                    <div className="flex flex-col gap-6 pt-12 text-white">
                                        {navLinks.map((link) => (
                                            <a key={link.label} href={link.href} onClick={() => setOpen(false)} className="text-2xl font-bold tracking-tight py-2 hover:text-indigo-400">
                                                {link.label}
                                            </a>
                                        ))}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <Activity className="w-7 h-7 text-white" />
                            <span className="font-extrabold text-2xl tracking-tighter text-white">StockPulse</span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex flex-1 items-center gap-8 ml-8">
                            {navLinks.map((link) => (
                                <a key={link.label} href={link.href} className="text-[15px] font-bold text-white hover:text-white/80 transition-colors tracking-tight">
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right: CTA (TradingView Gradient) */}
                    <div className="flex items-center gap-4">
                        <Link href="/sign-in" className="hidden md:block text-[15px] font-bold text-white hover:text-white/80 transition-colors tracking-tight">
                            Sign In
                        </Link>
                        <Link href="/sign-in">
                            <button className="bg-gradient-to-r from-[#1848FF] to-[#7E22CE] text-white text-[15px] font-bold px-5 py-2.5 rounded-lg transition-transform hover:scale-105 shadow-[0_0_20px_rgba(24,72,255,0.4)]">
                                Get started
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
