'use client'

import { useState, useRef, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { SearchResult } from '@/types'
import { POPULAR_SYMBOLS } from '@/lib/mock-data'

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value)
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])
    return debounced
}

export default function DashboardHeader() {
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
        <header className="sticky top-0 z-30 flex items-center justify-between bg-[#0d1117]/80 backdrop-blur border-b border-white/5 px-6 h-14">
            {/* Search */}
            <div ref={wrapperRef} className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search stocks, crypto..."
                    className="pl-9 bg-white/[0.03] border-white/10 text-white placeholder:text-zinc-600 focus:border-indigo-500/50 h-9 text-sm"
                    aria-label="Search stocks"
                    id="stock-search"
                />
                {open && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#131722] border border-white/10 rounded-lg overflow-hidden shadow-xl z-50">
                        {results.map((r) => (
                            <button
                                key={r.symbol}
                                onClick={() => navigate(r.symbol)}
                                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                            >
                                <div>
                                    <span className="text-sm font-semibold text-white">{r.symbol}</span>
                                    <span className="text-xs text-zinc-500 ml-2">{r.name}</span>
                                </div>
                                <span className="text-xs text-zinc-600 bg-white/5 px-2 py-0.5 rounded">{r.type}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </header>
    )
}
