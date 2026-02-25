'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Activity, User as UserIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { SearchResult } from '@/types'
import { POPULAR_SYMBOLS } from '@/lib/mock-data'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value)
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])
    return debounced
}

export default function TopNav({ user }: { user: User }) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [open, setOpen] = useState(false)
    const debouncedQuery = useDebounce(query, 300)
    const router = useRouter()
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([])
            setOpen(false)
            return
        }
        const q = debouncedQuery.toLowerCase()
        const matched = POPULAR_SYMBOLS.filter(
            (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
        ).slice(0, 6)
        setResults(matched)
        setOpen(matched.length > 0)
    }, [debouncedQuery])

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const navigate = (symbol: string) => {
        setQuery('')
        setOpen(false)
        router.push(`/dashboard/chart/${symbol}`)
    }

    return (
        <header className="h-[46px] w-full bg-[#131722] border-b border-[#2A2E39] flex items-center justify-between px-2 sm:px-4 z-30 shrink-0">
            {/* Left section: Logo + Search */}
            <div className="flex items-center gap-2 sm:gap-6 h-full flex-1">
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-2 pr-2 sm:pr-4 sm:border-r border-[#2A2E39] h-full shrink-0">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    <span className="font-bold text-white text-[15px] hidden sm:block">StockPulse</span>
                </Link>

                {/* Search */}
                <div ref={wrapperRef} className="relative flex-1 max-w-[280px]">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A3A6AF]" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search markets..."
                        className="pl-8 bg-[#1E222D] border-transparent hover:border-[#2A2E39] text-[#D1D4DC] placeholder:text-[#A3A6AF] focus:border-indigo-500/50 h-8 text-[13px] rounded w-full"
                        aria-label="Search markets"
                        id="stock-search"
                    />
                    {open && (
                        <div className="absolute top-[calc(100%+4px)] left-0 w-[280px] sm:w-[400px] max-w-[90vw] bg-[#1E222D] border border-[#2A2E39] rounded-lg shadow-2xl z-50">
                            {results.map((r) => (
                                <button
                                    key={r.symbol}
                                    onClick={() => navigate(r.symbol)}
                                    className="w-full flex items-center justify-between px-3 sm:px-4 py-2 hover:bg-[#2A2E39] transition-colors text-left"
                                >
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-[13px] font-bold text-[#D1D4DC]">{r.symbol}</span>
                                        <span className="text-[11px] text-[#A3A6AF] line-clamp-1">{r.name}</span>
                                    </div>
                                    <span className="text-[10px] text-[#A3A6AF] bg-[#2A2E39] px-1.5 py-0.5 rounded shrink-0">{r.type}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right section: User Menu */}
            <div className="flex items-center gap-2 h-full border-l border-[#2A2E39] pl-4">
                <Link href="/dashboard/settings" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-7 h-7 rounded-sm bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                        <UserIcon className="w-4 h-4" />
                    </div>
                </Link>
            </div>
        </header>
    )
}
