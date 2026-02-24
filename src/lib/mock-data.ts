import { StockHistoryPoint, StockQuote, SearchResult } from '@/types'

const BASE_PRICES: Record<string, number> = {
    AAPL: 190, TSLA: 250, GOOGL: 175, MSFT: 420, AMZN: 185,
    NVDA: 875, META: 510, NFLX: 620, AMD: 165, JPM: 200,
    'BTC-USD': 65000, 'ETH-USD': 3500, 'SOL-USD': 180,
}

function seededRandom(seed: number): () => number {
    let s = seed
    return () => {
        s = (s * 1664525 + 1013904223) & 0xffffffff
        return (s >>> 0) / 0xffffffff
    }
}

export function generateMockOHLCV(symbol: string, days: number = 90): StockHistoryPoint[] {
    const basePrice = BASE_PRICES[symbol] ?? 100
    const rand = seededRandom(symbol.split('').reduce((a, c) => a + c.charCodeAt(0), 0))
    const data: StockHistoryPoint[] = []
    let price = basePrice

    for (let i = days; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        if (date.getDay() === 0 || date.getDay() === 6) continue

        const changePercent = (rand() - 0.48) * 0.04
        const open = price
        price = Math.max(1, price * (1 + changePercent))
        const high = Math.max(open, price) * (1 + rand() * 0.015)
        const low = Math.min(open, price) * (1 - rand() * 0.015)
        const volume = Math.floor(1_000_000 + rand() * 49_000_000)

        data.push({
            time: date.toISOString().split('T')[0],
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(price.toFixed(2)),
            volume,
        })
    }
    return data
}

export function getMockQuote(symbol: string): StockQuote {
    const basePrice = BASE_PRICES[symbol] ?? 100
    const rand = seededRandom(symbol.split('').reduce((a, c) => a + c.charCodeAt(0), 0) + Date.now() % 1000)
    const change = (rand() - 0.5) * basePrice * 0.04
    const price = basePrice + change

    return {
        symbol,
        name: POPULAR_SYMBOLS.find(s => s.symbol === symbol)?.name ?? symbol,
        price: parseFloat(price.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(((change / basePrice) * 100).toFixed(2)),
        high: parseFloat((price * 1.015).toFixed(2)),
        low: parseFloat((price * 0.985).toFixed(2)),
        volume: Math.floor(5_000_000 + rand() * 45_000_000),
        marketCap: Math.floor(price * 1_000_000_000 * (rand() * 10 + 1)),
    }
}

export const POPULAR_SYMBOLS: SearchResult[] = [
    { symbol: 'AAPL', name: 'Apple Inc.', type: 'Stock', region: 'US' },
    { symbol: 'TSLA', name: 'Tesla Inc.', type: 'Stock', region: 'US' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'Stock', region: 'US' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'Stock', region: 'US' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'Stock', region: 'US' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'Stock', region: 'US' },
    { symbol: 'META', name: 'Meta Platforms Inc.', type: 'Stock', region: 'US' },
    { symbol: 'NFLX', name: 'Netflix Inc.', type: 'Stock', region: 'US' },
    { symbol: 'AMD', name: 'Advanced Micro Devices', type: 'Stock', region: 'US' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', type: 'Stock', region: 'US' },
    { symbol: 'BTC-USD', name: 'Bitcoin', type: 'Crypto', region: 'Global' },
    { symbol: 'ETH-USD', name: 'Ethereum', type: 'Crypto', region: 'Global' },
    { symbol: 'SOL-USD', name: 'Solana', type: 'Crypto', region: 'Global' },
]
