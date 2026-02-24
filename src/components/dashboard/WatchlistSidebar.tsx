'use client'

import { useEffect, useState, useCallback } from 'react'
import { WatchlistItemType, StockQuote } from '@/types'
import { Trash2, Plus, Search, TrendingUp, TrendingDown } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { POPULAR_SYMBOLS } from '@/lib/mock-data'
import SentimentBadge from './SentimentBadge'
import Link from 'next/link'

export default function WatchlistSidebar() {
    const [items, setItems] = useState<WatchlistItemType[]>([])
    const [quotes, setQuotes] = useState<Record<string, StockQuote>>({})
    const [loading, setLoading] = useState(true)
    const [searchQ, setSearchQ] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)
    const [adding, setAdding] = useState<string | null>(null)

    const fetchWatchlist = useCallback(async () => {
        try {
            const res = await fetch('/api/watchlist')
            if (!res.ok) { setLoading(false); return }
            const data: WatchlistItemType[] = await res.json()
            setItems(data)

            if (data.length > 0) {
                const symbols = data.map(i => i.symbol).join(',')
                const qRes = await fetch(`/api/stocks?symbols=${symbols}`)
                const qData = await qRes.json()
                const qMap: Record<string, StockQuote> = {}
                    ; (Array.isArray(qData) ? qData : [qData]).forEach((q: StockQuote) => {
                        qMap[q.symbol] = q
                    })
                setQuotes(qMap)
            }
        } catch {
            // ignore
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchWatchlist() }, [fetchWatchlist])

    const addItem = async (symbol: string, name: string) => {
        setAdding(symbol)
        const tmp: WatchlistItemType = { id: `tmp-${symbol}`, symbol, name, type: 'stock', userId: '', addedAt: new Date().toISOString() }
        setItems(prev => [tmp, ...prev])
        setDialogOpen(false)

        try {
            await fetch('/api/watchlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol, name }),
            })
            fetchWatchlist()
        } catch {
            setItems(prev => prev.filter(i => i.id !== tmp.id))
        } finally {
            setAdding(null)
        }
    }

    const removeItem = async (itemId: string) => {
        setItems(prev => prev.filter(i => i.id !== itemId))
        try {
            await fetch('/api/watchlist', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemId }),
            })
        } catch {
            fetchWatchlist()
        }
    }

    const searched = POPULAR_SYMBOLS.filter(s =>
        s.symbol.toLowerCase().includes(searchQ.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQ.toLowerCase())
    ).filter(s => !items.some(i => i.symbol === s.symbol))

    return (
        <aside className="w-[300px] h-full bg-[#131722] border-l border-[#2A2E39] flex flex-col z-10 shrink-0">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2E39]">
                <span className="text-[#D1D4DC] text-[13px] font-bold">Watchlist</span>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <button className="text-[#A3A6AF] hover:text-[#D1D4DC] transition-colors">
                            <Plus className="w-4 h-4" strokeWidth={2} />
                        </button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1E222D] border-[#2A2E39] text-[#D1D4DC] max-w-sm">
                        <DialogHeader>
                            <DialogTitle className="text-[#D1D4DC] text-[15px]">Add Symbol</DialogTitle>
                        </DialogHeader>
                        <div className="relative mb-2 mt-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3A6AF]" />
                            <Input
                                value={searchQ}
                                onChange={e => setSearchQ(e.target.value)}
                                placeholder="Search..."
                                className="pl-9 bg-[#131722] border-[#2A2E39] text-[#D1D4DC] placeholder:text-[#A3A6AF] focus:border-indigo-500 rounded"
                            />
                        </div>
                        <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                            {searched.slice(0, 10).map(s => (
                                <button
                                    key={s.symbol}
                                    onClick={() => addItem(s.symbol, s.name)}
                                    disabled={adding === s.symbol}
                                    className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-[#2A2E39] transition-colors text-left"
                                >
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-[13px] font-bold text-[#D1D4DC]">{s.symbol}</span>
                                        <span className="text-[11px] text-[#A3A6AF] line-clamp-1">{s.name}</span>
                                    </div>
                                    <Plus className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                </button>
                            ))}
                            {searched.length === 0 && <p className="text-[#A3A6AF] text-[13px] px-3 py-2">No results</p>}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* List Header */}
            <div className="flex items-center px-4 py-1.5 border-b border-[#2A2E39] text-[#A3A6AF] text-[11px] font-medium tracking-wide">
                <div className="flex-1">Symbol</div>
                <div className="w-16 text-right">Last</div>
                <div className="w-16 text-right">Chg%</div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="p-2 space-y-1">
                        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-8 bg-[#2A2E39] rounded" />)}
                    </div>
                ) : items.length === 0 ? (
                    <div className="p-4 text-center mt-10">
                        <p className="text-[#A3A6AF] text-[13px]">Your watchlist is empty.</p>
                        <Button
                            onClick={() => setDialogOpen(true)}
                            variant="outline"
                            className="mt-4 border-[#2A2E39] text-[#D1D4DC] hover:bg-[#2A2E39]"
                            size="sm"
                        >
                            Add Symbol
                        </Button>
                    </div>
                ) : (
                    <div className="py-1">
                        {items.map(item => {
                            const q = quotes[item.symbol]
                            const isPos = q ? q.change >= 0 : true
                            return (
                                <div key={item.id} className="group relative flex items-center px-4 py-1.5 hover:bg-[#2A2E39]/50 transition-colors">
                                    <div className="flex-1 min-w-0 pr-2">
                                        <div className="flex items-center gap-1.5">
                                            <Link href={`/dashboard/chart/${item.symbol}`} className="text-[13px] font-bold text-[#D1D4DC] hover:text-indigo-400 truncate">
                                                {item.symbol}
                                            </Link>
                                            <div className="scale-75 origin-left hidden 2xl:block">
                                                <SentimentBadge symbol={item.symbol} />
                                            </div>
                                        </div>
                                    </div>

                                    {q ? (
                                        <>
                                            <div className={`w-16 text-right text-[13px] font-medium ${isPos ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                                                {q.price.toFixed(2)}
                                            </div>
                                            <div className={`w-16 text-right text-[13px] font-medium ${isPos ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                                                {isPos ? '+' : ''}{q.changePercent}%
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Skeleton className="h-4 w-12 bg-[#2A2E39]" />
                                            <Skeleton className="h-4 w-12 bg-[#2A2E39]" />
                                        </div>
                                    )}

                                    {/* Delete overlay */}
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="absolute right-2 opacity-0 group-hover:opacity-100 bg-[#1E222D] p-1.5 rounded-sm text-[#A3A6AF] hover:text-[#F23645] hover:bg-[#2A2E39] transition-all"
                                        title="Remove"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </aside>
    )
}
