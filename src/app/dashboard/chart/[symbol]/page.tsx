import { notFound } from 'next/navigation'
import { generateMockOHLCV, getMockQuote, POPULAR_SYMBOLS } from '@/lib/mock-data'
import ChartContainer from '@/components/charts/ChartContainer'
import { TrendingUp, TrendingDown } from 'lucide-react'
import SentimentBadge from '@/components/dashboard/SentimentBadge'

export default async function ChartPage({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = await params
    const upperSymbol = symbol.toUpperCase()

    // Fetch OHLCV + quote
    let chartData = generateMockOHLCV(upperSymbol, 365)
    let quote = getMockQuote(upperSymbol)

    try {
        const [dataRes, quoteRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/stocks/${upperSymbol}?range=1y`, { next: { revalidate: 300 } }),
            fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/stocks?symbols=${upperSymbol}`, { next: { revalidate: 60 } }),
        ])
        if (dataRes.ok) chartData = await dataRes.json()
        if (quoteRes.ok) {
            const q = await quoteRes.json()
            if (q && !Array.isArray(q)) quote = q
        }
    } catch {
        // Use mocks
    }

    const symbolInfo = POPULAR_SYMBOLS.find(s => s.symbol === upperSymbol)

    const stats = [
        { label: 'Open', value: `$${chartData[chartData.length - 1]?.open.toLocaleString() ?? '-'}` },
        { label: 'High', value: `$${quote.high.toLocaleString()}` },
        { label: 'Low', value: `$${quote.low.toLocaleString()}` },
        { label: 'Close', value: `$${quote.price.toLocaleString()}` },
        { label: 'Volume', value: quote.volume > 0 ? quote.volume.toLocaleString() : 'N/A' },
        { label: 'Market Cap', value: quote.marketCap ? `$${(quote.marketCap / 1e9).toFixed(1)}B` : 'N/A' },
    ]

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h1 className="text-3xl font-bold text-white">{upperSymbol}</h1>
                        <SentimentBadge symbol={upperSymbol} />
                    </div>
                    <p className="text-zinc-400 text-sm">{symbolInfo?.name ?? upperSymbol}</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-white">${quote.price.toLocaleString()}</p>
                    <div className={`flex items-center justify-end gap-1 text-sm font-medium mt-1 ${quote.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {quote.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)} ({quote.changePercent > 0 ? '+' : ''}{quote.changePercent}%)
                    </div>
                </div>
            </div>

            {/* Chart */}
            <ChartContainer data={chartData} />

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {stats.map(({ label, value }) => (
                    <div key={label} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                        <p className="text-xs text-zinc-500 mb-1">{label}</p>
                        <p className="text-sm font-semibold text-white">{value}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
