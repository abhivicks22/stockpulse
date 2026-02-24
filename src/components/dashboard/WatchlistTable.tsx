'use client'

import { useEffect, useState, useCallback } from 'react'
import { WatchlistItemType, StockQuote } from '@/types'
import { Trash2, Plus, Search } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import SentimentBadge from './SentimentBadge'
import { POPULAR_SYMBOLS } from '@/lib/mock-data'

export default function WatchlistTable() {
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
        // Optimistic
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

    const removeItem = async (itemId: string, symbol: string) => {
        setItems(prev => prev.filter(i => i.id !== itemId)) // Optimistic
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

    if (loading) return (
        <div className="space-y-3">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14 bg-white/[0.03] rounded-lg" />)}
        </div>
    )

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <span className="text-zinc-400 text-sm">{items.length} stock{items.length !== 1 ? 's' : ''}</span>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600 text-white gap-1.5 h-8 text-xs" id="add-watchlist-btn">
                            <Plus className="w-3.5 h-3.5" /> Add Stock
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#131722] border-white/10 text-white max-w-sm">
                        <DialogHeader>
                            <DialogTitle className="text-white">Add to Watchlist</DialogTitle>
                        </DialogHeader>
                        <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <Input
                                value={searchQ}
                                onChange={e => setSearchQ(e.target.value)}
                                placeholder="Search stocks..."
                                className="pl-9 bg-white/[0.03] border-white/10 text-white placeholder:text-zinc-600"
                                id="watchlist-search"
                            />
                        </div>
                        <div className="space-y-1 max-h-64 overflow-y-auto">
                            {searched.slice(0, 10).map(s => (
                                <button
                                    key={s.symbol}
                                    onClick={() => addItem(s.symbol, s.name)}
                                    disabled={adding === s.symbol}
                                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors text-left"
                                >
                                    <div>
                                        <span className="text-sm font-semibold text-white">{s.symbol}</span>
                                        <span className="text-xs text-zinc-500 ml-2">{s.name}</span>
                                    </div>
                                    <span className="text-xs text-indigo-400">+ Add</span>
                                </button>
                            ))}
                            {searched.length === 0 && <p className="text-zinc-600 text-sm px-3 py-2">No results found</p>}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-zinc-500 mb-3">No stocks yet.</p>
                    <p className="text-zinc-600 text-sm">Add your first stock using the button above!</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {items.map(item => {
                        const q = quotes[item.symbol]
                        return (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] rounded-xl transition-all group">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <a href={`/dashboard/chart/${item.symbol}`} className="text-sm font-bold text-white hover:text-indigo-300 transition-colors">
                                            {item.symbol}
                                        </a>
                                        <p className="text-xs text-zinc-500">{item.name}</p>
                                    </div>
                                    <SentimentBadge symbol={item.symbol} />
                                </div>
                                <div className="flex items-center gap-4">
                                    {q ? (
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-white">${q.price.toLocaleString()}</p>
                                            <div className={`flex items-center justify-end gap-0.5 text-xs font-medium ${q.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {q.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                {q.changePercent > 0 ? '+' : ''}{q.changePercent}%
                                            </div>
                                        </div>
                                    ) : (
                                        <Skeleton className="h-10 w-20 bg-white/[0.03]" />
                                    )}
                                    <button
                                        onClick={() => removeItem(item.id, item.symbol)}
                                        className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all p-1"
                                        aria-label={`Remove ${item.symbol}`}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
