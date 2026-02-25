import { generateMockOHLCV, getMockQuote, POPULAR_SYMBOLS } from '@/lib/mock-data'
import { TrendingUp, TrendingDown } from 'lucide-react'
import SentimentBadge from '@/components/dashboard/SentimentBadge'
import PriceChartWrapper from '@/components/charts/PriceChartWrapper'

export default async function ChartContainer({ symbol }: { symbol: string }) {
    const upperSymbol = symbol.toUpperCase()

    // Fetch OHLCV + quote
    let chartData = generateMockOHLCV(upperSymbol, 365)
    let quote = getMockQuote(upperSymbol)

    try {
        const [dataRes, quoteRes] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/stocks/${upperSymbol}?range=1y`, { next: { revalidate: 300 } }),
            fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/stocks?symbols=${upperSymbol}`, { next: { revalidate: 60 } }),
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

    return (
        <div className="flex flex-col w-full h-full bg-[#131722]">
            {/* Top Stat Bar - TradingView Style */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 py-2 border-b border-[#2A2E39] bg-[#131722] shrink-0 w-full overflow-hidden">
                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-baseline gap-2">
                        <h1 className="text-lg font-black text-[#D1D4DC] tracking-tight">{upperSymbol}</h1>
                        <span className="text-xs text-[#A3A6AF] font-medium hidden sm:block">{symbolInfo?.name ?? upperSymbol}</span>
                    </div>

                    <div className="scale-75 origin-left">
                        <SentimentBadge symbol={upperSymbol} />
                    </div>
                </div>

                <div className="flex-1 hidden sm:block" />

                <div className="flex items-center gap-3 sm:gap-4 text-[12px] sm:text-[13px] font-mono overflow-x-auto whitespace-nowrap scrollbar-hide w-full sm:w-auto pb-1 sm:pb-0 shrink-0">
                    <div className="flex gap-2 shrink-0">
                        <span className="text-[#A3A6AF]">O</span>
                        <span className="text-[#D1D4DC]">{chartData[chartData.length - 1]?.open.toFixed(2) ?? '-'}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-[#A3A6AF]">H</span>
                        <span className="text-[#D1D4DC]">{quote.high.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-[#A3A6AF]">L</span>
                        <span className="text-[#D1D4DC]">{quote.low.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-[#A3A6AF]">C</span>
                        <span className={`font-bold ${quote.change >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                            {quote.price.toFixed(2)}
                        </span>
                    </div>
                    <div className={`flex items-center gap-1 font-bold ${quote.change >= 0 ? 'text-[#089981]' : 'text-[#F23645]'}`}>
                        {quote.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)} ({quote.changePercent > 0 ? '+' : ''}{quote.changePercent}%)
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 w-full min-h-0 relative bg-[#131722]">
                <PriceChartWrapper data={chartData} />
            </div>
        </div>
    )
}
