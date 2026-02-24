import { NextRequest, NextResponse } from 'next/server'
import { getMockQuote, POPULAR_SYMBOLS } from '@/lib/mock-data'
import { StockQuote } from '@/types'

export const revalidate = 60

export async function GET(request: NextRequest) {
    const symbolsParam = request.nextUrl.searchParams.get('symbols') ?? 'AAPL'
    const symbols = symbolsParam.split(',').map(s => s.trim().toUpperCase())

    const results: StockQuote[] = []

    for (const symbol of symbols) {
        try {
            const apiKey = process.env.FINNHUB_API_KEY
            if (apiKey && apiKey !== 'your_finnhub_key_here') {
                const res = await fetch(
                    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
                    { next: { revalidate: 60 } }
                )
                const data = await res.json()

                if (data.c) {
                    const name = POPULAR_SYMBOLS.find(s => s.symbol === symbol)?.name ?? symbol
                    results.push({
                        symbol,
                        name,
                        price: data.c,
                        change: data.d ?? 0,
                        changePercent: data.dp ?? 0,
                        high: data.h ?? data.c,
                        low: data.l ?? data.c,
                        volume: 0,
                    })
                    continue
                }
            }
        } catch {
            // Fall through to mock
        }
        results.push(getMockQuote(symbol))
    }

    return NextResponse.json(results.length === 1 ? results[0] : results)
}
