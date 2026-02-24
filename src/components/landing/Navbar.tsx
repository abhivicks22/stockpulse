'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Activity, Menu, X } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

const navLinks = [
    { label: 'Markets', href: '#markets' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#cta' },
]

export default function Navbar() {
    const [open, setOpen] = useState(false)

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#131722]/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 focus:ring-2 focus:ring-indigo-500 rounded-lg">
                        <Activity className="w-6 h-6 text-indigo-500" />
                        <span className="font-bold text-xl text-white">StockPulse</span>
                    </Link>

                    {/* Center nav — desktop */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-sm text-zinc-400 hover:text-white transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Right — desktop */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/sign-in" className="text-sm text-zinc-400 hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Link href="/sign-in">
                            <Button className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg transition-all hover:scale-105 focus:ring-2 focus:ring-indigo-500">
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile hamburger */}
                    <div className="md:hidden">
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <button
                                    aria-label="Open menu"
                                    className="text-zinc-400 hover:text-white transition-colors focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
                                >
                                    <Menu className="w-6 h-6" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-[#131722] border-white/10 w-72">
                                <div className="flex flex-col gap-6 pt-8">
                                    <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                                        <Activity className="w-5 h-5 text-indigo-500" />
                                        <span className="font-bold text-lg">StockPulse</span>
                                    </Link>
                                    <div className="flex flex-col gap-4">
                                        {navLinks.map((link) => (
                                            <a
                                                key={link.label}
                                                href={link.href}
                                                onClick={() => setOpen(false)}
                                                className="text-zinc-400 hover:text-white transition-colors py-1"
                                            >
                                                {link.label}
                                            </a>
                                        ))}
                                    </div>
                                    <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                                        <Link href="/sign-in" onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white text-sm">
                                            Sign In
                                        </Link>
                                        <Link href="/sign-in" onClick={() => setOpen(false)}>
                                            <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">
                                                Get Started
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}
