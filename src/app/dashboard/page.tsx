import { Skeleton } from '@/components/ui/skeleton'
import { getMockQuote } from '@/lib/mock-data'
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react'

const STAT_SYMBOLS = [
    { symbol: 'AAPL', label: 'Apple Inc.', icon: Activity },
    { symbol: 'TSLA', label: 'Tesla Inc.', icon: DollarSign },
]

export default function DashboardPage() {
    const quotes = STAT_SYMBOLS.map(s => ({ ...s, quote: getMockQuote(s.symbol) }))

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-zinc-500 text-sm mt-1">Welcome back. Here&apos;s your market overview.</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quotes.map(({ symbol, label, quote }) => (
                    <div key={symbol} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4">
                        <p className="text-xs text-zinc-500 mb-1">{label}</p>
                        <p className="text-2xl font-bold text-white">${quote.price.toLocaleString()}</p>
                        <div className={`flex items-center gap-1 mt-1 text-sm font-medium ${quote.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {quote.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                            {quote.changePercent > 0 ? '+' : ''}{quote.changePercent}%
                        </div>
                    </div>
                ))}
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4">
                    <p className="text-xs text-zinc-500 mb-1">Market Status</p>
                    <p className="text-2xl font-bold text-emerald-400">Open</p>
                    <p className="text-xs text-zinc-600 mt-1">NYSE · NASDAQ active</p>
                </div>
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4">
                    <p className="text-xs text-zinc-500 mb-1">Bitcoin</p>
                    <p className="text-2xl font-bold text-white">$67,420</p>
                    <p className="text-sm font-medium text-emerald-400 mt-1">+3.12%</p>
                </div>
            </div>

            {/* Chart placeholder */}
            <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">AAPL — Apple Inc.</h2>
                    <a href="/dashboard/chart/AAPL" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                        Full Chart →
                    </a>
                </div>
                <Skeleton className="h-64 w-full bg-white/[0.03]" />
                <p className="text-center text-zinc-600 text-sm mt-4">Add your API keys to load live charts</p>
            </div>

            {/* Watchlist placeholder */}
            <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Your Watchlist</h2>
                    <a href="/dashboard/watchlist" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                        View All →
                    </a>
                </div>
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full bg-white/[0.03]" />
                    ))}
                </div>
            </div>
        </div>
    )
}
